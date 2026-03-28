import { useState } from "react";
import { Calculator } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface QuickCalculatorProps {
  canton?: string;
}

export const QuickCalculator = ({ canton }: QuickCalculatorProps) => {
  const [rooms, setRooms] = useState<string>("3");
  const [distance, setDistance] = useState<string>("50");
  const [result, setResult] = useState<{ min: number; max: number } | null>(null);

  const calculatePrice = () => {
    const basePrice = 850;
    const roomMultiplier = parseInt(rooms) * 200;
    const distanceMultiplier = parseInt(distance) * 1.5;
    
    const min = Math.round(basePrice + roomMultiplier + distanceMultiplier * 0.8);
    const max = Math.round(basePrice + roomMultiplier + distanceMultiplier * 1.2);
    
    setResult({ min, max });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Schnellrechner {canton && `für ${canton}`}
        </CardTitle>
        <CardDescription>
          Erhalten Sie eine erste Schätzung Ihrer Umzugskosten
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rooms">Anzahl Zimmer</Label>
          <Select value={rooms} onValueChange={setRooms}>
            <SelectTrigger id="rooms">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Zimmer</SelectItem>
              <SelectItem value="2">2 Zimmer</SelectItem>
              <SelectItem value="3">3 Zimmer</SelectItem>
              <SelectItem value="4">4 Zimmer</SelectItem>
              <SelectItem value="5">5+ Zimmer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="distance">Distanz (km)</Label>
          <Input
            id="distance"
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            min="1"
            max="500"
          />
        </div>

        <Button onClick={calculatePrice} className="w-full">
          Preis berechnen
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Geschätzter Preis</p>
            <p className="text-2xl font-bold text-primary">
              CHF {result.min.toLocaleString()} - {result.max.toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
