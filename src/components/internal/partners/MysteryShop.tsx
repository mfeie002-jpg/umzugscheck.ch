/**
 * Mystery Shop Module
 */

import { Search, AlertTriangle, CheckCircle, XCircle, Ban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { MysteryShopResult } from './types';

interface MysteryShopProps {
  results: MysteryShopResult[];
  sampleRate: number;
  onSampleRateChange: (rate: number) => void;
}

const RESULT_CONFIG: Record<MysteryShopResult['result'], { label: string; icon: React.ReactNode; className: string }> = {
  clean: { label: 'Sauber', icon: <CheckCircle className="h-4 w-4" />, className: 'bg-green-500/10 text-green-700 border-green-500' },
  leakage: { label: 'Leakage!', icon: <Ban className="h-4 w-4" />, className: 'bg-red-500/10 text-red-700 border-red-500' },
  unprofessional: { label: 'Unprofessionell', icon: <AlertTriangle className="h-4 w-4" />, className: 'bg-yellow-500/10 text-yellow-700 border-yellow-500' },
  hidden_fees: { label: 'Versteckte Kosten', icon: <XCircle className="h-4 w-4" />, className: 'bg-orange-500/10 text-orange-700 border-orange-500' },
};

export function MysteryShop({ results, sampleRate, onSampleRateChange }: MysteryShopProps) {
  const leakageAttempts = results.filter(r => r.result === 'leakage');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Mystery Shop Module
        </CardTitle>
        <CardDescription>Leakage-Schutz und Qualitätskontrolle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Leakage Alert */}
        {leakageAttempts.length > 0 && (
          <Alert variant="destructive">
            <Ban className="h-4 w-4" />
            <AlertDescription>
              🚨 {leakageAttempts.length} Leakage-Versuch(e) erkannt! 
              Sofortige Sperrung empfohlen für: {leakageAttempts.map(l => l.partnerName).join(', ')}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Sample Rate Setting */}
        <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
          <div className="flex-1">
            <Label htmlFor="sampleRate">Stichproben-Rate (%)</Label>
            <p className="text-xs text-muted-foreground">Anteil der Leads, die getestet werden</p>
          </div>
          <Input
            id="sampleRate"
            type="number"
            min={0}
            max={100}
            value={sampleRate}
            onChange={(e) => onSampleRateChange(parseInt(e.target.value) || 10)}
            className="w-20"
          />
        </div>
        
        {/* Results table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Ergebnis</TableHead>
                <TableHead>Notizen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.slice(0, 15).map((result) => {
                const config = RESULT_CONFIG[result.result];
                return (
                  <TableRow key={result.id}>
                    <TableCell className="text-sm">
                      {result.date.toLocaleDateString('de-CH')}
                    </TableCell>
                    <TableCell className="font-medium">{result.partnerName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`gap-1 ${config.className}`}>
                        {config.icon}
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {result.notes}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Auto-action rules */}
        <div className="p-3 bg-muted rounded-lg text-sm">
          <strong>Auto-Aktionen:</strong>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>• <span className="text-red-600">Leakage-Versuch</span> → Sofortige Sperrung empfohlen</li>
            <li>• <span className="text-yellow-600">Unprofessionell</span> → Verwarnung + Quality Call</li>
            <li>• <span className="text-orange-600">Versteckte Kosten</span> → Verwarnung</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
