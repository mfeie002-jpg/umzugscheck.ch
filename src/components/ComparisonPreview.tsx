import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, CheckCircle2, ArrowRight } from "lucide-react";

const exampleCompanies = [
  {
    id: "1",
    name: "SwissMove Pro",
    logo: "🚚",
    rating: 4.9,
    reviews: 234,
    priceLevel: "CHF 850-1200/Tag",
    services: ["Umzug", "Reinigung", "Entsorgung"],
    region: "Zürich & Umgebung",
    verified: true
  },
  {
    id: "2",
    name: "Alpen Transporte",
    logo: "🏔️",
    rating: 4.7,
    reviews: 187,
    priceLevel: "CHF 900-1350/Tag",
    services: ["Umzug", "Montage", "Lagerung"],
    region: "Bern & Mittelland",
    verified: true
  },
  {
    id: "3",
    name: "City Movers GmbH",
    logo: "🏙️",
    rating: 4.8,
    reviews: 312,
    priceLevel: "CHF 800-1150/Tag",
    services: ["Umzug", "Packservice", "Reinigung"],
    region: "Basel-Stadt",
    verified: true
  }
];

export const ComparisonPreview = () => {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/15 text-accent px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4 border border-accent/20">
            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Intelligent vergleichen & sparen</span>
          </div>
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Intelligenter Vergleich – auf jeden Kanton zugeschnitten
          </h2>
          <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto px-4">
            <span className="font-semibold text-foreground">KI-gestützte Sortierung</span> für perfekte Resultate – 
            vergleichen Sie Preise, Bewertungen und Services für Ihre Region
          </p>
        </div>

        {/* Comparison Table - Desktop */}
        <div className="hidden lg:block max-w-6xl mx-auto mb-8">
          <div className="bg-white rounded-2xl border border-border shadow-strong overflow-hidden">
            <table className="w-full" role="table" aria-label="Vergleich von Umzugsfirmen">
              <thead>
                <tr className="bg-secondary">
                  <th scope="col" className="px-6 py-4 text-left font-semibold text-foreground">Firma</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold text-foreground">Bewertung</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold text-foreground">Preisniveau</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold text-foreground">Services</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold text-foreground">Region</th>
                  <th scope="col" className="px-6 py-4 text-center font-semibold text-foreground">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {exampleCompanies.map((company, index) => (
                  <tr 
                    key={company.id} 
                    className="border-t border-border hover:bg-secondary/10 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl">
                          {company.logo}
                        </div>
                        <div>
                          <div className="font-semibold flex items-center gap-2 text-foreground">
                            {company.name}
                            {company.verified && (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-accent text-accent" aria-hidden="true" />
                        <span className="font-semibold text-foreground">{company.rating}</span>
                        <span className="text-sm text-foreground/60">
                          ({company.reviews} <span className="sr-only">Bewertungen</span>)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="secondary" className="font-semibold">
                        {company.priceLevel}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        {company.services.map((service, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1 text-sm text-foreground/70">
                        <MapPin className="w-4 h-4" aria-hidden="true" />
                        <span>{company.region}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <Link to="/umzugsofferten" aria-label={`Offerte von ${company.name} anfordern`}>
                        <Button size="sm" className="shadow-accent">
                          Offerte
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comparison Cards - Mobile */}
        <div className="lg:hidden grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {exampleCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-medium transition-shadow">
              <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl">
                      {company.logo}
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-2 text-foreground">
                        {company.name}
                        {company.verified && (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 fill-accent text-accent" aria-hidden="true" />
                        <span className="font-semibold text-sm text-foreground">{company.rating}</span>
                        <span className="text-xs text-foreground/60">
                          ({company.reviews} <span className="sr-only">Bewertungen</span>)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-foreground/60 mb-1">Preisniveau</div>
                    <Badge variant="secondary" className="font-semibold">
                      {company.priceLevel}
                    </Badge>
                  </div>

                  <div>
                    <div className="text-xs text-foreground/60 mb-1">Services</div>
                    <div className="flex flex-wrap gap-1">
                      {company.services.map((service, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-foreground/60 mb-1">Region</div>
                    <div className="flex items-center gap-1 text-sm text-foreground">
                      <MapPin className="w-4 h-4" aria-hidden="true" />
                      <span>{company.region}</span>
                    </div>
                  </div>
                </div>

                <Link to="/umzugsofferten" className="block" aria-label={`Offerte von ${company.name} anfordern`}>
                  <Button className="w-full shadow-accent">
                    Offerte anfragen
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-foreground/70 mb-6 font-medium">
            Über 150 geprüfte Umzugsfirmen warten auf Ihre Anfrage
          </p>
          <Link to="/firmen" aria-label="Alle Umzugsfirmen vergleichen">
            <Button size="lg" variant="outline" className="group">
              Alle Umzugsfirmen vergleichen
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
