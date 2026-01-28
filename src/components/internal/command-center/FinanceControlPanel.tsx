/**
 * Finance, Utilization & Cash Control Panel
 */

import { PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatSwissCHF } from '@/lib/swiss-number-format';
import type { DailyPLEntry } from './types';

interface FinanceControlPanelProps {
  cashOnHand: number;
  monthlyFixedCosts: number;
  claimsPaid: number;
  refundsIssued: number;
  utilizationPercent: number;
  dailyPL: DailyPLEntry[];
  onCashChange: (value: number) => void;
  onFixedCostsChange: (value: number) => void;
  onClaimsChange: (value: number) => void;
  onRefundsChange: (value: number) => void;
}

export function FinanceControlPanel({
  cashOnHand,
  monthlyFixedCosts,
  claimsPaid,
  refundsIssued,
  utilizationPercent,
  dailyPL,
  onCashChange,
  onFixedCostsChange,
  onClaimsChange,
  onRefundsChange,
}: FinanceControlPanelProps) {
  // Calculations
  const totalAdSpend = dailyPL.reduce((sum, d) => sum + d.adSpend, 0);
  const monthlyBurn = monthlyFixedCosts + (totalAdSpend / 30) * 30;
  const cashRunway = monthlyBurn > 0 ? cashOnHand / monthlyBurn : 12;
  const dailyNetCash = dailyPL.length > 0 ? dailyPL.reduce((sum, d) => sum + d.netCash, 0) / dailyPL.length : 0;
  
  // Marketplace subsidy ratio
  const totalMarketplaceRevenue = dailyPL.reduce((sum, d) => sum + (d.revenue * 0.3), 0); // Assume 30% from marketplace
  const marketplaceSubsidy = totalAdSpend > 0 ? (totalMarketplaceRevenue / totalAdSpend) * 100 : 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <PieChart className="h-4 w-4" />
          Finance & Cash Control
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        {/* Inputs */}
        <div className="grid grid-cols-4 gap-2">
          <div>
            <Label className="text-xs">Cash on Hand</Label>
            <Input
              type="number"
              className="h-7 text-xs"
              value={cashOnHand}
              onChange={(e) => onCashChange(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label className="text-xs">Monthly Fixed</Label>
            <Input
              type="number"
              className="h-7 text-xs"
              value={monthlyFixedCosts}
              onChange={(e) => onFixedCostsChange(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label className="text-xs">Claims Paid</Label>
            <Input
              type="number"
              className="h-7 text-xs"
              value={claimsPaid}
              onChange={(e) => onClaimsChange(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label className="text-xs">Refunds</Label>
            <Input
              type="number"
              className="h-7 text-xs"
              value={refundsIssued}
              onChange={(e) => onRefundsChange(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        
        {/* Calculated Metrics */}
        <div className="grid grid-cols-4 gap-2 p-2 bg-muted rounded text-xs">
          <div>
            <span className="text-muted-foreground">Cash Runway:</span>
            <span className={`font-mono font-bold ml-1 ${cashRunway >= 6 ? 'text-green-600' : cashRunway >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
              {cashRunway.toFixed(1)} Mo.
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Utilization:</span>
            <span className={`font-mono font-bold ml-1 ${utilizationPercent >= 70 ? 'text-green-600' : utilizationPercent >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {utilizationPercent.toFixed(0)}%
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Avg Daily Net:</span>
            <span className={`font-mono font-bold ml-1 ${dailyNetCash >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatSwissCHF(dailyNetCash)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Mktplace Subsidy:</span>
            <span className="font-mono font-bold ml-1">{marketplaceSubsidy.toFixed(0)}%</span>
          </div>
        </div>
        
        {/* Daily P&L Table */}
        <div className="border rounded overflow-x-auto max-h-40">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow className="text-xs">
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">COGS</TableHead>
                <TableHead className="text-right">Ad Spend</TableHead>
                <TableHead className="text-right">CM2</TableHead>
                <TableHead className="text-right">Net Cash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailyPL.slice(-10).reverse().map((entry, i) => (
                <TableRow key={i} className={`text-xs ${entry.netCash < 0 ? 'bg-red-500/10' : ''}`}>
                  <TableCell className="font-mono">
                    {entry.date.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit' })}
                  </TableCell>
                  <TableCell className="text-right font-mono">{formatSwissCHF(entry.revenue, false)}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">-{formatSwissCHF(entry.cogs, false)}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">-{formatSwissCHF(entry.adSpend, false)}</TableCell>
                  <TableCell className={`text-right font-mono ${entry.cm2 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatSwissCHF(entry.cm2, false)}
                  </TableCell>
                  <TableCell className={`text-right font-mono font-bold ${entry.netCash >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {entry.netCash >= 0 ? '+' : ''}{formatSwissCHF(entry.netCash, false)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
