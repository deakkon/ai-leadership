import { founderExperience } from "../../lib/founder";
import { pageMetadata } from "../../lib/agency";
import { identity } from "../../lib/site";
import { withBase } from "../../lib/site-config";
export const metadata = pageMetadata(
  "Jurica — background & experience",
  "Domains, leadership roles and project contributions across healthcare AI, language systems, speech, document intelligence and GenAI engineering.",
  "/founder/",
);
export default function Founder() {
  return (
    <main id="main" className="v2-main v2-detail">
      <header className="v2-page-heading">
        <h1>Dr. Jurica Ševa.</h1>
        <p>
          More than ten years across applied AI and software. From building
          language systems to leading teams and owning platform roadmaps.
        </p>
      </header>
      <div className="v2-founder-intro">
        <div>
          <h2>You work directly with me.</h2>
          <p>
            I work with you on priorities, architecture and delivery. My
            background combines research, hands-on engineering and AI team
            leadership, including executive responsibility.
          </p>
          <p>
            Selected experience below comes from past employment and advisory
            roles. Employer and client names are omitted; these are personal
            career credentials, separate from agency engagements.
          </p>
        </div>
      </div>
      <section
        id="career-experience"
        aria-labelledby="v2-background-title"
        className="v2-section"
      >
        <h2 id="v2-background-title">Past roles and projects.</h2>
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
        <h2>Research and education.</h2>
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
          <a className="v2-button" href={withBase("/services/")}>
            Compare packages
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
