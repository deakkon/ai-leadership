export const serviceGuides = [
  {
    slug: "ai-strategy",
    title: "AI strategy consulting for leadership teams",
    description:
      "AI strategy guidance for CEOs and leadership teams: prioritize opportunities, compare build and buy options, and agree ownership, costs and a practical roadmap.",
    kicker: "Decide where AI belongs",
    answer:
      "I help leadership teams decide where AI can help, which tools to use and what to fund first. We start with your business goals, existing systems and the people who will use it.",
    fit: "For leadership teams in B2B startups and European SMEs with scattered AI experiments or no clear plan.",
    sections: [
      {
        title: "Start with the business decision",
        text: "What needs to improve: customer response, delivery speed, cost or decision quality? I review the workflow, data, existing software and team before recommending tools. The answer may be conventional automation, buying software or waiting until the organization is ready.",
      },
      {
        title: "Choose what to fund first",
        text: "I compare opportunities by value, feasibility, available data, risk and the effort needed to put them into use. The plan identifies the next pilot, its owner, budget and dependencies, with clear criteria for continuing or stopping.",
      },
      {
        title: "Count the full cost",
        text: "Look beyond subscription prices. Include integration, AI usage, retries, human review, support and training. I compare low, expected and high usage against the current workflow before estimating the return. Time freed up is not automatically cash saved.",
      },
      {
        title: "Agree who owns the work",
        text: "I help clarify who approves AI use, checks results, handles exceptions and makes vendor and data decisions. Legal, privacy, security and employee-representation specialists are involved where needed. My guidance does not replace their advice or provide certification.",
      },
    ],
    outputs: [
      "A decision brief comparing options, assumptions and missing evidence",
      "A prioritized plan with a clear next step",
      "Named owners, a baseline for measuring results and review points",
      "A plan for rollout and running costs within the agreed scope",
    ],
    boundary:
      "The scope depends on organization size, stakeholder access and existing evidence. An organization-wide strategy is separately scoped; it is not included in a single-workflow discovery sprint. Implementation, exhaustive audits and ongoing operational support need their own agreement.",
    engagement:
      "For ongoing decisions, fractional AI / CTO leadership starts from €7,500/month with a defined mandate and capacity. For a single technical opportunity, discovery is €4,500 fixed. We agree the scope before starting; there is no obligation to commission a build.",
    packageSlug: "leadership",
    packageLabel: "Explore fractional leadership",
    insightSlug: "ai-platform-strategy",
    insightLabel: "Read: what belongs in an AI platform?",
    questions: [
      {
        question: "Do we need a technical brief before speaking?",
        answer:
          "No. Bring the business objective, current uncertainties and a decision owner. In the first conversation, I’ll ask about the problem and whether I can help. We can then identify what is needed to scope the work.",
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
      "I build product features, internal tools and integrations for B2B teams. I lead architecture and release review, using AI agents and specialist engineers where they help.",
    fit: "For founders, CTOs and product owners with a blocked release, an operational bottleneck or an existing product that needs a focused improvement.",
    sections: [
      {
        title: "Agree the first release",
        text: "I work with you to define what the release must do, its integrations and how we will test it. Discovery can resolve open decisions. If the brief is already clear, a build can start without a separate discovery project.",
      },
      {
        title: "Review the work as it develops",
        text: "The code stays in your repository. I review changes and tests as the work progresses, with regular demos to check the direction. I approve releases based on the agreed behavior working in your target environment.",
      },
      {
        title: "Prepare for handover",
        text: "Your team receives deployment notes, configuration details and clear operating responsibilities. The plan identifies the internal owner and any specialist engineering, design or user research needed.",
      },
    ],
    outputs: [
      "One agreed workflow or product release",
      "Reviewed code and results from the agreed tests",
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
          "No. I use AI-assisted delivery where it helps, but the product can be conventional software. Choose features because they serve users and business objectives.",
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
      "I automate document handling, information retrieval and repetitive work across systems. I test the workflow on representative examples, set limits on what it can do and keep human review where errors matter.",
    fit: "For operations and technology leaders dealing with repetitive document work or disconnected systems. The work needs a process owner and access to representative data.",
    sections: [
      {
        title: "Map the work before choosing tools",
        text: "I map the inputs, decisions, exceptions, access permissions and handoffs. Then I compare rules, existing tools, search and AI agents. The starting scope is one workflow, not an entire department.",
      },
      {
        title: "Test failures as well as successes",
        text: "I agree test cases with you and check completed tasks, exceptions, response time, review effort and cost. Tests include unsafe or uncertain inputs, with a way to stop or hand work to a person.",
      },
      {
        title: "Separate delivery tools from production usage",
        text: "Development tools are covered by the project quote or written allowance. Production AI services, hosting and integrations normally run in your accounts, with agreed budgets and alerts. The estimate includes retries, larger model inputs, test runs and human review.",
      },
      {
        title: "Agree what happens after launch",
        text: "I agree with you who will own the workflow, review exceptions and respond to incidents, then provide operating notes and handover. Model changes, monitoring and ongoing improvements need a separate support agreement.",
      },
    ],
    outputs: [
      "One agreed workflow and clear test cases",
      "A tested integration with access limits and fallbacks",
      "A running-cost estimate and spending controls",
      "Human review responsibilities and handover notes",
    ],
    boundary:
      "I do not promise universal accuracy, unsupervised authority or guaranteed savings. Sensitive data, regulated decisions, complex migrations and specialist audits require explicit assessment and scope before implementation.",
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
          "I assess existing licenses, APIs and infrastructure before proposing new software. Access, vendor terms and data requirements determine the feasible options.",
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
