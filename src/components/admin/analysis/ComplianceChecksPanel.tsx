import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, FileCheck, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface ComplianceCheck {
  name: string;
  description: string;
  rule: string;
  validation: string;
  severity: 'critical' | 'warning' | 'info';
}

const COMPLIANCE_CHECKS: ComplianceCheck[] = [
  {
    name: 'Abnahmegarantie-Timing',
    description: 'Reinigung max. 48h vor Übergabetermin',
    rule: 'Garantie gilt nur bei ≤3 Tagen zwischen Reinigung und Übergabe',
    validation: 'System warnt bei >3 Tagen Differenz',
    severity: 'critical'
  },
  {
    name: '15-Meter Zufahrtsregel',
    description: 'Max. Distanz LKW zu Hauseingang',
    rule: 'ASTAG definiert "normale Zufahrt" als max. 15m',
    validation: 'Automatische Tragezeit-Zuschlag-Berechnung',
    severity: 'warning'
  },
  {
    name: 'LKW-Zufahrt Validierung',
    description: 'Bestätigung der Straßenbreite für LKW',
    rule: 'Nutzer muss Zufahrt für 3.5t oder 18t bestätigen',
    validation: 'Google Maps Satellite API Check',
    severity: 'warning'
  },
  {
    name: 'Versicherungsdeckung',
    description: 'Ausreichende Deckung für Inventarwert',
    rule: 'System schätzt Inventarwert und empfiehlt Aufstockung',
    validation: 'Automatischer Vergleich mit Standard-Deckung',
    severity: 'info'
  },
  {
    name: 'Spezialgut-Erkennung',
    description: 'Klavier, Tresor, Kunstwerke identifizieren',
    rule: 'Spezialtransporte erfordern zertifizierte Partner',
    validation: 'KI-basierte Erkennung im Video-Upload',
    severity: 'critical'
  }
];

const ABNAHME_FLOW = [
  { step: 1, action: 'Nutzer wählt "Reinigung mit Garantie"' },
  { step: 2, action: 'System fragt offiziellen Übergabetermin ab' },
  { step: 3, action: 'Validierung: Reinigungsdatum ≤ 48h vor Übergabe' },
  { step: 4, action: 'Bei Abweichung: Warnung + Terminvorschlag' },
  { step: 5, action: 'Partner garantiert Nachbesserung bis Abnahme' }
];

export const ComplianceChecksPanel: React.FC = () => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'bg-blue-500/10 border-blue-500/30';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Compliance & Rechtliche Sicherheit
        </CardTitle>
        <CardDescription>
          Integration von ASTAG-Regelungen und Abnahmegarantie-Logik
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Compliance Checks Grid */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-primary" />
            Automatische Compliance-Prüfungen
          </h4>
          <div className="space-y-2">
            {COMPLIANCE_CHECKS.map((check) => (
              <div 
                key={check.name}
                className={`p-3 rounded-lg border ${getSeverityColor(check.severity)}`}
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(check.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{check.name}</span>
                      <Badge 
                        variant={check.severity === 'critical' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {check.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {check.description}
                    </p>
                    <div className="mt-2 p-2 bg-background/50 rounded text-xs">
                      <span className="font-medium">Regel:</span> {check.rule}
                      <br />
                      <span className="font-medium">Validierung:</span> {check.validation}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Abnahmegarantie Flow */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Abnahmegarantie-Flow
          </h4>
          <div className="relative pl-6 space-y-3">
            {ABNAHME_FLOW.map((item, idx) => (
              <div key={item.step} className="relative">
                {/* Vertical line */}
                {idx < ABNAHME_FLOW.length - 1 && (
                  <div className="absolute left-[-18px] top-6 w-0.5 h-full bg-border" />
                )}
                {/* Step circle */}
                <div className="absolute left-[-24px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">
                    {item.step}
                  </span>
                </div>
                {/* Content */}
                <div className="p-2 bg-muted/30 rounded-md ml-2">
                  <p className="text-sm">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Box */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm text-amber-700">
                System-Warnung bei Abweichung
              </h4>
              <p className="text-xs text-amber-600/80 mt-1">
                "Achtung: Um die Abnahmegarantie zu gewährleisten, empfehlen wir 
                eine Reinigung maximal 48 Stunden vor Übergabe. Ihr aktueller Termin 
                liegt {'>'}3 Tage vor der Übergabe."
              </p>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline" className="text-xs">
            <Shield className="h-3 w-3 mr-1" />
            ASTAG-Konform
          </Badge>
          <Badge variant="outline" className="text-xs">
            <FileCheck className="h-3 w-3 mr-1" />
            Handelsregister-geprüft
          </Badge>
          <Badge variant="outline" className="text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            nDSG-Compliant
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
