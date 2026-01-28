import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, ArrowRight } from "lucide-react";
import { swissPostalCodes, PostalCodeEntry } from "@/lib/swiss-postal-codes";

export const MiniCalculator = () => {
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromSelected, setFromSelected] = useState<PostalCodeEntry | null>(null);
  const [toSelected, setToSelected] = useState<PostalCodeEntry | null>(null);
  const navigate = useNavigate();

  const filterPostalCodes = (query: string): PostalCodeEntry[] => {
    if (!query || query.trim().length < 1) {
      return swissPostalCodes.slice(0, 20);
    }
    
    const lowerQuery = query.toLowerCase().trim();
    
    return swissPostalCodes
      .filter(entry => 
        entry.code.startsWith(lowerQuery) || 
        entry.city.toLowerCase().startsWith(lowerQuery) ||
        entry.city.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 50);
  };

  const handleFromChange = (value: string) => {
    setFromQuery(value);
    
    // Check if user selected from datalist (format: "CODE - CITY")
    const match = value.match(/^(\d{4})\s*-\s*(.+)$/);
    if (match) {
      const [, code, city] = match;
      const entry = swissPostalCodes.find(e => e.code === code && e.city === city.trim());
      if (entry) {
        setFromSelected(entry);
      }
    } else {
      // Try direct postal code match
      const directMatch = swissPostalCodes.find(e => e.code === value.trim());
      if (directMatch) {
        setFromSelected(directMatch);
      } else {
        setFromSelected(null);
      }
    }
  };

  const handleToChange = (value: string) => {
    setToQuery(value);
    
    // Check if user selected from datalist (format: "CODE - CITY")
    const match = value.match(/^(\d{4})\s*-\s*(.+)$/);
    if (match) {
      const [, code, city] = match;
      const entry = swissPostalCodes.find(e => e.code === code && e.city === city.trim());
      if (entry) {
        setToSelected(entry);
      }
    } else {
      // Try direct postal code match
      const directMatch = swissPostalCodes.find(e => e.code === value.trim());
      if (directMatch) {
        setToSelected(directMatch);
      } else {
        setToSelected(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build address strings for navigation
    const fromAddress = fromSelected 
      ? `${fromSelected.code} ${fromSelected.city}`
      : fromQuery;
    const toAddress = toSelected 
      ? `${toSelected.code} ${toSelected.city}`
      : toQuery;
    
    if (fromAddress && toAddress) {
      // Save to uc_prefill for wizard prepopulation
      try {
        localStorage.setItem('uc_prefill', JSON.stringify({
          from: fromAddress,
          to: toAddress,
          source: 'home-mini-calculator',
          createdAt: Date.now(),
          timestamp: Date.now(),
        }));
      } catch {
        // Silent fail
      }
      
      navigate(`/umzugsofferten?from=${encodeURIComponent(fromAddress)}&to=${encodeURIComponent(toAddress)}`);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Kostenloses Angebot in 3 Schritten
        </h2>
        <p className="text-muted-foreground">
          Schnell, einfach, unverbindlich
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Von Adresse */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            1. Startadresse
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <Input
              type="text"
              placeholder="PLZ oder Ort (z.B. 8001 oder Zürich)"
              value={fromQuery}
              onChange={(e) => handleFromChange(e.target.value)}
              list="fromPostalList"
              className="pl-10 h-12 md:h-14 text-base bg-white border-border text-foreground placeholder:text-muted-foreground touch-manipulation"
              required
            />
            <datalist id="fromPostalList">
              {filterPostalCodes(fromQuery).map((entry) => (
                <option 
                  key={`${entry.code}-${entry.city}`} 
                  value={`${entry.code} - ${entry.city}`}
                />
              ))}
            </datalist>
          </div>
          {fromSelected && (
            <p className="text-xs text-success mt-1 flex items-center gap-1">
              ✓ {fromSelected.code} {fromSelected.city} ({fromSelected.canton})
            </p>
          )}
        </div>

        {/* Step 2: Nach Adresse */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            2. Zieladresse
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <Input
              type="text"
              placeholder="PLZ oder Ort (z.B. 3011 oder Bern)"
              value={toQuery}
              onChange={(e) => handleToChange(e.target.value)}
              list="toPostalList"
              className="pl-10 h-12 md:h-14 text-base bg-white border-border text-foreground placeholder:text-muted-foreground touch-manipulation"
              required
            />
            <datalist id="toPostalList">
              {filterPostalCodes(toQuery).map((entry) => (
                <option 
                  key={`${entry.code}-${entry.city}`} 
                  value={`${entry.code} - ${entry.city}`}
                />
              ))}
            </datalist>
          </div>
          {toSelected && (
            <p className="text-xs text-success mt-1 flex items-center gap-1">
              ✓ {toSelected.code} {toSelected.city} ({toSelected.canton})
            </p>
          )}
        </div>

        {/* Step 3: Submit */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            3. Offerten erhalten
          </label>
          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-14 md:h-16 gradient-cta text-white font-bold shadow-accent text-base md:text-lg hover:scale-[1.02] active:scale-[0.98] transition-all touch-manipulation"
          >
            Jetzt vergleichen
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-4">
        ✓ 100% kostenlos & unverbindlich
      </p>
    </div>
  );
};
