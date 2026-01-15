/**
 * Dropdown: Firmen vergleichen (Ultimate Variant)
 * 
 * ULTIMATE DESIGN - Lokale Suche mit Kanton-Directory
 * - Suchfeld mit Autocomplete
 * - Top 5 Städte prominent
 * - Alle 26 Kantone A-Z
 * - CTA: Offerten in deiner Region
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  MapPin, 
  Building2,
  ArrowRight,
  Navigation,
  Star,
  TrendingUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownWrapper } from "@/components/navigation/DropdownWrapper";
import { DropdownSection } from "@/components/navigation/DropdownSection";
import { DropdownCTACard } from "@/components/navigation/DropdownCTACard";
import { CANTONS_MAP, CITIES_MAP, type CityData } from "@/data/locations";
import { cn } from "@/lib/utils";
import { useNavigationVariant } from "@/hooks/useNavigationVariant";

interface UmzugsfirmaFindenDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

// Top 5 Städte (höchste Conversion)
const POPULAR_CITIES = ['zuerich', 'bern', 'basel', 'genf', 'lausanne'];

// Alle Kantone für die A-Z Liste
const ALL_CANTONS = Object.values(CANTONS_MAP);

// Gruppierung nach Alphabet
const CANTON_GROUPS = {
  'A–F': ALL_CANTONS.filter(c => c.name[0] >= 'A' && c.name[0] <= 'F'),
  'G–N': ALL_CANTONS.filter(c => c.name[0] >= 'G' && c.name[0] <= 'N'),
  'O–Z': ALL_CANTONS.filter(c => c.name[0] >= 'O' && c.name[0] <= 'Z'),
};

export const UmzugsfirmaFindenDropdown = ({ isOpen, onClose }: UmzugsfirmaFindenDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navVariant = useNavigationVariant();

  // Popular cities data
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
    
    return { cantons: matchedCantons.slice(0, 5), cities: matchedCities.slice(0, 8) };
  }, [searchTerm]);

  const hasSearchResults = searchTerm.trim() && (searchResults.cantons.length > 0 || searchResults.cities.length > 0);
  const noResults = searchTerm.trim() && searchResults.cantons.length === 0 && searchResults.cities.length === 0;

  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[260px_1fr_280px] gap-6 lg:gap-8">
          
          {/* Column 1: Suche + Beliebte Städte */}
          <div>
            <DropdownSection 
              title={navVariant.dropdownTitles.firmen} 
              subtitle={navVariant.microcopy.firmen}
            >
              {/* Suchfeld */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Ort oder PLZ eingeben..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 border-2 focus:border-primary"
                />
              </div>

              {/* Suchergebnisse */}
              {hasSearchResults && (
                <div className="space-y-3 mb-4 max-h-[280px] overflow-y-auto">
                  {searchResults.cantons.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Kantone</p>
                      <div className="space-y-1">
                        {searchResults.cantons.map((canton) => (
                          <Link
                            key={canton.slug}
                            to={`/umzugsfirmen/kanton-${canton.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm"
                          >
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            <span className="font-medium">Kanton {canton.name}</span>
                            <Badge variant="secondary" className="ml-auto text-[10px]">{canton.short}</Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {searchResults.cities.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Städte</p>
                      <div className="space-y-1">
                        {searchResults.cities.map((city) => (
                          <Link
                            key={city.slug}
                            to={`/umzugsfirmen/${city.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm"
                          >
                            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="font-medium">{city.name}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{city.cantonShort}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {noResults && (
                <p className="text-sm text-muted-foreground text-center py-3 bg-muted rounded-lg">
                  Keine Ergebnisse für "{searchTerm}"
                </p>
              )}

              {/* Beliebte Städte (wenn nicht gesucht wird) */}
              {!searchTerm.trim() && (
                <div className="mt-3">
                  <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Beliebte Städte</p>
                  <div className="space-y-0.5">
                    {popularCities.map((city) => (
                      <Link
                        key={city.slug}
                        to={`/umzugsfirmen/${city.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm group"
                      >
                        <Building2 className="w-4 h-4 text-primary" />
                        <span className="font-medium group-hover:text-primary transition-colors">
                          Umzugsfirma {city.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </DropdownSection>
          </div>

          {/* Column 2: Kantone A–Z */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownSection title="Alle Kantone A–Z">
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(CANTON_GROUPS).map(([groupName, cantons]) => (
                  <div key={groupName}>
                    <p className="text-xs font-bold text-primary mb-2">{groupName}</p>
                    <div className="space-y-0.5">
                      {cantons.map((canton) => (
                        <Link
                          key={canton.slug}
                          to={`/umzugsfirmen/kanton-${canton.slug}`}
                          onClick={onClose}
                          className={cn(
                            "block text-sm py-1.5 px-2 rounded hover:bg-accent hover:text-primary transition-colors truncate",
                            "text-muted-foreground hover:text-foreground"
                          )}
                          title={`Umzugsfirmen im Kanton ${canton.name}`}
                        >
                          {canton.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/regionen"
                onClick={onClose}
                className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-primary hover:underline"
              >
                Alle Städte & Regionen anzeigen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </DropdownSection>
          </div>

          {/* Column 3: CTA Card */}
          <div className="lg:border-l lg:border-border lg:pl-6">
            <DropdownCTACard
              title={navVariant.ctaCard.firmen.title}
              description="Finde geprüfte Umzugsfirmen in wenigen Minuten."
              icon={Navigation}
              bullets={[
                "Lokale Top-Firmen",
                "Bewertungen & Vergleich",
                "Kostenlos & unverbindlich"
              ]}
              buttonText={navVariant.ctaCard.firmen.buttonText}
              buttonHref="/umzugsofferten"
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </DropdownWrapper>
  );
};
