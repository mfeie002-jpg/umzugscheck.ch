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

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Filters Sidebar */}
      <Card className="lg:col-span-1 h-fit sticky top-4">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filter
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Zurücksetzen
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Firma suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Accordion type="multiple" defaultValue={["cantons", "services", "price"]}>
            {/* Canton Filter */}
            <AccordionItem value="cantons">
              <AccordionTrigger className="text-sm font-medium">
                Kanton {selectedCantons.length > 0 && `(${selectedCantons.length})`}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {CANTONS.map(canton => (
                    <label key={canton} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={selectedCantons.includes(canton)}
                        onCheckedChange={() => toggleCanton(canton)}
                      />
                      {canton}
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Service Filter */}
            <AccordionItem value="services">
              <AccordionTrigger className="text-sm font-medium">
                Services {selectedServices.length > 0 && `(${selectedServices.length})`}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {SERVICES.map(service => (
                    <label key={service} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={selectedServices.includes(service)}
                        onCheckedChange={() => toggleService(service)}
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Price Level Filter */}
            <AccordionItem value="price">
              <AccordionTrigger className="text-sm font-medium">
                Preisniveau {selectedPriceLevels.length > 0 && `(${selectedPriceLevels.length})`}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {PRICE_LEVELS.map(level => (
                    <label key={level.value} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={selectedPriceLevels.includes(level.value)}
                        onCheckedChange={() => togglePriceLevel(level.value)}
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
              <AccordionTrigger className="text-sm font-medium">
                Mindestbewertung
              </AccordionTrigger>
              <AccordionContent>
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Alle Bewertungen</SelectItem>
                    <SelectItem value="3">⭐ 3.0+</SelectItem>
                    <SelectItem value="3.5">⭐ 3.5+</SelectItem>
                    <SelectItem value="4">⭐ 4.0+</SelectItem>
                    <SelectItem value="4.5">⭐ 4.5+</SelectItem>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="lg:col-span-3 space-y-4">
        {/* Sort & Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredCompanies.length} Umzugsfirmen gefunden
          </p>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Beste Bewertung</SelectItem>
              <SelectItem value="reviews">Meiste Bewertungen</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
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
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/firmen/${company.id}`)}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Logo */}
          <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                {company.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {company.name}
                  {company.verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      Geprüft
                    </Badge>
                  )}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
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
              <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/firmen/${company.id}`); }}>
                Offerte anfragen
              </Button>
            </div>

            {company.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {company.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              {company.services?.slice(0, 4).map(service => (
                <Badge key={service} variant="outline" className="text-xs">
                  {service}
                </Badge>
              ))}
              {company.services && company.services.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{company.services.length - 4} mehr
                </Badge>
              )}
            </div>

            {company.service_areas && company.service_areas.length > 0 && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {company.service_areas.slice(0, 3).join(", ")}
                {company.service_areas.length > 3 && ` +${company.service_areas.length - 3}`}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
