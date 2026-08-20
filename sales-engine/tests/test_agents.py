"""Agent behavior tests: discovery providers, research, outreach, content, website, seed."""

from __future__ import annotations

import csv
import os

import pytest

from sales_engine import db, domain
from sales_engine.agents import content as content_agent
from sales_engine.agents import discovery as discovery_agent
from sales_engine.agents import outreach as outreach_agent
from sales_engine.agents import qualification as qualification_agent
from sales_engine.agents import research as research_agent
from sales_engine.agents import website as website_agent
from sales_engine.seed import seed_data


def test_mock_provider_is_deterministic_and_marked_synthetic():
    first = discovery_agent.MockLeadProvider(seed=7).fetch(icp="B", limit=5)
    second = discovery_agent.MockLeadProvider(seed=7).fetch(icp="B", limit=5)
    assert first == second
    assert len(first) == 5
    row = first[0]
    for key in ("name", "industry", "country", "employee_count", "revenue_eur", "icp"):
        assert key in row
    assert row["icp"] == "B"


def test_discover_imports_mock_accounts(conn):
    imported, note = discovery_agent.discover(
        conn, discovery_agent.MockLeadProvider(), icp="A", limit=4
    )
    assert imported == 4
    rows = db.rows(conn, "SELECT * FROM accounts")
    assert len(rows) == 4
    assert all(row["is_synthetic"] == 1 for row in rows)


def test_csv_provider_import(tmp_path, conn):
    path = tmp_path / "leads.csv"
    with open(path, "w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=["name", "industry", "country", "employees", "revenue_eur", "icp", "source"],
        )
        writer.writeheader()
        writer.writerow({
            "name": "Fictional Pharma GmbH", "industry": "healthcare", "country": "DE",
            "employees": "120", "revenue_eur": "40000000", "icp": "B", "source": "referral",
        })
    provider = discovery_agent.CsvLeadProvider(str(path))
    rows = provider.fetch(icp="B", limit=10)
    assert len(rows) == 1
    imported = discovery_agent.import_rows(conn, rows, default_icp="B")
    assert imported == 1
    row = db.row(conn, "SELECT * FROM accounts")
    assert row["employee_count"] == 120
    assert row["icp"] == "B"
    assert row["is_synthetic"] == 0


def test_api_provider_requires_configuration(monkeypatch):
    monkeypatch.delenv(discovery_agent.LEAD_API_URL_ENV, raising=False)
    with pytest.raises(discovery_agent.ProviderError):
        discovery_agent.ApiLeadProvider().fetch(icp="A", limit=5)


def test_qualify_persists_score(conn):
    account_id = discovery_agent.add_account(conn, name="Scorable AG", icp="B", industry="healthcare")
    opp_id = db.execute(
        conn,
        "INSERT INTO opportunities (account_id, title, stage, icp, engagement, problem_trigger, "
        "expected_monthly_value_eur, urgency, budget_status, created_at, updated_at) "
        "VALUES (?, 'opp', 'engaged', 'B', 'mandate', 'Regulatory and clinical validation questions.', "
        "22000, 3, 'allocated', ?, ?)",
        (account_id, db.utc_now_iso(), db.utc_now_iso()),
    )
    conn.commit()
    score, bucket, reasons = qualification_agent.qualify_opportunity(conn, opp_id)
    assert 0 <= score <= 100
    assert bucket in ("hot", "warm", "cold")
    stored = db.row(conn, "SELECT * FROM opportunities WHERE id = ?", (opp_id,))
    assert stored["score"] == score
    assert stored["score_reason"]


def test_research_brief_fields(conn):
    account_id = discovery_agent.add_account(
        conn, name="Briefco Health GmbH", icp="B", industry="healthcare",
        employee_count=300, revenue_eur=60_000_000,
    )
    opp_id = db.execute(
        conn,
        "INSERT INTO opportunities (account_id, title, stage, icp, engagement, problem_trigger, "
        "expected_monthly_value_eur, created_at, updated_at) "
        "VALUES (?, 'brief opp', 'engaged', 'B', 'mandate', "
        "'Regulatory and clinical validation questions.', 24000, ?, ?)",
        (account_id, db.utc_now_iso(), db.utc_now_iso()),
    )
    conn.commit()
    brief = research_agent.build_brief(conn, opp_id)
    assert brief["company"] == "Briefco Health GmbH"
    assert brief["icp"] == "B"
    assert brief["likely_problems"]
    assert brief["suggested_angle"]
    text = research_agent.render_brief_text(brief)
    assert "Briefco Health GmbH" in text
    assert "Likely AI problems" in text


def test_outreach_drafts_and_persists_message(conn):
    account_id = discovery_agent.add_account(
        conn, name="Outreachco GmbH", icp="A", country="DE",
    )
    contact_id = db.execute(
        conn,
        "INSERT INTO contacts (account_id, name, role, accessibility, is_decision_maker, created_at) "
        "VALUES (?, 'Katrin Weber', 'CEO', 3, 1, ?)",
        (account_id, db.utc_now_iso()),
    )
    conn.commit()
    opp_id = db.execute(
        conn,
        "INSERT INTO opportunities (account_id, title, stage, icp, engagement, problem_trigger, "
        "decision_maker, contact_id, expected_monthly_value_eur, created_at, updated_at) "
        "VALUES (?, 'outreach opp', 'contacted', 'A', 'fractional_caio_1d', "
        "'Six AI initiatives, no coherent strategy.', 'Katrin Weber', ?, 8000, ?, ?)",
        (account_id, contact_id, db.utc_now_iso(), db.utc_now_iso()),
    )
    conn.commit()
    message = outreach_agent.draft_message(conn, opp_id, channel="email")
    assert message["engine"] == "template"
    assert message["channel"] == "email"
    assert "Outreachco GmbH" in message["body"]
    assert "Katrin" in message["body"]
    assert message["subject"].startswith("AI leadership for Outreachco GmbH")
    stored = db.row(conn, "SELECT * FROM outreach_messages WHERE id = ?", (message["id"],))
    assert stored["body"] == message["body"]
    assert stored["engine"] == "template"


def test_outreach_llm_path_falls_back(conn, monkeypatch):
    from sales_engine import llm

    monkeypatch.setenv(llm.ENV_BASE_URL, "http://localhost:11434/v1")
    monkeypatch.setenv(llm.ENV_REQUIRE, "0")

    def failing_complete(prompt, *, system=None, max_tokens=700):  # noqa: ARG001
        raise llm.LlmUnavailableError("connection refused")

    monkeypatch.setattr(llm, "complete", failing_complete)
    account_id = discovery_agent.add_account(conn, name="Fallbackco GmbH", icp="A")
    opp_id = db.execute(
        conn,
        "INSERT INTO opportunities (account_id, title, stage, icp, engagement, problem_trigger, "
        "expected_monthly_value_eur, created_at, updated_at) "
        "VALUES (?, 'fallback opp', 'contacted', 'A', 'fractional_caio_1d', "
        "'Six AI initiatives, no coherent strategy.', 8000, ?, ?)",
        (account_id, db.utc_now_iso(), db.utc_now_iso()),
    )
    conn.commit()
    message = outreach_agent.draft_message(conn, opp_id, channel="linkedin", use_llm=True)
    assert message["engine"] == "template"
    assert message["note"]


def test_content_generation_and_listing(conn):
    count = content_agent.generate_content(conn, icp="B")
    assert count == len([r for r in content_agent.CONTENT_MATRIX if r[0] == "B"])
    items = content_agent.list_content(conn, icp="B")
    assert all(item["icp"] == "B" for item in items)
    assert items[0]["content_type"] in domain.CONTENT_TYPES
    assert items[0]["keywords"]


def test_website_notes_generation_and_listing(conn):
    count = website_agent.generate_website_notes(conn)
    assert count == len(website_agent.WEBSITE_NOTES)
    notes = website_agent.list_website_notes(conn)
    sections = {note["section"] for note in notes}
    assert {"offers", "proof", "insights", "lead_magnets", "conversion"} <= sections


def test_seed_is_deterministic(tmp_path):
    def counts(path: str) -> tuple:
        database = db.init_db(path)
        summary = seed_data(database, seed=42)
        database.close()
        return (
            summary["accounts"], summary["contacts"], summary["opportunities"],
            summary["won"], summary["lost"], summary["content_items"], summary["website_notes"],
        )

    assert counts(str(tmp_path / "a.db")) == counts(str(tmp_path / "b.db"))


def test_seed_marks_everything_synthetic(seeded_conn):
    rows = db.rows(seeded_conn, "SELECT is_synthetic FROM accounts")
    assert rows and all(row["is_synthetic"] == 1 for row in rows)
    assert db.row(seeded_conn, "SELECT COUNT(*) AS n FROM opportunities")["n"] == 28
    assert db.row(seeded_conn, "SELECT COUNT(*) AS n FROM content_items")["n"] == len(content_agent.CONTENT_MATRIX)
    assert db.row(seeded_conn, "SELECT COUNT(*) AS n FROM website_notes")["n"] == len(website_agent.WEBSITE_NOTES)


def test_seed_pipeline_has_won_and_lost(seeded_conn):
    stages = db.rows(seeded_conn, "SELECT stage, COUNT(*) AS n FROM opportunities GROUP BY stage")
    by_stage = {row["stage"]: row["n"] for row in stages}
    assert by_stage.get("won", 0) >= 2
    assert by_stage.get("lost", 0) >= 1
    assert by_stage.get("proposal", 0) >= 1
