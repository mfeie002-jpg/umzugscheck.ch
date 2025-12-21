/**
 * ============================================================================
 * AI FEEDBACK PACKAGE STANDALONE V3.0
 * ============================================================================
 * 
 * A complete, self-contained AI feedback analysis package generator.
 * Drop this single file into any Lovable or Softgen project.
 * 
 * WHAT IT DOES:
 * - Takes a project name and URL
 * - Captures desktop + mobile screenshots of all pages
 * - Fetches HTML source for SEO analysis
 * - Captures competitor screenshots
 * - Generates tailored prompts for AI review
 * - Downloads everything as a single ZIP
 * 
 * REQUIREMENTS:
 * 1. Install dependencies: jszip, file-saver, lucide-react
 * 2. Create edge function: fetch-html (see SETUP section below)
 * 3. Get a ScreenshotMachine API key (free tier available)
 * 
 * USAGE:
 * 1. Add this file to your project: src/components/AIFeedbackPackageStandalone.tsx
 * 2. Import and render: <AIFeedbackPackageStandalone />
 * 3. Configure your project details
 * 4. Click "Generate Package"
 * 5. Upload ZIP to ChatGPT/Claude/Gemini for analysis
 * 
 * ============================================================================
 * SETUP INSTRUCTIONS
 * ============================================================================
 * 
 * 1. INSTALL DEPENDENCIES:
 *    Run in terminal: npm install jszip file-saver lucide-react
 * 
 * 2. CREATE EDGE FUNCTION (supabase/functions/fetch-html/index.ts):
 * 
 * import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 * 
 * const corsHeaders = {
 *   'Access-Control-Allow-Origin': '*',
 *   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 * };
 * 
 * serve(async (req) => {
 *   if (req.method === 'OPTIONS') {
 *     return new Response(null, { headers: corsHeaders });
 *   }
 *   
 *   try {
 *     const { url } = await req.json();
 *     if (!url) {
 *       return new Response(JSON.stringify({ error: 'URL required' }), {
 *         status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
 *       });
 *     }
 *     
 *     const response = await fetch(url, {
 *       headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FeedbackBot/1.0)' }
 *     });
 *     const html = await response.text();
 *     
 *     return new Response(JSON.stringify({ html, url }), {
 *       headers: { ...corsHeaders, 'Content-Type': 'application/json' }
 *     });
 *   } catch (error) {
 *     return new Response(JSON.stringify({ error: error.message, html: null }), {
 *       status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
 *     });
 *   }
 * });
 * 
 * 3. UPDATE supabase/config.toml:
 *    [functions.fetch-html]
 *    verify_jwt = false
 * 
 * 4. GET SCREENSHOT API KEY:
 *    - Go to https://www.screenshotmachine.com
 *    - Sign up for free account
 *    - Copy your API key
 *    - Replace SCREENSHOT_API_KEY below
 * 
 * ============================================================================
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, Download, Loader2, Globe, Copy, CheckCircle2, 
  FileText, Camera, Code, ExternalLink, Plus, X, FileDown, Wand2 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

// ============================================================================
// CONFIGURATION - EDIT THESE VALUES
// ============================================================================

const SCREENSHOT_API_KEY = "892618"; // Replace with your ScreenshotMachine API key

// ============================================================================
// TYPES
// ============================================================================

interface ProjectConfig {
  projectName: string;
  projectUrl: string;
  description: string;
  goals: string;
  targetAudience: string;
  competitors: string[];
  keyQuestions: string;
}

interface CaptureResult {
  url: string;
  desktopScreenshot?: Blob;
  mobileScreenshot?: Blob;
  html?: string;
  error?: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const normalizeUrl = (url: string): string => {
  let normalized = url.trim();
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = 'https://' + normalized;
  }
  return normalized.replace(/\/$/, '');
};

const extractDomain = (url: string): string => {
  try {
    return new URL(normalizeUrl(url)).hostname.replace('www.', '');
  } catch {
    return url;
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const sanitizeFilename = (name: string): string => {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

const fetchHtml = async (url: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-html', {
      body: { url }
    });
    if (error) throw error;
    return data?.html || null;
  } catch (err) {
    console.error('HTML fetch error:', err);
    return null;
  }
};

const captureScreenshot = async (
  url: string, 
  dimension: string
): Promise<Blob | null> => {
  try {
    const params = new URLSearchParams({
      key: SCREENSHOT_API_KEY,
      url: url,
      dimension: dimension,
      format: 'png',
      cacheLimit: '0',
      delay: '4000',
    });
    
    const response = await fetch(`https://api.screenshotmachine.com?${params}`);
    if (!response.ok) throw new Error('Screenshot API error');
    return await response.blob();
  } catch (err) {
    console.error('Screenshot error:', err);
    return null;
  }
};

// ============================================================================
// PAGE DISCOVERY
// ============================================================================

const discoverPages = (baseUrl: string, html: string): string[] => {
  const domain = extractDomain(baseUrl);
  const pages = new Set<string>([normalizeUrl(baseUrl)]);
  
  // Extract links from HTML
  const linkRegex = /href=["']([^"']+)["']/g;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    try {
      let fullUrl: string;
      if (href.startsWith('http')) {
        fullUrl = href;
      } else if (href.startsWith('/') && !href.startsWith('//')) {
        fullUrl = `https://${domain}${href}`;
      } else {
        continue;
      }
      
      const parsedUrl = new URL(fullUrl);
      if (parsedUrl.hostname.includes(domain) && !parsedUrl.hash) {
        const cleanUrl = fullUrl.split('?')[0].replace(/\/$/, '');
        if (!cleanUrl.match(/\.(jpg|jpeg|png|gif|svg|css|js|pdf|zip|ico)$/i)) {
          pages.add(cleanUrl);
        }
      }
    } catch {
      // Invalid URL, skip
    }
  }
  
  return Array.from(pages).slice(0, 25); // Limit to 25 pages
};

// ============================================================================
// PROMPT GENERATION
// ============================================================================

const generateProjectBrief = (config: ProjectConfig, pageCount: number): string => {
  return `# PROJECT BRIEF: ${config.projectName}

## 📋 Overview
**Project:** ${config.projectName}
**URL:** ${config.projectUrl}
**Generated:** ${new Date().toISOString()}
**Pages Captured:** ${pageCount}

---

## 🎯 Project Description
${config.description}

---

## 🎯 Goals & Objectives
${config.goals.split(',').map(g => `- ${g.trim()}`).join('\n')}

---

## 👥 Target Audience
${config.targetAudience}

---

## 🏆 Competitors
${config.competitors.map((c, i) => `${i + 1}. ${c}`).join('\n')}

---

## 📦 Package Contents

### Screenshots
- \`/screenshots/desktop/\` - Full-page HD captures (1920px wide)
- \`/screenshots/mobile/\` - Mobile captures (375px wide)
- \`/competitors/\` - Competitor screenshots for comparison

### Source Code
- \`/html/\` - Complete HTML for each page (for SEO/accessibility analysis)

### Documentation
- \`PROJECT_BRIEF.md\` - This file
- \`REVIEW_REQUEST.md\` - Ready-to-use prompt for AI analysis
- \`SITEMAP.json\` - URL structure data

---

## 💡 How to Use

1. **Upload to ChatGPT/Claude/Gemini:**
   - Upload this entire ZIP file
   - Paste the content from REVIEW_REQUEST.md
   - Ask specific questions about design, UX, SEO

2. **Visual Analysis:**
   - Compare desktop vs mobile layouts
   - Review competitor differences
   - Note CTA placement and trust signals

3. **Code Review:**
   - Check HTML for SEO issues
   - Review meta tags and headings
   - Analyze accessibility attributes

---

*Generated by AI Feedback Package v3.0*
`;
};

const generateReviewRequest = (config: ProjectConfig): string => {
  return `# REVIEW REQUEST: ${config.projectName}

## 🎯 What I Need

I'm sharing a complete snapshot of my website **${config.projectName}** (${config.projectUrl}) for expert analysis. 

This package includes:
- Desktop & mobile screenshots of all pages
- HTML source code for SEO analysis
- Competitor screenshots for comparison

---

## ❓ Key Questions

${config.keyQuestions}

---

## 📦 Package Contents

| Content | Location | Description |
|---------|----------|-------------|
| Desktop Screenshots | \`/screenshots/desktop/\` | Full-page 1920px captures |
| Mobile Screenshots | \`/screenshots/mobile/\` | 375px mobile captures |
| HTML Source | \`/html/\` | Complete page HTML |
| Competitors | \`/competitors/\` | Competitor homepage screenshots |
| Site Data | \`SITEMAP.json\` | URL structure |

---

## 🔍 Please Analyze

### 1. Design & UX
- Is the visual hierarchy clear and effective?
- Are CTAs prominent and compelling?
- Does the design build trust?
- Is the mobile experience optimized?

### 2. Conversion Optimization
- Are conversion funnels obvious and frictionless?
- What obstacles might prevent users from converting?
- How effective are forms and interactive elements?

### 3. Competitor Comparison
- How do we compare visually to competitors?
- What are competitors doing better?
- What unique advantages do we have?

### 4. SEO (from HTML files)
- Are meta tags optimized?
- Is heading structure correct (H1, H2, etc.)?
- Are there obvious technical SEO issues?

---

## 📍 Context

**Business:** ${config.description}

**Target Users:** ${config.targetAudience}

**Goals:** ${config.goals}

---

## ✅ Expected Output

Please provide:
1. **Top 5 Critical Issues** - Problems to fix immediately
2. **Top 5 Quick Wins** - Easy improvements with high impact
3. **Competitor Insights** - What we can learn from competition
4. **Prioritized Action Items** - Specific next steps with priority levels

---

*Thank you for your analysis! Upload this ZIP and paste this prompt for a comprehensive review.*
`;
};

// ============================================================================
// PDF GENERATION
// ============================================================================

const generatePdfReport = (config: ProjectConfig, pageCount: number): jsPDF => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPos = 20;

  const checkNewPage = (requiredSpace: number = 30) => {
    if (yPos + requiredSpace > 270) {
      pdf.addPage();
      yPos = 20;
    }
  };

  // Title
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AI Feedback Report', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text(config.projectName, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(`${config.projectUrl} | Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });
  pdf.setTextColor(0);
  yPos += 20;

  // Summary
  pdf.setFillColor(240, 240, 240);
  pdf.roundedRect(15, yPos, pageWidth - 30, 25, 3, 3, 'F');
  yPos += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Analysis Summary', 20, yPos);
  yPos += 8;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`• Pages Analyzed: ${pageCount} | Competitors: ${config.competitors.filter(c => c).length}`, 25, yPos);
  yPos += 15;

  // Description
  if (config.description) {
    checkNewPage(40);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Project Description', 15, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const descLines = pdf.splitTextToSize(config.description, pageWidth - 30);
    pdf.text(descLines, 15, yPos);
    yPos += descLines.length * 5 + 10;
  }

  // Goals
  if (config.goals) {
    checkNewPage(40);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Goals & Objectives', 15, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    config.goals.split(',').forEach(goal => {
      checkNewPage(10);
      pdf.text(`• ${goal.trim()}`, 20, yPos);
      yPos += 6;
    });
    yPos += 10;
  }

  // Target Audience
  if (config.targetAudience) {
    checkNewPage(30);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Target Audience', 15, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(config.targetAudience, 15, yPos);
    yPos += 15;
  }

  // Competitors
  const competitors = config.competitors.filter(c => c);
  if (competitors.length > 0) {
    checkNewPage(30 + competitors.length * 6);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Competitors', 15, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    competitors.forEach((comp, i) => {
      pdf.text(`${i + 1}. ${comp}`, 20, yPos);
      yPos += 6;
    });
    yPos += 10;
  }

  // Key Questions
  if (config.keyQuestions) {
    checkNewPage(50);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Key Questions', 15, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const questionLines = pdf.splitTextToSize(config.keyQuestions, pageWidth - 30);
    pdf.text(questionLines, 15, yPos);
  }

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(150);
  const totalPages = pdf.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.text(`AI Feedback Package v3.0 | Page ${i} of ${totalPages}`, pageWidth / 2, 290, { align: 'center' });
  }

  return pdf;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AIFeedbackPackageStandalone: React.FC = () => {
  const [config, setConfig] = useState<ProjectConfig>({
    projectName: '',
    projectUrl: '',
    description: '',
    goals: 'Improve conversion, enhance UX, boost SEO',
    targetAudience: '',
    competitors: [''],
    keyQuestions: '1. What are the biggest UX issues?\n2. How can we improve conversion rates?\n3. What SEO improvements are needed?\n4. How do we compare to competitors?'
  });

  // Package options state
  const [packageOptions, setPackageOptions] = useState({
    desktopScreenshots: true,
    mobileScreenshots: true,
    html: true,
    competitors: true,
    prompts: true,
    pdf: true,
  });

  // Page count selector
  const [pageCount, setPageCount] = useState<'5' | '10' | '25'>('25');

  const [loading, setLoading] = useState(false);
  const [autoFillLoading, setAutoFillLoading] = useState(false);
  const [progress, setProgress] = useState({ step: '', percent: 0 });
  const [results, setResults] = useState<{ pageCount: number; downloadUrl?: string } | null>(null);

  const addCompetitor = () => {
    setConfig({ ...config, competitors: [...config.competitors, ''] });
  };

  const removeCompetitor = (index: number) => {
    const newCompetitors = config.competitors.filter((_, i) => i !== index);
    setConfig({ ...config, competitors: newCompetitors.length ? newCompetitors : [''] });
  };

  const updateCompetitor = (index: number, value: string) => {
    const newCompetitors = [...config.competitors];
    newCompetitors[index] = value;
    setConfig({ ...config, competitors: newCompetitors });
  };

  // Auto-fill with AI
  const autoFillWithAI = async () => {
    if (!config.projectUrl) {
      toast.error('Bitte zuerst eine URL eingeben');
      return;
    }

    setAutoFillLoading(true);
    toast.info('Analysiere Website mit KI...');

    try {
      const { data, error } = await supabase.functions.invoke('ai-extract-project-info', {
        body: { url: config.projectUrl }
      });

      if (error) throw error;

      if (data?.success && data?.data) {
        const extracted = data.data;
        setConfig(prev => ({
          ...prev,
          projectName: extracted.projectName || prev.projectName,
          description: extracted.description || prev.description,
          goals: extracted.goals || prev.goals,
          targetAudience: extracted.targetAudience || prev.targetAudience,
          competitors: extracted.competitors?.length > 0 
            ? extracted.competitors 
            : prev.competitors,
        }));
        toast.success('Felder wurden automatisch ausgefüllt!');
      } else {
        toast.error(data?.error || 'Fehler beim Extrahieren der Daten');
      }
    } catch (error) {
      console.error('Auto-fill error:', error);
      toast.error('Fehler beim Analysieren der Website: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'));
    } finally {
      setAutoFillLoading(false);
    }
  };

  const generatePackage = async () => {
    if (!config.projectName || !config.projectUrl) {
      toast.error('Please enter project name and URL');
      return;
    }

    // Check if at least one option is selected
    const hasSelection = Object.values(packageOptions).some(v => v);
    if (!hasSelection) {
      toast.error('Bitte mindestens eine Option auswählen');
      return;
    }

    setLoading(true);
    setProgress({ step: 'Initializing...', percent: 0 });
    setResults(null);

    try {
      const zip = new JSZip();
      const baseUrl = normalizeUrl(config.projectUrl);
      const domain = extractDomain(baseUrl);

      // Step 1: Fetch homepage and discover pages
      setProgress({ step: 'Discovering pages...', percent: 5 });
      const homeHtml = await fetchHtml(baseUrl);
      const maxPages = parseInt(pageCount);
      const allPages = homeHtml ? discoverPages(baseUrl, homeHtml) : [baseUrl];
      const pages = allPages.slice(0, maxPages);
      
      const competitors = packageOptions.competitors ? config.competitors.filter(c => c.trim()) : [];
      
      // Calculate steps based on selected options
      let stepsPerPage = 0;
      if (packageOptions.desktopScreenshots) stepsPerPage++;
      if (packageOptions.mobileScreenshots) stepsPerPage++;
      if (packageOptions.html) stepsPerPage++;
      
      const totalSteps = pages.length * stepsPerPage + competitors.length * 2 + 
        (packageOptions.prompts ? 1 : 0) + (packageOptions.pdf ? 1 : 0) + 2;
      let currentStep = 0;

      const updateProg = (step: string) => {
        currentStep++;
        setProgress({ step, percent: Math.min(95, Math.round((currentStep / totalSteps) * 100)) });
      };

      // Step 2: Capture each page
      for (let i = 0; i < pages.length; i++) {
        const url = pages[i];
        const pathname = new URL(url).pathname.replace(/\//g, '_') || 'index';
        const filename = `${String(i + 1).padStart(2, '0')}_${pathname}`;

        // Desktop screenshot
        if (packageOptions.desktopScreenshots) {
          updateProg(`Desktop: ${new URL(url).pathname || '/'}`);
          const desktopBlob = await captureScreenshot(url, '1920xfull');
          if (desktopBlob) {
            zip.file(`screenshots/desktop/${filename}.png`, desktopBlob);
          }
        }

        // Mobile screenshot
        if (packageOptions.mobileScreenshots) {
          updateProg(`Mobile: ${new URL(url).pathname || '/'}`);
          const mobileBlob = await captureScreenshot(url, '375xfull');
          if (mobileBlob) {
            zip.file(`screenshots/mobile/${filename}.png`, mobileBlob);
          }
        }

        // HTML
        if (packageOptions.html) {
          updateProg(`HTML: ${new URL(url).pathname || '/'}`);
          const html = await fetchHtml(url);
          if (html) {
            zip.file(`html/${filename}.html`, html);
          }
        }

        await delay(800); // Rate limiting
      }

      // Step 3: Capture competitors
      if (packageOptions.competitors) {
        for (const competitorUrl of competitors) {
          const compDomain = extractDomain(competitorUrl);
          
          updateProg(`Competitor: ${compDomain}`);
          const desktopBlob = await captureScreenshot(normalizeUrl(competitorUrl), '1920xfull');
          if (desktopBlob) {
            zip.file(`competitors/${compDomain}_desktop.png`, desktopBlob);
          }

          updateProg(`Competitor Mobile: ${compDomain}`);
          const mobileBlob = await captureScreenshot(normalizeUrl(competitorUrl), '375xfull');
          if (mobileBlob) {
            zip.file(`competitors/${compDomain}_mobile.png`, mobileBlob);
          }

          await delay(1000);
        }
      }

      // Step 4: Generate documentation
      if (packageOptions.prompts) {
        updateProg('Generating documentation...');
        zip.file('PROJECT_BRIEF.md', generateProjectBrief(config, pages.length));
        zip.file('REVIEW_REQUEST.md', generateReviewRequest(config));
      }
      
      zip.file('SITEMAP.json', JSON.stringify({
        generated: new Date().toISOString(),
        domain,
        pages: pages.map((url, i) => ({
          index: i + 1,
          url,
          path: new URL(url).pathname || '/'
        })),
        competitors: competitors,
        totalPages: pages.length,
        maxPagesConfigured: maxPages
      }, null, 2));

      // Step 5: Generate PDF Report
      if (packageOptions.pdf) {
        updateProg('Generating PDF report...');
        const pdf = generatePdfReport(config, pages.length);
        const pdfBlob = pdf.output('blob');
        zip.file('REPORT.pdf', pdfBlob);
      }

      // Step 6: Generate ZIP
      setProgress({ step: 'Creating ZIP...', percent: 95 });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${sanitizeFilename(config.projectName)}_ai-feedback_${timestamp}.zip`;

      saveAs(zipBlob, filename);

      setProgress({ step: 'Complete!', percent: 100 });
      setResults({ pageCount: pages.length });
      toast.success(`Package generiert! ${pages.length} Seiten erfasst.`);

    } catch (error) {
      console.error('Package generation error:', error);
      toast.error('Error generating package: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const downloadPdfOnly = () => {
    if (!config.projectName) {
      toast.error('Enter project name first');
      return;
    }
    const pdf = generatePdfReport(config, results?.pageCount || 0);
    pdf.save(`${sanitizeFilename(config.projectName)}_report.pdf`);
    toast.success('PDF downloaded!');
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generateReviewRequest(config));
    toast.success('Review prompt copied to clipboard!');
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          AI Feedback Package Generator v3.0
        </CardTitle>
        <CardDescription>
          Generate a complete analysis package for ChatGPT, Claude, or Gemini.
          Includes screenshots, HTML, and tailored prompts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Project Name *</Label>
            <Input
              placeholder="My Awesome Project"
              value={config.projectName}
              onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
              disabled={loading || autoFillLoading}
            />
          </div>
          <div className="space-y-2">
            <Label>Project URL *</Label>
            <div className="flex gap-2">
              <Input
                placeholder="example.com"
                value={config.projectUrl}
                onChange={(e) => setConfig({ ...config, projectUrl: e.target.value })}
                disabled={loading || autoFillLoading}
                className="flex-1"
              />
              <Button
                variant="secondary"
                onClick={autoFillWithAI}
                disabled={loading || autoFillLoading || !config.projectUrl}
                title="Mit KI automatisch ausfüllen"
              >
                {autoFillLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Klick auf den Zauberstab um alle Felder automatisch mit KI auszufüllen
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Project Description</Label>
          <Textarea
            placeholder="Describe what your project does..."
            value={config.description}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
            disabled={loading || autoFillLoading}
            rows={2}
          />
        </div>

        {/* Goals & Audience */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Goals (comma-separated)</Label>
            <Input
              placeholder="Improve conversion, enhance UX, boost SEO"
              value={config.goals}
              onChange={(e) => setConfig({ ...config, goals: e.target.value })}
              disabled={loading || autoFillLoading}
            />
          </div>
          <div className="space-y-2">
            <Label>Target Audience</Label>
            <Input
              placeholder="Who are your users?"
              value={config.targetAudience}
              onChange={(e) => setConfig({ ...config, targetAudience: e.target.value })}
              disabled={loading || autoFillLoading}
            />
          </div>
        </div>

        {/* Competitors */}
        <div className="space-y-2">
          <Label>Competitors</Label>
          {config.competitors.map((comp, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="competitor.com"
                value={comp}
                onChange={(e) => updateCompetitor(index, e.target.value)}
                disabled={loading || autoFillLoading}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCompetitor(index)}
                disabled={loading || autoFillLoading || config.competitors.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addCompetitor} disabled={loading || autoFillLoading}>
            <Plus className="h-4 w-4 mr-1" /> Add Competitor
          </Button>
        </div>

        {/* Package Options */}
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <Label className="text-sm font-medium">Package-Inhalte auswählen:</Label>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="desktopScreenshots"
                checked={packageOptions.desktopScreenshots}
                onCheckedChange={(checked) => 
                  setPackageOptions(prev => ({ ...prev, desktopScreenshots: !!checked }))
                }
              />
              <label htmlFor="desktopScreenshots" className="text-xs flex items-center gap-1.5 cursor-pointer">
                <Camera className="h-3 w-3 text-muted-foreground" />
                Desktop Screenshots
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mobileScreenshots"
                checked={packageOptions.mobileScreenshots}
                onCheckedChange={(checked) => 
                  setPackageOptions(prev => ({ ...prev, mobileScreenshots: !!checked }))
                }
              />
              <label htmlFor="mobileScreenshots" className="text-xs flex items-center gap-1.5 cursor-pointer">
                <Camera className="h-3 w-3 text-muted-foreground" />
                Mobile Screenshots
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="html"
                checked={packageOptions.html}
                onCheckedChange={(checked) => 
                  setPackageOptions(prev => ({ ...prev, html: !!checked }))
                }
              />
              <label htmlFor="html" className="text-xs flex items-center gap-1.5 cursor-pointer">
                <Code className="h-3 w-3 text-muted-foreground" />
                HTML Source
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="competitors"
                checked={packageOptions.competitors}
                onCheckedChange={(checked) => 
                  setPackageOptions(prev => ({ ...prev, competitors: !!checked }))
                }
              />
              <label htmlFor="competitors" className="text-xs flex items-center gap-1.5 cursor-pointer">
                <Globe className="h-3 w-3 text-muted-foreground" />
                Konkurrenten
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="prompts"
                checked={packageOptions.prompts}
                onCheckedChange={(checked) => 
                  setPackageOptions(prev => ({ ...prev, prompts: !!checked }))
                }
              />
              <label htmlFor="prompts" className="text-xs flex items-center gap-1.5 cursor-pointer">
                <FileText className="h-3 w-3 text-muted-foreground" />
                KI-Prompts
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="pdf"
                checked={packageOptions.pdf}
                onCheckedChange={(checked) => 
                  setPackageOptions(prev => ({ ...prev, pdf: !!checked }))
                }
              />
              <label htmlFor="pdf" className="text-xs flex items-center gap-1.5 cursor-pointer">
                <FileDown className="h-3 w-3 text-muted-foreground" />
                PDF Report
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Label className="text-xs">Max. Seiten:</Label>
              <Select value={pageCount} onValueChange={(v) => setPageCount(v as '5' | '10' | '25')}>
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Seiten</SelectItem>
                  <SelectItem value="10">10 Seiten</SelectItem>
                  <SelectItem value="25">25 Seiten</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs px-2"
                onClick={() => setPackageOptions({
                  desktopScreenshots: true,
                  mobileScreenshots: true,
                  html: true,
                  competitors: true,
                  prompts: true,
                  pdf: true,
                })}
              >
                Alle auswählen
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs px-2"
                onClick={() => setPackageOptions({
                  desktopScreenshots: false,
                  mobileScreenshots: false,
                  html: false,
                  competitors: false,
                  prompts: false,
                  pdf: false,
                })}
              >
                Keine
              </Button>
            </div>
          </div>
        </div>

        {/* Key Questions */}
        <div className="space-y-2">
          <Label>Key Questions for AI</Label>
          <Textarea
            placeholder="What questions should the AI answer?"
            value={config.keyQuestions}
            onChange={(e) => setConfig({ ...config, keyQuestions: e.target.value })}
            disabled={loading}
            rows={4}
          />
        </div>

        {/* Progress */}
        {loading && (
          <div className="space-y-2">
            <Progress value={progress.percent} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">{progress.step}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={generatePackage}
            disabled={loading || !config.projectName || !config.projectUrl}
            className="flex-1"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate Package
              </>
            )}
          </Button>
          <Button variant="outline" size="lg" onClick={copyPrompt}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Prompt
          </Button>
          {results && (
            <Button variant="secondary" size="lg" onClick={downloadPdfOnly}>
              <FileDown className="mr-2 h-4 w-4" />
              PDF Only
            </Button>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">
                Package generated! {results.pageCount} pages captured.
              </span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Upload the ZIP to ChatGPT, Claude, or Gemini and paste the REVIEW_REQUEST.md content.
            </p>
          </div>
        )}

        {/* Feature badges */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Badge variant="secondary"><Camera className="h-3 w-3 mr-1" /> Desktop + Mobile</Badge>
          <Badge variant="secondary"><FileText className="h-3 w-3 mr-1" /> HTML Source</Badge>
          <Badge variant="secondary"><Globe className="h-3 w-3 mr-1" /> Auto Page Discovery</Badge>
          <Badge variant="secondary"><Code className="h-3 w-3 mr-1" /> SEO Analysis Ready</Badge>
          <Badge variant="secondary"><FileDown className="h-3 w-3 mr-1" /> PDF Export</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIFeedbackPackageStandalone;
