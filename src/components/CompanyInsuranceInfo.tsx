import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, ShieldCheck, ShieldAlert, FileText, CheckCircle, Info, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface InsuranceCoverage {
  id: string;
  name: string;
  coverage: string;
  maxAmount: string;
  included: boolean;
  details: string;
}

interface CompanyInsuranceInfoProps {
  companyName: string;
  isVerified?: boolean;
  hasPremiumInsurance?: boolean;
}

const insuranceCoverages: InsuranceCoverage[] = [
  {
    id: "basic",
    name: "Grundversicherung",
    coverage: "Transport & Lagerung",
    maxAmount: "CHF 50'000",
    included: true,
    details: "Deckt alle Schäden während des Transports und der temporären Lagerung ab. Gilt für alle regulären Hausratsgegenstände."
  },
  {
    id: "extended",
    name: "Erweiterte Haftpflicht",
    coverage: "Gebäudeschäden",
    maxAmount: "CHF 100'000",
    included: true,
    details: "Deckt Schäden an der alten und neuen Immobilie ab, einschliesslich Kratzer, Dellen und Beschädigungen an Türen, Wänden und Böden."
  },
  {
    id: "valuables",
    name: "Wertsachenversicherung",
    coverage: "Kunst & Antiquitäten",
    maxAmount: "CHF 200'000",
    included: false,
    details: "Optionale Zusatzversicherung für besonders wertvolle Gegenstände wie Kunstwerke, Antiquitäten, Schmuck und Sammlerstücke."
  },
  {
    id: "delay",
    name: "Verzögerungsschutz",
    coverage: "Hotel & Ersatzkosten",
    maxAmount: "CHF 5'000",
    included: false,
    details: "Übernimmt Kosten für Hotelübernachtungen und Ersatzkäufe bei unverschuldeten Lieferverzögerungen."
  }
];

const certifications = [
  { name: "ISO 9001:2015", description: "Qualitätsmanagement" },
  { name: "FAMO Mitglied", description: "Fachverband Möbeltransport" },
  { name: "ASTAG zertifiziert", description: "Schweizerischer Nutzfahrzeugverband" },
];

export const CompanyInsuranceInfo = ({
  companyName,
  isVerified = true,
  hasPremiumInsurance = false
}: CompanyInsuranceInfoProps) => {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Versicherung & Garantie
          </CardTitle>
          {isVerified && (
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
              <ShieldCheck className="h-3 w-3" />
              Verifiziert
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Coverage List */}
        <div className="space-y-3">
          {insuranceCoverages.map((coverage) => (
            <div
              key={coverage.id}
              className={`p-4 rounded-lg border transition-colors ${
                coverage.included 
                  ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30' 
                  : 'border-border/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {coverage.included ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Info className="h-4 w-4 text-muted-foreground" />
                  )}
                  <h4 className="font-medium">{coverage.name}</h4>
                </div>
                <Badge variant={coverage.included ? "default" : "outline"}>
                  {coverage.included ? "Inklusive" : "Optional"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{coverage.coverage}</span>
                <span className="font-medium">bis {coverage.maxAmount}</span>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                {coverage.details}
              </p>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <Accordion type="single" collapsible>
          <AccordionItem value="certifications" className="border-none">
            <AccordionTrigger className="text-sm font-medium py-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Zertifizierungen & Mitgliedschaften
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-2 pt-2">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{cert.name}</div>
                      <div className="text-xs text-muted-foreground">{cert.description}</div>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Premium Insurance Upsell */}
        {!hasPremiumInsurance && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">Premium Versicherungsschutz</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Erweitern Sie Ihren Schutz mit unserer Premium-Versicherung für 
                  Wertsachen und Verzögerungen.
                </p>
                <Button variant="outline" size="sm" className="mt-3 gap-2">
                  <ExternalLink className="h-3 w-3" />
                  Mehr erfahren
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Guarantee Badge */}
        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
          <ShieldCheck className="h-8 w-8 text-green-500" />
          <div>
            <div className="font-medium text-green-700 dark:text-green-400">
              100% Zufriedenheitsgarantie
            </div>
            <div className="text-xs text-green-600 dark:text-green-500">
              Bei Unzufriedenheit: Kostenlose Nachbesserung oder Geld zurück
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInsuranceInfo;
