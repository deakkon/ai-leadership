# Interface principles: Apple HIG adapted for the web

Reviewed 21 November 2026. These choices apply Apple's design reasoning to a responsive website; they are not a native-platform conformance claim or an accessibility certification.

## Sources and decisions

[Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles): keep the service journey direct and familiar, communicate what controls do, and let visitors choose a conversation or a written brief. The brand, offers and founder identity remain intact.

[Typography](https://developer.apple.com/design/human-interface-guidelines/typography): use the platform's UI font through the system font stack, readable regular/medium weights and a restrained type hierarchy. Keep the editorial serif as a brand accent, rather than copying or redistributing Apple's downloadable font assets. Supporting labels are enlarged; body copy has a comfortable measure.

[Layout](https://developer.apple.com/design/human-interface-guidelines/layout): group related information with spacing and consistent surfaces. Use responsive grids that become one column on compact screens. The delivery diagram gets HTML labels on small screens because scaling its SVG text was unreadable.

[Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons): distinguish primary actions from secondary links, give controls visible pressed/focus states, and use generous hit regions. Our practical web target is at least 44 CSS pixels for major controls. Apple's native 44-point guidance and CSS pixels are different units; this is an ergonomic web adaptation. Inline prose links retain normal text flow. Compare [WCAG 2.2 target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

[Materials](https://developer.apple.com/design/human-interface-guidelines/materials): reserve subtle transparency for the sticky navigation layer, with solid backgrounds as the default/fallback. Content panels stay solid. Disable transparency for supported reduce-transparency/increased-contrast preferences. This does not reproduce the native Liquid Glass rendering system.

[Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility): semantic links and buttons, keyboard operation, a visible focus ring, current-section information, readable errors, status announcements and reduced-motion support. The mobile menu is a nonmodal disclosure, closes on Escape/outside interaction, and restores focus to its trigger when dismissed with Escape. No focus trap is appropriate for this ordinary navigation disclosure.

[Text fields](https://developer.apple.com/design/human-interface-guidelines/text-fields): persistent labels, associated helper/error descriptions, logical tab order, meaningful input types and clear required/optional distinctions. Company/budget/timing are optional. Validate the essentials before preparing a draft. Move focus to the first invalid field or the prepared-brief heading. Announce clipboard success/failure; invalidate a prepared brief if its source details change. Nothing is sent automatically.

[Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode): follow the OS preference by default and react to live OS changes. Apple discourages a separate appearance choice in native apps. The website intentionally offers an optional System/Light/Dark override for web visitors; System remains the default and can be restored. The browser theme color and page palette use the same definitions.

[Web reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): use relative typography, avoid fixed control heights, retain browser zoom, and check narrow layouts. A 320-CSS-pixel viewport check exercises the reflow width used in the guidance; it is not proof of every zoom, text-resize or assistive-technology behavior.

## Verification scope

Export checks cover page/section navigation semantics, appearance naming, form descriptions and existing canonical/link integrity. Browser checks cover desktop/mobile layouts, light/dark selection, narrow reflow, keyboard menu dismissal, invalid/valid form states, draft editing and focus behavior. Record exact checks and results in the task handoff. Manual screen-reader, all-browser and full WCAG conformance audits are outside this pass.
