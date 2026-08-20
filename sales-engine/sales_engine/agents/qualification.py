"""Qualification Agent: scores leads against the ICPs and persists the result."""

from __future__ import annotations

import sqlite3

from sales_engine import db, scoring

TERMINAL = ("won", "lost")


def qualify_opportunity(conn: sqlite3.Connection, opportunity_id: int) -> tuple[int, str, list[str]]:
    """Score one opportunity, persist score + reasons, return (score, bucket, reasons)."""
    opp = db.row(conn, "SELECT * FROM opportunities WHERE id = ?", (opportunity_id,))
    if opp is None:
        raise ValueError(f"no opportunity with id {opportunity_id}")
    account = db.row(conn, "SELECT * FROM accounts WHERE id = ?", (opp["account_id"],))
    if account is None:  # pragma: no cover - FK constraint prevents this
        raise ValueError(f"no account with id {opp['account_id']}")
    contacts = db.rows(conn, "SELECT * FROM contacts WHERE account_id = ?", (account["id"],))
    score, bucket, reasons = scoring.score_opportunity(account, opp, contacts)
    db.execute(
        conn,
        "UPDATE opportunities SET score = ?, score_reason = ? WHERE id = ?",
        (score, "; ".join(reasons), opportunity_id),
    )
    conn.commit()
    return score, bucket, reasons


def qualify_open(conn: sqlite3.Connection, account_id: int | None = None) -> list[sqlite3.Row]:
    """Score every open opportunity (optionally one account's) and return ranked rows."""
    sql = "SELECT id FROM opportunities WHERE stage NOT IN ('won', 'lost')"
    params: tuple[object, ...] = ()
    if account_id is not None:
        sql += " AND account_id = ?"
        params = (account_id,)
    for opp in db.rows(conn, sql, params):
        qualify_opportunity(conn, opp["id"])
    ranked_sql = """
        SELECT o.*, a.name AS account_name
        FROM opportunities o
        JOIN accounts a ON a.id = o.account_id
        WHERE o.stage NOT IN ('won', 'lost')
    """
    ranked_params: tuple[object, ...] = ()
    if account_id is not None:
        ranked_sql += " AND o.account_id = ?"
        ranked_params = (account_id,)
    ranked_sql += " ORDER BY o.score DESC"
    return db.rows(conn, ranked_sql, ranked_params)
