import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Brain,
  TrendingDown,
  TrendingUp,
  Minus,
  Lightbulb,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CostPredictionInput,
  CostPredictionResult,
  predictMovingCost,
  formatCHF,
} from "@/lib/ai-cost-predictor";

interface AICostPredictorProps {
  onPredictionComplete?: (result: CostPredictionResult) => void;
  initialData?: Partial<CostPredictionInput>;
}

export const AICostPredictor = ({
  onPredictionComplete,
  initialData,
}: AICostPredictorProps) => {
  const [input, setInput] = useState<CostPredictionInput>({
    fromPostal: initialData?.fromPostal || '',
    toPostal: initialData?.toPostal || '',
    moveDate: initialData?.moveDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    apartmentSize: initialData?.apartmentSize || 80,
    rooms: initialData?.rooms || 3,
    floor: initialData?.floor || 2,
    hasElevator: initialData?.hasElevator ?? true,
    packingService: initialData?.packingService ?? false,
    furnitureAssembly: initialData?.furnitureAssembly ?? false,
    specialItems: initialData?.specialItems || [],
  });

  const [result, setResult] = useState<CostPredictionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const prediction = predictMovingCost(input);
    setResult(prediction);
    onPredictionComplete?.(prediction);
    setIsCalculating(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          KI Kostenprognose
          <Badge variant="secondary" className="text-[10px]">Beta</Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Basierend auf 50'000+ Schweizer Umzügen
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Input Form */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Von (PLZ)</Label>
            <Input
              placeholder="8000"
              value={input.fromPostal}
              onChange={(e) => setInput({ ...input, fromPostal: e.target.value })}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Nach (PLZ)</Label>
            <Input
              placeholder="6300"
              value={input.toPostal}
              onChange={(e) => setInput({ ...input, toPostal: e.target.value })}
              className="h-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Wohnungsgrösse: {input.apartmentSize} m²</Label>
          </div>
          <Slider
            value={[input.apartmentSize]}
            onValueChange={([value]) => setInput({ ...input, apartmentSize: value })}
            min={20}
            max={200}
            step={5}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Zimmer</Label>
            <Input
              type="number"
              value={input.rooms}
              onChange={(e) => setInput({ ...input, rooms: parseInt(e.target.value) || 1 })}
              min={1}
              max={10}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Stockwerk</Label>
            <Input
              type="number"
              value={input.floor}
              onChange={(e) => setInput({ ...input, floor: parseInt(e.target.value) || 0 })}
              min={0}
              max={20}
              className="h-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Lift vorhanden</Label>
            <Switch
              checked={input.hasElevator}
              onCheckedChange={(checked) => setInput({ ...input, hasElevator: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Verpackungsservice</Label>
            <Switch
              checked={input.packingService}
              onCheckedChange={(checked) => setInput({ ...input, packingService: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Möbelmontage</Label>
            <Switch
              checked={input.furnitureAssembly}
              onCheckedChange={(checked) => setInput({ ...input, furnitureAssembly: checked })}
            />
          </div>
        </div>

        <Button
          onClick={handleCalculate}
          disabled={!input.fromPostal || !input.toPostal || isCalculating}
          className="w-full"
        >
          {isCalculating ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              KI analysiert...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Kosten berechnen
            </>
          )}
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-4 pt-4 border-t">
            {/* Main Estimate */}
            <div className="text-center py-4 bg-primary/5 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Geschätzte Kosten</p>
              <p className="text-3xl font-bold text-primary">
                {formatCHF(result.estimatedCost)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCHF(result.priceRange.min)} – {formatCHF(result.priceRange.max)}
              </p>
              
              <div className="flex items-center justify-center gap-1 mt-2">
                <span className="text-xs text-muted-foreground">Konfidenz:</span>
                <Progress value={result.confidenceLevel} className="w-20 h-1.5" />
                <span className="text-xs font-medium">{result.confidenceLevel}%</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Kostenaufstellung</p>
              <div className="space-y-1 text-sm">
                {Object.entries(result.breakdown).map(([key, value]) => {
                  if (key === 'total' || value === 0) return null;
                  const labels: Record<string, string> = {
                    baseTransport: 'Transport & Volumen',
                    laborCost: 'Arbeitskraft',
                    packingMaterials: 'Verpackung',
                    additionalServices: 'Zusatzleistungen',
                    insurance: 'Versicherung',
                  };
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{labels[key]}</span>
                      <span>{formatCHF(value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Factors */}
            {result.factors.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Preisfaktoren</p>
                <div className="space-y-1.5">
                  {result.factors.map((factor, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center justify-between p-2 rounded text-xs",
                        factor.impact === 'increase' && "bg-red-50",
                        factor.impact === 'decrease' && "bg-green-50"
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        {factor.impact === 'increase' && <TrendingUp className="h-3 w-3 text-red-500" />}
                        {factor.impact === 'decrease' && <TrendingDown className="h-3 w-3 text-green-500" />}
                        {factor.impact === 'neutral' && <Minus className="h-3 w-3" />}
                        {factor.name}
                      </span>
                      <span className={cn(
                        "font-medium",
                        factor.impact === 'increase' && "text-red-600",
                        factor.impact === 'decrease' && "text-green-600"
                      )}>
                        {factor.impact === 'increase' ? '+' : '-'}{factor.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Savings Tips */}
            {result.savingsTips.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  Spartipps
                </p>
                <ul className="space-y-1">
                  {result.savingsTips.map((tip, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <ChevronRight className="h-3 w-3 mt-0.5 text-primary" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AICostPredictor;
