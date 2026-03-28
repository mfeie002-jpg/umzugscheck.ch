/**
 * Distribution Mode Selector
 */

import { Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { DistributionMode } from './types';

interface DistributionModeSelectorProps {
  mode: DistributionMode;
  onModeChange: (mode: DistributionMode) => void;
}

const MODES: { value: DistributionMode; label: string; description: string }[] = [
  { 
    value: 'round_robin', 
    label: 'Round Robin', 
    description: 'Leads werden gleichmässig an alle aktiven Partner verteilt. Faire Rotation.' 
  },
  { 
    value: 'weighted', 
    label: 'Weighted (Best Partners First)', 
    description: 'Partner mit höherer Akzeptanz, schnellerer Antwort und tieferer Dispute-Rate werden bevorzugt.' 
  },
  { 
    value: 'premium_auction', 
    label: 'Premium Auction', 
    description: 'Partner bieten auf Leads. Höchstbietender (mit Quality Score) gewinnt. Für Tier 1 Overflow.' 
  },
  { 
    value: 'manual', 
    label: 'Manual', 
    description: 'Founder entscheidet manuell über jede Zuweisung. Für kritische Leads.' 
  },
];

export function DistributionModeSelector({ mode, onModeChange }: DistributionModeSelectorProps) {
  const activeMode = MODES.find(m => m.value === mode);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          Distribution Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={mode}
          onValueChange={(v) => onModeChange(v as DistributionMode)}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {MODES.map((m) => (
            <div
              key={m.value}
              className={`p-3 rounded-lg border cursor-pointer ${
                mode === m.value ? 'border-primary bg-primary/5' : 'hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value={m.value} id={m.value} />
                <Label htmlFor={m.value} className="cursor-pointer font-medium">
                  {m.label}
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
        
        {activeMode && (
          <div className="p-3 bg-muted rounded-lg text-sm">
            <strong>Aktiver Modus:</strong> {activeMode.description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
