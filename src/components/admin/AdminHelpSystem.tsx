import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HelpCircle,
  Lightbulb,
  BookOpen,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Copy,
  Rocket,
  Brain,
  Camera,
  Layers,
  Target,
  BarChart3,
  Users,
  Building2,
  CreditCard,
  Mail,
  Settings,
  Zap,
  Sparkles,
  AlertTriangle,
  Info,
  Star,
  Play,
  FileText,
  GitCompare,
  Clock,
  Bot,
  Download,
  Send
} from "lucide-react";
import { toast } from "sonner";

// ============================================================================
// ADMIN HELP SYSTEM - Comprehensive Tutorials & Best Practices
// ============================================================================

export interface HelpTip {
  title: string;
  description: string;
  bestPractice?: string;
  warning?: string;
  steps?: string[];
  example?: string;
}

export interface SectionHelp {
  id: string;
  title: string;
  icon: any;
  shortDesc: string;
  longDesc: string;
  tips: HelpTip[];
  capabilities: string[];
  bestPractices: string[];
  commonMistakes: string[];
  tutorialSteps: { title: string; description: string }[];
}

// ============================================================================
// HELP CONTENT DATABASE
// ============================================================================

export const ADMIN_HELP_SECTIONS: SectionHelp[] = [
  {
    id: "ai-command",
    title: "🧠 AI Command Center",
    icon: Brain,
    shortDesc: "Dein Kontrollzentrum für alle KI-Analysen",
    longDesc: "Das AI Command Center ist der zentrale Hub für alle KI-gestützten Analysen. Hier kannst du mit einem Klick alle Daten exportieren, die ChatGPT oder andere AI-Tools brauchen, um deine Funnels zu analysieren und zu verbessern.",
    tips: [
      {
        title: "1-Click Export verstehen",
        description: "Der Ultimate Export sammelt Screenshots, HTML und Metadaten von allen 9 Flow-Varianten und generiert spezialisierte Prompts für ChatGPT.",
        bestPractice: "Exportiere regelmäßig (wöchentlich) und vergleiche mit vorherigen Exports",
        steps: [
          "Klicke auf 'Export für ChatGPT'",
          "Warte bis alle Flows erfasst sind (~5-10 Min)",
          "Lade das ZIP herunter",
          "Öffne ChatGPT und lade das ZIP hoch",
          "Nutze MASTER_PROMPT.md für die Analyse"
        ]
      },
      {
        title: "V10-Synthese nutzen",
        description: "Die V10_SYNTHESIS.md erstellt aus allen 9 Varianten einen optimalen 'Ultimate Flow'",
        bestPractice: "Nutze V10 für die nächste Major-Version deines Funnels"
      }
    ],
    capabilities: [
      "Automatische Screenshot-Erfassung aller 9 Flow-Varianten",
      "Desktop + Mobile Screenshots pro Step",
      "Rendered HTML für Code-Analyse",
      "Spezialisierte ChatGPT-Prompts (Master, Quick Compare, V10)",
      "JSON-Metadaten für eigene Auswertungen",
      "Alles in einem ZIP für einfaches Teilen"
    ],
    bestPractices: [
      "Exportiere vor und nach größeren Änderungen",
      "Nutze V10_SYNTHESIS.md für strategische Entscheidungen",
      "Teile Exports mit dem Team für gemeinsame Reviews",
      "Archiviere Exports zur historischen Analyse"
    ],
    commonMistakes: [
      "Export während Änderungen starten → Warte bis Deploy fertig ist",
      "Nur Desktop oder nur Mobile analysieren → Immer beides prüfen",
      "V10 1:1 implementieren → V10 ist Inspiration, nicht Vorlage"
    ],
    tutorialSteps: [
      { title: "Überblick verschaffen", description: "Schau dir die Statistiken oben an: Wie viele Flows, Steps, Screenshots gibt es?" },
      { title: "Quick Actions nutzen", description: "Die 6 Buttons bieten schnellen Zugriff auf die wichtigsten Tools" },
      { title: "Ultimate Export starten", description: "Klicke auf den großen Button und warte auf den Download" },
      { title: "ChatGPT nutzen", description: "Lade das ZIP hoch und nutze die mitgelieferten Prompts" }
    ]
  },
  {
    id: "screenshots",
    title: "📸 Screenshot Machine",
    icon: Camera,
    shortDesc: "Erfasse Screenshots von beliebigen URLs",
    longDesc: "Die Screenshot Machine ermöglicht dir, Screenshots von jeder URL zu erfassen - einzeln oder in Bulk. Perfekt für Dokumentation, Regression-Tests und Competitor-Analyse.",
    tips: [
      {
        title: "Single vs Bulk Capture",
        description: "Einzeln für schnelle Checks, Bulk für komplette Seiten-Sets",
        bestPractice: "Nutze Bulk für regelmäßige Monitoring-Aufgaben"
      },
      {
        title: "Dimensionen wählen",
        description: "Desktop (1920x1080), Tablet (768x1024), Mobile (390x844)",
        warning: "Mobile Screenshots brauchen oft mehr Delay wegen Touch-Optimierungen"
      }
    ],
    capabilities: [
      "Einzelne URL-Screenshots",
      "Bulk-Capture für mehrere URLs",
      "Desktop, Tablet & Mobile Dimensionen",
      "Full-Page oder Above-the-Fold",
      "Konfigurierbarer Delay für SPAs",
      "Download als PNG/JPEG",
      "Archivierung in Supabase Storage"
    ],
    bestPractices: [
      "Setze Delay auf mindestens 5s für SPAs",
      "Nutze Full-Page für lange Seiten",
      "Archiviere wichtige Screenshots für Vergleiche",
      "Teste URLs zuerst einzeln, dann Bulk"
    ],
    commonMistakes: [
      "Zu wenig Delay → Blank Screenshots",
      "Falsche Dimension → Mobile Seite auf Desktop",
      "URLs ohne https:// → Capture schlägt fehl"
    ],
    tutorialSteps: [
      { title: "URL eingeben", description: "Gib die vollständige URL mit https:// ein" },
      { title: "Dimension wählen", description: "Wähle Desktop/Tablet/Mobile je nach Ziel" },
      { title: "Delay einstellen", description: "5-10 Sekunden für normale Seiten, 20-30 für SPAs" },
      { title: "Capture starten", description: "Klicke auf Capture und warte auf das Ergebnis" }
    ]
  },
  {
    id: "flows",
    title: "🔄 Auto-Flow Capture",
    icon: Layers,
    shortDesc: "Erfasse alle Steps aller Funnel-Varianten automatisch",
    longDesc: "Auto-Flow erfasst systematisch alle Steps aller 9 Funnel-Varianten. Jeder Step wird mit Desktop und Mobile Screenshots plus HTML dokumentiert.",
    tips: [
      {
        title: "Flow-Varianten verstehen",
        description: "Es gibt 9 Varianten (v1-v9) mit unterschiedlichen Step-Anzahlen und UX-Patterns",
        example: "V1: 4 Steps, V3: 3 Steps, V5: 5 Steps"
      },
      {
        title: "Capture-Parameter",
        description: "uc_capture=1, uc_flow=vX, uc_step=N steuern was erfasst wird"
      }
    ],
    capabilities: [
      "9 Flow-Varianten automatisch erfassen",
      "Dynamische Step-Erkennung",
      "Desktop + Mobile pro Step",
      "HTML-Capture für Code-Analyse",
      "Metadaten-Export (JSON)",
      "Prompt-Generierung pro Step/Flow"
    ],
    bestPractices: [
      "Erfasse nach jedem Deploy neu",
      "Vergleiche mit vorherigen Captures",
      "Nutze die generierten Prompts für gezielte Analysen"
    ],
    commonMistakes: [
      "Capture während Build → Seite nicht bereit",
      "Nicht alle Flows erfassen → Unvollständige Analyse"
    ],
    tutorialSteps: [
      { title: "Flows auswählen", description: "Wähle welche der 9 Varianten du erfassen willst" },
      { title: "Capture starten", description: "Der Prozess läuft automatisch durch alle Steps" },
      { title: "Ergebnisse prüfen", description: "Schaue ob alle Screenshots erfolgreich sind" },
      { title: "Export nutzen", description: "Lade alles als ZIP für ChatGPT herunter" }
    ]
  },
  {
    id: "ab-testing",
    title: "🧪 A/B Tests",
    icon: Sparkles,
    shortDesc: "Teste verschiedene Varianten gegeneinander",
    longDesc: "A/B Testing erlaubt dir, verschiedene Flow-Varianten mit echten Nutzern zu testen und datenbasiert zu entscheiden, welche besser konvertiert.",
    tips: [
      {
        title: "Statistische Signifikanz",
        description: "Warte auf genug Daten bevor du entscheidest - mind. 100 Conversions pro Variante",
        warning: "Zu früh entscheiden führt zu falschen Schlüssen"
      }
    ],
    capabilities: [
      "Varianten definieren",
      "Traffic-Split konfigurieren",
      "Conversion-Tracking",
      "Statistische Auswertung",
      "Winner-Erkennung"
    ],
    bestPractices: [
      "Teste nur eine Änderung pro Test",
      "Warte auf statistische Signifikanz",
      "Dokumentiere Hypothesen vor dem Test"
    ],
    commonMistakes: [
      "Mehrere Änderungen gleichzeitig testen",
      "Test zu früh beenden",
      "Keine klare Hypothese haben"
    ],
    tutorialSteps: [
      { title: "Hypothese formulieren", description: "'Ich glaube, dass X zu Y führt'" },
      { title: "Varianten erstellen", description: "Original vs. Variante definieren" },
      { title: "Test starten", description: "Traffic-Split aktivieren" },
      { title: "Ergebnisse analysieren", description: "Warten auf Signifikanz, dann entscheiden" }
    ]
  },
  {
    id: "leads",
    title: "👥 Lead-Management",
    icon: Users,
    shortDesc: "Alle eingehenden Anfragen verwalten",
    longDesc: "Das Lead-Management zeigt alle eingehenden Offerten-Anfragen mit Details zu Umzug, Kontaktdaten und zugewiesenen Firmen.",
    tips: [
      {
        title: "Lead-Qualität verstehen",
        description: "Höherer Score = höhere Conversion-Wahrscheinlichkeit"
      }
    ],
    capabilities: [
      "Alle Leads in einer Liste",
      "Filterung nach Status, Datum, Region",
      "Lead-Details einsehen",
      "Zugewiesene Firmen verwalten",
      "Export als CSV"
    ],
    bestPractices: [
      "Regelmäßig Leads reviewen",
      "Spam-Leads markieren",
      "High-Quality Leads priorisieren"
    ],
    commonMistakes: [
      "Leads nicht zeitnah bearbeiten",
      "Duplikate nicht erkennen"
    ],
    tutorialSteps: [
      { title: "Liste durchsehen", description: "Sortiere nach Datum für neueste Leads" },
      { title: "Details prüfen", description: "Klicke auf einen Lead für alle Infos" },
      { title: "Status aktualisieren", description: "Markiere bearbeitete Leads" }
    ]
  },
  {
    id: "companies",
    title: "🏢 Firmen-Verwaltung",
    icon: Building2,
    shortDesc: "Umzugsfirmen verwalten und ranken",
    longDesc: "Verwalte alle Partner-Umzugsfirmen, ihre Profile, Rankings und Bewertungen.",
    tips: [
      {
        title: "Ranking-Logik",
        description: "Position basiert auf Score (Rating × Reviews × Aktivität)",
        bestPractice: "Featured-Firmen bekommen Top-Platzierungen"
      }
    ],
    capabilities: [
      "Firmen-Profile bearbeiten",
      "Rankings manuell anpassen",
      "Featured-Status vergeben",
      "Regionen zuweisen",
      "Bewertungen verwalten",
      "Performance-Metriken einsehen"
    ],
    bestPractices: [
      "Profile regelmäßig aktualisieren",
      "Inaktive Firmen deaktivieren",
      "Rankings nach Performance anpassen"
    ],
    commonMistakes: [
      "Unvollständige Profile → schlechte UX",
      "Zu viele Featured → verwässert Wert"
    ],
    tutorialSteps: [
      { title: "Firma auswählen", description: "Suche oder scrolle zur gewünschten Firma" },
      { title: "Profil bearbeiten", description: "Name, Logo, Beschreibung, Regionen anpassen" },
      { title: "Ranking setzen", description: "Position manuell oder automatisch vergeben" }
    ]
  },
  {
    id: "billing",
    title: "💰 Billing & Abrechnung",
    icon: CreditCard,
    shortDesc: "Abrechnungen und Zahlungen verwalten",
    longDesc: "Verwalte alle Abrechnungsmodelle, Invoices und Zahlungsstatus der Partner-Firmen.",
    tips: [
      {
        title: "Abrechnungsmodelle",
        description: "CPL (Cost per Lead), CPC (Cost per Click), Subscription, Hybrid"
      }
    ],
    capabilities: [
      "Invoices erstellen",
      "Zahlungsstatus tracken",
      "Verschiedene Billing-Modelle",
      "Automatische Abrechnung",
      "Reports exportieren"
    ],
    bestPractices: [
      "Invoices zeitnah erstellen",
      "Zahlungseingänge dokumentieren",
      "Offene Posten nachfassen"
    ],
    commonMistakes: [
      "Falsche Preise berechnen",
      "Doppelte Abrechnung"
    ],
    tutorialSteps: [
      { title: "Zeitraum wählen", description: "Wähle Abrechnungszeitraum" },
      { title: "Leads prüfen", description: "Kontrolliere abzurechnende Leads" },
      { title: "Invoice erstellen", description: "Generiere und versende Invoice" }
    ]
  },
  {
    id: "email-automation",
    title: "📧 E-Mail Automation",
    icon: Mail,
    shortDesc: "Automatische E-Mails an Leads und Partner",
    longDesc: "Konfiguriere automatische E-Mails für verschiedene Trigger wie neue Leads, Follow-ups, Erinnerungen.",
    tips: [
      {
        title: "Trigger verstehen",
        description: "Wann wird eine E-Mail ausgelöst? (neuer Lead, X Tage später, Status-Änderung)"
      }
    ],
    capabilities: [
      "E-Mail-Templates erstellen",
      "Trigger definieren",
      "Zeitverzögerung konfigurieren",
      "Personalisierung mit Variablen",
      "Versand-Logs einsehen"
    ],
    bestPractices: [
      "Klare Betreffzeilen",
      "Personalisierte Inhalte",
      "Nicht zu viele E-Mails"
    ],
    commonMistakes: [
      "Spam-artige Frequenz",
      "Unpersönliche Texte",
      "Kaputte Links"
    ],
    tutorialSteps: [
      { title: "Template erstellen", description: "Schreibe E-Mail mit Platzhaltern" },
      { title: "Trigger wählen", description: "Wann soll die E-Mail gesendet werden?" },
      { title: "Testen", description: "Sende Test-E-Mail an dich selbst" },
      { title: "Aktivieren", description: "Schalte die Automation live" }
    ]
  }
];

// ============================================================================
// HELP TOOLTIP COMPONENT
// ============================================================================

interface HelpTooltipProps {
  section: string;
  children: React.ReactNode;
}

export const HelpTooltip = ({ section, children }: HelpTooltipProps) => {
  const help = ADMIN_HELP_SECTIONS.find(s => s.id === section);
  if (!help) return <>{children}</>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative inline-flex items-center gap-2 cursor-help group">
          {children}
          <HelpCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <help.icon className="h-5 w-5" />
            {help.title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <SectionHelpContent section={help} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// INLINE HELP BUTTON
// ============================================================================

interface InlineHelpProps {
  section: string;
  compact?: boolean;
}

export const InlineHelp = ({ section, compact = false }: InlineHelpProps) => {
  const help = ADMIN_HELP_SECTIONS.find(s => s.id === section);
  if (!help) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size={compact ? "icon" : "sm"} className="gap-2">
          <HelpCircle className="h-4 w-4" />
          {!compact && <span>Hilfe</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <help.icon className="h-5 w-5" />
            {help.title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <SectionHelpContent section={help} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// ADMIN HELP BUTTON (Alias for InlineHelp)
// ============================================================================

export const AdminHelpButton = ({ section }: { section: string }) => {
  return <InlineHelp section={section} compact />;
};

// ============================================================================
// SECTION HELP CONTENT
// ============================================================================

const SectionHelpContent = ({ section }: { section: SectionHelp }) => {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="p-4 rounded-lg bg-muted/50">
        <p className="text-sm">{section.longDesc}</p>
      </div>

      <Tabs defaultValue="tutorial">
        <TabsList className="w-full">
          <TabsTrigger value="tutorial" className="flex-1">📚 Tutorial</TabsTrigger>
          <TabsTrigger value="capabilities" className="flex-1">⚡ Features</TabsTrigger>
          <TabsTrigger value="best" className="flex-1">💎 Best Practices</TabsTrigger>
          <TabsTrigger value="mistakes" className="flex-1">⚠️ Fehler</TabsTrigger>
        </TabsList>

        <TabsContent value="tutorial" className="mt-4 space-y-4">
          {section.tutorialSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </div>
              <div>
                <div className="font-medium">{step.title}</div>
                <div className="text-sm text-muted-foreground">{step.description}</div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="capabilities" className="mt-4">
          <div className="grid gap-2">
            {section.capabilities.map((cap, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-sm">{cap}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="best" className="mt-4">
          <div className="grid gap-2">
            {section.bestPractices.map((bp, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded bg-green-500/10">
                <Star className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-sm">{bp}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mistakes" className="mt-4">
          <div className="grid gap-2">
            {section.commonMistakes.map((m, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                <span className="text-sm">{m}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detailed Tips */}
      {section.tips.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Tipps & Tricks
          </h4>
          <Accordion type="single" collapsible>
            {section.tips.map((tip, i) => (
              <AccordionItem key={i} value={`tip-${i}`}>
                <AccordionTrigger className="text-sm">{tip.title}</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                  {tip.bestPractice && (
                    <div className="flex items-start gap-2 p-2 rounded bg-green-500/10 text-sm">
                      <Star className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{tip.bestPractice}</span>
                    </div>
                  )}
                  {tip.warning && (
                    <div className="flex items-start gap-2 p-2 rounded bg-yellow-500/10 text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                      <span>{tip.warning}</span>
                    </div>
                  )}
                  {tip.steps && (
                    <div className="space-y-1 mt-2">
                      {tip.steps.map((step, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm">
                          <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">{j+1}</span>
                          {step}
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// GLOBAL HELP OVERVIEW
// ============================================================================

export const AdminHelpOverview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Admin-Handbuch
        </CardTitle>
        <CardDescription>
          Alle Bereiche mit Tutorials, Best Practices und Tipps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ADMIN_HELP_SECTIONS.map((section) => (
            <Dialog key={section.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <section.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{section.title}</div>
                        <div className="text-xs text-muted-foreground">{section.shortDesc}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <section.icon className="h-5 w-5" />
                    {section.title}
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <SectionHelpContent section={section} />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
