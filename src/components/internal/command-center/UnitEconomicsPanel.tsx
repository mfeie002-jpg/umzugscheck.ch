/**
 * Unit Economics Panel - Multi-Brand (Feierabend, Umzug Express, Zügelhelden) + Marketplace
 */

import { useState, memo } from 'react';
import { Calculator, Truck, Store, Zap, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { formatSwissCHF, formatSwissPercent } from '@/lib/swiss-number-format';
import type { BrandInputs, MarketplaceInputs } from './types';

type BrandId = 'feierabend' | 'umzugexpress' | 'zuegelhelden';

interface BrandConfig {
  id: BrandId;
  name: string;
  shortName: string;
  icon: typeof Truck;
  colorClass: string;
}

const BRANDS: BrandConfig[] = [
  { id: 'feierabend', name: 'Feierabend Umzug', shortName: 'Feierabend', icon: Truck, colorClass: 'text-blue-600' },
  { id: 'umzugexpress', name: 'Umzug Express', shortName: 'Express', icon: Zap, colorClass: 'text-red-500' },
  { id: 'zuegelhelden', name: 'Zügelhelden', shortName: 'Helden', icon: Users, colorClass: 'text-teal-500' },
];

// Default values per brand based on their positioning
const DEFAULT_BRAND_INPUTS: Record<BrandId, BrandInputs> = {
  feierabend: {
    aovNet: 2800,
    cplMkt: 55,
    closeRate: 0.28,
    salesMinutesPerLead: 15,
    salesHourlyCost: 40,
    crewSize: 3,
    jobHours: 6,
    crewHourlyCost: 50,
    fleetCost: 180,
    materialsCost: 45,
  },
  umzugexpress: {
    aovNet: 1600,
    cplMkt: 45,
    closeRate: 0.32,
    salesMinutesPerLead: 10,
    salesHourlyCost: 35,
    crewSize: 2,
    jobHours: 5,
    crewHourlyCost: 48,
    fleetCost: 150,
    materialsCost: 30,
  },
  zuegelhelden: {
    aovNet: 1100,
    cplMkt: 35,
    closeRate: 0.35,
    salesMinutesPerLead: 8,
    salesHourlyCost: 30,
    crewSize: 2,
    jobHours: 4,
    crewHourlyCost: 45,
    fleetCost: 120,
    materialsCost: 25,
  },
};

interface UnitEconomicsPanelProps {
  feierabendInputs: BrandInputs;
  marketplaceInputs: MarketplaceInputs;
  onFeierabendChange: (inputs: BrandInputs) => void;
  onMarketplaceChange: (inputs: MarketplaceInputs) => void;
  // New optional props for additional brands
  umzugexpressInputs?: BrandInputs;
  zuegelheldenInputs?: BrandInputs;
  onUmzugexpressChange?: (inputs: BrandInputs) => void;
  onZuegelheldenChange?: (inputs: BrandInputs) => void;
}

// Memoized brand calculator component
const BrandCalculator = memo(function BrandCalculator({
  brand,
  inputs,
  onChange,
}: {
  brand: BrandConfig;
  inputs: BrandInputs;
  onChange: (inputs: BrandInputs) => void;
}) {
  // Calculations
  const laborCost = inputs.crewSize * inputs.jobHours * inputs.crewHourlyCost;
  const cogs = laborCost + inputs.fleetCost + inputs.materialsCost;
  const salesCost = (inputs.salesMinutesPerLead / 60) * inputs.salesHourlyCost;
  const totalCAC = inputs.cplMkt + salesCost;
  const cm2 = inputs.aovNet - cogs - totalCAC;
  const cm2Percent = inputs.aovNet > 0 ? (cm2 / inputs.aovNet) * 100 : 0;
  const maxAllowableCAC = inputs.aovNet * 0.30 * inputs.closeRate;
  const maxAllowableCPL = maxAllowableCAC - salesCost;

  const handleInput = (key: keyof BrandInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...inputs, [key]: parseFloat(e.target.value) || 0 });
  };

  return (
    <div className="space-y-3">
      {/* Inputs */}
      <div className="grid grid-cols-5 gap-2 text-xs">
        <div>
          <Label className="text-xs">AOV Net</Label>
          <Input type="number" className="h-7 text-xs" value={inputs.aovNet} onChange={handleInput('aovNet')} />
        </div>
        <div>
          <Label className="text-xs">CPL Mkt</Label>
          <Input type="number" className="h-7 text-xs" value={inputs.cplMkt} onChange={handleInput('cplMkt')} />
        </div>
        <div>
          <Label className="text-xs">Close %</Label>
          <Input type="number" step="0.01" className="h-7 text-xs" value={inputs.closeRate} onChange={handleInput('closeRate')} />
        </div>
        <div>
          <Label className="text-xs">Sales Min</Label>
          <Input type="number" className="h-7 text-xs" value={inputs.salesMinutesPerLead} onChange={handleInput('salesMinutesPerLead')} />
        </div>
        <div>
          <Label className="text-xs">Sales $/h</Label>
          <Input type="number" className="h-7 text-xs" value={inputs.salesHourlyCost} onChange={handleInput('salesHourlyCost')} />
        </div>
        <div>
          <Label className="text-xs">Crew Size</Label>
          <Input type="number" className="h-7 text-xs" value={inputs.crewSize} onChange={handleInput('crewSize')} />
        </div>
        <div>
          <Label className="text-xs">Job Hours</Label>
          <Input type="number" className="h-7 text-xs" value={inputs.jobHours} onChange={handleInput('jobHours')} />
        </div>
        <div>
          <Label className="text-xs">Crew $/h</Label>
          <Input type="number" className="h-7 text-xs" value={inputs.crewHourlyCost} onChange={handleInput('crewHourlyCost')} />
        </div>
        <div>
          <Label className="text-xs">Fleet</Label>
          <Input type="number" className="h-7 text-xs" value={inputs.fleetCost} onChange={handleInput('fleetCost')} />
        </div>
        <div>
          <Label className="text-xs">Materials</Label>
          <Input type="number" className="h-7 text-xs" value={inputs.materialsCost} onChange={handleInput('materialsCost')} />
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
          <span className={`font-mono font-bold ml-1 ${maxAllowableCPL > inputs.cplMkt ? 'text-green-600' : 'text-red-600'}`}>
            {formatSwissCHF(maxAllowableCPL)}
          </span>
        </div>
      </div>
    </div>
  );
});

export function UnitEconomicsPanel({
  feierabendInputs,
  marketplaceInputs,
  onFeierabendChange,
  onMarketplaceChange,
  umzugexpressInputs,
  zuegelheldenInputs,
  onUmzugexpressChange,
  onZuegelheldenChange,
}: UnitEconomicsPanelProps) {
  const [activeTab, setActiveTab] = useState<BrandId | 'marketplace'>('feierabend');
  
  // Use provided inputs or defaults for additional brands
  const [localUmzugexpressInputs, setLocalUmzugexpressInputs] = useState<BrandInputs>(
    umzugexpressInputs || DEFAULT_BRAND_INPUTS.umzugexpress
  );
  const [localZuegelheldenInputs, setLocalZuegelheldenInputs] = useState<BrandInputs>(
    zuegelheldenInputs || DEFAULT_BRAND_INPUTS.zuegelhelden
  );

  const handleUmzugexpressChange = (inputs: BrandInputs) => {
    setLocalUmzugexpressInputs(inputs);
    onUmzugexpressChange?.(inputs);
  };

  const handleZuegelheldenChange = (inputs: BrandInputs) => {
    setLocalZuegelheldenInputs(inputs);
    onZuegelheldenChange?.(inputs);
  };
  
  // Marketplace calculations
  const revenuePerLead = marketplaceInputs.avgBuyersPerLead * marketplaceInputs.partnerPricePerLead;
  const commissionRevenue = marketplaceInputs.estBookingValue * marketplaceInputs.partnerCloseRate * (marketplaceInputs.commissionPercent / 100);
  const conciergeRevenue = marketplaceInputs.conciergeEnabled ? 25 : 0;
  const totalRPL = revenuePerLead + commissionRevenue + conciergeRevenue;
  const marginPerLead = totalRPL - marketplaceInputs.cplBuy - marketplaceInputs.supportCostPerLead;
  const breakEvenResaleRate = marketplaceInputs.partnerPricePerLead > 0 
    ? (marketplaceInputs.cplBuy + marketplaceInputs.supportCostPerLead) / marketplaceInputs.partnerPricePerLead
    : 0;
  
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
          <TabsList className="grid w-full grid-cols-4 mb-3">
            {BRANDS.map((brand) => {
              const Icon = brand.icon;
              return (
                <TabsTrigger key={brand.id} value={brand.id} className="text-xs gap-1">
                  <Icon className={`h-3 w-3 ${brand.colorClass}`} /> {brand.shortName}
                </TabsTrigger>
              );
            })}
            <TabsTrigger value="marketplace" className="text-xs gap-1">
              <Store className="h-3 w-3" /> Marketplace
            </TabsTrigger>
          </TabsList>
          
          {/* Feierabend Tab */}
          <TabsContent value="feierabend" className="mt-0">
            <BrandCalculator
              brand={BRANDS[0]}
              inputs={feierabendInputs}
              onChange={onFeierabendChange}
            />
          </TabsContent>
          
          {/* Umzug Express Tab */}
          <TabsContent value="umzugexpress" className="mt-0">
            <BrandCalculator
              brand={BRANDS[1]}
              inputs={localUmzugexpressInputs}
              onChange={handleUmzugexpressChange}
            />
          </TabsContent>
          
          {/* Zügelhelden Tab */}
          <TabsContent value="zuegelhelden" className="mt-0">
            <BrandCalculator
              brand={BRANDS[2]}
              inputs={localZuegelheldenInputs}
              onChange={handleZuegelheldenChange}
            />
          </TabsContent>
          
          {/* Marketplace Tab */}
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
