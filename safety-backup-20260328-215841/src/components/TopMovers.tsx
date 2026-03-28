import { Star, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const topCompanies = [
  {
    id: 1,
    name: "ZüriUmzug AG",
    logo: "🚛",
    rating: 4.9,
    reviews: 245,
    location: "Zürich",
    services: ["Privatumzug", "Büroumzug", "Reinigung"],
    priceLevel: "CHF CHF",
    verified: true,
    description: "Professionelle Umzüge in der ganzen Schweiz seit 1998"
  },
  {
    id: 2,
    name: "Berner Zügelprofi",
    logo: "📦",
    rating: 4.8,
    reviews: 189,
    location: "Bern",
    services: ["Privatumzug", "Einlagerung", "Entsorgung"],
    priceLevel: "CHF CHF CHF",
    verified: true,
    description: "Ihr Partner für stressfreie Umzüge im Raum Bern"
  },
  {
    id: 3,
    name: "Basel Express Move",
    logo: "🏠",
    rating: 4.7,
    reviews: 156,
    location: "Basel",
    services: ["Privatumzug", "Verpackung", "Montage"],
    priceLevel: "CHF CHF",
    verified: true,
    description: "Schnell, sicher und zuverlässig – Ihr Umzug in Basel"
  },
  {
    id: 4,
    name: "Swiss Move Solutions",
    logo: "🚚",
    rating: 4.9,
    reviews: 312,
    location: "Schweizweit",
    services: ["Privatumzug", "Büroumzug", "International"],
    priceLevel: "CHF CHF CHF",
    verified: true,
    description: "Schweizweite Umzugslösungen mit Premium-Service"
  },
  {
    id: 5,
    name: "Luzerner Transportteam",
    logo: "📍",
    rating: 4.8,
    reviews: 178,
    location: "Luzern",
    services: ["Privatumzug", "Klaviertransport", "Reinigung"],
    priceLevel: "CHF CHF",
    verified: true,
    description: "Spezialisiert auf anspruchsvolle Umzüge"
  },
  {
    id: 6,
    name: "Genève Déménagement",
    logo: "🎯",
    rating: 4.7,
    reviews: 203,
    location: "Genève",
    services: ["Privatumzug", "Büroumzug", "Einlagerung"],
    priceLevel: "CHF CHF CHF",
    verified: true,
    description: "Service de déménagement professionnel à Genève"
  }
];

export const TopMovers = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5">
            Top bewertet
          </Badge>
          <h2 className="mb-4">Die besten Umzugsfirmen der Schweiz</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Alle Unternehmen sind geprüft, versichert und von echten Kunden bewertet.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {topCompanies.map((company) => (
            <Card key={company.id} className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-2xl">
                        {company.logo}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{company.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{company.location}</span>
                        </div>
                      </div>
                    </div>
                    {company.verified && (
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(company.rating)
                              ? "fill-accent text-accent"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-sm">{company.rating}</span>
                    <span className="text-sm text-muted-foreground">({company.reviews} Bewertungen)</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {company.description}
                  </p>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1.5">
                    {company.services.map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>

                  {/* Price Level */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Preisniveau: </span>
                      <span className="font-medium text-primary">{company.priceLevel}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                    variant="outline"
                  >
                    Offerte anfragen
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="shadow-medium">
            Alle Umzugsfirmen anzeigen
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
