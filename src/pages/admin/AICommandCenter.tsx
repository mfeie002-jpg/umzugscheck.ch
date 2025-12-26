import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminHelpButton } from "@/components/admin/AdminHelpSystem";
import { FlowFeedbackVariants } from "@/components/admin/FlowFeedbackVariants";
import { AIFlowGenerator } from "@/components/admin/AIFlowGenerator";
import { FLOW_CONFIGS, getFlowVariants, getTotalStepsAllFlows } from "@/data/flowConfigs";
import { supabase } from "@/integrations/supabase/client";
import { captureScreenshot as captureScreenshotService } from "@/lib/screenshot-service";
import { SITE_CONFIG } from "@/data/constants";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import {
  Brain,
  Rocket,
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
  BarChart3,
  Target,
  Lightbulb,
  Eye,
  Layers,
  Globe,
  MessageSquare,
  Camera,
  GitCompare,
  Clock,
  Sparkles,
  Send,
  Bot,
  Play,
  FileCode,
  HelpCircle,
  BookOpen,
  Wand2
} from "lucide-react";

// ============================================================================
// AI COMMAND CENTER - VORZEIGEMODEL
// ============================================================================

const AICommandCenter = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [quickUrl, setQuickUrl] = useState("");

  const flowVariants = getFlowVariants();
  const totalSteps = getTotalStepsAllFlows();

  // ============================================================================
  // ONE-CLICK ULTIMATE EXPORT
  // ============================================================================
  const handleUltimateExport = async () => {
    setIsGenerating(true);
    setProgress(0);
    setStatus("Starte Ultimate Export...");

    try {
      const zip = new JSZip();
      const exportDate = new Date().toISOString().split('T')[0];
      const rootFolder = zip.folder(`ultimate-ai-export-${exportDate}`);
      if (!rootFolder) throw new Error("Could not create ZIP folder");

      const baseUrl = SITE_CONFIG.url.replace(/\/$/, '');
      let currentOp = 0;
      const totalOps = flowVariants.reduce((sum, f) => sum + f.steps.length * 3, 0) + 10;

      const masterData: any = {
        exportDate: new Date().toISOString(),
        baseUrl,
        project: SITE_CONFIG.name,
        totalFlows: flowVariants.length,
        totalSteps,
        flows: {},
      };

      // Process each flow
      for (const flow of flowVariants) {
        const flowFolder = rootFolder.folder(flow.id);
        if (!flowFolder) continue;

        const flowData: any = {
          id: flow.id,
          label: flow.label,
          path: flow.path,
          description: flow.description,
          totalSteps: flow.steps.length,
          steps: [],
        };

        for (const stepConfig of flow.steps) {
          const stepFolder = flowFolder.folder(`step-${stepConfig.step}`);
          if (!stepFolder) continue;

          setStatus(`${flow.label} - Step ${stepConfig.step}/${flow.steps.length}...`);

          const captureUrl = `${baseUrl}${flow.path}?uc_capture=1&uc_step=${stepConfig.step}&uc_flow=${flow.id.replace('umzugsofferten-', 'v').replace('umzugsofferten', 'v1')}`;

          // Desktop Screenshot
          currentOp++;
          setProgress((currentOp / totalOps) * 100);
          let desktopScreenshot: string | null = null;
          try {
            const result = await captureScreenshotService({
              url: captureUrl,
              dimension: '1920x1080',
              delay: 30000,
              format: 'png',
              fullPage: false,
              noCache: true,
            });
            if (result.success && result.image) {
              desktopScreenshot = result.image;
              const base64Data = result.image.replace(/^data:image\/\w+;base64,/, '');
              stepFolder.file('desktop.png', base64Data, { base64: true });
            }
          } catch (e) {
            console.error('Desktop screenshot failed:', e);
          }

          // Mobile Screenshot
          currentOp++;
          setProgress((currentOp / totalOps) * 100);
          let mobileScreenshot: string | null = null;
          try {
            const result = await captureScreenshotService({
              url: captureUrl,
              dimension: '390x844',
              delay: 30000,
              format: 'png',
              fullPage: false,
              noCache: true,
            });
            if (result.success && result.image) {
              mobileScreenshot = result.image;
              const base64Data = result.image.replace(/^data:image\/\w+;base64,/, '');
              stepFolder.file('mobile.png', base64Data, { base64: true });
            }
          } catch (e) {
            console.error('Mobile screenshot failed:', e);
          }

          // HTML
          currentOp++;
          setProgress((currentOp / totalOps) * 100);
          let html: string | null = null;
          try {
            const { data } = await supabase.functions.invoke('capture-rendered-html', {
              body: { url: captureUrl, waitFor: 5000, formats: ['html'] }
            });
            if (data?.html) {
              html = data.html;
              stepFolder.file('rendered.html', html);
            }
          } catch (e) {
            console.error('HTML capture failed:', e);
          }

          const stepMeta = {
            step: stepConfig.step,
            name: stepConfig.name,
            description: stepConfig.description,
            url: captureUrl,
            hasDesktop: !!desktopScreenshot,
            hasMobile: !!mobileScreenshot,
            hasHtml: !!html,
            htmlLength: html?.length || 0,
            capturedAt: new Date().toISOString(),
          };
          stepFolder.file('meta.json', JSON.stringify(stepMeta, null, 2));
          stepFolder.file('STEP_PROMPT.md', generateStepPrompt(flow, stepConfig, stepMeta));

          flowData.steps.push(stepMeta);
        }

        flowFolder.file('FLOW_INFO.json', JSON.stringify(flowData, null, 2));
        flowFolder.file('FLOW_PROMPT.md', generateFlowPrompt(flow, flowData.steps));

        masterData.flows[flow.id] = flowData;
      }

      setStatus("Generiere Master-Prompts...");
      currentOp += 5;
      setProgress((currentOp / totalOps) * 100);

      rootFolder.file('ALL_FLOWS.json', JSON.stringify(masterData, null, 2));
      rootFolder.file('MASTER_PROMPT.md', generateMasterPrompt(masterData));
      rootFolder.file('QUICK_COMPARE.md', generateQuickComparePrompt(masterData));
      rootFolder.file('V10_SYNTHESIS.md', generateV10SynthesisPrompt(masterData));
      rootFolder.file('README.md', generateReadme(masterData));
      rootFolder.file('IMPROVEMENTS.md', generateImprovements());

      setStatus("ZIP wird erstellt...");
      setProgress(98);
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `ultimate-ai-export-${exportDate}.zip`);

      setProgress(100);
      setStatus("");
      toast.success(`Export fertig! ${flowVariants.length} Flows, ${totalSteps} Steps`);
    } catch (error) {
      console.error('Ultimate export failed:', error);
      toast.error('Export fehlgeschlagen');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper functions for prompts
  const generateStepPrompt = (flow: any, stepConfig: any, meta: any) => `# Step ${stepConfig.step}: ${stepConfig.name}

**Flow:** ${flow.label}
**URL:** ${meta.url}
**Beschreibung:** ${stepConfig.description}

## Dateien:
- desktop.png ${meta.hasDesktop ? '✓' : '✗'}
- mobile.png ${meta.hasMobile ? '✓' : '✗'}
- rendered.html (${meta.hasHtml ? `${(meta.htmlLength/1024).toFixed(1)}KB` : 'N/A'})

## Analyse:
1. Desktop UX - Layout, Hierarchie, CTA
2. Mobile UX - Touch, Scroll, Lesbarkeit
3. Friction - Was stoppt den User?
4. Trust - Vertrauenssignale
5. Copy - Klarheit

**Output:** 3 Stärken, 3 Schwächen, 3 Verbesserungen
`;

  const generateFlowPrompt = (flow: any, steps: any[]) => `# Flow: ${flow.label}

**Path:** ${flow.path}
**Steps:** ${steps.length}
**Beschreibung:** ${flow.description}

## Steps:
${steps.map(s => `- Step ${s.step}: ${s.name} (D: ${s.hasDesktop ? '✓' : '✗'}, M: ${s.hasMobile ? '✓' : '✗'}, H: ${s.hasHtml ? '✓' : '✗'})`).join('\n')}

## Analyse:
1. Logischer Aufbau?
2. Übergänge klar?
3. Mobile Experience?
4. Conversion-Potenzial?

**Output:** Score (1-10), Top 3 Stärken/Schwächen, Top 5 Verbesserungen
`;

  const generateMasterPrompt = (data: any) => `# 🚀 Ultimate Flow-Analyse

## ${data.project}
**Export:** ${data.exportDate}
**Flows:** ${data.totalFlows} | **Steps:** ${data.totalSteps}

---

Du bist ein Elite-UX-Analyst. Analysiere ALLE Flows und erstelle V10 "Ultimate Flow".

## Flows:
${Object.values(data.flows).map((f: any) => `
### ${f.label}
- Path: ${f.path}
- Steps: ${f.totalSteps}
${f.steps.map((s: any) => `  - Step ${s.step}: ${s.name}`).join('\n')}
`).join('\n')}

## Aufgaben:
1. **Flow-by-Flow Analyse** - Score (1-10), Stärken, Schwächen
2. **Step-Vergleich** - Bester Step 1? Bester Step 2?
3. **Best Practices** - Top 10 aus allen Flows
4. **V10 Design** - Kombiniere die besten Elemente
5. **Roadmap** - Priorisierte Implementierung

**Struktur:** Jeder Flow-Ordner enthält step-X/ mit desktop.png, mobile.png, rendered.html
`;

  const generateQuickComparePrompt = (data: any) => `# Quick Compare - ${data.totalFlows} Flows

## Schnell-Ranking:
1. Beste UX?
2. Schnellster Flow?
3. Vertrauenswürdigster?
4. Bestes Mobile-Design?
5. Innovativster?

## Empfehlung:
**Favorit für Production:** ___
**Begründung:** ___
`;

  const generateV10SynthesisPrompt = (data: any) => `# V10 "Ultimate Flow" Synthese

## Ziel:
Kombiniere beste Elemente aller ${data.totalFlows} Flows zu V10.

## Analyse:
1. Bester Einstieg? → Übernehmen
2. Beste Dateneingabe? → Übernehmen  
3. Beste Firmenauswahl? → Übernehmen
4. Bester Abschluss? → Übernehmen

## V10 Anforderungen:
- ⏱️ Unter 2 Minuten
- 📱 Mobile-First
- 🛡️ Maximales Vertrauen
- ⚡ Zero Friction
- 🎯 Höchste Conversion

## Output:
1. Step-by-Step Beschreibung
2. Wireframe-Beschreibung
3. Begründung pro Element
4. A/B-Test Roadmap
`;

  const generateReadme = (data: any) => `# Ultimate AI Export

## ${data.project}
**Export:** ${data.exportDate}
**Flows:** ${data.totalFlows} | **Steps:** ${data.totalSteps}

## Verwendung:
1. ZIP zu ChatGPT/Claude hochladen
2. MASTER_PROMPT.md für Gesamtanalyse
3. QUICK_COMPARE.md für Ranking
4. V10_SYNTHESIS.md für Ultimate Flow
5. Flow-Ordner für einzelne Analysen

## Struktur:
\`\`\`
${Object.keys(data.flows).map(k => `${k}/
  ├── FLOW_INFO.json
  ├── FLOW_PROMPT.md
  └── step-X/ (desktop.png, mobile.png, rendered.html)`).join('\n')}
\`\`\`
`;

  const generateImprovements = () => `# 🎯 10 Zusätzliche Verbesserungen

## High-Impact Ideas:

### 1. 🎬 Session Recording
Hotjar-ähnliche Session Recordings im Admin.

### 2. 🤖 Auto A/B-Auswertung
AI analysiert welche Variante performt.

### 3. 📊 Real-Time Drop-off
Drop-off pro Step in Echtzeit.

### 4. 🔥 Heatmap-Overlay
Synthetische Heatmaps für Screenshots.

### 5. 🌍 Multi-Language Compare
DE/FR/IT automatisch vergleichen.

### 6. 📱 Device-Specific
iOS vs Android vs Desktop Analyse.

### 7. ⚡ Lighthouse pro Step
Performance-Score pro Step.

### 8. 🎯 Competitor Capture
Competitor-Flows automatisch erfassen.

### 9. 📝 Copy-Analyse
AI analysiert alle Texte.

### 10. 🔄 Continuous Monitoring
Tägliche Captures mit Diff-Detection.

## Priorität:
| # | Feature | Impact | Priority |
|---|---------|--------|----------|
| 3 | Real-Time Drop-off | 🔥🔥🔥 | P0 |
| 7 | Lighthouse/Step | 🔥🔥 | P1 |
| 2 | Auto A/B | 🔥🔥🔥 | P1 |
`;

  // Stats
  const capabilities = [
    { icon: Image, label: "Screenshots", value: `${totalSteps * 2}+`, desc: "Desktop + Mobile" },
    { icon: Code, label: "HTML", value: `${totalSteps}+`, desc: "Rendered HTML" },
    { icon: FileText, label: "Prompts", value: "15+", desc: "Spezialisiert" },
    { icon: Layers, label: "Flows", value: flowVariants.length.toString(), desc: "Varianten" },
  ];

  const quickActions = [
    { 
      icon: Rocket, 
      label: "Ultimate Export", 
      desc: "Alles in einem ZIP",
      action: handleUltimateExport,
      primary: true 
    },
    { 
      icon: Camera, 
      label: "Screenshot Machine", 
      href: "/admin/screenshots",
      desc: "Einzel/Bulk Capture"
    },
    { 
      icon: Layers, 
      label: "Auto-Flow", 
      href: "/admin/tools",
      desc: "Alle Flows erfassen"
    },
    { 
      icon: Copy, 
      label: "Prompt Library", 
      href: "/admin/ai-export",
      desc: "7 Analyse-Prompts"
    },
    { 
      icon: GitCompare, 
      label: "Regression Tests", 
      href: "/admin/tools?tab=regression",
      desc: "Visual Diff"
    },
    { 
      icon: Clock, 
      label: "Monitoring", 
      href: "/admin/tools?tab=monitoring",
      desc: "Scheduled Jobs"
    },
  ];

  const toolCategories = [
    {
      title: "📸 Capture & Evidence",
      desc: "Screenshots, HTML, Visual Proof",
      tools: [
        { name: "Screenshot Machine", href: "/admin/screenshots", icon: Camera },
        { name: "Auto-Flow Capture", href: "/admin/tools", icon: Layers },
        { name: "HTML Analyzer", href: "/admin/tools?tab=seo", icon: FileCode },
        { name: "Regression Tests", href: "/admin/tools?tab=regression", icon: GitCompare },
      ]
    },
    {
      title: "🧠 AI & Export",
      desc: "ChatGPT-Ready Packages",
      tools: [
        { name: "1-Click Export", href: "/admin/chatgpt", icon: Rocket },
        { name: "Prompt Library", href: "/admin/ai-export", icon: Copy },
        { name: "Code Export", href: "/admin/code-export", icon: Download },
      ]
    },
    {
      title: "📊 Analytics",
      desc: "Daten & Insights",
      tools: [
        { name: "Funnel Analytics", href: "/admin/funnel", icon: Target },
        { name: "A/B Tests", href: "/admin/ab-testing", icon: Sparkles },
        { name: "ML Analytics", href: "/admin/ml-analytics", icon: Bot },
      ]
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 border">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">AI Command Center</h1>
                  <p className="text-muted-foreground">Alles für KI-Analyse – 1 Klick entfernt</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/admin/capabilities">
                  <Button variant="outline" size="sm" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Alle Funktionen
                  </Button>
                </Link>
                <AdminHelpButton section="ai-command" />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {capabilities.map((stat, i) => (
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

        {/* Main Tabs */}
        <Tabs defaultValue="export" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 max-w-xl">
            <TabsTrigger value="export" className="gap-2">
              <Rocket className="h-4 w-4" />
              Export
            </TabsTrigger>
            <TabsTrigger value="variants" className="gap-2">
              <GitCompare className="h-4 w-4" />
              Varianten
            </TabsTrigger>
            <TabsTrigger value="generator" className="gap-2">
              <Wand2 className="h-4 w-4" />
              Generator
            </TabsTrigger>
            <TabsTrigger value="tools" className="gap-2">
              <Layers className="h-4 w-4" />
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="variants" className="space-y-6">
            <FlowFeedbackVariants />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            {/* Ultimate Export Button */}
            <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-background">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary text-primary-foreground">
                  <Rocket className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">🚀 1-Click Ultimate Export</h2>
                  <p className="text-muted-foreground">
                    {flowVariants.length} Flows × {totalSteps} Steps = Screenshots + HTML + Prompts
                  </p>
                </div>
              </div>
              <Button 
                size="lg" 
                onClick={handleUltimateExport}
                disabled={isGenerating}
                className="min-w-[200px] h-14 text-lg gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {Math.round(progress)}%
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    Export für ChatGPT
                  </>
                )}
              </Button>
            </div>
            
            {isGenerating && (
              <div className="mt-4">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">{status}</p>
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
              {totalSteps} Steps total für komplette Analyse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-3">
              {flowVariants.map((flow) => (
                <div 
                  key={flow.id}
                  className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className={flow.color.replace('bg-', 'border-').replace('-500', '-500/50')}>
                      {flow.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{flow.steps.length} Steps</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{flow.description}</p>
                  <div className="mt-2 text-xs text-muted-foreground/70">
                    {flow.steps.map(s => s.name).join(' → ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 10 Ideas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              10 Zusätzliche Power-Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { icon: "🎬", title: "Session Recording", desc: "User-Journey aufnehmen" },
                { icon: "🤖", title: "Auto A/B-Auswertung", desc: "AI wertet Tests aus" },
                { icon: "📊", title: "Real-Time Drop-off", desc: "Live Funnel-Daten" },
                { icon: "🔥", title: "Heatmap-Overlay", desc: "Klick-Vorhersage" },
                { icon: "🌍", title: "Multi-Language", desc: "DE/FR/IT vergleichen" },
                { icon: "📱", title: "Device-Specific", desc: "iOS vs Android Analyse" },
                { icon: "⚡", title: "Lighthouse/Step", desc: "Performance pro Step" },
                { icon: "🎯", title: "Competitor Capture", desc: "Wettbewerber analysieren" },
                { icon: "📝", title: "Copy-Analyse", desc: "AI optimiert Texte" },
                { icon: "🔄", title: "Continuous Monitoring", desc: "Tägliche Checks" },
              ].map((idea, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <span className="text-2xl">{idea.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{idea.title}</div>
                    <div className="text-xs text-muted-foreground">{idea.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </TabsContent>

          <TabsContent value="generator">
            <AIFlowGenerator />
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map((action, i) => (
                action.href ? (
                  <Link key={i} to={action.href}>
                    <Card className={`h-full hover:border-primary/50 transition-colors cursor-pointer ${action.primary ? 'border-primary/30' : ''}`}>
                      <CardContent className="p-4 text-center">
                        <action.icon className={`h-6 w-6 mx-auto mb-2 ${action.primary ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className="font-medium text-sm">{action.label}</div>
                        <div className="text-xs text-muted-foreground">{action.desc}</div>
                      </CardContent>
                    </Card>
                  </Link>
                ) : (
                  <Card 
                    key={i} 
                    className={`h-full cursor-pointer ${action.primary ? 'border-primary/30 hover:border-primary' : 'hover:border-primary/50'} transition-colors`}
                    onClick={action.action}
                  >
                    <CardContent className="p-4 text-center">
                      <action.icon className={`h-6 w-6 mx-auto mb-2 ${action.primary ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="font-medium text-sm">{action.label}</div>
                      <div className="text-xs text-muted-foreground">{action.desc}</div>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>

            {/* Tool Categories */}
            <div className="grid md:grid-cols-3 gap-4">
              {toolCategories.map((cat, i) => (
                <Card key={i}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{cat.title}</CardTitle>
                    <CardDescription>{cat.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {cat.tools.map((tool, j) => (
                      <Link key={j} to={tool.href}>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                          <tool.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{tool.name}</span>
                          <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground" />
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AICommandCenter;
