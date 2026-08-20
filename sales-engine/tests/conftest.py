"""Shared fixtures: each test gets an isolated SQLite database in tmp_path."""

from __future__ import annotations

import sqlite3

import pytest

from sales_engine import db, seed


@pytest.fixture
def conn(tmp_path) -> sqlite3.Connection:
    database = db.init_db(str(tmp_path / "test.db"))
    yield database
    database.close()


@pytest.fixture
def seeded_conn(tmp_path) -> sqlite3.Connection:
    database = db.init_db(str(tmp_path / "seeded.db"))
    seed.seed_data(database, seed=42)
    yield database
    database.close()


def account(name: str = "TestCo GmbH", **overrides: object) -> dict[str, object]:
    base = {
        "name": name,
        "domain": "testco.example",
        "industry": "software",
        "region": "EU",
        "employee_count": 200,
        "revenue_eur": 50_000_000,
        "engineering_capability": 1,
        "ai_maturity": 1,
        "icp": "A",
        "source": "other",
    }
    base.update(overrides)
    return base


def opportunity(**overrides: object) -> dict[str, object]:
    base = {
        "stage": "discovery",
        "icp": "A",
        "engagement": "fractional_caio_2d",
        "problem_trigger": "Six AI initiatives, no coherent strategy.",
        "expected_monthly_value_eur": 15_000,
        "urgency": 3,
        "budget_status": "approved",
    }
    base.update(overrides)
    return base


def contact(accessibility: int = 3, is_dm: bool = True) -> dict[str, object]:
    return {
        "name": "Anna Testperson",
        "accessibility": accessibility,
        "is_decision_maker": int(is_dm),
    }
