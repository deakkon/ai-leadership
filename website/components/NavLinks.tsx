"use client";

import { usePathname } from "next/navigation";
import { identity, nav } from "../lib/site";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="navlinks" aria-label="Primary navigation">
      {nav.map((l) => {
        const current = l.href === "/#insights" && pathname.startsWith("/insights");
        return (
          <a className="nav-desktop" key={l.href} href={l.href} aria-current={current ? "true" : undefined}>
            {l.label}
          </a>
        );
      })}
      <a className="nav-cta nav-desktop" href={identity.bookingUrl} target="_blank" rel="noopener">
        Book a call
      </a>
    </nav>
  );
}
