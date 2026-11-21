import { founderExperience } from "../../../lib/founder";
import { pageMetadata } from "../../../lib/agency";
import { identity } from "../../../lib/site";
import { withBase } from "../../../lib/site-config";
export const metadata = pageMetadata(
  "Jurica — background & experience — V2",
  "Domains, leadership roles and project contributions across healthcare AI, language systems, speech, document intelligence and GenAI engineering.",
  "/v2/founder/",
);
export default function Founder() {
  return (
    <main id="main" className="v2-main v2-detail">
      <header className="v2-page-heading">
        <p className="v2-eyebrow">Your technical lead</p>
        <h1>
          Jurica Ševa.
          <br />
          Researcher. Engineer. Leader.
        </h1>
        <p>
          More than ten years across applied AI and software. From building
          language systems to leading teams and owning platform roadmaps.
        </p>
      </header>
      <div className="v2-founder-intro">
        <span className="v2-founder-monogram" aria-hidden="true">
          JŠ
        </span>
        <div>
          <h2>Direct access to the person leading the work.</h2>
          <p>
            I work with you on priorities, architecture and delivery. My
            experience spans research, hands-on engineering, department
            leadership and executive responsibility.
          </p>
          <p>
            Selected experience below comes from past employment and advisory
            roles. Employer and client names are omitted; these are personal
            career credentials, separate from agency engagements.
          </p>
        </div>
      </div>
      <section aria-labelledby="v2-background-title" className="v2-section">
        <p className="v2-eyebrow">Domains, roles & projects</p>
        <h2 id="v2-background-title">The experience behind the advice.</h2>
        <div className="founder-experience-grid">
          {founderExperience.map((item, i) => (
            <article className="founder-experience-card" key={item.domain}>
              <span className="founder-experience-index">0{i + 1}</span>
              <h3>{item.domain}</h3>
              <p className="founder-role">{item.role}</p>
              <p>{item.work}</p>
              <dl>
                <dt>My contribution</dt>
                <dd>{item.contribution}</dd>
                <dt>What I bring to your project</dt>
                <dd>{item.connection}</dd>
              </dl>
            </article>
          ))}
        </div>
      </section>
      <section className="v2-founder-education">
        <p className="v2-eyebrow">Research & education</p>
        <h2>A technical foundation.</h2>
        <p>
          PhD in Information and Communication Sciences. MSc in Computer
          Science. Fulbright Visiting Scholar in Computer Science.
        </p>
        <p>
          Research across semantic search, multilingual text mining and
          domain-specific knowledge extraction. Working in English, German and
          Croatian.
        </p>
        <div className="v2-actions">
          <a className="v2-button" href={withBase("/v2/services/")}>
            Explore the engagements ↗
          </a>
          <a
            className="v2-link"
            href={identity.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn ↗
          </a>
        </div>
      </section>
    </main>
  );
}
