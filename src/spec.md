# Specification

## Summary
**Goal:** Redesign the Seller Dashboard page to closely match the provided Shopify-admin-style mobile screenshots, rebranded to Shanju, while keeping existing seller actions working.

**Planned changes:**
- Update `frontend/src/pages/SellerDashboardPage.tsx` to a mobile-first layout matching the screenshots’ spacing, card style, and visual hierarchy, while remaining responsive on desktop.
- Add an internal (dashboard-only) dark top header bar inside the page content featuring: menu icon, prominent (visual-only) search input, notifications icon, and a circular user/store badge placeholder; do not modify the global app header/navigation.
- Rework main dashboard content into onboarding/checklist-style cards (e.g., “Add store name”, “Add your first product”) and wire CTAs to existing flows: navigate to `/create-store` and open the existing `ProductFormDialog`.
- Keep existing product list/management functionality accessible from the dashboard (edit, delete, quick stock update), potentially placed lower in the redesigned layout.
- Ensure no visible “Shopify” text appears in the seller dashboard UI; use “Shanju” where branding is shown and keep all user-facing text in English.

**User-visible outcome:** Sellers see a Shopify-like, Shanju-branded dashboard with a dark in-page header and checklist-style setup cards, and can still manage their store and products using the existing actions and dialogs.
