import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProviderAuthProvider } from "@/contexts/ProviderAuthContext";
import { Suspense, lazy } from "react";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { AIMovingAssistant } from "./components/AIMovingAssistant";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { QuickActionBar } from "./components/QuickActionBar";
import { StickyContactBar } from "./components/StickyContactBar";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { PushNotificationPrompt } from "./components/PushNotificationPrompt";
import { CustomerOnboarding } from "./components/CustomerOnboarding";
import { ProviderOnboarding } from "./components/ProviderOnboarding";
import Index from "./pages/Index";
import NewIndex from "./pages/NewIndex";
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
import Regionen from "./pages/Regionen";
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
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import BecomeProvider from "./pages/BecomeProvider";
import CityMovers from "./pages/CityMovers";
import ServicePage from "./pages/ServicePage";
import ReviewSubmission from "./pages/ReviewSubmission";
import BesteFirmen from "./pages/BesteFirmen";
import GuenstigeFirmen from "./pages/GuenstigeFirmen";
import ProviderPortal from "./pages/ProviderPortal";
import Umzugsofferten from "./pages/Umzugsofferten";
import ZurichMovers from "./pages/ZurichMovers";
import Pricing from "./pages/Pricing";
import OffertenPage from "./pages/OffertenPage";

// Lazy load admin pages for code splitting
const Auth = lazy(() => import("./pages/Auth"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
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
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProviderAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-background">
              <Navigation />
          <AIMovingAssistant />
          <PWAInstallPrompt />
          <PushNotificationPrompt />
          <CustomerOnboarding />
          <ProviderOnboarding />
          <ScrollToTop />
          <OfflineIndicator />
          <QuickActionBar />
          <StickyContactBar />
              <main className="flex-1">
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                }>
                  <Routes>
          <Route path="/" element={<NewIndex />} />
          <Route path="/old-home" element={<Index />} />
            <Route path="/rechner" element={<Calculator />} />
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
            <Route path="/firmen" element={<Companies />} />
            <Route path="/firmen/:id" element={<CompanyProfile />} />
            <Route path="/umzugsfirmen/:slug" element={<CompanyProfile />} />
            <Route path="/vergleichen" element={<Compare />} />
            <Route path="/vergleich" element={<Compare />} />
            <Route path="/regionen" element={<Regionen />} />
            <Route path="/kanton/:slug" element={<Canton />} />
            <Route path="/umzug/:canton" element={<Canton />} />
            <Route path="/stadt/:slug" element={<City />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/ueber-uns" element={<About />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminDashboard />} />
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
            <Route path="/umzugskosten-guide" element={<MovingCostGuide />} />
            <Route path="/beste-umzugsfirma" element={<BesteFirmen />} />
            <Route path="/beste-umzugsfirma/:region" element={<BesteFirmen />} />
            <Route path="/guenstige-umzugsfirma" element={<GuenstigeFirmen />} />
            <Route path="/guenstige-umzugsfirma/:region" element={<GuenstigeFirmen />} />
            <Route path="/anbieter-werden" element={<BecomeProvider />} />
            <Route path="/anbieter/registrieren" element={<ProviderSignup />} />
            <Route path="/firmen-registrieren" element={<ProviderSignup />} />
            <Route path="/anbieter/signup" element={<ProviderSignupNew />} />
            <Route path="/anbieter/login" element={<ProviderLogin />} />
            <Route path="/firmen-login" element={<ProviderLogin />} />
            <Route path="/anbieter/dashboard" element={<ProviderDashboard />} />
            <Route path="/firmen-dashboard" element={<ProviderDashboard />} />
            <Route path="/anbieter/profil" element={<ProviderProfile />} />
            <Route path="/anbieter/preise" element={<ProviderPricing />} />
            <Route path="/firmen-portal" element={<ProviderPortal />} />
            <Route path="/firmen-portal/dashboard" element={<ProviderDashboard />} />
            <Route path="/umzugsofferten" element={<Umzugsofferten />} />
            <Route path="/umzugsofferten/:region" element={<Umzugsofferten />} />
            
            {/* City Pages */}
            <Route path="/zuerich/umzugsfirmen" element={<CityMovers />} />
            <Route path="/basel/umzugsfirmen" element={<CityMovers />} />
            <Route path="/bern/umzugsfirmen" element={<CityMovers />} />
            <Route path="/luzern/umzugsfirmen" element={<CityMovers />} />
            <Route path="/stgallen/umzugsfirmen" element={<CityMovers />} />
            <Route path="/winterthur/umzugsfirmen" element={<CityMovers />} />
            <Route path="/lausanne/umzugsfirmen" element={<CityMovers />} />
            <Route path="/genf/umzugsfirmen" element={<CityMovers />} />
            <Route path="/zug/umzugsfirmen" element={<CityMovers />} />
            <Route path="/lugano/umzugsfirmen" element={<CityMovers />} />
            <Route path="/biel/umzugsfirmen" element={<CityMovers />} />
            <Route path="/schaffhausen/umzugsfirmen" element={<CityMovers />} />
            <Route path="/chur/umzugsfirmen" element={<CityMovers />} />
            <Route path="/aarau/umzugsfirmen" element={<CityMovers />} />
            <Route path="/:city/umzugsfirmen" element={<CityMovers />} />
            
            {/* Service Pages */}
            <Route path="/umzug" element={<ServicePage />} />
            <Route path="/reinigung" element={<ServicePage />} />
            <Route path="/raeumung" element={<ServicePage />} />
            <Route path="/firmenumzug" element={<ServicePage />} />
            <Route path="/entsorgung" element={<ServicePage />} />
            <Route path="/lagerung" element={<ServicePage />} />
            <Route path="/transport" element={<ServicePage />} />
            <Route path="/umzug-mit-reinigung" element={<ServicePage />} />
            
            {/* City + Service Combinations */}
            <Route path="/:city/:service" element={<ServicePage />} />
            
            <Route path="/preise" element={<Pricing />} />
            <Route path="/offerten" element={<OffertenPage />} />
            <Route path="/sitemap.xml" element={<Sitemap />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ProviderAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
