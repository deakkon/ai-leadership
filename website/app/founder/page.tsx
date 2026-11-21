import { AgencyCTA, PageIntro } from "../../components/Agency";
import { pageMetadata } from "../../lib/agency";
import { identity, withBase } from "../../lib/site";
import { founderExperience } from "../../lib/founder";

export const metadata = pageMetadata(
  "Dr. Jurica Ševa — AI leadership & engineering background",
  "Jurica's background across healthcare AI, clinical NLP, speech recognition, document intelligence, GenAI product engineering and AI team leadership.",
  "/founder/",
);

export default function Founder() {
  return (
    <main id="main" className="agency-main">
      <PageIntro kicker="Founder & engineering lead" title="Dr. Jurica Ševa.">
        <p>
          I help teams make AI decisions and build the systems behind them. My
          background spans research, hands-on engineering, department leadership
          and executive responsibility.
        </p>
      </PageIntro>

      <div className="founder-overview">
        <aside
          className="founder-profile-card"
          aria-label="Background at a glance"
        >
          <div className="founder-initials" aria-hidden="true">
            JŠ
          </div>
          <dl>
            <div>
              <dt>Experience</dt>
              <dd>10+ years in applied AI and software</dd>
            </div>
            <div>
              <dt>Leadership</dt>
              <dd>Former VP of AI & Data Science</dd>
            </div>
            <div>
              <dt>Research</dt>
              <dd>PhD · Information and Communication Sciences</dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>Berlin · Working internationally</dd>
            </div>
          </dl>
        </aside>
        <div className="agency-prose">
          <h2>From building models to leading teams.</h2>
          <p>
            I’ve worked on clinical language systems, speech recognition,
            search, knowledge graphs and GenAI products. My roles have ranged
            from writing extraction pipelines and taking prototypes toward
            deployment to owning an AI platform roadmap and leading a
            cross-timezone team.
          </p>
          <p>
            Healthcare is a substantial part of that background. It has shaped
            how I approach data, evaluation, integration and operational
            responsibility. My experience also includes market research, digital
            product delivery and advising leaders on AI strategy and hiring.
          </p>
          <p>
            Today, I bring that mix to Hooman in the Loop. I work directly with
            you on the decisions and implementation, bringing in specialist
            engineers when the scope calls for it.
          </p>
          <a className="agency-text-link" href="#career-experience">
            Explore my experience ↓
          </a>
        </div>
      </div>

      <section
        className="agency-section"
        id="career-experience"
        aria-labelledby="career-experience-title"
      >
        <div className="agency-section-head">
          <p className="agency-kicker">Domains, roles & projects</p>
          <h2 id="career-experience-title">
            Work I’ve led, built and advised on.
          </h2>
          <p>
            Selected experience from past employment and advisory roles.
            Employer and client names are omitted; these are personal career
            credentials, separate from agency engagements.
          </p>
        </div>
        <div className="founder-experience-grid">
          {founderExperience.map((experience, index) => (
            <article
              className="founder-experience-card"
              key={experience.domain}
            >
              <span className="founder-experience-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{experience.domain}</h3>
              <p className="founder-role">{experience.role}</p>
              <p>{experience.work}</p>
              <dl>
                <dt>My contribution</dt>
                <dd>{experience.contribution}</dd>
                <dt>What I bring to your project</dt>
                <dd>{experience.connection}</dd>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section
        className="agency-section founder-foundations"
        aria-labelledby="foundations-title"
      >
        <div>
          <p className="agency-kicker">Research & education</p>
          <h2 id="foundations-title">A technical foundation.</h2>
        </div>
        <div className="agency-prose">
          <p>
            I hold a PhD in Information and Communication Sciences and an MSc in
            Computer Science. I was also a Fulbright Visiting Scholar in
            Computer Science.
          </p>
          <p>
            My academic work has covered semantic search, multilingual text
            mining and domain-specific knowledge extraction. Those subjects
            still inform how I think about retrieval, language systems and the
            quality of the evidence behind an answer.
          </p>
          <p>I work in English, German and Croatian.</p>
          <a
            className="agency-text-link"
            href={identity.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Professional background on LinkedIn
          </a>
        </div>
      </section>

      <section className="agency-section agency-prose">
        <h2>How that experience can help.</h2>
        <p>
          For priorities, investment and organizational decisions, explore{" "}
          <a href={withBase("/services/ai-strategy/")}>
            AI strategy consulting
          </a>{" "}
          or a{" "}
          <a href={withBase("/services/leadership/")}>
            fractional leadership mandate
          </a>
          . For a defined software project, see the{" "}
          <a href={withBase("/services/build/")}>focused build</a>.
        </p>
      </section>
      <AgencyCTA />
    </main>
  );
}
