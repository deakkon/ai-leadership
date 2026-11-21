import { AgencyCTA, PageIntro, LoopDiagram } from "../../components/Agency";
import { pageMetadata } from "../../lib/agency";
export const metadata = pageMetadata(
  "How human-led, agent-assisted delivery works",
  "Human direction, bounded agent execution, review and evidence before release. Understand the delivery process and ownership.",
  "/how-we-work/",
);
const steps = [
  [
    "Define the outcome",
    "We agree what should change for the business, the release boundary, the client owner and the evidence needed to accept the work.",
  ],
  [
    "Design the boundaries",
    "Jurica owns architecture and risk decisions. We agree data access, vendor use, spending limits, integration contracts and rollback before implementation.",
  ],
  [
    "Build in reviewed increments",
    "Agents implement well-defined tasks in isolated environments. Human specialists handle work that needs domain expertise. Pull requests include tests and reviewable evidence.",
  ],
  [
    "Evaluate and release",
    "We check acceptance cases, failure paths, model behavior where relevant, cost and operational readiness. A named human approves each release.",
  ],
  [
    "Hand over and improve",
    "Your team receives the repository, deployment notes and operating instructions. Support responsibilities and the next increment are agreed explicitly.",
  ],
];
export default function How() {
  return (
    <main id="main" className="agency-main">
      <PageIntro kicker="The operating model" title="Autonomy needs direction.">
        <p>
          AI agents extend the engineering workflow. Senior humans stay
          responsible for scope, architecture and what reaches production.
        </p>
      </PageIntro>
      <LoopDiagram />
      <section className="agency-section">
        <div className="agency-process">
          {steps.map(([title, body]) => (
            <article key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="agency-philosophy">
        <p className="agency-kicker">Built for ownership</p>
        <div>
          <h2>
            Your systems.
            <br />
            <em>Your ability to keep going.</em>
          </h2>
          <p>
            Client-owned repositories and production accounts are the default.
            Permissions are scoped to the work. Sensitive data stays out of
            unapproved tools; vendor settings and processing terms are checked
            before access.
          </p>
          <p>
            We choose conventional software when it solves the problem well.
            Agent use needs a reason, a budget, a failure path and an owner.
          </p>
        </div>
      </section>
      <AgencyCTA />
    </main>
  );
}
