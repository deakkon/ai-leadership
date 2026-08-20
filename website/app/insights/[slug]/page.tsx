import { notFound } from "next/navigation";
import { articleContent } from "../../../lib/articleBodies";
import { getInsight, insightMetadata, insights } from "../../../lib/insights";
import Callout from "../../../components/Callout";
import InsightsArticleShell from "../../../components/InsightsArticleShell";

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) return {};
  return insightMetadata(insight);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = getInsight(slug);
  const content = articleContent[slug];
  if (!insight || !content) notFound();

  return (
    <InsightsArticleShell
      insight={insight}
      toc={content.sections.map((s) => ({ id: s.id, heading: s.heading }))}
    >
      <Callout kicker="The short answer">{content.lead}</Callout>
      {content.sections.map((section) => (
        <section key={section.id} id={section.id}>
          <h2>{section.heading}</h2>
          {section.body}
        </section>
      ))}
    </InsightsArticleShell>
  );
}
