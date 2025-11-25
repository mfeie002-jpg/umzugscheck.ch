import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";

const Winterthur = () => {
  const dummyCompanies = [
    {
      id: 1,
      name: "Winterthur Umzüge Pro",
      location: "Winterthur",
      rating: 4.7,
      reviews: 112,
      description: "Zuverlässige Umzüge in der Eulachstadt",
      services: ["Privatumzug", "Firmenumzug", "Reinigung"],
      priceLevel: "fair"
    },
    {
      id: 2,
      name: "Winti Movers",
      location: "Winterthur",
      rating: 4.6,
      reviews: 89,
      description: "Ihr lokaler Partner für stressfreie Umzüge",
      services: ["Privatumzug", "Einpackservice", "Lagerung"],
      priceLevel: "fair"
    },
    {
      id: 3,
      name: "Budget Zügelservice Winterthur",
      location: "Winterthur",
      rating: 4.4,
      reviews: 54,
      description: "Günstig und professionell umziehen",
      services: ["Privatumzug", "Studenten-Umzug"],
      priceLevel: "günstig"
    }
  ];

  return (
    <>
      <SEOHead
        title="Umzugsfirmen in Winterthur vergleichen - Offerten einholen | Umzugscheck.ch"
        description="Finden Sie die besten Umzugsfirmen in Winterthur. Vergleichen Sie Preise, Bewertungen und Services. Kostenlose & unverbindliche Offerten."
        keywords="umzugsfirma winterthur, umzug winterthur, winterthur umziehen"
        canonical="https://umzugscheck.ch/umzugsfirmen/winterthur"
      />
      
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1">
          <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Winterthur</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Umzugsfirmen in Winterthur
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Winterthur als sechstgrösste Stadt der Schweiz bietet attraktiven Wohnraum. 
                  Hier finden Sie erfahrene Umzugspartner für die Region.
                </p>
                
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Eine Anfrage – mehrere Umzugsofferten für Winterthur</h3>
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
                <h2 className="text-3xl font-bold mb-8">Umzugsfirmen in Winterthur</h2>
                
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
                <h2 className="text-3xl font-bold mb-6">Was kostet ein Umzug in Winterthur?</h2>
                <p className="text-muted-foreground mb-4">
                  Umzugskosten in Winterthur sind moderat. Typische Preisbereiche:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>1-2 Zimmer Wohnung: CHF 900-1700</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>3-4 Zimmer Wohnung: CHF 1700-3000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>Einfamilienhaus: CHF 3000-5200+</span>
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
                  <Link to="/umzugsfirmen/basel"><Button variant="outline">Basel</Button></Link>
                  <Link to="/umzugsfirmen/luzern"><Button variant="outline">Luzern</Button></Link>
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

export default Winterthur;
