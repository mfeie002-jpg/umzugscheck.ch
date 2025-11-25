import { useState } from "react";
import { Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const SWISS_CANTONS = [
  "Zürich", "Bern", "Luzern", "Uri", "Schwyz", "Obwalden", "Nidwalden",
  "Glarus", "Zug", "Freiburg", "Solothurn", "Basel-Stadt", "Basel-Landschaft",
  "Schaffhausen", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "St. Gallen",
  "Graubünden", "Aargau", "Thurgau", "Tessin", "Waadt", "Wallis", "Neuenburg",
  "Genf", "Jura"
];

const SERVICES = [
  { id: "umzug", label: "Umzug" },
  { id: "reinigung", label: "Reinigung" },
  { id: "entsorgung", label: "Entsorgung" },
  { id: "lagerung", label: "Lagerung" },
  { id: "packservice", label: "Packservice" },
  { id: "montage", label: "Möbelmontage" },
];

const PRICE_LEVELS = [
  { value: "all", label: "Alle Preise" },
  { value: "günstig", label: "Günstig" },
  { value: "fair", label: "Fair" },
  { value: "premium", label: "Premium" },
];

const RATING_OPTIONS = [
  { value: "0", label: "Alle Bewertungen" },
  { value: "3.5", label: "3.5+ Sterne" },
  { value: "4.0", label: "4.0+ Sterne" },
  { value: "4.5", label: "4.5+ Sterne" },
];

export interface FilterState {
  region: string;
  services: string[];
  priceLevel: string;
  minRating: string;
  sortBy: string;
}

interface RankingFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export const RankingFilters = ({
  filters,
  onFilterChange,
  onReset,
}: RankingFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleService = (serviceId: string) => {
    const newServices = filters.services.includes(serviceId)
      ? filters.services.filter(s => s !== serviceId)
      : [...filters.services, serviceId];
    updateFilter("services", newServices);
  };

  const activeFilterCount = [
    filters.region !== "all",
    filters.services.length > 0,
    filters.priceLevel !== "all",
    filters.minRating !== "0",
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort By */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Sortierung</Label>
        <Select value={filters.sortBy} onValueChange={(v) => updateFilter("sortBy", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Empfohlen</SelectItem>
            <SelectItem value="rating">Beste Bewertung</SelectItem>
            <SelectItem value="price">Günstigste</SelectItem>
            <SelectItem value="reviews">Meiste Bewertungen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Region Filter */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Region / Kanton</Label>
        <Select value={filters.region} onValueChange={(v) => updateFilter("region", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Alle Regionen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Regionen</SelectItem>
            {SWISS_CANTONS.map((canton) => (
              <SelectItem key={canton} value={canton}>
                {canton}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Services Filter */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Services</Label>
        <div className="space-y-3">
          {SERVICES.map((service) => (
            <div key={service.id} className="flex items-center space-x-2">
              <Checkbox
                id={service.id}
                checked={filters.services.includes(service.id)}
                onCheckedChange={() => toggleService(service.id)}
              />
              <label
                htmlFor={service.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {service.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Level */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Preisniveau</Label>
        <div className="flex flex-wrap gap-2">
          {PRICE_LEVELS.map((level) => (
            <Badge
              key={level.value}
              variant={filters.priceLevel === level.value ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => updateFilter("priceLevel", level.value)}
            >
              {level.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Mindestbewertung</Label>
        <Select value={filters.minRating} onValueChange={(v) => updateFilter("minRating", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RATING_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          onClick={() => {
            onReset();
            setIsOpen(false);
          }}
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
      {/* Desktop Filter Bar */}
      <div className="hidden lg:block bg-background border border-border rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter & Sortierung
          </h3>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <X className="w-4 h-4 mr-2" />
              Zurücksetzen
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sort By - Desktop */}
          <div>
            <Label className="text-xs font-semibold mb-2 block text-muted-foreground">
              SORTIERUNG
            </Label>
            <Select value={filters.sortBy} onValueChange={(v) => updateFilter("sortBy", v)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Empfohlen</SelectItem>
                <SelectItem value="rating">Beste Bewertung</SelectItem>
                <SelectItem value="price">Günstigste</SelectItem>
                <SelectItem value="reviews">Meiste Bewertungen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Region - Desktop */}
          <div>
            <Label className="text-xs font-semibold mb-2 block text-muted-foreground">
              REGION
            </Label>
            <Select value={filters.region} onValueChange={(v) => updateFilter("region", v)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Alle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Regionen</SelectItem>
                {SWISS_CANTONS.map((canton) => (
                  <SelectItem key={canton} value={canton}>
                    {canton}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Level - Desktop */}
          <div>
            <Label className="text-xs font-semibold mb-2 block text-muted-foreground">
              PREISNIVEAU
            </Label>
            <Select value={filters.priceLevel} onValueChange={(v) => updateFilter("priceLevel", v)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRICE_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating - Desktop */}
          <div>
            <Label className="text-xs font-semibold mb-2 block text-muted-foreground">
              BEWERTUNG
            </Label>
            <Select value={filters.minRating} onValueChange={(v) => updateFilter("minRating", v)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RATING_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Service Filters */}
        {filters.services.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-2">Services:</span>
            {filters.services.map((serviceId) => {
              const service = SERVICES.find(s => s.id === serviceId);
              return (
                <Badge key={serviceId} variant="secondary" className="gap-1">
                  {service?.label}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => toggleService(serviceId)}
                  />
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Filter Button & Sheet */}
      <div className="lg:hidden mb-6">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Filter & Sortierung
              {activeFilterCount > 0 && (
                <Badge className="ml-2" variant="default">
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown className="w-4 h-4 ml-auto" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter & Sortierung</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>

        {/* Active Filters Summary - Mobile */}
        {activeFilterCount > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.region !== "all" && (
              <Badge variant="secondary">{filters.region}</Badge>
            )}
            {filters.priceLevel !== "all" && (
              <Badge variant="secondary">
                {PRICE_LEVELS.find(p => p.value === filters.priceLevel)?.label}
              </Badge>
            )}
            {filters.minRating !== "0" && (
              <Badge variant="secondary">
                {RATING_OPTIONS.find(r => r.value === filters.minRating)?.label}
              </Badge>
            )}
            {filters.services.map((serviceId) => {
              const service = SERVICES.find(s => s.id === serviceId);
              return (
                <Badge key={serviceId} variant="secondary">
                  {service?.label}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
