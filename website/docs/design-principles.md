# Interface principles: Apple HIG adapted for the web

Reviewed 21 November 2026. These choices apply Apple's design reasoning to a responsive website; they are not a native-platform conformance claim or an accessibility certification.

## Sources and decisions

[Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles): keep the service journey direct and familiar, communicate what controls do, and let visitors choose a conversation or a written brief. The brand, offers and founder identity remain intact.

[Typography](https://developer.apple.com/design/human-interface-guidelines/typography): use one system font family for headings, body copy and labels, with readable regular/medium weights and a restrained hierarchy. The earlier editorial serif accent and downloaded font assets were removed following product feedback. Supporting labels are enlarged; body copy has a comfortable measure.

[Layout](https://developer.apple.com/design/human-interface-guidelines/layout): group related information with spacing and consistent surfaces. Use responsive grids that become one column on compact screens. The delivery diagram gets HTML labels on small screens because scaling its SVG text was unreadable.

[Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons): distinguish primary actions from secondary links, give controls visible pressed/focus states, and use generous hit regions. Our practical web target is at least 44 CSS pixels for major controls. Apple's native 44-point guidance and CSS pixels are different units; this is an ergonomic web adaptation. Inline prose links retain normal text flow. Compare [WCAG 2.2 target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

[Materials](https://developer.apple.com/design/human-interface-guidelines/materials): reserve subtle transparency for the sticky navigation layer, with solid backgrounds as the default/fallback. Content panels stay solid. Disable transparency for supported reduce-transparency/increased-contrast preferences. This does not reproduce the native Liquid Glass rendering system.

[Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility): semantic links and buttons, keyboard operation, a visible focus ring, current-section information, readable errors, status announcements and reduced-motion support. The mobile menu is a nonmodal disclosure, closes on Escape/outside interaction, and restores focus to its trigger when dismissed with Escape. No focus trap is appropriate for this ordinary navigation disclosure.

[Text fields](https://developer.apple.com/design/human-interface-guidelines/text-fields): persistent labels, associated helper/error descriptions, logical tab order, meaningful input types and clear required/optional distinctions. Company/budget/timing are optional. Validate the essentials before preparing a draft. Move focus to the first invalid field or the prepared-brief heading. Announce clipboard success/failure; invalidate a prepared brief if its source details change. Nothing is sent automatically.

[Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode): product direction now chooses a fixed light presentation. There is no appearance control or startup preference script. One dark-green homepage section provides contrast within the light design; it is not a theme switch. This replaces the earlier System/Light/Dark implementation.

## Service exploration

Service and package cards are full native links with concise accessible names. Each package retains its canonical URL. Four sections cover scope, process, illustrative use cases and investment. After hydration, Motion animates the full panel height and staggered content, with an animated section indicator. Collapsed panels are inert and excluded from the accessibility tree. Previous/next controls focus the selected heading; scrolling waits until expansion completes. Without JavaScript, native disclosures still work and all content remains in exported HTML. Reduced-motion users get instant panel changes and static diagrams. Example scenarios are labeled as illustrative, not presented as client results.

Each package has a different SVG infographic with a readable HTML caption and legend: discovery options, build pipeline, monthly cadence and leadership decisions. The approach page uses a five-stage map; the infinity visual remains on the homepage. Diagram accents animate once on entering view. No decorative animation repeats continuously.

Supported browsers also get a brief transition between same-origin pages, following [Chrome's cross-document view-transition guidance](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document). This is enabled only when the visitor has no reduced-motion preference; ordinary navigation remains the fallback.

[Web reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): use relative typography, avoid fixed control heights, retain browser zoom, and check narrow layouts. A 320-CSS-pixel viewport check exercises the reflow width used in the guidance; it is not proof of every zoom, text-resize or assistive-technology behavior.

## Verification scope

Export checks cover navigation semantics, fixed light appearance, full-card links, complete package content, form descriptions and canonical/link integrity. Earlier browser checks covered theme selection and form behavior; current verification adds the fixed light presentation and package journey. Record exact checks and results in the task handoff. Manual screen-reader, all-browser and full WCAG conformance audits are outside this pass.
