import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, XCircle, Clock, FileText, ExternalLink, 
  Play, AlertCircle, Home, Building2, Video, Camera,
  List, Star, Banknote, User, Sparkles, Trash2, MapPin,
  Briefcase, Calculator, HelpCircle, Package, Warehouse
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

interface TestResult {
  title: string;
  status: "passed" | "failed" | "skipped";
  duration: number;
  file: string;
  error?: string;
}

interface TestSuite {
  suites: Array<{
    title: string;
    specs: Array<{
      title: string;
      ok: boolean;
      tests: Array<{
        status: string;
        duration: number;
        errors?: Array<{ message: string }>;
      }>;
    }>;
  }>;
  stats: {
    expected: number;
    unexpected: number;
    skipped: number;
    duration: number;
  };
}

export default function TestReport() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [stats, setStats] = useState({ passed: 0, failed: 0, skipped: 0, duration: 0 });
  const [loading, setLoading] = useState(true);
  const [hasResults, setHasResults] = useState(false);

  useEffect(() => {
    fetch("/test-results/results.json")
      .then((res) => {
        if (!res.ok) throw new Error("Results file not found");
        return res.json();
      })
      .then((data: TestSuite) => {
        const parsed: TestResult[] = [];
        
        data.suites?.forEach((suite) => {
          suite.specs?.forEach((spec) => {
            spec.tests?.forEach((test) => {
              parsed.push({
                title: spec.title,
                status: test.status === "expected" ? "passed" : test.status === "skipped" ? "skipped" : "failed",
                duration: test.duration || 0,
                file: suite.title,
                error: test.errors?.[0]?.message,
              });
            });
          });
        });

        setResults(parsed);
        setHasResults(parsed.length > 0);
        setStats({
          passed: data.stats?.expected || parsed.filter((r) => r.status === "passed").length,
          failed: data.stats?.unexpected || parsed.filter((r) => r.status === "failed").length,
          skipped: data.stats?.skipped || parsed.filter((r) => r.status === "skipped").length,
          duration: data.stats?.duration || 0,
        });
        setLoading(false);
      })
      .catch(() => {
        setHasResults(false);
        setLoading(false);
      });
  }, []);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge variant="destructive" className="text-xs">🔴 Critical</Badge>;
      case "high":
        return <Badge variant="default" className="text-xs bg-amber-500">🟡 High</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">🟢 Medium</Badge>;
    }
  };

  const getFunnelStatus = (funnelName: string) => {
    const result = results.find(r => 
      r.title.toLowerCase().includes(funnelName.toLowerCase()) ||
      r.file.toLowerCase().includes(funnelName.toLowerCase())
    );
    return result?.status || "untested";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "skipped":
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const testedCount = CORE_FUNNELS.filter(f => getFunnelStatus(f.name) !== "untested").length;
  const passedCount = CORE_FUNNELS.filter(f => getFunnelStatus(f.name) === "passed").length;
  const failedCount = CORE_FUNNELS.filter(f => getFunnelStatus(f.name) === "failed").length;

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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Core 20 Funnels - Test Report
            </h1>
            <p className="text-muted-foreground">
              Systematische Validierung aller Customer Journeys
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-sm px-3 py-1">
              {testedCount}/20 getestet
            </Badge>
            {hasResults && (
              <Badge 
                variant={passedCount === testedCount ? "success" : "destructive"}
                className="text-sm px-3 py-1"
              >
                {passedCount} ✓ / {failedCount} ✗
              </Badge>
            )}
          </div>
        </div>

        {/* Info Banner wenn keine Ergebnisse */}
        {!hasResults && (
          <Card className="border-amber-500/50 bg-amber-500/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <FileText className="w-8 h-8 text-amber-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-700 mb-2">Keine automatisierten Testergebnisse</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    Die Playwright E2E-Tests wurden noch nicht ausgeführt. Du kannst die Funnels manuell testen oder die automatisierte Suite lokal starten:
                  </p>
                  <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs">
                    <p className="text-foreground">npx playwright test e2e/all-20-funnels.spec.ts</p>
                    <p className="text-muted-foreground mt-1"># Dann results.json nach public/test-results/ kopieren</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <List className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">20</p>
                  <p className="text-sm text-muted-foreground">Funnels</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">6</p>
                  <p className="text-sm text-muted-foreground">Critical</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Star className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">9</p>
                  <p className="text-sm text-muted-foreground">High Priority</p>
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
                  <p className="text-2xl font-bold">{testedCount}</p>
                  <p className="text-sm text-muted-foreground">Getestet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funnel List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Alle 20 Core Funnels</span>
              <Button variant="outline" size="sm" className="gap-2">
                <Play className="w-4 h-4" />
                Alle testen
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {CORE_FUNNELS.map((funnel) => {
                const status = getFunnelStatus(funnel.name);
                const Icon = funnel.icon;
                
                return (
                  <div
                    key={funnel.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
                      status === "passed"
                        ? "bg-green-500/5 border-green-500/20"
                        : status === "failed"
                        ? "bg-red-500/5 border-red-500/20"
                        : "bg-background border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-2 w-8">
                        <span className="text-sm text-muted-foreground font-mono">
                          {String(funnel.id).padStart(2, '0')}
                        </span>
                      </div>
                      {getStatusIcon(status)}
                      <div className="p-1.5 rounded bg-muted">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{funnel.name}</p>
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

        {/* Test Results Details (if available) */}
        {hasResults && results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Detaillierte Testergebnisse</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      result.status === "passed"
                        ? "bg-green-500/5 border-green-500/20"
                        : result.status === "failed"
                        ? "bg-red-500/5 border-red-500/20"
                        : "bg-muted/50 border-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <p className="font-medium text-foreground">{result.title}</p>
                        <p className="text-sm text-muted-foreground">{result.file}</p>
                        {result.error && (
                          <p className="text-xs text-red-500 mt-1 font-mono max-w-xl truncate">
                            {result.error}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {result.duration}ms
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documentation Link */}
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Test-Dokumentation</h3>
                <p className="text-sm text-muted-foreground">
                  Detaillierte Anleitung für Agent-Testing und KPIs
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/docs/testing/CORE_20_FUNNELS.md" target="_blank">
                  <FileText className="w-4 h-4 mr-2" />
                  Docs öffnen
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
