/**
 * Region Chips Component
 * Clickable region chips that can prefill form or navigate
 */

import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Region {
  name: string;
  slug: string;
  type: 'canton' | 'city';
  href: string;
}

interface RegionChipsProps {
  regions: Region[];
  selectedRegion?: Region | null;
  onRegionSelect?: (region: Region) => void;
  onClose?: () => void;
  showAllLink?: { label: string; href: string };
  className?: string;
}

export const RegionChips = ({
  regions,
  selectedRegion,
  onRegionSelect,
  onClose,
  showAllLink,
  className,
}: RegionChipsProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2">
        {regions.map((region) => {
          const isSelected = selectedRegion?.slug === region.slug;
          
          return (
            <button
              key={region.slug}
              onClick={() => onRegionSelect?.(region)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                "border hover:shadow-sm active:scale-95",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
              )}
            >
              <MapPin className="w-3 h-3" />
              {region.name}
            </button>
          );
        })}
      </div>

      {showAllLink && (
        <Link
          to={showAllLink.href}
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          {showAllLink.label}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};

// Default popular regions data
export const popularRegions: Region[] = [
  { name: "Zürich", slug: "zuerich", type: 'city', href: "/umzugsfirmen/zuerich" },
  { name: "Bern", slug: "bern", type: 'city', href: "/umzugsfirmen/bern" },
  { name: "Basel", slug: "basel", type: 'city', href: "/umzugsfirmen/basel" },
  { name: "Luzern", slug: "luzern", type: 'city', href: "/umzugsfirmen/luzern" },
  { name: "Zug", slug: "zug", type: 'city', href: "/umzugsfirmen/zug" },
  { name: "St. Gallen", slug: "st-gallen", type: 'city', href: "/umzugsfirmen/st-gallen" },
  { name: "Winterthur", slug: "winterthur", type: 'city', href: "/umzugsfirmen/winterthur" },
  { name: "Genf", slug: "genf", type: 'city', href: "/umzugsfirmen/genf" },
];

export const popularCantons: Region[] = [
  { name: "Kanton Zürich", slug: "kanton-zuerich", type: 'canton', href: "/umzugsfirmen/kanton-zuerich" },
  { name: "Kanton Bern", slug: "kanton-bern", type: 'canton', href: "/umzugsfirmen/kanton-bern" },
  { name: "Kanton Aargau", slug: "kanton-aargau", type: 'canton', href: "/umzugsfirmen/kanton-aargau" },
  { name: "Kanton Zug", slug: "kanton-zug", type: 'canton', href: "/umzugsfirmen/kanton-zug" },
  { name: "Kanton Luzern", slug: "kanton-luzern", type: 'canton', href: "/umzugsfirmen/kanton-luzern" },
];
