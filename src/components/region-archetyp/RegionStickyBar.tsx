import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegionData, searchPlaces } from "@/data/regions-database";
import { setPrefill } from "@/lib/prefill";

interface RegionStickyBarProps {
  region: RegionData;
  showAfterScroll?: number;
}

export const RegionStickyBar = ({ region, showAfterScroll = 600 }: RegionStickyBarProps) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [toValue, setToValue] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ label: string; slug: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  const handleToChange = (value: string) => {
    setToValue(value);
    if (value.length >= 2) {
      const results = searchPlaces(value).slice(0, 4);
      setSuggestions(results.map(p => ({ label: p.label, slug: p.slug })));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = () => {
    setPrefill({
      from: region.name,
      to: toValue,
      source: `region_sticky_${region.slug}`,
      cantonCode: region.short,
    });
    navigate("/umzugsofferten");
  };

  // Only show on mobile
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-lg border-t border-border shadow-2xl pb-safe"
        >
          <div className="p-4">
            {/* Compact Form */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={toValue}
                  onChange={(e) => handleToChange(e.target.value)}
                  onFocus={() => toValue.length >= 2 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Wohin ziehen Sie?"
                  className="pl-9 h-12 text-base touch-manipulation"
                  inputMode="text"
                />

                {/* Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border rounded-lg shadow-lg overflow-hidden">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setToValue(suggestion.label);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-accent transition-colors text-sm border-b last:border-b-0"
                      >
                        {suggestion.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                size="lg"
                className="h-12 px-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold touch-manipulation"
              >
                <span className="hidden sm:inline">Weiter</span>
                <ArrowRight className="w-5 h-5 sm:ml-2" />
              </Button>
            </div>

            {/* Mini Trust */}
            <p className="text-center text-xs text-muted-foreground mt-2">
              ✓ Kostenlos · ✓ Unverbindlich · ✓ {region.stats.providerCount}+ Firmen
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
