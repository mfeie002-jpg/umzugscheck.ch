import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProviderAuthProvider } from "@/contexts/ProviderAuthContext";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PreloadResources } from "@/components/PreloadResources";
import { PageLoadingFallback } from "@/components/ui/loading-fallback";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";

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
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { ScrollToTopOnRoute } from "./components/ScrollToTopOnRoute";
import { ScrollProgressBar } from "./components/ScrollProgressBar";
import { AIMovingAssistant } from "./components/AIMovingAssistant";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { QuickActionBar } from "./components/QuickActionBar";
import { StickyContactBar } from "./components/StickyContactBar";
import { CustomerOnboarding } from "./components/CustomerOnboarding";
import { ProviderOnboarding } from "./components/ProviderOnboarding";
import { FloatingActionButton } from "./components/mobile/FloatingActionButton";
import { MobilePullToRefresh } from "./components/MobilePullToRefresh";
import Index from "./pages/Index";
import NewIndex from "./pages/NewIndex";
import { HomePage } from "./pages/HomePage";
import { CityPage } from "./pages/CityPage";
import HomeOptimized from "./pages/HomeOptimized";
import IndexPremium from "./pages/IndexPremium";
import Sitemap from "./pages/Sitemap";
import Calculator from "./pages/Calculator";
import CalculatorResults from "./pages/CalculatorResults";
import EstimateResult from "./pages/EstimateResult";
import LeadRequest from "./pages/LeadRequest";
import ThankYou from "./pages/ThankYou";
import BundleEstimates from "./pages/BundleEstimates";
import Companies from "./pages/Companies";
import CompanyProfile from "./pages/CompanyProfile";
import Compare from "./pages/Compare";
import Canton from "./pages/Canton";
import City from "./pages/City";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import AIUpload from "./pages/AIUpload";
import NotFound from "./pages/NotFound";
import MovingCostGuide from "./pages/MovingCostGuide";
import CleaningCalculator from "./pages/CleaningCalculator";
import DisposalCalculator from "./pages/DisposalCalculator";
import StorageCalculator from "./pages/StorageCalculator";
import PackingCalculator from "./pages/PackingCalculator";
import AssemblyCalculator from "./pages/AssemblyCalculator";
import TotalPriceConfigurator from "./pages/TotalPriceConfigurator";
import VideoEstimator from "./pages/VideoEstimator";
import Zug from "./pages/Zug";
import CantonComparison from "./pages/CantonComparison";
import DynamicCanton from "./pages/DynamicCanton";
import { Luzern, Zuerich, Bern, StGallen, Aargau, Basel, Thurgau, Solothurn, Graubuenden, Wallis, Tessin, Fribourg, Schwyz, Geneve, Uri, Obwalden, Nidwalden, Glarus, Schaffhausen, Appenzell, Neuchatel, Jura, BaselNew, AargauNew, LuzernNew, StGallenNew } from "./pages/cantons";
import RegionenOverview from "./pages/Regionen";
import FuerFirmen from "./pages/FuerFirmen";
import ServicePlaceholder from "./pages/ServicePlaceholder";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import BecomeProvider from "./pages/BecomeProvider";
import CityMovers from "./pages/CityMovers";
import ServicePage from "./pages/ServicePage";
import ServiceOptimized from "./pages/ServiceOptimized";
import CityOptimized from "./pages/CityOptimized";
import ReviewSubmission from "./pages/ReviewSubmission";
import BesteFirmen from "./pages/BesteFirmen";
import GuenstigeFirmen from "./pages/GuenstigeFirmen";
import ProviderPortal from "./pages/ProviderPortal";
import Umzugsofferten from "./pages/Umzugsofferten";
import ZurichMovers from "./pages/ZurichMovers";
import Pricing from "./pages/Pricing";
import OffertenPage from "./pages/OffertenPage";
import OffertenOptimized from "./pages/OffertenOptimized";
import Tools from "./pages/Tools";
import UserDashboard from "./pages/UserDashboard";
import CompanyComparison from "./pages/CompanyComparison";
import MobileBottomNav from "./components/MobileBottomNav";


// Lazy load admin pages for code splitting
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

// Lazy load legal/info pages
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const AGB = lazy(() => import("./pages/AGB"));
const Impressum = lazy(() => import("./pages/Impressum"));
const UeberUns = lazy(() => import("./pages/UeberUns"));
const SoFunktionierts = lazy(() => import("./pages/SoFunktionierts"));

// Lazy load provider pages for code splitting
const ProviderSignup = lazy(() => import("./pages/ProviderSignup"));
const ProviderLogin = lazy(() => import("./pages/ProviderLogin"));
const ProviderDashboard = lazy(() => import("./pages/ProviderDashboard"));
const ProviderProfile = lazy(() => import("./pages/ProviderProfile"));
const ProviderPricing = lazy(() => import("./pages/ProviderPricing"));
const MobileProviderApp = lazy(() => import("./pages/MobileProviderApp"));
const ProviderSignupNew = lazy(() => import("./pages/provider/ProviderSignup"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProviderAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <PreloadResources />
              <div className="flex flex-col min-h-screen bg-background">
                <Navigation />
                <ScrollProgressBar />
          <AIMovingAssistant />
          <ScrollToTopOnRoute />
          
          <ProviderOnboarding />
          <ScrollToTop />
          <OfflineIndicator />
          <QuickActionBar />
          <StickyContactBar />
          <FloatingActionButton />
              <MobilePullToRefresh>
              <main className="flex-1">
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
            <Route path="/firmen" element={<Companies />} />
            <Route path="/umzugsfirmen" element={<Companies />} />
            <Route path="/umzugsfirmen-schweiz" element={<Companies />} />
            <Route path="/firmen/:id" element={<CompanyProfile />} />
            <Route path="/umzugsfirmen/:slug" element={<CompanyProfile />} />
            <Route path="/vergleichen" element={<Compare />} />
            <Route path="/vergleich" element={<Compare />} />
            <Route path="/firmen-vergleich" element={<CompanyComparison />} />
          <Route path="/regionen" element={<RegionenOverview />} />
          <Route path="/zug" element={<Zug />} />
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
            <Route path="/admin/rankings" element={<Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}><AdminRankings /></Suspense>} />
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
            <Route path="/firmen-login" element={<ProviderLogin />} />
            <Route path="/anbieter/dashboard" element={<ProviderDashboard />} />
            <Route path="/firmen-dashboard" element={<ProviderDashboard />} />
            <Route path="/anbieter/profil" element={<ProviderProfile />} />
            <Route path="/anbieter/preise" element={<ProviderPricingPage />} />
            <Route path="/anbieter/faq" element={<ProviderFAQPage />} />
            <Route path="/firmen-portal" element={<ProviderPortal />} />
            <Route path="/firmen-portal/dashboard" element={<ProviderDashboard />} />
            <Route path="/umzugsofferten" element={<Umzugsofferten />} />
            <Route path="/umzug-offerte" element={<Umzugsofferten />} />
            <Route path="/umzugsofferten/:region" element={<Umzugsofferten />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/mein-dashboard" element={<UserDashboard />} />
            
            {/* City Pages - Optimized */}
            <Route path="/zuerich/umzugsfirmen" element={<CityOptimized />} />
            <Route path="/basel/umzugsfirmen" element={<CityOptimized />} />
            <Route path="/bern/umzugsfirmen" element={<CityOptimized />} />
            <Route path="/luzern/umzugsfirmen" element={<CityOptimized />} />
            <Route path="/stgallen/umzugsfirmen" element={<CityOptimized />} />
            <Route path="/winterthur/umzugsfirmen" element={<CityOptimized />} />
            <Route path="/lausanne/umzugsfirmen" element={<CityOptimized />} />
            <Route path="/genf/umzugsfirmen" element={<CityOptimized />} />
            <Route path="/zug/umzugsfirmen" element={<CityOptimized />} />
            <Route path="/lugano/umzugsfirmen" element={<CityOptimized />} />
            <Route path="/biel/umzugsfirmen" element={<CityOptimized />} />
            <Route path="/schaffhausen/umzugsfirmen" element={<CityOptimized />} />
            <Route path="/chur/umzugsfirmen" element={<CityOptimized />} />
            <Route path="/aarau/umzugsfirmen" element={<CityOptimized />} />
            <Route path="/:city/umzugsfirmen" element={<CityOptimized />} />
            
            {/* Service Pages - Complete */}
            <Route path="/services" element={<ServicesOverview />} />
            <Route path="/privatumzug" element={<PrivateMoving />} />
            <Route path="/firmenumzug" element={<BusinessMoving />} />
            <Route path="/umzug-mit-reinigung" element={<MovingWithCleaning />} />
            <Route path="/reinigung" element={<CleaningService />} />
            <Route path="/entsorgung-raeumung" element={<DisposalService />} />
            <Route path="/moebellift" element={<FurnitureLift />} />
            <Route path="/einlagerung" element={<StorageService />} />
            <Route path="/umzug" element={<ServiceOptimized />} />
            <Route path="/umzug-schweiz" element={<ServiceOptimized />} />
            <Route path="/reinigung" element={<ServiceOptimized />} />
            <Route path="/umzugsreinigung-schweiz" element={<ServiceOptimized />} />
            <Route path="/raeumung" element={<ServiceOptimized />} />
            <Route path="/firmenumzug" element={<ServiceOptimized />} />
            <Route path="/firmenumzug-schweiz" element={<ServiceOptimized />} />
            <Route path="/entsorgung" element={<ServiceOptimized />} />
            <Route path="/entsorgung-schweiz" element={<ServiceOptimized />} />
            <Route path="/lagerung" element={<ServiceOptimized />} />
            <Route path="/transport" element={<ServiceOptimized />} />
            <Route path="/moebellift-schweiz" element={<ServiceOptimized />} />
            <Route path="/internationaler-umzug" element={<InternationalMoving />} />
            <Route path="/umzug-mit-reinigung" element={<ServiceOptimized />} />
            
            {/* City + Service Combinations - Optimized */}
            <Route path="/:city/:service" element={<ServiceOptimized />} />
            
            {/* Dienstleistungen Routes - Aliases */}
            <Route path="/dienstleistungen" element={<ServicesOverview />} />
            <Route path="/dienstleistungen/privatumzug" element={<PrivateMoving />} />
            <Route path="/dienstleistungen/umzug" element={<PrivateMoving />} />
            <Route path="/dienstleistungen/firmenumzug" element={<BusinessMoving />} />
            <Route path="/dienstleistungen/reinigung" element={<CleaningService />} />
            <Route path="/dienstleistungen/entsorgung" element={<DisposalService />} />
            <Route path="/dienstleistungen/raeumung" element={<DisposalService />} />
            <Route path="/dienstleistungen/lagerung" element={<StorageService />} />
            <Route path="/dienstleistungen/moebellift" element={<FurnitureLift />} />
            <Route path="/dienstleistungen/international" element={<InternationalMoving />} />
            <Route path="/dienstleistungen/spezialtransport" element={<ServiceOptimized />} />
            <Route path="/dienstleistungen/montage" element={<ServiceOptimized />} />
            <Route path="/dienstleistungen/wohnungsabgabe" element={<ServiceOptimized />} />
            
            <Route path="/preise" element={<Pricing />} />
            <Route path="/offerten" element={<OffertenOptimized />} />
            <Route path="/sitemap.xml" element={<Sitemap />} />
            <Route path="*" element={<NotFound />} />
          </AnimatedRoutes>
                </Suspense>
              </main>
              </MobilePullToRefresh>
                <MobileBottomNav />
                
                <Footer />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </ProviderAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
