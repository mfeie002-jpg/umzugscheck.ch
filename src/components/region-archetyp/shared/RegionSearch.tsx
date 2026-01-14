import { useState, memo } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchPlaces } from "@/data/regions-database";

interface RegionSearchProps {
  onSelect: (slug: string, label: string) => void;
  placeholder?: string;
}

export const RegionSearch = memo(({ onSelect, placeholder = "PLZ oder Ort suchen..." }: RegionSearchProps) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ label: string; slug: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (val: string) => {
    setValue(val);
    if (val.length >= 2) {
      const results = searchPlaces(val).slice(0, 6);
      setSuggestions(results.map(p => ({ label: p.label, slug: p.slug })));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        className="pl-10 h-12 text-base"
        inputMode="text"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-50 overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { onSelect(s.slug, s.label); setValue(s.label); setShowSuggestions(false); }}
              className="w-full text-left px-4 py-3 hover:bg-accent transition-colors text-sm flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-muted-foreground" />
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

RegionSearch.displayName = 'RegionSearch';
