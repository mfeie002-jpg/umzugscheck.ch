import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star, MapPin, CheckCircle2, X, ArrowRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Company {
  id: string;
  name: string;
  logo: string;
  rating: number;
  review_count: number;
  price_level: string;
  services: string[];
  service_areas: string[];
  verified: boolean;
}

const Compare = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("rating", { ascending: false })
        .limit(10);

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompany = (companyId: string) => {
    if (selectedCompanies.includes(companyId)) {
      setSelectedCompanies(selectedCompanies.filter(id => id !== companyId));
    } else if (selectedCompanies.length < 4) {
      setSelectedCompanies([...selectedCompanies, companyId]);
    }
  };

  const selectedCompanyData = companies.filter(c => selectedCompanies.includes(c.id));

  const allServices = [...new Set(selectedCompanyData.flatMap(c => c.services))];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Umzugsfirmen vergleichen
              </h1>
              <p className="text-xl text-white/90">
                Wählen Sie 2-4 Firmen aus und vergleichen Sie Leistungen, Preise und Bewertungen
              </p>
            </div>
          </div>
        </section>

        {/* How to use */}
        <section className="py-8 bg-secondary/30">
          <div className="container mx-auto px-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>So geht's:</strong> Wählen Sie aus der Liste unten 2 bis 4 Umzugsfirmen aus, 
                die Sie vergleichen möchten. Die Vergleichstabelle wird automatisch aktualisiert.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Company Selection */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">
                Firmen auswählen ({selectedCompanies.length}/4)
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {companies.map((company) => (
                    <Card
                      key={company.id}
                      className={`cursor-pointer transition-all hover:shadow-strong ${
                        selectedCompanies.includes(company.id)
                          ? "ring-2 ring-primary shadow-strong"
                          : ""
                      }`}
                      onClick={() => toggleCompany(company.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                              {company.logo}
                            </div>
                            <div>
                              <h3 className="font-bold">{company.name}</h3>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{company.rating}</span>
                                <span className="text-sm text-muted-foreground">
                                  ({company.review_count})
                                </span>
                              </div>
                            </div>
                          </div>
                          <Checkbox
                            checked={selectedCompanies.includes(company.id)}
                            disabled={!selectedCompanies.includes(company.id) && selectedCompanies.length >= 4}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Preisniveau:</span>
                            <span className="text-sm font-medium text-primary">{company.price_level}</span>
                          </div>
                          {company.verified && (
                            <Badge className="bg-success/10 text-success border-success/30">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Geprüft
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Comparison Table */}
              {selectedCompanyData.length >= 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Vergleich</h2>
                  
                  <Card className="shadow-strong overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="sticky top-0 bg-secondary">
                          <TableRow>
                            <TableHead className="w-[200px] font-bold">Kriterium</TableHead>
                            {selectedCompanyData.map((company) => (
                              <TableHead key={company.id} className="text-center min-w-[200px]">
                                <div className="flex flex-col items-center gap-2 py-2">
                                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                                    {company.logo}
                                  </div>
                                  <div className="font-bold">{company.name}</div>
                                </div>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Rating */}
                          <TableRow>
                            <TableCell className="font-medium">Bewertung</TableCell>
                            {selectedCompanyData.map((company) => (
                              <TableCell key={company.id} className="text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-bold">{company.rating}</span>
                                  <span className="text-muted-foreground text-sm">
                                    ({company.review_count})
                                  </span>
                                </div>
                              </TableCell>
                            ))}
                          </TableRow>

                          {/* Price Level */}
                          <TableRow className="bg-muted/30">
                            <TableCell className="font-medium">Preisniveau</TableCell>
                            {selectedCompanyData.map((company) => (
                              <TableCell key={company.id} className="text-center">
                                <span className="font-medium text-primary">{company.price_level}</span>
                              </TableCell>
                            ))}
                          </TableRow>

                          {/* Verified */}
                          <TableRow>
                            <TableCell className="font-medium">Geprüft</TableCell>
                            {selectedCompanyData.map((company) => (
                              <TableCell key={company.id} className="text-center">
                                {company.verified ? (
                                  <CheckCircle2 className="w-5 h-5 text-success mx-auto" />
                                ) : (
                                  <X className="w-5 h-5 text-muted-foreground mx-auto" />
                                )}
                              </TableCell>
                            ))}
                          </TableRow>

                          {/* Services */}
                          {allServices.map((service) => (
                            <TableRow key={service} className="bg-muted/30">
                              <TableCell className="font-medium">{service}</TableCell>
                              {selectedCompanyData.map((company) => (
                                <TableCell key={company.id} className="text-center">
                                  {company.services.includes(service) ? (
                                    <CheckCircle2 className="w-5 h-5 text-success mx-auto" />
                                  ) : (
                                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}

                          {/* CTA Row */}
                          <TableRow>
                            <TableCell className="font-medium">Offerte anfragen</TableCell>
                            {selectedCompanyData.map((company) => (
                              <TableCell key={company.id} className="text-center">
                                <Link to={`/firmen/${company.id}`}>
                                  <Button className="bg-accent hover:bg-accent/90" size="sm">
                                    Zur Firma
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                  </Button>
                                </Link>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </Card>
                </div>
              )}

              {selectedCompanyData.length < 2 && selectedCompanies.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Wählen Sie mindestens 2 Firmen aus, um sie zu vergleichen.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Compare;
