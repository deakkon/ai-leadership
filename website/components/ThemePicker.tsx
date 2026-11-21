"use client";
import { useEffect, useState } from "react";
import {
  getThemePreference,
  applyThemePreference,
  type ThemePreference,
} from "../lib/theme";
export default function ThemePicker() {
  const [preference, setPreference] = useState<ThemePreference>("system");
  useEffect(() => {
    let current = getThemePreference();
    setPreference(current);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = () => {
      if (current === "system") applyThemePreference("system");
    };
    const sync = () => {
      current = getThemePreference();
      setPreference(current);
      applyThemePreference(current);
    };
    media.addEventListener("change", followSystem);
    window.addEventListener("storage", sync);
    // Keep the system listener aligned with explicit appearance choices.
    const onPreference = (event: Event) => {
      current = (event as CustomEvent<ThemePreference>).detail;
    };
    window.addEventListener("hitl:appearance", onPreference);
    return () => {
      media.removeEventListener("change", followSystem);
      window.removeEventListener("storage", sync);
      window.removeEventListener("hitl:appearance", onPreference);
    };
  }, []);
  return (
    <label className="agency-appearance">
      <span className="visually-hidden">Appearance</span>
      <select
        aria-label="Appearance"
        value={preference}
        onChange={(event) => {
          const value = event.target.value as ThemePreference;
          setPreference(value);
          applyThemePreference(value);
          window.dispatchEvent(
            new CustomEvent("hitl:appearance", { detail: value }),
          );
        }}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
