import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

const topCompanies = [
  {
    id: "1",
    name: "Zügelprofi AG",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&auto=format&fit=crop",
    teamImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 287,
    priceRange: "Ab CHF 850",
    badges: ["Top bewertet", "Express verfügbar"],
    location: "Zürich",
    teamSize: "15+ Mitarbeiter"
  },
  {
    id: "2",
    name: "SwissMove GmbH",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&auto=format&fit=crop",
    teamImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 195,
    priceRange: "Ab CHF 780",
    badges: ["Beliebt", "Versichert"],
    location: "Bern",
    teamSize: "20+ Mitarbeiter"
  },
  {
    id: "3",
    name: "Umzugsteam Basel",
    logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=200&h=200&auto=format&fit=crop",
    teamImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 142,
    priceRange: "Ab CHF 920",
    badges: ["Top bewertet", "Versichert"],
    location: "Basel",
    teamSize: "12+ Mitarbeiter"
  },
];

export const TopCompaniesWithLogos = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-happy-teal/10 to-primary-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Top Umzugsfirmen in der Schweiz
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Von Kunden empfohlen, von uns geprüft – echte Teams, echte Qualität
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
          {topCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-border group"
            >
              {/* Team Image with People */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={company.teamImage}
                  alt={`${company.name} Team`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Company Logo Overlay */}
                <div className="absolute bottom-3 left-3 bg-white rounded-xl p-2 shadow-lg">
                  <img
                    src={company.logo}
                    alt={`${company.name} Logo`}
                    className="w-16 h-16 object-contain"
                  />
                </div>

                <div className="absolute top-3 right-3 flex gap-2">
                  {company.badges.slice(0, 2).map((badge, idx) => (
                    <Badge key={idx} className="bg-happy-yellow text-foreground font-semibold shadow-md">
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
                  <div className="flex items-center gap-4 text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-happy-yellow text-happy-yellow" />
                      <span className="font-bold">{company.rating}</span>
                      <span className="text-muted-foreground">({company.reviewCount})</span>
                    </div>
                    <span className="text-muted-foreground">{company.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{company.teamSize}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-border">
                  <span className="text-lg font-bold text-primary">
                    {company.priceRange}
                  </span>
                  <Shield className="h-5 w-5 text-success" />
                </div>

                <Link to="/umzugsofferten" className="no-underline">
                  <Button className="w-full bg-gradient-to-r from-accent to-happy-coral hover:from-accent-dark hover:to-accent text-white shadow-md">
                    Offerte anfragen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/firmen" className="no-underline">
            <Button size="lg" variant="outline" className="text-base px-8 border-2 hover:bg-primary hover:text-primary-foreground">
              Alle Umzugsfirmen anzeigen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
