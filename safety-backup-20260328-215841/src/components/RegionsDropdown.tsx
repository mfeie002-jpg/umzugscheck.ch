import { MapPin, Search, ArrowRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { DropdownWrapper } from "./navigation/DropdownWrapper";
import { DropdownSection } from "./navigation/DropdownSection";
import { CANTONS_MAP, CITIES_MAP, type CantonData, type CityData } from "@/data/locations";
import { Badge } from "@/components/ui/badge";

// Prioritized cantons (Tier 1)
const POPULAR_CANTONS = ['zuerich', 'bern', 'aargau', 'st-gallen', 'waadt', 'genf', 'luzern', 'basel-stadt'];

// Popular cities (Phase 1 top cities)
const POPULAR_CITIES = ['zuerich', 'bern', 'basel', 'genf', 'lausanne', 'luzern', 'winterthur', 'stgallen', 'lugano', 'zug', 'aarau', 'thun'];

interface RegionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegionsDropdown = ({ isOpen, onClose }: RegionsDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Get popular cantons
  const popularCantons = useMemo(() => 
    POPULAR_CANTONS.map(slug => CANTONS_MAP[slug]).filter(Boolean) as CantonData[],
  []);

  // Get popular cities
  const popularCities = useMemo(() => 
    POPULAR_CITIES.map(slug => CITIES_MAP[slug]).filter(Boolean) as CityData[],
  []);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return { cantons: [], cities: [] };
    
    const term = searchTerm.toLowerCase();
    
    const matchedCantons = Object.values(CANTONS_MAP).filter(canton =>
      canton.name.toLowerCase().includes(term) ||
      canton.short.toLowerCase().includes(term)
    );
    
    const matchedCities = Object.values(CITIES_MAP).filter(city =>
      city.name.toLowerCase().includes(term) ||
      city.cantonShort.toLowerCase().includes(term)
    );
    
    return { cantons: matchedCantons.slice(0, 8), cities: matchedCities.slice(0, 12) };
  }, [searchTerm]);

  const hasSearchResults = searchTerm.trim() && (searchResults.cantons.length > 0 || searchResults.cities.length > 0);
  const noResults = searchTerm.trim() && searchResults.cantons.length === 0 && searchResults.cities.length === 0;

  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-[320px_1fr] gap-8">
          {/* Search & Info */}
          <div>
            <DropdownSection title="Kanton oder Stadt suchen">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="z.B. Zürich, Bern, Zug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Search Results */}
              {hasSearchResults && (
                <div className="space-y-4 mb-6">
                  {searchResults.cantons.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Kantone ({searchResults.cantons.length})
                      </h4>
                      <div className="space-y-1">
                        {searchResults.cantons.map((canton) => (
                          <Link
                            key={canton.slug}
                            to={`/umzugsfirmen/kanton-${canton.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <MapPin className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                              Kanton {canton.name}
                            </span>
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {canton.short}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {searchResults.cities.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Städte ({searchResults.cities.length})
                      </h4>
                      <div className="space-y-1">
                        {searchResults.cities.map((city) => (
                          <Link
                            key={city.slug}
                            to={`/umzugsfirmen/${city.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                              <Building2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                              {city.name}
                            </span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {city.cantonShort}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {noResults && (
                <div className="text-center py-6 text-muted-foreground">
                  <p className="text-sm">Keine Ergebnisse für "{searchTerm}"</p>
                </div>
              )}

              {/* Popular Cantons (when not searching) */}
              {!searchTerm.trim() && (
                <>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Beliebte Kantone
                  </h4>
                  <div className="space-y-1">
                    {popularCantons.map((canton) => (
                      <Link
                        key={canton.slug}
                        to={`/umzugsfirmen/kanton-${canton.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                          Kanton {canton.name}
                        </span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {canton.short}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </DropdownSection>
          </div>

          {/* Popular Cities Grid */}
          <div className="lg:border-l lg:border-border lg:pl-8">
            <DropdownSection title="Beliebte Städte">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {popularCities.map((city) => (
                  <Link
                    key={city.slug}
                    to={`/umzugsfirmen/${city.slug}`}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all",
                      "hover:bg-accent hover:text-primary border border-transparent hover:border-border"
                    )}
                  >
                    <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
                    <span className="truncate font-medium">{city.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{city.cantonShort}</span>
                  </Link>
                ))}
              </div>

              {/* All Cantons Preview */}
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Alle 26 Kantone
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.values(CANTONS_MAP).slice(0, 12).map((canton) => (
                    <Link
                      key={canton.slug}
                      to={`/umzugsfirmen/kanton-${canton.slug}`}
                      onClick={onClose}
                      className="text-xs px-2.5 py-1.5 rounded-md border border-border hover:bg-accent hover:border-primary/30 transition-colors"
                    >
                      {canton.short}
                    </Link>
                  ))}
                  <Link
                    to="/regionen"
                    onClick={onClose}
                    className="text-xs px-2.5 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
                  >
                    +14 mehr
                  </Link>
                </div>
              </div>

              <Link
                to="/regionen"
                onClick={onClose}
                className="flex items-center gap-2 mt-6 px-3 py-2 text-sm font-semibold text-primary hover:underline"
              >
                Alle Kantone & Städte anzeigen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </DropdownSection>
          </div>
        </div>
      </div>
    </DropdownWrapper>
  );
};
