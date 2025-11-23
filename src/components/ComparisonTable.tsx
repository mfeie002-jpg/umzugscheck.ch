import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, X, ArrowRight } from "lucide-react";
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
  { label: "Bewertung", key: "rating" },
  { label: "Preisniveau", key: "price_level" },
  { label: "Geprüft", key: "verified" },
  { label: "Verfügbarkeit", key: "available" },
  { label: "Transportservice", key: "transport" },
  { label: "Packservice", key: "packing" },
  { label: "Montageservice", key: "assembly" },
  { label: "Reinigungsservice", key: "cleaning" },
  { label: "Lagerung", key: "storage" },
  { label: "Entsorgung", key: "disposal" },
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
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/30">
                <th className="text-left p-4 font-semibold min-w-[180px] sticky left-0 bg-secondary/30 z-10">
                  Kriterium
                </th>
                {displayCompanies.map((company) => (
                  <th key={company.id} className="p-4 min-w-[200px]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-light to-primary/5 flex items-center justify-center text-3xl">
                        {company.logo}
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-sm">{company.name}</div>
                        {company.verified && (
                          <Badge className="mt-1 bg-success text-white text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Geprüft
                          </Badge>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Rating */}
              <tr className="border-b hover:bg-secondary/20 transition-colors">
                <td className="p-4 font-medium sticky left-0 bg-background z-10">
                  Bewertung
                </td>
                {displayCompanies.map((company) => (
                  <td key={company.id} className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(company.rating)
                                ? "fill-accent text-accent"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold">{company.rating}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {company.review_count} Bewertungen
                    </div>
                  </td>
                ))}
              </tr>

              {/* Price Level */}
              <tr className="border-b hover:bg-secondary/20 transition-colors">
                <td className="p-4 font-medium sticky left-0 bg-background z-10">
                  Preisniveau
                </td>
                {displayCompanies.map((company) => (
                  <td key={company.id} className="p-4 text-center">
                    <span className="font-bold text-primary text-lg">
                      {company.price_level}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Verified */}
              <tr className="border-b hover:bg-secondary/20 transition-colors">
                <td className="p-4 font-medium sticky left-0 bg-background z-10">
                  Geprüft & Verifiziert
                </td>
                {displayCompanies.map((company) => (
                  <td key={company.id} className="p-4 text-center">
                    {company.verified ? (
                      <CheckCircle2 className="w-6 h-6 text-success mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-muted mx-auto" />
                    )}
                  </td>
                ))}
              </tr>

              {/* Services */}
              {["transport", "packing", "assembly", "cleaning", "storage", "disposal"].map((service) => (
                <tr key={service} className="border-b hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium sticky left-0 bg-background z-10 capitalize">
                    {service === "transport" && "Transportservice"}
                    {service === "packing" && "Packservice"}
                    {service === "assembly" && "Montageservice"}
                    {service === "cleaning" && "Reinigungsservice"}
                    {service === "storage" && "Lagerung"}
                    {service === "disposal" && "Entsorgung"}
                  </td>
                  {displayCompanies.map((company) => (
                    <td key={company.id} className="p-4 text-center">
                      {hasService(company, service) ? (
                        <CheckCircle2 className="w-6 h-6 text-success mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-muted mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* CTA Row */}
              <tr className="bg-secondary/10">
                <td className="p-4 font-medium sticky left-0 bg-secondary/10 z-10">
                  Aktion
                </td>
                {displayCompanies.map((company) => (
                  <td key={company.id} className="p-4">
                    <div className="space-y-2">
                      <Link to={`/firmen/${company.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Profil ansehen
                        </Button>
                      </Link>
                      <Link to="/rechner">
                        <Button size="sm" className="w-full bg-accent hover:bg-accent/90 group">
                          Offerte anfragen
                          <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
