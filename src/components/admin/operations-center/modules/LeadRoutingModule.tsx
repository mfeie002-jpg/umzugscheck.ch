/**
 * Lead Routing Module
 * Real-time view of lead distribution across brands
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BRAND_PORTFOLIO, getOptimalBrandForLead } from '@/lib/cherries-chaff/brands';
import { ArrowRight, Filter, Clock, CheckCircle, XCircle, Phone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

// Mock recent leads
const mockLeads = [
  { id: 'L001', score: 78, value: 2800, isUrgent: false, isBudget: false, status: 'booked', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: 'L002', score: 45, value: 1400, isUrgent: true, isBudget: false, status: 'quoted', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
  { id: 'L003', score: 32, value: 950, isUrgent: false, isBudget: true, status: 'contacted', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) },
  { id: 'L004', score: 85, value: 3200, isUrgent: false, isBudget: false, status: 'pending', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
  { id: 'L005', score: 52, value: 1600, isUrgent: true, isBudget: false, status: 'booked', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) },
  { id: 'L006', score: 28, value: 800, isUrgent: false, isBudget: true, status: 'lost', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) },
  { id: 'L007', score: 67, value: 2100, isUrgent: false, isBudget: false, status: 'quoted', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  { id: 'L008', score: 41, value: 1200, isUrgent: false, isBudget: false, status: 'contacted', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
];

export function LeadRoutingModule() {
  const [filterBrand, setFilterBrand] = useState<string | null>(null);

  // Calculate routing for each lead
  const leadsWithRouting = mockLeads.map(lead => ({
    ...lead,
    routedTo: getOptimalBrandForLead(lead.score, lead.value, lead.isUrgent, lead.isBudget),
  }));

  const filteredLeads = filterBrand 
    ? leadsWithRouting.filter(l => l.routedTo.id === filterBrand)
    : leadsWithRouting;

  // Stats by brand
  const brandStats = BRAND_PORTFOLIO.map(brand => {
    const brandLeads = leadsWithRouting.filter(l => l.routedTo.id === brand.id);
    return {
      brand,
      count: brandLeads.length,
      booked: brandLeads.filter(l => l.status === 'booked').length,
      pending: brandLeads.filter(l => l.status === 'pending' || l.status === 'contacted' || l.status === 'quoted').length,
    };
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'booked':
        return <Badge className="bg-green-500">Gebucht</Badge>;
      case 'quoted':
        return <Badge className="bg-blue-500">Offerte</Badge>;
      case 'contacted':
        return <Badge className="bg-yellow-500">Kontaktiert</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'lost':
        return <Badge variant="destructive">Verloren</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Routing Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        {brandStats.map(({ brand, count, booked, pending }) => (
          <Card 
            key={brand.id}
            className={`cursor-pointer transition-all ${
              filterBrand === brand.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setFilterBrand(filterBrand === brand.id ? null : brand.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-12 rounded"
                  style={{ backgroundColor: brand.colorAccent }}
                />
                <div className="flex-1">
                  <p className="font-medium">{brand.name}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-2xl font-bold">{count}</span>
                    <span className="text-sm text-muted-foreground">
                      {booked} gebucht • {pending} offen
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Routing Rules Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Routing-Logik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="font-medium text-blue-700">Feierabend (Premium)</p>
              <p className="text-muted-foreground mt-1">
                Score ≥65 & Wert ≥CHF 1'800
              </p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="font-medium text-red-700">Umzugexpress (Speed)</p>
              <p className="text-muted-foreground mt-1">
                Urgent Leads oder Wert CHF 1'200-1'800
              </p>
            </div>
            <div className="p-3 bg-teal-500/10 rounded-lg border border-teal-500/20">
              <p className="font-medium text-teal-700">Zügelhelden (Value)</p>
              <p className="text-muted-foreground mt-1">
                Budget-sensitiv oder Wert &lt;CHF 1'200
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Aktuelle Leads ({filteredLeads.length})</CardTitle>
            {filterBrand && (
              <Button variant="ghost" size="sm" onClick={() => setFilterBrand(null)}>
                Filter zurücksetzen
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Wert</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Routing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Zeit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-mono text-sm">{lead.id}</TableCell>
                  <TableCell>
                    <Badge variant={
                      lead.score >= 65 ? 'default' :
                      lead.score >= 40 ? 'secondary' : 'outline'
                    }>
                      {lead.score}
                    </Badge>
                  </TableCell>
                  <TableCell>CHF {lead.value.toLocaleString('de-CH')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {lead.isUrgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                      {lead.isBudget && <Badge variant="outline" className="text-xs">Budget</Badge>}
                      {!lead.isUrgent && !lead.isBudget && <span className="text-muted-foreground">-</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: lead.routedTo.colorAccent }}
                      />
                      <span className="text-sm">{lead.routedTo.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(lead.timestamp, { addSuffix: true, locale: de })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
