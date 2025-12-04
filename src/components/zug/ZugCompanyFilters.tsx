/**
 * Zug Company Filters Component
 * #49-58: Advanced filtering with animations
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, X, Star, MapPin, Truck, Clock, 
  TrendingDown, CheckCircle2, ChevronDown, ChevronUp,
  Sparkles, Shield, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FilterState {
  locations: string[];
  services: string[];
  minRating: number;
  priceLevel: string[];
  availability: string;
  sortBy: string;
}

interface ZugCompanyFiltersProps {
  locations: string[];
  onFilterChange: (filters: FilterState) => void;
  activeFiltersCount: number;
}

const services = [
  { id: "privatumzug", label: "Privatumzug", icon: "🏠" },
  { id: "firmenumzug", label: "Firmenumzug", icon: "🏢" },
  { id: "reinigung", label: "Reinigung", icon: "✨" },
  { id: "entsorgung", label: "Entsorgung", icon: "🗑️" },
  { id: "einlagerung", label: "Einlagerung", icon: "📦" },
  { id: "moebellift", label: "Möbellift", icon: "🏗️" },
];

const priceLevels = [
  { id: "guenstig", label: "Günstig", color: "bg-green-100 text-green-700" },
  { id: "mittel", label: "Mittel", color: "bg-blue-100 text-blue-700" },
  { id: "premium", label: "Premium", color: "bg-purple-100 text-purple-700" },
];

const sortOptions = [
  { id: "empfohlen", label: "Empfohlen", icon: Sparkles },
  { id: "rating", label: "Beste Bewertung", icon: Star },
  { id: "price", label: "Günstigste", icon: TrendingDown },
  { id: "availability", label: "Schnell verfügbar", icon: Clock },
];

export const ZugCompanyFilters = ({ 
  locations, 
  onFilterChange, 
  activeFiltersCount 
}: ZugCompanyFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    locations: [],
    services: [],
    minRating: 4.0,
    priceLevel: [],
    availability: "all",
    sortBy: "empfohlen",
  });

  const [expandedSections, setExpandedSections] = useState({
    location: true,
    services: true,
    rating: false,
    price: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleLocation = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter(l => l !== location)
      : [...filters.locations, location];
    
    const newFilters = { ...filters, locations: newLocations };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleService = (serviceId: string) => {
    const newServices = filters.services.includes(serviceId)
      ? filters.services.filter(s => s !== serviceId)
      : [...filters.services, serviceId];
    
    const newFilters = { ...filters, services: newServices };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const togglePriceLevel = (level: string) => {
    const newLevels = filters.priceLevel.includes(level)
      ? filters.priceLevel.filter(l => l !== level)
      : [...filters.priceLevel, level];
    
    const newFilters = { ...filters, priceLevel: newLevels };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      locations: [],
      services: [],
      minRating: 4.0,
      priceLevel: [],
      availability: "all",
      sortBy: "empfohlen",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort By */}
      <div>
        <p className="text-sm font-medium mb-3">Sortieren nach</p>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map(option => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const newFilters = { ...filters, sortBy: option.id };
                setFilters(newFilters);
                onFilterChange(newFilters);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.sortBy === option.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <option.icon className="w-4 h-4" />
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <Collapsible open={expandedSections.location} onOpenChange={() => toggleSection("location")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-medium">Standort</span>
            {filters.locations.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filters.locations.length}
              </Badge>
            )}
          </div>
          {expandedSections.location ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-wrap gap-2 pt-3">
            {locations.map(location => (
              <Badge
                key={location}
                variant={filters.locations.includes(location) ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => toggleLocation(location)}
              >
                {location}
                {filters.locations.includes(location) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Services Filter */}
      <Collapsible open={expandedSections.services} onOpenChange={() => toggleSection("services")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-primary" />
            <span className="font-medium">Leistungen</span>
            {filters.services.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filters.services.length}
              </Badge>
            )}
          </div>
          {expandedSections.services ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-2 gap-2 pt-3">
            {services.map(service => (
              <label
                key={service.id}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  filters.services.includes(service.id)
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted"
                }`}
              >
                <Checkbox
                  checked={filters.services.includes(service.id)}
                  onCheckedChange={() => toggleService(service.id)}
                />
                <span className="text-sm">{service.icon} {service.label}</span>
              </label>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Rating Filter */}
      <Collapsible open={expandedSections.rating} onOpenChange={() => toggleSection("rating")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            <span className="font-medium">Mindestbewertung</span>
            <Badge variant="secondary" className="text-xs">
              {filters.minRating}+
            </Badge>
          </div>
          {expandedSections.rating ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pt-4 px-2">
            <Slider
              value={[filters.minRating]}
              min={3.0}
              max={5.0}
              step={0.5}
              onValueChange={(value) => {
                const newFilters = { ...filters, minRating: value[0] };
                setFilters(newFilters);
                onFilterChange(newFilters);
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>3.0</span>
              <span>4.0</span>
              <span>5.0</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Price Level Filter */}
      <Collapsible open={expandedSections.price} onOpenChange={() => toggleSection("price")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-primary" />
            <span className="font-medium">Preisstufe</span>
            {filters.priceLevel.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filters.priceLevel.length}
              </Badge>
            )}
          </div>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-wrap gap-2 pt-3">
            {priceLevels.map(level => (
              <Badge
                key={level.id}
                variant="outline"
                className={`cursor-pointer transition-all ${
                  filters.priceLevel.includes(level.id)
                    ? level.color + " border-2"
                    : "hover:bg-muted"
                }`}
                onClick={() => togglePriceLevel(level.id)}
              >
                {level.label}
                {filters.priceLevel.includes(level.id) && (
                  <CheckCircle2 className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Clear All */}
      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
          onClick={clearAllFilters}
        >
          <X className="w-4 h-4 mr-2" />
          Alle Filter zurücksetzen
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>

      {/* Mobile Filter Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Filter & Sortieren
              {activeFiltersCount > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filter & Sortieren</SheetTitle>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto h-full pb-20">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
