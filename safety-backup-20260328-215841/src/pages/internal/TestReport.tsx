import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, XCircle, Clock, FileText, ExternalLink, 
  Play, AlertCircle, Home, Building2, Video, Camera,
  List, Star, Banknote, User, Sparkles, Trash2, MapPin,
  Briefcase, Calculator, HelpCircle, Package, Warehouse,
  TrendingUp, TrendingDown, Users, Globe, Terminal, BarChart3
} from "lucide-react";

// Core 20 Funnels definition
const CORE_FUNNELS = [
  { id: 1, name: "Homepage Smart Router", route: "/", intent: "Ich suche Umzugshilfe", priority: "critical", icon: Home },
  { id: 2, name: "Vergleich Wizard", route: "/vergleich", intent: "Ich will Offerten vergleichen", priority: "critical", icon: List },
  { id: 3, name: "Video-Offerte", route: "/video", intent: "Video-basierte Schätzung", priority: "critical", icon: Video },
  { id: 4, name: "AI Photo Upload", route: "/rechner/ai", intent: "Fotos hochladen für Preis", priority: "high", icon: Camera },
  { id: 5, name: "Firmenverzeichnis", route: "/umzugsfirmen", intent: "Welche Firmen gibt es?", priority: "critical", icon: Building2 },
  { id: 6, name: "Beste Firmen Ranking", route: "/beste-umzugsfirma", intent: "Wer ist der Beste?", priority: "critical", icon: Star },
  { id: 7, name: "Günstige Firmen", route: "/guenstige-umzugsfirma", intent: "Wer ist günstig?", priority: "high", icon: Banknote },
  { id: 8, name: "Firmenprofil", route: "/firma/example-umzug", intent: "Details zu dieser Firma", priority: "high", icon: User },
  { id: 9, name: "Reinigungsrechner", route: "/rechner/reinigung", intent: "Was kostet Endreinigung?", priority: "high", icon: Sparkles },
  { id: 10, name: "Entsorgungsrechner", route: "/rechner/entsorgung", intent: "Was kostet Entrümpelung?", priority: "high", icon: Trash2 },
  { id: 11, name: "Region Zürich", route: "/umzugsfirmen/zuerich", intent: "Firmen in Zürich", priority: "critical", icon: MapPin },
  { id: 12, name: "Region Bern", route: "/umzugsfirmen/bern", intent: "Firmen in Bern", priority: "high", icon: MapPin },
  { id: 13, name: "Privatumzug Service", route: "/privatumzug", intent: "Normaler Umzug Service", priority: "high", icon: Home },
  { id: 14, name: "Firmenumzug Service", route: "/firmenumzug", intent: "Büroumzug Service", priority: "high", icon: Briefcase },
  { id: 15, name: "Umzugskosten Guide", route: "/umzugskosten", intent: "Was kostet ein Umzug?", priority: "medium", icon: Calculator },
  { id: 16, name: "Checkliste", route: "/umzugscheckliste", intent: "Was muss ich tun?", priority: "medium", icon: List },
  { id: 17, name: "FAQ", route: "/faq", intent: "Häufige Fragen", priority: "medium", icon: HelpCircle },
  { id: 18, name: "Für Firmen (B2B)", route: "/fuer-firmen", intent: "Ich bin Umzugsfirma", priority: "high", icon: Building2 },
  { id: 19, name: "Lagerrechner", route: "/rechner/lager", intent: "Was kostet Einlagerung?", priority: "medium", icon: Warehouse },
  { id: 20, name: "Packservice", route: "/rechner/packservice", intent: "Was kostet Packservice?", priority: "medium", icon: Package },
];

// Gateway definitions from funnel-testing tool
const GATEWAYS = [
  { id: "homepage", name: "Homepage", url: "/", priority: 10, language: "de" },
  { id: "umzug-zuerich", name: "Umzug Zürich", url: "/umzug-zuerich", priority: 10, language: "de" },
  { id: "umzug-bern", name: "Umzug Bern", url: "/umzug-bern", priority: 9, language: "de" },
  { id: "demenagement-geneve", name: "Déménagement Genève", url: "/fr/demenagement-geneve", priority: 9, language: "fr" },
  { id: "trasloco-lugano", name: "Trasloco Lugano", url: "/it/trasloco-lugano", priority: 7, language: "it" },
  { id: "umzug-basel", name: "Umzug Basel", url: "/umzug-basel", priority: 8, language: "de" },
  { id: "umzug-reinigung", name: "Umzug mit Reinigung", url: "/umzug-mit-reinigung", priority: 10, language: "de" },
  { id: "endreinigung", name: "Endreinigung", url: "/endreinigung", priority: 9, language: "de" },
  { id: "entsorgung", name: "Entsorgung & Räumung", url: "/entsorgung", priority: 7, language: "de" },
  { id: "lagerung", name: "Lagerung & Möbellager", url: "/lagerung", priority: 6, language: "de" },
  { id: "klaviertransport", name: "Klaviertransport", url: "/klaviertransport", priority: 5, language: "de" },
  { id: "bueroumzug", name: "Büroumzug", url: "/bueroumzug", priority: 8, language: "de" },
  { id: "guenstiger-umzug", name: "Günstiger Umzug", url: "/guenstiger-umzug", priority: 9, language: "de" },
  { id: "umzug-ausland", name: "Umzug ins Ausland", url: "/umzug-ausland", priority: 7, language: "de" },
  { id: "studentenumzug", name: "Studentenumzug", url: "/studentenumzug", priority: 7, language: "de" },
  { id: "seniorenumzug", name: "Seniorenumzug", url: "/seniorenumzug", priority: 6, language: "de" },
  { id: "preisvergleich", name: "Umzug Preisvergleich", url: "/preisvergleich", priority: 10, language: "de" },
  { id: "umzugskosten", name: "Umzugskosten Rechner", url: "/umzugskosten", priority: 10, language: "de" },
  { id: "offerte-anfragen", name: "Offerte anfragen", url: "/offerte", priority: 10, language: "de" },
  { id: "umzugsfirma-vergleichen", name: "Umzugsfirma vergleichen", url: "/umzugsfirma-vergleichen", priority: 9, language: "de" },
];

interface TestRun {
  runId: string;
  gatewayId: string;
  personaId: string;
  policy: string;
  confidence: number;
  verdict: "success" | "dropout" | "blocker" | "unknown";
  steps: number;
  dropoffReason: string;
  timeMs: number;
}

export default function TestReport() {
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Try to load test results from the funnel-testing tool
    // In production, this would fetch from an API endpoint
    // For now, we use sample data based on the existing reports
    const sampleRuns: TestRun[] = [
      { runId: "2a1ec7f8", gatewayId: "demenagement-geneve", personaId: "francophone-professional", policy: "StrictMain", confidence: 10, verdict: "blocker", steps: 1, dropoffReason: "No clickable CTAs detected", timeMs: 6337 },
      { runId: "39ae421e", gatewayId: "umzug-basel", personaId: "diy-helper", policy: "RealisticWeighted", confidence: 10, verdict: "blocker", steps: 1, dropoffReason: "No clickable CTAs detected", timeMs: 6561 },
      { runId: "ada3b97a", gatewayId: "guenstiger-umzug", personaId: "comparison-queen", policy: "ChaosMonkey", confidence: 10, verdict: "blocker", steps: 1, dropoffReason: "No clickable CTAs detected", timeMs: 8257 },
      { runId: "cf21b36a", gatewayId: "bueroumzug", personaId: "skeptical-senior", policy: "StrictMain", confidence: 10, verdict: "blocker", steps: 1, dropoffReason: "No clickable CTAs detected", timeMs: 4873 },
    ];
    
    setTestRuns(sampleRuns);
    setLoading(false);
  }, []);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge variant="destructive" className="text-xs">🔴 Critical</Badge>;
      case "high":
        return <Badge className="text-xs bg-amber-500 hover:bg-amber-600">🟡 High</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">🟢 Medium</Badge>;
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case "success":
        return <Badge className="bg-green-500 hover:bg-green-600">✓ Success</Badge>;
      case "dropout":
        return <Badge variant="secondary">↩ Dropout</Badge>;
      case "blocker":
        return <Badge variant="destructive">✗ Blocker</Badge>;
      default:
        return <Badge variant="outline">? Unknown</Badge>;
    }
  };

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case "de": return "🇩🇪";
      case "fr": return "🇫🇷";
      case "it": return "🇮🇹";
      default: return "🌐";
    }
  };

  // Statistics
  const totalRuns = testRuns.length;
  const successRuns = testRuns.filter(r => r.verdict === "success").length;
  const blockerRuns = testRuns.filter(r => r.verdict === "blocker").length;
  const avgConfidence = totalRuns > 0 
    ? Math.round(testRuns.reduce((acc, r) => acc + r.confidence, 0) / totalRuns)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 text-primary mx-auto animate-spin" />
          <p className="mt-4 text-muted-foreground">Lade Test-Ergebnisse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              Funnel Testing Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-gestützte Conversion-Optimierung für alle Einstiegspunkte
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-sm px-3 py-1">
              {GATEWAYS.length} Gateways
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {totalRuns} Runs
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{GATEWAYS.length}</p>
                  <p className="text-sm text-muted-foreground">Gateways</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{successRuns}</p>
                  <p className="text-sm text-muted-foreground">Success</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{blockerRuns}</p>
                  <p className="text-sm text-muted-foreground">Blocker</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <TrendingUp className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgConfidence}%</p>
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">20</p>
                  <p className="text-sm text-muted-foreground">Personas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="gateways">Gateways ({GATEWAYS.length})</TabsTrigger>
            <TabsTrigger value="funnels">Core Funnels (20)</TabsTrigger>
            <TabsTrigger value="runs">Test Runs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Starte Tests direkt aus dem Dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2">1. Dispatch</h4>
                    <code className="text-xs bg-muted px-2 py-1 rounded block mb-2">
                      npm run dispatch -- --mode deck
                    </code>
                    <p className="text-xs text-muted-foreground">
                      Weist Gateway + Persona + Policy zu
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2">2. Run Test</h4>
                    <code className="text-xs bg-muted px-2 py-1 rounded block mb-2">
                      npm run run -- --run_id &lt;id&gt;
                    </code>
                    <p className="text-xs text-muted-foreground">
                      Führt Playwright-Test mit AI-Scoring aus
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2">3. Report</h4>
                    <code className="text-xs bg-muted px-2 py-1 rounded block mb-2">
                      npm run report
                    </code>
                    <p className="text-xs text-muted-foreground">
                      Generiert CSV + Markdown Reports
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Architecture Overview */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🎯 Dispatcher</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Deck Mode:</strong> Keine Wiederholungen bis alle durch</p>
                  <p><strong>Random Mode:</strong> Zufällig mit Replacement</p>
                  <p><strong>Weighted Mode:</strong> Nach priority_weight</p>
                  <p className="text-muted-foreground mt-2">
                    Deterministisches Seeding für reproduzierbare Tests
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🤖 Runner (Playwright)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>10-Sekunden-Test:</strong> Title, H1, Trust Signals, CTAs</p>
                  <p><strong>AI Scoring:</strong> GPT-4 Vision für Intent Match</p>
                  <p><strong>Policies:</strong> StrictMain, RealisticWeighted, ChaosMonkey</p>
                  <p className="text-muted-foreground mt-2">
                    Screenshots + Traces pro Step
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Runs */}
            {testRuns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Letzte Test-Runs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {testRuns.slice(0, 5).map((run) => (
                      <div
                        key={run.runId}
                        className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          {run.verdict === "success" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : run.verdict === "blocker" ? (
                            <XCircle className="w-5 h-5 text-red-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                          )}
                          <div>
                            <p className="font-medium">{run.gatewayId}</p>
                            <p className="text-xs text-muted-foreground">
                              {run.personaId} · {run.policy}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{run.confidence}%</span>
                          {getVerdictBadge(run.verdict)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Gateways Tab */}
          <TabsContent value="gateways">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Alle Gateways (Einstiegspunkte)</span>
                  <Badge variant="outline">{GATEWAYS.length} konfiguriert</Badge>
                </CardTitle>
                <CardDescription>
                  Aus tools/funnel-testing/data/gateways.json
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {GATEWAYS.map((gateway, idx) => (
                    <div
                      key={gateway.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground font-mono w-6">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-lg">{getLanguageFlag(gateway.language)}</span>
                        <div>
                          <p className="font-medium">{gateway.name}</p>
                          <code className="text-xs text-muted-foreground">{gateway.url}</code>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          Priority: {gateway.priority}
                        </Badge>
                        <a
                          href={gateway.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Core Funnels Tab */}
          <TabsContent value="funnels">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Core 20 Funnels</span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Play className="w-4 h-4" />
                    Alle testen
                  </Button>
                </CardTitle>
                <CardDescription>
                  Aus docs/testing/CORE_20_FUNNELS.md
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {CORE_FUNNELS.map((funnel) => {
                    const Icon = funnel.icon;
                    return (
                      <div
                        key={funnel.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-sm text-muted-foreground font-mono w-6">
                            {String(funnel.id).padStart(2, '0')}
                          </span>
                          <div className="p-1.5 rounded bg-muted">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{funnel.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{funnel.intent}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getPriorityBadge(funnel.priority)}
                          <code className="text-xs bg-muted px-2 py-1 rounded hidden md:block">
                            {funnel.route}
                          </code>
                          <a
                            href={funnel.route}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Runs Tab */}
          <TabsContent value="runs">
            <Card>
              <CardHeader>
                <CardTitle>Test Run History</CardTitle>
                <CardDescription>
                  Ergebnisse aus tools/funnel-testing/reports/summary.csv
                </CardDescription>
              </CardHeader>
              <CardContent>
                {testRuns.length === 0 ? (
                  <div className="text-center py-12">
                    <Terminal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Keine Test-Runs vorhanden</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Starte das Funnel-Testing-Tool lokal:
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm max-w-md mx-auto text-left">
                      <p>cd tools/funnel-testing</p>
                      <p>npm install</p>
                      <p>npm run dispatch</p>
                      <p>npm run run -- --run_id &lt;id&gt;</p>
                      <p>npm run report</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3">Run ID</th>
                          <th className="text-left py-2 px-3">Gateway</th>
                          <th className="text-left py-2 px-3">Persona</th>
                          <th className="text-left py-2 px-3">Policy</th>
                          <th className="text-right py-2 px-3">Confidence</th>
                          <th className="text-center py-2 px-3">Verdict</th>
                          <th className="text-right py-2 px-3">Steps</th>
                          <th className="text-left py-2 px-3">Dropoff</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testRuns.map((run) => (
                          <tr key={run.runId} className="border-b hover:bg-muted/50">
                            <td className="py-2 px-3 font-mono text-xs">{run.runId}</td>
                            <td className="py-2 px-3">{run.gatewayId}</td>
                            <td className="py-2 px-3">{run.personaId}</td>
                            <td className="py-2 px-3">
                              <Badge variant="outline" className="text-xs">{run.policy}</Badge>
                            </td>
                            <td className="py-2 px-3 text-right">{run.confidence}%</td>
                            <td className="py-2 px-3 text-center">{getVerdictBadge(run.verdict)}</td>
                            <td className="py-2 px-3 text-right">{run.steps}</td>
                            <td className="py-2 px-3 text-xs text-muted-foreground truncate max-w-[200px]">
                              {run.dropoffReason}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Documentation Link */}
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold">📚 Dokumentation</h3>
                <p className="text-sm text-muted-foreground">
                  Vollständige Anleitung im tools/funnel-testing/ Ordner
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="/docs/testing/CORE_20_FUNNELS.md" target="_blank">
                    <FileText className="w-4 h-4 mr-2" />
                    Core 20 Funnels
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://github.com" target="_blank">
                    <FileText className="w-4 h-4 mr-2" />
                    README
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
