import { identity, withBase } from "../lib/site";
import { Wordmark } from "./Agency";
export default function Footer() {
  return (
    <footer className="agency-footer">
      <div>
        <a href={withBase("/")}>
          <Wordmark />
        </a>
        <p>
          Senior judgment. Agent-assisted execution.
          <br />
          Berlin, Germany · Working globally.
        </p>
      </div>
      <nav aria-label="Footer navigation">
        <a href={withBase("/founder/")}>The founder</a>
        <a href={withBase("/insights/")}>Insights</a>
        <a
          href={identity.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a href={`mailto:${identity.email}`}>Email Jurica</a>
      </nav>
      <div className="agency-footer-bottom">
        <span>Hooman in the Loop · Dr. Jurica Ševa</span>
        <a href={withBase("/legal/")}>Legal notice</a>
        <a href={withBase("/privacy/")}>Privacy</a>
        <span>Human-led, by design.</span>
      </div>
    </footer>
  );
}
