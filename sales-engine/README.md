# Sales Engine — Local-First AI Sales Operating System (v1)

A self-contained, offline-first sales pipeline for a **fractional AI/technology
leadership consulting practice** (Dr. Jurica Seva, Berlin, EU/EMEA). It encodes
the offers, ICPs, scoring model, pipeline stages, funnel metrics, content
mapping and website alignment notes for one consultant selling **outcomes and
mandates, not hours**.

Everything runs with **zero external API keys and zero runtime dependencies**
(Python stdlib + SQLite). Local LLM support is opt-in via environment variables
and falls back to deterministic templates when no endpoint is configured.

```bash
cd sales-engine
uv sync --extra dev        # installs pytest (dev-only)
make init && make seed     # create schema + load synthetic demo data
make test                  # 58 tests, fully offline
make demo                  # seed -> qualify -> outreach -> analytics in one shot
```

---

## Business context encoded in this system

| Offer | Scope | Price |
|---|---|---|
| **AI Transformation Diagnostic** | ~2 weeks | €7,500–12,500 one-off |
| **Fractional CAIO / VP AI** | 1 day/week · 2 days/week | €7–9k/mo · €13–16k/mo |
| **Fractional CTO** | monthly retainer | €7–16k/mo |
| **AI Transformation / Platform Leadership Mandate** | 3–6 months | €20–30k/mo |

Three ICP pipelines (each account belongs to one):

- **ICP A — European growth companies** (50–500 staff, €10–150m revenue, some
  engineering capability, nobody owns AI). Buyers: CEO/CTO/COO.
  Trigger: *"six AI initiatives, no coherent strategy."*
- **ICP B — Regulated healthcare / healthtech.** Buyers: CEO/CTO/CPO.
  Trigger: *"get GenAI into production without regulatory/clinical/reliability
  problems."* This is the consultant's genuine moat (regulated GenAI delivery).
- **ICP C — PE-backed companies.** Buyers: operating partner/CTO/portfolio CEO.
  Trigger: *AI opportunity + architecture assessment → 90-day transformation.*

Pipeline stages: `identified → researched → contacted → engaged → discovery →
qualified → proposal → won/lost` (won/lost are terminal; transitions are
forward-only and recorded in `pipeline_events`).

Steady-state target documented and tracked by the Analytics Agent:
**20 accounts/week → 5 meaningful conversations → 2 qualified opportunities →
3–5 proposals/month → 1–2 wins/month.**

---

## Install & run

Requires Python ≥ 3.12 and `uv`.

```bash
cd sales-engine
uv sync --extra dev
uv run python -m sales_engine init        # idempotent schema creation
uv run python -m sales_engine seed --reset # deterministic synthetic demo data
```

`make test`, `make seed`, `make demo`, `make llm-status` are convenience
targets (see `Makefile`). The database defaults to `data/sales_engine.db`;
override with `--db <path>` or the `SALES_ENGINE_DB` environment variable.

## CLI reference

Run `python -m sales_engine <command> --help` for every command's flags.

| Command | Purpose |
|---|---|
| `init` | Create/verify the versioned schema |
| `seed [--accounts N] [--reset] [--seed N]` | Load synthetic demo data |
| `discover [--icp A/B/C] [--count N] [--csv PATH] [--synthetic]` | Lead Discovery Agent: mock generator, CSV import, or configured live API |
| `add-account` · `add-contact` · `add-opportunity` | Manual entry |
| `qualify [--all | --account ID]` | Qualification Agent: score open opportunities (hot/warm/cold + reasons) |
| `research --opportunity ID [--llm]` | Research Agent: account brief (context, likely AI problems, executives, angle) |
| `outreach --opportunity ID [--channel linkedin/email] [--llm] [--force-llm]` | Outreach Agent: one personalized message, stored |
| `stage --opportunity ID --to STAGE [--note]` | CRM Agent: forward stage transitions (won/lost = terminal) |
| `log --opportunity ID --note "…"` | CRM Agent: append an activity entry |
| `content [--generate] [--icp A/B/C] [--llm]` | Content Agent: map ICP triggers → content ideas with SEO/GEO keywords |
| `website [--generate] [--list] [--llm]` | Website Agent: read-only alignment notes per funnel stage |
| `analytics` | Analytics Agent: funnel, pipeline value, target-vs-actual report |
| `status` · `llm-status` · `version` | Quick overview / LLM config / version |

---

## Lead scoring model (0–100)

Weights sum to exactly 100. Each component scores 0.0–1.0 and is multiplied by
its weight:

| Component | Weight | What it measures |
|---|---|---|
| `stage` | 15 | How far the opportunity has progressed |
| `company_fit` | 15 | Size/revenue/engineering fit against the target ICP band |
| `ai_maturity` | 12 | Sweet spot: low maturity (0–2) — nobody owns AI yet |
| `likely_pain` | 12 | Signal strength of the problem/trigger text (ICP keyword match) |
| `budget` | 12 | Expected value vs. offer price range + budget status |
| `urgency` | 10 | 0–4 urgency rating |
| `regulated_fit` | 10 | ICP B: regulated-industry moat (healthcare → 1.0) |
| `accessibility` | 8 | Decision-maker accessibility (0–4) |
| `icp_match` | 6 | Account ICP == opportunity ICP (cross-pipeline pursued deals are penalized) |

Buckets: **≥ 70 hot · ≥ 45 warm · < 45 cold**. The scoring logic is pure,
deterministic and unit-tested in `tests/test_scoring.py`; the Qualification
Agent persists `score` + `score_reason` on each opportunity.

## Funnel metrics

`visitor → lead → conversation → qualified → proposal → won`:

- `visitor` — `analytics_events` of type `visit` (website/landing traffic)
- `lead` — target accounts in the CRM
- `conversation` — opportunities at/after `engaged`
- `qualified` / `proposal` / `won` — opportunities at/after those stages

The Analytics Agent also reports weighted pipeline value
(`Σ expected_monthly_value_eur × stage probability`, probability auto-set per
stage), value by stage/ICP/engagement, and target-vs-actual for the weekly and
monthly steady-state targets.

---

## Local-LLM integration vs offline fallback

All text-generation (account briefs, outreach drafting, content/website idea
rewrites) flows through one abstraction in `sales_engine/llm.py`:

| Environment variable | Default | Meaning |
|---|---|---|
| `SALES_ENGINE_LLM_BASE_URL` | `http://localhost:11434/v1` | OpenAI-compatible endpoint (Ollama's `/v1` path) |
| `SALES_ENGINE_LLM_MODEL` | `llama3.1` | Model name, e.g. `qwen2.5`, `mixtral` |
| `SALES_ENGINE_LLM_API_KEY` | `ollama` | Bearer token (required for hosted providers) |
| `SALES_ENGINE_LLM_TIMEOUT` | `60` | Request timeout (seconds) |
| `SALES_ENGINE_LLM_REQUIRE` | unset | `1` = hard-fail instead of falling back |

- **Unset endpoint →** every command works offline using deterministic
  rule-based templates. Drafted content is tagged `engine=template`.
- **Endpoint set + reachable →** classification/summarization/drafting use the
  local model (tagged `engine=llm`). Example:

  ```bash
  export SALES_ENGINE_LLM_BASE_URL=http://localhost:11434/v1
  export SALES_ENGINE_LLM_MODEL=llama3.1
  uv run python -m sales_engine outreach --opportunity 1 --channel email --llm
  ```

- **Endpoint set but unreachable →** automatic template fallback with a visible
  `note`. Use `--force-llm` (or `SALES_ENGINE_LLM_REQUIRE=1`) to fail loudly
  instead when a real model is mandatory.

The same pattern applies to Lead Discovery: live company/contact enrichment is
only attempted when `SALES_ENGINE_LEAD_API_URL` (and optionally
`SALES_ENGINE_LEAD_API_KEY`) are configured; otherwise the `mock` provider and
CSV import cover discovery.

---

## Demo data

`seed` generates a deterministic dataset (default seed 42): 28 accounts across
ICP A/B/C, 40 contacts, 28 opportunities spread over all stages (with historical
pipeline events and won/lost reasons), 15 content ideas, 5 website notes, and
~140 synthetic visit events. **Every row is clearly synthetic** —
`accounts.is_synthetic = 1` and notes state it. No real client names are used or
implied. `make demo` runs the full offline smoke:

```text
seed --reset → qualify --all → outreach --opportunity 1 --channel linkedin → analytics
```

---

## Architecture

```
sales-engine/
  Makefile, pyproject.toml
  sales_engine/
    domain.py          # stages, offers, ICPs, sources, scoring weights, targets
    schema.py          # versioned SQLite DDL (schema_version table)
    db.py              # connection + migrations + timestamp helpers
    scoring.py         # pure lead-scoring functions
    llm.py             # LLM abstraction with template fallback
    seed.py            # deterministic synthetic demo data
    cli.py / __main__.py
    agents/
      discovery.py     # Lead Discovery (mock / CSV / opt-in live API)
      qualification.py # Qualification
      research.py      # Research (account brief)
      outreach.py      # Outreach (one-off personalized messages)
      crm.py           # CRM (pipeline transitions, activity log)
      content.py       # Content (ICP-trigger → ideas + SEO/GEO keywords)
      website.py       # Website (read-only alignment notes)
      analytics.py     # Analytics (funnel, pipeline value, targets)
  tests/               # 58 tests: schema, scoring, pipeline, analytics, LLM
```

Data model tables: `schema_version`, `accounts`, `contacts`, `opportunities`,
`pipeline_events` (transition + activity log), `outreach_messages`,
`content_items`, `website_notes`, `analytics_events`.

---

## 30-day rollout plan

**Week 1 — Foundations (apply to Fractionista, Malt Strategy, Outvise):**
1. Refresh all three profiles to the platform positioning in
   `market/platform_strategy.md` (Fractional CAIO / AI Transformation
   Executive; never lead with an hourly rate).
2. Import the first ~30 target accounts into ICP A/B via
   `discover --icp A --count 20` and `discover --icp B --count 10`; add known
   accounts manually with `add-account` (or CSV).
3. Run `qualify --all` daily; work the hot bucket first.
4. Activate the first outreach sequence on Malt Strategy (3 touchpoints/week:
   intro → trigger-specific insight → short diagnostic-call CTA).

**Week 2 — ICP A account base:**
5. Build the 100-account DACH/EU target list for ICP A (50–500 staff, €10–150m,
   some engineering, no AI owner). Half via `discover` mock suggestions
   (replace with your real list), half via LinkedIn outbound + recruiter
   referrals.
6. Wire website analytics into `analytics_events` (visits) so the
   visitor→lead leg of the funnel is real.

**Week 3 — ICP B moat + outreach at volume:**
7. Add 30 regulated healthcare/healthtech accounts (ICP B); score and prioritize
   by `regulated_fit` — the moat.
8. Run the outreach cadence: 5 conversations/week → 2 qualified/week. Log every
   interaction with `stage`/`log` so the Analytics Agent's target-vs-actual is
   real.
9. Publish weekly content from `content --generate` (article + LinkedIn
   repurposing per the 12-week content plan) and push it to the website.

**Week 4 — ICP C + pipeline hygiene:**
10. Approach 1–2 PE operating partners / platforms (Outvise, A.Team, SCAIO)
    with the portfolio AI-assessment framing (ICP C).
11. Review the `analytics` report: conversion by ICP, source ROI, pipeline
    value by offer. Kill sources below target; double down on the top 2.
12. Convert 3–5 opportunities to `proposal`; drive 1–2 to `won`; record
    won/lost reasons for the monthly review.

## Deliberately deferred to v2

- **Orchestration/automation** (scheduling outreach, webhooks, email sending —
  v1 drafts messages and stores them; sending stays in the consultant's hands).
- **Real enrichment providers** beyond the opt-in API stub (Clearbit-style
  company/contact data).
- **Opportunity reopening** after `won`/`lost`, deal-room fields, multi-contact
  sequencing per account.
- **Forecasting** beyond stage-weighted pipeline value (e.g., weighted by ICP
  win-rate history).
- **Website editing** — the Website Agent is advisory by design.

## Decisions that need the owner's input

- **Budget-status semantics**: `allocated` vs `approved` currently shift budget
  scoring by +0.10/+0.15. Confirm the definitions you want used in scoring.
- **Diagnostic expected value**: a one-off €7.5–12.5k diagnostic is stored in
  `expected_monthly_value_eur` as a total; the Analytics report treats it as
  monthly value. Confirm whether diagnostics should be excluded from the
  monthly pipeline-value number.
- **ICP C sourcing**: no direct provider channel is encoded yet (only
  Outvise/A.Team/SCAIO notes in the README). Tell me the real channels and I'll
  bake them into discovery weights.
- **Weekly conversation definition**: "meaningful conversations" currently maps
  to stage ≥ `engaged`. If you count `contacted` (replies) instead, it's a
  one-line change in `analytics.py`.
