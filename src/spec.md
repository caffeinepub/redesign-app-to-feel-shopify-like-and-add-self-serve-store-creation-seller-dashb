# Specification

## Summary
**Goal:** Fix the Seller Dashboard infinite loading issue and improve dashboard load speed and loading UX for authenticated sellers.

**Planned changes:**
- Investigate and fix why `/seller-dashboard` can remain stuck on “Loading dashboard...” for authenticated users with an existing supplier profile.
- Ensure dashboard-critical data fetches (supplier profile and supplier products) reliably transition from loading to success/error, and avoid unnecessary refetch loops tied to actor initialization/identity changes.
- Add a time-based loading fallback (after ~10–15 seconds) that replaces an indefinite spinner with an English error/help message and a working Retry and/or Reload action.

**User-visible outcome:** Authenticated sellers can open `/seller-dashboard` and see the dashboard content load reliably and faster; if loading fails or takes too long, they see a clear English message with a recovery action instead of an endless loading state.
