import { useState, useEffect } from "react";
import { SponsoredCompanyCard } from "@/components/rankings/SponsoredCompanyCard";
import { OrganicCompanyCard } from "@/components/rankings/OrganicCompanyCard";
import { CompanySelectionBar, ContactFormData } from "@/components/rankings/CompanySelectionBar";
import CompanyComparisonView from "@/components/CompanyComparisonView";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { TrendingDown, DollarSign, CheckCircle, ArrowRight, LayoutGrid, Table2 } from "lucide-react";
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

export default function GuenstigeFirmen() {
  const { region } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { trigger } = useHaptic();
  
  const pageTitle = region 
    ? `Günstige Umzugsfirmen ${region} | Preise vergleichen & sparen` 
    : "Günstige Umzugsfirmen Schweiz | Preise vergleichen & sparen";
  
  const pageDescription = region
    ? `Günstige Umzugsfirmen in ${region} finden: transparente Preise, geprüfte Anbieter, bis zu 40% sparen. Jetzt vergleichen und passende Offerten anfordern.`
    : "Günstige Umzugsfirmen in der Schweiz finden: transparente Preise, geprüfte Anbieter, bis zu 40% sparen. Jetzt vergleichen und passende Offerten anfordern.";

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
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

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

  const currentUrl = `https://www.umzugscheck.ch/guenstige-umzugsfirma${region ? `/${region}` : ''}/`;

  // Schema.org Markup for Rich Snippets
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": region ? `Günstige Umzugsfirmen in ${region}` : "Günstige Umzugsfirmen Schweiz",
    "description": pageDescription,
    "provider": {
      "@type": "Organization",
      "name": "umzugscheck.ch",
      "url": "https://umzugscheck.ch"
    },
    "areaServed": {
      "@type": region ? "AdministrativeArea" : "Country",
      "name": region || "Switzerland"
    },
    "serviceType": "Affordable Moving Company Comparison",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.6",
      "reviewCount": "8500",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "450",
      "highPrice": "2500",
      "priceCurrency": "CHF",
      "description": "Günstige Umzugsangebote ab CHF 450"
    }
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": region ? `Günstige Umzugsfirmen in ${region}` : "Günstige Umzugsfirmen Schweiz",
    "description": "Ranking der preiswertesten Umzugsfirmen",
    "numberOfItems": organicCompanies.length + sponsoredCompanies.length,
    "itemListElement": [...sponsoredCompanies, ...organicCompanies].slice(0, 10).map((company, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": company.name,
        "priceRange": company.priceLevel === "Günstig" ? "€" : "€€",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": company.rating,
          "reviewCount": company.reviewCount
        }
      }
    }))
  };

  return (
    <>
      <OptimizedSEO
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={currentUrl}
        schemaMarkup={[serviceSchema, itemListSchema]}
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
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 opacity-95" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
              
              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center text-white">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6 transition-base">
                    <TrendingDown className="w-4 h-4" />
                    Beste Preise 2025
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 px-2 leading-tight">
                    {pageTitle}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 px-4 leading-relaxed">
                    {pageDescription}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
                    {[
                      { icon: TrendingDown, value: "Bis 40%", label: "Günstiger als Durchschnitt", color: "text-green-300" },
                      { icon: DollarSign, value: "Ab CHF 450", label: "Pro Umzug", color: "text-yellow-300" },
                      { icon: CheckCircle, value: "Transparent", label: "Keine versteckten Kosten", color: "text-white" }
                    ].map((stat, idx) => (
                      <Card key={idx} variant="elevated" className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-lift hover-lift">
                        <stat.icon className={`w-8 h-8 ${stat.color} mb-3 mx-auto`} />
                        <div className="font-bold text-2xl text-foreground mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </Card>
                    ))}
                  </div>
                  
                  {/* Hero CTA Button */}
                  <Link to="/umzugsofferten">
                    <Button size="lg" className="text-lg px-8 h-14 bg-white text-green-600 hover:bg-white/90 shadow-xl">
                      Günstige Angebote sichern
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      Alle günstigen Umzugsfirmen
                    </h2>
                    <p className="text-muted-foreground">
                      Sortiert nach Preis-Leistungs-Verhältnis und Kundenzufriedenheit
                    </p>
                  </div>
                  
                  {/* View Toggle */}
                  <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                    <Button
                      variant={viewMode === 'cards' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('cards')}
                      className="h-8 px-3"
                    >
                      <LayoutGrid className="w-4 h-4 mr-1.5" />
                      Karten
                    </Button>
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('table')}
                      className="h-8 px-3"
                    >
                      <Table2 className="w-4 h-4 mr-1.5" />
                      Tabelle
                    </Button>
                  </div>
                </div>
                
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
                ) : viewMode === 'table' ? (
                  <CompanyComparisonView
                    companies={[...sponsoredCompanies, ...organicCompanies].map(c => ({
                      id: c.id,
                      name: c.name,
                      rating: c.rating,
                      review_count: c.reviewCount,
                      price_level: c.priceLevel?.toLowerCase() || 'günstig',
                      services: c.regions || ['Umzug', 'Transport'],
                      service_areas: c.regions || ['Schweiz'],
                      verified: c.verified ?? true,
                      responseTime: '< 2 Std.',
                    }))}
                    onClose={() => setViewMode('cards')}
                  />
                ) : (
                  <div className="space-y-4">
                    {organicCompanies.map((company) => (
                      <div key={company.id} className="relative group">
                        <label 
                          htmlFor={`select-organic-${company.id}`}
                          className="absolute top-4 right-4 z-10 flex items-center gap-2 cursor-pointer bg-white/90 dark:bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border shadow-sm"
                        >
                          <input
                            type="checkbox"
                            id={`select-organic-${company.id}`}
                            checked={selectedCompanyIds.includes(company.id)}
                            onChange={() => toggleCompanySelection(company.id)}
                            className="w-4 h-4 cursor-pointer accent-primary"
                          />
                          <span className="text-xs font-medium">
                            {selectedCompanyIds.includes(company.id) ? 'Ausgewählt' : 'Auswählen'}
                          </span>
                        </label>
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
                  Günstige Umzugsfirma finden & bis zu 40% sparen
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
                  Vergleichen Sie jetzt Preise von günstigen Umzugsfirmen und erhalten Sie kostenlose Offerten.
                </p>
                <Link to="/umzugsofferten" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 bg-green-600 hover:bg-green-700">
                    Jetzt günstige Umzugsfirma vergleichen
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </Link>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Kostenlos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span>Unverbindlich</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Datenschutz</span>
                  </div>
                </div>
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
