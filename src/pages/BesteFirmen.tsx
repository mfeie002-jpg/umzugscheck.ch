import { useState, useEffect } from "react";
import { SponsoredCompanyCard } from "@/components/rankings/SponsoredCompanyCard";
import { OrganicCompanyCard } from "@/components/rankings/OrganicCompanyCard";
import { CompanySelectionBar, ContactFormData } from "@/components/rankings/CompanySelectionBar";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Trophy, Star, Shield, Award, ArrowRight } from "lucide-react";
import { DEMO_COMPANIES, getCompaniesByRegion } from "@/data/companies";
import { getRankedCompanies } from "@/lib/ranking-service";
import { trackLeadConversion } from "@/lib/bidding-engine";
import { useHaptic } from "@/hooks/use-haptic";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { PullToRefreshIndicator } from "@/components/PullToRefreshIndicator";
import { RankingFilters, FilterState } from "@/components/rankings/RankingFilters";
import { MobileFilterSheet } from "@/components/rankings/MobileFilterSheet";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { ScrollReveal } from "@/components/ScrollReveal";
import { toast } from "sonner";

export default function BesteFirmen() {
  const { region } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { trigger } = useHaptic();
  
  const pageTitle = region 
    ? `Die besten Umzugsfirmen in ${region} (2025)` 
    : "Die besten Umzugsfirmen in der Schweiz (2025)";
  
  const pageDescription = region
    ? `Vergleichen Sie die top-bewerteten Umzugsfirmen in ${region}. Basierend auf echten Kundenbewertungen, Preis-Leistung und Servicequalität.`
    : "Die besten Umzugsfirmen der Schweiz im Vergleich. Basierend auf Kundenbewertungen, Preis-Leistung und Servicequalität.";

  // Initialize filters from URL params
  const initializeFilters = (): FilterState => {
    const services = searchParams.get('services')?.split(',').filter(Boolean) || [];
    return {
      region: region || searchParams.get('region') || "all",
      services,
      priceLevel: searchParams.get('preis') || "all",
      minRating: searchParams.get('minRating') || "0",
      sortBy: searchParams.get('sort') || "recommended",
    };
  };

  // Filter state
  const [filters, setFilters] = useState<FilterState>(initializeFilters());

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

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.region !== "all") params.set('region', filters.region);
    if (filters.services.length > 0) params.set('services', filters.services.join(','));
    if (filters.priceLevel !== "all") params.set('preis', filters.priceLevel);
    if (filters.minRating !== "0") params.set('minRating', filters.minRating);
    if (filters.sortBy !== "recommended") params.set('sort', filters.sortBy);
    
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

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

  const currentUrl = `https://www.umzugscheck.ch/beste-umzugsfirma${region ? `/${region}` : ''}/`;

  return (
    <>
      <OptimizedSEO
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={currentUrl}
      />
      <PullToRefreshIndicator 
        isPulling={isPulling}
        isRefreshing={isRefreshing}
        pullDistance={pullDistance}
        threshold={threshold}
      />

      <div className="min-h-screen flex flex-col bg-gradient-elegant">
        <main className="flex-1">
          {/* Hero Section */}
          <ScrollReveal>
            <section className="relative py-16 sm:py-20 md:py-28 overflow-hidden">
              <div className="absolute inset-0 gradient-hero opacity-95" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
              
              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center text-white">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6 transition-base">
                    <Trophy className="w-4 h-4" />
                    Ranking 2025
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 px-2 leading-tight">
                    {pageTitle}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 px-4 leading-relaxed">
                    {pageDescription}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    {[
                      { icon: Star, value: "4.8/5", label: "Durchschnittliche Bewertung", color: "text-yellow-400" },
                      { icon: Shield, value: "100%", label: "Geprüfte Firmen", color: "text-green-400" },
                      { icon: Award, value: "15'000+", label: "Erfolgreiche Umzüge", color: "text-white" }
                    ].map((stat, idx) => (
                      <Card key={idx} variant="elevated" className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-lift hover-lift">
                        <stat.icon className={`w-8 h-8 ${stat.color} mb-3 mx-auto`} />
                        <div className="font-bold text-2xl text-foreground mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Sponsored Section */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Empfohlene Top-Anbieter
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {sponsoredCompanies.length + organicCompanies.length} Firmen gefunden
                  </p>
                </div>
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
                <p className="text-sm text-primary/70 mb-6 italic">
                  💡 Tipp: Nutzen Sie die Filter oben, um die perfekten Umzugsfirmen für Ihre Bedürfnisse zu finden
                </p>

                {/* Filters - Desktop */}
                <div className="hidden lg:block">
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
                </div>

                {/* Filters - Mobile */}
                <div className="lg:hidden mb-6">
                  <MobileFilterSheet
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
                </div>
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
          <section className="py-12 sm:py-16 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-4">
                  Unsicher, welche Umzugsfirma am besten zu Ihnen passt?
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
                  Statt lange zu vergleichen, können Sie mit einer Anfrage mehrere Offerten von geprüften Umzugsfirmen erhalten.
                </p>
                <Link to="/umzugsofferten" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-4 sm:px-6 sm:px-8 h-12 sm:h-14">
                    <span className="hidden sm:inline">Jetzt Umzugsofferten vergleichen</span>
                    <span className="sm:hidden">Offerten vergleichen</span>
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
        
        {/* Mobile Sticky CTA */}
        <StickyMobileCTA />
        
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
