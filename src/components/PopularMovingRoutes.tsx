import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface Route {
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  priceRange: string;
  popularity: number;
  distance: number;
}

const popularRoutes: Route[] = [
  {
    from: "Zürich",
    to: "Bern",
    fromCode: "ZH",
    toCode: "BE",
    priceRange: "CHF 800-1200",
    popularity: 95,
    distance: 120
  },
  {
    from: "Genève",
    to: "Lausanne",
    fromCode: "GE",
    toCode: "VD",
    priceRange: "CHF 600-900",
    popularity: 88,
    distance: 62
  },
  {
    from: "Basel",
    to: "Zürich",
    fromCode: "BS",
    toCode: "ZH",
    priceRange: "CHF 700-1100",
    popularity: 82,
    distance: 87
  },
  {
    from: "Luzern",
    to: "Zürich",
    fromCode: "LU",
    toCode: "ZH",
    priceRange: "CHF 500-800",
    popularity: 78,
    distance: 52
  },
  {
    from: "St. Gallen",
    to: "Zürich",
    fromCode: "SG",
    toCode: "ZH",
    priceRange: "CHF 600-950",
    popularity: 75,
    distance: 78
  },
  {
    from: "Bern",
    to: "Lausanne",
    fromCode: "BE",
    toCode: "VD",
    priceRange: "CHF 700-1000",
    popularity: 72,
    distance: 96
  }
];

export const PopularMovingRoutes = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <CardTitle>Beliebte Umzugsrouten</CardTitle>
        </div>
        <CardDescription>
          Die häufigsten Umzugsstrecken in der Schweiz
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {popularRoutes.map((route, index) => (
            <div
              key={`${route.fromCode}-${route.toCode}`}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-accent/5 transition-all group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <Badge variant="outline" className="text-xs">
                    {route.fromCode}
                  </Badge>
                  <span className="font-semibold text-sm truncate">
                    {route.from}
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />

                <div className="flex items-center gap-2 min-w-0">
                  <Badge variant="outline" className="text-xs">
                    {route.toCode}
                  </Badge>
                  <span className="font-semibold text-sm truncate">
                    {route.to}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-primary">
                    {route.priceRange}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ~{route.distance} km
                  </p>
                </div>

                <Link to={`/rechner?from=${route.fromCode}&to=${route.toCode}`}>
                  <Button size="sm" variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground">
                    Offerte
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <Link to="/regionen">
            <Button variant="outline" className="w-full">
              Alle Regionen durchsuchen
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
