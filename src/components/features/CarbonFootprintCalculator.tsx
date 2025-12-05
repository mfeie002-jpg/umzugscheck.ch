import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Truck, MapPin, Package, TreePine, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const CarbonFootprintCalculator = () => {
  const [distance, setDistance] = useState(50);
  const [volume, setVolume] = useState(30);
  const [vehicleType, setVehicleType] = useState<'standard' | 'eco' | 'electric'>('standard');

  // CO2 calculation (simplified model)
  const baseEmission = 0.15; // kg CO2 per km per m³
  const vehicleMultiplier = {
    standard: 1,
    eco: 0.7,
    electric: 0.2
  };
  
  const co2Emission = distance * volume * baseEmission * vehicleMultiplier[vehicleType];
  const treesNeeded = Math.ceil(co2Emission / 22); // 1 tree absorbs ~22kg CO2/year

  const getEmissionLevel = () => {
    if (co2Emission < 50) return { level: 'Niedrig', color: 'text-green-500', bg: 'bg-green-500' };
    if (co2Emission < 150) return { level: 'Mittel', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { level: 'Hoch', color: 'text-orange-500', bg: 'bg-orange-500' };
  };

  const emission = getEmissionLevel();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10">
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-500" />
          CO₂-Fussabdruck Rechner
          <Badge variant="outline" className="ml-auto">
            Nachhaltigkeit
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Distance Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Distanz
            </label>
            <span className="text-sm font-bold">{distance} km</span>
          </div>
          <Slider
            value={[distance]}
            onValueChange={([val]) => setDistance(val)}
            max={500}
            min={5}
            step={5}
            className="py-2"
          />
        </div>

        {/* Volume Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Umzugsvolumen
            </label>
            <span className="text-sm font-bold">{volume} m³</span>
          </div>
          <Slider
            value={[volume]}
            onValueChange={([val]) => setVolume(val)}
            max={100}
            min={5}
            step={5}
            className="py-2"
          />
        </div>

        {/* Vehicle Type Selection */}
        <div>
          <label className="text-sm font-medium mb-3 block flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Fahrzeugtyp
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: 'standard' as const, label: 'Standard', emission: '100%' },
              { type: 'eco' as const, label: 'Öko-Diesel', emission: '70%' },
              { type: 'electric' as const, label: 'Elektrisch', emission: '20%' }
            ].map((option) => (
              <motion.button
                key={option.type}
                onClick={() => setVehicleType(option.type)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  vehicleType === option.type
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-border hover:border-muted-foreground/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-sm font-medium">{option.label}</div>
                <div className="text-xs text-muted-foreground">{option.emission}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Results */}
        <motion.div
          key={`${distance}-${volume}-${vehicleType}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-muted/50 rounded-xl space-y-4"
        >
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">
              Geschätzter CO₂-Ausstoss
            </div>
            <div className={`text-4xl font-bold ${emission.color}`}>
              {co2Emission.toFixed(1)} kg
            </div>
            <Badge className={`${emission.bg} mt-2`}>
              {emission.level}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Emissionslevel</span>
              <span className={emission.color}>{emission.level}</span>
            </div>
            <Progress 
              value={Math.min((co2Emission / 200) * 100, 100)} 
              className="h-2"
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
            <TreePine className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-sm font-medium">Kompensation</div>
              <div className="text-xs text-muted-foreground">
                {treesNeeded} Baum/Bäume würde(n) dies in 1 Jahr kompensieren
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Info className="h-4 w-4" />
            Tipps zur Reduzierung
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 ml-6">
            <li>• Wählen Sie eine Firma mit modernem Fuhrpark</li>
            <li>• Kombinieren Sie Fahrten (keine Leerfahrten)</li>
            <li>• Entrümpeln Sie vor dem Umzug</li>
            <li>• Fragen Sie nach Elektrofahrzeugen</li>
          </ul>
        </div>

        <Button className="w-full" variant="outline">
          <Leaf className="h-4 w-4 mr-2" />
          Öko-Umzugsfirmen anzeigen
        </Button>
      </CardContent>
    </Card>
  );
};
