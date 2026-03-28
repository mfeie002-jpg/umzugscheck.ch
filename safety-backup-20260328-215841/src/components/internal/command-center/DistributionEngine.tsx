/**
 * Distribution & Auction Engine Panel
 */

import { useState } from 'react';
import { Shuffle, Gavel, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatSwissCHF } from '@/lib/swiss-number-format';

type DistributionMode = 'round_robin' | 'weighted' | 'auction' | 'manual';

interface Lead {
  id: string;
  tier: 1 | 2 | 3;
  score: number;
  estValue: number;
  status: 'new' | 'offered' | 'accepted' | 'sold';
}

interface Bid {
  partner: string;
  amount: number;
  speedBonus: number;
  disputePenalty: number;
  finalScore: number;
}

const MOCK_LEADS: Lead[] = [
  { id: 'L-001', tier: 1, score: 78, estValue: 3200, status: 'new' },
  { id: 'L-002', tier: 2, score: 52, estValue: 2100, status: 'offered' },
  { id: 'L-003', tier: 2, score: 45, estValue: 1800, status: 'accepted' },
  { id: 'L-004', tier: 3, score: 22, estValue: 950, status: 'new' },
];

const MOCK_BIDS: Bid[] = [
  { partner: 'Müller Transport', amount: 55, speedBonus: 5, disputePenalty: -2, finalScore: 58 },
  { partner: 'Züri Move AG', amount: 48, speedBonus: 8, disputePenalty: 0, finalScore: 56 },
  { partner: 'Swiss Umzüge', amount: 52, speedBonus: 3, disputePenalty: -5, finalScore: 50 },
];

export function DistributionEngine() {
  const [mode, setMode] = useState<DistributionMode>('round_robin');
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  
  const getTierBadge = (tier: 1 | 2 | 3) => {
    switch (tier) {
      case 1: return <Badge className="bg-green-500 text-xs">T1</Badge>;
      case 2: return <Badge className="bg-yellow-500 text-black text-xs">T2</Badge>;
      case 3: return <Badge variant="destructive" className="text-xs">T3</Badge>;
    }
  };
  
  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'new': return <Badge variant="outline" className="text-xs">New</Badge>;
      case 'offered': return <Badge className="bg-blue-500 text-xs">Offered</Badge>;
      case 'accepted': return <Badge className="bg-green-500 text-xs">Accepted</Badge>;
      case 'sold': return <Badge className="bg-purple-500 text-xs">Sold</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shuffle className="h-4 w-4" />
            Distribution Engine
          </CardTitle>
          <Select value={mode} onValueChange={(v: DistributionMode) => setMode(v)}>
            <SelectTrigger className="w-40 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="round_robin">Round Robin</SelectItem>
              <SelectItem value="weighted">Weighted</SelectItem>
              <SelectItem value="auction">Premium Auction</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        {/* Lead Inbox */}
        <div className="border rounded">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="w-20">Lead</TableHead>
                <TableHead className="w-12">Tier</TableHead>
                <TableHead className="w-14">Score</TableHead>
                <TableHead className="w-20">Est. Value</TableHead>
                <TableHead className="w-16">Status</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_LEADS.map((lead) => (
                <TableRow key={lead.id} className="text-xs">
                  <TableCell className="font-mono">{lead.id}</TableCell>
                  <TableCell>{getTierBadge(lead.tier)}</TableCell>
                  <TableCell className="font-mono">{lead.score}</TableCell>
                  <TableCell className="font-mono">{formatSwissCHF(lead.estValue)}</TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={selectedLead === lead.id ? 'default' : 'outline'}
                      className="h-5 text-xs px-2"
                      onClick={() => setSelectedLead(lead.id === selectedLead ? null : lead.id)}
                    >
                      {lead.tier === 1 ? 'Auction' : 'Offer'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Premium Auction Panel */}
        {selectedLead && mode === 'auction' && (
          <div className="p-2 bg-muted rounded space-y-2">
            <div className="flex items-center gap-2">
              <Gavel className="h-4 w-4" />
              <span className="text-xs font-medium">Premium Auction - {selectedLead}</span>
              <Badge variant="outline" className="text-xs">Reserve: CHF 45</Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead>Partner</TableHead>
                  <TableHead className="text-right">Bid</TableHead>
                  <TableHead className="text-right">Speed</TableHead>
                  <TableHead className="text-right">Dispute</TableHead>
                  <TableHead className="text-right">Final</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_BIDS.map((bid, i) => (
                  <TableRow key={bid.partner} className="text-xs">
                    <TableCell className="font-medium">
                      {i === 0 && <CheckCircle className="h-3 w-3 text-green-500 inline mr-1" />}
                      {bid.partner}
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatSwissCHF(bid.amount)}</TableCell>
                    <TableCell className="text-right font-mono text-green-600">+{bid.speedBonus}</TableCell>
                    <TableCell className="text-right font-mono text-red-600">{bid.disputePenalty}</TableCell>
                    <TableCell className={`text-right font-mono font-bold ${i === 0 ? 'text-green-600' : ''}`}>
                      {bid.finalScore}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
