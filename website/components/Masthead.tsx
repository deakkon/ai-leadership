import { identity, nav, withBase } from "../lib/site";
import MobileNav from "./MobileNav";
import StatusLine from "./StatusLine";
import ThemePicker from "./ThemePicker";

export default function Masthead() {
  return (
    <header className="masthead">
      <div className="masthead-main">
        <div className="container">
          <a className="wordmark" href={withBase("/")}>
            {identity.name}
          </a>
          <nav className="nav-links" aria-label="Primary navigation">
            {nav.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="masthead-cta">
            <ThemePicker />
            <a className="btn btn-primary" href={identity.bookingUrl} target="_blank" rel="noopener">
              Book a call
            </a>
            <MobileNav />
          </div>
        </div>
      </div>
      <div className="masthead-meta">
        <div className="container">
          <StatusLine text="Berlin, EU/EMEA" />
          <span className="masthead-locale">
            <a href={identity.emailHref}>{identity.email}</a>
            <span aria-hidden="true"> · </span>
            <a href={identity.linkedinUrl} target="_blank" rel="noopener">
              LinkedIn
            </a>
          </span>
        </div>
      </div>
    </header>
  );
}
