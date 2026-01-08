/**
 * ChatGPT Export Panel
 * 
 * Exports all flow screenshots and data from DB for ChatGPT analysis.
 * Includes: All screenshots, issues, scores, prompts.
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Download,
  Loader2,
  Image,
  FileText,
  Package,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';

interface FlowScreenshot {
  flowId: string;
  stepNumber: number;
  mobileUrl: string | null;
  desktopUrl: string | null;
}

interface FlowIssue {
  flowId: string;
  severity: string;
  category: string;
  title: string;
  description: string | null;
  recommendation: string | null;
}

interface FlowScore {
  flowId: string;
  overallScore: number;
  conversionScore: number;
  uxScore: number;
  mobileScore: number;
  trustScore: number;
}

export function ChatGPTExportPanel() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [includeScreenshots, setIncludeScreenshots] = useState(true);
  const [includeIssues, setIncludeIssues] = useState(true);
  const [includeScores, setIncludeScores] = useState(true);
  const [includePrompts, setIncludePrompts] = useState(true);
  const [stats, setStats] = useState<{ screenshots: number; flows: number; issues: number } | null>(null);

  // Load stats on mount
  React.useEffect(() => {
    async function loadStats() {
      try {
        // Count unique flow+step combinations with screenshots
        const { data: screenshotsData } = await supabase
          .from('flow_step_metrics')
          .select('flow_id, step_number')
          .or('mobile_screenshot_url.not.is.null,desktop_screenshot_url.not.is.null');
        
        const uniqueKeys = new Set<string>();
        (screenshotsData || []).forEach(s => {
          uniqueKeys.add(`${s.flow_id}-${s.step_number}`);
        });
        
        const { count: issueCount } = await supabase
          .from('flow_ux_issues')
          .select('*', { count: 'exact', head: true })
          .eq('is_resolved', false);
        
        const { count: flowCount } = await supabase
          .from('flow_feature_scores')
          .select('*', { count: 'exact', head: true });
        
        setStats({
          screenshots: uniqueKeys.size * 2, // Approx mobile + desktop
          flows: flowCount || 0,
          issues: issueCount || 0,
        });
      } catch (e) {
        console.error('Failed to load export stats:', e);
      }
    }
    loadStats();
  }, []);

  const fetchImageAsBase64 = async (url: string): Promise<string | null> => {
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          // Remove data URL prefix
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const generateMasterPrompt = (
    scores: FlowScore[],
    issues: FlowIssue[],
    screenshotCount: number
  ): string => {
    const topFlows = scores.slice(0, 5);
    const criticalIssues = issues.filter(i => i.severity === 'critical' || i.severity === 'high');
    
    return `# 🚀 Umzugscheck.ch Flow-Analyse Export

## Übersicht
- **Flows analysiert:** ${scores.length}
- **Screenshots exportiert:** ${screenshotCount}
- **Offene Issues:** ${issues.length} (${criticalIssues.length} kritisch/hoch)
- **Exportdatum:** ${new Date().toLocaleDateString('de-CH')}

---

## 🏆 Top 5 Flows (nach Score)

${topFlows.map((f, i) => `${i + 1}. **${f.flowId}** - Score: ${f.overallScore}/100
   - Conversion: ${f.conversionScore} | UX: ${f.uxScore} | Mobile: ${f.mobileScore} | Trust: ${f.trustScore}`).join('\n')}

---

## 🔴 Kritische Issues (${criticalIssues.length})

${criticalIssues.slice(0, 10).map(i => `- **[${i.severity.toUpperCase()}]** ${i.flowId}: ${i.title}
  ${i.description || ''}`).join('\n\n')}

---

## 📋 Analyse-Aufgaben

Analysiere die beigefügten Screenshots und Daten:

1. **Flow-Vergleich**
   - Welcher Flow hat das beste UX-Design?
   - Welche Elemente machen die Top-Flows erfolgreich?

2. **Mobile Experience**
   - Sind Touch-Targets ausreichend gross (min. 44x44px)?
   - Gibt es horizontalen Scroll auf Mobile?

3. **Conversion-Optimierung**
   - Welche CTAs funktionieren am besten?
   - Wo sind die grössten Friction-Points?

4. **Trust-Signale**
   - Welche Flows haben die besten Trust-Elemente?
   - Was fehlt in den schwächeren Flows?

5. **Quick Wins**
   - Liste 5 einfache Verbesserungen mit maximalem Impact

---

## 📁 Exportstruktur

\`\`\`
/screenshots/
  /{flow-id}/
    step-1-mobile.png
    step-1-desktop.png
    step-2-mobile.png
    ...
/data/
  scores.json
  issues.json
  summary.json
prompts/
  master-prompt.md
  analysis-prompt.md
  comparison-prompt.md
\`\`\`

---

## Gewünschtes Output-Format

Für jeden analysierten Flow:
- Score-Einschätzung (1-100)
- Top 3 Stärken
- Top 3 Schwächen  
- 3 priorisierte Verbesserungsvorschläge

Abschliessend:
- Ranking aller Flows
- 10 priorisierte Quick Wins
- Empfehlung für den "Winner" Flow
`;
  };

  const generateAnalysisPrompt = (): string => {
    return `# 🔍 Detaillierte Flow-Analyse Prompt

## Kontext
Du analysierst Umzugs-Offerten-Funnels für den Schweizer Markt.
Ziel: Höchstmögliche Conversion-Rate bei gleichzeitig gutem UX.

## Für jeden Screenshot analysiere:

### 1. Visuelles Design
- Farbschema und Kontraste
- Typografie und Lesbarkeit
- Visuelle Hierarchie
- White Space und Balance

### 2. UX/Usability
- Ist der nächste Schritt klar?
- Touch-Target Grössen (min. 44x44px)
- Formular-Komplexität
- Error Handling sichtbar?

### 3. Conversion-Elemente
- CTA Sichtbarkeit und Text
- Trust-Signale (Bewertungen, Logos, Garantien)
- Fortschrittsanzeige vorhanden?
- Urgency/Scarcity Elements

### 4. Mobile-Spezifisch
- Horizontaler Scroll?
- Sticky Header/Footer?
- Thumb-Zone Optimierung
- Safe Area Padding

### 5. Schweizer Markt
- Lokalisierung (CHF, Schweizer Qualität)
- ASTAG/Branchenlogos
- Schweizer Telefonnummern
- Vertrauenswürdige Sprache

## Output pro Flow:
\`\`\`json
{
  "flowId": "v1a",
  "overallScore": 85,
  "strengths": ["...", "...", "..."],
  "weaknesses": ["...", "...", "..."],
  "improvements": [
    {"priority": 1, "title": "...", "impact": "high", "effort": "low"},
    {"priority": 2, "title": "...", "impact": "medium", "effort": "medium"},
    {"priority": 3, "title": "...", "impact": "medium", "effort": "high"}
  ]
}
\`\`\`
`;
  };

  const generateComparisonPrompt = (): string => {
    return `# 🔄 Flow-Vergleich Prompt

## Aufgabe
Vergleiche alle exportierten Flows und erstelle ein Ranking.

## Vergleichskriterien (gewichtet)

1. **Conversion Potential (30%)**
   - Klarheit der CTAs
   - Wenige Formularfelder
   - Keine Ablenkungen

2. **Mobile Experience (25%)**
   - Touch-freundlich
   - Kein horizontaler Scroll
   - Schnelle Ladezeit

3. **Trust & Credibility (20%)**
   - Sichtbare Bewertungen
   - Bekannte Logos
   - Professionelles Design

4. **UX Qualität (15%)**
   - Intuitive Navigation
   - Klare Hierarchie
   - Gutes Error Handling

5. **Schweizer Relevanz (10%)**
   - Lokale Signale
   - CHF Preise
   - Schweizer Qualität

## Gewünschtes Output

### Ranking
| Rang | Flow | Score | Stärke | Schwäche |
|------|------|-------|--------|----------|
| 1    | v2a  | 92    | ...    | ...      |
| 2    | v1b  | 88    | ...    | ...      |
| ...  | ...  | ...   | ...    | ...      |

### Winner-Empfehlung
- Welcher Flow sollte live gehen?
- Warum?
- Was müsste noch verbessert werden?

### Hybrid-Empfehlung
- Welche Elemente aus verschiedenen Flows kombinieren?
- Beschreibe den "Ultimate Flow"
`;
  };

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setProgress(0);
    setStatus('Lade Daten...');

    try {
      const zip = new JSZip();
      const exportDate = new Date().toISOString().split('T')[0];

      // 1. Fetch scores
      setStatus('Lade Scores...');
      setProgress(5);
      const { data: scoresData } = await supabase
        .from('flow_feature_scores')
        .select('flow_id, overall_score, conversion_score, ux_score, mobile_score, trust_score')
        .order('overall_score', { ascending: false });

      const scores: FlowScore[] = (scoresData || []).map(s => ({
        flowId: s.flow_id,
        overallScore: s.overall_score || 0,
        conversionScore: s.conversion_score || 0,
        uxScore: s.ux_score || 0,
        mobileScore: s.mobile_score || 0,
        trustScore: s.trust_score || 0,
      }));

      // 2. Fetch issues
      setStatus('Lade Issues...');
      setProgress(10);
      const { data: issuesData } = await supabase
        .from('flow_ux_issues')
        .select('flow_id, severity, category, title, description, recommendation')
        .eq('is_resolved', false)
        .order('severity', { ascending: true });

      const issues: FlowIssue[] = (issuesData || []).map(i => ({
        flowId: i.flow_id,
        severity: i.severity,
        category: i.category,
        title: i.title,
        description: i.description,
        recommendation: i.recommendation,
      }));

      // 3. Fetch screenshots - get ALL screenshots with mobile OR desktop URLs
      setStatus('Lade Screenshot-URLs...');
      setProgress(15);
      const { data: screenshotsData } = await supabase
        .from('flow_step_metrics')
        .select('flow_id, step_number, mobile_screenshot_url, desktop_screenshot_url, created_at')
        .or('mobile_screenshot_url.not.is.null,desktop_screenshot_url.not.is.null')
        .order('created_at', { ascending: false });

      // Deduplicate: Keep only the latest screenshot per flow_id + step_number
      const screenshotMap = new Map<string, FlowScreenshot>();
      (screenshotsData || []).forEach(s => {
        const key = `${s.flow_id}-step${s.step_number}`;
        if (!screenshotMap.has(key)) {
          screenshotMap.set(key, {
            flowId: s.flow_id,
            stepNumber: s.step_number,
            mobileUrl: s.mobile_screenshot_url,
            desktopUrl: s.desktop_screenshot_url,
          });
        }
      });
      
      const screenshots: FlowScreenshot[] = Array.from(screenshotMap.values())
        .sort((a, b) => a.flowId.localeCompare(b.flowId) || a.stepNumber - b.stepNumber);

      // 4. Add data files
      if (includeScores) {
        const dataFolder = zip.folder('data');
        dataFolder?.file('scores.json', JSON.stringify(scores, null, 2));
        dataFolder?.file('issues.json', JSON.stringify(issues, null, 2));
        dataFolder?.file('summary.json', JSON.stringify({
          exportDate,
          totalFlows: scores.length,
          totalScreenshots: screenshots.length * 2,
          totalIssues: issues.length,
          avgScore: scores.length > 0 
            ? Math.round(scores.reduce((s, f) => s + f.overallScore, 0) / scores.length)
            : 0,
        }, null, 2));
      }

      // 5. Add prompts
      if (includePrompts) {
        const promptsFolder = zip.folder('prompts');
        promptsFolder?.file('master-prompt.md', generateMasterPrompt(scores, issues, screenshots.length * 2));
        promptsFolder?.file('analysis-prompt.md', generateAnalysisPrompt());
        promptsFolder?.file('comparison-prompt.md', generateComparisonPrompt());
      }

      // 6. Download and add screenshots
      let screenshotCount = 0;
      if (includeScreenshots && screenshots.length > 0) {
        const screenshotsFolder = zip.folder('screenshots');
        const totalScreenshots = screenshots.length * 2;
        
        for (let i = 0; i < screenshots.length; i++) {
          const screenshot = screenshots[i];
          const flowFolder = screenshotsFolder?.folder(screenshot.flowId);
          
          setStatus(`Screenshots: ${screenshot.flowId} Step ${screenshot.stepNumber}...`);
          setProgress(20 + (i / screenshots.length) * 70);

          // Mobile
          if (screenshot.mobileUrl) {
            try {
              const base64 = await fetchImageAsBase64(screenshot.mobileUrl);
              if (base64) {
                flowFolder?.file(`step-${screenshot.stepNumber}-mobile.png`, base64, { base64: true });
                screenshotCount++;
              }
            } catch (e) {
              console.warn(`Failed to fetch mobile screenshot for ${screenshot.flowId} step ${screenshot.stepNumber}`);
            }
          }

          // Desktop
          if (screenshot.desktopUrl) {
            try {
              const base64 = await fetchImageAsBase64(screenshot.desktopUrl);
              if (base64) {
                flowFolder?.file(`step-${screenshot.stepNumber}-desktop.png`, base64, { base64: true });
                screenshotCount++;
              }
            } catch (e) {
              console.warn(`Failed to fetch desktop screenshot for ${screenshot.flowId} step ${screenshot.stepNumber}`);
            }
          }
        }
      }

      // 7. Add README
      zip.file('README.md', `# Umzugscheck.ch Flow Export

Exportiert am: ${new Date().toLocaleString('de-CH')}

## Inhalt
- ${scores.length} Flows mit Scores
- ${screenshotCount} Screenshots
- ${issues.length} offene Issues
- 3 ChatGPT Prompts

## Verwendung
1. Öffne ChatGPT (GPT-4 mit Vision empfohlen)
2. Lade die Screenshots hoch
3. Kopiere den Inhalt von \`prompts/master-prompt.md\`
4. Erhalte detaillierte Analyse und Empfehlungen

## Struktur
\`\`\`
/data/           - JSON Daten (Scores, Issues)
/screenshots/    - Alle Flow Screenshots
/prompts/        - ChatGPT Prompts
README.md        - Diese Datei
\`\`\`
`);

      // 8. Generate ZIP
      setStatus('ZIP wird erstellt...');
      setProgress(95);
      const blob = await zip.generateAsync({ type: 'blob' });

      // 9. Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `umzugscheck-chatgpt-export-${exportDate}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setProgress(100);
      setStatus('');
      toast.success(`Export fertig! ${screenshotCount} Screenshots, ${scores.length} Flows`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export fehlgeschlagen');
      setStatus('Fehler beim Export');
    } finally {
      setIsExporting(false);
    }
  }, [includeScreenshots, includeIssues, includeScores, includePrompts]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          ChatGPT Export mit Screenshots
        </CardTitle>
        <CardDescription>
          Exportiert alle Flow-Screenshots und Analyse-Daten für ChatGPT
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Preview */}
        {stats && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-lg font-bold text-primary">{stats.screenshots}</div>
              <div className="text-xs text-muted-foreground">Screenshots</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-lg font-bold text-primary">{stats.flows}</div>
              <div className="text-xs text-muted-foreground">Flows</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-lg font-bold text-primary">{stats.issues}</div>
              <div className="text-xs text-muted-foreground">Issues</div>
            </div>
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox 
              checked={includeScreenshots} 
              onCheckedChange={(v) => setIncludeScreenshots(!!v)} 
            />
            <Image className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Screenshots</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox 
              checked={includeIssues} 
              onCheckedChange={(v) => setIncludeIssues(!!v)} 
            />
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Issues</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox 
              checked={includeScores} 
              onCheckedChange={(v) => setIncludeScores(!!v)} 
            />
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Scores</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox 
              checked={includePrompts} 
              onCheckedChange={(v) => setIncludePrompts(!!v)} 
            />
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Prompts</span>
          </label>
        </div>

        {/* Progress */}
        {isExporting && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">{status}</p>
          </div>
        )}

        {/* Export Button */}
        <Button 
          onClick={handleExport} 
          disabled={isExporting}
          className="w-full"
          size="lg"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exportiere... {progress}%
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export für ChatGPT (ZIP)
            </>
          )}
        </Button>

        {/* Info */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-1">💡 Tipp</p>
          <p>
            Der Export enthält alle Screenshots aus der Datenbank plus optimierte ChatGPT-Prompts.
            Lade das ZIP in ChatGPT-4 mit Vision hoch für beste Ergebnisse.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
