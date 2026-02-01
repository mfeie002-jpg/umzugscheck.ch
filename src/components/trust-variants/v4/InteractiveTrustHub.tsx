/**
 * InteractiveTrustHub - 3-Tab Hub (Behörden/Branche/Sicherheit)
 * V4 Best-Of: Mid-Page Deep-Dive in Vertrauenskategorien
 */

import { memo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Shield, Users, ExternalLink, CheckCircle2, Award } from "lucide-react";
import { motion } from "framer-motion";

interface TrustItem {
  name: string;
  description: string;
  status: string;
  verifyUrl?: string;
}

interface TrustTab {
  id: string;
  label: string;
  shortLabel: string;
  icon: typeof Shield;
  color: string;
  bgColor: string;
  items: TrustItem[];
}

const TRUST_TABS: TrustTab[] = [
  {
    id: "state",
    label: "Staatliche Autorität",
    shortLabel: "Staat",
    icon: Building2,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    items: [
      { name: "Zefix/Handelsregister", description: "Offizielle Eintragung im Schweizer Handelsregister", status: "Verifiziert", verifyUrl: "https://www.zefix.ch" },
      { name: "eUmzugCH", description: "Anbindung an das elektronische Ummeldesystem", status: "Integriert", verifyUrl: "https://www.eumzug.swiss" },
      { name: "Die Post", description: "Offizielle Nachsendeauftrag-Partnerschaft", status: "Partner", verifyUrl: "https://www.post.ch" },
      { name: "UID-Register", description: "Unternehmens-Identifikationsnummer", status: "CHE-xxx.xxx.xxx" },
    ]
  },
  {
    id: "industry",
    label: "Branchenverbände",
    shortLabel: "Branche",
    icon: Shield,
    color: "text-primary",
    bgColor: "bg-primary/5",
    items: [
      { name: "SMA", description: "Swiss Movers Association - Qualitätsstandard der Branche", status: "Zertifiziert" },
      { name: "ASTAG", description: "Schweizerischer Nutzfahrzeugverband", status: "Vollmitglied" },
      { name: "SPEDLOGSWISS", description: "Verband der Speditions- und Logistikunternehmen", status: "Partner" },
      { name: "ISO 9001:2015", description: "Qualitätsmanagement-Zertifizierung", status: "Akkreditiert" },
    ]
  },
  {
    id: "consumer",
    label: "Konsumentenschutz",
    shortLabel: "Schutz",
    icon: Users,
    color: "text-success",
    bgColor: "bg-success/5",
    items: [
      { name: "Die Mobiliar", description: "Vollkasko-Transportversicherung bis CHF 2 Mio.", status: "Versichert" },
      { name: "Trusted Shops", description: "Europäisches Gütesiegel für Online-Shops", status: "Zertifiziert" },
      { name: "Geld-zurück-Garantie", description: "30 Tage Zufriedenheitsgarantie", status: "Garantiert" },
      { name: "Schweizer Hosting", description: "Alle Daten auf Servern in der Schweiz", status: "Bestätigt" },
    ]
  },
];

interface InteractiveTrustHubProps {
  className?: string;
}

export const InteractiveTrustHub = memo(({ className = "" }: InteractiveTrustHubProps) => {
  const [activeTab, setActiveTab] = useState("state");

  return (
    <section className={`py-16 md:py-24 bg-muted/30 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-semibold text-primary mb-4">
            <Award className="w-4 h-4" />
            Vertrauens-Hub
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Dreifach geprüft. Dreifach sicher.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unsere Partner werden auf drei Ebenen verifiziert: Staatlich, durch Branchenverbände und durch Konsumentenschutz-Organisationen.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {TRUST_TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-background"
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : ""}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {TRUST_TABS.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`rounded-2xl p-6 ${tab.bgColor}`}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {tab.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-background rounded-xl p-4 border border-border/50 hover:border-border transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{item.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-success">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {item.status}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      {item.verifyUrl && (
                        <a
                          href={item.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Selbst prüfen
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
});

InteractiveTrustHub.displayName = "InteractiveTrustHub";
