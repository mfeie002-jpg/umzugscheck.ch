import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, SortAsc, Star, TrendingDown, Clock, Award } from "lucide-react";

interface CantonCompanyFiltersProps {
  onFilterChange?: (filters: any) => void;
  onSortChange?: (sort: string) => void;
}

export const CantonCompanyFilters = ({ onFilterChange, onSortChange }: CantonCompanyFiltersProps) => {
  const [activeSort, setActiveSort] = useState("empfohlen");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const sortOptions = [
    { id: "empfohlen", label: "Empfohlen", icon: Award },
    { id: "bewertung", label: "Beste Bewertung", icon: Star },
    { id: "guenstig", label: "Günstigste", icon: TrendingDown },
    { id: "schnell", label: "Schnellste", icon: Clock },
  ];

  const filterOptions = [
    { id: "verfuegbar", label: "Nur verfügbare" },
    { id: "guenstig", label: "Günstig" },
    { id: "premium", label: "Premium" },
    { id: "verifiziert", label: "Verifiziert" },
  ];

  const handleSortChange = (sortId: string) => {
    setActiveSort(sortId);
    onSortChange?.(sortId);
  };

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters, filterId];
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="space-y-4">
      {/* Sort Options */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mr-2">
          <SortAsc className="h-4 w-4" />
          <span>Sortieren:</span>
        </div>
        {sortOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Button
              key={option.id}
              variant={activeSort === option.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange(option.id)}
              className="h-8"
            >
              <Icon className="h-3 w-3 mr-1" />
              {option.label}
            </Button>
          );
        })}
      </div>

      {/* Filter Options */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mr-2">
          <Filter className="h-4 w-4" />
          <span>Filter:</span>
        </div>
        {filterOptions.map((option) => (
          <Badge
            key={option.id}
            variant={activeFilters.includes(option.id) ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/10 transition-colors"
            onClick={() => toggleFilter(option.id)}
          >
            {option.label}
          </Badge>
        ))}
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setActiveFilters([]);
              onFilterChange?.([]);
            }}
            className="h-6 text-xs"
          >
            Zurücksetzen
          </Button>
        )}
      </div>
    </div>
  );
};
