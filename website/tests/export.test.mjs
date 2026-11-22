import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const intentRoutes = [
  "software-development",
  "ai-workflow-automation",
  "ai-strategy",
];
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
  assert.match(read("index.html"), /Clear AI decisions/);
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
    ...intentRoutes.map((slug) => `services/${slug}/`),
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

test("buyer-intent services are discoverable with distinct metadata and linked entities", () => {
  const titles = new Set();
  for (const slug of intentRoutes) {
    const route = `/services/${slug}/`;
    const html = read(`services/${slug}/index.html`);
    const head = html.split("</head>")[0];
    const title = head.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title?.includes("Hooman in the Loop"), slug);
    titles.add(title);
    assert.ok(
      html.includes(
        `rel="canonical" href="https://deakkon.github.io/ai-leadership${route}"`,
      ),
      slug,
    );
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, slug);
    assert.ok(
      read("sitemap.xml").includes(
        `https://deakkon.github.io/ai-leadership${route}`,
      ),
      slug,
    );
    assert.ok(
      read("services/index.html").includes(`/ai-leadership${route}`),
      slug,
    );
    const schemas = [
      ...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g),
    ].map((m) => JSON.parse(m[1]));
    assert.ok(
      schemas.some((s) => s["@type"] === "BreadcrumbList"),
      slug,
    );
    assert.ok(
      schemas.some(
        (s) =>
          s["@type"] === "Service" &&
          s.provider?.["@id"] ===
            "https://deakkon.github.io/ai-leadership/#agency",
      ),
      slug,
    );
    assert.ok(
      schemas.some(
        (s) =>
          s["@type"] === "Organization" &&
          s["@id"] === "https://deakkon.github.io/ai-leadership/#agency",
      ),
      slug,
    );
  }
  assert.equal(titles.size, intentRoutes.length);
  assert.match(
    read("index.html").split("</head>")[0],
    /<title>[^<]*Hooman in the Loop/,
  );
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
  assert.match(
    read("founder/index.html"),
    /aria-current="page"[^>]*>About Jurica</,
  );
});

test("form feedback has accessible names and associations", () => {
  const contact = read("contact/index.html");
  assert.match(contact, /id="brief-name"/);
  assert.match(contact, /aria-describedby="brief-problem-help/);
  assert.match(contact, /aria-live="polite"/);
  assert.match(contact, /Budget range \(optional\)/);
});

test("site uses fixed light appearance, personal navigation and a contrasting home section", () => {
  for (const route of ["", "services/", "services/build/", "how-we-work/"]) {
    const html = read(`${route}index.html`);
    assert.match(html, /data-theme="light"/);
    assert.ok(
      !/aria-label="Appearance"|hitl:appearance|localStorage/.test(html),
      route,
    );
    assert.match(html, />My approach</);
    assert.doesNotMatch(html, />How we work</);
  }
  assert.match(read("index.html"), /v2-process/);
});

test("package cards link as a whole and every package exports a complete guided deep dive", () => {
  const services = read("services/index.html");
  for (const slug of ["discovery", "build", "partnership", "leadership"]) {
    const card = [...services.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].find(
      (match) =>
        match[1].includes(`href="/ai-leadership/services/${slug}/"`) &&
        match[1].includes('class="v2-service-offer"'),
    );
    assert.ok(card, `Whole-card link for ${slug}`);
    assert.match(card[2], /v2-offer-price/);
    const html = read(`services/${slug}/index.html`);
    for (const id of ["scope", "journey", "examples", "investment"]) {
      assert.ok(html.includes(`id="explore-${id}"`), `${slug}: ${id}`);
    }
    assert.match(html, /Illustrative scenarios/);
    assert.equal(
      (html.match(/class="package-example"/g) || []).length,
      3,
      slug,
    );
    assert.ok(html.includes('href="/ai-leadership/#v2-packages"'));
    assert.match(html, /data-package-explorer/);
  }
});

test("packages explain different engagement models visually and the approach page uses its own process map", () => {
  const titles = new Set();
  for (const slug of ["discovery", "build", "partnership", "leadership"]) {
    const html = read(`services/${slug}/index.html`);
    assert.ok(html.includes(`data-engagement-visual="${slug}"`), slug);
    const title = html.match(/id="engagement-visual-title"[^>]*>([^<]+)/)?.[1];
    assert.ok(title, `Diagram heading for ${slug}`);
    titles.add(title);
    assert.ok(html.includes("data-package-progress"), slug);
  }
  assert.equal(titles.size, 4);
  assert.ok(
    read("how-we-work/index.html").includes(
      'data-engagement-visual="approach"',
    ),
  );
  assert.ok(!read("how-we-work/index.html").includes('class="loop-plate"'));
});

test("founder experience describes domains, roles and real project contributions without naming employers", () => {
  const founder = read("founder/index.html");
  assert.ok(founder.includes('id="career-experience"'));
  for (const term of [
    "Clinical NLP",
    "Multilingual speech",
    "Laboratory",
    "Market research",
    "AI team design",
    "Fulbright",
  ]) {
    assert.ok(founder.includes(term), term);
  }
  assert.equal(
    (founder.match(/class="founder-experience-card"/g) || []).length,
    7,
  );
  assert.ok(founder.includes("Employer and client names are omitted"));
  assert.ok(founder.includes("past employment and advisory roles"));
});

test("the new design is the indexed default and preview routes point to canonical pages", () => {
  const home = read("index.html");
  assert.ok(home.includes('class="v2-site"'), "New design is the homepage");
  assert.ok(!home.includes('class="agency-header"'));
  assert.ok(!home.includes('class="v2-preview"'));
  assert.ok(!home.includes("noindex"));
  assert.ok(home.includes("former VP of AI"));
  assert.ok(!home.includes('class="v2-hero-proof"'));
  assert.ok(home.includes("I lead the decisions."));
  assert.ok(home.includes("Michael Lindqvist"));
  assert.ok(
    home.indexOf('class="v2-section v2-recommendation"') <
      home.indexOf('id="v2-packages"'),
  );
  assert.ok(home.includes("Pause automatic rotation"));
  assert.ok(!home.includes("The engagement, mapped out"));
  assert.ok(!home.includes("Your technical lead"));
  assert.ok(
    home.indexOf('id="v2-experience"') < home.indexOf('id="v2-packages"'),
  );
  assert.ok(home.indexOf('id="v2-founder"') < home.indexOf('id="v2-packages"'));
  assert.ok(home.indexOf('id="v2-process"') < home.indexOf('id="v2-packages"'));
  for (const route of [
    "",
    "services/",
    "founder/",
    ...["discovery", "build", "leadership", "partnership"].map(
      (s) => `services/${s}/`,
    ),
  ]) {
    const html = read(`${route}index.html`);
    assert.ok(html.includes('class="v2-site"'), route);
    assert.ok(!html.includes("noindex"), route);
    assert.ok(!/href="[^"]*\/v2\//.test(html), route);
    const alias = read(`v2/${route}index.html`);
    assert.ok(alias.includes('http-equiv="refresh"'), route);
    assert.ok(
      alias.includes(
        `rel="canonical" href="https://deakkon.github.io/ai-leadership/${route}"`,
      ),
      route,
    );
    assert.ok(alias.includes("noindex"), route);
  }
  assert.ok(!read("sitemap.xml").includes("/v2/"));
});
