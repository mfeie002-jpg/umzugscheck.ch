import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Filter, Star, MapPin, Phone, ExternalLink, X } from "lucide-react";
import { useCompanies, Company } from "@/hooks/useCompanies";

const CANTONS = [
  "Zürich", "Bern", "Luzern", "Uri", "Schwyz", "Obwalden", "Nidwalden",
  "Glarus", "Zug", "Fribourg", "Solothurn", "Basel-Stadt", "Basel-Land",
  "Schaffhausen", "Appenzell", "St. Gallen", "Graubünden", "Aargau",
  "Thurgau", "Tessin", "Waadt", "Wallis", "Neuenburg", "Genf", "Jura"
];

const SERVICES = [
  "Privatumzug", "Firmenumzug", "Reinigung", "Entsorgung", 
  "Einlagerung", "Möbelmontage", "Internationale Umzüge", 
  "Spezialtransporte", "Räumungen"
];

const PRICE_LEVELS = [
  { value: "günstig", label: "Günstig", color: "bg-green-100 text-green-800" },
  { value: "fair", label: "Fair", color: "bg-blue-100 text-blue-800" },
  { value: "premium", label: "Premium", color: "bg-purple-100 text-purple-800" },
];

export const CompanySearch = () => {
  const navigate = useNavigate();
  const { data: companies, isLoading } = useCompanies();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCantons, setSelectedCantons] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPriceLevels, setSelectedPriceLevels] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<string>("0");
  const [sortBy, setSortBy] = useState<string>("rating");

  const toggleCanton = (canton: string) => {
    setSelectedCantons(prev =>
      prev.includes(canton) ? prev.filter(c => c !== canton) : [...prev, canton]
    );
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const togglePriceLevel = (level: string) => {
    setSelectedPriceLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCantons([]);
    setSelectedServices([]);
    setSelectedPriceLevels([]);
    setMinRating("0");
  };

  const filteredCompanies = useMemo(() => {
    if (!companies) return [];

    let filtered = companies.filter(company => {
      // Search query
      if (searchQuery && !company.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Canton filter
      if (selectedCantons.length > 0) {
        const hasMatchingCanton = company.service_areas?.some(area =>
          selectedCantons.some(canton => area.toLowerCase().includes(canton.toLowerCase()))
        );
        if (!hasMatchingCanton) return false;
      }

      // Service filter
      if (selectedServices.length > 0) {
        const hasMatchingService = company.services?.some(service =>
          selectedServices.includes(service)
        );
        if (!hasMatchingService) return false;
      }

      // Price level filter
      if (selectedPriceLevels.length > 0 && company.price_level) {
        if (!selectedPriceLevels.includes(company.price_level)) return false;
      }

      // Rating filter
      if (minRating !== "0" && company.rating) {
        if (company.rating < parseFloat(minRating)) return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "reviews":
          return (b.review_count || 0) - (a.review_count || 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [companies, searchQuery, selectedCantons, selectedServices, selectedPriceLevels, minRating, sortBy]);

  const activeFiltersCount = selectedCantons.length + selectedServices.length + selectedPriceLevels.length + (minRating !== "0" ? 1 : 0);

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button 
          variant="outline" 
          className="w-full h-12 justify-between active:scale-[0.98] transition-transform"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <span className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Sortierung
          </span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Sidebar - Desktop always visible, Mobile collapsible */}
      <Card className={`lg:col-span-1 h-fit lg:sticky lg:top-4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Filter className="h-5 w-5" />
              Filter
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-10 px-3 active:scale-95 transition-transform"
              >
                <X className="h-4 w-4 mr-1" />
                Zurücksetzen
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Firma suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 sm:h-10"
            />
          </div>

          <Accordion type="multiple" defaultValue={["cantons", "services", "price"]}>
            {/* Canton Filter */}
            <AccordionItem value="cantons">
              <AccordionTrigger className="text-sm font-medium py-3 sm:py-2">
                Kanton {selectedCantons.length > 0 && `(${selectedCantons.length})`}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto">
                  {CANTONS.map(canton => (
                    <label 
                      key={canton} 
                      className="flex items-center gap-2.5 text-sm cursor-pointer py-2.5 px-2 rounded-md hover:bg-muted active:bg-muted/80 transition-colors"
                    >
                      <Checkbox
                        checked={selectedCantons.includes(canton)}
                        onCheckedChange={() => toggleCanton(canton)}
                        className="h-5 w-5"
                      />
                      {canton}
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Service Filter */}
            <AccordionItem value="services">
              <AccordionTrigger className="text-sm font-medium py-3 sm:py-2">
                Services {selectedServices.length > 0 && `(${selectedServices.length})`}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1">
                  {SERVICES.map(service => (
                    <label 
                      key={service} 
                      className="flex items-center gap-2.5 text-sm cursor-pointer py-2.5 px-2 rounded-md hover:bg-muted active:bg-muted/80 transition-colors"
                    >
                      <Checkbox
                        checked={selectedServices.includes(service)}
                        onCheckedChange={() => toggleService(service)}
                        className="h-5 w-5"
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Price Level Filter */}
            <AccordionItem value="price">
              <AccordionTrigger className="text-sm font-medium py-3 sm:py-2">
                Preisniveau {selectedPriceLevels.length > 0 && `(${selectedPriceLevels.length})`}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1">
                  {PRICE_LEVELS.map(level => (
                    <label 
                      key={level.value} 
                      className="flex items-center gap-2.5 text-sm cursor-pointer py-2.5 px-2 rounded-md hover:bg-muted active:bg-muted/80 transition-colors"
                    >
                      <Checkbox
                        checked={selectedPriceLevels.includes(level.value)}
                        onCheckedChange={() => togglePriceLevel(level.value)}
                        className="h-5 w-5"
                      />
                      <Badge variant="secondary" className={level.color}>
                        {level.label}
                      </Badge>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Rating Filter */}
            <AccordionItem value="rating">
              <AccordionTrigger className="text-sm font-medium py-3 sm:py-2">
                Mindestbewertung
              </AccordionTrigger>
              <AccordionContent>
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger className="h-11 sm:h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0" className="py-3 sm:py-2">Alle Bewertungen</SelectItem>
                    <SelectItem value="3" className="py-3 sm:py-2">⭐ 3.0+</SelectItem>
                    <SelectItem value="3.5" className="py-3 sm:py-2">⭐ 3.5+</SelectItem>
                    <SelectItem value="4" className="py-3 sm:py-2">⭐ 4.0+</SelectItem>
                    <SelectItem value="4.5" className="py-3 sm:py-2">⭐ 4.5+</SelectItem>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          {/* Mobile: Apply Filters Button */}
          <Button 
            className="w-full h-12 lg:hidden mt-4 active:scale-[0.98] transition-transform"
            onClick={() => setShowMobileFilters(false)}
          >
            {filteredCompanies.length} Ergebnisse anzeigen
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="lg:col-span-3 space-y-3 sm:space-y-4">
        {/* Sort & Results Count */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm sm:text-base text-muted-foreground">
            {filteredCompanies.length} Firmen
          </p>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 sm:w-48 h-11 sm:h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating" className="py-3 sm:py-2">Beste Bewertung</SelectItem>
              <SelectItem value="reviews" className="py-3 sm:py-2">Meiste Bewertungen</SelectItem>
              <SelectItem value="name" className="py-3 sm:py-2">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Company Cards */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-24 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Keine Umzugsfirmen gefunden. Versuchen Sie andere Filteroptionen.
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Filter zurücksetzen
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCompanies.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CompanyCard = ({ company }: { company: Company }) => {
  const navigate = useNavigate();
  const priceLevel = PRICE_LEVELS.find(p => p.value === company.price_level);

  return (
    <Card 
      className="hover:shadow-lg transition-all cursor-pointer active:scale-[0.99]" 
      onClick={() => navigate(`/firmen/${company.id}`)}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex gap-3 sm:gap-4">
          {/* Logo */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl font-bold text-muted-foreground">
                {company.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile: Stack layout, Desktop: Row layout */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2 flex-wrap">
                  <span className="truncate">{company.name}</span>
                  {company.verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs flex-shrink-0">
                      Geprüft
                    </Badge>
                  )}
                </h3>
                <div className="flex items-center gap-2 sm:gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                  {company.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {company.rating.toFixed(1)}
                      <span className="text-muted-foreground/60">
                        ({company.review_count || 0})
                      </span>
                    </span>
                  )}
                  {priceLevel && (
                    <Badge variant="secondary" className={priceLevel.color}>
                      {priceLevel.label}
                    </Badge>
                  )}
                </div>
              </div>
              {/* CTA Button - Full width on mobile */}
              <Button 
                size="sm" 
                className="w-full sm:w-auto h-10 sm:h-9 mt-2 sm:mt-0 active:scale-[0.98] transition-transform"
                onClick={(e) => { e.stopPropagation(); navigate(`/firmen/${company.id}`); }}
              >
                Offerte anfragen
              </Button>
            </div>

            {company.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 hidden sm:block">
                {company.description}
              </p>
            )}

            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
              {company.services?.slice(0, 3).map(service => (
                <Badge key={service} variant="outline" className="text-xs py-1 px-2">
                  {service}
                </Badge>
              ))}
              {company.services && company.services.length > 3 && (
                <Badge variant="outline" className="text-xs py-1 px-2">
                  +{company.services.length - 3}
                </Badge>
              )}
            </div>

            {company.service_areas && company.service_areas.length > 0 && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {company.service_areas.slice(0, 2).join(", ")}
                  {company.service_areas.length > 2 && ` +${company.service_areas.length - 2}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
