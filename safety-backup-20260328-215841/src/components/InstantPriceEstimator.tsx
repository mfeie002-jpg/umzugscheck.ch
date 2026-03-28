import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Zap, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export const InstantPriceEstimator = () => {
  const [rooms, setRooms] = useState("3");
  const [distance, setDistance] = useState("");
  const [floor, setFloor] = useState("0");
  const [estimate, setEstimate] = useState<{ min: number; max: number } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateEstimate = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const roomCount = parseInt(rooms) || 3;
      const dist = parseInt(distance) || 20;
      const floorNum = parseInt(floor) || 0;
      
      const basePrice = roomCount * 350;
      const distancePrice = dist * 3;
      const floorPrice = floorNum * 50;
      
      const min = Math.round((basePrice + distancePrice + floorPrice) * 0.85);
      const max = Math.round((basePrice + distancePrice + floorPrice) * 1.25);
      
      setEstimate({ min, max });
      setIsCalculating(false);
    }, 800);
  };

  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Sofort-Schätzung
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Zimmer</Label>
            <Select value={rooms} onValueChange={setRooms}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n} Zimmer
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs">Distanz (km)</Label>
            <Input
              type="number"
              placeholder="20"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="h-9"
            />
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs">Stockwerk</Label>
            <Select value={floor} onValueChange={setFloor}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n === 0 ? "EG" : `${n}. OG`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={calculateEstimate} 
          className="w-full"
          disabled={isCalculating}
        >
          {isCalculating ? (
            <span className="flex items-center gap-2">
              <Calculator className="h-4 w-4 animate-spin" />
              Berechne...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Preis schätzen
            </span>
          )}
        </Button>

        <AnimatePresence>
          {estimate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Geschätzter Preis</p>
                  <p className="text-2xl font-bold text-primary">
                    CHF {estimate.min.toLocaleString()} – {estimate.max.toLocaleString()}
                  </p>
                </div>
                <Link to="/umzugsofferten">
                  <Button variant="outline" className="w-full" size="sm">
                    Genaue Offerten erhalten
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default InstantPriceEstimator;
