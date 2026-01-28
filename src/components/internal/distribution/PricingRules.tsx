/**
 * Pricing & Contract Rules Panel
 */

import { DollarSign, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatSwissCHF } from '@/lib/swiss-number-format';
import type { PricingRule } from './types';

interface PricingRulesProps {
  rules: PricingRule[];
}

const CONTRACT_LABELS: Record<string, string> = {
  cpl: 'CPL Fixed',
  commission: 'Commission',
  hybrid: 'Hybrid',
};

export function PricingRules({ rules }: PricingRulesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="h-5 w-5" />
          Pricing & Contract Rules
        </CardTitle>
        <CardDescription>Vertragsmodelle und Preisregeln</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Anti-Race-to-Bottom:</strong> Max 3 Partner pro Lead um Flooding zu vermeiden.
            Mindestkommission für Premium Leads: 15% empfohlen.
          </AlertDescription>
        </Alert>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Vertragsmodell</TableHead>
                <TableHead className="text-right">CPL Preis</TableHead>
                <TableHead className="text-right">Kommission %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.partnerId}>
                  <TableCell className="font-medium">{rule.partnerName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{CONTRACT_LABELS[rule.contractType]}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {rule.cplPrice ? formatSwissCHF(rule.cplPrice) : '—'}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {rule.commissionPercent ? `${rule.commissionPercent}%` : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-3 bg-muted rounded-lg text-sm">
          <strong>Empfehlungen:</strong>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>• CPL Fixed: Für Budget- und Standard-Partner</li>
            <li>• Commission: Für Premium-Partner mit hoher Abschlussrate</li>
            <li>• Hybrid: Kombiniert Basis-CPL + Erfolgskommission</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
