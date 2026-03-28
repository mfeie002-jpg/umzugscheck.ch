import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Search, Sparkles, X, Filter } from "lucide-react";

interface SmartSearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  query: string;
  maxPrice: number;
  minRating: number;
  services: string[];
  aiSuggested: boolean;
}

const SUGGESTED_SEARCHES = [
  "Günstige Umzugsfirma Zürich",
  "Express Umzug Basel",
  "Firmenumzug Bern",
  "Möbelmontage inklusive",
  "Umzug mit Reinigung",
];

const SERVICE_TAGS = [
  "Privatumzug",
  "Firmenumzug", 
  "Reinigung",
  "Entsorgung",
  "Lagerung",
  "Möbelmontage",
  "Express",
];

export const SmartSearchFilters = ({ onSearch }: SmartSearchFiltersProps) => {
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState([5000]);
  const [minRating, setMinRating] = useState([4.0]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSearch = () => {
    onSearch({
      query,
      maxPrice: maxPrice[0],
      minRating: minRating[0],
      services: selectedServices,
      aiSuggested: false,
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch({
      query: suggestion,
      maxPrice: maxPrice[0],
      minRating: minRating[0],
      services: selectedServices,
      aiSuggested: true,
    });
  };

  const clearFilters = () => {
    setQuery("");
    setMaxPrice([5000]);
    setMinRating([4.0]);
    setSelectedServices([]);
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Smart Suche
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Suchen Sie nach Firmen, Services..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* AI Suggestions */}
        {showSuggestions && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI Vorschläge
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_SEARCHES.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Max. Preis</span>
            <span className="font-medium">CHF {maxPrice[0].toLocaleString()}</span>
          </div>
          <Slider
            value={maxPrice}
            onValueChange={setMaxPrice}
            max={10000}
            min={500}
            step={100}
            className="w-full"
          />
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Min. Bewertung</span>
            <span className="font-medium">⭐ {minRating[0].toFixed(1)}+</span>
          </div>
          <Slider
            value={minRating}
            onValueChange={setMinRating}
            max={5}
            min={3}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Service Tags */}
        <div className="space-y-2">
          <p className="text-sm">Services</p>
          <div className="flex flex-wrap gap-2">
            {SERVICE_TAGS.map((service) => (
              <Badge
                key={service}
                variant={selectedServices.includes(service) ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => toggleService(service)}
              >
                {service}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleSearch} className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Suchen
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Zurücksetzen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartSearchFilters;
