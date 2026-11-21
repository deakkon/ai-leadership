import type { Metadata } from "next";
import { siteUrl } from "./site-config";
import { serviceGuides } from "./service-guides";
export const brand = {
  name: "Hooman in the Loop",
  short: "HITL",
  description:
    "Founder-led software engineering, AI automation and fractional technology leadership. Based in Berlin, working with B2B startups and European SMEs.",
};
export const packages = [
  {
    slug: "discovery",
    name: "Discovery sprint",
    category: "Find the right first move",
    price: "€4,500",
    unit: "fixed scope",
    timeline: "Up to 2 weeks",
    audience:
      "For teams with a business problem and several possible ways forward.",
    summary:
      "A decision you can act on. Turn an ambiguous idea into a bounded brief, an architecture direction and a delivery plan.",
    outcome:
      "Know what to build, what to leave out, and what a first release should prove.",
    deliverables: [
      "One workflow or product opportunity assessed",
      "Up to three stakeholder interviews",
      "Architecture and build/buy recommendation",
      "Prioritized release scope, acceptance criteria and a priced proposal",
    ],
    exclusions:
      "No production implementation, exhaustive security audit or open-ended research. Access to stakeholders and representative data is required.",
    acceptance:
      "A written decision brief, reviewed in one handover session with one consolidated revision.",
    payment: "50% at booking, 50% on handover.",
    usage:
      "Research and delivery tooling is included. No production runtime is included.",
  },
  {
    slug: "build",
    name: "Focused build",
    category: "Put a useful release in people’s hands",
    price: "From €18,000",
    unit: "per project",
    timeline: "Typically 4–6 weeks",
    audience:
      "For teams ready to ship a bounded software release or automate a specific workflow.",
    summary:
      "One valuable release, with clear boundaries. An internal tool, a product feature or an AI workflow built around agreed acceptance tests.",
    outcome: "A working release your team can test, operate and build on.",
    deliverables: [
      "One agreed workflow or product increment",
      "Implementation in a client-owned repository",
      "Human code review, tests and AI evaluation where relevant",
      "Deployment to an agreed environment, operating notes and handover",
    ],
    exclusions:
      "No whole-platform rewrite, unspecified integrations or 24/7 operations. Complex data migration, regulated use and specialist audits need separate scope.",
    acceptance:
      "The agreed test scenarios pass in the target environment. Two consolidated feedback rounds within the agreed scope.",
    payment:
      "40% to start, 40% at the agreed demo milestone, 20% on acceptance.",
    usage:
      "Agency development tools are included in the quote. Hosting and production model usage are billed directly to your accounts.",
  },
  {
    slug: "partnership",
    name: "Delivery partnership",
    category: "Keep a valuable roadmap moving",
    price: "From €24,000",
    unit: "per month",
    timeline: "Initial 3-month engagement",
    audience: "For teams with a funded roadmap and a named product owner.",
    summary:
      "A monthly delivery cadence with senior technical ownership, a prioritized backlog and specialist support matched to the work.",
    outcome:
      "Steady, reviewed progress with visible priorities, costs and release decisions.",
    deliverables: [
      "Monthly outcome plan and bounded delivery allocation",
      "Founder-led architecture and release review",
      "Weekly demo or progress review",
      "Specialist engineering, testing and documentation within the agreed allocation",
    ],
    exclusions:
      "Not unlimited development or a replacement for an entire department. Concurrent work, specialist capacity and support hours are written into the proposal.",
    acceptance:
      "Each release has its own acceptance criteria. New scope requires a trade-off or revised allocation.",
    payment:
      "Monthly in advance. Initial three months, then monthly with 30 days’ notice.",
    usage:
      "A written tooling allowance and spend cap are agreed before kickoff. Client production accounts remain separate.",
  },
  {
    slug: "leadership",
    name: "Fractional AI / CTO leadership",
    category: "Give the decisions an owner",
    price: "From €7,500",
    unit: "per month",
    timeline: "Defined monthly mandate",
    audience:
      "For founders and leadership teams who need senior technical ownership without a full-time executive hire.",
    summary:
      "A clear roadmap, architecture decisions and delivery governance. Work directly with Jurica on the decisions that determine whether the engineering investment pays off.",
    outcome:
      "A technical direction tied to business priorities, with explicit ownership and decision cadence.",
    deliverables: [
      "A defined leadership mandate and time allocation",
      "Roadmap, architecture and vendor decisions",
      "Weekly leadership session and engineering review",
      "Hiring, team design and governance within the agreed mandate",
    ],
    exclusions:
      "Implementation capacity, line management, on-call support and statutory officer responsibilities are not included unless explicitly contracted.",
    acceptance:
      "Monthly review against agreed decisions, risks, roadmap milestones and handover objectives.",
    payment:
      "Monthly in advance, with a written capacity allocation and 30 days’ notice after the initial term.",
    usage:
      "Leadership tooling is included. Implementation and production consumption are quoted separately.",
  },
] as const;
export const agencyPaths = [
  "/",
  "/services/",
  "/how-we-work/",
  "/work/",
  "/founder/",
  "/contact/",
  "/insights/",
  ...packages.map((p) => `/services/${p.slug}/`),
  ...serviceGuides.map((guide) => `/services/${guide.slug}/`),
];
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = `${siteUrl}${path}`;
  return {
    title: path === "/" ? { absolute: `${title} | ${brand.name}` } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${brand.name}`,
      description,
      url,
      siteName: brand.name,
      images: [{ url: `${siteUrl}/agency-og.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/agency-og.png`],
    },
  };
}
