import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, Home, ArrowRight, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";

export const ZuerichPriceCalculatorMini = () => {
  const [rooms, setRooms] = useState(3);
  const [floor, setFloor] = useState(2);
  const [hasElevator, setHasElevator] = useState(true);

  const basePrice = 500;
  const roomMultiplier = rooms * 280;
  const floorMultiplier = hasElevator ? floor * 20 : floor * 60;
  const estimatedPrice = basePrice + roomMultiplier + floorMultiplier;
  const priceRange = { min: Math.round(estimatedPrice * 0.85), max: Math.round(estimatedPrice * 1.15) };

  return (
    <Card className="border-2 border-primary/20 overflow-hidden">
      <div className="bg-primary/5 p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Schneller Preisrechner</h3>
            <p className="text-xs text-muted-foreground">Unverbindliche Schätzung für Zürich</p>
          </div>
        </div>
      </div>

      <CardContent className="p-5 space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-sm">Anzahl Zimmer</Label>
            <span className="text-sm font-medium">{rooms} Zimmer</span>
          </div>
          <Slider value={[rooms]} onValueChange={([v]) => setRooms(v)} min={1} max={7} step={0.5} />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-sm">Stockwerk</Label>
            <span className="text-sm font-medium">{floor}. OG</span>
          </div>
          <Slider value={[floor]} onValueChange={([v]) => setFloor(v)} min={0} max={10} step={1} />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm">Lift vorhanden</Label>
          <div className="flex gap-2">
            <Button
              variant={hasElevator ? "default" : "outline"}
              size="sm"
              onClick={() => setHasElevator(true)}
            >
              Ja
            </Button>
            <Button
              variant={!hasElevator ? "default" : "outline"}
              size="sm"
              onClick={() => setHasElevator(false)}
            >
              Nein
            </Button>
          </div>
        </div>

        <motion.div
          key={`${rooms}-${floor}-${hasElevator}`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 text-center"
        >
          <p className="text-sm text-muted-foreground mb-1">Geschätzte Kosten</p>
          <p className="text-3xl font-bold text-primary">
            CHF {priceRange.min.toLocaleString("de-CH")} - {priceRange.max.toLocaleString("de-CH")}
          </p>
          <div className="flex items-center justify-center gap-1 mt-2 text-sm text-success">
            <TrendingDown className="h-4 w-4" />
            <span>Bis zu 40% sparen durch Vergleich</span>
          </div>
        </motion.div>

        <Link to={`/rechner?rooms=${rooms}&floor=${floor}&elevator=${hasElevator}&region=zuerich`}>
          <Button className="w-full">
            Genaue Offerte erhalten
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
