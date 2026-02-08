# Specification

## Summary
**Goal:** Improve core UI feel by making the main click button easier to hit, making shop lists scroll smoothly, and adding an optional fast-pointer motion blur effect.

**Planned changes:**
- Increase the rendered size and hit area of the primary “CLICK!” button across mobile and desktop while keeping it centered and avoiding overlap with Stats/Shop panels.
- Add smooth wheel/trackpad scrolling for the two shop ScrollArea lists (Click Upgrades and Automation), while keeping keyboard scrolling working and respecting reduced-motion preferences.
- Add a subtle, performant cursor-adjacent motion blur/trail effect that appears on fast pointer movement, fades when slowing/stopping, does not block pointer events, and is disabled with reduced motion.

**User-visible outcome:** The main “CLICK!” button is noticeably bigger and easier to click/tap, shop lists scroll smoothly, and fast mouse movement shows a subtle blur/trail that fades out (and is reduced/disabled if the user prefers reduced motion).
