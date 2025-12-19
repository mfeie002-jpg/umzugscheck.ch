import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Package, Download, Loader2, Copy, CheckCircle2, FileArchive, 
  Code, Zap, FileText, Globe, Camera, Sparkles, Wand2
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { supabase } from "@/integrations/supabase/client";

const SCREENSHOT_API_KEY = "892618";

interface KitConfig {
  projectName: string;
  projectUrl: string;
  description: string;
  targetPlatform: 'lovable' | 'softgen' | 'both';
  includeAnalytics: boolean;
  includeScreenshots: boolean;
  includeEdgeFunctions: boolean;
  includeComponents: boolean;
  customPrompt: string;
}

export function LovableImplementationKit() {
  const [config, setConfig] = useState<KitConfig>({
    projectName: "umzugscheck.ch",
    projectUrl: "https://umzugscheck.ch",
    description: "Premium Swiss moving comparison platform with AI-powered price calculator and lead generation.",
    targetPlatform: 'both',
    includeAnalytics: true,
    includeScreenshots: true,
    includeEdgeFunctions: true,
    includeComponents: true,
    customPrompt: "",
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ step: "", percent: 0 });
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  const TOP_PAGES = [
    "https://umzugscheck.ch",
    "https://umzugscheck.ch/umzugsofferten",
    "https://umzugscheck.ch/preisrechner",
    "https://umzugscheck.ch/firmen",
    "https://umzugscheck.ch/beste-umzugsfirma",
  ];

  const generateLovablePrompt = (): string => {
    return `# 🚀 Implementation Request for ${config.projectName}

## Project Overview
I want you to implement a website analysis and screenshot capture system similar to ${config.projectUrl}.

## What I Need

### 1. Screenshot Capture System
Implement a complete screenshot capture system with:
- Full-page screenshot capture using ScreenshotMachine API
- Support for desktop (1920px) and mobile (375px) resolutions
- Bulk capture for multiple URLs
- HTML source code extraction alongside screenshots
- Export as ZIP with organized folder structure

### 2. Edge Functions Required
Create these Supabase Edge Functions:
- \`capture-screenshot\`: Capture screenshots with JavaScript rendering wait time
- \`fetch-html\`: Fetch and clean HTML source code from URLs
- \`lighthouse\`: Run PageSpeed Insights for performance analysis

### 3. Admin Dashboard Components
Create these React components:
- \`ScreenshotMachine.tsx\`: UI for single/bulk screenshot capture
- \`UltimateZipPackage.tsx\`: Generate comprehensive analysis packages
- \`LighthouseAudit.tsx\`: Performance audit interface
- \`HeatmapAnalytics.tsx\`: Visual analytics dashboard

### 4. Key Features
- Store screenshots in Supabase Storage bucket \`screenshots-archive\`
- Generate shareable public URLs for ZIP packages
- Include metadata JSON for each capture
- Support for competitor analysis (capture competitor sites)

## Technical Requirements
- React 18 + TypeScript + Tailwind CSS
- Supabase for backend (Edge Functions + Storage)
- JSZip for ZIP generation
- file-saver for downloads

## API Configuration
The system should use ScreenshotMachine API with these parameters:
\`\`\`
key: YOUR_API_KEY
url: TARGET_URL
dimension: 1920xfull (for full-page) or specific resolution
delay: 5000 (wait for JavaScript animations)
format: png
cacheLimit: 0
\`\`\`

## Expected Output
A working admin dashboard where I can:
1. Enter any URL and capture desktop/mobile screenshots
2. Bulk capture multiple URLs
3. Download everything as ZIP with HTML sources
4. Upload to cloud storage for sharing
5. Run performance audits

## Reference
The implementation should work like ${config.projectUrl}/admin (the admin dashboard with screenshot tools).

Please implement this step by step, starting with the Edge Functions, then the components, then the admin page integration.
`;
  };

  const generateSoftgenPrompt = (): string => {
    return `Create a website analysis tool with these features:

1. **Screenshot System**
   - Capture full-page screenshots using ScreenshotMachine API
   - Support desktop (1920px) and mobile (375px)
   - Bulk URL processing
   - ZIP export with screenshots + HTML

2. **Backend (Edge Functions)**
   - capture-screenshot: Screenshot with JS wait time
   - fetch-html: Get clean HTML from URLs
   - lighthouse: PageSpeed Insights integration

3. **Frontend (React Components)**
   - ScreenshotMachine: Single/bulk capture UI
   - UltimateZipPackage: Analysis package generator
   - Admin dashboard with tabs

4. **Storage**
   - Supabase Storage bucket for archives
   - Public URL generation for sharing

Reference: ${config.projectUrl}

Tech: React, TypeScript, Tailwind, Supabase, JSZip
`;
  };

  const generateEdgeFunctionCode = (): string => {
    return `// supabase/functions/capture-screenshot/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SCREENSHOT_API_KEY = Deno.env.get('SCREENSHOTMACHINE_API_KEY') || 'YOUR_KEY';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, dimension = '1920xfull', delay = 5000, format = 'png' } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const params = new URLSearchParams({
      key: SCREENSHOT_API_KEY,
      url,
      dimension,
      format,
      cacheLimit: '0',
      delay: String(delay),
    });

    const response = await fetch(\`https://api.screenshotmachine.com?\${params}\`);
    const imageBlob = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(imageBlob)));

    return new Response(
      JSON.stringify({ 
        success: true,
        image: \`data:image/\${format};base64,\${base64}\`,
        url,
        capturedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// supabase/functions/fetch-html/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });

    const html = await response.text();
    const cleanHtml = html
      .replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, '')
      .replace(/<noscript\\b[^<]*(?:(?!<\\/noscript>)<[^<]*)*<\\/noscript>/gi, '');

    return new Response(
      JSON.stringify({ html: cleanHtml, url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
`;
  };

  const generateComponentCode = (): string => {
    return `// src/components/admin/ScreenshotMachine.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { supabase } from "@/integrations/supabase/client";

export function ScreenshotMachine() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const captureScreenshot = async () => {
    if (!url) return;
    setLoading(true);
    
    try {
      // Option 1: Direct API call
      const params = new URLSearchParams({
        key: 'YOUR_API_KEY',
        url,
        dimension: '1920xfull',
        format: 'png',
        delay: '5000',
      });
      
      const imageUrl = \`https://api.screenshotmachine.com?\${params}\`;
      
      setResults(prev => [{
        url,
        imageUrl,
        timestamp: new Date(),
      }, ...prev]);
      
      toast.success("Screenshot captured!");
    } catch (error) {
      toast.error("Failed to capture screenshot");
    } finally {
      setLoading(false);
    }
  };

  const downloadAsZip = async () => {
    const zip = new JSZip();
    
    for (const result of results) {
      const response = await fetch(result.imageUrl);
      const blob = await response.blob();
      const filename = new URL(result.url).pathname.replace(/\\//g, '_') || 'index';
      zip.file(\`\${filename}.png\`, blob);
    }
    
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, \`screenshots_\${new Date().toISOString().split('T')[0]}.zip\`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Screenshot Machine</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
          />
          <Button onClick={captureScreenshot} disabled={loading}>
            {loading ? "Capturing..." : "Capture"}
          </Button>
        </div>
        
        {results.length > 0 && (
          <>
            <Button onClick={downloadAsZip}>Download All as ZIP</Button>
            <div className="grid grid-cols-2 gap-4">
              {results.map((r, i) => (
                <img key={i} src={r.imageUrl} alt={r.url} className="rounded border" />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
`;
  };

  const generatePackage = async () => {
    setLoading(true);
    setProgress({ step: "Initialisiere...", percent: 0 });

    const zip = new JSZip();

    try {
      // 1. Generate prompts
      setProgress({ step: "Generiere Prompts...", percent: 10 });
      const lovablePrompt = generateLovablePrompt();
      const softgenPrompt = generateSoftgenPrompt();
      
      zip.file("LOVABLE_PROMPT.md", lovablePrompt);
      zip.file("SOFTGEN_PROMPT.md", softgenPrompt);
      setGeneratedPrompt(lovablePrompt);

      // 2. Edge function code
      if (config.includeEdgeFunctions) {
        setProgress({ step: "Generiere Edge Functions...", percent: 20 });
        zip.file("edge-functions/README.md", `# Edge Functions\n\nCopy these to your supabase/functions/ directory`);
        zip.file("edge-functions/code.ts", generateEdgeFunctionCode());
      }

      // 3. Component code
      if (config.includeComponents) {
        setProgress({ step: "Generiere Components...", percent: 30 });
        zip.file("components/README.md", `# React Components\n\nCopy these to your src/components/admin/ directory`);
        zip.file("components/ScreenshotMachine.tsx", generateComponentCode());
      }

      // 4. Screenshots (optional)
      if (config.includeScreenshots) {
        setProgress({ step: "Erfasse Screenshots...", percent: 40 });
        
        for (let i = 0; i < Math.min(TOP_PAGES.length, 3); i++) {
          const pageUrl = TOP_PAGES[i];
          setProgress({ step: `Screenshot ${i + 1}/${Math.min(TOP_PAGES.length, 3)}...`, percent: 40 + (i * 15) });
          
          try {
            const params = new URLSearchParams({
              key: SCREENSHOT_API_KEY,
              url: pageUrl,
              dimension: '1920xfull',
              format: 'png',
              cacheLimit: '0',
              delay: '5000',
            });
            
            const response = await fetch(`https://api.screenshotmachine.com?${params}`);
            if (response.ok) {
              const blob = await response.blob();
              const filename = new URL(pageUrl).pathname.replace(/\//g, '_') || 'index';
              zip.file(`screenshots/${filename}.png`, blob);
            }
          } catch (error) {
            console.error(`Failed to capture ${pageUrl}:`, error);
          }
          
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      // 5. README with instructions
      setProgress({ step: "Finalisiere...", percent: 90 });
      zip.file("README.md", `# ${config.projectName} Implementation Kit

## For Lovable.dev
1. Open Lovable.dev and create a new project
2. Copy the content of \`LOVABLE_PROMPT.md\` into the chat
3. Let Lovable implement the system step by step
4. Add your ScreenshotMachine API key as a secret

## For Softgen.ai
1. Open Softgen.ai and create a new project
2. Copy the content of \`SOFTGEN_PROMPT.md\` into the chat
3. Follow the implementation steps

## Manual Implementation
If you prefer manual setup:
1. Copy edge functions from \`edge-functions/\` to your Supabase project
2. Copy components from \`components/\` to your React project
3. Configure your API keys

## API Key Required
Get a free API key from https://www.screenshotmachine.com/

## Reference
This kit was generated based on ${config.projectUrl}

Generated: ${new Date().toISOString()}
`);

      // 6. Create ZIP
      setProgress({ step: "Erstelle ZIP...", percent: 95 });
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // 7. Save locally
      const filename = `${config.projectName.replace(/\./g, '-')}_implementation-kit_${new Date().toISOString().split('T')[0]}.zip`;
      saveAs(zipBlob, filename);

      // 8. Upload to cloud
      setProgress({ step: "Lade in Cloud...", percent: 98 });
      const storagePath = `implementation-kits/${Date.now()}.zip`;
      
      const { error: uploadError } = await supabase.storage
        .from('screenshots-archive')
        .upload(storagePath, zipBlob, {
          contentType: 'application/zip',
          upsert: true
        });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('screenshots-archive')
          .getPublicUrl(storagePath);
        setPublicUrl(urlData.publicUrl);
      }

      setProgress({ step: "Fertig!", percent: 100 });
      toast.success("Implementation Kit erstellt!");

    } catch (error) {
      console.error("Error generating kit:", error);
      toast.error("Fehler beim Erstellen des Kits");
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt kopiert!");
  };

  return (
    <Card className="border-2 border-purple-500">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-purple-600" />
          Lovable/Softgen Implementation Kit
          <Badge className="bg-purple-500">Export</Badge>
        </CardTitle>
        <CardDescription>
          Generiere ein komplettes Paket (ZIP + Prompt) für Lovable.dev oder Softgen.ai
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Config */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Projektname</Label>
            <Input
              value={config.projectName}
              onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Referenz-URL</Label>
            <Input
              value={config.projectUrl}
              onChange={(e) => setConfig({ ...config, projectUrl: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Beschreibung</Label>
          <Textarea
            value={config.description}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
            rows={2}
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.includeScreenshots}
              onChange={(e) => setConfig({ ...config, includeScreenshots: e.target.checked })}
              className="rounded"
            />
            <Camera className="h-4 w-4" />
            <span className="text-sm">Screenshots</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.includeEdgeFunctions}
              onChange={(e) => setConfig({ ...config, includeEdgeFunctions: e.target.checked })}
              className="rounded"
            />
            <Zap className="h-4 w-4" />
            <span className="text-sm">Edge Functions</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.includeComponents}
              onChange={(e) => setConfig({ ...config, includeComponents: e.target.checked })}
              className="rounded"
            />
            <Code className="h-4 w-4" />
            <span className="text-sm">Components</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.includeAnalytics}
              onChange={(e) => setConfig({ ...config, includeAnalytics: e.target.checked })}
              className="rounded"
            />
            <Sparkles className="h-4 w-4" />
            <span className="text-sm">Analytics</span>
          </label>
        </div>

        {/* Progress */}
        {loading && (
          <div className="space-y-2 bg-purple-50 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{progress.step}</span>
              <span>{progress.percent}%</span>
            </div>
            <Progress value={progress.percent} className="h-2" />
          </div>
        )}

        {/* Generated Prompt Preview */}
        {generatedPrompt && (
          <Tabs defaultValue="lovable">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lovable">Lovable Prompt</TabsTrigger>
              <TabsTrigger value="softgen">Softgen Prompt</TabsTrigger>
            </TabsList>
            <TabsContent value="lovable" className="space-y-2">
              <div className="bg-slate-50 rounded-lg p-4 max-h-60 overflow-auto">
                <pre className="text-xs whitespace-pre-wrap">{generateLovablePrompt().substring(0, 1000)}...</pre>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyPrompt(generateLovablePrompt())}>
                <Copy className="h-4 w-4 mr-2" />
                Lovable Prompt kopieren
              </Button>
            </TabsContent>
            <TabsContent value="softgen" className="space-y-2">
              <div className="bg-slate-50 rounded-lg p-4 max-h-60 overflow-auto">
                <pre className="text-xs whitespace-pre-wrap">{generateSoftgenPrompt()}</pre>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyPrompt(generateSoftgenPrompt())}>
                <Copy className="h-4 w-4 mr-2" />
                Softgen Prompt kopieren
              </Button>
            </TabsContent>
          </Tabs>
        )}

        {/* Public URL */}
        {publicUrl && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Kit bereit zum Teilen!</span>
            </div>
            <div className="flex gap-2">
              <Input value={publicUrl} readOnly className="flex-1 bg-white text-xs" />
              <Button variant="outline" size="sm" onClick={() => {
                navigator.clipboard.writeText(publicUrl);
                toast.success("URL kopiert!");
              }}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Action */}
        <Button
          onClick={generatePackage}
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Generiere Kit...
            </>
          ) : (
            <>
              <FileArchive className="h-5 w-5 mr-2" />
              Implementation Kit generieren
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Generiert ZIP mit Prompts, Code und Screenshots für Lovable.dev oder Softgen.ai
        </p>
      </CardContent>
    </Card>
  );
}
