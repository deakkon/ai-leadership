export type ConstraintClass = "Regulatory" | "Scale" | "Org" | "Legacy" | "NDA";

export type SCDSORecord = {
  id: string;
  num: string;
  company: string;
  headline: string;
  role: string;
  sector: string;
  period: string;
  constraintClass: ConstraintClass;
  featured: boolean;
  /** Presentational slots used by shared showcase variants. */
  index?: string;
  selected?: boolean;
  situation: string;
  constraint: string;
  decision?: string;
  system: string[];
  outcome?: string;
  tech: string;
  diagram?: DiagramSpec;
};

export type DiagramSpec = {
  id: string;
  caption: string;
  rows: { label: string; cells: string[] }[];
  rail?: string;
};

/**
 * SCDSO records built exclusively from the verified showcase content
 * in components/ProjectShowcase.tsx (role · sector · period · description ·
 * metric · tech). Fields a record cannot support are omitted, not invented.
 */
export const mandates: SCDSORecord[] = [
  {
    id: "adia-health",
    num: "01",
    company: "Adia Health",
    headline: "AI Platform for Regulated Healthcare",
    role: "Owned · VP of AI & Data Science",
    sector: "Healthcare · Regulated",
    period: "Mar 2024 – Jul 2025",
    constraintClass: "Regulatory",
    featured: true,
    situation:
      "A regulated healthcare business needed a production AI platform for payment transformation — GenAI assistants, clinical NLP, knowledge graphs and semantic search operating as one system, under HIPAA, GDPR and SOC 2 constraints.",
    constraint:
      "Regulatory (HIPAA, GDPR, SOC 2) · no pre-existing AI platform · the AI/data organization itself had to be built from scratch.",
    decision:
      "Own the roadmap and architecture directly while building the team that ships it — one accountable operator across platform and organization rather than separating strategy from delivery.",
    system: [
      "Production AI platform for healthcare payment transformation combining GenAI assistants, clinical NLP, knowledge graphs and semantic search",
      "8-person cross-timezone AI/data organization across data science, ML engineering and clinical expertise",
      "Delivery under HIPAA, GDPR and SOC 2 from the start",
    ],
    outcome: "8-person cross-timezone org built and led; regulated production delivery.",
    tech: "GenAI · RAG · Knowledge Graphs · Clinical NLP · AWS",
    diagram: {
      id: "adia-platform",
      caption: "Figure 1 — One accountable operator · platform, compliance and organization in parallel",
      rows: [
        { label: "Operator", cells: ["VP AI & Data Science"] },
        { label: "Platform", cells: ["GenAI assistants", "Clinical NLP", "Knowledge graphs", "Semantic search"] },
      ],
      rail: "HIPAA · GDPR · SOC 2",
    },  },
  {
    id: "ada-health",
    num: "02",
    company: "Ada Health",
    headline: "NLP Roadmap & Knowledge Systems",
    role: "Led · NLP Engineer → Head of NLP",
    sector: "Healthcare · Consumer AI",
    period: "Mar 2019 – Jun 2021",
    constraintClass: "Scale",
    featured: true,
    situation:
      "A consumer-AI health company needed structured, queryable knowledge for its NLP work — but the source material was unstructured and large: PubMed literature and EHR content.",
    constraint:
      "Scale — PubMed and EHR corpora at production volume, with a labeling bottleneck on the NLP team.",
    decision:
      "Set the first company-wide NLP roadmap and co-designed an active-learning annotation platform — trading up-front platform work for a structural reduction in labeling effort.",
    system: [
      "Extraction pipelines turning PubMed and EHR content into UMLS-backed knowledge systems",
      "First company-wide NLP roadmap",
      "Active-learning annotation platform co-designed with the NLP team",
    ],
    outcome: "30% reduction in annotation labeling effort.",
    tech: "NLP · UMLS · PubMed/EHR · Active Learning",
    diagram: {
      id: "ada-knowledge",
      caption: "Figure 2 — From unstructured clinical text to UMLS-backed knowledge systems",
      rows: [
        { label: "Source", cells: ["PubMed literature", "EHR content"] },
        { label: "Pipeline", cells: ["Extraction", "Normalization → UMLS"] },
        { label: "Output", cells: ["Knowledge systems", "Annotation platform (active learning)"] },
      ],
      rail: "30% annotation-effort reduction",
    },
  },
  {
    id: "cgm",
    num: "03",
    company: "CompuGroup Medical",
    headline: "Multilingual Speech Platform",
    role: "Built · Senior AI Specialist / ML Engineer",
    sector: "Healthcare · Regulated",
    period: "Jul 2021 – Apr 2022",
    constraintClass: "Regulatory",
    featured: true,
    situation:
      "A regulated healthcare-software company needed a multilingual dental speech-recognition platform — and had a PoC that had not yet become a deployable system.",
    constraint:
      "Regulatory healthcare context · multilingual speech data · no production deployment path yet.",
    decision:
      "Take the PoC to a containerized Azure MVP as the first production milestone, and combine MIMIC-III EHR data with a UMLS knowledge graph for disease-prediction models in parallel.",
    system: [
      "Multilingual dental speech-recognition platform, PoC → containerized Azure MVP",
      "Disease-prediction models fusing MIMIC-III EHR data with a UMLS-based knowledge graph",
    ],
    outcome: "PoC → multilingual ASR MVP deployed on Azure.",
    tech: "ASR · Azure · Docker · MIMIC-III EHR · Knowledge Graphs",
    diagram: {
      id: "cgm-asr",
      caption: "Figure 3 — Multilingual dental ASR from PoC to a containerized Azure MVP",
      rows: [
        { label: "Input", cells: ["Multilingual dental audio"] },
        { label: "Pipeline", cells: ["ASR (PoC)", "Containerized MVP → Azure"] },
        { label: "Parallel", cells: ["Disease prediction · MIMIC-III + UMLS KG"] },
      ],
      rail: "Regulated healthcare context",
    },
  },
  {
    id: "space-inch",
    num: "04",
    company: "Space Inch",
    headline: "GenAI Client Delivery & AI Engineering Leadership",
    role: "Led · Head of AI Engineering",
    sector: "Digital Product Studio",
    period: "Oct 2025 – Jan 2026",
    constraintClass: "Org",
    featured: true,
    situation:
      "A Berlin product studio needed AI strategy and dependable GenAI delivery for client work — with engineering teams that had not yet standardized how AI features are built and evaluated.",
    constraint:
      "Org — studio-wide engineering teams needed consistent AI tooling, quality and governance rather than per-project bespoke approaches.",
    decision:
      "Lead AI strategy and end-to-end delivery as one accountable function, and define shared tooling, quality and governance workflows for the whole studio's engineering teams.",
    system: [
      "AI strategy and end-to-end delivery of GenAI-enabled client features — requirements, architecture, implementation, evaluation, deployment",
      "Studio-wide AI tooling, quality and governance workflows used by the engineering teams",
    ],
    outcome:
      "GenAI-enabled client features delivered end-to-end, and the studio's AI tooling, evaluation and governance workflows defined.",
    tech: "GenAI · RAG · Evaluation · Engineering Workflows",
  },
  {
    id: "flow-health",
    num: "05",
    company: "Flow Health",
    headline: "AI over Real-World Health Data",
    role: "Led · Head of Data Science",
    sector: "Healthcare · Data",
    period: "Jan – Jul 2024",
    constraintClass: "Regulatory",
    featured: false,
    situation:
      "An AI organization building over real-world health data needed data-science delivery that stayed aligned with product strategy and regulated data usage.",
    constraint: "Regulatory — real-world health data with regulated usage constraints.",
    system: [
      "AI application development over real-world health data",
      "Data-science delivery aligned with product strategy and regulated data usage",
    ],
    tech: "ML · Real-World Data",
  },
  {
    id: "synlab",
    num: "06",
    company: "SYNLAB",
    headline: "Lab-Test Workflow Automation & Diagnostic Support",
    role: "Built · Senior AI Engineer",
    sector: "Healthcare · Diagnostics",
    period: "Jan – Dec 2023",
    constraintClass: "Regulatory",
    featured: false,
    situation:
      "A regulated laboratory environment needed ML support for lab-test workflows and diagnostics.",
    constraint: "Regulatory — production ML inside a regulated laboratory environment.",
    system: [
      "ML solutions for lab-test workflow automation",
      "Diagnostic support within the regulated environment",
    ],
    tech: "ML · Workflow Automation",
  },
  {
    id: "lakatu",
    num: "07",
    company: "Lakatu",
    headline: "Multi-Domain NLP & Information Retrieval",
    role: "Led · Head of Data Science",
    sector: "Market Research & Consulting",
    period: "May – Dec 2022",
    constraintClass: "Scale",
    featured: false,
    situation:
      "A market-research consulting business needed applied AI over large, multi-domain document sets.",
    constraint: "Scale — multi-domain document data at consulting volume.",
    system: [
      "NLP and information-retrieval pipelines over multi-domain document data",
      "Applied-AI project leadership in a consulting context",
    ],
    tech: "NLP · Information Retrieval",
  },
];

export const featuredMandates = mandates.filter((m) => m.featured);
export const indexMandates = mandates.filter((m) => !m.featured);

export function getMandate(id: string) {
  return mandates.find((m) => m.id === id) ?? mandates[0];
}

export const deliveryModelDiagram: DiagramSpec = {
  id: "delivery-model",
  caption: "Figure — One accountable operator across strategy, architecture, engineering and organizational leadership",
  rows: [
    {
      label: "Strategy",
      cells: ["AI strategy", "Value hypotheses", "Build-buy-partner"],
    },
    {
      label: "Architecture",
      cells: ["AI platform", "Data & retrieval", "Security & governance"],
    },
    {
      label: "Engineering",
      cells: ["Delivery cadence", "Evaluation & reliability", "Observability"],
    },
    {
      label: "Org leadership",
      cells: ["Executive alignment", "Team design", "Hiring & ownership"],
    },
  ],
  rail: "One accountable operator",
};
