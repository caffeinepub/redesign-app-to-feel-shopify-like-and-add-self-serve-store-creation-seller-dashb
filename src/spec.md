# Specification

## Summary
**Goal:** Refresh the app with a cohesive Shopify-like (non blue/purple-dominant) design and add self-serve store creation plus a seller dashboard for managing a seller’s own products.

**Planned changes:**
- Apply a single cohesive, Shopify-like visual design system across all existing pages (Home, Header, Footer, Products, Suppliers, Cart, Checkout, Payment Success/Failure) with consistent layout, spacing, typography, and component styling; ensure all user-facing text is English.
- Define and enforce one distinct theme (not blue/purple-dominant) by updating global theme tokens and removing/rewriting existing purple/gradient styling (including Home hero and Header brand styling); keep light/dark mode readable.
- Add an authenticated “Create Store” onboarding flow to create or update a supplier profile (store name, description, contact info), with clear success states and a way to proceed into seller features.
- Add a seller dashboard gated to users with a supplier profile, including store overview, a list of only the caller’s products, and CRUD actions for products (name, description, price, stock quantity).
- Add backend queries for caller-scoped seller data (supplier profile and products) and wire them into new React Query hooks; ensure UI reflects add/update/delete changes.
- Improve storefront browsing to feel more Shopify-like on Products and Suppliers pages while keeping existing search/sort/filters, and add navigation from Suppliers to supplier-specific product listings.
- Add and consistently use generated static assets (brand/logo, hero banner, product placeholder) from `frontend/public/assets/generated`, ensuring no broken product images and updated header branding.

**User-visible outcome:** The app has a consistent Shopify-like look and English UI; signed-in users can create/edit a store, sellers get a protected dashboard to manage their own products, and shoppers get improved Products/Suppliers browsing with supplier-specific product listings and consistent imagery/placeholders.
