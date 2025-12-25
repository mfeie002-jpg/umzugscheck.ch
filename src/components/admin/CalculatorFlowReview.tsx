import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { SITE_CONFIG } from "@/data/constants";
import { supabase } from "@/integrations/supabase/client";
import { captureScreenshot as captureScreenshotService } from "@/lib/screenshot-service";
import { toast } from "sonner";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { 
  Camera, 
  Copy, 
  Download, 
  Play, 
  Eye,
  FileCode,
  Sparkles,
  CheckCircle,
  Loader2,
  ExternalLink,
  Image,
  FileText,
  RefreshCw,
  Package
} from "lucide-react";

interface FlowStep {
  step: number;
  name: string;
  description: string;
  screenshotDesktop?: string;
  screenshotMobile?: string;
  html?: string;
  url?: string;
}

// Step configs using uc_capture mode for deterministic screenshot capture
// uc_capture=1 enables capture mode (prefilled demo data)
// uc_step=N sets the specific step to render
const STEP_CONFIGS = [
  { step: 1, name: "Umzugstyp wählen", description: "Wohnung, Haus, Büro auswählen" },
  { step: 2, name: "Details & Services", description: "Adressen, Grösse, Datum, Services" },
  { step: 3, name: "Firmenauswahl", description: "Passende Firmen auswählen" },
  { step: 4, name: "Kontakt & Absenden", description: "Name, Email, Absenden" },
];

const getDefaultPublicBaseUrl = (): string => {
  // Screenshot providers cannot access Lovable preview/sandbox domains (login wall).
  // Default to the public site URL so automated captures work.
  if (typeof window === "undefined") return SITE_CONFIG.url;

  const { protocol, hostname } = window.location;
  const isLovableHost = hostname.includes("lovable.app") || hostname.includes("lovableproject.com");

  if (isLovableHost) return SITE_CONFIG.url;
  return `${protocol}//${hostname}`;
};

// Helper to build capture URL for a given flow and step
const buildCaptureUrl = (baseUrl: string, flowPath: string, step: number) => {
  // uc_render=1 enables render-mode patches (e.g. IntersectionObserver + eager images)
  // uc_cb busts caches for screenshot tooling.
  return `${baseUrl}${flowPath}?uc_capture=1&uc_step=${step}&uc_render=1&uc_cb=${Date.now()}`;
};

const DIMENSIONS = {
  desktop: "1920x1080",
  // iPhone 12/13/14 viewport (good default for mobile capture)
  mobile: "390x844",
};

export function CalculatorFlowReview() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [capturedSteps, setCapturedSteps] = useState<FlowStep[]>([]);
  const [selectedCalculator, setSelectedCalculator] = useState("umzugsofferten");
  const [customPrompt, setCustomPrompt] = useState("");
  const [captureProgress, setCaptureProgress] = useState(0);
  const [captureStatus, setCaptureStatus] = useState("");
  // Default: use a public base URL (the preview domain can show a login wall to the screenshot service)
  const [baseUrlOverride, setBaseUrlOverride] = useState(() => getDefaultPublicBaseUrl());

  const calculatorOptions = [
    { value: "umzugsofferten", label: "V1 - Control Flow", path: "/umzugsofferten" },
    { value: "umzugsofferten-v2", label: "V2 - Premium Full-Journey", path: "/umzugsofferten-v2" },
    { value: "umzugsofferten-v3", label: "V3 - God Mode", path: "/umzugsofferten-v3" },
    { value: "umzugsofferten-v4", label: "V4 - Video-First AI", path: "/umzugsofferten-v4" },
    { value: "umzugsofferten-v5", label: "V5 - Marketplace Wizard", path: "/umzugsofferten-v5" },
    { value: "umzugsofferten-v6", label: "V6 - Ultimate (6-Tier)", path: "/umzugsofferten-v6" },
    { value: "umzugsofferten-v7", label: "V7 - SwissMove (90s)", path: "/umzugsofferten-v7" },
    { value: "umzugsofferten-v8", label: "V8 - Decision-Free", path: "/umzugsofferten-v8" },
    { value: "umzugsofferten-v9", label: "V9 - Zero Friction ⭐", path: "/umzugsofferten-v9" },
    { value: "reinigung", label: "Reinigungsrechner", path: "/reinigungsrechner" },
    { value: "entsorgung", label: "Entsorgungsrechner", path: "/entsorgungsrechner" },
    { value: "firmenumzug", label: "Firmenumzug-Rechner", path: "/firmenumzug-rechner" },
  ];

  // Only flow variants (V1-V9) for bulk export
  const flowVariants = calculatorOptions.filter(c => c.value.startsWith('umzugsofferten'));

  const captureScreenshot = async (url: string, dimension: string): Promise<string | null> => {
    try {
      console.log(`Capturing screenshot: ${url} with dimension: ${dimension}`);
      const result = await captureScreenshotService({
        url,
        dimension,
        delay: 8000,
        format: "png",
        fullPage: true,
        scroll: true,
        noCache: true,
      });

      console.log(
        `Screenshot captured: ${result.success ? "SUCCESS" : "FAILED"} (${result.image?.substring(0, 50)}...)`
      );

      if (!result.success) {
        toast.error(`Screenshot fehlgeschlagen (${dimension})${result.error ? `: ${result.error}` : ""}`);
        return null;
      }

      return result.image || null;
    } catch (err) {
      console.error("Screenshot capture failed:", err);
      toast.error(
        `Screenshot fehlgeschlagen (${dimension})${err instanceof Error ? `: ${err.message}` : ""}`
      );
      return null;
    }
  };

  const captureRenderedHtml = async (url: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("capture-rendered-html", {
        body: { url, waitFor: 5000, formats: ["html"] },
      });

      if (error) throw error;
      return data?.html || null;
    } catch (err) {
      console.error("HTML capture failed:", err);
      toast.error(
        `HTML Capture fehlgeschlagen${err instanceof Error ? `: ${err.message}` : ""}`
      );
      return null;
    }
  };

  const captureAllSteps = async () => {
    setIsCapturing(true);
    setCaptureProgress(0);
    setCapturedSteps([]);

    const baseUrl = (baseUrlOverride.trim() || getDefaultPublicBaseUrl()).replace(/\/$/, "");
    const selectedCalc = calculatorOptions.find(c => c.value === selectedCalculator);
    const calculatorPath = selectedCalc?.path || '/umzugsofferten';
    const steps: FlowStep[] = [];
    const totalOperations = STEP_CONFIGS.length * 3; // desktop + mobile + html per step
    let completedOps = 0;

    for (let i = 0; i < STEP_CONFIGS.length; i++) {
      const config = STEP_CONFIGS[i];
      // Construct URL with uc_capture mode for deterministic step rendering
      const fullUrl = buildCaptureUrl(baseUrl, calculatorPath, config.step);

      // Desktop screenshot
      setCaptureStatus(`Step ${config.step}: Desktop Screenshot...`);
      const desktopScreenshot = await captureScreenshot(fullUrl, DIMENSIONS.desktop);
      completedOps++;
      setCaptureProgress((completedOps / totalOperations) * 100);
      
      // Mobile screenshot
      setCaptureStatus(`Step ${config.step}: Mobile Screenshot...`);
      const mobileScreenshot = await captureScreenshot(fullUrl, DIMENSIONS.mobile);
      completedOps++;
      setCaptureProgress((completedOps / totalOperations) * 100);
      
      // Capture HTML
      setCaptureStatus(`Step ${config.step}: HTML...`);
      const html = await captureRenderedHtml(fullUrl);
      completedOps++;
      setCaptureProgress((completedOps / totalOperations) * 100);
      
      steps.push({
        step: config.step,
        name: config.name,
        description: config.description,
        url: fullUrl,
        screenshotDesktop: desktopScreenshot || undefined,
        screenshotMobile: mobileScreenshot || undefined,
        html: html || undefined,
      });
    }
    
    setCapturedSteps(steps);
    setCaptureStatus("");
    setIsCapturing(false);
    
    const successCount = steps.filter(s => s.screenshotDesktop || s.screenshotMobile || s.html).length;
    toast.success(`${successCount} von ${steps.length} Steps erfasst (Desktop + Mobile)`);
  };

  const generateMockSteps = () => {
    const selectedCalc = calculatorOptions.find(c => c.value === selectedCalculator);
    const calculatorPath = selectedCalc?.path || '/umzugsofferten';
    const mockSteps: FlowStep[] = STEP_CONFIGS.map(config => ({
      step: config.step,
      name: config.name,
      description: config.description,
      url: buildCaptureUrl(getDefaultPublicBaseUrl(), calculatorPath, config.step),
      html: getMockHtml(config.step),
    }));
    
    setCapturedSteps(mockSteps);
    toast.success("Demo-Steps geladen (ohne Screenshots)");
  };

  const getMockHtml = (step: number): string => {
    const htmlTemplates: Record<number, string> = {
      1: `<!DOCTYPE html>
<html lang="de">
<head><title>Umzugsofferten - Step 1</title></head>
<body>
  <main class="calculator-container">
    <div class="step-1-addresses">
      <h1>Wohin soll der Umzug gehen?</h1>
      <p class="subtitle">Geben Sie Ihre Adressen ein</p>
      
      <div class="address-grid">
        <div class="from-address">
          <h3>Von</h3>
          <label>PLZ</label>
          <input type="text" placeholder="z.B. 8001" class="input-plz" />
          <label>Stadt</label>
          <input type="text" placeholder="Zürich" class="input-city" />
        </div>
        
        <div class="to-address">
          <h3>Nach</h3>
          <label>PLZ</label>
          <input type="text" placeholder="z.B. 3011" class="input-plz" />
          <label>Stadt</label>
          <input type="text" placeholder="Bern" class="input-city" />
        </div>
      </div>
      
      <div class="progress-indicator">
        <span class="step active">1</span>
        <span class="step">2</span>
        <span class="step">3</span>
        <span class="step">4</span>
        <span class="step">5</span>
      </div>
      
      <button class="btn-primary btn-next">Weiter</button>
    </div>
  </main>
</body>
</html>`,
      2: `<!DOCTYPE html>
<html lang="de">
<head><title>Umzugsofferten - Step 2</title></head>
<body>
  <main class="calculator-container">
    <div class="step-2-details">
      <h1>Details zu Ihrem Umzug</h1>
      
      <div class="form-section">
        <label>Wohnungsgrösse</label>
        <select class="select-apartment">
          <option>1-Zimmer Wohnung</option>
          <option>2-Zimmer Wohnung</option>
          <option selected>3-Zimmer Wohnung</option>
          <option>4-Zimmer Wohnung</option>
          <option>5-Zimmer Wohnung</option>
          <option>6+ Zimmer / Haus</option>
        </select>
      </div>
      
      <div class="form-section">
        <label>Umzugsdatum *</label>
        <input type="date" class="input-date" required />
        <span class="hint">Pflichtfeld</span>
      </div>
      
      <div class="services-section">
        <h3>Zusätzliche Services</h3>
        <label class="checkbox-item">
          <input type="checkbox" /> Packen & Auspacken (+15%)
        </label>
        <label class="checkbox-item">
          <input type="checkbox" /> Endreinigung (+CHF 450)
        </label>
        <label class="checkbox-item">
          <input type="checkbox" /> Entsorgung (+CHF 200)
        </label>
      </div>
      
      <div class="price-estimate">
        <span class="label">Geschätzte Kosten:</span>
        <span class="price">CHF 1'200 - 1'800</span>
      </div>
      
      <div class="btn-group">
        <button class="btn-secondary">Zurück</button>
        <button class="btn-primary">Weiter</button>
      </div>
    </div>
  </main>
</body>
</html>`,
      3: `<!DOCTYPE html>
<html lang="de">
<head><title>Umzugsofferten - Step 3</title></head>
<body>
  <main class="calculator-container">
    <div class="step-3-companies">
      <h1>Passende Umzugsfirmen</h1>
      <p class="subtitle">Wählen Sie 1-5 Firmen aus</p>
      
      <div class="filter-bar">
        <select class="sort-select">
          <option selected>Empfohlen</option>
          <option>Beste Bewertung</option>
          <option>Günstigste</option>
        </select>
        <div class="filter-chips">
          <button class="chip active">Alle</button>
          <button class="chip">4+ Sterne</button>
          <button class="chip">Günstig</button>
        </div>
      </div>
      
      <div class="company-list">
        <div class="company-card sponsored">
          <span class="badge-sponsored">Gesponsert</span>
          <img src="/logo-1.png" alt="Premium Umzug AG" />
          <h3>Premium Umzug AG</h3>
          <div class="rating">★★★★★ 4.9 (127 Bewertungen)</div>
          <div class="price">ab CHF 1'400</div>
          <button class="btn-select">Auswählen</button>
        </div>
        
        <div class="company-card">
          <span class="badge-verified">✓ Verifiziert</span>
          <img src="/logo-2.png" alt="Züri-Move GmbH" />
          <h3>Züri-Move GmbH</h3>
          <div class="rating">★★★★★ 4.7 (89 Bewertungen)</div>
          <div class="price">ab CHF 1'200</div>
          <button class="btn-select selected">Ausgewählt</button>
        </div>
        
        <div class="company-card">
          <img src="/logo-3.png" alt="SwissMove" />
          <h3>SwissMove</h3>
          <div class="rating">★★★★☆ 4.5 (56 Bewertungen)</div>
          <div class="price">ab CHF 1'100</div>
          <button class="btn-select">Auswählen</button>
        </div>
      </div>
      
      <div class="selection-summary">
        <span>2 Firmen ausgewählt</span>
      </div>
      
      <div class="btn-group">
        <button class="btn-secondary">Zurück</button>
        <button class="btn-primary">Weiter</button>
      </div>
    </div>
  </main>
</body>
</html>`,
      4: `<!DOCTYPE html>
<html lang="de">
<head><title>Umzugsofferten - Step 4</title></head>
<body>
  <main class="calculator-container">
    <div class="step-4-options">
      <h1>Wie möchten Sie fortfahren?</h1>
      
      <div class="options-grid">
        <div class="option-card">
          <h3>Direkt anfragen</h3>
          <p>Die ausgewählten Firmen kontaktieren Sie direkt mit einem Angebot.</p>
          <ul class="benefits">
            <li>✓ Schnelle Antwort</li>
            <li>✓ Persönlicher Kontakt</li>
            <li>✓ Gezielte Auswahl</li>
          </ul>
          <button class="btn-option">Auswählen</button>
        </div>
        
        <div class="option-card highlighted">
          <span class="badge-new">Neu</span>
          <h3>Ausschreibung publizieren</h3>
          <p>Ihr Umzug wird veröffentlicht und Firmen können Gebote abgeben.</p>
          <ul class="benefits">
            <li>✓ Wettbewerb unter Firmen</li>
            <li>✓ Möglicherweise günstiger</li>
            <li>✓ Mehr Optionen</li>
          </ul>
          <button class="btn-option">Auswählen</button>
        </div>
        
        <div class="option-card recommended">
          <span class="badge-recommended">Empfohlen</span>
          <h3>Beides</h3>
          <p>Kombination: Direkte Anfragen + öffentliche Ausschreibung.</p>
          <ul class="benefits">
            <li>✓ Maximale Chancen</li>
            <li>✓ Beste Preise</li>
            <li>✓ Schnell & flexibel</li>
          </ul>
          <button class="btn-option selected">Ausgewählt</button>
        </div>
      </div>
      
      <div class="btn-group">
        <button class="btn-secondary">Zurück</button>
        <button class="btn-primary">Weiter</button>
      </div>
    </div>
  </main>
</body>
</html>`,
      5: `<!DOCTYPE html>
<html lang="de">
<head><title>Umzugsofferten - Step 5</title></head>
<body>
  <main class="calculator-container">
    <div class="step-5-submit">
      <h1>Fast geschafft!</h1>
      <p class="subtitle">Geben Sie Ihre Kontaktdaten ein</p>
      
      <form class="contact-form">
        <div class="form-group">
          <label>Name *</label>
          <input type="text" placeholder="Ihr Name" required />
        </div>
        
        <div class="form-group">
          <label>E-Mail *</label>
          <input type="email" placeholder="ihre@email.ch" required />
        </div>
        
        <div class="form-group">
          <label>Telefon (optional)</label>
          <input type="tel" placeholder="+41 79 123 45 67" />
        </div>
        
        <div class="form-group">
          <label>Bemerkungen</label>
          <textarea placeholder="Zusätzliche Informationen..."></textarea>
        </div>
        
        <label class="checkbox-privacy">
          <input type="checkbox" required />
          Ich akzeptiere die <a href="/datenschutz">Datenschutzerklärung</a>
        </label>
        
        <button type="submit" class="btn-primary btn-large">
          Offerten erhalten
        </button>
      </form>
      
      <div class="trust-badges">
        <span class="badge">✓ Kostenlos</span>
        <span class="badge">✓ Unverbindlich</span>
        <span class="badge">✓ Schweizer Firmen</span>
      </div>
    </div>
  </main>
</body>
</html>`,
    };
    return htmlTemplates[step] || '';
  };

  const downloadAsZip = async () => {
    const zip = new JSZip();
    const folderName = `umzugsofferten-flow-${new Date().toISOString().split('T')[0]}`;
    const folder = zip.folder(folderName);
    
    if (!folder) return;
    
    // Add README
    folder.file('README.md', generateReadme());
    
    // Add each step
    for (const step of capturedSteps) {
      const stepFolder = folder.folder(`step-${step.step}-${step.name.replace(/\s+/g, '-').toLowerCase()}`);
      if (!stepFolder) continue;
      
      // Add HTML
      if (step.html) {
        stepFolder.file('page.html', step.html);
      }
      
      // Add desktop screenshot
      if (step.screenshotDesktop) {
        const base64Data = step.screenshotDesktop.replace(/^data:image\/\w+;base64,/, '');
        stepFolder.file('screenshot-desktop.png', base64Data, { base64: true });
      }
      
      // Add mobile screenshot
      if (step.screenshotMobile) {
        const base64Data = step.screenshotMobile.replace(/^data:image\/\w+;base64,/, '');
        stepFolder.file('screenshot-mobile.png', base64Data, { base64: true });
      }
      
      // Add step info
      stepFolder.file('info.json', JSON.stringify({
        step: step.step,
        name: step.name,
        description: step.description,
        url: step.url,
        hasDesktopScreenshot: !!step.screenshotDesktop,
        hasMobileScreenshot: !!step.screenshotMobile,
        hasHtml: !!step.html,
        capturedAt: new Date().toISOString(),
      }, null, 2));
    }
    
    // Add prompt file
    folder.file('chatgpt-prompt.md', generatePromptTemplate());
    
    const blob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(blob, `${folderName}.zip`);
    toast.success('ZIP mit Desktop + Mobile Screenshots heruntergeladen');
  };

  // Fetch source code from edge function
  const fetchSourceFiles = async (): Promise<Record<string, Record<string, string>> | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('get-source-files', {
        body: { 
          flowIds: flowVariants.map(f => f.value),
          includeShared: true 
        }
      });
      
      if (error) throw error;
      return data?.files || null;
    } catch (err) {
      console.error('Failed to fetch source files:', err);
      return null;
    }
  };

  // Export ALL flow variants at once with source code
  const exportAllFlows = async () => {
    setIsExportingAll(true);
    setCaptureProgress(0);
    setCaptureStatus("Starte Export aller Flows...");

    const baseUrl = (baseUrlOverride.trim() || getDefaultPublicBaseUrl()).replace(/\/$/, "");
    const zip = new JSZip();
    const exportDate = new Date().toISOString().split('T')[0];
    const rootFolder = zip.folder(`all-flows-export-${exportDate}`);

    if (!rootFolder) {
      setIsExportingAll(false);
      toast.error("Export fehlgeschlagen");
      return;
    }

    // Fetch source code first
    setCaptureStatus("Lade Source Code...");
    const sourceFiles = await fetchSourceFiles();
    setCaptureProgress(5);

    const totalFlows = flowVariants.length;
    let completedFlows = 0;

    const allFlowsData: Record<string, any> = {
      exportDate: new Date().toISOString(),
      baseUrl,
      flows: {},
    };

    for (const flow of flowVariants) {
      const flowFolderName = flow.value.replace('umzugsofferten', 'v1').replace('-v', 'v');
      const flowFolder = rootFolder.folder(flowFolderName);
      if (!flowFolder) continue;

      setCaptureStatus(`${flow.label}: Desktop Screenshot...`);
      // Use deterministic capture mode so the screenshot/HTML fetch never depends on cookies/localStorage
      // (and avoids any login walls / gated previews).
      const fullUrl = buildCaptureUrl(baseUrl, flow.path, 1);

      // Capture desktop screenshot
      const desktopScreenshot = await captureScreenshot(fullUrl, DIMENSIONS.desktop);

      setCaptureStatus(`${flow.label}: Mobile Screenshot...`);
      const mobileScreenshot = await captureScreenshot(fullUrl, DIMENSIONS.mobile);

      setCaptureStatus(`${flow.label}: HTML...`);
      const html = await captureRenderedHtml(fullUrl);

      // Save to folder
      if (desktopScreenshot) {
        const base64Data = desktopScreenshot.replace(/^data:image\/\w+;base64,/, '');
        flowFolder.file('screenshot-desktop.png', base64Data, { base64: true });
      }
      if (mobileScreenshot) {
        const base64Data = mobileScreenshot.replace(/^data:image\/\w+;base64,/, '');
        flowFolder.file('screenshot-mobile.png', base64Data, { base64: true });
      }
      if (html) {
        flowFolder.file('page.html', html);
      }

      // Add source code to flow folder
      const sourceCodeFolder = flowFolder.folder('source-code');
      if (sourceCodeFolder && sourceFiles && sourceFiles[flow.value]) {
        Object.entries(sourceFiles[flow.value]).forEach(([filename, content]) => {
          sourceCodeFolder.file(filename, content as string);
        });
      }

      // Create flow info JSON
      const flowInfo = {
        id: flow.value,
        name: flow.label,
        path: flow.path,
        fullUrl,
        hasDesktopScreenshot: !!desktopScreenshot,
        hasMobileScreenshot: !!mobileScreenshot,
        hasHtml: !!html,
        hasSourceCode: !!(sourceFiles && sourceFiles[flow.value]),
        htmlLength: html?.length || 0,
        capturedAt: new Date().toISOString(),
      };
      flowFolder.file('info.json', JSON.stringify(flowInfo, null, 2));
      
      allFlowsData.flows[flow.value] = flowInfo;

      completedFlows++;
      setCaptureProgress(5 + (completedFlows / totalFlows) * 85);
    }

    // Add shared source files
    const sharedFolder = rootFolder.folder('shared');
    if (sharedFolder && sourceFiles && sourceFiles['shared']) {
      Object.entries(sourceFiles['shared']).forEach(([filename, content]) => {
        sharedFolder.file(filename, content as string);
      });
    }

    // Add master JSON with all flows info
    rootFolder.file('all-flows.json', JSON.stringify(allFlowsData, null, 2));

    // Add comprehensive analysis prompt
    rootFolder.file('chatgpt-analysis-prompt.md', generateAllFlowsPrompt(allFlowsData));

    // Add comparison prompt
    rootFolder.file('comparison-prompt.md', generateComparisonPrompt());

    // Add Swiss Market Analysis
    rootFolder.file('swiss-market-analysis.md', generateSwissMarketAnalysis());

    // Add Deep Research Prompt
    rootFolder.file('deep-research-prompt.md', generateDeepResearchPrompt());

    setCaptureProgress(95);
    setCaptureStatus("ZIP wird erstellt...");
    const blob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(blob, `all-flows-export-${exportDate}.zip`);

    setCaptureProgress(100);
    setCaptureStatus("");
    setIsExportingAll(false);
    toast.success(`Alle ${totalFlows} Flows mit Source Code exportiert!`);
  };

  const generateAllFlowsPrompt = (data: Record<string, any>) => `# Umzugscheck.ch - Alle 9 Flow-Varianten Analyse

## Exportdatum: ${data.exportDate}
## Base URL: ${data.baseUrl}

---

Du bist ein UX-Experte und Conversion-Optimierer. Analysiere alle 9 Umzugsrechner-Flows und erstelle eine optimierte Version 10.

## Die 9 Flows:

${Object.entries(data.flows).map(([key, flow]: [string, any]) => `
### ${flow.name}
- **URL:** ${flow.fullUrl}
- **Desktop Screenshot:** ${flow.hasDesktopScreenshot ? '✓' : '✗'}
- **Mobile Screenshot:** ${flow.hasMobileScreenshot ? '✓' : '✗'}
- **HTML:** ${flow.hasHtml ? `✓ (${(flow.htmlLength / 1024).toFixed(1)} KB)` : '✗'}
`).join('')}

---

## Analyse-Aufgaben:

### Für JEDEN Flow analysiere:
1. ✅ **Stärken** - Was funktioniert gut?
2. ❌ **Schwächen** - Was könnte besser sein?
3. 💡 **Unique Ideas** - Einzigartige Elemente die übernommen werden sollten
4. 📊 **Conversion-Schätzung** - Niedrig/Mittel/Hoch

### Erstelle dann V10 "Ultimate Flow":
- Kombiniere die besten Elemente aller 9 Flows
- Optimiere für: **Schnelligkeit**, **Vertrauen**, **Conversion**
- Ziel: In unter 2 Minuten zur Offerte
- Mobile-First Design
- Schweizer Markt (DE/FR/IT)

---

## Gewünschtes Output-Format:

### 1. Analyse-Tabelle
| Flow | Stärken | Schwächen | Unique Ideas | Conversion |
|------|---------|-----------|--------------|------------|
| V1   | ...     | ...       | ...          | ...        |
| ...  | ...     | ...       | ...          | ...        |

### 2. Top 5 Best Practices (aus allen Flows)

### 3. V10 "Ultimate Flow" - Detaillierter Ablauf
- Step-by-Step Beschreibung
- Wireframe/Mockup Beschreibung
- Key Features von jedem übernommenen Flow

### 4. Priorisierte Implementierungs-Roadmap

---

**Hinweis:** Die Screenshots und HTML-Dateien befinden sich in den jeweiligen Flow-Ordnern.
`;

  const generateComparisonPrompt = () => `# Quick Comparison Prompt - Alle 9 Flows

Vergleiche alle 9 Umzugsrechner-Flows und beantworte:

## Schnell-Vergleich

1. **Welcher Flow hat die beste User Experience?** Warum?
2. **Welcher Flow ist am schnellsten?** (wenigste Schritte/Zeit)
3. **Welcher Flow wirkt am vertrauenswürdigsten?**
4. **Welcher Flow hat das beste Mobile-Design?**
5. **Welcher Flow ist am innovativsten?**

## Ranking

Erstelle ein Ranking von 1-9 basierend auf:
- Conversion-Potenzial
- User Experience
- Geschwindigkeit
- Vertrauen/Seriösität
- Innovation

## Empfehlung

**Dein Favorit für Production:** ___
**Begründung:** ___

---

Lade die Screenshots aus den jeweiligen Ordnern hoch für eine visuelle Analyse.
`;

  const generateSwissMarketAnalysis = () => `# Schweizer Umzugsmarkt - Analyse

## Marktübersicht
- Gesamtmarkt: CHF 800 Mio.-1.2 Mrd./Jahr
- 900k Umzüge/Jahr, 30-40% mit Firma
- Durchschnittspreis: CHF 1200-3500

## Wettbewerber
| Firma | USP | Traffic/Monat |
|-------|-----|---------------|
| Movu.ch | 60 Sek. Offerte | 50-80k |
| MoveAgain | Festpreis | 15-25k |
| Movinga | International | 10-20k |
| Umzugspreise.ch | Guenstig | 8-15k |

## Conversion Benchmarks
- Durchschnitt: 3-5%, Top 10%: 8-12%
- Mobile: 2-4%, Desktop: 4-6%

## Schweizer Besonderheiten
- Kuendigungstermine: 31.3., 30.6., 30.9., 31.12.
- Stockwerk = Preistreiber
- Sprachregionen: DE 65%, FR 23%, IT 8%
`;

  const generateDeepResearchPrompt = () => `# Deep Research & V10 Synthesis

## Analyse alle 9 Flows:
1. Source Code: Architektur, Patterns
2. Visual Design: Hero, CTAs, Trust
3. User Journey: Steps, Zeit
4. Conversion Psychology
5. Technische Qualitaet

## Erstelle:
- Vergleichs-Matrix (Score 1-10)
- Top 10 Best Practices
- Top 10 Anti-Patterns
- V10 Ultimate Design mit A/B Roadmap
`;

  const generateReadme = () => `# Umzugsofferten Flow Review

## Übersicht
Dieser Export enthält Desktop und Mobile Screenshots sowie HTML aller Steps des Umzugsofferten-Flows.

## Inhalt
${capturedSteps.map(s => `- Step ${s.step}: ${s.name}
  - Desktop: ${s.screenshotDesktop ? '✓' : '✗'}
  - Mobile: ${s.screenshotMobile ? '✓' : '✗'}
  - HTML: ${s.html ? '✓' : '✗'}`).join('\n')}

## Dateien pro Step
- screenshot-desktop.png (1920x1080)
- screenshot-mobile.png (375x812)
- page.html
- info.json

## Verwendung mit ChatGPT/Claude
1. Öffne chatgpt-prompt.md
2. Kopiere den Inhalt
3. Lade die Screenshots hoch
4. Füge den Prompt ein

Erstellt: ${new Date().toLocaleString('de-CH')}
`;

  const generatePromptTemplate = () => `## Umzugsofferten Flow Analyse

Ich möchte den folgenden Calculator-Flow analysieren lassen:

**Calculator:** ${calculatorOptions.find(c => c.value === selectedCalculator)?.label}

### Flow Steps:
${capturedSteps.map(step => `
**Step ${step.step}: ${step.name}**
- URL: ${step.url || 'N/A'}
- Beschreibung: ${step.description}
- Desktop Screenshot: ${step.screenshotDesktop ? '✓ Vorhanden (screenshot-desktop.png)' : '✗ Nicht erfasst'}
- Mobile Screenshot: ${step.screenshotMobile ? '✓ Vorhanden (screenshot-mobile.png)' : '✗ Nicht erfasst'}
- HTML: ${step.html ? '✓ Vorhanden (page.html)' : '✗ Nicht erfasst'}
`).join('\n')}

### Analyse-Aufgaben:
1. **UX-Analyse Desktop:** Bewerte die Benutzerführung und Conversion-Optimierung auf Desktop
2. **UX-Analyse Mobile:** Bewerte die mobile Nutzererfahrung und Touch-Optimierung
3. **Design-Feedback:** Identifiziere Verbesserungspotenziale im UI (Desktop & Mobile)
4. **Responsive Vergleich:** Vergleiche Desktop vs Mobile und identifiziere Inkonsistenzen
5. **Conversion-Tipps:** Gib konkrete Empfehlungen zur Steigerung der Abschlussrate

### Gewünschte Ausgabe:
- Übersichtliche Zusammenfassung
- Priorisierte Verbesserungsvorschläge für Desktop und Mobile
- Konkrete Code-Snippets wo hilfreich

${customPrompt ? `### Zusätzliche Anweisungen:\n${customPrompt}` : ''}`;

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(generatePromptTemplate());
    toast.success("Prompt kopiert!");
  };

  const openInNewTab = (path: string) => {
    window.open(path, '_blank');
  };

  const toPngDataUrl = (value: string) =>
    value.startsWith("data:") ? value : `data:image/png;base64,${value}`;

  const base64ToBlob = (base64: string, mime = "image/png") => {
    const clean = base64.replace(/^data:[^;]+;base64,/, "").replace(/\s+/g, "");
    const binary = atob(clean);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  };

  const isInIFrame = () => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);

    // In Lovable preview (iframe), downloads are often blocked. Opening in a new tab is reliable.
    if (isInIFrame()) {
      window.open(url, "_blank", "noopener,noreferrer");
      toast.message("Datei in neuem Tab geöffnet (Download im Preview teils blockiert)");
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
      return;
    }

    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (err) {
      try {
        saveAs(blob, filename);
      } finally {
        window.setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
    }
  };

  const downloadPng = async (value: string, filename: string) => {
    try {
      const dataUrl = toPngDataUrl(value);
      const mimeMatch = dataUrl.match(/^data:([^;]+);base64,/);
      const mime = mimeMatch?.[1] || "image/png";
      const blob = base64ToBlob(dataUrl, mime);
      downloadBlob(blob, filename);
    } catch (err) {
      console.error("PNG download failed:", err);
      toast.error(
        `Screenshot-Download fehlgeschlagen${err instanceof Error ? `: ${err.message}` : ""}`
      );
    }
  };

  const downloadHtml = (html: string, filename: string) => {
    try {
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      downloadBlob(blob, filename);
    } catch (err) {
      console.error("HTML download failed:", err);
      toast.error(
        `HTML-Download fehlgeschlagen${err instanceof Error ? `: ${err.message}` : ""}`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Umzugsofferten Flow für AI Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Erfasse Screenshots und vollständiges HTML aller Calculator-Steps für ChatGPT/Claude Analyse.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Calculator</label>
              <Select value={selectedCalculator} onValueChange={setSelectedCalculator}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {calculatorOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Screenshot Base-URL (optional)</label>
              <Input
                value={baseUrlOverride}
                onChange={(e) => setBaseUrlOverride(e.target.value)}
                placeholder={getDefaultPublicBaseUrl()}
                inputMode="url"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Von dieser URL werden Screenshots/HTML geholt (z.B. deine Live-Domain). Standard = öffentliche Live-URL.
              </p>
            </div>

            <div className="flex items-end gap-2 flex-wrap">
              <Button 
                variant="outline"
                onClick={() => openInNewTab(calculatorOptions.find(c => c.value === selectedCalculator)?.path || '/')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Öffnen
              </Button>
              <Button 
                variant="outline"
                onClick={generateMockSteps}
                disabled={isCapturing || isExportingAll}
              >
                <Play className="w-4 h-4 mr-2" />
                Demo laden
              </Button>
              <Button 
                onClick={captureAllSteps}
                disabled={isCapturing || isExportingAll}
              >
                {isCapturing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 mr-2" />
                )}
                Alle Steps erfassen
              </Button>
            </div>
          </div>
          
          {(isCapturing || isExportingAll) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{captureStatus}</span>
                <span className="font-medium">{Math.round(captureProgress)}%</span>
              </div>
              <Progress value={captureProgress} />
            </div>
          )}

          {/* Export All Flows Button */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  Alle {flowVariants.length} Flows exportieren
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Exportiert Screenshots, HTML & JSON aller V1-V9 Flows für ChatGPT-Analyse
                </p>
              </div>
              <Button 
                onClick={exportAllFlows}
                disabled={isCapturing || isExportingAll}
                className="bg-gradient-to-r from-primary to-blue-600"
              >
                {isExportingAll ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {isExportingAll ? 'Exportiere...' : 'Alle Flows exportieren'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Captured Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Erfasste Steps ({capturedSteps.length})
            </span>
            {capturedSteps.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Bereit
                </Badge>
                <Button size="sm" variant="outline" onClick={() => setCapturedSteps([])}>
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {capturedSteps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Camera className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Noch keine Steps erfasst</p>
              <p className="text-sm mt-1">Klicke "Alle Steps erfassen" für Screenshots + HTML</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {capturedSteps.map(step => (
                <div key={step.step} className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-start gap-4">
                    {/* Screenshot Previews - Desktop & Mobile */}
                    <div className="flex gap-2 shrink-0">
                      {/* Desktop */}
                      <div className="w-40">
                        <p className="text-xs text-muted-foreground mb-1 text-center">Desktop</p>
                        {step.screenshotDesktop ? (
                          <img 
                            src={toPngDataUrl(step.screenshotDesktop)}
                            alt={`Step ${step.step} Desktop Screenshot`}
                            className="w-full h-24 rounded border bg-muted object-contain"
                          />
                        ) : (
                          <div className="w-full h-24 bg-muted rounded border flex items-center justify-center">
                            <Image className="w-6 h-6 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      {/* Mobile */}
                      <div className="w-16">
                        <p className="text-xs text-muted-foreground mb-1 text-center">Mobile</p>
                        {step.screenshotMobile ? (
                          <img 
                            src={toPngDataUrl(step.screenshotMobile)}
                            alt={`Step ${step.step} Mobile Screenshot`}
                            className="w-full h-24 rounded border bg-muted object-contain"
                          />
                        ) : (
                          <div className="w-full h-24 bg-muted rounded border flex items-center justify-center">
                            <Image className="w-4 h-4 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <Badge className="bg-primary">{step.step}</Badge>
                        <span className="font-medium">{step.name}</span>
                        <div className="flex gap-1 ml-auto flex-wrap">
                          {step.screenshotDesktop && (
                            <Badge variant="outline" className="text-green-600 border-green-300">
                              Desktop ✓
                            </Badge>
                          )}
                          {step.screenshotMobile && (
                            <Badge variant="outline" className="text-purple-600 border-purple-300">
                              Mobile ✓
                            </Badge>
                          )}
                          {step.html && (
                            <Badge variant="outline" className="text-blue-600 border-blue-300">
                              <FileCode className="w-3 h-3 mr-1" />
                              HTML
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                      {step.url && (
                        <p className="text-xs text-muted-foreground font-mono">{step.url}</p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!step.screenshotDesktop}
                          onClick={() => step.screenshotDesktop && downloadPng(step.screenshotDesktop, `step-${step.step}-desktop.png`)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Desktop PNG
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!step.screenshotMobile}
                          onClick={() => step.screenshotMobile && downloadPng(step.screenshotMobile, `step-${step.step}-mobile.png`)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Mobile PNG
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!step.html}
                          onClick={() => step.html && downloadHtml(step.html, `step-${step.step}.html`)}
                        >
                          <FileCode className="w-3 h-3 mr-1" />
                          HTML
                        </Button>
                      </div>
                      
                      {step.html && (
                        <details className="mt-3 text-xs">
                          <summary className="cursor-pointer text-primary hover:underline flex items-center gap-1">
                            <FileCode className="w-3 h-3" />
                            HTML anzeigen ({(step.html.length / 1024).toFixed(1)} KB)
                          </summary>
                          <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-x-auto max-h-48 whitespace-pre-wrap">
                            {step.html}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Zusätzliche Anweisungen (optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="z.B. 'Fokussiere dich besonders auf Mobile UX' oder 'Analysiere die CTA-Platzierung'"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export für AI Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4 max-h-48 overflow-y-auto">
            <pre className="text-xs whitespace-pre-wrap font-mono">
              {generatePromptTemplate()}
            </pre>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={copyPromptToClipboard} disabled={capturedSteps.length === 0}>
              <Copy className="w-4 h-4 mr-2" />
              Prompt kopieren
            </Button>
            <Button 
              variant="default" 
              onClick={downloadAsZip}
              disabled={capturedSteps.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <Package className="w-4 h-4 mr-2" />
              ZIP Download (Screenshots + HTML)
            </Button>
          </div>
          
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => window.open('https://chat.openai.com', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              ChatGPT öffnen
            </Button>
            <Button 
              variant="secondary"
              className="flex-1"
              onClick={() => window.open('https://claude.ai', '_blank')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Claude öffnen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-4">
          <h4 className="font-medium flex items-center gap-2 mb-2">
            💡 Tipps für beste Ergebnisse
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Lade die ZIP-Datei herunter und öffne die Screenshots in ChatGPT/Claude</li>
            <li>• Verwende GPT-4 Vision oder Claude 3 für visuelle Analyse</li>
            <li>• Das HTML ermöglicht detaillierte Code-Verbesserungsvorschläge</li>
            <li>• Frage nach A/B-Test-Ideen für Conversion-Optimierung</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
