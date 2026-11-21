export const serviceGuides = [
  {
    slug: "ai-strategy",
    title: "AI strategy consulting for leadership teams",
    description:
      "AI strategy guidance for CEOs and leadership teams: prioritize opportunities, compare build and buy options, and agree ownership, costs and a practical roadmap.",
    kicker: "Decide where AI belongs",
    answer:
      "We help leaders connect AI investment to business priorities. Start with the decisions your organization needs to make, compare the realistic options, and agree what should happen next—with a named owner and evidence to review.",
    fit: "For CEOs, COOs and leadership teams in B2B startups and European SMEs facing scattered experiments, unclear priorities or uncertainty about what modern AI can reliably do.",
    sections: [
      {
        title: "Start with the business decision",
        text: "What needs to improve: customer response, delivery speed, operating cost or decision quality? We examine the current workflow, available data, existing licenses and team capability before recommending tools. Conventional automation, buying software or deferring investment may be the right answer.",
      },
      {
        title: "Prioritize a portfolio, then fund a bounded step",
        text: "Compare opportunities by value, feasibility, data readiness, risk and adoption effort. Document assumptions and evidence gaps. A useful roadmap identifies the next pilot, its owner, budget range, dependencies and the conditions for continuing or stopping.",
      },
      {
        title: "Make the economics explicit",
        text: "Consider integration, model usage, human review, retries, support and team enablement alongside subscription prices. Hours released are different from cash saved. Agree a baseline and test low, expected and high usage before treating an ROI estimate as an investment case.",
      },
      {
        title: "Plan for the organization that will use it",
        text: "Clarify who approves AI use, handles exceptions, evaluates results and owns vendor and data decisions. Identify where legal, privacy, security or employee-representation input is required. Leadership guidance supports those specialists; it does not replace legal advice or provide certification.",
      },
    ],
    outputs: [
      "A decision brief with alternatives, assumptions and evidence gaps",
      "Prioritized opportunities and a practical next-step roadmap",
      "Named owners, measurement baselines and review gates",
      "An adoption and operating-cost plan within the agreed mandate",
    ],
    boundary:
      "The scope depends on organization size, stakeholder access and existing evidence. An organization-wide strategy is separately scoped; it is not included in a single-workflow discovery sprint. Implementation, exhaustive audits and ongoing operational support need their own agreement.",
    engagement:
      "For ongoing decisions, fractional AI / CTO leadership starts from €7,500/month with a defined mandate and capacity. For a single technical opportunity, discovery is €4,500 fixed. We agree the appropriate scope before starting; there is no obligation to commission a build.",
    packageSlug: "leadership",
    packageLabel: "Explore fractional leadership",
    insightSlug: "ai-platform-strategy",
    insightLabel: "Read: what belongs in an AI platform?",
    questions: [
      {
        question: "Do we need a technical brief before speaking?",
        answer:
          "No. Bring the business objective, current uncertainties and a decision owner. The first conversation establishes fit and the evidence needed to scope useful work.",
      },
      {
        question: "Can you advise without building the solution?",
        answer:
          "Yes. Strategy and leadership can stand alone. Recommendations may lead to existing tools, your internal team, another provider or a decision not to invest yet.",
      },
      {
        question: "How do you measure progress?",
        answer:
          "Agree a baseline and review date for the selected workflow: cycle time, completed tasks, exception rate, review effort, actual usage and total operating cost. Targets depend on representative client evidence; returns are not guaranteed.",
      },
    ],
  },
  {
    slug: "software-development",
    title: "Custom software development for B2B teams",
    description:
      "Founder-led custom software development for B2B startups and European SMEs. Internal tools, product features and integrations with reviewed releases and handover.",
    kicker: "Build a useful release",
    answer:
      "We build bounded product features, internal tools and integrations for B2B teams. Senior human engineering leads architecture and release review, while AI agents and selected specialists assist implementation.",
    fit: "For founders, CTOs and product owners with a blocked release, an operational bottleneck or an existing product that needs a focused improvement.",
    sections: [
      {
        title: "Define the smallest valuable release",
        text: "Agree the user journey, integrations, dependencies and acceptance scenarios. If the brief is ambiguous, technical discovery can resolve the main decisions. When it is already clear, start directly with a scoped build.",
      },
      {
        title: "Review the work as it develops",
        text: "Use a client-owned repository, bounded tasks, human code review and tests appropriate to the release. Regular demos expose assumptions early. A passing agent run is not a release decision: the agreed behavior must work in the target environment.",
      },
      {
        title: "Design for the team that inherits it",
        text: "Include deployment notes, access and configuration handover, operating responsibilities and a named internal owner. Scope user research or specialist design when needed. The delivery plan identifies the human expertise required rather than assuming agents replace it.",
      },
    ],
    outputs: [
      "An agreed workflow or product increment",
      "Reviewed implementation and acceptance evidence",
      "Deployment to the agreed environment",
      "Operating notes, repository ownership and handover",
    ],
    boundary:
      "A focused release does not include an entire platform rewrite, unspecified integrations, unrestricted migration or 24/7 operations. Security assessments, complex design work and specialist requirements are scoped explicitly.",
    engagement:
      "Focused builds start from €18,000 and typically take 4–6 weeks. Technical discovery is €4,500 fixed when needed. Hosting and external production services are separate; final scope, fees and dependencies are agreed in writing.",
    packageSlug: "build",
    packageLabel: "Explore a focused build",
    insightSlug: "from-ai-poc-to-production",
    insightLabel: "Read: moving a prototype into production",
    questions: [
      {
        question: "Does the software need AI features?",
        answer:
          "No. We use AI-assisted delivery where it helps, but the product can be conventional software. Choose features because they serve users and business objectives.",
      },
      {
        question: "Who owns the code and production accounts?",
        answer:
          "Implementation takes place in a client-owned repository. The agreement sets rights to paid deliverables and distinguishes existing tools and third-party licenses. Production accounts normally remain yours.",
      },
      {
        question: "What happens after launch?",
        answer:
          "The proposal defines handover and a defect-remediation window. Monitoring, incident response and enhancements require a separate allocation; a project fee does not imply continuous support.",
      },
    ],
  },
  {
    slug: "ai-workflow-automation",
    title: "AI workflow automation with human oversight",
    description:
      "AI workflow automation for B2B operations: document processing, retrieval and agent-assisted workflows with evaluation, human review and explicit usage costs.",
    kicker: "Make AI useful in operations",
    answer:
      "We design and build AI-assisted workflows around a specific operating problem. Evaluate representative examples, constrain what the system can do, and provide human review and fallbacks where errors matter.",
    fit: "For operations and technology leaders dealing with repetitive document work, information retrieval or disconnected systems, with a process owner and access to representative data.",
    sections: [
      {
        title: "Assess the workflow before choosing an agent",
        text: "Map inputs, decisions, exceptions, permissions and handoffs. Determine whether rules, existing software, retrieval or model-driven behavior is appropriate. Start with one bounded workflow rather than a promise to automate an entire department.",
      },
      {
        title: "Evaluate useful work, including failures",
        text: "Agree representative test cases and acceptable behavior. Measure task completion, exceptions, latency, review burden and cost per accepted outcome. Test unsafe or uncertain inputs and ensure the system can escalate or stop.",
      },
      {
        title: "Separate delivery tools from production usage",
        text: "Agency development tools sit within the project quote or written allowance. Production models, hosting and external services normally run in client accounts with agreed budgets and alerts. Estimate retries, context growth, evaluations and human review instead of relying on token prices alone.",
      },
      {
        title: "Prepare for adoption and operation",
        text: "Agree who owns the workflow, reviews exceptions and responds to incidents. Provide operating notes and a scoped handover. Model changes, monitoring and ongoing improvements need an explicit support agreement.",
      },
    ],
    outputs: [
      "One scoped workflow and agreed acceptance scenarios",
      "Evaluated integration with bounded permissions and fallbacks",
      "An operating-cost estimate and spend controls",
      "Human review responsibilities and handover notes",
    ],
    boundary:
      "We do not promise universal accuracy, unsupervised authority or guaranteed savings. Sensitive data, regulated decisions, complex migrations and specialist audits require explicit assessment and scope before implementation.",
    engagement:
      "Technical discovery is €4,500 fixed for one opportunity. A focused production build starts from €18,000, usually 4–6 weeks. These are separate scopes; discovery is not mandatory when adequate evidence and a brief already exist.",
    packageSlug: "discovery",
    packageLabel: "Explore technical discovery",
    insightSlug: "agentic-ai-reliability",
    insightLabel: "Read: evaluating agentic AI reliability",
    questions: [
      {
        question: "Can you use our existing tools?",
        answer:
          "We assess existing licenses, APIs and infrastructure before proposing new software. Access, vendor terms and data requirements determine the feasible options.",
      },
      {
        question: "Do you run autonomous agents without review?",
        answer:
          "Authority depends on the task and its risk. The design sets permissions, review points, evaluations and fallbacks. High-impact actions require explicit approval rules.",
      },
      {
        question: "Is model usage included forever?",
        answer:
          "No. Development allowances and client production consumption are separate. The proposal identifies account ownership, budget limits and any management charges before work begins.",
      },
    ],
  },
] as const;
