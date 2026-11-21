export const THEME_KEY = "folio.theme";
export const THEME_EVENT = "folio:themechange";
export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";
export const THEME_COLOR: Record<Theme, string> = {
  light: "#f7f9f7",
  dark: "#111c17",
};

// One palette for pre-paint rendering, the picker and browser chrome.
export const themeBootScript = `(function(){try{var p=localStorage.getItem(${JSON.stringify(THEME_KEY)});var t=(p==="light"||p==="dark")?p:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=${JSON.stringify(THEME_COLOR)}[t];}catch(e){document.documentElement.dataset.theme="light";}})();`;

export function getThemePreference(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}
export function applyThemePreference(preference: ThemePreference): void {
  const theme =
    preference === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preference;
  document.documentElement.dataset.theme = theme;
  const chrome = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  if (chrome) chrome.content = THEME_COLOR[theme];
  try {
    localStorage.setItem(THEME_KEY, preference);
  } catch {
    /* The choice still applies for this session. */
  }
  window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: theme }));
}
