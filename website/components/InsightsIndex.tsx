import { pillars, withBase } from "../lib/site";
import { insights } from "../lib/insights";

/**
 * Insights grouped under the three content themes (Strategy · Architecture · Transformation).
 * Themes without a published essay are omitted entirely — the page shows published work,
 * not empty slots.
 */
export default function InsightsIndex() {
  return (
    <div className="contents">
      {pillars.map((pillar) => {
        const items = insights.filter((i) => i.theme === pillar.id);
        if (items.length === 0) return null;
        return (
          <div className="theme-group" key={pillar.id}>
            <div className="theme-head">
              <span className="theme-title">
                {pillar.index} · {pillar.title}
              </span>
              <span className="theme-def">{pillar.definition}</span>
            </div>
            {items.map((it) => (
              <a key={it.slug} href={withBase(`/insights/${it.slug}`)} className="insight-row">
                <span className="idx">Essay</span>
                <span className="insight-main">
                  <span className="insight-line">
                    <h3>{it.title}</h3>
                    <span className="dot-leader" aria-hidden="true" />
                    <span className="insight-desc">{it.oneLine}</span>
                  </span>
                  <span className="insight-tags">
                    {it.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </span>
                </span>
              </a>
            ))}
          </div>
        );
      })}
    </div>
  );
}
