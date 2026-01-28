/**
 * Quality Protection & Auto Enforcement
 */

import { Shield, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface QualityMetrics {
  avgBidRate: number;
  platformDisputeRate: number;
  excludedPartners: { name: string; reason: string }[];
}

interface QualityProtectionProps {
  metrics: QualityMetrics;
}

export function QualityProtection({ metrics }: QualityProtectionProps) {
  const showPartnerFatigue = metrics.avgBidRate < 1.0;
  const showQualityRisk = metrics.platformDisputeRate > 3;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5" />
          Quality Protection
        </CardTitle>
        <CardDescription>Automatische Guardrails und Enforcement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Warning Banners */}
        {showPartnerFatigue && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Partner Fatigue Detected</AlertTitle>
            <AlertDescription>
              Durchschnittliche Bid Rate ({metrics.avgBidRate.toFixed(2)}) unter 1.0. 
              Partner zeigen weniger Interesse. Lead-Qualität prüfen oder Preise senken.
            </AlertDescription>
          </Alert>
        )}
        
        {showQualityRisk && (
          <Alert className="border-yellow-500 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-700">Quality Risk</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Dispute Rate ({metrics.platformDisputeRate.toFixed(1)}%) steigt. 
              Lead-Qualifikation verschärfen.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Auto-Exclusion Rules */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium text-sm mb-3">Auto-Exclusion Regeln</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Dispute Rate &gt;15% → Partner auf Probation/Banned
            </li>
            <li className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Acceptance Rate &lt;20% → Partner als unzuverlässig markiert
            </li>
            <li className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Antwortzeit &gt;SLA (häufig) → Automatische Herabstufung
            </li>
          </ul>
        </div>
        
        {/* Excluded Partners */}
        {metrics.excludedPartners.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Aktuell ausgeschlossen</h4>
            <div className="space-y-2">
              {metrics.excludedPartners.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-red-500/10 rounded border border-red-500/30">
                  <span className="text-sm">{p.name}</span>
                  <Badge variant="outline" className="text-xs">{p.reason}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!showPartnerFatigue && !showQualityRisk && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Alle Qualitäts-Checks bestanden</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
