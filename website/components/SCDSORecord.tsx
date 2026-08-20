import type { SCDSORecord } from "../lib/mandates";
import Diagram from "./Diagram";

export default function SCDSORecord({ record }: { record: SCDSORecord }) {
  return (
    <div className="scdso">
      <div className="scdso-row">
        <span className="scdso-key">Situation</span>
        <p>{record.situation}</p>
      </div>
      <div className="scdso-row">
        <span className="scdso-key">Constraint</span>
        <p>{record.constraint}</p>
      </div>
      {record.decision && (
        <div className="scdso-row">
          <span className="scdso-key">Decision</span>
          <p>{record.decision}</p>
        </div>
      )}
      <div className="scdso-row">
        <span className="scdso-key">System</span>
        <div>
          <ul>
            {record.system.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {record.diagram && <Diagram spec={record.diagram} />}
        </div>
      </div>
      {record.outcome && (
        <div className="scdso-row">
          <span className="scdso-key">Outcome</span>
          <p className="scdso-outcome">{record.outcome}</p>
        </div>
      )}
    </div>
  );
}
