/**
 * Insurance Coverage Selector Component
 * Allows users to choose and customize their moving insurance
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ShieldCheck, 
  ShieldPlus, 
  Crown,
  Check,
  X,
  Info,
  Sparkles
} from 'lucide-react';
import {
  COVERAGE_PLANS,
  CoverageType,
  calculatePremium,
  getRecommendedCoverage
} from '@/lib/micro-insurance';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InsuranceCoverageSelectorProps {
  inventoryValueCHF: number;
  riskScore: number;
  hasHighValueItems?: boolean;
  onSelect?: (coverage: CoverageType, premium: number) => void;
}

const COVERAGE_ICONS: Record<CoverageType, React.ReactNode> = {
  basic: <Shield className="h-6 w-6" />,
  standard: <ShieldCheck className="h-6 w-6" />,
  premium: <ShieldPlus className="h-6 w-6" />,
  allrisk: <Crown className="h-6 w-6" />
};

export function InsuranceCoverageSelector({
  inventoryValueCHF,
  riskScore,
  hasHighValueItems = false,
  onSelect
}: InsuranceCoverageSelectorProps) {
  const [selectedCoverage, setSelectedCoverage] = useState<CoverageType | null>(null);
  
  const recommended = getRecommendedCoverage(inventoryValueCHF, hasHighValueItems);
  
  const plans = useMemo(() => {
    return (Object.entries(COVERAGE_PLANS) as [CoverageType, typeof COVERAGE_PLANS[CoverageType]][]).map(
      ([type, config]) => {
        const pricing = calculatePremium(type, inventoryValueCHF, riskScore);
        return {
          type,
          ...config,
          ...pricing,
          isRecommended: type === recommended
        };
      }
    );
  }, [inventoryValueCHF, riskScore, recommended]);

  const handleSelect = (type: CoverageType) => {
    setSelectedCoverage(type);
    const plan = plans.find(p => p.type === type);
    if (plan) {
      onSelect?.(type, plan.premiumCHF);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <Badge variant="secondary" className="mb-2">
            <Sparkles className="h-3 w-3 mr-1" />
            Video-basierte Versicherung
          </Badge>
          <h3 className="text-xl font-bold">Wählen Sie Ihren Schutz</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Ihr Inventarwert: CHF {inventoryValueCHF.toLocaleString()}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const isSelected = selectedCoverage === plan.type;
            
            return (
              <Card
                key={plan.type}
                className={`relative cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-2 border-primary ring-2 ring-primary/20' 
                    : 'hover:border-primary/50'
                } ${plan.isRecommended ? 'shadow-lg' : ''}`}
                onClick={() => handleSelect(plan.type)}
              >
                {plan.isRecommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">Empfohlen</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-2">
                  <div className={`mx-auto p-3 rounded-xl w-fit ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {COVERAGE_ICONS[plan.type]}
                  </div>
                  <CardTitle className="text-base mt-3">{plan.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Pricing */}
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      CHF {plan.premiumCHF}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      einmalig
                    </div>
                    {plan.savingsVsTraditional > 0 && (
                      <Badge variant="outline" className="mt-1 text-xs text-emerald-600">
                        CHF {plan.savingsVsTraditional} gespart
                      </Badge>
                    )}
                  </div>

                  {/* Coverage Amount */}
                  <div className="bg-muted/50 rounded-lg p-2 text-center">
                    <div className="text-sm font-medium">
                      Bis CHF {plan.coverageAmountCHF.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Selbstbehalt: CHF {plan.deductibleCHF}
                    </div>
                  </div>

                  {/* Includes */}
                  <ul className="space-y-1">
                    {plan.includes.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs">
                        <Check className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                    {plan.includes.length > 3 && (
                      <li className="text-xs text-primary">
                        +{plan.includes.length - 3} weitere
                      </li>
                    )}
                  </ul>

                  {/* Excludes */}
                  {plan.excludes.length > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground cursor-help">
                          <Info className="h-3 w-3" />
                          {plan.excludes.length} Ausschlüsse
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <ul className="space-y-1">
                          {plan.excludes.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <X className="h-3 w-3 text-destructive" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Video Advantage */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Ihr Vorteil: Video-Dokumentation</h4>
              <p className="text-sm text-muted-foreground">
                Durch das Inventar-Video haben wir Beweise vor dem Umzug. 
                Bei Schäden vergleicht die KI vorher/nachher – Auszahlung in 24-48h statt Wochen.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        {selectedCoverage && (
          <Button className="w-full" size="lg">
            {COVERAGE_PLANS[selectedCoverage].name} für CHF {
              plans.find(p => p.type === selectedCoverage)?.premiumCHF
            } hinzufügen
          </Button>
        )}
      </div>
    </TooltipProvider>
  );
}

export default InsuranceCoverageSelector;
