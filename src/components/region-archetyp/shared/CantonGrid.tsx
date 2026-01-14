import { useState, memo } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CANTONS } from "@/data/regions-database";

interface CantonGridProps {
  initialVisible?: number;
}

export const CantonGrid = memo(({ initialVisible = 10 }: CantonGridProps) => {
  const [showAll, setShowAll] = useState(false);
  const visibleCantons = showAll ? CANTONS : CANTONS.slice(0, initialVisible);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
        {visibleCantons.map(canton => (
          <Link
            key={canton.slug}
            to={`/umzugsfirmen/${canton.slug}`}
            className="bg-card border border-border rounded-lg px-3 py-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-sm text-center"
          >
            <span className="font-medium">{canton.short}</span>
            <span className="text-muted-foreground ml-1 group-hover:text-primary-foreground/80">
              {canton.name}
            </span>
          </Link>
        ))}
      </div>
      {CANTONS.length > initialVisible && (
        <div className="text-center mt-4">
          <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)}>
            {showAll ? (
              <>Weniger anzeigen <ChevronUp className="ml-1 w-4 h-4" /></>
            ) : (
              <>Alle {CANTONS.length} Kantone anzeigen <ChevronDown className="ml-1 w-4 h-4" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  );
});

CantonGrid.displayName = 'CantonGrid';
