import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, Calculator } from "lucide-react";
import { Link } from "react-router-dom";

const bernCities = ["Bern", "Biel/Bienne", "Thun", "Köniz", "Burgdorf", "Langenthal", "Ostermundigen", "Muri bei Bern"];

export const BernPriceCalculatorMini = () => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [rooms, setRooms] = useState("3");

  return (
    <Card className="border-2 border-primary/20 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Schnellrechner Bern</h3>
            <p className="text-xs text-muted-foreground">Sofort Preise erhalten</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Von</Label>
              <select value={fromCity} onChange={e => setFromCity(e.target.value)} className="w-full mt-1 px-2 py-1.5 border border-border rounded-lg bg-background text-sm">
                <option value="">Ort wählen</option>
                {bernCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs">Nach</Label>
              <select value={toCity} onChange={e => setToCity(e.target.value)} className="w-full mt-1 px-2 py-1.5 border border-border rounded-lg bg-background text-sm">
                <option value="">Ort wählen</option>
                {bernCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Zimmer</Label>
            <select value={rooms} onChange={e => setRooms(e.target.value)} className="w-full mt-1 px-2 py-1.5 border border-border rounded-lg bg-background text-sm">
              {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Zimmer</option>)}
            </select>
          </div>
          <Link to={`/rechner?from=${fromCity}&to=${toCity}&rooms=${rooms}`}>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Preis berechnen <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
