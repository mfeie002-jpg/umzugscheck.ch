/**
 * Partner Directory Table
 */

import { useState } from 'react';
import { Edit, Pause, Ban, Phone, Search, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatSwissCHF, formatSwissPercent } from '@/lib/swiss-number-format';
import type { Partner } from './types';

interface PartnerDirectoryProps {
  partners: Partner[];
  onEdit: (partner: Partner) => void;
  onPause: (partnerId: string) => void;
  onBan: (partnerId: string) => void;
}

const SERVICE_LABELS: Record<string, string> = {
  moving: 'Umzug',
  packing: 'Verpackung',
  cleaning: 'Reinigung',
  storage: 'Lagerung',
};

const STATUS_BADGES: Record<Partner['status'], { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  active: { label: 'Aktiv', variant: 'default' },
  probation: { label: 'Probezeit', variant: 'secondary' },
  paused: { label: 'Pausiert', variant: 'outline' },
  banned: { label: 'Gesperrt', variant: 'destructive' },
};

const CAPACITY_BADGES: Record<Partner['capacityStatus'], { label: string; className: string }> = {
  open: { label: 'Offen', className: 'bg-green-500/10 text-green-700 border-green-500' },
  limited: { label: 'Begrenzt', className: 'bg-yellow-500/10 text-yellow-700 border-yellow-500' },
  full: { label: 'Voll', className: 'bg-red-500/10 text-red-700 border-red-500' },
};

export function PartnerDirectory({ partners, onEdit, onPause, onBan }: PartnerDirectoryProps) {
  const [search, setSearch] = useState('');
  
  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.canton.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Partner-Verzeichnis</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Kanton</TableHead>
                <TableHead>Kapazität</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Preis-Tier</TableHead>
                <TableHead className="text-right">Accept %</TableHead>
                <TableHead className="text-right">Antwort</TableHead>
                <TableHead className="text-right">Dispute %</TableHead>
                <TableHead className="text-right">RPL</TableHead>
                <TableHead className="text-right">ROI</TableHead>
                <TableHead>Modell</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id} className={partner.status === 'banned' ? 'opacity-50' : ''}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{partner.canton}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={CAPACITY_BADGES[partner.capacityStatus].className}>
                      {CAPACITY_BADGES[partner.capacityStatus].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {partner.services.map(s => (
                        <Badge key={s} variant="outline" className="text-xs">
                          {SERVICE_LABELS[s]}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      partner.priceTier === 'premium' ? 'default' :
                      partner.priceTier === 'standard' ? 'secondary' : 'outline'
                    }>
                      {partner.priceTier}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatSwissPercent(partner.acceptanceRate / 100)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {partner.avgResponseMinutes} min
                  </TableCell>
                  <TableCell className={`text-right font-mono ${partner.disputeRate > 10 ? 'text-red-600' : partner.disputeRate > 5 ? 'text-yellow-600' : ''}`}>
                    {formatSwissPercent(partner.disputeRate / 100)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatSwissCHF(partner.avgRevenuePerLead)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {partner.partnerROI ? `${partner.partnerROI.toFixed(1)}x` : '—'}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs">
                      {partner.contractModel === 'cpl' && `CPL ${formatSwissCHF(partner.cplPrice || 0)}`}
                      {partner.contractModel === 'commission' && `${partner.commissionPercent}% Kom.`}
                      {partner.contractModel === 'hybrid' && 'Hybrid'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGES[partner.status].variant}>
                      {STATUS_BADGES[partner.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(partner)}>
                          <Edit className="h-4 w-4 mr-2" /> Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="h-4 w-4 mr-2" /> Quality Call
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Search className="h-4 w-4 mr-2" /> Mystery Shop
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onPause(partner.id)}>
                          <Pause className="h-4 w-4 mr-2" /> Pausieren
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onBan(partner.id)}
                          className="text-red-600"
                        >
                          <Ban className="h-4 w-4 mr-2" /> Sperren
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
