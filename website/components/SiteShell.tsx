"use client";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Wordmark } from "./Agency";
import { identity } from "../lib/site";
import { withBase } from "../lib/site-config";

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  const links = [
    ["Services", "/services/"],
    ["Packages", "/#v2-packages"],
    ["My approach", "/#v2-process"],
    ["About Jurica", "/founder/"],
  ];
  const navigation = links.map(([name, href]) => (
    <a
      key={name}
      href={withBase(href)}
      aria-current={
        href.includes("#")
          ? undefined
          : pathname.replace(/\/$/, "") === withBase(href).replace(/\/$/, "") ||
              pathname.replace(/\/$/, "") === href.replace(/\/$/, "")
            ? "page"
            : href === "/services/" && pathname.includes("/services/")
              ? "location"
              : undefined
      }
      onClick={() => {
        if (menu.current) menu.current.open = false;
      }}
    >
      {name}
    </a>
  ));
  return (
    <div className="v2-site">
      <header className="v2-nav">
        <a className="v2-brand" href={withBase("/")}>
          <Wordmark />
        </a>
        <nav className="v2-desktop-nav" aria-label="Main navigation">
          {navigation}
        </nav>
        <a
          className="v2-button v2-nav-cta"
          href={identity.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Let’s talk <span aria-hidden="true">↗</span>
        </a>
        <details className="v2-mobile-nav" ref={menu}>
          <summary>
            Menu <span aria-hidden="true">+</span>
          </summary>
          <nav aria-label="Mobile navigation">{navigation}</nav>
        </details>
      </header>
      {children}
      <footer className="v2-footer">
        <div>
          <a href={withBase("/")}>
            <Wordmark />
          </a>
          <p>
            AI strategy and software engineering.
            <br />
            I’m Dr. Jurica Ševa. Based in Berlin.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <a href={withBase("/services/")}>Services</a>
          <a href={withBase("/founder/")}>Background</a>
          <a
            href={identity.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn ↗
          </a>
          <a href={`mailto:${identity.email}`}>Email Jurica ↗</a>
        </nav>
        <div className="v2-footer-bottom">
          <span>Hooman in the Loop</span>
          <a href={withBase("/legal/")}>Legal notice</a>
          <a href={withBase("/privacy/")}>Privacy</a>
          <a href={withBase("/insights/")}>Insights</a>
        </div>
      </footer>
    </div>
  );
}
