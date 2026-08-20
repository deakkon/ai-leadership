import { identity } from "../lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="footer-name">{identity.name}</span>
        <span>Berlin · EU/EMEA</span>
        <a href={identity.emailHref}>{identity.email}</a>
        <a href={identity.linkedinUrl} target="_blank" rel="noopener">
          LinkedIn
        </a>
        <span>Colophon · set in Newsreader &amp; IBM Plex Mono · newsprint, ink, ember</span>
      </div>
    </footer>
  );
}
