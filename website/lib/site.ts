export const siteUrl = "https://deakkon.github.io/ai-leadership";

/* Static export is served under the GitHub Pages project subpath; absolute
   internal hrefs must be prefixed to resolve on the deployed site. */
export const basePath = "/ai-leadership";
export const withBase = (href: string) => (href.startsWith("/") ? `${basePath}${href}` : href);

export const identity = {
  name: "Dr. Jurica Ševa",
  eyebrow: "Dr. Jurica Ševa · Fractional CAIO — Berlin, EU/EMEA",
  role: "Fractional Chief AI Officer & AI Transformation Executive",
  roleShort: "Fractional CAIO",
  location: "Berlin, EU/EMEA",
  email: "seva.jurica@gmail.com",
  emailHref: "mailto:seva.jurica@gmail.com?subject=AI%20leadership%20engagement",
  bookingUrl: "https://koalendar.com/e/meet-with-jurica",
  linkedinUrl: "https://www.linkedin.com/in/juricaseva",
  mandateLine:
    "Engagements: AI Transformation Diagnostic · Fractional CAIO / VP AI · Transformation Mandate",
  credentials: "PhD (Univ. of Zagreb) · English, German, Croatian",
};

export const thesis = "AI systems that make it to production.";

export const principle =
  "Intelligence is not an artifact we manufacture. It is a force through which matter continually acquires new forms of agency.";

export const hero = {
  eyebrow: "Dr. Jurica Ševa · Fractional CAIO — Berlin, EU/EMEA",
  h1: "AI Strategy · Architecture · Transformation",
  thesis,
  support: "Executive AI leadership with the depth to take strategy into production.",
};

export const nav = [
  { href: withBase("/#services"), label: "Services" },
  { href: withBase("/#experience"), label: "Experience" },
  { href: withBase("/#mandates"), label: "Mandates" },
  { href: withBase("/#insights"), label: "Insights" },
  { href: withBase("/#contact"), label: "Contact" },
];

export type Offer = {
  num: string;
  title: string;
  timeline: string;
  rate: string;
  detail: string;
  pillar: string;
};

export const offers: Offer[] = [
  {
    num: "01",
    title: "AI Transformation Diagnostic",
    timeline: "~2 weeks",
    rate: "€7,500–12,500",
    detail:
      "Executive interviews, AI maturity assessment, architecture review, opportunity portfolio, governance & reliability assessment, and a 90-day roadmap.",
    pillar: "Strategy",
  },
  {
    num: "02",
    title: "Fractional CAIO / VP AI",
    timeline: "1–2 days/week",
    rate: "€7–9k/mo · €13–16k/mo",
    detail:
      "Strategy, architecture ownership, executive alignment, engineering leadership, AI operating model, vendor decisions, roadmap and governance. Also operates as Fractional CTO.",
    pillar: "Architecture · Transformation",
  },
  {
    num: "03",
    title: "AI Transformation Mandate",
    timeline: "3–6 months",
    rate: "~€20–30k/mo",
    detail:
      "Taking an AI program from fragmented PoCs into production — one accountable operator across strategy, architecture, engineering and organizational leadership.",
    pillar: "Transformation",
  },
];

export type Service = { id: string; title: string; desc: string };

export const services: Service[] = [
  {
    id: "fractional-interim-ai-leadership",
    title: "Fractional / Interim AI Leadership",
    desc: "Roadmap, priorities, stakeholder alignment, team design, hiring, architecture governance and execution cadence for AI, data and engineering functions.",
  },
  {
    id: "ai-transformation",
    title: "AI Transformation",
    desc: "Portfolio assessment, operating model, value hypotheses, build-buy-partner decisions, governance and a sequenced path from ambition to measurable delivery.",
  },
  {
    id: "ai-platform-strategy",
    title: "AI Platform Strategy",
    desc: "Architecture across model access, data and retrieval, orchestration, APIs, security, evaluation, observability and lifecycle management.",
  },
  {
    id: "genai-agentic-systems",
    title: "GenAI & Agentic Systems",
    desc: "RAG, agents, workflow automation, evaluation, reliability, observability and human controls designed for production rather than demos.",
  },
  {
    id: "poc-to-production-recovery",
    title: "PoC-to-Production Recovery",
    desc: "Find the technical and organizational reasons an AI initiative is stuck on quality, latency, cost, governance, ownership or integration.",
  },
  {
    id: "technical-due-diligence",
    title: "Technical Due Diligence",
    desc: "Independent assessment of AI capability, architecture, team maturity, delivery risk and the credibility of a proposed roadmap.",
  },
];

export type PillarId = "strategy" | "architecture" | "transformation";

export type Pillar = {
  id: PillarId;
  index: string;
  title: string;
  definition: string;
  serviceIds: string[];
};

/**
 * The three pillars are the organizing structure of the whole site:
 * three service families (grouping the six services below) and three
 * content themes (grouping the Insights taxonomy). See /#services and /#insights.
 */
export const pillars: Pillar[] = [
  {
    id: "strategy",
    index: "01",
    title: "Strategy",
    definition: "Decide what AI should do for the business.",
    serviceIds: ["fractional-interim-ai-leadership", "ai-transformation"],
  },
  {
    id: "architecture",
    index: "02",
    title: "Architecture",
    definition: "Design systems that can actually deliver it.",
    serviceIds: ["ai-platform-strategy", "genai-agentic-systems"],
  },
  {
    id: "transformation",
    index: "03",
    title: "Transformation",
    definition: "Turn the strategy into operating capability.",
    serviceIds: ["poc-to-production-recovery", "technical-due-diligence"],
  },
];

export function servicesForPillar(pillar: Pillar): Service[] {
  return pillar.serviceIds
    .map((id) => services.find((s) => s.id === id))
    .filter((s): s is Service => Boolean(s));
}

export const whenToBringMeIn = [
  {
    title: "Your AI strategy exists, but delivery is fragmented.",
    desc: "I connect executive priorities to architecture, ownership and engineering cadence.",
  },
  {
    title: "You need senior AI ownership without a permanent executive hire.",
    desc: "I can operate fractionally or as an interim Head / VP / CAIO layer.",
  },
  {
    title: "Your GenAI PoCs are not becoming reliable products.",
    desc: "We diagnose evaluation, data, platform, integration, cost, observability and organizational constraints.",
  },
  {
    title: "You need someone who can challenge both consultants and engineers.",
    desc: "My role is to make strategy technically credible and engineering commercially relevant.",
  },
];

export const engagementModel =
  "Engagements are scoped as mandates, not hours: a two-week diagnostic, a fractional CAIO/VP mandate, or a three-to-six-month transformation program.";

export const proofStrip = [
  { value: "10+ yrs", label: "Applied AI, NLP & software" },
  { value: "VP-level", label: "AI platform ownership at Adia Health" },
  { value: "8-person", label: "Cross-timezone org built & led" },
  { value: "HIPAA · GDPR · SOC 2", label: "Regulated production delivery" },
];

export const process = [
  {
    num: "01",
    title: "Brief",
    desc: "A conversation about the business problem, the constraints and the decision you are facing. No slide decks required.",
  },
  {
    num: "02",
    title: "Diagnostic",
    desc: "A short, focused engagement to find the real blockers — typically one to two weeks, delivered as a written assessment with a 90-day roadmap.",
  },
  {
    num: "03",
    title: "Mandate",
    desc: "A defined engagement — fractional, interim or transformation — with one accountable operator and an explicit exit criterion.",
  },
];

export const howIWork = [
  {
    title: "One accountable operator, not a committee.",
    desc: "You always know who owns the outcome, and there is a single throat to choke when something is late.",
  },
  {
    title: "Strategy is tested in production.",
    desc: "If it cannot ship, it is not strategy — it is a deck. I work backward from the system, not forward from the slide.",
  },
  {
    title: "Say no early.",
    desc: "Most AI work should not be done. Refusing the wrong project is often the highest-value advice I give.",
  },
  {
    title: "No invented certainty.",
    desc: "I will tell you what I do not know, what the evidence is, and where the decision is a judgment call rather than a fact.",
  },
];

export const leadershipEvidence = [
  {
    meta: "10+ years",
    strong: "Applied AI, NLP, data, search and software systems.",
  },
  {
    meta: "VP-level",
    strong: "Owned the AI platform roadmap and architecture at Adia Health.",
  },
  {
    meta: "8-person",
    strong:
      "Cross-timezone AI / data organization built and led across data science, ML engineering and clinical expertise.",
  },
  {
    meta: "Regulated production",
    strong:
      "Healthcare AI delivery across GenAI, NLP, knowledge graphs and semantic search under HIPAA, GDPR and SOC 2 constraints.",
  },
  {
    meta: "Current focus",
    strong:
      "Fractional AI leadership across regulated healthcare and financial document intelligence — GenAI strategy, agentic systems, AI platforms, reliability, governance and engineering execution.",
  },
];

export const technicalDepth = [
  {
    meta: "PhD",
    strong: "University of Zagreb (2007–2014).",
    desc: "Thesis on web news portal content personalization using information extraction techniques and weighted Voronoi diagrams.",
  },
  {
    meta: "Research depth",
    strong:
      "Biomedical text mining and semantic data integration on the PREDICT cancer-genomics knowledge base; large-scale multi-agent simulation; multi-agent traffic control for autonomous UAVs; multi-agent organizational design for IoT.",
  },
  {
    meta: "Languages",
    strong: "English, German and Croatian (native).",
  },
  {
    meta: "Certifications",
    certs:
      "TensorFlow in Practice · Probabilistic Graphical Models · Knowledge Graphs · Machine Learning with Big Data · Hadoop · Introduction to Big Data · Cluster Analysis in Data Mining · Mining Massive Datasets · Machine Learning",
  },
];

export const engagements = [
  {
    meta: "Recent · under NDA",
    strong: "Regulated healthcare and financial document intelligence.",
    desc: "Recent fractional engagements in regulated healthcare and financial document workflows — client names remain under NDA.",
  },
  {
    meta: "AI org design · 2025",
    strong: "team.blue — AI Hiring & Organisation Advisor.",
    desc: "Advised leadership on building the AI function: role design, technical screening, interview design and team-structure advice (Jul–Dec 2025).",
  },
];

export const pullQuote = {
  quote:
    "There are many ways to describe how much I've enjoyed working with Jurica but I'll make it really short: if I want to solve for something that requires clarity of thought, grit, software and artificial intelligence I will go to Jurica. He can make it or manage it. If it requires a team to solve it, he can lead it. If it requires multiple teams to solve it, he can lead those who lead.",
  author: "Michael Lindqvist · recommendation via LinkedIn",
};
