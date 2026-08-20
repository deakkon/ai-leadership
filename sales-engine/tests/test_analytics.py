"""Analytics funnel math and target-vs-actual tests."""

from __future__ import annotations

import pytest

from sales_engine import db
from sales_engine.agents import analytics, crm, discovery

NOW = "2026-08-20T12:00:00Z"
VALUES = {"engaged": 10_000, "qualified": 15_000, "won": 30_000, "identified": 5_000}


def _seed_funnel_fixture(conn) -> dict[str, int]:
    """Accounts + opportunities at controlled stages with explicit event times."""
    ids: dict[str, int] = {}
    # (label, stage moves, ...); stage moves land 1 day ago so creation
    # events (which are at NOW) do not pollute windowed counts.
    targets = (
        ("engaged", ("engaged",)),
        ("qualified", ("qualified",)),
        ("won", ("proposal", "won")),
        ("identified", ()),
    )
    for label, moves in targets:
        account_id = discovery.add_account(conn, name=f"{label} GmbH", icp="A")
        opp_id = crm.create_opportunity(
            conn, account_id=account_id, title=label, engagement="mandate",
            expected_monthly_value_eur=VALUES[label], now=NOW,
        )
        ids[label] = opp_id
        at = db.iso_offset(-1, from_iso=NOW)
        for stage in moves:
            crm.move_stage(conn, opp_id, stage, note="move", now=at)
    for day in (0, -1, -5):
        db.execute(
            conn,
            "INSERT INTO analytics_events (event_type, occurred_at) VALUES ('visit', ?)",
            (db.iso_offset(day, from_iso=NOW),),
        )
    conn.commit()
    return ids


def test_funnel_snapshot_counts(conn):
    _seed_funnel_fixture(conn)
    counts = analytics.funnel(conn)
    assert counts == {"visitor": 3, "lead": 4, "conversation": 3, "qualified": 2, "proposal": 1, "won": 1}


def test_conversion_rates_math(conn):
    _seed_funnel_fixture(conn)
    rates = analytics.conversion_rates(analytics.funnel(conn))
    assert rates["visitor->lead"] == pytest.approx(4 / 3)
    assert rates["lead->conversation"] == pytest.approx(3 / 4)
    assert rates["conversation->qualified"] == pytest.approx(2 / 3)
    assert rates["qualified->proposal"] == pytest.approx(1 / 2)
    assert rates["proposal->won"] == pytest.approx(1 / 1)


def test_pipeline_value_weighted_math(conn):
    _seed_funnel_fixture(conn)
    pv = analytics.pipeline_value(conn)
    # open opps: engaged 10k * 0.25, qualified 15k * 0.5, identified 5k * 0.05
    assert pv["total_raw"] == 30_000
    assert pv["total_weighted"] == pytest.approx(10_000 * 0.25 + 15_000 * 0.5 + 5_000 * 0.05)
    assert pv["by_stage"]["qualified"]["raw"] == 15_000


def test_target_vs_actual_windows(conn):
    _seed_funnel_fixture(conn)
    tva = analytics.target_vs_actual(conn, now=NOW)
    weekly = tva["weekly"]
    assert weekly["accounts"]["actual"] == 4
    assert weekly["conversations"]["actual"] == 3
    assert weekly["qualified"]["actual"] == 2
    monthly = tva["monthly"]
    assert monthly["proposals"]["actual"] == 1
    assert monthly["wins"]["actual"] == 1


def test_stale_events_outside_window_excluded(conn):
    ids = _seed_funnel_fixture(conn)
    # A stale win outside the 30-day window must not count.
    db.execute(
        conn,
        "INSERT INTO pipeline_events (opportunity_id, from_stage, to_stage, note, created_at) "
        "VALUES (?, 'proposal', 'won', 'old win', ?)",
        (ids["won"], db.iso_offset(-60, from_iso=NOW)),
    )
    conn.commit()
    tva = analytics.target_vs_actual(conn, now=NOW)
    assert tva["monthly"]["wins"]["actual"] == 1


def test_render_report_contains_key_sections(conn):
    _seed_funnel_fixture(conn)
    report = analytics.render_report(conn, now=NOW, llm_status="offline template")
    for section in ("ANALYTICS REPORT", "FUNNEL", "PIPELINE VALUE", "TARGET VS ACTUAL", "LEADS BY ICP"):
        assert section in report
