import { proofStrip } from "../lib/site";

export default function ProofStrip() {
  return (
    <dl className="proof-list">
      {proofStrip.map((cell) => (
        <div className="proof-row" key={cell.value}>
          <dt className="proof-value">{cell.value}</dt>
          <dd className="proof-desc">{cell.label}</dd>
        </div>
      ))}
    </dl>
  );
}
