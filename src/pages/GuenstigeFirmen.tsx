import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { SponsoredCompanyCard } from "@/components/rankings/SponsoredCompanyCard";
import { OrganicCompanyCard } from "@/components/rankings/OrganicCompanyCard";
import { CompanySelectionBar, ContactFormData } from "@/components/rankings/CompanySelectionBar";
import { OffertenCTA } from "@/components/OffertenCTA";
import { Button } from "@/components/ui/button";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { TrendingDown, DollarSign, CheckCircle, ArrowRight } from "lucide-react";
import { DEMO_COMPANIES, getCompaniesByRegion } from "@/data/companies";
import { getRankedCompanies } from "@/lib/ranking-service";
import { trackLeadConversion } from "@/lib/bidding-engine";
import { useHaptic } from "@/hooks/use-haptic";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { PullToRefreshIndicator } from "@/components/PullToRefreshIndicator";
import { RankingFilters, FilterState } from "@/components/rankings/RankingFilters";
import { MobileFilterSheet } from "@/components/rankings/MobileFilterSheet";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { toast } from "sonner";
import { generateMetaData, generateOGTags } from "@/lib/seo-meta";
import { generatePageSchemas, generateSchemaScript } from "@/lib/schema-markup";
import { getKeywordsForPage } from "@/lib/seo-keywords";

export default function GuenstigeFirmen() {
  const { region } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { trigger } = useHaptic();
  
  const pageTitle = region 
    ? `Günstige Umzugsfirmen in ${region} (2025)` 
    : "Günstige Umzugsfirmen in der Schweiz (2025)";
  
  const pageDescription = region
    ? `Die preiswertesten Umzugsfirmen in ${region}. Vergleichen Sie Preise und sparen Sie bis zu 40% bei Ihrem Umzug.`
    : "Die günstigsten Umzugsfirmen der Schweiz im Vergleich. Faire Preise ohne versteckte Kosten. Sparen Sie bis zu 40%.";

  // Initialize filters from URL params
  const initializeFilters = (): FilterState => {
    const services = searchParams.get('services')?.split(',').filter(Boolean) || [];
    return {
      region: region || searchParams.get('region') || "all",
      services,
      priceLevel: searchParams.get('preis') || "günstig",
      minRating: searchParams.get('minRating') || "0",
      sortBy: searchParams.get('sort') || "price",
    };
  };

  // Filter state
  const [filters, setFilters] = useState<FilterState>(initializeFilters());

  // Fetch companies from database
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
    if (filters.sortBy !== "price") params.set('sort', filters.sortBy);
    
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
    
    // Use the new ranking service with bidding (prioritize price)
    const result = getRankedCompanies(allCompanies, {
      filters: {
        region: filters.region,
        services: filters.services,
        priceLevel: filters.priceLevel,
        minRating: parseFloat(filters.minRating),
        sortBy: filters.sortBy,
      },
      pageType: "guenstige-umzugsfirma",
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
      description: c.short_description || `Günstiger Service ohne Qualitätsverlust.`,
      priceLevel: c.price_level === "günstig" ? "Günstig" : "Fair",
      specialOffer: c.discount_offer || "Exklusiv: Rabatt für Umzugscheck-Kunden",
    }));
    
    const organic = result.organic.map(c => ({
      id: c.id,
      rank: c.rank,
      name: c.name,
      logo: c.logo_url,
      rating: c.rating,
      reviewCount: c.review_count,
      regions: c.service_areas,
      description: c.short_description || `Preiswerte Umzugslösung.`,
      priceLevel: c.price_level === "günstig" ? "Günstig" : "Fair",
      savingsPercentage: c.savingsPercentage,
      verified: true,
    }));
    
    setSponsoredCompanies(sponsored);
    setOrganicCompanies(organic);
    
    // Pre-select top 2-3 cheap companies
    if (selectedCompanyIds.length === 0) {
      const cheapestCompanies = organic
        .filter(c => c.priceLevel === "Günstig")
        .slice(0, 3)
        .map(c => c.id);
      setSelectedCompanyIds(cheapestCompanies);
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
      await trackLeadConversion(selectedCompanyIds, `lead-${Date.now()}`);
      
      toast.success("Offerten angefordert!", {
        description: `Sie erhalten bald Angebote von ${selectedCompanyIds.length} Firmen.`,
      });
      
      console.log("Lead submitted:", {
        ...contactData,
        selectedCompanyIds,
        leadType: "ranking",
        pageType: "guenstige-umzugsfirma",
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
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-green-50 via-background to-green-50 dark:from-green-950/20 dark:to-green-950/20 py-12 sm:py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                  Beste Preise 2025
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2">
                  {pageTitle}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 px-4">
                  {pageDescription}
                </p>
                <p className="text-sm text-muted-foreground/80 mb-6 max-w-2xl mx-auto">
                  Filtern Sie die günstigsten Umzugsfirmen nach Region, Preis und Bewertung. Alle Anbieter sind geprüft und versichert.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
                  <div className="flex flex-col items-center p-3 sm:p-4 bg-background rounded-lg">
                    <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mb-2" />
                    <div className="font-bold text-xl sm:text-2xl">Bis 40%</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Günstiger als Durchschnitt</div>
                  </div>
                  <div className="flex flex-col items-center p-3 sm:p-4 bg-background rounded-lg">
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2" />
                    <div className="font-bold text-xl sm:text-2xl">Ab CHF 450</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Pro Umzug</div>
                  </div>
                  <div className="flex flex-col items-center p-3 sm:p-4 bg-background rounded-lg">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mb-2" />
                    <div className="font-bold text-xl sm:text-2xl">Transparent</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Keine versteckten Kosten</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sponsored Section */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Top Preis-Leistungs-Anbieter
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
                  Alle günstigen Umzugsfirmen
                </h2>
                <p className="text-muted-foreground mb-4">
                  Sortiert nach Preis-Leistungs-Verhältnis und Kundenzufriedenheit
                </p>
                <p className="text-sm text-primary/70 mb-6 italic">
                  💡 Tipp: Nutzen Sie die Filter oben, um die passenden günstigen Umzugsfirmen zu finden
                </p>

                {/* Filters - Desktop */}
                <div className="hidden lg:block">
                  <RankingFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    onReset={() => setFilters({
                      region: "all",
                      services: [],
                      priceLevel: "günstig",
                      minRating: "0",
                      sortBy: "price",
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
                      priceLevel: "günstig",
                      minRating: "0",
                      sortBy: "price",
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
          <section className="py-12 sm:py-16 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
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
