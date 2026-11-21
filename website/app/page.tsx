import { AgencyCTA, LoopDiagram, PackageGrid } from "../components/Agency";
import { pageMetadata, brand } from "../lib/agency";
import { identity, withBase } from "../lib/site";
import { insights } from "../lib/insights";
export const metadata = pageMetadata(
  "AI-first software agency in Berlin",
  brand.description,
  "/",
);
export default function Home() {
  return (
    <main id="main" className="agency-main">
      <section className="agency-hero">
        <div className="agency-hero-copy">
          <p className="agency-kicker">
            Founder-led engineering · Berlin / working globally
          </p>
          <h1>
            AI strategy and software.
            <br />
            With a hands-on lead.
          </h1>
          <p className="agency-lead">
            I help B2B teams decide where to invest in AI and build the software
            they need. I lead the work directly, using AI tools and specialist
            engineers where they help.
          </p>
          <div className="agency-actions horizontal">
            <a
              className="agency-button"
              href={identity.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Talk about your project
            </a>
            <a className="agency-text-link" href={withBase("/services/")}>
              Explore services and packages
            </a>
          </div>
          <p className="agency-hero-note">
            For B2B startups, scaleups and European SMEs.
          </p>
        </div>
        <LoopDiagram />
      </section>
      <div className="agency-proof-line">
        <span>
          <strong>Dr. Jurica Ševa</strong> · Founder &amp; engineering lead
        </span>
        <span>Former VP of AI &amp; Data Science</span>
        <span>10+ years in applied AI &amp; software</span>
        <a href={withBase("/founder/")}>Meet your technical lead</a>
      </div>
      <section className="agency-section" id="services">
        <div className="agency-section-head">
          <p className="agency-kicker">The work</p>
          <h2>What do you need to get done?</h2>
          <p>
            Choose a service to see where I can help, then explore the packages
            for scope, pricing and examples.
          </p>
        </div>
        <div className="agency-service-rows">
          {[
            [
              "Software development",
              "Internal tools, product features and integrations. I plan the release, lead implementation and hand it over to your team.",
              "software-development",
            ],
            [
              "AI workflow automation",
              "Document workflows, retrieval, agent-assisted operations and automation. Evaluation, fallbacks and operating costs are part of the design.",
              "ai-workflow-automation",
            ],
            [
              "AI strategy for leadership teams",
              "Decide where AI belongs, what to prioritize and how to measure progress. Align investment, ownership and adoption before committing to a build.",
              "ai-strategy",
            ],
          ].map(([title, text, slug]) => (
            <a
              className="agency-service-row"
              href={withBase(`/services/${slug}/`)}
              key={title}
            >
              <h3>{title}</h3>
              <p>{text}</p>
              <span>Explore</span>
            </a>
          ))}
        </div>
      </section>
      <section className="agency-philosophy agency-inverted" id="experience">
        <p className="agency-kicker">Working with me</p>
        <div>
          <h2>You work directly with me.</h2>
          <p>
            I’m Jurica. I handle planning, architecture and review. For larger
            projects, I bring in specialist engineers. AI tools help with
            implementation and testing; I’m responsible for what ships.
          </p>
          <p>
            Your team keeps the code, production accounts and documentation. We
            agree what is included, how you’ll review the work and who handles
            support before the project starts.
          </p>
          <a className="agency-text-link" href={withBase("/how-we-work/")}>
            My approach
          </a>
        </div>
      </section>
      <section className="agency-section" id="mandates">
        <div className="agency-section-head">
          <p className="agency-kicker">Ways to work together</p>
          <h2>Choose a package.</h2>
          <p>
            Start with discovery, commission a project, or reserve ongoing
            engineering capacity. Each package explains what is included.
          </p>
        </div>
        <PackageGrid />
        <div className="agency-package-note">
          <p>Need senior ownership before delivery capacity?</p>
          <a href={withBase("/services/leadership/")}>
            Fractional AI / CTO leadership from €7,500/month
          </a>
          <span>
            All prices exclude VAT where applicable. Final scope and fees are
            agreed in writing.
          </span>
        </div>
      </section>
      <section className="agency-section agency-examples">
        <div className="agency-section-head">
          <p className="agency-kicker">Where this can help</p>
          <h2>Typical projects.</h2>
          <p>
            Illustrative engagements, not claims of completed agency projects.
          </p>
        </div>
        <div className="agency-example-grid">
          <article>
            <span className="agency-kicker">For a B2B product team</span>
            <h3>A prototype needs to become a dependable feature.</h3>
            <p>
              Define the release boundary, connect the real data, build
              evaluation cases and ship with a rollback plan.
            </p>
          </article>
          <article>
            <span className="agency-kicker">For an operations team</span>
            <h3>Documents keep moving by copy and paste.</h3>
            <p>
              Map the workflow, automate extraction and routing, and keep
              exceptions with a named human owner.
            </p>
          </article>
        </div>
        <a className="agency-text-link" href={withBase("/work/")}>
          Explore example briefs and founder experience
        </a>
      </section>
      <section className="agency-section" id="insights">
        <div className="agency-section-head">
          <p className="agency-kicker">Field notes</p>
          <h2>Notes on AI and engineering.</h2>
          <a className="agency-text-link" href={withBase("/insights/")}>
            All insights
          </a>
        </div>
        <div className="agency-reading">
          {insights.slice(0, 3).map((item) => (
            <a href={withBase(`/insights/${item.slug}/`)} key={item.slug}>
              <span className="agency-kicker">{item.tags[0]}</span>
              <h3>{item.title}</h3>
              <p>{item.oneLine}</p>
              <span className="agency-small">
                By Dr. Jurica Ševa · {item.readingTime} read
              </span>
            </a>
          ))}
        </div>
      </section>
      <AgencyCTA />
    </main>
  );
}
