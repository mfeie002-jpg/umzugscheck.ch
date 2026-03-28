/**
 * GAV Labor Calculator
 * Based on Gemini analysis: "Fully burdened" Swiss labor costs
 * 
 * Includes:
 * - 13th month salary (8.33% accrual)
 * - AHV/IV/EO: 10.6%
 * - ALV: 2.2%
 * - BVG: ~7%
 * - UVG: 2-3%
 * - Holiday accrual (4 weeks minimum)
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Calculator, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CrewMember {
  role: string;
  hourlyGross: number;
}

const DEFAULT_CREW: CrewMember[] = [
  { role: "Teamleiter (Cat C)", hourlyGross: 34 },
  { role: "Mover 1", hourlyGross: 24 },
  { role: "Mover 2", hourlyGross: 24 },
];

// Swiss social charges breakdown
const SOCIAL_CHARGES = {
  ahvIvEo: 0.053, // Employer share: 5.3%
  alv: 0.011,     // Employer share: 1.1%
  bvg: 0.07,      // Approx 7% for employer
  uvg: 0.025,     // 2.5% for physical labor
  thirteenthMonth: 0.0833, // 1/12
  holidayAccrual: 0.0769,  // 4 weeks / 52 weeks
};

export function GavLaborCalculator() {
  const [crew, setCrew] = useState(DEFAULT_CREW);
  const [hoursPerJob, setHoursPerJob] = useState(9);

  const totalSocialLoadRate = 
    SOCIAL_CHARGES.ahvIvEo + 
    SOCIAL_CHARGES.alv + 
    SOCIAL_CHARGES.bvg + 
    SOCIAL_CHARGES.uvg + 
    SOCIAL_CHARGES.thirteenthMonth + 
    SOCIAL_CHARGES.holidayAccrual;

  const calculateBurdenedRate = (grossHourly: number) => {
    return grossHourly * (1 + totalSocialLoadRate);
  };

  const nominalHourlyTotal = crew.reduce((sum, m) => sum + m.hourlyGross, 0);
  const burdenedHourlyTotal = crew.reduce((sum, m) => sum + calculateBurdenedRate(m.hourlyGross), 0);
  const burdenMultiplier = burdenedHourlyTotal / nominalHourlyTotal;

  const totalManHours = crew.length * hoursPerJob;
  const nominalJobCost = nominalHourlyTotal * hoursPerJob;
  const burdenedJobCost = burdenedHourlyTotal * hoursPerJob;
  const hiddenCost = burdenedJobCost - nominalJobCost;

  const dailyBurnRate = burdenedHourlyTotal * 8; // 8-hour day

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <Users className="w-4 h-4" />
          GAV Labor Calculator (Gemini Insights)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warning Banner */}
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-800 dark:text-amber-200">
              <p className="font-medium">Gemini Insight: "Fully Burdened" Labor</p>
              <p className="mt-1">
                Ein 3-Mann-Team mit CHF 90/h nominal kostet tatsächlich CHF 135-145/h 
                inkl. 13. Monat, Ferien, Sozialabgaben.
              </p>
            </div>
          </div>
        </div>

        {/* Crew Configuration */}
        <div className="space-y-3">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Crew Konfiguration
          </Label>
          <div className="grid gap-3">
            {crew.map((member, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm w-32">{member.role}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">CHF</span>
                  <Input
                    type="number"
                    value={member.hourlyGross}
                    onChange={(e) => {
                      const newCrew = [...crew];
                      newCrew[idx].hourlyGross = parseFloat(e.target.value) || 0;
                      setCrew(newCrew);
                    }}
                    className="w-20 font-mono"
                  />
                  <span className="text-xs text-muted-foreground">/h brutto</span>
                </div>
                <span className="text-xs text-muted-foreground">→</span>
                <span className="font-mono text-sm font-medium text-primary">
                  CHF {calculateBurdenedRate(member.hourlyGross).toFixed(2)}/h
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hours per Job */}
        <div className="flex items-center gap-4">
          <Label className="text-sm">Stunden pro Auftrag:</Label>
          <Input
            type="number"
            value={hoursPerJob}
            onChange={(e) => setHoursPerJob(parseFloat(e.target.value) || 0)}
            className="w-20 font-mono"
          />
          <span className="text-xs text-muted-foreground">({totalManHours} Mannstunden)</span>
        </div>

        {/* Social Charges Breakdown */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
            Soziallasten Breakdown
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="flex justify-between">
              <span>AHV/IV/EO:</span>
              <span className="font-mono">{(SOCIAL_CHARGES.ahvIvEo * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>ALV:</span>
              <span className="font-mono">{(SOCIAL_CHARGES.alv * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>BVG:</span>
              <span className="font-mono">{(SOCIAL_CHARGES.bvg * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>UVG:</span>
              <span className="font-mono">{(SOCIAL_CHARGES.uvg * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>13. Monat:</span>
              <span className="font-mono">{(SOCIAL_CHARGES.thirteenthMonth * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Ferien:</span>
              <span className="font-mono">{(SOCIAL_CHARGES.holidayAccrual * 100).toFixed(1)}%</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t flex justify-between font-medium">
            <span>Total Burden Rate:</span>
            <span className="font-mono text-primary">+{(totalSocialLoadRate * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Results Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1">Nominal/h (Crew)</div>
            <div className="text-xl font-bold font-mono">CHF {nominalHourlyTotal}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-primary/10">
            <div className="text-xs text-muted-foreground mb-1">Burdened/h (Crew)</div>
            <div className="text-xl font-bold font-mono text-primary">
              CHF {burdenedHourlyTotal.toFixed(0)}
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1">Job Kosten (Nominal)</div>
            <div className="text-xl font-bold font-mono">CHF {nominalJobCost.toFixed(0)}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950/30">
            <div className="text-xs text-muted-foreground mb-1">Job Kosten (Real)</div>
            <div className="text-xl font-bold font-mono text-red-600">
              CHF {burdenedJobCost.toFixed(0)}
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="p-4 rounded-lg border-2 border-dashed">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Versteckte Kosten pro Job:</span>
            <Badge variant="destructive" className="font-mono">
              +CHF {hiddenCost.toFixed(0)}
            </Badge>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Burden Multiplier:</span>
            <Badge variant="outline" className="font-mono">
              {burdenMultiplier.toFixed(2)}x
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Daily Burn Rate (8h):</span>
            <Badge className="bg-amber-500 font-mono">
              CHF {dailyBurnRate.toFixed(0)}/Tag
            </Badge>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Quelle: Gemini Strategic Analysis - GAV Transport & Logistics Compliance
        </p>
      </CardContent>
    </Card>
  );
}
