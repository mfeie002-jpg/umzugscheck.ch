/**
 * Unit Economics Panel - Feierabend + Marketplace Math
 */

import { useState } from 'react';
import { Calculator, Truck, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { formatSwissCHF, formatSwissPercent } from '@/lib/swiss-number-format';
import type { FeierabendInputs, MarketplaceInputs } from './types';

interface UnitEconomicsPanelProps {
  feierabendInputs: FeierabendInputs;
  marketplaceInputs: MarketplaceInputs;
  onFeierabendChange: (inputs: FeierabendInputs) => void;
  onMarketplaceChange: (inputs: MarketplaceInputs) => void;
}

export function UnitEconomicsPanel({
  feierabendInputs,
  marketplaceInputs,
  onFeierabendChange,
  onMarketplaceChange,
}: UnitEconomicsPanelProps) {
  const [activeTab, setActiveTab] = useState<'feierabend' | 'marketplace'>('feierabend');
  
  // Feierabend calculations
  const laborCost = feierabendInputs.crewSize * feierabendInputs.jobHours * feierabendInputs.crewHourlyCost;
  const cogs = laborCost + feierabendInputs.fleetCost + feierabendInputs.materialsCost;
  const salesCost = (feierabendInputs.salesMinutesPerLead / 60) * feierabendInputs.salesHourlyCost;
  const totalCAC = feierabendInputs.cplMkt + salesCost;
  const cm2 = feierabendInputs.aovNet - cogs - totalCAC;
  const cm2Percent = feierabendInputs.aovNet > 0 ? (cm2 / feierabendInputs.aovNet) * 100 : 0;
  const maxAllowableCAC = feierabendInputs.aovNet * 0.30 * feierabendInputs.closeRate;
  const maxAllowableCPL = maxAllowableCAC - salesCost;
  
  // Marketplace calculations
  const revenuePerLead = marketplaceInputs.avgBuyersPerLead * marketplaceInputs.partnerPricePerLead;
  const commissionRevenue = marketplaceInputs.estBookingValue * marketplaceInputs.partnerCloseRate * (marketplaceInputs.commissionPercent / 100);
  const conciergeRevenue = marketplaceInputs.conciergeEnabled ? 25 : 0;
  const totalRPL = revenuePerLead + commissionRevenue + conciergeRevenue;
  const marginPerLead = totalRPL - marketplaceInputs.cplBuy - marketplaceInputs.supportCostPerLead;
  const breakEvenResaleRate = marketplaceInputs.partnerPricePerLead > 0 
    ? (marketplaceInputs.cplBuy + marketplaceInputs.supportCostPerLead) / marketplaceInputs.partnerPricePerLead
    : 0;
  
  const handleFeierabendInput = (key: keyof FeierabendInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onFeierabendChange({ ...feierabendInputs, [key]: parseFloat(e.target.value) || 0 });
  };
  
  const handleMarketplaceInput = (key: keyof MarketplaceInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onMarketplaceChange({ ...marketplaceInputs, [key]: parseFloat(e.target.value) || 0 });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="h-4 w-4" />
          Unit Economics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="feierabend" className="text-xs gap-1">
              <Truck className="h-3 w-3" /> Feierabend
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="text-xs gap-1">
              <Store className="h-3 w-3" /> Marketplace
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="feierabend" className="mt-0 space-y-3">
            {/* Inputs */}
            <div className="grid grid-cols-5 gap-2 text-xs">
              <div>
                <Label className="text-xs">AOV Net</Label>
                <Input type="number" className="h-7 text-xs" value={feierabendInputs.aovNet} onChange={handleFeierabendInput('aovNet')} />
              </div>
              <div>
                <Label className="text-xs">CPL Mkt</Label>
                <Input type="number" className="h-7 text-xs" value={feierabendInputs.cplMkt} onChange={handleFeierabendInput('cplMkt')} />
              </div>
              <div>
                <Label className="text-xs">Close %</Label>
                <Input type="number" step="0.01" className="h-7 text-xs" value={feierabendInputs.closeRate} onChange={handleFeierabendInput('closeRate')} />
              </div>
              <div>
                <Label className="text-xs">Sales Min</Label>
                <Input type="number" className="h-7 text-xs" value={feierabendInputs.salesMinutesPerLead} onChange={handleFeierabendInput('salesMinutesPerLead')} />
              </div>
              <div>
                <Label className="text-xs">Sales $/h</Label>
                <Input type="number" className="h-7 text-xs" value={feierabendInputs.salesHourlyCost} onChange={handleFeierabendInput('salesHourlyCost')} />
              </div>
              <div>
                <Label className="text-xs">Crew Size</Label>
                <Input type="number" className="h-7 text-xs" value={feierabendInputs.crewSize} onChange={handleFeierabendInput('crewSize')} />
              </div>
              <div>
                <Label className="text-xs">Job Hours</Label>
                <Input type="number" className="h-7 text-xs" value={feierabendInputs.jobHours} onChange={handleFeierabendInput('jobHours')} />
              </div>
              <div>
                <Label className="text-xs">Crew $/h</Label>
                <Input type="number" className="h-7 text-xs" value={feierabendInputs.crewHourlyCost} onChange={handleFeierabendInput('crewHourlyCost')} />
              </div>
              <div>
                <Label className="text-xs">Fleet</Label>
                <Input type="number" className="h-7 text-xs" value={feierabendInputs.fleetCost} onChange={handleFeierabendInput('fleetCost')} />
              </div>
              <div>
                <Label className="text-xs">Materials</Label>
                <Input type="number" className="h-7 text-xs" value={feierabendInputs.materialsCost} onChange={handleFeierabendInput('materialsCost')} />
              </div>
            </div>
            
            {/* Calculations */}
            <div className="grid grid-cols-3 gap-2 p-2 bg-muted rounded text-xs">
              <div>
                <span className="text-muted-foreground">COGS:</span>
                <span className="font-mono font-bold ml-1">{formatSwissCHF(cogs)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total CAC:</span>
                <span className="font-mono font-bold ml-1">{formatSwissCHF(totalCAC)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">CM2:</span>
                <span className={`font-mono font-bold ml-1 ${cm2 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatSwissCHF(cm2)} ({formatSwissPercent(cm2Percent)})
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Max CAC:</span>
                <span className="font-mono font-bold ml-1">{formatSwissCHF(maxAllowableCAC)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Max CPL:</span>
                <span className={`font-mono font-bold ml-1 ${maxAllowableCPL > feierabendInputs.cplMkt ? 'text-green-600' : 'text-red-600'}`}>
                  {formatSwissCHF(maxAllowableCPL)}
                </span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="marketplace" className="mt-0 space-y-3">
            {/* Inputs */}
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div>
                <Label className="text-xs">CPL Buy</Label>
                <Input type="number" className="h-7 text-xs" value={marketplaceInputs.cplBuy} onChange={handleMarketplaceInput('cplBuy')} />
              </div>
              <div>
                <Label className="text-xs">Lead Price</Label>
                <Input type="number" className="h-7 text-xs" value={marketplaceInputs.partnerPricePerLead} onChange={handleMarketplaceInput('partnerPricePerLead')} />
              </div>
              <div>
                <Label className="text-xs">Avg Buyers</Label>
                <Input type="number" step="0.1" className="h-7 text-xs" value={marketplaceInputs.avgBuyersPerLead} onChange={handleMarketplaceInput('avgBuyersPerLead')} />
              </div>
              <div>
                <Label className="text-xs">Commission %</Label>
                <Input type="number" className="h-7 text-xs" value={marketplaceInputs.commissionPercent} onChange={handleMarketplaceInput('commissionPercent')} />
              </div>
              <div>
                <Label className="text-xs">Est Booking</Label>
                <Input type="number" className="h-7 text-xs" value={marketplaceInputs.estBookingValue} onChange={handleMarketplaceInput('estBookingValue')} />
              </div>
              <div>
                <Label className="text-xs">Partner Close</Label>
                <Input type="number" step="0.01" className="h-7 text-xs" value={marketplaceInputs.partnerCloseRate} onChange={handleMarketplaceInput('partnerCloseRate')} />
              </div>
              <div>
                <Label className="text-xs">Support Cost</Label>
                <Input type="number" className="h-7 text-xs" value={marketplaceInputs.supportCostPerLead} onChange={handleMarketplaceInput('supportCostPerLead')} />
              </div>
              <div className="flex items-center gap-2 pt-4">
                <Switch
                  checked={marketplaceInputs.conciergeEnabled}
                  onCheckedChange={(checked) => onMarketplaceChange({ ...marketplaceInputs, conciergeEnabled: checked })}
                />
                <Label className="text-xs">Concierge</Label>
              </div>
            </div>
            
            {/* Calculations */}
            <div className="grid grid-cols-3 gap-2 p-2 bg-muted rounded text-xs">
              <div>
                <span className="text-muted-foreground">RPL:</span>
                <span className="font-mono font-bold ml-1">{formatSwissCHF(totalRPL)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Margin/Lead:</span>
                <span className={`font-mono font-bold ml-1 ${marginPerLead >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatSwissCHF(marginPerLead)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Break-Even:</span>
                <span className="font-mono font-bold ml-1">{breakEvenResaleRate.toFixed(2)}x</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
