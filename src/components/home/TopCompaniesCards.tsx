import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const topCompanies = [
  {
    id: "1",
    name: "Zügelprofi AG",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 287,
    priceRange: "Ab CHF 850",
    badges: ["Top bewertet", "Express verfügbar"],
    location: "Zürich"
  },
  {
    id: "2",
    name: "SwissMove GmbH",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 195,
    priceRange: "Ab CHF 780",
    badges: ["Beliebt", "Versichert"],
    location: "Bern"
  },
  {
    id: "3",
    name: "Umzugsteam Basel",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&q=80&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 142,
    priceRange: "Ab CHF 920",
    badges: ["Top bewertet", "Versichert"],
    location: "Basel"
  },
];

export const TopCompaniesCards = () => {
  return (
    <section className="py-16 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Top Umzugsfirmen
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ausgewählt von tausenden zufriedenen Kunden
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
          {topCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-border group"
            >
              {/* Company Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={company.image}
                  alt={company.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  {company.badges.slice(0, 2).map((badge, idx) => (
                    <Badge key={idx} className="bg-white/90 text-foreground">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Company Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {company.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{company.rating}</span>
                      <span className="text-muted-foreground">({company.reviewCount})</span>
                    </div>
                    <span className="text-muted-foreground">{company.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-border">
                  <span className="text-lg font-bold text-primary">
                    {company.priceRange}
                  </span>
                  <Shield className="h-5 w-5 text-success" />
                </div>

                <Link to="/umzugsofferten">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Offerte anfragen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/firmen">
            <Button size="lg" variant="outline" className="text-base px-8">
              Alle 20 Umzugsfirmen anzeigen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
