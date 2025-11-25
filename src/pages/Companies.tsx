import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OnboardingHint } from "@/components/OnboardingHint";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Star, MapPin, CheckCircle2, ArrowRight, Search, SlidersHorizontal, X, Phone, Mail, TrendingUp, AlertCircle, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useAnalytics } from "@/lib/analytics";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSkeletonCompany } from "@/components/LoadingSkeletonCompany";

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
  const analytics = useAnalytics();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCanton, setSelectedCanton] = useState(searchParams.get("canton") || "Alle Kantone");
  const [selectedRating, setSelectedRating] = useState("Alle");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    analytics.trackPageView('Companies List', '/firmen');
    fetchCompanies();
  }, []);

  useEffect(() => {
    // Track filter changes
    if (searchTerm || selectedCanton !== "Alle Kantone" || selectedRating !== "Alle") {
      analytics.trackFilterApplied({
        search: searchTerm,
        canton: selectedCanton,
        rating: selectedRating,
      });
    }

    // Trigger animation when filters change
    setIsAnimating(true);
    const timer = setTimeout(() => {
      filterCompanies();
      setIsAnimating(false);
    }, 150);
    
    return () => clearTimeout(timer);
  }, [companies, searchTerm, selectedCanton, selectedRating]);

  const fetchCompanies = async () => {
    setError(null);
    setLoading(true);
    
    try {
      // Import demo companies
      const { DEMO_COMPANIES } = await import("@/data/companies");
      
      // Transform to match Companies interface
      const transformed = DEMO_COMPANIES.map(c => ({
        id: c.id,
        name: c.name,
        logo: "",
        description: `Professioneller ${c.services_offered.slice(0, 2).join(' & ')}-Service`,
        services: c.services_offered,
        price_level: c.price_level === "günstig" ? "günstig" : c.price_level === "fair" ? "fair" : "premium",
        rating: c.rating,
        review_count: c.review_count,
        service_areas: c.service_areas,
        verified: true,
        phone: "+41 44 123 45 67",
        email: `info@${c.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.ch`,
        website: `https://www.${c.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.ch`,
      }));
      
      setCompanies(transformed);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Fehler beim Laden der Firmen';
      setError(errorMsg);
      analytics.trackError('companies_fetch_error', { error: errorMsg });
      console.error("Error fetching companies:", err);
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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCanton("Alle Kantone");
    setSelectedRating("Alle");
  };

  const hasActiveFilters = searchTerm || selectedCanton !== "Alle Kantone" || selectedRating !== "Alle";

  // Calculate company counts per canton
  const cantonCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    companies.forEach((company) => {
      company.service_areas.forEach((area) => {
        counts[area] = (counts[area] || 0) + 1;
      });
    });
    
    return counts;
  }, [companies]);

  const getCantonDisplayName = (canton: string) => {
    if (canton === "Alle Kantone") {
      return `${canton} (${companies.length})`;
    }
    const count = cantonCounts[canton] || 0;
    return `${canton} (${count})`;
  };

  const FilterSection = () => (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Firma oder Service suchen..."
          className="pl-10 h-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Canton Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block flex items-center gap-1">
          Kanton
          <OnboardingHint content="Filtern Sie Umzugsfirmen nach Ihrem gewünschten Servicegebiet." />
        </label>
        <Select value={selectedCanton} onValueChange={setSelectedCanton}>
          <SelectTrigger className="h-12">
            <MapPin className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SWISS_CANTONS.map((canton) => (
              <SelectItem key={canton} value={canton}>
                {getCantonDisplayName(canton)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block flex items-center gap-1">
          Mindestbewertung
          <OnboardingHint content="Zeigen Sie nur Firmen mit einer bestimmten Mindestbewertung an, um Qualität zu garantieren." />
        </label>
        <Select value={selectedRating} onValueChange={setSelectedRating}>
          <SelectTrigger className="h-12">
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

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
        >
          <X className="w-4 h-4 mr-2" />
          Filter zurücksetzen
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Header */}
        <section className="py-20 md:py-28 gradient-hero text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
                <TrendingUp className="w-3 h-3 mr-1" />
                Über 200 geprüfte Firmen
              </Badge>
              <h1 className="mb-6">Umzugsfirmen in der Schweiz</h1>
              <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed mb-6">
                Finden Sie geprüfte Umzugsunternehmen in Ihrer Region.<br />
                Vergleichen Sie Preise, Bewertungen und Services – kostenlos & unverbindlich.
              </p>
              <Link to="/vergleichen">
                <Button size="lg" variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Firmen direkt vergleichen
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Filters & Search - Desktop */}
        <section className="py-6 bg-white border-b sticky top-16 z-40 shadow-soft">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Desktop Filters */}
              <div className="hidden md:block">
                <div className="flex gap-4 mb-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Firma oder Service suchen..."
                      className="pl-10 h-12"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Canton Filter */}
                  <Select value={selectedCanton} onValueChange={setSelectedCanton}>
                    <SelectTrigger className="w-64 h-12">
                      <MapPin className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SWISS_CANTONS.map((canton) => (
                        <SelectItem key={canton} value={canton}>
                          {getCantonDisplayName(canton)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Rating Filter */}
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger className="w-48 h-12">
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

                {/* Active Filters & Results Count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-muted-foreground">
                      {filteredCompanies.length} {filteredCompanies.length === 1 ? "Firma" : "Firmen"}
                    </span>
                    {hasActiveFilters && (
                      <>
                        <span className="text-sm text-muted-foreground">•</span>
                        <div className="flex items-center gap-2">
                          {searchTerm && (
                            <Badge variant="secondary" className="gap-1">
                              Suche: {searchTerm}
                              <X
                                className="w-3 h-3 cursor-pointer hover:text-destructive"
                                onClick={() => setSearchTerm("")}
                              />
                            </Badge>
                          )}
                          {selectedCanton !== "Alle Kantone" && (
                            <Badge variant="secondary" className="gap-1">
                              {selectedCanton}
                              <X
                                className="w-3 h-3 cursor-pointer hover:text-destructive"
                                onClick={() => setSelectedCanton("Alle Kantone")}
                              />
                            </Badge>
                          )}
                          {selectedRating !== "Alle" && (
                            <Badge variant="secondary" className="gap-1">
                              {selectedRating}+ ⭐
                              <X
                                className="w-3 h-3 cursor-pointer hover:text-destructive"
                                onClick={() => setSelectedRating("Alle")}
                              />
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-7 text-xs"
                          >
                            Alle zurücksetzen
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Search & Filter Button */}
              <div className="md:hidden space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Firma suchen..."
                    className="pl-10 h-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {filteredCompanies.length} {filteredCompanies.length === 1 ? "Firma" : "Firmen"}
                  </span>
                  
                  <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filter
                        {hasActiveFilters && (
                          <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                            {[searchTerm, selectedCanton !== "Alle Kantone", selectedRating !== "Alle"].filter(Boolean).length}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[80vh]">
                      <SheetHeader>
                        <SheetTitle>Filter</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSection />
                      </div>
                      <div className="mt-6">
                        <Button
                          className="w-full"
                          onClick={() => setIsFilterOpen(false)}
                        >
                          {filteredCompanies.length} {filteredCompanies.length === 1 ? "Firma" : "Firmen"} anzeigen
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Grid */}
        <section className="py-12 md:py-16 bg-gradient-light">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fetchCompanies}
                      className="ml-4"
                    >
                      Erneut versuchen
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {loading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <LoadingSkeletonCompany key={index} />
                  ))}
                </div>
              ) : filteredCompanies.length === 0 ? (
                <Card className="text-center py-16">
                  <CardContent>
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                        <Search className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold">Keine Firmen gefunden</h3>
                      <p className="text-muted-foreground">
                        Versuchen Sie, Ihre Filter anzupassen oder eine andere Suche durchzuführen.
                      </p>
                      {hasActiveFilters && (
                        <Button onClick={clearFilters} variant="outline">
                          <X className="w-4 h-4 mr-2" />
                          Filter zurücksetzen
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className={`grid md:grid-cols-2 gap-6 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                  {filteredCompanies.map((company, index) => (
                    <ScrollReveal key={company.id} delay={index * 50}>
                      <Card className="h-full hover-lift border-2 hover:border-primary/20 transition-all duration-300 bg-white"
                    >
                        <CardContent className="p-6 h-full flex flex-col">
                          <div className="space-y-5 flex-1">
                            {/* Header */}
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-light to-primary/5 flex items-center justify-center text-4xl shadow-soft flex-shrink-0">
                                {company.logo}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h3 className="font-bold text-xl leading-tight">{company.name}</h3>
                                  {company.verified && (
                                    <Badge className="bg-success text-white border-0 flex-shrink-0">
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      Geprüft
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="truncate">{company.service_areas.slice(0, 2).join(", ")}</span>
                                  {company.service_areas.length > 2 && (
                                    <span className="text-xs font-medium">+{company.service_areas.length - 2}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-3 p-3 bg-accent-light/30 rounded-lg">
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
                              <span className="font-bold text-lg">{company.rating}</span>
                              <span className="text-sm text-muted-foreground">
                                ({company.review_count})
                              </span>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {company.description}
                            </p>

                            {/* Services */}
                            <div>
                              <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                                Services
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {company.services.slice(0, 3).map((service, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs font-medium">
                                    {service}
                                  </Badge>
                                ))}
                                {company.services.length > 3 && (
                                  <Badge variant="secondary" className="text-xs font-medium">
                                    +{company.services.length - 3} weitere
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Price & Contact Info */}
                            <div className="pt-4 border-t space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Preisniveau</span>
                                <span className="font-bold text-primary text-lg">{company.price_level}</span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {company.phone && (
                                  <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Phone className="w-3.5 h-3.5" />
                                    <span className="truncate">Telefon</span>
                                  </div>
                                )}
                                {company.email && (
                                  <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span className="truncate">E-Mail</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <Link 
                            to={`/firmen/${company.id}`} 
                            className="mt-5"
                            onClick={() => analytics.trackCompanyClicked(company.id, company.name, 'view_profile')}
                          >
                            <Button className="w-full h-12 bg-primary hover:bg-primary-dark shadow-medium group">
                              Profil ansehen
                              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
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
