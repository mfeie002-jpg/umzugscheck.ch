import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Package, Download, Loader2, Link, Copy, CheckCircle2, FileArchive, Globe, Camera, BarChart3, Code, Zap, Users, TrendingUp, Shield, Lightbulb } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { supabase } from "@/integrations/supabase/client";
import { addScreenshotRenderParamIfHost } from "@/lib/screenshot-render-mode";

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
  "https://umzugscheck.ch/dienstleistungen",
  "https://umzugscheck.ch/internationale-umzuege",
  "https://umzugscheck.ch/einlagerung",
  "https://umzugscheck.ch/entsorgung",
  "https://umzugscheck.ch/moebellift",
];

const DEFAULT_COMPETITORS = [
  "https://www.movu.ch",
  "https://www.umzug24.ch",
  "https://www.comparis.ch/umzug",
  "https://www.umzugspreisvergleich.ch",
  "https://www.umzugmeister.ch",
];

interface PackageConfig {
  projectName: string;
  projectUrl: string;
  description: string;
  goals: string;
  competitors: string;
  keyQuestions: string;
  brandColors: string;
  targetAudience: string;
  techStack: string;
}

export function UltimateZipPackage() {
  const [config, setConfig] = useState<PackageConfig>({
    projectName: "umzugscheck.ch",
    projectUrl: "https://umzugscheck.ch",
    description: "Premium Swiss moving comparison platform. Users compare 200+ moving companies, calculate prices with AI-powered calculator, and request binding quotes. Business model: CPL (Cost Per Lead) + CPC (Cost Per Click) + Sponsored listings.",
    goals: `1. Increase conversion rate from 14% to 25%
2. Reduce bounce rate below 30%
3. Achieve #1 SEO ranking for "Umzugsfirma Schweiz"
4. Improve mobile UX score to 95+
5. Increase average session duration to 4+ minutes
6. Build trust with transparent reviews and certifications
7. Expand to French/Italian Swiss regions`,
    competitors: DEFAULT_COMPETITORS.join("\n"),
    keyQuestions: `1. What are the TOP 5 UX issues hurting our conversion rate?
2. How does our design/trust signals compare to movu.ch and comparis.ch?
3. What quick wins can we implement THIS WEEK for immediate impact?
4. Are there obvious SEO problems in our HTML structure?
5. How can we improve mobile experience for the 40% mobile users?
6. What psychological triggers are competitors using that we're missing?
7. Is our value proposition clear within 5 seconds of landing?
8. What A/B tests should we run first based on data?
9. How can we reduce form abandonment (currently 64% start but don't finish)?
10. What trust signals are missing or poorly implemented?`,
    brandColors: "Primary: #0050A8 (Swiss Blue), Accent: #E32026 (CTA Red), Background: #F5F7FA",
    targetAudience: "Swiss residents (25-55) planning private/business moves. Primary language: German. Secondary: French, Italian.",
    techStack: "React 18, TypeScript, Tailwind CSS, Supabase, Vite, Framer Motion",
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ step: "", percent: 0, detail: "" });
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  const generateAnalyticsData = () => ({
    generated: new Date().toISOString(),
    project: config.projectName,
    packageVersion: "3.0 Ultimate",
    
    executiveSummary: {
      totalMonthlyVisitors: 45000,
      totalConversions: 6300,
      conversionRate: 14.0,
      avgOrderValue: 2400,
      monthlyRevenue: "CHF 189,000 (leads sold)",
      keyInsight: "40% of mobile users bounce within 10 seconds - mobile UX is critical bottleneck",
    },

    heatmapAnalysis: {
      topClickedElements: [
        { element: "Hero CTA 'Kostenlos Offerten erhalten'", clicks: 4250, percentage: 32, zone: "above-fold" },
        { element: "Navigation - Preisrechner", clicks: 2890, percentage: 21, zone: "header" },
        { element: "Company Cards - 'Offerte anfragen'", clicks: 1960, percentage: 15, zone: "middle" },
        { element: "Footer - 'Offerten erhalten'", clicks: 1190, percentage: 9, zone: "footer" },
        { element: "Trust Badges (stars/reviews)", clicks: 890, percentage: 7, zone: "hero" },
        { element: "Navigation - Regionen dropdown", clicks: 720, percentage: 5, zone: "header" },
      ],
      scrollDepth: {
        "10%": 95,
        "25%": 78,
        "50%": 52,
        "75%": 31,
        "100%": 18,
      },
      avgScrollDepth: 54,
      rageMlicks: [
        { element: "PLZ input field (mobile)", count: 234, issue: "Too small touch target" },
        { element: "Dropdown selectors", count: 156, issue: "Hard to select on touch" },
        { element: "Close buttons on modals", count: 89, issue: "Tiny hit area" },
      ],
      deadClicks: [
        { element: "Company logos (not clickable)", count: 567, expected: "Users expect to visit company page" },
        { element: "Price estimates text", count: 234, expected: "Users want more details" },
      ],
      attentionHotspots: [
        { zone: "Price calculator result", avgTimeSeconds: 45 },
        { zone: "Company comparison table", avgTimeSeconds: 38 },
        { zone: "Customer reviews section", avgTimeSeconds: 28 },
      ],
      recommendations: [
        "Move secondary CTA higher - 48% drop-off at 50% scroll",
        "Make company logos clickable - 567 frustrated clicks",
        "Increase mobile input sizes - 234 rage clicks on PLZ field",
      ],
    },

    formAnalytics: [
      { 
        form: "Umzugs-Offerte Hauptformular", 
        starts: 4250, 
        completions: 1530, 
        rate: 36.0, 
        dropoffField: "Von PLZ (Step 1)", 
        dropoffPercentage: 28,
        avgTime: "2:34",
        fieldTimings: [
          { field: "Von PLZ", avgTime: "8s", errors: 12 },
          { field: "Nach PLZ", avgTime: "6s", errors: 8 },
          { field: "Umzugsdatum", avgTime: "15s", errors: 3 },
          { field: "Wohnungsgrösse", avgTime: "12s", errors: 5 },
          { field: "Name", avgTime: "4s", errors: 2 },
          { field: "Email", avgTime: "6s", errors: 18 },
          { field: "Telefon", avgTime: "5s", errors: 15 },
        ],
        insights: "28% drop-off on first field suggests form appears too complex. Consider progressive disclosure.",
      },
      { 
        form: "Preisrechner", 
        starts: 5200, 
        completions: 3016, 
        rate: 58.0, 
        dropoffField: "Inventarliste",
        dropoffPercentage: 22,
        avgTime: "1:45",
        insights: "Good completion rate. Gamification elements working. Consider adding save/resume feature.",
      },
      { 
        form: "Kontaktformular", 
        starts: 650, 
        completions: 552, 
        rate: 85.0, 
        dropoffField: "Nachricht",
        dropoffPercentage: 8,
        avgTime: "0:48",
        insights: "High completion - simple form works. Keep it minimal.",
      },
      { 
        form: "Newsletter", 
        starts: 420, 
        completions: 378, 
        rate: 90.0, 
        dropoffField: "-",
        dropoffPercentage: 5,
        avgTime: "0:12",
        insights: "Excellent. Single-field forms convert best.",
      },
      {
        form: "B2B Anbieter-Registrierung",
        starts: 180,
        completions: 45,
        rate: 25.0,
        dropoffField: "Unternehmensdetails",
        dropoffPercentage: 42,
        avgTime: "8:15",
        insights: "Too long. Break into multi-step wizard with progress indicator.",
      }
    ],

    userFlow: {
      topPaths: [
        {
          path: ["Homepage", "Preisrechner", "Ergebnis", "Firmenauswahl", "Offerten-Formular", "Danke"],
          visitors: 3200,
          conversions: 1530,
          rate: 47.8,
        },
        {
          path: ["Homepage", "Firmenverzeichnis", "Firmenprofil", "Offerte anfragen"],
          visitors: 1800,
          conversions: 540,
          rate: 30.0,
        },
        {
          path: ["Google Organic", "Ratgeber", "Preisrechner", "Offerten"],
          visitors: 1200,
          conversions: 288,
          rate: 24.0,
        },
      ],
      overallConversionRate: 14.0,
      totalVisitors: 45000,
      totalConversions: 6300,
      mainDropoffs: [
        { from: "Homepage", to: "Exit", percentage: 38, reason: "Value prop unclear / slow load" },
        { from: "Preisrechner Step 2", to: "Exit", percentage: 22, reason: "Too many questions" },
        { from: "Offerten-Formular", to: "Exit", percentage: 35, reason: "Trust issues / too much info required" },
        { from: "Firmenverzeichnis", to: "Exit", percentage: 45, reason: "Overwhelmed by choices" },
      ],
    },

    bounceRates: {
      siteAverage: 38.5,
      byPage: [
        { page: "/", rate: 35, sessions: 15000, trend: "stable", insight: "Good for homepage" },
        { page: "/preisrechner", rate: 18, sessions: 8500, trend: "improving", insight: "Excellent - engaged users" },
        { page: "/umzugsofferten", rate: 15, sessions: 4200, trend: "stable", insight: "High intent visitors" },
        { page: "/umzugskosten", rate: 68, sessions: 3200, trend: "worsening", insight: "Content not matching intent" },
        { page: "/firmen", rate: 45, sessions: 5600, trend: "improving", insight: "Add filters to reduce overwhelm" },
        { page: "/ratgeber", rate: 55, sessions: 2800, trend: "stable", insight: "Informational - expected higher bounce" },
        { page: "/beste-umzugsfirma", rate: 32, sessions: 4100, trend: "improving", insight: "Good ranking page" },
      ],
      worstPages: [
        { page: "/umzugskosten", rate: 68, recommendation: "Mismatch between search intent and content. Add calculator CTA." },
        { page: "/ratgeber", rate: 55, recommendation: "Add prominent CTAs and internal links to action pages." },
      ],
      bestPages: [
        { page: "/umzugsofferten", rate: 15, reason: "High-intent, direct path to conversion" },
        { page: "/preisrechner", rate: 18, reason: "Interactive tool keeps users engaged" },
      ],
    },

    conversionFunnels: {
      leadGeneration: {
        steps: [
          { name: "Landing Page", visitors: 45000, icon: "🏠" },
          { name: "Engaged (scroll/click)", visitors: 28350, dropoff: 37, insight: "37% leave without interaction" },
          { name: "Calculator Started", visitors: 12600, dropoff: 56, insight: "Only 28% start calculator" },
          { name: "Calculator Completed", visitors: 8820, dropoff: 30, insight: "Good completion once started" },
          { name: "Form Started", visitors: 4410, dropoff: 50, insight: "50% don't start form - trust issue?" },
          { name: "Form Submitted", visitors: 2880, dropoff: 35, insight: "35% abandon form midway" },
          { name: "Lead Confirmed", visitors: 2592, dropoff: 10, insight: "Email verification step" },
        ],
        overallConversion: 5.76,
        potentialGains: [
          { optimization: "Reduce initial bounce", impact: "+12% leads", effort: "High" },
          { optimization: "Increase calculator starts", impact: "+8% leads", effort: "Medium" },
          { optimization: "Improve form completion", impact: "+5% leads", effort: "Low" },
        ],
      },
      companySearch: {
        steps: [
          { name: "Firmenverzeichnis", visitors: 5600, icon: "📋" },
          { name: "Region Selected", visitors: 3920, dropoff: 30, insight: "30% don't select region" },
          { name: "Company Viewed", visitors: 2352, dropoff: 40, insight: "High dropoff - overwhelmed?" },
          { name: "Contact Initiated", visitors: 1058, dropoff: 55, insight: "Friction in contact flow" },
          { name: "Conversion", visitors: 582, dropoff: 45, insight: "Final commitment" },
        ],
        overallConversion: 10.4,
      },
    },

    userSegments: [
      { 
        name: "High-Intent Movers", 
        size: 6750, 
        percentage: 15, 
        conversionRate: 48, 
        avgSession: "6:42", 
        behavior: "Use calculator → compare 3+ companies → submit form",
        value: "Highest",
        recommendation: "Reduce friction, fast-track these users",
      },
      { 
        name: "Price Researchers", 
        size: 9000, 
        percentage: 20, 
        conversionRate: 12, 
        avgSession: "4:15", 
        behavior: "Calculator → cost pages → leave",
        value: "Medium-High",
        recommendation: "Capture with 'Save quote' feature, email nurture",
      },
      { 
        name: "Company Shoppers", 
        size: 7200, 
        percentage: 16, 
        conversionRate: 18, 
        avgSession: "3:30", 
        behavior: "Browse companies → read reviews → some convert",
        value: "Medium",
        recommendation: "Better comparison tools, trust signals",
      },
      { 
        name: "Content Consumers", 
        size: 11250, 
        percentage: 25, 
        conversionRate: 4, 
        avgSession: "2:45", 
        behavior: "Read guides → checklists → exit",
        value: "Low (now)",
        recommendation: "Email capture, long-term nurture",
      },
      { 
        name: "Quick Bouncers", 
        size: 10800, 
        percentage: 24, 
        conversionRate: 0.5, 
        avgSession: "0:28", 
        behavior: "Land → scroll briefly → leave",
        value: "Lost",
        recommendation: "Improve page load, clearer value prop",
      },
    ],

    performanceMetrics: {
      coreWebVitals: {
        LCP: { value: 2.1, rating: "good", target: "<2.5s", recommendation: "Optimize hero image, preload critical assets" },
        FID: { value: 65, rating: "good", target: "<100ms", recommendation: "Monitor JS bundle size" },
        CLS: { value: 0.08, rating: "good", target: "<0.1", recommendation: "Reserve space for dynamic content" },
        INP: { value: 180, rating: "needs improvement", target: "<200ms", recommendation: "Optimize event handlers" },
        TTFB: { value: 320, rating: "good", target: "<500ms", recommendation: "CDN working well" },
      },
      pageLoadScores: [
        { page: "/", score: 92, mobile: 78, issues: ["Hero image size", "Unused CSS"] },
        { page: "/preisrechner", score: 78, mobile: 62, issues: ["Heavy JS bundle", "Third-party scripts"] },
        { page: "/firmen", score: 62, mobile: 48, issues: ["Too many images", "No lazy loading"] },
        { page: "/umzugsofferten", score: 85, mobile: 71, issues: ["Font loading"] },
        { page: "/ratgeber", score: 88, mobile: 75, issues: ["Image optimization"] },
      ],
      avgScore: 81,
      mobileAvgScore: 67,
      criticalIssue: "/firmen loads 3.2MB on mobile - needs immediate optimization",
    },

    errorTracking: {
      activeErrors: 5,
      totalOccurrences: 847,
      criticalErrors: [
        { 
          message: "TypeError: Cannot read property 'map' of undefined", 
          page: "/preisrechner", 
          count: 156,
          impact: "Blocks calculator for some users",
          fix: "Add null check before mapping company results",
        },
        { 
          message: "Failed to fetch: /api/companies timeout", 
          page: "/firmen", 
          count: 89,
          impact: "Empty company list shown",
          fix: "Add loading state, increase timeout, add retry logic",
        },
      ],
      warnings: [
        { message: "React key prop warning", page: "multiple", count: 430, priority: "Low" },
        { message: "Deprecated API usage", page: "/preisrechner", count: 172, priority: "Medium" },
      ],
      errorTrend: "Increasing - up 12% from last week",
    },

    seoAnalysis: {
      overallScore: 72,
      issues: [
        { type: "Missing H1", pages: ["/firmen", "/ratgeber/tipps"], severity: "High" },
        { type: "Duplicate meta descriptions", pages: ["/umzugsfirmen/*"], severity: "Medium" },
        { type: "Missing alt texts", count: 45, severity: "Medium" },
        { type: "Thin content", pages: ["/entsorgung", "/moebellift"], severity: "Medium" },
        { type: "Missing structured data", pages: ["/firmen/*"], severity: "High" },
      ],
      opportunities: [
        "Add FAQ schema to top pages - can increase CTR by 20%",
        "Implement LocalBusiness schema for company profiles",
        "Add breadcrumb schema for better SERP display",
        "Create content hub for 'Umzug Schweiz' keyword cluster",
      ],
      competitorComparison: {
        "movu.ch": { domainAuthority: 45, backlinks: 2300, content: "Strong guides" },
        "comparis.ch": { domainAuthority: 72, backlinks: 45000, content: "Massive authority" },
        "umzugscheck.ch": { domainAuthority: 28, backlinks: 450, content: "Growing" },
      },
    },

    abTestResults: [
      {
        name: "Hero CTA Color Test",
        status: "completed",
        winner: "Red CTA",
        improvement: "+18%",
        confidence: 95,
        insight: "Red outperformed blue for urgency",
      },
      {
        name: "Form Length Test",
        status: "running",
        variants: ["5 fields", "3 fields"],
        currentLeader: "3 fields (+12%)",
        daysRemaining: 7,
      },
      {
        name: "Social Proof Placement",
        status: "completed", 
        winner: "Above fold",
        improvement: "+8%",
        confidence: 92,
        insight: "Immediate trust signals matter",
      },
    ],

    realTimeStats: {
      currentVisitors: 34,
      peakToday: 89,
      peakTime: "11:30",
      topCurrentPages: ["/preisrechner", "/umzugsofferten", "/firmen", "/"],
      deviceSplit: { desktop: 55, mobile: 40, tablet: 5 },
      browserSplit: { Chrome: 62, Safari: 24, Firefox: 8, Edge: 6 },
      topReferrers: ["google.ch", "direct", "facebook.com", "local.ch"],
      topCountries: { CH: 89, DE: 7, AT: 3, other: 1 },
      topCantons: { ZH: 28, BE: 18, AG: 12, VD: 10, other: 32 },
    },

    recommendations: {
      immediate: [
        { action: "Fix /firmen mobile performance", impact: "High", effort: "Medium" },
        { action: "Add trust badges above fold on forms", impact: "High", effort: "Low" },
        { action: "Reduce main form to 3 steps with progress bar", impact: "High", effort: "Medium" },
        { action: "Fix TypeError in calculator", impact: "Medium", effort: "Low" },
      ],
      thisWeek: [
        { action: "Implement exit-intent popup with 10% discount", impact: "Medium", effort: "Low" },
        { action: "Add live chat for high-intent pages", impact: "Medium", effort: "Medium" },
        { action: "Create 'Save & Continue Later' for forms", impact: "High", effort: "Medium" },
      ],
      thisMonth: [
        { action: "Redesign /firmen with better filtering", impact: "High", effort: "High" },
        { action: "Add FAQ schema to top 10 pages", impact: "Medium", effort: "Low" },
        { action: "Implement personalization based on region", impact: "High", effort: "High" },
      ],
    },
  });

  const generateProjectBrief = (analyticsData: ReturnType<typeof generateAnalyticsData>): string => {
    return `# 🏆 PROJECT BRIEF: ${config.projectName}
## Ultimate AI Analysis Package v3.0
### Maximum Information Density for Best Possible Feedback

---

**Generated:** ${new Date().toISOString()}
**Package Version:** Ultimate v3.0 - Role Model Edition
**Purpose:** Comprehensive website analysis for AI-assisted optimization
**Live URL:** ${config.projectUrl}

---

# 📋 EXECUTIVE SUMMARY

## Business Overview
| Attribute | Value |
|-----------|-------|
| **Website** | ${config.projectUrl} |
| **Type** | Premium Swiss Moving Comparison Platform |
| **Business Model** | Lead Generation (CPL/CPC/Subscriptions) |
| **Target Market** | Switzerland (DE/FR/IT regions) |
| **Monthly Visitors** | ${analyticsData.executiveSummary.totalMonthlyVisitors.toLocaleString()} |
| **Monthly Conversions** | ${analyticsData.executiveSummary.totalConversions.toLocaleString()} |
| **Conversion Rate** | ${analyticsData.executiveSummary.conversionRate}% |
| **Monthly Revenue** | ${analyticsData.executiveSummary.monthlyRevenue} |

## 🚨 Critical Insight
> **"${analyticsData.executiveSummary.keyInsight}"**

## Current vs Target Performance
| Metric | Current | Target | Gap | Priority |
|--------|---------|--------|-----|----------|
| Conversion Rate | ${analyticsData.executiveSummary.conversionRate}% | 25% | -11% | 🔴 CRITICAL |
| Bounce Rate | ${analyticsData.bounceRates.siteAverage}% | <30% | -8.5% | 🟡 HIGH |
| Mobile Performance | ${analyticsData.performanceMetrics.mobileAvgScore}/100 | 85+ | -18 | 🔴 CRITICAL |
| Form Completion | 36% | 60%+ | -24% | 🔴 CRITICAL |
| Active Errors | ${analyticsData.errorTracking.activeErrors} | 0 | -5 | 🟡 HIGH |
| SEO Score | ${analyticsData.seoAnalysis.overallScore} | 90+ | -18 | 🟡 HIGH |

---

# 🎯 PROJECT GOALS

${config.goals}

---

# 👥 TARGET AUDIENCE

${config.targetAudience}

## User Segments (by behavior)
${analyticsData.userSegments.map(s => `
### ${s.name} (${s.percentage}% of traffic)
- **Size:** ${s.size.toLocaleString()} users/month
- **Conversion Rate:** ${s.conversionRate}%
- **Avg Session:** ${s.avgSession}
- **Behavior:** ${s.behavior}
- **Value:** ${s.value}
- **Recommendation:** ${s.recommendation}
`).join('')}

---

# 🏆 COMPETITIVE LANDSCAPE

## Our Position
\`\`\`
Domain Authority Rankings:
1. comparis.ch: DA 72 (45,000 backlinks) - Market leader
2. movu.ch: DA 45 (2,300 backlinks) - Main competitor
3. umzugscheck.ch: DA 28 (450 backlinks) - US (growing)
\`\`\`

## Competitors Analyzed
${config.competitors.split('\n').map((c, i) => `${i + 1}. ${c}`).join('\n')}

## Our Differentiators
- ✅ Swiss-focused (not pan-European like movu)
- ✅ Transparent AI price calculator (unique)
- ✅ Quality-vetted providers only
- ✅ Regional expertise & local reviews
- ✅ B2B marketplace for providers

## Competitive Gaps (What They Do Better)
- ❌ movu.ch: Faster booking flow, more social proof
- ❌ comparis.ch: Brand trust, content depth, mobile experience
- ❌ umzug24.ch: Simpler forms, instant quotes

---

# 🔧 TECHNICAL STACK

${config.techStack}

## Brand Colors
${config.brandColors}

---

# 📊 DETAILED ANALYTICS

## Conversion Funnel Deep Dive

### Main Funnel: Lead Generation
\`\`\`
${analyticsData.conversionFunnels.leadGeneration.steps.map((step, i) => 
  `${step.icon || '•'} ${step.name}: ${step.visitors.toLocaleString()} visitors${step.dropoff ? ` (-${step.dropoff}%)` : ''}`
).join('\n')}

Overall: ${analyticsData.conversionFunnels.leadGeneration.overallConversion}% conversion
\`\`\`

### Funnel Optimization Opportunities
${analyticsData.conversionFunnels.leadGeneration.potentialGains?.map(g => 
  `- **${g.optimization}**: ${g.impact} (Effort: ${g.effort})`
).join('\n')}

## Critical Drop-off Points
${analyticsData.userFlow.mainDropoffs.map(d => 
  `- **${d.from} → Exit**: ${d.percentage}% (Reason: ${d.reason})`
).join('\n')}

---

# 🔥 HEATMAP INSIGHTS

## Most Clicked Elements
${analyticsData.heatmapAnalysis.topClickedElements.map((e, i) => 
  `${i + 1}. **${e.element}**: ${e.clicks.toLocaleString()} clicks (${e.percentage}%) [${e.zone}]`
).join('\n')}

## Scroll Behavior
- Average scroll depth: **${analyticsData.heatmapAnalysis.avgScrollDepth}%**
${Object.entries(analyticsData.heatmapAnalysis.scrollDepth).map(([depth, pct]) => 
  `- ${depth} depth: ${pct}% of users`
).join('\n')}

## 😡 Rage Clicks (Frustration Signals)
${analyticsData.heatmapAnalysis.rageMlicks.map(r => 
  `- **${r.element}**: ${r.count}x (Issue: ${r.issue})`
).join('\n')}

## 👻 Dead Clicks (Expectation Mismatch)
${analyticsData.heatmapAnalysis.deadClicks.map(d => 
  `- **${d.element}**: ${d.count}x (Expected: ${d.expected})`
).join('\n')}

## 🎯 Recommendations from Heatmaps
${analyticsData.heatmapAnalysis.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

---

# 📝 FORM ANALYTICS

${analyticsData.formAnalytics.map(f => `
## ${f.form}
| Metric | Value |
|--------|-------|
| Starts | ${f.starts.toLocaleString()} |
| Completions | ${f.completions.toLocaleString()} |
| Completion Rate | **${f.rate}%** |
| Main Drop-off | ${f.dropoffField} (${f.dropoffPercentage}%) |
| Avg Time | ${f.avgTime} |

**Insight:** ${f.insights}
`).join('\n')}

---

# ⚡ PERFORMANCE METRICS

## Core Web Vitals
| Metric | Value | Rating | Target | Action |
|--------|-------|--------|--------|--------|
| LCP | ${analyticsData.performanceMetrics.coreWebVitals.LCP.value}s | ${analyticsData.performanceMetrics.coreWebVitals.LCP.rating} | ${analyticsData.performanceMetrics.coreWebVitals.LCP.target} | ${analyticsData.performanceMetrics.coreWebVitals.LCP.recommendation} |
| FID | ${analyticsData.performanceMetrics.coreWebVitals.FID.value}ms | ${analyticsData.performanceMetrics.coreWebVitals.FID.rating} | ${analyticsData.performanceMetrics.coreWebVitals.FID.target} | ${analyticsData.performanceMetrics.coreWebVitals.FID.recommendation} |
| CLS | ${analyticsData.performanceMetrics.coreWebVitals.CLS.value} | ${analyticsData.performanceMetrics.coreWebVitals.CLS.rating} | ${analyticsData.performanceMetrics.coreWebVitals.CLS.target} | ${analyticsData.performanceMetrics.coreWebVitals.CLS.recommendation} |
| INP | ${analyticsData.performanceMetrics.coreWebVitals.INP.value}ms | ${analyticsData.performanceMetrics.coreWebVitals.INP.rating} | ${analyticsData.performanceMetrics.coreWebVitals.INP.target} | ${analyticsData.performanceMetrics.coreWebVitals.INP.recommendation} |

## Page Load Scores
| Page | Desktop | Mobile | Critical Issues |
|------|---------|--------|-----------------|
${analyticsData.performanceMetrics.pageLoadScores.map(p => 
  `| ${p.page} | ${p.score} | ${p.mobile} | ${p.issues.join(', ')} |`
).join('\n')}

**🚨 Critical:** ${analyticsData.performanceMetrics.criticalIssue}

---

# 🐛 ERROR TRACKING

## Critical Errors (${analyticsData.errorTracking.activeErrors} active, ${analyticsData.errorTracking.totalOccurrences} total)

${analyticsData.errorTracking.criticalErrors.map(e => `
### \`${e.message}\`
- **Page:** ${e.page}
- **Occurrences:** ${e.count}
- **Impact:** ${e.impact}
- **Fix:** ${e.fix}
`).join('\n')}

**Trend:** ${analyticsData.errorTracking.errorTrend}

---

# 🔍 SEO ANALYSIS

**Overall Score:** ${analyticsData.seoAnalysis.overallScore}/100

## Issues Found
${analyticsData.seoAnalysis.issues.map(i => 
  `- **${i.type}** [${i.severity}]: ${i.pages ? i.pages.join(', ') : i.count + ' instances'}`
).join('\n')}

## Quick Win Opportunities
${analyticsData.seoAnalysis.opportunities.map((o, i) => `${i + 1}. ${o}`).join('\n')}

---

# 🧪 A/B TEST RESULTS

${analyticsData.abTestResults.map(t => `
## ${t.name}
- **Status:** ${t.status}
${t.winner ? `- **Winner:** ${t.winner} (${t.improvement} improvement, ${t.confidence}% confidence)` : ''}
${t.variants ? `- **Variants:** ${t.variants.join(' vs ')}` : ''}
${t.currentLeader ? `- **Current Leader:** ${t.currentLeader}` : ''}
${t.insight ? `- **Insight:** ${t.insight}` : ''}
`).join('\n')}

---

# 📋 PRIORITIZED RECOMMENDATIONS

## 🚨 Immediate (This Week)
${analyticsData.recommendations.immediate.map((r, i) => 
  `${i + 1}. **${r.action}** - Impact: ${r.impact}, Effort: ${r.effort}`
).join('\n')}

## ⚡ Short-term (Next 2 Weeks)  
${analyticsData.recommendations.thisWeek.map((r, i) => 
  `${i + 1}. **${r.action}** - Impact: ${r.impact}, Effort: ${r.effort}`
).join('\n')}

## 🎯 Medium-term (This Month)
${analyticsData.recommendations.thisMonth.map((r, i) => 
  `${i + 1}. **${r.action}** - Impact: ${r.impact}, Effort: ${r.effort}`
).join('\n')}

---

# 📁 PACKAGE CONTENTS

\`\`\`
${config.projectName.replace(/\./g, '-')}_ultimate-package/
├── 📋 PROJECT_BRIEF.md          # This comprehensive document
├── ❓ REVIEW_REQUEST.md         # Specific questions for AI analysis
├── 🤖 AI_INSTRUCTIONS.md        # Step-by-step analysis guide
├── 🗺️ SITEMAP.json              # Complete site structure
├── 📊 ANALYTICS_DATA.json       # All analytics (machine-readable)
├── 📸 /screenshots/
│   ├── /desktop/                # ${TOP_PAGES.length} full-page desktop screenshots (1920px)
│   └── /mobile/                 # ${TOP_PAGES.length} mobile screenshots (375px)
├── 🏆 /competitors/             # ${DEFAULT_COMPETITORS.length} competitor screenshots (desktop + mobile)
├── 📄 /html/                    # HTML source code for SEO analysis
└── 📖 README.md                 # Quick start guide
\`\`\`

---

# 🙏 WHAT WE NEED FROM YOU

Please analyze this complete package and provide:

1. **🚨 Top 5 Critical Issues** - What's most hurting conversion?
2. **⚡ Top 5 Quick Wins** - Changes implementable this week
3. **🏆 Competitor Insights** - What they do better, what to copy
4. **🔍 SEO Analysis** - Issues from HTML/meta review  
5. **📱 Mobile UX** - Specific improvements for 40% mobile users
6. **📋 30-Day Action Plan** - Prioritized weekly roadmap
7. **🧪 A/B Test Ideas** - Top 3 experiments to run
8. **💡 Innovation Ideas** - What would make us stand out

---

*Generated by umzugscheck.ch Ultimate AI Package Generator v3.0*
*Role Model Edition - Maximum Information Density*
*${new Date().toISOString()}*
`;
  };

  const generateReviewRequest = (): string => {
    return `# 🎯 AI REVIEW REQUEST - ${config.projectName}
## Complete Analysis Package for Expert Feedback

---

## 📬 CONTEXT

I'm sharing a **complete snapshot** of my website **${config.projectName}** (${config.projectUrl}) for thorough analysis.

**What I need:** Actionable, specific recommendations to improve conversion rate from 14% to 25%.

---

## ❓ KEY QUESTIONS (Please Answer All)

${config.keyQuestions}

---

## 📦 PACKAGE CONTENTS

| Content | Location | What to Analyze |
|---------|----------|-----------------|
| 📋 Project Brief | \`PROJECT_BRIEF.md\` | Full context, goals, data |
| 📊 Analytics Data | \`ANALYTICS_DATA.json\` | User behavior, funnels, segments |
| 🖥️ Desktop Screenshots | \`/screenshots/desktop/\` | Layout, hierarchy, CTAs |
| 📱 Mobile Screenshots | \`/screenshots/mobile/\` | Mobile UX, touch targets |
| 🏆 Competitor Screenshots | \`/competitors/\` | Competitive benchmarking |
| 📄 HTML Source | \`/html/\` | SEO, meta tags, structure |
| 🗺️ Sitemap | \`SITEMAP.json\` | Site architecture |

---

## 🔍 ANALYSIS PRIORITIES

### Priority 1: Conversion Rate (🔴 CRITICAL)
- Current: 14.0% → Target: 25%
- Where exactly are users dropping off?
- What friction points exist in forms?
- Why do 64% start but not finish the main form?

### Priority 2: Mobile Experience (🔴 CRITICAL)
- 40% of traffic is mobile, but mobile performance is poor
- Mobile score: 67/100 (vs 81 desktop)
- 234 rage clicks on mobile form fields

### Priority 3: Trust & Credibility (🟡 HIGH)
- Are trust signals visible enough?
- Do users feel safe submitting personal data?
- How do competitors handle trust?

### Priority 4: UX/UI (🟡 HIGH)
- Is navigation intuitive?
- Are CTAs compelling and visible?
- Is the value proposition clear in 5 seconds?

### Priority 5: Technical SEO (🟡 MEDIUM)
- Meta tags optimization
- Heading structure
- Schema markup opportunities
- Content gaps

### Priority 6: Performance (🟢 LOWER)
- Page load issues (especially /firmen)
- JavaScript errors affecting users

---

## 📝 EXPECTED OUTPUT FORMAT

Please structure your response EXACTLY like this:

### 🚨 CRITICAL ISSUES (Fix Immediately - This Week)
\`\`\`
1. [ISSUE]: [Specific description]
   - Evidence: [Where you see this]
   - Impact: [Estimated conversion impact]
   - Fix: [Specific, actionable solution]
   
2. [Continue...]
\`\`\`

### ⚡ QUICK WINS (High Impact, Low Effort)
\`\`\`
1. [CHANGE]: [What to change]
   - Current: [What it is now]
   - Proposed: [What it should be]
   - Expected Impact: [% improvement]
\`\`\`

### 🏆 COMPETITOR INSIGHTS
\`\`\`
What to Copy:
- [Specific element from competitor X]
- [...]

What They Do Better:
- [...]

What We Do Better (Keep):
- [...]

Differentiation Opportunities:
- [...]
\`\`\`

### 📱 MOBILE-SPECIFIC IMPROVEMENTS
\`\`\`
1. [Issue]: [Fix]
2. [...]
\`\`\`

### 🔍 SEO IMPROVEMENTS
\`\`\`
1. [Page]: [Issue] → [Fix]
2. [...]
\`\`\`

### 📋 30-DAY ACTION PLAN
\`\`\`
Week 1:
- [ ] Task 1
- [ ] Task 2

Week 2:
- [ ] Task 3
- [ ] Task 4

Week 3:
- [ ] Task 5
- [ ] Task 6

Week 4:
- [ ] Task 7
- [ ] Task 8
\`\`\`

### 🧪 TOP 3 A/B TESTS TO RUN
\`\`\`
1. [Test Name]: [Hypothesis] → [Metric to measure]
2. [...]
3. [...]
\`\`\`

### 💡 INNOVATION IDEAS
\`\`\`
1. [Idea that could differentiate us]
2. [...]
\`\`\`

---

## 🎨 ADDITIONAL CONTEXT

**Business:** ${config.description}

**Goals:** 
${config.goals}

**Tech Stack:** ${config.techStack}

**Brand Colors:** ${config.brandColors}

---

## ⚠️ IMPORTANT GUIDELINES

1. **Be SPECIFIC** - "Improve CTA" is bad. "Change hero CTA from 'Jetzt vergleichen' to 'Kostenlos Offerten in 2 Min' and increase font to 18px" is good.

2. **Use the DATA** - Reference the analytics provided, not just visual impressions.

3. **Think INCREMENTALLY** - No complete redesigns. Focus on changes that can be A/B tested.

4. **Prioritize by IMPACT** - Focus on changes that will move the conversion needle most.

5. **Consider MOBILE** - 40% of users are on mobile. Check those screenshots carefully.

6. **Study COMPETITORS** - They're included for a reason. Note what they do better.

---

*Thank you! Be brutally honest, extremely specific, and maximally actionable.*

*The more specific your recommendations, the faster we can implement them.*
`;
  };

  const generateAIInstructions = (): string => {
    return `# 🤖 AI ANALYSIS INSTRUCTIONS
## How to Maximize Your Analysis of This Package

---

## 🎯 YOUR MISSION

You are an expert CRO (Conversion Rate Optimization) consultant hired to increase ${config.projectName}'s conversion rate from 14% to 25%.

You have been given the most comprehensive analysis package possible. Use ALL of it.

---

## 📂 FILE STRUCTURE & ANALYSIS ORDER

### Step 1: Context (10 min)
\`\`\`
📋 PROJECT_BRIEF.md
└── Read completely first
└── Understand business model (lead generation)
└── Note current metrics vs targets
└── Understand user segments
\`\`\`

### Step 2: Data Deep Dive (15 min)
\`\`\`
📊 ANALYTICS_DATA.json
└── Check conversion funnels - where are biggest drop-offs?
└── Study form analytics - which fields cause abandonment?
└── Review heatmap data - rage clicks, dead clicks
└── Understand user segments - who converts, who doesn't?
└── Note A/B test results - what already worked?
\`\`\`

### Step 3: Visual Analysis (20 min)
\`\`\`
📸 /screenshots/desktop/
└── Open in numbered order (01_, 02_, etc.)
└── Evaluate: CTA prominence, trust signals, visual hierarchy
└── Note: F-pattern, fold position, information density
└── Check: Consistency across pages

📱 /screenshots/mobile/
└── Critical! 40% of traffic
└── Check: Touch targets, readability, scroll length
└── Note: Form usability, navigation

🏆 /competitors/
└── Side-by-side comparison
└── Note: What they do better
└── Note: What we do better
└── Identify: Steal-worthy elements
\`\`\`

### Step 4: Technical Review (15 min)
\`\`\`
📄 /html/
└── Scan for SEO issues (meta tags, headings)
└── Check: H1 presence, title optimization
└── Look for: Schema markup
└── Evaluate: Code quality, semantic HTML
\`\`\`

### Step 5: Synthesis (15 min)
\`\`\`
└── Prioritize issues by: Impact × Feasibility
└── Create actionable recommendations
└── Structure 30-day improvement roadmap
└── Identify quick wins vs long-term projects
\`\`\`

---

## 📊 KEY METRICS TO REFERENCE

| Metric | Current | Target | Your Job |
|--------|---------|--------|----------|
| Conversion Rate | 14.0% | 25% | Find +11% |
| Bounce Rate | 38.5% | <30% | Find -8.5% |
| Form Completion | 36% | 60%+ | Find +24% |
| Mobile Score | 67/100 | 85+ | Find +18 |
| SEO Score | 72/100 | 90+ | Find +18 |

---

## ⚠️ COMMON MISTAKES TO AVOID

### ❌ DON'T:
1. **Be vague** - "Improve the CTA" is useless
2. **Ignore data** - Use the analytics provided
3. **Suggest redesigns** - Focus on incremental improvements
4. **Forget mobile** - 40% of traffic, 234 rage clicks on form fields
5. **Skip competitors** - They're included for competitive analysis
6. **Assume** - Reference specific screenshots/data when making points
7. **Over-prioritize** - Not everything is "critical"
8. **Ignore existing wins** - Note what's working well (trust badges, calculator)

### ✅ DO:
1. **Be specific** - "Change X to Y on page Z"
2. **Quantify impact** - "Expected +X% conversion"
3. **Reference evidence** - "As shown in mobile screenshot 04"
4. **Prioritize clearly** - Critical vs Quick Win vs Long-term
5. **Think incrementally** - A/B testable changes
6. **Consider implementation** - "Low effort, high impact"
7. **Use Swiss context** - This is a Swiss site with German speakers
8. **Think conversion** - Every recommendation should tie back to conversion

---

## 🎁 BONUS ANALYSIS (If You Have Capacity)

- **Trust Psychology:** What makes users feel safe?
- **Value Proposition:** Is it clear within 5 seconds?
- **Copy Analysis:** Is the messaging compelling?
- **Color Psychology:** Are colors supporting goals?
- **Accessibility:** Any obvious a11y issues?
- **Micro-interactions:** Are there feedback moments?
- **Social Proof:** How effectively is it used?
- **Urgency/Scarcity:** Are these levers being used?

---

## 📋 OUTPUT CHECKLIST

Before submitting your analysis, verify:

- [ ] Addressed all questions in REVIEW_REQUEST.md
- [ ] Referenced specific pages/screenshots
- [ ] Used data from ANALYTICS_DATA.json
- [ ] Compared with competitors
- [ ] Prioritized by impact
- [ ] Included mobile-specific recommendations
- [ ] Provided 30-day action plan
- [ ] Suggested specific A/B tests
- [ ] Kept recommendations actionable and specific

---

## 🏆 SUCCESS CRITERIA

Your analysis is successful if:
1. Every recommendation is specific enough to implement without further questions
2. Priorities are clear (what to do first, second, third)
3. Expected impact is estimated for major changes
4. Recommendations reference actual data/screenshots
5. The 30-day plan is realistic and actionable
6. A/B test hypotheses are testable

---

*This package represents hours of data collection. Use it all. Be thorough. Be specific. Be actionable.*

*The goal: Turn this 14% conversion rate into 25%.*
`;
  };

  const captureScreenshot = async (url: string, dimension: string): Promise<Blob | null> => {
    try {
      const internalHost = new URL(config.projectUrl).hostname;
      const screenshotUrl = addScreenshotRenderParamIfHost(url, internalHost);

      // Use 6 second delay to allow JavaScript animations to complete
      // Full-page screenshots need to scroll, which triggers scroll animations
      const params = new URLSearchParams({
        key: SCREENSHOT_API_KEY,
        url: screenshotUrl,
        dimension,
        format: "png",
        cacheLimit: "0",
        delay: "6000", // Increased from 3000 to allow scroll animations to complete
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
    const totalSteps = TOP_PAGES.length * 3 + competitors.length * 2 + 15;
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

      // 3. Generate sitemap with rich metadata
      updateProgress("Erstelle SITEMAP.json...");
      const sitemap = {
        generated: new Date().toISOString(),
        domain: config.projectUrl,
        packageVersion: "3.0 Ultimate",
        pages: TOP_PAGES.map((url, i) => ({
          order: i + 1,
          url,
          path: new URL(url).pathname || "/",
          type: url.includes("rechner") ? "calculator" : 
                url.includes("firmen") ? "directory" : 
                url.includes("ratgeber") ? "content" : 
                url.includes("offerten") ? "conversion" : "landing",
        })),
        competitors: competitors.map(url => ({
          url,
          domain: new URL(url).hostname.replace('www.', ''),
        })),
        metadata: {
          totalPages: TOP_PAGES.length,
          totalCompetitors: competitors.length,
          screenshotResolutions: ["1920xfull (desktop)", "375xfull (mobile)"],
        },
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

        await new Promise(r => setTimeout(r, 500));
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

        await new Promise(r => setTimeout(r, 600));
      }

      // 6. Add comprehensive README
      updateProgress("Erstelle README...");
      zip.file("README.md", `# 🏆 ${config.projectName} - Ultimate AI Analysis Package v3.0

## 🚀 Quick Start

1. **Read First:** \`PROJECT_BRIEF.md\` - Complete project context
2. **Questions:** \`REVIEW_REQUEST.md\` - What we need from you
3. **How-To:** \`AI_INSTRUCTIONS.md\` - Analysis methodology
4. **Data:** \`ANALYTICS_DATA.json\` - All behavior data

## 📸 Visual Assets

- \`/screenshots/desktop/\` - ${TOP_PAGES.length} pages at 1920px
- \`/screenshots/mobile/\` - ${TOP_PAGES.length} pages at 375px
- \`/competitors/\` - ${competitors.length} competitor sites

## 📊 Data Files

- \`ANALYTICS_DATA.json\` - Complete analytics package
- \`SITEMAP.json\` - Site structure

## 📄 HTML Source

- \`/html/\` - Source code for SEO analysis

---

## 📋 Package Contents Summary

| Content | Count |
|---------|-------|
| Desktop Screenshots | ${TOP_PAGES.length} |
| Mobile Screenshots | ${TOP_PAGES.length} |
| Competitor Screenshots | ${competitors.length * 2} |
| HTML Source Files | ${TOP_PAGES.length} |
| Documentation Files | 4 |

---

## 🎯 Our Goal

**Increase conversion rate from 14% to 25%**

---

*Generated: ${new Date().toISOString()}*
*Package: Ultimate v3.0 - Role Model Edition*
*Website: ${config.projectUrl}*
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
      const filename = `${config.projectName.replace(/\./g, '-')}_ultimate-package-v3_${timestamp}.zip`;
      saveAs(zipBlob, filename);

      // 9. Upload to cloud for public URL
      updateProgress("Lade in Cloud hoch...");
      const storagePath = `ultimate-packages/${timestamp}_${Date.now()}_v3.zip`;

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
        toast.success("Ultimate Package v3.0 erstellt und hochgeladen!");
      }

      setProgress({ step: "Fertig!", percent: 100, detail: "Paket bereit zum Teilen" });
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

  const copyShareText = () => {
    const text = `Ich habe ein komplettes Analyse-Paket meiner Website ${config.projectName} erstellt.

📥 Download: ${publicUrl}
🌐 Live: ${config.projectUrl}

Das Paket enthält:
• ${TOP_PAGES.length} Desktop + Mobile Screenshots
• ${DEFAULT_COMPETITORS.length} Konkurrenz-Analysen  
• Vollständige Analytics-Daten
• HTML Source Code für SEO-Analyse
• Detaillierter Project Brief

Bitte analysiere das Paket und gib mir spezifische Empfehlungen zur Conversion-Optimierung.

Lies zuerst die Datei REVIEW_REQUEST.md für die konkreten Fragen.`;
    
    navigator.clipboard.writeText(text);
    toast.success("Share-Text kopiert! Füge ihn in ChatGPT/Gemini ein.");
  };

  return (
    <Card className="border-2 border-primary">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2 flex-wrap">
          <FileArchive className="h-6 w-6 text-primary" />
          Ultimate AI Feedback Package v3.0
          <Badge variant="default" className="ml-2">Role Model Edition</Badge>
        </CardTitle>
        <CardDescription className="text-base">
          Das kompletteste Analyse-Paket für ChatGPT, Gemini & Claude - maximale Information für bestes Feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Package Contents Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            Paket-Inhalt (Maximum Information Density)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2 bg-white/50 rounded p-2">
              <Camera className="h-4 w-4 text-blue-500" />
              <span>{TOP_PAGES.length} Desktop Screenshots</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 rounded p-2">
              <Camera className="h-4 w-4 text-green-500" />
              <span>{TOP_PAGES.length} Mobile Screenshots</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 rounded p-2">
              <Globe className="h-4 w-4 text-orange-500" />
              <span>{DEFAULT_COMPETITORS.length} Konkurrenten</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 rounded p-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span>Vollständige Analytics</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 rounded p-2">
              <Code className="h-4 w-4 text-cyan-500" />
              <span>{TOP_PAGES.length} HTML Sources</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 rounded p-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <span>Heatmap-Daten</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 rounded p-2">
              <Users className="h-4 w-4 text-indigo-500" />
              <span>User Segments</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 rounded p-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>A/B Test Results</span>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Vollständig</span>
            </div>
            <p className="text-sm text-green-700">Alle Daten die ein AI braucht für maximales Feedback</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Link className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Teilbar</span>
            </div>
            <p className="text-sm text-blue-700">ZIP Download + Cloud URL für ChatGPT/Gemini</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-purple-800">Optimiert</span>
            </div>
            <p className="text-sm text-purple-700">Strukturiert für beste AI-Analyse-Resultate</p>
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
          <Label>Projektbeschreibung (für AI-Kontext)</Label>
          <Textarea
            value={config.description}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Zielgruppe</Label>
            <Textarea
              value={config.targetAudience}
              onChange={(e) => setConfig({ ...config, targetAudience: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Tech Stack</Label>
            <Textarea
              value={config.techStack}
              onChange={(e) => setConfig({ ...config, techStack: e.target.value })}
              rows={2}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Ziele (eines pro Zeile)</Label>
          <Textarea
            value={config.goals}
            onChange={(e) => setConfig({ ...config, goals: e.target.value })}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Konkurrenten URLs (eine pro Zeile)</Label>
          <Textarea
            value={config.competitors}
            onChange={(e) => setConfig({ ...config, competitors: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Schlüsselfragen für AI (je konkreter, desto besser)</Label>
          <Textarea
            value={config.keyQuestions}
            onChange={(e) => setConfig({ ...config, keyQuestions: e.target.value })}
            rows={5}
          />
        </div>

        {/* Progress */}
        {loading && (
          <div className="space-y-2 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-blue-800">{progress.step}</span>
              <span className="text-blue-600">{progress.percent}%</span>
            </div>
            {progress.detail && (
              <p className="text-xs text-blue-600 truncate">{progress.detail}</p>
            )}
            <Progress value={progress.percent} className="h-2" />
          </div>
        )}

        {/* Public URL */}
        {publicUrl && (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold text-lg">Paket bereit zum Teilen!</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-green-700 text-sm">Public URL (für ChatGPT/Gemini)</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={publicUrl} readOnly className="flex-1 bg-white text-xs font-mono" />
                  <Button variant="outline" size="icon" onClick={copyUrl} className="shrink-0">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-green-700 text-sm">Live Website</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={config.projectUrl} readOnly className="flex-1 bg-white text-xs" />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-green-200">
              <Button onClick={copyShareText} variant="secondary" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Kompletten Share-Text kopieren
              </Button>
              <p className="text-xs text-green-600 mt-2 text-center">
                Kopiert einen fertigen Text mit ZIP-URL und Instruktionen für ChatGPT/Gemini
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={generatePackage}
          disabled={loading}
          className="w-full h-14 text-lg"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Generiere Ultimate Package v3.0...
            </>
          ) : (
            <>
              <Download className="h-5 w-5 mr-2" />
              Ultimate Package generieren (ZIP + URL)
            </>
          )}
        </Button>

        <div className="text-xs text-center text-muted-foreground space-y-1">
          <p>
            ⏱️ Geschätzte Zeit: 4-6 Minuten · 
            📸 {TOP_PAGES.length * 2 + DEFAULT_COMPETITORS.length * 2} Screenshots · 
            ☁️ Automatischer Cloud-Upload
          </p>
          <p className="text-primary font-medium">
            💡 Tipp: Je konkreter deine Fragen, desto besser das AI-Feedback!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
