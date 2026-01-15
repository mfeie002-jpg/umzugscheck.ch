/**
 * Global Optimizations Export
 * All conversion, SEO, and performance optimizations
 * 
 * 10 Key Optimizations:
 * 1. StickyMobileCTA - Mobile conversion boost
 * 2. SchemaMarkup - SEO structured data
 * 3. ExitIntentPopup - Lead retention
 * 4. SocialProofTicker - Trust & urgency
 * 5. Breadcrumbs - SEO & navigation
 * 6. QuickCalculatorWidget - Engagement
 * 7. CookieConsentBanner - GDPR/DSG compliance
 * 8. OptimizedLazyImage - Performance
 * 9. PerformanceMonitorWidget - Core Web Vitals
 * 10. NotFound 404 - Recovery & SEO
 */

// Conversion Optimizations
export { StickyMobileCTA } from '../StickyMobileCTA';
export { ExitIntentPopup } from '../ExitIntentPopup';
export { SocialProofTicker } from '../SocialProofTicker';
export { QuickCalculatorWidget } from '../QuickCalculatorWidget';

// SEO Optimizations
export { LocalBusinessSchema, FAQSchema, ServiceSchema, OrganizationSchema } from '../seo/SchemaMarkup';
export { Breadcrumbs, type BreadcrumbItem } from '../Breadcrumbs';

// Compliance
export { CookieConsentBanner } from '../CookieConsentBanner';

// Performance Optimizations
export { OptimizedLazyImage, ResponsiveImage } from '../OptimizedLazyImage';
export { PerformanceMonitorWidget } from '../PerformanceMonitorWidget';

// Region-specific
export { RegionExitIntent } from '../region-archetyp/RegionExitIntent';
