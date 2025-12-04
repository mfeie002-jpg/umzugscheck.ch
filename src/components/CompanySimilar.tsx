import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ArrowRight, Building2 } from "lucide-react";

interface SimilarCompany {
  id: string;
  slug: string;
  name: string;
  rating: number;
  reviewCount: number;
  priceLevel: string;
  serviceAreas: string[];
  services: string[];
}

interface CompanySimilarProps {
  currentCompanyId: string;
  currentServiceAreas: string[];
  currentServices: string[];
}

const mockSimilarCompanies: SimilarCompany[] = [
  {
    id: "similar-1",
    slug: "express-umzuege",
    name: "Express Umzüge GmbH",
    rating: 4.7,
    reviewCount: 89,
    priceLevel: "fair",
    serviceAreas: ["Zürich", "Aargau", "Zug"],
    services: ["Umzug", "Reinigung", "Lagerung"]
  },
  {
    id: "similar-2",
    slug: "swiss-moving",
    name: "Swiss Moving AG",
    rating: 4.8,
    reviewCount: 156,
    priceLevel: "premium",
    serviceAreas: ["Zürich", "Bern", "Basel"],
    services: ["Umzug", "Packservice", "Firmenumzug"]
  },
  {
    id: "similar-3",
    slug: "budget-umzug",
    name: "Budget Umzug",
    rating: 4.5,
    reviewCount: 67,
    priceLevel: "günstig",
    serviceAreas: ["Zürich", "Winterthur", "St. Gallen"],
    services: ["Umzug", "Entsorgung", "Möbelmontage"]
  }
];

export const CompanySimilar = ({
  currentCompanyId,
  currentServiceAreas,
  currentServices
}: CompanySimilarProps) => {
  const similarCompanies = mockSimilarCompanies.filter(c => c.id !== currentCompanyId);

  const getPriceLevelColor = (level: string) => {
    switch (level) {
      case 'günstig': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'premium': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Ähnliche Umzugsfirmen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {similarCompanies.map((company) => {
          const commonAreas = company.serviceAreas.filter(area => 
            currentServiceAreas.includes(area)
          );
          const commonServices = company.services.filter(service =>
            currentServices.includes(service)
          );

          return (
            <div
              key={company.id}
              className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{company.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{company.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({company.reviewCount})
                      </span>
                    </div>
                    <Badge variant="outline" className={getPriceLevelColor(company.priceLevel)}>
                      {company.priceLevel}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <MapPin className="h-3 w-3" />
                <span>{company.serviceAreas.slice(0, 3).join(", ")}</span>
              </div>

              {commonAreas.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {commonAreas.map((area, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      ✓ {area}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {company.services.slice(0, 2).map((service, idx) => (
                    <span key={idx} className="text-xs text-muted-foreground">
                      {service}{idx < 1 ? " •" : ""}
                    </span>
                  ))}
                </div>
                <Link to={`/umzugsfirmen/${company.slug}`}>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Ansehen
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}

        <Link to="/firmen" className="block">
          <Button variant="outline" className="w-full gap-2">
            Alle Firmen ansehen
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CompanySimilar;
