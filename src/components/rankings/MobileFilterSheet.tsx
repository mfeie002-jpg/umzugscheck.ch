import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FilterState } from "./RankingFilters";

interface MobileFilterSheetProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

const SERVICES = ["Umzug", "Reinigung", "Entsorgung", "Lagerung", "Möbelmontage", "Packservice"];
const PRICE_LEVELS = [
  { value: "günstig", label: "Günstig" },
  { value: "fair", label: "Fair" },
  { value: "premium", label: "Premium" }
];
const RATINGS = [
  { value: "0", label: "Alle" },
  { value: "4.0", label: "4.0+" },
  { value: "4.5", label: "4.5+" },
];
const SORT_OPTIONS = [
  { value: "recommended", label: "Empfohlen" },
  { value: "rating", label: "Beste Bewertung" },
  { value: "price", label: "Günstigste" },
  { value: "reviews", label: "Meiste Bewertungen" },
];

export const MobileFilterSheet = ({
  filters,
  onFilterChange,
  onReset,
}: MobileFilterSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleServiceToggle = (service: string) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service];
    onFilterChange({ ...filters, services: newServices });
  };

  const hasActiveFilters = 
    filters.region !== "all" ||
    filters.services.length > 0 ||
    filters.priceLevel !== "all" ||
    filters.minRating !== "0" ||
    filters.sortBy !== "recommended";

  const activeFilterCount = [
    filters.region !== "all" ? 1 : 0,
    filters.services.length,
    filters.priceLevel !== "all" ? 1 : 0,
    filters.minRating !== "0" ? 1 : 0,
    filters.sortBy !== "recommended" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="flex gap-2">
      {/* Filter Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex-1 relative">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filter
            {activeFilterCount > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
          <SheetHeader className="border-b pb-4 mb-4">
            <SheetTitle className="text-left">Filter anwenden</SheetTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onReset();
                  setIsOpen(false);
                }}
                className="absolute right-4 top-4"
              >
                <X className="w-4 h-4 mr-1" />
                Zurücksetzen
              </Button>
            )}
          </SheetHeader>

          <div className="space-y-6 overflow-y-auto h-[calc(85vh-160px)] pb-6">
            {/* Services Filter */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Services</Label>
              <div className="space-y-2">
                {SERVICES.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service}`}
                      checked={filters.services.includes(service)}
                      onCheckedChange={() => handleServiceToggle(service)}
                    />
                    <label
                      htmlFor={`service-${service}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {service}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Level Filter */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Preisniveau</Label>
              <Select
                value={filters.priceLevel}
                onValueChange={(value) => onFilterChange({ ...filters, priceLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Alle Preisniveaus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Preisniveaus</SelectItem>
                  {PRICE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating Filter */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Mindestbewertung</Label>
              <Select
                value={filters.minRating}
                onValueChange={(value) => onFilterChange({ ...filters, minRating: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Alle Bewertungen" />
                </SelectTrigger>
                <SelectContent>
                  {RATINGS.map((rating) => (
                    <SelectItem key={rating.value} value={rating.value}>
                      {rating.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t pt-4">
            <Button
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Filter anwenden
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sort Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex-1">
            Sortierung
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-auto rounded-t-2xl">
          <SheetHeader className="border-b pb-4 mb-4">
            <SheetTitle className="text-left">Sortierung</SheetTitle>
          </SheetHeader>
          <div className="space-y-2 pb-6">
            {SORT_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={filters.sortBy === option.value ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  onFilterChange({ ...filters, sortBy: option.value });
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};