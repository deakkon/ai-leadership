"""CRM Agent: pipeline state transitions, opportunity fields, activity log."""

from __future__ import annotations

import sqlite3

from sales_engine import db, domain


class PipelineError(ValueError):
    """Raised for illegal pipeline transitions."""


def create_opportunity(
    conn: sqlite3.Connection,
    *,
    account_id: int,
    title: str,
    icp: str | None = None,
    stage: str = "identified",
    engagement: str | None = None,
    problem_trigger: str | None = None,
    decision_maker: str | None = None,
    contact_id: int | None = None,
    source: str | None = None,
    expected_monthly_value_eur: int | None = None,
    urgency: int = 1,
    budget_status: str = "unknown",
    now: str | None = None,
) -> int:
    if stage not in domain.STAGES:
        raise ValueError(f"unknown stage: {stage}")
    if engagement is not None and engagement not in domain.OFFERS:
        raise ValueError(f"unknown engagement: {engagement}")
    account = db.row(conn, "SELECT * FROM accounts WHERE id = ?", (account_id,))
    if account is None:
        raise ValueError(f"no account with id {account_id}")
    icp = icp or account["icp"]
    timestamp = now or db.utc_now_iso()
    probability = domain.PROBABILITY_BY_STAGE.get(stage, 0.05)
    opp_id = db.execute(
        conn,
        """
        INSERT INTO opportunities (
            account_id, title, stage, icp, engagement, problem_trigger,
            decision_maker, contact_id, source, expected_monthly_value_eur,
            probability, urgency, budget_status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            account_id, title, stage, icp, engagement, problem_trigger,
            decision_maker, contact_id, source, expected_monthly_value_eur,
            probability, urgency, budget_status, timestamp, timestamp,
        ),
    )
    db.execute(
        conn,
        "INSERT INTO pipeline_events (opportunity_id, from_stage, to_stage, note, created_at) "
        "VALUES (?, NULL, ?, ?, ?)",
        (opp_id, stage, "Opportunity created", timestamp),
    )
    conn.commit()
    return opp_id


def _validate_transition(current: str, target: str) -> None:
    if current in domain.TERMINAL_STAGES:
        raise PipelineError(f"{current!r} is terminal; reopen support is not implemented in v1")
    if target in domain.TERMINAL_STAGES:
        return  # won/lost are reachable from any open stage
    if target not in domain.LINEAR_STAGES:
        raise PipelineError(f"unknown stage: {target}")
    if domain.STAGE_ORDER[target] < domain.STAGE_ORDER[current]:
        raise PipelineError(
            f"cannot move backward from {current!r} to {target!r}; "
            "only forward transitions are allowed"
        )


def move_stage(
    conn: sqlite3.Connection,
    opportunity_id: int,
    target: str,
    *,
    note: str = "",
    now: str | None = None,
) -> sqlite3.Row:
    """Transition an opportunity to a new stage, recording a pipeline event."""
    opp = db.row(conn, "SELECT * FROM opportunities WHERE id = ?", (opportunity_id,))
    if opp is None:
        raise ValueError(f"no opportunity with id {opportunity_id}")
    current = str(opp["stage"])
    _validate_transition(current, target)
    if current == target:
        return opp
    timestamp = now or db.utc_now_iso()
    probability = domain.PROBABILITY_BY_STAGE.get(target, 0.05)
    db.execute(
        conn,
        "UPDATE opportunities SET stage = ?, probability = ?, updated_at = ? WHERE id = ?",
        (target, probability, timestamp, opportunity_id),
    )
    db.execute(
        conn,
        "INSERT INTO pipeline_events (opportunity_id, from_stage, to_stage, note, created_at) "
        "VALUES (?, ?, ?, ?, ?)",
        (opportunity_id, current, target, note, timestamp),
    )
    conn.commit()
    return db.row(conn, "SELECT * FROM opportunities WHERE id = ?", (opportunity_id,))  # type: ignore[return-value]


def mark_won(
    conn: sqlite3.Connection,
    opportunity_id: int,
    reason: str,
    *,
    now: str | None = None,
) -> sqlite3.Row:
    return move_stage(conn, opportunity_id, "won", note=f"Won: {reason}", now=now)


def mark_lost(
    conn: sqlite3.Connection,
    opportunity_id: int,
    reason: str,
    *,
    now: str | None = None,
) -> sqlite3.Row:
    return move_stage(conn, opportunity_id, "lost", note=f"Lost: {reason}", now=now)


def log_activity(
    conn: sqlite3.Connection,
    opportunity_id: int,
    note: str,
    *,
    now: str | None = None,
) -> int:
    """Append a free-form activity entry to the opportunity's event log."""
    opp = db.row(conn, "SELECT * FROM opportunities WHERE id = ?", (opportunity_id,))
    if opp is None:
        raise ValueError(f"no opportunity with id {opportunity_id}")
    timestamp = now or db.utc_now_iso()
    event_id = db.execute(
        conn,
        "INSERT INTO pipeline_events (opportunity_id, from_stage, to_stage, note, created_at) "
        "VALUES (?, ?, ?, ?, ?)",
        (opportunity_id, opp["stage"], opp["stage"], note, timestamp),
    )
    conn.commit()
    return event_id


def timeline(conn: sqlite3.Connection, opportunity_id: int) -> list[sqlite3.Row]:
    return db.rows(
        conn,
        "SELECT * FROM pipeline_events WHERE opportunity_id = ? ORDER BY id",
        (opportunity_id,),
    )


def get_opportunity(conn: sqlite3.Connection, opportunity_id: int) -> sqlite3.Row | None:
    return db.row(
        conn,
        "SELECT o.*, a.name AS account_name FROM opportunities o "
        "JOIN accounts a ON a.id = o.account_id WHERE o.id = ?",
        (opportunity_id,),
    )
