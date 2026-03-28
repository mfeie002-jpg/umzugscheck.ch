import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingDown, TrendingUp, Award } from "lucide-react";

interface PricePosition {
  yourPrice: number;
  marketAverage: number;
  lowestPrice: number;
  highestPrice: number;
  position: string;
  recommendation: string;
}

export const CompetitivePricingAnalyzer = () => {
  const [yourPrice, setYourPrice] = useState("");
  const [analysis, setAnalysis] = useState<PricePosition | null>(null);

  const analyzePricing = () => {
    const price = parseFloat(yourPrice);
    const marketAvg = 1150;
    const lowest = 850;
    const highest = 1450;

    let position = "";
    let recommendation = "";

    const percentile = ((price - lowest) / (highest - lowest)) * 100;

    if (percentile < 25) {
      position = "Budget-Segment (Top 25% günstigste)";
      recommendation = "Sie sind sehr wettbewerbsfähig! Sie könnten den Preis leicht erhöhen (+5-8%) ohne Kunden zu verlieren.";
    } else if (percentile < 50) {
      position = "Unterer Mittelbereich (25-50% Perzentil)";
      recommendation = "Gute Positionierung! Sie sind günstiger als der Durchschnitt und attraktiv für preisbewusste Kunden.";
    } else if (percentile < 75) {
      position = "Oberer Mittelbereich (50-75% Perzentil)";
      recommendation = "Sie sind teurer als der Durchschnitt. Stellen Sie sicher, dass Ihr Service die Premiumpreise rechtfertigt.";
    } else {
      position = "Premium-Segment (Top 25% teuerste)";
      recommendation = "Sie müssen exzellenten Service und Zusatzleistungen bieten, um diese Preise zu rechtfertigen.";
    }

    setAnalysis({
      yourPrice: price,
      marketAverage: marketAvg,
      lowestPrice: lowest,
      highestPrice: highest,
      position,
      recommendation,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Wettbewerbspreis-Analyse
        </CardTitle>
        <CardDescription>
          Vergleichen Sie Ihre Preise mit dem Markt
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="your-price">Ihr Preis (CHF/Tag)</Label>
            <Input
              id="your-price"
              type="number"
              placeholder="z.B. 1200"
              value={yourPrice}
              onChange={(e) => setYourPrice(e.target.value)}
            />
          </div>

          <Button onClick={analyzePricing} disabled={!yourPrice} className="w-full">
            Preis analysieren
          </Button>
        </div>

        {analysis && (
          <div className="space-y-4">
            {/* Price Position */}
            <div className="p-4 bg-primary/5 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Marktposition</span>
                <Badge variant="secondary">
                  <Award className="w-3 h-3 mr-1" />
                  {analysis.position.split(" ")[0]}
                </Badge>
              </div>
              <p className="text-sm font-semibold">{analysis.position}</p>
            </div>

            {/* Price Comparison */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                <span className="text-sm">Ihr Preis</span>
                <span className="font-bold text-lg">CHF {analysis.yourPrice}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <span className="text-sm">Marktdurchschnitt</span>
                <span className="font-semibold">CHF {analysis.marketAverage}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg border">
                  <div className="text-xs text-muted-foreground mb-1">Günstigster</div>
                  <div className="font-semibold flex items-center gap-1 text-green-600">
                    <TrendingDown className="w-3 h-3" />
                    CHF {analysis.lowestPrice}
                  </div>
                </div>
                <div className="p-3 rounded-lg border">
                  <div className="text-xs text-muted-foreground mb-1">Teuerster</div>
                  <div className="font-semibold flex items-center gap-1 text-red-600">
                    <TrendingUp className="w-3 h-3" />
                    CHF {analysis.highestPrice}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" />
                Empfehlung
              </h4>
              <p className="text-sm">{analysis.recommendation}</p>
            </div>

            {/* Price Adjustment Options */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setYourPrice(String(analysis.yourPrice * 0.95))}
              >
                -5%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setYourPrice(String(analysis.marketAverage))}
              >
                Durchschnitt
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setYourPrice(String(analysis.yourPrice * 1.05))}
              >
                +5%
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
