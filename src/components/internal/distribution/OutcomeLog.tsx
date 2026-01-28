/**
 * Outcome Log - Audit Trail
 */

import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatSwissCHF } from '@/lib/swiss-number-format';
import type { OutcomeRecord, RouteResult } from './types';

interface OutcomeLogProps {
  records: OutcomeRecord[];
}

const RESULT_BADGES: Record<RouteResult, { label: string; className: string }> = {
  feierabend: { label: 'Feierabend', className: 'bg-purple-500 text-white' },
  sold_to_partner: { label: 'Partner', className: 'bg-green-500 text-white' },
  budget_partner: { label: 'Budget', className: 'bg-gray-500 text-white' },
  rejected: { label: 'Rejected', className: 'bg-red-500 text-white' },
  unsold: { label: 'Unsold', className: 'bg-yellow-500 text-black' },
};

export function OutcomeLog({ records }: OutcomeLogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Outcome Log
          <Badge variant="secondary">{records.length}</Badge>
        </CardTitle>
        <CardDescription>Audit Trail für Routing-Entscheidungen</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead ID</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Route Result</TableHead>
                <TableHead>Partner angeboten</TableHead>
                <TableHead>Gewinner</TableHead>
                <TableHead className="text-right">Preis</TableHead>
                <TableHead>Zeit</TableHead>
                <TableHead>Notizen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono text-xs">{record.leadId.slice(0, 8)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">T{record.tier}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={RESULT_BADGES[record.routeResult].className}>
                      {RESULT_BADGES[record.routeResult].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {record.partnersOffered.length > 0 
                      ? record.partnersOffered.join(', ') 
                      : '—'}
                  </TableCell>
                  <TableCell className="font-medium">
                    {record.winningPartner || '—'}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {record.winningPrice ? formatSwissCHF(record.winningPrice) : '—'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {record.timestamp.toLocaleString('de-CH', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-32 truncate">
                    {record.notes || '—'}
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
