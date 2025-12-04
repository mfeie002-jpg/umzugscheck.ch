import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, CheckCircle2, X, ArrowRight, Scale, Phone, Clock, Shield, Award } from "lucide-react";
import { Link } from "react-router-dom";

interface Company {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  price_level: string;
  services: string[];
  service_areas: string[];
  verified: boolean;
  responseTime?: string;
  certifications?: string[];
}

interface CompanyComparisonViewProps {
  companies: Company[];
  onClose: () => void;
}

const CompanyComparisonView = ({ companies, onClose }: CompanyComparisonViewProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(companies.slice(0, 3).map(c => c.id));

  const selectedCompanies = companies.filter(c => selectedIds.includes(c.id));

  const getPriceLevelValue = (level: string) => {
    return { "günstig": 1, "fair": 2, "premium": 3 }[level] || 2;
  };

  const renderComparisonRow = (label: string, getValue: (c: Company) => React.ReactNode, icon?: React.ReactNode) => (
    <tr className="border-b">
      <td className="py-3 px-2 font-medium text-sm bg-muted/30 flex items-center gap-2">
        {icon}
        {label}
      </td>
      {selectedCompanies.map(company => (
        <td key={company.id} className="py-3 px-3 text-center">
          {getValue(company)}
        </td>
      ))}
    </tr>
  );

  if (selectedCompanies.length < 2) {
    return (
      <Card className="border-2">
        <CardContent className="py-12 text-center">
          <Scale className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Wählen Sie mindestens 2 Firmen zum Vergleichen</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 bg-white shadow-lg">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            Firmenvergleich
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-4 px-2 text-left w-32"></th>
                {selectedCompanies.map(company => (
                  <th key={company.id} className="py-4 px-3 text-center min-w-40">
                    <div className="space-y-2">
                      <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">{company.name.charAt(0)}</span>
                      </div>
                      <p className="font-semibold text-sm">{company.name}</p>
                      {company.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verifiziert
                        </Badge>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderComparisonRow(
                "Bewertung",
                (c) => (
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-semibold">{c.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-xs">({c.review_count})</span>
                  </div>
                ),
                <Star className="w-4 h-4 text-muted-foreground" />
              )}
              
              {renderComparisonRow(
                "Preisstufe",
                (c) => {
                  const level = getPriceLevelValue(c.price_level);
                  return (
                    <div className="flex justify-center gap-0.5">
                      {[1, 2, 3].map(i => (
                        <span 
                          key={i} 
                          className={`text-lg ${i <= level ? "text-primary" : "text-muted-foreground/30"}`}
                        >
                          CHF
                        </span>
                      ))}
                    </div>
                  );
                },
                <span className="text-sm">💰</span>
              )}

              {renderComparisonRow(
                "Antwortzeit",
                (c) => (
                  <span className="text-sm">
                    {c.responseTime || "< 2 Std."}
                  </span>
                ),
                <Clock className="w-4 h-4 text-muted-foreground" />
              )}

              {renderComparisonRow(
                "Regionen",
                (c) => (
                  <div className="flex flex-wrap justify-center gap-1">
                    {c.service_areas.slice(0, 3).map(area => (
                      <Badge key={area} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                    {c.service_areas.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{c.service_areas.length - 3}
                      </Badge>
                    )}
                  </div>
                ),
                <MapPin className="w-4 h-4 text-muted-foreground" />
              )}

              {renderComparisonRow(
                "Services",
                (c) => (
                  <div className="text-xs text-muted-foreground">
                    {c.services.slice(0, 3).join(", ")}
                    {c.services.length > 3 && ` +${c.services.length - 3}`}
                  </div>
                ),
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              )}

              {renderComparisonRow(
                "Zertifikate",
                (c) => (
                  <div className="flex justify-center gap-1">
                    {(c.certifications || ["ISO 9001"]).slice(0, 2).map(cert => (
                      <Badge key={cert} className="text-xs bg-green-100 text-green-700">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                ),
                <Award className="w-4 h-4 text-muted-foreground" />
              )}

              {renderComparisonRow(
                "Versichert",
                (c) => (
                  <Shield className={`w-5 h-5 mx-auto ${c.verified ? "text-green-500" : "text-muted-foreground/30"}`} />
                ),
                <Shield className="w-4 h-4 text-muted-foreground" />
              )}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedCompanies.map(company => (
              <Link key={company.id} to="/umzugsofferten">
                <Button size="sm" variant="outline" className="text-xs">
                  <Phone className="w-3 h-3 mr-1" />
                  {company.name} anfragen
                </Button>
              </Link>
            ))}
          </div>
          <div className="mt-3 text-center">
            <Link to="/umzugsofferten">
              <Button className="bg-primary hover:bg-primary-dark">
                Alle {selectedCompanies.length} Firmen anfragen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyComparisonView;
