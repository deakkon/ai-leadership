import type { Metadata } from "next";
import { ButtonPrimary, ButtonSecondary, TextLink } from "../components/Button";
import ContentsRow from "../components/ContentsRow";
import CountUp from "../components/CountUp";
import Diagram from "../components/Diagram";
import EngagementSteps from "../components/EngagementSteps";
import InsightsIndex from "../components/InsightsIndex";
import Ledger from "../components/Ledger";
import MandatesIndex from "../components/MandatesIndex";
import MandatesPlates from "../components/MandatesPlates";
import ProofStrip from "../components/ProofStrip";
import PullQuote from "../components/PullQuote";
import Reveal from "../components/Reveal";
import { RuleList, RuleRow } from "../components/RuleList";
import SectionHeader from "../components/SectionHeader";
import Stat from "../components/Stat";
import {
  engagementModel,
  hero,
  howIWork,
  identity,
  offers,
  pillars,
  principle,
  process,
  servicesForPillar,
  whenToBringMeIn,
  withBase,
} from "../lib/site";
import { deliveryModelDiagram } from "../lib/mandates";
import { personSchema, serviceSchema } from "../lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      {/* 01 — Hero (static, identity on screen one) */}
      <section className="section hero">
        <div className="container">
          <p className="eyebrow hero-eyebrow">{identity.eyebrow}</p>
          <h1>{hero.h1}</h1>
          <p className="hero-thesis">{hero.thesis}</p>
          <p className="hero-support">{hero.support}</p>
          <div className="hero-cta-row">
            <ButtonPrimary href={identity.bookingUrl} target="_blank" rel="noopener">
              Book a call
            </ButtonPrimary>
            <ButtonSecondary href={identity.emailHref}>Email directly</ButtonSecondary>
            <span className="hero-rate">{identity.mandateLine}</span>
          </div>
          <ProofStrip />
        </div>
      </section>

      {/* 02 — What I do: thesis + three productized offers */}
      <section className="section" id="offers" data-topic="strategy">
        <div className="container">
          <SectionHeader
            index="01"
            eyebrow="What I do"
            title="Three productized ways to bring me in."
            lead="Each engagement maps to one of the three pillars — Strategy · Architecture · Transformation — with one accountable operator."
            leadClassName="drop-cap"
            drawHairline
          />
          <div className="grid-1-2">
            <div>
              <Diagram spec={deliveryModelDiagram} />
            </div>
            <div>
              {offers.map((offer) => (
                <div className="contents-row offer-row" key={offer.num}>
                  <span className="idx">{offer.num}</span>
                  <div className="contents-main">
                    <div className="contents-line">
                      <h3>{offer.title}</h3>
                      <span className="dot-leader" aria-hidden="true" />
                      <span className="contents-meta">
                        {offer.timeline} · {offer.rate}
                      </span>
                    </div>
                    <p className="offer-pillar">{offer.pillar}</p>
                    <p className="offer-detail">{offer.detail}</p>
                    <p className="offer-cta">
                      <TextLink href={identity.bookingUrl} target="_blank" rel="noopener">
                        Book a call
                      </TextLink>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Capabilities: six services under the three pillar families */}
      <section className="section" id="services">
        <div className="container">
          <SectionHeader
            index="02"
            eyebrow="Capabilities"
            title="Six services, three families, one outcome."
            lead="Every engagement sits inside one of the three pillars — decide, design, deliver. Each family is a set of services with a single accountable owner."
          />
          <div>
            {pillars.map((pillar) => (
              <div className="pillar-family" key={pillar.id}>
                <div className="pillar-head">
                  <span className="pillar-index">{pillar.index}</span>
                  <span className="pillar-title">{pillar.title}</span>
                  <span className="pillar-def">{pillar.definition}</span>
                </div>
                <div className="contents">
                  {servicesForPillar(pillar).map((service, i) => (
                    <ContentsRow
                      key={service.id}
                      num={`${pillar.index}.${i + 1}`}
                      title={service.title}
                      desc={service.desc}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — How I engage */}
      <section className="section" id="how">
        <div className="container">
          <SectionHeader
            index="03"
            eyebrow="How I engage"
            title="A defined path from brief to mandate."
            lead="No discovery-phase theater. A short brief, a focused diagnostic, then a mandate with an owner and an exit criterion."
          />
        </div>
        <div className="container grid-1-2">
          <div>
            <EngagementSteps />
          </div>
          <div>
            <h3 className="micro" style={{ padding: "0 0 var(--sp-3)", color: "var(--muted)" }}>
              When to bring me in
            </h3>
            <RuleList>
              {whenToBringMeIn.map((item) => (
                <RuleRow key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </RuleRow>
              ))}
            </RuleList>
          </div>
        </div>
      </section>

      {/* 05 — Selected mandates */}
      <section className="section" id="mandates" data-topic="architecture">
        <div className="container">
          <SectionHeader
            index="04"
            eyebrow="Selected mandates"
            title="Built, led and advised — in production, not on a whiteboard."
            lead="Four mandates with the full record visible; the remaining three as a working index."
            drawHairline
          />
          <MandatesPlates />
          <MandatesIndex />
        </div>
      </section>

      {/* 06 — Engagements */}
      <section className="section" id="engagements">
        <div className="container">
          <SectionHeader
            index="05"
            eyebrow="Engagements"
            title="Advisory mandates and the fractional practice."
          />
          <div className="grid-1-2">
            <div />
            <RuleList>
              <RuleRow label="Recent · under NDA">
                <strong>Regulated healthcare and financial document intelligence.</strong>
                <p>
                  Recent fractional engagements in regulated healthcare and financial document
                  workflows — client names remain under NDA.
                </p>
              </RuleRow>
              <RuleRow label="AI org design · 2025">
                <strong>team.blue — AI Hiring &amp; Organisation Advisor.</strong>
                <p>
                  Advised leadership on building the AI function: role design, technical screening,
                  interview design and team-structure advice (Jul–Dec 2025).
                </p>
              </RuleRow>
            </RuleList>
          </div>
        </div>
      </section>

      {/* 07 — Experience & credibility */}
      <section className="section" id="experience" data-topic="transformation">
        <div className="container">
          <SectionHeader
            index="06"
            eyebrow="Experience & credibility"
            title="Executive enough for the decision. Technical enough for the architecture."
          />
          <div className="grid-1-2">
            <h3 className="micro" style={{ paddingTop: "var(--sp-2)" }}>
              Leadership evidence
            </h3>
            <RuleList>
              <RuleRow label={<CountUp value={10} suffix="+ yrs" />}>
                <strong>Applied AI, NLP, data, search and software systems.</strong>
              </RuleRow>
              <RuleRow label="VP-level">
                <strong>Owned the AI platform roadmap and architecture at Adia Health.</strong>
              </RuleRow>
              <RuleRow label={<CountUp value={8} suffix="-person" />}>
                <strong>
                  Cross-timezone AI / data organization built and led across data science, ML
                  engineering and clinical expertise.
                </strong>
              </RuleRow>
              <RuleRow label="Regulated production">
                <strong>
                  Healthcare AI delivery across GenAI, NLP, knowledge graphs and semantic search under
                  HIPAA, GDPR and SOC&nbsp;2 constraints.
                </strong>
              </RuleRow>
              <RuleRow label="Current focus">
                <strong>
                  Fractional AI leadership across regulated healthcare and financial document
                  intelligence — GenAI strategy, agentic systems, AI platforms, reliability, governance
                  and engineering execution.
                </strong>
              </RuleRow>
            </RuleList>
          </div>
          <div className="grid-1-2" style={{ marginTop: "var(--sp-9)" }}>
            <h3 className="micro" style={{ paddingTop: "var(--sp-2)" }}>
              Technical depth
            </h3>
            <RuleList>
              <RuleRow label="PhD">
                <strong>University of Zagreb (2007–2014).</strong>
                <p>
                  Thesis on web news portal content personalization using information extraction
                  techniques and weighted Voronoi diagrams.
                </p>
              </RuleRow>
              <RuleRow label="Research depth">
                <strong>
                  Biomedical text mining and semantic data integration on the PREDICT cancer-genomics
                  knowledge base; large-scale multi-agent simulation; multi-agent traffic control for
                  autonomous UAVs; multi-agent organizational design for IoT.
                </strong>
              </RuleRow>
              <RuleRow label="Languages">
                <strong>English, German and Croatian (native).</strong>
              </RuleRow>
              <RuleRow label="Certifications">
                <p className="cert-list">
                  TensorFlow in Practice · Probabilistic Graphical Models · Knowledge Graphs · Machine
                  Learning with Big Data · Hadoop · Introduction to Big Data · Cluster Analysis in Data
                  Mining · Mining Massive Datasets · Machine Learning
                </p>
              </RuleRow>
            </RuleList>
          </div>
        </div>
      </section>

      {/* 08 — Human signal */}
      <section className="section" id="signal">
        <div className="container grid-1-2">
          <div>
            <SectionHeader
              index="07"
              eyebrow="Human signal"
              title="What it is like to work with me."
            />
          </div>
          <div>
            <PullQuote cite="Michael Lindqvist · recommendation via LinkedIn">
              There are many ways to describe how much I&apos;ve enjoyed working with Jurica but
              I&apos;ll make it really short: if I want to solve for something that requires clarity
              of thought, grit, software and artificial intelligence I will go to Jurica. He can make
              it or manage it. If it requires a team to solve it, he can lead it. If it requires
              multiple teams to solve it, he can lead those who lead.
            </PullQuote>
            <h3 className="micro" style={{ padding: "var(--sp-7) 0 var(--sp-3)", color: "var(--muted)" }}>
              How I work
            </h3>
            {/* founding principle — the worldview under the hero thesis, frames the principles below */}
            <Reveal>
              <p className="epigraph">{principle}</p>
            </Reveal>
            <RuleList>
              {howIWork.map((item) => (
                <RuleRow key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </RuleRow>
              ))}
            </RuleList>
          </div>
        </div>
      </section>

      {/* 09 — Thinking */}
      <section className="section" id="insights">
        <div className="container">
          <SectionHeader
            index="08"
            eyebrow="Thinking"
            title="Practical notes on building AI systems and organizations."
            lead="Essays are filed under the same three pillars as the services — Strategy, Architecture, Transformation — so the taxonomy stays aligned with the work."
          />
          <InsightsIndex />
          <p style={{ marginTop: "var(--sp-6)" }}>
            <TextLink href={withBase("/insights")}>All essays</TextLink>
          </p>
        </div>
      </section>

      {/* 10 — CTA band (inverted) */}
      <section className="section cta-band" id="contact">
        <div className="container">
          <div className="grid-1-2">
            <div>
              <SectionHeader
                eyebrow="Engagement model"
                title="Fractional leadership, interim ownership, or a focused transformation sprint."
              />
            </div>
            <div>
              <p className="lead">{engagementModel}</p>
              <Ledger
                caption="Rates"
                head={["Engagement", "Rate", "Structure"]}
                rows={[
                  {
                    cell: "AI Transformation Diagnostic",
                    detail: "€7,500–12,500",
                    meta: "~2 weeks",
                  },
                  {
                    cell: "Fractional CAIO / VP AI (or CTO)",
                    detail: "€7–9k / €13–16k per month",
                    meta: "1 / 2 days per week",
                  },
                  {
                    cell: "AI Transformation Mandate",
                    detail: "~€20–30k per month",
                    meta: "3–6 months",
                  },
                ]}
              />
              <p className="micro" style={{ margin: "var(--sp-6) 0 0", color: "var(--accent)" }}>
                Process —{" "}
                {process.map((step) => `${step.num} ${step.title}`).join(" · ")}
              </p>
              <div className="stat-row" style={{ marginTop: "var(--sp-6)" }}>
                <Stat value="10+ yrs" caption="Applied AI, NLP & software" />
                <Stat value="8-person" caption="Cross-timezone org built & led" />
                <Stat value="HIPAA · GDPR · SOC 2" caption="Regulated production delivery" />
                <Stat value="3–6 mo" caption="Transformation mandate" />
              </div>
              <div className="hero-cta-row" style={{ marginTop: "var(--sp-5)" }}>
                <ButtonPrimary href={identity.bookingUrl} target="_blank" rel="noopener">
                  Book a call
                </ButtonPrimary>
                <ButtonSecondary href={identity.emailHref}>Email directly</ButtonSecondary>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
