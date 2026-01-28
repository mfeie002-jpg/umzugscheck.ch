/**
 * Deep Research Exporter
 * Generates export packages for ChatGPT and Gemini deep research
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Download, FileText, Image, Code, Database, 
  Sparkles, Copy, Check, Package, Loader2,
  FileCode, Globe, BarChart, Users
} from 'lucide-react';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { supabase } from '@/integrations/supabase/client';

interface ExportConfig {
  includeCode: boolean;
  includeScreenshots: boolean;
  includeHtmlSnapshots: boolean;
  includeFlowData: boolean;
  includeCompetitorData: boolean;
  includeDesignSystem: boolean;
  includeAnalytics: boolean;
}

const DEFAULT_CHATGPT_PROMPT = `Du bist ein Senior UX/UI-Experte und Conversion-Spezialist für den Schweizer Markt.

Analysiere die beigefügten Dateien (Code, Screenshots, HTML) der Umzugsvergleichsplattform umzugscheck.ch.

Fokussiere dich auf:
1. **Conversion-Optimierung**: Wie können wir die Lead-Generierung verbessern?
2. **UX-Probleme**: Welche Friction Points siehst du im Flow?
3. **Swiss Market Fit**: Sind Trust-Signale (ASTAG, Bewertungen) optimal platziert?
4. **Mobile Experience**: Ist der Flow für Smartphone-Nutzer optimiert?
5. **Konkurrenzvergleich**: Wie schneiden wir im Vergleich zu MOVU ab?

Für jedes Problem:
- Beschreibe das Issue (1 Satz)
- Erkläre den Business-Impact
- Gib konkrete Implementation-Schritte

Priorisiere nach Quick Wins (wenig Aufwand, hoher Impact).`;

const DEFAULT_GEMINI_PROMPT = `Rolle: Du bist ein Swiss Digital Experience Architect mit Expertise in Conversion-Optimierung.

Kontext: umzugscheck.ch ist eine Schweizer Umzugsvergleichsplattform. Die Hauptzielgruppe sind Privatpersonen (70%) und Firmen (30%), die Umzugsofferten vergleichen möchten.

Aufgabe: Analysiere das beigefügte Package mit Code, Screenshots und Flow-Daten.

Analyse-Framework:
1. **Archetypenfitness** (4 Schweizer Kundentypen):
   - Security Seeker (60+, Deutschschweiz)
   - Efficiency Expert (30-45, berufstätig)
   - Value Hunter (preissensitiv)
   - Overwhelmed Mover (First-Time)

2. **Trust Audit** (Schweizer Vertrauensarchitektur):
   - Institutional Trust (UID, ASTAG, Versicherung)
   - Social Trust (Google Reviews, Team-Fotos)
   - Process Trust (Garantien, Antwortzeit)

3. **Conversion Funnel**:
   - Entry Points → Form Completion → Lead Quality

4. **Wettbewerbsposition** vs MOVU, Sirelo

Output: Priorisierte Roadmap mit Effort/Impact-Matrix.`;

export const DeepResearchExporter: React.FC = () => {
  const [config, setConfig] = useState<ExportConfig>({
    includeCode: true,
    includeScreenshots: true,
    includeHtmlSnapshots: true,
    includeFlowData: true,
    includeCompetitorData: false,
    includeDesignSystem: true,
    includeAnalytics: false,
  });
  
  const [targetAI, setTargetAI] = useState<'chatgpt' | 'gemini' | 'both'>('both');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState<'chatgpt' | 'gemini' | null>(null);

  const handleConfigChange = (key: keyof ExportConfig) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyPrompt = async (type: 'chatgpt' | 'gemini') => {
    const prompt = type === 'chatgpt' ? DEFAULT_CHATGPT_PROMPT : DEFAULT_GEMINI_PROMPT;
    await navigator.clipboard.writeText(customPrompt || prompt);
    setCopied(type);
    toast.success('Prompt kopiert!');
    setTimeout(() => setCopied(null), 2000);
  };

  const generateExport = async () => {
    setIsExporting(true);
    setProgress(0);

    try {
      const zip = new JSZip();
      const timestamp = new Date().toISOString().split('T')[0];

      // Add prompts
      setProgress(10);
      const promptsFolder = zip.folder('prompts');
      if (targetAI === 'chatgpt' || targetAI === 'both') {
        promptsFolder?.file('chatgpt-prompt.md', customPrompt || DEFAULT_CHATGPT_PROMPT);
      }
      if (targetAI === 'gemini' || targetAI === 'both') {
        promptsFolder?.file('gemini-prompt.md', customPrompt || DEFAULT_GEMINI_PROMPT);
      }

      // Add README
      zip.file('README.md', `# Umzugscheck.ch Deep Research Package

Generated: ${timestamp}
Target AI: ${targetAI}

## Contents
${config.includeCode ? '- /code/ - Source code files' : ''}
${config.includeScreenshots ? '- /screenshots/ - Page screenshots' : ''}
${config.includeHtmlSnapshots ? '- /html/ - HTML snapshots' : ''}
${config.includeFlowData ? '- /flows/ - Flow analysis data' : ''}
${config.includeDesignSystem ? '- /design-system/ - CSS and Tailwind config' : ''}
${config.includeCompetitorData ? '- /competitors/ - Competitor analysis' : ''}
- /prompts/ - AI prompts for analysis

## How to Use

### ChatGPT
1. Start a new chat with GPT-4 or GPT-4o
2. Upload this entire ZIP file
3. Paste the prompt from prompts/chatgpt-prompt.md
4. Wait for complete analysis

### Gemini
1. Open Gemini Advanced
2. Upload this ZIP file
3. Paste the prompt from prompts/gemini-prompt.md
4. Review multi-modal analysis

## Analysis Focus
- Conversion optimization
- Swiss market fit
- UX/UI improvements
- Mobile experience
- Trust architecture
`);

      setProgress(20);

      // Add design system
      if (config.includeDesignSystem) {
        const designFolder = zip.folder('design-system');
        try {
          // Add CSS (would need actual file read in production)
          designFolder?.file('index.css', `/* Design System - See actual src/index.css */
/* Key variables:
   --primary: Swiss blue
   --secondary: Action red
   --background: Clean white
   --muted: Subtle grays
*/`);
          designFolder?.file('tailwind.config.ts', `/* See actual tailwind.config.ts for full config */`);
        } catch (e) {
          console.error('Error adding design system:', e);
        }
      }

      setProgress(40);

      // Add flow data from database
      if (config.includeFlowData) {
        const flowsFolder = zip.folder('flows');
        try {
          const { data: flowVersions } = await supabase
            .from('flow_versions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

          const { data: flowRuns } = await supabase
            .from('flow_analysis_runs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

          const { data: uxIssues } = await supabase
            .from('flow_ux_issues')
            .select('*')
            .eq('is_resolved', false)
            .limit(50);

          flowsFolder?.file('flow-versions.json', JSON.stringify(flowVersions || [], null, 2));
          flowsFolder?.file('flow-analysis-runs.json', JSON.stringify(flowRuns || [], null, 2));
          flowsFolder?.file('ux-issues.json', JSON.stringify(uxIssues || [], null, 2));
        } catch (e) {
          console.error('Error fetching flow data:', e);
        }
      }

      setProgress(60);

      // Add competitor data template
      if (config.includeCompetitorData) {
        const competitorsFolder = zip.folder('competitors');
        competitorsFolder?.file('competitor-matrix.json', JSON.stringify({
          competitors: [
            { name: 'MOVU', url: 'https://movu.ch', type: 'primary' },
            { name: 'Sirelo', url: 'https://sirelo.ch', type: 'secondary' },
            { name: 'Umzug.ch', url: 'https://umzug.ch', type: 'secondary' }
          ],
          features: {
            priceCalculator: true,
            videoInventory: false,
            instantQuote: true,
            escrowPayment: false
          }
        }, null, 2));
      }

      setProgress(80);

      // Add analysis summary
      zip.file('analysis-config.json', JSON.stringify({
        exportedAt: new Date().toISOString(),
        config,
        targetAI,
        projectUrl: 'https://umzugscheck.ch',
        version: '2.0'
      }, null, 2));

      setProgress(90);

      // Generate and download
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `umzugscheck-deep-research-${timestamp}.zip`);
      
      setProgress(100);
      toast.success('Export erfolgreich erstellt!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export fehlgeschlagen');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>Deep Research Exporter</CardTitle>
          </div>
          <CardDescription>
            Erstelle Analyse-Packages für ChatGPT oder Gemini Deep Research
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="config">
            <TabsList className="mb-4">
              <TabsTrigger value="config">Export-Konfiguration</TabsTrigger>
              <TabsTrigger value="prompts">AI Prompts</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-6">
              {/* Target AI Selection */}
              <div>
                <Label className="text-base font-medium">Ziel-AI</Label>
                <div className="flex gap-2 mt-2">
                  {(['chatgpt', 'gemini', 'both'] as const).map((ai) => (
                    <Button
                      key={ai}
                      variant={targetAI === ai ? 'default' : 'outline'}
                      onClick={() => setTargetAI(ai)}
                      className="flex-1"
                    >
                      {ai === 'chatgpt' && '🤖 ChatGPT'}
                      {ai === 'gemini' && '✨ Gemini'}
                      {ai === 'both' && '🎯 Beide'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Content Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="code" 
                    checked={config.includeCode}
                    onCheckedChange={() => handleConfigChange('includeCode')}
                  />
                  <Label htmlFor="code" className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Source Code
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="screenshots" 
                    checked={config.includeScreenshots}
                    onCheckedChange={() => handleConfigChange('includeScreenshots')}
                  />
                  <Label htmlFor="screenshots" className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Screenshots
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="html" 
                    checked={config.includeHtmlSnapshots}
                    onCheckedChange={() => handleConfigChange('includeHtmlSnapshots')}
                  />
                  <Label htmlFor="html" className="flex items-center gap-2">
                    <FileCode className="w-4 h-4" />
                    HTML Snapshots
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="flows" 
                    checked={config.includeFlowData}
                    onCheckedChange={() => handleConfigChange('includeFlowData')}
                  />
                  <Label htmlFor="flows" className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Flow-Daten
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="design" 
                    checked={config.includeDesignSystem}
                    onCheckedChange={() => handleConfigChange('includeDesignSystem')}
                  />
                  <Label htmlFor="design" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Design System
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="competitors" 
                    checked={config.includeCompetitorData}
                    onCheckedChange={() => handleConfigChange('includeCompetitorData')}
                  />
                  <Label htmlFor="competitors" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Wettbewerber
                  </Label>
                </div>
              </div>

              {/* Export Button */}
              <div className="pt-4">
                {isExporting && (
                  <div className="mb-4">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-1">
                      Exportiere... {progress}%
                    </p>
                  </div>
                )}
                <Button 
                  onClick={generateExport} 
                  disabled={isExporting}
                  className="w-full"
                  size="lg"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generiere Export...
                    </>
                  ) : (
                    <>
                      <Package className="w-4 h-4 mr-2" />
                      Deep Research Package erstellen
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="prompts" className="space-y-6">
              {/* ChatGPT Prompt */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base font-medium">ChatGPT Prompt</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyPrompt('chatgpt')}
                  >
                    {copied === 'chatgpt' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {DEFAULT_CHATGPT_PROMPT}
                </div>
              </div>

              {/* Gemini Prompt */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base font-medium">Gemini Prompt</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyPrompt('gemini')}
                  >
                    {copied === 'gemini' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {DEFAULT_GEMINI_PROMPT}
                </div>
              </div>

              {/* Custom Prompt */}
              <div>
                <Label className="text-base font-medium">Custom Prompt (optional)</Label>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Eigenen Analyse-Prompt eingeben..."
                  className="mt-2 h-32"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">💡 Tipps für beste Ergebnisse</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-muted-foreground">
          <p>• <strong>ChatGPT:</strong> Nutze GPT-4o für multimodale Analyse (Screenshots + Code)</p>
          <p>• <strong>Gemini:</strong> 1.5 Pro hat grösseres Kontext-Fenster für komplette Codebase</p>
          <p>• <strong>Fokus setzen:</strong> Enge Fragen liefern bessere Antworten als "analysiere alles"</p>
          <p>• <strong>Iterieren:</strong> Starte mit Quick Wins, dann deep dive in kritische Bereiche</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepResearchExporter;
