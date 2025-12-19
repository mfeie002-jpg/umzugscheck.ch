import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Package, Download, Loader2, Copy, CheckCircle2, 
  FileText, Camera, Code, Plus, X,
  Trash2, Zap, FileDown,
  Wrench, ExternalLink, BookOpen, Terminal, FileCode
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { toast } from "sonner";

// ============================================================================
// CONFIGURATION
// ============================================================================

const SCREENSHOT_API_KEY = "892618";

// ============================================================================
// TYPES
// ============================================================================

interface ProjectConfig {
  projectName: string;
  projectUrl: string;
  description: string;
  goals: string;
  targetAudience: string;
  competitors: string;
  additionalPages: string[];
}

interface ScreenshotConfig {
  dimension: string;
  format: 'png' | 'jpg';
  delay: number;
  fullPage: boolean;
}

interface CapturedScreenshot {
  url: string;
  blob: Blob;
  dimension: string;
  timestamp: Date;
}

// ============================================================================
// DIMENSION PRESETS
// ============================================================================

const DIMENSION_PRESETS = {
  desktop: [
    { label: 'HD (1920x1080)', value: '1920x1080' },
    { label: 'HD Full Page', value: '1920xfull' },
    { label: 'MacBook (1440x900)', value: '1440x900' },
  ],
  mobile: [
    { label: 'iPhone 14 Pro (393x852)', value: '393x852' },
    { label: 'iPhone SE (375x667)', value: '375x667' },
    { label: 'Android (360x800)', value: '360x800' },
  ]
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const buildScreenshotUrl = (targetUrl: string, dimension: string, delay: number = 0): string => {
  const [width, height] = dimension.split('x');
  const isFullPage = height === 'full';
  
  const params = new URLSearchParams({
    key: SCREENSHOT_API_KEY,
    url: targetUrl,
    dimension: `${width}x${isFullPage ? '0' : height}`,
    format: 'png',
    cacheLimit: '0',
    delay: delay.toString(),
  });
  
  if (isFullPage) {
    params.set('full', 'true');
  }
  
  return `https://api.screenshotmachine.com?${params.toString()}`;
};

const fetchScreenshotAsBlob = async (url: string): Promise<Blob> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Screenshot failed');
  return await response.blob();
};

const fetchHtmlContent = async (url: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-html', {
      body: { url }
    });
    if (error) throw error;
    return data?.html || '';
  } catch (error) {
    console.error('Failed to fetch HTML:', error);
    return '';
  }
};

// ============================================================================
// STANDALONE FILES CONTENT (embedded for download)
// ============================================================================

const STANDALONE_PROMPTS_CONTENT = `# Standalone Component Prompts

Ready-to-use prompts for setting up the standalone tools in any Lovable or Softgen project.

---

## 1. AI Feedback Package - Setup Prompt

Copy and paste this into a new Lovable/Softgen chat:

\`\`\`
Create an AI Feedback Package Generator with:

- Project name, URL, description, goals, target audience inputs
- Auto-discover pages by crawling homepage links  
- Capture desktop (1920px) and mobile (375px) screenshots
- Fetch HTML source for SEO analysis
- Capture competitor screenshots
- Generate tailored AI prompts for analysis
- Download everything as ZIP with PDF report

Technical: React + TypeScript, JSZip, file-saver, jsPDF, lucide-react
Screenshot API: ScreenshotMachine (key: 892618)
Edge Function: fetch-html (verify_jwt = false)
\`\`\`

---

## 2. Screenshot Machine - Setup Prompt

\`\`\`
Create a Screenshot Machine with:

- Single and bulk URL screenshot capture
- Device selection (desktop/mobile) with dimension presets
- Full-page capture toggle
- Delay configuration (1-8 seconds)
- Download as PNG or ZIP
- Screenshot API: ScreenshotMachine (key: 892618)
\`\`\`

---

## 3. Web Analyzer Suite (All-in-One)

\`\`\`
Create a combined Web Analyzer Suite with tabs for:
1. AI Feedback Package Generator
2. Screenshot Machine  
3. Project Analyzer
All tools share utilities and API configuration.
Screenshot API key: 892618
\`\`\`

---

## Dependencies

\`\`\`bash
npm install jszip file-saver jspdf lucide-react
\`\`\`

## Edge Function (supabase/functions/fetch-html/index.ts)

\`\`\`typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  
  try {
    const { url } = await req.json();
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AnalyzerBot/1.0)' }
    });
    const html = await response.text();
    return new Response(JSON.stringify({ html, url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
\`\`\`

Add to supabase/config.toml:
\`\`\`
[functions.fetch-html]
verify_jwt = false
\`\`\`
`;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AdminTools = () => {
  const { user, isAdmin, loading } = useAuth();
  
  // AI Feedback Package State
  const [config, setConfig] = useState<ProjectConfig>({
    projectName: 'Umzugscheck',
    projectUrl: 'https://umzugscheck.ch',
    description: '',
    goals: '',
    targetAudience: '',
    competitors: '',
    additionalPages: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  
  // Screenshot Machine State
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotConfig, setScreenshotConfig] = useState<ScreenshotConfig>({
    dimension: '1920x1080',
    format: 'png',
    delay: 0,
    fullPage: false,
  });
  const [capturedScreenshots, setCapturedScreenshots] = useState<CapturedScreenshot[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [bulkUrls, setBulkUrls] = useState('');

  // Redirect if not admin
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // ============================================================================
  // AI FEEDBACK PACKAGE FUNCTIONS
  // ============================================================================

  const generatePackage = async () => {
    if (!config.projectUrl) {
      toast.error('Bitte URL eingeben');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setStatus('Initialisiere...');

    try {
      const zip = new JSZip();
      const screenshotsFolder = zip.folder('screenshots');
      const htmlFolder = zip.folder('html');
      
      const allPages = [
        { path: '/', name: 'homepage' },
        ...config.additionalPages.map((p, i) => ({ path: p, name: `page-${i + 1}` }))
      ];

      const totalSteps = allPages.length * 3 + 2;
      let currentStep = 0;

      for (const page of allPages) {
        const fullUrl = `${config.projectUrl.replace(/\/$/, '')}${page.path}`;
        
        // Desktop screenshot
        setStatus(`Desktop Screenshot: ${page.name}...`);
        try {
          const desktopUrl = buildScreenshotUrl(fullUrl, '1920xfull', 2000);
          const desktopBlob = await fetchScreenshotAsBlob(desktopUrl);
          screenshotsFolder?.file(`${page.name}-desktop.png`, desktopBlob);
        } catch (e) {
          console.error('Desktop screenshot failed:', e);
        }
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);

        // Mobile screenshot
        setStatus(`Mobile Screenshot: ${page.name}...`);
        try {
          const mobileUrl = buildScreenshotUrl(fullUrl, '393x852', 2000);
          const mobileBlob = await fetchScreenshotAsBlob(mobileUrl);
          screenshotsFolder?.file(`${page.name}-mobile.png`, mobileBlob);
        } catch (e) {
          console.error('Mobile screenshot failed:', e);
        }
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);

        // HTML content
        setStatus(`HTML abrufen: ${page.name}...`);
        const html = await fetchHtmlContent(fullUrl);
        if (html) {
          htmlFolder?.file(`${page.name}.html`, html);
        }
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);
      }

      // Generate analysis prompt
      setStatus('Erstelle Analyse-Prompt...');
      const promptContent = generateAnalysisPrompt();
      zip.file('ANALYSIS_PROMPT.md', promptContent);
      currentStep++;
      setProgress((currentStep / totalSteps) * 100);

      // Generate PDF report
      setStatus('Erstelle PDF Report...');
      const pdfBlob = generatePdfReport();
      zip.file('PROJECT_BRIEF.pdf', pdfBlob);
      currentStep++;
      setProgress((currentStep / totalSteps) * 100);

      // Download ZIP
      setStatus('Erstelle ZIP...');
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${config.projectName.toLowerCase().replace(/\s+/g, '-')}-feedback-package.zip`);

      setStatus('Fertig!');
      toast.success('Package erfolgreich erstellt!');
    } catch (error) {
      console.error('Package generation failed:', error);
      toast.error('Fehler beim Erstellen des Packages');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAnalysisPrompt = () => {
    return `# AI Analysis Request: ${config.projectName}

## Project Overview
- **URL**: ${config.projectUrl}
- **Description**: ${config.description || 'Swiss moving comparison platform'}
- **Goals**: ${config.goals || 'Lead generation, SEO optimization, user trust'}
- **Target Audience**: ${config.targetAudience || 'People planning to move in Switzerland'}

## Competitors
${config.competitors || 'Not specified'}

## Analysis Instructions

Please analyze the attached screenshots and HTML files. Focus on:

### 1. UX/UI Analysis
- Visual hierarchy and layout
- Mobile responsiveness
- Call-to-action effectiveness
- User flow optimization

### 2. SEO Analysis
- Meta tags and structure
- Heading hierarchy (H1-H6)
- Internal linking
- Page speed indicators

### 3. Conversion Optimization
- Form design and placement
- Trust signals
- Value proposition clarity
- Friction points

### 4. Recommendations
- Quick wins (easy to implement)
- Medium-term improvements
- Strategic recommendations

Please provide specific, actionable feedback with examples from the screenshots.
`;
  };

  const generatePdfReport = () => {
    const pdf = new jsPDF();
    
    pdf.setFontSize(20);
    pdf.text(`Project Brief: ${config.projectName}`, 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`URL: ${config.projectUrl}`, 20, 50);
    pdf.text(`Generated: ${new Date().toLocaleDateString('de-CH')}`, 20, 60);
    
    pdf.setFontSize(14);
    pdf.text('Project Goals:', 20, 80);
    pdf.setFontSize(10);
    const goals = config.goals || 'Lead generation, SEO, User trust';
    pdf.text(goals.substring(0, 80), 20, 90);
    
    pdf.setFontSize(14);
    pdf.text('Target Audience:', 20, 110);
    pdf.setFontSize(10);
    const audience = config.targetAudience || 'Swiss moving customers';
    pdf.text(audience.substring(0, 80), 20, 120);
    
    return pdf.output('blob');
  };

  // ============================================================================
  // SCREENSHOT MACHINE FUNCTIONS
  // ============================================================================

  const captureScreenshot = async () => {
    if (!screenshotUrl) {
      toast.error('Bitte URL eingeben');
      return;
    }

    setIsCapturing(true);
    try {
      const dimension = screenshotConfig.fullPage 
        ? screenshotConfig.dimension.replace(/x\d+$/, 'xfull')
        : screenshotConfig.dimension;
      
      const url = buildScreenshotUrl(screenshotUrl, dimension, screenshotConfig.delay * 1000);
      const blob = await fetchScreenshotAsBlob(url);
      
      setCapturedScreenshots(prev => [...prev, {
        url: screenshotUrl,
        blob,
        dimension,
        timestamp: new Date()
      }]);
      
      toast.success('Screenshot erfasst!');
    } catch (error) {
      toast.error('Screenshot fehlgeschlagen');
    } finally {
      setIsCapturing(false);
    }
  };

  const captureBulkScreenshots = async () => {
    const urls = bulkUrls.split('\n').filter(u => u.trim());
    if (urls.length === 0) {
      toast.error('Keine URLs eingegeben');
      return;
    }

    setIsCapturing(true);
    const zip = new JSZip();

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i].trim();
      try {
        const dimension = screenshotConfig.fullPage 
          ? screenshotConfig.dimension.replace(/x\d+$/, 'xfull')
          : screenshotConfig.dimension;
        
        const screenshotUrl = buildScreenshotUrl(url, dimension, screenshotConfig.delay * 1000);
        const blob = await fetchScreenshotAsBlob(screenshotUrl);
        
        const hostname = new URL(url).hostname.replace(/\./g, '-');
        zip.file(`${hostname}-${i + 1}.png`, blob);
      } catch (error) {
        console.error(`Failed: ${url}`);
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'bulk-screenshots.zip');
    setIsCapturing(false);
    toast.success('Bulk Screenshots heruntergeladen!');
  };

  const downloadScreenshot = (screenshot: CapturedScreenshot) => {
    const hostname = new URL(screenshot.url).hostname.replace(/\./g, '-');
    saveAs(screenshot.blob, `${hostname}-${screenshot.dimension}.png`);
  };

  const downloadAllScreenshots = async () => {
    if (capturedScreenshots.length === 0) return;
    
    const zip = new JSZip();
    capturedScreenshots.forEach((s, i) => {
      const hostname = new URL(s.url).hostname.replace(/\./g, '-');
      zip.file(`${hostname}-${s.dimension}-${i + 1}.png`, s.blob);
    });
    
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'screenshots.zip');
  };

  // ============================================================================
  // DOWNLOAD STANDALONE FILES
  // ============================================================================

  const downloadStandaloneFile = (type: 'prompts' | 'ai-feedback' | 'screenshot' | 'suite') => {
    try {
      let content = '';
      let filename = '';
      let mimeType = 'text/plain';

      switch (type) {
        case 'prompts':
          content = STANDALONE_PROMPTS_CONTENT;
          filename = 'STANDALONE_PROMPTS.md';
          mimeType = 'text/markdown';
          break;
        case 'ai-feedback':
          toast.info('Öffne Code-Editor → src/standalone/AIFeedbackPackageStandalone.tsx → Kopiere den Inhalt');
          return;
        case 'screenshot':
          toast.info('Öffne Code-Editor → src/standalone/ScreenshotMachineStandalone.tsx → Kopiere den Inhalt');
          return;
        case 'suite':
          toast.info('Öffne Code-Editor → src/standalone/WebAnalyzerSuiteStandalone.tsx → Kopiere den Inhalt');
          return;
      }

      const blob = new Blob([content], { type: mimeType });
      saveAs(blob, filename);
      toast.success(`${filename} heruntergeladen!`);
    } catch (error) {
      toast.error('Download fehlgeschlagen');
    }
  };

  const copyFilePathToClipboard = (path: string) => {
    navigator.clipboard.writeText(path);
    toast.success(`Pfad kopiert: ${path}`);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Wrench className="h-8 w-8 text-orange-600" />
            </div>
            Admin Tools & Downloads
          </h1>
          <p className="text-muted-foreground mt-2">
            Analyse-Tools, Screenshots und Standalone-Komponenten für andere Projekte
          </p>
        </div>

        {/* Download Section - Prominent Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Start Prompts */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                ChatGPT/Claude Prompts
              </CardTitle>
              <CardDescription>
                Fertige Prompts um die Tools in einem neuen Projekt zu erstellen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Diese Markdown-Datei enthält alle Prompts die du brauchst, um die Tools in einem neuen Lovable oder Softgen Projekt zu erstellen.
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => downloadStandaloneFile('prompts')}
                  className="flex-1"
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  STANDALONE_PROMPTS.md
                </Button>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-xs">
                <p className="font-medium mb-1">Enthält:</p>
                <ul className="text-muted-foreground space-y-0.5">
                  <li>• AI Feedback Package Setup</li>
                  <li>• Screenshot Machine Setup</li>
                  <li>• Web Analyzer Suite (All-in-One)</li>
                  <li>• Edge Function Code</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Standalone Components */}
          <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <FileCode className="h-5 w-5 text-orange-600" />
                </div>
                Standalone Komponenten
              </CardTitle>
              <CardDescription>
                Kopiere komplette Komponenten für andere Projekte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {[
                  { name: 'AI Feedback Package', path: 'src/standalone/AIFeedbackPackageStandalone.tsx', lines: 868, icon: Package },
                  { name: 'Screenshot Machine', path: 'src/standalone/ScreenshotMachineStandalone.tsx', lines: 634, icon: Camera },
                  { name: 'Web Analyzer Suite', path: 'src/standalone/WebAnalyzerSuiteStandalone.tsx', lines: 1104, icon: Zap, highlight: true },
                ].map((item) => (
                  <Button 
                    key={item.path}
                    variant="outline" 
                    className={`w-full h-auto py-3 justify-between ${item.highlight ? 'border-orange-500/30 bg-orange-500/5' : ''}`}
                    onClick={() => copyFilePathToClipboard(item.path)}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{item.lines} Zeilen</Badge>
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Button>
                ))}
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-xs">
                <p className="font-medium mb-1 flex items-center gap-2">
                  <Terminal className="h-3 w-3" />
                  Dependencies:
                </p>
                <code className="text-muted-foreground">npm install jszip file-saver jspdf</code>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step by Step Instructions */}
        <Card className="mb-8 bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Anleitung: So nutzt du die Standalone-Dateien
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { step: 1, title: 'Prompts laden', desc: 'STANDALONE_PROMPTS.md herunterladen' },
                { step: 2, title: 'Neues Projekt', desc: 'Lovable/Softgen Projekt öffnen' },
                { step: 3, title: 'Prompt kopieren', desc: 'Gewünschten Prompt aus MD-Datei kopieren' },
                { step: 4, title: 'AI einfügen', desc: 'Prompt in Chat einfügen und erstellen lassen' },
                { step: 5, title: 'Fertig!', desc: 'Tool ist einsatzbereit' },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center p-3 rounded-lg bg-background">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mb-2">
                    {item.step}
                  </div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tools Tabs */}
        <Tabs defaultValue="ai-feedback" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai-feedback" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              AI Feedback Package
            </TabsTrigger>
            <TabsTrigger value="screenshots" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Screenshot Machine
            </TabsTrigger>
          </TabsList>

          {/* AI Feedback Package Tab */}
          <TabsContent value="ai-feedback">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Projekt Konfiguration</CardTitle>
                  <CardDescription>
                    Gib die Projektdaten für das Feedback-Package ein
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Projektname</Label>
                      <Input 
                        value={config.projectName}
                        onChange={(e) => setConfig({...config, projectName: e.target.value})}
                        placeholder="Mein Projekt"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL</Label>
                      <Input 
                        value={config.projectUrl}
                        onChange={(e) => setConfig({...config, projectUrl: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Beschreibung</Label>
                    <Textarea 
                      value={config.description}
                      onChange={(e) => setConfig({...config, description: e.target.value})}
                      placeholder="Was macht dieses Projekt?"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Ziele</Label>
                    <Textarea 
                      value={config.goals}
                      onChange={(e) => setConfig({...config, goals: e.target.value})}
                      placeholder="Lead generation, SEO, ..."
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Zielgruppe</Label>
                    <Input 
                      value={config.targetAudience}
                      onChange={(e) => setConfig({...config, targetAudience: e.target.value})}
                      placeholder="Wer sind die Nutzer?"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Konkurrenten (URLs)</Label>
                    <Textarea 
                      value={config.competitors}
                      onChange={(e) => setConfig({...config, competitors: e.target.value})}
                      placeholder="https://competitor1.ch&#10;https://competitor2.ch"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Zusätzliche Seiten</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="/rechner, /firmen, ..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.currentTarget;
                            if (input.value.trim()) {
                              setConfig({
                                ...config,
                                additionalPages: [...config.additionalPages, input.value.trim()]
                              });
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="/rechner, /firmen, ..."]') as HTMLInputElement;
                          if (input?.value.trim()) {
                            setConfig({
                              ...config,
                              additionalPages: [...config.additionalPages, input.value.trim()]
                            });
                            input.value = '';
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {config.additionalPages.map((page, i) => (
                        <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => {
                          setConfig({
                            ...config,
                            additionalPages: config.additionalPages.filter((_, idx) => idx !== i)
                          });
                        }}>
                          {page} <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Package generieren</CardTitle>
                  <CardDescription>
                    Erstellt Screenshots, HTML und AI-Prompts als ZIP
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isGenerating && (
                    <div className="space-y-2">
                      <Progress value={progress} />
                      <p className="text-sm text-muted-foreground">{status}</p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={generatePackage} 
                    disabled={isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generiere...
                      </>
                    ) : (
                      <>
                        <Package className="h-4 w-4 mr-2" />
                        Package erstellen & Download
                      </>
                    )}
                  </Button>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Das Package enthält:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <Camera className="h-4 w-4" /> Desktop & Mobile Screenshots
                      </li>
                      <li className="flex items-center gap-2">
                        <Code className="h-4 w-4" /> HTML Source Code
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4" /> AI Analysis Prompt
                      </li>
                      <li className="flex items-center gap-2">
                        <FileDown className="h-4 w-4" /> PDF Project Brief
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Screenshot Machine Tab */}
          <TabsContent value="screenshots">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Einzel-Screenshot</CardTitle>
                  <CardDescription>
                    Erfasse einen einzelnen Screenshot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input 
                      value={screenshotUrl}
                      onChange={(e) => setScreenshotUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Dimension</Label>
                      <Select 
                        value={screenshotConfig.dimension}
                        onValueChange={(v) => setScreenshotConfig({...screenshotConfig, dimension: v})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="header" disabled className="font-semibold">Desktop</SelectItem>
                          {DIMENSION_PRESETS.desktop.map(d => (
                            <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                          ))}
                          <SelectItem value="header2" disabled className="font-semibold">Mobile</SelectItem>
                          {DIMENSION_PRESETS.mobile.map(d => (
                            <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Verzögerung (Sek.)</Label>
                      <Input 
                        type="number"
                        value={screenshotConfig.delay}
                        onChange={(e) => setScreenshotConfig({...screenshotConfig, delay: parseInt(e.target.value) || 0})}
                        min={0}
                        max={10}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={screenshotConfig.fullPage}
                      onCheckedChange={(v) => setScreenshotConfig({...screenshotConfig, fullPage: v})}
                    />
                    <Label>Volle Seite erfassen</Label>
                  </div>
                  
                  <Button 
                    onClick={captureScreenshot}
                    disabled={isCapturing}
                    className="w-full"
                  >
                    {isCapturing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4 mr-2" />
                    )}
                    Screenshot erfassen
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bulk Screenshots</CardTitle>
                  <CardDescription>
                    Mehrere URLs auf einmal erfassen
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>URLs (eine pro Zeile)</Label>
                    <Textarea 
                      value={bulkUrls}
                      onChange={(e) => setBulkUrls(e.target.value)}
                      placeholder="https://example.com&#10;https://another.com"
                      rows={6}
                    />
                  </div>
                  
                  <Button 
                    onClick={captureBulkScreenshots}
                    disabled={isCapturing}
                    className="w-full"
                  >
                    {isCapturing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Alle erfassen & ZIP Download
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Captured Screenshots */}
            {capturedScreenshots.length > 0 && (
              <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Erfasste Screenshots ({capturedScreenshots.length})</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={downloadAllScreenshots}>
                      <Download className="h-4 w-4 mr-2" />
                      Alle herunterladen
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCapturedScreenshots([])}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Alle löschen
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {capturedScreenshots.map((screenshot, i) => (
                      <div key={i} className="border rounded-lg overflow-hidden group">
                        <img 
                          src={URL.createObjectURL(screenshot.blob)}
                          alt={screenshot.url}
                          className="w-full h-32 object-cover object-top"
                        />
                        <div className="p-2 text-xs">
                          <p className="truncate font-medium">{new URL(screenshot.url).hostname}</p>
                          <p className="text-muted-foreground">{screenshot.dimension}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full mt-1"
                            onClick={() => downloadScreenshot(screenshot)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminTools;
