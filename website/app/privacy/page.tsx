import type { Metadata } from "next";
import { PageIntro } from "../../components/Agency";
export const metadata: Metadata = {
  title: "Privacy — launch preparation",
  robots: { index: false, follow: false },
};
export default function Privacy() {
  return (
    <main id="main" className="agency-main">
      <PageIntro kicker="Launch preparation" title="Privacy information">
        <p>
          The final notice must reflect the services and hosting actually used
          at launch.
        </p>
      </PageIntro>
      <div className="agency-prose agency-section">
        <p>
          This preview adds no analytics, tracking pixels or contact-form
          backend. The brief builder prepares text locally. Opening an email
          draft uses your email software; the scheduling link opens an external
          provider.
        </p>
        <p>
          The existing theme preference is stored locally in your browser.
          Self-hosted font files are delivered with the site. Hosting requests
          may be logged by the hosting provider.
        </p>
        <p>
          Before publication, confirm the controller’s contact address,
          processors, purposes and legal bases, retention, international
          transfers, data-subject rights and complaint authority. Review the
          email and scheduling providers and any later analytics separately.
        </p>
        <p>
          This page is excluded from indexing and does not replace a completed
          privacy notice.
        </p>
      </div>
    </main>
  );
}
