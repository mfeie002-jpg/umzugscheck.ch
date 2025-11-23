import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, CheckCircle2, X, ArrowRight, AlertCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSkeletonCompany } from "@/components/LoadingSkeletonCompany";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ComparisonTable } from "@/components/ComparisonTable";

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
    } else if (selectedCompanies.length < 5) {
      setSelectedCompanies([...selectedCompanies, companyId]);
    }
  };

  const selectedCompanyData = companies.filter(c => selectedCompanies.includes(c.id));

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero text-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Transparenter Firmenvergleich</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Umzugsfirmen vergleichen
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8">
                  Wählen Sie 2-5 Firmen aus und vergleichen Sie Leistungen, Preise und Bewertungen side-by-side
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* How to use */}
        <section className="py-8 bg-gradient-to-b from-secondary/20 to-transparent">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <Alert className="max-w-4xl mx-auto border-primary/20 bg-primary/5">
                <AlertCircle className="h-5 w-5 text-primary" />
                <AlertDescription className="text-base">
                  <strong>So geht's:</strong> Wählen Sie aus der Liste unten 2 bis 5 Umzugsfirmen aus, 
                  die Sie vergleichen möchten. Die Vergleichstabelle wird automatisch aktualisiert.
                </AlertDescription>
              </Alert>
            </ScrollReveal>
          </div>
        </section>

        {/* Company Selection */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold">
                    Firmen auswählen
                  </h2>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {selectedCompanies.length}/5 gewählt
                  </Badge>
                </div>
              </ScrollReveal>

              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {[...Array(6)].map((_, i) => (
                    <LoadingSkeletonCompany key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {companies.map((company, index) => (
                    <ScrollReveal key={company.id} delay={index * 0.1}>
                      <Card
                        className={`cursor-pointer transition-all duration-300 hover:shadow-strong hover:-translate-y-1 ${
                          selectedCompanies.includes(company.id)
                            ? "ring-2 ring-primary shadow-strong scale-[1.02]"
                            : ""
                        }`}
                        onClick={() => toggleCompany(company.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-3xl flex-shrink-0 shadow-soft">
                                {company.logo}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg mb-1 truncate">{company.name}</h3>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                  <span className="text-sm font-medium">{company.rating}</span>
                                  <span className="text-sm text-muted-foreground">
                                    ({company.review_count})
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Checkbox
                              checked={selectedCompanies.includes(company.id)}
                              disabled={!selectedCompanies.includes(company.id) && selectedCompanies.length >= 5}
                              className="flex-shrink-0 ml-2"
                            />
                          </div>
                          
                          <div className="space-y-3 pt-3 border-t">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Preisniveau:</span>
                              <span className="text-sm font-bold text-primary">{company.price_level}</span>
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
                    </ScrollReveal>
                  ))}
                </div>
              )}

              {/* Comparison Table */}
              {selectedCompanyData.length >= 2 && (
                <ScrollReveal>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-6">
                      Detaillierter Vergleich
                    </h2>
                    <ComparisonTable companies={selectedCompanyData} maxCompanies={5} />
                  </div>
                </ScrollReveal>
              )}

              {selectedCompanyData.length === 0 && (
                <ScrollReveal>
                  <Card className="p-12 text-center bg-gradient-to-br from-secondary/20 to-transparent">
                    <div className="max-w-md mx-auto">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Bereit zum Vergleichen?</h3>
                      <p className="text-muted-foreground">
                        Wählen Sie mindestens 2 Firmen aus der Liste oben aus, um einen detaillierten Vergleich zu sehen.
                      </p>
                    </div>
                  </Card>
                </ScrollReveal>
              )}

              {selectedCompanyData.length === 1 && (
                <ScrollReveal>
                  <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-900 dark:text-amber-100">
                      Wählen Sie mindestens eine weitere Firma aus, um den Vergleich zu starten.
                    </AlertDescription>
                  </Alert>
                </ScrollReveal>
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
