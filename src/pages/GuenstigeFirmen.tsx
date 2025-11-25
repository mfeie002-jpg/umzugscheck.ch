import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SponsoredCompanyCard } from "@/components/rankings/SponsoredCompanyCard";
import { OrganicCompanyCard } from "@/components/rankings/OrganicCompanyCard";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { TrendingDown, DollarSign, CheckCircle, Award } from "lucide-react";

export default function GuenstigeFirmen() {
  const { region } = useParams();
  
  const pageTitle = region 
    ? `Günstige Umzugsfirmen in ${region} (2025)` 
    : "Günstige Umzugsfirmen in der Schweiz (2025)";
  
  const pageDescription = region
    ? `Die preiswertesten Umzugsfirmen in ${region}. Vergleichen Sie Preise und sparen Sie bis zu 40% bei Ihrem Umzug.`
    : "Die günstigsten Umzugsfirmen der Schweiz im Vergleich. Faire Preise ohne versteckte Kosten. Sparen Sie bis zu 40%.";

  // Mock data - sponsored companies with focus on price
  const sponsoredCompanies = [
    {
      id: "11",
      name: "Budget-Move Zürich",
      rating: 4.6,
      reviewCount: 167,
      regions: ["Zürich", "Winterthur", "Zug"],
      description: "Günstige Umzüge ohne Qualitätsverlust. Transparente Preisgestaltung und keine versteckten Kosten.",
      specialOffer: "Exklusiv: 15% Rabatt für Umzugscheck-Kunden",
      priceLevel: "Günstig",
    },
    {
      id: "12",
      name: "Spar-Umzüge Schweiz",
      rating: 4.5,
      reviewCount: 143,
      regions: ["Bern", "Fribourg", "Solothurn"],
      description: "Preiswerte Umzugslösungen für alle Budgets. Über 8 Jahre Erfahrung im günstigen Umzugssegment.",
      specialOffer: "Gratis Packservice bei Buchung im Februar",
      priceLevel: "Günstig",
    },
    {
      id: "13",
      name: "Express Budget Movers",
      rating: 4.4,
      reviewCount: 128,
      regions: ["Basel", "Aargau", "Zürich"],
      description: "Schnelle und kostengünstige Umzüge. Spezialisiert auf kleine bis mittlere Umzüge.",
      priceLevel: "Günstig",
    },
  ];

  // Mock data - organic ranking focused on budget options
  const organicCompanies = [
    {
      id: "14",
      rank: 4,
      name: "Luzern Budget Umzüge",
      rating: 4.6,
      reviewCount: 134,
      regions: ["Luzern", "Zug", "Nidwalden"],
      description: "Faire Preise und zuverlässiger Service. Spezialisiert auf Privatumzüge mit kleinem Budget.",
      priceLevel: "Günstig",
      savingsPercentage: 35,
      verified: true,
    },
    {
      id: "15",
      rank: 5,
      name: "Ostschweiz Spar-Movers",
      rating: 4.5,
      reviewCount: 118,
      regions: ["St. Gallen", "Thurgau", "Appenzell"],
      description: "Regionale Umzugsfirma mit bestem Preis-Leistungs-Verhältnis. Keine Zusatzkosten.",
      priceLevel: "Günstig",
      savingsPercentage: 40,
      verified: true,
    },
    {
      id: "16",
      rank: 6,
      name: "Aargau Budget Transport",
      rating: 4.4,
      reviewCount: 102,
      regions: ["Aargau", "Solothurn", "Zürich"],
      description: "Kosteneffiziente Umzugslösungen. Transparent und ohne versteckte Gebühren.",
      priceLevel: "Günstig",
      savingsPercentage: 30,
      verified: false,
    },
    {
      id: "17",
      rank: 7,
      name: "Winterthur Economy Moves",
      rating: 4.4,
      reviewCount: 95,
      regions: ["Winterthur", "Zürich", "Schaffhausen"],
      description: "Preiswerte Umzüge für Studenten und Familien. Flexible Zahlungsoptionen verfügbar.",
      priceLevel: "Günstig",
      savingsPercentage: 32,
      verified: true,
    },
    {
      id: "18",
      rank: 8,
      name: "Ticino Budget Movers",
      rating: 4.3,
      reviewCount: 87,
      regions: ["Tessin", "Graubünden", "Uri"],
      description: "Günstige Umzugslösungen für die Südschweiz. Mehrsprachiger Service.",
      priceLevel: "Günstig",
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
                  Alle günstigen Umzugsfirmen
                </h2>
                <p className="text-muted-foreground mb-8">
                  Sortiert nach Preis-Leistungs-Verhältnis und Kundenzufriedenheit
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
