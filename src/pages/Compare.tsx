import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, CheckCircle2, X, ArrowRight, AlertCircle, TrendingUp, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSkeletonCompany } from "@/components/LoadingSkeletonCompany";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Separator } from "@/components/ui/separator";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [cantonFilter, setCantonFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

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

  // Get unique values for filters
  const allCantons = useMemo(() => {
    const cantons = new Set<string>();
    companies.forEach(company => {
      company.service_areas?.forEach(area => cantons.add(area));
    });
    return Array.from(cantons).sort();
  }, [companies]);

  const allServices = useMemo(() => {
    const services = new Set<string>();
    companies.forEach(company => {
      company.services?.forEach(service => services.add(service));
    });
    return Array.from(services).sort();
  }, [companies]);

  // Filter companies
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      // Search filter
      if (searchTerm && !company.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Canton filter
      if (cantonFilter !== "all" && !company.service_areas?.includes(cantonFilter)) {
        return false;
      }
      
      // Price filter
      if (priceFilter !== "all" && company.price_level !== priceFilter) {
        return false;
      }
      
      // Service filter
      if (serviceFilter !== "all" && !company.services?.includes(serviceFilter)) {
        return false;
      }
      
      return true;
    });
  }, [companies, searchTerm, cantonFilter, priceFilter, serviceFilter]);

  const selectedCompanyData = companies.filter(c => selectedCompanies.includes(c.id));

  const clearFilters = () => {
    setSearchTerm("");
    setCantonFilter("all");
    setPriceFilter("all");
    setServiceFilter("all");
  };

  const activeFilterCount = [
    searchTerm !== "",
    cantonFilter !== "all",
    priceFilter !== "all",
    serviceFilter !== "all"
  ].filter(Boolean).length;

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

              {/* Search and Filters */}
              <ScrollReveal>
                <Card className="mb-8 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Filter className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">Suchen & Filtern</h3>
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {activeFilterCount} aktiv
                        </Badge>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Firma suchen..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                        />
                      </div>

                      {/* Canton Filter */}
                      <Select value={cantonFilter} onValueChange={setCantonFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Kanton wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alle Kantone</SelectItem>
                          {allCantons.map(canton => (
                            <SelectItem key={canton} value={canton}>
                              {canton}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Price Filter */}
                      <Select value={priceFilter} onValueChange={setPriceFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Preisniveau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alle Preise</SelectItem>
                          <SelectItem value="CHF 800-1000/Tag">CHF 800-1000/Tag</SelectItem>
                          <SelectItem value="CHF 900-1200/Tag">CHF 900-1200/Tag</SelectItem>
                          <SelectItem value="CHF 1000-1400/Tag">CHF 1000-1400/Tag</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Service Filter */}
                      <Select value={serviceFilter} onValueChange={setServiceFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Dienstleistung" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alle Dienste</SelectItem>
                          {allServices.map(service => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {filteredCompanies.length} {filteredCompanies.length === 1 ? 'Firma' : 'Firmen'} gefunden
                      </p>
                      {activeFilterCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          Filter zurücksetzen
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {[...Array(6)].map((_, i) => (
                    <LoadingSkeletonCompany key={i} />
                  ))}
                </div>
              ) : filteredCompanies.length === 0 ? (
                <Card className="p-12 text-center bg-gradient-to-br from-secondary/20 to-transparent mb-12">
                  <div className="max-w-md mx-auto">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Keine Firmen gefunden</h3>
                    <p className="text-muted-foreground mb-4">
                      Mit den aktuellen Filtereinstellungen wurden keine Umzugsfirmen gefunden.
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Filter zurücksetzen
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {filteredCompanies.map((company, index) => (
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
