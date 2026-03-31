/**
 * Central policy for which routes should suppress floating mobile overlays.
 * Used by SwipeNavigationWrapper, MobileBottomNav, MobileStickyBar, ScrollToTop, etc.
 */

// Routes where swipe navigation indicators (side labels + dot pager) must be hidden
// to avoid overlapping hero forms and funnel inputs.
export const SWIPE_OVERLAY_SUPPRESSED_ROUTES = [
  '/',
  '/umzugsrechner',
  '/umzugsofferten',
  '/vergleich',
  '/chatgpt-flow',
  '/god-mode',
  '/flow-tester',
  '/intern-testing',
  '/capture',
  '/admin',
  '/investoren',
];

/** Returns true if the given pathname should suppress swipe overlay indicators. */
export function shouldSuppressSwipeOverlay(pathname: string): boolean {
  return SWIPE_OVERLAY_SUPPRESSED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
}
