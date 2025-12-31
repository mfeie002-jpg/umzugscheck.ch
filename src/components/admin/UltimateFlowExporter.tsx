/**
 * Ultimate Flow Exporter
 * ======================
 * Exports Ultimate Flows with complete assets for ChatGPT analysis:
 * 1. Build-Prompt (instructions to build in Lovable)
 * 2. Analyse-Prompt (feedback prompt for first run)
 * 3. Screenshots (Mobile + Desktop)
 * 4. HTML snapshots
 * 5. JSON data
 * 6. URLs
 * 7. Meta-data
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Package,
  Download,
  Loader2,
  Copy,
  CheckCircle2,
  Wand2,
  Sparkles,
  FileText,
  Monitor,
  Smartphone,
  RefreshCw,
  FileCode,
  Eye,
  Zap,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { supabase } from "@/integrations/supabase/client";
import { captureScreenshot } from "@/lib/screenshot-service";

// ============================================================================
// TYPES
// ============================================================================

interface UltimateFlowStep {
  number: number;
  name: string;
  sourceElements?: string[];
  features?: string[];
  archetypeValue?: Record<string, string>;
}

interface UltimateFlowData {
  id: string;
  flow_id: string;
  variant_name: string;
  variant_label: string;
  status: string;
  created_at: string;
  result_json: {
    ultimateFlow?: {
      name?: string;
      flowCode?: string;
      description?: string;
      expectedScore?: number;
      expectedConversionLift?: string;
      steps?: UltimateFlowStep[];
      keyFeatures?: Array<{
        feature: string;
        sourceFlow: string;
        implementation: string;
        impact: string;
      }>;
    };
    implementationPlan?: {
      phase1?: { name: string; duration: string; tasks: string[] };
      phase2?: { name: string; duration: string; tasks: string[] };
      phase3?: { name: string; duration: string; tasks: string[] };
    };
    successMetrics?: {
      targetScore?: number;
      conversionGoal?: string;
      archetypeCoverage?: Record<string, number>;
      kpis?: Array<{ metric: string; current: string; target: string }>;
    };
  } | null;
}

interface ExportProgress {
  step: string;
  percent: number;
}

// ============================================================================
// PROMPT GENERATORS
// ============================================================================

function generateBuildPrompt(flow: UltimateFlowData): string {
  const data = flow.result_json;
  if (!data?.ultimateFlow) return '// Keine Ultimate Flow Daten verfügbar';
  
  const uf = data.ultimateFlow;
  const metrics = data.successMetrics;
  const plan = data.implementationPlan;
  
  let prompt = `# 🚀 LOVABLE BUILD PROMPT: ${uf.name || flow.variant_name}

## Projektübersicht
${uf.description || 'Ein optimierter Umzugs-Offerten-Funnel für die Schweiz.'}

**Ziel-Score:** ${uf.expectedScore || 95}/100
**Erwartete Conversion-Steigerung:** ${uf.expectedConversionLift || '+30%'}
**Flow-Code:** ${uf.flowCode || 'ultimate-flow'}

---

## Technische Anforderungen

Erstelle einen mehrstufigen Umzugs-Offerten-Funnel mit:
- **Framework:** React + TypeScript + Tailwind CSS
- **Design:** Mobile-First, Touch-Targets mindestens 48x48px
- **Lokalisierung:** Schweizer Deutsch (de-CH), CHF Preise
- **Responsive:** Optimiert für alle Bildschirmgrössen

---

## Flow-Struktur (${uf.steps?.length || 0} Steps)

`;

  if (uf.steps && uf.steps.length > 0) {
    uf.steps.forEach((step, idx) => {
      prompt += `### Step ${step.number || idx + 1}: ${step.name}\n\n`;
      if (step.features && step.features.length > 0) {
        prompt += `**Implementiere diese Features:**\n`;
        step.features.forEach(f => { prompt += `- ${f}\n`; });
      }
      if (step.archetypeValue) {
        prompt += `\n**Archetypen-Optimierung:**\n`;
        Object.entries(step.archetypeValue).forEach(([archetype, value]) => {
          prompt += `- ${formatArchetype(archetype)}: ${value}\n`;
        });
      }
      prompt += `\n`;
    });
  }

  if (uf.keyFeatures && uf.keyFeatures.length > 0) {
    prompt += `---\n\n## Key Features (KRITISCH)\n\n`;
    uf.keyFeatures.forEach((feature, idx) => {
      prompt += `### ${idx + 1}. ${feature.feature}
- **Implementation:** ${feature.implementation}
- **Impact:** ${feature.impact}

`;
    });
  }

  if (plan) {
    prompt += `---\n\n## Implementation Roadmap\n\n`;
    if (plan.phase1) {
      prompt += `### Phase 1: ${plan.phase1.name} (${plan.phase1.duration})\n`;
      plan.phase1.tasks?.forEach(t => { prompt += `- [ ] ${t}\n`; });
      prompt += `\n`;
    }
    if (plan.phase2) {
      prompt += `### Phase 2: ${plan.phase2.name} (${plan.phase2.duration})\n`;
      plan.phase2.tasks?.forEach(t => { prompt += `- [ ] ${t}\n`; });
      prompt += `\n`;
    }
    if (plan.phase3) {
      prompt += `### Phase 3: ${plan.phase3.name} (${plan.phase3.duration})\n`;
      plan.phase3.tasks?.forEach(t => { prompt += `- [ ] ${t}\n`; });
      prompt += `\n`;
    }
  }

  prompt += `---

## Design-Richtlinien

1. **Farben:** Schweizer Corporate-Blau (#0066CC) als Primärfarbe, Trust-Grün (#00A651) für Erfolg
2. **Typography:** Klare, lesbare Schriften (min. 16px auf Mobile)
3. **Spacing:** Grosszügige Abstände für Touch-Bedienung (min. 12px)
4. **Trust-Elemente:** ASTAG-Siegel, TÜV, Google Reviews an strategischen Punkten
5. **Progress:** Klare Fortschrittsanzeige "Schritt X von Y"
6. **CTA:** Auffällige, kontrastreiche Call-to-Action Buttons (min. 48px hoch)

## Spezielle Anforderungen

- Swiss Post PLZ-API für Adress-Autovervollständigung
- Echtzeit-Preisschätzung basierend auf Eingaben
- Bundle-Pricing mit 3 Optionen (Basis, Komfort, Premium)
- Firmen-Matching basierend auf Region und Services
- Mobile-optimierte Formularfelder mit grossen Touch-Targets

---

**WICHTIG:** Dieser Flow ist eine Synthese der besten Elemente aus allen analysierten Varianten, optimiert für maximale Conversion bei allen 4 Nutzer-Archetypen:
1. **Security Seeker** - Braucht Vertrauen und Garantien
2. **Efficiency Maximizer** - Will schnell und einfach zum Ziel
3. **Value Hunter** - Sucht das beste Preis-Leistungs-Verhältnis
4. **Overwhelmed Parent** - Braucht klare Struktur und Hilfe
`;

  return prompt;
}

function generateAnalysePrompt(flow: UltimateFlowData): string {
  const data = flow.result_json;
  if (!data?.ultimateFlow) return '// Keine Ultimate Flow Daten verfügbar';
  
  const uf = data.ultimateFlow;
  const metrics = data.successMetrics;
  
  let prompt = `# 🔍 CHATGPT ANALYSE PROMPT: ${uf.name || flow.variant_name}

Du bist ein UX/Conversion-Experte für Schweizer B2C-Plattformen. Analysiere diesen Umzugs-Offerten-Funnel.

## Deine Aufgabe

Ich habe diesen Flow implementiert und brauche dein Feedback. Analysiere die beigefügten Screenshots (Mobile + Desktop) und HTML-Dateien.

## Kontext

**Flow-Name:** ${uf.name || flow.variant_name}
**Ziel-Score:** ${uf.expectedScore || 95}/100
**Erwartete Conversion-Lift:** ${uf.expectedConversionLift || '+30%'}
**Anzahl Steps:** ${uf.steps?.length || 0}

## Zu prüfende Aspekte

### 1. Mobile-First UX (40% Gewichtung)
- Sind alle Touch-Targets mindestens 48x48px?
- Funktioniert die Swipe-Navigation?
- Ist die Schrift gross genug (min. 16px)?
- Gibt es horizontales Scrolling (sollte es nicht)?

### 2. Trust & Credibility (25% Gewichtung)
- Sind ASTAG/TÜV/Google-Siegel sichtbar?
- Gibt es Social Proof (Reviews, Anzahl Anfragen)?
- Werden Garantien kommuniziert?

### 3. Conversion-Optimierung (20% Gewichtung)
- Ist der CTA prominent und klar?
- Gibt es eine klare Fortschrittsanzeige?
- Werden Preise/Vorteile früh kommuniziert?
- Ist die Formular-Länge angemessen?

### 4. Archetypen-Abdeckung (15% Gewichtung)
`;

  if (metrics?.archetypeCoverage) {
    prompt += `\n**Geplante Abdeckung:**\n`;
    Object.entries(metrics.archetypeCoverage).forEach(([arch, score]) => {
      prompt += `- ${formatArchetype(arch)}: ${score}%\n`;
    });
  }

  prompt += `
## Erwartete Key Features

Prüfe ob diese Features korrekt implementiert sind:

`;

  if (uf.keyFeatures) {
    uf.keyFeatures.forEach((f, i) => {
      prompt += `${i + 1}. **${f.feature}**
   - Erwartet: ${f.implementation}
   - Impact: ${f.impact}
   
`;
    });
  }

  prompt += `## Dein Output

Gib mir:

1. **Overall Score (0-100)** mit kurzer Begründung
2. **Top 3 Stärken** - Was funktioniert besonders gut?
3. **Top 3 Probleme** - Was muss dringend gefixt werden?
4. **Quick Wins** - 3 Verbesserungen die unter 1h dauern
5. **Archetypen-Check** - Wird jeder der 4 Typen gut bedient?

## Format

Antworte strukturiert mit Überschriften. Sei konkret mit Zeilen/Elementen die du meinst.
Nutze die Screenshots und HTML für deine Analyse.

---

**Beigefügte Dateien:**
- Screenshots Mobile (375px)
- Screenshots Desktop (1920px)
- HTML-Snapshots
- Flow-Konfiguration (JSON)
`;

  return prompt;
}

function formatArchetype(key: string): string {
  const map: Record<string, string> = {
    securitySeeker: '🛡️ Security Seeker',
    efficiencyMaximizer: '⚡ Efficiency Maximizer',
    valueHunter: '💰 Value Hunter',
    overwhelmedParent: '🏠 Overwhelmed Parent',
  };
  return map[key] || key;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function UltimateFlowExporter() {
  const [flows, setFlows] = useState<UltimateFlowData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress>({ step: '', percent: 0 });
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  // Load Ultimate Flows
  const loadFlows = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('flow_feedback_variants')
        .select('*')
        .or('variant_label.ilike.%ultimate%,variant_name.ilike.%ultimate%')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFlows((data || []) as UltimateFlowData[]);
      toast.success(`${data?.length || 0} Ultimate Flows geladen`);
    } catch (err) {
      console.error('Load flows error:', err);
      toast.error('Fehler beim Laden der Flows');
    } finally {
      setIsLoading(false);
    }
  };

  // Export single flow with all assets
  const exportFlow = async (flow: UltimateFlowData) => {
    setIsExporting(true);
    setSelectedFlowId(flow.id);
    setProgress({ step: 'Initialisiere Export...', percent: 5 });

    try {
      const zip = new JSZip();
      const timestamp = new Date().toISOString().split('T')[0];
      const flowName = flow.variant_name.toLowerCase().replace(/\s+/g, '-');
      const rootFolder = zip.folder(`ultimate-flow-${flowName}-${timestamp}`);
      if (!rootFolder) throw new Error('Could not create ZIP folder');

      // 1. Generate prompts
      setProgress({ step: 'Generiere Prompts...', percent: 10 });
      const buildPrompt = generateBuildPrompt(flow);
      const analysePrompt = generateAnalysePrompt(flow);
      
      const promptsFolder = rootFolder.folder('prompts');
      promptsFolder?.file('01_BUILD_PROMPT.md', buildPrompt);
      promptsFolder?.file('02_ANALYSE_PROMPT.md', analysePrompt);
      promptsFolder?.file('00_README.md', `# Prompts für ${flow.variant_name}

## Reihenfolge

1. **01_BUILD_PROMPT.md** - Nutze diesen Prompt in Lovable um den Flow zu bauen
2. **02_ANALYSE_PROMPT.md** - Nutze diesen Prompt in ChatGPT um Feedback zum fertigen Flow zu erhalten

## Verwendung

### Build (Lovable)
1. Öffne Lovable
2. Kopiere den Inhalt von 01_BUILD_PROMPT.md
3. Füge ihn in den Chat ein
4. Lovable wird den Flow Schritt für Schritt bauen

### Analyse (ChatGPT)
1. Öffne ChatGPT (GPT-4 empfohlen)
2. Lade die Screenshots und HTML-Dateien aus diesem ZIP hoch
3. Kopiere den Inhalt von 02_ANALYSE_PROMPT.md
4. ChatGPT analysiert den Flow und gibt dir Feedback
`);

      // 2. Save JSON data
      setProgress({ step: 'Speichere JSON Daten...', percent: 20 });
      const jsonFolder = rootFolder.folder('data');
      jsonFolder?.file('flow-config.json', JSON.stringify(flow.result_json, null, 2));
      jsonFolder?.file('meta.json', JSON.stringify({
        id: flow.id,
        flowId: flow.flow_id,
        name: flow.variant_name,
        label: flow.variant_label,
        status: flow.status,
        createdAt: flow.created_at,
        exportedAt: new Date().toISOString(),
      }, null, 2));

      // 3. Generate step URLs for screenshots
      const baseUrl = window.location.origin;
      const steps = flow.result_json?.ultimateFlow?.steps || [];
      const stepUrls = steps.map((step, idx) => ({
        name: step.name,
        number: step.number || idx + 1,
        url: `${baseUrl}/umzugsofferten?uc_capture=1&uc_step=${idx + 1}`,
      }));

      // Save URLs
      jsonFolder?.file('step-urls.json', JSON.stringify(stepUrls, null, 2));

      // 4. Capture screenshots
      const screenshotsFolder = rootFolder.folder('screenshots');
      const mobileFolder = screenshotsFolder?.folder('mobile');
      const desktopFolder = screenshotsFolder?.folder('desktop');

      for (let i = 0; i < Math.min(stepUrls.length, 8); i++) {
        const stepUrl = stepUrls[i];
        setProgress({ 
          step: `Screenshot Step ${stepUrl.number}...`, 
          percent: 25 + (i / stepUrls.length) * 50 
        });

        try {
          // Mobile screenshot
          const mobileResult = await captureScreenshot({
            url: stepUrl.url,
            dimension: '375x812',
            delay: 3000,
            format: 'png',
          });
          if (mobileResult.success && mobileResult.image) {
            const mobileBlob = base64ToBlob(mobileResult.image, 'image/png');
            mobileFolder?.file(`step-${stepUrl.number}-${slugify(stepUrl.name)}.png`, mobileBlob);
          }

          // Desktop screenshot
          const desktopResult = await captureScreenshot({
            url: stepUrl.url,
            dimension: '1920x1080',
            delay: 3000,
            format: 'png',
          });
          if (desktopResult.success && desktopResult.image) {
            const desktopBlob = base64ToBlob(desktopResult.image, 'image/png');
            desktopFolder?.file(`step-${stepUrl.number}-${slugify(stepUrl.name)}.png`, desktopBlob);
          }
        } catch (err) {
          console.warn(`Screenshot failed for step ${stepUrl.number}:`, err);
        }
      }

      // 5. Capture HTML
      setProgress({ step: 'Erfasse HTML...', percent: 80 });
      const htmlFolder = rootFolder.folder('html');
      
      for (let i = 0; i < Math.min(stepUrls.length, 8); i++) {
        const stepUrl = stepUrls[i];
        try {
          const { data: htmlData } = await supabase.functions.invoke('capture-rendered-html', {
            body: { url: stepUrl.url, onlyMainContent: false }
          });
          if (htmlData?.data?.html) {
            htmlFolder?.file(`step-${stepUrl.number}-${slugify(stepUrl.name)}.html`, htmlData.data.html);
          }
        } catch (err) {
          console.warn(`HTML capture failed for step ${stepUrl.number}:`, err);
        }
      }

      // 6. Create README
      setProgress({ step: 'Erstelle README...', percent: 90 });
      rootFolder.file('README.md', `# ${flow.variant_name}

## Ultimate Flow Export

**Erstellt:** ${new Date().toLocaleString('de-CH')}
**Flow ID:** ${flow.flow_id}
**Status:** ${flow.status}

---

## Inhalt

\`\`\`
📁 ultimate-flow-${flowName}/
├── 📁 prompts/
│   ├── 00_README.md          # Anleitung
│   ├── 01_BUILD_PROMPT.md    # Lovable Build-Anweisungen
│   └── 02_ANALYSE_PROMPT.md  # ChatGPT Feedback-Prompt
├── 📁 data/
│   ├── flow-config.json      # Flow-Konfiguration
│   ├── meta.json             # Meta-Daten
│   └── step-urls.json        # URLs aller Steps
├── 📁 screenshots/
│   ├── 📁 mobile/            # Screenshots 375px
│   └── 📁 desktop/           # Screenshots 1920px
├── 📁 html/
│   └── step-*.html           # HTML-Snapshots
└── README.md
\`\`\`

## Workflow

### 1. Flow in Lovable bauen
1. Öffne \`prompts/01_BUILD_PROMPT.md\`
2. Kopiere den gesamten Inhalt
3. Füge ihn in Lovable ein
4. Folge den Anweisungen

### 2. Feedback von ChatGPT holen
1. Lade dieses ZIP in ChatGPT hoch (GPT-4 empfohlen)
2. Öffne \`prompts/02_ANALYSE_PROMPT.md\`
3. Kopiere den Inhalt und sende ihn an ChatGPT
4. ChatGPT analysiert Screenshots + HTML und gibt Feedback

---

## Flow-Details

${flow.result_json?.ultimateFlow?.description || 'Keine Beschreibung verfügbar.'}

**Erwarteter Score:** ${flow.result_json?.ultimateFlow?.expectedScore || '?'}/100
**Conversion Lift:** ${flow.result_json?.ultimateFlow?.expectedConversionLift || '?'}
**Anzahl Steps:** ${flow.result_json?.ultimateFlow?.steps?.length || 0}

---

*Exportiert mit umzugscheck.ch Ultimate Flow Exporter*
`);

      // 7. Generate ZIP
      setProgress({ step: 'Erstelle ZIP...', percent: 95 });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `ultimate-flow-${flowName}-${timestamp}.zip`);

      setProgress({ step: 'Export abgeschlossen!', percent: 100 });
      toast.success('Export erfolgreich! ZIP wird heruntergeladen.');

    } catch (err) {
      console.error('Export error:', err);
      toast.error('Export fehlgeschlagen: ' + (err instanceof Error ? err.message : 'Unbekannter Fehler'));
    } finally {
      setIsExporting(false);
      setSelectedFlowId(null);
    }
  };

  // Export all flows
  const exportAllFlows = async () => {
    if (flows.length === 0) {
      toast.error('Keine Ultimate Flows zum Exportieren');
      return;
    }

    setIsExporting(true);
    setProgress({ step: 'Starte Komplett-Export...', percent: 0 });

    try {
      const zip = new JSZip();
      const timestamp = new Date().toISOString().split('T')[0];
      const rootFolder = zip.folder(`all-ultimate-flows-${timestamp}`);
      if (!rootFolder) throw new Error('Could not create ZIP folder');

      for (let i = 0; i < flows.length; i++) {
        const flow = flows[i];
        setProgress({ 
          step: `Exportiere ${flow.variant_name}...`, 
          percent: (i / flows.length) * 90 
        });

        const flowName = flow.variant_name.toLowerCase().replace(/\s+/g, '-');
        const flowFolder = rootFolder.folder(flowName);

        // Generate prompts
        const buildPrompt = generateBuildPrompt(flow);
        const analysePrompt = generateAnalysePrompt(flow);
        
        flowFolder?.file('BUILD_PROMPT.md', buildPrompt);
        flowFolder?.file('ANALYSE_PROMPT.md', analysePrompt);
        flowFolder?.file('flow-config.json', JSON.stringify(flow.result_json, null, 2));
        flowFolder?.file('meta.json', JSON.stringify({
          id: flow.id,
          flowId: flow.flow_id,
          name: flow.variant_name,
          status: flow.status,
          createdAt: flow.created_at,
        }, null, 2));
      }

      // Master README
      rootFolder.file('README.md', `# Alle Ultimate Flows

**Exportiert:** ${new Date().toLocaleString('de-CH')}
**Anzahl Flows:** ${flows.length}

## Enthaltene Flows

${flows.map((f, i) => `${i + 1}. **${f.variant_name}** - Score: ${f.result_json?.ultimateFlow?.expectedScore || '?'}/100`).join('\n')}

## Verwendung

Jeder Flow-Ordner enthält:
- \`BUILD_PROMPT.md\` - Anweisungen für Lovable
- \`ANALYSE_PROMPT.md\` - Feedback-Prompt für ChatGPT
- \`flow-config.json\` - Komplette Flow-Konfiguration
- \`meta.json\` - Meta-Daten
`);

      setProgress({ step: 'Erstelle ZIP...', percent: 95 });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `all-ultimate-flows-${timestamp}.zip`);

      setProgress({ step: 'Export abgeschlossen!', percent: 100 });
      toast.success(`${flows.length} Flows exportiert!`);

    } catch (err) {
      console.error('Export all error:', err);
      toast.error('Export fehlgeschlagen');
    } finally {
      setIsExporting(false);
    }
  };

  const copyPrompt = async (prompt: string, type: string) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedPrompt(type);
    toast.success(`${type}-Prompt kopiert!`);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const selectedFlow = flows.find(f => f.id === selectedFlowId) || flows[0];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Ultimate Flow Exporter
        </CardTitle>
        <CardDescription>
          Exportiere Ultimate Flows mit Build- und Analyse-Prompts, Screenshots (Mobile+Desktop), HTML und JSON
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Load Button */}
        <div className="flex gap-2">
          <Button onClick={loadFlows} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Ultimate Flows laden
          </Button>
          
          {flows.length > 0 && (
            <Button 
              onClick={exportAllFlows} 
              disabled={isExporting}
              variant="default"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Alle exportieren ({flows.length})
            </Button>
          )}
        </div>

        {/* Progress */}
        {isExporting && (
          <div className="space-y-2">
            <Progress value={progress.percent} />
            <p className="text-sm text-muted-foreground">{progress.step}</p>
          </div>
        )}

        {/* Flows List */}
        {flows.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Gefundene Ultimate Flows ({flows.length})</h3>
            
            <div className="grid gap-4">
              {flows.map((flow) => (
                <Card key={flow.id} className="border-muted">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="font-medium">{flow.variant_name}</span>
                          <Badge variant={flow.status === 'done' ? 'default' : 'secondary'}>
                            {flow.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {flow.result_json?.ultimateFlow?.description?.slice(0, 100) || 'Keine Beschreibung'}...
                        </p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span>Score: <strong>{flow.result_json?.ultimateFlow?.expectedScore || '?'}</strong>/100</span>
                          <span>Steps: <strong>{flow.result_json?.ultimateFlow?.steps?.length || 0}</strong></span>
                          <span>Lift: <strong>{flow.result_json?.ultimateFlow?.expectedConversionLift || '?'}</strong></span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedFlowId(selectedFlowId === flow.id ? null : flow.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Prompts
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => exportFlow(flow)}
                          disabled={isExporting}
                        >
                          {isExporting && selectedFlowId === flow.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}
                          Export
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Prompt Preview */}
                    {selectedFlowId === flow.id && (
                      <div className="mt-4 pt-4 border-t">
                        <Tabs defaultValue="build">
                          <TabsList>
                            <TabsTrigger value="build" className="gap-1">
                              <Wand2 className="h-3 w-3" />
                              Build-Prompt
                            </TabsTrigger>
                            <TabsTrigger value="analyse" className="gap-1">
                              <FileText className="h-3 w-3" />
                              Analyse-Prompt
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="build" className="mt-3">
                            <div className="flex justify-end mb-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyPrompt(generateBuildPrompt(flow), 'Build')}
                              >
                                {copiedPrompt === 'Build' ? (
                                  <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4 mr-1" />
                                )}
                                Kopieren
                              </Button>
                            </div>
                            <ScrollArea className="h-64 border rounded-lg p-3 bg-muted/30">
                              <pre className="text-xs whitespace-pre-wrap font-mono">
                                {generateBuildPrompt(flow)}
                              </pre>
                            </ScrollArea>
                          </TabsContent>
                          
                          <TabsContent value="analyse" className="mt-3">
                            <div className="flex justify-end mb-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyPrompt(generateAnalysePrompt(flow), 'Analyse')}
                              >
                                {copiedPrompt === 'Analyse' ? (
                                  <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4 mr-1" />
                                )}
                                Kopieren
                              </Button>
                            </div>
                            <ScrollArea className="h-64 border rounded-lg p-3 bg-muted/30">
                              <pre className="text-xs whitespace-pre-wrap font-mono">
                                {generateAnalysePrompt(flow)}
                              </pre>
                            </ScrollArea>
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && flows.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Keine Ultimate Flows gefunden.</p>
            <p className="text-sm">Klicke "Ultimate Flows laden" um zu starten.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function base64ToBlob(base64: string, mimeType: string): Blob {
  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äöü]/g, (c) => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue' }[c] || c))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30);
}

export default UltimateFlowExporter;
