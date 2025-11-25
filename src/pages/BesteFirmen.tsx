import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SponsoredCompanyCard } from "@/components/rankings/SponsoredCompanyCard";
import { OrganicCompanyCard } from "@/components/rankings/OrganicCompanyCard";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Trophy, Star, Shield, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { DEMO_COMPANIES, getCompaniesByRegion } from "@/data/companies";
import { generateRanking } from "@/lib/ranking-algorithm";

export default function BesteFirmen() {
  const { region } = useParams();
  
  const pageTitle = region 
    ? `Die besten Umzugsfirmen in ${region} (2025)` 
    : "Die besten Umzugsfirmen in der Schweiz (2025)";
  
  const pageDescription = region
    ? `Vergleichen Sie die top-bewerteten Umzugsfirmen in ${region}. Basierend auf echten Kundenbewertungen, Preis-Leistung und Servicequalität.`
    : "Die besten Umzugsfirmen der Schweiz im Vergleich. Basierend auf Kundenbewertungen, Preis-Leistung und Servicequalität.";

  // Mock data - sponsored companies (would come from database with is_featured flag)
  const [sponsoredCompanies, setSponsoredCompanies] = useState<any[]>([]);
  const [organicCompanies, setOrganicCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, [region]);

  const fetchCompanies = () => {
    setLoading(true);
    
    // Get companies filtered by region
    const filteredCompanies = region ? getCompaniesByRegion(region) : DEMO_COMPANIES;
    
    // Generate ranking using the algorithm
    const ranked = generateRanking(filteredCompanies, undefined, 'best');
    
    // Format for display components
    const sponsored = ranked
      .filter(c => c.isSponsored)
      .slice(0, 3)
      .map(c => ({
        id: c.id,
        name: c.name,
        logo: undefined,
        rating: c.rating,
        reviewCount: c.review_count,
        regions: c.service_areas,
        description: `Professioneller ${c.services_offered.join(', ')}-Service mit ${c.review_count} Kundenbewertungen.`,
        priceLevel: c.price_level === "günstig" ? "Günstig" : c.price_level === "fair" ? "Fair" : "Premium",
        specialOffer: "Spezialrabatt für Umzugscheck-Kunden",
      }));
    
    const organic = ranked
      .filter(c => !c.isSponsored)
      .map(c => ({
        id: c.id,
        rank: c.rank,
        name: c.name,
        logo: undefined,
        rating: c.rating,
        reviewCount: c.review_count,
        regions: c.service_areas,
        description: `Zuverlässiger ${c.services_offered.slice(0, 2).join(' & ')}-Service in ${c.service_areas[0]}.`,
        priceLevel: c.price_level === "günstig" ? "Günstig" : c.price_level === "fair" ? "Fair" : "Premium",
        savingsPercentage: c.savingsPercentage,
        verified: true,
      }));
    
    setSponsoredCompanies(sponsored);
    setOrganicCompanies(organic);
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle} | Umzugscheck.ch</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/5 via-background to-primary/5 py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Trophy className="w-4 h-4" />
                  Ranking 2025
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  {pageTitle}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  {pageDescription}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <div className="flex flex-col items-center p-4 bg-background rounded-lg">
                    <Star className="w-8 h-8 text-yellow-400 mb-2" />
                    <div className="font-bold text-2xl">4.8/5</div>
                    <div className="text-sm text-muted-foreground">Durchschnittliche Bewertung</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-background rounded-lg">
                    <Shield className="w-8 h-8 text-green-500 mb-2" />
                    <div className="font-bold text-2xl">100%</div>
                    <div className="text-sm text-muted-foreground">Geprüfte Firmen</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-background rounded-lg">
                    <Award className="w-8 h-8 text-primary mb-2" />
                    <div className="font-bold text-2xl">15'000+</div>
                    <div className="text-sm text-muted-foreground">Erfolgreiche Umzüge</div>
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
                      <SponsoredCompanyCard key={company.id} {...company} />
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
                <p className="text-muted-foreground mb-8">
                  Sortiert nach Kundenbewertungen, Servicequalität und Preis-Leistungs-Verhältnis
                </p>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {organicCompanies.map((company) => (
                      <OrganicCompanyCard key={company.id} {...company} />
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
      </div>
    </>
  );
}
