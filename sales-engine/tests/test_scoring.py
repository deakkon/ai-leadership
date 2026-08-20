"""Lead-scoring model unit tests (deterministic, no DB needed)."""

from __future__ import annotations

from tests.conftest import account, contact, opportunity

from sales_engine import scoring


def _score(
    *,
    account_overrides: dict[str, object] | None = None,
    opp_overrides: dict[str, object] | None = None,
) -> int:
    score, _bucket, _reasons = scoring.score_opportunity(
        account(**(account_overrides or {})),
        opportunity(**(opp_overrides or {})),
        [contact()],
    )
    return score


def test_strong_opportunity_scores_hot():
    score, bucket, _reasons = scoring.score_opportunity(
        account(
            employee_count=200, revenue_eur=80_000_000, engineering_capability=1,
            ai_maturity=1, icp="A",
        ),
        opportunity(
            stage="proposal", engagement="fractional_caio_2d",
            problem_trigger="Six AI initiatives, no coherent strategy.",
            expected_monthly_value_eur=15_000, urgency=4, budget_status="approved",
        ),
        [contact(accessibility=4)],
    )
    assert bucket == "hot"
    assert score >= scoring.domain.HOT_THRESHOLD


def test_weak_opportunity_scores_cold():
    score, bucket, _reasons = scoring.score_opportunity(
        account(
            employee_count=8_000, revenue_eur=2_000_000_000, engineering_capability=0,
            ai_maturity=4, icp="A",
        ),
        opportunity(
            stage="identified", icp="B", engagement=None,
            problem_trigger=None, expected_monthly_value_eur=None,
            urgency=0, budget_status="none",
        ),
        [],
    )
    assert bucket == "cold"
    assert score < scoring.domain.WARM_THRESHOLD


def test_score_stays_within_zero_hundred():
    for _ in range(25):
        score, _bucket, _reasons = scoring.score_opportunity(
            account(employee_count=300, revenue_eur=100_000_000),
            opportunity(stage="won"),
            [contact()],
        )
        assert 0 <= score <= 100


def test_higher_urgency_raises_score():
    low = _score(opp_overrides={"urgency": 0})
    high = _score(opp_overrides={"urgency": 4})
    assert high > low


def test_better_decision_maker_accessibility_raises_score():
    low = scoring.score_opportunity(account(), opportunity(), [contact(accessibility=0)])[0]
    high = scoring.score_opportunity(account(), opportunity(), [contact(accessibility=4)])[0]
    assert high > low


def test_no_contacts_penalizes_accessibility():
    with_contact = scoring.score_opportunity(account(), opportunity(), [contact(accessibility=3)])[0]
    without = scoring.score_opportunity(account(), opportunity(), [])[0]
    assert with_contact > without


def test_ai_maturity_sweet_spot_beats_mature():
    sweet = _score(account_overrides={"ai_maturity": 1})
    mature = _score(account_overrides={"ai_maturity": 4})
    assert sweet > mature


def test_icp_b_regulated_industry_moat():
    regulated = scoring.score_opportunity(
        account(industry="healthcare", icp="B"),
        opportunity(icp="B", engagement="mandate",
                    problem_trigger="Regulatory and clinical validation questions block GenAI prototypes."),
        [contact()],
    )[0]
    non_regulated = scoring.score_opportunity(
        account(industry="software", icp="B"),
        opportunity(icp="B", engagement="mandate",
                    problem_trigger="Regulatory and clinical validation questions block GenAI prototypes."),
        [contact()],
    )[0]
    assert regulated > non_regulated


def test_company_size_fit_banding():
    perfect = _score(
        account_overrides={"employee_count": 200, "revenue_eur": 80_000_000}
    )
    too_big = _score(
        account_overrides={"employee_count": 5_000, "revenue_eur": 900_000_000}
    )
    assert perfect > too_big


def test_icp_match_penalizes_cross_pipeline():
    aligned = scoring.score_opportunity(account(icp="A"), opportunity(icp="A"), [contact()])[0]
    misaligned = scoring.score_opportunity(account(icp="A"), opportunity(icp="C"), [contact()])[0]
    assert aligned > misaligned


def test_pain_signal_from_trigger_keywords():
    strong = scoring.score_opportunity(
        account(),
        opportunity(problem_trigger="Six AI initiatives with no strategy, ownership or governance; pilots everywhere."),
        [contact()],
    )[0]
    weak = scoring.score_opportunity(account(), opportunity(problem_trigger=None), [contact()])[0]
    assert strong > weak


def test_bucket_for_thresholds():
    assert scoring.bucket_for(70) == "hot"
    assert scoring.bucket_for(69) == "warm"
    assert scoring.bucket_for(45) == "warm"
    assert scoring.bucket_for(44) == "cold"


def test_weights_sum_to_100():
    assert sum(scoring.domain.SCORING_WEIGHTS.values()) == 100


def test_stage_progression_increases_score():
    identified = scoring.score_opportunity(
        account(), opportunity(stage="identified"), [contact()]
    )[0]
    proposal = scoring.score_opportunity(
        account(), opportunity(stage="proposal"), [contact()]
    )[0]
    assert proposal > identified
