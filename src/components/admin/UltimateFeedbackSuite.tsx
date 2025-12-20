/**
 * ULTIMATE FEEDBACK SUITE
 * =======================
 * Consolidated tool that combines all feedback, screenshot, and export capabilities.
 * 
 * Features:
 * 1. Auto-fill project info from current URL
 * 2. One-click complete analysis package generation
 * 3. Lovable Clone Package for recreating this admin in any project
 * 4. Screenshot capture with full API integration
 * 5. AI-ready prompts for ChatGPT/Gemini/Claude
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Package,
  Download,
  Loader2,
  Copy,
  CheckCircle2,
  FileArchive,
  Camera,
  Zap,
  Globe,
  Code,
  Wand2,
  Sparkles,
  FileText,
  Monitor,
  Smartphone,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { supabase } from "@/integrations/supabase/client";
import { addScreenshotRenderParamIfHost } from "@/lib/screenshot-render-mode";

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
  techStack: string;
  competitors: string;
  keyQuestions: string;
}

interface ScreenshotResult {
  url: string;
  desktop?: Blob;
  mobile?: Blob;
  html?: string;
  lighthouse?: {
    performance: number;
    seo: number;
    accessibility: number;
    bestPractices: number;
  };
}

// ============================================================================
// DEFAULT PAGES TO ANALYZE
// ============================================================================

const TOP_PAGES = [
  "/",
  "/umzugsofferten",
  "/preisrechner",
  "/firmen",
  "/beste-umzugsfirma",
  "/guenstige-umzugsfirma",
  "/umzugsfirmen/zuerich",
  "/umzugsfirmen/bern",
  "/umzugsfirmen/basel",
  "/privatumzug",
  "/firmenumzug",
  "/reinigung",
  "/entsorgung",
  "/umzugskosten",
  "/ratgeber",
  "/checkliste",
  "/fuer-firmen",
  "/dienstleistungen",
  "/internationale-umzuege",
  "/einlagerung",
];

const DEFAULT_COMPETITORS = [
  "https://www.movu.ch",
  "https://www.umzug24.ch",
  "https://www.comparis.ch/umzug",
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function UltimateFeedbackSuite() {
  const [activeTab, setActiveTab] = useState("ultimate");
  
  // Project config - auto-detected
  const [config, setConfig] = useState<ProjectConfig>({
    projectName: "",
    projectUrl: "",
    description: "",
    goals: "",
    targetAudience: "",
    techStack: "React, TypeScript, Tailwind CSS, Supabase, Vite, shadcn/ui",
    competitors: DEFAULT_COMPETITORS.join("\n"),
    keyQuestions: "",
  });

  // Processing state
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ step: "", percent: 0 });
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  // Options
  const [captureDesktop, setCaptureDesktop] = useState(true);
  const [captureMobile, setCaptureMobile] = useState(true);
  const [captureHtml, setCaptureHtml] = useState(true);
  const [captureCompetitors, setCaptureCompetitors] = useState(true);
  const [runLighthouse, setRunLighthouse] = useState(true);

  // Auto-detect project info on mount
  useEffect(() => {
    autoDetectProject();
  }, []);

  const autoDetectProject = () => {
    const currentUrl = window.location.origin;
    const hostname = window.location.hostname;
    
    // Extract project name from hostname
    let projectName = hostname
      .replace('www.', '')
      .replace('.lovable.app', '')
      .replace('.vercel.app', '')
      .replace('.netlify.app', '');
    
    // Capitalize first letter
    projectName = projectName.charAt(0).toUpperCase() + projectName.slice(1);
    
    setConfig(prev => ({
      ...prev,
      projectName: projectName || "My Project",
      projectUrl: currentUrl,
      description: `${projectName} - A modern web application built with React and Supabase.`,
      goals: "Improve conversion rates, enhance UX, optimize SEO, increase user engagement",
      targetAudience: "Web users looking for efficient solutions",
      keyQuestions: `1. What are the top 5 UX improvements needed?
2. How can we improve conversion rates?
3. Are there obvious SEO issues to fix?
4. How does our design compare to competitors?
5. What quick wins can be implemented immediately?`,
    }));
    
    toast.success("Project info auto-detected!");
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const fetchHtml = async (url: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-html', {
        body: { url }
      });
      if (error) throw error;
      return data?.html || `<!-- No content -->`;
    } catch {
      return `<!-- Error fetching ${url} -->`;
    }
  };

  const captureScreenshot = async (
    url: string, 
    dimension: string
  ): Promise<Blob | null> => {
    try {
      const urlForShot = addScreenshotRenderParamIfHost(url, new URL(config.projectUrl).hostname);
      const params = new URLSearchParams({
        key: SCREENSHOT_API_KEY,
        url: urlForShot,
        dimension,
        format: "png",
        cacheLimit: "0",
        delay: "8000",
        js: "true",
        scroll: "true",
      });
      
      const response = await fetch(`https://api.screenshotmachine.com?${params}`);
      if (!response.ok) throw new Error("Screenshot failed");
      return await response.blob();
    } catch (error) {
      console.error("Screenshot error:", error);
      return null;
    }
  };

  const runLighthouseAudit = async (url: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('lighthouse', {
        body: { url, strategy: 'desktop' }
      });
      
      if (error) throw error;
      const categories = data?.lighthouseResult?.categories;
      if (!categories) return null;
      
      return {
        performance: Math.round((categories.performance?.score || 0) * 100),
        seo: Math.round((categories.seo?.score || 0) * 100),
        accessibility: Math.round((categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
      };
    } catch {
      return null;
    }
  };

  // ============================================================================
  // PROMPT GENERATORS
  // ============================================================================

  const generateAIFeedbackPrompt = (results: ScreenshotResult[]): string => {
    return `# ${config.projectName} - Complete AI Analysis Request

## 🎯 Project Overview
- **Project**: ${config.projectName}
- **URL**: ${config.projectUrl}
- **Generated**: ${new Date().toISOString()}

## 📝 Description
${config.description}

## 🎯 Goals
${config.goals}

## 👥 Target Audience
${config.targetAudience}

## 🛠 Tech Stack
${config.techStack}

## ❓ Key Questions for Analysis
${config.keyQuestions}

---

## 📦 What's Included in This Package

### Screenshots
- **Desktop** (1920xfull): Full-page captures at HD resolution
- **Mobile** (375xfull): Mobile-responsive captures
- Organized in \`/screenshots/desktop/\` and \`/screenshots/mobile/\`

### HTML Source Code
- Complete HTML for each page in \`/html/\`
- Useful for SEO analysis, accessibility checks

### Competitor Screenshots
- Side-by-side comparison in \`/competitors/\`

### Performance Reports
- Lighthouse scores in \`/lighthouse/\`

---

## 📊 Pages Analyzed (${results.length} pages)

${results.map((r, i) => {
  const path = new URL(r.url).pathname || '/';
  const scores = r.lighthouse 
    ? `| Perf: ${r.lighthouse.performance}% | SEO: ${r.lighthouse.seo}%`
    : '';
  return `${i + 1}. ${path} ${scores}`;
}).join('\n')}

---

## 🔍 Please Analyze

### 1. Design & UX
- Visual hierarchy and clarity
- CTA placement and effectiveness
- Trust signals and credibility
- Mobile experience quality

### 2. Conversion Optimization
- Funnel friction points
- Form usability
- Value proposition clarity

### 3. Competitor Comparison
- Visual differences
- Feature gaps
- Competitive advantages

### 4. SEO (from HTML)
- Meta tags optimization
- Heading structure
- Technical issues

---

## ✅ Expected Output

1. **Top 5 Critical Issues** - Fix these first
2. **Top 5 Quick Wins** - Easy improvements
3. **Competitor Insights** - What to learn
4. **Prioritized Action Items** - Specific next steps

---

*Generated by Ultimate Feedback Suite - Ready for ChatGPT, Claude, or Gemini analysis*
`;
  };

  const generateLovableClonePrompt = (): string => {
    return `# Admin Portal Clone - Implementation Request

## 🎯 What I Need

Recreate a complete admin portal with the following features:

### 1. Screenshot Capture System
- Full-page screenshot capture using ScreenshotMachine API (key: 892618)
- Desktop (1920xfull) and Mobile (375xfull) support
- Bulk URL processing
- HTML source extraction
- ZIP export with organized folders

### 2. Edge Functions Required

\`\`\`typescript
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
      },
    });
    const html = await response.text();

    return new Response(
      JSON.stringify({ html, url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
\`\`\`

\`\`\`typescript
// supabase/functions/lighthouse/index.ts
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
    const { url, strategy = 'desktop' } = await req.json();
    const apiUrl = \`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=\${encodeURIComponent(url)}&strategy=\${strategy}&category=performance&category=accessibility&category=best-practices&category=seo\`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
\`\`\`

### 3. Storage Setup
Create a Supabase storage bucket named \`screenshots-archive\` with public access.

### 4. Admin Components
- Screenshot Machine: Single/bulk capture UI
- Ultimate Feedback Package: One-click analysis generator
- AI Prompt Generator: Ready-to-use prompts for AI review

### 5. Dependencies
\`\`\`
npm install jszip file-saver jspdf lucide-react
\`\`\`

### 6. Key Features
- Auto-detect current project URL
- One-click full analysis
- Generate AI-ready prompts
- ZIP download with all assets
- Cloud storage for sharing

## 🎨 Design
- Clean, modern admin dashboard
- Tab-based navigation
- Progress indicators for long operations
- Toast notifications for feedback

## 📦 Expected Output
A working admin system where I can:
1. Capture screenshots of any URL
2. Generate complete analysis packages
3. Download ZIP with screenshots, HTML, reports
4. Get ready-to-use prompts for AI analysis

Please implement step by step, starting with edge functions.
`;
  };

  // ============================================================================
  // PACKAGE GENERATORS
  // ============================================================================

  const generateUltimatePackage = async () => {
    setLoading(true);
    setProgress({ step: "Initializing...", percent: 0 });
    
    const zip = new JSZip();
    const results: ScreenshotResult[] = [];
    const baseUrl = config.projectUrl;
    const pages = TOP_PAGES.map(path => `${baseUrl}${path}`);
    const competitors = config.competitors.split('\n').filter(c => c.trim());
    
    const totalSteps = 
      pages.length * (captureDesktop ? 1 : 0) +
      pages.length * (captureMobile ? 1 : 0) +
      pages.length * (captureHtml ? 1 : 0) +
      (runLighthouse ? Math.min(5, pages.length) : 0) +
      (captureCompetitors ? competitors.length * 2 : 0) +
      3; // metadata files
    
    let currentStep = 0;
    
    const updateProgress = (step: string) => {
      currentStep++;
      setProgress({ step, percent: Math.round((currentStep / totalSteps) * 100) });
    };

    try {
      // Process each page
      for (let i = 0; i < pages.length; i++) {
        const url = pages[i];
        const path = new URL(url).pathname || 'index';
        const safePath = path.replace(/\//g, '_').replace(/^_/, '') || 'index';
        const filename = `${String(i + 1).padStart(2, '0')}_${safePath}`;
        
        const result: ScreenshotResult = { url };

        // Desktop screenshot
        if (captureDesktop) {
          updateProgress(`Desktop: ${path}`);
          const desktop = await captureScreenshot(url, "1920xfull");
          if (desktop) {
            result.desktop = desktop;
            zip.file(`screenshots/desktop/${filename}.png`, desktop);
          }
          await new Promise(r => setTimeout(r, 500));
        }

        // Mobile screenshot
        if (captureMobile) {
          updateProgress(`Mobile: ${path}`);
          const mobile = await captureScreenshot(url, "375xfull");
          if (mobile) {
            result.mobile = mobile;
            zip.file(`screenshots/mobile/${filename}.png`, mobile);
          }
          await new Promise(r => setTimeout(r, 500));
        }

        // HTML content
        if (captureHtml) {
          updateProgress(`HTML: ${path}`);
          const html = await fetchHtml(url);
          result.html = html;
          zip.file(`html/${filename}.html`, html);
        }

        // Lighthouse (first 5 pages only)
        if (runLighthouse && i < 5) {
          updateProgress(`Lighthouse: ${path}`);
          const lighthouse = await runLighthouseAudit(url);
          if (lighthouse) {
            result.lighthouse = lighthouse;
            zip.file(`lighthouse/${filename}.json`, JSON.stringify(lighthouse, null, 2));
          }
          await new Promise(r => setTimeout(r, 1000));
        }

        results.push(result);
      }

      // Capture competitors
      if (captureCompetitors && competitors.length > 0) {
        for (const competitorUrl of competitors) {
          if (!competitorUrl.trim()) continue;
          const domain = new URL(competitorUrl).hostname.replace('www.', '');
          
          updateProgress(`Competitor Desktop: ${domain}`);
          const desktop = await captureScreenshot(competitorUrl, "1920xfull");
          if (desktop) {
            zip.file(`competitors/${domain}_desktop.png`, desktop);
          }
          await new Promise(r => setTimeout(r, 500));

          updateProgress(`Competitor Mobile: ${domain}`);
          const mobile = await captureScreenshot(competitorUrl, "375xfull");
          if (mobile) {
            zip.file(`competitors/${domain}_mobile.png`, mobile);
          }
          await new Promise(r => setTimeout(r, 500));
        }
      }

      // Generate prompts and metadata
      updateProgress("Generating AI prompt...");
      const aiPrompt = generateAIFeedbackPrompt(results);
      setGeneratedPrompt(aiPrompt);
      zip.file("AI_REVIEW_PROMPT.md", aiPrompt);

      updateProgress("Generating project brief...");
      zip.file("PROJECT_BRIEF.md", `# ${config.projectName}

**URL**: ${config.projectUrl}
**Generated**: ${new Date().toISOString()}

## Description
${config.description}

## Goals
${config.goals}

## Target Audience
${config.targetAudience}

## Tech Stack
${config.techStack}

## Pages Analyzed
${results.map((r, i) => `${i + 1}. ${new URL(r.url).pathname}`).join('\n')}
`);

      updateProgress("Creating analysis summary...");
      const summary = {
        project: config.projectName,
        url: config.projectUrl,
        generated: new Date().toISOString(),
        pages: results.length,
        screenshots: {
          desktop: results.filter(r => r.desktop).length,
          mobile: results.filter(r => r.mobile).length,
        },
        html: results.filter(r => r.html).length,
        lighthouse: results.filter(r => r.lighthouse).length,
        competitors: competitors.length,
        averageScores: runLighthouse ? {
          performance: Math.round(results.filter(r => r.lighthouse).reduce((sum, r) => sum + (r.lighthouse?.performance || 0), 0) / Math.max(1, results.filter(r => r.lighthouse).length)),
          seo: Math.round(results.filter(r => r.lighthouse).reduce((sum, r) => sum + (r.lighthouse?.seo || 0), 0) / Math.max(1, results.filter(r => r.lighthouse).length)),
        } : null,
      };
      zip.file("analysis-summary.json", JSON.stringify(summary, null, 2));

      // Create ZIP
      setProgress({ step: "Creating ZIP...", percent: 95 });
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      // Save locally
      const timestamp = new Date().toISOString().split('T')[0];
      saveAs(zipBlob, `${config.projectName.toLowerCase().replace(/\s+/g, '-')}_ultimate-package_${timestamp}.zip`);

      // Upload to cloud
      setProgress({ step: "Uploading to cloud...", percent: 98 });
      const storagePath = `ultimate-packages/${timestamp}_${Date.now()}.zip`;
      
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

      setProgress({ step: "Complete!", percent: 100 });
      toast.success("Ultimate Package generated successfully!");
    } catch (error) {
      console.error("Package generation error:", error);
      toast.error("Error generating package");
    } finally {
      setLoading(false);
    }
  };

  const generateLovableClonePackage = async () => {
    setLoading(true);
    setProgress({ step: "Generating clone package...", percent: 0 });

    const zip = new JSZip();

    try {
      // Add main prompt
      setProgress({ step: "Creating implementation prompt...", percent: 20 });
      const clonePrompt = generateLovableClonePrompt();
      zip.file("LOVABLE_IMPLEMENTATION_PROMPT.md", clonePrompt);

      // Add edge function code
      setProgress({ step: "Adding edge functions...", percent: 40 });
      zip.file("edge-functions/fetch-html/index.ts", `import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        'Accept': 'text/html',
      },
    });

    const html = await response.text();
    return new Response(
      JSON.stringify({ html, url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
`);

      zip.file("edge-functions/lighthouse/index.ts", `import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, strategy = 'desktop' } = await req.json();
    const apiUrl = \`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=\${encodeURIComponent(url)}&strategy=\${strategy}&category=performance&category=accessibility&category=best-practices&category=seo\`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
`);

      // Add README
      setProgress({ step: "Creating documentation...", percent: 60 });
      zip.file("README.md", `# Admin Portal Clone Package

## Quick Start

1. Create a new Lovable project
2. Copy the content of \`LOVABLE_IMPLEMENTATION_PROMPT.md\` into the chat
3. Lovable will create the complete admin system

## What's Included

- \`LOVABLE_IMPLEMENTATION_PROMPT.md\` - Complete implementation instructions
- \`edge-functions/\` - Ready-to-use Supabase edge functions
- \`config.toml\` - Supabase configuration

## Edge Functions

### fetch-html
Fetches HTML content from any URL for analysis.

### lighthouse  
Runs Google PageSpeed Insights for performance analysis.

## Screenshot API
Uses ScreenshotMachine API (key: 892618) for capturing screenshots.

## Dependencies
\`\`\`
npm install jszip file-saver jspdf lucide-react
\`\`\`

Generated: ${new Date().toISOString()}
`);

      // Add config.toml template
      zip.file("config.toml", `[functions.fetch-html]
verify_jwt = false

[functions.lighthouse]
verify_jwt = false
`);

      // Create ZIP
      setProgress({ step: "Creating ZIP...", percent: 80 });
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // Save
      const timestamp = new Date().toISOString().split('T')[0];
      saveAs(zipBlob, `lovable-admin-clone_${timestamp}.zip`);

      setProgress({ step: "Complete!", percent: 100 });
      toast.success("Clone package generated!");
    } catch (error) {
      console.error("Clone package error:", error);
      toast.error("Error generating clone package");
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      toast.success("Prompt copied to clipboard!");
    }
  };

  const copyUrl = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      toast.success("URL copied!");
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Card className="border-2 border-primary">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="h-6 w-6 text-primary" />
          Ultimate Feedback Suite
          <Badge className="bg-primary">v3.0</Badge>
        </CardTitle>
        <CardDescription>
          One-click analysis packages for AI review + Lovable clone generator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="ultimate">
              <Package className="h-4 w-4 mr-2" />
              Ultimate Package
            </TabsTrigger>
            <TabsTrigger value="clone">
              <Code className="h-4 w-4 mr-2" />
              Lovable Clone
            </TabsTrigger>
            <TabsTrigger value="quick">
              <Camera className="h-4 w-4 mr-2" />
              Quick Screenshot
            </TabsTrigger>
          </TabsList>

          {/* ULTIMATE PACKAGE TAB */}
          <TabsContent value="ultimate" className="space-y-6 mt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Auto-Detected Project</h4>
                  <p className="text-sm text-green-700">
                    Project info has been automatically filled from your current URL. 
                    Review and adjust as needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Project Config */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input
                  value={config.projectName}
                  onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Project URL</Label>
                <Input
                  value={config.projectUrl}
                  onChange={(e) => setConfig({ ...config, projectUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Goals</Label>
                <Textarea
                  value={config.goals}
                  onChange={(e) => setConfig({ ...config, goals: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Textarea
                  value={config.targetAudience}
                  onChange={(e) => setConfig({ ...config, targetAudience: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Competitors (one per line)</Label>
              <Textarea
                value={config.competitors}
                onChange={(e) => setConfig({ ...config, competitors: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Key Questions for AI</Label>
              <Textarea
                value={config.keyQuestions}
                onChange={(e) => setConfig({ ...config, keyQuestions: e.target.value })}
                rows={4}
              />
            </div>

            {/* Capture Options */}
            <div className="grid gap-4 md:grid-cols-5 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Switch checked={captureDesktop} onCheckedChange={setCaptureDesktop} />
                <Label className="flex items-center gap-1">
                  <Monitor className="h-4 w-4" />
                  Desktop
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={captureMobile} onCheckedChange={setCaptureMobile} />
                <Label className="flex items-center gap-1">
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={captureHtml} onCheckedChange={setCaptureHtml} />
                <Label className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  HTML
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={captureCompetitors} onCheckedChange={setCaptureCompetitors} />
                <Label className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  Competitors
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={runLighthouse} onCheckedChange={setRunLighthouse} />
                <Label className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  Lighthouse
                </Label>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateUltimatePackage}
              disabled={loading}
              size="lg"
              className="w-full h-14 text-lg bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {progress.step}
                </>
              ) : (
                <>
                  <Package className="h-5 w-5 mr-2" />
                  Generate Ultimate Package
                </>
              )}
            </Button>

            {/* Progress */}
            {loading && (
              <div className="space-y-2">
                <Progress value={progress.percent} />
                <p className="text-sm text-center text-muted-foreground">{progress.step}</p>
              </div>
            )}

            {/* Results */}
            {generatedPrompt && !loading && (
              <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Package Ready!</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyPrompt}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Prompt
                    </Button>
                    {publicUrl && (
                      <Button size="sm" variant="outline" onClick={copyUrl}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Copy URL
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>AI Review Prompt (copy to ChatGPT/Claude/Gemini):</Label>
                  <Textarea
                    value={generatedPrompt}
                    readOnly
                    rows={8}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* LOVABLE CLONE TAB */}
          <TabsContent value="clone" className="space-y-6 mt-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Wand2 className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-800">Lovable Clone Package</h4>
                  <p className="text-sm text-purple-700">
                    Generate a complete package with prompts and code to recreate this admin 
                    portal in any Lovable project. Brand-neutral and ready to customize.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Complete implementation prompt for Lovable
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Edge functions (fetch-html, lighthouse)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Supabase config.toml
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Setup documentation
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Features Replicated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-blue-500" />
                      Screenshot capture system
                    </li>
                    <li className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-500" />
                      ZIP package generation
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-500" />
                      HTML extraction
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      Lighthouse audits
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={generateLovableClonePackage}
              disabled={loading}
              size="lg"
              className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {progress.step}
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Generate Lovable Clone Package
                </>
              )}
            </Button>

            {loading && (
              <div className="space-y-2">
                <Progress value={progress.percent} />
                <p className="text-sm text-center text-muted-foreground">{progress.step}</p>
              </div>
            )}
          </TabsContent>

          {/* QUICK SCREENSHOT TAB */}
          <TabsContent value="quick" className="space-y-6 mt-6">
            <QuickScreenshotTool />
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Badge variant="outline">Auto-Detection</Badge>
          <Badge variant="outline">Full-Page Screenshots</Badge>
          <Badge variant="outline">Mobile + Desktop</Badge>
          <Badge variant="outline">HTML Extraction</Badge>
          <Badge variant="outline">Lighthouse Audits</Badge>
          <Badge variant="outline">Competitor Analysis</Badge>
          <Badge variant="outline">AI-Ready Prompts</Badge>
          <Badge variant="outline">Cloud Storage</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// QUICK SCREENSHOT TOOL
// ============================================================================

function QuickScreenshotTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{ url: string; imageUrl: string; dimension: string }>>([]);

  const capture = async (dimension: string) => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    setLoading(true);
    try {
      let targetUrl = url.trim();
      if (!targetUrl.startsWith('http')) {
        targetUrl = 'https://' + targetUrl;
      }

      const params = new URLSearchParams({
        key: SCREENSHOT_API_KEY,
        url: targetUrl,
        dimension,
        format: "png",
        cacheLimit: "0",
        delay: "8000",
        js: "true",
        scroll: "true",
      });

      const imageUrl = `https://api.screenshotmachine.com?${params}`;
      
      // Verify it loads
      const img = new Image();
      img.onload = () => {
        setResults(prev => [{ url: targetUrl, imageUrl, dimension }, ...prev]);
        toast.success("Screenshot captured!");
        setLoading(false);
      };
      img.onerror = () => {
        toast.error("Screenshot failed");
        setLoading(false);
      };
      img.src = imageUrl;
    } catch (error) {
      toast.error("Error capturing screenshot");
      setLoading(false);
    }
  };

  const downloadAll = async () => {
    if (results.length === 0) return;
    
    const zip = new JSZip();
    
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      try {
        const response = await fetch(result.imageUrl);
        const blob = await response.blob();
        const domain = new URL(result.url).hostname;
        zip.file(`${domain}_${result.dimension}_${i + 1}.png`, blob);
      } catch (e) {
        console.error("Download error:", e);
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `screenshots_${new Date().toISOString().split('T')[0]}.zip`);
    toast.success("ZIP downloaded!");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1"
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => capture("1920xfull")}
          disabled={loading}
          variant="outline"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Monitor className="h-4 w-4 mr-2" />}
          Desktop Full
        </Button>
        <Button
          onClick={() => capture("375xfull")}
          disabled={loading}
          variant="outline"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4 mr-2" />}
          Mobile Full
        </Button>
        <Button
          onClick={() => capture("1920x1080")}
          disabled={loading}
          variant="outline"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Monitor className="h-4 w-4 mr-2" />}
          Desktop HD
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{results.length} screenshots</span>
            <Button size="sm" onClick={downloadAll}>
              <Download className="h-4 w-4 mr-2" />
              Download All as ZIP
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {results.map((result, i) => (
              <div key={i} className="relative group">
                <img
                  src={result.imageUrl}
                  alt={result.url}
                  className="rounded-lg border shadow-sm w-full aspect-video object-cover object-top"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => window.open(result.imageUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <Badge className="absolute bottom-2 left-2">{result.dimension}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UltimateFeedbackSuite;
