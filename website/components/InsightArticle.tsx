import { getInsight, articleSchema, breadcrumbSchema } from "../lib/insights";
import { getArticle } from "../lib/article-content";
import { identity, pillars, withBase } from "../lib/site";

export default function InsightArticle({ slug }: { slug: string }) {
  const insight = getInsight(slug);
  const article = getArticle(slug);
  if (!insight || !article) return null;

  const pillar = pillars.find((p) => p.id === insight.theme);

  return (
    <main className="shell" style={{ maxWidth: "var(--container)", marginInline: "auto", paddingInline: "var(--gutter)", paddingBlock: "clamp(2rem, 5vw, 4rem) var(--section-pad)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(insight)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(insight)) }} />

      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href={withBase("/")}>Home</a>
        <span className="sep">/</span>
        <a href={withBase("/insights")}>Insights</a>
        <span className="sep">/</span>
        <span aria-current="page">{pillar?.title ?? "Essay"}</span>
      </nav>

      <article className="prose">
        <header className="article-head">
          <p className="eyebrow" data-rule="off">
            {pillar ? `${pillar.index} · ${pillar.title}` : "Essay"} ·{" "}
            {insight.tags.map((t) => (
              <span key={t} className="tag is-accent">
                {t}
              </span>
            ))}
          </p>
          <h1>{insight.title}</h1>
          <div className="article-meta">
            <span>
              By <a href={identity.linkedinUrl} target="_blank" rel="noopener">{identity.name}</a> ·{" "}
              {identity.roleShort}
            </span>
            <span>Published {insight.datePublished}</span>
            <span>Updated {insight.dateModified}</span>
            <span>{insight.readingTime} read</span>
          </div>
        </header>

        <div className="callout" style={{ marginBottom: "var(--sp-48)" }}>
          {article.answerFirst}
        </div>

        <nav className="toc" aria-label="In this essay">
          <p className="toc-title">In this essay</p>
          <ol>
            {article.sections.map((s) => (
              <li key={s.heading}>
                <a href={`#${slugify(s.heading)}`}>{s.heading}</a>
              </li>
            ))}
          </ol>
        </nav>

        {article.sections.map((s) => (
          <section key={s.heading}>
            <h2 id={slugify(s.heading)}>{s.heading}</h2>
            {s.content}
          </section>
        ))}

        <div className="related-block">
          <p className="toc-title" style={{ marginBottom: "var(--sp-16)" }}>
            Related
          </p>
          <div className="rule-list">
            {insight.related.map((r) => (
              <div className="rule-item" key={r.slug}>
                <span />
                <a className="text-link" href={withBase(`/insights/${r.slug}`)}>
                  {r.title}
                </a>
              </div>
            ))}
            <div className="rule-item">
              <span />
              <a className="text-link" href={insight.serviceHref}>
                {insight.serviceLabel} — services
              </a>
            </div>
          </div>
        </div>

        <div className="cta-block">
          <p className="ui">
            <strong>{insight.offerLabel}</strong> — the engagement that fits this essay. Strategy,
            architecture and transformation ownership for AI systems that make it to production.
          </p>
          <a className="btn btn-primary" href={identity.bookingUrl} target="_blank" rel="noopener">
            Book a call
          </a>
        </div>

        <div className="author-card">
          <div className="author-avatar" aria-hidden="true">
            JŠ
          </div>
          <div>
            <div className="author-name">{identity.name}</div>
            <div className="author-role">
              {identity.role} · {identity.location}
            </div>
            <p className="author-bio">
              {identity.roleShort} and AI transformation executive. Executive strategy, platform
              architecture and engineering leadership for regulated healthcare and financial document
              intelligence. {identity.credentials}.
            </p>
            <div className="author-links">
              <a href={identity.linkedinUrl} target="_blank" rel="noopener">
                LinkedIn ↗
              </a>{" "}
              · <a href={identity.emailHref}>Email</a>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
