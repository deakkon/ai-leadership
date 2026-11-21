# V2 design preview

The alternative design lives at `/ai-leadership/v2/`, with its own service index, four package pages and founder page. The current design stays at the existing routes. Preview pages use self-referencing canonical URLs and noindex, follow; they are excluded from the production sitemap while the designs are being compared.

## Design direction

- A light editorial canvas, one system font family, forest-green text and a restrained lime accent.
- A decision workbench that explains three starting situations, instead of repeating the infinity diagram.
- A package selector connecting price, scope and a relevant engagement diagram, with dedicated pages for the full details and use cases.
- A contrasting delivery section with selectable stages and explicit outputs.
- A personal founder section, with the existing employer-free career summaries available on the V2 founder page.
- Native links, keyboard-accessible buttons, a mobile navigation disclosure and reduced-motion handling. Initial browser markup matches static HTML; animation starts after hydration.

## References

[Motion examples](https://motion.dev/examples) informed keyed transitions and shared selection indicators. [Aceternity's public component catalogue](https://ui.aceternity.com/ai-recommendations), [Magic UI](https://magicui.design/) and [21st](https://21st.dev/) informed the interaction and layout direction. The implementation is original React/CSS using the installed Motion library; no paid templates, licensed assets, additional UI packages or account-only design services were imported. No Refero integration was used.

V2 shares the offer catalogue, package stories, engagement diagrams and founder evidence with the existing site. Preview styling is scoped under `.v2-site`; the root frame selects the appropriate navigation and footer by route. No pricing or employer attribution changes are introduced by this preview.
