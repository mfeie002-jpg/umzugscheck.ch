import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Route, Clock, DollarSign } from "lucide-react";

interface RouteResult {
  distance: number;
  duration: string;
  priceRange: { min: number; max: number };
  route: string;
}

export const RoutePlanner = () => {
  const [fromPostal, setFromPostal] = useState("");
  const [toPostal, setToPostal] = useState("");
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [calculating, setCalculating] = useState(false);

  const calculateRoutes = () => {
    setCalculating(true);
    
    // Simulate route calculation
    setTimeout(() => {
      const baseDistance = Math.floor(Math.random() * 100) + 30;
      const basePrice = 850 + (baseDistance * 1.5);
      
      const calculatedRoutes: RouteResult[] = [
        {
          distance: baseDistance,
          duration: `${Math.floor(baseDistance / 60)} Std ${Math.floor(baseDistance % 60)} Min`,
          priceRange: {
            min: Math.round(basePrice * 0.9),
            max: Math.round(basePrice * 1.1)
          },
          route: "Autobahn (schnellste Route)"
        },
        {
          distance: Math.round(baseDistance * 1.15),
          duration: `${Math.floor((baseDistance * 1.15) / 60)} Std ${Math.floor((baseDistance * 1.15) % 60)} Min`,
          priceRange: {
            min: Math.round(basePrice * 0.85),
            max: Math.round(basePrice * 1.05)
          },
          route: "Landstrasse (günstigere Route)"
        },
        {
          distance: Math.round(baseDistance * 0.92),
          duration: `${Math.floor((baseDistance * 0.92) / 60)} Std ${Math.floor((baseDistance * 0.92) % 60)} Min`,
          priceRange: {
            min: Math.round(basePrice * 0.95),
            max: Math.round(basePrice * 1.15)
          },
          route: "Bergstrasse (kürzeste Distanz)"
        }
      ];
      
      setRoutes(calculatedRoutes);
      setCalculating(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="w-5 h-5" />
          Routen-Planer
        </CardTitle>
        <CardDescription>
          Berechnen Sie genaue Distanz und Preise für verschiedene Routen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from-postal">Von PLZ</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="from-postal"
                placeholder="z.B. 8001"
                value={fromPostal}
                onChange={(e) => setFromPostal(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="to-postal">Nach PLZ</Label>
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="to-postal"
                placeholder="z.B. 3000"
                value={toPostal}
                onChange={(e) => setToPostal(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={calculateRoutes} 
          disabled={!fromPostal || !toPostal || calculating}
          className="w-full"
        >
          {calculating ? "Berechne Routen..." : "Routen berechnen"}
        </Button>

        {routes.length > 0 && (
          <div className="space-y-3 mt-6">
            <h4 className="font-semibold text-sm text-muted-foreground">Verfügbare Routen</h4>
            {routes.map((route, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border hover:border-primary/40 hover:shadow-soft transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-semibold">{route.route}</h5>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        {route.distance} km
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {route.duration}
                      </span>
                    </div>
                  </div>
                  {index === 0 && <Badge variant="default">Empfohlen</Badge>}
                  {index === 1 && <Badge variant="secondary">Günstig</Badge>}
                </div>
                
                <div className="p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Geschätzter Preis
                    </span>
                    <span className="font-bold text-primary">
                      CHF {route.priceRange.min} - {route.priceRange.max}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {routes.length === 0 && !calculating && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Geben Sie Start- und Ziel-PLZ ein, um Routen zu berechnen
          </div>
        )}
      </CardContent>
    </Card>
  );
};
