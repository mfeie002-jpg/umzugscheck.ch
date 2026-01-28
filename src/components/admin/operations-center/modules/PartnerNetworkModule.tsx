/**
 * Partner Network Module
 * Marketplace partner health and status
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Users, Star, Clock, AlertTriangle, CheckCircle, Ban, TrendingUp } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  region: string;
  rating: number;
  responseTime: number; // minutes
  acceptRate: number;
  disputeRate: number;
  leadsReceived: number;
  leadsWon: number;
  revenue: number;
  status: 'active' | 'probation' | 'banned';
}

const mockPartners: Partner[] = [
  { id: 'P1', name: 'Müller Umzüge AG', region: 'Zürich', rating: 4.8, responseTime: 45, acceptRate: 85, disputeRate: 2, leadsReceived: 24, leadsWon: 8, revenue: 14400, status: 'active' },
  { id: 'P2', name: 'Bern Express GmbH', region: 'Bern', rating: 4.5, responseTime: 90, acceptRate: 72, disputeRate: 5, leadsReceived: 18, leadsWon: 5, revenue: 8500, status: 'active' },
  { id: 'P3', name: 'Basel Movers', region: 'Basel', rating: 4.2, responseTime: 120, acceptRate: 65, disputeRate: 12, leadsReceived: 15, leadsWon: 3, revenue: 4200, status: 'probation' },
  { id: 'P4', name: 'Luzerner Zügelteam', region: 'Luzern', rating: 4.7, responseTime: 60, acceptRate: 78, disputeRate: 3, leadsReceived: 12, leadsWon: 4, revenue: 6800, status: 'active' },
  { id: 'P5', name: 'Aargau Transport', region: 'Aargau', rating: 3.9, responseTime: 180, acceptRate: 55, disputeRate: 18, leadsReceived: 8, leadsWon: 1, revenue: 1200, status: 'probation' },
];

export function PartnerNetworkModule() {
  const activePartners = mockPartners.filter(p => p.status === 'active').length;
  const probationPartners = mockPartners.filter(p => p.status === 'probation').length;
  const avgFillRate = mockPartners.reduce((sum, p) => sum + p.acceptRate, 0) / mockPartners.length;
  const avgDisputeRate = mockPartners.reduce((sum, p) => sum + p.disputeRate, 0) / mockPartners.length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Aktiv</Badge>;
      case 'probation':
        return <Badge className="bg-yellow-500">Probation</Badge>;
      case 'banned':
        return <Badge variant="destructive">Gesperrt</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Aktive Partner</p>
                <p className="text-2xl font-bold">{activePartners}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={probationPartners > 0 ? 'border-yellow-500' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`h-8 w-8 ${probationPartners > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm text-muted-foreground">Auf Probation</p>
                <p className="text-2xl font-bold">{probationPartners}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Ø Fill Rate</p>
                <p className="text-2xl font-bold">{avgFillRate.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={avgDisputeRate > 5 ? 'border-destructive' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Ban className={`h-8 w-8 ${avgDisputeRate > 5 ? 'text-destructive' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm text-muted-foreground">Ø Dispute Rate</p>
                <p className="text-2xl font-bold">{avgDisputeRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scarcity Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Scarcity-Regeln nach Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Zürich</p>
              <p className="text-2xl font-bold">1/5</p>
              <p className="text-xs text-muted-foreground">Max. 5-7 Partner</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Zug/Aargau</p>
              <p className="text-2xl font-bold">1/3</p>
              <p className="text-xs text-muted-foreground">Max. 2-3 Partner</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Bern/Basel</p>
              <p className="text-2xl font-bold">2/3</p>
              <p className="text-xs text-muted-foreground">Max. 3 Partner</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Luzern</p>
              <p className="text-2xl font-bold">1/2</p>
              <p className="text-xs text-muted-foreground">Max. 2 Partner</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partner Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Partner-Übersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Accept %</TableHead>
                <TableHead>Dispute %</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{partner.region}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      {partner.rating}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {partner.responseTime} min
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={partner.acceptRate >= 70 ? 'secondary' : 'outline'}>
                      {partner.acceptRate}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      partner.disputeRate > 15 ? 'destructive' :
                      partner.disputeRate > 10 ? 'secondary' : 'outline'
                    }>
                      {partner.disputeRate}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {partner.leadsWon}/{partner.leadsReceived}
                  </TableCell>
                  <TableCell>
                    CHF {partner.revenue.toLocaleString('de-CH')}
                  </TableCell>
                  <TableCell>{getStatusBadge(partner.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Enforcement Rules */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Automatische Enforcement-Regeln</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-yellow-500/10 rounded border border-yellow-500/20">
              <p className="font-medium">Probation</p>
              <p className="text-muted-foreground">Dispute Rate &gt;15%</p>
            </div>
            <div className="p-3 bg-destructive/10 rounded border border-destructive/20">
              <p className="font-medium">Auto-Ban</p>
              <p className="text-muted-foreground">Dispute Rate &gt;20% oder Disintermediation</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
              <p className="font-medium">Mystery Shop</p>
              <p className="text-muted-foreground">10% aller Leads werden geprüft</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
