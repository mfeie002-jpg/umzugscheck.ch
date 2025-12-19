/**
 * ============================================================================
 * WEB ANALYZER SUITE STANDALONE V3.0
 * ============================================================================
 * 
 * A complete, all-in-one web analysis toolkit combining:
 * 1. AI Feedback Package Generator
 * 2. Screenshot Machine
 * 3. Project Analyzer
 * 
 * Drop this single file into any Lovable or Softgen project.
 * 
 * REQUIREMENTS:
 * 1. Install dependencies: jszip, file-saver, jspdf, lucide-react
 * 2. Create edge function: fetch-html (see SETUP section)
 * 3. ScreenshotMachine API key (free tier: 100 captures/month)
 * 
 * USAGE:
 * 1. Add this file: src/components/WebAnalyzerSuiteStandalone.tsx
 * 2. Import and render: <WebAnalyzerSuiteStandalone />
 * 3. Use tabs to switch between tools
 * 
 * ============================================================================
 * SETUP INSTRUCTIONS
 * ============================================================================
 * 
 * 1. INSTALL DEPENDENCIES:
 *    npm install jszip file-saver jspdf lucide-react
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
 *   if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
 *   try {
 *     const { url } = await req.json();
 *     const response = await fetch(url, {
 *       headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AnalyzerBot/1.0)' }
 *     });
 *     const html = await response.text();
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Package, Download, Loader2, Globe, Copy, CheckCircle2, 
  FileText, Camera, Code, Plus, X, Monitor, Smartphone, 
  Image, ExternalLink, Trash2, Zap, FileDown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

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
  competitors: string[];
  keyQuestions: string;
}

interface CapturedScreenshot {
  url: string;
  blob: Blob;
  dimension: string;
  timestamp: Date;
}

interface AnalysisResult {
  url: string;
  html?: string;
  screenshot?: string;
  lighthouse?: { performance?: number; seo?: number };
  error?: string;
}

// ============================================================================
// UTILITIES
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

const captureScreenshot = async (url: string, dimension: string): Promise<Blob | null> => {
  try {
    const params = new URLSearchParams({
      key: SCREENSHOT_API_KEY,
      url: normalizeUrl(url),
      dimension,
      format: 'png',
      cacheLimit: '0',
      delay: '4000',
    });
    const response = await fetch(`https://api.screenshotmachine.com?${params}`);
    if (!response.ok) throw new Error('Screenshot API error');
    const blob = await response.blob();
    if (blob.size < 1000) throw new Error('Invalid screenshot');
    return blob;
  } catch (err) {
    console.error('Screenshot error:', err);
    return null;
  }
};

const discoverPages = (baseUrl: string, html: string): string[] => {
  const domain = extractDomain(baseUrl);
  const pages = new Set<string>([normalizeUrl(baseUrl)]);
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
    } catch { /* skip invalid */ }
  }
  return Array.from(pages).slice(0, 25);
};

// ============================================================================
// PDF GENERATION
// ============================================================================

const generatePdfReport = (config: ProjectConfig, pageCount: number, screenshots: { url: string; blob: Blob }[]) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPos = 20;

  // Helper to add new page if needed
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

  // Project name
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text(config.projectName, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // URL and date
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(`${config.projectUrl} | Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });
  pdf.setTextColor(0);
  yPos += 20;

  // Summary box
  pdf.setFillColor(240, 240, 240);
  pdf.roundedRect(15, yPos, pageWidth - 30, 35, 3, 3, 'F');
  yPos += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Analysis Summary', 20, yPos);
  yPos += 8;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`• Pages Analyzed: ${pageCount}`, 25, yPos);
  yPos += 6;
  pdf.text(`• Screenshots Captured: ${screenshots.length}`, 25, yPos);
  yPos += 6;
  pdf.text(`• Competitors: ${config.competitors.filter(c => c).length}`, 25, yPos);
  yPos += 20;

  // Project Description
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
    pdf.text('Key Questions for Analysis', 15, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const questionLines = pdf.splitTextToSize(config.keyQuestions, pageWidth - 30);
    pdf.text(questionLines, 15, yPos);
    yPos += questionLines.length * 5 + 10;
  }

  // Next Steps
  pdf.addPage();
  yPos = 20;
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Recommended Next Steps', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  const steps = [
    '1. Upload the accompanying ZIP file to ChatGPT, Claude, or Gemini',
    '2. Paste the REVIEW_REQUEST.md content as your prompt',
    '3. Review the AI analysis and recommendations',
    '4. Create action items based on findings',
    '5. Prioritize quick wins vs. long-term improvements',
    '6. Schedule regular re-analysis to track progress'
  ];

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  steps.forEach(step => {
    pdf.text(step, 20, yPos);
    yPos += 10;
  });

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(150);
  const pageCount2 = pdf.internal.pages.length - 1;
  for (let i = 1; i <= pageCount2; i++) {
    pdf.setPage(i);
    pdf.text(
      `AI Feedback Package v3.0 | Page ${i} of ${pageCount2}`,
      pageWidth / 2,
      290,
      { align: 'center' }
    );
  }

  return pdf;
};

// ============================================================================
// PROMPT GENERATORS
// ============================================================================

const generateProjectBrief = (config: ProjectConfig, pageCount: number): string => {
  return `# PROJECT BRIEF: ${config.projectName}

## Overview
**Project:** ${config.projectName}
**URL:** ${config.projectUrl}
**Generated:** ${new Date().toISOString()}
**Pages Captured:** ${pageCount}

## Description
${config.description}

## Goals
${config.goals.split(',').map(g => `- ${g.trim()}`).join('\n')}

## Target Audience
${config.targetAudience}

## Competitors
${config.competitors.filter(c => c).map((c, i) => `${i + 1}. ${c}`).join('\n')}

## Package Contents
- \`/screenshots/desktop/\` - Full-page HD captures
- \`/screenshots/mobile/\` - Mobile captures
- \`/competitors/\` - Competitor screenshots
- \`/html/\` - HTML source files
- \`PROJECT_BRIEF.md\` - This file
- \`REVIEW_REQUEST.md\` - AI prompt
- \`REPORT.pdf\` - PDF summary

*Generated by Web Analyzer Suite v3.0*
`;
};

const generateReviewRequest = (config: ProjectConfig): string => {
  return `# REVIEW REQUEST: ${config.projectName}

I'm sharing a complete snapshot of **${config.projectName}** (${config.projectUrl}) for expert analysis.

## Package Contents
| Content | Location |
|---------|----------|
| Desktop Screenshots | \`/screenshots/desktop/\` |
| Mobile Screenshots | \`/screenshots/mobile/\` |
| HTML Source | \`/html/\` |
| Competitors | \`/competitors/\` |

## Key Questions
${config.keyQuestions}

## Please Analyze
1. **Design & UX** - Visual hierarchy, CTAs, trust signals, mobile experience
2. **Conversion** - Funnels, friction points, form effectiveness
3. **Competitor Comparison** - Strengths vs competitors
4. **SEO** - Meta tags, headings, technical issues

## Expected Output
1. **Top 5 Critical Issues** - Fix immediately
2. **Top 5 Quick Wins** - Easy high-impact changes
3. **Competitor Insights** - What to learn from competition
4. **Prioritized Actions** - Next steps with priority

*Upload ZIP and paste this prompt for comprehensive review.*
`;
};

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
    { label: 'iPhone (375x812)', value: '375x812' },
    { label: 'iPhone Full Page', value: '375xfull' },
    { label: 'Android (360x800)', value: '360x800' },
  ],
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const WebAnalyzerSuiteStandalone: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'feedback' | 'screenshot' | 'analyzer'>('feedback');

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Web Analyzer Suite v3.0
          </CardTitle>
          <CardDescription>
            Complete toolkit for website analysis, screenshots, and AI-ready feedback packages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTool} onValueChange={(v) => setActiveTool(v as typeof activeTool)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="feedback" className="gap-2">
                <Package className="h-4 w-4" />
                AI Feedback
              </TabsTrigger>
              <TabsTrigger value="screenshot" className="gap-2">
                <Camera className="h-4 w-4" />
                Screenshots
              </TabsTrigger>
              <TabsTrigger value="analyzer" className="gap-2">
                <Globe className="h-4 w-4" />
                Analyzer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feedback">
              <AIFeedbackTab />
            </TabsContent>

            <TabsContent value="screenshot">
              <ScreenshotTab />
            </TabsContent>

            <TabsContent value="analyzer">
              <AnalyzerTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 justify-center text-xs">
        <Badge variant="outline"><Camera className="h-3 w-3 mr-1" /> Desktop + Mobile</Badge>
        <Badge variant="outline"><FileText className="h-3 w-3 mr-1" /> PDF Export</Badge>
        <Badge variant="outline"><Globe className="h-3 w-3 mr-1" /> Auto Discovery</Badge>
        <Badge variant="outline"><Code className="h-3 w-3 mr-1" /> SEO Ready</Badge>
        <Badge variant="outline"><Download className="h-3 w-3 mr-1" /> ZIP Export</Badge>
      </div>
    </div>
  );
};

// ============================================================================
// AI FEEDBACK TAB
// ============================================================================

const AIFeedbackTab: React.FC = () => {
  const [config, setConfig] = useState<ProjectConfig>({
    projectName: '',
    projectUrl: '',
    description: '',
    goals: 'Improve conversion, enhance UX, boost SEO',
    targetAudience: '',
    competitors: [''],
    keyQuestions: '1. What are the biggest UX issues?\n2. How can we improve conversion rates?\n3. What SEO improvements are needed?'
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ step: '', percent: 0 });
  const [results, setResults] = useState<{ pageCount: number } | null>(null);
  const [capturedScreenshots, setCapturedScreenshots] = useState<{ url: string; blob: Blob }[]>([]);

  const updateCompetitor = (index: number, value: string) => {
    const newCompetitors = [...config.competitors];
    newCompetitors[index] = value;
    setConfig({ ...config, competitors: newCompetitors });
  };

  const addCompetitor = () => setConfig({ ...config, competitors: [...config.competitors, ''] });
  const removeCompetitor = (index: number) => {
    const newCompetitors = config.competitors.filter((_, i) => i !== index);
    setConfig({ ...config, competitors: newCompetitors.length ? newCompetitors : [''] });
  };

  const generatePackage = async () => {
    if (!config.projectName || !config.projectUrl) {
      toast.error('Please enter project name and URL');
      return;
    }

    setLoading(true);
    setProgress({ step: 'Initializing...', percent: 0 });
    setResults(null);
    setCapturedScreenshots([]);

    try {
      const zip = new JSZip();
      const baseUrl = normalizeUrl(config.projectUrl);
      const screenshots: { url: string; blob: Blob }[] = [];

      setProgress({ step: 'Discovering pages...', percent: 5 });
      const homeHtml = await fetchHtml(baseUrl);
      const pages = homeHtml ? discoverPages(baseUrl, homeHtml) : [baseUrl];
      const competitors = config.competitors.filter(c => c.trim());
      const totalSteps = pages.length * 3 + competitors.length * 2 + 5;
      let currentStep = 0;

      const updateProg = (step: string) => {
        currentStep++;
        setProgress({ step, percent: Math.min(95, Math.round((currentStep / totalSteps) * 100)) });
      };

      for (let i = 0; i < pages.length; i++) {
        const url = pages[i];
        const pathname = new URL(url).pathname.replace(/\//g, '_') || 'index';
        const filename = `${String(i + 1).padStart(2, '0')}_${pathname}`;

        updateProg(`Desktop: ${new URL(url).pathname || '/'}`);
        const desktopBlob = await captureScreenshot(url, '1920xfull');
        if (desktopBlob) {
          zip.file(`screenshots/desktop/${filename}.png`, desktopBlob);
          screenshots.push({ url, blob: desktopBlob });
        }

        updateProg(`Mobile: ${new URL(url).pathname || '/'}`);
        const mobileBlob = await captureScreenshot(url, '375xfull');
        if (mobileBlob) {
          zip.file(`screenshots/mobile/${filename}.png`, mobileBlob);
        }

        updateProg(`HTML: ${new URL(url).pathname || '/'}`);
        const html = await fetchHtml(url);
        if (html) zip.file(`html/${filename}.html`, html);

        await delay(800);
      }

      for (const competitorUrl of competitors) {
        const compDomain = extractDomain(competitorUrl);
        updateProg(`Competitor: ${compDomain}`);
        const desktopBlob = await captureScreenshot(normalizeUrl(competitorUrl), '1920xfull');
        if (desktopBlob) zip.file(`competitors/${compDomain}_desktop.png`, desktopBlob);

        updateProg(`Competitor Mobile: ${compDomain}`);
        const mobileBlob = await captureScreenshot(normalizeUrl(competitorUrl), '375xfull');
        if (mobileBlob) zip.file(`competitors/${compDomain}_mobile.png`, mobileBlob);

        await delay(1000);
      }

      updateProg('Generating documentation...');
      zip.file('PROJECT_BRIEF.md', generateProjectBrief(config, pages.length));
      zip.file('REVIEW_REQUEST.md', generateReviewRequest(config));
      zip.file('SITEMAP.json', JSON.stringify({ domain: extractDomain(baseUrl), pages, competitors }, null, 2));

      // Generate PDF
      updateProg('Generating PDF report...');
      const pdf = generatePdfReport(config, pages.length, screenshots);
      const pdfBlob = pdf.output('blob');
      zip.file('REPORT.pdf', pdfBlob);

      setProgress({ step: 'Creating ZIP...', percent: 95 });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const timestamp = new Date().toISOString().split('T')[0];
      saveAs(zipBlob, `${sanitizeFilename(config.projectName)}_ai-feedback_${timestamp}.zip`);

      setProgress({ step: 'Complete!', percent: 100 });
      setResults({ pageCount: pages.length });
      setCapturedScreenshots(screenshots);
      toast.success('Package generated with PDF report!');
    } catch (error) {
      toast.error('Error: ' + (error instanceof Error ? error.message : 'Unknown'));
    } finally {
      setLoading(false);
    }
  };

  const downloadPdfOnly = () => {
    if (!config.projectName) {
      toast.error('Enter project name first');
      return;
    }
    const pdf = generatePdfReport(config, results?.pageCount || 0, capturedScreenshots);
    pdf.save(`${sanitizeFilename(config.projectName)}_report.pdf`);
    toast.success('PDF downloaded!');
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generateReviewRequest(config));
    toast.success('Prompt copied!');
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Project Name *</Label>
          <Input
            placeholder="My Project"
            value={config.projectName}
            onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label>Project URL *</Label>
          <Input
            placeholder="example.com"
            value={config.projectUrl}
            onChange={(e) => setConfig({ ...config, projectUrl: e.target.value })}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          placeholder="What does your project do?"
          value={config.description}
          onChange={(e) => setConfig({ ...config, description: e.target.value })}
          disabled={loading}
          rows={2}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Goals (comma-separated)</Label>
          <Input
            placeholder="Improve conversion, enhance UX"
            value={config.goals}
            onChange={(e) => setConfig({ ...config, goals: e.target.value })}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label>Target Audience</Label>
          <Input
            placeholder="Who are your users?"
            value={config.targetAudience}
            onChange={(e) => setConfig({ ...config, targetAudience: e.target.value })}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Competitors</Label>
        {config.competitors.map((comp, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="competitor.com"
              value={comp}
              onChange={(e) => updateCompetitor(index, e.target.value)}
              disabled={loading}
            />
            <Button variant="ghost" size="icon" onClick={() => removeCompetitor(index)} disabled={loading || config.competitors.length <= 1}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addCompetitor} disabled={loading}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Key Questions</Label>
        <Textarea
          value={config.keyQuestions}
          onChange={(e) => setConfig({ ...config, keyQuestions: e.target.value })}
          disabled={loading}
          rows={3}
        />
      </div>

      {loading && (
        <div className="space-y-2">
          <Progress value={progress.percent} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">{progress.step}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={generatePackage} disabled={loading || !config.projectName || !config.projectUrl} className="flex-1" size="lg">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Download className="mr-2 h-4 w-4" /> Generate Package</>}
        </Button>
        <Button variant="outline" size="lg" onClick={copyPrompt}>
          <Copy className="mr-2 h-4 w-4" /> Copy Prompt
        </Button>
        {results && (
          <Button variant="secondary" size="lg" onClick={downloadPdfOnly}>
            <FileDown className="mr-2 h-4 w-4" /> PDF Only
          </Button>
        )}
      </div>

      {results && (
        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Package generated! {results.pageCount} pages + PDF report.</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SCREENSHOT TAB
// ============================================================================

const ScreenshotTab: React.FC = () => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [singleUrl, setSingleUrl] = useState('');
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedDimension, setSelectedDimension] = useState('1920x1080');
  const [fullPage, setFullPage] = useState(false);
  const [bulkUrls, setBulkUrls] = useState('');
  const [captureDesktop, setCaptureDesktop] = useState(true);
  const [captureMobile, setCaptureMobile] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ step: '', percent: 0 });
  const [captures, setCaptures] = useState<CapturedScreenshot[]>([]);

  const handleSingleCapture = async () => {
    if (!singleUrl.trim()) { toast.error('Enter a URL'); return; }
    setLoading(true);
    setProgress({ step: 'Capturing...', percent: 50 });
    const dimension = fullPage ? selectedDimension.replace(/x\d+$/, 'xfull') : selectedDimension;
    const blob = await captureScreenshot(singleUrl, dimension);
    if (blob) {
      setCaptures(prev => [{ url: singleUrl, blob, dimension, timestamp: new Date() }, ...prev]);
      toast.success('Captured!');
    } else {
      toast.error('Capture failed');
    }
    setLoading(false);
    setProgress({ step: '', percent: 0 });
  };

  const handleBulkCapture = async () => {
    const urls = bulkUrls.split('\n').map(u => u.trim()).filter(Boolean);
    if (urls.length === 0) { toast.error('Enter at least one URL'); return; }
    setLoading(true);
    const newCaptures: CapturedScreenshot[] = [];
    const totalSteps = urls.length * ((captureDesktop ? 1 : 0) + (captureMobile ? 1 : 0));
    let currentStep = 0;

    for (const url of urls) {
      if (captureDesktop) {
        currentStep++;
        setProgress({ step: `Desktop: ${extractDomain(url)}`, percent: Math.round((currentStep / totalSteps) * 100) });
        const blob = await captureScreenshot(url, '1920xfull');
        if (blob) newCaptures.push({ url, blob, dimension: '1920xfull', timestamp: new Date() });
        await delay(1000);
      }
      if (captureMobile) {
        currentStep++;
        setProgress({ step: `Mobile: ${extractDomain(url)}`, percent: Math.round((currentStep / totalSteps) * 100) });
        const blob = await captureScreenshot(url, '375xfull');
        if (blob) newCaptures.push({ url, blob, dimension: '375xfull', timestamp: new Date() });
        await delay(1000);
      }
    }
    setCaptures(prev => [...newCaptures, ...prev]);
    toast.success(`Captured ${newCaptures.length} screenshots!`);
    setLoading(false);
    setProgress({ step: '', percent: 0 });
  };

  const downloadSingle = (capture: CapturedScreenshot) => {
    saveAs(capture.blob, `${sanitizeFilename(extractDomain(capture.url))}_${capture.dimension}.png`);
  };

  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    captures.forEach((capture, index) => {
      const folder = capture.dimension.startsWith('1920') ? 'desktop' : 'mobile';
      zip.file(`${folder}/${String(index + 1).padStart(2, '0')}_${sanitizeFilename(extractDomain(capture.url))}.png`, capture.blob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `screenshots_${new Date().toISOString().split('T')[0]}.zip`);
    toast.success('ZIP downloaded!');
  };

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'single' | 'bulk')}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="single"><Image className="h-4 w-4 mr-2" /> Single</TabsTrigger>
          <TabsTrigger value="bulk"><Globe className="h-4 w-4 mr-2" /> Bulk</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-4">
          <div className="space-y-2">
            <Label>URL</Label>
            <Input placeholder="example.com" value={singleUrl} onChange={(e) => setSingleUrl(e.target.value)} disabled={loading} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Device</Label>
              <Select value={deviceType} onValueChange={(v) => { setDeviceType(v as 'desktop' | 'mobile'); setSelectedDimension(DIMENSION_PRESETS[v as 'desktop' | 'mobile'][0].value); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="desktop"><Monitor className="h-4 w-4 inline mr-2" />Desktop</SelectItem>
                  <SelectItem value="mobile"><Smartphone className="h-4 w-4 inline mr-2" />Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dimension</Label>
              <Select value={selectedDimension} onValueChange={setSelectedDimension}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DIMENSION_PRESETS[deviceType].map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="fullPage" checked={fullPage} onCheckedChange={setFullPage} />
            <Label htmlFor="fullPage">Full page</Label>
          </div>
          <Button onClick={handleSingleCapture} disabled={loading || !singleUrl} className="w-full" size="lg">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Capturing...</> : <><Camera className="mr-2 h-4 w-4" /> Capture</>}
          </Button>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <div className="space-y-2">
            <Label>URLs (one per line)</Label>
            <Textarea placeholder="example.com&#10;another.com" value={bulkUrls} onChange={(e) => setBulkUrls(e.target.value)} disabled={loading} rows={5} />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="captureDesktop" checked={captureDesktop} onCheckedChange={setCaptureDesktop} />
              <Label htmlFor="captureDesktop">Desktop</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="captureMobile" checked={captureMobile} onCheckedChange={setCaptureMobile} />
              <Label htmlFor="captureMobile">Mobile</Label>
            </div>
          </div>
          {loading && <div className="space-y-2"><Progress value={progress.percent} className="h-2" /><p className="text-sm text-muted-foreground text-center">{progress.step}</p></div>}
          <Button onClick={handleBulkCapture} disabled={loading || !bulkUrls.trim()} className="w-full" size="lg">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Capturing...</> : <><Globe className="mr-2 h-4 w-4" /> Capture All</>}
          </Button>
        </TabsContent>
      </Tabs>

      {captures.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Screenshots ({captures.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadAllAsZip}><Download className="h-4 w-4 mr-1" /> ZIP</Button>
                <Button variant="ghost" size="sm" onClick={() => setCaptures([])}><Trash2 className="h-4 w-4 mr-1" /> Clear</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {captures.slice(0, 9).map((capture, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img src={URL.createObjectURL(capture.blob)} alt={capture.url} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="p-2 flex items-center justify-between">
                    <span className="text-xs truncate flex-1">{extractDomain(capture.url)}</span>
                    <Button variant="ghost" size="sm" onClick={() => downloadSingle(capture)}><Download className="h-3 w-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ============================================================================
// ANALYZER TAB
// ============================================================================

const AnalyzerTab: React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ step: '', percent: 0 });
  const [results, setResults] = useState<{ pageCount: number; promptPreview: string } | null>(null);

  const runAnalysis = async () => {
    if (!projectName || !projectUrl) { toast.error('Enter project name and URL'); return; }
    setLoading(true);
    setProgress({ step: 'Initializing...', percent: 0 });
    setResults(null);

    try {
      const zip = new JSZip();
      const baseUrl = normalizeUrl(projectUrl);
      const domain = extractDomain(baseUrl);

      setProgress({ step: 'Discovering pages...', percent: 5 });
      const homeHtml = await fetchHtml(baseUrl);
      const pages = homeHtml ? discoverPages(baseUrl, homeHtml) : [baseUrl];
      const maxPages = Math.min(pages.length, 20);

      for (let i = 0; i < maxPages; i++) {
        const url = pages[i];
        const pathname = new URL(url).pathname.replace(/\//g, '_') || 'index';
        setProgress({ step: `Analyzing: ${pathname || '/'}`, percent: Math.round(((i + 1) / maxPages) * 80) });

        const screenshot = await captureScreenshot(url, '1920x1080');
        if (screenshot) zip.file(`screenshots/${String(i + 1).padStart(2, '0')}_${pathname}.png`, screenshot);

        const html = await fetchHtml(url);
        if (html) zip.file(`html/${String(i + 1).padStart(2, '0')}_${pathname}.html`, html);

        await delay(800);
      }

      const prompt = `# Implementation Guide: ${projectName}

## Overview
- **Project:** ${projectName}
- **URL:** ${projectUrl}
- **Pages Analyzed:** ${maxPages}
- **Generated:** ${new Date().toISOString()}

## Quick Start Prompt
\`\`\`
Create a website clone of ${projectName} (${projectUrl}).
This package contains ${maxPages} page screenshots and HTML files.
Recreate the design system, layout, and key features.
Use React + TypeScript + Tailwind CSS + shadcn/ui.
\`\`\`

## Page Structure
${pages.slice(0, maxPages).map((url, i) => `${i + 1}. ${new URL(url).pathname || '/'}`).join('\n')}

## Implementation Steps
1. Set up project with Vite + React + TypeScript
2. Install Tailwind CSS and shadcn/ui
3. Create layout components (Header, Footer, Navigation)
4. Implement each page based on screenshots
5. Match design system (colors, typography, spacing)
6. Add responsive breakpoints
7. Implement SEO metadata
`;

      zip.file('implementation-prompt.md', prompt);
      zip.file('analysis-summary.json', JSON.stringify({ projectName, projectUrl, domain, pages: pages.slice(0, maxPages), analyzedAt: new Date().toISOString() }, null, 2));
      zip.file('README.md', `# ${projectName} Analysis Package\n\nGenerated by Web Analyzer Suite v3.0\n\n## Contents\n- /screenshots/ - Page screenshots\n- /html/ - HTML source\n- implementation-prompt.md - Ready-to-use prompt`);

      setProgress({ step: 'Creating ZIP...', percent: 95 });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${sanitizeFilename(projectName)}_analysis_${new Date().toISOString().split('T')[0]}.zip`);

      setProgress({ step: 'Complete!', percent: 100 });
      setResults({ pageCount: maxPages, promptPreview: prompt });
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Error: ' + (error instanceof Error ? error.message : 'Unknown'));
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = () => {
    if (results?.promptPreview) {
      navigator.clipboard.writeText(results.promptPreview);
      toast.success('Prompt copied!');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Project Name *</Label>
          <Input placeholder="My Project" value={projectName} onChange={(e) => setProjectName(e.target.value)} disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label>Project URL *</Label>
          <Input placeholder="example.com" value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} disabled={loading} />
        </div>
      </div>

      {loading && (
        <div className="space-y-2">
          <Progress value={progress.percent} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">{progress.step}</p>
        </div>
      )}

      <Button onClick={runAnalysis} disabled={loading || !projectName || !projectUrl} className="w-full" size="lg">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><Globe className="mr-2 h-4 w-4" /> Analyze & Generate ZIP</>}
      </Button>

      {results && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Analyzed {results.pageCount} pages!</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated Prompt</Label>
              <Button variant="outline" size="sm" onClick={copyPrompt}><Copy className="h-4 w-4 mr-1" /> Copy</Button>
            </div>
            <Textarea value={results.promptPreview} readOnly rows={10} className="font-mono text-xs" />
          </div>
        </div>
      )}
    </div>
  );
};

export default WebAnalyzerSuiteStandalone;
