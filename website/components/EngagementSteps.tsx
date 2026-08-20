import { process } from "../lib/site";

export default function EngagementSteps() {
  return (
    <div className="eng-steps">
      {process.map((step) => (
        <div className="eng-step" key={step.num}>
          <span className="eng-num">{step.num}</span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
