"""Data-model CRUD and schema-versioning tests."""

from __future__ import annotations

import pytest

from sales_engine import db
from sales_engine.agents import crm, discovery


def test_schema_version_is_applied(conn):
    version = db.row(conn, "SELECT MAX(version) AS v FROM schema_version")
    assert version["v"] == 1


def test_migrate_is_idempotent(conn):
    before = db.row(conn, "SELECT MAX(version) AS v FROM schema_version")["v"]
    db.migrate(conn)
    after = db.row(conn, "SELECT MAX(version) AS v FROM schema_version")["v"]
    assert before == after == 1


def test_expected_tables_exist(conn):
    tables = {
        r["name"]
        for r in db.rows(conn, "SELECT name FROM sqlite_master WHERE type = 'table'")
    }
    for expected in (
        "schema_version", "accounts", "contacts", "opportunities", "pipeline_events",
        "outreach_messages", "content_items", "website_notes", "analytics_events",
    ):
        assert expected in tables


def test_account_crud(conn):
    account_id = discovery.add_account(conn, name="Nordlicht Health GmbH", icp="B", is_synthetic=True)
    row = db.row(conn, "SELECT * FROM accounts WHERE id = ?", (account_id,))
    assert row["name"] == "Nordlicht Health GmbH"
    assert row["icp"] == "B"
    assert row["is_synthetic"] == 1
    db.execute(conn, "UPDATE accounts SET revenue_eur = 12000000 WHERE id = ?", (account_id,))
    conn.commit()
    assert db.row(conn, "SELECT revenue_eur FROM accounts WHERE id = ?", (account_id,))["revenue_eur"] == 12_000_000


def test_contact_and_opportunity_crud(conn):
    account_id = discovery.add_account(conn, name="Velaflux Digital B.V.", icp="A")
    contact_id = db.execute(
        conn,
        "INSERT INTO contacts (account_id, name, role, accessibility, is_decision_maker, created_at) "
        "VALUES (?, ?, 'CTO', 3, 1, ?)",
        (account_id, "Maren Voss", db.utc_now_iso()),
    )
    conn.commit()
    opp_id = crm.create_opportunity(
        conn, account_id=account_id, title="Velaflux — mandate",
        engagement="mandate", problem_trigger="Six AI initiatives, no coherent strategy.",
        expected_monthly_value_eur=25_000, contact_id=contact_id,
    )
    opp = db.row(conn, "SELECT * FROM opportunities WHERE id = ?", (opp_id,))
    assert opp["account_id"] == account_id
    assert opp["stage"] == "identified"
    assert opp["icp"] == "A"  # inherited from account
    assert opp["probability"] == pytest.approx(0.05)


def test_foreign_key_cascade_deletes_children(conn):
    account_id = discovery.add_account(conn, name="Cascade Test AG", icp="A")
    crm.create_opportunity(conn, account_id=account_id, title="opp")
    db.execute(conn, "DELETE FROM accounts WHERE id = ?", (account_id,))
    conn.commit()
    assert db.row(conn, "SELECT COUNT(*) AS n FROM opportunities")["n"] == 0
    assert db.row(conn, "SELECT COUNT(*) AS n FROM contacts")["n"] == 0


def test_not_null_and_unique_constraints(conn):
    with pytest.raises(Exception):
        db.execute(conn, "INSERT INTO accounts (name) VALUES (NULL)")
        conn.commit()


def test_invalid_icp_rejected(conn):
    with pytest.raises(ValueError):
        discovery.add_account(conn, name="Bad ICP GmbH", icp="Z")
