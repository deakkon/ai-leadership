"""Outreach Agent: drafts one-off, personalized LinkedIn/email messages.

Built from the account brief (company, trigger, offer, decision maker, ICP).
Local-LLM when configured (SALES_ENGINE_LLM_BASE_URL), deterministic template
otherwise. One message at a time — this is not a mass-mailing tool.
"""

from __future__ import annotations

import json
import sqlite3
from typing import Any

from sales_engine import db, domain, llm
from sales_engine.agents import research

OUTREACH_SYSTEM = (
    "You are an executive sales assistant for a fractional AI leadership consultant "
    "(Dr. Jurica Seva, Berlin). Write one concise, senior, personalized outreach "
    "message. No buzzwords, no invented facts, no attachments, one soft CTA. "
    "For email: first line is 'Subject: <line>' then a blank line, then the body."
)


def _first_name(buyer: str | None) -> str:
    if not buyer:
        return "there"
    return buyer.split()[0]


def _hook_for(icp: str, trigger: str | None) -> str:
    if icp == "B":
        return "getting GenAI into production without running into regulatory, clinical or reliability problems"
    if icp == "C":
        return "turning AI potential across the portfolio into a governed 90-day transformation"
    return "consolidating several AI initiatives into one coherent strategy"


def _template_message(brief: dict[str, Any], channel: str) -> tuple[str, str]:
    company = brief["company"]
    first = _first_name(brief["buyer"])
    icp = brief["icp"]
    trigger = (brief["trigger"] or "AI ambitions without senior ownership").rstrip(".")
    offer = brief["offer_name"] or brief["engagement"] or "AI transformation leadership"
    region = brief["region"] or "Europe"
    proof = brief["proof_points"][0]
    hook = _hook_for(icp, brief["trigger"])
    body = (
        f"Hi {first},\n\n"
        f"I'm reaching out because {company} looks like it's at the point where AI "
        f"needs an owner, not another experiment — specifically around {hook}.\n\n"
        f"Based on what I can see, the challenge is likely: {trigger}.\n\n"
        f"I work with leadership teams in {region} as a fractional AI/technology "
        f"executive, selling outcomes rather than hours — the kind of mandate that "
        f"covers {offer}. {proof}\n\n"
        f"If that overlaps with what you're working through, a 20-30 minute call "
        f"would let us compare notes. Worth a look?"
    )
    if channel == "email":
        subject = f"AI leadership for {company}: {hook}"
        return subject, body
    return "", body


def _llm_message(brief: dict[str, Any], channel: str, strict: bool) -> llm.LLMResult:
    prompt = (
        f"Write a {channel} outreach message to the decision maker at this account. "
        f"Use the brief's trigger and suggested angle as the personalization hook. "
        f"Keep it under 160 words.\n\n{json.dumps(brief, indent=2, default=str)}"
    )
    fallback_subject, fallback_body = _template_message(brief, channel)
    fallback = f"Subject: {fallback_subject}\n\n{fallback_body}" if channel == "email" else fallback_body
    return llm.generate_text(prompt, system=OUTREACH_SYSTEM, fallback_text=fallback, strict=strict)


def draft_message(
    conn: sqlite3.Connection,
    opportunity_id: int,
    *,
    channel: str = "linkedin",
    use_llm: bool = False,
    strict: bool = False,
) -> dict[str, Any]:
    """Draft, persist, and return one outreach message."""
    if channel not in domain.CHANNELS:
        raise ValueError(f"unknown channel: {channel}")
    opp = db.row(conn, "SELECT * FROM opportunities WHERE id = ?", (opportunity_id,))
    if opp is None:
        raise ValueError(f"no opportunity with id {opportunity_id}")
    brief = research.build_brief(conn, opportunity_id)
    if use_llm:
        result = _llm_message(brief, channel, strict)
        engine, note = result.engine, result.note
        text = result.text
        if channel == "email" and text.startswith("Subject:"):
            head, _, body = text.partition("\n")
            subject = head.replace("Subject:", "", 1).strip()
            body = body.strip()
        else:
            subject, body = _template_message(brief, channel) if result.engine == "template" else ("", text)
    else:
        subject, body = _template_message(brief, channel)
        engine, note = "template", ""
    contact = None
    dm = db.rows(
        conn,
        "SELECT * FROM contacts WHERE account_id = ? AND is_decision_maker = 1 ORDER BY accessibility DESC",
        (opp["account_id"],),
    )
    if dm:
        contact = dm[0]
    message_id = db.execute(
        conn,
        "INSERT INTO outreach_messages (opportunity_id, contact_id, channel, subject, body, engine) "
        "VALUES (?, ?, ?, ?, ?, ?)",
        (opportunity_id, contact["id"] if contact else None, channel, subject, body, engine),
    )
    conn.commit()
    return {
        "id": message_id,
        "opportunity_id": opportunity_id,
        "company": brief["company"],
        "contact_id": contact["id"] if contact else None,
        "channel": channel,
        "subject": subject,
        "body": body,
        "engine": engine,
        "note": note,
    }
