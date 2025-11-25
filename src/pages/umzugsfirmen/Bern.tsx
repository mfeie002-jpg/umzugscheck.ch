import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";

const Bern = () => {
  const dummyCompanies = [
    {
      id: 1,
      name: "Berner Umzugsprofis AG",
      location: "Bern",
      rating: 4.7,
      reviews: 142,
      description: "Ihr zuverlässiger Partner für Umzüge in und um Bern",
      services: ["Privatumzug", "Firmenumzug", "Reinigung", "Lagerung"],
      priceLevel: "fair"
    },
    {
      id: 2,
      name: "Hauptstadt Movers",
      location: "Bern",
      rating: 4.9,
      reviews: 187,
      description: "Seit über 20 Jahren Ihr Umzugspartner in Bern",
      services: ["Privatumzug", "Einpackservice", "Montage"],
      priceLevel: "fair"
    },
    {
      id: 3,
      name: "Budget Umzüge Bern",
      location: "Bern",
      rating: 4.5,
      reviews: 76,
      description: "Günstig und zuverlässig durch die Bundesstadt",
      services: ["Privatumzug", "Studenten-Umzug"],
      priceLevel: "günstig"
    }
  ];

  return (
    <>
      <SEOHead
        title="Umzugsfirmen in Bern vergleichen - Offerten einholen | Umzugscheck.ch"
        description="Finden Sie die besten Umzugsfirmen in Bern. Vergleichen Sie Preise, Bewertungen und Services. Kostenlose & unverbindliche Offerten."
        keywords="umzugsfirma bern, umzug bern, bern umziehen, umzugsofferte bern"
        canonical="https://umzugscheck.ch/umzugsfirmen/bern"
      />
      
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1">
          <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Bern</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Umzugsfirmen in Bern
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Als Bundesstadt bietet Bern historischen Charme mit modernem Wohnen. 
                  Die Altstadt mit ihren engen Gassen erfordert erfahrene Umzugsprofis.
                </p>
                
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Eine Anfrage – mehrere Umzugsofferten für Bern</h3>
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
                <h2 className="text-3xl font-bold mb-8">Umzugsfirmen in Bern</h2>
                
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
                <h2 className="text-3xl font-bold mb-6">Was kostet ein Umzug in Bern?</h2>
                <p className="text-muted-foreground mb-4">
                  Umzugskosten in Bern liegen im Schweizer Mittelfeld. Typische Preisbereiche:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>1-2 Zimmer Wohnung: CHF 1000-1800</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>3-4 Zimmer Wohnung: CHF 1800-3200</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>Einfamilienhaus: CHF 3200-5500+</span>
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
                  <Link to="/umzugsfirmen/basel"><Button variant="outline">Basel</Button></Link>
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

export default Bern;
