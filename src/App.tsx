import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Calculator from "./pages/Calculator";
import CalculatorResults from "./pages/CalculatorResults";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/rechner" element={<Calculator />} />
            <Route path="/rechner/ai" element={<AIUpload />} />
            <Route path="/rechner/ergebnis" element={<CalculatorResults />} />
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
            <Route path="/umzugskosten-guide" element={<MovingCostGuide />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
