import { Lock, Shield, Eye, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const DataProtectionBadge = () => {
  return (
    <Card className="border-info/20 bg-info/5">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-info" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Schweizer Datenschutz</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Ihre Daten sind bei uns in sicheren Händen. Wir erfüllen höchste Schweizer 
              und europäische Datenschutzstandards.
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-info flex-shrink-0" />
                <span><strong>DSGVO & DSG konform:</strong> Vollständige Einhaltung aller Vorschriften</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-info flex-shrink-0" />
                <span><strong>Server in der Schweiz:</strong> Ihre Daten bleiben in der Schweiz</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-info flex-shrink-0" />
                <span><strong>SSL-Verschlüsselung:</strong> Alle Übertragungen sind gesichert</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-info flex-shrink-0" />
                <span><strong>Keine Weitergabe:</strong> Daten nur an gewählte Umzugsfirmen</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
