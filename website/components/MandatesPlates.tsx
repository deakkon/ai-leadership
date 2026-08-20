import { featuredMandates } from "../lib/mandates";
import SCDSORecord from "./SCDSORecord";

export default function MandatesPlates() {
  return (
    <div className="plates">
      {featuredMandates.map((m) => (
        <article className="plate" key={m.id} id={`mandate-${m.id}`}>
          <header className="plate-head">
            <div className="plate-head-main">
              <span className="idx plate-index">{m.num}</span>
              <h3>{m.company}</h3>
              <p className="plate-headline">{m.headline}</p>
            </div>
            <div className="plate-meta">
              <span>
                {m.role} · {m.sector}
              </span>
              <span>{m.period}</span>
              <span className="constraint">{m.constraintClass}</span>
            </div>
          </header>
          <SCDSORecord record={m} />
        </article>
      ))}
    </div>
  );
}
