import { AgencyCTA, PageIntro, LoopDiagram } from "../../components/Agency";
import { pageMetadata } from "../../lib/agency";
export const metadata = pageMetadata(
  "My approach to AI strategy and software delivery",
  "How Jurica plans, builds and reviews software, uses AI tools and specialists, and hands over the work to your team.",
  "/how-we-work/",
);
const steps = [
  [
    "Define the outcome",
    "I work with you to agree the business goal, what is included, who makes decisions and how you will check the result.",
  ],
  [
    "Plan the implementation",
    "I assess the architecture, data access, vendors, costs and risks. We agree the approach and what happens if an integration or release fails.",
  ],
  [
    "Build and review",
    "I break implementation into small tasks. AI tools assist with coding and testing; I review the changes. I bring in specialist engineers when the project needs additional expertise.",
  ],
  [
    "Test and release",
    "I check the agreed scenarios, failure paths, integrations and costs before approving a release. For AI features, that includes evaluation against representative examples.",
  ],
  [
    "Hand over and improve",
    "Your team receives the code, deployment notes and operating instructions. We agree who handles support and whether more work is needed.",
  ],
];
export default function How() {
  return (
    <main id="main" className="agency-main">
      <PageIntro
        kicker="My approach"
        title="I lead the work, from plan to release."
      >
        <p>
          You work with me on planning, architecture and review. I use AI tools
          and specialist engineers where they help, and stay responsible for
          delivery.
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
          <h2>Your team keeps the work.</h2>
          <p>
            Client-owned repositories and production accounts are the default.
            Permissions are scoped to the work. Sensitive data stays out of
            unapproved tools; vendor settings and processing terms are checked
            before access.
          </p>
          <p>
            I recommend conventional software when it solves the problem well.
            If a workflow uses AI, we agree its permissions, budget, review
            points and owner.
          </p>
        </div>
      </section>
      <AgencyCTA />
    </main>
  );
}
