"""Shared domain constants: pipeline stages, offers, ICP targets, scoring weights.

These encode the business model of the practice (Dr. Jurica Seva, Berlin,
EU/EMEA) — outcome/mandate selling rather than hourly billing.
"""

from __future__ import annotations

# --- Pipeline stages ---------------------------------------------------------
# "won" / "lost" are terminal; the first seven are linear and forward-moving.
STAGES: tuple[str, ...] = (
    "identified",
    "researched",
    "contacted",
    "engaged",
    "discovery",
    "qualified",
    "proposal",
    "won",
    "lost",
)
LINEAR_STAGES: tuple[str, ...] = STAGES[:7]
TERMINAL_STAGES: tuple[str, ...] = STAGES[7:]
STAGE_ORDER: dict[str, int] = {stage: i for i, stage in enumerate(STAGES)}

# Fraction of "complete" a stage represents (used by lead scoring).
STAGE_COMPONENT: dict[str, float] = {
    "identified": 0.15,
    "researched": 0.30,
    "contacted": 0.40,
    "engaged": 0.50,
    "discovery": 0.65,
    "qualified": 0.80,
    "proposal": 0.90,
    "won": 1.0,
    "lost": 0.0,
}

# Default win probability attached to each stage (for pipeline value math).
PROBABILITY_BY_STAGE: dict[str, float] = {
    "identified": 0.05,
    "researched": 0.10,
    "contacted": 0.15,
    "engaged": 0.25,
    "discovery": 0.35,
    "qualified": 0.50,
    "proposal": 0.70,
    "won": 1.0,
    "lost": 0.0,
}

# --- Offers (sell outcomes/mandates, not hours) ------------------------------
OFFERS: dict[str, dict[str, object]] = {
    "diagnostic": {
        "name": "AI Transformation Diagnostic",
        "duration": "~2 weeks",
        "min_value_eur": 7_500,
        "max_value_eur": 12_500,
        "unit": "one-off",
    },
    "fractional_caio_1d": {
        "name": "Fractional CAIO / VP AI (1 day/week)",
        "duration": "monthly retainer",
        "min_value_eur": 7_000,
        "max_value_eur": 9_000,
        "unit": "month",
    },
    "fractional_caio_2d": {
        "name": "Fractional CAIO / VP AI (2 days/week)",
        "duration": "monthly retainer",
        "min_value_eur": 13_000,
        "max_value_eur": 16_000,
        "unit": "month",
    },
    "fractional_cto": {
        "name": "Fractional CTO",
        "duration": "monthly retainer",
        "min_value_eur": 7_000,
        "max_value_eur": 16_000,
        "unit": "month",
    },
    "mandate": {
        "name": "AI Transformation / Platform Leadership Mandate",
        "duration": "3-6 months",
        "min_value_eur": 20_000,
        "max_value_eur": 30_000,
        "unit": "month",
    },
}

# --- ICP pipelines -----------------------------------------------------------
PAIN_KEYWORDS: dict[str, tuple[str, ...]] = {
    "A": (
        "strategy", "roadmap", "initiative", "pilot", "poc", "alignment",
        "ownership", "platform", "governance", "transformation",
    ),
    "B": (
        "regulatory", "gdpr", "compliance", "clinical", "reliability",
        "production", "governance", "audit", "quality", "validation",
    ),
    "C": (
        "portfolio", "value creation", "architecture", "assessment",
        "due diligence", "operating", "integration", "synergy", "90-day",
        "transformation",
    ),
}

ICP_TARGETS: dict[str, dict[str, object]] = {
    "A": {
        "name": "European growth companies",
        "employees": (50, 500),
        "revenue_eur": (10_000_000, 150_000_000),
        "engineering_capability": True,
        "buyers": ("CEO", "CTO", "COO"),
        "trigger": "Six AI initiatives, no coherent strategy.",
    },
    "B": {
        "name": "Regulated healthcare / healthtech",
        "employees": (20, 5_000),
        "revenue_eur": (5_000_000, 1_000_000_000),
        "engineering_capability": True,
        "buyers": ("CEO", "CTO", "CPO"),
        "trigger": "Get GenAI into production without regulatory/clinical/reliability problems.",
    },
    "C": {
        "name": "PE-backed companies",
        "employees": (100, 20_000),
        "revenue_eur": (20_000_000, 5_000_000_000),
        "engineering_capability": True,
        "buyers": ("OPERATING_PARTNER", "CTO", "CEO"),
        "trigger": "AI opportunity + architecture assessment across a portfolio company, then a 90-day transformation.",
    },
}

REGULATED_INDUSTRIES: frozenset[str] = frozenset(
    {
        "healthcare", "healthtech", "pharma", "medtech", "medical_devices",
        "digital_health", "clinical_research", "insurance", "finance",
        "legal", "public_sector",
    }
)

# --- Lead sources ------------------------------------------------------------
SOURCES: tuple[str, ...] = (
    "fractionista",
    "malt_strategy",
    "outvise",
    "recruiter",
    "linkedin_outbound",
    "referral",
    "website",
    "article",
    "meta",
    "google",
    "conference",
    "other",
)

# --- Contact roles -----------------------------------------------------------
ROLES: tuple[str, ...] = (
    "CEO", "CTO", "COO", "CPO", "OPERATING_PARTNER",
    "VP_ENGINEERING", "HEAD_OF_AI", "OTHER",
)

# --- Outreach channels and content types ------------------------------------
CHANNELS: tuple[str, ...] = ("linkedin", "email")
CONTENT_TYPES: tuple[str, ...] = ("article", "case_study", "landing_page", "lead_magnet")

# --- Lead scoring ------------------------------------------------------------
# Weights sum to exactly 100 so the score is a 0-100 score.
SCORING_WEIGHTS: dict[str, int] = {
    "stage": 15,
    "company_fit": 15,
    "ai_maturity": 12,
    "likely_pain": 12,
    "budget": 12,
    "urgency": 10,
    "regulated_fit": 10,
    "accessibility": 8,
    "icp_match": 6,
}
assert sum(SCORING_WEIGHTS.values()) == 100

HOT_THRESHOLD = 70
WARM_THRESHOLD = 45

# --- Steady-state targets (documented in README) -----------------------------
WEEKLY_TARGETS: dict[str, int] = {"accounts": 20, "conversations": 5, "qualified": 2}
MONTHLY_TARGETS: dict[str, tuple[int, int]] = {"proposals": (3, 5), "wins": (1, 2)}
