import { Shield, CheckCircle2, AlertCircle, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const InsuranceBlock = () => {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          Versicherung & Schadenabwicklung
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Ihre Sicherheit steht an erster Stelle. Alle Umzugsfirmen auf unserer Plattform 
          verfügen über umfassende Versicherungen.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex gap-3 p-4 rounded-lg bg-secondary/30">
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold mb-1">Transportversicherung</div>
              <div className="text-sm text-muted-foreground">
                Deckung für Schäden am Umzugsgut während des Transports
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-4 rounded-lg bg-secondary/30">
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold mb-1">Haftpflichtversicherung</div>
              <div className="text-sm text-muted-foreground">
                Schutz bei Schäden an Gebäuden und Dritten
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-4 rounded-lg bg-secondary/30">
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold mb-1">Betriebshaftpflicht</div>
              <div className="text-sm text-muted-foreground">
                Deckung für alle betrieblichen Risiken
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-4 rounded-lg bg-secondary/30">
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold mb-1">Zusatzversicherung</div>
              <div className="text-sm text-muted-foreground">
                Optional für Wertsachen und spezielle Güter
              </div>
            </div>
          </div>
        </div>

        <Alert className="bg-info/5 border-info/20">
          <AlertCircle className="h-4 w-4 text-info" />
          <AlertDescription className="text-sm">
            <span className="font-semibold">Tipp:</span> Erstellen Sie vor dem Umzug eine Inventarliste 
            mit Fotos wertvoller Gegenstände für eine reibungslose Schadenabwicklung.
          </AlertDescription>
        </Alert>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
          <FileCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-semibold mb-1">Schadenfall-Garantie</div>
            <div className="text-muted-foreground">
              Bei einem Schadenfall unterstützen wir Sie aktiv bei der Abwicklung mit der Versicherung 
              und sorgen für eine faire, schnelle Regulierung.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
