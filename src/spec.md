# Specification

## Summary
**Goal:** Automatically skip the public landing page for authenticated returning users by redirecting `/` to `/seller-dashboard`, while preserving existing onboarding redirect behavior.

**Planned changes:**
- Update home route (`/`) behavior to detect authenticated users and redirect them to `/seller-dashboard` before the landing page UI renders.
- Preserve and prioritize the existing onboardingStorage redirect target logic so that, when present, it takes precedence over the new authenticated `/` redirect and is cleared after use.
- Keep all other routes and existing auth gating behavior unchanged.

**User-visible outcome:** Authenticated users who visit `/` are taken directly to the seller dashboard without seeing the landing page; unauthenticated users still see the landing page, and onboarding “Start free trial” redirects continue to work as before.
