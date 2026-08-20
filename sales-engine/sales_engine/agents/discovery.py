"""Lead Discovery Agent: finds/suggests accounts matching ICP A/B/C.

v1 supports three pluggable providers behind a common interface:
- CsvLeadProvider   — import your own account list from a CSV file
- MockLeadProvider  — deterministic synthetic generator for demo/offline use
                     (every generated account is clearly marked synthetic)
- ApiLeadProvider   — live enrichment via SALES_ENGINE_LEAD_API_URL + key; only
                     active when configured, otherwise unavailable offline

External APIs are only ever touched for enrichment and only when configured.
"""

from __future__ import annotations

import csv
import os
import random
import sqlite3
import urllib.request
from typing import Any, Protocol

from sales_engine import db, domain

# --- Providers ---------------------------------------------------------------

LEAD_API_URL_ENV = "SALES_ENGINE_LEAD_API_URL"
LEAD_API_KEY_ENV = "SALES_ENGINE_LEAD_API_KEY"


class LeadProvider(Protocol):
    name: str

    def fetch(self, *, icp: str | None, limit: int) -> list[dict[str, Any]]: ...


class ProviderError(RuntimeError):
    pass


class CsvLeadProvider:
    """Reads candidate accounts from a CSV file.

    Accepts headers: name, domain, industry, country, region, employees,
    revenue_eur, engineering_capability, ai_maturity, icp, source, url, notes.
    """

    def __init__(self, path: str) -> None:
        self.path = path
        self.name = f"csv:{path}"

    def fetch(self, *, icp: str | None, limit: int) -> list[dict[str, Any]]:
        with open(self.path, newline="", encoding="utf-8") as handle:
            reader = csv.DictReader(handle)
            if reader.fieldnames is None:
                raise ProviderError(f"{self.path} has no header row")
            rows = [
                {key.strip().lower().replace(" ", "_"): (value or "").strip() for key, value in raw.items()}
                for raw in reader
            ]
        rows = [r for r in rows if r.get("name")]
        if icp:
            rows = [r for r in rows if not r.get("icp") or r["icp"].upper() == icp]
        return rows[:limit]

    @staticmethod
    def coerce(row: dict[str, Any]) -> dict[str, Any]:
        def to_int(*keys: str) -> int | None:
            for key in keys:
                value = row.get(key)
                if value not in (None, ""):
                    try:
                        return int(float(value))
                    except ValueError:
                        return None
            return None

        def to_bool(*keys: str) -> bool:
            for key in keys:
                value = row.get(key)
                if value not in (None, ""):
                    return str(value).strip().lower() in {"1", "true", "yes", "y"}
            return False

        return {
            "name": row.get("name", "").strip(),
            "domain": row.get("domain") or None,
            "industry": row.get("industry") or None,
            "country": row.get("country") or None,
            "region": row.get("region") or None,
            "employee_count": to_int("employees", "employee_count"),
            "revenue_eur": to_int("revenue_eur", "revenue"),
            "engineering_capability": to_bool("engineering_capability", "engineering"),
            "ai_maturity": to_int("ai_maturity", "maturity") or 0,
            "icp": (row.get("icp") or "").upper() or None,
            "source": row.get("source") or "other",
            "url": row.get("url") or None,
            "notes": row.get("notes") or None,
        }


class MockLeadProvider:
    """Deterministic synthetic account generator (demo/offline mode)."""

    def __init__(self, seed: int = 42) -> None:
        self.seed = seed
        self.name = "mock"

    PREFIXES = (
        "Albedon", "Bellatrix", "Cyanara", "Dunewell", "Ekkora", "Feronis",
        "Gildare", "Halmari", "Ivoria", "Jastrum", "Kelvinar", "Lumira",
        "Metralla", "Noltra", "Oranda", "Pavon", "Querida", "Riveline",
        "Soltara", "Trianka", "Umbrix", "Vedera", "Wynster", "Xanthe",
        "Yseline", "Zorvane",
    )
    SECTOR_WORDS = (
        "Health", "Digital", "Analytics", "Systems", "Labs", "Technologies",
        "Group", "Platforms", "Data", "Mobility", "Ops", "Capital",
    )
    COUNTRY_SUFFIX = {
        "DE": "GmbH", "AT": "GmbH", "CH": "AG", "NL": "B.V.", "UK": "Ltd",
        "SE": "AB", "DK": "A/S", "FI": "Oy", "FR": "SAS", "ES": "S.L.",
        "PL": "Sp. z o.o.", "IE": "Ltd",
    }
    INDUSTRIES = {
        "A": ("software", "saas", "ecommerce", "fintech", "manufacturing", "logistics",
              "proptech", "mobility", "energy", "insurtech"),
        "B": ("healthcare", "healthtech", "medtech", "pharma", "digital_health",
              "clinical_research", "medical_devices"),
        "C": ("software", "manufacturing", "industrials", "healthcare_services",
              "retail", "logistics", "fintech", "services"),
    }
    COUNTRIES = {
        "A": ("DE", "AT", "CH", "NL", "FR", "SE", "DK", "FI", "UK", "ES"),
        "B": ("DE", "UK", "CH", "FR", "NL", "SE", "DK", "IE"),
        "C": ("DE", "UK", "FR", "NL", "SE", "CH", "PL"),
    }

    def fetch(self, *, icp: str | None, limit: int) -> list[dict[str, Any]]:
        icp = (icp or "A").upper()
        if icp not in domain.ICP_TARGETS:
            raise ProviderError(f"unknown ICP: {icp}")
        rng = random.Random(f"{icp}:{self.seed}")
        industries = self.INDUSTRIES[icp]
        countries = self.COUNTRIES[icp]
        employees_lo, employees_hi = domain.ICP_TARGETS[icp]["employees"]
        revenue_lo, revenue_hi = domain.ICP_TARGETS[icp]["revenue_eur"]
        accounts: list[dict[str, Any]] = []
        used_names: set[str] = set()
        for _ in range(limit):
            prefix = rng.choice(self.PREFIXES)
            sector = rng.choice(self.SECTOR_WORDS)
            country = rng.choice(countries)
            suffix = self.COUNTRY_SUFFIX[country]
            name = f"{prefix} {sector} {suffix}"
            while name in used_names:
                prefix = rng.choice(self.PREFIXES)
                name = f"{prefix} {sector} {suffix}"
            used_names.add(name)
            domain_name = (name.lower().replace(" ", "").replace(".", "")
                           .replace("&", "").replace(",", "") + ".example")
            maturity = rng.choices([0, 1, 2, 3, 4], weights=[30, 30, 25, 10, 5])[0]
            accounts.append(
                {
                    "name": name,
                    "domain": domain_name,
                    "industry": rng.choice(industries),
                    "country": country,
                    "region": "EU" if country != "UK" else "UK",
                    "employee_count": rng.randint(employees_lo, employees_hi),
                    "revenue_eur": rng.randint(revenue_lo, revenue_hi),
                    "engineering_capability": bool(rng.choices([1, 0], weights=[85, 15])[0]),
                    "ai_maturity": maturity,
                    "icp": icp,
                    "source": rng.choices(
                        domain.SOURCES,
                        weights=(8, 10, 6, 12, 14, 8, 6, 4, 2, 3, 5, 2),
                    )[0],
                    "url": f"https://{domain_name}",
                    "notes": (
                        "SYNTHETIC DEMO ACCOUNT — not a real company. "
                        f"Matching ICP {icp}: {domain.ICP_TARGETS[icp]['trigger']}"
                    ),
                    "is_synthetic": 1,
                }
            )
        return accounts


class ApiLeadProvider:
    """Live enrichment endpoint (opt-in via SALES_ENGINE_LEAD_API_URL)."""

    def __init__(self) -> None:
        self.name = "api"

    def fetch(self, *, icp: str | None, limit: int) -> list[dict[str, Any]]:
        base = os.environ.get(LEAD_API_URL_ENV)
        if not base:
            raise ProviderError(f"{LEAD_API_URL_ENV} is not set; API enrichment unavailable")
        url = f"{base.rstrip('/')}?icp={icp or ''}&limit={limit}"
        request = urllib.request.Request(url)
        api_key = os.environ.get(LEAD_API_KEY_ENV)
        if api_key:
            request.add_header("Authorization", f"Bearer {api_key}")
        try:
            with urllib.request.urlopen(request, timeout=20) as response:
                import json

                data = json.loads(response.read().decode("utf-8"))
        except Exception as exc:  # network / HTTP / JSON failures
            raise ProviderError(f"API enrichment failed: {exc}") from exc
        if not isinstance(data, list):
            raise ProviderError("API must return a JSON list of account objects")
        return [dict(item) for item in data if isinstance(item, dict) and item.get("name")]


# --- Persistence -------------------------------------------------------------


def add_account(
    conn: sqlite3.Connection,
    *,
    name: str,
    domain_name: str | None = None,
    industry: str | None = None,
    country: str | None = None,
    region: str | None = None,
    employee_count: int | None = None,
    revenue_eur: int | None = None,
    engineering_capability: bool = False,
    ai_maturity: int = 0,
    icp: str | None = None,
    source: str | None = None,
    url: str | None = None,
    notes: str | None = None,
    is_synthetic: bool = True,
) -> int:
    if icp is not None and icp.upper() not in domain.ICP_TARGETS:
        raise ValueError(f"unknown ICP: {icp}")
    timestamp = db.utc_now_iso()
    account_id = db.execute(
        conn,
        """
        INSERT INTO accounts (
            name, domain, industry, country, region, employee_count, revenue_eur,
            engineering_capability, ai_maturity, icp, source, url, notes,
            is_synthetic, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            name, domain_name, industry, country, region, employee_count, revenue_eur,
            int(engineering_capability), ai_maturity,
            (icp or "").upper() or None, source, url, notes, int(is_synthetic),
            timestamp, timestamp,
        ),
    )
    conn.commit()
    return account_id


def import_rows(
    conn: sqlite3.Connection,
    rows: list[dict[str, Any]],
    *,
    default_icp: str | None = None,
    synthetic: bool = False,
) -> int:
    imported = 0
    for raw in rows:
        row = CsvLeadProvider.coerce(raw)
        icp = (row.get("icp") or default_icp or "").upper() or None
        if icp and icp not in domain.ICP_TARGETS:
            raise ValueError(f"unknown ICP in row {row.get('name')!r}: {icp}")
        add_account(
            conn,
            name=row["name"],
            domain_name=row.get("domain"),
            industry=row.get("industry"),
            country=row.get("country"),
            region=row.get("region"),
            employee_count=row.get("employee_count"),
            revenue_eur=row.get("revenue_eur"),
            engineering_capability=bool(row.get("engineering_capability")),
            ai_maturity=int(row.get("ai_maturity") or 0),
            icp=icp,
            source=row.get("source") or "other",
            url=row.get("url"),
            notes=row.get("notes"),
            is_synthetic=synthetic,
        )
        imported += 1
    return imported


def discover(
    conn: sqlite3.Connection,
    provider: LeadProvider,
    *,
    icp: str | None = None,
    limit: int = 10,
) -> tuple[int, str]:
    """Fetch accounts via a provider and import them. Returns (count, note)."""
    rows = provider.fetch(icp=icp, limit=limit)
    synthetic = provider.name == "mock"
    imported = import_rows(conn, rows, default_icp=icp, synthetic=synthetic)
    if synthetic:
        note = (
            f"Imported {imported} synthetic demo accounts (clearly marked is_synthetic=1). "
            "Configure SALES_ENGINE_LEAD_API_URL for live enrichment."
        )
    else:
        note = f"Imported {imported} accounts via {provider.name}."
    return imported, note
