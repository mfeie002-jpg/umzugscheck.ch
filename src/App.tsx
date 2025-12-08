import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route } from "react-router-dom";
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
const CantonComparison = lazy(() => import("./pages/CantonComparison"));
const DynamicCanton = lazy(() => import("./pages/DynamicCanton"));
const RegionenOverview = lazy(() => import("./pages/Regionen"));
const CityMovers = lazy(() => import("./pages/CityMovers"));
const CityOptimized = lazy(() => import("./pages/CityOptimized"));
const CityPage = lazy(() => import("./pages/CityPage").then(m => ({ default: m.CityPage })));
const ZurichMovers = lazy(() => import("./pages/ZurichMovers"));

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
                            <Route path="/rechner" element={<Calculator />} />
                            <Route path="/umzugsrechner" element={<Calculator />} />
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
                            <Route path="/zug" element={<Zug />} />
                            <Route path="/zug/vergleich" element={<CantonComparison />} />
                            <Route path="/zuerich/vergleich" element={<CantonComparison />} />
                            <Route path="/bern/vergleich" element={<CantonComparison />} />
                            <Route path="/:canton/vergleich" element={<CantonComparison />} />
                            <Route path="/luzern" element={<Luzern />} />
                            <Route path="/zuerich" element={<Zuerich />} />
                            <Route path="/bern" element={<Bern />} />
                            <Route path="/stgallen" element={<StGallen />} />
                            <Route path="/aargau" element={<Aargau />} />
                            <Route path="/basel" element={<Basel />} />
                            <Route path="/thurgau" element={<Thurgau />} />
                            <Route path="/solothurn" element={<Solothurn />} />
                            <Route path="/graubuenden" element={<Graubuenden />} />
                            <Route path="/wallis" element={<Wallis />} />
                            <Route path="/tessin" element={<Tessin />} />
                            <Route path="/fribourg" element={<Fribourg />} />
                            <Route path="/schwyz" element={<Schwyz />} />
                            <Route path="/geneve" element={<Geneve />} />
                            <Route path="/uri" element={<Uri />} />
                            <Route path="/obwalden" element={<Obwalden />} />
                            <Route path="/nidwalden" element={<Nidwalden />} />
                            <Route path="/glarus" element={<Glarus />} />
                            <Route path="/schaffhausen" element={<Schaffhausen />} />
                            <Route path="/appenzell" element={<Appenzell />} />
                            <Route path="/neuchatel" element={<Neuchatel />} />
                            <Route path="/jura" element={<Jura />} />
                            <Route path="/basel-new" element={<BaselNew />} />
                            <Route path="/aargau-new" element={<AargauNew />} />
                            <Route path="/luzern-new" element={<LuzernNew />} />
                            <Route path="/stgallen-new" element={<StGallenNew />} />
                            <Route path="/firmen" element={<Companies />} />
                            <Route path="/umzugsfirmen" element={<Companies />} />
                            <Route path="/umzugsfirmen-schweiz" element={<Companies />} />
                            <Route path="/umzugsfirmen-suche" element={<UmzugsfirmenPage />} />
                            <Route path="/firmen/:id" element={<CompanyProfile />} />
                            <Route path="/umzugsfirmen/:slug" element={<CompanyProfile />} />
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
                            <Route path="/ratgeber/umzugstipps" element={<Blog />} />
                            <Route path="/ratgeber/kosten" element={<Blog />} />
                            <Route path="/ratgeber/checklisten" element={<Blog />} />
                            <Route path="/ratgeber/:category/:slug" element={<BlogPost />} />
                            <Route path="/ratgeber/umzugskosten-3-zimmer-wohnung" element={<BlogPost />} />
                            <Route path="/ratgeber/umzugscheckliste-download" element={<BlogPost />} />
                            <Route path="/ratgeber/umzug-mit-kindern" element={<BlogPost />} />
                            <Route path="/umzugskosten-guide" element={<MovingCostGuide />} />
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
                            <Route path="/einlagerung" element={<StorageService />} />
                            <Route path="/umzug-mit-reinigung" element={<MovingWithCleaning />} />
                            <Route path="/international" element={<InternationalMoving />} />
                            <Route path="/provider/pricing" element={<ProviderPricingPage />} />
                            <Route path="/provider/faq" element={<ProviderFAQPage />} />
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
