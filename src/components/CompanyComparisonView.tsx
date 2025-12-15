import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, MapPin, CheckCircle2, X, ArrowRight, Scale, Phone, Clock, Shield, Award, Bookmark, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  employees?: number;
  yearsInBusiness?: number;
}

interface CompanyComparisonViewProps {
  companies: Company[];
  onClose: () => void;
}

const CompanyComparisonView = ({ companies, onClose }: CompanyComparisonViewProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(companies.slice(0, 3).map(c => c.id));
  const [savedCompanies, setSavedCompanies] = useState<string[]>([]);

  const selectedCompanies = companies.filter(c => selectedIds.includes(c.id));

  const getPriceLevelValue = (level: string) => {
    return { "günstig": 1, "fair": 2, "premium": 3 }[level] || 2;
  };

  const getPriceLevelLabel = (level: string) => {
    return { "günstig": "€", "fair": "€€", "premium": "€€€" }[level] || "€€";
  };

  const toggleSaved = (id: string) => {
    setSavedCompanies(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

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
            Firmenvergleich ({selectedCompanies.length} Firmen)
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-40 font-semibold">Kriterium</TableHead>
                {selectedCompanies.map(company => (
                  <TableHead key={company.id} className="text-center min-w-44">
                    <div className="space-y-2 py-2">
                      <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">{company.name.charAt(0)}</span>
                      </div>
                      <p className="font-semibold text-sm">{company.name}</p>
                      <div className="flex justify-center gap-2">
                        {company.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verifiziert
                          </Badge>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => toggleSaved(company.id)}
                        >
                          <Bookmark className={`w-4 h-4 ${savedCompanies.includes(company.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                        </Button>
                      </div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Bewertung */}
              <TableRow>
                <TableCell className="font-medium bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    Bewertung
                  </div>
                </TableCell>
                {selectedCompanies.map(company => (
                  <TableCell key={company.id} className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <div className="flex">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`w-4 h-4 ${i <= Math.round(company.rating) ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="font-semibold">{company.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground"> ({company.review_count})</span>
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* Preisstufe */}
              <TableRow>
                <TableCell className="font-medium bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">💰</span>
                    Preisstufe
                  </div>
                </TableCell>
                {selectedCompanies.map(company => (
                  <TableCell key={company.id} className="text-center">
                    <Badge variant={company.price_level === 'günstig' ? 'default' : 'secondary'} className="text-sm">
                      {getPriceLevelLabel(company.price_level)}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{company.price_level}</p>
                  </TableCell>
                ))}
              </TableRow>

              {/* Antwortzeit */}
              <TableRow>
                <TableCell className="font-medium bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Antwortzeit
                  </div>
                </TableCell>
                {selectedCompanies.map(company => (
                  <TableCell key={company.id} className="text-center">
                    <span className="font-medium text-primary">{company.responseTime || "< 2 Std."}</span>
                  </TableCell>
                ))}
              </TableRow>

              {/* Regionen */}
              <TableRow>
                <TableCell className="font-medium bg-muted/30">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Regionen
                  </div>
                </TableCell>
                {selectedCompanies.map(company => (
                  <TableCell key={company.id} className="text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {company.service_areas.slice(0, 3).map(area => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                      {company.service_areas.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{company.service_areas.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* Services */}
              <TableRow>
                <TableCell className="font-medium bg-muted/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    Leistungen
                  </div>
                </TableCell>
                {selectedCompanies.map(company => (
                  <TableCell key={company.id} className="text-center">
                    <div className="text-xs space-y-1">
                      {company.services.slice(0, 4).map(service => (
                        <div key={service} className="flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          <span>{service}</span>
                        </div>
                      ))}
                      {company.services.length > 4 && (
                        <span className="text-muted-foreground">+{company.services.length - 4} weitere</span>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* Zertifikate */}
              <TableRow>
                <TableCell className="font-medium bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    Zertifikate
                  </div>
                </TableCell>
                {selectedCompanies.map(company => (
                  <TableCell key={company.id} className="text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {(company.certifications || ["ISO 9001"]).slice(0, 2).map(cert => (
                        <Badge key={cert} className="text-xs bg-green-100 text-green-700 hover:bg-green-100">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* Versichert */}
              <TableRow>
                <TableCell className="font-medium bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    Versichert
                  </div>
                </TableCell>
                {selectedCompanies.map(company => (
                  <TableCell key={company.id} className="text-center">
                    {company.verified ? (
                      <div className="flex items-center justify-center gap-1 text-green-600">
                        <Shield className="w-5 h-5 fill-green-100" />
                        <span className="text-xs font-medium">Vollversichert</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">Nicht verifiziert</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>

              {/* Team */}
              <TableRow>
                <TableCell className="font-medium bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    Team
                  </div>
                </TableCell>
                {selectedCompanies.map(company => (
                  <TableCell key={company.id} className="text-center">
                    <span className="font-medium">{company.employees || "5-10"} Mitarbeiter</span>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Gemerkte Firmen */}
        {savedCompanies.length > 0 && (
          <div className="p-4 bg-primary/5 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Bookmark className="w-4 h-4 text-primary fill-primary" />
              <span className="font-medium">{savedCompanies.length} Firma(en) gemerkt</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-4 border-t bg-muted/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {selectedCompanies.slice(0, 4).map(company => (
              <Link key={company.id} to="/umzugsofferten">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  <Phone className="w-3 h-3 mr-1" />
                  {company.name} anfragen
                </Button>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link to="/umzugsofferten">
              <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto px-8">
                Gemeinsames Angebot für {selectedCompanies.length} Firmen
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
