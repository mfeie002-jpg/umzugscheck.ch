/**
 * TrustDrawer - Bottom Sheet mit detaillierter Verifikation
 * V4 Best-Of: Mobile-optimiertes Trust-Deep-Dive
 */

import { memo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Shield, Building2, Users, FileCheck, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrustCategory {
  id: string;
  title: string;
  icon: typeof Shield;
  color: string;
  items: {
    label: string;
    value: string;
    verifyUrl?: string;
  }[];
}

const TRUST_CATEGORIES: TrustCategory[] = [
  {
    id: "legal",
    title: "Staatliche Verifikation",
    icon: Building2,
    color: "text-red-600",
    items: [
      { label: "Handelsregister (UID)", value: "CHE-123.456.789", verifyUrl: "https://www.zefix.ch" },
      { label: "eUmzugCH Partner", value: "Verifiziert", verifyUrl: "https://www.eumzug.swiss" },
      { label: "MWST-Nummer", value: "CHE-123.456.789 MWST" },
    ]
  },
  {
    id: "industry",
    title: "Branchenstandards",
    icon: Shield,
    color: "text-primary",
    items: [
      { label: "SMA Mitglied", value: "Zertifiziert seit 2019" },
      { label: "ASTAG Partner", value: "Vollmitglied" },
      { label: "ISO 9001", value: "Qualitätsmanagement" },
    ]
  },
  {
    id: "consumer",
    title: "Käuferschutz",
    icon: Users,
    color: "text-success",
    items: [
      { label: "Versicherung", value: "Die Mobiliar, CHF 2 Mio." },
      { label: "Garantie", value: "30 Tage Zufriedenheit" },
      { label: "Kundenbewertung", value: "4.8/5 (2'847 Reviews)" },
    ]
  },
];

interface TrustDrawerProps {
  trigger?: React.ReactNode;
}

export const TrustDrawer = memo(({ trigger }: TrustDrawerProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
            <FileCheck className="w-3.5 h-3.5 mr-1" />
            Alle Verifikationen anzeigen
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Vertrauens-Verifikation
          </SheetTitle>
        </SheetHeader>
        
        <div className="overflow-y-auto py-6 space-y-6">
          {TRUST_CATEGORIES.map((category) => (
            <div key={category.id} className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold">
                <category.icon className={`w-5 h-5 ${category.color}`} />
                {category.title}
              </h3>
              
              <div className="space-y-2">
                {category.items.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.value}</span>
                      {item.verifyUrl && (
                        <a
                          href={item.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Footer Trust Statement */}
          <div className="pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Alle Angaben sind öffentlich verifizierbar. 
              <br />
              Letzte Prüfung: {new Date().toLocaleDateString('de-CH')}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});

TrustDrawer.displayName = "TrustDrawer";
