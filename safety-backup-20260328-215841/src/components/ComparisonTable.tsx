import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, X, ArrowRight, DollarSign, Shield, Package, Wrench, Sparkles, Trash2, Archive } from "lucide-react";
import { Link } from "react-router-dom";

interface Company {
  id: string;
  name: string;
  logo: string;
  rating: number;
  review_count: number;
  price_level: string;
  services: string[];
  verified: boolean;
  available?: boolean;
}

interface ComparisonTableProps {
  companies: Company[];
  maxCompanies?: number;
}

const comparisonFeatures = [
  { label: "Bewertung", key: "rating", icon: Star },
  { label: "Preisniveau", key: "price_level", icon: DollarSign },
  { label: "Geprüft", key: "verified", icon: Shield },
  { label: "Transportservice", key: "transport", icon: Package },
  { label: "Packservice", key: "packing", icon: Package },
  { label: "Montageservice", key: "assembly", icon: Wrench },
  { label: "Reinigungsservice", key: "cleaning", icon: Sparkles },
  { label: "Lagerung", key: "storage", icon: Archive },
  { label: "Entsorgung", key: "disposal", icon: Trash2 },
];

export const ComparisonTable = ({ companies, maxCompanies = 5 }: ComparisonTableProps) => {
  const displayCompanies = companies.slice(0, maxCompanies);

  if (displayCompanies.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Wählen Sie Firmen aus, um sie zu vergleichen.</p>
        </CardContent>
      </Card>
    );
  }

  const hasService = (company: Company, service: string) => {
    return company.services.some(s => 
      s.toLowerCase().includes(service.toLowerCase())
    );
  };

  return (
    <Card className="shadow-strong overflow-hidden">
      <CardHeader className="bg-gradient-hero text-white">
        <CardTitle className="text-center">
          Firmen-Vergleich ({displayCompanies.length} {displayCompanies.length === 1 ? 'Firma' : 'Firmen'})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-20 bg-white shadow-soft">
              <tr className="bg-gradient-to-r from-primary/5 to-primary/10">
                <th className="p-6 text-left font-bold text-base border-b-2 border-border sticky left-0 bg-gradient-to-r from-primary/5 to-primary/10 z-30 min-w-[180px]">
                  Vergleich
                </th>
                {displayCompanies.map((company) => (
                  <th key={company.id} className="p-6 border-b-2 border-border min-w-[220px]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-4xl">{company.logo}</div>
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">{company.name}</div>
                        {company.verified && (
                          <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verifiziert
                          </Badge>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <tr
                    key={feature.key}
                    className={`transition-colors hover:bg-secondary/30 ${
                      index % 2 === 0 ? "bg-white" : "bg-secondary/10"
                    }`}
                  >
                    <td className="p-5 font-semibold text-sm border-b border-border sticky left-0 bg-inherit z-10">
                      <div className="flex items-center gap-2">
                        <FeatureIcon className="w-4 h-4 text-primary" />
                        {feature.label}
                      </div>
                    </td>
                    {displayCompanies.map((company) => {
                      let content;
                      if (feature.key === "rating") {
                        content = (
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(company.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-bold text-foreground">{company.rating.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">({company.review_count})</span>
                          </div>
                        );
                      } else if (feature.key === "price_level") {
                        // Check if it's an actual price range or old CHF format
                        const isActualPrice = company.price_level.includes('-') || company.price_level.includes('/');
                        content = isActualPrice ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-bold text-sm text-foreground whitespace-nowrap">
                              {company.price_level}
                            </span>
                          </div>
                        ) : (
                          <span className={`inline-block px-4 py-1.5 rounded-full font-bold text-sm ${
                            company.price_level === "CHF" ? "bg-success/10 text-success" :
                            company.price_level === "CHF CHF" ? "bg-warning/10 text-warning" :
                            "bg-primary/10 text-primary"
                          }`}>
                            {company.price_level}
                          </span>
                        );
                      } else if (feature.key === "verified") {
                        content = company.verified ? (
                          <div className="flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-success" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <X className="w-5 h-5 text-muted-foreground/40" />
                            </div>
                          </div>
                        );
                      } else {
                        const hasIt = hasService(company, feature.key);
                        content = hasIt ? (
                          <div className="flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-success" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <X className="w-5 h-5 text-muted-foreground/40" />
                            </div>
                          </div>
                        );
                      }
                      
                      return (
                        <td key={`${company.name}-${feature.key}`} className="p-5 text-center border-b border-border">
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Action Row */}
              <tr className="bg-gradient-to-r from-accent/10 to-accent/5">
                <td className="p-6 font-bold text-base sticky left-0 bg-gradient-to-r from-accent/10 to-accent/5 z-10">
                  Kontakt
                </td>
                {displayCompanies.map((company) => (
                  <td key={`${company.name}-action`} className="p-6">
                    <div className="flex flex-col gap-3">
                      <Link to={`/firmen/${company.id}`}>
                        <Button variant="outline" className="w-full hover:bg-secondary" size="default">
                          Profil ansehen
                        </Button>
                      </Link>
                      <Link to="/rechner">
                        <Button className="w-full bg-accent hover:bg-accent/90 shadow-accent group" size="default">
                          Offerte anfragen
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {companies.length > maxCompanies && (
          <div className="p-4 bg-secondary/20 text-center text-sm text-muted-foreground">
            <p>
              Vergleichen Sie bis zu {maxCompanies} Firmen gleichzeitig. 
              <Link to="/firmen" className="text-primary hover:underline ml-1">
                Alle Firmen anzeigen
              </Link>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
