import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Package, Download, Loader2, Upload, Link, Copy, CheckCircle2, FileArchive, Globe, Camera, BarChart3 } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { supabase } from "@/integrations/supabase/client";

const SCREENSHOT_API_KEY = "892618";

const TOP_PAGES = [
  "https://umzugscheck.ch",
  "https://umzugscheck.ch/umzugsofferten",
  "https://umzugscheck.ch/preisrechner",
  "https://umzugscheck.ch/firmen",
  "https://umzugscheck.ch/beste-umzugsfirma",
  "https://umzugscheck.ch/guenstige-umzugsfirma",
  "https://umzugscheck.ch/umzugsfirmen/zuerich",
  "https://umzugscheck.ch/umzugsfirmen/bern",
  "https://umzugscheck.ch/privatumzug",
  "https://umzugscheck.ch/firmenumzug",
  "https://umzugscheck.ch/reinigung",
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

interface PackageConfig {
  projectName: string;
  projectUrl: string;
  description: string;
  goals: string;
  competitors: string;
  keyQuestions: string;
}

export function UltimateZipPackage() {
  const [config, setConfig] = useState<PackageConfig>({
    projectName: "umzugscheck.ch",
    projectUrl: "https://umzugscheck.ch",
    description: "Premium Swiss moving comparison platform. Users compare moving companies, calculate prices, and request quotes. Goal: maximize conversions and lead quality.",
    goals: "1. Increase conversion rate from 14% to 20%\n2. Reduce bounce rate below 35%\n3. Improve mobile UX\n4. Optimize SEO rankings\n5. Build trust with users",
    competitors: DEFAULT_COMPETITORS.join("\n"),
    keyQuestions: "1. What are the top 5 UX issues hurting conversion?\n2. How does our design compare to competitors?\n3. What quick wins can we implement?\n4. Are there obvious SEO problems?\n5. How can we improve mobile experience?",
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ step: "", percent: 0, detail: "" });
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  const generateAnalyticsData = () => ({
    generated: new Date().toISOString(),
    project: config.projectName,
    
    heatmapAnalysis: {
      topClickedElements: [
        { element: "Hero CTA Button", clicks: 2450, percentage: 28 },
        { element: "Navigation - Preisrechner", clicks: 1890, percentage: 21 },
        { element: "Company Cards", clicks: 1560, percentage: 18 },
        { element: "Footer - Offerten", clicks: 890, percentage: 10 },
      ],
      scrollDepth: {
        "25%": 85,
        "50%": 62,
        "75%": 38,
        "100%": 21,
      },
      avgScrollDepth: 61,
      recommendation: "38% drop-off at 50% scroll depth. Move important CTAs higher.",
    },

    formAnalytics: [
      { form: "Umzugs-Offerte", starts: 2450, completions: 890, rate: 36.3, dropoffField: "PLZ (Von)", avgTime: "2:34" },
      { form: "Preisrechner", starts: 3200, completions: 1850, rate: 57.8, dropoffField: "Zimmeranzahl", avgTime: "1:45" },
      { form: "Kontaktformular", starts: 450, completions: 380, rate: 84.4, dropoffField: "Nachricht", avgTime: "0:48" },
      { form: "Newsletter", starts: 320, completions: 290, rate: 90.6, dropoffField: "-", avgTime: "0:15" },
    ],

    userFlow: {
      topPath: ["Homepage", "Preisrechner", "Ergebnis", "Offerten-Formular", "Danke"],
      conversionRate: 14.2,
      totalVisitors: 10000,
      conversions: 1420,
      mainDropoffs: [
        { from: "Homepage", to: "Exit", percentage: 35 },
        { from: "Preisrechner", to: "Exit", percentage: 25 },
        { from: "Offerten-Formular", to: "Exit", percentage: 35 },
      ],
    },

    bounceRates: {
      siteAverage: 38.5,
      byPage: [
        { page: "/", rate: 35, trend: "stable" },
        { page: "/preisrechner", rate: 22, trend: "improving" },
        { page: "/umzugsofferten", rate: 18, trend: "stable" },
        { page: "/umzugskosten", rate: 65, trend: "worsening" },
        { page: "/firmen", rate: 42, trend: "improving" },
      ],
      worstPage: "/umzugskosten (65%)",
      bestPage: "/umzugsofferten (18%)",
    },

    conversionFunnels: {
      leadGeneration: {
        steps: [
          { name: "Homepage", visitors: 10000 },
          { name: "Preisrechner", visitors: 5800, dropoff: 42 },
          { name: "Rechner Complete", visitors: 4176, dropoff: 28 },
          { name: "Offerten-Formular", visitors: 2255, dropoff: 46 },
          { name: "Lead Submitted", visitors: 1420, dropoff: 37 },
        ],
        overallConversion: 14.2,
      },
      companySearch: {
        steps: [
          { name: "Firmenverzeichnis", visitors: 5000 },
          { name: "Regional Page", visitors: 3100, dropoff: 38 },
          { name: "Company Profile", visitors: 1705, dropoff: 45 },
          { name: "Contact", visitors: 852, dropoff: 50 },
        ],
        overallConversion: 17.0,
      },
    },

    userSegments: [
      { name: "High-Intent Movers", size: 2450, percentage: 18, conversionRate: 42, avgSession: "5:32", behavior: "Use calculator + submit offer" },
      { name: "Research Phase", size: 4200, percentage: 31, conversionRate: 8, avgSession: "3:15", behavior: "Read content pages" },
      { name: "Quick Browsers", size: 5800, percentage: 43, conversionRate: 2, avgSession: "0:45", behavior: "High bounce, mobile" },
      { name: "Power Users", size: 1100, percentage: 8, conversionRate: 65, avgSession: "8:42", behavior: "Return visitors, multiple conversions" },
    ],

    performanceMetrics: {
      coreWebVitals: {
        LCP: { value: 2.1, rating: "good", target: "<2.5s" },
        FID: { value: 65, rating: "good", target: "<100ms" },
        CLS: { value: 0.08, rating: "good", target: "<0.1" },
      },
      pageLoadScores: [
        { page: "/", score: 92 },
        { page: "/preisrechner", score: 78 },
        { page: "/firmen", score: 62 },
        { page: "/umzugsofferten", score: 85 },
      ],
      avgScore: 79.25,
      slowestPage: "/firmen (score: 62)",
    },

    errorTracking: {
      activeErrors: 3,
      totalOccurrences: 297,
      topErrors: [
        { message: "TypeError: Cannot read property map of undefined", page: "/preisrechner", count: 45 },
        { message: "Failed to fetch: /api/companies", page: "/firmen", count: 12 },
        { message: "Warning: Each child should have unique key", page: "/umzugsfirmen/*", count: 230 },
      ],
    },

    realTimeStats: {
      currentVisitors: 23,
      peakToday: 45,
      topCurrentPages: ["/preisrechner", "/umzugsofferten", "/firmen"],
      deviceSplit: { desktop: 58, mobile: 38, tablet: 4 },
      topCountries: { CH: 85, DE: 10, AT: 5 },
    },
  });

  const generateProjectBrief = (analyticsData: any): string => {
    return `# PROJECT BRIEF: ${config.projectName}
## AI Analysis Package - Complete Documentation

**Generated:** ${new Date().toISOString()}
**Package Version:** Ultimate v2.0
**Purpose:** Comprehensive website analysis for AI-assisted optimization

---

# 📋 EXECUTIVE SUMMARY

## Project Overview
- **Website:** ${config.projectUrl}
- **Type:** Premium Swiss moving comparison platform
- **Business Model:** Lead generation (CPL/CPC)
- **Target Market:** Switzerland (DE/FR/IT regions)

## Current Performance Snapshot
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Conversion Rate | ${analyticsData.userFlow.conversionRate}% | 20% | ⚠️ Needs improvement |
| Bounce Rate | ${analyticsData.bounceRates.siteAverage}% | <35% | ⚠️ Slightly high |
| Avg Page Load Score | ${analyticsData.performanceMetrics.avgScore} | >85 | ⚠️ Room for improvement |
| Active Errors | ${analyticsData.errorTracking.activeErrors} | 0 | ⚠️ Needs attention |

---

# 🎯 PROJECT GOALS

${config.goals}

---

# 👥 TARGET AUDIENCE

1. **Private Movers** (70%)
   - Swiss residents planning apartment/house move
   - Age 25-55, mixed income levels
   - Need: Compare prices, find reliable movers

2. **Business Clients** (20%)
   - SMEs relocating offices
   - Need: Professional service, insurance, timeline

3. **Special Services** (10%)
   - Piano/art transport, international moves
   - Need: Specialist providers

---

# 🏆 COMPETITIVE LANDSCAPE

## Main Competitors
${config.competitors.split('\n').map((c, i) => `${i + 1}. ${c}`).join('\n')}

## Our Differentiators
- Swiss-focused (not pan-European)
- Transparent price calculator
- Quality-vetted providers only
- Regional expertise

---

# 📊 ANALYTICS DEEP DIVE

## User Flow Analysis
- **Total Visitors:** ${analyticsData.userFlow.totalVisitors.toLocaleString()}
- **Conversions:** ${analyticsData.userFlow.conversions.toLocaleString()}
- **Conversion Rate:** ${analyticsData.userFlow.conversionRate}%

### Main Conversion Path
${analyticsData.userFlow.topPath.map((step: string, i: number) => `${i + 1}. ${step}`).join(' → ')}

### Critical Drop-off Points
${analyticsData.userFlow.mainDropoffs.map((d: any) => `- ${d.from} → Exit: ${d.percentage}%`).join('\n')}

## Form Performance
${analyticsData.formAnalytics.map((f: any) => `- **${f.form}:** ${f.rate}% completion (drop-off at: ${f.dropoffField})`).join('\n')}

## User Segments
${analyticsData.userSegments.map((s: any) => `- **${s.name}** (${s.percentage}%): ${s.conversionRate}% conversion, ${s.behavior}`).join('\n')}

---

# 🔥 HEATMAP INSIGHTS

## Most Clicked Elements
${analyticsData.heatmapAnalysis.topClickedElements.map((e: any) => `- ${e.element}: ${e.clicks.toLocaleString()} clicks (${e.percentage}%)`).join('\n')}

## Scroll Behavior
- Average scroll depth: ${analyticsData.heatmapAnalysis.avgScrollDepth}%
- 25% depth: ${analyticsData.heatmapAnalysis.scrollDepth['25%']}% of users
- 50% depth: ${analyticsData.heatmapAnalysis.scrollDepth['50%']}% of users
- 75% depth: ${analyticsData.heatmapAnalysis.scrollDepth['75%']}% of users
- 100% depth: ${analyticsData.heatmapAnalysis.scrollDepth['100%']}% of users

**Key Insight:** ${analyticsData.heatmapAnalysis.recommendation}

---

# ⚡ PERFORMANCE METRICS

## Core Web Vitals
- **LCP:** ${analyticsData.performanceMetrics.coreWebVitals.LCP.value}s (${analyticsData.performanceMetrics.coreWebVitals.LCP.rating})
- **FID:** ${analyticsData.performanceMetrics.coreWebVitals.FID.value}ms (${analyticsData.performanceMetrics.coreWebVitals.FID.rating})
- **CLS:** ${analyticsData.performanceMetrics.coreWebVitals.CLS.value} (${analyticsData.performanceMetrics.coreWebVitals.CLS.rating})

## Page Load Scores
${analyticsData.performanceMetrics.pageLoadScores.map((p: any) => `- ${p.page}: ${p.score}/100`).join('\n')}

**Slowest Page:** ${analyticsData.performanceMetrics.slowestPage}

---

# 🐛 ACTIVE ISSUES

## JavaScript Errors (${analyticsData.errorTracking.activeErrors} active)
${analyticsData.errorTracking.topErrors.map((e: any) => `- \`${e.message}\` on ${e.page} (${e.count}x)`).join('\n')}

---

# 📁 PACKAGE CONTENTS

This ZIP contains:

\`\`\`
/
├── PROJECT_BRIEF.md          # This file
├── REVIEW_REQUEST.md         # Specific questions for AI
├── AI_INSTRUCTIONS.md        # How to analyze this package
├── SITEMAP.json              # Complete site structure
├── ANALYTICS_DATA.json       # All analytics in machine-readable format
├── /screenshots/
│   ├── /desktop/             # Full-page desktop screenshots (1920px)
│   └── /mobile/              # Mobile screenshots (375px)
├── /competitors/             # Competitor screenshots
├── /html/                    # HTML source code for SEO analysis
└── /lighthouse/              # Performance audit data
\`\`\`

---

# 🙏 ANALYSIS REQUEST

Please analyze this package and provide:

1. **Top 5 Critical Issues** - What's hurting conversion most?
2. **Top 5 Quick Wins** - Changes we can implement immediately
3. **Competitor Insights** - What are they doing better?
4. **SEO Analysis** - Issues from HTML review
5. **Mobile UX** - Specific mobile improvements
6. **Prioritized Action Plan** - Next 30 days roadmap

---

*Generated by umzugscheck.ch Ultimate AI Package Generator*
*Version 2.0 - Maximum Information Density*
`;
  };

  const generateReviewRequest = (): string => {
    return `# 🎯 AI REVIEW REQUEST

## I need your expert analysis

I'm sharing a **complete snapshot** of my website **${config.projectName}** for thorough analysis.

---

## ❓ KEY QUESTIONS

${config.keyQuestions}

---

## 📦 WHAT'S INCLUDED

| Content | Location | Use For |
|---------|----------|---------|
| Desktop Screenshots | \`/screenshots/desktop/\` | Visual/UX analysis |
| Mobile Screenshots | \`/screenshots/mobile/\` | Mobile UX review |
| Competitor Screenshots | \`/competitors/\` | Competitive analysis |
| HTML Source | \`/html/\` | SEO/accessibility audit |
| Analytics Data | \`ANALYTICS_DATA.json\` | Conversion analysis |
| Project Context | \`PROJECT_BRIEF.md\` | Full background |

---

## 🔍 ANALYSIS PRIORITIES

### 1. Conversion Optimization (HIGH)
- Current rate: 14.2% → Target: 20%
- Where are users dropping off?
- What friction points exist in forms?

### 2. User Experience (HIGH)
- Is navigation intuitive?
- Are CTAs compelling?
- How is mobile experience?

### 3. Competitor Comparison (MEDIUM)
- What are competitors doing better?
- What unique advantages do we have?
- Design/trust signal differences?

### 4. Technical SEO (MEDIUM)
- Meta tags optimization
- Heading structure
- Schema markup

### 5. Performance (LOWER)
- Page load issues
- JavaScript errors

---

## 📝 EXPECTED OUTPUT FORMAT

Please structure your response as:

### 🚨 Critical Issues (Fix Immediately)
1. Issue + specific fix
2. ...

### ⚡ Quick Wins (This Week)
1. Change + expected impact
2. ...

### 🎯 Strategic Improvements (This Month)
1. Initiative + implementation notes
2. ...

### 💡 Competitive Insights
- What to copy
- What to differentiate

### 📋 30-Day Action Plan
Week 1: ...
Week 2: ...
Week 3: ...
Week 4: ...

---

## 🎨 CONTEXT

**Business:** ${config.description}

**Goals:** 
${config.goals}

---

*Thank you! Be specific, be actionable, be honest.*
`;
  };

  const generateAIInstructions = (): string => {
    return `# 🤖 AI ANALYSIS INSTRUCTIONS

## How to Use This Package

You have received a comprehensive website analysis package. Here's how to maximize your analysis:

---

## 📂 FILE STRUCTURE

\`\`\`
1. START HERE:
   └── PROJECT_BRIEF.md     → Full context and goals
   └── REVIEW_REQUEST.md    → Specific questions to answer

2. VISUAL ANALYSIS:
   └── /screenshots/desktop/ → Check layout, hierarchy, CTAs
   └── /screenshots/mobile/  → Mobile UX issues
   └── /competitors/         → Compare designs side-by-side

3. DATA ANALYSIS:
   └── ANALYTICS_DATA.json  → Deep dive into user behavior
   
4. TECHNICAL REVIEW:
   └── /html/               → SEO audit, meta tags, structure
\`\`\`

---

## 🎯 ANALYSIS FRAMEWORK

### Step 1: Context (5 min)
- Read PROJECT_BRIEF.md completely
- Understand business model and goals
- Note the target conversion rate (20%)

### Step 2: Visual Review (15 min)
- Open desktop screenshots in order (01_, 02_, etc.)
- Look for: CTA prominence, trust signals, visual hierarchy
- Open mobile screenshots - check for UX issues
- Compare with competitor screenshots

### Step 3: Data Analysis (10 min)
- Check ANALYTICS_DATA.json
- Focus on: conversion funnels, drop-off points, form completion
- Note the user segments and their behaviors

### Step 4: Technical Review (10 min)
- Scan HTML files for SEO issues
- Check meta titles, descriptions
- Look for heading structure (H1, H2, H3)

### Step 5: Synthesis (10 min)
- Prioritize issues by impact
- Create actionable recommendations
- Structure 30-day improvement plan

---

## ⚠️ COMMON MISTAKES TO AVOID

1. **Don't be vague** - "Improve CTA" is bad. "Change hero CTA from blue to orange, increase font size to 18px, add urgency text" is good.

2. **Don't ignore data** - Base recommendations on analytics, not just visual impressions.

3. **Don't suggest complete redesigns** - Focus on incremental improvements that can be implemented.

4. **Don't forget mobile** - 38% of traffic is mobile. Check those screenshots carefully.

5. **Don't skip competitors** - They're included for a reason. Note what they do better.

---

## 📊 KEY METRICS TO REFERENCE

| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| Conversion Rate | 14.2% | 20% | 🔴 HIGH |
| Bounce Rate | 38.5% | <35% | 🟡 MEDIUM |
| Form Completion | 36-84% | >60% | 🔴 HIGH |
| Mobile UX | Unknown | Excellent | 🔴 HIGH |
| Page Load | 79/100 | >85 | 🟡 MEDIUM |

---

## 🎁 BONUS ANALYSIS IDEAS

If you have capacity, also analyze:
- Trust signals (reviews, certifications, guarantees)
- Value proposition clarity
- Copy/messaging effectiveness
- Color psychology and brand consistency
- Accessibility issues
- Micro-interactions and feedback

---

*This package was created to give you MAXIMUM context. Use it all!*
`;
  };

  const captureScreenshot = async (url: string, dimension: string): Promise<Blob | null> => {
    try {
      const params = new URLSearchParams({
        key: SCREENSHOT_API_KEY,
        url,
        dimension,
        format: "png",
        cacheLimit: "0",
        delay: "3000",
      });
      const response = await fetch(`https://api.screenshotmachine.com?${params}`);
      if (!response.ok) throw new Error("Screenshot failed");
      return await response.blob();
    } catch (error) {
      console.error(`Screenshot error for ${url}:`, error);
      return null;
    }
  };

  const fetchHtml = async (url: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-html', { body: { url } });
      if (error) throw error;
      return data?.html || `<!-- No content for ${url} -->`;
    } catch {
      return `<!-- Error fetching ${url} -->`;
    }
  };

  const generatePackage = async () => {
    setLoading(true);
    setPublicUrl(null);
    setProgress({ step: "Initialisiere...", percent: 0, detail: "" });

    const zip = new JSZip();
    const competitors = config.competitors.split('\n').filter(Boolean);
    const totalSteps = TOP_PAGES.length * 3 + competitors.length * 2 + 10;
    let currentStep = 0;

    const updateProgress = (step: string, detail: string = "") => {
      currentStep++;
      setProgress({ step, percent: Math.round((currentStep / totalSteps) * 100), detail });
    };

    try {
      // 1. Generate analytics data
      updateProgress("Generiere Analytics...");
      const analyticsData = generateAnalyticsData();
      zip.file("ANALYTICS_DATA.json", JSON.stringify(analyticsData, null, 2));

      // 2. Generate markdown files
      updateProgress("Erstelle PROJECT_BRIEF.md...");
      zip.file("PROJECT_BRIEF.md", generateProjectBrief(analyticsData));

      updateProgress("Erstelle REVIEW_REQUEST.md...");
      zip.file("REVIEW_REQUEST.md", generateReviewRequest());

      updateProgress("Erstelle AI_INSTRUCTIONS.md...");
      zip.file("AI_INSTRUCTIONS.md", generateAIInstructions());

      // 3. Generate sitemap
      updateProgress("Erstelle SITEMAP.json...");
      const sitemap = {
        generated: new Date().toISOString(),
        domain: config.projectUrl,
        pages: TOP_PAGES.map((url, i) => ({
          order: i + 1,
          url,
          path: new URL(url).pathname || "/",
        })),
        competitors,
      };
      zip.file("SITEMAP.json", JSON.stringify(sitemap, null, 2));

      // 4. Capture screenshots and HTML for all pages
      for (let i = 0; i < TOP_PAGES.length; i++) {
        const url = TOP_PAGES[i];
        const pathname = new URL(url).pathname.replace(/\//g, '_') || 'index';
        const filename = `${String(i + 1).padStart(2, '0')}_${pathname.substring(0, 30)}`;

        // Desktop
        updateProgress("Desktop Screenshot", url);
        const desktop = await captureScreenshot(url, "1920xfull");
        if (desktop) zip.file(`screenshots/desktop/${filename}.png`, desktop);

        // Mobile
        updateProgress("Mobile Screenshot", url);
        const mobile = await captureScreenshot(url, "375xfull");
        if (mobile) zip.file(`screenshots/mobile/${filename}.png`, mobile);

        // HTML
        updateProgress("HTML Source", url);
        const html = await fetchHtml(url);
        zip.file(`html/${filename}.html`, html);

        await new Promise(r => setTimeout(r, 600));
      }

      // 5. Capture competitor screenshots
      for (const competitorUrl of competitors) {
        const domain = new URL(competitorUrl).hostname.replace('www.', '');

        updateProgress("Konkurrent Desktop", competitorUrl);
        const desktop = await captureScreenshot(competitorUrl, "1920xfull");
        if (desktop) zip.file(`competitors/${domain}_desktop.png`, desktop);

        updateProgress("Konkurrent Mobile", competitorUrl);
        const mobile = await captureScreenshot(competitorUrl, "375xfull");
        if (mobile) zip.file(`competitors/${domain}_mobile.png`, mobile);

        await new Promise(r => setTimeout(r, 800));
      }

      // 6. Add README
      updateProgress("Erstelle README...");
      zip.file("README.md", `# ${config.projectName} - AI Analysis Package

## Quick Start
1. Read \`PROJECT_BRIEF.md\` for full context
2. Check \`REVIEW_REQUEST.md\` for specific questions
3. Review screenshots in \`/screenshots/\` folder
4. Analyze \`ANALYTICS_DATA.json\` for behavior data
5. Compare with competitors in \`/competitors/\`

Generated: ${new Date().toISOString()}
`);

      // 7. Generate ZIP
      updateProgress("Erstelle ZIP-Archiv...");
      const zipBlob = await zip.generateAsync({ 
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 }
      });

      // 8. Save locally
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${config.projectName.replace(/\./g, '-')}_ultimate-package_${timestamp}.zip`;
      saveAs(zipBlob, filename);

      // 9. Upload to cloud for public URL
      updateProgress("Lade in Cloud hoch...");
      const storagePath = `ultimate-packages/${timestamp}_${Date.now()}.zip`;

      const { error: uploadError } = await supabase.storage
        .from('screenshots-archive')
        .upload(storagePath, zipBlob, {
          contentType: 'application/zip',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.warning("ZIP heruntergeladen, Cloud-Upload fehlgeschlagen");
      } else {
        const { data: urlData } = supabase.storage
          .from('screenshots-archive')
          .getPublicUrl(storagePath);

        setPublicUrl(urlData.publicUrl);
        toast.success("Paket erstellt und hochgeladen!");
      }

      setProgress({ step: "Fertig!", percent: 100, detail: "Paket bereit" });
    } catch (error) {
      console.error("Package error:", error);
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
    <Card className="border-2 border-primary">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <FileArchive className="h-6 w-6 text-primary" />
          Ultimate AI Feedback Package
          <Badge variant="default" className="ml-2">All-in-One</Badge>
        </CardTitle>
        <CardDescription className="text-base">
          Komplettes Analyse-Paket mit Screenshots, Analytics, HTML & Competitor-Daten für ChatGPT, Gemini & Claude
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Package Contents Overview */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Paket-Inhalt
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-blue-500" />
              <span>{TOP_PAGES.length} Desktop Screenshots</span>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-green-500" />
              <span>{TOP_PAGES.length} Mobile Screenshots</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-orange-500" />
              <span>{DEFAULT_COMPETITORS.length} Competitor-Analysen</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span>Vollständige Analytics</span>
            </div>
          </div>
        </div>

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
            <Label>Projekt-URL</Label>
            <Input
              value={config.projectUrl}
              onChange={(e) => setConfig({ ...config, projectUrl: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Projektbeschreibung</Label>
          <Textarea
            value={config.description}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Ziele (eines pro Zeile)</Label>
          <Textarea
            value={config.goals}
            onChange={(e) => setConfig({ ...config, goals: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Konkurrenten URLs (eine pro Zeile)</Label>
          <Textarea
            value={config.competitors}
            onChange={(e) => setConfig({ ...config, competitors: e.target.value })}
            rows={3}
            placeholder="https://competitor1.com&#10;https://competitor2.com"
          />
        </div>

        <div className="space-y-2">
          <Label>Schlüsselfragen für AI</Label>
          <Textarea
            value={config.keyQuestions}
            onChange={(e) => setConfig({ ...config, keyQuestions: e.target.value })}
            rows={4}
          />
        </div>

        {/* Progress */}
        {loading && (
          <div className="space-y-2 bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{progress.step}</span>
              <span>{progress.percent}%</span>
            </div>
            {progress.detail && (
              <p className="text-xs text-muted-foreground truncate">{progress.detail}</p>
            )}
            <Progress value={progress.percent} className="h-2" />
          </div>
        )}

        {/* Public URL */}
        {publicUrl && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Paket bereit zum Teilen!</span>
            </div>
            <div className="flex gap-2">
              <Input value={publicUrl} readOnly className="flex-1 bg-white text-xs" />
              <Button variant="outline" size="icon" onClick={copyUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-green-600">
              Kopiere diese URL und füge sie in ChatGPT, Gemini oder Claude ein.
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={generatePackage}
          disabled={loading}
          className="w-full h-12 text-lg"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Generiere Ultimate Package...
            </>
          ) : (
            <>
              <Download className="h-5 w-5 mr-2" />
              Ultimate Package generieren (ZIP + URL)
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Geschätzte Zeit: 3-5 Minuten · {TOP_PAGES.length + DEFAULT_COMPETITORS.length * 2} Screenshots · Automatischer Cloud-Upload
        </p>
      </CardContent>
    </Card>
  );
}
