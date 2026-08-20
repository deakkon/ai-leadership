import type { Metadata } from "next";
import { identity, siteUrl, withBase } from "./site";
import type { PillarId } from "./site";

export type Insight = {
  slug: string;
  title: string;
  oneLine: string;
  desc: string;
  tags: string[];
  theme: PillarId;
  datePublished: string;
  dateModified: string;
  readingTime: string;
  related: { slug: string; title: string }[];
  serviceHref: string;
  serviceLabel: string;
  offerLabel: string;
};

export const insights: Insight[] = [
  {
    slug: "agentic-ai-reliability",
    title: "Agentic AI reliability: what changes when software can choose its own path?",
    oneLine: "A production framework for evaluation, observability and bounded autonomy.",
    desc: "A practical production framework for evaluating and operating agentic AI systems.",
    tags: ["LLM reliability", "Agentic AI"],
    theme: "architecture",
    datePublished: "2026-08-19",
    dateModified: "2026-08-19",
    readingTime: "4 min",
    related: [
      { slug: "ai-platform-strategy", title: "AI platform strategy: what belongs in the platform?" },
      { slug: "from-ai-poc-to-production", title: "From AI PoC to production: the six gaps that kill good demos" },
    ],
    serviceHref: withBase("/#services"),
    serviceLabel: "GenAI & Agentic Systems",
    offerLabel: "Fractional CAIO / VP AI",
  },
  {
    slug: "ai-platform-strategy",
    title: "AI platform strategy: what belongs in the platform?",
    oneLine: "Separate reusable capabilities from product-specific intelligence before centralization becomes a bottleneck.",
    desc: "A practical framework for deciding what belongs in an enterprise AI platform.",
    tags: ["AI platform strategy", "AI architecture"],
    theme: "architecture",
    datePublished: "2026-08-19",
    dateModified: "2026-08-19",
    readingTime: "4 min",
    related: [
      { slug: "agentic-ai-reliability", title: "Agentic AI reliability: what changes when software can choose its own path?" },
      { slug: "from-ai-poc-to-production", title: "From AI PoC to production: the six gaps that kill good demos" },
    ],
    serviceHref: withBase("/#services"),
    serviceLabel: "AI Platform Strategy",
    offerLabel: "AI Transformation Diagnostic",
  },
  {
    slug: "from-ai-poc-to-production",
    title: "From AI PoC to production: the six gaps that kill good demos",
    oneLine: "Why quality, ownership, evaluation, integration, cost and operations must be designed together.",
    desc: "Six gaps that prevent promising AI prototypes from becoming dependable production systems.",
    tags: ["AI transformation", "AI engineering"],
    theme: "transformation",
    datePublished: "2026-08-19",
    dateModified: "2026-08-19",
    readingTime: "4 min",
    related: [
      { slug: "agentic-ai-reliability", title: "Agentic AI reliability: what changes when software can choose its own path?" },
      { slug: "ai-platform-strategy", title: "AI platform strategy: what belongs in the platform?" },
    ],
    serviceHref: withBase("/#services"),
    serviceLabel: "PoC-to-Production Recovery",
    offerLabel: "AI Transformation Mandate",
  },
];

export function getInsight(slug: string) {
  return insights.find((i) => i.slug === slug);
}

export function insightMetadata(insight: Insight): Metadata {
  const url = `${siteUrl}/insights/${insight.slug}`;
  const ogImage = `${siteUrl}/og.png`;
  return {
    title: insight.title,
    description: insight.desc,
    alternates: { canonical: `/insights/${insight.slug}` },
    openGraph: {
      type: "article",
      url,
      title: `${insight.title} — Dr. Jurica Ševa`,
      description: insight.desc,
      siteName: identity.name,
      images: [{ url: ogImage }],
      publishedTime: insight.datePublished,
      modifiedTime: insight.dateModified,
      authors: [identity.name],
    },
    twitter: {
      card: "summary_large_image",
      title: `${insight.title} — Dr. Jurica Ševa`,
      description: insight.desc,
      images: [ogImage],
    },
  };
}

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function articleSchema(insight: Insight) {
  const url = `${siteUrl}/insights/${insight.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.desc,
    datePublished: insight.datePublished,
    dateModified: insight.dateModified,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${siteUrl}/og.png`,
    author: {
      "@type": "Person",
      name: identity.name,
      url: identity.linkedinUrl,
      sameAs: [identity.linkedinUrl],
      alumniOf: { "@type": "CollegeOrUniversity", name: "University of Zagreb" },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        name: "Doctorate (PhD)",
        credentialCategory: "degree",
        educationalLevel: "Doctoral",
        recognizedBy: { "@type": "CollegeOrUniversity", name: "University of Zagreb" },
        description:
          "Thesis: web news portal content personalization using information extraction techniques and weighted Voronoi diagrams.",
      },
    },
    publisher: {
      "@type": "Person",
      name: identity.name,
      url: identity.linkedinUrl,
    },
  };
}

export function breadcrumbSchema(insight: Insight) {
  const url = `${siteUrl}/insights/${insight.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Insights", item: `${siteUrl}/insights` },
      { "@type": "ListItem", position: 3, name: insight.title, item: url },
    ],
  };
}
