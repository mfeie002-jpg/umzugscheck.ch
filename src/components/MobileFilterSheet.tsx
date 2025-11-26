import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MobileFilterSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCanton: string;
  onCantonChange: (value: string) => void;
  selectedRating: string;
  onRatingChange: (value: string) => void;
  selectedPriceLevel: string[];
  onPriceLevelChange: (values: string[]) => void;
  selectedServices: string[];
  onServicesChange: (values: string[]) => void;
  cantons: string[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  resultCount: number;
}

const PRICE_LEVELS = ["günstig", "fair", "premium"];
const SERVICES = ["Umzug", "Reinigung", "Entsorgung", "Lagerung", "Möbelmontage", "Packservice"];

export const MobileFilterSheet = ({
  isOpen,
  onOpenChange,
  selectedCanton,
  onCantonChange,
  selectedRating,
  onRatingChange,
  selectedPriceLevel,
  onPriceLevelChange,
  selectedServices,
  onServicesChange,
  cantons,
  hasActiveFilters,
  onClearFilters,
  resultCount,
}: MobileFilterSheetProps) => {
  const handlePriceLevelToggle = (level: string) => {
    if (selectedPriceLevel.includes(level)) {
      onPriceLevelChange(selectedPriceLevel.filter(l => l !== level));
    } else {
      onPriceLevelChange([...selectedPriceLevel, level]);
    }
  };

  const handleServiceToggle = (service: string) => {
    if (selectedServices.includes(service)) {
      onServicesChange(selectedServices.filter(s => s !== service));
    } else {
      onServicesChange([...selectedServices, service]);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
        <SheetHeader className="border-b pb-4 mb-4">
          <SheetTitle className="text-left">Filter anwenden</SheetTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="absolute right-4 top-4"
            >
              <X className="w-4 h-4 mr-1" />
              Zurücksetzen
            </Button>
          )}
        </SheetHeader>

        <div className="space-y-6 overflow-y-auto h-[calc(85vh-140px)] pb-6">
          {/* Canton Filter */}
          <div className="space-y-2">
            <Label>Kanton / Region</Label>
            <Select value={selectedCanton} onValueChange={onCantonChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cantons.map((canton) => (
                  <SelectItem key={canton} value={canton}>
                    {canton}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <Label>Mindestbewertung</Label>
            <Select value={selectedRating} onValueChange={onRatingChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Alle">Alle Bewertungen</SelectItem>
                <SelectItem value="4.5">4.5+ ⭐</SelectItem>
                <SelectItem value="4.0">4.0+ ⭐</SelectItem>
                <SelectItem value="3.5">3.5+ ⭐</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Level Filter */}
          <div className="space-y-3">
            <Label>Preisniveau</Label>
            <div className="space-y-2">
              {PRICE_LEVELS.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`price-${level}`}
                    checked={selectedPriceLevel.includes(level)}
                    onCheckedChange={() => handlePriceLevelToggle(level)}
                  />
                  <label
                    htmlFor={`price-${level}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                  >
                    {level}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Services Filter */}
          <div className="space-y-3">
            <Label>Services</Label>
            <div className="space-y-2">
              {SERVICES.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={`service-${service}`}
                    checked={selectedServices.includes(service)}
                    onCheckedChange={() => handleServiceToggle(service)}
                  />
                  <label
                    htmlFor={`service-${service}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {service}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full"
            size="lg"
          >
            {resultCount} {resultCount === 1 ? "Firma" : "Firmen"} anzeigen
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
