import type { Metadata } from "next";
import { PageIntro } from "../../components/Agency";
export const metadata: Metadata = {
  title: "Legal notice — launch preparation",
  robots: { index: false, follow: false },
};
export default function Legal() {
  return (
    <main id="main" className="agency-main">
      <PageIntro kicker="Launch preparation" title="Legal notice">
        <p>This local preview is not ready for public commercial launch.</p>
      </PageIntro>
      <div className="agency-prose agency-section">
        <p>
          Known operator: Dr. Jurica Ševa, Freiberufler in Germany. Hooman in
          the Loop is a proposed trading brand; no UG or GmbH status is claimed.
        </p>
        <p>
          The serviceable business address and any applicable registration, tax
          identification, professional or editorial disclosures must be
          confirmed before publication. A city and email alone do not complete
          an Impressum.
        </p>
        <p>
          This page is deliberately excluded from indexing. It is a launch
          checklist, not a completed legal notice.
        </p>
      </div>
    </main>
  );
}
