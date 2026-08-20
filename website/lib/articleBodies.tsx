import type { ReactNode } from "react";

export type ArticleSection = { id: string; heading: string; body: ReactNode };
export type ArticleContent = { lead: ReactNode; sections: ArticleSection[] };

const P = ({ children }: { children: ReactNode }) => <p>{children}</p>;

export const articleContent: Record<string, ArticleContent> = {
  "agentic-ai-reliability": {
    lead: (
      <P>
        <strong>The short answer:</strong> agentic systems need to be evaluated as decision-making
        processes, not only as model responses. Reliability comes from bounding what an agent may do,
        observing the choices it makes, testing trajectories and outcomes, and designing deterministic
        controls around the probabilistic core.
      </P>
    ),
    sections: [
      {
        id: "evaluate-outcomes-and-trajectories",
        heading: "1. Evaluate outcomes and trajectories",
        body: (
          <P>
            A conventional LLM feature can often be tested on input-output quality. An agent may reach
            the same outcome through different tools, intermediate states and retry paths. That means
            evaluation needs at least two levels: whether the final result is acceptable and whether the
            path taken was safe, efficient and policy-compliant.
          </P>
        ),
      },
      {
        id: "put-deterministic-boundaries-around-probabilistic-decisions",
        heading: "2. Put deterministic boundaries around probabilistic decisions",
        body: (
          <P>
            Do not ask the model to enforce the controls that protect you from the model. Permissions,
            spend limits, destructive actions, data access rules and approval requirements belong in
            conventional software controls.
          </P>
        ),
      },
      {
        id: "instrument-decisions-not-just-exceptions",
        heading: "3. Instrument decisions, not just exceptions",
        body: (
          <P>
            For agentic workflows, observability should capture tool selection, retries, handoffs,
            policy decisions, latency, cost and the evidence used for important decisions. The debugging
            question is often not “what error happened?” but “why did the system choose this path?”
          </P>
        ),
      },
      {
        id: "design-degradation-explicitly",
        heading: "4. Design degradation explicitly",
        body: (
          <P>
            A production agent needs known states for uncertainty: ask for clarification, fall back to
            retrieval, route to a human, reduce scope or stop. A system that can only succeed or
            hallucinate is not production-ready.
          </P>
        ),
      },
      {
        id: "measure-business-reliability",
        heading: "5. Measure business reliability",
        body: (
          <P>
            Task success, human correction rate, escalation rate, cost per successful outcome and
            time-to-resolution are often more meaningful than isolated model benchmark scores.
          </P>
        ),
      },
      {
        id: "when-to-use-an-agent",
        heading: "When to use an agent",
        body: (
          <P>
            Use an agent when the task genuinely requires dynamic planning, tool selection or adaptation.
            If the workflow is stable and known, a deterministic workflow with LLM components is usually
            easier to test, operate and govern.
          </P>
        ),
      },
    ],
  },
  "ai-platform-strategy": {
    lead: (
      <P>
        <strong>The short answer:</strong> centralize capabilities that become safer, cheaper or more
        reliable when shared. Keep product-specific behavior with the teams that own the business
        outcome. A useful AI platform reduces cognitive load without becoming the organization’s approval
        bottleneck.
      </P>
    ),
    sections: [
      {
        id: "capabilities-that-usually-belong-centrally",
        heading: "Capabilities that usually belong centrally",
        body: (
          <ul>
            <li>Model access, credentials, routing and policy enforcement</li>
            <li>Shared observability, cost attribution and auditability</li>
            <li>Evaluation infrastructure and reusable quality gates</li>
            <li>Security patterns, data-access controls and approved integrations</li>
            <li>Common deployment and lifecycle tooling</li>
          </ul>
        ),
      },
      {
        id: "capabilities-that-often-belong-with-product-teams",
        heading: "Capabilities that often belong with product teams",
        body: (
          <ul>
            <li>Domain-specific prompts and workflows</li>
            <li>Business logic and product-specific agent behavior</li>
            <li>Domain retrieval semantics and success criteria</li>
            <li>User experience and human review design</li>
          </ul>
        ),
      },
      {
        id: "the-platform-anti-pattern",
        heading: "The platform anti-pattern",
        body: (
          <P>
            The most common failure is building a centralized abstraction before enough product teams
            have repeated the same problem. The result is a platform optimized for imagined reuse rather
            than observed reuse.
          </P>
        ),
      },
      {
        id: "a-better-sequencing-rule",
        heading: "A better sequencing rule",
        body: (
          <P>
            Start with two or three real products. Observe what repeats. Standardize the capabilities
            with measurable cross-product value. Platformization should be the extraction of proven
            patterns, not a prerequisite for learning them.
          </P>
        ),
      },
    ],
  },
  "from-ai-poc-to-production": {
    lead: (
      <P>
        <strong>The short answer:</strong> most AI PoCs fail to scale because the demo validates
        possibility while production requires ownership, evaluation, data quality, integration,
        economics and operations. Those are different questions and need to be designed from the
        beginning.
      </P>
    ),
    sections: [
      {
        id: "no-explicit-owner",
        heading: "1. No explicit owner",
        body: (
          <P>
            If product, data science and engineering each own part of the system but nobody owns the
            outcome, the PoC becomes a permanent experiment.
          </P>
        ),
      },
      {
        id: "evaluation-arrives-too-late",
        heading: "2. Evaluation arrives too late",
        body: (
          <P>
            Without a representative evaluation set and explicit acceptance criteria, teams cannot tell
            whether changes improve the product or simply change it.
          </P>
        ),
      },
      {
        id: "data-is-treated-as-plumbing",
        heading: "3. Data is treated as plumbing",
        body: (
          <P>
            Retrieval quality, permissions, freshness, ontology and provenance often dominate model
            quality in real systems.
          </P>
        ),
      },
      {
        id: "integration-is-underestimated",
        heading: "4. Integration is underestimated",
        body: (
          <P>
            The value of an AI capability depends on where it enters the workflow, what context it
            receives and what happens after it responds.
          </P>
        ),
      },
      {
        id: "economics-are-measured-per-token",
        heading: "5. Economics are measured per token",
        body: (
          <P>
            Production cost includes retries, retrieval, observability, human review, latency, support
            and failed task attempts. Measure cost per successful business outcome.
          </P>
        ),
      },
      {
        id: "operations-are-an-afterthought",
        heading: "6. Operations are an afterthought",
        body: (
          <P>
            Models and prompts change, providers degrade, data drifts and workflows evolve. Production
            needs versioning, monitoring, rollback, incident response and an owner for quality over time.
          </P>
        ),
      },
      {
        id: "the-executive-test",
        heading: "The executive test",
        body: (
          <P>
            Before scaling an AI PoC, ask one question: “What would have to be true for us to trust this
            system with ten times the users and ten times the business impact?” The gaps in that answer
            are your production roadmap.
          </P>
        ),
      },
    ],
  },
};
