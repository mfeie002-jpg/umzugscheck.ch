import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Building2, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Comprehensive Swiss cities with postal codes
const swissCities = [
  // Zürich region
  { plz: "8000", city: "Zürich", canton: "ZH" },
  { plz: "8001", city: "Zürich", canton: "ZH" },
  { plz: "8002", city: "Zürich", canton: "ZH" },
  { plz: "8003", city: "Zürich", canton: "ZH" },
  { plz: "8004", city: "Zürich", canton: "ZH" },
  { plz: "8005", city: "Zürich", canton: "ZH" },
  { plz: "8006", city: "Zürich", canton: "ZH" },
  { plz: "8008", city: "Zürich", canton: "ZH" },
  { plz: "8032", city: "Zürich", canton: "ZH" },
  { plz: "8037", city: "Zürich", canton: "ZH" },
  { plz: "8038", city: "Zürich", canton: "ZH" },
  { plz: "8041", city: "Zürich", canton: "ZH" },
  { plz: "8044", city: "Zürich", canton: "ZH" },
  { plz: "8045", city: "Zürich", canton: "ZH" },
  { plz: "8046", city: "Zürich", canton: "ZH" },
  { plz: "8047", city: "Zürich", canton: "ZH" },
  { plz: "8048", city: "Zürich", canton: "ZH" },
  { plz: "8049", city: "Zürich", canton: "ZH" },
  { plz: "8050", city: "Zürich", canton: "ZH" },
  { plz: "8051", city: "Zürich", canton: "ZH" },
  { plz: "8052", city: "Zürich", canton: "ZH" },
  { plz: "8053", city: "Zürich", canton: "ZH" },
  { plz: "8055", city: "Zürich", canton: "ZH" },
  { plz: "8057", city: "Zürich", canton: "ZH" },
  { plz: "8400", city: "Winterthur", canton: "ZH" },
  { plz: "8401", city: "Winterthur", canton: "ZH" },
  { plz: "8404", city: "Winterthur", canton: "ZH" },
  { plz: "8405", city: "Winterthur", canton: "ZH" },
  { plz: "8406", city: "Winterthur", canton: "ZH" },
  { plz: "8610", city: "Uster", canton: "ZH" },
  { plz: "8600", city: "Dübendorf", canton: "ZH" },
  { plz: "8700", city: "Küsnacht", canton: "ZH" },
  { plz: "8702", city: "Zollikon", canton: "ZH" },
  { plz: "8800", city: "Thalwil", canton: "ZH" },
  { plz: "8810", city: "Horgen", canton: "ZH" },
  { plz: "8820", city: "Wädenswil", canton: "ZH" },
  { plz: "8952", city: "Schlieren", canton: "ZH" },
  { plz: "8953", city: "Dietikon", canton: "ZH" },
  { plz: "8304", city: "Wallisellen", canton: "ZH" },
  { plz: "8302", city: "Kloten", canton: "ZH" },
  { plz: "8152", city: "Glattbrugg", canton: "ZH" },
  { plz: "8180", city: "Bülach", canton: "ZH" },
  // Bern region
  { plz: "3000", city: "Bern", canton: "BE" },
  { plz: "3001", city: "Bern", canton: "BE" },
  { plz: "3004", city: "Bern", canton: "BE" },
  { plz: "3005", city: "Bern", canton: "BE" },
  { plz: "3006", city: "Bern", canton: "BE" },
  { plz: "3007", city: "Bern", canton: "BE" },
  { plz: "3008", city: "Bern", canton: "BE" },
  { plz: "3010", city: "Bern", canton: "BE" },
  { plz: "3011", city: "Bern", canton: "BE" },
  { plz: "3012", city: "Bern", canton: "BE" },
  { plz: "3600", city: "Thun", canton: "BE" },
  { plz: "3800", city: "Interlaken", canton: "BE" },
  { plz: "2500", city: "Biel/Bienne", canton: "BE" },
  // Basel region
  { plz: "4000", city: "Basel", canton: "BS" },
  { plz: "4001", city: "Basel", canton: "BS" },
  { plz: "4051", city: "Basel", canton: "BS" },
  { plz: "4052", city: "Basel", canton: "BS" },
  { plz: "4053", city: "Basel", canton: "BS" },
  { plz: "4054", city: "Basel", canton: "BS" },
  { plz: "4055", city: "Basel", canton: "BS" },
  { plz: "4056", city: "Basel", canton: "BS" },
  { plz: "4057", city: "Basel", canton: "BS" },
  { plz: "4058", city: "Basel", canton: "BS" },
  // Genève region
  { plz: "1200", city: "Genève", canton: "GE" },
  { plz: "1201", city: "Genève", canton: "GE" },
  { plz: "1202", city: "Genève", canton: "GE" },
  { plz: "1203", city: "Genève", canton: "GE" },
  { plz: "1204", city: "Genève", canton: "GE" },
  { plz: "1205", city: "Genève", canton: "GE" },
  { plz: "1206", city: "Genève", canton: "GE" },
  { plz: "1207", city: "Genève", canton: "GE" },
  { plz: "1208", city: "Genève", canton: "GE" },
  // Lausanne region
  { plz: "1000", city: "Lausanne", canton: "VD" },
  { plz: "1003", city: "Lausanne", canton: "VD" },
  { plz: "1004", city: "Lausanne", canton: "VD" },
  { plz: "1005", city: "Lausanne", canton: "VD" },
  { plz: "1006", city: "Lausanne", canton: "VD" },
  { plz: "1007", city: "Lausanne", canton: "VD" },
  // Luzern region
  { plz: "6000", city: "Luzern", canton: "LU" },
  { plz: "6002", city: "Luzern", canton: "LU" },
  { plz: "6003", city: "Luzern", canton: "LU" },
  { plz: "6004", city: "Luzern", canton: "LU" },
  { plz: "6005", city: "Luzern", canton: "LU" },
  { plz: "6006", city: "Luzern", canton: "LU" },
  { plz: "6010", city: "Kriens", canton: "LU" },
  // St. Gallen region
  { plz: "9000", city: "St. Gallen", canton: "SG" },
  { plz: "9001", city: "St. Gallen", canton: "SG" },
  { plz: "9004", city: "St. Gallen", canton: "SG" },
  { plz: "9006", city: "St. Gallen", canton: "SG" },
  { plz: "9008", city: "St. Gallen", canton: "SG" },
  { plz: "9200", city: "Gossau", canton: "SG" },
  { plz: "9500", city: "Wil", canton: "SG" },
  // Aargau region
  { plz: "5000", city: "Aarau", canton: "AG" },
  { plz: "5001", city: "Aarau", canton: "AG" },
  { plz: "5400", city: "Baden", canton: "AG" },
  { plz: "5430", city: "Wettingen", canton: "AG" },
  // Zug region
  { plz: "6300", city: "Zug", canton: "ZG" },
  { plz: "6301", city: "Zug", canton: "ZG" },
  { plz: "6330", city: "Cham", canton: "ZG" },
  { plz: "6340", city: "Baar", canton: "ZG" },
  // Graubünden
  { plz: "7000", city: "Chur", canton: "GR" },
  { plz: "7500", city: "St. Moritz", canton: "GR" },
  { plz: "7260", city: "Davos", canton: "GR" },
  // Ticino
  { plz: "6500", city: "Bellinzona", canton: "TI" },
  { plz: "6600", city: "Locarno", canton: "TI" },
  { plz: "6900", city: "Lugano", canton: "TI" },
  // Valais
  { plz: "1950", city: "Sion", canton: "VS" },
  { plz: "3900", city: "Brig", canton: "VS" },
  { plz: "3920", city: "Zermatt", canton: "VS" },
  // Other cantons
  { plz: "1700", city: "Fribourg", canton: "FR" },
  { plz: "2000", city: "Neuchâtel", canton: "NE" },
  { plz: "8200", city: "Schaffhausen", canton: "SH" },
  { plz: "8500", city: "Frauenfeld", canton: "TG" },
  { plz: "4500", city: "Solothurn", canton: "SO" },
  { plz: "4600", city: "Olten", canton: "SO" },
];

// Common street names for suggestions
const commonStreets = [
  "Bahnhofstrasse", "Hauptstrasse", "Dorfstrasse", "Seestrasse", "Bergstrasse",
  "Industriestrasse", "Kirchstrasse", "Schulstrasse", "Gartenstrasse", "Talstrasse",
  "Landstrasse", "Poststrasse", "Marktgasse", "Obere Strasse", "Untere Strasse",
  "Ringstrasse", "Sonnenweg", "Feldweg", "Mühleweg", "Rosenweg"
];

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  error?: string;
  label?: string;
  icon?: 'from' | 'to';
}

const AddressAutocomplete = ({
  value,
  onChange,
  onBlur,
  placeholder = "PLZ oder Stadt eingeben...",
  className,
  error,
  label,
  icon = 'from'
}: AddressAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ display: string; plz: string; city: string; canton: string; type: 'city' | 'street' }>>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on input
  const filterSuggestions = useCallback((input: string) => {
    if (!input || input.length < 2) {
      setSuggestions([]);
      return;
    }

    const searchTerm = input.toLowerCase().trim();
    const results: typeof suggestions = [];

    // Search by PLZ
    if (/^\d+/.test(searchTerm)) {
      swissCities
        .filter(c => c.plz.startsWith(searchTerm))
        .slice(0, 8)
        .forEach(c => {
          results.push({
            display: `${c.plz} ${c.city}`,
            plz: c.plz,
            city: c.city,
            canton: c.canton,
            type: 'city'
          });
        });
    } else {
      // Search by city name
      swissCities
        .filter(c => c.city.toLowerCase().includes(searchTerm))
        .slice(0, 8)
        .forEach(c => {
          results.push({
            display: `${c.plz} ${c.city}`,
            plz: c.plz,
            city: c.city,
            canton: c.canton,
            type: 'city'
          });
        });

      // Also suggest streets if input looks like a street name
      if (searchTerm.length >= 3 && !/^\d/.test(searchTerm)) {
        commonStreets
          .filter(s => s.toLowerCase().includes(searchTerm))
          .slice(0, 3)
          .forEach(s => {
            results.push({
              display: s,
              plz: '',
              city: '',
              canton: '',
              type: 'street'
            });
          });
      }
    }

    setSuggestions(results);
    setHighlightedIndex(0);
  }, []);

  useEffect(() => {
    filterSuggestions(value);
  }, [value, filterSuggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: typeof suggestions[0]) => {
    if (suggestion.type === 'street') {
      // If it's a street, append it but keep cursor position for PLZ
      onChange(suggestion.display + ', ');
    } else {
      onChange(suggestion.display);
    }
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const IconComponent = icon === 'from' ? Navigation : MapPin;

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="text-sm font-medium mb-2 block">{label}</label>
      )}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <IconComponent className="h-4 w-4" />
        </div>
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            // Delay to allow click on suggestion
            setTimeout(() => {
              onBlur?.();
            }, 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "pl-10 min-h-[44px]",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          maxLength={200}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="sr-only">Löschen</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg overflow-hidden"
          >
            <div className="py-1 max-h-[240px] overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.plz}-${suggestion.display}-${index}`}
                  type="button"
                  onClick={() => handleSelect(suggestion)}
                  className={cn(
                    "w-full px-3 py-2.5 text-left flex items-center gap-3 transition-colors",
                    index === highlightedIndex ? "bg-alpine/10 text-alpine" : "hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    suggestion.type === 'city' ? "bg-alpine/10" : "bg-muted"
                  )}>
                    {suggestion.type === 'city' ? (
                      <MapPin className="h-4 w-4 text-alpine" />
                    ) : (
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{suggestion.display}</p>
                    {suggestion.canton && (
                      <p className="text-xs text-muted-foreground">
                        Kanton {suggestion.canton}
                      </p>
                    )}
                    {suggestion.type === 'street' && (
                      <p className="text-xs text-muted-foreground">Strasse</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="px-3 py-2 border-t bg-muted/30 text-xs text-muted-foreground flex items-center gap-2">
              <Search className="h-3 w-3" />
              <span>PLZ oder Stadtname eingeben</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};

export default AddressAutocomplete;
