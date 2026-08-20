import type { Metadata } from "next";
import Breadcrumb from "../../components/Breadcrumb";
import InsightsIndex from "../../components/InsightsIndex";
import { withBase } from "../../lib/site";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Essays on AI strategy, architecture and transformation — filed under the same three pillars as the services.",
  alternates: { canonical: "/insights" },
  openGraph: {
    type: "website",
    title: "Insights — Dr. Jurica Ševa",
    description: "Essays on AI strategy, architecture and transformation.",
    siteName: "Dr. Jurica Ševa",
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
          <h2>Practical notes on building AI systems and organizations.</h2>
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
