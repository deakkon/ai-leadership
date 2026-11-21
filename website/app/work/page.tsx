import { AgencyCTA, PageIntro } from "../../components/Agency";
import { pageMetadata } from "../../lib/agency";
import { withBase } from "../../lib/site";
export const metadata = pageMetadata(
  "Example software and AI delivery briefs",
  "Illustrative briefs for B2B software, document workflows and AI prototype recovery, plus the founder experience behind the work.",
  "/work/",
);
export default function Work() {
  return (
    <main id="main" className="agency-main">
      <PageIntro kicker="Work and experience" title="Make the brief concrete.">
        <p>
          The briefs below illustrate work we can scope together. They are not
          completed agency projects or client results.
        </p>
      </PageIntro>
      <div className="agency-work-list">
        {[
          [
            "Document intake without the copy-and-paste chain",
            "A European SME routes incoming documents manually between inboxes and spreadsheets.",
            "One document type, one intake channel, extraction with a review queue, and one downstream integration.",
            "Extraction quality on an agreed test set, correct exception routing, processing latency and cost per document.",
            "Production samples, permission to use the data, and an operations owner to review exceptions.",
          ],
          [
            "A useful B2B feature beyond the demo",
            "A startup has a promising AI prototype but lacks evaluation, access control and production integration.",
            "One user journey with authentication, a representative evaluation set, observability and a release plan.",
            "Task success on agreed cases, access isolation, graceful failure and a working rollback.",
            "A product owner, API access, representative cases and a defined deployment environment.",
          ],
          [
            "An internal tool that closes an operational gap",
            "A scaleup is coordinating recurring work across spreadsheets and disconnected SaaS tools.",
            "One team workflow, a focused interface, role-based access and a bounded integration.",
            "End-to-end completion of the agreed workflow, correct permissions and a usable handover.",
            "An accountable process owner and timely feedback from the users.",
          ],
        ].map(([title, context, scope, acceptance, inputs]) => (
          <article className="agency-prose" key={title}>
            <p className="agency-kicker">Illustrative engagement</p>
            <h2>{title}</h2>
            <p>{context}</p>
            <h3>Possible first release</h3>
            <p>{scope}</p>
            <h3>Evidence of success</h3>
            <p>{acceptance}</p>
            <h3>What the client brings</h3>
            <p>{inputs}</p>
          </article>
        ))}
      </div>
      <section className="agency-section agency-prose">
        <h2>Experience behind the delivery model</h2>
        <p>
          Jurica’s prior leadership work includes AI platform ownership and an
          eight-person AI/data organization at Adia Health, plus production work
          spanning NLP, semantic search and knowledge graphs. These are personal
          career credentials, not agency case studies.
        </p>
        <a className="agency-text-link" href={withBase("/founder/")}>
          Meet the founder
        </a>
      </section>
      <AgencyCTA />
    </main>
  );
}
