import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const read = (path) =>
  readFileSync(new URL(`../out/${path}`, import.meta.url), "utf8");

test("agency, founder, services and lead qualification are exported", () => {
  for (const path of [
    "index.html",
    "founder/index.html",
    "services/index.html",
    "services/discovery/index.html",
    "services/build/index.html",
    "services/partnership/index.html",
    "services/leadership/index.html",
    "how-we-work/index.html",
    "contact/index.html",
    "work/index.html",
  ]) {
    assert.ok(existsSync(new URL(`../out/${path}`, import.meta.url)), path);
  }
  assert.match(read("index.html"), /Hooman in the Loop/);
  assert.match(read("index.html"), /Software built with AI/);
  assert.match(read("services/index.html"), /€4,500/);
});

test("canonical URLs retain the GitHub Pages project path", () => {
  for (const path of [
    "index.html",
    "founder/index.html",
    "services/index.html",
    "insights/index.html",
  ]) {
    const html = read(path);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
    assert.ok(canonical, `Missing canonical: ${path}`);
    assert.ok(
      canonical[1].startsWith("https://deakkon.github.io/ai-leadership/"),
      canonical[1],
    );
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, path);
  }
});

test("sitemap includes agency pages and legal drafts are not indexed", () => {
  assert.match(read("sitemap.xml"), /ai-leadership\/services\/build\//);
  for (const page of ["legal/index.html", "privacy/index.html"]) {
    assert.match(read(page), /noindex/);
  }
});

test("exported local links and social image resolve to real files", () => {
  const routes = [
    "",
    "services/",
    "services/build/",
    "services/discovery/",
    "services/leadership/",
    "services/partnership/",
    "contact/",
    "founder/",
    "how-we-work/",
    "work/",
    "insights/",
    "insights/agentic-ai-reliability/",
    "insights/ai-platform-strategy/",
    "insights/from-ai-poc-to-production/",
  ];
  for (const route of routes) {
    const html = read(`${route}index.html`);
    assert.match(html, /agency-og\.png/);
    for (const match of html.matchAll(
      /(?:href|src)="(\/ai-leadership\/[^"#?]*)/g,
    )) {
      let target = match[1].slice("/ai-leadership/".length);
      if (!target || target.endsWith("/")) target += "index.html";
      if (!target.split("/").at(-1).includes(".")) target += "/index.html";
      assert.ok(
        existsSync(new URL(`../out/${target}`, import.meta.url)),
        `${route}: ${target}`,
      );
    }
  }
  assert.ok(existsSync(new URL("../out/agency-og.png", import.meta.url)));
});

test("navigation identifies the current page and parent section", () => {
  assert.match(
    read("services/index.html"),
    /aria-current="page"[^>]*>Services</,
  );
  assert.match(
    read("services/build/index.html"),
    /aria-current="location"[^>]*>Services</,
  );
  assert.match(read("founder/index.html"), /aria-current="page"[^>]*>Founder</);
});

test("appearance and form feedback have accessible names and associations", () => {
  const home = read("index.html");
  assert.match(home, /aria-label="Appearance"/);
  assert.match(home, /value="system"/);
  const contact = read("contact/index.html");
  assert.match(contact, /id="brief-name"/);
  assert.match(contact, /aria-describedby="brief-problem-help/);
  assert.match(contact, /aria-live="polite"/);
  assert.match(contact, /Budget range \(optional\)/);
});
