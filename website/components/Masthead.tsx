"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { identity, nav, withBase, basePath } from "../lib/site";
import { Wordmark } from "./Agency";

function normalized(path: string) {
  const withoutBase =
    path === basePath || path.startsWith(basePath + "/")
      ? path.slice(basePath.length)
      : path;
  return withoutBase.replace(/\/$/, "") || "/";
}
export default function Masthead() {
  const pathname = normalized(usePathname());
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (
        menu.current?.open &&
        event.target instanceof Node &&
        !menu.current.contains(event.target)
      )
        menu.current.open = false;
    };
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", outside);
    };
  }, []);
  function links() {
    return nav.map((link) => {
      const destination = normalized(link.href);
      const current =
        pathname === destination
          ? "page"
          : pathname.startsWith(destination + "/")
            ? "location"
            : undefined;
      return (
        <a
          href={link.href}
          key={link.href}
          aria-current={current}
          onClick={() => {
            if (menu.current) menu.current.open = false;
          }}
        >
          {link.label}
        </a>
      );
    });
  }
  return (
    <header className="agency-header">
      <a className="agency-brand-link" href={withBase("/")}>
        <Wordmark />
      </a>
      <nav className="agency-nav" aria-label="Primary navigation">
        {links()}
      </nav>
      <a
        className="agency-button small"
        href={identity.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Let’s talk
        <span className="visually-hidden">
          {" "}
          (opens scheduling in a new tab)
        </span>
      </a>
      <details ref={menu} className="agency-mobile-menu">
        <summary>
          Menu
          <span className="menu-chevron" aria-hidden="true" />
        </summary>
        <nav aria-label="Mobile navigation">{links()}</nav>
      </details>
    </header>
  );
}
