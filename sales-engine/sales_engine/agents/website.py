"""Website Agent: read-only advisory notes on aligning the public site with the funnel.

It stores/recommends alignment notes per site section, linked to funnel stages.
It never edits the website itself.
"""

from __future__ import annotations

import sqlite3

from sales_engine import db

# (section, title, note, funnel_stage)
WEBSITE_NOTES: list[tuple[str, str, str, str]] = [
    (
        "offers",
        "Sell outcomes, not hours",
        "Present the three offers (Diagnostic, Fractional CAIO/VP AI, Transformation Mandate) "
        "as outcomes with price ranges — never an hourly rate. Mirror the README offer table.",
        "proposal",
    ),
    (
        "proof",
        "Lead with the regulated-healthcare moat",
        "Feature the Adia Health VP story (AI platform roadmap, 8-person org, regulated GenAI "
        "delivery) above generic testimonials; it is the ICP B proof that differentiates.",
        "qualification",
    ),
    (
        "insights",
        "Publish one article per week against ICP triggers",
        "Each insight page should answer the headline question in 2-3 sentences at the top "
        "with clear author identity — GEO/AEO-friendly, per the content plan.",
        "visitor",
    ),
    (
        "lead_magnets",
        "Gate the AI initiative audit checklist",
        "Add the 'AI initiative audit: 20 questions' checklist as an email-gated lead magnet "
        "on every insights page; feed captured accounts into the pipeline as ICP A leads.",
        "lead",
    ),
    (
        "conversion",
        "One CTA everywhere: the 20-minute diagnostic call",
        "A Calendly booking for a 20-30 minute call must appear on the homepage, every offer, "
        "and every insight page. Label it as a diagnostic conversation, not a sales call.",
        "conversation",
    ),
]


def generate_website_notes(conn: sqlite3.Connection, *, use_llm: bool = False) -> int:
    """Insert the advisory note set (idempotent per run adds new rows). Returns count."""
    created = 0
    for section, title, note, funnel_stage in WEBSITE_NOTES:
        if use_llm:
            from sales_engine import llm

            result = llm.generate_text(
                f"Rewrite this website alignment note to be more specific and actionable:\n{note}",
                fallback_text=note,
            )
            note = result.text.strip()
        db.execute(
            conn,
            "INSERT INTO website_notes (section, title, note, funnel_stage) VALUES (?, ?, ?, ?)",
            (section, title, note, funnel_stage),
        )
        created += 1
    conn.commit()
    return created


def list_website_notes(conn: sqlite3.Connection) -> list[sqlite3.Row]:
    return db.rows(conn, "SELECT * FROM website_notes ORDER BY id")
