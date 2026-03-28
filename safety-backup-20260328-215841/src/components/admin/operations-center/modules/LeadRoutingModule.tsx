/**
 * Lead Routing Module - Mobile First
 * Touch-friendly lead distribution view
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { BRAND_PORTFOLIO, getOptimalBrandForLead } from '@/lib/cherries-chaff/brands';
import { Phone, Clock, ChevronRight, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

// Mock recent leads
const mockLeads = [
  { id: 'L001', name: 'Müller', score: 78, value: 2800, isUrgent: false, isBudget: false, status: 'booked', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), phone: '+41 79 123 45 67' },
  { id: 'L002', name: 'Schmidt', score: 45, value: 1400, isUrgent: true, isBudget: false, status: 'quoted', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), phone: '+41 79 234 56 78' },
  { id: 'L003', name: 'Weber', score: 32, value: 950, isUrgent: false, isBudget: true, status: 'contacted', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), phone: '+41 79 345 67 89' },
  { id: 'L004', name: 'Fischer', score: 85, value: 3200, isUrgent: false, isBudget: false, status: 'pending', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), phone: '+41 79 456 78 90' },
  { id: 'L005', name: 'Meyer', score: 52, value: 1600, isUrgent: true, isBudget: false, status: 'booked', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), phone: '+41 79 567 89 01' },
  { id: 'L006', name: 'Huber', score: 28, value: 800, isUrgent: false, isBudget: true, status: 'lost', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), phone: '+41 79 678 90 12' },
  { id: 'L007', name: 'Keller', score: 67, value: 2100, isUrgent: false, isBudget: false, status: 'quoted', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), phone: '+41 79 789 01 23' },
  { id: 'L008', name: 'Brunner', score: 41, value: 1200, isUrgent: false, isBudget: false, status: 'contacted', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), phone: '+41 79 890 12 34' },
];

export function LeadRoutingModule() {
  const [filterBrand, setFilterBrand] = useState<string | null>(null);

  const leadsWithRouting = mockLeads.map(lead => ({
    ...lead,
    routedTo: getOptimalBrandForLead(lead.score, lead.value, lead.isUrgent, lead.isBudget),
  }));

  const filteredLeads = filterBrand 
    ? leadsWithRouting.filter(l => l.routedTo.id === filterBrand)
    : leadsWithRouting;

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
        return <Badge className="bg-green-600 text-white text-xs">Gebucht</Badge>;
      case 'quoted':
        return <Badge className="bg-primary text-primary-foreground text-xs">Offerte</Badge>;
      case 'contacted':
        return <Badge className="bg-yellow-600 text-white text-xs">Kontakt</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-xs">Pending</Badge>;
      case 'lost':
        return <Badge variant="destructive" className="text-xs">Verloren</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Brand Filter Cards - Horizontal scroll on mobile */}
      <ScrollArea className="w-full -mx-3 px-3 md:mx-0 md:px-0">
        <div className="flex gap-3 pb-2 md:grid md:grid-cols-3">
          {brandStats.map(({ brand, count, booked, pending }) => (
            <Card 
              key={brand.id}
              className={`cursor-pointer transition-all min-w-[200px] md:min-w-0 active:scale-[0.98] ${
                filterBrand === brand.id ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => setFilterBrand(filterBrand === brand.id ? null : brand.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2 h-12 rounded"
                    style={{ backgroundColor: brand.colorAccent }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{brand.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-bold">{count}</span>
                      <span className="text-xs text-muted-foreground">
                        {booked}✓ {pending}⏳
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="md:hidden" />
      </ScrollArea>

      {/* Routing Rules - Compact for mobile */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm">Routing-Logik</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="grid gap-2 md:grid-cols-3">
            <div className="p-2.5 bg-primary/10 rounded-lg border border-primary/20">
              <p className="font-medium text-xs text-primary">Feierabend</p>
              <p className="text-xs text-muted-foreground mt-0.5">Score ≥65 & ≥CHF 1'800</p>
            </div>
            <div className="p-2.5 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="font-medium text-xs text-destructive">Umzugexpress</p>
              <p className="text-xs text-muted-foreground mt-0.5">Urgent oder CHF 1'200-1'800</p>
            </div>
            <div className="p-2.5 bg-chart-1/10 rounded-lg border border-chart-1/20">
              <p className="font-medium text-xs" style={{ color: 'hsl(var(--chart-1))' }}>Zügelhelden</p>
              <p className="text-xs text-muted-foreground mt-0.5">Budget oder &lt;CHF 1'200</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead List - Mobile Card View */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Leads ({filteredLeads.length})</h3>
          {filterBrand && (
            <Button variant="ghost" size="sm" onClick={() => setFilterBrand(null)} className="h-8 text-xs">
              <X className="h-3 w-3 mr-1" />
              Filter
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-stretch">
                  {/* Color indicator */}
                  <div 
                    className="w-1.5 flex-shrink-0"
                    style={{ backgroundColor: lead.routedTo.colorAccent }}
                  />
                  
                  {/* Main content */}
                  <div className="flex-1 p-3 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{lead.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(lead.timestamp, { addSuffix: true, locale: de })}
                        </p>
                      </div>
                      {getStatusBadge(lead.status)}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant="outline" className={`
                        ${lead.score >= 65 ? 'border-green-500 text-green-700' : 
                          lead.score >= 40 ? 'border-yellow-500 text-yellow-700' : 
                          'border-muted-foreground'}
                      `}>
                        Score: {lead.score}
                      </Badge>
                      <span className="text-muted-foreground">CHF {lead.value.toLocaleString('de-CH')}</span>
                      {lead.isUrgent && <Badge variant="destructive" className="text-xs h-5">Urgent</Badge>}
                      {lead.isBudget && <Badge variant="outline" className="text-xs h-5">Budget</Badge>}
                      <span className="text-muted-foreground">→ {lead.routedTo.name.split(' ')[0]}</span>
                    </div>
                  </div>
                  
                  {/* Call button */}
                  <a 
                    href={`tel:${lead.phone}`}
                    className="flex items-center justify-center w-14 bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
