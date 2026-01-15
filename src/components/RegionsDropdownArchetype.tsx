/**
 * ARCHETYPE: Regions Dropdown (Kantone & Städte)
 * 
 * Structure:
 * - Column 1: Search + Beliebte Kantone
 * - Column 2: Beliebte Städte Grid
 * - Column 3: Alle Kantone Chips + CTA Card
 */

import { MapPin, Search, ArrowRight, Building2, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { DropdownWrapper } from "./navigation/DropdownWrapper";
import { DropdownSection } from "./navigation/DropdownSection";
import { DropdownCTACard } from "./navigation/DropdownCTACard";
import { CANTONS_MAP, CITIES_MAP, type CantonData, type CityData } from "@/data/locations";
import { Badge } from "@/components/ui/badge";

// Prioritized cantons (Tier 1)
const POPULAR_CANTONS = ['zuerich', 'bern', 'aargau', 'st-gallen', 'luzern', 'zug', 'basel-stadt', 'waadt'];

// Popular cities (Phase 1 top cities)
const POPULAR_CITIES = ['zuerich', 'bern', 'basel', 'genf', 'lausanne', 'luzern', 'winterthur', 'stgallen', 'zug', 'aarau', 'thun', 'biel'];

interface RegionsDropdownArchetypeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegionsDropdownArchetype = ({ isOpen, onClose }: RegionsDropdownArchetypeProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllCantons, setShowAllCantons] = useState(false);

  // Get popular cantons
  const popularCantons = useMemo(() => 
    POPULAR_CANTONS.map(slug => CANTONS_MAP[slug]).filter(Boolean) as CantonData[],
  []);

  // Get popular cities
  const popularCities = useMemo(() => 
    POPULAR_CITIES.map(slug => CITIES_MAP[slug]).filter(Boolean) as CityData[],
  []);

  // All cantons for chips
  const allCantons = useMemo(() => Object.values(CANTONS_MAP), []);

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
    
    return { cantons: matchedCantons.slice(0, 6), cities: matchedCities.slice(0, 10) };
  }, [searchTerm]);

  const hasSearchResults = searchTerm.trim() && (searchResults.cantons.length > 0 || searchResults.cities.length > 0);
  const noResults = searchTerm.trim() && searchResults.cantons.length === 0 && searchResults.cities.length === 0;

  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[300px_1fr_280px] gap-6 lg:gap-8">
          
          {/* Column 1: Search & Cantons */}
          <div>
            <DropdownSection title="Suche">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Kanton oder Stadt suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>

              {/* Search Results */}
              {hasSearchResults && (
                <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                  {searchResults.cantons.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Kantone</p>
                      <div className="space-y-1">
                        {searchResults.cantons.map((canton) => (
                          <Link
                            key={canton.slug}
                            to={`/umzugsfirmen/kanton-${canton.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                          >
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            <span>Kanton {canton.name}</span>
                            <Badge variant="secondary" className="ml-auto text-[10px]">{canton.short}</Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {searchResults.cities.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Städte</p>
                      <div className="space-y-1">
                        {searchResults.cities.map((city) => (
                          <Link
                            key={city.slug}
                            to={`/umzugsfirmen/${city.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                          >
                            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{city.name}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{city.cantonShort}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {noResults && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Keine Ergebnisse für "{searchTerm}"
                </p>
              )}

              {/* Popular Cantons (when not searching) */}
              {!searchTerm.trim() && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Beliebte Kantone</p>
                  <div className="space-y-1">
                    {popularCantons.slice(0, 6).map((canton) => (
                      <Link
                        key={canton.slug}
                        to={`/umzugsfirmen/kanton-${canton.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm group"
                      >
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span className="font-medium group-hover:text-primary transition-colors">
                          Kanton {canton.name}
                        </span>
                        <Badge variant="outline" className="ml-auto text-[10px]">{canton.short}</Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </DropdownSection>
          </div>

          {/* Column 2: Cities Grid */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownSection title="Beliebte Städte">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                {popularCities.map((city) => (
                  <Link
                    key={city.slug}
                    to={`/umzugsfirmen/${city.slug}`}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all",
                      "hover:bg-accent hover:text-primary"
                    )}
                  >
                    <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
                    <span className="truncate font-medium">{city.name}</span>
                  </Link>
                ))}
              </div>

              {/* All Cantons Chips */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-3">Alle 26 Kantone</p>
                <div className="flex flex-wrap gap-1.5">
                  {(showAllCantons ? allCantons : allCantons.slice(0, 12)).map((canton) => (
                    <Link
                      key={canton.slug}
                      to={`/umzugsfirmen/kanton-${canton.slug}`}
                      onClick={onClose}
                      className="text-xs px-2.5 py-1.5 rounded-md border border-border hover:bg-accent hover:border-primary/30 transition-colors"
                    >
                      {canton.short}
                    </Link>
                  ))}
                  {!showAllCantons && (
                    <button
                      onClick={() => setShowAllCantons(true)}
                      className="text-xs px-2.5 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
                    >
                      +{allCantons.length - 12} mehr
                    </button>
                  )}
                </div>
              </div>

              <Link
                to="/regionen"
                onClick={onClose}
                className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:underline"
              >
                Alle Kantone & Städte anzeigen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </DropdownSection>
          </div>

          {/* Column 3: CTA Card */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownCTACard
              title="Offerten in deiner Region"
              description="Finde geprüfte Anbieter in wenigen Minuten."
              icon={Navigation}
              bullets={[
                "Lokale Umzugsfirmen",
                "Verifizierte Partner",
                "Kostenlos vergleichen"
              ]}
              buttonText="Jetzt vergleichen"
              buttonHref="/umzugsofferten"
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </DropdownWrapper>
  );
};
