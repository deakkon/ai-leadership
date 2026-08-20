"""SQLite connection helpers with versioned migrations.

The default database path is `data/sales_engine.db` (relative to the current
working directory), overridable via the SALES_ENGINE_DB environment variable.
"""

from __future__ import annotations

import os
import sqlite3
from datetime import datetime, timedelta, timezone

from sales_engine import schema

DEFAULT_DB_PATH = os.environ.get("SALES_ENGINE_DB", "data/sales_engine.db")

_conn: sqlite3.Connection | None = None


def utc_now_iso() -> str:
    """Current UTC time as an ISO-8601 string, e.g. 2026-08-20T14:00:00Z."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def iso_offset(days: float, *, from_iso: str | None = None) -> str:
    """Return `from_iso` (or now) shifted by `days` (may be negative)."""
    base = from_iso
    if base is None:
        base = utc_now_iso()
    dt = datetime.strptime(base, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
    shifted = dt + timedelta(seconds=int(days * 86_400))
    return shifted.strftime("%Y-%m-%dT%H:%M:%SZ")


def connect(path: str | None = None) -> sqlite3.Connection:
    conn = sqlite3.connect(path or DEFAULT_DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def migrate(conn: sqlite3.Connection) -> None:
    conn.executescript(schema.SCHEMA_VERSION_SQL)
    current = conn.execute("SELECT COALESCE(MAX(version), 0) FROM schema_version").fetchone()[0]
    for version, sql in schema.MIGRATIONS:
        if version > current:
            conn.executescript(sql)
            conn.execute("INSERT INTO schema_version (version) VALUES (?)", (version,))
    conn.commit()


def init_db(path: str | None = None) -> sqlite3.Connection:
    path = path or DEFAULT_DB_PATH
    parent = os.path.dirname(os.path.abspath(path))
    if parent:
        os.makedirs(parent, exist_ok=True)
    conn = connect(path)
    migrate(conn)
    return conn


def get_conn() -> sqlite3.Connection:
    """Lazily-open module-level connection (used by the CLI)."""
    global _conn
    if _conn is None:
        _conn = init_db()
    return _conn


def close_conn() -> None:
    global _conn
    if _conn is not None:
        _conn.close()
        _conn = None


def reset() -> None:
    """Close any cached connection (tests use this to switch databases)."""
    close_conn()


def execute(conn: sqlite3.Connection, sql: str, params: tuple[object, ...] = ()) -> int:
    cur = conn.execute(sql, params)
    return cur.lastrowid  # type: ignore[no-any-return]


def row(conn: sqlite3.Connection, sql: str, params: tuple[object, ...] = ()) -> sqlite3.Row | None:
    return conn.execute(sql, params).fetchone()


def rows(conn: sqlite3.Connection, sql: str, params: tuple[object, ...] = ()) -> list[sqlite3.Row]:
    return conn.execute(sql, params).fetchall()
