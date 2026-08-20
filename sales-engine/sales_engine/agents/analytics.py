"""Analytics Agent: pipeline metrics, conversion funnel, target-vs-actual.

Funnel buckets (visitor -> lead -> conversation -> qualified -> proposal -> won)
are derived from stored data:
- visitor: analytics_events of type 'visit' (web/landing traffic)
- lead: target accounts in the CRM
- conversation: opportunities at/after stage 'engaged'
- qualified: opportunities at/after 'qualified'
- proposal: opportunities at/after 'proposal'
- won: opportunities in 'won'

Steady-state targets (documented in README): 20 accounts/wk -> 5 conversations
-> 2 qualified -> 3-5 proposals/mo -> 1-2 wins/mo.
"""

from __future__ import annotations

import sqlite3
from typing import Any

from sales_engine import db, domain

FUNNEL_ORDER: tuple[str, ...] = ("visitor", "lead", "conversation", "qualified", "proposal", "won")

# Earliest stage that counts as "reaching" each funnel bucket.
FUNNEL_MIN_STAGE: dict[str, str] = {
    "conversation": "engaged",
    "qualified": "qualified",
    "proposal": "proposal",
    "won": "won",
}


def count_by(conn: sqlite3.Connection, table: str, column: str) -> dict[str, int]:
    """Count rows grouped by a column, e.g. accounts grouped by source."""
    result: dict[str, int] = {}
    for row in db.rows(conn, f"SELECT {column} AS key, COUNT(*) AS n FROM {table} GROUP BY {column}"):
        result[str(row["key"])] = int(row["n"])
    return result


def stage_distribution(conn: sqlite3.Connection) -> dict[str, int]:
    counts: dict[str, int] = {stage: 0 for stage in domain.STAGES}
    for row in db.rows(conn, "SELECT stage, COUNT(*) AS n FROM opportunities GROUP BY stage"):
        counts[str(row["stage"])] = int(row["n"])
    return counts


def funnel(conn: sqlite3.Connection) -> dict[str, int]:
    visitors = db.row(conn, "SELECT COUNT(*) AS n FROM analytics_events WHERE event_type = 'visit'")
    leads = db.row(conn, "SELECT COUNT(*) AS n FROM accounts")
    counts: dict[str, int] = {
        "visitor": int(visitors["n"]) if visitors else 0,
        "lead": int(leads["n"]) if leads else 0,
    }
    stage_counts = stage_distribution(conn)
    for bucket, min_stage in FUNNEL_MIN_STAGE.items():
        threshold = domain.STAGE_ORDER[min_stage]
        counts[bucket] = sum(
            n for stage, n in stage_counts.items()
            if stage != "lost" and domain.STAGE_ORDER.get(stage, 99) >= threshold
        )
    return counts


def conversion_rates(counts: dict[str, int]) -> dict[str, float]:
    rates: dict[str, float] = {}
    for previous, current in zip(FUNNEL_ORDER, FUNNEL_ORDER[1:]):
        if counts[previous]:
            rates[f"{previous}->{current}"] = counts[current] / counts[previous]
        else:
            rates[f"{previous}->{current}"] = 0.0
    return rates


def pipeline_value(conn: sqlite3.Connection) -> dict[str, Any]:
    open_rows = db.rows(
        conn, "SELECT * FROM opportunities WHERE stage NOT IN ('won', 'lost')"
    )
    total_raw = 0
    total_weighted = 0
    by_stage: dict[str, dict[str, float]] = {}
    by_icp: dict[str, dict[str, float]] = {}
    by_engagement: dict[str, dict[str, float]] = {}
    for opp in open_rows:
        value = int(opp["expected_monthly_value_eur"] or 0)
        total_raw += value
        total_weighted += value * float(opp["probability"])
        for bucket, label in (
            (by_stage, str(opp["stage"])),
            (by_icp, str(opp["icp"] or "unknown")),
            (by_engagement, str(opp["engagement"] or "unknown")),
        ):
            entry = bucket.setdefault(label, {"raw": 0.0, "weighted": 0.0})
            entry["raw"] += value
            entry["weighted"] += value * float(opp["probability"])
    return {
        "total_raw": total_raw,
        "total_weighted": total_weighted,
        "by_stage": by_stage,
        "by_icp": by_icp,
        "by_engagement": by_engagement,
    }


def reached_stage_in_window(
    conn: sqlite3.Connection, stage: str, days: int, *, now: str | None = None
) -> int:
    """Distinct opportunities that reached `stage` (or beyond) within the last `days`."""
    cutoff = db.iso_offset(-days, from_iso=now)
    reachable = {
        "conversation": ("engaged", "discovery", "qualified", "proposal", "won"),
        "qualified": ("qualified", "proposal", "won"),
        "proposal": ("proposal",),
        "won": ("won",),
    }
    stages = reachable.get(stage, (stage,))
    placeholders = ",".join("?" * len(stages))
    row = db.row(
        conn,
        f"SELECT COUNT(DISTINCT opportunity_id) AS n FROM pipeline_events "
        f"WHERE to_stage IN ({placeholders}) AND created_at >= ?",
        tuple(stages) + (cutoff,),
    )
    return int(row["n"]) if row else 0


def accounts_created_in_window(conn: sqlite3.Connection, days: int, *, now: str | None = None) -> int:
    cutoff = db.iso_offset(-days, from_iso=now)
    row = db.row(conn, "SELECT COUNT(*) AS n FROM accounts WHERE created_at >= ?", (cutoff,))
    return int(row["n"]) if row else 0


def target_vs_actual(
    conn: sqlite3.Connection,
    *,
    now: str | None = None,
    weekly_days: int = 7,
    monthly_days: int = 30,
) -> dict[str, Any]:
    return {
        "weekly": {
            "accounts": {
                "target": domain.WEEKLY_TARGETS["accounts"],
                "actual": accounts_created_in_window(conn, weekly_days, now=now),
            },
            "conversations": {
                "target": domain.WEEKLY_TARGETS["conversations"],
                "actual": reached_stage_in_window(conn, "conversation", weekly_days, now=now),
            },
            "qualified": {
                "target": domain.WEEKLY_TARGETS["qualified"],
                "actual": reached_stage_in_window(conn, "qualified", weekly_days, now=now),
            },
        },
        "monthly": {
            "proposals": {
                "target": domain.MONTHLY_TARGETS["proposals"],
                "actual": reached_stage_in_window(conn, "proposal", monthly_days, now=now),
            },
            "wins": {
                "target": domain.MONTHLY_TARGETS["wins"],
                "actual": reached_stage_in_window(conn, "won", monthly_days, now=now),
            },
        },
    }


def _fmt_eur(value: float) -> str:
    return f"€{value:,.0f}"


def _render_value_section(pv: dict[str, Any]) -> str:
    lines = ["PIPELINE VALUE (open opportunities, expected monthly value)"]
    lines.append(f"  total raw:      {_fmt_eur(pv['total_raw'])}")
    lines.append(f"  total weighted: {_fmt_eur(pv['total_weighted'])} (by stage probability)")
    for label, sub in (("by stage", pv["by_stage"]), ("by ICP", pv["by_icp"]), ("by engagement", pv["by_engagement"])):
        items = sorted(sub.items(), key=lambda kv: kv[1]["weighted"], reverse=True)
        detail = ", ".join(
            f"{key}: {_fmt_eur(entry['weighted'])}/{_fmt_eur(entry['raw'])}" for key, entry in items
        )
        lines.append(f"  {label}: {detail or 'none'}")
    return "\n".join(lines)


def render_report(
    conn: sqlite3.Connection,
    *,
    now: str | None = None,
    weekly_days: int = 7,
    monthly_days: int = 30,
    llm_status: str = "",
) -> str:
    from sales_engine import llm as llm_mod

    leads_by_icp = count_by(conn, "accounts", "icp")
    leads_by_source = count_by(conn, "accounts", "source")
    stages = stage_distribution(conn)
    funnel_counts = funnel(conn)
    rates = conversion_rates(funnel_counts)
    pv = pipeline_value(conn)
    tva = target_vs_actual(conn, now=now, weekly_days=weekly_days, monthly_days=monthly_days)

    if llm_status:
        llm_line = llm_status
    elif llm_mod.is_configured():
        llm_line = f"{llm_mod.configured_base_url()} (model {llm_mod.configured_model()})"
    else:
        llm_line = "template fallback (no endpoint configured)"

    icp_line = ", ".join(f"ICP {k}: {v}" for k, v in sorted(leads_by_icp.items())) or "none"
    source_line = ", ".join(
        f"{k}: {v}" for k, v in sorted(leads_by_source.items(), key=lambda kv: kv[1], reverse=True)
    ) or "none"

    lines = [
        "ANALYTICS REPORT (local-first sales engine)",
        f"  window: last {weekly_days}d / {monthly_days}d ending {now or db.utc_now_iso()}",
        f"  LLM: {llm_line}",
        "",
        "LEADS BY ICP",
        f"  {icp_line}",
        "",
        "LEADS BY SOURCE",
        f"  {source_line}",
        "",
        "OPPORTUNITIES BY STAGE",
        "  " + " | ".join(f"{stage}: {stages[stage]}" for stage in domain.STAGES),
        "",
        "FUNNEL (snapshot)",
    ]
    previous: str | None = None
    for bucket in FUNNEL_ORDER:
        line = f"  {bucket:<12} {funnel_counts[bucket]}"
        if previous is not None:
            rate = rates[f"{previous}->{bucket}"]
            line += f"   ({rate * 100:.0f}% from {previous})"
        lines.append(line)
        previous = bucket
    lines.append("")
    lines.append(_render_value_section(pv))
    lines.append("")
    lines.append("TARGET VS ACTUAL (steady-state: 20 accounts/wk -> 5 conversations -> 2 qualified -> 3-5 proposals/mo -> 1-2 wins/mo)")
    for scope, metrics in (("weekly", tva["weekly"]), ("monthly", tva["monthly"])):
        for metric, entry in metrics.items():
            target = entry["target"]
            target_str = f"{target[0]}-{target[1]}" if isinstance(target, tuple) else str(target)
            lines.append(f"  {scope} {metric:<13} target {target_str:<6} actual {entry['actual']}")
    return "\n".join(lines)
