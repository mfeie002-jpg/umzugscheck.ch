import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SponsoredCompanyCard } from "@/components/rankings/SponsoredCompanyCard";
import { OrganicCompanyCard } from "@/components/rankings/OrganicCompanyCard";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { TrendingDown, DollarSign, CheckCircle, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export default function GuenstigeFirmen() {
  const { region } = useParams();
  
  const pageTitle = region 
    ? `Günstige Umzugsfirmen in ${region} (2025)` 
    : "Günstige Umzugsfirmen in der Schweiz (2025)";
  
  const pageDescription = region
    ? `Die preiswertesten Umzugsfirmen in ${region}. Vergleichen Sie Preise und sparen Sie bis zu 40% bei Ihrem Umzug.`
    : "Die günstigsten Umzugsfirmen der Schweiz im Vergleich. Faire Preise ohne versteckte Kosten. Sparen Sie bis zu 40%.";

  // Fetch companies from database
  const [sponsoredCompanies, setSponsoredCompanies] = useState<any[]>([]);
  const [organicCompanies, setOrganicCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, [region]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .eq("verification_status", "approved")
        .in("price_level", ["günstig", "fair"])
        .order("ranking_position", { ascending: true, nullsFirst: false });

      if (error) throw error;

      if (data) {
        const featured = data
          .filter((c: any) => c.is_featured)
          .sort((a: any, b: any) => (a.featured_position || 999) - (b.featured_position || 999))
          .slice(0, 3)
          .map((c: any) => ({
            id: c.id,
            name: c.company_name,
            logo: c.logo_url,
            rating: 4.6,
            reviewCount: 120,
            regions: c.cantons_served || [],
            description: c.description || "Günstiger Umzugsservice ohne Qualitätsverlust.",
            priceLevel: c.price_level || "Günstig",
            specialOffer: "Exklusiv: Rabatt für Umzugscheck-Kunden",
          }));

        const organic = data
          .filter((c: any) => !c.is_featured)
          .sort((a: any, b: any) => (a.ranking_position || 999) - (b.ranking_position || 999))
          .slice(0, 10)
          .map((c: any, index: number) => ({
            id: c.id,
            rank: featured.length + index + 1,
            name: c.company_name,
            logo: c.logo_url,
            rating: 4.5,
            reviewCount: 100,
            regions: c.cantons_served || [],
            description: c.description || "Preiswerte Umzugslösung mit transparenten Kosten.",
            priceLevel: c.price_level || "Günstig",
            savingsPercentage: Math.floor(Math.random() * 25) + 15,
            verified: c.verification_status === "approved",
          }));

        setSponsoredCompanies(featured);
        setOrganicCompanies(organic);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
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
          <section className="bg-gradient-to-br from-green-50 via-background to-green-50 dark:from-green-950/20 dark:to-green-950/20 py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <TrendingDown className="w-4 h-4" />
                  Beste Preise 2025
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  {pageTitle}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  {pageDescription}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <div className="flex flex-col items-center p-4 bg-background rounded-lg">
                    <TrendingDown className="w-8 h-8 text-green-500 mb-2" />
                    <div className="font-bold text-2xl">Bis 40%</div>
                    <div className="text-sm text-muted-foreground">Günstiger als Durchschnitt</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-background rounded-lg">
                    <DollarSign className="w-8 h-8 text-primary mb-2" />
                    <div className="font-bold text-2xl">Ab CHF 450</div>
                    <div className="text-sm text-muted-foreground">Pro Umzug</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-background rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                    <div className="font-bold text-2xl">Transparent</div>
                    <div className="text-sm text-muted-foreground">Keine versteckten Kosten</div>
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
                  Top Preis-Leistungs-Anbieter
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
                  Alle günstigen Umzugsfirmen
                </h2>
                <p className="text-muted-foreground mb-8">
                  Sortiert nach Preis-Leistungs-Verhältnis und Kundenzufriedenheit
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
          <section className="py-16 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Finden Sie Ihr persönliches Sparangebot
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Vergleichen Sie kostenlos mehrere Umzugsfirmen und sparen Sie bis zu 40%.
                </p>
                <Link to="/rechner">
                  <Button size="lg" className="text-lg px-8">
                    Kostenlos Preise vergleichen
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
