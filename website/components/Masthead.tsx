import { identity, nav, withBase } from "../lib/site";
import { Wordmark } from "./Agency";
export default function Masthead() {
  return (
    <header className="agency-header">
      <a className="agency-brand-link" href={withBase("/")}>
        <Wordmark />
      </a>
      <nav className="agency-nav" aria-label="Primary navigation">
        {nav.map((link) => (
          <a href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <a
        className="agency-button small"
        href={identity.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Let’s talk
      </a>
      <details className="agency-mobile-menu">
        <summary>Menu</summary>
        <nav aria-label="Mobile navigation">
          {nav.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </details>
    </header>
  );
}
