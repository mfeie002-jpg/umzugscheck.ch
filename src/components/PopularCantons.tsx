import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const popularCantons = [
  {
    name: "Zürich",
    slug: "zurich",
    companies: 45,
    avgPrice: "2.500 - 4.200 CHF",
    trending: true,
  },
  {
    name: "Bern",
    slug: "bern",
    companies: 38,
    avgPrice: "2.200 - 3.800 CHF",
    trending: true,
  },
  {
    name: "Basel",
    slug: "basel",
    companies: 32,
    avgPrice: "2.400 - 4.000 CHF",
    trending: false,
  },
  {
    name: "Aargau",
    slug: "aargau",
    companies: 28,
    avgPrice: "2.100 - 3.600 CHF",
    trending: false,
  },
  {
    name: "Luzern",
    slug: "luzern",
    companies: 25,
    avgPrice: "2.300 - 3.900 CHF",
    trending: true,
  },
];

export const PopularCantons = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-light">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4">
              <MapPin className="w-3 h-3 mr-1" />
              Beliebte Regionen
            </Badge>
            <h2 className="mb-3">Umzug nach Kanton</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Finden Sie lokale Umzugsfirmen in den beliebtesten Kantonen der Schweiz
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCantons.map((canton) => (
              <Link
                key={canton.slug}
                to={`/kanton/${canton.slug}`}
                className="group"
              >
                <Card className="h-full hover-lift border-2 hover:border-primary/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                            {canton.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {canton.companies} Firmen
                          </p>
                        </div>
                      </div>
                      {canton.trending && (
                        <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Beliebt
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Durchschnittspreis</span>
                        <span className="font-semibold text-primary">{canton.avgPrice}</span>
                      </div>

                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between text-primary group-hover:text-primary-dark transition-colors">
                          <span className="font-medium text-sm">Firmen ansehen</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/firmen"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium group"
            >
              Alle Kantone anzeigen
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
