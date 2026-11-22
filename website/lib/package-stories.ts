import type { packages } from "./agency";

type PackageSlug = (typeof packages)[number]["slug"];
export type PackageStory = {
  phases: { title: string; description: string; output: string }[];
  examples: {
    title: string;
    problem: string;
    approach: string;
    outcome: string;
  }[];
};

export const packageStories: Record<PackageSlug, PackageStory> = {
  discovery: {
    phases: [
      {
        title: "Frame the decision",
        description:
          "Name the business owner, the workflow and the question that needs an answer. Agree the limits of the investigation.",
        output: "A shared decision question and evidence checklist.",
      },
      {
        title: "Examine the real workflow",
        description:
          "Use up to three interviews and representative examples to understand inputs, exceptions, data access and existing tools.",
        output: "A workflow map with constraints and evidence gaps.",
      },
      {
        title: "Compare the options",
        description:
          "Assess existing software, conventional automation and a custom build. Make feasibility, cost assumptions and risks explicit.",
        output: "A build, buy, investigate or stop recommendation.",
      },
      {
        title: "Agree the first release",
        description:
          "Review a bounded brief, acceptance scenarios and delivery estimate. You can take the brief to your own team or another supplier.",
        output:
          "A decision brief and priced next step, with one consolidated revision.",
      },
    ],
    examples: [
      {
        title: "Find the right document workflow",
        problem:
          "Operations staff copy information from incoming documents, but exceptions make a simple automation risky.",
        approach:
          "Inspect representative documents, map exception handling and compare rules, existing tools and model-assisted extraction.",
        outcome:
          "A scoped recommendation, evaluation examples and a first-release proposal—not a production system.",
      },
      {
        title: "Choose before building an AI assistant",
        problem:
          "A team wants an internal assistant but has not established whether existing licenses already solve the problem.",
        approach:
          "Assess one knowledge workflow, access requirements and answer-quality expectations against buy and build options.",
        outcome:
          "A go/no-go decision with data dependencies and acceptance criteria.",
      },
      {
        title: "Unblock an ambiguous product feature",
        problem:
          "A product team has an integration idea with unclear dependencies and no agreed release boundary.",
        approach:
          "Review the user journey, available APIs and failure cases with the product and engineering owners.",
        outcome:
          "A bounded technical brief and delivery estimate the team can act on.",
      },
    ],
  },
  build: {
    phases: [
      {
        title: "Agree what good looks like",
        description:
          "Confirm one release, its users, integrations and acceptance scenarios. Set access dates and identify the client decision owner.",
        output: "A signed scope, release plan and acceptance criteria.",
      },
      {
        title: "Build in small increments",
        description:
          "I direct architecture. Agents and selected specialists implement bounded tasks in your repository, with tests and human review.",
        output: "Working increments and visible implementation evidence.",
      },
      {
        title: "Test the real operating conditions",
        description:
          "Check the agreed behavior, failure paths and integrations. For AI workflows, evaluate representative examples, review effort and operating costs.",
        output: "Acceptance evidence and resolved in-scope feedback.",
      },
      {
        title: "Release and hand over",
        description:
          "Deploy to the agreed environment, document operations and explain ownership. Define the defect-reporting window and any follow-on support.",
        output: "A release, operating notes and a client handover.",
      },
    ],
    examples: [
      {
        title: "One customer-facing product increment",
        problem:
          "A B2B product needs a self-service onboarding step while its team is committed to other work.",
        approach:
          "Scope one user journey and its integration, then implement and review it against agreed acceptance scenarios.",
        outcome:
          "A deployable product increment in the client's repository. Broader redesign and migration need separate scope.",
      },
      {
        title: "A document-review workflow",
        problem:
          "A team needs to turn incoming documents into structured drafts without losing control over exceptions.",
        approach:
          "Build a bounded ingestion and review flow with evaluations, permissions and a human approval point.",
        outcome:
          "An evaluated workflow with defined fallbacks, usage budgets and operating responsibility.",
      },
      {
        title: "An internal operations tool",
        problem:
          "Staff reconcile data between two systems using spreadsheets and repeated manual checks.",
        approach:
          "Implement one integration and a focused interface for reconciliation and exceptions.",
        outcome:
          "A working tool with tests, deployment notes and handover—not an entire ERP replacement.",
      },
    ],
  },
  partnership: {
    phases: [
      {
        title: "Reserve the right capacity",
        description:
          "Agree a funded roadmap, named product owner, specialist allocation, review time and one active workstream by default.",
        output: "A written capacity agreement and priority backlog.",
      },
      {
        title: "Choose the month's outcomes",
        description:
          "Select valuable increments that fit the allocation. Name dependencies and make trade-offs before committing the work.",
        output: "A monthly outcome plan and release criteria.",
      },
      {
        title: "Deliver, review and demonstrate",
        description:
          "Work through bounded tasks with human architecture and release review. Use weekly demos or progress reviews to expose blockers and evidence.",
        output: "Reviewed increments with tests and documentation.",
      },
      {
        title: "Measure and reprioritize",
        description:
          "Review accepted work, cost, quality and remaining risks. New priorities replace other work or require a revised allocation.",
        output: "A progress review and the next month's priorities.",
      },
    ],
    examples: [
      {
        title: "Keep a product roadmap moving",
        problem:
          "A funded B2B team has a sequence of features and integrations that exceeds its current capacity.",
        approach:
          "Reserve a scoped delivery allocation, agree one active workstream and review progress with the product owner weekly.",
        outcome:
          "A regular cadence of accepted increments within the agreed capacity.",
      },
      {
        title: "Improve an existing AI workflow",
        problem:
          "A live workflow needs better exception handling, evaluation coverage and integration as usage grows.",
        approach:
          "Prioritize reliability and operating improvements alongside a written tooling budget and review cadence.",
        outcome:
          "Measured workflow improvements and updated operating notes. Incident coverage is separately agreed.",
      },
      {
        title: "Extend a successful first release",
        problem:
          "A focused build works, and the client now has a funded backlog of adjacent improvements.",
        approach:
          "Use evidence from the first release to plan subsequent increments and match specialist capacity to the work.",
        outcome:
          "Continuity of technical ownership with explicit monthly priorities and handover knowledge.",
      },
    ],
  },
  leadership: {
    phases: [
      {
        title: "Define the leadership mandate",
        description:
          "Align the executive sponsor on the decisions to own, business objectives, available capacity and existing responsibilities.",
        output: "A written mandate with decision rights and a review cadence.",
      },
      {
        title: "Set direction and priorities",
        description:
          "Compare AI opportunities, architecture and vendor options against business value, data readiness, risk and adoption effort.",
        output: "A prioritized roadmap with explicit assumptions and owners.",
      },
      {
        title: "Guide the organization",
        description:
          "Use weekly leadership sessions to resolve decisions, coordinate specialist input and support team capability within the mandate.",
        output: "Documented decisions, assigned actions and escalation paths.",
      },
      {
        title: "Review outcomes and adapt",
        description:
          "Assess progress, costs and risks monthly. Update priorities and identify what needs a build, internal hiring or separate specialist support.",
        output: "A monthly outcome review and an updated direction.",
      },
    ],
    examples: [
      {
        title: "Give scattered AI experiments a direction",
        problem:
          "Leaders see many demonstrations and tool subscriptions but lack a shared investment priority.",
        approach:
          "Within a defined mandate, assess opportunities and evidence, clarify ownership and agree the next investment decisions.",
        outcome:
          "A prioritized direction, decision cadence and accountable owners. A full organization-wide strategy is separately scoped.",
      },
      {
        title: "Make a build-versus-buy decision",
        problem:
          "A CEO needs to choose between existing enterprise tools, a custom system and adding internal capability.",
        approach:
          "Compare fit, total cost, dependencies, data requirements and exit options with the relevant business and technical owners.",
        outcome:
          "A documented recommendation and the evidence needed for a decision; returns are not guaranteed.",
      },
      {
        title: "Provide a fractional technical lead",
        problem:
          "A growing B2B team needs senior roadmap and architecture decisions before hiring a full-time technology executive.",
        approach:
          "Agree a bounded CTO mandate, leadership sessions and reviews of vendors, architecture and delivery risks.",
        outcome:
          "Continuing technical direction and handover objectives. Implementation and broad line management are separate.",
      },
    ],
  },
};
