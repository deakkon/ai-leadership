import type { ReactNode } from "react";
import { articleSchema, breadcrumbSchema, type Insight } from "../lib/insights";
import { identity, pillars, withBase } from "../lib/site";
import AuthorCard from "./AuthorCard";
import Breadcrumb from "./Breadcrumb";
import { ButtonPrimary, ButtonSecondary } from "./Button";
import Tag from "./Tag";
import TOC from "./TOC";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function InsightsArticleShell({
  insight,
  toc,
  children,
}: {
  insight: Insight;
  toc: { id: string; heading: string }[];
  children: ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(insight)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(insight)) }}
      />
      <main id="main" className="container" data-topic={insight.theme}>
        <Breadcrumb
          items={[
            { label: "Home", href: withBase("/") },
            { label: "Insights", href: withBase("/insights") },
            { label: insight.title },
          ]}
        />
        <article>
          <header className="article-head">
            <div className="tags">
              {insight.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <h1>{insight.title}</h1>
            <div className="article-byline">
              <span>Theme · {pillars.find((p) => p.id === insight.theme)?.title ?? insight.theme}</span>
              <span aria-hidden="true">·</span>
              <span>
                {identity.name} — Fractional CAIO · PhD (Univ. of Zagreb) · Berlin
              </span>
              <span aria-hidden="true">·</span>
              <a href={identity.linkedinUrl} target="_blank" rel="noopener">
                LinkedIn
              </a>
              <span aria-hidden="true">·</span>
              <time dateTime={insight.datePublished}>Published {formatDate(insight.datePublished)}</time>
              {insight.dateModified !== insight.datePublished && (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={insight.dateModified}>Updated {formatDate(insight.dateModified)}</time>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>Reading time ~{insight.readingTime}</span>
            </div>
          </header>

          <TOC items={toc} />

          <div className="article-body">{children}</div>

          <div className="article-links">
            <h3>Related reading</h3>
            <div>
              {insight.related.map((r, i) => (
                <div className="contents-row" key={r.slug}>
                  <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>
                      <a href={withBase(`/insights/${r.slug}`)}>{r.title}</a>
                    </h3>
                  </div>
                </div>
              ))}
              <div className="contents-row">
                <span className="idx">→</span>
                <div>
                  <h3>
                    <a href={insight.serviceHref}>{insight.serviceLabel}</a>
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="article-end-cta">
            <div>
              <h3>Take this further</h3>
              <p className="meta" style={{ margin: "var(--sp-2) 0 0" }}>
                {insight.offerLabel} — or a focused diagnostic first.
              </p>
            </div>
            <div style={{ display: "flex", gap: "var(--sp-4)", alignItems: "center", flexWrap: "wrap" }}>
              <ButtonPrimary href={identity.bookingUrl} target="_blank" rel="noopener">
                Book a call
              </ButtonPrimary>
              <ButtonSecondary href={identity.emailHref}>Email directly</ButtonSecondary>
            </div>
          </div>

          <AuthorCard updatedAt={formatDate(insight.dateModified)} />
        </article>
      </main>
    </>
  );
}
