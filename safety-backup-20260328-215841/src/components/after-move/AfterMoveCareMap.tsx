/**
 * AfterMoveCareMap - Interactive POI Map for After Move Care
 * Shows points of interest around the new address with categories
 * Uses Leaflet (open-source) with OpenStreetMap tiles
 */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  MapPin,
  GraduationCap,
  ShoppingCart,
  Train,
  Stethoscope,
  Dumbbell,
  Coffee,
  Utensils,
  Building2,
  TreePine,
  Baby,
  Sparkles,
  Navigation,
  X,
  ChevronRight,
  Star,
  Clock,
  Phone,
  ExternalLink,
  Loader2
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// POI Category definitions
export type POICategory = 
  | 'school'
  | 'supermarket'
  | 'transport'
  | 'doctor'
  | 'pharmacy'
  | 'gym'
  | 'restaurant'
  | 'cafe'
  | 'park'
  | 'kindergarten'
  | 'bank'
  | 'all';

interface POICategoryConfig {
  id: POICategory;
  label: string;
  labelDe: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  markerColor: string;
}

const POI_CATEGORIES: POICategoryConfig[] = [
  { id: 'all', label: 'All', labelDe: 'Alle', icon: Sparkles, color: 'text-primary', bgColor: 'bg-primary/10', markerColor: '#3b82f6' },
  { id: 'school', label: 'Schools', labelDe: 'Schulen', icon: GraduationCap, color: 'text-blue-600', bgColor: 'bg-blue-100', markerColor: '#2563eb' },
  { id: 'kindergarten', label: 'Kindergarten', labelDe: 'Kindergärten', icon: Baby, color: 'text-pink-500', bgColor: 'bg-pink-100', markerColor: '#ec4899' },
  { id: 'supermarket', label: 'Supermarkets', labelDe: 'Supermärkte', icon: ShoppingCart, color: 'text-green-600', bgColor: 'bg-green-100', markerColor: '#16a34a' },
  { id: 'transport', label: 'Public Transport', labelDe: 'ÖV', icon: Train, color: 'text-orange-500', bgColor: 'bg-orange-100', markerColor: '#f97316' },
  { id: 'doctor', label: 'Doctors', labelDe: 'Ärzte', icon: Stethoscope, color: 'text-red-500', bgColor: 'bg-red-100', markerColor: '#ef4444' },
  { id: 'gym', label: 'Fitness', labelDe: 'Fitness', icon: Dumbbell, color: 'text-purple-500', bgColor: 'bg-purple-100', markerColor: '#a855f7' },
  { id: 'restaurant', label: 'Restaurants', labelDe: 'Restaurants', icon: Utensils, color: 'text-amber-600', bgColor: 'bg-amber-100', markerColor: '#d97706' },
  { id: 'cafe', label: 'Cafés', labelDe: 'Cafés', icon: Coffee, color: 'text-brown-600', bgColor: 'bg-amber-50', markerColor: '#92400e' },
  { id: 'park', label: 'Parks', labelDe: 'Parks', icon: TreePine, color: 'text-emerald-600', bgColor: 'bg-emerald-100', markerColor: '#059669' },
  { id: 'bank', label: 'Banks', labelDe: 'Banken', icon: Building2, color: 'text-slate-600', bgColor: 'bg-slate-100', markerColor: '#475569' },
];

// POI data interface
export interface POIMarker {
  id: string;
  name: string;
  category: POICategory;
  lat: number;
  lng: number;
  address?: string;
  distance?: number; // meters from center
  rating?: number;
  reviewCount?: number;
  phone?: string;
  website?: string;
  openingHours?: string;
}

interface AfterMoveCareMapProps {
  /** Center coordinates (lat, lng) - typically the new address */
  center: { lat: number; lng: number };
  /** Address display string */
  addressLabel?: string;
  /** City name for display */
  cityName?: string;
  /** Pre-loaded POIs from database */
  pois?: POIMarker[];
  /** Whether to fetch POIs from Overpass API */
  fetchPOIs?: boolean;
  /** Search radius in meters */
  radiusMeters?: number;
  /** Callback when POI is selected */
  onPOISelect?: (poi: POIMarker) => void;
  /** Custom class name */
  className?: string;
  /** Compact mode for embedding */
  variant?: 'full' | 'compact';
}

// Create custom marker icon
function createCategoryIcon(category: POICategory): L.DivIcon {
  const config = POI_CATEGORIES.find(c => c.id === category) || POI_CATEGORIES[0];
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${config.markerColor};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <div style="transform: rotate(45deg); color: white; font-size: 14px;">●</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Generate mock POIs for demo (in production, fetch from Overpass API or database)
function generateMockPOIs(center: { lat: number; lng: number }, radius: number): POIMarker[] {
  const categories: POICategory[] = ['school', 'supermarket', 'transport', 'doctor', 'gym', 'restaurant', 'cafe', 'park', 'kindergarten', 'bank'];
  const mockPOIs: POIMarker[] = [];
  
  const names: Record<POICategory, string[]> = {
    school: ['Primarschule', 'Sekundarschule', 'Kantonsschule', 'Gymnasium'],
    kindergarten: ['Chindsgi Sonnenschein', 'Waldkindergarten', 'Kinderhaus Regenbogen'],
    supermarket: ['Migros', 'Coop', 'Denner', 'Aldi', 'Lidl', 'Volg'],
    transport: ['SBB Bahnhof', 'Busstation', 'Tramhaltestelle', 'S-Bahn Station'],
    doctor: ['Hausarztpraxis', 'Zahnarzt Dr. Müller', 'Kinderarzt', 'HNO-Praxis'],
    gym: ['Fitness Park', 'CrossFit Box', 'Yoga Studio', 'Schwimmbad'],
    restaurant: ['Pizzeria Roma', 'China Garden', 'Gasthof Hirschen', 'Thai Kitchen'],
    cafe: ['Starbucks', 'Café Müller', 'Bäckerei Konditorei', 'Café Central'],
    park: ['Stadtpark', 'Spielplatz', 'Waldweg', 'Seeufer'],
    bank: ['UBS', 'Credit Suisse', 'Raiffeisen', 'PostFinance'],
    pharmacy: [],
    all: [],
  };

  categories.forEach(category => {
    const count = Math.floor(Math.random() * 4) + 2;
    const categoryNames = names[category] || [];
    
    for (let i = 0; i < Math.min(count, categoryNames.length); i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * radius;
      const lat = center.lat + (distance / 111000) * Math.cos(angle);
      const lng = center.lng + (distance / (111000 * Math.cos(center.lat * Math.PI / 180))) * Math.sin(angle);
      
      mockPOIs.push({
        id: `${category}-${i}`,
        name: categoryNames[i],
        category,
        lat,
        lng,
        distance: Math.round(distance),
        rating: 3.5 + Math.random() * 1.5,
        reviewCount: Math.floor(Math.random() * 200) + 10,
        address: `Musterstrasse ${Math.floor(Math.random() * 100) + 1}`,
        openingHours: '08:00 - 18:00',
      });
    }
  });
  
  return mockPOIs;
}

export const AfterMoveCareMap = memo(function AfterMoveCareMap({
  center,
  addressLabel,
  cityName,
  pois: externalPOIs,
  fetchPOIs = false,
  radiusMeters = 1000,
  onPOISelect,
  className,
  variant = 'full'
}: AfterMoveCareMapProps) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const overlaysRef = useRef<L.LayerGroup | null>(null);

  const [activeCategory, setActiveCategory] = useState<POICategory>('all');
  const [selectedPOI, setSelectedPOI] = useState<POIMarker | null>(null);
  const [pois, setPois] = useState<POIMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate or use provided POIs
  useEffect(() => {
    setIsLoading(true);
    
    if (externalPOIs && externalPOIs.length > 0) {
      setPois(externalPOIs);
      setIsLoading(false);
    } else {
      // Demo: Generate mock POIs (in production, fetch from Overpass API)
      const timer = setTimeout(() => {
        const mockPOIs = generateMockPOIs(center, radiusMeters);
        setPois(mockPOIs);
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [center, radiusMeters, externalPOIs]);

  // Filter POIs by category
  const filteredPOIs = useMemo(() => {
    if (activeCategory === 'all') return pois;
    return pois.filter(poi => poi.category === activeCategory);
  }, [pois, activeCategory]);

  // Count POIs by category
  const poiCounts = useMemo(() => {
    const counts: Record<POICategory, number> = {} as Record<POICategory, number>;
    POI_CATEGORIES.forEach(cat => {
      counts[cat.id] = cat.id === 'all' 
        ? pois.length 
        : pois.filter(p => p.category === cat.id).length;
    });
    return counts;
  }, [pois]);

  const handlePOIClick = useCallback((poi: POIMarker) => {
    setSelectedPOI(poi);
    onPOISelect?.(poi);
  }, [onPOISelect]);

  const getCategoryConfig = (category: POICategory) => 
    POI_CATEGORIES.find(c => c.id === category) || POI_CATEGORIES[0];

  // Init map once + cleanup on unmount
  useEffect(() => {
    if (!mapDivRef.current) return;
    if (mapRef.current) return;

    const map = L.map(mapDivRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const overlays = L.layerGroup().addTo(map);
    overlaysRef.current = overlays;
    mapRef.current = map;

    return () => {
      overlaysRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update overlays when inputs change
  useEffect(() => {
    const map = mapRef.current;
    const overlays = overlaysRef.current;
    if (!map || !overlays) return;

    // Center
    map.setView([center.lat, center.lng], 15, { animate: false });

    // Clear previous overlays
    overlays.clearLayers();

    // Radius circle
    L.circle([center.lat, center.lng], {
      radius: radiusMeters,
      color: 'hsl(var(--primary))',
      fillColor: 'hsl(var(--primary))',
      fillOpacity: 0.08,
      weight: 2,
      dashArray: '5, 5',
    }).addTo(overlays);

    // Center marker
    const homeIcon = L.divIcon({
      className: 'home-marker',
      html: `
        <div style="
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.8));
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          border: 3px solid white;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22" fill="rgba(255,255,255,0.3)"></polyline>
          </svg>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const homePopup = `
      <div style="font-weight: 600;">🏠 Ihre neue Adresse</div>
      ${addressLabel ? `<div style="font-size: 12px; opacity: 0.85;">${escapeHtml(addressLabel)}</div>` : ''}
    `;

    L.marker([center.lat, center.lng], { icon: homeIcon })
      .bindPopup(homePopup)
      .addTo(overlays);

    // POI markers
    filteredPOIs.forEach((poi) => {
      const popupHtml = `
        <div style="min-width: 200px;">
          <div style="font-weight: 600;">${escapeHtml(poi.name)}</div>
          <div style="margin-top: 6px; font-size: 12px; opacity: .85;">${escapeHtml(getCategoryConfig(poi.category).labelDe)}</div>
          ${poi.distance ? `<div style="margin-top: 6px; font-size: 12px; opacity: .85;">📍 ${poi.distance}m entfernt</div>` : ''}
          ${poi.rating ? `<div style="margin-top: 6px; font-size: 12px; opacity: .9;">⭐ ${poi.rating.toFixed(1)}${poi.reviewCount ? ` (${poi.reviewCount})` : ''}</div>` : ''}
        </div>
      `;

      const marker = L.marker([poi.lat, poi.lng], {
        icon: createCategoryIcon(poi.category),
      }).addTo(overlays);

      marker.bindPopup(popupHtml);
      marker.on('click', () => handlePOIClick(poi));
    });
  }, [addressLabel, center.lat, center.lng, filteredPOIs, handlePOIClick, radiusMeters]);

  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-0">
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Header */}
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Navigation className="h-5 w-5 text-primary" />
              Umgebungs-Scan
            </CardTitle>
            {addressLabel && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span>{addressLabel}</span>
                {cityName && <Badge variant="secondary">{cityName}</Badge>}
              </div>
            )}
          </div>
          <Badge variant="outline" className="gap-1">
            <MapPin className="h-3 w-3" />
            {radiusMeters}m Radius
          </Badge>
        </div>

        {/* Category Filter */}
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {POI_CATEGORIES.slice(0, variant === 'compact' ? 6 : undefined).map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              const count = poiCounts[cat.id];
              
              return (
                <Button
                  key={cat.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "flex-shrink-0 gap-1.5 h-8",
                    isActive && "shadow-sm"
                  )}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{cat.labelDe}</span>
                  <Badge 
                    variant={isActive ? "secondary" : "outline"} 
                    className="h-5 px-1.5 text-xs"
                  >
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardHeader>

      {/* Map */}
      <CardContent className="p-0 relative">
        <div className={cn("w-full", variant === 'compact' ? "h-[300px]" : "h-[400px] md:h-[500px]")}>
          <div ref={mapDivRef} className="h-full w-full bg-muted" />
        </div>

        {/* Selected POI Detail Panel */}
        {selectedPOI && (
          <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-4 animate-in slide-in-from-bottom">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {(() => {
                    const config = getCategoryConfig(selectedPOI.category);
                    const Icon = config.icon;
                    return (
                      <div className={cn("p-1.5 rounded-md", config.bgColor)}>
                        <Icon className={cn("h-4 w-4", config.color)} />
                      </div>
                    );
                  })()}
                  <div>
                    <h4 className="font-semibold">{selectedPOI.name}</h4>
                    <p className="text-xs text-muted-foreground">{selectedPOI.address}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-2 text-xs">
                  {selectedPOI.distance && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {selectedPOI.distance}m
                    </span>
                  )}
                  {selectedPOI.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      {selectedPOI.rating.toFixed(1)}
                    </span>
                  )}
                  {selectedPOI.openingHours && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {selectedPOI.openingHours}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {selectedPOI.phone && (
                  <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                    <a href={`tel:${selectedPOI.phone}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {selectedPOI.website && (
                  <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                    <a href={selectedPOI.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setSelectedPOI(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* POI List (full variant only) */}
      {variant === 'full' && filteredPOIs.length > 0 && (
        <CardContent className="pt-4 border-t">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            In der Nähe
            <Badge variant="secondary">{filteredPOIs.length}</Badge>
          </h4>
          <div className="grid gap-2 max-h-[200px] overflow-y-auto">
            {filteredPOIs.slice(0, 8).map((poi) => {
              const config = getCategoryConfig(poi.category);
              const Icon = config.icon;
              
              return (
                <div
                  key={poi.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handlePOIClick(poi)}
                >
                  <div className={cn("p-2 rounded-md", config.bgColor)}>
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{poi.name}</p>
                    <p className="text-xs text-muted-foreground">{poi.address}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium">{poi.distance}m</p>
                    {poi.rating && (
                      <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        {poi.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
});

export default AfterMoveCareMap;
