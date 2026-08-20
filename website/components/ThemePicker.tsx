"use client";

import { useEffect, useState } from "react";
import { THEME_EVENT, THEME_LABELS, THEMES, applyTheme, getTheme, type Theme } from "../lib/theme";

/**
 * Editorial theme picker — Newsprint / Forge. Two pressed-state buttons
 * (aria-pressed), mono micro register to match the system. State mirrors
 * html[data-theme]; it listens to the shared theme-change event so the
 * masthead and drawer instances stay in sync with the pre-paint boot script.
 */
export default function ThemePicker() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(getTheme());
    const onThemeChange = (e: Event) => {
      setTheme((e as CustomEvent<Theme>).detail);
    };
    window.addEventListener(THEME_EVENT, onThemeChange);
    return () => window.removeEventListener(THEME_EVENT, onThemeChange);
  }, []);

  const select = (value: Theme) => {
    if (value !== getTheme()) applyTheme(value);
  };

  return (
    <div className="theme-picker" role="group" aria-label="Colour theme">
      {THEMES.map((value) => (
        <button
          key={value}
          type="button"
          className={`theme-option${theme === value ? " is-active" : ""}`}
          aria-pressed={theme === value}
          aria-label={value === "light" ? "Switch to Newsprint theme" : "Switch to Forge theme"}
          suppressHydrationWarning
          onClick={() => select(value)}
        >
          {THEME_LABELS[value]}
        </button>
      ))}
    </div>
  );
}
