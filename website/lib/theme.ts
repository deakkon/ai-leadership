export const THEME_KEY = "folio.theme";
export const THEME_EVENT = "folio:themechange";

export type Theme = "light" | "dark";

export const THEMES: Theme[] = ["light", "dark"];

/** Display names — the editorial identity, not the attribute values. */
export const THEME_LABELS: Record<Theme, string> = {
  light: "Newsprint",
  dark: "Forge",
};

/** Browser chrome colour per theme — mirrors the --bg token in globals.css. */
export const THEME_COLOR: Record<Theme, string> = {
  light: "#f5f2ea",
  dark: "#141519",
};

/** Current theme, read from the html[data-theme] attribute (set pre-paint). */
export function getTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/** Apply a theme: set the attribute, persist it, sync the browser chrome, and notify listeners. */
export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  const chrome = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (chrome) chrome.content = THEME_COLOR[theme];
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* storage unavailable — the theme still applies for this session */
  }
  window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: theme }));
}
