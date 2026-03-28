/**
 * PROJECT ANALYZER COMPLETE
 * ========================
 * Single file solution for complete project analysis.
 * Just drop this file into any Lovable/Softgen project.
 * 
 * USAGE:
 * 1. Import and render: <ProjectAnalyzerComplete />
 * 2. Enter project name and URL
 * 3. Click "Analyze & Generate ZIP"
 * 4. Download the ZIP with all results and tailored prompts
 * 
 * REQUIREMENTS:
 * - Edge functions: fetch-html, capture-screenshot, lighthouse (optional)
 * - Dependencies: jszip, file-saver, lucide-react
 * - Supabase client configured
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Download, Loader2, CheckCircle2, XCircle, Globe, FileText, Camera, Zap, Package, Copy, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

// ============================================================================
// TYPES
// ============================================================================

interface AnalysisResult {
  url: string;
  html?: string;
  screenshot?: string;
  lighthouse?: {
    performance?: number;
    accessibility?: number;
    bestPractices?: number;
    seo?: number;
  };
  error?: string;
}

interface ProjectAnalysis {
  projectName: string;
  projectUrl: string;
  analyzedAt: string;
  pages: AnalysisResult[];
  summary: {
    totalPages: number;
    successfulPages: number;
    failedPages: number;
    avgPerformance?: number;
    avgSeo?: number;
  };
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
    return new URL(normalizeUrl(url)).hostname;
  } catch {
    return url;
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// ANALYSIS FUNCTIONS
// ============================================================================

const fetchHtml = async (url: string): Promise<{ html: string | null; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-html', {
      body: { url }
    });
    
    if (error) throw error;
    if (data?.error) return { html: null, error: data.error };
    return { html: data?.html || null };
  } catch (err) {
    return { html: null, error: err instanceof Error ? err.message : 'Failed to fetch HTML' };
  }
};

const captureScreenshot = async (url: string): Promise<{ screenshot: string | null; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('capture-screenshot', {
      body: { 
        url,
        dimension: '1920x1080',
        delay: 6000,
        format: 'png'
      }
    });
    
    if (error) throw error;
    if (data?.error) return { screenshot: null, error: data.error };
    return { screenshot: data?.screenshot || null };
  } catch (err) {
    return { screenshot: null, error: err instanceof Error ? err.message : 'Failed to capture screenshot' };
  }
};

const runLighthouse = async (url: string): Promise<{ lighthouse: AnalysisResult['lighthouse'] | null; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('lighthouse', {
      body: { url, strategy: 'desktop' }
    });
    
    if (error) throw error;
    if (data?.error) return { lighthouse: null, error: data.error };
    
    const categories = data?.lighthouseResult?.categories;
    if (!categories) return { lighthouse: null, error: 'No lighthouse data' };
    
    return {
      lighthouse: {
        performance: Math.round((categories.performance?.score || 0) * 100),
        accessibility: Math.round((categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
        seo: Math.round((categories.seo?.score || 0) * 100),
      }
    };
  } catch (err) {
    return { lighthouse: null, error: err instanceof Error ? err.message : 'Failed to run Lighthouse' };
  }
};

// ============================================================================
// PAGE DISCOVERY
// ============================================================================

const discoverPages = (baseUrl: string, html: string): string[] => {
  const domain = extractDomain(baseUrl);
  const pages = new Set<string>([baseUrl]);
  
  // Common page patterns for Swiss moving sites
  const commonPaths = [
    '/umzugsofferten',
    '/preisrechner',
    '/firmen',
    '/beste-umzugsfirma',
    '/guenstige-umzugsfirma',
    '/umzugsfirmen/zuerich',
    '/umzugsfirmen/bern',
    '/umzugsfirmen/basel',
    '/umzugsfirmen/aargau',
    '/umzugsfirmen/luzern',
    '/umzugsfirmen/st-gallen',
    '/privatumzug',
    '/firmenumzug',
    '/reinigung',
    '/entsorgung',
    '/umzugskosten',
    '/ratgeber',
    '/checkliste',
    '/fuer-firmen',
    '/kontakt',
    '/ueber-uns',
    '/impressum',
    '/datenschutz'
  ];
  
  // Extract links from HTML
  const linkRegex = /href=["']([^"']+)["']/g;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    try {
      let fullUrl: string;
      if (href.startsWith('http')) {
        fullUrl = href;
      } else if (href.startsWith('/')) {
        fullUrl = `https://${domain}${href}`;
      } else {
        continue;
      }
      
      const parsedUrl = new URL(fullUrl);
      if (parsedUrl.hostname === domain && !parsedUrl.hash && !fullUrl.includes('#')) {
        // Skip assets and external links
        if (!fullUrl.match(/\.(jpg|jpeg|png|gif|svg|css|js|pdf|zip)$/i)) {
          pages.add(fullUrl.split('?')[0].replace(/\/$/, ''));
        }
      }
    } catch {
      // Invalid URL, skip
    }
  }
  
  // Add common paths
  commonPaths.forEach(path => {
    pages.add(`https://${domain}${path}`);
  });
  
  return Array.from(pages).slice(0, 20); // Limit to 20 pages
};

// ============================================================================
// PROMPT GENERATION
// ============================================================================

const generateImplementationPrompt = (analysis: ProjectAnalysis): string => {
  const { projectName, projectUrl, pages, summary } = analysis;
  const domain = extractDomain(projectUrl);
  
  let prompt = `# ${projectName} - Complete Implementation Package

## Project Overview
- **Website**: ${projectUrl}
- **Domain**: ${domain}
- **Analysis Date**: ${analysis.analyzedAt}
- **Pages Analyzed**: ${summary.totalPages} (${summary.successfulPages} successful, ${summary.failedPages} failed)

## Performance Summary
${summary.avgPerformance ? `- Average Performance Score: ${summary.avgPerformance}%` : '- Performance: Not measured'}
${summary.avgSeo ? `- Average SEO Score: ${summary.avgSeo}%` : '- SEO: Not measured'}

## Implementation Instructions

### 1. Project Setup
Create a new Lovable/Softgen project with the following specifications:
- Project Name: "${projectName}"
- Framework: React + Vite + TypeScript + Tailwind CSS
- UI Library: shadcn/ui components
- Enable Lovable Cloud for backend functionality

### 2. Design System
Based on the analyzed pages, implement a design system that matches:
- Color palette extracted from screenshots
- Typography hierarchy observed in the HTML
- Component patterns used across pages

### 3. Page Structure
Implement the following pages based on the analysis:

`;

  // Add page-specific details
  pages.forEach((page, index) => {
    const pagePath = new URL(page.url).pathname || '/';
    prompt += `#### ${index + 1}. ${pagePath === '/' ? 'Homepage' : pagePath}
- URL: ${page.url}
${page.lighthouse ? `- Performance: ${page.lighthouse.performance}% | SEO: ${page.lighthouse.seo}%` : ''}
${page.error ? `- Note: Analysis had issues - ${page.error}` : ''}

`;
  });

  prompt += `
### 4. Key Features to Implement
Based on the analysis, prioritize these features:
1. Lead generation forms (Offerten/Quote requests)
2. Price calculators (Preisrechner)
3. Company listings and comparisons
4. Regional pages for SEO
5. Mobile-responsive design
6. Trust indicators (reviews, certifications)

### 5. SEO Requirements
- Implement proper meta tags based on analyzed pages
- Create semantic HTML structure
- Add structured data (JSON-LD) for local business
- Ensure mobile-first responsive design

### 6. Assets Included
This ZIP contains:
- \`/screenshots/\` - Visual references for each page
- \`/html/\` - Raw HTML for content extraction
- \`/lighthouse/\` - Performance reports (if available)
- \`analysis-summary.json\` - Complete analysis data
- \`implementation-prompt.md\` - This file

### 7. Quick Start Prompt
Copy this prompt to start implementing:

---

Create a Swiss moving comparison platform called "${projectName}" based on ${projectUrl}. 

Key requirements:
- Clean, trustworthy design with Swiss aesthetic
- Lead generation focus with prominent CTAs
- Price calculator functionality
- Company directory with ratings and reviews
- Regional SEO pages
- Mobile-first responsive design
- Implement with React, TypeScript, Tailwind CSS, and shadcn/ui

Refer to the attached screenshots and HTML files for design reference.

---

## Files in This Package
`;

  return prompt;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ProjectAnalyzerComplete: React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [results, setResults] = useState<ProjectAnalysis | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const analyzeProject = async () => {
    if (!projectName.trim() || !projectUrl.trim()) {
      toast.error('Please enter both project name and URL');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setResults(null);
    setGeneratedPrompt('');

    try {
      const normalizedUrl = normalizeUrl(projectUrl);
      const pageResults: AnalysisResult[] = [];

      // Step 1: Fetch homepage HTML
      setCurrentStep('Fetching homepage...');
      setProgress(5);
      const homeHtml = await fetchHtml(normalizedUrl);
      
      // Step 2: Discover pages
      setCurrentStep('Discovering pages...');
      setProgress(10);
      const pagesToAnalyze = homeHtml.html 
        ? discoverPages(normalizedUrl, homeHtml.html)
        : [normalizedUrl];
      
      // Step 3: Analyze each page
      const totalPages = pagesToAnalyze.length;
      for (let i = 0; i < totalPages; i++) {
        const pageUrl = pagesToAnalyze[i];
        const pagePath = new URL(pageUrl).pathname || '/';
        setCurrentStep(`Analyzing ${pagePath} (${i + 1}/${totalPages})...`);
        setProgress(10 + (i / totalPages) * 70);

        const result: AnalysisResult = { url: pageUrl };

        // Fetch HTML
        const htmlResult = await fetchHtml(pageUrl);
        if (htmlResult.html) {
          result.html = htmlResult.html;
        } else if (htmlResult.error) {
          result.error = htmlResult.error;
        }

        // Capture screenshot (with delay to avoid rate limits)
        await delay(1000);
        const screenshotResult = await captureScreenshot(pageUrl);
        if (screenshotResult.screenshot) {
          result.screenshot = screenshotResult.screenshot;
        }

        // Run Lighthouse (only for first 5 pages to avoid rate limits)
        if (i < 5) {
          await delay(2000);
          const lighthouseResult = await runLighthouse(pageUrl);
          if (lighthouseResult.lighthouse) {
            result.lighthouse = lighthouseResult.lighthouse;
          }
        }

        pageResults.push(result);
      }

      // Step 4: Calculate summary
      setCurrentStep('Generating summary...');
      setProgress(85);
      
      const successfulPages = pageResults.filter(p => p.html || p.screenshot).length;
      const lighthouseResults = pageResults.filter(p => p.lighthouse);
      
      const analysis: ProjectAnalysis = {
        projectName,
        projectUrl: normalizedUrl,
        analyzedAt: new Date().toISOString(),
        pages: pageResults,
        summary: {
          totalPages: pageResults.length,
          successfulPages,
          failedPages: pageResults.length - successfulPages,
          avgPerformance: lighthouseResults.length > 0
            ? Math.round(lighthouseResults.reduce((sum, p) => sum + (p.lighthouse?.performance || 0), 0) / lighthouseResults.length)
            : undefined,
          avgSeo: lighthouseResults.length > 0
            ? Math.round(lighthouseResults.reduce((sum, p) => sum + (p.lighthouse?.seo || 0), 0) / lighthouseResults.length)
            : undefined,
        }
      };

      // Step 5: Generate prompt
      setCurrentStep('Generating implementation prompt...');
      setProgress(90);
      const prompt = generateImplementationPrompt(analysis);
      
      setResults(analysis);
      setGeneratedPrompt(prompt);
      setProgress(100);
      setCurrentStep('Analysis complete!');
      
      toast.success('Analysis complete! Ready to download.');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadZip = async () => {
    if (!results) return;

    try {
      const zip = new JSZip();
      const timestamp = new Date().toISOString().split('T')[0];
      const safeName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');

      // Add implementation prompt
      zip.file('implementation-prompt.md', generatedPrompt);

      // Add analysis summary JSON
      zip.file('analysis-summary.json', JSON.stringify(results, null, 2));

      // Create folders
      const screenshotsFolder = zip.folder('screenshots');
      const htmlFolder = zip.folder('html');
      const lighthouseFolder = zip.folder('lighthouse');

      // Add page data
      for (const page of results.pages) {
        const pagePath = new URL(page.url).pathname || 'homepage';
        const safePageName = pagePath.replace(/\//g, '_').replace(/^_/, '') || 'homepage';

        // Add screenshot
        if (page.screenshot && screenshotsFolder) {
          try {
            // Handle base64 or URL
            if (page.screenshot.startsWith('data:')) {
              const base64Data = page.screenshot.split(',')[1];
              screenshotsFolder.file(`${safePageName}.png`, base64Data, { base64: true });
            } else if (page.screenshot.startsWith('http')) {
              // Add URL reference
              screenshotsFolder.file(`${safePageName}.txt`, `Screenshot URL: ${page.screenshot}`);
            }
          } catch (err) {
            console.error('Error adding screenshot:', err);
          }
        }

        // Add HTML
        if (page.html && htmlFolder) {
          htmlFolder.file(`${safePageName}.html`, page.html);
        }

        // Add Lighthouse report
        if (page.lighthouse && lighthouseFolder) {
          lighthouseFolder.file(`${safePageName}.json`, JSON.stringify({
            url: page.url,
            scores: page.lighthouse
          }, null, 2));
        }
      }

      // Add README
      zip.file('README.md', `# ${projectName} Analysis Package

Generated: ${timestamp}
Source: ${results.projectUrl}

## Contents
- \`implementation-prompt.md\` - Complete implementation guide and prompts
- \`analysis-summary.json\` - Full analysis data in JSON format
- \`screenshots/\` - Visual references for each page
- \`html/\` - Raw HTML content for extraction
- \`lighthouse/\` - Performance scores (if available)

## Quick Start
1. Open \`implementation-prompt.md\`
2. Copy the "Quick Start Prompt" section
3. Paste into Lovable or Softgen
4. Attach relevant screenshots as references

## Stats
- Pages Analyzed: ${results.summary.totalPages}
- Successful: ${results.summary.successfulPages}
- Performance: ${results.summary.avgPerformance || 'N/A'}%
- SEO: ${results.summary.avgSeo || 'N/A'}%
`);

      // Generate and download
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${safeName}-analysis-${timestamp}.zip`);
      
      toast.success('ZIP downloaded successfully!');
    } catch (error) {
      console.error('ZIP generation error:', error);
      toast.error('Failed to generate ZIP');
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast.success('Prompt copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Project Analyzer Complete
          </CardTitle>
          <CardDescription>
            Enter a project name and URL to generate a complete analysis package with implementation prompts.
            Download as a single ZIP file ready for Lovable or Softgen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="e.g., Umzugscheck Clone"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectUrl">Project URL</Label>
              <Input
                id="projectUrl"
                placeholder="e.g., umzugscheck.ch"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
          </div>

          <Button 
            onClick={analyzeProject} 
            disabled={isAnalyzing || !projectName.trim() || !projectUrl.trim()}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Analyze & Generate ZIP
              </>
            )}
          </Button>

          {isAnalyzing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">{currentStep}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {results && (
        <>
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Analysis Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Globe className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{results.summary.totalPages}</div>
                  <div className="text-xs text-muted-foreground">Pages Analyzed</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Camera className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{results.pages.filter(p => p.screenshot).length}</div>
                  <div className="text-xs text-muted-foreground">Screenshots</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{results.pages.filter(p => p.html).length}</div>
                  <div className="text-xs text-muted-foreground">HTML Files</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{results.summary.avgPerformance || 'N/A'}%</div>
                  <div className="text-xs text-muted-foreground">Avg Performance</div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button onClick={downloadZip} className="flex-1" size="lg">
                  <Download className="mr-2 h-4 w-4" />
                  Download Complete ZIP
                </Button>
                <Button onClick={copyPrompt} variant="outline" size="lg">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Prompt
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Prompt Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Implementation Prompt Preview</span>
                <Button variant="ghost" size="sm" onClick={copyPrompt}>
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generatedPrompt}
                readOnly
                className="min-h-[300px] font-mono text-xs"
              />
            </CardContent>
          </Card>

          {/* Page Results */}
          <Card>
            <CardHeader>
              <CardTitle>Analyzed Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {results.pages.map((page, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {page.html || page.screenshot ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      )}
                      <span className="text-sm truncate">{new URL(page.url).pathname || '/'}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {page.html && <FileText className="h-4 w-4 text-blue-500" />}
                      {page.screenshot && <Camera className="h-4 w-4 text-purple-500" />}
                      {page.lighthouse && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {page.lighthouse.performance}%
                        </span>
                      )}
                      <a 
                        href={page.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProjectAnalyzerComplete;
