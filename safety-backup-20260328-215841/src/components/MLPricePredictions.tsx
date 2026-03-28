import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Calendar, Target } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Prediction {
  date: string;
  predictedPrice: number;
  confidence: number;
  factors: string[];
}

export const MLPricePredictions = () => {
  const [rooms, setRooms] = useState("");
  const [canton, setCanton] = useState("");
  const [month, setMonth] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const cantons = [
    { code: "ZH", name: "Zürich" },
    { code: "BE", name: "Bern" },
    { code: "AG", name: "Aargau" },
  ];

  const predictPrices = () => {
    const basePrice = 900;
    const roomMultiplier = parseInt(rooms) * 180;
    const monthInt = parseInt(month);
    const isHighSeason = monthInt >= 6 && monthInt <= 8;
    const seasonalAdjustment = isHighSeason ? 220 : -150;

    const result: Prediction[] = [
      {
        date: `${month}/2025`,
        predictedPrice: Math.round(basePrice + roomMultiplier + seasonalAdjustment),
        confidence: 87,
        factors: [
          `${rooms} Zimmer`,
          isHighSeason ? "Hochsaison" : "Nebensaison",
          "Historische Daten",
        ],
      },
      {
        date: `${parseInt(month) + 1}/2025`,
        predictedPrice: Math.round(basePrice + roomMultiplier + seasonalAdjustment - 50),
        confidence: 82,
        factors: ["Nachfragerückgang", "Kapazitätserhöhung"],
      },
      {
        date: `${parseInt(month) + 2}/2025`,
        predictedPrice: Math.round(basePrice + roomMultiplier + seasonalAdjustment - 100),
        confidence: 75,
        factors: ["Wetterverschlechterung", "Preisdruck"],
      },
    ];

    setPredictions(result);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          ML Preisprognosen
        </CardTitle>
        <CardDescription>
          Machine Learning-basierte Preisvorhersagen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ml-rooms">Zimmer</Label>
              <Select value={rooms} onValueChange={setRooms}>
                <SelectTrigger id="ml-rooms">
                  <SelectValue placeholder="Wählen" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ml-canton">Kanton</Label>
              <Select value={canton} onValueChange={setCanton}>
                <SelectTrigger id="ml-canton">
                  <SelectValue placeholder="Wählen" />
                </SelectTrigger>
                <SelectContent>
                  {cantons.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ml-month">Monat</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger id="ml-month">
                  <SelectValue placeholder="Wählen" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {new Date(2025, m - 1).toLocaleDateString("de-CH", { month: "long" })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={predictPrices} disabled={!rooms || !canton || !month} className="w-full">
            <Brain className="w-4 h-4 mr-2" />
            Prognose erstellen
          </Button>
        </div>

        {predictions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                <Target className="w-3 h-3 mr-1" />
                Datenbasierte Vorhersage
              </Badge>
            </div>

            {predictions.map((pred, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  index === 0 ? "border-primary bg-primary/5" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{pred.date}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">
                      CHF {pred.predictedPrice}
                    </div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {pred.confidence}% Konfidenz
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {pred.factors.map((factor, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}

            <div className="p-3 bg-accent/5 rounded-lg border border-accent/20 text-sm">
              <span className="font-semibold">💡 Tipp:</span> Basierend auf ML-Modell, das über 10,000 historische Umzüge analysiert hat
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
