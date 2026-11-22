# Released site design

The V2 design is now the default at `/ai-leadership/`, with canonical services, package pages and founder experience at their original URLs. The previous homepage and navigation have been retired. Supporting service guides, insights, contact and legal content retain their existing URLs under the shared navigation and design palette.

Former `/v2/` preview URLs are static HTML redirects to the corresponding canonical routes, with noindex/follow and canonical metadata. Only canonical routes appear in the sitemap. GitHub Pages does not support application-level HTTP redirects; the aliases use immediate meta refresh and a visible fallback link.

The homepage presents services, documented career projects, approach, founder background and an approved LinkedIn recommendation before package pricing. Recommendation wording and attribution reuse the existing source; no new employer association or testimonial metrics were inferred. Publication was explicitly approved by the user on 22 November 2026.

The three-scenario workbench advances every three seconds. Pointer hover, keyboard focus and hidden tabs pause rotation; a manual selection stops it until restarted. Reduced-motion preference disables automatic rotation. Automatic changes do not modify the package selection or produce live-region announcements. Timers and visibility listeners are cleaned up on unmount.

The visual direction uses a light editorial canvas, one system font, forest-green text, lime accents and distinct engagement diagrams. Decorative package and founder eyebrows were removed. The hero states the founder’s experience in the main introduction rather than a separate proof strip. Pricing, scopes and exclusions are unchanged.

Public references: [Motion](https://motion.dev/examples), [Aceternity](https://ui.aceternity.com/ai-recommendations), [Magic UI](https://magicui.design/) and [21st](https://21st.dev/). Original React/CSS uses the installed Motion library; no paid templates or additional UI packages were imported.
