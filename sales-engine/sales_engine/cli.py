"""Command-line interface for the sales engine.

Usage: `python -m sales_engine <command>` (or `uv run sales-engine <command>`).
Run `python -m sales_engine --help` for the full command list.
"""

from __future__ import annotations

import argparse
import os
import sqlite3
import sys
from typing import Any, Sequence

from sales_engine import __version__, db, domain, llm, scoring
from sales_engine.agents import (
    analytics,
    content as content_agent,
    crm,
    discovery as discovery_agent,
    outreach as outreach_agent,
    qualification as qualification_agent,
    research as research_agent,
    website as website_agent,
)
from sales_engine.seed import DEFAULT_ACCOUNTS_BY_ICP, seed_data


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="sales-engine",
        description="Local-first AI sales operating system (v1).",
    )
    parser.add_argument("--db", default=None, help="SQLite database path (default: SALES_ENGINE_DB or data/sales_engine.db)")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("init", help="create the schema (idempotent)")
    p_seed = sub.add_parser("seed", help="load synthetic demo data (--reset clears existing data)")
    p_seed.add_argument("--accounts", type=int, default=None, help="total accounts to generate (default 28)")
    p_seed.add_argument("--seed", type=int, default=42, help="random seed for deterministic data")
    p_seed.add_argument("--reset", action="store_true", help="drop all existing tables first")

    p_disc = sub.add_parser("discover", help="discover/import candidate accounts (ICP A/B/C)")
    p_disc.add_argument("--icp", choices=["A", "B", "C"], default=None)
    p_disc.add_argument("--count", type=int, default=10)
    p_disc.add_argument("--csv", default=None, help="import from a CSV file instead of the mock provider")
    p_disc.add_argument("--synthetic", action="store_true", help="mark CSV-imported rows as synthetic demo data")

    p_acct = sub.add_parser("add-account", help="manually add an account")
    _add_account_args(p_acct)

    p_contact = sub.add_parser("add-contact", help="manually add a contact to an account")
    p_contact.add_argument("--account", type=int, required=True)
    p_contact.add_argument("--name", required=True)
    p_contact.add_argument("--title", default=None)
    p_contact.add_argument("--role", choices=domain.ROLES, default="OTHER")
    p_contact.add_argument("--email", default=None)
    p_contact.add_argument("--linkedin", default=None)
    p_contact.add_argument("--accessibility", type=int, default=2, help="0 (hard) to 4 (easy)")
    p_contact.add_argument("--decision-maker", action="store_true")

    p_opp = sub.add_parser("add-opportunity", help="manually add an opportunity")
    p_opp.add_argument("--account", type=int, required=True)
    p_opp.add_argument("--title", default=None)
    p_opp.add_argument("--stage", choices=domain.STAGES, default="identified")
    p_opp.add_argument("--icp", choices=["A", "B", "C"], default=None)
    p_opp.add_argument("--engagement", choices=list(domain.OFFERS), default=None)
    p_opp.add_argument("--trigger", default=None)
    p_opp.add_argument("--decision-maker", default=None)
    p_opp.add_argument("--contact", type=int, default=None)
    p_opp.add_argument("--source", choices=domain.SOURCES, default=None)
    p_opp.add_argument("--monthly-value", type=int, default=None)
    p_opp.add_argument("--urgency", type=int, default=1, help="0-4")
    p_opp.add_argument("--budget", choices=["unknown", "allocated", "approved", "none"], default="unknown")

    p_qual = sub.add_parser("qualify", help="score opportunities against the ICPs")
    p_qual.add_argument("--account", type=int, default=None, help="score only this account's opportunities")
    p_qual.add_argument("--all", action="store_true", help="score every open opportunity")

    p_res = sub.add_parser("research", help="build an account brief for an opportunity")
    p_res.add_argument("--opportunity", type=int, required=True)
    p_res.add_argument("--llm", action="store_true", help="try the local LLM for the narrative")

    p_out = sub.add_parser("outreach", help="draft a personalized LinkedIn/email message (one-off)")
    p_out.add_argument("--opportunity", type=int, required=True)
    p_out.add_argument("--channel", choices=domain.CHANNELS, default="linkedin")
    p_out.add_argument("--llm", action="store_true", help="use the local LLM when available")
    p_out.add_argument("--force-llm", action="store_true", help="fail instead of falling back to templates")

    p_stage = sub.add_parser("stage", help="transition an opportunity to a new stage")
    p_stage.add_argument("--opportunity", type=int, required=True)
    p_stage.add_argument("--to", dest="to_stage", choices=domain.STAGES, required=True)
    p_stage.add_argument("--note", default="")

    p_log = sub.add_parser("log", help="append an activity entry to an opportunity")
    p_log.add_argument("--opportunity", type=int, required=True)
    p_log.add_argument("--note", required=True)

    p_cont = sub.add_parser("content", help="generate/list content ideas mapped to ICP triggers")
    p_cont.add_argument("--icp", choices=["A", "B", "C"], default=None)
    p_cont.add_argument("--generate", action="store_true", help="insert content ideas")
    p_cont.add_argument("--list", action="store_true", help="list stored content ideas")
    p_cont.add_argument("--llm", action="store_true")

    p_web = sub.add_parser("website", help="website alignment notes (advisory, read-only)")
    p_web.add_argument("--generate", action="store_true")
    p_web.add_argument("--list", action="store_true")
    p_web.add_argument("--llm", action="store_true")

    sub.add_parser("analytics", help="pipeline report, funnel, target-vs-actual")

    p_status = sub.add_parser("status", help="quick pipeline overview")
    p_status.add_argument("--days", type=int, default=None)

    sub.add_parser("llm-status", help="show local-LLM configuration state")

    sub.add_parser("version", help="print the version")
    return parser


def _add_account_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--name", required=True)
    parser.add_argument("--domain", default=None)
    parser.add_argument("--industry", default=None)
    parser.add_argument("--country", default=None)
    parser.add_argument("--region", default=None)
    parser.add_argument("--employees", type=int, default=None)
    parser.add_argument("--revenue", type=int, default=None)
    parser.add_argument("--engineering", action="store_true")
    parser.add_argument("--maturity", type=int, default=0, help="0-4")
    parser.add_argument("--icp", choices=["A", "B", "C"], default=None)
    parser.add_argument("--source", choices=domain.SOURCES, default="other")
    parser.add_argument("--url", default=None)
    parser.add_argument("--notes", default=None)
    parser.add_argument("--synthetic", action="store_true", help="mark as demo/synthetic data")


def _open_db(args: argparse.Namespace) -> sqlite3.Connection:
    return db.init_db(args.db)


def cmd_init(_args: argparse.Namespace) -> int:
    conn = _open_db(_args)
    version = db.row(conn, "SELECT MAX(version) AS v FROM schema_version")
    print(f"Schema ready. schema_version={version['v'] if version else 0} at {conn}")
    conn.close()
    return 0


def cmd_seed(args: argparse.Namespace) -> int:
    conn = _open_db(args)
    if args.reset:
        conn.executescript("DROP TABLE IF EXISTS analytics_events")
        conn.executescript("DROP TABLE IF EXISTS website_notes")
        conn.executescript("DROP TABLE IF EXISTS content_items")
        conn.executescript("DROP TABLE IF EXISTS outreach_messages")
        conn.executescript("DROP TABLE IF EXISTS pipeline_events")
        conn.executescript("DROP TABLE IF EXISTS opportunities")
        conn.executescript("DROP TABLE IF EXISTS contacts")
        conn.executescript("DROP TABLE IF EXISTS accounts")
        conn.executescript("DROP TABLE IF EXISTS schema_version")
        conn.commit()
        from sales_engine import db as db_mod  # re-run migrations on the empty file

        db_mod.migrate(conn)
    counts = seed_data(conn, seed=args.seed) if args.accounts is None else _seed_with_total(conn, args)
    _print_seed_summary(counts)
    conn.close()
    return 0


def _seed_with_total(conn: sqlite3.Connection, args: argparse.Namespace) -> dict[str, Any]:
    total = args.accounts
    base = dict(DEFAULT_ACCOUNTS_BY_ICP)
    scale = total / sum(base.values())
    scaled = {icp: max(1, int(round(count * scale))) for icp, count in base.items()}
    return seed_data(conn, accounts_by_icp=scaled, seed=args.seed)


def _print_seed_summary(counts: dict[str, Any]) -> None:
    stages = counts["stage_counts"]
    print(f"Seeded synthetic demo data (seed={counts['seed']}) — clearly marked is_synthetic=1.")
    print(f"  accounts: {counts['accounts']}  contacts: {counts['contacts']}  opportunities: {counts['opportunities']}")
    print(f"  content items: {counts['content_items']}  website notes: {counts['website_notes']}  visit events: {counts['analytics_events']}")
    print("  stages: " + ", ".join(f"{s}:{stages[s]}" for s in domain.STAGES if stages[s]))
    print("Next: python -m sales_engine qualify --all")


def cmd_discover(args: argparse.Namespace) -> int:
    conn = _open_db(args)
    if args.csv:
        provider = discovery_agent.CsvLeadProvider(args.csv)
        rows = provider.fetch(icp=args.icp, limit=args.count)
        imported = discovery_agent.import_rows(
            conn, rows, default_icp=args.icp, synthetic=args.synthetic
        )
        print(f"Imported {imported} accounts from {args.csv} (synthetic={args.synthetic}).")
    else:
        provider = discovery_agent.MockLeadProvider(seed=42)
        imported, note = discovery_agent.discover(conn, provider, icp=args.icp, limit=args.count)
        print(note)
    conn.close()
    return 0


def cmd_add_account(args: argparse.Namespace) -> int:
    conn = _open_db(args)
    account_id = discovery_agent.add_account(
        conn,
        name=args.name,
        domain_name=args.domain,
        industry=args.industry,
        country=args.country,
        region=args.region,
        employee_count=args.employees,
        revenue_eur=args.revenue,
        engineering_capability=args.engineering,
        ai_maturity=args.maturity,
        icp=args.icp,
        source=args.source,
        url=args.url,
        notes=args.notes,
        is_synthetic=args.synthetic,
    )
    print(f"Added account #{account_id}: {args.name}")
    conn.close()
    return 0


def cmd_add_contact(args: argparse.Namespace) -> int:
    conn = _open_db(args)
    contact_id = db.execute(
        conn,
        "INSERT INTO contacts (account_id, name, title, role, email, linkedin_url, accessibility, is_decision_maker, created_at) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (args.account, args.name, args.title, args.role, args.email, args.linkedin,
         args.accessibility, int(args.decision_maker), db.utc_now_iso()),
    )
    conn.commit()
    print(f"Added contact #{contact_id}: {args.name} (account {args.account})")
    conn.close()
    return 0


def cmd_add_opportunity(args: argparse.Namespace) -> int:
    conn = _open_db(args)
    account = db.row(conn, "SELECT * FROM accounts WHERE id = ?", (args.account,))
    if account is None:
        print(f"error: no account with id {args.account}")
        return 1
    title = args.title or f"{account['name']} — opportunity"
    opp_id = crm.create_opportunity(
        conn,
        account_id=args.account,
        title=title,
        icp=args.icp,
        stage=args.stage,
        engagement=args.engagement,
        problem_trigger=args.trigger,
        decision_maker=args.decision_maker,
        contact_id=args.contact,
        source=args.source,
        expected_monthly_value_eur=args.monthly_value,
        urgency=args.urgency,
        budget_status=args.budget,
    )
    print(f"Added opportunity #{opp_id} for account {account['name']} (stage={args.stage})")
    conn.close()
    return 0


def cmd_qualify(args: argparse.Namespace) -> int:
    conn = _open_db(args)
    if not args.all and args.account is None:
        print("error: pass --all or --account <id>")
        return 1
    rows = qualification_agent.qualify_open(conn, account_id=args.account)
    print(f"Qualified {len(rows)} open opportunity(ies):")
    for opp in rows:
        bucket = scoring.bucket_for(int(opp["score"]))
        print(f"  #{opp['id']:<4} {opp['score']:>3} {bucket:<4} "
              f"{opp['account_name'][:40]:<40} {opp['stage']:<11} {opp['icp']}")
    conn.close()
    return 0


def cmd_research(args: argparse.Namespace) -> int:
    conn = _open_db(args)
    brief = research_agent.build_brief(conn, args.opportunity, use_llm=args.llm)
    print(research_agent.render_brief_text(brief))
    conn.close()
    return 0


def cmd_outreach(args: argparse.Namespace) -> int:
    conn = _open_db(args)
    message = outreach_agent.draft_message(
        conn, args.opportunity, channel=args.channel, use_llm=args.llm, strict=args.force_llm
    )
    print(f"Outreach message #{message['id']} for {message['company']} ({message['channel']}, engine={message['engine']})")
    if message["note"]:
        print(f"  note: {message['note']}")
    if message["subject"]:
        print(f"  subject: {message['subject']}")
    print()
    print(message["body"])
    conn.close()
    return 0


def cmd_stage(args: argparse.Namespace) -> int:
    conn = _open_db(args)
    try:
        opp = crm.move_stage(conn, args.opportunity, args.to_stage, note=args.note)
    except crm.PipelineError as exc:
        print(f"error: {exc}")
        return 1
    print(f"Opportunity #{opp['id']} → {opp['stage']} (probability {opp['probability']:.0%})")
    conn.close()
    return 0


def cmd_log(args: argparse.Namespace) -> int:
    conn = _open_db(args)
    try:
        event_id = crm.log_activity(conn, args.opportunity, args.note)
    except ValueError as exc:
        print(f"error: {exc}")
        return 1
    print(f"Logged activity #{event_id} on opportunity #{args.opportunity}")
    conn.close()
    return 0


def cmd_content(args: argparse.Namespace) -> int:
    conn = _open_db(args)
    if args.generate:
        count = content_agent.generate_content(conn, icp=args.icp, use_llm=args.llm)
        print(f"Generated {count} content idea(s).")
    if args.list or not args.generate:
        for item in content_agent.list_content(conn, icp=args.icp):
            print(f"  #{item['id']:<3} [{item['content_type']:<11}] ICP {item['icp'] or '-'} {item['title']}")
            if item["keywords"]:
                print(f"        keywords: {item['keywords']}")
    conn.close()
    return 0


def cmd_website(args: argparse.Namespace) -> int:
    conn = _open_db(args)
    if args.generate:
        count = website_agent.generate_website_notes(conn, use_llm=args.llm)
        print(f"Generated {count} website alignment note(s).")
    if args.list or not args.generate:
        for note in website_agent.list_website_notes(conn):
            print(f"  [{note['section']}] {note['title']} (funnel: {note['funnel_stage']})")
            print(f"      {note['note']}")
    conn.close()
    return 0


def cmd_analytics(args: argparse.Namespace) -> int:
    conn = _open_db(args)
    print(analytics.render_report(conn))
    conn.close()
    return 0


def cmd_status(args: argparse.Namespace) -> int:
    conn = _open_db(args)
    stages = analytics.stage_distribution(conn)
    pv = analytics.pipeline_value(conn)
    open_count = sum(n for stage, n in stages.items() if stage not in ("won", "lost"))
    print("SALES ENGINE STATUS")
    print(f"  accounts:      {analytics.count_by(conn, 'accounts', 'icp')}")
    print(f"  open opps:     {open_count}  (won: {stages['won']}, lost: {stages['lost']})")
    print(f"  pipeline raw:  €{pv['total_raw']:,.0f}  weighted: €{pv['total_weighted']:,.0f}")
    print(f"  LLM:           {_llm_status_line()}")
    conn.close()
    return 0


def _llm_status_line() -> str:
    if llm.is_configured():
        return f"{llm.configured_base_url()} (model {llm.configured_model()})"
    return "template fallback (set SALES_ENGINE_LLM_BASE_URL to enable a local model)"


def cmd_llm_status(_args: argparse.Namespace) -> int:
    print("LOCAL-LLM CONFIGURATION (all optional — offline mode works without any of these)")
    print(f"  {llm.ENV_BASE_URL:<28} {os.environ.get(llm.ENV_BASE_URL, '(unset → template fallback)')}")
    print(f"  {llm.ENV_MODEL:<28} {llm.configured_model()}")
    print(f"  {llm.ENV_API_KEY:<28} {'set' if os.environ.get(llm.ENV_API_KEY) else '(unset)'}")
    print(f"  {llm.ENV_REQUIRE:<28} {os.environ.get(llm.ENV_REQUIRE, '(unset → fall back to templates)')}")
    print(f"  {llm.ENV_TIMEOUT:<28} {llm.configured_timeout()}s")
    return 0


def cmd_version(_args: argparse.Namespace) -> int:
    print(f"sales-engine {__version__}")
    return 0


COMMANDS: dict[str, Any] = {
    "init": cmd_init,
    "seed": cmd_seed,
    "discover": cmd_discover,
    "add-account": cmd_add_account,
    "add-contact": cmd_add_contact,
    "add-opportunity": cmd_add_opportunity,
    "qualify": cmd_qualify,
    "research": cmd_research,
    "outreach": cmd_outreach,
    "stage": cmd_stage,
    "log": cmd_log,
    "content": cmd_content,
    "website": cmd_website,
    "analytics": cmd_analytics,
    "status": cmd_status,
    "llm-status": cmd_llm_status,
    "version": cmd_version,
}


def main(argv: Sequence[str] | None = None) -> int:
    parser = _build_parser()
    args = parser.parse_args(argv)
    handler = COMMANDS[args.command]
    try:
        return handler(args)
    except llm.LlmUnavailableError as exc:
        print(f"error: LLM required but unavailable: {exc}", file=sys.stderr)
        return 1
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    except crm.PipelineError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
