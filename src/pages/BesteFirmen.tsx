import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SponsoredCompanyCard } from "@/components/rankings/SponsoredCompanyCard";
import { OrganicCompanyCard } from "@/components/rankings/OrganicCompanyCard";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Trophy, Star, Shield, Award } from "lucide-react";

export default function BesteFirmen() {
  const { region } = useParams();
  
  const pageTitle = region 
    ? `Die besten Umzugsfirmen in ${region} (2025)` 
    : "Die besten Umzugsfirmen in der Schweiz (2025)";
  
  const pageDescription = region
    ? `Vergleichen Sie die top-bewerteten Umzugsfirmen in ${region}. Basierend auf echten Kundenbewertungen, Preis-Leistung und Servicequalität.`
    : "Die besten Umzugsfirmen der Schweiz im Vergleich. Basierend auf Kundenbewertungen, Preis-Leistung und Servicequalität.";

  // Mock data - sponsored companies (would come from database with is_featured flag)
  const sponsoredCompanies = [
    {
      id: "1",
      name: "SwissMove Premium",
      logo: "/lovable-uploads/d4aa8c36-01f9-47b7-8e18-bd2a8e22467a.png",
      rating: 4.9,
      reviewCount: 234,
      regions: ["Zürich", "Bern", "Basel"],
      description: "Premium-Umzugsservice mit 15 Jahren Erfahrung. Spezialisiert auf stressfreie Umzüge mit Rundum-Service.",
      specialOffer: "Spezialrabatt für Umzugscheck-Kunden: 10% auf alle Services",
      priceLevel: "Premium",
    },
    {
      id: "2",
      name: "Züri-Umzüge Express",
      rating: 4.8,
      reviewCount: 189,
      regions: ["Zürich", "Zug", "Winterthur"],
      description: "Schneller und zuverlässiger Umzugsservice. Über 500 erfolgreiche Umzüge pro Jahr.",
      specialOffer: "Kostenlose Umzugskartons bei Buchung über Umzugscheck",
      priceLevel: "Fair",
    },
    {
      id: "3",
      name: "Alpen-Umzüge AG",
      rating: 4.7,
      reviewCount: 156,
      regions: ["Bern", "Luzern", "Thun"],
      description: "Familiengeführtes Unternehmen mit persönlichem Service. Spezialist für Privatumzüge.",
      priceLevel: "Günstig",
    },
  ];

  // Mock data - organic ranking (would come from database sorted by rating/reviews)
  const organicCompanies = [
    {
      id: "4",
      rank: 4,
      name: "Basel-Move Professional",
      rating: 4.9,
      reviewCount: 201,
      regions: ["Basel", "Solothurn", "Aargau"],
      description: "Professionelle Umzüge mit modernster Ausstattung. Spezialisiert auf Büro- und Privatumzüge.",
      priceLevel: "Fair",
      savingsPercentage: 25,
      verified: true,
    },
    {
      id: "5",
      rank: 5,
      name: "Luzerner Umzugsteam",
      rating: 4.8,
      reviewCount: 178,
      regions: ["Luzern", "Zug", "Uri"],
      description: "Erfahrenes Team mit über 10 Jahren Markterfahrung. Faire Preise und flexible Termine.",
      priceLevel: "Günstig",
      savingsPercentage: 30,
      verified: true,
    },
    {
      id: "6",
      rank: 6,
      name: "St. Gallen Umzugsservice",
      rating: 4.7,
      reviewCount: 145,
      regions: ["St. Gallen", "Thurgau", "Appenzell"],
      description: "Regionaler Umzugsservice mit persönlicher Betreuung. Spezialist für Ostschweiz.",
      priceLevel: "Fair",
      verified: false,
    },
    {
      id: "7",
      rank: 7,
      name: "Winterthur Express Umzüge",
      rating: 4.7,
      reviewCount: 132,
      regions: ["Winterthur", "Zürich", "Schaffhausen"],
      description: "Schnelle und unkomplizierte Umzüge. Spezialisiert auf kurzfristige Termine.",
      priceLevel: "Günstig",
      savingsPercentage: 20,
      verified: true,
    },
    {
      id: "8",
      rank: 8,
      name: "Aargau Movers",
      rating: 4.6,
      reviewCount: 118,
      regions: ["Aargau", "Zürich", "Solothurn"],
      description: "Zuverlässiger Umzugspartner mit transparenten Preisen. Über 300 Umzüge pro Jahr.",
      priceLevel: "Fair",
      verified: false,
    },
  ];

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
                <div className="grid gap-6">
                  {sponsoredCompanies.map((company) => (
                    <SponsoredCompanyCard key={company.id} {...company} />
                  ))}
                </div>
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
                <div className="space-y-4">
                  {organicCompanies.map((company) => (
                    <OrganicCompanyCard key={company.id} {...company} />
                  ))}
                </div>
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
