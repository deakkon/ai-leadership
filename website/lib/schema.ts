import { identity, siteUrl } from "./site";

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/founder/#person`,
  name: identity.name,
  jobTitle: "Fractional Chief AI Officer and AI Transformation Executive",
  url: `${siteUrl}/founder/`,
  email: "mailto:seva.jurica@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Berlin",
    addressCountry: "DE",
  },
  sameAs: [identity.linkedinUrl],
  knowsAbout: [
    "AI Strategy",
    "Generative AI",
    "Agentic AI",
    "RAG",
    "AI Platforms",
    "NLP",
    "AI Engineering",
    "Data Strategy",
    "AI Governance",
  ],
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Zagreb" },
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    name: "Doctorate (PhD)",
    credentialCategory: "degree",
    educationalLevel: "Doctoral",
    recognizedBy: {
      "@type": "CollegeOrUniversity",
      name: "University of Zagreb",
    },
    description:
      "Thesis: web news portal content personalization using information extraction techniques and weighted Voronoi diagrams.",
  },
};

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Hooman in the Loop — Human-led software engineering",
  url: siteUrl,
  areaServed: ["Germany", "European Union", "EMEA"],
  provider: { "@type": "Person", name: identity.name },
  serviceType: [
    "Fractional Chief AI Officer",
    "AI Transformation",
    "AI Strategy",
    "AI Architecture",
    "Interim AI Leadership",
  ],
};
