/**
 * KPI Input Panel for editable metrics
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { LaunchKPIs } from './types';

interface KPIInputPanelProps {
  kpis: LaunchKPIs;
  onUpdate: (key: keyof LaunchKPIs, value: number) => void;
}

export function KPIInputPanel({ kpis, onUpdate }: KPIInputPanelProps) {
  const handleChange = (key: keyof LaunchKPIs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdate(key, value);
  };
  
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Ads Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📊 Ads Metrics</CardTitle>
          <CardDescription>Google Ads performance data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cpc">CPC (CHF)</Label>
              <Input 
                id="cpc" 
                type="number" 
                step="0.01"
                value={kpis.cpc} 
                onChange={handleChange('cpc')}
              />
            </div>
            <div>
              <Label htmlFor="ctr">CTR (%)</Label>
              <Input 
                id="ctr" 
                type="number" 
                step="0.1"
                value={kpis.ctr} 
                onChange={handleChange('ctr')}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dailySpend">Daily Spend (CHF)</Label>
              <Input 
                id="dailySpend" 
                type="number" 
                value={kpis.dailySpend} 
                onChange={handleChange('dailySpend')}
              />
            </div>
            <div>
              <Label htmlFor="dailyLeads">Daily Leads</Label>
              <Input 
                id="dailyLeads" 
                type="number" 
                value={kpis.dailyLeads} 
                onChange={handleChange('dailyLeads')}
              />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cpl">CPL (CHF)</Label>
              <Input 
                id="cpl" 
                type="number" 
                value={kpis.cpl} 
                onChange={handleChange('cpl')}
              />
            </div>
            <div>
              <Label htmlFor="blendedCPL7Day">Blended CPL 7-Day (CHF)</Label>
              <Input 
                id="blendedCPL7Day" 
                type="number" 
                value={kpis.blendedCPL7Day} 
                onChange={handleChange('blendedCPL7Day')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Sales Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📞 Sales Metrics</CardTitle>
          <CardDescription>Conversion and booking data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="closeRate">Close Rate (%)</Label>
              <Input 
                id="closeRate" 
                type="number" 
                step="0.1"
                value={kpis.closeRate} 
                onChange={handleChange('closeRate')}
              />
            </div>
            <div>
              <Label htmlFor="jobsCompleted">Jobs Completed</Label>
              <Input 
                id="jobsCompleted" 
                type="number" 
                value={kpis.jobsCompleted} 
                onChange={handleChange('jobsCompleted')}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="avgAOV">Avg. Order Value (CHF)</Label>
              <Input 
                id="avgAOV" 
                type="number" 
                value={kpis.avgAOV} 
                onChange={handleChange('avgAOV')}
              />
            </div>
            <div>
              <Label htmlFor="avgCOGS">Avg. COGS (CHF)</Label>
              <Input 
                id="avgCOGS" 
                type="number" 
                value={kpis.avgCOGS} 
                onChange={handleChange('avgCOGS')}
              />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cm2">CM2 (CHF)</Label>
              <Input 
                id="cm2" 
                type="number" 
                value={kpis.cm2} 
                onChange={handleChange('cm2')}
              />
            </div>
            <div>
              <Label htmlFor="cm2Percent">CM2 Margin (%)</Label>
              <Input 
                id="cm2Percent" 
                type="number" 
                step="0.1"
                value={kpis.cm2Percent} 
                onChange={handleChange('cm2Percent')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Ops Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🚚 Operations Metrics</CardTitle>
          <CardDescription>Capacity and utilization data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="utilization">Utilization (%)</Label>
              <Input 
                id="utilization" 
                type="number" 
                step="1"
                value={kpis.utilization} 
                onChange={handleChange('utilization')}
              />
            </div>
            <div>
              <Label htmlFor="claimRatePercent">Claim Rate (%)</Label>
              <Input 
                id="claimRatePercent" 
                type="number" 
                step="0.1"
                value={kpis.claimRatePercent} 
                onChange={handleChange('claimRatePercent')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Marketplace Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🏪 Marketplace Metrics</CardTitle>
          <CardDescription>Partner network performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marketplaceCPL">Marketplace CPL (CHF)</Label>
              <Input 
                id="marketplaceCPL" 
                type="number" 
                value={kpis.marketplaceCPL} 
                onChange={handleChange('marketplaceCPL')}
              />
            </div>
            <div>
              <Label htmlFor="partnerAcceptRate">Partner Accept (%)</Label>
              <Input 
                id="partnerAcceptRate" 
                type="number" 
                step="1"
                value={kpis.partnerAcceptRate} 
                onChange={handleChange('partnerAcceptRate')}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="resaleRate">Resale Rate (%)</Label>
              <Input 
                id="resaleRate" 
                type="number" 
                step="1"
                value={kpis.resaleRate} 
                onChange={handleChange('resaleRate')}
              />
            </div>
            <div>
              <Label htmlFor="fillRate">Fill Rate (x)</Label>
              <Input 
                id="fillRate" 
                type="number" 
                step="0.1"
                value={kpis.fillRate} 
                onChange={handleChange('fillRate')}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="disputeRate">Dispute Rate (%)</Label>
              <Input 
                id="disputeRate" 
                type="number" 
                step="0.1"
                value={kpis.disputeRate} 
                onChange={handleChange('disputeRate')}
              />
            </div>
            <div>
              <Label htmlFor="partnerRefundRate">Refund Rate (%)</Label>
              <Input 
                id="partnerRefundRate" 
                type="number" 
                step="0.1"
                value={kpis.partnerRefundRate} 
                onChange={handleChange('partnerRefundRate')}
              />
            </div>
          </div>
          <Separator />
          <div>
            <Label htmlFor="marketplaceRevenuePercent">Marketplace Rev % of Ad Spend</Label>
            <Input 
              id="marketplaceRevenuePercent" 
              type="number" 
              step="1"
              value={kpis.marketplaceRevenuePercent} 
              onChange={handleChange('marketplaceRevenuePercent')}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Financial Metrics */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">💰 Financial Metrics</CardTitle>
          <CardDescription>Cash position and runway</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="cashReserveMonths">Cash Reserve (Months)</Label>
              <Input 
                id="cashReserveMonths" 
                type="number" 
                step="0.1"
                value={kpis.cashReserveMonths} 
                onChange={handleChange('cashReserveMonths')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
