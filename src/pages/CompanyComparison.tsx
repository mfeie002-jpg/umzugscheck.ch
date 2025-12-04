import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, Plus, Trash2, Phone, Mail, Globe } from "lucide-react";
import { DEMO_COMPANIES } from "@/data/companies";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CompanyComparison = () => {
  const [searchParams] = useSearchParams();
  const initialIds = searchParams.get("ids")?.split(",") || [];
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(
    initialIds.slice(0, 4)
  );

  const comparisonData = selectedCompanies
    .map((id) => DEMO_COMPANIES.find((c) => c.id === id))
    .filter(Boolean);

  const addCompany = (id: string) => {
    if (selectedCompanies.length < 4 && !selectedCompanies.includes(id)) {
      setSelectedCompanies([...selectedCompanies, id]);
    }
  };

  const removeCompany = (id: string) => {
    setSelectedCompanies(selectedCompanies.filter((cId) => cId !== id));
  };

  const availableCompanies = DEMO_COMPANIES.filter(
    (c) => !selectedCompanies.includes(c.id)
  );

  const comparisonFeatures = [
    { key: "rating", label: "Bewertung", type: "rating" },
    { key: "review_count", label: "Anzahl Bewertungen", type: "number" },
    { key: "price_level", label: "Preislevel", type: "price" },
    { key: "verified", label: "Verifiziert", type: "boolean" },
    { key: "services", label: "Dienstleistungen", type: "services" },
    { key: "service_areas", label: "Regionen", type: "areas" },
  ];

  const renderValue = (company: any, feature: any) => {
    const value = company[feature.key];

    switch (feature.type) {
      case "rating":
        return (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{value?.toFixed(1) || "N/A"}</span>
          </div>
        );
      case "number":
        return <span className="font-medium">{value || 0}</span>;
      case "price":
        return (
          <Badge
            variant={
              value === "günstig"
                ? "default"
                : value === "fair"
                ? "secondary"
                : "outline"
            }
          >
            {value || "N/A"}
          </Badge>
        );
      case "boolean":
        return value ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <X className="h-5 w-5 text-red-500" />
        );
      case "services":
        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {(value || []).slice(0, 3).map((s: string, i: number) => (
              <Badge key={i} variant="outline" className="text-xs">
                {s}
              </Badge>
            ))}
            {(value || []).length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{value.length - 3}
              </Badge>
            )}
          </div>
        );
      case "areas":
        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {(value || []).slice(0, 2).map((a: string, i: number) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {a}
              </Badge>
            ))}
            {(value || []).length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{value.length - 2}
              </Badge>
            )}
          </div>
        );
      default:
        return value || "N/A";
    }
  };

  return (
    <>
      <OptimizedSEO
        title="Umzugsfirmen vergleichen | Umzugscheck.ch"
        description="Vergleichen Sie bis zu 4 Umzugsfirmen nebeneinander - Bewertungen, Preise, Services und mehr."
        canonicalUrl="/firmen-vergleich"
      />

      <main className="min-h-screen bg-background py-8">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Firmenvergleich</h1>
            <p className="text-muted-foreground">
              Vergleichen Sie bis zu 4 Umzugsfirmen nebeneinander
            </p>
          </div>

          {/* Company Selection */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Firmen auswählen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-center">
                  {selectedCompanies.length < 4 && (
                    <Select onValueChange={addCompany}>
                      <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Firma hinzufügen..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCompanies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {selectedCompanies.map((id) => {
                      const company = DEMO_COMPANIES.find((c) => c.id === id);
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="px-3 py-1.5 text-sm"
                        >
                          {company?.name}
                          <button
                            onClick={() => removeCompany(id)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Table */}
          {comparisonData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 bg-muted/50 border-b w-[200px]">
                      Kriterium
                    </th>
                    {comparisonData.map((company: any) => (
                      <th
                        key={company.id}
                        className="p-4 bg-muted/50 border-b min-w-[200px]"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center">
                            {company.logo ? (
                              <img
                                src={company.logo}
                                alt={company.name}
                                className="w-12 h-12 object-contain"
                              />
                            ) : (
                              <span className="text-xl font-bold text-primary">
                                {company.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <span className="font-semibold text-sm text-center">
                            {company.name}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCompany(company.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </th>
                    ))}
                    {comparisonData.length < 4 && (
                      <th className="p-4 bg-muted/50 border-b min-w-[200px]">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 bg-muted rounded-lg border-2 border-dashed flex items-center justify-center">
                            <Plus className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Firma hinzufügen
                          </span>
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature) => (
                    <tr key={feature.key} className="border-b">
                      <td className="p-4 font-medium bg-muted/30">
                        {feature.label}
                      </td>
                      {comparisonData.map((company: any) => (
                        <td key={company.id} className="p-4 text-center">
                          <div className="flex justify-center">
                            {renderValue(company, feature)}
                          </div>
                        </td>
                      ))}
                      {comparisonData.length < 4 && <td className="p-4" />}
                    </tr>
                  ))}
                  {/* Contact Row */}
                  <tr className="border-b">
                    <td className="p-4 font-medium bg-muted/30">Kontakt</td>
                    {comparisonData.map((company: any) => (
                      <td key={company.id} className="p-4">
                        <div className="flex flex-col gap-2 items-center">
                          {company.phone && (
                            <a
                              href={`tel:${company.phone}`}
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              <Phone className="h-3 w-3" />
                              {company.phone}
                            </a>
                          )}
                          {company.email && (
                            <a
                              href={`mailto:${company.email}`}
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              <Mail className="h-3 w-3" />
                              Email
                            </a>
                          )}
                          {company.website && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              <Globe className="h-3 w-3" />
                              Website
                            </a>
                          )}
                        </div>
                      </td>
                    ))}
                    {comparisonData.length < 4 && <td className="p-4" />}
                  </tr>
                  {/* CTA Row */}
                  <tr>
                    <td className="p-4 bg-muted/30" />
                    {comparisonData.map((company: any) => (
                      <td key={company.id} className="p-4">
                        <Button className="w-full" asChild>
                          <a href={`/umzugsfirmen/${company.slug || company.id}`}>
                            Offerte anfragen
                          </a>
                        </Button>
                      </td>
                    ))}
                    {comparisonData.length < 4 && <td className="p-4" />}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Wählen Sie mindestens 2 Firmen zum Vergleichen aus
                </p>
                <Button asChild>
                  <a href="/umzugsfirmen">Firmen durchsuchen</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
};

export default CompanyComparison;
