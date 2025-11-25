import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SponsoredCompanyCard } from "@/components/rankings/SponsoredCompanyCard";
import { OrganicCompanyCard } from "@/components/rankings/OrganicCompanyCard";
import { CompanySelectionBar, ContactFormData } from "@/components/rankings/CompanySelectionBar";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Trophy, Star, Shield, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { DEMO_COMPANIES, getCompaniesByRegion } from "@/data/companies";
import { getRankedCompanies } from "@/lib/ranking-service";
import { trackLeadConversion } from "@/lib/bidding-engine";
import { useHaptic } from "@/hooks/use-haptic";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { PullToRefreshIndicator } from "@/components/PullToRefreshIndicator";
import { RankingFilters, FilterState } from "@/components/rankings/RankingFilters";
import { toast } from "sonner";

export default function BesteFirmen() {
  const { region } = useParams();
  const { trigger } = useHaptic();
  
  const pageTitle = region 
    ? `Die besten Umzugsfirmen in ${region} (2025)` 
    : "Die besten Umzugsfirmen in der Schweiz (2025)";
  
  const pageDescription = region
    ? `Vergleichen Sie die top-bewerteten Umzugsfirmen in ${region}. Basierend auf echten Kundenbewertungen, Preis-Leistung und Servicequalität.`
    : "Die besten Umzugsfirmen der Schweiz im Vergleich. Basierend auf Kundenbewertungen, Preis-Leistung und Servicequalität.";

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    region: region || "all",
    services: [],
    priceLevel: "all",
    minRating: "0",
    sortBy: "recommended",
  });

  // Mock data - sponsored companies (would come from database with is_featured flag)
  const [sponsoredCompanies, setSponsoredCompanies] = useState<any[]>([]);
  const [organicCompanies, setOrganicCompanies] = useState<any[]>([]);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const handleRefresh = async () => {
    await fetchCompanies();
    trigger('success');
  };

  const { isPulling, isRefreshing, pullDistance, threshold } = usePullToRefresh({
    onRefresh: handleRefresh
  });

  useEffect(() => {
    fetchCompanies();
  }, [region, filters]);

  const fetchCompanies = () => {
    setLoading(true);
    
    const allCompanies = filters.region !== "all" 
      ? getCompaniesByRegion(filters.region) 
      : DEMO_COMPANIES;
    
    // Use the new ranking service with bidding
    const result = getRankedCompanies(allCompanies, {
      filters: {
        region: filters.region,
        services: filters.services,
        priceLevel: filters.priceLevel,
        minRating: parseFloat(filters.minRating),
        sortBy: filters.sortBy,
      },
      pageType: "beste-umzugsfirma",
      enableBidding: true,
    });
    
    // Format for display components
    const sponsored = result.sponsored.slice(0, 3).map(c => ({
      id: c.id,
      name: c.name,
      logo: c.logo_url,
      rating: c.rating,
      reviewCount: c.review_count,
      regions: c.service_areas,
      description: c.short_description || `Professioneller Service mit ${c.review_count} Kundenbewertungen.`,
      priceLevel: c.price_level === "günstig" ? "Günstig" : c.price_level === "fair" ? "Fair" : "Premium",
      specialOffer: c.discount_offer || "Spezialrabatt für Umzugscheck-Kunden",
    }));
    
    const organic = result.organic.map(c => ({
      id: c.id,
      rank: c.rank,
      name: c.name,
      logo: c.logo_url,
      rating: c.rating,
      reviewCount: c.review_count,
      regions: c.service_areas,
      description: c.short_description || `Zuverlässiger Service in ${c.service_areas[0]}.`,
      priceLevel: c.price_level === "günstig" ? "Günstig" : c.price_level === "fair" ? "Fair" : "Premium",
      savingsPercentage: c.savingsPercentage,
      verified: true,
    }));
    
    setSponsoredCompanies(sponsored);
    setOrganicCompanies(organic);
    
    // Pre-select top 2-3 organic companies
    if (selectedCompanyIds.length === 0) {
      const topCompanies = organic.slice(0, 3).map(c => c.id);
      setSelectedCompanyIds(topCompanies);
    }
    
    setLoading(false);
  };
  
  const toggleCompanySelection = (companyId: string) => {
    setSelectedCompanyIds(prev => 
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
    trigger('light');
  };
  
  const handleRequestOffers = async (contactData: ContactFormData) => {
    try {
      // Track lead conversion for billing
      await trackLeadConversion(selectedCompanyIds, `lead-${Date.now()}`);
      
      toast.success("Offerten angefordert!", {
        description: `Sie erhalten bald Angebote von ${selectedCompanyIds.length} Firmen.`,
      });
      
      // In production, this would call the actual lead API
      console.log("Lead submitted:", {
        ...contactData,
        selectedCompanyIds,
        leadType: "ranking",
      });
    } catch (error) {
      toast.error("Fehler beim Senden der Anfrage");
    }
  };

  return (
    <>
      <PullToRefreshIndicator 
        isPulling={isPulling}
        isRefreshing={isRefreshing}
        pullDistance={pullDistance}
        threshold={threshold}
      />
      <Helmet>
        <title>{pageTitle} | Umzugscheck.ch</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/5 via-background to-primary/5 py-12 sm:py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                  Ranking 2025
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2">
                  {pageTitle}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 px-4">
                  {pageDescription}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
                  <div className="flex flex-col items-center p-3 sm:p-4 bg-background rounded-lg">
                    <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mb-2" />
                    <div className="font-bold text-xl sm:text-2xl">4.8/5</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Durchschnittliche Bewertung</div>
                  </div>
                  <div className="flex flex-col items-center p-3 sm:p-4 bg-background rounded-lg">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mb-2" />
                    <div className="font-bold text-xl sm:text-2xl">100%</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Geprüfte Firmen</div>
                  </div>
                  <div className="flex flex-col items-center p-3 sm:p-4 bg-background rounded-lg">
                    <Award className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2" />
                    <div className="font-bold text-xl sm:text-2xl">15'000+</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Erfolgreiche Umzüge</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sponsored Section */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                  Empfohlene Top-Anbieter
                </h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {sponsoredCompanies.map((company) => (
                      <div key={company.id} className="relative">
                        <input
                          type="checkbox"
                          id={`select-sponsored-${company.id}`}
                          checked={selectedCompanyIds.includes(company.id)}
                          onChange={() => toggleCompanySelection(company.id)}
                          className="absolute top-4 right-4 z-10 w-5 h-5 cursor-pointer"
                        />
                        <SponsoredCompanyCard {...company} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Organic Ranking */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Komplettes Ranking
                </h2>
                <p className="text-muted-foreground mb-4">
                  Sortiert nach Kundenbewertungen, Servicequalität und Preis-Leistungs-Verhältnis
                </p>

                {/* Filters */}
                <RankingFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  onReset={() => setFilters({
                    region: "all",
                    services: [],
                    priceLevel: "all",
                    minRating: "0",
                    sortBy: "recommended",
                  })}
                />
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {organicCompanies.map((company) => (
                      <div key={company.id} className="relative">
                        <input
                          type="checkbox"
                          id={`select-organic-${company.id}`}
                          checked={selectedCompanyIds.includes(company.id)}
                          onChange={() => toggleCompanySelection(company.id)}
                          className="absolute top-4 right-4 z-10 w-5 h-5 cursor-pointer"
                        />
                        <OrganicCompanyCard {...company} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Unsicher, welche Firma zu Ihnen passt?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Nutzen Sie unseren kostenlosen Umzugsrechner und erhalten Sie passende Offerten von geprüften Firmen.
                </p>
                <Link to="/rechner">
                  <Button size="lg" className="text-lg px-8">
                    Umzugskosten berechnen
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        
        {/* Multi-select Selection Bar */}
        <CompanySelectionBar
          selectedCompanyIds={selectedCompanyIds}
          companies={[...sponsoredCompanies, ...organicCompanies]}
          onRequestOffers={handleRequestOffers}
        />
      </div>
    </>
  );
}
