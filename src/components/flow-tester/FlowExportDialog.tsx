import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, FileText, Code, Link2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';

const BASE_URL = 'https://umzugscheck.ch';

interface FlowExportData {
  id: string;
  label: string;
  description: string;
  path: string;
  fullUrl: string;
  steps: number;
  stepDetails: { name: string; description: string }[];
  parentFlow?: string;
}

// Generate complete flow data
const generateFlowData = (): FlowExportData[] => {
  const flows: FlowExportData[] = [];
  
  // Add main flows
  Object.entries(FLOW_CONFIGS).forEach(([id, config]) => {
    flows.push({
      id: config.id,
      label: config.label,
      description: config.description,
      path: config.path,
      fullUrl: `${BASE_URL}${config.path}`,
      steps: config.steps.length,
      stepDetails: config.steps.map(s => ({ name: s.name, description: s.description })),
      parentFlow: config.parentFlow,
    });
  });
  
  // Add sub-variants
  Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
    // Avoid duplicates
    if (!flows.find(f => f.id === config.id)) {
      flows.push({
        id: config.id,
        label: config.label,
        description: config.description,
        path: config.path,
        fullUrl: `${BASE_URL}${config.path}`,
        steps: config.steps.length,
        stepDetails: config.steps.map(s => ({ name: s.name, description: s.description })),
        parentFlow: config.parentFlow,
      });
    }
  });
  
  return flows.sort((a, b) => a.id.localeCompare(b.id));
};

// Generate URL list
const generateUrlList = (flows: FlowExportData[]): string => {
  return flows.map(f => f.fullUrl).join('\n');
};

// Generate Markdown overview
const generateMarkdown = (flows: FlowExportData[]): string => {
  const lines: string[] = [
    '# Umzugscheck.ch Flow-Übersicht für ChatGPT Testing',
    '',
    `> Generiert am: ${new Date().toLocaleDateString('de-CH')} | Anzahl Flows: ${flows.length}`,
    '',
    '## Anleitung für ChatGPT Agent Mode',
    '',
    '1. Öffne jeden Flow-Link in einem neuen Tab',
    '2. Durchlaufe den kompletten Funnel bis zum Ende',
    '3. Bewerte jeden Flow nach folgenden Kriterien:',
    '   - UX/Usability (1-5)',
    '   - Mobile-Friendliness (1-5)',
    '   - Conversion-Optimierung (1-5)',
    '   - Ladezeit/Performance (1-5)',
    '   - Vertrauenssignale (1-5)',
    '',
    '---',
    '',
    '## Alle Flows',
    '',
  ];
  
  // Group by main version
  const grouped: Record<string, FlowExportData[]> = {};
  flows.forEach(f => {
    const prefix = f.id.match(/^v\d+|^umzugsofferten-v\d+/)?.[0]?.replace('umzugsofferten-', '') || 'other';
    if (!grouped[prefix]) grouped[prefix] = [];
    grouped[prefix].push(f);
  });
  
  Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0])).forEach(([prefix, groupFlows]) => {
    lines.push(`### ${prefix.toUpperCase()} Flows`);
    lines.push('');
    
    groupFlows.forEach(f => {
      lines.push(`#### ${f.label}`);
      lines.push(`- **ID:** \`${f.id}\``);
      lines.push(`- **URL:** ${f.fullUrl}`);
      lines.push(`- **Beschreibung:** ${f.description}`);
      lines.push(`- **Steps:** ${f.steps}`);
      if (f.stepDetails.length > 0) {
        lines.push('- **Flow-Schritte:**');
        f.stepDetails.forEach((step, i) => {
          lines.push(`  ${i + 1}. ${step.name}: ${step.description}`);
        });
      }
      lines.push('');
    });
  });
  
  lines.push('---');
  lines.push('');
  lines.push('## ChatGPT Prompt Template');
  lines.push('');
  lines.push('```');
  lines.push('Du bist ein UX-Experte und testest Umzugs-Offerten-Funnels.');
  lines.push('Öffne jeden der folgenden Links und bewerte:');
  lines.push('1. Klarheit der Nutzerführung');
  lines.push('2. Vertrauenssignale (Badges, Bewertungen, SSL)');
  lines.push('3. Mobile Optimierung');
  lines.push('4. Call-to-Action Qualität');
  lines.push('5. Formular-UX (Validierung, Fehlermeldungen)');
  lines.push('');
  lines.push('Erstelle eine Tabelle mit Bewertungen (1-5) und Verbesserungsvorschlägen.');
  lines.push('```');
  
  return lines.join('\n');
};

// Generate JSON export
const generateJson = (flows: FlowExportData[]): string => {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalFlows: flows.length,
    flows: flows.map(f => ({
      id: f.id,
      label: f.label,
      description: f.description,
      url: f.fullUrl,
      steps: f.steps,
      stepDetails: f.stepDetails,
      parentFlow: f.parentFlow || null,
    })),
  }, null, 2);
};

export function FlowExportDialog() {
  const [copied, setCopied] = useState<string | null>(null);
  const flows = generateFlowData();
  
  const urlList = generateUrlList(flows);
  const markdown = generateMarkdown(flows);
  const json = generateJson(flows);
  
  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success(`${type} kopiert!`);
    setTimeout(() => setCopied(null), 2000);
  };
  
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filename} heruntergeladen!`);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export für ChatGPT
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Flow-Export für ChatGPT Testing
            <Badge variant="secondary">{flows.length} Flows</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="markdown" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="urls" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              URL-Liste
            </TabsTrigger>
            <TabsTrigger value="markdown" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Markdown
            </TabsTrigger>
            <TabsTrigger value="json" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              JSON
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="urls" className="flex-1 overflow-hidden flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Einfache Liste aller {flows.length} Flow-URLs. Ideal für schnelles Testen.
            </p>
            <Textarea 
              value={urlList} 
              readOnly 
              className="flex-1 font-mono text-xs resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={() => copyToClipboard(urlList, 'URLs')} className="flex-1">
                {copied === 'URLs' ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Kopieren
              </Button>
              <Button variant="outline" onClick={() => downloadFile(urlList, 'umzugscheck-flows.txt', 'text/plain')}>
                <Download className="h-4 w-4 mr-2" />
                Download .txt
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="markdown" className="flex-1 overflow-hidden flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Vollständige Dokumentation mit Beschreibungen, Steps und ChatGPT-Prompt. Perfekt für Agent Mode.
            </p>
            <Textarea 
              value={markdown} 
              readOnly 
              className="flex-1 font-mono text-xs resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={() => copyToClipboard(markdown, 'Markdown')} className="flex-1">
                {copied === 'Markdown' ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Kopieren
              </Button>
              <Button variant="outline" onClick={() => downloadFile(markdown, 'umzugscheck-flows.md', 'text/markdown')}>
                <Download className="h-4 w-4 mr-2" />
                Download .md
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="json" className="flex-1 overflow-hidden flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Strukturierter JSON-Export für technische Analyse oder API-Integration.
            </p>
            <Textarea 
              value={json} 
              readOnly 
              className="flex-1 font-mono text-xs resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={() => copyToClipboard(json, 'JSON')} className="flex-1">
                {copied === 'JSON' ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Kopieren
              </Button>
              <Button variant="outline" onClick={() => downloadFile(json, 'umzugscheck-flows.json', 'application/json')}>
                <Download className="h-4 w-4 mr-2" />
                Download .json
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            <strong>Tipp für ChatGPT:</strong> Kopiere die Markdown-Version und füge sie in ChatGPT mit aktiviertem "Agent Mode" oder "Browse with Bing" ein. 
            ChatGPT kann dann jeden Link besuchen und analysieren.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}