import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Gavel, 
  Award, 
  BarChart3, 
  Settings,
  ArrowLeft,
  Zap
} from "lucide-react";
import { useProviderAuth } from "@/contexts/ProviderAuthContext";
import { Loader2 } from "lucide-react";
import { LeadBiddingPanel } from "@/components/provider/LeadBiddingPanel";
import { QualityScoreDashboard } from "@/components/provider/QualityScoreDashboard";
import { MarketplaceDynamicPricing } from "@/components/provider/MarketplaceDynamicPricing";
import { Footer } from "@/components/Footer";

export default function LeadMarketplace() {
  const navigate = useNavigate();
  const { provider, token, loading } = useProviderAuth();

  useEffect(() => {
    if (!loading && !provider) {
      navigate('/anbieter/login');
    }
  }, [provider, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!provider || !token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Lead Marktplatz | Umzugscheck.ch</title>
        <meta name="description" content="Bieten Sie auf qualifizierte Umzugs-Leads und verwalten Sie Ihre Preise dynamisch." />
      </Helmet>

      <main className="flex-1 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mb-2"
                onClick={() => navigate('/anbieter/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Zurück zum Dashboard
              </Button>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Zap className="h-8 w-8 text-primary" />
                Lead Marktplatz
              </h1>
              <p className="text-muted-foreground mt-1">
                Bieten Sie auf Leads, optimieren Sie Ihre Preise und steigern Sie Ihre Qualität
              </p>
            </div>
            <Badge variant="outline" className="gap-1 text-sm">
              <Award className="h-4 w-4" />
              {provider.company_name}
            </Badge>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="bidding" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="bidding" className="gap-2">
                <Gavel className="h-4 w-4" />
                <span className="hidden sm:inline">Lead Bidding</span>
                <span className="sm:hidden">Bidding</span>
              </TabsTrigger>
              <TabsTrigger value="quality" className="gap-2">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Quality Score</span>
                <span className="sm:hidden">Qualität</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dynamische Preise</span>
                <span className="sm:hidden">Preise</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bidding">
              <LeadBiddingPanel providerId={provider.id} token={token} />
            </TabsContent>

            <TabsContent value="quality">
              <QualityScoreDashboard 
                provider={{
                  id: provider.id,
                  company_name: provider.company_name,
                  rating: 4.2,
                  review_count: 12,
                  response_time_avg_hours: 8,
                  logo_url: provider.logo_url,
                  short_description: provider.description,
                  long_description: provider.description,
                  services_offered: provider.services_offered,
                  service_areas: provider.cantons_served,
                  certifications: [],
                  profile_gallery: [],
                  phone_tracking_number: provider.phone,
                  discount_offer: null
                }}
              />
            </TabsContent>

            <TabsContent value="pricing">
              <MarketplaceDynamicPricing 
                providerId={provider.id}
                basePriceChf={35}
                onPricingChange={(pricing) => {
                  console.log('Pricing updated:', pricing);
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
