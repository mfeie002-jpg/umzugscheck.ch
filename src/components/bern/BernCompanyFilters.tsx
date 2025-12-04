import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Star, Clock, TrendingDown, SlidersHorizontal, X } from "lucide-react";

interface FilterState { priceLevel: string[]; minRating: number; availability: boolean; services: string[]; }
const priceLevels = ["günstig", "fair", "premium"];
const serviceTypes = ["Privatumzug", "Firmenumzug", "Reinigung", "Entsorgung", "Einlagerung"];

export const BernCompanyFilters = ({ onFilterChange }: { onFilterChange?: (filters: FilterState) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ priceLevel: [], minRating: 0, availability: false, services: [] });

  const togglePriceLevel = (level: string) => {
    const newLevels = filters.priceLevel.includes(level) ? filters.priceLevel.filter((l) => l !== level) : [...filters.priceLevel, level];
    const newFilters = { ...filters, priceLevel: newLevels };
    setFilters(newFilters); onFilterChange?.(newFilters);
  };

  const activeFiltersCount = filters.priceLevel.length + filters.services.length + (filters.minRating > 0 ? 1 : 0) + (filters.availability ? 1 : 0);
  const clearFilters = () => { const newFilters = { priceLevel: [], minRating: 0, availability: false, services: [] }; setFilters(newFilters); onFilterChange?.(newFilters); };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Button variant={isExpanded ? "default" : "outline"} size="sm" onClick={() => setIsExpanded(!isExpanded)} className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />Filter{activeFiltersCount > 0 && <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">{activeFiltersCount}</Badge>}
        </Button>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant={filters.availability ? "default" : "outline"} size="sm" onClick={() => { const newFilters = { ...filters, availability: !filters.availability }; setFilters(newFilters); onFilterChange?.(newFilters); }} className="gap-1 whitespace-nowrap"><Clock className="h-3 w-3" />Verfügbar</Button>
          <Button variant={filters.minRating >= 4.5 ? "default" : "outline"} size="sm" onClick={() => { const newRating = filters.minRating >= 4.5 ? 0 : 4.5; const newFilters = { ...filters, minRating: newRating }; setFilters(newFilters); onFilterChange?.(newFilters); }} className="gap-1 whitespace-nowrap"><Star className="h-3 w-3" />Top bewertet</Button>
          <Button variant={filters.priceLevel.includes("günstig") ? "default" : "outline"} size="sm" onClick={() => togglePriceLevel("günstig")} className="gap-1 whitespace-nowrap"><TrendingDown className="h-3 w-3" />Günstig</Button>
        </div>
        {activeFiltersCount > 0 && <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1"><X className="h-3 w-3" />Zurücksetzen</Button>}
      </div>
      {isExpanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="bg-muted/50 rounded-lg p-4 space-y-4">
          <div><label className="text-sm font-medium mb-2 block">Preisniveau</label><div className="flex gap-2">{priceLevels.map((level) => <Button key={level} variant={filters.priceLevel.includes(level) ? "default" : "outline"} size="sm" onClick={() => togglePriceLevel(level)} className="capitalize">{level}</Button>)}</div></div>
          <div><label className="text-sm font-medium mb-2 block">Mindestbewertung: {filters.minRating || "Alle"}</label><Slider value={[filters.minRating]} onValueChange={([value]) => { const newFilters = { ...filters, minRating: value }; setFilters(newFilters); onFilterChange?.(newFilters); }} max={5} min={0} step={0.5} /></div>
        </motion.div>
      )}
    </div>
  );
};
