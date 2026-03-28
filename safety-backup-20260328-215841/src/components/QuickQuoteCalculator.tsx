import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Home, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickQuoteCalculatorProps {
  companyName: string;
  companyPriceLevel: string;
  onClose: () => void;
}

const QuickQuoteCalculator = ({ companyName, companyPriceLevel, onClose }: QuickQuoteCalculatorProps) => {
  const [rooms, setRooms] = useState("3");
  const [distance, setDistance] = useState("20");
  const [showResult, setShowResult] = useState(false);

  const basePrice = {
    "günstig": 600,
    "fair": 850,
    "premium": 1200,
  }[companyPriceLevel] || 850;

  const calculatePrice = () => {
    const roomMultiplier = parseInt(rooms) * 0.3 + 0.4;
    const distanceMultiplier = 1 + (parseInt(distance) * 0.008);
    const min = Math.round(basePrice * roomMultiplier * distanceMultiplier * 0.85);
    const max = Math.round(basePrice * roomMultiplier * distanceMultiplier * 1.15);
    return { min, max };
  };

  const price = calculatePrice();

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Schnellkalkulator</span>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
            ×
          </Button>
        </div>

        {!showResult ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1">
                  <Home className="w-3 h-3" />
                  Zimmer
                </Label>
                <Select value={rooms} onValueChange={setRooms}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <SelectItem key={n} value={n.toString()}>{n} Zimmer</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Distanz (km)
                </Label>
                <Input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  min="1"
                  max="200"
                  className="h-9"
                />
              </div>
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary-dark"
              onClick={() => setShowResult(true)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Preis berechnen
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Geschätzte Kosten bei {companyName}</p>
              <p className="text-2xl font-bold text-primary">
                CHF {price.min} – {price.max}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                für {rooms} Zimmer, {distance} km
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => setShowResult(false)}
              >
                Anpassen
              </Button>
              <Link to={`/umzugsofferten?rooms=${rooms}&distance=${distance}`} className="flex-1">
                <Button size="sm" className="w-full bg-primary hover:bg-primary-dark">
                  Offerte
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickQuoteCalculator;
