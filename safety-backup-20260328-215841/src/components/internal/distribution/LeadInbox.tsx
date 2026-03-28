/**
 * Lead Inbox - Incoming Leads Queue
 */

import { useState } from 'react';
import { Inbox, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatSwissCHF } from '@/lib/swiss-number-format';
import type { IncomingLead, LeadTier, LeadStatus } from './types';

interface LeadInboxProps {
  leads: IncomingLead[];
  onSelectLead: (lead: IncomingLead) => void;
  selectedLeadId: string | null;
}

const CHANNEL_LABELS: Record<string, string> = {
  google: 'Google Ads',
  meta: 'Meta',
  organic: 'Organic',
  referral: 'Referral',
};

const STATUS_BADGES: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: 'Neu', className: 'bg-blue-500/10 text-blue-700 border-blue-500' },
  offered: { label: 'Angeboten', className: 'bg-yellow-500/10 text-yellow-700 border-yellow-500' },
  pending: { label: 'Pending', className: 'bg-orange-500/10 text-orange-700 border-orange-500' },
  accepted: { label: 'Akzeptiert', className: 'bg-green-500/10 text-green-700 border-green-500' },
  sold: { label: 'Verkauft', className: 'bg-emerald-500/10 text-emerald-700 border-emerald-500' },
  routed_feierabend: { label: 'Feierabend', className: 'bg-purple-500/10 text-purple-700 border-purple-500' },
  rejected: { label: 'Abgelehnt', className: 'bg-red-500/10 text-red-700 border-red-500' },
  unsold: { label: 'Unverkauft', className: 'bg-gray-500/10 text-gray-700 border-gray-500' },
};

const TIER_BADGES: Record<LeadTier, { label: string; className: string }> = {
  1: { label: 'Tier 1', className: 'bg-emerald-500 text-white' },
  2: { label: 'Tier 2', className: 'bg-blue-500 text-white' },
  3: { label: 'Tier 3', className: 'bg-gray-500 text-white' },
};

export function LeadInbox({ leads, onSelectLead, selectedLeadId }: LeadInboxProps) {
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const monthEnd = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const filteredLeads = leads.filter(lead => {
    if (tierFilter !== 'all' && lead.tier !== parseInt(tierFilter)) return false;
    
    if (urgencyFilter !== 'all') {
      const moveDate = new Date(lead.moveDate);
      if (urgencyFilter === 'today' && moveDate > today) return false;
      if (urgencyFilter === 'week' && moveDate > weekEnd) return false;
      if (urgencyFilter === 'month' && moveDate > monthEnd) return false;
    }
    
    if (serviceFilter !== 'all' && !lead.services.includes(serviceFilter as 'packing' | 'montage' | 'cleaning')) {
      return false;
    }
    
    return true;
  });
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5" />
            Lead Inbox
            <Badge variant="secondary">{filteredLeads.length}</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-24 h-8">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="1">Tier 1</SelectItem>
                <SelectItem value="2">Tier 2</SelectItem>
                <SelectItem value="3">Tier 3</SelectItem>
              </SelectContent>
            </Select>
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-28 h-8">
                <SelectValue placeholder="Dringend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="today">Heute</SelectItem>
                <SelectItem value="week">Diese Woche</SelectItem>
                <SelectItem value="month">Diesen Monat</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-28 h-8">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="packing">Verpackung</SelectItem>
                <SelectItem value="montage">Montage</SelectItem>
                <SelectItem value="cleaning">Reinigung</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Lead ID</TableHead>
                <TableHead>Zeit</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Zimmer</TableHead>
                <TableHead className="text-right">Distanz</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Umzugsdatum</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead className="text-right">Wert</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow 
                  key={lead.id}
                  className={selectedLeadId === lead.id ? 'bg-primary/5' : ''}
                >
                  <TableCell className="font-mono text-xs">{lead.id.slice(0, 8)}</TableCell>
                  <TableCell className="text-xs">
                    {lead.timestamp.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell className="text-xs">{CHANNEL_LABELS[lead.channel]}</TableCell>
                  <TableCell className="text-right font-mono">{lead.rooms}</TableCell>
                  <TableCell className="text-right font-mono">{lead.distanceKm} km</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {lead.services.map(s => (
                        <Badge key={s} variant="outline" className="text-xs">
                          {s === 'packing' ? 'P' : s === 'montage' ? 'M' : 'C'}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {lead.moveDate.toLocaleDateString('de-CH')}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-mono font-bold ${
                      lead.score >= 60 ? 'text-green-600' : 
                      lead.score >= 30 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {lead.score}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={TIER_BADGES[lead.tier].className}>
                      {TIER_BADGES[lead.tier].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatSwissCHF(lead.estimatedValueCHF)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_BADGES[lead.status].className}>
                      {STATUS_BADGES[lead.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {lead.status === 'new' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onSelectLead(lead)}
                      >
                        Route
                      </Button>
                    )}
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
