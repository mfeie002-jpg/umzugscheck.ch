import { memo } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { POPULAR_REGIONS } from "@/data/regions-database";

interface PopularRegionsGridProps {
  onSelect?: (slug: string) => void;
}

export const PopularRegionsGrid = memo(({ onSelect }: PopularRegionsGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {POPULAR_REGIONS.map(region => (
        <Link
          key={region.slug}
          to={`/umzugsfirmen/${region.slug}`}
          onClick={() => onSelect?.(region.slug)}
          className="bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all text-center group"
        >
          <MapPin className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-sm">{region.name}</p>
          <p className="text-xs text-muted-foreground">{region.short}</p>
        </Link>
      ))}
    </div>
  );
});

PopularRegionsGrid.displayName = 'PopularRegionsGrid';
