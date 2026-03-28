import { usePageTracking } from '@/hooks/use-page-tracking';

/**
 * Component that enables automatic page tracking throughout the app
 * Place this inside BrowserRouter for automatic route change tracking
 */
export function AnalyticsTracker() {
  usePageTracking();
  return null;
}
