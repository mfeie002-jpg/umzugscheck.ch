/**
 * First Right of Refusal - Feierabend Gate
 */

import { Shield, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import type { IncomingLead } from './types';

interface FeierabendGateProps {
  capacityAvailable: boolean;
  onCapacityChange: (available: boolean) => void;
  selectedLead: IncomingLead | null;
}

export function FeierabendGate({ capacityAvailable, onCapacityChange, selectedLead }: FeierabendGateProps) {
  const isTier1 = selectedLead?.tier === 1;
  const willRouteToFeierabend = isTier1 && capacityAvailable;
  const willRouteToPremiumAuction = isTier1 && !capacityAvailable;
  
  return (
    <Card className={willRouteToFeierabend ? 'border-purple-500' : ''}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-purple-600" />
          First Right of Refusal
        </CardTitle>
        <CardDescription>Feierabendumzug hat Vorrecht auf Tier 1 Leads</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <Alert className="bg-purple-500/10 border-purple-500">
          <Shield className="h-4 w-4 text-purple-600" />
          <AlertDescription>
            <strong>Regel:</strong> Tier 1 Leads müssen zuerst Feierabendumzug angeboten werden.
          </AlertDescription>
        </Alert>
        
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <Label htmlFor="capacity" className="text-base font-medium">
              Feierabend Kapazität verfügbar?
            </Label>
            <p className="text-sm text-muted-foreground">
              Für das ausgewählte Umzugsdatum
            </p>
          </div>
          <Switch
            id="capacity"
            checked={capacityAvailable}
            onCheckedChange={onCapacityChange}
          />
        </div>
        
        {selectedLead && (
          <div className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ausgewählter Lead:</span>
              <Badge className={selectedLead.tier === 1 ? 'bg-emerald-500' : 'bg-blue-500'}>
                Tier {selectedLead.tier}
              </Badge>
            </div>
            
            {isTier1 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {capacityAvailable ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-green-700 font-medium">
                        → Route zu Feierabendumzug
                      </span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 text-orange-600" />
                      <span className="text-orange-700 font-medium">
                        → Premium Auction (Marketplace Overflow)
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {!isTier1 && (
              <div className="text-sm text-muted-foreground">
                Tier {selectedLead.tier} Lead → Standard Marketplace Distribution
              </div>
            )}
          </div>
        )}
        
        <div className="p-3 bg-muted rounded-lg text-sm">
          <strong>Routing Logic:</strong>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-600" />
              Tier 1 + Kapazität = Feierabend (exklusiv)
            </li>
            <li className="flex items-center gap-2">
              <X className="h-3 w-3 text-orange-600" />
              Tier 1 + Keine Kapazität = Premium Auction
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500 inline-block" />
              Tier 2 = Standard Marketplace (max 3 Partner)
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-gray-500 inline-block" />
              Tier 3 = Budget Partner (CHF 15) oder Reject
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
