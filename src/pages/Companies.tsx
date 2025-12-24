import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { OnboardingHint } from "@/components/OnboardingHint";
import { OffertenCTA } from "@/components/OffertenCTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Star, MapPin, CheckCircle2, ArrowRight, Search, SlidersHorizontal, X, Phone, Mail, TrendingUp, AlertCircle, BarChart3, Calendar as CalendarIcon, Clock, Bell, Heart, Calculator, Scale, LayoutGrid, TableProperties } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useAnalytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import AvailabilityNotificationDialog from "@/components/AvailabilityNotificationDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSkeletonCompany } from "@/components/LoadingSkeletonCompany";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHaptic } from "@/hooks/use-haptic";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { PullToRefreshIndicator } from "@/components/PullToRefreshIndicator";
import { generateMetaData, generateOGTags } from "@/lib/seo-meta";
import { generatePageSchemas, generateSchemaScript } from "@/lib/schema-markup";
import { getKeywordsForPage } from "@/lib/seo-keywords";
import CantonComparisonWidget from "@/components/CantonComparisonWidget";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import FavoriteCompanies, { useFavorites } from "@/components/FavoriteCompanies";
import CompanyCertifications from "@/components/CompanyCertifications";
import CompanyMatchScore from "@/components/CompanyMatchScore";
import SmartSearchFilters from "@/components/SmartSearchFilters";
import SavedSearches from "@/components/SavedSearches";
import CompanyComparisonTable from "@/components/CompanyComparisonTable";
import { useABTest } from "@/hooks/use-ab-test";
import { StickyFavoritesCTA } from "@/components/StickyFavoritesCTA";

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
  availability?: {
    status: 'available' | 'limited' | 'busy';
    nextAvailable: string;
    slotsThisWeek: number;
  };
}

const SWISS_CANTONS = [
  "Alle Kantone",
  "Aargau", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "Basel-Landschaft", "Basel-Stadt",
  "Bern", "Freiburg", "Genève", "Glarus", "Graubünden", "Jura", "Luzern", "Neuchâtel",
  "Nidwalden", "Obwalden", "Schaffhausen", "Schwyz", "Solothurn", "St. Gallen", "Thurgau",
  "Ticino", "Uri", "Vaud", "Valais", "Zug", "Zürich"
];

const PRICE_LEVELS = ["Alle Preisstufen", "günstig", "fair", "premium"];

const SERVICE_TYPES = [
  "Alle Services",
  "Umzug",
  "Firmenumzug",
  "Reinigung",
  "Lagerung",
  "Packservice",
  "Entsorgung",
  "Möbelmontage",
];

const SORT_OPTIONS = [
  { value: "empfohlen", label: "Empfohlen" },
  { value: "rating", label: "Beste Bewertung" },
  { value: "reviews", label: "Meiste Bewertungen" },
  { value: "guenstig", label: "Günstigste zuerst" },
];

const Companies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const analytics = useAnalytics();
  const isMobile = useIsMobile();
  const { trigger } = useHaptic();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCanton, setSelectedCanton] = useState(searchParams.get("canton") || searchParams.get("region") || "Alle Kantone");
  const [selectedRating, setSelectedRating] = useState("Alle");
  const [selectedPriceLevel, setSelectedPriceLevel] = useState("Alle Preisstufen");
  const [selectedService, setSelectedService] = useState("Alle Services");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState("empfohlen");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPriceChart, setShowPriceChart] = useState(false);
  
  // A/B Test for default view mode
  const { variant: viewModeVariant, trackConversion: trackViewMode } = useABTest('company_view_mode');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  // Set initial view mode based on A/B test
  useEffect(() => {
    if (viewModeVariant === 'variant_a') {
      setViewMode('table');
    }
  }, [viewModeVariant]);
  
  const handleViewModeChange = (mode: 'cards' | 'table') => {
    setViewMode(mode);
    trackViewMode(`view_mode_${mode}`);
  };

  // SEO Data
  const currentUrl = 'https://www.umzugscheck.ch/firmen/';
  
  // Schema.org - Generate company list schema when companies are loaded
  const companySchemas = useMemo(() => {
    if (companies.length > 0) {
      const companyItems = companies.slice(0, 10).map(c => ({
        name: c.name,
        rating: c.rating,
        reviewCount: c.review_count
      }));
      
      return generatePageSchemas(
        { type: 'vergleich' as const, url: currentUrl },
        undefined,
        companyItems
      );
    }
    return generatePageSchemas({ type: 'vergleich' as const, url: currentUrl });
  }, [companies, currentUrl]);
  
  const schemaScript = generateSchemaScript(companySchemas);

  const handleRefresh = async () => {
    await fetchCompanies();
    trigger('success');
  };

  const { isPulling, isRefreshing, pullDistance, threshold } = usePullToRefresh({
    onRefresh: handleRefresh
  });

  useEffect(() => {
    analytics.trackPageView('Companies List', '/firmen');
    fetchCompanies();
  }, []);

  useEffect(() => {
    // Track filter changes
    if (searchTerm || selectedCanton !== "Alle Kantone" || selectedRating !== "Alle" || selectedPriceLevel !== "Alle Preisstufen" || selectedService !== "Alle Services" || selectedDate) {
      analytics.trackFilterApplied({
        search: searchTerm,
        canton: selectedCanton,
        rating: selectedRating,
        priceLevel: selectedPriceLevel,
        service: selectedService,
        date: selectedDate?.toISOString(),
        sortBy: sortBy,
      });
    }

    // Trigger animation when filters change
    setIsAnimating(true);
    const timer = setTimeout(() => {
      filterCompanies();
      setIsAnimating(false);
    }, 150);
    
    return () => clearTimeout(timer);
  }, [companies, searchTerm, selectedCanton, selectedRating, selectedPriceLevel, selectedService, selectedDate, sortBy]);

  const fetchCompanies = async () => {
    setError(null);
    setLoading(true);
    
    try {
      // Import demo companies
      const { DEMO_COMPANIES } = await import("@/data/companies");
      
      // Generate simulated availability data
      const generateAvailability = (index: number) => {
        const statuses: Array<'available' | 'limited' | 'busy'> = ['available', 'limited', 'busy'];
        const status = statuses[index % 3];
        const daysFromNow = Math.floor(Math.random() * 14) + 1;
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + daysFromNow);
        const slotsThisWeek = status === 'available' ? Math.floor(Math.random() * 5) + 3 : 
                             status === 'limited' ? Math.floor(Math.random() * 2) + 1 : 0;
        
        return {
          status,
          nextAvailable: nextDate.toLocaleDateString('de-CH', { day: 'numeric', month: 'short' }),
          slotsThisWeek,
        };
      };
      
      // Transform to match Companies interface
      const transformed = DEMO_COMPANIES.map((c, index) => ({
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
        availability: generateAvailability(index),
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

    // Price level filter
    if (selectedPriceLevel !== "Alle Preisstufen") {
      filtered = filtered.filter((company) => company.price_level === selectedPriceLevel);
    }

    // Service type filter
    if (selectedService !== "Alle Services") {
      filtered = filtered.filter((company) => 
        company.services.some(s => s.toLowerCase().includes(selectedService.toLowerCase()))
      );
    }

    // Date availability filter - prioritize available companies
    if (selectedDate) {
      // Sort by availability status when date is selected
      filtered.sort((a, b) => {
        const statusOrder = { 'available': 0, 'limited': 1, 'busy': 2 };
        const aOrder = statusOrder[a.availability?.status || 'busy'];
        const bOrder = statusOrder[b.availability?.status || 'busy'];
        return aOrder - bOrder;
      });
    }

    // Sorting
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        filtered.sort((a, b) => b.review_count - a.review_count);
        break;
      case "guenstig":
        const priceOrder = { "günstig": 1, "fair": 2, "premium": 3 };
        filtered.sort((a, b) => (priceOrder[a.price_level as keyof typeof priceOrder] || 2) - (priceOrder[b.price_level as keyof typeof priceOrder] || 2));
        break;
      default: // empfohlen - combine rating and reviews
        filtered.sort((a, b) => (b.rating * 10 + Math.log(b.review_count + 1)) - (a.rating * 10 + Math.log(a.review_count + 1)));
    }

    setFilteredCompanies(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCanton("Alle Kantone");
    setSelectedRating("Alle");
    setSelectedPriceLevel("Alle Preisstufen");
    setSelectedService("Alle Services");
    setSelectedDate(undefined);
    setSortBy("empfohlen");
  };

  const hasActiveFilters = searchTerm || selectedCanton !== "Alle Kantone" || selectedRating !== "Alle" || selectedPriceLevel !== "Alle Preisstufen" || selectedService !== "Alle Services" || selectedDate;

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

      {/* Price Level Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block flex items-center gap-1">
          Preisstufe
          <OnboardingHint content="Filtern Sie nach Preiskategorie: günstig, fair oder premium." />
        </label>
        <Select value={selectedPriceLevel} onValueChange={setSelectedPriceLevel}>
          <SelectTrigger className="h-12">
            <TrendingUp className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRICE_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level === "Alle Preisstufen" ? level : level.charAt(0).toUpperCase() + level.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Service Type Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block flex items-center gap-1">
          Service-Typ
          <OnboardingHint content="Filtern Sie nach angebotenen Services." />
        </label>
        <Select value={selectedService} onValueChange={setSelectedService}>
          <SelectTrigger className="h-12">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_TYPES.map((service) => (
              <SelectItem key={service} value={service}>
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Moving Date Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block flex items-center gap-1">
          <CalendarIcon className="w-4 h-4" />
          Umzugsdatum
          <OnboardingHint content="Zeigen Sie Firmen, die an Ihrem Wunschdatum verfügbar sind." />
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-12",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "PPP", { locale: de })
              ) : (
                <span>Datum wählen</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        {selectedDate && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-8 text-xs"
            onClick={() => setSelectedDate(undefined)}
          >
            <X className="w-3 h-3 mr-1" />
            Datum entfernen
          </Button>
        )}
      </div>

      {/* Sort By */}
      <div>
        <label className="text-sm font-medium mb-2 block">Sortierung</label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-12">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notification Signup */}
      <div className="pt-2 border-t">
        <AvailabilityNotificationDialog
          canton={selectedCanton !== "Alle Kantone" ? selectedCanton : undefined}
          triggerButton={
            <Button variant="outline" className="w-full gap-2">
              <Bell className="w-4 h-4" />
              Benachrichtigung aktivieren
            </Button>
          }
        />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Erhalten Sie eine E-Mail bei neuen Verfügbarkeiten
        </p>
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
    <>
      <OptimizedSEO
        title="Umzugsfirmen Schweiz | 200+ Anbieter vergleichen & Offerten erhalten"
        description="Vergleichen Sie 200+ Umzugsfirmen in der Schweiz. Echte Bewertungen, transparente Preise und kostenlose Offerten – in wenigen Minuten."
        keywords="umzugsfirmen schweiz, umzugsunternehmen schweiz, umzugsfirmen vergleichen, zügelunternehmen, umzugsfirma finden"
        canonicalUrl={currentUrl}
        schemaMarkup={companySchemas}
      />
      
      <div className="min-h-screen flex flex-col">
      
      <PullToRefreshIndicator 
        isPulling={isPulling}
        isRefreshing={isRefreshing}
        pullDistance={pullDistance}
        threshold={threshold}
      />
      
      <main className="flex-1">
        {/* Header */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-28 gradient-hero text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
                <TrendingUp className="w-3 h-3 mr-1" />
                Über 200 geprüfte Firmen
              </Badge>
              <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Umzugsfirmen in der Schweiz</h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light leading-relaxed mb-4 sm:mb-6 px-4">
                Finden Sie geprüfte Umzugsunternehmen in Ihrer Region.<br className="hidden sm:inline" />
                Vergleichen Sie Preise, Bewertungen und Services – kostenlos & unverbindlich.
              </p>
              <Link to="/vergleichen">
                <Button size="lg" variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm text-sm sm:text-base">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Firmen direkt vergleichen
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Filters & Search - Desktop */}
        <section className="py-4 sm:py-6 bg-white border-b sticky top-14 sm:top-16 z-40 shadow-soft">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Desktop Filters */}
              <div className="hidden md:block">
                <div className="flex gap-3 lg:gap-4 mb-3 lg:mb-4">
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
                    <SelectTrigger className="w-52 lg:w-64 h-12">
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
                    <SelectTrigger className="w-40 lg:w-48 h-12">
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
                  
                  {/* View Toggle */}
                  <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                    <Button
                      variant={viewMode === 'cards' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-8 px-3 gap-1.5"
                      onClick={() => handleViewModeChange('cards')}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      <span className="hidden lg:inline">Karten</span>
                    </Button>
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-8 px-3 gap-1.5"
                      onClick={() => handleViewModeChange('table')}
                    >
                      <TableProperties className="w-4 h-4" />
                      <span className="hidden lg:inline">Tabelle</span>
                    </Button>
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
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filter
                    {hasActiveFilters && (
                      <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                        {[searchTerm, selectedCanton !== "Alle Kantone", selectedRating !== "Alle"].filter(Boolean).length}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {/* Mobile Filter Bottom Sheet */}
              <BottomSheet 
                isOpen={isFilterOpen} 
                onClose={() => setIsFilterOpen(false)}
                title="Filter anwenden"
              >
                <div className="space-y-6">
                  {/* Canton Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Kanton
                    </label>
                    <Select value={selectedCanton} onValueChange={setSelectedCanton}>
                      <SelectTrigger className="w-full h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[60]">
                        {SWISS_CANTONS.map((canton) => (
                          <SelectItem key={canton} value={canton}>
                            {getCantonDisplayName(canton)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Mindestbewertung
                    </label>
                    <Select value={selectedRating} onValueChange={setSelectedRating}>
                      <SelectTrigger className="w-full h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[60]">
                        <SelectItem value="Alle">Alle Bewertungen</SelectItem>
                        <SelectItem value="4.5">4.5+ Sterne</SelectItem>
                        <SelectItem value="4.0">4.0+ Sterne</SelectItem>
                        <SelectItem value="3.5">3.5+ Sterne</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Apply Button */}
                  <div className="flex gap-2 pt-4">
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          clearFilters();
                          setIsFilterOpen(false);
                        }}
                        className="flex-1"
                      >
                        Zurücksetzen
                      </Button>
                    )}
                    <Button
                      onClick={() => setIsFilterOpen(false)}
                      className="flex-1"
                    >
                      Anwenden ({filteredCompanies.length})
                    </Button>
                  </div>
                </div>
              </BottomSheet>
            </div>
          </div>
        </section>

        {/* Enhanced Toolbar */}
        <section className="py-3 bg-muted/30 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <FavoriteCompanies />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPriceChart(!showPriceChart)}
                  className={showPriceChart ? "bg-primary/10 border-primary" : ""}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Preistrends
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  Aktualisiert: heute
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Price Chart Panel */}
        {showPriceChart && (
          <section className="py-6 bg-white border-b">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <PriceHistoryChart selectedCanton={selectedCanton !== "Alle Kantone" ? selectedCanton : "Zürich"} />
              </div>
            </div>
          </section>
        )}

        {/* Companies Grid with Sidebar */}
        <section className="py-12 md:py-16 bg-gradient-light">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar - Desktop Only */}
                <aside className="hidden lg:block w-80 flex-shrink-0 space-y-6">
                  <SmartSearchFilters onSearch={(filters) => {
                    if (filters.query) setSearchTerm(filters.query);
                    if (filters.minRating) setSelectedRating(filters.minRating.toString());
                  }} />
                  <SavedSearches onSearchSelect={(search) => {
                    if (search.filters.region) setSelectedCanton(search.filters.region);
                    if (search.filters.maxPrice) setSelectedPriceLevel(search.filters.maxPrice < 2000 ? "günstig" : search.filters.maxPrice < 4000 ? "fair" : "premium");
                  }} />
                </aside>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
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
                  ) : viewMode === 'table' ? (
                    /* Table View */
                    <CompanyComparisonTable 
                      companies={filteredCompanies.map(c => ({
                        id: c.id,
                        name: c.name,
                        rating: c.rating,
                        review_count: c.review_count,
                        price_level: c.price_level,
                        services: c.services,
                        service_areas: c.service_areas,
                        verified: c.verified,
                        availability: c.availability
                      }))}
                    />
                  ) : (
                    /* Cards View */
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                  {filteredCompanies.map((company, index) => (
                    <ScrollReveal key={company.id} delay={index * 50}>
                      <Card className="h-full hover-lift border-2 hover:border-primary/20 transition-all duration-300 bg-white">
                        <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                          <div className="space-y-4 sm:space-y-5 flex-1">
                            {/* Header with Favorite Button */}
                            <div className="flex items-start gap-3 sm:gap-4">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary-light to-primary/5 flex items-center justify-center text-2xl sm:text-4xl shadow-soft flex-shrink-0">
                                {company.logo || company.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h3 className="font-bold text-lg sm:text-xl leading-tight truncate">{company.name}</h3>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 flex-shrink-0"
                                    onClick={() => toggleFavorite({
                                      id: company.id,
                                      name: company.name,
                                      rating: company.rating,
                                      price_level: company.price_level
                                    })}
                                  >
                                    <Heart className={`w-5 h-5 ${isFavorite(company.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                                  </Button>
                                </div>
                                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                  <span className="truncate">{company.service_areas.slice(0, 2).join(", ")}</span>
                                  {company.service_areas.length > 2 && (
                                    <span className="text-xs font-medium flex-shrink-0">+{company.service_areas.length - 2}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Certifications */}
                            <CompanyCertifications 
                              companyId={company.id}
                              isVerified={company.verified}
                              yearsInBusiness={10 + (index % 15)}
                              certifications={index % 2 === 0 ? ["iso9001", "famo"] : ["astag"]}
                              isEcoFriendly={index % 3 === 0}
                            />

                            {/* Match Score */}
                            <CompanyMatchScore
                              companyId={company.id}
                              companyName={company.name}
                              userCanton={selectedCanton !== "Alle Kantone" ? selectedCanton : "Zürich"}
                              companyAreas={company.service_areas}
                              companyServices={company.services}
                              companyRating={company.rating}
                              isVerified={company.verified}
                            />

                            {/* Rating */}
                            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-accent-light/30 rounded-lg">
                              <div className="flex items-center gap-0.5 sm:gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                      i < Math.floor(company.rating)
                                        ? "fill-accent text-accent"
                                        : "fill-muted text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-bold text-base sm:text-lg">{company.rating}</span>
                              <span className="text-xs sm:text-sm text-muted-foreground">
                                ({company.review_count} Bewertungen)
                              </span>
                            </div>

                            {/* Description */}
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {company.description}
                            </p>

                            {/* Services */}
                            <div>
                              <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                                Services
                              </div>
                              <div className="flex flex-wrap gap-1.5 sm:gap-2">
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

                            {/* Availability Indicator */}
                            {company.availability && (
                              <div className={`flex items-center gap-2 p-2.5 rounded-lg text-xs sm:text-sm ${
                                company.availability.status === 'available' 
                                  ? 'bg-green-50 text-green-700 border border-green-100' 
                                  : company.availability.status === 'limited'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-red-50 text-red-700 border border-red-100'
                              }`}>
                                <div className={`w-2 h-2 rounded-full animate-pulse ${
                                  company.availability.status === 'available' ? 'bg-green-500' :
                                  company.availability.status === 'limited' ? 'bg-amber-500' : 'bg-red-500'
                                }`} />
                                <CalendarIcon className="w-3.5 h-3.5" />
                                <span className="font-medium">
                                  {company.availability.status === 'available' && (
                                    <>{company.availability.slotsThisWeek} Termine diese Woche</>
                                  )}
                                  {company.availability.status === 'limited' && (
                                    <>Nur {company.availability.slotsThisWeek} Platz frei</>
                                  )}
                                  {company.availability.status === 'busy' && (
                                    <>Nächster Termin: {company.availability.nextAvailable}</>
                                  )}
                                </span>
                              </div>
                            )}

                            {/* Price & Contact Info */}
                            <div className="flex items-center justify-between pt-2 border-t border-border/50">
                              <Badge variant="outline" className={`text-xs sm:text-sm font-semibold ${
                                company.price_level === 'günstig' ? 'bg-green-50 text-green-700 border-green-200' :
                                company.price_level === 'fair' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-purple-50 text-purple-700 border-purple-200'
                              }`}>
                                <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                                {company.price_level}
                              </Badge>
                              
                              {company.verified && (
                                <Badge className="bg-green-100 text-green-700 border-0 gap-1 text-xs">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Verifiziert
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="pt-4 sm:pt-5 space-y-2 sm:space-y-3 mt-auto border-t border-border/50">
                            <Link 
                              to={`/firmen/${company.id}`} 
                              onClick={() => analytics.trackCompanyClicked(company.id, company.name, 'view_profile')}
                            >
                              <Button className="w-full h-11 sm:h-12 bg-primary hover:bg-primary-dark shadow-medium group text-sm sm:text-base">
                                Profil ansehen
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                            
                            {/* Notification button for busy companies */}
                            {company.availability?.status === 'busy' && (
                              <AvailabilityNotificationDialog
                                companyName={company.name}
                                canton={company.service_areas[0]}
                                triggerButton={
                                  <Button variant="outline" className="w-full h-10 gap-2 text-sm">
                                    <Bell className="w-4 h-4" />
                                    Benachrichtigen wenn verfügbar
                                  </Button>
                                }
                              />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
                  ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Canton Comparison Widget */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <CantonComparisonWidget />
            </div>
          </div>
        </section>

        {/* Offerten CTA Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <OffertenCTA 
              variant="compact"
              showBenefits
            />
          </div>
        </section>
      </main>
      
      {/* Sticky CTA when favorites >= 2 */}
      <StickyFavoritesCTA />
    </div>
    </>
  );
};

export default Companies;
