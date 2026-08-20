"""CRM pipeline-transition and activity-log tests."""

from __future__ import annotations

import pytest

from sales_engine import db
from sales_engine.agents import crm, discovery


@pytest.fixture
def opp_id(conn) -> int:
    account_id = discovery.add_account(conn, name="Pipeline Test GmbH", icp="A")
    return crm.create_opportunity(
        conn, account_id=account_id, title="Pipeline Test opp",
        engagement="fractional_caio_2d", expected_monthly_value_eur=14_000,
    )


def test_forward_transitions_are_allowed(conn, opp_id):
    for stage in ("researched", "contacted", "engaged", "discovery", "qualified", "proposal"):
        opp = crm.move_stage(conn, opp_id, stage, note=f"to {stage}")
        assert opp["stage"] == stage


def test_backward_transition_raises(conn, opp_id):
    crm.move_stage(conn, opp_id, "qualified")
    with pytest.raises(crm.PipelineError):
        crm.move_stage(conn, opp_id, "contacted")


def test_same_stage_is_noop(conn, opp_id):
    opp = crm.move_stage(conn, opp_id, "identified")
    assert opp["stage"] == "identified"


def test_won_is_terminal(conn, opp_id):
    opp = crm.mark_won(conn, opp_id, "Signed mandate")
    assert opp["stage"] == "won"
    assert opp["probability"] == 1.0
    with pytest.raises(crm.PipelineError):
        crm.move_stage(conn, opp_id, "identified")


def test_lost_is_terminal(conn, opp_id):
    opp = crm.mark_lost(conn, opp_id, "Deferred")
    assert opp["stage"] == "lost"
    with pytest.raises(crm.PipelineError):
        crm.move_stage(conn, opp_id, "proposal")


def test_transition_records_pipeline_event(conn, opp_id):
    crm.move_stage(conn, opp_id, "contacted", note="cold email sent")
    events = crm.timeline(conn, opp_id)
    assert len(events) == 2  # creation + transition
    assert events[1]["from_stage"] == "identified"
    assert events[1]["to_stage"] == "contacted"
    assert events[1]["note"] == "cold email sent"


def test_activity_log(conn, opp_id):
    event_id = crm.log_activity(conn, opp_id, "Discovery call went well")
    events = crm.timeline(conn, opp_id)
    assert event_id == events[-1]["id"]
    assert events[-1]["note"] == "Discovery call went well"
    assert events[-1]["from_stage"] == events[-1]["to_stage"] == "identified"


def test_create_records_creation_event(conn, opp_id):
    events = crm.timeline(conn, opp_id)
    assert events[0]["from_stage"] is None
    assert events[0]["to_stage"] == "identified"


def test_unknown_stage_rejected_on_create(conn):
    account_id = discovery.add_account(conn, name="Bad Stage GmbH", icp="A")
    with pytest.raises(ValueError):
        crm.create_opportunity(conn, account_id=account_id, title="x", stage="nope")


def test_unknown_engagement_rejected(conn):
    account_id = discovery.add_account(conn, name="Bad Offer GmbH", icp="A")
    with pytest.raises(ValueError):
        crm.create_opportunity(conn, account_id=account_id, title="x", engagement="hourly_consulting")


def test_missing_opportunity_raises(conn):
    with pytest.raises(ValueError):
        crm.move_stage(conn, 9999, "engaged")
    with pytest.raises(ValueError):
        crm.log_activity(conn, 9999, "note")
