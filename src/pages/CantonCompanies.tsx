/**
 * /umzugsfirmen/:canton - Canton-specific company listing page
 * 
 * Dynamic page showing all moving companies in a specific Swiss canton.
 * Includes filters, sorting, sponsored placements, and lead capture.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { SponsoredCompanyCard } from "@/components/rankings/SponsoredCompanyCard";
import { OrganicCompanyCard } from "@/components/rankings/OrganicCompanyCard";
import { CompanySelectionBar } from "@/components/rankings/CompanySelectionBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { RankingFilters, FilterState } from "@/components/rankings/RankingFilters";
import { MobileFilterSheet } from "@/components/rankings/MobileFilterSheet";
import { 
  MapPin, Star, Shield, Building2, ArrowRight, 
  CheckCircle2, Users, Award, TrendingUp 
} from "lucide-react";
import { DEMO_COMPANIES, getCompaniesByRegion } from "@/data/companies";
import { isValidCanton, getCantonDisplayName, getCantonSEOData, SWISS_CANTONS } from "@/lib/canton-utils";

export default function CantonCompanies() {
  const { canton } = useParams<{ canton: string }>();
  const navigate = useNavigate();
  
  // Validate canton parameter - redirect to company profile if not a valid canton
  useEffect(() => {
    if (canton && !isValidCanton(canton)) {
      // This is likely a company slug, not a canton - let the CompanyProfile handle it
      navigate(`/umzugsfirmen/${canton}`, { replace: true });
    }
  }, [canton, navigate]);

  // If not a valid canton, don't render the canton page
  if (!canton || !isValidCanton(canton)) {
    return null;
  }

  const displayName = getCantonDisplayName(canton);
  const seoData = getCantonSEOData(canton);

  const [filters, setFilters] = useState<FilterState>({
    region: canton,
    services: [],
    priceLevel: "all",
    minRating: "0",
    sortBy: "recommended",
  });

  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, [canton, filters]);

  const fetchCompanies = () => {
    setLoading(true);
    
    const allCompanies = getCompaniesByRegion(canton);
    const companyList = allCompanies.length > 0 ? allCompanies : DEMO_COMPANIES;
    
    // Apply filters
    let filtered = companyList.filter((company: any) => {
      if (filters.minRating !== "0" && company.rating < parseFloat(filters.minRating)) return false;
      if (filters.priceLevel !== "all" && company.price_level !== filters.priceLevel) return false;
      if (filters.services.length > 0) {
        const companyServices = company.services_offered || [];
        const hasService = filters.services.some(s => companyServices.includes(s));
        if (!hasService) return false;
      }
      return true;
    });

    // Sort
    if (filters.sortBy === "rating") {
      filtered.sort((a: any, b: any) => b.rating - a.rating);
    } else if (filters.sortBy === "reviews") {
      filtered.sort((a: any, b: any) => (b.review_count || 0) - (a.review_count || 0));
    } else if (filters.sortBy === "price-low") {
      filtered.sort((a: any, b: any) => (a.price_level === "günstig" ? -1 : b.price_level === "günstig" ? 1 : 0));
    }

    setCompanies(filtered);
    setLoading(false);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters({ ...newFilters, region: canton });
  };

  const handleReset = () => {
    setFilters({
      region: canton,
      services: [],
      priceLevel: "all",
      minRating: "0",
      sortBy: "recommended",
    });
  };

  const sponsoredCompanies = companies.filter((c: any) => c.sponsored || c.is_featured);
  const organicCompanies = companies.filter((c: any) => !c.sponsored && !c.is_featured);
  const totalCompanies = companies.length;

  // Schema markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://umzugscheck.ch" },
          { "@type": "ListItem", "position": 2, "name": "Umzugsfirmen", "item": "https://umzugscheck.ch/umzugsfirmen" },
          { "@type": "ListItem", "position": 3, "name": displayName, "item": seoData.canonical },
        ]
      },
      {
        "@type": "ItemList",
        "name": `Umzugsfirmen in ${displayName}`,
        "itemListOrder": "https://schema.org/ItemListOrderDescending",
        "numberOfItems": totalCompanies,
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonical} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:url" content={seoData.canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-6 pb-12">
        <div className="container mx-auto px-4">
          <Breadcrumbs 
            items={[
              { label: "Home", href: "/" },
              { label: "Umzugsfirmen", href: "/umzugsfirmen" },
              { label: displayName },
            ]} 
          />
          
          <div className="max-w-4xl mx-auto text-center mt-8">
            <Badge variant="outline" className="mb-4 text-primary border-primary">
              <MapPin className="w-3 h-3 mr-1" />
              Kanton {displayName}
            </Badge>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Umzugsfirmen in <span className="text-primary">{displayName}</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Vergleichen Sie {totalCompanies}+ geprüfte Umzugsfirmen im Kanton {displayName}. 
              Echte Bewertungen, transparente Preise, kostenlose Offerten.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="font-semibold">{totalCompanies}+ Firmen</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">Ø 4.7 Bewertung</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="font-semibold">100% Geprüft</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="hidden md:block">
            <RankingFilters 
              filters={filters} 
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>
          <div className="md:hidden">
            <MobileFilterSheet 
              filters={filters} 
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>
        </div>
      </section>

      {/* Company Listings */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid gap-4 md:gap-6">
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="h-48 animate-pulse bg-muted" />
              ))}
            </div>
          ) : (
            <>
              {/* Sponsored Companies */}
              {sponsoredCompanies.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Empfohlene Partner
                  </h2>
                  <div className="grid gap-4 md:gap-6">
                    {sponsoredCompanies.map((company: any, index: number) => (
                      <ScrollReveal key={company.id} delay={index * 0.1}>
                        <SponsoredCompanyCard
                          id={company.id}
                          name={company.name}
                          logo={company.logo_url || company.logo}
                          rating={company.rating}
                          reviewCount={company.review_count || 0}
                          regions={company.cantons_served || [displayName]}
                          description={company.short_description || company.description || ""}
                          specialOffer={company.discount_offer}
                          priceLevel={company.price_level}
                        />
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              )}

              {/* Organic Companies */}
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Alle Umzugsfirmen in {displayName}
                </h2>
                <div className="grid gap-4 md:gap-6">
                  {organicCompanies.map((company: any, index: number) => (
                    <ScrollReveal key={company.id} delay={index * 0.05}>
                      <OrganicCompanyCard
                        id={company.id}
                        name={company.name}
                        logo={company.logo_url || company.logo}
                        rating={company.rating}
                        reviewCount={company.review_count || 0}
                        regions={company.cantons_served || [displayName]}
                        description={company.short_description || company.description || ""}
                        priceLevel={company.price_level}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              </div>

              {organicCompanies.length === 0 && sponsoredCompanies.length === 0 && (
                <Card className="p-12 text-center">
                  <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Keine Firmen gefunden</h3>
                  <p className="text-muted-foreground mb-4">
                    Passen Sie Ihre Filter an oder schauen Sie sich Firmen in anderen Kantonen an.
                  </p>
                  <Button asChild>
                    <Link to="/umzugsfirmen">Alle Firmen anzeigen</Link>
                  </Button>
                </Card>
              )}
            </>
          )}
        </div>
      </section>

      {/* Related Canton Links */}
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Weitere Regionen in der Nähe
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {SWISS_CANTONS.filter(c => c !== canton).slice(0, 8).map(c => (
              <Button key={c} variant="outline" size="sm" asChild>
                <Link to={`/umzugsfirmen/${c}`}>
                  {getCantonDisplayName(c)}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Bereit für Ihren Umzug in {displayName}?
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Erhalten Sie jetzt kostenlose Offerten von den besten Umzugsfirmen im Kanton {displayName}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to={`/umzugsofferten/${canton}`}>
                Offerten erhalten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
              <Link to={`/beste-umzugsfirma/${canton}`}>
                Beste Firmen in {displayName}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <StickyMobileCTA />
    </div>
  );
}
