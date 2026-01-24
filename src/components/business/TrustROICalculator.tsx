/**
 * TrustROICalculator
 * Extended ROI calculator with Trust Score impact visualization
 * Shows how trust improvements translate to more leads and revenue
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calculator, TrendingUp, Users, Zap, ArrowRight, 
  Shield, Award, Crown, Star, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustROICalculatorProps {
  onGetStarted?: () => void;
  initialTrustScore?: number;
  className?: string;
}

const BADGE_LEVELS = [
  { min: 0, max: 39, label: 'Basis', icon: Star, color: 'text-muted-foreground', bg: 'bg-muted' },
  { min: 40, max: 59, label: 'Verifiziert', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-100' },
  { min: 60, max: 79, label: 'Premium', icon: Award, color: 'text-amber-600', bg: 'bg-amber-100' },
  { min: 80, max: 100, label: 'Elite', icon: Crown, color: 'text-purple-600', bg: 'bg-purple-100' },
];

function getBadgeForScore(score: number) {
  return BADGE_LEVELS.find(b => score >= b.min && score <= b.max) || BADGE_LEVELS[0];
}

export const TrustROICalculator = ({ 
  onGetStarted,
  initialTrustScore = 35,
  className 
}: TrustROICalculatorProps) => {
  // Inputs
  const [monthlyBudget, setMonthlyBudget] = useState(500);
  const [region, setRegion] = useState("zurich");
  const [trustScore, setTrustScore] = useState(initialTrustScore);
  const [showComparison, setShowComparison] = useState(false);
  const [targetTrustScore, setTargetTrustScore] = useState(75);

  // Calculations
  const calculations = useMemo(() => {
    // Base cost per lead depends on region
    const baseCostPerLead = region === "zurich" ? 35 : region === "rural" ? 20 : 28;
    
    // Trust multiplier: higher trust = more leads from same budget
    // Score 50 = neutral (1.0x), Score 100 = 1.5x, Score 0 = 0.5x
    const trustMultiplier = 0.5 + (trustScore / 100);
    const targetTrustMultiplier = 0.5 + (targetTrustScore / 100);
    
    // Conversion rate also improves with trust
    const baseConversionRate = 0.20; // 20%
    const conversionBonus = (trustScore - 35) * 0.003; // +0.3% per trust point above 35
    const conversionRate = Math.min(0.50, baseConversionRate + conversionBonus);
    
    const targetConversionBonus = (targetTrustScore - 35) * 0.003;
    const targetConversionRate = Math.min(0.50, baseConversionRate + targetConversionBonus);
    
    // Calculate leads
    const effectiveCostPerLead = baseCostPerLead / trustMultiplier;
    const targetEffectiveCostPerLead = baseCostPerLead / targetTrustMultiplier;
    
    const estimatedLeads = Math.floor(monthlyBudget / effectiveCostPerLead);
    const targetLeads = Math.floor(monthlyBudget / targetEffectiveCostPerLead);
    
    // Calculate conversions and revenue
    const estimatedConversions = Math.floor(estimatedLeads * conversionRate);
    const targetConversions = Math.floor(targetLeads * targetConversionRate);
    
    const avgJobValue = 1500;
    const estimatedRevenue = estimatedConversions * avgJobValue;
    const targetRevenue = targetConversions * avgJobValue;
    
    // ROI
    const roi = monthlyBudget > 0 ? ((estimatedRevenue - monthlyBudget) / monthlyBudget * 100) : 0;
    const targetRoi = monthlyBudget > 0 ? ((targetRevenue - monthlyBudget) / monthlyBudget * 100) : 0;

    return {
      current: {
        leads: estimatedLeads,
        conversions: estimatedConversions,
        revenue: estimatedRevenue,
        roi: roi,
        conversionRate: Math.round(conversionRate * 100),
        costPerLead: Math.round(effectiveCostPerLead),
      },
      target: {
        leads: targetLeads,
        conversions: targetConversions,
        revenue: targetRevenue,
        roi: targetRoi,
        conversionRate: Math.round(targetConversionRate * 100),
        costPerLead: Math.round(targetEffectiveCostPerLead),
      },
      delta: {
        leads: targetLeads - estimatedLeads,
        conversions: targetConversions - estimatedConversions,
        revenue: targetRevenue - estimatedRevenue,
        roi: targetRoi - roi,
      }
    };
  }, [monthlyBudget, region, trustScore, targetTrustScore]);

  const currentBadge = getBadgeForScore(trustScore);
  const targetBadge = getBadgeForScore(targetTrustScore);
  const CurrentIcon = currentBadge.icon;
  const TargetIcon = targetBadge.icon;

  return (
    <Card className={cn("border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Trust-basierter ROI-Rechner</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sehen Sie, wie Ihr Trust-Score Ihren Ertrag beeinflusst
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Monthly Budget Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Monatliches Budget</label>
            <span className="text-lg font-bold text-primary">CHF {monthlyBudget}</span>
          </div>
          <Slider
            value={[monthlyBudget]}
            onValueChange={([value]) => setMonthlyBudget(value)}
            min={100}
            max={2000}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>CHF 100</span>
            <span>CHF 2'000</span>
          </div>
        </div>

        {/* Region Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Hauptregion</label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zurich">Zürich / Genf (höhere Nachfrage)</SelectItem>
              <SelectItem value="urban">Andere Städte</SelectItem>
              <SelectItem value="rural">Ländliche Regionen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Trust Score Slider */}
        <div className="space-y-3 p-4 rounded-lg bg-muted/50 border">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <label className="text-sm font-medium">Aktueller Trust-Score</label>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{trustScore}</span>
              <Badge className={cn("text-xs", currentBadge.bg, currentBadge.color)}>
                <CurrentIcon className="w-3 h-3 mr-1" />
                {currentBadge.label}
              </Badge>
            </div>
          </div>
          <Slider
            value={[trustScore]}
            onValueChange={([value]) => setTrustScore(value)}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Basis (0)</span>
            <span>Elite (100)</span>
          </div>
        </div>

        {/* Comparison Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg border bg-background">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <Label htmlFor="comparison" className="text-sm font-medium cursor-pointer">
              Vergleich mit höherem Trust-Score zeigen
            </Label>
          </div>
          <Switch
            id="comparison"
            checked={showComparison}
            onCheckedChange={setShowComparison}
          />
        </div>

        {/* Target Trust Score (if comparison enabled) */}
        {showComparison && (
          <div className="space-y-3 p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <label className="text-sm font-medium text-green-900">Ziel Trust-Score</label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-700">{targetTrustScore}</span>
                <Badge className={cn("text-xs", targetBadge.bg, targetBadge.color)}>
                  <TargetIcon className="w-3 h-3 mr-1" />
                  {targetBadge.label}
                </Badge>
              </div>
            </div>
            <Slider
              value={[targetTrustScore]}
              onValueChange={([value]) => setTargetTrustScore(value)}
              min={trustScore}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        )}

        {/* Results */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="bg-background rounded-lg p-4 text-center">
            <Users className="h-5 w-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{calculations.current.leads}</div>
            <div className="text-xs text-muted-foreground">Leads pro Monat</div>
            {showComparison && calculations.delta.leads > 0 && (
              <div className="text-xs text-green-600 font-medium mt-1">
                +{calculations.delta.leads} mit höherem Score
              </div>
            )}
          </div>
          <div className="bg-background rounded-lg p-4 text-center">
            <Zap className="h-5 w-5 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{calculations.current.conversions}</div>
            <div className="text-xs text-muted-foreground">Aufträge</div>
            {showComparison && calculations.delta.conversions > 0 && (
              <div className="text-xs text-green-600 font-medium mt-1">
                +{calculations.delta.conversions} mit höherem Score
              </div>
            )}
          </div>
        </div>

        {/* Revenue Comparison */}
        {showComparison ? (
          <div className="space-y-3">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Aktuell (Score {trustScore})</span>
                <span className="font-bold">CHF {calculations.current.revenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-center py-2">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mx-2">nach Optimierung</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Ziel (Score {targetTrustScore})</span>
                <span className="font-bold text-green-600">CHF {calculations.target.revenue.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-green-100 rounded-lg p-4 text-center border border-green-200">
              <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-600">
                +CHF {calculations.delta.revenue.toLocaleString()}
              </div>
              <div className="text-sm text-green-700">Zusätzlicher Umsatz pro Monat</div>
              <div className="mt-2 text-sm font-medium text-green-600">
                ROI: +{Math.round(calculations.delta.roi)}%
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold text-primary">
              CHF {calculations.current.revenue.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Geschätzter Umsatz pro Monat</div>
            <div className="mt-2 text-sm font-medium text-green-600">
              ROI: +{Math.round(calculations.current.roi)}%
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          * Basierend auf Ø Auftragswert CHF 1'500 und Trust-Score-abhängigen Conversion-Raten
        </p>

        {onGetStarted && (
          <Button onClick={onGetStarted} className="w-full" size="lg">
            Jetzt Partner werden
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TrustROICalculator;
