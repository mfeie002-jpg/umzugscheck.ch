import { useMemo } from "react";
import { Clock, Truck, MapPin, Route } from "lucide-react";
import { Card } from "@/components/ui/card";

// Swiss city coordinates (approximate)
export const swissCities: Record<string, { lat: number; lng: number; name: string }> = {
  "8000": { lat: 47.3769, lng: 8.5417, name: "Zürich" },
  "8001": { lat: 47.3769, lng: 8.5417, name: "Zürich" },
  "8002": { lat: 47.3650, lng: 8.5310, name: "Zürich Enge" },
  "8003": { lat: 47.3720, lng: 8.5200, name: "Zürich Wiedikon" },
  "8004": { lat: 47.3780, lng: 8.5200, name: "Zürich Aussersihl" },
  "8005": { lat: 47.3900, lng: 8.5200, name: "Zürich Industriequartier" },
  "8006": { lat: 47.3850, lng: 8.5500, name: "Zürich Oberstrass" },
  "8008": { lat: 47.3550, lng: 8.5600, name: "Zürich Seefeld" },
  "8037": { lat: 47.4000, lng: 8.5400, name: "Zürich" },
  "8044": { lat: 47.3830, lng: 8.5750, name: "Zürich" },
  "8050": { lat: 47.4100, lng: 8.5450, name: "Zürich Oerlikon" },
  "8400": { lat: 47.5000, lng: 8.7240, name: "Winterthur" },
  "8401": { lat: 47.4980, lng: 8.7280, name: "Winterthur" },
  "4000": { lat: 47.5596, lng: 7.5886, name: "Basel" },
  "4001": { lat: 47.5596, lng: 7.5886, name: "Basel" },
  "4051": { lat: 47.5530, lng: 7.5890, name: "Basel" },
  "4052": { lat: 47.5450, lng: 7.6000, name: "Basel" },
  "3000": { lat: 46.9480, lng: 7.4474, name: "Bern" },
  "3001": { lat: 46.9480, lng: 7.4474, name: "Bern" },
  "3011": { lat: 46.9490, lng: 7.4450, name: "Bern Altstadt" },
  "3012": { lat: 46.9550, lng: 7.4350, name: "Bern Länggasse" },
  "1200": { lat: 46.2044, lng: 6.1432, name: "Genève" },
  "1201": { lat: 46.2100, lng: 6.1500, name: "Genève" },
  "1202": { lat: 46.2150, lng: 6.1400, name: "Genève" },
  "1003": { lat: 46.5197, lng: 6.6323, name: "Lausanne" },
  "1004": { lat: 46.5200, lng: 6.6350, name: "Lausanne" },
  "1005": { lat: 46.5250, lng: 6.6400, name: "Lausanne" },
  "6000": { lat: 47.0502, lng: 8.3093, name: "Luzern" },
  "6003": { lat: 47.0520, lng: 8.3100, name: "Luzern" },
  "6004": { lat: 47.0480, lng: 8.3050, name: "Luzern" },
  "9000": { lat: 47.4245, lng: 9.3767, name: "St. Gallen" },
  "9001": { lat: 47.4245, lng: 9.3767, name: "St. Gallen" },
  "6900": { lat: 46.0037, lng: 8.9511, name: "Lugano" },
  "6901": { lat: 46.0050, lng: 8.9530, name: "Lugano" },
  "2000": { lat: 47.0102, lng: 6.9294, name: "Neuchâtel" },
  "1700": { lat: 46.8065, lng: 7.1620, name: "Fribourg" },
  "7000": { lat: 46.8508, lng: 9.5311, name: "Chur" },
  "5000": { lat: 47.3925, lng: 8.0442, name: "Aarau" },
  "4600": { lat: 47.2088, lng: 7.5323, name: "Olten" },
  "2500": { lat: 47.1368, lng: 7.2467, name: "Biel/Bienne" },
  "8200": { lat: 47.6965, lng: 8.6340, name: "Schaffhausen" },
  "6300": { lat: 47.1663, lng: 8.5167, name: "Zug" },
  "8952": { lat: 47.3900, lng: 8.4350, name: "Schlieren" },
  "8600": { lat: 47.3650, lng: 8.6500, name: "Dübendorf" },
  "8610": { lat: 47.3300, lng: 8.6750, name: "Uster" },
  "8800": { lat: 47.1750, lng: 8.5200, name: "Thalwil" },
  "8820": { lat: 47.2300, lng: 8.6700, name: "Wädenswil" },
  "8810": { lat: 47.2600, lng: 8.5900, name: "Horgen" },
  "8304": { lat: 47.4350, lng: 8.5650, name: "Wallisellen" },
  "8305": { lat: 47.4200, lng: 8.6100, name: "Dietlikon" },
  "8180": { lat: 47.5100, lng: 8.4400, name: "Bülach" },
  "8700": { lat: 47.2900, lng: 8.7200, name: "Küsnacht" },
};

// Haversine formula to calculate distance between two points
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Extract PLZ from address string
export function extractPLZ(address: string): string | null {
  const match = address.match(/\b(\d{4})\b/);
  return match ? match[1] : null;
}

interface DistanceCalculatorProps {
  fromAddress: string;
  toAddress: string;
}

export default function DistanceCalculator({ fromAddress, toAddress }: DistanceCalculatorProps) {
  const result = useMemo(() => {
    const fromPLZ = extractPLZ(fromAddress);
    const toPLZ = extractPLZ(toAddress);

    if (!fromPLZ || !toPLZ) return null;

    const fromCity = swissCities[fromPLZ];
    const toCity = swissCities[toPLZ];

    if (!fromCity || !toCity) return null;

    const distance = calculateDistance(fromCity.lat, fromCity.lng, toCity.lat, toCity.lng);
    // Add 30% for road distance vs straight line
    const roadDistance = Math.round(distance * 1.3);
    // Estimate driving time (average 50 km/h for moving truck in Swiss traffic)
    const drivingMinutes = Math.round((roadDistance / 50) * 60);
    const hours = Math.floor(drivingMinutes / 60);
    const minutes = drivingMinutes % 60;

    return {
      distance: roadDistance,
      drivingTime: hours > 0 ? `${hours} Std. ${minutes} Min.` : `${minutes} Min.`,
      fromCity: fromCity.name,
      toCity: toCity.name,
      fromCoords: fromCity,
      toCoords: toCity,
    };
  }, [fromAddress, toAddress]);

  if (!result) return null;

  return (
    <Card className="p-3 sm:p-4 bg-alpine/5 border-alpine/20">
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <Route className="h-4 w-4 sm:h-5 sm:w-5 text-alpine" />
        <span className="font-semibold text-xs sm:text-sm">Geschätzte Entfernung</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-base sm:text-lg font-bold text-alpine">{result.distance} km</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Entfernung</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-base sm:text-lg font-bold text-alpine truncate">{result.drivingTime}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Fahrzeit</p>
          </div>
        </div>
      </div>
      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-alpine/10 flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
        <MapPin className="h-3 w-3 flex-shrink-0" />
        <span className="truncate">{result.fromCity} → {result.toCity}</span>
      </div>
    </Card>
  );
}

