import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CantonPriceCalculatorMiniProps {
  cantonName: string;
  cities: string[];
}

export const CantonPriceCalculatorMini = ({ cantonName, cities }: CantonPriceCalculatorMiniProps) => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [rooms, setRooms] = useState("3");

  return (
    <Card className="border-2 border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Calculator className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Schnellrechner</h3>
            <p className="text-xs text-muted-foreground">{cantonName}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Von</Label>
            <select 
              value={fromCity} 
              onChange={e => setFromCity(e.target.value)}
              className="w-full mt-1 px-2 py-1.5 border border-border rounded text-sm bg-background"
            >
              <option value="">Wählen...</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-xs">Nach</Label>
            <select 
              value={toCity} 
              onChange={e => setToCity(e.target.value)}
              className="w-full mt-1 px-2 py-1.5 border border-border rounded text-sm bg-background"
            >
              <option value="">Wählen...</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-xs">Zimmer</Label>
            <select 
              value={rooms} 
              onChange={e => setRooms(e.target.value)}
              className="w-full mt-1 px-2 py-1.5 border border-border rounded text-sm bg-background"
            >
              {[1, 2, 3, 4, 5].map(r => (
                <option key={r} value={r}>{r === 5 ? '5+' : r} Zimmer</option>
              ))}
            </select>
          </div>
          <Link to={`/rechner?from=${fromCity}&to=${toCity}&rooms=${rooms}`}>
            <Button className="w-full h-9 text-sm">
              Berechnen <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
