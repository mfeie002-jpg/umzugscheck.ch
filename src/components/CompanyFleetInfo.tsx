import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, Ruler, Weight, Fuel, Leaf, Shield } from "lucide-react";

interface Vehicle {
  id: string;
  type: string;
  capacity: string;
  volume: string;
  maxWeight: string;
  features: string[];
  count: number;
  eco?: boolean;
}

interface CompanyFleetInfoProps {
  companyName: string;
  fleetSize?: number;
}

const vehicles: Vehicle[] = [
  {
    id: "small",
    type: "Kleinbus",
    capacity: "Ideal für Studio/1-Zimmer",
    volume: "8-12 m³",
    maxWeight: "800 kg",
    features: ["Wendig", "Parkfreundlich", "City-Umzüge"],
    count: 3,
    eco: true
  },
  {
    id: "medium",
    type: "Mittelgrosser LKW",
    capacity: "2-3 Zimmer Wohnung",
    volume: "20-25 m³",
    maxWeight: "1'500 kg",
    features: ["Hebebühne", "Seitentür", "Ankerschienen"],
    count: 4
  },
  {
    id: "large",
    type: "Grosser LKW",
    capacity: "4+ Zimmer / Haus",
    volume: "35-45 m³",
    maxWeight: "3'000 kg",
    features: ["Doppelstock", "Hebebühne", "Klimakontrolle"],
    count: 2
  },
  {
    id: "special",
    type: "Spezialfahrzeug",
    capacity: "Klaviere & Tresore",
    volume: "Variabel",
    maxWeight: "5'000 kg",
    features: ["Luftfederung", "Spezialgurte", "Rampe"],
    count: 1
  }
];

export const CompanyFleetInfo = ({
  companyName,
  fleetSize = 10
}: CompanyFleetInfoProps) => {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Fahrzeugflotte
          </CardTitle>
          <Badge variant="secondary">{fleetSize} Fahrzeuge</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{vehicle.type}</h4>
                  {vehicle.eco && (
                    <Badge variant="outline" className="text-green-600 border-green-200 gap-1">
                      <Leaf className="h-3 w-3" />
                      Eco
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{vehicle.capacity}</p>
              </div>
              <Badge variant="secondary">{vehicle.count}x verfügbar</Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <span>{vehicle.volume}</span>
              </div>
              <div className="flex items-center gap-2">
                <Weight className="h-4 w-4 text-muted-foreground" />
                <span>Max {vehicle.maxWeight}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>{vehicle.count > 1 ? 'Mehrfach' : 'Einzeln'}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {vehicle.features.map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        ))}

        {/* Fleet Benefits */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Vollversichert</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Fuel className="h-4 w-4 text-blue-500" />
            <span>GPS-Tracking</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Leaf className="h-4 w-4 text-green-500" />
            <span>CO2-kompensiert</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-primary" />
            <span>Regelmässig gewartet</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyFleetInfo;
