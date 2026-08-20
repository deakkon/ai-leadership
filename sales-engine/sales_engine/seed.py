"""Seed module: deterministic, clearly-synthetic demo data.

Generates 28 accounts across ICP A/B/C with varied scores/stages, contacts,
opportunities, pipeline history, outreach-ready context, content items,
website notes and analytics (visit) events. Every account is marked
is_synthetic=1 — no real client names are used or implied.

Deterministic: the same seed always produces the same dataset.
"""

from __future__ import annotations

import random
import sqlite3
from typing import Any

from sales_engine import db, domain
from sales_engine.agents import content as content_agent
from sales_engine.agents import website as website_agent
from sales_engine.agents.discovery import MockLeadProvider

DEFAULT_ACCOUNTS_BY_ICP: dict[str, int] = {"A": 14, "B": 8, "C": 6}

FIRST_NAMES = (
    "Anna", "Boris", "Cecile", "Daniel", "Elena", "Felix", "Greta", "Hakan",
    "Ines", "Jonas", "Katrin", "Lukas", "Maren", "Niklas", "Olga", "Peter",
    "Quirin", "Renata", "Sven", "Tanja", "Urs", "Valentina", "Werner", "Ylva",
    "Zoran", "Mia", "Leo", "Hannah", "Marek", "Sofia",
)
LAST_NAMES = (
    "Weber", "Schmidt", "Muller", "Novak", "Hoffmann", "Lindgren", "Kovac",
    "Berger", "Fischer", "Larsen", "Roth", "Sorensen", "Vogt", "Andersson",
    "Klein", "Bjork", "Keller", "Janssen", "Brandt", "Voss", "Engel",
    "Schuster", "Laine", "Petrova", "Kramer", "Walther", "Dupont", "Moreau",
    "Van Dijk", "Ostrowski",
)

TRIGGERS: dict[str, tuple[str, ...]] = {
    "A": (
        "Six AI initiatives, no coherent strategy or single owner.",
        "AI pilots everywhere but nothing in production; nobody owns the roadmap.",
        "Hiring pressure: cannot find a head of AI; considering fractional ownership.",
        "Tools and pilots duplicating across teams; governance gaps at board level.",
        "PoC-to-production failures; early architecture decisions are getting expensive.",
    ),
    "B": (
        "GenAI prototypes are blocked by regulatory and clinical validation questions.",
        "Wants production GenAI in clinical workflows without GDPR or audit exposure.",
        "Reliability concerns: hallucination risk is unacceptable in patient-facing features.",
        "Quality management and evaluation practice missing for LLM systems.",
        "MDR/CE questions on AI features; needs executive ownership of compliance.",
    ),
    "C": (
        "Operating partner wants a portfolio-wide AI opportunity scan before value-creation planning.",
        "AI architecture assessment needed across a recent acquisition.",
        "90-day transformation mandate: assess AI potential, build the plan, govern delivery.",
        "Due diligence: is the platform ready for AI-led growth assumptions?",
    ),
}

OFFER_WEIGHTS: dict[str, list[tuple[str, int]]] = {
    "A": [
        ("fractional_caio_1d", 25), ("fractional_caio_2d", 25), ("mandate", 20),
        ("diagnostic", 20), ("fractional_cto", 10),
    ],
    "B": [("mandate", 30), ("fractional_caio_2d", 30), ("diagnostic", 25), ("fractional_caio_1d", 15)],
    "C": [("mandate", 40), ("diagnostic", 35), ("fractional_caio_2d", 25)],
}

STAGE_WEIGHTS: dict[str, int] = {
    "identified": 20, "researched": 15, "contacted": 12, "engaged": 10,
    "discovery": 10, "qualified": 8, "proposal": 8, "won": 10, "lost": 7,
}

TITLE_BY_ROLE: dict[str, str] = {
    "CEO": "Chief Executive Officer",
    "CTO": "Chief Technology Officer",
    "COO": "Chief Operating Officer",
    "CPO": "Chief Product Officer",
    "OPERATING_PARTNER": "Operating Partner",
    "VP_ENGINEERING": "VP Engineering",
    "HEAD_OF_AI": "Head of AI",
    "OTHER": "Executive",
}


def _pick_weighted(rng: random.Random, pairs: list[tuple[str, int]]) -> str:
    values = [value for value, weight in pairs for _ in range(weight)]
    return rng.choice(values)


def _make_contact(rng: random.Random, account_id: int, domain_name: str, role: str) -> dict[str, Any]:
    name = f"{rng.choice(FIRST_NAMES)} {rng.choice(LAST_NAMES)}"
    email_domain = domain_name or "example.com"
    return {
        "name": name,
        "email": f"{name.split()[0].lower()}.{name.split()[1].lower()}@{email_domain}",
        "role": role,
        "title": TITLE_BY_ROLE.get(role, "Executive"),
        "accessibility": rng.choices([0, 1, 2, 3, 4], weights=[5, 15, 30, 35, 15])[0],
        "is_decision_maker": 1,
        "account_id": account_id,
    }


def seed_data(
    conn: sqlite3.Connection,
    *,
    accounts_by_icp: dict[str, int] | None = None,
    seed: int = 42,
) -> dict[str, Any]:
    """Populate the database with synthetic demo data. Returns counts."""
    accounts_by_icp = accounts_by_icp or dict(DEFAULT_ACCOUNTS_BY_ICP)
    rng = random.Random(seed)
    now = db.utc_now_iso()

    accounts_created = 0
    opportunities_created = 0
    contacts_created = 0
    stage_counts: dict[str, int] = {stage: 0 for stage in domain.STAGES}
    won_ids: list[int] = []
    lost_ids: list[int] = []

    for icp, count in accounts_by_icp.items():
        for _ in range(count):
            mock = MockLeadProvider(seed=seed + accounts_created)
            row = mock.fetch(icp=icp, limit=1)[0]
            row["notes"] = "SYNTHETIC DEMO DATA — fictional account, not a real company."
            account_id = db.execute(
                conn,
                """
                INSERT INTO accounts (
                    name, domain, industry, country, region, employee_count,
                    revenue_eur, engineering_capability, ai_maturity, icp,
                    source, url, notes, is_synthetic, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    row["name"], row["domain"], row["industry"], row["country"],
                    row["region"], row["employee_count"], row["revenue_eur"],
                    int(row["engineering_capability"]), row["ai_maturity"],
                    icp, row["source"], row["url"], row["notes"], 1, now, now,
                ),
            )
            accounts_created += 1

            buyer_role = rng.choice(domain.ICP_TARGETS[icp]["buyers"])  # type: ignore[index]
            dm = _make_contact(rng, account_id, str(row["domain"]), str(buyer_role))
            contact_id = db.execute(
                conn,
                "INSERT INTO contacts (account_id, name, title, role, email, accessibility, is_decision_maker, created_at) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (dm["account_id"], dm["name"], dm["title"], dm["role"], dm["email"],
                 dm["accessibility"], dm["is_decision_maker"], now),
            )
            contacts_created += 1
            if rng.random() < 0.4:
                second = _make_contact(rng, account_id, str(row["domain"]), "OTHER")
                db.execute(
                    conn,
                    "INSERT INTO contacts (account_id, name, title, role, email, accessibility, is_decision_maker, created_at) "
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    (second["account_id"], second["name"], second["title"], second["role"],
                     second["email"], second["accessibility"], 0, now),
                )
                contacts_created += 1

            stage = _pick_weighted(rng, list(STAGE_WEIGHTS.items()))
            stage_counts[stage] += 1
            engagement = _pick_weighted(rng, OFFER_WEIGHTS[icp])
            offer = domain.OFFERS[engagement]
            lo: int = offer["min_value_eur"]  # type: ignore[assignment]
            hi: int = offer["max_value_eur"]  # type: ignore[assignment]
            value = rng.randint(lo, hi)
            trigger = rng.choice(TRIGGERS[icp])
            timestamp = now
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
                    account_id, f"{row['name']} — {offer['name']}", stage, icp, engagement,
                    trigger, dm["name"], contact_id, row["source"], value,
                    domain.PROBABILITY_BY_STAGE[stage],
                    rng.choices([0, 1, 2, 3, 4], weights=[5, 15, 30, 35, 15])[0],
                    rng.choices(["unknown", "allocated", "approved", "none"], weights=[40, 30, 15, 15])[0],
                    timestamp, timestamp,
                ),
            )
            opportunities_created += 1
            db.execute(
                conn,
                "INSERT INTO pipeline_events (opportunity_id, from_stage, to_stage, note, created_at) "
                "VALUES (?, NULL, 'identified', ?, ?)",
                (opp_id, "Opportunity created", timestamp),
            )
            if stage == "won":
                won_ids.append(opp_id)
            elif stage == "lost":
                lost_ids.append(opp_id)

            # Historical step-through events for stages beyond 'identified'.
            step_days: dict[str, float] = {
                "researched": -42, "contacted": -35, "engaged": -28, "discovery": -21,
                "qualified": -14, "proposal": -8, "won": -3, "lost": -10,
            }
            path: list[str]
            if stage in domain.LINEAR_STAGES and stage != "identified":
                path = [s for s in domain.LINEAR_STAGES
                        if 0 < domain.STAGE_ORDER[s] <= domain.STAGE_ORDER[stage]]
            elif stage == "won":
                path = [s for s in domain.LINEAR_STAGES if 0 < domain.STAGE_ORDER[s]] + ["won"]
            elif stage == "lost":
                path = [s for s in domain.LINEAR_STAGES if 0 < domain.STAGE_ORDER[s] <= domain.STAGE_ORDER["qualified"]] + ["lost"]
            else:
                path = []
            previous = "identified"
            for current_prior in path:
                event_time = db.iso_offset(step_days[current_prior], from_iso=now)
                db.execute(
                    conn,
                    "INSERT INTO pipeline_events (opportunity_id, from_stage, to_stage, note, created_at) "
                    "VALUES (?, ?, ?, ?, ?)",
                    (opp_id, previous, current_prior, "Stage reached", event_time),
                )
                previous = current_prior

    # Won / lost reasons.
    for opp_id in won_ids:
        db.execute(conn, "UPDATE opportunities SET won_reason = ? WHERE id = ?",
                   ("Signed AI transformation mandate; diagnostic converted into a retainer.", opp_id))
    for opp_id in lost_ids:
        db.execute(conn, "UPDATE opportunities SET lost_reason = ? WHERE id = ?",
                   ("Budget deferred to next quarter.", opp_id))

    # Website traffic (synthetic analytics_events) over the past 60 days.
    visit_events = 0
    for day in range(60):
        for _ in range(rng.randint(1, 4)):
            db.execute(
                conn,
                "INSERT INTO analytics_events (event_type, occurred_at, note) VALUES ('visit', ?, ?)",
                (db.iso_offset(-day, from_iso=now), "synthetic website visit"),
            )
            visit_events += 1

    content_count = content_agent.generate_content(conn)
    website_count = website_agent.generate_website_notes(conn)
    conn.commit()

    return {
        "accounts": accounts_created,
        "contacts": contacts_created,
        "opportunities": opportunities_created,
        "stage_counts": stage_counts,
        "won": len(won_ids),
        "lost": len(lost_ids),
        "content_items": content_count,
        "website_notes": website_count,
        "analytics_events": visit_events,
        "seed": seed,
    }
