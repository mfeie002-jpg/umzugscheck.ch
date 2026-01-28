/**
 * Partner Network Control Panel
 */

import { Users, MapPin, AlertTriangle, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatSwissCHF, formatSwissPercent } from '@/lib/swiss-number-format';

interface Partner {
  name: string;
  canton: string;
  capacity: 'open' | 'limited' | 'full';
  acceptanceRate: number;
  responseMinutes: number;
  closeRate: number;
  rpl: number;
  disputeRate: number;
  roi: number;
  status: 'active' | 'probation' | 'paused' | 'banned';
}

interface CantonCoverage {
  canton: string;
  target: number;
  current: number;
}

const MOCK_PARTNERS: Partner[] = [
  { name: 'Müller Transport', canton: 'ZH', capacity: 'open', acceptanceRate: 85, responseMinutes: 12, closeRate: 32, rpl: 185, disputeRate: 3.2, roi: 7.2, status: 'active' },
  { name: 'Züri Move AG', canton: 'ZH', capacity: 'limited', acceptanceRate: 72, responseMinutes: 25, closeRate: 28, rpl: 155, disputeRate: 5.8, roi: 5.4, status: 'probation' },
  { name: 'Swiss Umzüge', canton: 'AG', capacity: 'open', acceptanceRate: 90, responseMinutes: 8, closeRate: 35, rpl: 210, disputeRate: 1.5, roi: 8.5, status: 'active' },
  { name: 'Budget Move', canton: 'ZG', capacity: 'full', acceptanceRate: 45, responseMinutes: 60, closeRate: 22, rpl: 95, disputeRate: 12.0, roi: 2.1, status: 'paused' },
];

const CANTON_COVERAGE: CantonCoverage[] = [
  { canton: 'ZH', target: 6, current: 5 },
  { canton: 'AG', target: 3, current: 2 },
  { canton: 'ZG', target: 2, current: 3 },
  { canton: 'SZ', target: 2, current: 1 },
];

export function PartnerNetworkPanel() {
  const getCapacityBadge = (capacity: Partner['capacity']) => {
    switch (capacity) {
      case 'open': return <Badge className="bg-green-500 text-xs">Open</Badge>;
      case 'limited': return <Badge className="bg-yellow-500 text-black text-xs">Limited</Badge>;
      case 'full': return <Badge variant="destructive" className="text-xs">Full</Badge>;
    }
  };
  
  const getStatusBadge = (status: Partner['status']) => {
    switch (status) {
      case 'active': return <Badge variant="outline" className="text-xs text-green-600 border-green-600">Active</Badge>;
      case 'probation': return <Badge className="bg-yellow-500 text-black text-xs">Probation</Badge>;
      case 'paused': return <Badge variant="secondary" className="text-xs">Paused</Badge>;
      case 'banned': return <Badge variant="destructive" className="text-xs">Banned</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4" />
          Partner Network
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        {/* Partner Table */}
        <div className="border rounded overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Partner</TableHead>
                <TableHead>Canton</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead className="text-right">Accept%</TableHead>
                <TableHead className="text-right">Speed</TableHead>
                <TableHead className="text-right">Close%</TableHead>
                <TableHead className="text-right">RPL</TableHead>
                <TableHead className="text-right">Dispute%</TableHead>
                <TableHead className="text-right">ROI</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_PARTNERS.map((partner) => (
                <TableRow key={partner.name} className="text-xs">
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell className="font-mono">{partner.canton}</TableCell>
                  <TableCell>{getCapacityBadge(partner.capacity)}</TableCell>
                  <TableCell className="text-right font-mono">{formatSwissPercent(partner.acceptanceRate)}</TableCell>
                  <TableCell className="text-right font-mono">{partner.responseMinutes}m</TableCell>
                  <TableCell className="text-right font-mono">{formatSwissPercent(partner.closeRate)}</TableCell>
                  <TableCell className="text-right font-mono">{formatSwissCHF(partner.rpl)}</TableCell>
                  <TableCell className={`text-right font-mono ${partner.disputeRate > 10 ? 'text-red-600' : partner.disputeRate > 5 ? 'text-yellow-600' : ''}`}>
                    {formatSwissPercent(partner.disputeRate)}
                  </TableCell>
                  <TableCell className={`text-right font-mono font-bold ${partner.roi >= 6 ? 'text-green-600' : partner.roi >= 4 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {partner.roi.toFixed(1)}x
                  </TableCell>
                  <TableCell>{getStatusBadge(partner.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Canton Coverage */}
        <div className="grid grid-cols-4 gap-2">
          {CANTON_COVERAGE.map((c) => {
            const isOverLimit = c.current > c.target;
            return (
              <div key={c.canton} className={`p-2 rounded border ${isOverLimit ? 'border-red-500 bg-red-500/10' : 'border-border'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {c.canton}
                  </span>
                  <span className="text-xs font-mono">{c.current}/{c.target}</span>
                </div>
                <Progress value={(c.current / c.target) * 100} className={`h-1.5 ${isOverLimit ? '[&>div]:bg-red-500' : ''}`} />
                {isOverLimit && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    Over-saturated
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
