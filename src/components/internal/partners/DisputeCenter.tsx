/**
 * Dispute & Enforcement Center
 */

import { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Dispute } from './types';

interface DisputeCenterProps {
  disputes: Dispute[];
  platformDisputeRate: number;
  onUpdateOutcome: (disputeId: string, outcome: Dispute['outcome']) => void;
}

const ISSUE_TYPES: Record<Dispute['issueType'], string> = {
  bad_phone: 'Falsche Telefonnummer',
  fake_lead: 'Fake Lead',
  customer_unreachable: 'Kunde nicht erreichbar',
  not_moving: 'Kein Umzug geplant',
  pricing_complaint: 'Preisbeschwerde',
  quality_complaint: 'Qualitätsbeschwerde',
  disintermediation: 'Disintermediation-Versuch',
};

const OUTCOME_BADGES: Record<Dispute['outcome'], { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending: { label: 'Ausstehend', variant: 'outline' },
  refund_approved: { label: 'Rückerstattung', variant: 'secondary' },
  refund_denied: { label: 'Abgelehnt', variant: 'default' },
  partner_warned: { label: 'Verwarnt', variant: 'secondary' },
  partner_paused: { label: 'Pausiert', variant: 'destructive' },
  partner_banned: { label: 'Gesperrt', variant: 'destructive' },
};

export function DisputeCenter({ disputes, platformDisputeRate, onUpdateOutcome }: DisputeCenterProps) {
  const pendingDisputes = disputes.filter(d => d.outcome === 'pending');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Dispute & Enforcement Center
        </CardTitle>
        <CardDescription>Streitfälle, Rückerstattungen und Partner-Massnahmen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Platform-wide alert */}
        {platformDisputeRate > 5 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>🔴 KRITISCH: Platform Dispute Rate &gt; 5%</AlertTitle>
            <AlertDescription>
              Aktuelle Rate: {platformDisputeRate.toFixed(1)}%. 
              Marketplace-Distribution stoppen bis Qualität verbessert wird!
            </AlertDescription>
          </Alert>
        )}
        
        {/* Enforcement Rules */}
        <div className="p-3 bg-muted rounded-lg text-sm">
          <strong>Automatische Enforcement-Regeln:</strong>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>• Dispute-Rate &gt;15% (30 Tage) → Auto-Status: <Badge variant="secondary">Probezeit</Badge></li>
            <li>• Dispute-Rate &gt;20% ODER Disintermediation → <Badge variant="destructive">Gesperrt</Badge></li>
            <li>• Platform-weite Rate &gt;5% → <span className="text-red-600 font-medium">Marketplace pausieren</span></li>
          </ul>
        </div>
        
        {/* Pending count */}
        {pendingDisputes.length > 0 && (
          <div className="p-2 bg-yellow-500/10 border border-yellow-500 rounded text-sm text-yellow-700">
            {pendingDisputes.length} ausstehende Fälle zur Bearbeitung
          </div>
        )}
        
        {/* Disputes table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead ID</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Problem</TableHead>
                <TableHead>Rückerstattung</TableHead>
                <TableHead>Ergebnis</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Aktion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.slice(0, 20).map((dispute) => (
                <TableRow key={dispute.id}>
                  <TableCell className="font-mono text-xs">{dispute.leadId.slice(0, 8)}</TableCell>
                  <TableCell>{dispute.partnerName}</TableCell>
                  <TableCell>
                    <Badge variant={dispute.issueType === 'disintermediation' ? 'destructive' : 'outline'}>
                      {ISSUE_TYPES[dispute.issueType]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {dispute.refundRequested ? (
                      <Badge variant="secondary">Ja</Badge>
                    ) : (
                      <span className="text-muted-foreground">Nein</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={OUTCOME_BADGES[dispute.outcome].variant}>
                      {OUTCOME_BADGES[dispute.outcome].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {dispute.createdAt.toLocaleDateString('de-CH')}
                  </TableCell>
                  <TableCell>
                    {dispute.outcome === 'pending' && (
                      <Select
                        onValueChange={(value) => onUpdateOutcome(dispute.id, value as Dispute['outcome'])}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue placeholder="Entscheiden" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="refund_approved">Rückerstattung</SelectItem>
                          <SelectItem value="refund_denied">Ablehnen</SelectItem>
                          <SelectItem value="partner_warned">Verwarnen</SelectItem>
                          <SelectItem value="partner_paused">Pausieren</SelectItem>
                          <SelectItem value="partner_banned">Sperren</SelectItem>
                        </SelectContent>
                      </Select>
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
