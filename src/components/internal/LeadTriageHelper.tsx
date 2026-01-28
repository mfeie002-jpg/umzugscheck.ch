/**
 * Lead Triage Helper Panel
 * Decides: KEEP (Feierabend Direct) vs ROUTE (Umzugscheck Marketplace)
 * 
 * Rules:
 * - Reject direct moves under CHF 800-1000
 * - Route small, low-margin jobs to marketplace
 * - Display recommended call time
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  Package, 
  Clock, 
  Phone,
  Truck,
  Building2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Wrench,
  Timer,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TriageInputs {
  apartmentSize: number; // in rooms (1-6+)
  squareMeters: number;
  distanceKm: number;
  packingService: boolean;
  montageService: boolean;
  cleaningService: boolean;
  budgetExpectation: number;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
}

type Decision = 'keep' | 'route' | 'reject';

interface TriageResult {
  decision: Decision;
  reason: string;
  estimatedValue: number;
  estimatedMargin: number;
  callTimeMinutes: { min: number; max: number };
  confidence: number;
}

const URGENCY_OPTIONS = [
  { value: 'low', label: 'Flexibel (2+ Wochen)', multiplier: 0.9 },
  { value: 'medium', label: 'Normal (1-2 Wochen)', multiplier: 1.0 },
  { value: 'high', label: 'Dringend (< 1 Woche)', multiplier: 1.15 },
  { value: 'urgent', label: 'Express (< 3 Tage)', multiplier: 1.3 },
];

const DEFAULT_INPUTS: TriageInputs = {
  apartmentSize: 3,
  squareMeters: 75,
  distanceKm: 15,
  packingService: false,
  montageService: false,
  cleaningService: false,
  budgetExpectation: 2000,
  urgency: 'medium',
};

// Minimum value thresholds (from spec)
const MIN_DIRECT_VALUE = 1000; // Below this = reject for direct
const MIN_WHALE_VALUE = 2200; // KEEP if >= CHF 2,200 (per spec)
const TARGET_MARGIN = 400; // CHF minimum contribution margin

export function LeadTriageHelper() {
  const [inputs, setInputs] = useState<TriageInputs>(DEFAULT_INPUTS);

  const updateInput = <K extends keyof TriageInputs>(key: K, value: TriageInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const result = useMemo((): TriageResult => {
    const { apartmentSize, squareMeters, distanceKm, packingService, montageService, cleaningService, budgetExpectation, urgency } = inputs;
    
    // Estimate move value based on inputs
    const baseVolumeM3 = squareMeters * 0.4; // Rough: 0.4 m³ per m²
    const basePricePerM3 = 70; // CHF per m³
    const distanceMultiplier = 1 + (distanceKm / 100); // +1% per km over 100km base
    const urgencyMultiplier = URGENCY_OPTIONS.find(u => u.value === urgency)?.multiplier || 1;
    
    // Additional services value
    const packingValue = packingService ? squareMeters * 8 : 0; // ~CHF 8/m² for packing
    const montageValue = montageService ? 200 + (apartmentSize * 50) : 0; // Base + per room
    const cleaningValue = cleaningService ? squareMeters * 4.5 : 0; // CHF 4.5/m²
    
    // Total estimated value
    const baseValue = baseVolumeM3 * basePricePerM3 * distanceMultiplier;
    const servicesValue = packingValue + montageValue + cleaningValue;
    const estimatedValue = Math.round((baseValue + servicesValue) * urgencyMultiplier);
    
    // Estimate margin (simplified)
    const estimatedCOGS = estimatedValue * 0.65; // ~65% COGS
    const estimatedCAC = 150; // Average CAC
    const estimatedMargin = Math.round(estimatedValue - estimatedCOGS - estimatedCAC);
    
    // Decision logic
    let decision: Decision;
    let reason: string;
    let confidence: number;
    
    // Rule 1: Reject tiny moves
    if (estimatedValue < MIN_DIRECT_VALUE || budgetExpectation < 800) {
      decision = 'reject';
      reason = 'Auftragswert unter CHF 1\'000 – nicht profitabel für Direktgeschäft';
      confidence = 95;
    }
    // Rule 2: Small/low-margin → Route to marketplace
    else if (estimatedValue < MIN_WHALE_VALUE || estimatedMargin < TARGET_MARGIN || apartmentSize <= 1.5) {
      decision = 'route';
      reason = apartmentSize <= 1.5 
        ? 'Kleine Wohnung – effizienter über Marketplace'
        : estimatedMargin < TARGET_MARGIN
        ? `Marge (CHF ${estimatedMargin}) unter Ziel (CHF ${TARGET_MARGIN})`
        : 'Mittlerer Auftrag – Marketplace-Routing empfohlen';
      confidence = 85;
    }
    // Rule 3: High-value whale → Keep direct
    else {
      decision = 'keep';
      const hasUpsell = packingService || montageService || cleaningService;
      reason = hasUpsell 
        ? `Whale-Kunde mit Zusatzservices – Marge CHF ${estimatedMargin}`
        : `Guter Auftragswert (CHF ${estimatedValue}) – Direkt bearbeiten`;
      confidence = estimatedValue > 3000 ? 95 : 80;
    }
    
    // Call time recommendation
    const callTimeMinutes = decision === 'keep' 
      ? { min: 8, max: 10 }  // Whale: deeper qualification
      : { min: 2, max: 3 };  // Marketplace: quick routing
    
    return {
      decision,
      reason,
      estimatedValue,
      estimatedMargin,
      callTimeMinutes,
      confidence,
    };
  }, [inputs]);

  const formatCHF = (value: number) => `CHF ${value.toLocaleString('de-CH')}`;

  return (
    <div className="space-y-6">
      {/* Decision Output - Always visible at top */}
      <Card className={cn(
        "border-2",
        result.decision === 'keep' && "border-green-500 bg-green-50 dark:bg-green-950/30",
        result.decision === 'route' && "border-blue-500 bg-blue-50 dark:bg-blue-950/30",
        result.decision === 'reject' && "border-red-500 bg-red-50 dark:bg-red-950/30",
      )}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              {result.decision === 'keep' && (
                <div className="p-3 rounded bg-green-100 dark:bg-green-900">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
              )}
              {result.decision === 'route' && (
                <div className="p-3 rounded bg-blue-100 dark:bg-blue-900">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              )}
              {result.decision === 'reject' && (
                <div className="p-3 rounded bg-red-100 dark:bg-red-900">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {result.decision === 'keep' && (
                    <Badge className="bg-green-600 text-white text-lg px-3 py-1">
                      KEEP - Feierabend Direct
                    </Badge>
                  )}
                  {result.decision === 'route' && (
                    <Badge className="bg-blue-600 text-white text-lg px-3 py-1">
                      ROUTE - Marketplace
                    </Badge>
                  )}
                  {result.decision === 'reject' && (
                    <Badge className="bg-red-600 text-white text-lg px-3 py-1">
                      REJECT - Nicht profitabel
                    </Badge>
                  )}
                </div>
                <p className={cn(
                  "text-sm",
                  result.decision === 'keep' && "text-green-800 dark:text-green-200",
                  result.decision === 'route' && "text-blue-800 dark:text-blue-200",
                  result.decision === 'reject' && "text-red-800 dark:text-red-200",
                )}>
                  {result.reason}
                </p>
              </div>
            </div>
            
            {/* Call Time & Metrics */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                  <Phone className="w-3 h-3" />
                  Anruf
                </div>
                <Badge variant="outline" className="text-lg font-bold">
                  {result.callTimeMinutes.min}–{result.callTimeMinutes.max} Min
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Schätzwert</div>
                <div className="font-bold text-lg">{formatCHF(result.estimatedValue)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Marge</div>
                <div className={cn(
                  "font-bold text-lg",
                  result.estimatedMargin >= TARGET_MARGIN ? "text-green-600" : "text-amber-600"
                )}>
                  {formatCHF(result.estimatedMargin)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Konfidenz</div>
                <div className="font-bold text-lg">{result.confidence}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Basic Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Wohnung & Distanz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Zimmer</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="1"
                  max="10"
                  value={inputs.apartmentSize}
                  onChange={(e) => updateInput('apartmentSize', parseFloat(e.target.value) || 1)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Fläche (m²)</Label>
                <Input
                  type="number"
                  min="20"
                  max="500"
                  value={inputs.squareMeters}
                  onChange={(e) => updateInput('squareMeters', parseInt(e.target.value) || 20)}
                  className="font-mono"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Distanz (km)
              </Label>
              <Input
                type="number"
                min="1"
                max="500"
                value={inputs.distanceKm}
                onChange={(e) => updateInput('distanceKm', parseInt(e.target.value) || 1)}
                className="font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Wallet className="w-3 h-3" />
                Budget-Erwartung (CHF)
              </Label>
              <Input
                type="number"
                min="500"
                max="50000"
                step="100"
                value={inputs.budgetExpectation}
                onChange={(e) => updateInput('budgetExpectation', parseInt(e.target.value) || 500)}
                className="font-mono"
              />
            </div>
          </CardContent>
        </Card>

        {/* Right: Services & Urgency */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Services & Dringlichkeit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Additional Services */}
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground">Zusatzservices</Label>
              
              <div className="flex items-center gap-3 p-2 rounded border">
                <Checkbox
                  id="packing"
                  checked={inputs.packingService}
                  onCheckedChange={(checked) => updateInput('packingService', !!checked)}
                />
                <label htmlFor="packing" className="flex items-center gap-2 text-sm cursor-pointer flex-1">
                  <Package className="w-4 h-4 text-amber-600" />
                  Verpackungsservice
                </label>
                {inputs.packingService && (
                  <Badge variant="secondary" className="text-xs">+{formatCHF(inputs.squareMeters * 8)}</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3 p-2 rounded border">
                <Checkbox
                  id="montage"
                  checked={inputs.montageService}
                  onCheckedChange={(checked) => updateInput('montageService', !!checked)}
                />
                <label htmlFor="montage" className="flex items-center gap-2 text-sm cursor-pointer flex-1">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  Möbelmontage
                </label>
                {inputs.montageService && (
                  <Badge variant="secondary" className="text-xs">+{formatCHF(200 + inputs.apartmentSize * 50)}</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3 p-2 rounded border">
                <Checkbox
                  id="cleaning"
                  checked={inputs.cleaningService}
                  onCheckedChange={(checked) => updateInput('cleaningService', !!checked)}
                />
                <label htmlFor="cleaning" className="flex items-center gap-2 text-sm cursor-pointer flex-1">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  Endreinigung
                </label>
                {inputs.cleaningService && (
                  <Badge variant="secondary" className="text-xs">+{formatCHF(Math.round(inputs.squareMeters * 4.5))}</Badge>
                )}
              </div>
            </div>

            {/* Urgency */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Timer className="w-3 h-3" />
                Dringlichkeit
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {URGENCY_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => updateInput('urgency', option.value as TriageInputs['urgency'])}
                    className={cn(
                      "p-2 rounded border text-xs text-left transition-colors",
                      inputs.urgency === option.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="font-medium">{option.label}</div>
                    {option.multiplier !== 1 && (
                      <div className="text-muted-foreground">
                        {option.multiplier > 1 ? `+${((option.multiplier - 1) * 100).toFixed(0)}%` : `${((option.multiplier - 1) * 100).toFixed(0)}%`}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decision Rules Reference */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-2">Entscheidungsregeln</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-medium">Status</th>
                      <th className="text-left py-2 pr-4 font-medium">Kriterien</th>
                      <th className="text-right py-2 font-medium">Anruf</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-4"><Badge className="bg-green-600 text-white">KEEP</Badge></td>
                      <td className="py-2 pr-4">Auftragswert min. CHF 1'800, Marge min. CHF 400</td>
                      <td className="py-2 text-right font-mono">8-10 Min</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-4"><Badge className="bg-blue-600 text-white">ROUTE</Badge></td>
                      <td className="py-2 pr-4">CHF 1'000-1'800 oder max. 1.5 Zimmer</td>
                      <td className="py-2 text-right font-mono">2-3 Min</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4"><Badge className="bg-red-600 text-white">REJECT</Badge></td>
                      <td className="py-2 pr-4">Unter CHF 1'000 oder Budget unter CHF 800</td>
                      <td className="py-2 text-right font-mono">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LeadTriageHelper;
