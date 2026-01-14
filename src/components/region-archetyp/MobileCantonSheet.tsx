/**
 * Mobile-optimized Canton Selector using Bottom Sheet
 * Better UX than dropdown on mobile devices
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, X, ChevronRight } from "lucide-react";
import { CANTONS } from "@/data/regions-database";
import { Input } from "@/components/ui/input";

interface MobileCantonSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlug: string;
  onSelect: (slug: string) => void;
}

// Group cantons by region for better navigation
const REGION_GROUPS = {
  "Deutschschweiz": ["zuerich", "bern", "luzern", "aargau", "stgallen", "basel", "thurgau", "zug", "schwyz", "solothurn", "glarus", "schaffhausen", "appenzell", "nidwalden", "obwalden", "uri"],
  "Westschweiz": ["genf", "waadt", "fribourg", "wallis", "neuenburg", "jura"],
  "Südschweiz": ["tessin", "graubuenden"],
} as const;

export const MobileCantonSheet = ({
  isOpen,
  onClose,
  currentSlug,
  onSelect,
}: MobileCantonSheetProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter cantons by search
  const filteredCantons = useMemo(() => {
    if (!searchQuery.trim()) return CANTONS;
    const query = searchQuery.toLowerCase();
    return CANTONS.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.short.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group filtered cantons
  const groupedCantons = useMemo(() => {
    const result: Record<string, typeof CANTONS> = {};
    
    for (const [region, slugs] of Object.entries(REGION_GROUPS)) {
      const slugArray = slugs as readonly string[];
      const cantons = filteredCantons.filter((c) => slugArray.includes(c.slug));
      if (cantons.length > 0) {
        result[region] = cantons;
      }
    }
    
    return result;
  }, [filteredCantons]);

  const handleSelect = (slug: string) => {
    onSelect(slug);
    onClose();
    setSearchQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl shadow-2xl md:hidden"
            style={{ maxHeight: "85vh" }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-4 pb-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Kanton wählen</h3>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 rounded-full hover:bg-muted touch-manipulation"
                  aria-label="Schliessen"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kanton suchen..."
                  className="pl-9 h-12 text-base touch-manipulation"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Canton List */}
            <div className="overflow-y-auto pb-safe" style={{ maxHeight: "calc(85vh - 140px)" }}>
              {Object.entries(groupedCantons).map(([region, cantons]) => (
                <div key={region} className="py-2">
                  <h4 className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {region}
                  </h4>
                  <div className="space-y-0.5">
                    {cantons.map((canton) => (
                      <button
                        key={canton.slug}
                        onClick={() => handleSelect(canton.slug)}
                        className={`w-full flex items-center justify-between px-4 py-4 text-left transition-colors touch-manipulation ${
                          canton.slug === currentSlug
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted active:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className={`w-5 h-5 ${
                            canton.slug === currentSlug ? "text-primary" : "text-muted-foreground"
                          }`} />
                          <span className="text-base">
                            {canton.name}
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({canton.short})
                            </span>
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {filteredCantons.length === 0 && (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  Kein Kanton gefunden für "{searchQuery}"
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
