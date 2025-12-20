import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, ArrowLeft, Package, Bot, FileText, Camera, 
  Search, Sparkles, Globe, Target, Clock, CheckCircle2,
  Zap, ChevronRight, AlertTriangle, Lightbulb, BookOpen,
  Users, Building2, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Goal {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  tool: string;
  color: string;
  // Neue erweiterte Felder
  purpose: string;
  useCases: string[];
  howToUse: string[];
  requirements: string[];
  output: string[];
  tips: string[];
}

const GOALS: Goal[] = [
  {
    id: "replicate",
    icon: <Package className="h-6 w-6" />,
    title: "Tool replizieren",
    description: "Das komplette Analyse-Tool auf ein neues Lovable-Projekt kopieren",
    duration: "~10 Min",
    tool: "mega-export",
    color: "from-primary to-orange-500",
    purpose: "Du möchtest das komplette Website-Analyse-Tool in einem eigenen Lovable-Projekt haben - mit allen Edge Functions, Datenbank-Tabellen und der KI-Integration. So kannst du es für Kunden branden oder weiterentwickeln.",
    useCases: [
      "Eigene White-Label Version für deine Agentur erstellen",
      "Das Tool für einen Kunden individuell anpassen",
      "Eine spezialisierte Version (z.B. nur für E-Commerce) bauen",
      "Das Tool lokal/unabhängig weiterbetreiben"
    ],
    howToUse: [
      "1. Klicke auf 'Mega Export' und lade die ZIP-Datei herunter",
      "2. Erstelle ein neues Lovable-Projekt",
      "3. Kopiere den Inhalt der README.md und füge ihn als ersten Prompt ein",
      "4. Folge den Anweisungen: Registriere dich, werde Admin",
      "5. Füge deinen Firecrawl API-Key in den Cloud-Secrets hinzu"
    ],
    requirements: [
      "Lovable Pro Account (für Cloud/Edge Functions)",
      "Firecrawl API Key (kostenlos: 500 Credits/Monat)",
      "Ca. 10-15 Minuten Zeit für Setup"
    ],
    output: [
      "ZIP mit 5 Edge Functions (fetch-html, capture-rendered-html, ai-website-analyze, lighthouse, firecrawl-map)",
      "SQL Migration für Datenbank-Tabellen",
      "config.toml für Supabase-Konfiguration",
      "Detaillierte Anleitung als Prompt"
    ],
    tips: [
      "Der Prompt ist so gestaltet, dass Lovable alles automatisch aufbaut",
      "Falls etwas nicht klappt: Fehlermeldung kopieren und an Lovable schicken",
      "Nach Setup: Über /admin die Einstellungen anpassen"
    ]
  },
  {
    id: "quick-analyze",
    icon: <Bot className="h-6 w-6" />,
    title: "Website schnell analysieren",
    description: "1-Klick KI-Analyse mit automatischem Screenshot + HTML",
    duration: "1-2 Min",
    tool: "1-click-ai",
    color: "from-purple-500 to-pink-500",
    purpose: "Du willst eine Website schnell durch die KI analysieren lassen - ohne Setup, ohne Export, alles direkt hier. Ideal für einen schnellen Überblick oder erste Kundenakquise.",
    useCases: [
      "Potentiellen Kunden schnell Schwachstellen zeigen",
      "Eigene Website auf Probleme prüfen",
      "Konkurrenz-Analyse durchführen",
      "Schneller Check vor einem Sales-Gespräch"
    ],
    howToUse: [
      "1. URL eingeben und 'Analysieren' klicken",
      "2. Warten bis Screenshot + HTML geladen sind (ca. 30 Sek)",
      "3. KI analysiert automatisch die Daten",
      "4. Ergebnis als Markdown kopieren oder exportieren",
      "5. Optional: In der Datenbank speichern für später"
    ],
    requirements: [
      "Keine zusätzlichen API-Keys nötig!",
      "Lovable AI ist bereits integriert",
      "Funktioniert für die meisten öffentlichen Websites"
    ],
    output: [
      "Strukturierter Analyse-Report",
      "Gefundene Probleme mit Priorität",
      "Konkrete Handlungsempfehlungen",
      "Export als Markdown oder PDF"
    ],
    tips: [
      "Funktioniert am besten mit öffentlichen, nicht login-geschützten Seiten",
      "Bei JavaScript-lastigen Seiten: 'Rendered HTML' Option nutzen",
      "Für tiefere Analyse: Ergebnis an ChatGPT/Claude weitergeben"
    ]
  },
  {
    id: "external-ai",
    icon: <FileText className="h-6 w-6" />,
    title: "Daten für ChatGPT/Claude",
    description: "ZIP-Package mit Screenshots, HTML und Prompts erstellen",
    duration: "3-5 Min",
    tool: "manual-package",
    color: "from-blue-500 to-cyan-500",
    purpose: "Du willst die Website-Daten in einem externen KI-Tool wie ChatGPT Pro oder Claude analysieren. Das Package enthält alles was die KI braucht: Screenshots, HTML, optimierte Prompts und ein Anschreiben.",
    useCases: [
      "Tiefere Analyse mit GPT-4 Vision oder Claude",
      "Kundenbrief mit Analyse-Ergebnissen erstellen",
      "Daten für eigene Prompt-Experimente sammeln",
      "Offline-Archiv einer Website-Analyse erstellen"
    ],
    howToUse: [
      "1. URL eingeben und Optionen wählen (Screenshots, Unterseiten)",
      "2. Auf 'Package erstellen' klicken",
      "3. ZIP-Datei herunterladen",
      "4. ZIP entpacken und Inhalt prüfen",
      "5. Prompts aus dem Package in ChatGPT/Claude einfügen",
      "6. Screenshots als Bilder hochladen"
    ],
    requirements: [
      "Firecrawl API Key (für Screenshots)",
      "ChatGPT Plus oder Claude Pro für beste Ergebnisse",
      "Genug Speicher für ZIP-Datei (ca. 5-20 MB)"
    ],
    output: [
      "Screenshots (Desktop + Mobile, Full-Page)",
      "Raw HTML und Rendered HTML",
      "7 optimierte Analyse-Prompts",
      "Vorformulierter Kundenbrief (PDF)",
      "Metadaten und Struktur-Infos"
    ],
    tips: [
      "Für ChatGPT: Erst den Prompt einfügen, dann Screenshots anhängen",
      "Rendered HTML zeigt was der User sieht (nach JavaScript)",
      "Der Kundenbrief ist personalisierbar - Firmenname ändern!"
    ]
  },
  {
    id: "screenshots",
    icon: <Camera className="h-6 w-6" />,
    title: "Screenshots erstellen",
    description: "Einzel- oder Bulk-Screenshots von Websites",
    duration: "30 Sek",
    tool: "screenshot-machine",
    color: "from-green-500 to-emerald-500",
    purpose: "Du brauchst hochwertige Screenshots einer Website - für Präsentationen, Dokumentation, Vorher/Nachher-Vergleiche oder einfach zur Archivierung.",
    useCases: [
      "Vorher/Nachher Dokumentation für Redesign-Projekte",
      "Konkurrenz-Websites dokumentieren",
      "Portfolio-Präsentationen erstellen",
      "Fehler/Bugs visuell dokumentieren",
      "Mehrere Seiten einer Website auf einmal erfassen"
    ],
    howToUse: [
      "1. URL eingeben oder mehrere URLs (Bulk-Modus)",
      "2. Format wählen: Desktop, Mobile oder beides",
      "3. Full-Page Option aktivieren falls gewünscht",
      "4. 'Screenshot erstellen' klicken",
      "5. Bilder einzeln oder als ZIP herunterladen"
    ],
    requirements: [
      "Firecrawl API Key",
      "Öffentlich zugängliche Website (kein Login)",
      "Für Bulk: Liste der URLs vorbereiten"
    ],
    output: [
      "PNG Screenshots in hoher Auflösung",
      "Desktop (1920x1080) und/oder Mobile (390x844)",
      "Optional: Full-Page (gesamte Scrollhöhe)",
      "ZIP bei mehreren Screenshots"
    ],
    tips: [
      "Full-Page Screenshots können sehr lang werden - gut für Landing Pages",
      "Mobile Screenshots zeigen oft andere Probleme als Desktop",
      "Bulk-Modus spart Zeit bei grossen Websites"
    ]
  },
  {
    id: "seo-analyze",
    icon: <Search className="h-6 w-6" />,
    title: "SEO/HTML analysieren",
    description: "Raw vs. Rendered HTML vergleichen, Meta-Tags prüfen",
    duration: "1 Min",
    tool: "seo-analyzer",
    color: "from-orange-500 to-amber-500",
    purpose: "Du willst verstehen wie eine Website technisch aufgebaut ist - welche Meta-Tags gesetzt sind, wie die Heading-Struktur aussieht und ob JavaScript-Rendering SEO-Probleme verursacht.",
    useCases: [
      "SEO-Audit: Meta-Tags und Struktur prüfen",
      "JavaScript-Rendering Probleme finden",
      "Heading-Hierarchie analysieren (H1, H2, etc.)",
      "Vergleichen was Google vs. User sieht",
      "Technische SEO-Fehler identifizieren"
    ],
    howToUse: [
      "1. URL eingeben",
      "2. 'Raw HTML' holen (das was Google zuerst sieht)",
      "3. 'Rendered HTML' holen (nach JavaScript-Ausführung)",
      "4. Automatische Meta-Tag Extraktion prüfen",
      "5. Vergleich anschauen: Was fehlt im Raw HTML?",
      "6. Ergebnis als LLM-ready Format exportieren"
    ],
    requirements: [
      "Für Raw HTML: Kein API-Key nötig",
      "Für Rendered HTML: Firecrawl API Key",
      "Website muss öffentlich zugänglich sein"
    ],
    output: [
      "Raw HTML (Server-Antwort)",
      "Rendered HTML (nach JavaScript)",
      "Extrahierte Meta-Tags (Title, Description, OG, etc.)",
      "Heading-Struktur (H1-H6)",
      "LLM-optimierter Export für weitere Analyse"
    ],
    tips: [
      "Wenn wichtiger Content nur im Rendered HTML ist = SEO-Problem!",
      "Achte auf: Ist ein H1 vorhanden? Nur einer?",
      "Meta Description sollte 150-160 Zeichen haben",
      "OG-Tags wichtig für Social Media Sharing"
    ]
  },
  {
    id: "get-prompts",
    icon: <Sparkles className="h-6 w-6" />,
    title: "KI-Prompts generieren",
    description: "7 optimierte Analyse-Prompts für verschiedene Zwecke",
    duration: "1 Min",
    tool: "prompt-generator",
    color: "from-pink-500 to-rose-500",
    purpose: "Du hast bereits Screenshots/HTML und willst optimierte Prompts für die KI-Analyse. Die Prompts sind auf verschiedene Analyse-Typen spezialisiert und liefern strukturierte, actionable Ergebnisse.",
    useCases: [
      "Prompt für allgemeine Website-Analyse",
      "Prompt speziell für Conversion-Optimierung",
      "Prompt für technische/Performance Analyse",
      "Prompt für UX/Design Feedback",
      "Prompt für Content/SEO Analyse",
      "Prompt für Mobile-Optimierung",
      "Prompt für Accessibility-Prüfung"
    ],
    howToUse: [
      "1. URL und Firmenname eingeben (für Personalisierung)",
      "2. Prompt-Kategorie wählen oder alle generieren",
      "3. Prompt kopieren",
      "4. In ChatGPT/Claude einfügen",
      "5. Deine Screenshots/HTML anhängen",
      "6. Analyse starten"
    ],
    requirements: [
      "Keine API-Keys nötig!",
      "Funktioniert komplett offline",
      "Screenshots/HTML aus anderem Tool (optional)"
    ],
    output: [
      "7 spezialisierte Analyse-Prompts",
      "Personalisiert mit URL und Firmenname",
      "Strukturierte Output-Formate",
      "Priorisierte Handlungsempfehlungen"
    ],
    tips: [
      "Conversion-Prompt ideal für Sales-Pitches",
      "Technischer Prompt für Entwickler-Feedback",
      "Kombiniere mehrere Prompts für umfassende Analyse"
    ]
  },
  {
    id: "discover-urls",
    icon: <Globe className="h-6 w-6" />,
    title: "Alle Seiten finden",
    description: "Automatisch alle Unterseiten einer Website entdecken",
    duration: "30 Sek",
    tool: "url-discovery",
    color: "from-cyan-500 to-teal-500",
    purpose: "Du willst nicht nur die Homepage analysieren, sondern alle wichtigen Unterseiten einer Website finden. Das Tool crawlt die Sitemap und interne Links um bis zu 50 URLs zu finden.",
    useCases: [
      "Vollständige Website-Analyse planen",
      "Alle Landing Pages eines Shops finden",
      "Sitemap-Struktur verstehen",
      "Wichtige Seiten für Bulk-Screenshot identifizieren",
      "Website-Umfang für Angebot einschätzen"
    ],
    howToUse: [
      "1. Haupt-URL eingeben (z.B. example.com)",
      "2. 'URLs entdecken' klicken",
      "3. Warten bis Crawl fertig (5-30 Sek)",
      "4. Gefundene URLs durchsehen",
      "5. Relevante URLs auswählen",
      "6. Direkt zur Bulk-Analyse oder Screenshot weiterleiten"
    ],
    requirements: [
      "Firecrawl API Key",
      "Öffentliche Website ohne Crawl-Blockierung",
      "Website sollte interne Links oder Sitemap haben"
    ],
    output: [
      "Liste aller gefundenen URLs (max. 50)",
      "Kategorisierung nach Seitentyp (wenn erkennbar)",
      "Direkte Weiterleitung zu anderen Tools",
      "Export als URL-Liste"
    ],
    tips: [
      "Kleine Websites: Alle URLs analysieren",
      "Grosse Websites: Fokus auf wichtigste Seiten (Home, Produkte, Kontakt)",
      "Prüfe ob wichtige Seiten fehlen - könnte auf Navigations-Problem hinweisen"
    ]
  }
];

interface ToolsWizardProps {
  onSelectTool: (toolId: string) => void;
}

export const ToolsWizard = ({ onSelectTool }: ToolsWizardProps) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showWizard, setShowWizard] = useState(true);

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const handleConfirm = () => {
    if (selectedGoal) {
      onSelectTool(selectedGoal.tool);
      setShowWizard(false);
    }
  };

  const handleReset = () => {
    setSelectedGoal(null);
    setShowWizard(true);
  };

  if (!showWizard) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleReset}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Anderes Ziel wählen
      </Button>
    );
  }

  return (
    <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-3">
          <Target className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Was möchtest du tun?</CardTitle>
        <CardDescription className="text-base">
          Wähle dein Ziel – wir zeigen dir genau was du bekommst und wie du es nutzt
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {GOALS.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleSelectGoal(goal)}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all duration-200",
                "hover:shadow-lg hover:scale-[1.02]",
                selectedGoal?.id === goal.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/50 bg-background"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg bg-gradient-to-br text-white shrink-0",
                  goal.color
                )}>
                  {goal.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm">{goal.title}</h3>
                    {selectedGoal?.id === goal.id && (
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {goal.description}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{goal.duration}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Detailed Goal Information */}
        {selectedGoal && (
          <div className="rounded-xl border-2 border-primary/30 bg-gradient-to-br from-background to-muted/30 animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-3 rounded-xl bg-gradient-to-br text-white shadow-lg",
                    selectedGoal.color
                  )}>
                    {selectedGoal.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedGoal.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {selectedGoal.duration}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleConfirm}
                  size="lg"
                  className={cn("bg-gradient-to-r shadow-lg", selectedGoal.color)}
                >
                  Tool öffnen
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Content Grid */}
            <ScrollArea className="max-h-[500px]">
              <div className="p-4 space-y-4">
                {/* Purpose Section */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Wofür ist das?</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedGoal.purpose}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Use Cases */}
                  <div className="p-4 rounded-lg bg-background border">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-5 w-5 text-blue-500" />
                      <h4 className="font-semibold text-sm">Typische Anwendungsfälle</h4>
                    </div>
                    <ul className="space-y-2">
                      {selectedGoal.useCases.map((useCase, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <span>{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* How to Use */}
                  <div className="p-4 rounded-lg bg-background border">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="h-5 w-5 text-purple-500" />
                      <h4 className="font-semibold text-sm">So funktioniert's</h4>
                    </div>
                    <ol className="space-y-2">
                      {selectedGoal.howToUse.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                            {i + 1}
                          </span>
                          <span>{step.replace(/^\d+\.\s*/, '')}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Requirements */}
                  <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <h4 className="font-semibold text-sm">Voraussetzungen</h4>
                    </div>
                    <ul className="space-y-2">
                      {selectedGoal.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Output */}
                  <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-5 w-5 text-green-500" />
                      <h4 className="font-semibold text-sm">Das bekommst du</h4>
                    </div>
                    <ul className="space-y-2">
                      {selectedGoal.output.map((out, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tips */}
                  <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-5 w-5 text-blue-500" />
                      <h4 className="font-semibold text-sm">Profi-Tipps</h4>
                    </div>
                    <ul className="space-y-2">
                      {selectedGoal.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Sparkles className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Skip option */}
        <div className="text-center pt-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowWizard(false)}
            className="text-muted-foreground"
          >
            Alle Tools anzeigen
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolsWizard;
