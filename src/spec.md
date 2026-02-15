# Specification

## Summary
**Goal:** Make the Seller Dashboard three-dot (overflow) menu dropdown render with a white background and clear contrast while keeping all existing menu items and behaviors unchanged.

**Planned changes:**
- Update the Seller Dashboard overflow menu dropdown styling (via app-owned components, not shadcn UI files) to use a white background with readable text/icons in both light and dark themes.
- Add a subtle border and/or shadow to the dropdown panel consistent with the existing design system, ensuring alignment/positioning to the trigger does not regress.
- Preserve current overflow menu items, routes, and logout behavior exactly as-is.

**User-visible outcome:** On `/seller-dashboard`, opening the three-dot menu shows a white dropdown panel with readable options, subtle border/shadow, and unchanged navigation/logout behavior.
