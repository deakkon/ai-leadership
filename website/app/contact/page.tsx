import { PageIntro } from "../../components/Agency";
import ProjectBrief from "../../components/ProjectBrief";
import { pageMetadata } from "../../lib/agency";
import { identity } from "../../lib/site";
export const metadata = pageMetadata(
  "Discuss a software or AI project",
  "Share a brief or book an introductory call with Dr. Jurica Ševa about software delivery, AI automation or fractional technical leadership.",
  "/contact/",
);
export default function Contact() {
  return (
    <main id="main" className="agency-main">
      <PageIntro
        kicker="Let’s find the useful next step"
        title="What are you trying to make possible?"
      >
        <p>
          A few specifics help: the business problem, who owns it, the budget
          range and what success looks like.
        </p>
      </PageIntro>
      <div className="agency-contact-grid">
        <ProjectBrief />
        <aside className="agency-prose">
          <h2>Prefer a conversation?</h2>
          <p>
            Talk directly with Jurica about the problem and whether the work is
            a fit.
          </p>
          <a
            className="agency-button"
            href={identity.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book an introductory call
          </a>
          <p>
            The booking link opens an external scheduling service. You can also
            email <a href={`mailto:${identity.email}`}>{identity.email}</a>.
          </p>
          <h3>A useful fit</h3>
          <p>
            B2B software, AI workflows and engineering leadership, with a named
            business owner and willingness to agree a bounded first step.
          </p>
          <h3>Based in Berlin</h3>
          <p>
            Working remotely across Europe and internationally. English, German
            and Croatian.
          </p>
        </aside>
      </div>
    </main>
  );
}
