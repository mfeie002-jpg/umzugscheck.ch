import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Navigate } from "react-router-dom";
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

// City pages
const ZurichMoving = lazy(() => import("./pages/city/ZurichMoving"));
const BernMoving = lazy(() => import("./pages/city/BernMoving"));
const BaselMoving = lazy(() => import("./pages/city/BaselMoving"));
const LuzernMoving = lazy(() => import("./pages/city/LuzernMoving"));

// Provider pages
const ProviderPricingPage = lazy(() => import("./pages/provider/ProviderPricing"));
const ProviderFAQPage = lazy(() => import("./pages/provider/ProviderFAQ"));

// Core navigation components - keep synchronous for fast FCP
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { ScrollToTopOnRoute } from "./components/ScrollToTopOnRoute";
import { ScrollProgressBar } from "./components/ScrollProgressBar";

// Lazy load non-critical UI components
const AIMovingAssistant = lazy(() => import("./components/AIMovingAssistant").then(m => ({ default: m.AIMovingAssistant })));
const OfflineIndicator = lazy(() => import("./components/OfflineIndicator").then(m => ({ default: m.OfflineIndicator })));
const QuickActionBar = lazy(() => import("./components/QuickActionBar").then(m => ({ default: m.QuickActionBar })));
const StickyContactBar = lazy(() => import("./components/StickyContactBar").then(m => ({ default: m.StickyContactBar })));
const CustomerOnboarding = lazy(() => import("./components/CustomerOnboarding").then(m => ({ default: m.CustomerOnboarding })));
const ProviderOnboarding = lazy(() => import("./components/ProviderOnboarding").then(m => ({ default: m.ProviderOnboarding })));
const FloatingActionButton = lazy(() => import("./components/mobile/FloatingActionButton").then(m => ({ default: m.FloatingActionButton })));
const MobilePullToRefresh = lazy(() => import("./components/MobilePullToRefresh").then(m => ({ default: m.MobilePullToRefresh })));
const MobileBottomSheetNav = lazy(() => import("./components/mobile/MobileBottomSheetNav").then(m => ({ default: m.MobileBottomSheetNav })));
const SwipeNavigationWrapper = lazy(() => import("./components/mobile/SwipeNavigationWrapper").then(m => ({ default: m.SwipeNavigationWrapper })));
const MobileSearchButton = lazy(() => import("./components/mobile/MobileSearchButton").then(m => ({ default: m.MobileSearchButton })));
const MobileBottomNav = lazy(() => import("./components/MobileBottomNav"));

// Calculator pages
const Calculator = lazy(() => import("./pages/Calculator"));
const CalculatorResults = lazy(() => import("./pages/CalculatorResults"));
const EstimateResult = lazy(() => import("./pages/EstimateResult"));
const LeadRequest = lazy(() => import("./pages/LeadRequest"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
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

// Canton/Region pages
const Canton = lazy(() => import("./pages/Canton"));
const City = lazy(() => import("./pages/City"));
const Zug = lazy(() => import("./pages/Zug"));
const ZugLanding = lazy(() => import("./pages/umzugsfirmen/zug"));
const ZuerichLanding = lazy(() => import("./pages/umzugsfirmen/zuerich"));
const BernLanding = lazy(() => import("./pages/umzugsfirmen/bern"));
const BaselLanding = lazy(() => import("./pages/umzugsfirmen/basel"));
const LuzernLanding = lazy(() => import("./pages/umzugsfirmen/luzern"));
const AargauLanding = lazy(() => import("./pages/umzugsfirmen/aargau"));
const StGallenLanding = lazy(() => import("./pages/umzugsfirmen/stgallen"));
const ThurgauLanding = lazy(() => import("./pages/umzugsfirmen/thurgau"));
const SolothurnLanding = lazy(() => import("./pages/umzugsfirmen/solothurn"));
const GraubuendenLanding = lazy(() => import("./pages/umzugsfirmen/graubuenden"));
const WallisLanding = lazy(() => import("./pages/umzugsfirmen/wallis"));
const TessinLanding = lazy(() => import("./pages/umzugsfirmen/tessin"));
const FribourgLanding = lazy(() => import("./pages/umzugsfirmen/fribourg"));
const SchwyzLanding = lazy(() => import("./pages/umzugsfirmen/schwyz"));
const GenfLanding = lazy(() => import("./pages/umzugsfirmen/genf"));
const UriLanding = lazy(() => import("./pages/umzugsfirmen/uri"));
const ObwaldenLanding = lazy(() => import("./pages/umzugsfirmen/obwalden"));
const NidwaldenLanding = lazy(() => import("./pages/umzugsfirmen/nidwalden"));
const GlarusLanding = lazy(() => import("./pages/umzugsfirmen/glarus"));
const SchaffhausenLanding = lazy(() => import("./pages/umzugsfirmen/schaffhausen"));
const AppenzellLanding = lazy(() => import("./pages/umzugsfirmen/appenzell"));
const NeuenburgLanding = lazy(() => import("./pages/umzugsfirmen/neuenburg"));
const JuraLanding = lazy(() => import("./pages/umzugsfirmen/jura"));
const WaadtLanding = lazy(() => import("./pages/umzugsfirmen/waadt"));
const CantonComparison = lazy(() => import("./pages/CantonComparison"));
const DynamicCanton = lazy(() => import("./pages/DynamicCanton"));
const RegionenOverview = lazy(() => import("./pages/Regionen"));
const CityMovers = lazy(() => import("./pages/CityMovers"));
const CityOptimized = lazy(() => import("./pages/CityOptimized"));
const CityPage = lazy(() => import("./pages/CityPage").then(m => ({ default: m.CityPage })));
const ZurichMovers = lazy(() => import("./pages/ZurichMovers"));
const CantonCompanies = lazy(() => import("./pages/CantonCompanies"));
const RegionalOfferten = lazy(() => import("./pages/RegionalOfferten"));

// Canton pages - lazy loaded bundle
const Luzern = lazy(() => import("./pages/cantons/Luzern"));
const Zuerich = lazy(() => import("./pages/cantons/Zuerich"));
const Bern = lazy(() => import("./pages/cantons/Bern"));
const StGallen = lazy(() => import("./pages/cantons/StGallen"));
const Aargau = lazy(() => import("./pages/cantons/Aargau"));
const Basel = lazy(() => import("./pages/cantons/Basel"));
const Thurgau = lazy(() => import("./pages/cantons/Thurgau"));
const Solothurn = lazy(() => import("./pages/cantons/Solothurn"));
const Graubuenden = lazy(() => import("./pages/cantons/Graubuenden"));
const Wallis = lazy(() => import("./pages/cantons/Wallis"));
const Tessin = lazy(() => import("./pages/cantons/Tessin"));
const Fribourg = lazy(() => import("./pages/cantons/Fribourg"));
const Schwyz = lazy(() => import("./pages/cantons/Schwyz"));
const Geneve = lazy(() => import("./pages/cantons/Geneve"));
const Uri = lazy(() => import("./pages/cantons/Uri"));
const Obwalden = lazy(() => import("./pages/cantons/Obwalden"));
const Nidwalden = lazy(() => import("./pages/cantons/Nidwalden"));
const Glarus = lazy(() => import("./pages/cantons/Glarus"));
const Schaffhausen = lazy(() => import("./pages/cantons/Schaffhausen"));
const Appenzell = lazy(() => import("./pages/cantons/Appenzell"));
const Neuchatel = lazy(() => import("./pages/cantons/Neuchatel"));
const Jura = lazy(() => import("./pages/cantons/Jura"));
const BaselNew = lazy(() => import("./pages/cantons/BaselNew"));
const AargauNew = lazy(() => import("./pages/cantons/AargauNew"));
const LuzernNew = lazy(() => import("./pages/cantons/LuzernNew"));
const StGallenNew = lazy(() => import("./pages/cantons/StGallenNew"));

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
const ABTesting = lazy(() => import("./pages/admin/ABTesting"));
const ProviderAvailability = lazy(() => import("./pages/admin/ProviderAvailability"));
const CodeExport = lazy(() => import("./pages/admin/CodeExport"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    },
  },
});

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
              <CriticalCSS />
              <CriticalCSSLoader />
              <ResourceHints />
              <PrefetchManager />
              <PerformanceMonitor />
              <WebVitalsReporter debug={process.env.NODE_ENV === 'development'} />
              <PreloadResources />
              <PWAInstallPrompt />
              <PerformanceDebugOverlay />
              <div className="flex flex-col min-h-screen bg-background">
                <Navigation />
                <ScrollProgressBar />
                
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
                
                <Suspense fallback={null}>
                  <MobilePullToRefresh>
                    <SwipeNavigationWrapper>
                      <main className="flex-1 pb-16 md:pb-0">
                        <Suspense fallback={<PageLoadingFallback />}>
                          <AnimatedRoutes>
                            <Route path="/" element={<IndexPremium />} />
                            <Route path="/old-home" element={<Index />} />
                            <Route path="/v2" element={<HomeOptimized />} />
                            <Route path="/v3" element={<NewIndex />} />
                            <Route path="/v4" element={<HomePage />} />
                            {/* Redirect base calculator routes to umzugsofferten */}
                            <Route path="/rechner" element={<Navigate to="/umzugsofferten" replace />} />
                            <Route path="/umzugsrechner" element={<Navigate to="/umzugsofferten" replace />} />
                            <Route path="/rechner/ai" element={<AIUpload />} />
                            <Route path="/rechner/ergebnis" element={<CalculatorResults />} />
                            <Route path="/ergebnis/:id" element={<EstimateResult />} />
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
                            <Route path="/umzugsfirmen-schweiz" element={<Companies />} />
                            <Route path="/umzugsfirmen-suche" element={<UmzugsfirmenPage />} />
                            {/* Specific canton landing pages BEFORE generic route */}
                            <Route path="/umzugsfirmen/zug" element={<ZugLanding />} />
                            <Route path="/umzugsfirmen/zuerich" element={<ZuerichLanding />} />
                            <Route path="/umzugsfirmen/bern" element={<BernLanding />} />
                            <Route path="/umzugsfirmen/basel" element={<BaselLanding />} />
                            <Route path="/umzugsfirmen/luzern" element={<LuzernLanding />} />
                            <Route path="/umzugsfirmen/aargau" element={<AargauLanding />} />
                            <Route path="/umzugsfirmen/stgallen" element={<StGallenLanding />} />
                            <Route path="/umzugsfirmen/thurgau" element={<ThurgauLanding />} />
                            <Route path="/umzugsfirmen/solothurn" element={<SolothurnLanding />} />
                            <Route path="/umzugsfirmen/graubuenden" element={<GraubuendenLanding />} />
                            <Route path="/umzugsfirmen/wallis" element={<WallisLanding />} />
                            <Route path="/umzugsfirmen/tessin" element={<TessinLanding />} />
                            <Route path="/umzugsfirmen/fribourg" element={<FribourgLanding />} />
                            <Route path="/umzugsfirmen/schwyz" element={<SchwyzLanding />} />
                            <Route path="/umzugsfirmen/genf" element={<GenfLanding />} />
                            <Route path="/umzugsfirmen/uri" element={<UriLanding />} />
                            <Route path="/umzugsfirmen/obwalden" element={<ObwaldenLanding />} />
                            <Route path="/umzugsfirmen/nidwalden" element={<NidwaldenLanding />} />
                            <Route path="/umzugsfirmen/glarus" element={<GlarusLanding />} />
                            <Route path="/umzugsfirmen/schaffhausen" element={<SchaffhausenLanding />} />
                            <Route path="/umzugsfirmen/appenzell" element={<AppenzellLanding />} />
                            <Route path="/umzugsfirmen/neuenburg" element={<NeuenburgLanding />} />
                            <Route path="/umzugsfirmen/jura" element={<JuraLanding />} />
                            <Route path="/umzugsfirmen/waadt" element={<WaadtLanding />} />
                            <Route path="/umzugsfirmen/:canton" element={<CantonCompanies />} />
                            <Route path="/firmen/:id" element={<CompanyProfile />} />
                            <Route path="/firma/:slug" element={<CompanyProfile />} />
                            <Route path="/vergleichen" element={<Compare />} />
                            <Route path="/vergleich" element={<Compare />} />
                            <Route path="/firmen-vergleich" element={<CompanyComparison />} />
                            <Route path="/regionen" element={<RegionenOverview />} />
                            <Route path="/fuer-firmen" element={<FuerFirmen />} />
                            <Route path="/kanton/:slug" element={<Canton />} />
                            <Route path="/umzug/:canton" element={<Canton />} />
                            <Route path="/canton/:canton" element={<DynamicCanton />} />
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
                            <Route path="/admin" element={<Admin />} />
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/companies" element={<CompaniesAdmin />} />
                            <Route path="/admin/reviews" element={<AdminReviews />} />
                            <Route path="/admin/leads" element={<LeadsAdmin />} />
                            <Route path="/admin/analytics" element={<AdminAnalytics />} />
                            <Route path="/admin/funnel-analytics" element={<FunnelAnalytics />} />
                            <Route path="/admin/subscriptions" element={<Subscriptions />} />
                            <Route path="/admin/reports" element={<Reports />} />
                            <Route path="/anbieter/mobile" element={<MobileProviderApp />} />
                            <Route path="/bewertung/:requestId" element={<ReviewSubmission />} />
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
                            <Route path="/ratgeber/umzugstipps" element={<UmzugstippsGuide />} />
                            <Route path="/ratgeber/tipps" element={<UmzugstippsGuide />} />
                            <Route path="/ratgeber/kosten" element={<UmzugskostenGuide />} />
                            <Route path="/ratgeber/checklisten" element={<UmzugschecklisteDownload />} />
                            <Route path="/ratgeber/:category/:slug" element={<BlogPost />} />
                            <Route path="/ratgeber/umzugskosten-3-zimmer-wohnung" element={<UmzugskostenGuide />} />
                            <Route path="/ratgeber/umzugscheckliste-download" element={<UmzugschecklisteDownload />} />
                            <Route path="/ratgeber/umzug-mit-kindern" element={<BlogPost />} />
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
                            <Route path="/umzugsofferten/:region" element={<RegionalOfferten />} />
                            <Route path="/preise" element={<Pricing />} />
                            <Route path="/offerte" element={<OffertenPage />} />
                            <Route path="/offerten" element={<OffertenOptimized />} />
                            <Route path="/tools" element={<Tools />} />
                            <Route path="/mein-bereich" element={<UserDashboard />} />
                            <Route path="/sitemap" element={<Sitemap />} />
                            <Route path="/:city/umzugsfirmen" element={<CityMovers />} />
                            <Route path="/:city/umzug" element={<CityOptimized />} />
                            <Route path="/city/:city" element={<CityPage />} />
                            <Route path="/zuerich/umzugsfirmen" element={<ZurichMovers />} />
                            <Route path="/zuerich-umzug" element={<ZurichMoving />} />
                            <Route path="/bern-umzug" element={<BernMoving />} />
                            <Route path="/basel-umzug" element={<BaselMoving />} />
                            <Route path="/luzern-umzug" element={<LuzernMoving />} />
                            <Route path="/service/:serviceType" element={<ServicePage />} />
                            <Route path="/services/:serviceType" element={<ServiceOptimized />} />
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
                            <Route path="*" element={<NotFound />} />
                          </AnimatedRoutes>
                        </Suspense>
                      </main>
                    </SwipeNavigationWrapper>
                  </MobilePullToRefresh>
                </Suspense>
                
                <Footer />
                
                <Suspense fallback={null}>
                  <MobileBottomNav />
                </Suspense>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </PerformanceProvider>
        </ProviderAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
