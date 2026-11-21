import { AgencyCTA, PageIntro } from "./Agency";
import { serviceGuides } from "../lib/service-guides";
import { siteUrl, withBase } from "../lib/site";

export default function ServiceGuide({
  guide,
}: {
  guide: (typeof serviceGuides)[number];
}) {
  const url = `${siteUrl}/services/${guide.slug}/`;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: guide.title,
      description: guide.description,
      url,
      provider: { "@id": `${siteUrl}/#agency` },
      areaServed: ["Germany", "European Union"],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: `${siteUrl}/services/`,
        },
        { "@type": "ListItem", position: 3, name: guide.title, item: url },
      ],
    },
  ];
  return (
    <main id="main" className="agency-main">
      {schemas.map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <PageIntro kicker={guide.kicker} title={guide.title}>
        <p>{guide.answer}</p>
      </PageIntro>
      <div className="agency-detail-layout">
        <aside className="agency-detail-price">
          <h2>Is this your starting point?</h2>
          <p>{guide.fit}</p>
          <a className="agency-button" href={withBase("/contact/")}>
            Discuss your priorities
          </a>
          <p>
            <a href={withBase(`/services/${guide.packageSlug}/`)}>
              {guide.packageLabel}
            </a>
          </p>
        </aside>
        <div className="agency-prose">
          {guide.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </section>
          ))}
          <h2>What useful progress looks like</h2>
          <ul>
            {guide.outputs.map((output) => (
              <li key={output}>{output}</li>
            ))}
          </ul>
          <h2>Scope and investment</h2>
          <p>{guide.engagement} Prices exclude VAT where applicable.</p>
          <p>{guide.boundary}</p>
          <h2>Questions before starting</h2>
          {guide.questions.map((item) => (
            <section key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </section>
          ))}
          <p>
            <a href={withBase(`/insights/${guide.insightSlug}/`)}>
              {guide.insightLabel}
            </a>
          </p>
          <p>
            Guidance and delivery led by{" "}
            <a href={withBase("/founder/")}>Dr. Jurica Ševa</a>, based in
            Berlin.
          </p>
        </div>
      </div>
      <AgencyCTA
        title={
          guide.slug === "ai-strategy"
            ? "Which AI decision is holding you back?"
            : undefined
        }
        description={
          guide.slug === "ai-strategy"
            ? "Bring your business priorities, current experiments and unanswered questions. We’ll identify a useful next step together."
            : undefined
        }
      />
    </main>
  );
}
