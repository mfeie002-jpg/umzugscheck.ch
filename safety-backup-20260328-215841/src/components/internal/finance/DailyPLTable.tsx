/**
 * Daily P&L Table - Last 30 days trend
 */

import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatSwissCHF } from '@/lib/swiss-number-format';
import type { DailyPLEntry } from './types';

interface DailyPLTableProps {
  entries: DailyPLEntry[];
}

export function DailyPLTable({ entries }: DailyPLTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Daily P&L Trend
        </CardTitle>
        <CardDescription>Letzte 30 Tage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto max-h-96">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">COGS</TableHead>
                <TableHead className="text-right">Ad Spend</TableHead>
                <TableHead className="text-right">Acq. Cost</TableHead>
                <TableHead className="text-right">CM2</TableHead>
                <TableHead className="text-right">Jobs</TableHead>
                <TableHead className="text-right">Mktplace</TableHead>
                <TableHead className="text-right">Net Cash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => {
                const isNegative = entry.netCashDelta < 0;
                return (
                  <TableRow 
                    key={index}
                    className={isNegative ? 'bg-red-500/10' : ''}
                  >
                    <TableCell className="font-mono text-xs">
                      {entry.date.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit' })}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatSwissCHF(entry.revenue, false)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">
                      -{formatSwissCHF(entry.cogs, false)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">
                      -{formatSwissCHF(entry.adSpend, false)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">
                      -{formatSwissCHF(entry.acquisitionCost, false)}
                    </TableCell>
                    <TableCell className={`text-right font-mono text-sm font-medium ${entry.cm2 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatSwissCHF(entry.cm2, false)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {entry.jobsCompleted}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatSwissCHF(entry.marketplaceRevenue, false)}
                    </TableCell>
                    <TableCell className={`text-right font-mono text-sm font-bold ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
                      {isNegative ? '' : '+'}{formatSwissCHF(entry.netCashDelta, false)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
