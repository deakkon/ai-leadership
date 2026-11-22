import { notFound } from "next/navigation";
import { packages, pageMetadata } from "../../../lib/agency";
import { packageStories } from "../../../lib/package-stories";
import { serviceGuides } from "../../../lib/service-guides";
import ServiceGuide from "../../../components/ServiceGuide";
import { identity, siteUrl } from "../../../lib/site";
import { withBase } from "../../../lib/site-config";
import EngagementVisual from "../../../components/EngagementVisual";
import PackageExplorer from "../../../components/PackageExplorer";
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
  const offer = packages.find((p) => p.slug === slug);
  return offer
    ? pageMetadata(`${offer.name}`, offer.summary, `/services/${slug}/`)
    : {};
}
export default async function Package({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = serviceGuides.find((guide) => guide.slug === slug);
  if (guide) return <ServiceGuide guide={guide} />;
  const offer = packages.find((p) => p.slug === slug);
  if (!offer) notFound();
  return (
    <main id="main" className="v2-main v2-detail">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: offer.name,
            description: offer.summary,
            url: `${siteUrl}/services/${offer.slug}/`,
            provider: { "@id": `${siteUrl}/#agency` },
            areaServed: ["Germany", "European Union"],
          }),
        }}
      />
      <a className="v2-back" href={withBase("/#v2-packages")}>
        ← Compare engagements
      </a>
      <header className="v2-page-heading">
        <h1>{offer.name}</h1>
        <p>{offer.summary}</p>
      </header>
      <EngagementVisual kind={offer.slug} />
      <div className="package-deep-dive">
        <aside className="agency-detail-price package-price-summary">
          <p className="agency-price">
            {offer.price}
            <span>{offer.unit} · ex VAT where applicable</span>
          </p>
          <p>{offer.timeline}</p>
          <p>{offer.audience}</p>
          <a
            className="v2-button"
            href={identity.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Discuss this scope ↗
          </a>
        </aside>
        <PackageExplorer offer={offer} story={packageStories[offer.slug]} />
      </div>
    </main>
  );
}
