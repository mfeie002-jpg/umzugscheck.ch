import { Shield, CheckCircle2, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const VerifiedBadge = () => {
  return (
    <Card className="border-success/20 bg-success/5">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              Geprüfte Umzugsfirmen
              <Award className="w-5 h-5 text-success" />
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Alle Partner auf Umzugscheck.ch durchlaufen einen strengen Verifizierungsprozess:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <span>Gültige Gewerbeberechtigung und Handelsregistereintrag</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <span>Vollständige Haftpflichtversicherung mit Mindestdeckung</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <span>Nachgewiesene Erfahrung und positive Referenzen</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <span>DSGVO-konforme Datenverarbeitung</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
