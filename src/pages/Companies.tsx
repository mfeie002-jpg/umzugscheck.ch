import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, CheckCircle2, ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  services: string[];
  price_level: string;
  rating: number;
  review_count: number;
  service_areas: string[];
  verified: boolean;
  phone: string;
  email: string;
  website: string;
}

const SWISS_CANTONS = [
  "Alle Kantone",
  "Aargau", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "Basel-Landschaft", "Basel-Stadt",
  "Bern", "Freiburg", "Genève", "Glarus", "Graubünden", "Jura", "Luzern", "Neuchâtel",
  "Nidwalden", "Obwalden", "Schaffhausen", "Schwyz", "Solothurn", "St. Gallen", "Thurgau",
  "Ticino", "Uri", "Vaud", "Valais", "Zug", "Zürich"
];

const Companies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCanton, setSelectedCanton] = useState(searchParams.get("canton") || "Alle Kantone");
  const [selectedRating, setSelectedRating] = useState("Alle");

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm, selectedCanton, selectedRating]);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("featured", { ascending: false })
        .order("rating", { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = [...companies];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Canton filter
    if (selectedCanton !== "Alle Kantone") {
      filtered = filtered.filter((company) =>
        company.service_areas.includes(selectedCanton)
      );
    }

    // Rating filter
    if (selectedRating !== "Alle") {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter((company) => company.rating >= minRating);
    }

    setFilteredCompanies(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Header */}
        <section className="py-16 md:py-24 gradient-hero text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="mb-4">Umzugsfirmen in der Schweiz</h1>
              <p className="text-lg md:text-xl text-white/90">
                Finden Sie geprüfte Umzugsunternehmen in Ihrer Region. Vergleichen Sie Preise, Bewertungen und
                Services.
              </p>
            </div>
          </div>
        </section>

        {/* Filters & Search */}
        <section className="py-8 bg-secondary/30 border-b sticky top-0 z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Firma oder Service suchen..."
                    className="pl-10 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Canton Filter */}
                <Select value={selectedCanton} onValueChange={setSelectedCanton}>
                  <SelectTrigger className="w-full md:w-64 bg-white">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SWISS_CANTONS.map((canton) => (
                      <SelectItem key={canton} value={canton}>
                        {canton}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Rating Filter */}
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger className="w-full md:w-48 bg-white">
                    <Star className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alle">Alle Bewertungen</SelectItem>
                    <SelectItem value="4.5">4.5+ Sterne</SelectItem>
                    <SelectItem value="4.0">4.0+ Sterne</SelectItem>
                    <SelectItem value="3.5">3.5+ Sterne</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                {filteredCompanies.length} {filteredCompanies.length === 1 ? "Firma" : "Firmen"} gefunden
              </div>
            </div>
          </div>
        </section>

        {/* Companies Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-muted-foreground">Lade Umzugsfirmen...</p>
                </div>
              ) : filteredCompanies.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">Keine Firmen gefunden.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Versuchen Sie, Ihre Filter anzupassen.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredCompanies.map((company) => (
                    <Card
                      key={company.id}
                      className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-1"
                    >
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center text-3xl">
                                {company.logo}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg leading-tight">{company.name}</h3>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{company.service_areas.slice(0, 2).join(", ")}</span>
                                  {company.service_areas.length > 2 && (
                                    <span className="text-xs">+{company.service_areas.length - 2}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {company.verified && (
                              <div className="flex-shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-success" />
                              </div>
                            )}
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(company.rating)
                                      ? "fill-accent text-accent"
                                      : "text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-semibold text-sm">{company.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({company.review_count} Bewertungen)
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground line-clamp-2">{company.description}</p>

                          {/* Services */}
                          <div className="flex flex-wrap gap-1.5">
                            {company.services.slice(0, 3).map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {company.services.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{company.services.length - 3}
                              </Badge>
                            )}
                          </div>

                          {/* Price & CTA */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Preisniveau: </span>
                              <span className="font-medium text-primary">{company.price_level}</span>
                            </div>
                          </div>

                          <Link to={`/firmen/${company.id}`}>
                            <Button className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                              Profil ansehen
                              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Companies;
