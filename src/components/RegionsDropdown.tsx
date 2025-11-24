import { MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Canton {
  name: string;
  code: string;
  href: string;
  cities?: string[];
}

const cantons: Canton[] = [
  { 
    name: "Zürich", 
    code: "ZH", 
    href: "/zuerich/umzugsfirmen",
    cities: ["Zürich", "Winterthur", "Uster"]
  },
  { 
    name: "Bern", 
    code: "BE", 
    href: "/bern/umzugsfirmen",
    cities: ["Bern", "Biel", "Thun"]
  },
  { 
    name: "Luzern", 
    code: "LU", 
    href: "/luzern/umzugsfirmen",
    cities: ["Luzern", "Emmen", "Kriens"]
  },
  { 
    name: "Uri", 
    code: "UR", 
    href: "/uri/umzugsfirmen",
    cities: ["Altdorf"]
  },
  { 
    name: "Schwyz", 
    code: "SZ", 
    href: "/schwyz/umzugsfirmen",
    cities: ["Schwyz", "Einsiedeln"]
  },
  { 
    name: "Obwalden", 
    code: "OW", 
    href: "/obwalden/umzugsfirmen",
    cities: ["Sarnen"]
  },
  { 
    name: "Nidwalden", 
    code: "NW", 
    href: "/nidwalden/umzugsfirmen",
    cities: ["Stans"]
  },
  { 
    name: "Glarus", 
    code: "GL", 
    href: "/glarus/umzugsfirmen",
    cities: ["Glarus"]
  },
  { 
    name: "Zug", 
    code: "ZG", 
    href: "/zug/umzugsfirmen",
    cities: ["Zug", "Baar", "Cham"]
  },
  { 
    name: "Fribourg", 
    code: "FR", 
    href: "/fribourg/umzugsfirmen",
    cities: ["Fribourg", "Bulle"]
  },
  { 
    name: "Solothurn", 
    code: "SO", 
    href: "/solothurn/umzugsfirmen",
    cities: ["Solothurn", "Olten"]
  },
  { 
    name: "Basel-Stadt", 
    code: "BS", 
    href: "/basel-stadt/umzugsfirmen",
    cities: ["Basel"]
  },
  { 
    name: "Basel-Landschaft", 
    code: "BL", 
    href: "/basel-landschaft/umzugsfirmen",
    cities: ["Liestal", "Allschwil"]
  },
  { 
    name: "Schaffhausen", 
    code: "SH", 
    href: "/schaffhausen/umzugsfirmen",
    cities: ["Schaffhausen"]
  },
  { 
    name: "Appenzell Ausserrhoden", 
    code: "AR", 
    href: "/appenzell-ausserrhoden/umzugsfirmen",
    cities: ["Herisau"]
  },
  { 
    name: "Appenzell Innerrhoden", 
    code: "AI", 
    href: "/appenzell-innerrhoden/umzugsfirmen",
    cities: ["Appenzell"]
  },
  { 
    name: "St. Gallen", 
    code: "SG", 
    href: "/st-gallen/umzugsfirmen",
    cities: ["St. Gallen", "Rapperswil"]
  },
  { 
    name: "Graubünden", 
    code: "GR", 
    href: "/graubuenden/umzugsfirmen",
    cities: ["Chur", "Davos"]
  },
  { 
    name: "Aargau", 
    code: "AG", 
    href: "/aargau/umzugsfirmen",
    cities: ["Aarau", "Baden", "Wettingen"]
  },
  { 
    name: "Thurgau", 
    code: "TG", 
    href: "/thurgau/umzugsfirmen",
    cities: ["Frauenfeld", "Kreuzlingen"]
  },
  { 
    name: "Ticino", 
    code: "TI", 
    href: "/ticino/umzugsfirmen",
    cities: ["Lugano", "Bellinzona", "Locarno"]
  },
  { 
    name: "Vaud", 
    code: "VD", 
    href: "/vaud/umzugsfirmen",
    cities: ["Lausanne", "Montreux", "Vevey"]
  },
  { 
    name: "Valais", 
    code: "VS", 
    href: "/valais/umzugsfirmen",
    cities: ["Sion", "Martigny"]
  },
  { 
    name: "Neuchâtel", 
    code: "NE", 
    href: "/neuchatel/umzugsfirmen",
    cities: ["Neuchâtel", "La Chaux-de-Fonds"]
  },
  { 
    name: "Genève", 
    code: "GE", 
    href: "/geneve/umzugsfirmen",
    cities: ["Genève", "Carouge"]
  },
  { 
    name: "Jura", 
    code: "JU", 
    href: "/jura/umzugsfirmen",
    cities: ["Delémont"]
  }
];

interface RegionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegionsDropdown = ({ isOpen, onClose }: RegionsDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [companyCounts, setCompanyCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchCompanyCounts();
    }
  }, [isOpen]);

  const fetchCompanyCounts = async () => {
    setLoading(true);
    try {
      const { data: companies } = await supabase
        .from('companies')
        .select('service_areas');

      if (companies) {
        const counts: Record<string, number> = {};
        
        cantons.forEach(canton => {
          const count = companies.filter(company => 
            company.service_areas?.includes(canton.code)
          ).length;
          counts[canton.code] = count;
        });
        
        setCompanyCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching company counts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCantons = cantons.filter(canton => {
    const searchLower = searchTerm.toLowerCase();
    const cantonMatch = canton.name.toLowerCase().includes(searchLower) || 
                        canton.code.toLowerCase().includes(searchLower);
    const cityMatch = canton.cities?.some(city => 
      city.toLowerCase().includes(searchLower)
    );
    return cantonMatch || cityMatch;
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/5 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown Content */}
      <div className="absolute left-0 right-0 top-full mt-0 bg-white border-t border-border shadow-strong z-50 animate-fade-in">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground mb-1">Regionen & Kantone</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Finden Sie Umzugsfirmen in Ihrer Region
              </p>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Kanton oder Stadt suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {filteredCantons.map((canton) => (
                <div key={canton.code} className="space-y-2">
                  <Link
                    to={canton.href}
                    onClick={onClose}
                    className={cn(
                      "group p-3 rounded-lg border border-border bg-background",
                      "hover:border-primary/40 hover:shadow-soft transition-all duration-200",
                      "flex items-center gap-3 w-full"
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                          {canton.name}
                        </h4>
                        {!loading && companyCounts[canton.code] > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {companyCounts[canton.code]}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {canton.code}
                      </p>
                    </div>
                  </Link>

                  {/* Cities */}
                  {canton.cities && canton.cities.length > 0 && (
                    <div className="ml-11 space-y-1">
                      {canton.cities.map((city) => (
                        <Link
                          key={city}
                          to={`/${city.toLowerCase().replace(/\s+/g, '-')}/umzugsfirmen`}
                          onClick={onClose}
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                        >
                          • {city}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredCantons.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Keine Regionen gefunden</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-border">
              <Link
                to="/regionen"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Alle Regionen anzeigen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
