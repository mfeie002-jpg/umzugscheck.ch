import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { SITE_CONFIG } from "@/data/constants";
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS, getFlowSteps, getFlowVariants, getUcFlowId, getTotalStepsAllFlows, OTHER_CALCULATORS, getFlowConfig, FlowConfig, FlowStepConfig } from "@/data/flowConfigs";
import { VARIANT_REGISTRY } from "@/components/calculator-variants";
import { supabase } from "@/integrations/supabase/client";
import { captureScreenshot as captureScreenshotService } from "@/lib/screenshot-service";
import { toast } from "sonner";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FlowVersionManager } from "./FlowVersionManager";
import { VariantWorkflowHub } from "./VariantWorkflowHub";
import AutoFlowDashboard from "./AutoFlowDashboard";
import { AddFlowDialog } from "./AddFlowDialog";
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
  Package,
  Globe,
  Search,
  History,
  Monitor,
  Smartphone,
  FileJson,
  Zap,
  Database,
  MessageSquare
} from "lucide-react";

interface StepMeta {
  url: string;
  flow: string;
  flowPath: string;
  step: number;
  stepName: string;
  dimensions: {
    desktop: string;
    mobile: string;
  };
  capturedAt: string;
  captureMode: boolean;
  hasDesktop: boolean;
  hasMobile: boolean;
  hasHtml: boolean;
  desktopSize?: number;
  mobileSize?: number;
  htmlLength?: number;
  screenshotProvider: string;
}

interface FlowStep {
  step: number;
  name: string;
  description: string;
  screenshotDesktop?: string;
  screenshotMobile?: string;
  html?: string;
  url?: string;
  meta?: StepMeta;
}

// Step configs now come from FLOW_CONFIGS - use dynamic step count per flow
// Default fallback for non-flow calculators
const DEFAULT_STEP_CONFIGS = [
  { step: 1, name: "Step 1", description: "First step" },
  { step: 2, name: "Step 2", description: "Second step" },
  { step: 3, name: "Step 3", description: "Third step" },
  { step: 4, name: "Step 4", description: "Fourth step" },
];

// Default project instructions that persist across sessions
const DEFAULT_PROJECT_INSTRUCTIONS = `SYSTEM / CORE BUILD PHILOSOPHY

Du baust dieses Projekt immer nach dieser einen Art:

Wir entwickeln das Vorzeigemodell der gesamten Branche.
Dieses Produkt ist der Archetyp, an dem sich alle anderen orientieren werden.

Unser Anspruch ist Best-Case-Scenario Only:
– technisch
– konzeptionell
– UX / UI
– Conversion
– Performance
– Skalierbarkeit
– Wartbarkeit
– Automatisierung

QUALITÄTSANSPRUCH

Es wird immer die bestmögliche technische Lösung gewählt – nicht die schnellste, nicht die bequemste, sondern die sauberste, stabilste und zukunftssicherste.

Shortcuts sind nur erlaubt, wenn sie messbar keinen Nachteil bringen.

Wenn es eine bessere Lösung gibt, wird sie gefunden.

OPTIMIERUNGS-DOGMA

Dieses Projekt basiert auf:
– echten Usern
– echtem Verhalten
– Daten
– Feedback
– Iteration
– kontinuierlicher Optimierung

Wir hören erst dann auf zu optimieren,
wenn objektiv nichts mehr zu optimieren ist.

„Gut genug" existiert hier nicht.

ARCHETYPE-REGEL

Alles, was hier entsteht, wird so gebaut,
dass man später sagen kann:

„So MUSS man das machen."

Jede Entscheidung muss erklären können:
– Warum ist das die Referenzlösung?
– Warum ist das der Standard?
– Warum kopieren andere genau das?

UX / UI / FLOW-REGEL

Die User Experience muss:
– maximal klar
– maximal intuitiv
– maximal stressfrei
– maximal logisch

Jeder Klick hat einen Zweck.
Jede Sekunde spart mentale Energie.
Jeder Flow fühlt sich „selbstverständlich richtig" an.

DENKWEISE

Denk nicht in Seiten.
Denk nicht in Features.
Denk nicht in Komponenten.

Denk in:
– Systemen
– Zusammenhängen
– Hebeln
– Skaleneffekten
– langfristiger Dominanz

BENCHMARK

Wir bauen nicht „besser als die Konkurrenz".

Wir bauen so, dass:
– Konkurrenz irrelevant wirkt
– Vergleiche aufhören
– wir der Maßstab werden

Ziel: Digital Marketing Award Winner 2026
(Strategie, UX, Conversion, Automatisierung, Innovation)

ABSCHLUSSREGEL

Wenn du etwas ausarbeitest:
– denke einen Schritt weiter als gefordert
– schlage zusätzliche Optimierungen vor
– identifiziere blinde Flecken
– nenne Dinge, die man noch besser machen kann

Handle immer so, als würdest du
das Referenzprojekt deiner Karriere bauen.`;

// Helper function to get step configs for current calculator (supports main flows + sub-variants + DB/workflow)
const getStepConfigsForCalculator = (
  calculatorValue: string,
  dbConfigs?: Array<{ flow_id: string; originalFlowId?: string; steps: FlowStepConfig[] }>
) => {
  // Check if it's a main flow variant
  if (FLOW_CONFIGS[calculatorValue]) {
    return FLOW_CONFIGS[calculatorValue].steps;
  }

  // Check if it's a sub-variant (v2a, v3a-feedback, etc.)
  const subVariantId = calculatorValue.toLowerCase().replace('-', '');
  if (SUB_VARIANT_CONFIGS[subVariantId]) {
    return SUB_VARIANT_CONFIGS[subVariantId].steps;
  }

  // Check DB/workflow configs
  if (dbConfigs?.length) {
    const db = dbConfigs.find((c) => c.flow_id === calculatorValue);
    if (db) {
      if (Array.isArray(db.steps) && db.steps.length) return db.steps;

      const explicitParent = db.originalFlowId;
      if (explicitParent && FLOW_CONFIGS[explicitParent]) return FLOW_CONFIGS[explicitParent].steps;

      const match = calculatorValue.match(/^v(\d+)[a-z]/i);
      const flowNumber = match ? parseInt(match[1], 10) : 1;
      const parentId = flowNumber === 1 ? 'umzugsofferten' : `umzugsofferten-v${flowNumber}`;
      return FLOW_CONFIGS[parentId]?.steps || DEFAULT_STEP_CONFIGS;
    }
  }

  // Check other calculators
  const otherCalc = OTHER_CALCULATORS.find((c) => c.value === calculatorValue);
  if (otherCalc) {
    return Array.from({ length: otherCalc.steps }, (_, i) => ({
      step: i + 1,
      name: `Step ${i + 1}`,
      description: `Step ${i + 1} of ${otherCalc.label}`,
    }));
  }

  return DEFAULT_STEP_CONFIGS;
};

const getDefaultPublicBaseUrl = (): string => {
  const envBase = (import.meta as any)?.env?.VITE_CAPTURE_BASE_URL as string | undefined;
  if (envBase && typeof envBase === "string") return envBase.replace(/\/$/, "");
  return SITE_CONFIG.url.replace(/\/$/, "");
};

// Helper to get uc_flow ID
// - main flows: umzugsofferten-v9 → v9
// - workflow aliases (e.g. v9a__wf__xxxx) → v9
const getUcFlowIdForCalculator = (calculatorValue: string): string | null => {
  const direct = getUcFlowId(calculatorValue);
  if (direct) return direct;

  const cleaned = calculatorValue.split("__wf__")[0];
  const match = cleaned.match(/^v(\d+)/i);
  return match ? `v${match[1]}` : null;
};
const buildCaptureUrl = (baseUrl: string, flowPath: string, step: number, ucFlowId?: string | null) => {
  // uc_flow makes flow selection deterministic (prevents default-flow mismatch)
  // uc_cb busts caches for screenshot tooling.
  // NOTE: We NO longer add uc_render=1 - it was causing blank screenshots in heavy SPA flows.
  const u = new URL(flowPath, baseUrl);
  u.searchParams.set("uc_capture", "1");
  u.searchParams.set("uc_step", String(step));
  if (ucFlowId) u.searchParams.set("uc_flow", ucFlowId);
  u.searchParams.set("uc_cb", String(Date.now()));
  return u.toString();
};

// Generate meta JSON for ChatGPT analysis
const generateStepMeta = (
  url: string, 
  flowId: string, 
  flowPath: string, 
  step: number, 
  stepName: string,
  desktopScreenshot?: string,
  mobileScreenshot?: string,
  html?: string,
  desktopDim?: string,
  mobileDim?: string
): StepMeta => ({
  url,
  flow: flowId,
  flowPath,
  step,
  stepName,
  dimensions: {
    desktop: desktopDim || "1920x1080",
    mobile: mobileDim || "390x844",
  },
  capturedAt: new Date().toISOString(),
  captureMode: true,
  hasDesktop: !!desktopScreenshot,
  hasMobile: !!mobileScreenshot,
  hasHtml: !!html,
  desktopSize: desktopScreenshot ? Math.round(desktopScreenshot.length * 0.75) : undefined,
  mobileSize: mobileScreenshot ? Math.round(mobileScreenshot.length * 0.75) : undefined,
  htmlLength: html?.length,
  screenshotProvider: "screenshotmachine",
});

// Viewport presets for step captures
// NOTE: For calculator step screenshots we default to a full viewport so the step content is visible.
const DIMENSION_PRESETS = {
  desktop: [
    { value: "1920x1080", label: "Full Viewport (1920x1080)", recommended: true },
    { value: "1920x800", label: "Extended Viewport (1920x800)" },
    { value: "1920x600", label: "Hero Only (1920x600)" },
    { value: "1920xfull", label: "Full Page (1920xfull)" },
  ],
  mobile: [
    { value: "390x844", label: "Full Viewport (390x844)", recommended: true },
    { value: "390x700", label: "Extended Viewport (390x700)" },
    { value: "390x500", label: "Hero Only (390x500)" },
    { value: "390xfull", label: "Full Page (390xfull)" },
  ],
};

const DEFAULT_DIMENSIONS = {
  desktop: DIMENSION_PRESETS.desktop[0],
  mobile: DIMENSION_PRESETS.mobile[0],
};

// Legacy constant for backward compatibility
const DIMENSIONS = {
  desktop: DEFAULT_DIMENSIONS.desktop.value,
  mobile: DEFAULT_DIMENSIONS.mobile.value,
};

// AI-generated context interface
interface AIContext {
  competitors: {
    direct: string[];
    indirect: string[];
    analysis: string;
  };
  targetAudience: {
    primary: string;
    secondary: string;
    painPoints: string[];
    motivations: string[];
  };
  businessGoals: {
    primary: string;
    secondary: string[];
    kpis: string[];
    conversionPath: string;
  };
  successMetrics: {
    conversion: {
      current_estimate: string;
      target: string;
      blockers: string[];
    };
    ux: {
      strengths: string[];
      weaknesses: string[];
    };
    trustSignals: {
      existing: string[];
      missing: string[];
    };
  };
}

interface CalculatorFlowReviewProps {
  initialFlow?: string;
}

export function CalculatorFlowReview({ initialFlow }: CalculatorFlowReviewProps = {}) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [capturedSteps, setCapturedSteps] = useState<FlowStep[]>([]);
  const [selectedCalculator, setSelectedCalculator] = useState(initialFlow || "umzugsofferten");
  const [customPrompt, setCustomPrompt] = useLocalStorage("uc-project-instructions", DEFAULT_PROJECT_INSTRUCTIONS);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [captureStatus, setCaptureStatus] = useState("");
  // Default: use a public base URL (the preview domain can show a login wall to the screenshot service)
  const [baseUrlOverride, setBaseUrlOverride] = useState(() => getDefaultPublicBaseUrl());
  
  // Dimension selection state (Hero-Only by default for faster, more reliable captures)
  const [selectedDesktopDim, setSelectedDesktopDim] = useState(DEFAULT_DIMENSIONS.desktop);
  const [selectedMobileDim, setSelectedMobileDim] = useState(DEFAULT_DIMENSIONS.mobile);
  
  // URL Discovery state
  const [discoveryUrl, setDiscoveryUrl] = useState<string>(SITE_CONFIG.url);
  const [discoveredPages, setDiscoveredPages] = useState<string[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [pageLimit, setPageLimit] = useState<number>(20);
  
  // AI Context state
  const [aiContext, setAiContext] = useState<AIContext | null>(null);
  const [isGeneratingContext, setIsGeneratingContext] = useState(false);
  
  const [dbFlowConfigs, setDbFlowConfigs] = useState<Array<{
    id: string;
    flow_id: string;
    originalFlowId?: string;
    label: string;
    path: string;
    steps: FlowStepConfig[];
    color: string;
    description: string;
    is_active: boolean;
  }>>([]);
  const [isSyncingFlows, setIsSyncingFlows] = useState(false);
  
  // Loaded variant config state (for sub-variants)
  const [loadedVariantConfig, setLoadedVariantConfig] = useState<{
    id: string;
    label: string;
    path: string;
    steps: FlowStepConfig[];
    description: string;
    component?: string;
  } | null>(null);

  // Load dynamic flow configs from database (custom_flow_configs + flow_feedback_variants)
  const syncFlowConfigs = async () => {
    setIsSyncingFlows(true);
    try {
      // Load from custom_flow_configs
      const { data: customConfigs, error: customError } = await supabase
        .from('custom_flow_configs')
        .select('*')
        .eq('is_active', true)
        .order('flow_id', { ascending: true });
      
      if (customError) throw customError;
      
      // Load from flow_feedback_variants (completed workflow variants)
      const { data: workflowVariants, error: workflowError } = await supabase
        .from('flow_feedback_variants')
        .select('*')
        .eq('status', 'done')
        .order('created_at', { ascending: false });
      
      if (workflowError) throw workflowError;
      
      const configs = (customConfigs || []).map(row => ({
        id: row.id,
        flow_id: row.flow_id,
        label: row.label,
        path: row.path,
        steps: Array.isArray(row.steps) ? (row.steps as unknown as FlowStepConfig[]) : [],
        color: row.color,
        description: row.description || '',
        is_active: row.is_active,
      }));
      
      // Add workflow variants (V9.A, V9.B, etc.) 
      const workflowConfigs = (workflowVariants || []).map(row => {
        // Parse flow_id to get flow number (e.g., "umzugsofferten-v9" -> 9)
        const flowMatch = row.flow_id.match(/v(\d+)/i);
        const flowNumber = flowMatch ? parseInt(flowMatch[1], 10) : 1;
        
        // Normalize variant_label - extract just the letter if it contains one
        // Handles: "a", "b", "c", "V3.a", "ChatGPT Pro Extended" etc.
        let variantLetter = 'a';
        const label = row.variant_label || '';
        
        // Try to extract single letter variant (a, b, c, etc.)
        const letterMatch = label.match(/^([a-z])$/i) || label.match(/\.([a-z])$/i);
        if (letterMatch) {
          variantLetter = letterMatch[1].toLowerCase();
        } else if (label.length === 1 && /[a-z]/i.test(label)) {
          variantLetter = label.toLowerCase();
        } else {
          // Generate a unique letter based on position or use first letter of name
          const nameFirst = (row.variant_name || 'a').charAt(0).toLowerCase();
          variantLetter = /[a-z]/.test(nameFirst) ? nameFirst : 'x';
        }
        
        const baseVariantId = `v${flowNumber}${variantLetter}`;
        const workflowKey = `${baseVariantId}__wf__${String(row.id).slice(0, 8)}`;

        return {
          id: row.id,
          flow_id: workflowKey,
          originalFlowId: row.flow_id, // Keep original for reference
          label: `V${flowNumber}.${variantLetter.toUpperCase()} - ${row.variant_name} (Workflow)`,
          path: `/umzugsofferten?variant=${baseVariantId}`,
          steps: [] as FlowStepConfig[], // Workflow variants inherit parent steps
          color: 'bg-emerald-500',
          description: row.variant_name || 'Workflow-created variant',
          is_active: true,
        };
      });
      
      // Keep workflow variants even if a coded variant exists.
      // We dedupe only by the computed flow_id (which is unique per workflow row).
      const seenFlowIds = new Set<string>();
      const filteredWorkflowConfigs = workflowConfigs.filter((wc) => {
        if (seenFlowIds.has(wc.flow_id)) return false;
        seenFlowIds.add(wc.flow_id);
        return true;
      });
      
      setDbFlowConfigs([...configs, ...filteredWorkflowConfigs]);
      const total = configs.length + filteredWorkflowConfigs.length;
      toast.success(`${total} dynamische Flow-Configs geladen (${filteredWorkflowConfigs.length} Workflow-Varianten)`);
    } catch (error) {
      console.error('Failed to sync flow configs:', error);
      toast.error('Fehler beim Laden der Flow-Configs');
    } finally {
      setIsSyncingFlows(false);
    }
  };

  // Initial load
  useEffect(() => {
    syncFlowConfigs();
  }, []);

  // Schnellauswahl preset URLs
  const PRESET_URLS = [
    { label: "Homepage", url: `${SITE_CONFIG.url}/` },
    { label: "Firmen", url: `${SITE_CONFIG.url}/firmen` },
    { label: "Preisrechner", url: `${SITE_CONFIG.url}/umzugsrechner` },
    { label: "Offerten", url: `${SITE_CONFIG.url}/umzugsofferten` },
    { label: "Ratgeber", url: `${SITE_CONFIG.url}/ratgeber` },
    { label: "Reinigung", url: `${SITE_CONFIG.url}/reinigungsrechner` },
    { label: "Entsorgung", url: `${SITE_CONFIG.url}/entsorgungsrechner` },
    { label: "Zürich", url: `${SITE_CONFIG.url}/umzugsfirma-zuerich` },
    { label: "Bern", url: `${SITE_CONFIG.url}/umzugsfirma-bern` },
    { label: "Basel", url: `${SITE_CONFIG.url}/umzugsfirma-basel` },
  ];

  const addPresetUrl = (url: string) => {
    if (!discoveredPages.includes(url)) {
      setDiscoveredPages(prev => [...prev, url]);
      toast.success("URL hinzugefügt");
    } else {
      toast.info("URL bereits in der Liste");
    }
  };

  const addAllPresets = () => {
    const newUrls = PRESET_URLS.map(p => p.url).filter(u => !discoveredPages.includes(u));
    if (newUrls.length > 0) {
      setDiscoveredPages(prev => [...prev, ...newUrls]);
      toast.success(`${newUrls.length} URLs hinzugefügt`);
    } else {
      toast.info("Alle URLs bereits in der Liste");
    }
  };

  const copyAllUrlsToClipboard = () => {
    if (discoveredPages.length === 0) {
      toast.error("Keine URLs zum Kopieren");
      return;
    }
    navigator.clipboard.writeText(discoveredPages.join('\n'));
    toast.success(`${discoveredPages.length} URLs kopiert`);
  };

  const removeUrl = (url: string) => {
    setDiscoveredPages(prev => prev.filter(u => u !== url));
  };

  // Build calculator options from FLOW_CONFIGS + SUB_VARIANT_CONFIGS + VARIANT_REGISTRY + DB
  const buildCalculatorOptions = () => {
    const options: { value: string; label: string; path: string; isSubVariant?: boolean; component?: string; group?: string; isDatabase?: boolean }[] = [];
    
    // Main flows from FLOW_CONFIGS
    Object.values(FLOW_CONFIGS).forEach(config => {
      options.push({
        value: config.id,
        label: config.label,
        path: config.path,
        isSubVariant: false,
        group: 'main',
      });
    });
    
    // Sub-variants from SUB_VARIANT_CONFIGS (coded components)
    // Categorize into:
    // - feedback: Primary feedback variants (v1a, v2f, v3a, ..., v9a) - one per main flow
    // - extended: Extended V9 variants (v9b, v9c, v9d) and multi variants
    // - sub: Other sub-variants
    Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
      const registryEntry = VARIANT_REGISTRY[id];
      
      // Primary feedback variants: v1a, v2f, v3a, v4f, v5f, v6a, v7a, v8a, v9a
      // Pattern: v + single digit + single letter (one per main flow)
      const isPrimaryFeedback = /^v[1-9][a-f]$/i.test(id);
      
      // Extended V9 variants: v9b, v9c, v9d
      const isExtendedV9 = /^v9[b-z]$/i.test(id);
      
      // Multi variants: multi-a, multi-b, etc.
      const isMulti = id.startsWith('multi');
      
      let group = 'sub';
      if (isPrimaryFeedback) {
        group = 'feedback';
      } else if (isExtendedV9 || isMulti) {
        group = 'extended';
      }
      
      options.push({
        value: id,
        label: config.label,
        path: config.path,
        isSubVariant: true,
        component: registryEntry?.component,
        group,
      });
    });
    
    // Dynamic flows from database (custom_flow_configs)
    dbFlowConfigs.forEach(config => {
      // Avoid duplicates with static configs
      const existsInStatic = options.some(o => o.value === config.flow_id);
      if (!existsInStatic) {
        options.push({
          value: config.flow_id,
          label: `${config.label} (DB)`,
          path: config.path,
          isSubVariant: true,
          group: 'database',
          isDatabase: true,
        });
      }
    });
    
    // Other calculators
    options.push(
      { value: "reinigung", label: "Reinigungsrechner", path: "/reinigungsrechner", group: 'other' },
      { value: "entsorgung", label: "Entsorgungsrechner", path: "/entsorgungsrechner", group: 'other' },
      { value: "firmenumzug", label: "Firmenumzug-Rechner", path: "/firmenumzug-rechner", group: 'other' },
    );
    
    return options;
  };
  
  const calculatorOptions = buildCalculatorOptions();
  const mainFlowOptions = calculatorOptions.filter(o => o.group === 'main');
  const feedbackVariantOptions = calculatorOptions.filter(o => o.group === 'feedback');
  const extendedVariantOptions = calculatorOptions.filter(o => o.group === 'extended');
  const subVariantOptions = calculatorOptions.filter(o => o.group === 'sub');
  const databaseFlowOptions = calculatorOptions.filter(o => o.group === 'database');
  const otherCalculatorOptions = calculatorOptions.filter(o => o.group === 'other');

  // Only main flow variants (V1-V9) for bulk export
  const flowVariants = calculatorOptions.filter(c => c.value.startsWith('umzugsofferten') && !c.isSubVariant);
  
  // Load variant config when a sub-variant (or DB variant) is selected
  const loadVariantConfig = () => {
    const selected = calculatorOptions.find(c => c.value === selectedCalculator);
    if (!selected) {
      toast.error("Calculator nicht gefunden");
      setLoadedVariantConfig(null);
      return;
    }

    // 1) Dynamic DB configs (custom_flow_configs + workflow variants)
    const dbConfig = dbFlowConfigs.find(c => c.flow_id === selectedCalculator);
    if (dbConfig) {
      const stepsFromDb = Array.isArray(dbConfig.steps) ? dbConfig.steps : [];

      // Workflow-Varianten haben aktuell keine eigenen Steps → erben vom Parent-Flow (z.B. umzugsofferten-v9)
      const steps = stepsFromDb.length
        ? stepsFromDb
        : (() => {
            const explicitParent = dbConfig.originalFlowId;
            if (explicitParent && FLOW_CONFIGS[explicitParent]) return FLOW_CONFIGS[explicitParent].steps;

            const match = dbConfig.flow_id.match(/^v(\d+)[a-z]$/i);
            const flowNumber = match ? parseInt(match[1], 10) : 1;
            const parentId = flowNumber === 1 ? 'umzugsofferten' : `umzugsofferten-v${flowNumber}`;
            return FLOW_CONFIGS[parentId]?.steps || [];
          })();

      if (!steps.length) {
        toast.error("Config gefunden, aber keine Steps vorhanden");
        setLoadedVariantConfig(null);
        return;
      }

      setLoadedVariantConfig({
        id: dbConfig.flow_id,
        label: dbConfig.label,
        path: dbConfig.path,
        steps,
        description: dbConfig.description,
      });
      toast.success(`${dbConfig.label} Config geladen (${steps.length} Steps)`);
      return;
    }

    // 2) Main flow - try FLOW_CONFIGS
    if (!selected.isSubVariant) {
      const mainConfig = FLOW_CONFIGS[selectedCalculator];
      if (mainConfig) {
        setLoadedVariantConfig({
          id: mainConfig.id,
          label: mainConfig.label,
          path: mainConfig.path,
          steps: mainConfig.steps,
          description: mainConfig.description,
        });
        toast.success(`${mainConfig.label} Config geladen`);
      } else {
        toast.info("Keine Config für diesen Calculator");
        setLoadedVariantConfig(null);
      }
      return;
    }

    // 3) Sub-variant (coded) - load from SUB_VARIANT_CONFIGS
    const subConfig = SUB_VARIANT_CONFIGS[selectedCalculator];
    const registryEntry = VARIANT_REGISTRY[selectedCalculator];

    if (subConfig) {
      setLoadedVariantConfig({
        id: subConfig.id,
        label: subConfig.label,
        path: subConfig.path,
        steps: subConfig.steps,
        description: subConfig.description,
        component: registryEntry?.component,
      });
      toast.success(`${subConfig.label} Config geladen (${subConfig.steps.length} Steps)`);
    } else {
      toast.error("Config nicht gefunden");
      setLoadedVariantConfig(null);
    }
  };
  
  // Check if current selection is a sub-variant
  const isSubVariantSelected = calculatorOptions.find(c => c.value === selectedCalculator)?.isSubVariant;

  // Discover top pages using firecrawl-map
  const discoverTopPages = async () => {
    if (!discoveryUrl.trim()) {
      toast.error("Bitte URL eingeben");
      return;
    }

    setIsDiscovering(true);
    try {
      let formattedUrl = discoveryUrl.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const { data, error } = await supabase.functions.invoke('firecrawl-map', {
        body: { 
          url: formattedUrl, 
          options: { 
            limit: pageLimit * 3, // Get more to filter
            includeSubdomains: false 
          } 
        }
      });

      if (error) throw error;

      const urls = data?.links || [];
      // Filter and limit
      const filteredUrls = urls
        .filter((u: string) => {
          const lower = u.toLowerCase();
          return !lower.includes('/admin') && 
                 !lower.includes('/api/') && 
                 !lower.includes('.pdf') &&
                 !lower.includes('.jpg') &&
                 !lower.includes('.png');
        })
        .slice(0, pageLimit);

      setDiscoveredPages(filteredUrls);
      toast.success(`${filteredUrls.length} Seiten entdeckt`);
    } catch (err) {
      console.error('URL discovery failed:', err);
      toast.error(`URL Discovery fehlgeschlagen: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsDiscovering(false);
    }
  };

  // Capture discovered pages (not calculator steps)
  const captureDiscoveredPages = async () => {
    if (discoveredPages.length === 0) {
      toast.error("Keine Seiten zum Erfassen. Bitte zuerst Seiten entdecken.");
      return;
    }

    setIsCapturing(true);
    setCaptureProgress(0);
    setCapturedSteps([]);

    const steps: FlowStep[] = [];
    const totalOperations = discoveredPages.length * 3; // desktop + mobile + html per page
    let completedOps = 0;

    for (let i = 0; i < discoveredPages.length; i++) {
      const pageUrl = discoveredPages[i];
      const pageName = new URL(pageUrl).pathname || '/';

      // Desktop screenshot
      setCaptureStatus(`Seite ${i + 1}/${discoveredPages.length}: Desktop Screenshot...`);
      const desktopScreenshot = await captureScreenshot(pageUrl, selectedDesktopDim.value, { fullPage: selectedDesktopDim.value.includes('full') });
      completedOps++;
      setCaptureProgress((completedOps / totalOperations) * 100);

      // Mobile screenshot
      setCaptureStatus(`Seite ${i + 1}/${discoveredPages.length}: Mobile Screenshot...`);
      const mobileScreenshot = await captureScreenshot(pageUrl, selectedMobileDim.value, { fullPage: selectedMobileDim.value.includes('full') });
      completedOps++;
      setCaptureProgress((completedOps / totalOperations) * 100);

      // Capture HTML
      setCaptureStatus(`Seite ${i + 1}/${discoveredPages.length}: HTML...`);
      const html = await captureRenderedHtml(pageUrl);
      completedOps++;
      setCaptureProgress((completedOps / totalOperations) * 100);

      const meta = generateStepMeta(
        pageUrl,
        "page",
        pageName,
        i + 1,
        pageName,
        desktopScreenshot || undefined,
        mobileScreenshot || undefined,
        html || undefined,
        selectedDesktopDim.value,
        selectedMobileDim.value
      );

      steps.push({
        step: i + 1,
        name: pageName,
        description: pageUrl,
        url: pageUrl,
        screenshotDesktop: desktopScreenshot || undefined,
        screenshotMobile: mobileScreenshot || undefined,
        html: html || undefined,
        meta,
      });
    }

    setCapturedSteps(steps);
    setCaptureStatus("");
    setIsCapturing(false);

    const successCount = steps.filter(s => s.screenshotDesktop || s.screenshotMobile || s.html).length;
    toast.success(`${successCount} von ${steps.length} Seiten erfasst`);
  };

  const captureScreenshot = async (
    url: string,
    dimension: string,
    opts: { fullPage?: boolean; delay?: number } = {}
  ): Promise<string | null> => {
    try {
      const fullPage = opts.fullPage ?? false;
      const isCapture = String(url).includes("uc_capture=1") || String(url).includes("uc_step=");
      // Umzugsofferten variants are heavy (many lazy-loaded sections). Give them more time.
      const delay = opts.delay ?? (isCapture ? 60000 : 12000);
      console.log(`Capturing screenshot: ${url} with dimension: ${dimension}`);
      const result = await captureScreenshotService({
        url,
        dimension,
        delay,
        format: "png",
        fullPage,
        // For step captures (viewport), scrolling can end up in the footer. Keep it off.
        scroll: false,
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
    const ucFlowId = selectedCalc ? getUcFlowIdForCalculator(selectedCalc.value) : null;
    const stepConfigs = getStepConfigsForCalculator(selectedCalculator, dbFlowConfigs);
    const steps: FlowStep[] = [];
    const totalOperations = stepConfigs.length * 3; // desktop + mobile + html per step
    let completedOps = 0;

    for (let i = 0; i < stepConfigs.length; i++) {
      const config = stepConfigs[i];
      // Construct URL with uc_capture mode for deterministic step rendering
      const fullUrl = buildCaptureUrl(baseUrl, calculatorPath, config.step, ucFlowId);

      // Desktop screenshot (viewport only for hero captures)
      setCaptureStatus(`Step ${config.step}: Desktop Screenshot...`);
      const desktopScreenshot = await captureScreenshot(fullUrl, selectedDesktopDim.value, { fullPage: selectedDesktopDim.value.includes('full') });
      completedOps++;
      setCaptureProgress((completedOps / totalOperations) * 100);
      
      // Mobile screenshot (viewport only for hero captures)
      setCaptureStatus(`Step ${config.step}: Mobile Screenshot...`);
      const mobileScreenshot = await captureScreenshot(fullUrl, selectedMobileDim.value, { fullPage: selectedMobileDim.value.includes('full') });
      completedOps++;
      setCaptureProgress((completedOps / totalOperations) * 100);
      
      // Capture HTML
      setCaptureStatus(`Step ${config.step}: HTML...`);
      const html = await captureRenderedHtml(fullUrl);
      completedOps++;
      setCaptureProgress((completedOps / totalOperations) * 100);
      
      // Generate meta JSON for ChatGPT analysis
      const meta = generateStepMeta(
        fullUrl,
        ucFlowId || "unknown",
        calculatorPath,
        config.step,
        config.name,
        desktopScreenshot || undefined,
        mobileScreenshot || undefined,
        html || undefined
      );
      
      steps.push({
        step: config.step,
        name: config.name,
        description: config.description,
        url: fullUrl,
        screenshotDesktop: desktopScreenshot || undefined,
        screenshotMobile: mobileScreenshot || undefined,
        html: html || undefined,
        meta,
      });
    }
    
    setCapturedSteps(steps);
    setCaptureStatus("");
    setIsCapturing(false);
    
    const successCount = steps.filter(s => s.screenshotDesktop || s.screenshotMobile || s.html).length;
    toast.success(`${successCount} von ${steps.length} Steps erfasst (Desktop + Mobile)`);
  };

  // Generate AI Context (4 critical questions for ChatGPT analysis)
  const generateAIContext = async () => {
    setIsGeneratingContext(true);
    try {
      const baseUrl = (baseUrlOverride.trim() || getDefaultPublicBaseUrl()).replace(/\/$/, "");
      const selectedCalc = calculatorOptions.find(c => c.value === selectedCalculator);
      const projectUrl = baseUrl + (selectedCalc?.path || '/umzugsofferten');
      
      // Get HTML from first captured step if available
      const htmlContent = capturedSteps[0]?.html || '';
      
      // Include loaded variant config in context generation
      const variantInfo = loadedVariantConfig ? {
        variantId: loadedVariantConfig.id,
        variantLabel: loadedVariantConfig.label,
        variantDescription: loadedVariantConfig.description,
        variantComponent: loadedVariantConfig.component,
        variantSteps: loadedVariantConfig.steps,
        isCodedVariant: !!loadedVariantConfig.component,
      } : null;
      
      const { data, error } = await supabase.functions.invoke('ai-generate-context', {
        body: {
          projectUrl,
          projectName: 'Umzugscheck.ch',
          htmlContent,
          currentDescription: 'Schweizer Umzugsvergleichsplattform - Lead-Generierung für Umzugsfirmen',
          variantInfo, // Include variant data for enriched context
        }
      });

      if (error) throw error;
      
      if (data?.success && data?.context) {
        setAiContext(data.context);
        toast.success(`AI-Kontext erfolgreich generiert${loadedVariantConfig ? ` für ${loadedVariantConfig.label}` : ''}!`);
      } else {
        throw new Error(data?.error || 'Kontext-Generierung fehlgeschlagen');
      }
    } catch (err) {
      console.error('AI context generation failed:', err);
      toast.error(err instanceof Error ? err.message : 'AI-Kontext konnte nicht generiert werden');
    } finally {
      setIsGeneratingContext(false);
    }
  };

  const generateMockSteps = () => {
    const selectedCalc = calculatorOptions.find(c => c.value === selectedCalculator);
    const calculatorPath = selectedCalc?.path || '/umzugsofferten';
    const ucFlowId = selectedCalc ? getUcFlowIdForCalculator(selectedCalc.value) : null;
    const stepConfigs = getStepConfigsForCalculator(selectedCalculator, dbFlowConfigs);
    const mockSteps: FlowStep[] = stepConfigs.map(config => {
      const url = buildCaptureUrl(getDefaultPublicBaseUrl(), calculatorPath, config.step, ucFlowId);
      const html = getMockHtml(config.step);
      return {
        step: config.step,
        name: config.name,
        description: config.description,
        url,
        html,
        meta: generateStepMeta(url, ucFlowId || "unknown", calculatorPath, config.step, config.name, undefined, undefined, html),
      };
    });
    
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
    const selectedLabel = calculatorOptions.find(c => c.value === selectedCalculator)?.label || selectedCalculator;
    const folderName = `chatgpt-package-${selectedCalculator}-${new Date().toISOString().split('T')[0]}`;
    const folder = zip.folder(folderName);

    if (!folder) return;

    // Add README + prompt
    folder.file('README.md', generateReadme());
    folder.file('chatgpt-prompt.md', generatePromptTemplate());

    // Add a machine-readable index for ChatGPT (helps it orient quickly)
    const index = {
      exportedAt: new Date().toISOString(),
      calculator: selectedLabel,
      calculatorId: selectedCalculator,
      hasAIContext: !!aiContext,
      steps: capturedSteps.map(s => ({
        step: s.step,
        name: s.name,
        description: s.description,
        url: s.url,
        files: {
          desktop: s.screenshotDesktop ? 'desktop.png' : null,
          mobile: s.screenshotMobile ? 'mobile.png' : null,
          html: s.html ? 'rendered.html' : null,
          meta: s.meta ? 'meta.json' : null,
          prompt: 'step-prompt.md',
        },
      })),
    };
    folder.file('index.json', JSON.stringify(index, null, 2));

    // Add AI Context if available
    if (aiContext) {
      folder.file('ai-context.json', JSON.stringify({
        generatedAt: new Date().toISOString(),
        context: aiContext
      }, null, 2));
    }

    // Add each step
    for (const step of capturedSteps) {
      const stepFolder = folder.folder(`step-${step.step}-${step.name.replace(/\s+/g, '-').toLowerCase()}`);
      if (!stepFolder) continue;

      // HTML (rendered outer layer)
      if (step.html) {
        stepFolder.file('rendered.html', step.html);
      }

      // Desktop screenshot
      if (step.screenshotDesktop) {
        const base64Data = step.screenshotDesktop.replace(/^data:image\/\w+;base64,/, '');
        stepFolder.file('desktop.png', base64Data, { base64: true });
      }

      // Mobile screenshot
      if (step.screenshotMobile) {
        const base64Data = step.screenshotMobile.replace(/^data:image\/\w+;base64,/, '');
        stepFolder.file('mobile.png', base64Data, { base64: true });
      }

      // Meta JSON (ChatGPT-friendly)
      if (step.meta) {
        stepFolder.file('meta.json', JSON.stringify(step.meta, null, 2));
      }

      // Step-specific prompt (so you can upload 1 folder + prompt)
      stepFolder.file('step-prompt.md', generateStepPrompt(step));
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(blob, `${folderName}.zip`);
    toast.success('ChatGPT-Package heruntergeladen (Screenshots + HTML + Meta)');
  };

  // Download metadata only (JSON + HTML, no screenshots)
  const downloadMetadataOnlyZip = async () => {
    if (capturedSteps.length === 0) {
      toast.error("Keine Steps vorhanden. Bitte erst 'Demo laden' oder Steps erfassen.");
      return;
    }

    const zip = new JSZip();
    const selectedLabel = calculatorOptions.find(c => c.value === selectedCalculator)?.label || selectedCalculator;
    const folderName = `metadata-only-${selectedCalculator}-${new Date().toISOString().split('T')[0]}`;
    const folder = zip.folder(folderName);

    if (!folder) return;

    // Add README
    folder.file('README.md', `# Metadata Export (ohne Screenshots)

## Calculator: ${selectedLabel}
## Exportiert: ${new Date().toISOString()}

Dieser Export enthält:
- **index.json** - Maschinenlesbarer Index aller Steps
- **all-steps-meta.json** - Kombinierte Metadaten aller Steps
- Pro Step-Ordner:
  - **meta.json** - Step-Metadaten (URL, Dimensionen, Timestamps)
  - **rendered.html** - Gerenderte HTML-Struktur
  - **step-prompt.md** - ChatGPT Prompt für diesen Step

**Keine Screenshots enthalten** - ideal für schnellen Export oder wenn Screenshots manuell erstellt wurden.
`);

    // Add comprehensive index
    const index = {
      exportedAt: new Date().toISOString(),
      exportType: 'metadata-only',
      calculator: selectedLabel,
      calculatorId: selectedCalculator,
      stepsCount: capturedSteps.length,
      steps: capturedSteps.map(s => ({
        step: s.step,
        name: s.name,
        description: s.description,
        url: s.url,
        hasHtml: !!s.html,
        htmlLength: s.html?.length || 0,
        meta: s.meta,
      })),
    };
    folder.file('index.json', JSON.stringify(index, null, 2));

    // Add combined meta for all steps (useful for AI analysis)
    const allStepsMeta = {
      calculator: selectedLabel,
      calculatorId: selectedCalculator,
      exportedAt: new Date().toISOString(),
      steps: capturedSteps.map(s => ({
        step: s.step,
        name: s.name,
        description: s.description,
        url: s.url,
        dimensions: s.meta?.dimensions || { desktop: '1920x1080', mobile: '390x844' },
        capturedAt: s.meta?.capturedAt,
        htmlPreview: s.html ? s.html.substring(0, 500) + '...' : null,
        htmlLength: s.html?.length || 0,
      })),
    };
    folder.file('all-steps-meta.json', JSON.stringify(allStepsMeta, null, 2));

    // Add each step (HTML + meta only)
    for (const step of capturedSteps) {
      const stepFolder = folder.folder(`step-${step.step}-${step.name.replace(/\s+/g, '-').toLowerCase()}`);
      if (!stepFolder) continue;

      // HTML (rendered outer layer)
      if (step.html) {
        stepFolder.file('rendered.html', step.html);
      }

      // Meta JSON
      if (step.meta) {
        stepFolder.file('meta.json', JSON.stringify(step.meta, null, 2));
      }

      // Step-specific prompt
      stepFolder.file('step-prompt.md', generateStepPrompt(step));
    }

    // Add combined prompt for all steps
    folder.file('analysis-prompt.md', generatePromptTemplate());

    const blob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(blob, `${folderName}.zip`);
    toast.success('Metadata-Package heruntergeladen (JSON + HTML, ohne Screenshots)');
  };

  // Download Gemini-optimized ZIP (single file structure, inline images)
  const downloadGeminiZip = async () => {
    if (capturedSteps.length === 0) {
      toast.error("Keine Steps vorhanden. Bitte erst 'Demo laden' oder Steps erfassen.");
      return;
    }

    const zip = new JSZip();
    const selectedLabel = calculatorOptions.find(c => c.value === selectedCalculator)?.label || selectedCalculator;
    const folderName = `gemini-package-${selectedCalculator}-${new Date().toISOString().split('T')[0]}`;
    const folder = zip.folder(folderName);

    if (!folder) return;

    // Gemini prefers a single comprehensive markdown file with embedded context
    let geminiPrompt = `# 🔮 Gemini Flow-Analyse: ${selectedLabel}

## Exportiert: ${new Date().toISOString()}
## Calculator: ${selectedCalculator}
## Anzahl Steps: ${capturedSteps.length}

---

## 📋 Analyse-Anweisungen

Analysiere die beigefügten Screenshots und HTML-Dateien für jeden Step. Fokussiere auf:

### 1. UX/Conversion-Analyse
- Visuelle Hierarchie und Call-to-Action Platzierung
- Mobile-First Design und Touch-Targets
- Formular-Friction und Drop-off Risiken
- Trust-Signale und Sicherheitsgefühl

### 2. Technische Qualität
- Semantic HTML Struktur
- Accessibility (WCAG 2.1)
- Performance-Indikatoren im Code

### 3. Conversion-Optimierung
- A/B-Test Vorschläge
- Quick Wins vs. größere Änderungen
- Priorisierte Empfehlungen

---

## 📂 Struktur

\`\`\`
${folderName}/
├── GEMINI-PROMPT.md (diese Datei)
├── index.json (maschinenlesbar)
├── all-screenshots/ (alle Bilder)
│   ├── step-1-desktop.png
│   ├── step-1-mobile.png
│   └── ...
├── all-html/ (alle HTML-Dateien)
│   ├── step-1.html
│   └── ...
└── combined-analysis.md (alle Steps zusammen)
\`\`\`

---

## 🎯 Steps Übersicht

`;

    // Add step summaries to prompt
    capturedSteps.forEach((step, idx) => {
      geminiPrompt += `### Step ${step.step}: ${step.name}
- **URL:** ${step.url}
- **Beschreibung:** ${step.description}
- **Screenshots:** ${step.screenshotDesktop ? '✓ Desktop' : '✗ Desktop'} | ${step.screenshotMobile ? '✓ Mobile' : '✗ Mobile'}
- **HTML:** ${step.html ? `✓ (${step.html.length} Zeichen)` : '✗'}

`;
    });

    // Add AI context if available
    if (aiContext) {
      geminiPrompt += `---

## 🧠 AI-Kontext (automatisch generiert)

### Wettbewerber
${aiContext.competitors?.direct?.join(', ') || 'Nicht definiert'}

### Zielgruppe
${aiContext.targetAudience?.primary || 'Nicht definiert'}

### Business-Ziel
${aiContext.businessGoals?.primary || 'Nicht definiert'}

### Conversion-Ziel
${aiContext.successMetrics?.conversion?.target || 'Nicht definiert'}

`;
    }

    geminiPrompt += `---

## 📝 Bitte analysiere jeden Step und gib konkrete, priorisierte Empfehlungen.

**Gewünschtes Output-Format:**
1. Executive Summary (3-5 Sätze)
2. Pro Step: Stärken, Schwächen, Quick Wins
3. Übergreifende Patterns
4. Top 5 priorisierte Maßnahmen
`;

    folder.file('GEMINI-PROMPT.md', geminiPrompt);

    // Add comprehensive index.json
    const index = {
      exportedAt: new Date().toISOString(),
      exportType: 'gemini-optimized',
      calculator: selectedLabel,
      calculatorId: selectedCalculator,
      stepsCount: capturedSteps.length,
      aiContext: aiContext || null,
      steps: capturedSteps.map(s => ({
        step: s.step,
        name: s.name,
        description: s.description,
        url: s.url,
        files: {
          desktopScreenshot: s.screenshotDesktop ? `all-screenshots/step-${s.step}-desktop.png` : null,
          mobileScreenshot: s.screenshotMobile ? `all-screenshots/step-${s.step}-mobile.png` : null,
          html: s.html ? `all-html/step-${s.step}.html` : null,
        },
        meta: s.meta,
      })),
    };
    folder.file('index.json', JSON.stringify(index, null, 2));

    // Create all-screenshots folder
    const screenshotsFolder = folder.folder('all-screenshots');
    if (screenshotsFolder) {
      for (const step of capturedSteps) {
        if (step.screenshotDesktop) {
          const base64Data = step.screenshotDesktop.replace(/^data:image\/\w+;base64,/, '');
          screenshotsFolder.file(`step-${step.step}-desktop.png`, base64Data, { base64: true });
        }
        if (step.screenshotMobile) {
          const base64Data = step.screenshotMobile.replace(/^data:image\/\w+;base64,/, '');
          screenshotsFolder.file(`step-${step.step}-mobile.png`, base64Data, { base64: true });
        }
      }
    }

    // Create all-html folder
    const htmlFolder = folder.folder('all-html');
    if (htmlFolder) {
      for (const step of capturedSteps) {
        if (step.html) {
          htmlFolder.file(`step-${step.step}.html`, step.html);
        }
      }
    }

    // Create combined analysis markdown (all steps in one file for easy upload)
    let combinedMd = `# Kombinierte Step-Analyse: ${selectedLabel}

Exportiert: ${new Date().toISOString()}

---

`;
    capturedSteps.forEach(step => {
      combinedMd += `## Step ${step.step}: ${step.name}

**URL:** ${step.url}
**Beschreibung:** ${step.description}

### Screenshots
- Desktop: \`all-screenshots/step-${step.step}-desktop.png\`
- Mobile: \`all-screenshots/step-${step.step}-mobile.png\`

### HTML-Struktur
Siehe: \`all-html/step-${step.step}.html\`

---

`;
    });
    folder.file('combined-analysis.md', combinedMd);

    const blob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(blob, `${folderName}.zip`);
    toast.success('Gemini-Package heruntergeladen (optimiert für Google Gemini)');
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

  // Export ALL flow variants at once with source code - COMPLETE with ALL STEPS
  const exportAllFlows = async () => {
    setIsExportingAll(true);
    setCaptureProgress(0);
    setCaptureStatus("Starte Export aller Flows (alle Steps)...");

    const baseUrl = (baseUrlOverride.trim() || getDefaultPublicBaseUrl()).replace(/\/$/, "");
    const zip = new JSZip();
    const exportDate = new Date().toISOString().split('T')[0];
    const rootFolder = zip.folder(`all-flows-complete-${exportDate}`);

    if (!rootFolder) {
      setIsExportingAll(false);
      toast.error("Export fehlgeschlagen");
      return;
    }

    // Fetch source code first
    setCaptureStatus("Lade Source Code...");
    const sourceFiles = await fetchSourceFiles();
    setCaptureProgress(3);

    const totalFlows = flowVariants.length;
    // Calculate total operations across all flows with their dynamic step counts
    let totalOperations = 0;
    flowVariants.forEach(flow => {
      const flowStepConfigs = getStepConfigsForCalculator(flow.value);
      totalOperations += flowStepConfigs.length * 3 + 1; // (desktop + mobile + html) * steps + info per flow
    });
    let completedOps = 0;

    const allFlowsData: Record<string, any> = {
      exportDate: new Date().toISOString(),
      baseUrl,
      flowCount: totalFlows,
      flows: {},
    };

    for (const flow of flowVariants) {
      const flowFolderName = flow.value.replace('umzugsofferten', 'v1').replace('-v', 'v');
      const flowFolder = rootFolder.folder(flowFolderName);
      if (!flowFolder) continue;

      const ucFlowId = getUcFlowIdForCalculator(flow.value);
      const flowStepConfigs = getStepConfigsForCalculator(flow.value);
      const totalSteps = flowStepConfigs.length;
      const flowStepsData: any[] = [];

      // Capture ALL steps for this flow (using dynamic step count)
      for (const stepConfig of flowStepConfigs) {
        const stepFolder = flowFolder.folder(`step-${stepConfig.step}`);
        if (!stepFolder) continue;

        const fullUrl = buildCaptureUrl(baseUrl, flow.path, stepConfig.step, ucFlowId);

        // Desktop screenshot
        setCaptureStatus(`${flow.label} Step ${stepConfig.step}/${totalSteps}: Desktop...`);
        const desktopScreenshot = await captureScreenshot(fullUrl, selectedDesktopDim.value, { 
          fullPage: selectedDesktopDim.value.includes('full') 
        });
        completedOps++;
        setCaptureProgress(3 + (completedOps / totalOperations) * 90);

        // Mobile screenshot
        setCaptureStatus(`${flow.label} Step ${stepConfig.step}/${totalSteps}: Mobile...`);
        const mobileScreenshot = await captureScreenshot(fullUrl, selectedMobileDim.value, { 
          fullPage: selectedMobileDim.value.includes('full') 
        });
        completedOps++;
        setCaptureProgress(3 + (completedOps / totalOperations) * 90);

        // HTML
        setCaptureStatus(`${flow.label} Step ${stepConfig.step}/${totalSteps}: HTML...`);
        const html = await captureRenderedHtml(fullUrl);
        completedOps++;
        setCaptureProgress(3 + (completedOps / totalOperations) * 90);

        // Save to step folder
        if (desktopScreenshot) {
          const base64Data = desktopScreenshot.replace(/^data:image\/\w+;base64,/, '');
          stepFolder.file('desktop.png', base64Data, { base64: true });
        }
        if (mobileScreenshot) {
          const base64Data = mobileScreenshot.replace(/^data:image\/\w+;base64,/, '');
          stepFolder.file('mobile.png', base64Data, { base64: true });
        }
        if (html) {
          stepFolder.file('rendered.html', html);
        }

        // Meta JSON for this step
        const stepMeta = generateStepMeta(
          fullUrl, flow.value, flow.path, stepConfig.step, stepConfig.name,
          desktopScreenshot || undefined, mobileScreenshot || undefined, html || undefined,
          selectedDesktopDim.value, selectedMobileDim.value
        );
        stepFolder.file('meta.json', JSON.stringify(stepMeta, null, 2));

        // Step-specific prompt
        stepFolder.file('step-prompt.md', generateExportStepPrompt(flow.label, stepConfig, stepMeta));

        flowStepsData.push({
          step: stepConfig.step,
          name: stepConfig.name,
          description: stepConfig.description,
          url: fullUrl,
          hasDesktop: !!desktopScreenshot,
          hasMobile: !!mobileScreenshot,
          hasHtml: !!html,
          htmlLength: html?.length || 0,
        });
      }

      // Add source code to flow folder
      const sourceCodeFolder = flowFolder.folder('source-code');
      if (sourceCodeFolder && sourceFiles && sourceFiles[flow.value]) {
        Object.entries(sourceFiles[flow.value]).forEach(([filename, content]) => {
          sourceCodeFolder.file(filename, content as string);
        });
      }

      // Create flow info JSON with all steps
      const flowInfo = {
        id: flow.value,
        name: flow.label,
        path: flow.path,
        totalSteps: totalSteps,
        steps: flowStepsData,
        hasSourceCode: !!(sourceFiles && sourceFiles[flow.value]),
        capturedAt: new Date().toISOString(),
      };
      flowFolder.file('flow-info.json', JSON.stringify(flowInfo, null, 2));

      // Flow-specific analysis prompt
      flowFolder.file('flow-prompt.md', generateSingleFlowPrompt(flow, flowStepsData));

      completedOps++;
      allFlowsData.flows[flow.value] = flowInfo;
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

    // Add comprehensive analysis prompt (updated for all steps)
    rootFolder.file('chatgpt-master-prompt.md', generateAllFlowsCompletePrompt(allFlowsData));

    // Add comparison prompt
    rootFolder.file('comparison-prompt.md', generateComparisonPrompt());

    // Add Swiss Market Analysis
    rootFolder.file('swiss-market-analysis.md', generateSwissMarketAnalysis());

    // Add Deep Research Prompt
    rootFolder.file('deep-research-prompt.md', generateDeepResearchPrompt());

    // Add README with complete structure
    rootFolder.file('README.md', generateAllFlowsReadme(allFlowsData));

    setCaptureProgress(95);
    setCaptureStatus("ZIP wird erstellt...");
    const blob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(blob, `all-flows-complete-${exportDate}.zip`);

    setCaptureProgress(100);
    setCaptureStatus("");
    setIsExportingAll(false);
    toast.success(`Alle ${totalFlows} Flows komplett exportiert!`);
  };

  // Generate prompt for a single step in export (different signature)
  const generateExportStepPrompt = (flowLabel: string, stepConfig: { step: number; name: string; description: string }, meta: StepMeta) => `# Step ${stepConfig.step}: ${stepConfig.name}
**Flow:** ${flowLabel}
**URL:** ${meta.url}
**Beschreibung:** ${stepConfig.description}

## Analyse-Aufgaben für diesen Step:
1. **Desktop UX** - Layout, Hierarchie, CTA-Sichtbarkeit
2. **Mobile UX** - Touch-Targets, Scroll, Lesbarkeit
3. **Friction-Analyse** - Was könnte User stoppen?
4. **Trust-Signale** - Vorhanden? Fehlend?
5. **Copy-Qualität** - Klarheit, Überzeugungskraft

## Gewünschte Ausgabe:
- 3 Stärken
- 3 Schwächen
- 3 konkrete Verbesserungsvorschläge (priorisiert)
`;

  // Generate prompt for a single flow (all steps)
  const generateSingleFlowPrompt = (flow: typeof flowVariants[0], stepsData: any[]) => `# Flow-Analyse: ${flow.label}
**Path:** ${flow.path}
**Erfasste Steps:** ${stepsData.length}

## Step-Übersicht:
${stepsData.map(s => `
### Step ${s.step}: ${s.name}
- URL: ${s.url}
- Desktop: ${s.hasDesktop ? '✓' : '✗'}
- Mobile: ${s.hasMobile ? '✓' : '✗'}
- HTML: ${s.hasHtml ? `✓ (${(s.htmlLength / 1024).toFixed(1)} KB)` : '✗'}
`).join('')}

## Analyse-Aufgaben:
1. **Gesamtfluss** - Ist der Flow logisch und intuitiv?
2. **Step-by-Step UX** - Analysiere jeden Step einzeln
3. **Übergänge** - Sind die Übergänge zwischen Steps klar?
4. **Mobile Experience** - Funktioniert der Flow auf Mobile gut?
5. **Conversion-Optimierung** - Wo sind die größten Friction-Points?

## Gewünschte Ausgabe:
- Flow-Score (1-10)
- Top 3 Stärken
- Top 3 Schwächen
- Top 5 priorisierte Verbesserungen
`;

  // Generate README for all flows export
  const generateAllFlowsReadme = (data: Record<string, any>) => `# Kompletter Flow-Export - Alle ${Object.keys(data.flows).length} Varianten

## Exportdatum: ${data.exportDate}
## Base URL: ${data.baseUrl}
## Steps pro Flow: ${data.stepsPerFlow}

---

## Struktur

\`\`\`
${Object.keys(data.flows).map(key => {
  const flow = data.flows[key];
  return `${key.replace('umzugsofferten', 'v1').replace('-v', 'v')}/
├── flow-info.json
├── flow-prompt.md
├── source-code/
${flow.steps.map((s: any) => `├── step-${s.step}/
│   ├── desktop.png
│   ├── mobile.png
│   ├── rendered.html
│   ├── meta.json
│   └── step-prompt.md`).join('\n')}`;
}).join('\n')}
shared/
all-flows.json
chatgpt-master-prompt.md
comparison-prompt.md
swiss-market-analysis.md
deep-research-prompt.md
README.md
\`\`\`

## Inhalt pro Step:
- **desktop.png** - Desktop Screenshot (${data.flows[Object.keys(data.flows)[0]]?.steps?.[0]?.hasDesktop ? 'verfügbar' : 'je nach Capture'})
- **mobile.png** - Mobile Screenshot
- **rendered.html** - Gerendertes HTML
- **meta.json** - Metadaten (URL, Dimensionen, Timestamp)
- **step-prompt.md** - Step-spezifischer ChatGPT Prompt

## Verwendung:
1. Lade die ZIP in ChatGPT/Claude hoch
2. Für Gesamtanalyse: Nutze \`chatgpt-master-prompt.md\`
3. Für einzelnen Flow: Nutze \`flow-prompt.md\` im Flow-Ordner
4. Für einzelnen Step: Nutze \`step-prompt.md\` im Step-Ordner
5. Für Vergleich: Nutze \`comparison-prompt.md\`

## Flow-Übersicht:
${Object.entries(data.flows).map(([key, flow]: [string, any]) => `
### ${flow.name}
- ID: ${flow.id}
- Path: ${flow.path}
- Steps: ${flow.totalSteps}
- Source Code: ${flow.hasSourceCode ? '✓' : '✗'}
`).join('')}

---
Erstellt: ${new Date().toLocaleString('de-CH')}
`;

  // Generate comprehensive prompt for all flows with all steps
  const generateAllFlowsCompletePrompt = (data: Record<string, any>) => `# Umzugscheck.ch - Komplette Flow-Analyse (Alle ${Object.keys(data.flows).length} Varianten, Alle Steps)

## Exportdatum: ${data.exportDate}
## Base URL: ${data.baseUrl}
## Steps pro Flow: ${data.stepsPerFlow}

---

Du bist ein UX-Experte und Conversion-Optimierer. Analysiere ALLE Flows mit ALLEN Steps und erstelle eine optimierte Version 10.

## Die ${Object.keys(data.flows).length} Flows mit je ${data.stepsPerFlow} Steps:

${Object.entries(data.flows).map(([key, flow]: [string, any]) => `
### ${flow.name}
- **Path:** ${flow.path}
- **Source Code:** ${flow.hasSourceCode ? '✓' : '✗'}

**Steps:**
${flow.steps.map((s: any) => `  - Step ${s.step}: ${s.name} (Desktop: ${s.hasDesktop ? '✓' : '✗'}, Mobile: ${s.hasMobile ? '✓' : '✗'}, HTML: ${s.hasHtml ? `${(s.htmlLength / 1024).toFixed(1)}KB` : '✗'})`).join('\n')}
`).join('')}

---

## Analyse-Aufgaben:

### Phase 1: Step-by-Step Analyse (für JEDEN Flow)
Für jeden der ${data.stepsPerFlow} Steps analysiere:
1. ✅ **Desktop UX** - Layout, Hierarchie, CTAs
2. 📱 **Mobile UX** - Touch, Scroll, Lesbarkeit
3. ⚡ **Friction** - Was stoppt den User?
4. 🛡️ **Trust** - Vertrauenssignale vorhanden?
5. ✍️ **Copy** - Klarheit und Überzeugungskraft

### Phase 2: Flow-Vergleich
| Flow | Step 1 | Step 2 | Step 3 | Step 4 | Gesamt |
|------|--------|--------|--------|--------|--------|
| V1   | ...    | ...    | ...    | ...    | ...    |
| V2   | ...    | ...    | ...    | ...    | ...    |
| ...  | ...    | ...    | ...    | ...    | ...    |

### Phase 3: Best Practices Extraktion
- Welcher Flow hat den besten Step 1?
- Welcher Flow hat den besten Step 2?
- Welcher Flow hat den besten Step 3?
- Welcher Flow hat den besten Step 4?

### Phase 4: V10 "Ultimate Flow" Design
Kombiniere die besten Elemente:
- Bester Step 1 von: ___
- Bester Step 2 von: ___
- Bester Step 3 von: ___
- Bester Step 4 von: ___

---

## Gewünschtes Output-Format:

### 1. Flow-Ranking (Gesamt)
| Rank | Flow | Score | Stärken | Schwächen |
|------|------|-------|---------|-----------|

### 2. Step-Ranking (Bester pro Step)
| Step | Bester Flow | Warum |
|------|-------------|-------|

### 3. Top 10 Best Practices (aus allen Flows/Steps)

### 4. V10 "Ultimate Flow" - Detailliert
- Step 1: [Beschreibung + woher übernommen]
- Step 2: [Beschreibung + woher übernommen]
- Step 3: [Beschreibung + woher übernommen]
- Step 4: [Beschreibung + woher übernommen]

### 5. Priorisierte Implementierungs-Roadmap

---

**Dateien befinden sich in den jeweiligen Flow-Ordnern unter step-1/, step-2/, step-3/, step-4/**
`;

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

  const generateReadme = () => `# ChatGPT Review Package

## Übersicht
Dieses Package enthält pro Step:
- Desktop Screenshot (desktop.png)
- Mobile Screenshot (mobile.png)
- Rendered HTML Outer Layer (rendered.html)
- Meta-JSON (meta.json) für Kontext (URL, Step, Dimensions, Timestamp)

## Inhalt
${capturedSteps.map(s => `- Step ${s.step}: ${s.name}
  - Desktop: ${s.screenshotDesktop ? '✓' : '✗'}
  - Mobile: ${s.screenshotMobile ? '✓' : '✗'}
  - HTML: ${s.html ? '✓' : '✗'}
  - Meta: ${s.meta ? '✓' : '✗'}`).join('\n')}

## Struktur
- index.json (schnelle Übersicht für ChatGPT)
- chatgpt-prompt.md (Master-Prompt)
- step-*/
  - desktop.png
  - mobile.png
  - rendered.html
  - meta.json
  - step-prompt.md

## Verwendung
1. Lade die ZIP in ChatGPT/Claude hoch.
2. Kopiere den Inhalt aus chatgpt-prompt.md.
3. Falls du nur 1 Step analysieren willst: nutze step-prompt.md im Step-Ordner.

Erstellt: ${new Date().toLocaleString('de-CH')}
`;

  const generatePromptTemplate = () => {
    // Build AI context section if available
    const aiContextSection = aiContext ? `
---

## 🎯 KRITISCHER PROJEKT-KONTEXT (AI-generiert)

### 1. Wettbewerbsanalyse
**Direkte Konkurrenten:** ${aiContext.competitors.direct.join(', ')}
**Indirekte Konkurrenten:** ${aiContext.competitors.indirect.join(', ')}
**Analyse:** ${aiContext.competitors.analysis}

### 2. Zielgruppen-Analyse
**Primäre Zielgruppe:** ${aiContext.targetAudience.primary}
**Sekundäre Zielgruppe:** ${aiContext.targetAudience.secondary}
**Pain Points:**
${aiContext.targetAudience.painPoints.map(p => `- ${p}`).join('\n')}
**Motivationen:**
${aiContext.targetAudience.motivations.map(m => `- ${m}`).join('\n')}

### 3. Business-Ziele
**Hauptziel:** ${aiContext.businessGoals.primary}
**Nebenziele:** ${aiContext.businessGoals.secondary.join(', ')}
**KPIs:**
${aiContext.businessGoals.kpis.map(k => `- ${k}`).join('\n')}
**Conversion-Pfad:** ${aiContext.businessGoals.conversionPath}

### 4. Erfolgsmetriken
**Conversion:**
- Aktuelle Schätzung: ${aiContext.successMetrics.conversion.current_estimate}
- Ziel: ${aiContext.successMetrics.conversion.target}
- Blocker: ${aiContext.successMetrics.conversion.blockers.join(', ') || 'Keine identifiziert'}

**UX-Stärken:** ${aiContext.successMetrics.ux.strengths.join(', ') || 'Analyse erforderlich'}
**UX-Schwächen:** ${aiContext.successMetrics.ux.weaknesses.join(', ') || 'Analyse erforderlich'}

**Trust-Signale vorhanden:** ${aiContext.successMetrics.trustSignals.existing.join(', ') || 'Keine identifiziert'}
**Trust-Signale fehlend:** ${aiContext.successMetrics.trustSignals.missing.join(', ') || 'Keine identifiziert'}

---
` : '';

    return `## Umzugsofferten Flow Analyse (ChatGPT Package)

Ich habe eine ZIP hochgeladen. Bitte nutze **index.json** als Inhaltsverzeichnis und analysiere die Steps anhand der Screenshots + rendered.html.

**Calculator:** ${calculatorOptions.find(c => c.value === selectedCalculator)?.label}
${aiContextSection}
### Dateien pro Step (im jeweiligen step-Ordner)
- desktop.png
- mobile.png
- rendered.html (HTML outer layer)
- meta.json (URL + Step-Kontext)
- step-prompt.md (optional)

### Flow Steps:
${capturedSteps.map(step => `
**Step ${step.step}: ${step.name}**
- URL: ${step.url || 'N/A'}
- Beschreibung: ${step.description}
- Desktop Screenshot: ${step.screenshotDesktop ? '✓ (desktop.png)' : '✗'}
- Mobile Screenshot: ${step.screenshotMobile ? '✓ (mobile.png)' : '✗'}
- HTML: ${step.html ? '✓ (rendered.html)' : '✗'}
- Meta: ${step.meta ? '✓ (meta.json)' : '✗'}
`).join('\n')}

### Analyse-Aufgaben:
1. **UX-Analyse Desktop**: Benutzerführung, Hierarchie, CTA, Conversion
2. **UX-Analyse Mobile**: Touch, Scroll, Sticky-CTAs, Lesbarkeit, Friction
3. **Design/Trust**: Seriösität, Trust-Signale, Copy, Fehlerzustände
4. **Step-Friction**: Welche Inputs/Entscheidungen bremsen?
5. **Konkrete Empfehlungen**: Priorisiert (Impact/Confidence/Effort)

### Gewünschte Ausgabe:
- Kurz-Zusammenfassung pro Step
- Priorisierte ToDos (Top 10)
- Optional: konkrete Copy-/Layout-Verbesserungen

${customPrompt ? `### Zusätzliche Anweisungen:\n${customPrompt}` : ''}`;
  };

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

  const downloadJson = (data: object, filename: string) => {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
      downloadBlob(blob, filename);
    } catch (err) {
      console.error("JSON download failed:", err);
      toast.error(
        `JSON-Download fehlgeschlagen${err instanceof Error ? `: ${err.message}` : ""}`
      );
    }
  };

  // All-in-One ZIP download for a single step
  const downloadStepZip = async (step: FlowStep) => {
    try {
      const zip = new JSZip();
      const folderName = `step-${step.step}-${step.name.replace(/\s+/g, '-').toLowerCase()}`;
      const folder = zip.folder(folderName);
      if (!folder) return;

      // Add desktop screenshot
      if (step.screenshotDesktop) {
        const base64Data = step.screenshotDesktop.replace(/^data:image\/\w+;base64,/, '');
        folder.file('desktop.png', base64Data, { base64: true });
      }

      // Add mobile screenshot
      if (step.screenshotMobile) {
        const base64Data = step.screenshotMobile.replace(/^data:image\/\w+;base64,/, '');
        folder.file('mobile.png', base64Data, { base64: true });
      }

      // Add HTML
      if (step.html) {
        folder.file('rendered.html', step.html);
      }

      // Add meta JSON (for ChatGPT analysis)
      if (step.meta) {
        folder.file('meta.json', JSON.stringify(step.meta, null, 2));
      }

      // Add ChatGPT-ready prompt
      folder.file('chatgpt-prompt.md', generateStepPrompt(step));

      const blob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(blob, `${folderName}.zip`);
      toast.success(`Step ${step.step} ZIP heruntergeladen`);
    } catch (err) {
      console.error("Step ZIP download failed:", err);
      toast.error(
        `ZIP-Download fehlgeschlagen${err instanceof Error ? `: ${err.message}` : ""}`
      );
    }
  };

  // Generate ChatGPT prompt for a single step
  const generateStepPrompt = (step: FlowStep): string => {
    return `# Step ${step.step}: ${step.name}

## Beschreibung
${step.description}

## URL
${step.url || 'N/A'}

## Analyse-Aufgaben

Analysiere diesen Calculator-Step und gib Feedback zu:

1. **UX/Usability**
   - Ist der nächste Schritt klar?
   - Sind alle Inputs verständlich?
   - Mobile-Optimierung?

2. **Visual Design**
   - Visueller Fokus richtig gesetzt?
   - CTAs prominent genug?
   - Vertrauenswürdiges Design?

3. **Conversion-Optimierung**
   - Friction Points?
   - Mögliche Verbesserungen?
   - A/B-Test-Ideen?

## Verfügbare Dateien

- \`desktop.png\` - Desktop Screenshot (${step.screenshotDesktop ? '✓' : '✗'})
- \`mobile.png\` - Mobile Screenshot (${step.screenshotMobile ? '✓' : '✗'})
- \`rendered.html\` - Gerenderte HTML-Seite (${step.html ? `${(step.html.length / 1024).toFixed(1)} KB` : '✗'})
- \`meta.json\` - Capture Metadaten (${step.meta ? '✓' : '✗'})

## Metadaten

\`\`\`json
${JSON.stringify(step.meta || {}, null, 2)}
\`\`\`
`;
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
              <div className="flex gap-2">
                <Select value={selectedCalculator} onValueChange={setSelectedCalculator}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px]">
                    {/* Main Flows */}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Haupt-Flows (V1-V9)</div>
                    {mainFlowOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                    
                    {/* Feedback Variants */}
                    {feedbackVariantOptions.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2 flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          Feedback-Varianten (V1a-V9a)
                        </div>
                        {feedbackVariantOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </>
                    )}
                    
                    {/* Extended V9 Variants (V9b, V9c, V9d, Multi) */}
                    {extendedVariantOptions.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Erweiterte V9 Varianten
                        </div>
                        {extendedVariantOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </>
                    )}
                    
                    {/* Database Flows */}
                    {databaseFlowOptions.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2 flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          Dynamische Varianten (DB)
                        </div>
                        {databaseFlowOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </>
                    )}
                    
                    {/* Other Calculators */}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">Andere Rechner</div>
                    {otherCalculatorOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={syncFlowConfigs}
                  disabled={isSyncingFlows}
                  title="Flow-Configs aus Datenbank synchronisieren"
                >
                  <RefreshCw className={`h-4 w-4 ${isSyncingFlows ? 'animate-spin' : ''}`} />
                </Button>
                <AddFlowDialog onFlowAdded={syncFlowConfigs} />
              </div>
              {databaseFlowOptions.length > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {databaseFlowOptions.length} dynamische Varianten aus DB geladen
                </p>
              )}
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
          </div>
          
          {/* Variant Config Loading Section */}
          <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-primary" />
                <span className="font-medium">Variant-Daten laden</span>
                {isSubVariantSelected && (
                  <Badge variant="secondary" className="text-xs">Coded Component</Badge>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadVariantConfig}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Config laden
              </Button>
            </div>
            
            {loadedVariantConfig && (
              <div className="bg-background p-3 rounded-lg border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{loadedVariantConfig.label}</span>
                  <Badge variant="outline">{loadedVariantConfig.steps.length} Steps</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{loadedVariantConfig.description}</p>
                {loadedVariantConfig.component && (
                  <p className="text-xs font-mono text-primary">
                    Component: {loadedVariantConfig.component}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {loadedVariantConfig.steps.map((step) => (
                    <Badge key={step.step} variant="secondary" className="text-xs">
                      {step.step}. {step.name}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
                  ✓ Diese Config wird für Screenshots, Kontext-Generierung und Version speichern verwendet
                </p>
              </div>
            )}
          </div>
          
          {/* Dimension Selection */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Desktop Dimension
              </label>
              <Select
                value={selectedDesktopDim.value}
                onValueChange={(val) => {
                  const preset = DIMENSION_PRESETS.desktop.find(p => p.value === val);
                  if (preset) setSelectedDesktopDim(preset);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIMENSION_PRESETS.desktop.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.label} {preset.recommended && "⭐"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Mobile Dimension
              </label>
              <Select
                value={selectedMobileDim.value}
                onValueChange={(val) => {
                  const preset = DIMENSION_PRESETS.mobile.find(p => p.value === val);
                  if (preset) setSelectedMobileDim(preset);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIMENSION_PRESETS.mobile.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.label} {preset.recommended && "⭐"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="col-span-2 text-xs text-muted-foreground">
              ⭐ Hero Only empfohlen: Schnellere, zuverlässigere Captures – erfasst nur den oberen Bereich mit Calculator.
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

      {/* URL Discovery Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            URL Discovery - Seiten automatisch entdecken
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Gib eine Domain ein um automatisch die Top-Seiten zu entdecken und Screenshots zu erfassen.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Domain / URL</label>
              <Input
                value={discoveryUrl}
                onChange={(e) => setDiscoveryUrl(e.target.value)}
                placeholder="https://example.com"
                inputMode="url"
              />
            </div>
            
            <div className="w-32">
              <label className="text-sm font-medium mb-2 block">Anzahl</label>
              <Select value={String(pageLimit)} onValueChange={(v) => setPageLimit(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Seiten</SelectItem>
                  <SelectItem value="10">10 Seiten</SelectItem>
                  <SelectItem value="20">20 Seiten</SelectItem>
                  <SelectItem value="50">50 Seiten</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end gap-2">
              <Button 
                onClick={discoverTopPages}
                disabled={isDiscovering || isCapturing || !discoveryUrl.trim()}
                variant="outline"
              >
                {isDiscovering ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {isDiscovering ? 'Suche...' : 'Seiten entdecken'}
              </Button>
              
              <Button 
                onClick={captureDiscoveredPages}
                disabled={isCapturing || discoveredPages.length === 0}
              >
                {isCapturing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 mr-2" />
                )}
                {isCapturing ? 'Erfasse...' : `${discoveredPages.length} Seiten erfassen`}
              </Button>
            </div>
          </div>

          {/* Schnellauswahl */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Schnellauswahl</label>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={addAllPresets}
                className="text-xs h-7"
              >
                Alle hinzufügen
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_URLS.map((preset) => (
                <Button
                  key={preset.url}
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() => addPresetUrl(preset.url)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Discovered Pages List */}
          {discoveredPages.length > 0 && (
            <div className="border rounded-lg p-3 bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{discoveredPages.length} Seiten in der Liste</span>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={copyAllUrlsToClipboard}
                    className="h-7"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Kopieren
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setDiscoveredPages([])}
                    className="h-7"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {discoveredPages.map((url, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-mono text-muted-foreground py-1 border-b border-border/50 last:border-0">
                    <Badge variant="outline" className="w-6 justify-center shrink-0">{i + 1}</Badge>
                    <span className="truncate flex-1">{url}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0 shrink-0"
                      onClick={() => window.open(url, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0 shrink-0 text-destructive hover:text-destructive"
                      onClick={() => removeUrl(url)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                          Desktop
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!step.screenshotMobile}
                          onClick={() => step.screenshotMobile && downloadPng(step.screenshotMobile, `step-${step.step}-mobile.png`)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Mobile
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
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!step.meta}
                          onClick={() => step.meta && downloadJson(step.meta, `step-${step.step}-meta.json`)}
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          Meta-JSON
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          disabled={!step.screenshotDesktop && !step.screenshotMobile && !step.html}
                          onClick={() => downloadStepZip(step)}
                        >
                          <Package className="w-3 h-3 mr-1" />
                          All-in-One ZIP
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

      {/* Custom Prompt - Persisted to LocalStorage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Zusätzliche Anweisungen (Projekt-weit gespeichert)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="z.B. 'Fokussiere dich besonders auf Mobile UX' oder 'Analysiere die CTA-Platzierung'"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={8}
            className="font-mono text-xs"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              ✅ Automatisch gespeichert • Gilt für alle Seiten & Exporte
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCustomPrompt(DEFAULT_PROJECT_INSTRUCTIONS);
                  toast.success("Standard-Anweisungen wiederhergestellt");
                }}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(customPrompt);
                  toast.success("Anweisungen kopiert!");
                }}
              >
                <Copy className="h-3 w-3 mr-1" />
                Kopieren
              </Button>
            </div>
          </div>
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
          {/* AI Context Generation Section */}
          <div className="rounded-lg border-2 border-dashed border-primary/30 p-4 bg-primary/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI-Kontext für vollständige Analyse
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Generiert automatisch: Wettbewerber, Zielgruppe, Business-Ziele, Erfolgsmetriken
                </p>
              </div>
              <Button 
                onClick={generateAIContext}
                disabled={isGeneratingContext}
                variant={aiContext ? "outline" : "default"}
                size="sm"
              >
                {isGeneratingContext ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generiere...
                  </>
                ) : aiContext ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Neu generieren
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Kontext generieren
                  </>
                )}
              </Button>
            </div>
            
            {aiContext && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="rounded-md bg-background p-3 border">
                  <h5 className="font-medium text-xs text-primary mb-2 flex items-center gap-1">
                    🏢 Wettbewerber
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    {aiContext.competitors.direct.slice(0, 3).join(', ')}
                  </p>
                </div>
                <div className="rounded-md bg-background p-3 border">
                  <h5 className="font-medium text-xs text-primary mb-2 flex items-center gap-1">
                    👥 Zielgruppe
                  </h5>
                  <p className="text-xs text-muted-foreground truncate">
                    {aiContext.targetAudience.primary}
                  </p>
                </div>
                <div className="rounded-md bg-background p-3 border">
                  <h5 className="font-medium text-xs text-primary mb-2 flex items-center gap-1">
                    🎯 Business-Ziel
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    {aiContext.businessGoals.primary}
                  </p>
                </div>
                <div className="rounded-md bg-background p-3 border">
                  <h5 className="font-medium text-xs text-primary mb-2 flex items-center gap-1">
                    📊 Conversion-Ziel
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    {aiContext.successMetrics.conversion.current_estimate} → {aiContext.successMetrics.conversion.target}
                  </p>
                </div>
              </div>
            )}
            
            {!aiContext && !isGeneratingContext && (
              <p className="text-xs text-amber-600 mt-2">
                ⚠️ Ohne AI-Kontext kann ChatGPT nur eine oberflächliche Analyse durchführen. Klicke auf "Kontext generieren" für beste Ergebnisse.
              </p>
            )}
          </div>

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
              ZIP Download (alles)
            </Button>
            <Button 
              variant="default" 
              onClick={downloadGeminiZip}
              disabled={capturedSteps.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Package className="w-4 h-4 mr-2" />
              ZIP für Gemini
            </Button>
            <Button 
              variant="outline" 
              onClick={downloadMetadataOnlyZip}
              disabled={capturedSteps.length === 0}
            >
              <FileJson className="w-4 h-4 mr-2" />
              Nur Metadata (JSON + HTML)
            </Button>
          </div>
          
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => window.open('https://chat.openai.com', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              ChatGPT
            </Button>
            <Button 
              variant="secondary"
              className="flex-1"
              onClick={() => window.open('https://claude.ai', '_blank')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Claude
            </Button>
            <Button 
              variant="secondary"
              className="flex-1"
              onClick={() => window.open('https://gemini.google.com', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Gemini
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Flow Overview Export Section */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Flow-Überblick & Meta-Analyse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Exportiere jeden Flow einzeln für tiefere Analyse, oder generiere einen Meta-Analyse Prompt für übergreifende Patterns.
          </p>

          {/* Flow Grid with Export Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {flowVariants.map((flow) => (
              <div 
                key={flow.value}
                className={`border rounded-lg p-3 transition-colors ${
                  selectedCalculator === flow.value 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{flow.label}</span>
                  {flow.value === 'umzugsofferten-v9' && (
                    <Badge className="bg-amber-500">⭐</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={selectedCalculator === flow.value ? "default" : "outline"}
                    className="flex-1 h-8 text-xs"
                    onClick={() => {
                      setSelectedCalculator(flow.value);
                      toast.success(`${flow.label} ausgewählt`);
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Auswählen
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => window.open(flow.path, '_blank')}
                    title="In neuem Tab öffnen"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Meta Analysis Prompt Generator */}
          <div className="border-t pt-4">
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Meta-Analyse Prompt
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Nachdem du jeden Flow einzeln analysiert hast, nutze diesen Prompt um übergreifende Patterns zu erkennen.
            </p>
            <div className="bg-muted rounded-lg p-4 max-h-48 overflow-y-auto">
              <pre className="text-xs whitespace-pre-wrap font-mono">
{`# Meta-Analyse: Alle ${flowVariants.length} Umzugsofferten Flows

Du hast bereits ${flowVariants.length} verschiedene Flow-Varianten für Umzugsofferten analysiert:

${flowVariants.map((f, i) => `${i + 1}. ${f.label}`).join('\n')}

## Aufgabe

Analysiere die übergreifenden Patterns und beantworte:

### 1. Conversion-Patterns
- Welche UI-Elemente funktionieren konsistent gut/schlecht?
- Welche Step-Anzahl zeigt beste Conversion-Raten?
- Gibt es optimale Formular-Längen?

### 2. UX-Patterns  
- Welche Navigation-Patterns sind am effektivsten?
- Wie wirkt sich Vertrauensbildung auf Conversion aus?
- Mobile vs Desktop: Welche Anpassungen sind kritisch?

### 3. Empfehlungen
- Welche 3 Elements sollten ALLE Flows haben?
- Was sollte KEIN Flow haben?
- Welcher Flow ist der beste Ausgangspunkt für V10?

### 4. V10 Konzept
Basierend auf allen Erkenntnissen:
- Skizziere den idealen "V10" Flow
- Kombiniere die besten Elemente
- Adressiere die häufigsten Schwächen`}
              </pre>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={() => {
                  const metaPrompt = `# Meta-Analyse: Alle ${flowVariants.length} Umzugsofferten Flows

Du hast bereits ${flowVariants.length} verschiedene Flow-Varianten für Umzugsofferten analysiert:

${flowVariants.map((f, i) => `${i + 1}. ${f.label}`).join('\n')}

## Aufgabe

Analysiere die übergreifenden Patterns und beantworte:

### 1. Conversion-Patterns
- Welche UI-Elemente funktionieren konsistent gut/schlecht?
- Welche Step-Anzahl zeigt beste Conversion-Raten?
- Gibt es optimale Formular-Längen?

### 2. UX-Patterns  
- Welche Navigation-Patterns sind am effektivsten?
- Wie wirkt sich Vertrauensbildung auf Conversion aus?
- Mobile vs Desktop: Welche Anpassungen sind kritisch?

### 3. Empfehlungen
- Welche 3 Elements sollten ALLE Flows haben?
- Was sollte KEIN Flow haben?
- Welcher Flow ist der beste Ausgangspunkt für V10?

### 4. V10 Konzept
Basierend auf allen Erkenntnissen:
- Skizziere den idealen "V10" Flow
- Kombiniere die besten Elemente
- Adressiere die häufigsten Schwächen`;
                  navigator.clipboard.writeText(metaPrompt);
                  toast.success('Meta-Analyse Prompt kopiert');
                }}
              >
                <Copy className="w-3 h-3 mr-1" />
                Prompt kopieren
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open('https://chat.openai.com', '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                ChatGPT
              </Button>
            </div>
          </div>

          {/* Workflow Tip */}
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-sm">
            <strong className="text-blue-700 dark:text-blue-300">💡 Empfohlener Workflow:</strong>
            <ol className="mt-2 space-y-1 text-muted-foreground">
              <li>1. Wähle einen Flow aus der Liste oben</li>
              <li>2. Klicke "Alle Steps erfassen" → "ZIP Download"</li>
              <li>3. Lade ZIP in ChatGPT hoch für detaillierte Analyse</li>
              <li>4. Wiederhole für alle 9 Flows</li>
              <li>5. Nutze den Meta-Analyse Prompt für übergreifende Erkenntnisse</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Variant Workflow Hub */}
      <VariantWorkflowHub />

      {/* Version Manager */}
      <FlowVersionManager 
        flowId={selectedCalculator} 
        currentSteps={capturedSteps}
        variantConfig={loadedVariantConfig}
      />

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
            <li>• Speichere Versionen mit AI Feedback für spätere Vergleiche</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
