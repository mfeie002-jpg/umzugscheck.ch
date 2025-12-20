import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
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
  Trash2, Zap, FileDown, Shield,
  Wrench, ExternalLink, BookOpen, Terminal, FileCode,
  Database, Search, Eye, GitCompare, Sparkles, Bot, Play,
  Globe, RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ChatGPTPromptCopier } from "@/components/admin/ChatGPTPromptCopier";
import { SEOHtmlAnalyzer } from "@/components/admin/SEOHtmlAnalyzer";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { captureScreenshot } from "@/lib/screenshot-service";

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
  imageUrl: string;
  dimension: string;
  timestamp: Date;
}

interface DatabaseStats {
  leadsCount: number;
  providersCount: number;
  reviewsCount: number;
  screenshotsCount: number;
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

const DEFAULT_SITE_ORIGIN = "";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

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

const fetchRenderedHtml = async (url: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('capture-rendered-html', {
      body: { url, waitFor: 5000, formats: ['html', 'markdown'] }
    });
    if (error) throw error;
    return data?.html || '';
  } catch (error) {
    console.error('Failed to fetch rendered HTML:', error);
    return '';
  }
};

// ============================================================================
// STANDALONE PROMPTS CONTENT
// ============================================================================

const STANDALONE_PROMPTS_CONTENT = `# 🚀 Full-Stack Web Analyzer Suite - Complete Setup

## Was ist das?
Ein **kombinierter Export** der ALLES enthält:
- ✅ Frontend UI & Tools
- ✅ Backend Schema & RLS
- ✅ Edge Functions
- ✅ Admin Login System

Kopiere diesen EINEN Prompt in ein neues **Lovable** Projekt und du bekommst das komplette Tool!

---

# DER PROMPT (Kopiere alles ab hier)

Erstelle eine vollständige Web Analyzer Suite mit Admin-Bereich, Datenbank und allen Tools:

## 1. ADMIN AUTHENTICATION (KRITISCH!)
- Login-Seite unter /admin/login
- Email/Passwort Login mit Supabase Auth  
- Geschützter Admin-Bereich (alle /admin/* Routen)
- AdminLayout Wrapper mit Auth-Check
- Logout-Button im Header
- Automatische Weiterleitung bei nicht-authentifiziert
- User Roles Tabelle mit 'admin' und 'user' Rollen
- RLS Policies: Nur Admins können Admin-Bereiche sehen

## 2. DATENBANK-SCHEMA

\`\`\`sql
-- ENUMS
CREATE TYPE app_role AS ENUM ('admin', 'user');

-- PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- USER ROLES
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- SCREENSHOT HISTORY
CREATE TABLE screenshot_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  dimension TEXT NOT NULL,
  image_base64 TEXT NOT NULL,
  is_full_page BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SCREENSHOT BASELINES (für Regression Tests)
CREATE TABLE screenshot_baselines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  dimension TEXT DEFAULT '1920x1080',
  image_base64 TEXT NOT NULL,
  threshold_percent NUMERIC DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SCREENSHOT REGRESSION RESULTS
CREATE TABLE screenshot_regression_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baseline_id UUID REFERENCES screenshot_baselines(id),
  new_image_base64 TEXT NOT NULL,
  diff_image_base64 TEXT,
  diff_percent NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ANALYSIS REPORTS
CREATE TABLE analysis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'draft',
  overall_score INTEGER DEFAULT 0,
  categories JSONB DEFAULT '[]',
  consequences JSONB DEFAULT '[]',
  total_issues INTEGER DEFAULT 0,
  critical_issues INTEGER DEFAULT 0,
  warning_issues INTEGER DEFAULT 0,
  info_issues INTEGER DEFAULT 0,
  total_hours NUMERIC DEFAULT 0,
  hourly_rate NUMERIC DEFAULT 150,
  monthly_loss NUMERIC DEFAULT 0,
  current_revenue NUMERIC DEFAULT 0,
  projected_revenue NUMERIC DEFAULT 0,
  viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

## 3. RLS POLICIES

\`\`\`sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_regression_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;

-- Admin Check Function
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admin Policies
CREATE POLICY "Admins full access" ON screenshot_history FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins full access" ON screenshot_baselines FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins full access" ON screenshot_regression_results FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins full access" ON analysis_reports FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users see own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users see own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);
\`\`\`

## 4. EDGE FUNCTIONS

Erstelle folgende Edge Functions:

### fetch-html
- URL als Input
- Ruft rohen HTML-Code ab
- verify_jwt = false

### capture-rendered-html  
- URL + waitFor als Input
- Verwendet Firecrawl für gerenderten HTML
- Gibt HTML und Markdown zurück
- verify_jwt = false

### capture-screenshot
- URL, dimension, fullPage, delay als Input
- Verwendet Firecrawl für Screenshot
- Gibt base64 Image zurück
- verify_jwt = false

### ai-website-analyze
- projectName, projectUrl, htmlContent, screenshotBase64 als Input
- Ruft Lovable AI auf
- Gibt strukturierte Analyse zurück
- verify_jwt = false

### lighthouse
- URL als Input
- Ruft Lighthouse API auf
- Gibt Performance-Metriken zurück
- verify_jwt = false

## 5. FRONTEND TOOLS

### AI Feedback Package Generator
- Eingabefelder: Projektname, URL, Beschreibung, Ziele, Zielgruppe, Konkurrenten
- Zusätzliche Seiten hinzufügen (dynamische Liste)
- URL Discovery mit Firecrawl Map
- Automatische Screenshots (Desktop 1920xfull, Mobile 393x852)
- HTML-Quellcode abrufen
- 7 verschiedene KI-Analyse-Prompts generieren
- PDF Project Brief erstellen
- Alles als ZIP downloaden

### 1-Klick KI-Analyse
- Screenshot erstellen
- HTML abrufen
- An Lovable AI senden
- Analyse-Ergebnis anzeigen und exportieren

### Screenshot Machine
- Einzel-Screenshot mit Dimension-Presets
- Bulk-Screenshots (mehrere URLs)
- Optionen: Verzögerung, Volle Seite
- Galerie der erfassten Screenshots
- ZIP Download

### SEO HTML Analyzer
- Raw HTML vs. Rendered HTML Vergleich
- Automatische Tag-Extraktion (H1, H2, Meta, Links)
- Presets für bekannte Websites
- LLM-ready Markdown Export

### Lighthouse Integration
- Performance, Accessibility, SEO, Best Practices Scores
- Detaillierte Metriken

### Screenshot Regression Tests
- Baseline Management
- Automatischer Vergleich
- Diff-Visualisierung

## 6. UI COMPONENTS

- Tabs für die Tools
- Cards mit Formularen
- Progress-Anzeige beim Generieren
- Toast-Benachrichtigungen
- Responsive Design (Mobile-first)
- Dark/Light Mode Support
- Shadcn UI Components

## 7. DEPENDENCIES

npm install jszip file-saver jspdf

## 8. ADMIN SEITEN

- /admin/login - Login-Formular
- /admin/dashboard - Übersicht mit Stats
- /admin/tools - Alle Tools (Hauptseite)

## 9. SECRETS BENÖTIGT

- FIRECRAWL_API_KEY - Für Screenshots und HTML
- LOVABLE_API_KEY - Automatisch vorhanden

---

# NACH DEM ERSTELLEN

1. **Registriere dich** normal über die App
2. **Admin-Rolle hinzufügen**: 
   \`\`\`sql
   INSERT INTO user_roles (user_id, role) 
   VALUES ('deine-user-id', 'admin');
   \`\`\`
3. **Firecrawl verbinden** (optional, für Screenshots)
4. **Fertig!** Login unter /admin/login

---

## QUICK REFERENCE

| Feature | Benötigt | Funktion |
|---------|----------|----------|
| Screenshots | Firecrawl | capture-screenshot |
| HTML Abruf | Edge Function | fetch-html |
| KI Analyse | Lovable AI | ai-website-analyze |
| Lighthouse | API | lighthouse |

---

Erstellt mit ❤️ - 1 Prompt, komplettes Tool
`;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AdminTools = () => {
  // Database stats
  const [dbStats, setDbStats] = useState<DatabaseStats>({
    leadsCount: 0,
    providersCount: 0,
    reviewsCount: 0,
    screenshotsCount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // AI Feedback Package State - with localStorage persistence
  const defaultConfig: ProjectConfig = {
    projectName: '',
    projectUrl: DEFAULT_SITE_ORIGIN,
    description: '',
    goals: '',
    targetAudience: '',
    competitors: '',
    additionalPages: [],
  };
  
  const [savedConfig, setSavedConfig, clearSavedConfig] = useLocalStorage<ProjectConfig>(
    'admin-ai-feedback-config',
    defaultConfig
  );
  const [config, setConfig] = useState<ProjectConfig>(savedConfig);
  const [configSaved, setConfigSaved] = useState(false);

  const saveConfig = useCallback(() => {
    setSavedConfig(config);
    setConfigSaved(true);
    toast.success('Konfiguration gespeichert!');
    setTimeout(() => setConfigSaved(false), 2000);
  }, [config, setSavedConfig]);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
    clearSavedConfig();
    toast.info('Konfiguration zurückgesetzt');
  }, [clearSavedConfig]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  
  // AI Auto-Analyze State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [analyzeStatus, setAnalyzeStatus] = useState('');
  const [analyzeCapturedScreenshot, setAnalyzeCapturedScreenshot] = useState<string | null>(null);
  const [analyzeCapturedHtml, setAnalyzeCapturedHtml] = useState<string | null>(null);
  
  // Screenshot Machine State
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotConfig, setScreenshotConfig] = useState<ScreenshotConfig>({
    dimension: '1920x1080',
    format: 'png',
    delay: 5,
    fullPage: true,
  });
  const [capturedScreenshots, setCapturedScreenshots] = useState<CapturedScreenshot[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [bulkUrls, setBulkUrls] = useState('');

  // URL Discovery state
  const [isDiscoveringUrls, setIsDiscoveringUrls] = useState(false);
  const [discoveredUrls, setDiscoveredUrls] = useState<string[]>([]);
  const [selectedDiscoveredUrls, setSelectedDiscoveredUrls] = useState<Set<string>>(new Set());
  const [urlDiscoveryUrl, setUrlDiscoveryUrl] = useState('');
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [leadsRes, providersRes, reviewsRes, screenshotsRes] = await Promise.all([
          supabase.from('leads').select('id', { count: 'exact', head: true }),
          supabase.from('service_providers').select('id', { count: 'exact', head: true }),
          supabase.from('reviews').select('id', { count: 'exact', head: true }),
          supabase.from('screenshot_history').select('id', { count: 'exact', head: true }),
        ]);

        setDbStats({
          leadsCount: leadsRes.count || 0,
          providersCount: providersRes.count || 0,
          reviewsCount: reviewsRes.count || 0,
          screenshotsCount: screenshotsRes.count || 0,
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  // ============================================================================
  // URL DISCOVERY WITH FIRECRAWL
  // ============================================================================

  const discoverUrls = async () => {
    const urlToMap = urlDiscoveryUrl || config.projectUrl;
    if (!urlToMap) {
      toast.error('Bitte URL eingeben');
      return;
    }

    setIsDiscoveringUrls(true);
    setDiscoveredUrls([]);
    setSelectedDiscoveredUrls(new Set());

    try {
      const { data, error } = await supabase.functions.invoke('firecrawl-map', {
        body: { 
          url: urlToMap,
          options: { limit: 50, includeSubdomains: false }
        }
      });

      if (error) throw error;

      if (data?.links && Array.isArray(data.links)) {
        // Extract paths from full URLs
        const baseUrl = new URL(urlToMap).origin;
        const paths = data.links
          .filter((link: string) => link.startsWith(baseUrl))
          .map((link: string) => {
            try {
              const url = new URL(link);
              return url.pathname;
            } catch {
              return link;
            }
          })
          .filter((path: string) => path !== '/' && path.length > 1)
          .slice(0, 20); // Top 20

        setDiscoveredUrls(paths);
        toast.success(`${paths.length} URLs entdeckt!`);
      } else {
        toast.error('Keine URLs gefunden');
      }
    } catch (error) {
      console.error('URL discovery failed:', error);
      toast.error('URL Discovery fehlgeschlagen. Ist Firecrawl verbunden?');
    } finally {
      setIsDiscoveringUrls(false);
    }
  };

  const toggleUrlSelection = (url: string) => {
    setSelectedDiscoveredUrls(prev => {
      const newSet = new Set(prev);
      if (newSet.has(url)) {
        newSet.delete(url);
      } else {
        newSet.add(url);
      }
      return newSet;
    });
  };

  const addSelectedUrlsToConfig = () => {
    const newPages = Array.from(selectedDiscoveredUrls).filter(
      url => !config.additionalPages.includes(url)
    );
    if (newPages.length > 0) {
      setConfig({
        ...config,
        additionalPages: [...config.additionalPages, ...newPages]
      });
      toast.success(`${newPages.length} Seiten hinzugefügt!`);
      setDiscoveredUrls([]);
      setSelectedDiscoveredUrls(new Set());
    }
  };

  // ============================================================================
  // AI AUTO-ANALYZE FUNCTION (1-CLICK)
  // ============================================================================

  const runAutoAnalyze = async () => {
    if (!config.projectUrl) {
      toast.error('Bitte URL eingeben');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalyzeCapturedScreenshot(null);
    setAnalyzeCapturedHtml(null);
    setAnalyzeProgress(0);
    setAnalyzeStatus('Starte Analyse...');

    try {
      // Step 1: Capture screenshot
      setAnalyzeProgress(20);
      setAnalyzeStatus('Screenshot wird erstellt...');
      
      let screenshotBase64 = '';
      try {
        const screenshotResult = await captureScreenshot({
          url: config.projectUrl,
          dimension: '1920x1080',
          fullPage: false,
          delay: 3000,
        });
        if (screenshotResult.success && screenshotResult.image) {
          screenshotBase64 = screenshotResult.image;
          setAnalyzeCapturedScreenshot(screenshotResult.image);
        }
      } catch (e) {
        console.error('Screenshot failed:', e);
      }

      // Step 2: Fetch HTML
      setAnalyzeProgress(40);
      setAnalyzeStatus('HTML wird abgerufen...');
      
      let htmlContent = '';
      try {
        htmlContent = await fetchHtmlContent(config.projectUrl);
        if (htmlContent) {
          setAnalyzeCapturedHtml(htmlContent);
        }
      } catch (e) {
        console.error('HTML fetch failed:', e);
      }

      // Step 3: Call AI
      setAnalyzeProgress(60);
      setAnalyzeStatus('KI analysiert Website...');

      const { data, error } = await supabase.functions.invoke('ai-website-analyze', {
        body: {
          projectName: config.projectName,
          projectUrl: config.projectUrl,
          description: config.description,
          goals: config.goals,
          targetAudience: config.targetAudience,
          competitors: config.competitors,
          htmlContent,
          screenshotBase64,
          analysisType: 'complete'
        }
      });

      if (error) throw error;

      if (data?.success && data?.analysis) {
        setAnalyzeProgress(100);
        setAnalyzeStatus('Analyse abgeschlossen!');
        setAnalysisResult(data.analysis);
        toast.success('KI-Analyse abgeschlossen!');
      } else {
        throw new Error(data?.error || 'Analyse fehlgeschlagen');
      }

    } catch (error) {
      console.error('Auto-analyze error:', error);
      toast.error(error instanceof Error ? error.message : 'Analyse fehlgeschlagen');
      setAnalyzeStatus('Fehler bei der Analyse');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyAnalysisResult = async () => {
    if (!analysisResult) return;
    try {
      await navigator.clipboard.writeText(analysisResult);
      toast.success('Analyse kopiert!');
    } catch (e) {
      toast.error('Kopieren fehlgeschlagen');
    }
  };

  const downloadAnalysisResult = () => {
    if (!analysisResult) return;
    const blob = new Blob([analysisResult], { type: 'text/markdown' });
    saveAs(blob, `${config.projectName.replace(/\s+/g, '-')}-analyse-${new Date().toISOString().split('T')[0]}.md`);
    toast.success('Analyse heruntergeladen!');
  };

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
      const renderedHtmlFolder = zip.folder('rendered-html');
      
      const allPages = [
        { path: '/', name: 'homepage' },
        ...config.additionalPages.map((p, i) => ({ 
          path: p.startsWith('/') ? p : `/${p}`, 
          name: p.replace(/\//g, '-').replace(/^-/, '') || `page-${i + 1}` 
        }))
      ];

      const totalSteps = allPages.length * 4 + 2; // 4 per page + prompt + pdf
      let currentStep = 0;

      for (const page of allPages) {
        const fullUrl = `${config.projectUrl.replace(/\/$/, '')}${page.path}`;
        
        // Desktop screenshot
        setStatus(`Desktop Screenshot: ${page.name}...`);
        try {
          const result = await captureScreenshot({
            url: fullUrl,
            dimension: '1920x1080',
            fullPage: true,
            delay: 5000,
          });
          if (result.success && result.image) {
            const base64Data = result.image.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let j = 0; j < byteCharacters.length; j++) {
              byteNumbers[j] = byteCharacters.charCodeAt(j);
            }
            const byteArray = new Uint8Array(byteNumbers);
            screenshotsFolder?.file(`${page.name}-desktop.png`, byteArray);
          }
        } catch (e) {
          console.error('Desktop screenshot failed:', e);
        }
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);

        // Mobile screenshot
        setStatus(`Mobile Screenshot: ${page.name}...`);
        try {
          const result = await captureScreenshot({
            url: fullUrl,
            dimension: '393x852',
            fullPage: true,
            delay: 5000,
          });
          if (result.success && result.image) {
            const base64Data = result.image.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let j = 0; j < byteCharacters.length; j++) {
              byteNumbers[j] = byteCharacters.charCodeAt(j);
            }
            const byteArray = new Uint8Array(byteNumbers);
            screenshotsFolder?.file(`${page.name}-mobile.png`, byteArray);
          }
        } catch (e) {
          console.error('Mobile screenshot failed:', e);
        }
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);

        // Raw HTML content
        setStatus(`Raw HTML abrufen: ${page.name}...`);
        const rawHtml = await fetchHtmlContent(fullUrl);
        if (rawHtml) {
          htmlFolder?.file(`${page.name}-raw.html`, rawHtml);
        }
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);

        // Rendered HTML content
        setStatus(`Rendered HTML abrufen: ${page.name}...`);
        const renderedHtml = await fetchRenderedHtml(fullUrl);
        if (renderedHtml) {
          renderedHtmlFolder?.file(`${page.name}-rendered.html`, renderedHtml);
        }
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);

        // Small delay between pages
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Generate analysis prompt
      setStatus('Erstelle Analyse-Prompts...');
      const promptContent = generateAnalysisPrompt();
      zip.file('ANALYSIS_PROMPT.md', promptContent);
      
      // Add all 7 prompt variants
      zip.file('prompts/01_QUICK_ANALYSIS.md', generateQuickPrompt());
      zip.file('prompts/02_DEEP_AUDIT.md', generateDeepPrompt());
      zip.file('prompts/03_CODE_REVIEW.md', generateCodePrompt());
      zip.file('prompts/04_SCREENSHOT_ANALYSIS.md', generateScreenshotPrompt());
      zip.file('prompts/05_REGRESSION_REPORT.md', generateRegressionPrompt());
      zip.file('prompts/06_SEO_DEEP_DIVE.md', generateSEOPrompt());
      zip.file('prompts/07_ACCESSIBILITY_AUDIT.md', generateAccessibilityPrompt());
      
      currentStep++;
      setProgress((currentStep / totalSteps) * 100);

      // Generate PDF report
      setStatus('Erstelle PDF Report...');
      const pdfBlob = generatePdfReport();
      zip.file('PROJECT_BRIEF.pdf', pdfBlob);
      currentStep++;
      setProgress((currentStep / totalSteps) * 100);

      // Add README
      zip.file('README.md', generateReadme());

      // Download ZIP
      setStatus('Erstelle ZIP...');
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${config.projectName.toLowerCase().replace(/\s+/g, '-')}-feedback-package-${new Date().toISOString().split('T')[0]}.zip`);

      setStatus('Fertig!');
      toast.success('Package erfolgreich erstellt!');
    } catch (error) {
      console.error('Package generation failed:', error);
      toast.error('Fehler beim Erstellen des Packages');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReadme = () => {
    return `# ${config.projectName} - AI Feedback Package

## Generiert am ${new Date().toLocaleDateString('de-CH')}

### Inhalt

- **/screenshots/** - Desktop und Mobile Screenshots aller Seiten
- **/html/** - Raw HTML (ohne JavaScript)
- **/rendered-html/** - Gerendertes HTML (nach JavaScript-Ausführung)
- **/prompts/** - 7 verschiedene KI-Analyse-Prompts
- **PROJECT_BRIEF.pdf** - Projekt-Zusammenfassung

### Verwendung

1. Öffne ChatGPT, Claude oder Gemini
2. Wähle einen Prompt aus dem /prompts/ Ordner
3. Füge den Prompt ein
4. Lade relevante Screenshots oder HTML-Dateien hoch
5. Erhalte detaillierte Analyse

### Prompts

1. **Quick Analysis** - Schnelle UX/Conversion-Checks (~2 Min)
2. **Deep Audit** - Vollständige Analyse (~10 Min)
3. **Code Review** - Technische Qualität (~5 Min)
4. **Screenshot Analysis** - Visuelles Review (~3 Min)
5. **Regression Report** - Änderungs-Analyse (~3 Min)
6. **SEO Deep Dive** - Suchmaschinen-Optimierung (~8 Min)
7. **Accessibility Audit** - WCAG-Konformität (~5 Min)

### Projekt-Details

- **URL:** ${config.projectUrl}
- **Beschreibung:** ${config.description}
- **Zielgruppe:** ${config.targetAudience}
- **Konkurrenten:** ${config.competitors.replace(/\n/g, ', ')}
`;
  };

  const generateAnalysisPrompt = () => {
    return `# AI Analysis Request: ${config.projectName}

## Project Overview
- **URL**: ${config.projectUrl}
- **Description**: ${config.description}
- **Goals**: ${config.goals}
- **Target Audience**: ${config.targetAudience}

## Competitors
${config.competitors}

## Pages Analyzed
${config.additionalPages.map(p => `- ${config.projectUrl}${p}`).join('\n')}

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
- Raw vs. Rendered HTML differences

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

  const generateQuickPrompt = () => `# Quick Analysis Prompt

${config.projectName} - Schnelle UX/Conversion-Analyse

## Projekt
- URL: ${config.projectUrl}
- Branche: Comparison Platform

## Aufgabe
Führe eine schnelle UX-Analyse durch und identifiziere:

1. **TOP 3 Conversion-Killer** - Was hindert Nutzer am Abschluss?
2. **Quick Wins** - Welche Änderungen können diese Woche umgesetzt werden?
3. **Mobile UX** - Gibt es offensichtliche Mobile-Probleme?

## Ausgabeformat
Priorisierte Liste mit:
- Problem
- Auswirkung (Hoch/Mittel/Niedrig)
- Konkrete Lösung (1 Satz)
- Geschätzter Aufwand (Stunden)
`;

  const generateDeepPrompt = () => `# Deep Audit Prompt

${config.projectName} - Vollständige Analyse

## Projekt
- URL: ${config.projectUrl}
- Zielgruppe: ${config.targetAudience}
- Konkurrenten: ${config.competitors.replace(/\n/g, ', ')}

## Analyse-Bereiche
1. Conversion Funnel (40%)
2. SEO & Content (25%)
3. Technical Performance (20%)
4. Trust & Social Proof (15%)

## Erwarteter Output
- Executive Summary
- ICE-priorisierte Findings
- Wettbewerbs-Vergleich
- 90-Tage Roadmap
`;

  const generateCodePrompt = () => `# Code Review Prompt

${config.projectName} - Technische Analyse

## Stack
React 18, Vite, TypeScript, Tailwind CSS, Supabase

## Fokus
1. Performance (30%) - Bundle Size, Rendering
2. Architecture (25%) - Components, State
3. TypeScript (20%) - Type Safety
4. Best Practices (15%) - Error Handling
5. Security (10%) - API, RLS

## Output
- Critical Issues
- Code Smells
- Optimization Opportunities
- Konkrete Code-Snippets
`;

  const generateScreenshotPrompt = () => `# Screenshot Analysis Prompt

${config.projectName} - Visuelles Review

## Analyse-Punkte
1. Visual Hierarchy (25%)
2. Above the Fold (25%)
3. Design Consistency (20%)
4. Mobile/Responsive (15%)
5. Conversion-Optimierung (15%)

## Output
- Positives ✅
- Verbesserungen ⚠️
- Kritische Issues ❌
- Quick Wins 🚀
`;

  const generateRegressionPrompt = () => `# Regression Report Prompt

${config.projectName} - Änderungs-Analyse

## Aufgabe
Analysiere Unterschiede zwischen Baseline und neuem Screenshot:

1. Art der Änderungen
2. Impact-Bewertung (High/Medium/Low)
3. Potenzielle Ursachen
4. Empfehlungen

## Output
| Bereich | Änderung | Impact | Empfehlung |
|---------|----------|--------|------------|
`;

  const generateSEOPrompt = () => `# SEO Deep Dive Prompt

${config.projectName} - Suchmaschinen-Optimierung

## Analyse-Bereiche
1. On-Page SEO (30%)
2. Technical SEO (25%)
3. Content Quality (20%)
4. Local SEO CH (15%)
5. Off-Page Signals (10%)

## Output
- SEO Score Card
- Top 5 Quick Wins
- Keyword Opportunities
- 6-Monats Roadmap
`;

  const generateAccessibilityPrompt = () => `# Accessibility Audit Prompt

${config.projectName} - WCAG 2.1 Level AA

## Prüfbereiche
1. Perceivable (25%)
2. Operable (25%)
3. Understandable (25%)
4. Robust (25%)

## Output
- Accessibility Score
- Kritische Issues (Level A)
- Wichtige Issues (Level AA)
- Empfehlungen
`;

  const generatePdfReport = () => {
    const pdf = new jsPDF();
    
    pdf.setFontSize(24);
    pdf.setTextColor(37, 99, 235);
    pdf.text(`${config.projectName}`, 20, 30);
    
    pdf.setFontSize(12);
    pdf.setTextColor(100);
    pdf.text('AI Feedback Package - Project Brief', 20, 40);
    
    pdf.setFontSize(10);
    pdf.setTextColor(0);
    pdf.text(`URL: ${config.projectUrl}`, 20, 55);
    pdf.text(`Generiert: ${new Date().toLocaleDateString('de-CH')}`, 20, 62);
    
    pdf.setFontSize(12);
    pdf.setTextColor(37, 99, 235);
    pdf.text('Projekt-Ziele:', 20, 80);
    pdf.setFontSize(10);
    pdf.setTextColor(0);
    const goals = config.goals || 'Lead generation, SEO, User trust';
    pdf.text(goals.substring(0, 80), 20, 88);
    
    pdf.setFontSize(12);
    pdf.setTextColor(37, 99, 235);
    pdf.text('Zielgruppe:', 20, 105);
    pdf.setFontSize(10);
    pdf.setTextColor(0);
    const audience = config.targetAudience || 'Swiss moving customers';
    pdf.text(audience.substring(0, 80), 20, 113);
    
    pdf.setFontSize(12);
    pdf.setTextColor(37, 99, 235);
    pdf.text('Analysierte Seiten:', 20, 130);
    pdf.setFontSize(10);
    pdf.setTextColor(0);
    config.additionalPages.forEach((page, i) => {
      pdf.text(`• ${config.projectUrl}${page}`, 25, 138 + (i * 7));
    });
    
    pdf.setFontSize(12);
    pdf.setTextColor(37, 99, 235);
    pdf.text('Enthaltene Prompts:', 20, 180);
    pdf.setFontSize(10);
    pdf.setTextColor(0);
    const prompts = [
      '1. Quick Analysis - Schnelle UX/Conversion-Checks',
      '2. Deep Audit - Vollständige Analyse',
      '3. Code Review - Technische Qualität',
      '4. Screenshot Analysis - Visuelles Review',
      '5. Regression Report - Änderungs-Analyse',
      '6. SEO Deep Dive - Suchmaschinen-Optimierung',
      '7. Accessibility Audit - WCAG-Konformität',
    ];
    prompts.forEach((prompt, i) => {
      pdf.text(prompt, 25, 188 + (i * 7));
    });
    
    return pdf.output('blob');
  };

  // ============================================================================
  // SCREENSHOT MACHINE FUNCTIONS
  // ============================================================================

  const captureScreenshotHandler = async () => {
    if (!screenshotUrl) {
      toast.error('Bitte URL eingeben');
      return;
    }

    setIsCapturing(true);
    try {
      const dimension = screenshotConfig.fullPage 
        ? screenshotConfig.dimension.replace(/x\d+$/, 'xfull')
        : screenshotConfig.dimension;
      
      const result = await captureScreenshot({
        url: screenshotUrl,
        dimension,
        delay: screenshotConfig.delay * 1000,
        fullPage: screenshotConfig.fullPage,
      });
      
      if (result.success && result.image) {
        setCapturedScreenshots(prev => [...prev, {
          url: screenshotUrl,
          imageUrl: result.image!,
          dimension,
          timestamp: new Date()
        }]);
        toast.success('Screenshot erfasst!');
      } else {
        toast.error(result.error || 'Screenshot fehlgeschlagen');
      }
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
      toast.info(`Screenshot ${i + 1}/${urls.length}: ${url}`);
      
      try {
        const dimension = screenshotConfig.fullPage 
          ? screenshotConfig.dimension.replace(/x\d+$/, 'xfull')
          : screenshotConfig.dimension;
        
        const result = await captureScreenshot({
          url,
          dimension,
          delay: screenshotConfig.delay * 1000,
          fullPage: screenshotConfig.fullPage,
        });
        
        if (result.success && result.image) {
          const base64Data = result.image.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let j = 0; j < byteCharacters.length; j++) {
            byteNumbers[j] = byteCharacters.charCodeAt(j);
          }
          const byteArray = new Uint8Array(byteNumbers);
          
          const hostname = new URL(url).hostname.replace(/\./g, '-');
          zip.file(`${hostname}-${i + 1}.png`, byteArray);
        }
        
        // Delay between screenshots
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed: ${url}`);
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `bulk-screenshots-${new Date().toISOString().split('T')[0]}.zip`);
    setIsCapturing(false);
    toast.success('Bulk Screenshots heruntergeladen!');
  };

  const downloadScreenshot = (screenshot: CapturedScreenshot) => {
    const hostname = new URL(screenshot.url).hostname.replace(/\./g, '-');
    
    const base64Data = screenshot.imageUrl.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let j = 0; j < byteCharacters.length; j++) {
      byteNumbers[j] = byteCharacters.charCodeAt(j);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    
    saveAs(blob, `${hostname}-${screenshot.dimension}.png`);
  };

  const downloadAllScreenshots = async () => {
    if (capturedScreenshots.length === 0) return;
    
    const zip = new JSZip();
    capturedScreenshots.forEach((s, i) => {
      const hostname = new URL(s.url).hostname.replace(/\./g, '-');
      
      const base64Data = s.imageUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let j = 0; j < byteCharacters.length; j++) {
        byteNumbers[j] = byteCharacters.charCodeAt(j);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      zip.file(`${hostname}-${s.dimension}-${i + 1}.png`, byteArray);
    });
    
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `screenshots-${new Date().toISOString().split('T')[0]}.zip`);
  };

  // ============================================================================
  // DOWNLOAD STANDALONE FILES
  // ============================================================================

  const downloadStandaloneFile = () => {
    const blob = new Blob([STANDALONE_PROMPTS_CONTENT], { type: 'text/markdown' });
    saveAs(blob, 'FULL_STACK_EXPORT.md');
    toast.success('FULL_STACK_EXPORT.md heruntergeladen!');
  };

  // ============================================================================
  // MEGA-EXPORT: ZIP WITH REAL CODE + PROMPT
  // ============================================================================

  const downloadMegaExport = async () => {
    toast.info('Mega-Export wird erstellt...');
    const zip = new JSZip();
    
    // ============ EDGE FUNCTIONS ============
    const functionsFolder = zip.folder('supabase/functions');
    
    // fetch-html
    functionsFolder?.file('fetch-html/index.ts', `import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(\`Fetching HTML from: \${url}\`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'de-CH,de;q=0.9,en;q=0.8',
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: \`Failed to fetch: \${response.status}\`, html: null }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const html = await response.text();
    const cleanHtml = html.replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, '');

    return new Response(
      JSON.stringify({ html: cleanHtml, url, fetchedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', html: null }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});`);

    // capture-rendered-html (Firecrawl)
    functionsFolder?.file('capture-rendered-html/index.ts', `import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, waitFor = 5000, formats = ['html', 'markdown'] } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'FIRECRAWL_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let formattedUrl = url.startsWith('http') ? url : \`https://\${url}\`;

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: formattedUrl, formats, waitFor }),
    });

    const data = await response.json();
    const result = data.data || data;

    return new Response(
      JSON.stringify({
        success: true,
        url: formattedUrl,
        html: result.html,
        markdown: result.markdown,
        capturedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});`);

    // ai-website-analyze (Lovable AI)
    functionsFolder?.file('ai-website-analyze/index.ts', `import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { projectName, projectUrl, description, goals, targetAudience, competitors, htmlContent, screenshotBase64 } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const systemPrompt = 'Du bist ein erfahrener Web-Analyst und UX-Experte. Analysiere Websites gründlich.';
    let userPrompt = \`# Website-Analyse für \${projectName}\\n\\n**URL:** \${projectUrl}\\n**Beschreibung:** \${description || 'Keine'}\\n**Ziele:** \${goals || 'Nicht angegeben'}\\n\`;
    
    if (htmlContent) {
      userPrompt += \`\\n## HTML-Auszug:\\n\\\`\\\`\\\`html\\n\${htmlContent.substring(0, 15000)}\\n\\\`\\\`\\\`\\n\`;
    }
    
    userPrompt += \`\\n## Analyse:\\n1. TOP 3 Conversion-Killer\\n2. Quick Wins\\n3. SEO-Probleme\\n4. Mobile UX\\n\`;

    const messages: any[] = [{ role: 'system', content: systemPrompt }];
    
    if (screenshotBase64) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: userPrompt },
          { type: 'image_url', image_url: { url: screenshotBase64.startsWith('data:') ? screenshotBase64 : \`data:image/png;base64,\${screenshotBase64}\` } }
        ]
      });
    } else {
      messages.push({ role: 'user', content: userPrompt });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${LOVABLE_API_KEY}\`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'google/gemini-2.5-flash', messages, max_tokens: 4000 }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: 'Rate limit' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      throw new Error(\`AI error: \${response.status}\`);
    }

    const data = await response.json();
    return new Response(
      JSON.stringify({ success: true, analysis: data.choices?.[0]?.message?.content, timestamp: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});`);

    // lighthouse
    functionsFolder?.file('lighthouse/index.ts', `import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAGESPEED_API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, strategy = 'mobile' } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const apiUrl = new URL(PAGESPEED_API_URL);
    apiUrl.searchParams.set('url', url);
    apiUrl.searchParams.set('strategy', strategy);
    apiUrl.searchParams.set('category', 'performance');

    const response = await fetch(apiUrl.toString());
    if (!response.ok) {
      return new Response(JSON.stringify({ error: \`PageSpeed API error: \${response.status}\` }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const data = await response.json();
    const lh = data.lighthouseResult;
    const scores = {
      performance: Math.round((lh.categories.performance?.score || 0) * 100),
      accessibility: Math.round((lh.categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((lh.categories['best-practices']?.score || 0) * 100),
      seo: Math.round((lh.categories.seo?.score || 0) * 100),
    };

    return new Response(JSON.stringify({ url, scores, fetchTime: new Date().toISOString() }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});`);

    // firecrawl-map
    functionsFolder?.file('firecrawl-map/index.ts', `const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { url, options } = await req.json();
    if (!url) return new Response(JSON.stringify({ success: false, error: 'URL is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) return new Response(JSON.stringify({ success: false, error: 'FIRECRAWL_API_KEY not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const formattedUrl = url.startsWith('http') ? url : \`https://\${url}\`;
    const response = await fetch('https://api.firecrawl.dev/v1/map', {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${apiKey}\`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: formattedUrl, limit: options?.limit || 50 }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});`);

    // ============ CONFIG.TOML ============
    zip.file('supabase/config.toml', `project_id = "your-project-id"

[functions.fetch-html]
verify_jwt = false

[functions.capture-rendered-html]
verify_jwt = false

[functions.ai-website-analyze]
verify_jwt = false

[functions.lighthouse]
verify_jwt = false

[functions.firecrawl-map]
verify_jwt = false
`);

    // ============ SQL MIGRATION ============
    zip.file('supabase/migrations/001_initial_schema.sql', `-- ENUMS
CREATE TYPE app_role AS ENUM ('admin', 'user');

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- USER ROLES
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- SCREENSHOT HISTORY
CREATE TABLE IF NOT EXISTS screenshot_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  dimension TEXT NOT NULL,
  image_base64 TEXT NOT NULL,
  is_full_page BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SCREENSHOT BASELINES
CREATE TABLE IF NOT EXISTS screenshot_baselines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  dimension TEXT DEFAULT '1920x1080',
  image_base64 TEXT NOT NULL,
  threshold_percent NUMERIC DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ANALYSIS REPORTS
CREATE TABLE IF NOT EXISTS analysis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'draft',
  overall_score INTEGER DEFAULT 0,
  categories JSONB DEFAULT '[]',
  total_issues INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ENABLE RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;

-- ADMIN CHECK FUNCTION
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- RLS POLICIES
CREATE POLICY "Users see own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users see own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins full access screenshots" ON screenshot_history FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins full access baselines" ON screenshot_baselines FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins full access reports" ON analysis_reports FOR ALL USING (has_role(auth.uid(), 'admin'));

-- PROFILE TRIGGER
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name) VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();
`);

    // ============ README ============
    zip.file('README.md', STANDALONE_PROMPTS_CONTENT);

    // ============ QUICK START ============
    zip.file('QUICK_START.md', `# 🚀 Quick Start Guide

## Option 1: Prompt in Lovable (Empfohlen)
1. Öffne https://lovable.dev
2. Erstelle ein neues Projekt
3. Kopiere den Inhalt von README.md in den Chat
4. Warte bis alles generiert ist
5. Registriere dich, füge Admin-Rolle hinzu, fertig!

## Option 2: Manuelles Setup
1. Erstelle ein Supabase-Projekt
2. Führe \`supabase/migrations/001_initial_schema.sql\` aus
3. Deploye die Edge Functions in \`supabase/functions/\`
4. Baue das Frontend mit den Tools-Komponenten

## Secrets benötigt
- FIRECRAWL_API_KEY (für Screenshots + HTML)
- LOVABLE_API_KEY (automatisch bei Lovable Cloud)

## Nach dem Setup
1. Registriere dich normal
2. Füge Admin-Rolle hinzu:
   \`\`\`sql
   INSERT INTO user_roles (user_id, role) VALUES ('deine-user-id', 'admin');
   \`\`\`
3. Login unter /admin/login

## Enthaltene Tools
- 1-Klick KI-Analyse
- Screenshot Machine
- SEO HTML Analyzer
- 7 Prompt-Varianten
- URL Discovery
`);

    // Generate and download
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'WEB_ANALYZER_SUITE_MEGA_EXPORT.zip');
    toast.success('Mega-Export heruntergeladen! ZIP enthält echten Code + Anleitung.');
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
            Analyse-Tools, Screenshots, KI-Prompts und Standalone-Komponenten
          </p>
        </div>

        {/* Database Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{loadingStats ? '...' : dbStats.leadsCount}</p>
                  <p className="text-sm text-muted-foreground">Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{loadingStats ? '...' : dbStats.providersCount}</p>
                  <p className="text-sm text-muted-foreground">Anbieter</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{loadingStats ? '...' : dbStats.reviewsCount}</p>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Camera className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{loadingStats ? '...' : dbStats.screenshotsCount}</p>
                  <p className="text-sm text-muted-foreground">Screenshots</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full-Stack Export Section - MEGA EXPORT */}
        <Card className="mb-8 border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-orange-500 text-white">
                <Download className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">Mega Export - Komplettes Tool replizieren</CardTitle>
                <CardDescription>
                  ZIP mit echtem Code + Prompt-Anleitung - 100% Copy-Paste ready!
                </CardDescription>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white ml-auto">
                NEU
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={downloadMegaExport}
                size="lg"
                className="flex-1 h-14 text-base bg-gradient-to-r from-primary to-orange-500"
              >
                <Package className="h-5 w-5 mr-2" />
                MEGA_EXPORT.zip herunterladen
              </Button>
              <Button 
                onClick={downloadStandaloneFile}
                variant="outline"
                size="lg"
                className="flex-1 h-14 text-base"
              >
                <FileDown className="h-5 w-5 mr-2" />
                Nur Prompt (.md)
              </Button>
            </div>

            {/* What's included */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4 border-t">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10">
                <Code className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">5 Edge Functions</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10">
                <Database className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">SQL Migration</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10">
                <Shield className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium">RLS + Auth</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/10">
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Config.toml</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-pink-500/10">
                <BookOpen className="h-4 w-4 text-pink-600" />
                <span className="text-sm font-medium">Quick Start</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Download ZIP</p>
                  <p className="text-xs text-muted-foreground">Echter Code + Prompt</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-orange-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-sm">README.md kopieren</p>
                  <p className="text-xs text-muted-foreground">In Lovable-Chat einfügen</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Registrieren</p>
                  <p className="text-xs text-muted-foreground">Admin-Rolle hinzufügen</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Fertig!</p>
                  <p className="text-xs text-muted-foreground">Komplettes Tool</p>
                </div>
              </div>
            </div>

            {/* Link to code export for comparison */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <Link to="/admin/code-export">
                <Button variant="ghost" size="sm" className="gap-2">
                  <FileCode className="h-4 w-4" />
                  Backend-Export (nur DB)
                </Button>
              </Link>
              <Link to="/admin/ai-export">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  KI-Prompt Generator
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* KI-Prompt Generator */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              KI-Prompt Generator
              <Badge variant="secondary">7 Varianten</Badge>
            </CardTitle>
            <CardDescription>
              Wähle eine Analyse-Variante und kopiere den optimierten Prompt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChatGPTPromptCopier showCard={false} />
          </CardContent>
        </Card>

        {/* Tools Tabs */}
        <Tabs defaultValue="ai-feedback" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai-feedback" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              AI Feedback Package
            </TabsTrigger>
            <TabsTrigger value="screenshots" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Screenshot Machine
            </TabsTrigger>
            <TabsTrigger value="seo-analyzer" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              SEO HTML Analyzer
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
                    <Label>Konkurrenten (eine pro Zeile)</Label>
                    <Textarea 
                      value={config.competitors}
                      onChange={(e) => setConfig({...config, competitors: e.target.value})}
                      placeholder="competitor1.com&#10;competitor2.com"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Zusätzliche Seiten</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={discoverUrls}
                        disabled={isDiscoveringUrls}
                        className="gap-1 text-xs"
                      >
                        {isDiscoveringUrls ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Suche...
                          </>
                        ) : (
                          <>
                            <Globe className="h-3 w-3" />
                            URLs entdecken
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* Manual input */}
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

                    {/* Discovered URLs Selection */}
                    {discoveredUrls.length > 0 && (
                      <div className="border rounded-lg p-3 bg-muted/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Globe className="h-4 w-4 text-primary" />
                            {discoveredUrls.length} URLs gefunden
                          </span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedDiscoveredUrls(new Set(discoveredUrls))}
                              className="text-xs h-7"
                            >
                              Alle
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedDiscoveredUrls(new Set())}
                              className="text-xs h-7"
                            >
                              Keine
                            </Button>
                          </div>
                        </div>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {discoveredUrls.map((url) => (
                            <label
                              key={url}
                              className="flex items-center gap-2 p-2 rounded hover:bg-background cursor-pointer text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={selectedDiscoveredUrls.has(url)}
                                onChange={() => toggleUrlSelection(url)}
                                className="rounded"
                              />
                              <span className="truncate">{url}</span>
                            </label>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          onClick={addSelectedUrlsToConfig}
                          disabled={selectedDiscoveredUrls.size === 0}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          {selectedDiscoveredUrls.size} ausgewählte hinzufügen
                        </Button>
                      </div>
                    )}

                    {/* Current pages */}
                    <div className="flex flex-wrap gap-2">
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

                  {/* Save/Reset Config Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      onClick={saveConfig}
                      variant={configSaved ? "default" : "outline"}
                      className="flex-1"
                      disabled={configSaved}
                    >
                      {configSaved ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Gespeichert!
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Konfiguration speichern
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={resetConfig}
                      variant="ghost"
                      size="icon"
                      title="Auf Standard zurücksetzen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 1-Click AI Analysis Card */}
              <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    1-Klick KI-Analyse
                    <Badge className="bg-gradient-to-r from-primary to-purple-500 text-white">NEU</Badge>
                  </CardTitle>
                  <CardDescription>
                    Automatische Screenshot + HTML + KI-Analyse in einem Schritt
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAnalyzing && (
                    <div className="space-y-2">
                      <Progress value={analyzeProgress} className="h-2" />
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        {analyzeStatus}
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={runAutoAnalyze} 
                    disabled={isAnalyzing || !config.projectUrl}
                    className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Analysiere...
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Website jetzt analysieren
                      </>
                    )}
                  </Button>

                  {analysisResult && (
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Analyse-Ergebnis
                        </h4>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={copyAnalysisResult}>
                            <Copy className="h-3 w-3 mr-1" />
                            Kopieren
                          </Button>
                          <Button size="sm" variant="outline" onClick={downloadAnalysisResult}>
                            <Download className="h-3 w-3 mr-1" />
                            .md
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
                        <pre className="text-xs whitespace-pre-wrap font-mono">
                          {analysisResult}
                        </pre>
                      </div>
                      
                      {/* Screenshot & HTML Downloads */}
                      {(analyzeCapturedScreenshot || analyzeCapturedHtml) && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {analyzeCapturedScreenshot && (
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = `data:image/png;base64,${analyzeCapturedScreenshot}`;
                                link.download = `${config.projectName.replace(/\s+/g, '-')}-screenshot.png`;
                                link.click();
                                toast.success('Screenshot heruntergeladen!');
                              }}
                            >
                              <Camera className="h-3 w-3 mr-1" />
                              Screenshot
                            </Button>
                          )}
                          {analyzeCapturedHtml && (
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => {
                                const blob = new Blob([analyzeCapturedHtml], { type: 'text/html' });
                                saveAs(blob, `${config.projectName.replace(/\s+/g, '-')}-source.html`);
                                toast.success('HTML heruntergeladen!');
                              }}
                            >
                              <Code className="h-3 w-3 mr-1" />
                              HTML
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    <p>✨ Die KI erstellt automatisch:</p>
                    <ul className="mt-1 space-y-1 ml-4">
                      <li>• Screenshot der Startseite</li>
                      <li>• HTML-Code Analyse</li>
                      <li>• UX/Conversion Bewertung</li>
                      <li>• SEO & Accessibility Check</li>
                      <li>• Priorisierter Aktionsplan</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Manual Package Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Manuelles Package</CardTitle>
                  <CardDescription>
                    Erstellt Screenshots, HTML, Prompts und PDF als ZIP für externe KI
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
                    variant="outline"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generiere...
                      </>
                    ) : (
                      <>
                        <Package className="h-4 w-4 mr-2" />
                        Package für ChatGPT/Claude
                      </>
                    )}
                  </Button>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2 text-sm">Das Package enthält:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <Camera className="h-3 w-3" /> Desktop & Mobile Screenshots
                      </li>
                      <li className="flex items-center gap-2">
                        <Code className="h-3 w-3" /> Raw & Rendered HTML
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3" /> 7 KI-Analyse-Prompts
                      </li>
                      <li className="flex items-center gap-2">
                        <FileDown className="h-3 w-3" /> PDF Project Brief
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
                    onClick={captureScreenshotHandler}
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
                    Alle als ZIP downloaden
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Captured Screenshots Gallery */}
            {capturedScreenshots.length > 0 && (
              <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Erfasste Screenshots</CardTitle>
                    <CardDescription>{capturedScreenshots.length} Screenshots</CardDescription>
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
                      <div key={i} className="relative group border rounded-lg overflow-hidden">
                        <img 
                          src={screenshot.imageUrl} 
                          alt={screenshot.url}
                          className="w-full h-32 object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="sm" variant="secondary" onClick={() => downloadScreenshot(screenshot)}>
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => window.open(screenshot.imageUrl, '_blank')}>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="p-2 text-xs">
                          <p className="truncate font-medium">{new URL(screenshot.url).hostname}</p>
                          <p className="text-muted-foreground">{screenshot.dimension}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* SEO HTML Analyzer Tab */}
          <TabsContent value="seo-analyzer">
            <SEOHtmlAnalyzer />
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Weitere Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Link to="/admin/screenshots">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Camera className="h-6 w-6" />
                  <span>Screenshot Machine</span>
                  <span className="text-xs text-muted-foreground">Erweiterte Optionen</span>
                </Button>
              </Link>
              <Link to="/admin/ai-export">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Sparkles className="h-6 w-6" />
                  <span>KI-Analyse</span>
                  <span className="text-xs text-muted-foreground">7 Prompt-Varianten</span>
                </Button>
              </Link>
              <Link to="/admin/analytics">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Search className="h-6 w-6" />
                  <span>Analytics</span>
                  <span className="text-xs text-muted-foreground">Conversion Tracking</span>
                </Button>
              </Link>
              <Link to="/admin/rankings">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Database className="h-6 w-6" />
                  <span>Rankings</span>
                  <span className="text-xs text-muted-foreground">Firmen verwalten</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTools;
