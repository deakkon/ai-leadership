import { AgencyCTA, PageIntro } from "../../components/Agency";
import { pageMetadata } from "../../lib/agency";
import { identity, withBase } from "../../lib/site";
import { personSchema } from "../../lib/schema";
export const metadata = pageMetadata(
  "Dr. Jurica Ševa — founder & engineering lead",
  "Meet Jurica: former VP of AI & Data Science, PhD, and hands-on technical leader bridging AI strategy and production engineering.",
  "/founder/",
);
export default function Founder() {
  return (
    <main id="main" className="agency-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <PageIntro kicker="The hooman in the loop" title="Dr. Jurica Ševa.">
        <p>
          Founder. AI and engineering leader. The person accountable for the
          technical direction.
        </p>
      </PageIntro>
      <div className="agency-founder-grid">
        <div className="agency-founder-mark" aria-hidden="true">
          JŠ<span>Berlin, Germany</span>
        </div>
        <div className="agency-prose">
          <h2>From the executive decision to the production detail.</h2>
          <p>
            I built Hooman in the Loop around a simple working principle: use AI
            agents where they help, and keep experienced humans responsible for
            the decisions that matter.
          </p>
          <p>
            My background spans more than ten years across applied AI, NLP,
            semantic search, data platforms and software engineering. As VP of
            AI &amp; Data Science at Adia Health, I owned the AI platform
            roadmap and architecture and led an eight-person AI and data
            organization across time zones.
          </p>
          <p>
            That experience includes GenAI, NLP and knowledge systems in
            regulated healthcare environments. It informs how I think about
            evaluation, data handling, integration and operating responsibility.
            It is founder experience, not a claim of agency certification.
          </p>
          <p>
            I hold a PhD from the University of Zagreb and work in English,
            German and Croatian.
          </p>
          <h3>Two ways to engage</h3>
          <p>
            Work with me on a{" "}
            <a href={withBase("/services/leadership/")}>
              fractional AI / CTO mandate
            </a>
            , or combine technical leadership with a{" "}
            <a href={withBase("/services/build/")}>
              defined delivery engagement
            </a>
            . Specialists join according to the scope; we do not imply a
            permanent team that has not been assembled.
          </p>
          <a
            className="agency-text-link"
            href={identity.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Professional background on LinkedIn
          </a>
        </div>
      </div>
      <AgencyCTA />
    </main>
  );
}
