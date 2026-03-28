import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Check, X, MapPin, Phone, Globe, Shield, Award, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface Company {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  priceLevel: string;
  services: string[];
  serviceAreas: string[];
  verified: boolean;
  responseTime?: string;
  certifications?: string[];
}

interface CompanyCompareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: Company[];
}

export const CompanyCompareModal = ({ open, onOpenChange, companies }: CompanyCompareModalProps) => {
  const compareFields = [
    { key: "rating", label: "Bewertung", type: "rating" },
    { key: "reviewCount", label: "Anzahl Bewertungen", type: "number" },
    { key: "priceLevel", label: "Preissegment", type: "text" },
    { key: "verified", label: "Verifiziert", type: "boolean" },
    { key: "responseTime", label: "Antwortzeit", type: "text" },
  ];

  const renderValue = (company: Company, field: typeof compareFields[0]) => {
    const value = company[field.key as keyof Company];
    
    switch (field.type) {
      case "rating":
        return (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="font-medium">{value}</span>
          </div>
        );
      case "boolean":
        return value ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <X className="h-5 w-5 text-red-500" />
        );
      case "number":
        return <span>{value?.toLocaleString() || "-"}</span>;
      default:
        return <span>{value || "-"}</span>;
    }
  };

  const getBestValue = (field: typeof compareFields[0]) => {
    if (field.type === "rating" || field.type === "number") {
      const values = companies.map(c => c[field.key as keyof Company] as number);
      return Math.max(...values);
    }
    return null;
  };

  if (companies.length < 2) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Firmen vergleichen</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2 border-b"></th>
                    {companies.map((company) => (
                      <th key={company.id} className="text-center p-2 border-b min-w-[150px]">
                        <div className="space-y-2">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                            <span className="text-lg font-bold text-primary">
                              {company.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <p className="font-medium">{company.name}</p>
                          {company.verified && (
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Verifiziert
                            </Badge>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareFields.map((field) => {
                    const best = getBestValue(field);
                    return (
                      <tr key={field.key} className="border-b">
                        <td className="p-3 text-sm font-medium">{field.label}</td>
                        {companies.map((company) => {
                          const value = company[field.key as keyof Company];
                          const isBest = best !== null && value === best;
                          return (
                            <td 
                              key={company.id} 
                              className={`p-3 text-center ${isBest ? "bg-green-50" : ""}`}
                            >
                              {renderValue(company, field)}
                              {isBest && (
                                <Badge variant="outline" className="mt-1 text-xs text-green-600">
                                  Beste
                                </Badge>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2 border-b">Service</th>
                    {companies.map((company) => (
                      <th key={company.id} className="text-center p-2 border-b min-w-[120px]">
                        {company.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {["Privatumzug", "Firmenumzug", "Reinigung", "Entsorgung", "Lagerung", "Möbelmontage"].map((service) => (
                    <tr key={service} className="border-b">
                      <td className="p-3 text-sm">{service}</td>
                      {companies.map((company) => (
                        <td key={company.id} className="p-3 text-center">
                          {company.services?.includes(service) ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            <div className="grid gap-4">
              {companies.map((company) => (
                <div key={company.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{company.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span>{company.rating}</span>
                        <span className="text-muted-foreground">
                          ({company.reviewCount} Bewertungen)
                        </span>
                      </div>
                    </div>
                    <Badge>{company.priceLevel}</Badge>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{company.serviceAreas?.slice(0, 3).join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{company.responseTime || "< 24h"}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Link to="/umzugsofferten" className="flex-1">
                      <Button className="w-full">Offerte anfragen</Button>
                    </Link>
                    <Button variant="outline">Profil ansehen</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Schliessen
          </Button>
          <Link to="/umzugsofferten">
            <Button>
              Offerten von allen anfragen
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyCompareModal;
