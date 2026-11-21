// Keep the deployed project path until a cleared, owned domain is configured.
export const siteUrl = "https://deakkon.github.io/ai-leadership";
export const basePath = "/ai-leadership";
export const withBase = (href: string) =>
  href.startsWith("/") ? `${basePath}${href}` : href;
