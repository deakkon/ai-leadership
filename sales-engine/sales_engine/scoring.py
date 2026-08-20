"""Lead qualification: deterministic scoring model against the ICPs.

Each component contributes a fraction (0..1) of its weight; weights sum to 100.
Buckets: score >= 70 hot, >= 45 warm, else cold. Pure functions — unit-tested
in tests/test_scoring.py and persisted by the Qualification Agent.
"""

from __future__ import annotations

from collections.abc import Mapping, Sequence

from sales_engine import domain


def _get(mapping: Mapping[str, object], key: str, default: object = None) -> object:
    """Key access that works for both dicts and sqlite3.Row."""
    try:
        return mapping[key]
    except (KeyError, IndexError):
        return default


def bucket_for(score: int) -> str:
    if score >= domain.HOT_THRESHOLD:
        return "hot"
    if score >= domain.WARM_THRESHOLD:
        return "warm"
    return "cold"


def stage_component(stage: str | None) -> float:
    return domain.STAGE_COMPONENT.get(stage or "", 0.1)


def _band(value: int | None, lo: int, hi: int) -> float:
    """1.0 inside the band, 0.6 within 0.5-2x of it, 0.3 otherwise."""
    v = value or 0
    if lo <= v <= hi:
        return 1.0
    if lo / 2 <= v <= hi * 2:
        return 0.6
    return 0.3


def company_fit_component(account: Mapping[str, object], icp: str | None) -> float:
    icp = icp or "A"
    emp = int(_get(account, "employee_count", 0) or 0)  # type: ignore[arg-type]
    rev = int(_get(account, "revenue_eur", 0) or 0)  # type: ignore[arg-type]
    engineering = bool(_get(account, "engineering_capability", False))
    if icp == "A":
        emp_fit = _band(emp, *domain.ICP_TARGETS["A"]["employees"])  # type: ignore[arg-type]
        rev_fit = _band(rev, *domain.ICP_TARGETS["A"]["revenue_eur"])  # type: ignore[arg-type]
        eng = 1.0 if engineering else 0.6
        return round((emp_fit + rev_fit + eng) / 3, 2)
    if icp == "B":
        emp_fit = _band(emp, *domain.ICP_TARGETS["B"]["employees"])  # type: ignore[arg-type]
        rev_fit = _band(rev, *domain.ICP_TARGETS["B"]["revenue_eur"])  # type: ignore[arg-type]
        return round((emp_fit + rev_fit) / 2, 2)
    emp_fit = _band(emp, *domain.ICP_TARGETS["C"]["employees"])  # type: ignore[arg-type]
    rev_fit = _band(rev, *domain.ICP_TARGETS["C"]["revenue_eur"])  # type: ignore[arg-type]
    return round((emp_fit + rev_fit) / 2, 2)


def ai_maturity_component(maturity: int | None) -> float:
    return {0: 0.85, 1: 1.0, 2: 0.8, 3: 0.45, 4: 0.15}.get(maturity or 0, 0.5)


def pain_component(trigger: str | None, icp: str | None) -> float:
    """Signal strength of the problem/trigger text against ICP-specific keywords."""
    if not trigger:
        return 0.35
    text = trigger.lower()
    keywords = domain.PAIN_KEYWORDS.get(icp or "A", domain.PAIN_KEYWORDS["A"])
    hits = sum(1 for keyword in keywords if keyword in text)
    return min(1.0, round(0.35 + 0.15 * hits, 2))


def budget_component(
    value_eur: int | None, engagement: str | None, budget_status: str | None
) -> float:
    offer = domain.OFFERS.get(engagement or "")
    if offer is None:
        base = 1.0 if (value_eur or 0) >= 7_000 else (0.5 if (value_eur or 0) >= 3_500 else 0.25)
    else:
        lo: int = offer["min_value_eur"]  # type: ignore[assignment]
        if (value_eur or 0) >= lo:
            base = 1.0
        elif (value_eur or 0) >= lo * 0.5:
            base = 0.7
        elif (value_eur or 0) > 0:
            base = 0.4
        else:
            base = 0.2
    status = (budget_status or "unknown").lower()
    if status == "approved":
        base = min(1.0, base + 0.15)
    elif status == "allocated":
        base = min(1.0, base + 0.10)
    elif status == "none":
        base = max(0.05, base - 0.10)
    return round(base, 2)


def urgency_component(urgency: int | None) -> float:
    return min(1.0, (urgency or 0) / 4)


def regulated_fit_component(industry: str | None, icp: str | None) -> float:
    """ICP B lives or dies on regulated-industry fit; A/C are neutral."""
    if icp != "B":
        return 0.5
    ind = (industry or "").lower()
    if ind in domain.REGULATED_INDUSTRIES:
        return 1.0
    if any(token in ind for token in ("health", "med", "clin", "bio", "pharma", "insur", "fin", "legal")):
        return 0.7
    return 0.25


def accessibility_component(contacts: Sequence[Mapping[str, object]]) -> float:
    if not contacts:
        return 0.2
    values = [int(_get(c, "accessibility", 0) or 0) for c in contacts if _get(c, "is_decision_maker", False)]
    if not values:
        values = [int(_get(c, "accessibility", 0) or 0) for c in contacts]
    return max(values) / 4


def icp_match_component(account_icp: str | None, opportunity_icp: str | None) -> float:
    if account_icp and opportunity_icp:
        return 1.0 if account_icp == opportunity_icp else 0.4
    if account_icp and not opportunity_icp:
        return 0.8
    if opportunity_icp and not account_icp:
        return 0.5
    return 0.4


def score_opportunity(
    account: Mapping[str, object],
    opportunity: Mapping[str, object],
    contacts: Sequence[Mapping[str, object]],
) -> tuple[int, str, list[str]]:
    """Return (score 0-100, bucket, human-readable reasons)."""
    account_icp = _get(account, "icp")
    opp_icp = _get(opportunity, "icp")
    icp = str(opp_icp or account_icp or "A")
    components = {
        "stage": stage_component(str(_get(opportunity, "stage", "") or "")),
        "company_fit": company_fit_component(account, icp),
        "ai_maturity": ai_maturity_component(int(_get(account, "ai_maturity", 0) or 0)),
        "likely_pain": pain_component(str(_get(opportunity, "problem_trigger", "") or ""), icp),
        "budget": budget_component(
            int(_get(opportunity, "expected_monthly_value_eur", 0) or 0),
            str(_get(opportunity, "engagement", "") or ""),
            str(_get(opportunity, "budget_status", "unknown") or "unknown"),
        ),
        "urgency": urgency_component(int(_get(opportunity, "urgency", 0) or 0)),
        "regulated_fit": regulated_fit_component(str(_get(account, "industry", "") or ""), icp),
        "accessibility": accessibility_component(contacts),
        "icp_match": icp_match_component(
            str(_get(account, "icp", "") or ""), str(_get(opportunity, "icp", "") or "")
        ),
    }
    total = round(sum(domain.SCORING_WEIGHTS[k] * v for k, v in components.items()))
    total = max(0, min(100, total))
    reasons = []
    for key, value in sorted(components.items(), key=lambda kv: kv[1], reverse=True):
        if value >= 0.7:
            reasons.append(f"{key} strong ({value:.2f})")
        elif value <= 0.3:
            reasons.append(f"{key} weak ({value:.2f})")
    return total, bucket_for(total), reasons
