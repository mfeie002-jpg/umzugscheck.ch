import { MapPin, Search, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SwitzerlandMap } from "@/components/SwitzerlandMap";
import { PopularMovingRoutes } from "@/components/PopularMovingRoutes";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Navigation2, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuickCalculator } from "@/components/QuickCalculator";
import { CantonComparison } from "@/components/CantonComparison";
import { SeasonalPricing } from "@/components/SeasonalPricing";
import { RegionalReviews } from "@/components/RegionalReviews";
import { PricingAnalyticsDashboard } from "@/components/PricingAnalyticsDashboard";
import { RoutePlanner } from "@/components/RoutePlanner";
import { PriceAlerts } from "@/components/PriceAlerts";
import { CostOptimizer } from "@/components/CostOptimizer";
import { CantonRecommender } from "@/components/CantonRecommender";
import { HistoricalPriceTrends } from "@/components/HistoricalPriceTrends";
import { PriceHeatMap } from "@/components/PriceHeatMap";
import { AIMovingDateSuggester } from "@/components/AIMovingDateSuggester";
import { RealTimeAvailability } from "@/components/RealTimeAvailability";
import { CompetitivePricingAnalyzer } from "@/components/CompetitivePricingAnalyzer";
import { MLPricePredictions } from "@/components/MLPricePredictions";
import { WeatherBasedRecommendations } from "@/components/WeatherBasedRecommendations";
import { PeakHourAvoidance } from "@/components/PeakHourAvoidance";
import { ProviderPerformanceMatrix } from "@/components/ProviderPerformanceMatrix";
import { SmartMovingChecklist } from "@/components/SmartMovingChecklist";
import { CostQualityMatrix } from "@/components/CostQualityMatrix";
import { LeadDemandTracker } from "@/components/LeadDemandTracker";

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
    href: "/zuerich",
    cities: ["Zürich", "Winterthur", "Uster"]
  },
  { 
    name: "Bern", 
    code: "BE", 
    href: "/bern",
    cities: ["Bern", "Biel", "Thun"]
  },
  { 
    name: "Luzern", 
    code: "LU", 
    href: "/luzern",
    cities: ["Luzern", "Emmen", "Kriens"]
  },
  { 
    name: "Uri", 
    code: "UR", 
    href: "/uri",
    cities: ["Altdorf"]
  },
  { 
    name: "Schwyz", 
    code: "SZ", 
    href: "/schwyz",
    cities: ["Schwyz", "Einsiedeln"]
  },
  { 
    name: "Obwalden", 
    code: "OW", 
    href: "/obwalden",
    cities: ["Sarnen"]
  },
  { 
    name: "Nidwalden", 
    code: "NW", 
    href: "/nidwalden",
    cities: ["Stans"]
  },
  { 
    name: "Glarus", 
    code: "GL", 
    href: "/glarus",
    cities: ["Glarus"]
  },
  { 
    name: "Zug", 
    code: "ZG", 
    href: "/zug",
    cities: ["Zug", "Baar", "Cham"]
  },
  { 
    name: "Fribourg", 
    code: "FR", 
    href: "/fribourg",
    cities: ["Fribourg", "Bulle"]
  },
  { 
    name: "Solothurn", 
    code: "SO", 
    href: "/solothurn",
    cities: ["Solothurn", "Olten"]
  },
  { 
    name: "Basel", 
    code: "BS", 
    href: "/basel",
    cities: ["Basel"]
  },
  { 
    name: "Schaffhausen", 
    code: "SH", 
    href: "/schaffhausen",
    cities: ["Schaffhausen"]
  },
  { 
    name: "Appenzell", 
    code: "AR", 
    href: "/appenzell",
    cities: ["Herisau", "Appenzell"]
  },
  { 
    name: "St. Gallen", 
    code: "SG", 
    href: "/st-gallen",
    cities: ["St. Gallen", "Rapperswil"]
  },
  { 
    name: "Graubünden", 
    code: "GR", 
    href: "/graubuenden",
    cities: ["Chur", "Davos"]
  },
  { 
    name: "Aargau", 
    code: "AG", 
    href: "/aargau",
    cities: ["Aarau", "Baden", "Wettingen"]
  },
  { 
    name: "Thurgau", 
    code: "TG", 
    href: "/thurgau",
    cities: ["Frauenfeld", "Kreuzlingen"]
  },
  { 
    name: "Tessin", 
    code: "TI", 
    href: "/tessin",
    cities: ["Lugano", "Bellinzona", "Locarno"]
  },
  { 
    name: "Wallis", 
    code: "VS", 
    href: "/wallis",
    cities: ["Sion", "Martigny"]
  },
  { 
    name: "Neuchâtel", 
    code: "NE", 
    href: "/neuchatel",
    cities: ["Neuchâtel", "La Chaux-de-Fonds"]
  },
  { 
    name: "Genève", 
    code: "GE", 
    href: "/geneve",
    cities: ["Genève", "Carouge"]
  },
  { 
    name: "Jura", 
    code: "JU", 
    href: "/jura",
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
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean>(false);
  const { nearestCanton, requestLocation, loading: geoLoading } = useGeolocation();

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
        .select('service_areas, service_types');

      if (companies) {
        const counts: Record<string, number> = {};
        
        cantons.forEach(canton => {
          const count = companies.filter(company => {
            const hasServiceArea = company.service_areas?.includes(canton.code);
            
            // Apply service filter
            if (serviceFilter !== "all") {
              const hasService = company.service_types?.includes(serviceFilter);
              return hasServiceArea && hasService;
            }
            
            return hasServiceArea;
          }).length;
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

  useEffect(() => {
    if (isOpen && serviceFilter !== "all") {
      fetchCompanyCounts();
    }
  }, [serviceFilter]);

  const filteredCantons = cantons.filter(canton => {
    // Apply availability filter
    if (availabilityFilter && companyCounts[canton.code] === 0) {
      return false;
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const cantonMatch = canton.name.toLowerCase().includes(searchLower) || 
                          canton.code.toLowerCase().includes(searchLower);
      const cityMatch = canton.cities?.some(city => 
        city.toLowerCase().includes(searchLower)
      );
      return cantonMatch || cityMatch;
    }

    return true;
  });

  // Sort cantons: nearest first (if geolocation enabled), then by name
  const sortedCantons = [...filteredCantons].sort((a, b) => {
    if (nearestCanton) {
      if (a.code === nearestCanton) return -1;
      if (b.code === nearestCanton) return 1;
    }
    return a.name.localeCompare(b.name);
  });

  const handleCantonClick = (cantonCode: string) => {
    const canton = cantons.find(c => c.code === cantonCode);
    if (canton) {
      window.location.href = canton.href;
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/5 z-40 hidden lg:block"
        onClick={onClose}
      />
      
      {/* Dropdown Content */}
      <div className="hidden lg:block absolute left-0 right-0 top-full mt-0 bg-white border-t border-border shadow-strong z-50 animate-fade-in max-h-[85vh] md:max-h-[70vh] overflow-hidden">
        <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 h-full">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            <div className="mb-3 md:mb-4 flex-shrink-0">
              <h3 className="text-base md:text-lg font-bold text-foreground mb-1">Regionen & Kantone</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                Finden Sie Umzugsfirmen in Ihrer Region
              </p>

              {/* Filters and Search Row */}
              <div className="flex flex-col gap-2 md:gap-3 mb-3 md:mb-4">
                {/* Search Input */}
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Kanton suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 md:pl-10 text-sm h-9 md:h-10"
                  />
                </div>

                {/* Service Type Filter - Hidden on mobile */}
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger className="hidden md:flex w-40 h-9 md:h-10">
                    <Filter className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" />
                    <SelectValue placeholder="Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Services</SelectItem>
                    <SelectItem value="moving">Umzug</SelectItem>
                    <SelectItem value="cleaning">Reinigung</SelectItem>
                    <SelectItem value="disposal">Entsorgung</SelectItem>
                    <SelectItem value="storage">Lagerung</SelectItem>
                    <SelectItem value="packing">Packservice</SelectItem>
                  </SelectContent>
                </Select>

                {/* Geolocation Button - Compact on mobile */}
                <Button
                  variant="outline"
                  onClick={requestLocation}
                  disabled={geoLoading}
                  className="whitespace-nowrap h-9 md:h-10 px-3 md:px-4"
                  size="sm"
                >
                  <Navigation2 className="w-3.5 h-3.5 md:w-4 md:h-4 md:mr-2" />
                  <span className="hidden md:inline">
                    {nearestCanton ? `Nähe: ${nearestCanton}` : "Mein Standort"}
                  </span>
                </Button>
              </div>
            </div>

            <Tabs defaultValue="list" className="w-full flex-1 flex flex-col min-h-0">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-3 md:mb-4 h-9 md:h-10 flex-shrink-0">
                <TabsTrigger value="list" className="text-xs md:text-sm">Liste</TabsTrigger>
                <TabsTrigger value="map" className="text-xs md:text-sm">Karte</TabsTrigger>
                <TabsTrigger value="routes" className="hidden md:flex text-xs md:text-sm">Routen</TabsTrigger>
                <TabsTrigger value="insights" className="hidden md:flex text-xs md:text-sm">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="flex-1 min-h-0 mt-0">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 md:gap-2 max-h-full overflow-y-auto pb-2">
                  {sortedCantons.map((canton) => (
                    <div key={canton.code} className="relative group/canton">
                      <Link
                        to={canton.href}
                        onClick={onClose}
                        className={cn(
                          "group px-2 md:px-3 py-1.5 md:py-2 rounded-md md:rounded-lg border border-border bg-background",
                          "hover:border-primary/40 hover:shadow-soft transition-all duration-200",
                          "flex items-center gap-1.5 md:gap-2",
                          nearestCanton === canton.code && "border-primary bg-primary/5"
                        )}
                      >
                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-md md:rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <h4 className="font-semibold text-foreground text-xs md:text-sm group-hover:text-primary transition-colors truncate">
                              {canton.name}
                            </h4>
                            {nearestCanton === canton.code && (
                              <Badge variant="secondary" className="text-[9px] md:text-[10px] px-1 py-0 h-3.5 md:h-4">
                                Nächste
                              </Badge>
                            )}
                          </div>
                          {!loading && companyCounts[canton.code] > 0 && (
                            <p className="text-[10px] md:text-xs text-muted-foreground">
                              {companyCounts[canton.code]} Firmen
                            </p>
                          )}
                        </div>
                        {canton.cities && canton.cities.length > 0 && (
                          <ChevronDown className="w-3 h-3 text-muted-foreground" />
                        )}
                      </Link>
                      
                      {/* Cities Dropdown */}
                      {canton.cities && canton.cities.length > 0 && (
                        <div className="absolute left-0 top-full mt-1 w-full bg-white border border-border rounded-lg shadow-lg z-10 opacity-0 invisible group-hover/canton:opacity-100 group-hover/canton:visible transition-all duration-200">
                          <div className="p-2 space-y-1">
                            {canton.cities.map((city) => (
                              <Link
                                key={city}
                                to={`/${city.toLowerCase().replace(/\s+/g, '-')}/umzugsfirmen`}
                                onClick={onClose}
                                className="block px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded transition-colors"
                              >
                                {city}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {sortedCantons.length === 0 && (
                  <div className="text-center py-8 md:py-12 text-muted-foreground">
                    <p className="text-sm">Keine Regionen gefunden</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="map" className="mt-0 h-[350px] min-h-[350px]">
                <div className="h-full w-full">
                  <SwitzerlandMap
                    onCantonClick={handleCantonClick}
                    companyCounts={companyCounts}
                    highlightedCantons={nearestCanton ? [nearestCanton] : []}
                  />
                </div>
              </TabsContent>

              <TabsContent value="routes" className="flex-1 min-h-0 mt-0">
                <div className="max-h-full overflow-y-auto">
                  <PopularMovingRoutes />
                </div>
              </TabsContent>

              <TabsContent value="insights" className="flex-1 min-h-0 mt-0">
                <div className="space-y-3 md:space-y-4 max-h-full overflow-y-auto pr-1 md:pr-2 pb-2">
                {/* Row 1: Quick Tools */}
                <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                  <QuickCalculator />
                  <RoutePlanner />
                </div>

                {/* Row 2: Alerts & Optimization */}
                <div className="grid md:grid-cols-2 gap-4">
                  <PriceAlerts />
                  <CostOptimizer />
                </div>

                {/* Row 3: AI & Recommendations */}
                <div className="grid md:grid-cols-2 gap-4">
                  <CantonRecommender />
                  <AIMovingDateSuggester />
                </div>

                {/* Row 4: Historical & ML */}
                <div className="grid md:grid-cols-2 gap-4">
                  <HistoricalPriceTrends />
                  <MLPricePredictions />
                </div>

                {/* Full Width: Heat Map */}
                <PriceHeatMap />

                {/* Row 5: Real-Time Tracking */}
                <div className="grid md:grid-cols-2 gap-4">
                  <RealTimeAvailability />
                  <LeadDemandTracker />
                </div>

                {/* Row 6: Weather & Peak Hours */}
                <div className="grid md:grid-cols-2 gap-4">
                  <WeatherBasedRecommendations />
                  <PeakHourAvoidance />
                </div>

                {/* Row 7: Performance & Competitive */}
                <div className="grid md:grid-cols-2 gap-4">
                  <ProviderPerformanceMatrix />
                  <CompetitivePricingAnalyzer />
                </div>

                {/* Row 8: Matrix Views */}
                <div className="grid md:grid-cols-2 gap-4">
                  <CostQualityMatrix />
                  <CantonComparison />
                </div>

                {/* Row 9: Analytics & Planning */}
                <PricingAnalyticsDashboard />
                <SmartMovingChecklist />

                {/* Row 10: Final Insights */}
                <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                  <SeasonalPricing />
                  <RegionalReviews />
                </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border flex-shrink-0">
              <Link
                to="/regionen"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 md:gap-2 text-primary hover:text-primary/80 font-medium transition-colors text-sm"
              >
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Alle Regionen anzeigen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
