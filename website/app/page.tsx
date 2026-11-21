import { AgencyCTA, LoopDiagram, PackageGrid } from "../components/Agency";
import { pageMetadata, brand } from "../lib/agency";
import { identity, siteUrl, withBase } from "../lib/site";
import { personSchema } from "../lib/schema";
import { insights } from "../lib/insights";
export const metadata = pageMetadata(
  "AI-first software agency in Berlin",
  brand.description,
  "/",
);
export default function Home() {
  return (
    <main id="main" className="agency-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${siteUrl}/#agency`,
            name: brand.name,
            url: `${siteUrl}/`,
            description: brand.description,
            founder: { "@id": `${siteUrl}/founder/#person` },
            location: { "@type": "Place", name: "Berlin, Germany" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <section className="agency-hero">
        <div className="agency-hero-copy">
          <p className="agency-kicker">
            Founder-led engineering · Berlin / working globally
          </p>
          <h1>
            Software built with AI.
            <br />
            <em>Led by a hooman.</em>
          </h1>
          <p className="agency-lead">
            From the first hard decision to the release that matters. Senior
            engineering judgment and AI agents, working together to build useful
            software.
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
              Find your starting point
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
          <h2>
            Move the business forward.
            <br />
            <em>Build what earns its place.</em>
          </h2>
          <p>
            You may need a product release, an automated workflow or a technical
            direction. We start with the outcome and choose the right tools for
            the job.
          </p>
        </div>
        <div className="agency-service-rows">
          {[
            [
              "Software that fits your business",
              "Internal tools, customer-facing features and integrations. Bounded releases, reviewed code and a handover your team can use.",
              "build",
            ],
            [
              "AI that does useful work",
              "Document workflows, retrieval, agent-assisted operations and automation. Evaluation, fallbacks and operating costs are part of the design.",
              "build",
            ],
            [
              "Leadership that connects the pieces",
              "A fractional AI or CTO mandate to align priorities, architecture, vendors and delivery. Implementation can be scoped alongside it.",
              "leadership",
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
      <section className="agency-philosophy" id="experience">
        <p className="agency-kicker">Why the hooman stays in the loop</p>
        <div>
          <h2>
            Agents can write code.
            <br />
            <em>Someone has to own the decisions.</em>
          </h2>
          <p>
            Jurica leads architecture, scope and release review. Agents take on
            well-defined implementation and testing tasks. Specialist humans
            join where the work needs their expertise.
          </p>
          <p>
            You get a named technical lead, visible progress and agreed
            acceptance criteria. Your code, accounts and operating knowledge
            stay with you.
          </p>
          <a className="agency-text-link" href={withBase("/how-we-work/")}>
            See how delivery works
          </a>
        </div>
      </section>
      <section className="agency-section" id="mandates">
        <div className="agency-section-head">
          <p className="agency-kicker">Ways to work together</p>
          <h2>
            A useful first step.
            <br />
            <em>A clear next one.</em>
          </h2>
          <p>
            Start with a decision, commission a bounded release, or establish an
            ongoing delivery cadence.
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
          <h2>
            Concrete work.
            <br />
            <em>Real business context.</em>
          </h2>
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
          <h2>
            Thinking that informs
            <br />
            <em>the engineering.</em>
          </h2>
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
