import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FLOW_CONFIGS, getFlowVariants, getTotalStepsAllFlows } from "@/data/flowConfigs";
import { supabase } from "@/integrations/supabase/client";
import { captureScreenshot as captureScreenshotService } from "@/lib/screenshot-service";
import { SITE_CONFIG } from "@/data/constants";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import {
  Sparkles,
  Download,
  FileText,
  Image,
  Code,
  Zap,
  Package,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Copy,
  Loader2,
  Brain,
  BarChart3,
  Target,
  Lightbulb,
  Rocket,
  Eye,
  Layers,
  Globe,
  MessageSquare
} from "lucide-react";

interface BackgroundJobStatus {
  id: string;
  status: 'pending' | 'processing' | 'running' | 'completed' | 'failed';
  progress: number;
  progressMessage: string;
  downloadUrl?: string;
  error?: string;
}

const ChatGPTOverview = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [backgroundJob, setBackgroundJob] = useState<BackgroundJobStatus | null>(null);

  const flowVariants = getFlowVariants();
  const totalSteps = getTotalStepsAllFlows();

  // Poll for background job status
  const pollJobStatus = useCallback(async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from('export_jobs')
        .select('id, status, progress, progress_message, download_url, error_message')
        .eq('id', jobId)
        .single();

      if (error) return null;

      return {
        id: data.id,
        status: data.status as BackgroundJobStatus['status'],
        progress: data.progress || 0,
        progressMessage: data.progress_message || '',
        downloadUrl: data.download_url || undefined,
        error: data.error_message || undefined,
      };
    } catch (err) {
      return null;
    }
  }, []);

  // Check for pending jobs on mount
  useEffect(() => {
    const checkPendingJobs = async () => {
      const { data } = await supabase
        .from('export_jobs')
        .select('id, status, progress, progress_message, download_url, error_message')
        .eq('job_type', 'ultimate_export')
        .in('status', ['pending', 'processing', 'running'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        const job = data[0];
        setBackgroundJob({
          id: job.id,
          status: job.status as BackgroundJobStatus['status'],
          progress: job.progress || 0,
          progressMessage: job.progress_message || '',
          downloadUrl: job.download_url || undefined,
          error: job.error_message || undefined,
        });
        setIsGenerating(true);
      }
    };
    checkPendingJobs();
  }, []);

  // Poll when there's an active job
  useEffect(() => {
    if (!backgroundJob || backgroundJob.status === 'completed' || backgroundJob.status === 'failed') {
      return;
    }

    const interval = setInterval(async () => {
      const status = await pollJobStatus(backgroundJob.id);
      if (status) {
        setBackgroundJob(status);
        setProgress(status.progress);
        setStatus(status.progressMessage);

        if (status.status === 'completed') {
          toast.success('Ultimate Export fertig! Download bereit.');
          setIsGenerating(false);
          clearInterval(interval);
        } else if (status.status === 'failed') {
          toast.error(`Export fehlgeschlagen: ${status.error || 'Unbekannter Fehler'}`);
          setIsGenerating(false);
          clearInterval(interval);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [backgroundJob, pollJobStatus]);

  // Ultimate 1-Click Export - now runs in background
  const handleUltimateExport = async () => {
    setIsGenerating(true);
    setProgress(0);
    setStatus("Starte Background-Export...");

    try {
      // Create job record first
      const { data: jobData, error: jobError } = await supabase
        .from('export_jobs')
        .insert({
          job_type: 'ultimate_export',
          status: 'pending',
          progress: 0,
          progress_message: 'Job wird gestartet...',
          include_sub_variants: true,
        })
        .select()
        .single();

      if (jobError) throw jobError;

      const jobId = jobData.id;
      setBackgroundJob({
        id: jobId,
        status: 'pending',
        progress: 0,
        progressMessage: 'Job wird gestartet...',
      });

      // Trigger the edge function (fire and forget)
      supabase.functions.invoke('background-export', {
        body: {
          jobId,
          baseUrl: SITE_CONFIG.url.replace(/\/$/, ''),
          includeSubVariants: true,
        },
      }).catch(err => {
        console.error('Edge function error:', err);
      });

      toast.success('Background-Export gestartet. Du kannst die Seite schliessen oder warten.');
    } catch (error) {
      console.error('Ultimate export failed:', error);
      toast.error('Export konnte nicht gestartet werden');
      setIsGenerating(false);
    }
  };

  // Download the completed export
  const handleDownload = () => {
    if (backgroundJob?.downloadUrl) {
      window.open(backgroundJob.downloadUrl, '_blank');
    }
  };

  // Clear completed job
  const clearJob = () => {
    setBackgroundJob(null);
    setIsGenerating(false);
    setProgress(0);
    setStatus('');
  };


  // Helper functions for prompts
  const generateStepPrompt = (flow: any, stepConfig: any, meta: any) => `# Step ${stepConfig.step}: ${stepConfig.name}

**Flow:** ${flow.label}
**URL:** ${meta.url}
**Beschreibung:** ${stepConfig.description}

## Dateien in diesem Ordner:
- desktop.png - Desktop Screenshot ${meta.hasDesktop ? '✓' : '✗'}
- mobile.png - Mobile Screenshot ${meta.hasMobile ? '✓' : '✗'}
- rendered.html - HTML (${meta.hasHtml ? `${(meta.htmlLength/1024).toFixed(1)}KB` : 'N/A'})
- meta.json - Metadaten

## Analyse-Aufgaben:
1. **Desktop UX** - Layout, Hierarchie, CTA
2. **Mobile UX** - Touch, Scroll, Lesbarkeit
3. **Friction** - Was stoppt den User?
4. **Trust** - Vertrauenssignale
5. **Copy** - Klarheit

## Gewünschte Ausgabe:
- 3 Stärken, 3 Schwächen, 3 Verbesserungen
`;

  const generateFlowPrompt = (flow: any, steps: any[]) => `# Flow-Analyse: ${flow.label}

**Path:** ${flow.path}
**Beschreibung:** ${flow.description}
**Steps:** ${steps.length}

## Step-Übersicht:
${steps.map(s => `- Step ${s.step}: ${s.name} (D: ${s.hasDesktop ? '✓' : '✗'}, M: ${s.hasMobile ? '✓' : '✗'}, H: ${s.hasHtml ? '✓' : '✗'})`).join('\n')}

## Analyse:
1. Ist der Flow logisch?
2. Step-by-Step UX
3. Übergänge klar?
4. Mobile Experience?
5. Conversion-Optimierung?

## Output:
- Flow-Score (1-10)
- Top 3 Stärken/Schwächen
- Top 5 Verbesserungen
`;

  const generateMasterPrompt = (data: any) => `# 🚀 Ultimate Flow-Analyse - ${data.project}

## Export: ${data.exportDate}
## Base URL: ${data.baseUrl}
## Flows: ${data.totalFlows} | Steps: ${data.totalSteps}

---

Du bist ein UX-Experte. Analysiere ALLE Flows und erstelle V10 "Ultimate Flow".

## Alle Flows:
${Object.values(data.flows).map((f: any) => `
### ${f.label}
- Path: ${f.path}
- Steps: ${f.totalSteps}
- Beschreibung: ${f.description}
${f.steps.map((s: any) => `  - Step ${s.step}: ${s.name}`).join('\n')}
`).join('\n')}

---

## Aufgaben:

### 1. Flow-by-Flow Analyse
Für jeden Flow: Score (1-10), Stärken, Schwächen

### 2. Step-Vergleich
Welcher Flow hat den besten Step 1? Step 2? etc.

### 3. Best Practices
Top 10 Best Practices aus allen Flows

### 4. V10 "Ultimate Flow"
Kombiniere die besten Elemente zu einem perfekten Flow

### 5. Roadmap
Priorisierte Implementierung

---

**Struktur:** Jeder Flow-Ordner enthält step-1/, step-2/, etc. mit desktop.png, mobile.png, rendered.html
`;

  const generateQuickComparePrompt = (data: any) => `# Quick Compare - Alle ${data.totalFlows} Flows

## Schnell-Fragen:
1. Welcher Flow hat die beste UX?
2. Welcher ist am schnellsten?
3. Welcher wirkt am vertrauenswürdigsten?
4. Welcher hat das beste Mobile-Design?
5. Welcher ist am innovativsten?

## Ranking erstellen (1-${data.totalFlows}):
- Conversion-Potenzial
- User Experience
- Geschwindigkeit
- Trust
- Innovation

## Empfehlung:
**Favorit für Production:** ___
**Begründung:** ___
`;

  const generateV10SynthesisPrompt = (data: any) => `# V10 "Ultimate Flow" Synthese

## Ziel:
Erstelle V10 durch Kombination der besten Elemente aller ${data.totalFlows} Flows.

## Analyse-Framework:
1. Welcher Flow hat den besten Einstieg? → Übernehmen
2. Welcher Flow hat die beste Dateneingabe? → Übernehmen
3. Welcher Flow hat die beste Firmenauswahl? → Übernehmen
4. Welcher Flow hat den besten Abschluss? → Übernehmen

## V10 Anforderungen:
- ⏱️ Unter 2 Minuten komplett
- 📱 Mobile-First
- 🛡️ Maximales Vertrauen
- ⚡ Zero Friction
- 🎯 Höchste Conversion

## Lieferformat:
1. Step-by-Step Beschreibung
2. Wireframe-Beschreibung pro Step
3. Begründung (welches Element von welchem Flow)
4. A/B-Test Roadmap
`;

  const generateReadme = (data: any) => `# Ultimate ChatGPT Export

## ${data.project}
**Export:** ${data.exportDate}
**Flows:** ${data.totalFlows}
**Total Steps:** ${data.totalSteps}

## Struktur:
\`\`\`
${Object.keys(data.flows).map(k => `${k}/
  ├── flow-info.json
  ├── flow-prompt.md
${data.flows[k].steps.map((s: any) => `  └── step-${s.step}/
      ├── desktop.png
      ├── mobile.png
      ├── rendered.html
      └── meta.json`).join('\n')}`).join('\n')}
MASTER-PROMPT.md
QUICK-COMPARE.md
V10-SYNTHESIS.md
README.md
IMPROVEMENTS.md
\`\`\`

## Verwendung:
1. ZIP zu ChatGPT/Claude hochladen
2. MASTER-PROMPT.md für Gesamtanalyse
3. QUICK-COMPARE.md für schnellen Vergleich
4. V10-SYNTHESIS.md für Ultimate Flow Design
5. flow-prompt.md für einzelne Flows
`;

  const generateImprovements = () => `# 🎯 10 Zusätzliche Verbesserungsvorschläge

## Für maximale Conversion und UX-Perfektion:

### 1. 🎬 Session Recording Integration
Implementiere Hotjar/FullStory-ähnliche Session Recordings direkt im Admin-Tool.
Ermöglicht: Echte User-Journey-Analyse statt nur Screenshots.

### 2. 🤖 Automatische A/B-Test-Auswertung
AI analysiert automatisch welche Flow-Variante besser performt.
Liefert statistische Signifikanz und klare Empfehlungen.

### 3. 📊 Real-Time Conversion Tracking per Step
Zeige Drop-off-Rate pro Step in Echtzeit.
Identifiziere sofort den problematischsten Step.

### 4. 🔥 Heatmap-Overlay für Screenshots
Generiere synthetische Heatmaps basierend auf UX-Best-Practices.
Zeige wo User vermutlich klicken/scrollen.

### 5. 🌍 Multi-Language Flow Comparison
Vergleiche DE/FR/IT-Versionen automatisch.
Identifiziere Inkonsistenzen zwischen Sprachversionen.

### 6. 📱 Device-Specific Optimierung
Separate Analyse für iOS vs Android vs Desktop.
Geräte-spezifische Empfehlungen.

### 7. ⚡ Lighthouse Integration pro Step
Performance-Score für jeden einzelnen Step.
Identifiziere langsame Steps die Conversion killen.

### 8. 🎯 Competitor Flow Capture
Erfasse automatisch Competitor-Flows (Movu, MoveAgain, etc.).
Side-by-side Vergleich.

### 9. 📝 Automatische Copy-Analyse
AI analysiert alle Texte auf Conversion-Potenzial.
Schlägt optimierte Headlines/CTAs vor.

### 10. 🔄 Continuous Monitoring
Tägliche automatische Captures mit Diff-Detection.
Alert bei unbeabsichtigten UI-Änderungen.

---

## Implementierungs-Priorität:

| # | Feature | Impact | Effort | Priority |
|---|---------|--------|--------|----------|
| 3 | Real-Time Conversion | 🔥🔥🔥 | Medium | P0 |
| 1 | Session Recording | 🔥🔥🔥 | High | P1 |
| 7 | Lighthouse/Step | 🔥🔥 | Low | P1 |
| 2 | Auto A/B Auswertung | 🔥🔥🔥 | Medium | P1 |
| 9 | Copy-Analyse | 🔥🔥 | Medium | P2 |
| 8 | Competitor Capture | 🔥🔥 | Medium | P2 |
| 4 | Heatmap-Overlay | 🔥 | Medium | P3 |
| 10 | Continuous Monitoring | 🔥🔥 | Low | P2 |
| 5 | Multi-Language | 🔥 | Medium | P3 |
| 6 | Device-Specific | 🔥 | High | P3 |
`;

  // Stats for display
  const analysisCapabilities = [
    { icon: Image, label: "Screenshots", value: `${totalSteps * 2}+`, desc: "Desktop + Mobile pro Step" },
    { icon: Code, label: "HTML Captures", value: `${totalSteps}+`, desc: "Rendered HTML pro Step" },
    { icon: FileText, label: "AI Prompts", value: "15+", desc: "Spezialisierte Analyse-Prompts" },
    { icon: Layers, label: "Flow Varianten", value: flowVariants.length.toString(), desc: "Unterschiedliche Wizard-Flows" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 border">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">ChatGPT Analyse Suite</h1>
                <p className="text-muted-foreground">Alles was wir für KI-Analyse bereitstellen</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {analysisCapabilities.map((stat, i) => (
                <Card key={i} className="bg-background/50 backdrop-blur">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <stat.icon className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Ultimate Export Button */}
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-background">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary text-primary-foreground">
                  <Rocket className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">🚀 Ultimate 1-Click Export</h2>
                  <p className="text-muted-foreground">
                    Alle {flowVariants.length} Flows × {totalSteps} Steps = Screenshots, HTML, Prompts in einem ZIP
                  </p>
                  {backgroundJob?.status === 'completed' && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      ✓ Export fertig - Download bereit!
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {backgroundJob?.status === 'completed' && backgroundJob.downloadUrl ? (
                  <>
                    <Button 
                      size="lg" 
                      onClick={handleDownload}
                      className="min-w-[180px] h-14 text-lg"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Herunterladen
                    </Button>
                    <Button 
                      variant="outline"
                      size="lg" 
                      onClick={clearJob}
                      className="h-14"
                    >
                      Neu starten
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="lg" 
                    onClick={handleUltimateExport}
                    disabled={isGenerating}
                    className="min-w-[200px] h-14 text-lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {Math.round(progress)}%
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-5 w-5" />
                        Alles Exportieren
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            {isGenerating && (
              <div className="mt-4 space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  {status || 'Läuft im Hintergrund... Du kannst die Seite schliessen.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Flow Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Alle {flowVariants.length} Flow-Varianten
            </CardTitle>
            <CardDescription>
              Jede Variante hat unterschiedliche Steps und Ansätze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {flowVariants.map((flow) => (
                <Card key={flow.id} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${flow.color}`} />
                  <CardContent className="p-4 pl-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{flow.label}</h3>
                      <Badge variant="secondary">{flow.steps.length} Steps</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{flow.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {flow.steps.map((step) => (
                        <Badge key={step.step} variant="outline" className="text-xs">
                          {step.step}. {step.name}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => window.open(flow.path, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Flow öffnen
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Verfügbare Analyse-Tools</CardTitle>
            <CardDescription>Alle Werkzeuge die wir für ChatGPT-Analyse bereitstellen</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="exports" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="exports">Exports</TabsTrigger>
                <TabsTrigger value="prompts">Prompts</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="automation">Automation</TabsTrigger>
              </TabsList>

              <TabsContent value="exports" className="mt-4 space-y-3">
                {[
                  { icon: Package, title: "Ultimate Export", desc: "Alle Flows komplett mit allen Steps", action: () => handleUltimateExport() },
                  { icon: Image, title: "Screenshot Package", desc: "Desktop + Mobile Screenshots aller Steps", action: () => navigate('/admin/tools') },
                  { icon: Code, title: "HTML Captures", desc: "Gerenderte HTML aller Steps", action: () => navigate('/admin/tools') },
                  { icon: FileText, title: "Manuelles Package", desc: "Flexibel wählbare Inhalte", action: () => navigate('/admin/tools') },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={item.action}>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="prompts" className="mt-4 space-y-3">
                {[
                  { title: "Master-Prompt", desc: "Komplette Analyse aller Flows", included: true },
                  { title: "Quick Compare", desc: "Schneller Vergleich", included: true },
                  { title: "V10 Synthesis", desc: "Ultimate Flow erstellen", included: true },
                  { title: "Step-Prompts", desc: "Pro Step individuell", included: true },
                  { title: "Flow-Prompts", desc: "Pro Flow individuell", included: true },
                  { title: "SEO Audit", desc: "SEO-spezifische Analyse", included: true },
                  { title: "Accessibility Audit", desc: "Barrierefreiheit prüfen", included: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Badge variant={item.included ? "default" : "secondary"}>
                      {item.included ? <CheckCircle className="h-3 w-3" /> : "Optional"}
                    </Badge>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="tools" className="mt-4 space-y-3">
                {[
                  { icon: Eye, title: "Screenshot Machine", desc: "Desktop/Mobile/Tablet Captures", path: '/admin/tools' },
                  { icon: Code, title: "SEO HTML Analyzer", desc: "Raw vs Rendered HTML", path: '/admin/tools' },
                  { icon: Target, title: "Regression Testing", desc: "Baseline-Vergleiche", path: '/admin/tools' },
                  { icon: BarChart3, title: "AutoFlow Dashboard", desc: "Automatische Flow-Analyse", path: '/admin/tools' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(item.path)}>
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="automation" className="mt-4 space-y-3">
                {[
                  { title: "Scheduled Monitoring", desc: "Tägliche automatische Captures", status: "Aktiv" },
                  { title: "Regression Alerts", desc: "Email bei UI-Änderungen", status: "Konfigurierbar" },
                  { title: "AutoFlow AI", desc: "KI-gestützte Flow-Analyse", status: "Beta" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 10 Additional Improvements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              10 Zusätzliche Verbesserungsvorschläge
            </CardTitle>
            <CardDescription>Für maximale Conversion und UX-Perfektion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { num: 1, title: "Session Recording", desc: "Echte User-Journeys aufzeichnen", impact: "🔥🔥🔥" },
                { num: 2, title: "Auto A/B-Auswertung", desc: "KI analysiert welche Variante gewinnt", impact: "🔥🔥🔥" },
                { num: 3, title: "Real-Time Conversion", desc: "Drop-off pro Step in Echtzeit", impact: "🔥🔥🔥" },
                { num: 4, title: "Heatmap-Overlay", desc: "Synthetische Klick-Heatmaps", impact: "🔥🔥" },
                { num: 5, title: "Multi-Language Compare", desc: "DE/FR/IT automatisch vergleichen", impact: "🔥" },
                { num: 6, title: "Device-Specific", desc: "iOS vs Android vs Desktop", impact: "🔥" },
                { num: 7, title: "Lighthouse/Step", desc: "Performance pro Step messen", impact: "🔥🔥" },
                { num: 8, title: "Competitor Capture", desc: "Movu, MoveAgain automatisch erfassen", impact: "🔥🔥" },
                { num: 9, title: "Copy-Analyse", desc: "KI optimiert Headlines/CTAs", impact: "🔥🔥" },
                { num: 10, title: "Continuous Monitoring", desc: "Tägliche Diff-Detection", impact: "🔥🔥" },
              ].map((item) => (
                <div key={item.num} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {item.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{item.title}</p>
                      <span className="text-xs">{item.impact}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Button variant="outline" className="h-auto py-4" onClick={() => navigate('/admin/tools')}>
            <div className="text-left">
              <p className="font-semibold">→ Tools Dashboard</p>
              <p className="text-xs text-muted-foreground">Alle Analyse-Tools</p>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-4" onClick={() => window.open('/admin/tools', '_blank')}>
            <div className="text-left">
              <p className="font-semibold">→ Neues Tab</p>
              <p className="text-xs text-muted-foreground">Tools in neuem Tab öffnen</p>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-4" onClick={() => {
            navigator.clipboard.writeText(window.location.origin + '/admin/chatgpt-overview');
            toast.success('URL kopiert!');
          }}>
            <div className="text-left">
              <p className="font-semibold">→ URL kopieren</p>
              <p className="text-xs text-muted-foreground">Diese Seite teilen</p>
            </div>
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ChatGPTOverview;
