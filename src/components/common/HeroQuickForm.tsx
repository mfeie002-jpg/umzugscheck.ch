/**
 * HERO QUICK FORM
 * 
 * Compact two-field form for canton/city landing pages
 * Pre-fills the "from" field based on the current location context
 * 
 * Usage:
 * <HeroQuickForm 
 *   prefilledFrom="6300" // or "Zug" 
 *   placeName="Zug"
 * />
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, ArrowRight, Shield, CheckCircle, Clock, Star } from "lucide-react";
import { swissPostalCodes, PostalCodeEntry } from "@/lib/swiss-postal-codes";
import { cn } from "@/lib/utils";

interface HeroQuickFormProps {
  /** Pre-filled postal code or city name for "from" field */
  prefilledFrom?: string;
  /** Display name of the current location (for labels) */
  placeName: string;
  /** Optional: custom class name */
  className?: string;
  /** Variant: default for hero sections, compact for smaller areas */
  variant?: 'default' | 'compact';
}

export const HeroQuickForm = ({
  prefilledFrom = "",
  placeName,
  className,
  variant = 'default'
}: HeroQuickFormProps) => {
  const navigate = useNavigate();
  
  const [fromQuery, setFromQuery] = useState(prefilledFrom);
  const [toQuery, setToQuery] = useState("");
  const [fromSelected, setFromSelected] = useState<PostalCodeEntry | null>(null);
  const [toSelected, setToSelected] = useState<PostalCodeEntry | null>(null);

  // Auto-select entry when prefilled
  useEffect(() => {
    if (prefilledFrom) {
      setFromQuery(prefilledFrom);
      // Try to find matching postal code
      const match = swissPostalCodes.find(
        e => e.code === prefilledFrom || 
             e.city.toLowerCase() === prefilledFrom.toLowerCase()
      );
      if (match) {
        setFromSelected(match);
        setFromQuery(`${match.code} - ${match.city}`);
      }
    }
  }, [prefilledFrom]);

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
    
    const match = value.match(/^(\d{4})\s*-\s*(.+)$/);
    if (match) {
      const [, code, city] = match;
      const entry = swissPostalCodes.find(e => e.code === code && e.city === city.trim());
      if (entry) setFromSelected(entry);
    } else {
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
    
    const match = value.match(/^(\d{4})\s*-\s*(.+)$/);
    if (match) {
      const [, code, city] = match;
      const entry = swissPostalCodes.find(e => e.code === code && e.city === city.trim());
      if (entry) setToSelected(entry);
    } else {
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
    
    const fromAddress = fromSelected 
      ? `${fromSelected.code} ${fromSelected.city}`
      : fromQuery.replace(' - ', ' ');
    const toAddress = toSelected 
      ? `${toSelected.code} ${toSelected.city}`
      : toQuery.replace(' - ', ' ');
    
    if (fromAddress && toAddress) {
      navigate(`/rechner?from=${encodeURIComponent(fromAddress)}&to=${encodeURIComponent(toAddress)}`);
    }
  };

  const isCompact = variant === 'compact';

  return (
    <div className={cn(
      "bg-card/95 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50",
      isCompact ? "p-4" : "p-5 md:p-6",
      className
    )}>
      {/* Header */}
      {!isCompact && (
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-2">
            <Star className="w-4 h-4 fill-current" />
            Bester Preis garantiert
          </div>
          <h3 className="text-lg md:text-xl font-bold text-foreground">
            Jetzt Offerten aus {placeName} vergleichen
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            In 2 Minuten zum besten Angebot
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Von Field - Pre-filled */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Von (PLZ oder Ort)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              type="text"
              placeholder="z.B. 8001 oder Zürich"
              value={fromQuery}
              onChange={(e) => handleFromChange(e.target.value)}
              list="heroFromPostalList"
              className={cn(
                "pl-10 bg-background border-border",
                isCompact ? "h-11" : "h-12 text-base"
              )}
              required
            />
            <datalist id="heroFromPostalList">
              {filterPostalCodes(fromQuery).map((entry) => (
                <option 
                  key={`from-${entry.code}-${entry.city}`} 
                  value={`${entry.code} - ${entry.city}`}
                />
              ))}
            </datalist>
          </div>
        </div>

        {/* Nach Field */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Nach (PLZ oder Ort)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="z.B. 3011 oder Bern"
              value={toQuery}
              onChange={(e) => handleToChange(e.target.value)}
              list="heroToPostalList"
              className={cn(
                "pl-10 bg-background border-border",
                isCompact ? "h-11" : "h-12 text-base"
              )}
              required
              autoFocus={!!prefilledFrom}
            />
            <datalist id="heroToPostalList">
              {filterPostalCodes(toQuery).map((entry) => (
                <option 
                  key={`to-${entry.code}-${entry.city}`} 
                  value={`${entry.code} - ${entry.city}`}
                />
              ))}
            </datalist>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          size="lg" 
          className={cn(
            "w-full font-bold bg-primary hover:bg-primary/90",
            isCompact ? "h-11" : "h-14 text-lg"
          )}
        >
          Kostenlos Offerten erhalten
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </form>

      {/* Trust indicators */}
      <div className={cn(
        "flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground",
        isCompact ? "mt-3" : "mt-4"
      )}>
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-green-600" />
          Kostenlos
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-green-600" />
          Unverbindlich
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-green-600" />
          Datenschutz
        </span>
      </div>
    </div>
  );
};
