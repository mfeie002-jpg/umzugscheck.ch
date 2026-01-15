import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProviderAuthProvider } from "@/contexts/ProviderAuthContext";
import { PerformanceProvider } from "@/contexts/PerformanceContext";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PreloadResources } from "@/components/PreloadResources";
import { PageLoadingFallback } from "@/components/ui/loading-fallback";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import { CriticalCSS } from "@/components/performance/CriticalCSS";
import { ResourceHints } from "@/components/performance/ResourceHints";
import { PerformanceMonitor } from "@/components/performance/PerformanceMonitor";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { PrefetchManager } from "@/components/performance/PrefetchManager";
import { CriticalCSSLoader } from "@/components/performance/CriticalCSSLoader";
import { PerformanceOptimizer, PerformanceDebugOverlay } from "@/components/performance/PerformanceOptimizer";
import { WebVitalsReporter } from "@/hooks/useWebVitals";

// Global optimization components
const SocialProofTicker = lazy(() => import("./components/SocialProofTicker"));
const CookieConsentBanner = lazy(() => import("./components/CookieConsentBanner").then(m => ({ default: m.CookieConsentBanner })));

// ============================================
// LAZY LOADED PAGES - Code Splitting
// ============================================

// Homepage variants - only IndexPremium loaded eagerly
import IndexPremium from "./pages/IndexPremium";

// All other pages lazy loaded for optimal bundle splitting
const Index = lazy(() => import("./pages/Index"));
const NewIndex = lazy(() => import("./pages/NewIndex"));
const HomePage = lazy(() => import("./pages/HomePage").then(m => ({ default: m.HomePage })));
const HomeOptimized = lazy(() => import("./pages/HomeOptimized"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AdminInternResults = lazy(() => import("./pages/AdminInternResults"));
const ExportDownload = lazy(() => import("./pages/ExportDownload"));

// Service pages
const ServicesOverview = lazy(() => import("./pages/services/ServicesOverview"));
const PrivateMoving = lazy(() => import("./pages/services/PrivateMoving"));
const BusinessMoving = lazy(() => import("./pages/services/BusinessMoving"));
const CleaningService = lazy(() => import("./pages/services/CleaningService"));
const DisposalService = lazy(() => import("./pages/services/DisposalService"));
const FurnitureLift = lazy(() => import("./pages/services/FurnitureLift"));
const FurnitureAssembly = lazy(() => import("./pages/services/FurnitureAssembly"));
const InternationalMoving = lazy(() => import("./pages/services/InternationalMoving"));
const MovingWithCleaning = lazy(() => import("./pages/services/MovingWithCleaning"));
const StorageService = lazy(() => import("./pages/services/StorageService"));

// Services V2 pages (unified calculator approach)
const ReinigungV2 = lazy(() => import("./pages/services-v2/reinigung"));
const EntsorgungV2 = lazy(() => import("./pages/services-v2/entsorgung"));
const LagerungV2 = lazy(() => import("./pages/services-v2/lagerung"));
const PrivatumzugV2 = lazy(() => import("./pages/services-v2/privatumzug"));
const FirmenumzugV2 = lazy(() => import("./pages/services-v2/firmenumzug"));
const MontageV2 = lazy(() => import("./pages/services-v2/montage"));
const MoebelliftV2 = lazy(() => import("./pages/services-v2/moebellift"));
const InternationalV2 = lazy(() => import("./pages/services-v2/international"));
const PackserviceV2 = lazy(() => import("./pages/services-v2/packservice"));
const SeniorenumzugV2 = lazy(() => import("./pages/services-v2/seniorenumzug"));
const StudentenV2 = lazy(() => import("./pages/services-v2/studenten"));
const SpezialtransporteV2 = lazy(() => import("./pages/services-v2/spezialtransporte"));
const KlaviertransportV2 = lazy(() => import("./pages/services-v2/klaviertransport"));
const AuslandsumzugV2 = lazy(() => import("./pages/services-v2/auslandsumzug"));
const BueroumzugV2 = lazy(() => import("./pages/services-v2/bueroumzug"));
const TresortransportV2 = lazy(() => import("./pages/services-v2/tresortransport"));
const HaushaltsaufloesungV2 = lazy(() => import("./pages/services-v2/haushaltsaufloesung"));
const UmzugshelferV2 = lazy(() => import("./pages/services-v2/umzugshelfer"));
const ShopPage = lazy(() => import("./pages/Shop"));
const UmzugskostenBerechnenPage = lazy(() => import("./pages/ratgeber/UmzugskostenBerechnen"));
const UmzugsfirmaVergleichen = lazy(() => import("./pages/UmzugsfirmaVergleichen"));
const WohnungsabgabeGuide = lazy(() => import("./pages/ratgeber/WohnungsabgabeGuide"));
const UrlTrackingDashboard = lazy(() => import("./pages/admin/UrlTrackingDashboard"));

// City pages
const ZurichMoving = lazy(() => import("./pages/city/ZurichMoving"));
const BernMoving = lazy(() => import("./pages/city/BernMoving"));
const BaselMoving = lazy(() => import("./pages/city/BaselMoving"));
const LuzernMoving = lazy(() => import("./pages/city/LuzernMoving"));

// Regional landing pages

// Provider pages
const ProviderPricingPage = lazy(() => import("./pages/provider/ProviderPricing"));
const ProviderFAQPage = lazy(() => import("./pages/provider/ProviderFAQ"));

// Core navigation components - keep synchronous for fast FCP
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { NavigationVariantSwitcher } from "./components/NavigationVariantSwitcher";
import { ScrollToTopOnRoute } from "./components/ScrollToTopOnRoute";
import { ScrollProgressBar } from "./components/ScrollProgressBar";
import { ScreenshotRenderModeRoot } from "@/components/ScreenshotRenderModeRoot";
import { CaptureDebugOverlay } from "@/components/CaptureDebugOverlay";
import { CaptureReadySentinel } from "@/components/CaptureReadySentinel";
import { RedirectWithQuery } from "@/components/RedirectWithQuery";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { FunnelModeProvider } from "@/components/funnel/FunnelModeProvider";
import { ReloadDiagnostics } from "@/components/debug/ReloadDiagnostics";

// Lazy load non-critical UI components
const AIMovingAssistant = lazy(() => import("./components/AIMovingAssistant").then(m => ({ default: m.AIMovingAssistant })));
const OfflineIndicator = lazy(() => import("./components/OfflineIndicator").then(m => ({ default: m.OfflineIndicator })));
const QuickActionBar = lazy(() => import("./components/QuickActionBar").then(m => ({ default: m.QuickActionBar })));
const StickyContactBar = lazy(() => import("./components/StickyContactBar").then(m => ({ default: m.StickyContactBar })));
const CustomerOnboarding = lazy(() => import("./components/CustomerOnboarding").then(m => ({ default: m.CustomerOnboarding })));
const ProviderOnboarding = lazy(() => import("./components/ProviderOnboarding").then(m => ({ default: m.ProviderOnboarding })));
const FloatingActionButton = lazy(() => import("./components/mobile/FloatingActionButton").then(m => ({ default: m.FloatingActionButton })));
// Mobile wrappers imported directly to avoid lazy loading issues
import { MobilePullToRefresh } from "./components/MobilePullToRefresh";
import { MobileBottomSheetNav } from "./components/mobile/MobileBottomSheetNav";
import { SwipeNavigationWrapper } from "./components/mobile/SwipeNavigationWrapper";
const MobileSearchButton = lazy(() => import("./components/mobile/MobileSearchButton").then(m => ({ default: m.MobileSearchButton })));
const MobileBottomNav = lazy(() => import("./components/MobileBottomNav"));

// Calculator pages
const Calculator = lazy(() => import("./pages/Calculator"));
const CalculatorResults = lazy(() => import("./pages/CalculatorResults"));
const EstimateResult = lazy(() => import("./pages/EstimateResult"));

const LeadRequest = lazy(() => import("./pages/LeadRequest"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const DemoResult = lazy(() => import("./pages/DemoResult"));
const BundleEstimates = lazy(() => import("./pages/BundleEstimates"));
const CleaningCalculator = lazy(() => import("./pages/CleaningCalculator"));
const DisposalCalculator = lazy(() => import("./pages/DisposalCalculator"));
const StorageCalculator = lazy(() => import("./pages/StorageCalculator"));
const PackingCalculator = lazy(() => import("./pages/PackingCalculator"));
const AssemblyCalculator = lazy(() => import("./pages/AssemblyCalculator"));
const TotalPriceConfigurator = lazy(() => import("./pages/TotalPriceConfigurator"));
const VideoEstimator = lazy(() => import("./pages/VideoEstimator"));
const AIUpload = lazy(() => import("./pages/AIUpload"));

// Company pages
const Companies = lazy(() => import("./pages/Companies"));
const CompanyProfile = lazy(() => import("./pages/CompanyProfile"));
const Compare = lazy(() => import("./pages/Compare"));
const CompanyComparison = lazy(() => import("./pages/CompanyComparison"));
const UmzugsfirmenPage = lazy(() => import("./pages/UmzugsfirmenPage"));
const UmzugsfirmenSchweizPillar = lazy(() => import("./pages/UmzugsfirmenSchweizPillar"));

// Canton/Region pages - Consolidated to RegionArchetypPage
// Canton and Zug pages removed - now handled by RegionArchetypPage
const City = lazy(() => import("./pages/City"));
const ZuerichV1Landing = lazy(() => import("./pages/umzugsfirmen/zuerich/v1"));
const CantonComparison = lazy(() => import("./pages/CantonComparison"));
// DynamicCanton removed - now handled by RegionArchetypPage
const RegionenOverview = lazy(() => import("./pages/Regionen"));
const CityMovers = lazy(() => import("./pages/CityMovers"));
const CityOptimized = lazy(() => import("./pages/CityOptimized"));
const CityPage = lazy(() => import("./pages/CityPage").then(m => ({ default: m.CityPage })));
// ZurichMovers REMOVED - Legacy route now redirects to /umzugsfirmen/zuerich
const LegacyCityServiceRedirect = lazy(() => import("./pages/LegacyCityServiceRedirect"));
const RegionalOfferten = lazy(() => import("./pages/RegionalOfferten"));
// NEW: Unified region page replacing 24+ individual canton pages
const RegionArchetypPage = lazy(() => import("./pages/region/RegionArchetypPage"));
// NEW: Slug resolver for city vs canton separation
const SlugResolverPage = lazy(() => import("./pages/SlugResolverPage"));
// NEW: Gold Standard Archetype Pages (Canton, City, Service+Location)
const CantonArchetypePage = lazy(() => import("./pages/region/CantonArchetypePage"));
const CityArchetypePage = lazy(() => import("./pages/region/CityArchetypePage"));
const ServiceLocationPage = lazy(() => import("./pages/services/ServiceLocationPage"));

// Canton pages - REMOVED: Now handled by RegionArchetypPage via /umzugsfirmen/kanton-:slug
// City pages handled by SlugResolverPage -> CityMovers at /umzugsfirmen/:citySlug

// Blog/Content pages
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const MovingCostGuide = lazy(() => import("./pages/MovingCostGuide"));

// Info pages
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const RoomPlannerDemo = lazy(() => import("./pages/RoomPlannerDemo"));

// Ranking pages
const BesteFirmen = lazy(() => import("./pages/BesteFirmen"));
const GuenstigeFirmen = lazy(() => import("./pages/GuenstigeFirmen"));

// Provider portal pages
const ProviderPortal = lazy(() => import("./pages/ProviderPortal"));
const BecomeProvider = lazy(() => import("./pages/BecomeProvider"));
const ProviderSignup = lazy(() => import("./pages/ProviderSignup"));
const ProviderLogin = lazy(() => import("./pages/ProviderLogin"));
const ProviderDashboard = lazy(() => import("./pages/ProviderDashboard"));
const ProviderProfile = lazy(() => import("./pages/ProviderProfile"));
const ProviderPricing = lazy(() => import("./pages/ProviderPricing"));
const MobileProviderApp = lazy(() => import("./pages/MobileProviderApp"));
const ProviderSignupNew = lazy(() => import("./pages/provider/ProviderSignup"));

// Other pages
const Umzugsofferten = lazy(() => import("./pages/Umzugsofferten"));
const UmzugsoffertenUltimate = lazy(() => import("./pages/UmzugsoffertenUltimate"));
const UmzugsoffertenBaseline = lazy(() => import("./pages/UmzugsoffertenBaseline"));
const UmzugsoffertenDynamic = lazy(() => import("./pages/UmzugsoffertenDynamic"));
const UmzugsoffertenVariant = lazy(() => import("./pages/UmzugsoffertenVariant"));
const UmzugsoffertenV1 = lazy(() => import("./pages/UmzugsoffertenV1"));
const UmzugsoffertenV1a = lazy(() => import("./pages/UmzugsoffertenV1a"));
const UmzugsoffertenV1b = lazy(() => import("./pages/UmzugsoffertenV1b"));
const UmzugsoffertenV1c = lazy(() => import("./pages/UmzugsoffertenV1c"));
const UmzugsoffertenV1d = lazy(() => import("./pages/UmzugsoffertenV1d"));
const UmzugsoffertenV1e = lazy(() => import("./pages/UmzugsoffertenV1e"));
const UmzugsoffertenV1f = lazy(() => import("./pages/UmzugsoffertenV1f"));
const UmzugsoffertenV1g = lazy(() => import("./pages/UmzugsoffertenV1g"));
const UmzugsoffertenUltimateCH = lazy(() => import("./pages/UmzugsoffertenUltimateCH"));
const UltimateSwissFlow = lazy(() => import("./components/flows/UltimateSwissFlow"));
const UmzugsoffertenV2e = lazy(() => import("./pages/UmzugsoffertenV2e"));
const UmzugsoffertenV2Archetyp = lazy(() => import("./pages/UmzugsoffertenV2Archetyp"));
const UmzugsoffertenBestaetigung = lazy(() => import("./pages/UmzugsoffertenBestaetigung"));
const FlowTester = lazy(() => import("./pages/FlowTester"));
const FlowShowcase = lazy(() => import("./pages/FlowShowcase"));
const FlowReview = lazy(() => import("./pages/FlowReview"));
// FlowOverview merged into FlowTester
const FlowsIndex = lazy(() => import("./pages/FlowsIndex"));
const FlowFamilyLanding = lazy(() => import("./pages/FlowFamilyLanding"));
const InternFlowTesting = lazy(() => import("./pages/InternFlowTesting"));
const TopFlowsComparison = lazy(() => import("./pages/TopFlowsComparison"));
const NavigationComparison = lazy(() => import("./pages/NavigationComparison"));
const V3VariantComparison = lazy(() => import("./pages/V3VariantComparison"));
// Note: RegionalOfferten is imported above with canton pages
const FuerFirmen = lazy(() => import("./pages/FuerFirmen"));
const ServicePlaceholder = lazy(() => import("./pages/ServicePlaceholder"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const ServiceOptimized = lazy(() => import("./pages/ServiceOptimized"));
const ReviewSubmission = lazy(() => import("./pages/ReviewSubmission"));
const Pricing = lazy(() => import("./pages/Pricing"));
const OffertenPage = lazy(() => import("./pages/OffertenPage"));
const OffertenOptimized = lazy(() => import("./pages/OffertenOptimized"));
const Tools = lazy(() => import("./pages/Tools"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const Vergleich = lazy(() => import("./pages/Vergleich"));

// Admin pages
const Auth = lazy(() => import("./pages/Auth"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminReviews = lazy(() => import("./pages/admin/Reviews"));
const CompaniesAdmin = lazy(() => import("./pages/admin/Companies"));
const LeadsAdmin = lazy(() => import("./pages/admin/Leads"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminProviders = lazy(() => import("./pages/admin/Providers"));
const ProviderDetail = lazy(() => import("./pages/admin/ProviderDetail"));
const FunnelAnalytics = lazy(() => import("./pages/admin/FunnelAnalytics"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const Subscriptions = lazy(() => import("./pages/admin/Subscriptions"));
const PricingAnalytics = lazy(() => import("./pages/admin/PricingAnalytics"));
const MLAnalytics = lazy(() => import("./pages/admin/MLAnalytics"));
const DynamicPricing = lazy(() => import("./pages/admin/DynamicPricing"));
const Billing = lazy(() => import("./pages/admin/Billing"));
const AdminRankings = lazy(() => import("./pages/admin/Rankings"));
const ConversionAnalytics = lazy(() => import("./pages/admin/ConversionAnalytics"));
const EmailAutomation = lazy(() => import("./pages/admin/EmailAutomation"));
const ABTesting = lazy(() => import("./pages/admin/ABTestingComplete"));
const LocalizedUmzugsofferten = lazy(() => import("./pages/LocalizedUmzugsofferten"));
const ProviderAvailability = lazy(() => import("./pages/admin/ProviderAvailability"));
const CodeExport = lazy(() => import("./pages/admin/CodeExport"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminTools = lazy(() => import("./pages/admin/Tools"));
const AdminScreenshots = lazy(() => import("./pages/admin/Screenshots"));
const AdminAIExport = lazy(() => import("./pages/admin/AIExport"));
const AdminListings = lazy(() => import("./pages/admin/Listings"));
const ChatGPTOverview = lazy(() => import("./pages/admin/ChatGPTOverview"));
const AICommandCenter = lazy(() => import("./pages/admin/AICommandCenter"));
const AdminCapabilities = lazy(() => import("./pages/admin/Capabilities"));
const VariantTestHub = lazy(() => import("./pages/admin/VariantTestHub"));
const FlowCommandCenter = lazy(() => import("./pages/admin/FlowCommandCenter"));
const CommandCenter = lazy(() => import("./pages/admin/CommandCenter"));
const AnalysisFramework = lazy(() => import("./pages/admin/AnalysisFramework"));
const FlowFeedbackVariants = lazy(() => import("./pages/admin/FlowFeedbackVariants"));
const AllFlowsScreenshotReview = lazy(() => import("./pages/admin/AllFlowsScreenshotReview"));
const LandingPageChatGPTExport = lazy(() => import("./pages/admin/LandingPageChatGPTExport"));

// ChatGPT Flow pages
const ChatGPTFlow1 = lazy(() => import("./pages/ChatGPTFlow1"));
const ChatGPTFlow2 = lazy(() => import("./pages/ChatGPTFlow2"));
const ChatGPTFlow3 = lazy(() => import("./pages/ChatGPTFlow3"));
const ChatGPTExport = lazy(() => import("./pages/ChatGPTExport"));

// Canonical Funnel (Best-of all variants)
const CanonicalOffertenFlow = lazy(() => import("./components/funnel/CanonicalOffertenFlow"));

// Dashboard (After Booking)
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Swiss Premium Flows (ChatGPT optimized)
const SwissLightning = lazy(() => import("./pages/SwissLightning"));
const SwissPremiumChoice = lazy(() => import("./pages/SwissPremiumChoice"));
const SwissConciergeHybrid = lazy(() => import("./pages/SwissConciergeHybrid"));

// Gemini Top-Flows (highest scoring flows from Gemini analysis)
const V9ZeroFriction = lazy(() => import("./pages/V9ZeroFriction"));
const UltimateBest36 = lazy(() => import("./pages/UltimateBest36"));
const GoldenFlowV10 = lazy(() => import("./pages/GoldenFlowV10"));

// Customer pages
const KundenOnboarding = lazy(() => import("./pages/KundenOnboarding"));

// Ratgeber pages
const UmzugschecklisteDownload = lazy(() => import("./pages/ratgeber/UmzugschecklisteDownload"));
const UmzugskostenGuide = lazy(() => import("./pages/ratgeber/UmzugskostenGuide"));
const UmzugstippsGuide = lazy(() => import("./pages/ratgeber/UmzugstippsGuide"));

// Regional pages
const RegionalTemplate = lazy(() => import("./pages/region/RegionalTemplate"));

// Legal pages
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const AGB = lazy(() => import("./pages/AGB"));
const Impressum = lazy(() => import("./pages/Impressum"));
const UeberUns = lazy(() => import("./pages/UeberUns"));
const SoFunktionierts = lazy(() => import("./pages/SoFunktionierts"));

// Vision 2026 - Invisible Move Landing Page
const InvisibleMove = lazy(() => import("./pages/InvisibleMove"));
const InvisibleMoveV2 = lazy(() => import("./pages/InvisibleMoveV2"));
const Blueprint = lazy(() => import("./pages/Blueprint"));
const BlueprintV2 = lazy(() => import("./pages/BlueprintV2"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false, // Prevent refetch on window focus (e.g., after screenshots)
      refetchOnReconnect: false,
    },
  },
});

// Helper component for main site layout with Navigation/Footer
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen bg-background">
    <Navigation />
    <ScrollProgressBar />
    
    {/* Navigation A/B Test Switcher - shows on homepage */}
    <NavigationVariantSwitcher showOnlyOnHome={true} />
    
    {/* Lazy loaded UI components with Suspense */}
    <Suspense fallback={null}>
      <AIMovingAssistant />
      <ProviderOnboarding />
      <OfflineIndicator />
      <QuickActionBar />
      <StickyContactBar />
      <FloatingActionButton />
      <MobileSearchButton />
    </Suspense>
    
    <ScrollToTopOnRoute />
    <ScrollToTop />
    
    <MobilePullToRefresh>
      <SwipeNavigationWrapper>
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
      </SwipeNavigationWrapper>
    </MobilePullToRefresh>
    
    <Footer />
    
    <Suspense fallback={null}>
      <MobileBottomNav />
    </Suspense>
  </div>
);

// Admin routes wrapper - no Navigation/Footer
const AdminRoutes = () => (
  <Suspense fallback={<PageLoadingFallback />}>
    <AnimatedRoutes>
      {/* Login MUST be before other admin routes to ensure it matches first */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/companies" element={<CompaniesAdmin />} />
      <Route path="/admin/reviews" element={<AdminReviews />} />
      <Route path="/admin/leads" element={<LeadsAdmin />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/admin/funnel-analytics" element={<FunnelAnalytics />} />
      <Route path="/admin/subscriptions" element={<Subscriptions />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/pricing" element={<DynamicPricing />} />
      <Route path="/admin/pricing-analytics" element={<PricingAnalytics />} />
      <Route path="/admin/ml-analytics" element={<MLAnalytics />} />
      <Route path="/admin/providers" element={<AdminProviders />} />
      <Route path="/admin/providers/:id" element={<ProviderDetail />} />
      <Route path="/admin/billing" element={<Billing />} />
      <Route path="/admin/rankings" element={<AdminRankings />} />
      <Route path="/admin/conversion-analytics" element={<ConversionAnalytics />} />
      <Route path="/admin/email-automation" element={<EmailAutomation />} />
      <Route path="/admin/ab-testing" element={<ABTesting />} />
      <Route path="/admin/availability" element={<ProviderAvailability />} />
      <Route path="/admin/code-export" element={<CodeExport />} />
      <Route path="/admin/tools" element={<AdminTools />} />
      <Route path="/admin/screenshots" element={<AdminScreenshots />} />
      <Route path="/admin/screenshot-review" element={<AllFlowsScreenshotReview />} />
      <Route path="/all-flows-review" element={<AllFlowsScreenshotReview />} />
      <Route path="/admin/ai-export" element={<AdminAIExport />} />
      <Route path="/admin/chatgpt-export" element={<LandingPageChatGPTExport />} />
      <Route path="/admin/listings" element={<AdminListings />} />
      <Route path="/admin/chatgpt" element={<ChatGPTOverview />} />
      <Route path="/admin/ai-command" element={<AICommandCenter />} />
      <Route path="/admin/capabilities" element={<AdminCapabilities />} />
      <Route path="/admin/varianten-testen" element={<VariantTestHub />} />
      {/* Flow Command Center - Redirect to public route */}
      <Route path="/admin/flow-command-center" element={<Navigate to="/flow-command-center" replace />} />
      <Route path="/admin/flow-analysis" element={<Navigate to="/flow-command-center" replace />} />
      <Route path="/admin/flow-comparison" element={<Navigate to="/flow-command-center?view=comparison" replace />} />
      <Route path="/admin/flow-comparison/:flowNumber" element={<Navigate to="/flow-command-center?view=comparison" replace />} />
      <Route path="/admin/flow-deep-analysis" element={<Navigate to="/flow-command-center?view=analysis" replace />} />
      <Route path="/admin/analysis-framework" element={<AnalysisFramework />} />
      <Route path="/admin/flow-feedback-variants" element={<FlowFeedbackVariants />} />
      <Route path="/admin/flow-tester" element={<Navigate to="/flow-tester" replace />} />
      <Route path="/admin/v3-varianten" element={<Navigate to="/v3-varianten" replace />} />
      <Route path="/admin/funnel" element={<FunnelAnalytics />} />
      <Route path="/admin/conversions" element={<ConversionAnalytics />} />
      <Route path="/admin/dynamic-pricing" element={<DynamicPricing />} />
      <Route path="/admin/url-tracking" element={<UrlTrackingDashboard />} />
    </AnimatedRoutes>
  </Suspense>
);

// Route content component that decides between admin and main layouts
const AppRouterContent = () => {
  const location = useLocation();
  const pathname = location.pathname.toLowerCase();
  const isAdminRoute = pathname.startsWith('/admin') || pathname === '/all-flows-review';
  const isFlowTester = pathname === '/flow-tester';

  if (isAdminRoute) {
    return <AdminRoutes />;
  }

  // Render FlowTester outside AnimatedRoutes to avoid potential issues
  if (isFlowTester) {
    return (
      <MainLayout>
        <Suspense fallback={<PageLoadingFallback />}>
          <FlowTester />
        </Suspense>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Suspense fallback={<PageLoadingFallback />}>
        <AnimatedRoutes>
          <Route path="/" element={<IndexPremium />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/old-home" element={<Index />} />
          <Route path="/v2" element={<HomeOptimized />} />
          <Route path="/v3" element={<NewIndex />} />
          <Route path="/v4" element={<HomePage />} />
          {/* Primary conversion funnel - Multi-step wizard */}
          <Route path="/vergleich" element={<Vergleich />} />
          <Route path="/offerte" element={<Vergleich />} />
          {/* Redirect base calculator routes to new wizard */}
          <Route path="/rechner" element={<Navigate to="/vergleich" replace />} />
          <Route path="/umzugsrechner" element={<Navigate to="/vergleich" replace />} />
          <Route path="/rechner/ai" element={<AIUpload />} />
          <Route path="/rechner/ergebnis" element={<CalculatorResults />} />
          <Route path="/ergebnis/:id" element={<EstimateResult />} />
          
          <Route path="/demo-ergebnis" element={<DemoResult />} />
          <Route path="/demo" element={<Navigate to="/demo-ergebnis" replace />} />
          <Route path="/bundle" element={<BundleEstimates />} />
          <Route path="/offerte-anfordern/:id" element={<LeadRequest />} />
          <Route path="/danke/:id" element={<ThankYou />} />
          <Route path="/rechner/reinigung" element={<CleaningCalculator />} />
          <Route path="/rechner/entsorgung" element={<DisposalCalculator />} />
          <Route path="/rechner/lager" element={<StorageCalculator />} />
          <Route path="/rechner/packservice" element={<PackingCalculator />} />
          <Route path="/rechner/moebelmontage" element={<AssemblyCalculator />} />
          <Route path="/rechner/konfigurator" element={<TotalPriceConfigurator />} />
          <Route path="/rechner/video" element={<VideoEstimator />} />
          {/* Canton redirects to /umzugsfirmen/:canton */}
          <Route path="/zug" element={<Navigate to="/umzugsfirmen/zug" replace />} />
          <Route path="/luzern" element={<Navigate to="/umzugsfirmen/luzern" replace />} />
          <Route path="/zuerich" element={<Navigate to="/umzugsfirmen/zuerich" replace />} />
          <Route path="/bern" element={<Navigate to="/umzugsfirmen/bern" replace />} />
          <Route path="/stgallen" element={<Navigate to="/umzugsfirmen/stgallen" replace />} />
          <Route path="/aargau" element={<Navigate to="/umzugsfirmen/aargau" replace />} />
          <Route path="/basel" element={<Navigate to="/umzugsfirmen/basel" replace />} />
          <Route path="/thurgau" element={<Navigate to="/umzugsfirmen/thurgau" replace />} />
          <Route path="/solothurn" element={<Navigate to="/umzugsfirmen/solothurn" replace />} />
          <Route path="/graubuenden" element={<Navigate to="/umzugsfirmen/graubuenden" replace />} />
          <Route path="/wallis" element={<Navigate to="/umzugsfirmen/wallis" replace />} />
          <Route path="/tessin" element={<Navigate to="/umzugsfirmen/tessin" replace />} />
          <Route path="/fribourg" element={<Navigate to="/umzugsfirmen/fribourg" replace />} />
          <Route path="/schwyz" element={<Navigate to="/umzugsfirmen/schwyz" replace />} />
          <Route path="/geneve" element={<Navigate to="/umzugsfirmen/geneve" replace />} />
          <Route path="/uri" element={<Navigate to="/umzugsfirmen/uri" replace />} />
          <Route path="/obwalden" element={<Navigate to="/umzugsfirmen/obwalden" replace />} />
          <Route path="/nidwalden" element={<Navigate to="/umzugsfirmen/nidwalden" replace />} />
          <Route path="/glarus" element={<Navigate to="/umzugsfirmen/glarus" replace />} />
          <Route path="/schaffhausen" element={<Navigate to="/umzugsfirmen/schaffhausen" replace />} />
          <Route path="/appenzell" element={<Navigate to="/umzugsfirmen/appenzell" replace />} />
          <Route path="/neuchatel" element={<Navigate to="/umzugsfirmen/neuchatel" replace />} />
          <Route path="/jura" element={<Navigate to="/umzugsfirmen/jura" replace />} />
          <Route path="/waadt" element={<Navigate to="/umzugsfirmen/waadt" replace />} />
          {/* Canton comparison routes */}
          <Route path="/zug/vergleich" element={<CantonComparison />} />
          <Route path="/zuerich/vergleich" element={<CantonComparison />} />
          <Route path="/bern/vergleich" element={<CantonComparison />} />
          <Route path="/:canton/vergleich" element={<CantonComparison />} />
          <Route path="/firmen" element={<Companies />} />
          <Route path="/umzugsfirmen" element={<Companies />} />
          <Route path="/umzugsfirmen-schweiz" element={<UmzugsfirmenSchweizPillar />} />
          <Route path="/umzugsfirmen-suche" element={<UmzugsfirmenPage />} />
          {/* All canton/region pages now use the unified RegionArchetypPage */}
          {/* Legacy V1 variant for Zürich testing */}
          <Route path="/umzugsfirmen/zuerich/v1" element={<ZuerichV1Landing />} />
          
          {/* CANONICAL ROUTES - Stadt/Kanton Trennung */}
          {/* SlugResolver handles: kanton-{slug} -> RegionArchetypPage, cities -> CityMovers, pure cantons -> redirect */}
          <Route path="/umzugsfirmen/:slug" element={<SlugResolverPage />} />
          <Route path="/firmen/:id" element={<CompanyProfile />} />
          <Route path="/firma/:slug" element={<CompanyProfile />} />
          <Route path="/vergleichen" element={<Compare />} />
          <Route path="/vergleich" element={<Compare />} />
          <Route path="/firmen-vergleich" element={<CompanyComparison />} />
          <Route path="/regionen" element={<RegionenOverview />} />
          <Route path="/fuer-firmen" element={<FuerFirmen />} />
          <Route path="/kanton/:slug" element={<RegionArchetypPage />} />
          <Route path="/umzug/:slug" element={<RegionArchetypPage />} />
          <Route path="/canton/:slug" element={<RegionArchetypPage />} />
          <Route path="/stadt/:slug" element={<City />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/ratgeber" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/ratgeber/:slug" element={<BlogPost />} />
          <Route path="/ueber-uns" element={<UeberUns />} />
          <Route path="/about" element={<About />} />
          <Route path="/so-funktionierts" element={<SoFunktionierts />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/agb" element={<AGB />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/anbieter/mobile" element={<MobileProviderApp />} />
          <Route path="/bewertung/:requestId" element={<ReviewSubmission />} />
          <Route path="/kunden-onboarding" element={<KundenOnboarding />} />
          <Route path="/ratgeber/umzugstipps" element={<UmzugstippsGuide />} />
          <Route path="/ratgeber/tipps" element={<UmzugstippsGuide />} />
          <Route path="/ratgeber/kosten" element={<UmzugskostenGuide />} />
          <Route path="/ratgeber/checklisten" element={<UmzugschecklisteDownload />} />
          <Route path="/ratgeber/:category/:slug" element={<BlogPost />} />
          <Route path="/ratgeber/umzugskosten-3-zimmer-wohnung" element={<UmzugskostenGuide />} />
          <Route path="/ratgeber/umzugscheckliste-download" element={<UmzugschecklisteDownload />} />
          <Route path="/ratgeber/umzug-mit-kindern" element={<BlogPost />} />
          <Route path="/ratgeber/wohnungsabgabe" element={<WohnungsabgabeGuide />} />
          <Route path="/umzugsfirma-vergleichen" element={<UmzugsfirmaVergleichen />} />
          <Route path="/umzugskosten-guide" element={<UmzugskostenGuide />} />
          <Route path="/region/:region" element={<RegionalTemplate />} />
          <Route path="/beste-umzugsfirma" element={<BesteFirmen />} />
          <Route path="/beste-umzugsfirma/:region" element={<BesteFirmen />} />
          <Route path="/guenstige-umzugsfirma" element={<GuenstigeFirmen />} />
          <Route path="/guenstige-umzugsfirma/:region" element={<GuenstigeFirmen />} />
          <Route path="/anbieter-werden" element={<BecomeProvider />} />
          <Route path="/anbieter" element={<BecomeProvider />} />
          <Route path="/anbieter/registrieren" element={<ProviderSignup />} />
          <Route path="/firmen-registrieren" element={<ProviderSignup />} />
          <Route path="/anbieter/signup" element={<ProviderSignupNew />} />
          <Route path="/anbieter/login" element={<ProviderLogin />} />
          <Route path="/anbieter/dashboard" element={<ProviderDashboard />} />
          <Route path="/anbieter/profil" element={<ProviderProfile />} />
          <Route path="/anbieter/preise" element={<ProviderPricing />} />
          <Route path="/anbieter/portal" element={<ProviderPortal />} />
          <Route path="/umzugsofferten" element={<Umzugsofferten />} />
          <Route path="/umzugsofferten-baseline" element={<UmzugsoffertenBaseline />} />
          <Route path="/umzugsofferten-v1" element={<UmzugsoffertenV1 />} />
          <Route path="/umzugsofferten-v1a" element={<UmzugsoffertenV1a />} />
          <Route path="/umzugsofferten-v1b" element={<UmzugsoffertenV1b />} />
          <Route path="/umzugsofferten-v1c" element={<UmzugsoffertenV1c />} />
          <Route path="/umzugsofferten-v1d" element={<UmzugsoffertenV1d />} />
          <Route path="/umzugsofferten-v1e" element={<UmzugsoffertenV1e />} />
          <Route path="/umzugsofferten-v1f" element={<UmzugsoffertenV1f />} />
          <Route path="/umzugsofferten-v1g" element={<UmzugsoffertenV1g />} />
          <Route path="/umzugsofferten-ultimate-ch" element={<UmzugsoffertenUltimateCH />} />
          <Route path="/umzugsofferten-ultimate-best36" element={<UltimateSwissFlow />} />

          {/* Dynamic route for sub-variants FIRST (v2a, v3b, v6a, v9d, etc.) - before main flows */}
          <Route path="/umzugsofferten-v2a" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v2b" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v2c" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v2d" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v2f" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v3a" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v3b" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v3c" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v3d" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v3e" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v4a" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v4b" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v4c" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v4d" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v4e" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v4f" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v5a" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v5b" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v5c" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v5d" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v5e" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v5f" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v6a" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v6b" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v6c" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v6d" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v6e" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v6f" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v7a" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v8a" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v9a" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v9b" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v9c" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v9d" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-multi-a" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-ultimate-v7" element={<UmzugsoffertenDynamic />} />
          <Route path="/umzugsofferten-v2-archetyp" element={<UmzugsoffertenV2Archetyp />} />

          {/* ChatGPT Optimized Flows */}
          <Route path="/chatgpt-flow-1" element={<ChatGPTFlow1 />} />
          <Route path="/chatgpt-flow-2" element={<ChatGPTFlow2 />} />
          <Route path="/chatgpt-flow-3" element={<ChatGPTFlow3 />} />
          <Route path="/chatgpt-export" element={<ChatGPTExport />} />
          
          {/* Canonical 3-Step Flow (Best-of V6a/V8a/V9) */}
          <Route path="/umzugsofferten-canonical" element={<CanonicalOffertenFlow />} />
          
          {/* Dashboard (After Booking) */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Swiss Premium Flows */}
          <Route path="/swiss-lightning" element={<SwissLightning />} />
          <Route path="/swiss-premium-choice" element={<SwissPremiumChoice />} />
          <Route path="/swiss-concierge-hybrid" element={<SwissConciergeHybrid />} />

          {/* Main V2+ flows (public URLs used by screenshot tooling) */}
          <Route path="/umzugsofferten-v2" element={<UmzugsoffertenVariant />} />
          <Route path="/umzugsofferten-v3" element={<UmzugsoffertenVariant />} />
          <Route path="/umzugsofferten-v4" element={<UmzugsoffertenVariant />} />
          <Route path="/umzugsofferten-v5" element={<UmzugsoffertenVariant />} />
          <Route path="/umzugsofferten-v6" element={<UmzugsoffertenVariant />} />
          <Route path="/umzugsofferten-v7" element={<UmzugsoffertenVariant />} />
          <Route path="/umzugsofferten-v8" element={<UmzugsoffertenVariant />} />
          <Route path="/umzugsofferten-v9" element={<UmzugsoffertenVariant />} />

          <Route path="/umzugsofferten-v2e" element={<UmzugsoffertenV2e />} />
          {/* Accept deep links like /umzugsofferten-v2e/step/3 for screenshot tools */}
          <Route path="/umzugsofferten-v2e/*" element={<UmzugsoffertenV2e />} />
          {/* Ultimate Flow Pages - dynamic from database */}
          <Route path="/umzugsofferten-ultimate-:flowId" element={<UmzugsoffertenUltimate />} />
          {/* Fallback dynamic route for any other sub-variants */}
          <Route path="/umzugsofferten-:variant" element={<UmzugsoffertenDynamic />} />

          {/* Gemini Top-Flows (highest scoring from Gemini analysis) */}
          <Route path="/v9-zero-friction" element={<V9ZeroFriction />} />
          <Route path="/ultimate-best36" element={<UltimateBest36 />} />
          <Route path="/golden-flow-v10" element={<GoldenFlowV10 />} />
          
          {/* Flow Command Center - Public (no admin auth required) */}
          <Route path="/flow-command-center" element={<FlowCommandCenter />} />
          <Route path="/flow-command-center/*" element={<FlowCommandCenter />} />
          
          {/* NEW: Archetyp Command Center - Unified Asset Management */}
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="/command-center/*" element={<CommandCenter />} />
          <Route path="/flow-review" element={<FlowReview />} />
          {/* Flow tester already defined at top, only redirects here */}
          <Route path="/flow/:flowId" element={<FlowShowcase />} />
          <Route path="/flow-overview" element={<Navigate to="/flow-tester" replace />} />

          {/* Flow Family Landing Pages */}
          <Route path="/flows" element={<FlowsIndex />} />
          <Route path="/flows/:familyId" element={<FlowFamilyLanding />} />
          <Route path="/intern-testing" element={<InternFlowTesting />} />
          {/* accept trailing slash / subpaths */}
          <Route path="/intern-testing/*" element={<InternFlowTesting />} />
          <Route path="/admin/intern-results" element={<AdminInternResults />} />
          <Route path="/v3-varianten" element={<V3VariantComparison />} />
          <Route path="/flow-comparison" element={<TopFlowsComparison />} />
          <Route path="/flow-vergleich" element={<TopFlowsComparison />} />
          <Route path="/flow-test" element={<RedirectWithQuery to="/flow-tester" />} />
          <Route path="/flowtester" element={<RedirectWithQuery to="/flow-tester" />} />
          <Route path="/flow-tester/" element={<RedirectWithQuery to="/flow-tester" />} />
          <Route path="/umzugsofferten/bestaetigung" element={<UmzugsoffertenBestaetigung />} />
          {/* Localized funnels - /umzugsofferten/zuerich, /umzugsofferten/bern, etc. */}
          <Route path="/umzugsofferten/:city" element={<LocalizedUmzugsofferten />} />
          <Route path="/preise" element={<Pricing />} />
          <Route path="/offerte" element={<OffertenPage />} />
          <Route path="/offerten" element={<OffertenOptimized />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/mein-bereich" element={<UserDashboard />} />
          {/* Vision 2026 - Invisible Move Landing Pages */}
          <Route path="/invisible-1" element={<InvisibleMove />} />
          <Route path="/invisible-2" element={<InvisibleMoveV2 />} />
          <Route path="/invisible-3" element={<Blueprint />} />
          <Route path="/invisible-4" element={<BlueprintV2 />} />
          <Route path="/raumplaner" element={<RoomPlannerDemo />} />
          <Route path="/navigation-vergleich" element={<NavigationComparison />} />
          <Route path="/sitemap" element={<Sitemap />} />
          {/* LEGACY ROUTES - Redirect to canonical /umzugsfirmen/:city */}
          <Route path="/:city/umzugsfirmen" element={<LegacyCityServiceRedirect />} />
          <Route path="/:city/umzug" element={<CityOptimized />} />
          <Route path="/city/:city" element={<CityPage />} />
          {/* ZurichMovers REMOVED - /zuerich/umzugsfirmen now redirects via LegacyCityServiceRedirect */}
          <Route path="/zuerich-umzug" element={<ZurichMoving />} />
          <Route path="/bern-umzug" element={<BernMoving />} />
          <Route path="/basel-umzug" element={<BaselMoving />} />
          <Route path="/luzern-umzug" element={<LuzernMoving />} />
          <Route path="/service/:serviceType" element={<ServicePage />} />
          <Route path="/services/:serviceType" element={<ServiceOptimized />} />
          {/* Services V2 - Unified Calculator Approach */}
          <Route path="/services/reinigung" element={<ReinigungV2 />} />
          <Route path="/services/entsorgung" element={<EntsorgungV2 />} />
          <Route path="/services/lagerung" element={<LagerungV2 />} />
          <Route path="/services/privatumzug" element={<PrivatumzugV2 />} />
          <Route path="/services/firmenumzug" element={<FirmenumzugV2 />} />
          <Route path="/services/montage" element={<MontageV2 />} />
          <Route path="/services/moebellift" element={<MoebelliftV2 />} />
          <Route path="/services/international" element={<InternationalV2 />} />
          <Route path="/services/packservice" element={<PackserviceV2 />} />
          <Route path="/services/seniorenumzug" element={<SeniorenumzugV2 />} />
          <Route path="/services/studenten" element={<StudentenV2 />} />
          <Route path="/services/spezialtransporte" element={<SpezialtransporteV2 />} />
          <Route path="/services/klaviertransport" element={<KlaviertransportV2 />} />
          <Route path="/services/auslandsumzug" element={<AuslandsumzugV2 />} />
          <Route path="/services/bueroumzug" element={<BueroumzugV2 />} />
          <Route path="/services/tresortransport" element={<TresortransportV2 />} />
          <Route path="/services/haushaltsaufloesung" element={<HaushaltsaufloesungV2 />} />
          <Route path="/services/umzugshelfer" element={<UmzugshelferV2 />} />
          {/* SEO-friendly aliases */}
          <Route path="/tresortransport" element={<TresortransportV2 />} />
          <Route path="/haushaltsaufloesung" element={<HaushaltsaufloesungV2 />} />
          <Route path="/umzugshelfer" element={<UmzugshelferV2 />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/umzugskartons" element={<ShopPage />} />
          <Route path="/ratgeber/umzugskosten-berechnen" element={<UmzugskostenBerechnenPage />} />
          <Route path="/dienstleistungen" element={<ServicesOverview />} />
          <Route path="/dienstleistungen/privatumzug" element={<PrivateMoving />} />
          <Route path="/dienstleistungen/firmenumzug" element={<BusinessMoving />} />
          <Route path="/dienstleistungen/reinigung" element={<CleaningService />} />
          <Route path="/dienstleistungen/entsorgung" element={<DisposalService />} />
          <Route path="/dienstleistungen/moebellift" element={<FurnitureLift />} />
          <Route path="/dienstleistungen/international" element={<InternationalMoving />} />
          <Route path="/dienstleistungen/umzug-reinigung" element={<MovingWithCleaning />} />
          <Route path="/dienstleistungen/einlagerung" element={<StorageService />} />
          <Route path="/dienstleistungen/:service" element={<ServiceOptimized />} />
          
          {/* NEW: Gold Standard Service+Location Routes (Archetype System) */}
          {/* Service + Canton: /dienstleistungen/[serviceSlug]/kanton-[cantonSlug] */}
          <Route path="/dienstleistungen/:serviceSlug/kanton-:cantonSlug" element={<ServiceLocationPage />} />
          {/* Service + City: /dienstleistungen/[serviceSlug]/[citySlug] */}
          <Route path="/dienstleistungen/:serviceSlug/:citySlug" element={<ServiceLocationPage />} />
          
          {/* Service route aliases for shorter URLs */}
          <Route path="/privatumzug" element={<PrivateMoving />} />
          <Route path="/firmenumzug" element={<BusinessMoving />} />
          <Route path="/reinigung" element={<CleaningService />} />
          <Route path="/entsorgung-raeumung" element={<DisposalService />} />
          <Route path="/moebellift" element={<FurnitureLift />} />
          <Route path="/moebelmontage" element={<FurnitureAssembly />} />
          <Route path="/einlagerung" element={<StorageService />} />
          <Route path="/umzug-mit-reinigung" element={<MovingWithCleaning />} />
          <Route path="/international" element={<InternationalMoving />} />
          <Route path="/provider/pricing" element={<ProviderPricingPage />} />
          <Route path="/provider/faq" element={<ProviderFAQPage />} />
          {/* Provider route aliases */}
          <Route path="/provider/signup" element={<ProviderSignupNew />} />
          <Route path="/provider/login" element={<ProviderLogin />} />
          <Route path="/fuer-firmen/anmelden" element={<ProviderLogin />} />
          <Route path="/fuer-firmen/registrieren" element={<ProviderSignupNew />} />
          <Route path="/export-download" element={<ExportDownload />} />
          <Route path="*" element={<NotFound />} />
        </AnimatedRoutes>
      </Suspense>
    </MainLayout>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProviderAuthProvider>
          <PerformanceProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AnalyticsTracker />
                <ScreenshotRenderModeRoot />
                <CaptureReadySentinel />
                <CaptureDebugOverlay />
                <FunnelModeProvider />
                <ReloadDiagnostics />
                <CriticalCSS />
                <CriticalCSSLoader />
                <ResourceHints />
                <PrefetchManager />
                <PerformanceMonitor />
                <WebVitalsReporter debug={process.env.NODE_ENV === 'development'} />
                <PreloadResources />
                <PerformanceDebugOverlay />
                <AppRouterContent />
                {/* Global Optimization Components */}
                <Suspense fallback={null}>
                  <SocialProofTicker position="bottom-left" />
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </PerformanceProvider>
        </ProviderAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
