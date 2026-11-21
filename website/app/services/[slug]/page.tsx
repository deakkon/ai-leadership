import { notFound } from "next/navigation";
import { AgencyCTA, PageIntro } from "../../../components/Agency";
import { packages, pageMetadata } from "../../../lib/agency";
import { siteUrl, withBase } from "../../../lib/site";
import { serviceGuides } from "../../../lib/service-guides";
import ServiceGuide from "../../../components/ServiceGuide";
export function generateStaticParams() {
  return [...packages, ...serviceGuides].map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = serviceGuides.find((guide) => guide.slug === slug);
  if (guide)
    return pageMetadata(guide.title, guide.description, `/services/${slug}/`);
  const p = packages.find((p) => p.slug === slug);
  return p ? pageMetadata(p.name, p.summary, `/services/${slug}/`) : {};
}
export default async function Service({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = serviceGuides.find((guide) => guide.slug === slug);
  if (guide) return <ServiceGuide guide={guide} />;
  const p = packages.find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <main id="main" className="agency-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: p.name,
            description: p.summary,
            url: `${siteUrl}/services/${p.slug}/`,
            provider: { "@id": `${siteUrl}/#agency` },
            areaServed: ["Germany", "European Union"],
          }),
        }}
      />
      <PageIntro kicker={p.category} title={p.name}>
        <p>{p.summary}</p>
      </PageIntro>
      <div className="agency-detail-layout">
        <aside className="agency-detail-price">
          <p className="agency-price">
            {p.price}
            <span>{p.unit} · ex VAT where applicable</span>
          </p>
          <p>{p.timeline}</p>
          <p>{p.audience}</p>
          <a className="agency-button" href={withBase("/contact/")}>
            Discuss this engagement
          </a>
        </aside>
        <div className="agency-prose">
          <h2>{p.outcome}</h2>
          <h3>What you receive</h3>
          <ul>
            {p.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <h3>Boundaries and dependencies</h3>
          <p>{p.exclusions}</p>
          <h3>Acceptance and feedback</h3>
          <p>{p.acceptance}</p>
          <h3>Commercial terms</h3>
          <p>
            {p.payment} The final proposal sets start dates, responsibilities,
            confidentiality, IP rights and cancellation terms.
          </p>
          <h3>AI and infrastructure costs</h3>
          <p>{p.usage}</p>
          <h3>Human accountability</h3>
          <p>
            Jurica owns the technical direction and release review. Agents work
            on bounded tasks with tests and review. Specialist involvement is
            named in the delivery plan.
          </p>
          <h3>After handover</h3>
          <p>
            For implementation work, we propose a 30-day window for reporting
            deviations from agreed acceptance criteria. Enhancements and ongoing
            operations need a separate scope. Contractual terms and statutory
            rights remain governed by the signed agreement and applicable law.
          </p>
        </div>
      </div>
      <AgencyCTA />
    </main>
  );
}
