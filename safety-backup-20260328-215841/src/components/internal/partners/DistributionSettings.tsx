/**
 * Lead Distribution Settings
 */

import { Settings, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { DistributionSettings as DistributionSettingsType, DistributionMode } from './types';

interface DistributionSettingsProps {
  settings: DistributionSettingsType;
  onUpdate: (settings: DistributionSettingsType) => void;
}

const DISTRIBUTION_MODES: { value: DistributionMode; label: string; description: string }[] = [
  { value: 'round_robin', label: 'Round Robin', description: 'Gleichmässige Verteilung' },
  { value: 'highest_acceptance', label: 'Höchste Akzeptanz', description: 'Partner mit bestem Accept-Rate zuerst' },
  { value: 'fastest_response', label: 'Schnellste Antwort', description: 'Partner mit kürzester Reaktionszeit' },
  { value: 'premium_auction', label: 'Premium Auktion', description: 'Höchstbietender Partner gewinnt' },
];

export function DistributionSettings({ settings, onUpdate }: DistributionSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Lead-Verteilung
        </CardTitle>
        <CardDescription>Routing-Regeln für Marketplace-Leads</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* First Right of Refusal */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>First Right of Refusal:</strong> Tier 1 Leads sind exklusiv für Feierabendumzug reserviert. 
            Marketplace erhält nur Overflow bei fehlender Kapazität.
          </AlertDescription>
        </Alert>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tier2Max">Tier 2: Max Partner pro Lead</Label>
            <Input
              id="tier2Max"
              type="number"
              min={1}
              max={5}
              value={settings.tier2MaxPartners}
              onChange={(e) => onUpdate({ ...settings, tier2MaxPartners: parseInt(e.target.value) || 3 })}
            />
            <p className="text-xs text-muted-foreground mt-1">Standard: 3 Partner</p>
          </div>
          
          <div>
            <Label htmlFor="tier3Price">Tier 3: Flat-Preis (CHF)</Label>
            <Input
              id="tier3Price"
              type="number"
              min={0}
              value={settings.tier3FlatPrice}
              onChange={(e) => onUpdate({ ...settings, tier3FlatPrice: parseInt(e.target.value) || 15 })}
            />
            <p className="text-xs text-muted-foreground mt-1">An Budget-Partner oder Auto-Reject</p>
          </div>
        </div>
        
        <div>
          <Label className="mb-3 block">Verteilungs-Modus</Label>
          <RadioGroup
            value={settings.distributionMode}
            onValueChange={(value) => onUpdate({ ...settings, distributionMode: value as DistributionMode })}
            className="grid md:grid-cols-2 gap-3"
          >
            {DISTRIBUTION_MODES.map(mode => (
              <div 
                key={mode.value}
                className={`p-3 rounded-lg border cursor-pointer ${
                  settings.distributionMode === mode.value ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value={mode.value} id={mode.value} />
                  <Label htmlFor={mode.value} className="cursor-pointer">
                    <span className="font-medium">{mode.label}</span>
                    <p className="text-xs text-muted-foreground font-normal">{mode.description}</p>
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="p-3 bg-muted rounded-lg text-sm">
          <strong>Tier-Routing:</strong>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>• <strong>Tier 1 (Score ≥60):</strong> Feierabend exklusiv → Overflow: Premium Auction</li>
            <li>• <strong>Tier 2 (Score 30-59):</strong> Marketplace → Max {settings.tier2MaxPartners} Partner</li>
            <li>• <strong>Tier 3 (Score &lt;30):</strong> Budget-Partner ({settings.tier3FlatPrice} CHF) oder Reject</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
