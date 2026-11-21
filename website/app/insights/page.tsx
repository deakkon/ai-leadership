import type { Metadata } from "next";
import Breadcrumb from "../../components/Breadcrumb";
import InsightsIndex from "../../components/InsightsIndex";
import { siteUrl, withBase } from "../../lib/site";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Essays on AI strategy, architecture and transformation — filed under the same three pillars as the services.",
  alternates: { canonical: `${siteUrl}/insights/` },
  openGraph: {
    type: "website",
    title: "Insights — Dr. Jurica Ševa",
    description: "Essays on AI strategy, architecture and transformation.",
    siteName: "Hooman in the Loop",
    url: `${siteUrl}/insights/`,
    images: [{ url: `${siteUrl}/agency-og.png` }],
  },
};

export default function InsightsPage() {
  return (
    <main id="main" className="container">
      <div style={{ paddingTop: "var(--sp-9)", paddingBottom: "var(--sp-9)" }}>
        <Breadcrumb
          items={[
            { label: "Home", href: withBase("/") },
            { label: "Insights" },
          ]}
        />
        <header className="section-head">
          <div className="rail">
            <span className="folio-num">—</span>
            <p className="eyebrow">Thinking</p>
          </div>
          <h1>Practical notes on building AI systems and organizations.</h1>
          <p className="lead" style={{ marginTop: "var(--sp-4)" }}>
            Essays are filed under the same three pillars as the services — Strategy, Architecture,
            Transformation — so the taxonomy stays aligned with the work.
          </p>
        </header>
        <InsightsIndex />
      </div>
    </main>
  );
}
