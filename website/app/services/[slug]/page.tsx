import { notFound } from "next/navigation";
import { AgencyCTA, PageIntro } from "../../../components/Agency";
import { packages, pageMetadata } from "../../../lib/agency";
import { siteUrl, withBase } from "../../../lib/site";
import { serviceGuides } from "../../../lib/service-guides";
import ServiceGuide from "../../../components/ServiceGuide";
import PackageExplorer from "../../../components/PackageExplorer";
import { packageStories } from "../../../lib/package-stories";
import EngagementVisual from "../../../components/EngagementVisual";
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
      <a
        className="agency-text-link package-back-link"
        href={withBase("/services/#packages")}
      >
        ← All packages
      </a>
      <PageIntro kicker={p.category} title={p.name}>
        <p>{p.summary}</p>
      </PageIntro>
      <EngagementVisual kind={p.slug} />
      <div className="package-deep-dive">
        <aside
          className="agency-detail-price package-price-summary"
          aria-label="Engagement at a glance"
        >
          <p className="agency-price">
            {p.price}
            <span>{p.unit} · ex VAT where applicable</span>
          </p>
          <p>{p.timeline}</p>
          <p>{p.audience}</p>
          <a className="agency-button" href={withBase("/contact/")}>
            Discuss this engagement
          </a>
          <p className="agency-small">
            Final scope, allocation and dates are agreed in writing.
          </p>
        </aside>
        <PackageExplorer offer={p} story={packageStories[p.slug]} />
      </div>
      <AgencyCTA />
    </main>
  );
}
