"""SQLite schema, versioned. Migration 1 creates all tables."""

from __future__ import annotations

SCHEMA_VERSION = 1

SCHEMA_VERSION_SQL = """
CREATE TABLE IF NOT EXISTS schema_version (
    version     INTEGER PRIMARY KEY,
    applied_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
"""

SCHEMA_SQL = """
CREATE TABLE accounts (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    name                   TEXT NOT NULL,
    domain                 TEXT,
    industry               TEXT,
    country                TEXT,
    region                 TEXT,
    employee_count         INTEGER,
    revenue_eur            INTEGER,
    engineering_capability INTEGER NOT NULL DEFAULT 0,
    ai_maturity            INTEGER NOT NULL DEFAULT 0,
    icp                    TEXT,
    source                 TEXT,
    url                    TEXT,
    notes                  TEXT,
    is_synthetic           INTEGER NOT NULL DEFAULT 1,
    created_at             TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at             TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
CREATE INDEX idx_accounts_icp    ON accounts(icp);
CREATE INDEX idx_accounts_source ON accounts(source);

CREATE TABLE contacts (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id       INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    name             TEXT NOT NULL,
    title            TEXT,
    role             TEXT,
    email            TEXT,
    linkedin_url     TEXT,
    accessibility    INTEGER NOT NULL DEFAULT 2,
    is_decision_maker INTEGER NOT NULL DEFAULT 0,
    created_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
CREATE INDEX idx_contacts_account ON contacts(account_id);

CREATE TABLE opportunities (
    id                        INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id                INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    title                     TEXT NOT NULL,
    stage                     TEXT NOT NULL DEFAULT 'identified',
    icp                       TEXT,
    engagement                TEXT,
    problem_trigger           TEXT,
    decision_maker            TEXT,
    contact_id                INTEGER REFERENCES contacts(id),
    source                    TEXT,
    expected_monthly_value_eur INTEGER,
    probability               REAL NOT NULL DEFAULT 0.05,
    urgency                   INTEGER NOT NULL DEFAULT 1,
    budget_status             TEXT NOT NULL DEFAULT 'unknown',
    score                     INTEGER,
    score_reason              TEXT,
    won_reason                TEXT,
    lost_reason               TEXT,
    created_at                TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at                TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
CREATE INDEX idx_opportunities_account ON opportunities(account_id);
CREATE INDEX idx_opportunities_stage   ON opportunities(stage);
CREATE INDEX idx_opportunities_icp     ON opportunities(icp);

CREATE TABLE pipeline_events (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    opportunity_id INTEGER NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    from_stage     TEXT,
    to_stage       TEXT NOT NULL,
    note           TEXT,
    created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
CREATE INDEX idx_pipeline_events_opp ON pipeline_events(opportunity_id);
CREATE INDEX idx_pipeline_events_ts  ON pipeline_events(created_at);

CREATE TABLE outreach_messages (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    opportunity_id INTEGER NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    contact_id     INTEGER REFERENCES contacts(id),
    channel        TEXT NOT NULL,
    subject        TEXT,
    body           TEXT NOT NULL,
    engine         TEXT NOT NULL,
    created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
CREATE INDEX idx_outreach_opp ON outreach_messages(opportunity_id);

CREATE TABLE content_items (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    content_type TEXT NOT NULL,
    icp          TEXT,
    trigger      TEXT,
    keywords     TEXT,
    status       TEXT NOT NULL DEFAULT 'draft',
    created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE website_notes (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    section      TEXT NOT NULL,
    title        TEXT NOT NULL,
    note         TEXT NOT NULL,
    funnel_stage TEXT,
    created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE analytics_events (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type     TEXT NOT NULL,
    account_id     INTEGER REFERENCES accounts(id),
    opportunity_id INTEGER REFERENCES opportunities(id),
    occurred_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    note           TEXT
);
CREATE INDEX idx_analytics_type_ts ON analytics_events(event_type, occurred_at);
"""

MIGRATIONS: list[tuple[int, str]] = [(1, SCHEMA_SQL)]
