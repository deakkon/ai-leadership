"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { identity, withBase } from "../lib/site";
import ThemePicker from "./ThemePicker";

const links = [
  { href: withBase("/#services"), label: "Services" },
  { href: withBase("/#experience"), label: "Experience" },
  { href: withBase("/#mandates"), label: "Mandates" },
  { href: withBase("/#insights"), label: "Insights" },
  { href: withBase("/#contact"), label: "Contact" },
];

const FOCUSABLE = "a[href], button:not([disabled])";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab" && drawerRef.current) {
        const els = Array.from(drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (els.length === 0) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const first = drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      toggleRef.current?.focus();
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M2 2l14 14M16 2L2 16" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M2 4h14M2 9h14M2 14h14" />
          </svg>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              className="drawer-backdrop"
              aria-label="Close menu"
              onClick={close}
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              id="mobile-menu"
              ref={drawerRef}
              className="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="drawer-head">
                <span className="wordmark">{identity.name}</span>
                <button
                  type="button"
                  className="drawer-close"
                  aria-label="Close menu"
                  onClick={close}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M2 2l14 14M16 2L2 16" />
                  </svg>
                </button>
              </div>
              <nav className="drawer-links" aria-label="Primary navigation">
                {links.map((link, i) => (
                  <a key={link.href} href={link.href} onClick={close}>
                    <span className="micro">{String(i + 1).padStart(2, "0")}</span>
                    <span>{link.label}</span>
                  </a>
                ))}
              </nav>
              <div className="drawer-theme">
                <span className="micro">Theme</span>
                <ThemePicker />
              </div>
              <a
                className="btn btn-primary"
                href={identity.bookingUrl}
                target="_blank"
                rel="noopener"
                onClick={close}
              >
                Book a call
              </a>
              <p className="micro" style={{ marginTop: "auto", paddingTop: "var(--sp-6)", color: "var(--muted)" }}>
                {identity.location}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
