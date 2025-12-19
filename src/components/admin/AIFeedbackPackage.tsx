import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Package, 
  Download, 
  Loader2, 
  FileText, 
  Image as ImageIcon, 
  Code, 
  Globe, 
  Upload,
  Link,
  CheckCircle2,
  Copy
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { supabase } from "@/integrations/supabase/client";

const SCREENSHOT_API_KEY = "892618";

interface PackageConfig {
  projectName: string;
  projectDescription: string;
  goals: string;
  targetAudience: string;
  mainCompetitors: string;
  keyQuestions: string;
}

const TOP_20_URLS = [
  "https://umzugscheck.ch",
  "https://umzugscheck.ch/umzugsofferten",
  "https://umzugscheck.ch/preisrechner",
  "https://umzugscheck.ch/firmen",
  "https://umzugscheck.ch/beste-umzugsfirma",
  "https://umzugscheck.ch/guenstige-umzugsfirma",
  "https://umzugscheck.ch/umzugsfirmen/zuerich",
  "https://umzugscheck.ch/umzugsfirmen/bern",
  "https://umzugscheck.ch/umzugsfirmen/basel",
  "https://umzugscheck.ch/umzugsfirmen/aargau",
  "https://umzugscheck.ch/umzugsfirmen/luzern",
  "https://umzugscheck.ch/umzugsfirmen/st-gallen",
  "https://umzugscheck.ch/privatumzug",
  "https://umzugscheck.ch/firmenumzug",
  "https://umzugscheck.ch/reinigung",
  "https://umzugscheck.ch/entsorgung",
  "https://umzugscheck.ch/umzugskosten",
  "https://umzugscheck.ch/ratgeber",
  "https://umzugscheck.ch/checkliste",
  "https://umzugscheck.ch/fuer-firmen",
];

const DEFAULT_COMPETITORS = [
  "https://www.movu.ch",
  "https://www.umzug24.ch",
  "https://www.comparis.ch/umzug",
];

export function AIFeedbackPackage() {
  const [config, setConfig] = useState<PackageConfig>({
    projectName: "umzugscheck.ch",
    projectDescription: "Premium Swiss moving comparison platform for finding and comparing moving companies, calculating prices, and receiving quotes.",
    goals: "Maximize conversion rates, improve SEO rankings, enhance user experience, increase lead quality",
    targetAudience: "Swiss residents planning a move (private individuals and businesses)",
    mainCompetitors: DEFAULT_COMPETITORS.join(", "),
    keyQuestions: "1. How can we improve the conversion funnel?\n2. What UX improvements would increase user trust?\n3. How does our design compare to competitors?\n4. Are there obvious SEO issues to address?"
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ step: "", percent: 0 });
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  const generateProjectBrief = (): string => {
    return `# PROJECT BRIEF: ${config.projectName}

## 📋 Project Overview

**Project Name:** ${config.projectName}
**Generated:** ${new Date().toISOString()}
**Package Type:** AI Feedback Package (Complete Analysis Bundle)

---

## 🎯 Project Description

${config.projectDescription}

---

## 🎯 Goals & Objectives

${config.goals.split(',').map(g => `- ${g.trim()}`).join('\n')}

---

## 👥 Target Audience

${config.targetAudience}

---

## 🏆 Competitors

${config.mainCompetitors.split(',').map((c, i) => `${i + 1}. ${c.trim()}`).join('\n')}

---

## 📊 Package Contents

This AI Feedback Package contains:

### 1. Screenshots
- **Desktop Screenshots** (1920xfull) - Full page captures at HD resolution
- **Mobile Screenshots** (375xfull) - iPhone-sized captures
- Organized in \`/screenshots/desktop/\` and \`/screenshots/mobile/\`

### 2. HTML Source Code
- Complete HTML for each captured page
- Located in \`/html/\` directory
- Useful for SEO analysis, code review, accessibility checks

### 3. Competitor Analysis
- Side-by-side screenshots of main competitors
- Located in \`/competitors/\`
- Includes both desktop and mobile versions

### 4. Site Structure
- \`SITEMAP.json\` - Complete URL structure
- \`PAGE_INVENTORY.md\` - List of all captured pages with metadata

---

## 📄 Pages Captured

${TOP_20_URLS.map((url, i) => `${i + 1}. ${url}`).join('\n')}

---

## 🔧 Technical Details

- **Screenshot Tool:** ScreenshotMachine API
- **Full Page Capture:** Enabled (scrolling screenshots)
- **Capture Date:** ${new Date().toLocaleDateString('de-CH')}
- **Platform:** Lovable + Supabase

---

## 💡 How to Use This Package

1. **Share with ChatGPT/Claude/Gemini:**
   - Upload this ZIP file
   - Paste the REVIEW_REQUEST.md content
   - Ask specific questions about design, UX, SEO

2. **Visual Analysis:**
   - Open screenshots in desktop/mobile folders
   - Compare with competitor screenshots
   - Note differences in layout, CTAs, trust signals

3. **Code Review:**
   - Open HTML files for SEO analysis
   - Check meta tags, heading structure
   - Review accessibility attributes

---

*Generated by umzugscheck.ch AI Feedback System*
`;
  };

  const generateReviewRequest = (): string => {
    return `# REVIEW REQUEST

## 🎯 What I Need

I'm sharing a complete snapshot of my website **${config.projectName}** for expert analysis. This package includes screenshots (desktop + mobile), HTML source code, and competitor comparisons.

---

## ❓ Key Questions

${config.keyQuestions}

---

## 📦 What's Included

| Content Type | Location | Description |
|-------------|----------|-------------|
| Desktop Screenshots | \`/screenshots/desktop/\` | Full-page HD captures (1920px) |
| Mobile Screenshots | \`/screenshots/mobile/\` | iPhone-sized captures (375px) |
| HTML Source Code | \`/html/\` | Complete page HTML |
| Competitor Screenshots | \`/competitors/\` | Side-by-side comparison data |
| Site Structure | \`SITEMAP.json\` | URL hierarchy |
| Project Context | \`PROJECT_BRIEF.md\` | Full project description |

---

## 🎨 Please Analyze

### 1. Design & UX
- Is the visual hierarchy clear?
- Are CTAs prominent and compelling?
- Does the design build trust?
- Is the mobile experience optimized?

### 2. Conversion Optimization
- Are conversion funnels obvious?
- What friction points exist?
- How do forms and calculators look?

### 3. Competitor Comparison
- How do we compare visually?
- What are competitors doing better?
- What unique advantages do we have?

### 4. SEO (from HTML)
- Are meta tags optimized?
- Is heading structure correct?
- Are there obvious technical issues?

---

## 📍 Context

**Business:** ${config.projectDescription}

**Target Users:** ${config.targetAudience}

**Main Goals:** ${config.goals}

---

## 🙏 Expected Output

Please provide:
1. **Top 5 Issues** - Critical problems to fix first
2. **Top 5 Opportunities** - Quick wins for improvement
3. **Competitor Insights** - What to learn from competition
4. **Action Items** - Specific, prioritized next steps

---

*Thank you for your analysis! This package was auto-generated for AI review.*
`;
  };

  const generateSitemap = (): object => {
    return {
      generated: new Date().toISOString(),
      domain: "umzugscheck.ch",
      pages: TOP_20_URLS.map((url, index) => ({
        index: index + 1,
        url,
        path: new URL(url).pathname || "/",
        category: categorizeUrl(url),
      })),
      competitors: config.mainCompetitors.split(',').map(c => c.trim()),
      totalPages: TOP_20_URLS.length,
    };
  };

  const categorizeUrl = (url: string): string => {
    const path = new URL(url).pathname;
    if (path === "/" || path === "") return "Homepage";
    if (path.includes("umzugsfirmen")) return "Regional";
    if (path.includes("firmen") || path.includes("beste") || path.includes("guenstige")) return "Rankings";
    if (path.includes("offerten") || path.includes("rechner")) return "Conversion Funnel";
    if (path.includes("ratgeber") || path.includes("kosten") || path.includes("checkliste")) return "Content";
    if (path.includes("fuer-firmen")) return "B2B";
    return "Service";
  };

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

  const generatePackage = async () => {
    setLoading(true);
    setProgress({ step: "Initialisiere...", percent: 0 });
    
    const zip = new JSZip();
    const competitors = config.mainCompetitors.split(',').map(c => c.trim()).filter(Boolean);
    const allUrls = [...TOP_20_URLS];
    const totalSteps = allUrls.length * 3 + competitors.length * 2 + 5;
    let currentStep = 0;

    const updateProgress = (step: string) => {
      currentStep++;
      setProgress({ step, percent: Math.round((currentStep / totalSteps) * 100) });
    };

    try {
      // 1. Add markdown files
      updateProgress("Erstelle PROJECT_BRIEF.md...");
      zip.file("PROJECT_BRIEF.md", generateProjectBrief());
      
      updateProgress("Erstelle REVIEW_REQUEST.md...");
      zip.file("REVIEW_REQUEST.md", generateReviewRequest());
      
      updateProgress("Erstelle SITEMAP.json...");
      zip.file("SITEMAP.json", JSON.stringify(generateSitemap(), null, 2));

      // 2. Capture own pages
      for (let i = 0; i < allUrls.length; i++) {
        const url = allUrls[i];
        const pathname = new URL(url).pathname.replace(/\//g, '_') || 'index';
        const filename = `${String(i + 1).padStart(2, '0')}_${pathname}`;

        // Desktop screenshot
        updateProgress(`Desktop: ${new URL(url).pathname || '/'}`);
        const desktopParams = new URLSearchParams({
          key: SCREENSHOT_API_KEY,
          url,
          dimension: "1920xfull",
          format: "png",
          cacheLimit: "0",
          delay: "3000",
        });
        try {
          const desktopResponse = await fetch(`https://api.screenshotmachine.com?${desktopParams}`);
          const desktopBlob = await desktopResponse.blob();
          zip.file(`screenshots/desktop/${filename}.png`, desktopBlob);
        } catch (e) {
          console.error(`Desktop screenshot failed for ${url}`);
        }

        // Mobile screenshot
        updateProgress(`Mobile: ${new URL(url).pathname || '/'}`);
        const mobileParams = new URLSearchParams({
          key: SCREENSHOT_API_KEY,
          url,
          dimension: "375xfull",
          format: "png",
          cacheLimit: "0",
          delay: "3000",
        });
        try {
          const mobileResponse = await fetch(`https://api.screenshotmachine.com?${mobileParams}`);
          const mobileBlob = await mobileResponse.blob();
          zip.file(`screenshots/mobile/${filename}.png`, mobileBlob);
        } catch (e) {
          console.error(`Mobile screenshot failed for ${url}`);
        }

        // HTML
        updateProgress(`HTML: ${new URL(url).pathname || '/'}`);
        const html = await fetchHtml(url);
        zip.file(`html/${filename}.html`, html);

        // Rate limit delay
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // 3. Capture competitors
      for (let i = 0; i < competitors.length; i++) {
        const url = competitors[i];
        const domain = new URL(url).hostname.replace('www.', '');

        updateProgress(`Konkurrent Desktop: ${domain}`);
        const desktopParams = new URLSearchParams({
          key: SCREENSHOT_API_KEY,
          url,
          dimension: "1920xfull",
          format: "png",
          cacheLimit: "0",
          delay: "3000",
        });
        try {
          const response = await fetch(`https://api.screenshotmachine.com?${desktopParams}`);
          const blob = await response.blob();
          zip.file(`competitors/${domain}_desktop.png`, blob);
        } catch (e) {
          console.error(`Competitor screenshot failed for ${url}`);
        }

        updateProgress(`Konkurrent Mobile: ${domain}`);
        const mobileParams = new URLSearchParams({
          key: SCREENSHOT_API_KEY,
          url,
          dimension: "375xfull",
          format: "png",
          cacheLimit: "0",
          delay: "3000",
        });
        try {
          const response = await fetch(`https://api.screenshotmachine.com?${mobileParams}`);
          const blob = await response.blob();
          zip.file(`competitors/${domain}_mobile.png`, blob);
        } catch (e) {
          console.error(`Competitor mobile screenshot failed for ${url}`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // 4. Generate and save ZIP
      updateProgress("Erstelle ZIP-Archiv...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `ai-feedback-package_${timestamp}.zip`;

      // Save locally
      saveAs(zipBlob, filename);

      // 5. Upload to Supabase Storage for public URL
      updateProgress("Lade in Cloud hoch...");
      const storagePath = `packages/${timestamp}_${Date.now()}.zip`;
      
      const { error: uploadError } = await supabase.storage
        .from('screenshots-archive')
        .upload(storagePath, zipBlob, {
          contentType: 'application/zip',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.warning("ZIP heruntergeladen, aber Cloud-Upload fehlgeschlagen");
      } else {
        const { data: urlData } = supabase.storage
          .from('screenshots-archive')
          .getPublicUrl(storagePath);
        
        setPublicUrl(urlData.publicUrl);
        toast.success("Paket erstellt und hochgeladen!");
      }

      setProgress({ step: "Fertig!", percent: 100 });
    } catch (error) {
      console.error("Package generation error:", error);
      toast.error("Fehler beim Erstellen des Pakets");
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      toast.success("URL kopiert!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          AI Feedback Package Generator
        </CardTitle>
        <CardDescription>
          Erstelle ein komplettes Analyse-Paket für ChatGPT, Gemini & Claude
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Projektname</Label>
            <Input
              value={config.projectName}
              onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Zielgruppe</Label>
            <Input
              value={config.targetAudience}
              onChange={(e) => setConfig({ ...config, targetAudience: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Projektbeschreibung</Label>
          <Textarea
            value={config.projectDescription}
            onChange={(e) => setConfig({ ...config, projectDescription: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Ziele (kommagetrennt)</Label>
          <Input
            value={config.goals}
            onChange={(e) => setConfig({ ...config, goals: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Hauptkonkurrenten (kommagetrennt)</Label>
          <Input
            value={config.mainCompetitors}
            onChange={(e) => setConfig({ ...config, mainCompetitors: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Schlüsselfragen für das AI</Label>
          <Textarea
            value={config.keyQuestions}
            onChange={(e) => setConfig({ ...config, keyQuestions: e.target.value })}
            rows={4}
          />
        </div>

        {/* What's included */}
        <div className="p-4 bg-muted rounded-lg">
          <Label className="text-base font-medium mb-3 block">Paketinhalt</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <ImageIcon className="h-4 w-4 text-blue-500" />
              <span>{TOP_20_URLS.length * 2} Screenshots</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Code className="h-4 w-4 text-green-500" />
              <span>{TOP_20_URLS.length} HTML-Dateien</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-orange-500" />
              <span>{config.mainCompetitors.split(',').filter(Boolean).length * 2} Konkurrenten</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-purple-500" />
              <span>3 Markdown-Docs</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        {loading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{progress.step}</span>
              <span>{progress.percent}%</span>
            </div>
            <Progress value={progress.percent} />
          </div>
        )}

        {/* Generate Button */}
        <Button 
          onClick={generatePackage} 
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Erstelle Paket...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              AI Feedback Package generieren
            </>
          )}
        </Button>

        {/* Public URL Result */}
        {publicUrl && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Paket bereit!</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Input 
                value={publicUrl} 
                readOnly 
                className="bg-white text-sm"
              />
              <Button variant="outline" size="icon" onClick={copyUrl}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => window.open(publicUrl, '_blank')}>
                <Link className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Teile diese URL mit ChatGPT, Gemini oder Claude zusammen mit der REVIEW_REQUEST.md
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
