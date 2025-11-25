import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProviderAuthProvider } from "@/contexts/ProviderAuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
import Sitemap from "./pages/Sitemap";
import Preise from "./pages/Preise";
import Vergleich from "./pages/Vergleich";
import Offerte from "./pages/Offerte";
import Dienstleistungen from "./pages/Dienstleistungen";
import Datenschutz from "./pages/Datenschutz";
import AGB from "./pages/AGB";
import Impressum from "./pages/Impressum";
import Cookies from "./pages/Cookies";
import Calculator from "./pages/Calculator";
import RechnerHub from "./pages/RechnerHub";
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
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminReviews from "./pages/admin/Reviews";
import AIUpload from "./pages/AIUpload";
import NotFound from "./pages/NotFound";
import CompaniesAdmin from "./pages/admin/Companies";
import LeadsAdmin from "./pages/admin/Leads";
import AdminAnalytics from "./pages/admin/Analytics";
import MovingCostGuide from "./pages/MovingCostGuide";
import CleaningCalculator from "./pages/CleaningCalculator";
import DisposalCalculator from "./pages/DisposalCalculator";
import StorageCalculator from "./pages/StorageCalculator";
import PackingCalculator from "./pages/PackingCalculator";
import AssemblyCalculator from "./pages/AssemblyCalculator";
import TotalPriceConfigurator from "./pages/TotalPriceConfigurator";
import VideoEstimator from "./pages/VideoEstimator";
import About from "./pages/About";
import Ratgeber from "./pages/Ratgeber";
import BecomeProvider from "./pages/BecomeProvider";
import ProviderSignup from "./pages/ProviderSignup";
import ProviderLogin from "./pages/ProviderLogin";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderProfile from "./pages/ProviderProfile";
import ProviderPricing from "./pages/ProviderPricing";
import AdminProviders from "./pages/admin/Providers";
import ProviderDetail from "./pages/admin/ProviderDetail";
import FunnelAnalytics from "./pages/admin/FunnelAnalytics";
import Reports from "./pages/admin/Reports";
import ReviewSubmission from "./pages/ReviewSubmission";
import Subscriptions from "./pages/admin/Subscriptions";
import MobileProviderApp from "./pages/MobileProviderApp";
import PricingAnalytics from "./pages/admin/PricingAnalytics";
import MLAnalytics from "./pages/admin/MLAnalytics";
import DynamicPricing from "./pages/admin/DynamicPricing";

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
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="space-y-4 w-full max-w-md p-6">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </div>
              }>
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
                <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/preise" element={<Preise />} />
            <Route path="/vergleich" element={<Vergleich />} />
            <Route path="/offerte" element={<Offerte />} />
            <Route path="/dienstleistungen" element={<Dienstleistungen />} />
            <Route path="/umzugsfirmen" element={<Companies />} />
            <Route path="/ratgeber" element={<Ratgeber />} />
            <Route path="/über-uns" element={<About />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/agb" element={<AGB />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/rechner" element={<RechnerHub />} />
            <Route path="/rechner/umzugskosten" element={<Calculator />} />
            <Route path="/rechner/volumenrechner" element={<Calculator />} />
            <Route path="/rechner/transporter-groesse" element={<Calculator />} />
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
            <Route path="/vergleichen" element={<Compare />} />
            <Route path="/regionen" element={<Regionen />} />
            <Route path="/kanton/:slug" element={<Canton />} />
            <Route path="/umzug/:canton" element={<Canton />} />
            <Route path="/stadt/:slug" element={<City />} />
            <Route path="/umzugsfirmen/:slug" element={<City />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/ueber-uns" element={<About />} />
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
            <Route path="/umzugskosten-guide" element={<MovingCostGuide />} />
            <Route path="/anbieter-werden" element={<BecomeProvider />} />
            <Route path="/anbieter/registrieren" element={<ProviderSignup />} />
            <Route path="/anbieter/login" element={<ProviderLogin />} />
            <Route path="/anbieter/dashboard" element={<ProviderDashboard />} />
            <Route path="/anbieter/profil" element={<ProviderProfile />} />
            <Route path="/anbieter/preise" element={<ProviderPricing />} />
            <Route path="/sitemap.xml" element={<Sitemap />} />
            <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ProviderAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
