import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Calculator from "./pages/Calculator";
import CalculatorResults from "./pages/CalculatorResults";
import Companies from "./pages/Companies";
import CompanyProfile from "./pages/CompanyProfile";
import Canton from "./pages/Canton";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rechner" element={<Calculator />} />
          <Route path="/rechner/ergebnis" element={<CalculatorResults />} />
          <Route path="/firmen" element={<Companies />} />
          <Route path="/firmen/:id" element={<CompanyProfile />} />
          <Route path="/:canton/umzugsfirmen" element={<Canton />} />
          <Route path="/:city/umzug" element={<Canton />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
