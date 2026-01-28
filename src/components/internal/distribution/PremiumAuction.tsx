/**
 * Premium Auction Module
 */

import { useState } from 'react';
import { Gavel, Trophy, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatSwissCHF } from '@/lib/swiss-number-format';
import type { PartnerBid, AuctionConfig, IncomingLead } from './types';

interface PremiumAuctionProps {
  selectedLead: IncomingLead | null;
  bids: PartnerBid[];
  config: AuctionConfig;
  onConfigChange: (config: AuctionConfig) => void;
  onSelectWinner: (partnerId: string) => void;
}

function calculateFinalScore(bid: PartnerBid): number {
  // Winner Score = Bid + Speed Bonus - Dispute Penalty
  const speedBonus = Math.max(0, 30 - bid.responseMinutes); // Up to 30 points for fast response
  const disputePenalty = bid.disputeRiskScore * 10; // Penalty based on dispute risk
  return bid.bidAmountCHF + speedBonus - disputePenalty;
}

export function PremiumAuction({ selectedLead, bids, config, onConfigChange, onSelectWinner }: PremiumAuctionProps) {
  const sortedBids = [...bids]
    .map(b => ({ ...b, finalScore: calculateFinalScore(b) }))
    .sort((a, b) => b.finalScore - a.finalScore);
  
  const winner = sortedBids[0];
  const hasWinner = winner && winner.bidAmountCHF >= config.reservePriceCHF;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gavel className="h-5 w-5" />
          Premium Auction
        </CardTitle>
        <CardDescription>Für Tier 1 Overflow und optionale Tier 2 Leads</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Auction Config */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="reserve">Reserve Price (CHF)</Label>
            <Input
              id="reserve"
              type="number"
              value={config.reservePriceCHF}
              onChange={(e) => onConfigChange({ ...config, reservePriceCHF: parseInt(e.target.value) || 40 })}
            />
            <p className="text-xs text-muted-foreground mt-1">Mindestgebot</p>
          </div>
          <div>
            <Label htmlFor="duration">Auktionsdauer (Min)</Label>
            <Input
              id="duration"
              type="number"
              value={config.durationMinutes}
              onChange={(e) => onConfigChange({ ...config, durationMinutes: parseInt(e.target.value) || 30 })}
            />
          </div>
          <div className="flex items-center justify-between pt-6">
            <Label htmlFor="quality">Quality Minimum</Label>
            <Switch
              id="quality"
              checked={config.qualityMinimum}
              onCheckedChange={(checked) => onConfigChange({ ...config, qualityMinimum: checked })}
            />
          </div>
        </div>
        
        {config.qualityMinimum && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Partner mit Dispute Rate &gt;15% werden ausgeschlossen
            </AlertDescription>
          </Alert>
        )}
        
        {/* Bid Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Partner</TableHead>
                <TableHead className="text-right">Gebot (CHF)</TableHead>
                <TableHead className="text-right">Antwortzeit</TableHead>
                <TableHead className="text-right">Accept %</TableHead>
                <TableHead className="text-right">Dispute Risk</TableHead>
                <TableHead className="text-right">Final Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBids.map((bid, index) => (
                <TableRow 
                  key={bid.partnerId}
                  className={index === 0 && hasWinner ? 'bg-green-500/10' : ''}
                >
                  <TableCell>
                    {index === 0 && hasWinner && <Trophy className="h-4 w-4 text-yellow-500" />}
                  </TableCell>
                  <TableCell className="font-medium">{bid.partnerName}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatSwissCHF(bid.bidAmountCHF)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Clock className="h-3 w-3" />
                      {bid.responseMinutes} min
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {(bid.acceptanceProbability * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={bid.disputeRiskScore > 1 ? 'destructive' : 'outline'}>
                      {bid.disputeRiskScore.toFixed(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold">
                    {bid.finalScore.toFixed(0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Winner Section */}
        {sortedBids.length > 0 && (
          <div className={`p-4 rounded-lg border ${hasWinner ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
            {hasWinner ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">🏆 Gewinner: {winner.partnerName}</p>
                  <p className="text-xs text-muted-foreground">
                    Gebot: {formatSwissCHF(winner.bidAmountCHF)} | Score: {winner.finalScore.toFixed(0)}
                  </p>
                </div>
                <Button onClick={() => onSelectWinner(winner.partnerId)}>
                  Zuweisen
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-red-700">Kein Gewinner — Reserve Price nicht erreicht</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Höchstes Gebot: {formatSwissCHF(winner?.bidAmountCHF || 0)} | Reserve: {formatSwissCHF(config.reservePriceCHF)}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm">Budget Partner</Button>
                  <Button variant="outline" size="sm">Als unsold markieren</Button>
                  <Button variant="outline" size="sm">Founder benachrichtigen</Button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Scoring Formula */}
        <div className="p-3 bg-muted rounded-lg text-xs text-muted-foreground">
          <strong>Winner Score Formel:</strong>
          <code className="block mt-1">
            Score = Gebot + Speed Bonus (max 30) - Dispute Penalty (risk × 10)
          </code>
        </div>
      </CardContent>
    </Card>
  );
}
