/**
 * Region Selector Dropdown Component
 * 
 * Quick region navigation for faster UX
 */

import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const REGIONS = [
  { slug: "zuerich", name: "Zürich", count: 45 },
  { slug: "bern", name: "Bern", count: 32 },
  { slug: "basel", name: "Basel", count: 28 },
  { slug: "luzern", name: "Luzern", count: 22 },
  { slug: "aargau", name: "Aargau", count: 25 },
  { slug: "st-gallen", name: "St. Gallen", count: 18 },
  { slug: "winterthur", name: "Winterthur", count: 15 },
  { slug: "genf", name: "Genf", count: 20 },
];

interface RegionSelectorProps {
  currentRegion?: string;
  variant?: 'button' | 'inline';
  className?: string;
}

export const RegionSelector = memo(function RegionSelector({
  currentRegion,
  variant = 'button',
  className
}: RegionSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredRegions = REGIONS.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const current = REGIONS.find(r => r.slug === currentRegion);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("gap-2", className)}>
          <MapPin className="w-4 h-4 text-secondary" />
          {current?.name || "Region wählen"}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Region suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        <div className="max-h-64 overflow-y-auto space-y-0.5">
          {filteredRegions.map((region) => (
            <Link
              key={region.slug}
              to={`/${region.slug}`}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                region.slug === currentRegion
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
            >
              <span>{region.name}</span>
              <span className="text-xs text-muted-foreground">{region.count} Firmen</span>
            </Link>
          ))}
        </div>
        <Link
          to="/regionen"
          onClick={() => setOpen(false)}
          className="block mt-2 pt-2 border-t text-center text-sm text-primary hover:underline"
        >
          Alle Regionen anzeigen
        </Link>
      </PopoverContent>
    </Popover>
  );
});

export default RegionSelector;
