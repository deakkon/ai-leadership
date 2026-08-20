"""Research Agent: assembles a concise account brief from stored fields.

v1 is template synthesis (deterministic). With an LLM endpoint configured, the
same structured context is handed to the local model to write the narrative;
if the endpoint is unavailable it falls back to the template (engine=template).
"""

from __future__ import annotations

import json
import sqlite3
from typing import Any

from sales_engine import db, domain, llm

PROOF_POINTS: tuple[str, ...] = (
    "Most recently I was VP of AI & Data Science at Adia Health, where I owned the AI "
    "platform roadmap and led an 8-person cross-timezone AI/data organization.",
    "I've delivered GenAI, NLP, semantic-search and knowledge-graph capabilities in "
    "regulated healthcare environments.",
    "Executive enough to shape the decision, technical enough to challenge the "
    "architecture, hands-on enough to unblock delivery.",
)

LIKELY_PROBLEMS: dict[str, tuple[str, ...]] = {
    "A": (
        "Several AI pilots running with no executive owner and no platform-level oversight",
        "No coherent strategy linking AI investment to business outcomes",
        "Tool/pilot sprawl driving duplicated effort and governance gaps",
        "No operating model for who owns models, data, product, evaluation and governance",
        "Unclear ROI measurement across initiatives",
    ),
    "B": (
        "Regulatory/clinical validation burden for GenAI in production",
        "Data privacy and GDPR risk in clinical workflows",
        "Reliability and hallucination risk in patient-facing or clinical decision support",
        "Auditability, human-in-the-loop controls and quality management for AI",
        "Engineering org lacks an evaluation and observability practice for LLM systems",
    ),
    "C": (
        "Portfolio-wide AI opportunity scan with no standardized assessment",
        "Value-creation thesis on AI unclear to the operating partner",
        "Architecture assessment across a portfolio company before committing capital",
        "Integration and operating-model questions for acquired or transforming companies",
        "No 90-day transformation plan with milestones and governance",
    ),
}

ANGLES: dict[str, str] = {
    "A": "Position as AI operating model + leadership ownership: consolidate scattered "
         "initiatives under one accountable exec before building more.",
    "B": "Position the regulated-delivery moat: production-grade GenAI in regulated "
         "healthcare without regulatory/clinical/reliability problems.",
    "C": "Position as portfolio value creation: AI opportunity + architecture assessment, "
         "then a governed 90-day transformation.",
}

BRIEF_SYSTEM = (
    "You are a research analyst for a fractional AI leadership consulting practice "
    "(Dr. Jurica Seva, Berlin, EU/EMEA). Write a concise account brief (max 180 words) "
    "using only the supplied structured context. No invented facts."
)


def build_brief(conn: sqlite3.Connection, opportunity_id: int, *, use_llm: bool = False) -> dict[str, Any]:
    """Build a structured account brief; optionally synthesize text via the LLM."""
    opp = db.row(
        conn,
        "SELECT o.*, a.name AS account_name, a.domain, a.industry, a.country, a.region, "
        "a.employee_count, a.revenue_eur, a.engineering_capability, a.ai_maturity, "
        "a.icp AS account_icp, a.source AS account_source, a.notes AS account_notes "
        "FROM opportunities o JOIN accounts a ON a.id = o.account_id WHERE o.id = ?",
        (opportunity_id,),
    )
    if opp is None:
        raise ValueError(f"no opportunity with id {opportunity_id}")
    account_icp = str(opp["account_icp"] or "")
    icp = str(opp["icp"] or account_icp or "A")
    icp_spec = domain.ICP_TARGETS.get(icp, domain.ICP_TARGETS["A"])
    contacts = db.rows(
        conn,
        "SELECT * FROM contacts WHERE account_id = ? ORDER BY is_decision_maker DESC",
        (opp["account_id"],),
    )
    executives = [
        {"name": c["name"], "title": c["title"], "role": c["role"], "accessible": bool(c["is_decision_maker"])}
        for c in contacts
    ]
    offer = domain.OFFERS.get(str(opp["engagement"] or ""))
    brief: dict[str, Any] = {
        "company": opp["account_name"],
        "domain": opp["domain"],
        "industry": opp["industry"],
        "region": opp["region"] or opp["country"],
        "employees": opp["employee_count"],
        "revenue_eur": opp["revenue_eur"],
        "engineering_capability": bool(opp["engineering_capability"]),
        "ai_maturity": opp["ai_maturity"],
        "icp": icp,
        "icp_name": icp_spec["name"],
        "buyer": opp["decision_maker"],
        "executives": executives,
        "trigger": opp["problem_trigger"],
        "engagement": str(opp["engagement"] or ""),
        "offer_name": offer["name"] if offer else None,
        "offer_range_eur": f"{offer['min_value_eur']:,}-{offer['max_value_eur']:,}" if offer else None,
        "stage": opp["stage"],
        "likely_problems": list(LIKELY_PROBLEMS.get(icp, LIKELY_PROBLEMS["A"])),
        "suggested_angle": ANGLES.get(icp, ANGLES["A"]),
        "proof_points": list(PROOF_POINTS),
        "summary": "",
    }
    if use_llm:
        prompt = (
            "Write an account brief for a sales conversation about the following company. "
            "Cover: context, likely AI problems, suggested angle, and one CTA. "
            "Never invent facts outside the context.\n\n"
            + json.dumps(brief, indent=2, default=str)
        )
        result = llm.generate_text(prompt, system=BRIEF_SYSTEM)
        brief["summary"] = result.text
        brief["engine"] = result.engine
        brief["engine_note"] = result.note
    return brief


def render_brief_text(brief: dict[str, Any]) -> str:
    lines = [
        f"ACCOUNT BRIEF — {brief['company']}",
        f"  ICP {brief['icp']} ({brief['icp_name']}) | region {brief['region'] or 'unknown'}",
        f"  {brief['employees'] or '?'} employees | revenue €{brief['revenue_eur'] or '?'} | "
        f"engineering capability: {'yes' if brief['engineering_capability'] else 'no'} | "
        f"AI maturity: {brief['ai_maturity']}/4",
        "",
        f"  Problem / trigger: {brief['trigger'] or 'unknown'}",
        f"  Offer: {brief['offer_name'] or brief['engagement'] or 'TBD'} "
        f"({brief['offer_range_eur'] or 'pricing TBD'} EUR)",
        "",
        "  Likely AI problems:",
    ]
    for problem in brief["likely_problems"]:
        lines.append(f"    - {problem}")
    lines.append("")
    lines.append(f"  Decision maker: {brief['buyer'] or 'unknown'}")
    for executive in brief["executives"]:
        marker = " (DM)" if executive["accessible"] else ""
        lines.append(f"    - {executive['name']} — {executive['title'] or executive['role']}{marker}")
    lines.append("")
    lines.append(f"  Suggested angle: {brief['suggested_angle']}")
    lines.append("  Proof points:")
    for proof in brief["proof_points"]:
        lines.append(f"    - {proof}")
    if brief.get("summary"):
        lines.append("")
        lines.append(f"  Narrative ({brief.get('engine', 'template')}):")
        lines.append(f"    {brief['summary']}")
    return "\n".join(lines)
