import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";

const Basel = () => {
  const dummyCompanies = [
    {
      id: 1,
      name: "Basel Umzüge Express",
      location: "Basel",
      rating: 4.8,
      reviews: 165,
      description: "Grenzüberschreitende Umzüge und lokale Services",
      services: ["Privatumzug", "Firmenumzug", "Auslandsumzug", "Lagerung"],
      priceLevel: "fair"
    },
    {
      id: 2,
      name: "Rhein Movers Basel",
      location: "Basel",
      rating: 4.6,
      reviews: 128,
      description: "Kompetent und zuverlässig am Rheinknie",
      services: ["Privatumzug", "Reinigung", "Montage"],
      priceLevel: "fair"
    },
    {
      id: 3,
      name: "Basel Budget Umzug",
      location: "Basel",
      rating: 4.4,
      reviews: 92,
      description: "Preiswerte Umzüge in Basel-Stadt und Basel-Land",
      services: ["Privatumzug", "Studenten-Umzug"],
      priceLevel: "günstig"
    }
  ];

  return (
    <>
      <SEOHead
        title="Umzugsfirmen in Basel vergleichen - Offerten einholen | Umzugscheck.ch"
        description="Finden Sie die besten Umzugsfirmen in Basel. Vergleichen Sie Preise, Bewertungen und Services. Kostenlose & unverbindliche Offerten."
        keywords="umzugsfirma basel, umzug basel, basel umziehen, umzugsofferte basel"
        canonical="https://umzugscheck.ch/umzugsfirmen/basel"
      />
      
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1">
          <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Basel</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Umzugsfirmen in Basel
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Basel als Dreiländereck bietet besondere Herausforderungen und Möglichkeiten. 
                  Hier finden Sie Experten für lokale und grenzüberschreitende Umzüge.
                </p>
                
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Eine Anfrage – mehrere Umzugsofferten für Basel</h3>
                        <p className="text-sm text-muted-foreground">
                          Kostenlos & unverbindlich. Bis zu 5 Angebote von geprüften Firmen.
                        </p>
                      </div>
                      <Link to="/offerte">
                        <Button size="lg" className="whitespace-nowrap">
                          Offerte anfordern
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Umzugsfirmen in Basel</h2>
                
                <div className="grid gap-6">
                  {dummyCompanies.map((company) => (
                    <Card key={company.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2 mb-2">
                              {company.name}
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <MapPin className="w-4 h-4" />
                              {company.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-primary text-primary" />
                                <span className="font-semibold">{company.rating}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                ({company.reviews} Bewertungen)
                              </span>
                              <Badge variant="secondary">{company.priceLevel}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{company.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {company.services.map((service) => (
                            <Badge key={service} variant="outline">
                              {service}
                            </Badge>
                          ))}
                        </div>
                        <Link to="/offerte">
                          <Button className="w-full">
                            Offerte anfragen
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-secondary/20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Was kostet ein Umzug in Basel?</h2>
                <p className="text-muted-foreground mb-4">
                  Umzugskosten in Basel liegen im oberen Mittelfeld. Typische Preisbereiche:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>1-2 Zimmer Wohnung: CHF 1100-1900</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>3-4 Zimmer Wohnung: CHF 1900-3300</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>Einfamilienhaus: CHF 3300-5800+</span>
                  </li>
                </ul>
                <Link to="/preise">
                  <Button variant="outline">Alle Preise ansehen</Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Umzugsfirmen in anderen Städten</h2>
                <div className="flex flex-wrap gap-3">
                  <Link to="/umzugsfirmen/zuerich"><Button variant="outline">Zürich</Button></Link>
                  <Link to="/umzugsfirmen/bern"><Button variant="outline">Bern</Button></Link>
                  <Link to="/umzugsfirmen/luzern"><Button variant="outline">Luzern</Button></Link>
                  <Link to="/umzugsfirmen/winterthur"><Button variant="outline">Winterthur</Button></Link>
                  <Link to="/umzugsfirmen/st-gallen"><Button variant="outline">St. Gallen</Button></Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Basel;
