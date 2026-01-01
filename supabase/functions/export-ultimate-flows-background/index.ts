import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import JSZip from 'https://esm.sh/jszip@3.10.1';

// Declare EdgeRuntime for background tasks
declare const EdgeRuntime: {
  waitUntil: (promise: Promise<unknown>) => void;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UltimateFlowStep {
  number: number;
  name: string;
  sourceElements?: string[];
  features?: string[];
  archetypeValue?: Record<string, string>;
}

interface UltimateFlowData {
  id: string;
  flow_id: string;
  variant_name: string;
  variant_label: string;
  status: string;
  created_at: string;
  result_json: {
    ultimateFlow?: {
      name?: string;
      flowCode?: string;
      description?: string;
      expectedScore?: number;
      expectedConversionLift?: string;
      steps?: UltimateFlowStep[];
      keyFeatures?: Array<{
        feature: string;
        sourceFlow: string;
        implementation: string;
        impact: string;
      }>;
    };
    implementationPlan?: {
      phase1?: { name: string; duration: string; tasks: string[] };
      phase2?: { name: string; duration: string; tasks: string[] };
      phase3?: { name: string; duration: string; tasks: string[] };
    };
    successMetrics?: {
      targetScore?: number;
      conversionGoal?: string;
      archetypeCoverage?: Record<string, number>;
      kpis?: Array<{ metric: string; current: string; target: string }>;
    };
  } | null;
}

interface ExportRequest {
  jobId: string;
  flowIds?: string[]; // specific flows to export, or all if not provided
  baseUrl: string;
  captureDesktop?: boolean;
  captureMobile?: boolean;
}

// ============================================================================
// PROMPT GENERATORS
// ============================================================================

function formatArchetype(key: string): string {
  const map: Record<string, string> = {
    securitySeeker: '🛡️ Security Seeker',
    efficiencyMaximizer: '⚡ Efficiency Maximizer',
    valueHunter: '💰 Value Hunter',
    overwhelmedParent: '🏠 Overwhelmed Parent',
  };
  return map[key] || key;
}

function generateBuildPrompt(flow: UltimateFlowData): string {
  const data = flow.result_json;
  if (!data?.ultimateFlow) return '// Keine Ultimate Flow Daten verfügbar';
  
  const uf = data.ultimateFlow;
  const plan = data.implementationPlan;
  
  let prompt = `# 🚀 LOVABLE BUILD PROMPT: ${uf.name || flow.variant_name}

## Projektübersicht
${uf.description || 'Ein optimierter Umzugs-Offerten-Funnel für die Schweiz.'}

**Ziel-Score:** ${uf.expectedScore || 95}/100
**Erwartete Conversion-Steigerung:** ${uf.expectedConversionLift || '+30%'}
**Flow-Code:** ${uf.flowCode || 'ultimate-flow'}

---

## Technische Anforderungen

Erstelle einen mehrstufigen Umzugs-Offerten-Funnel mit:
- **Framework:** React + TypeScript + Tailwind CSS
- **Design:** Mobile-First, Touch-Targets mindestens 48x48px
- **Lokalisierung:** Schweizer Deutsch (de-CH), CHF Preise
- **Responsive:** Optimiert für alle Bildschirmgrössen

---

## Flow-Struktur (${uf.steps?.length || 0} Steps)

`;

  if (uf.steps && uf.steps.length > 0) {
    uf.steps.forEach((step, idx) => {
      prompt += `### Step ${step.number || idx + 1}: ${step.name}\n\n`;
      if (step.features && step.features.length > 0) {
        prompt += `**Implementiere diese Features:**\n`;
        step.features.forEach(f => { prompt += `- ${f}\n`; });
      }
      if (step.archetypeValue) {
        prompt += `\n**Archetypen-Optimierung:**\n`;
        Object.entries(step.archetypeValue).forEach(([archetype, value]) => {
          prompt += `- ${formatArchetype(archetype)}: ${value}\n`;
        });
      }
      prompt += `\n`;
    });
  }

  if (uf.keyFeatures && uf.keyFeatures.length > 0) {
    prompt += `---\n\n## Key Features (KRITISCH)\n\n`;
    uf.keyFeatures.forEach((feature, idx) => {
      prompt += `### ${idx + 1}. ${feature.feature}
- **Implementation:** ${feature.implementation}
- **Impact:** ${feature.impact}

`;
    });
  }

  if (plan) {
    prompt += `---\n\n## Implementation Roadmap\n\n`;
    if (plan.phase1) {
      prompt += `### Phase 1: ${plan.phase1.name} (${plan.phase1.duration})\n`;
      plan.phase1.tasks?.forEach(t => { prompt += `- [ ] ${t}\n`; });
      prompt += `\n`;
    }
    if (plan.phase2) {
      prompt += `### Phase 2: ${plan.phase2.name} (${plan.phase2.duration})\n`;
      plan.phase2.tasks?.forEach(t => { prompt += `- [ ] ${t}\n`; });
      prompt += `\n`;
    }
    if (plan.phase3) {
      prompt += `### Phase 3: ${plan.phase3.name} (${plan.phase3.duration})\n`;
      plan.phase3.tasks?.forEach(t => { prompt += `- [ ] ${t}\n`; });
      prompt += `\n`;
    }
  }

  prompt += `---

## Design-Richtlinien

1. **Farben:** Schweizer Corporate-Blau (#0066CC) als Primärfarbe, Trust-Grün (#00A651) für Erfolg
2. **Typography:** Klare, lesbare Schriften (min. 16px auf Mobile)
3. **Spacing:** Grosszügige Abstände für Touch-Bedienung (min. 12px)
4. **Trust-Elemente:** ASTAG-Siegel, TÜV, Google Reviews an strategischen Punkten
5. **Progress:** Klare Fortschrittsanzeige "Schritt X von Y"
6. **CTA:** Auffällige, kontrastreiche Call-to-Action Buttons (min. 48px hoch)

## Spezielle Anforderungen

- Swiss Post PLZ-API für Adress-Autovervollständigung
- Echtzeit-Preisschätzung basierend auf Eingaben
- Bundle-Pricing mit 3 Optionen (Basis, Komfort, Premium)
- Firmen-Matching basierend auf Region und Services
- Mobile-optimierte Formularfelder mit grossen Touch-Targets
`;

  return prompt;
}

function generateAnalysePrompt(flow: UltimateFlowData): string {
  const data = flow.result_json;
  if (!data?.ultimateFlow) return '// Keine Ultimate Flow Daten verfügbar';
  
  const uf = data.ultimateFlow;
  const metrics = data.successMetrics;
  
  let prompt = `# 🔍 CHATGPT ANALYSE PROMPT: ${uf.name || flow.variant_name}

Du bist ein UX/Conversion-Experte für Schweizer B2C-Plattformen. Analysiere diesen Umzugs-Offerten-Funnel.

## Deine Aufgabe

Ich habe diesen Flow implementiert und brauche dein Feedback. Analysiere die beigefügten Screenshots (Mobile + Desktop) und HTML-Dateien.

## Kontext

**Flow-Name:** ${uf.name || flow.variant_name}
**Ziel-Score:** ${uf.expectedScore || 95}/100
**Erwartete Conversion-Lift:** ${uf.expectedConversionLift || '+30%'}
**Anzahl Steps:** ${uf.steps?.length || 0}

## Zu prüfende Aspekte

### 1. Mobile-First UX (40% Gewichtung)
- Sind alle Touch-Targets mindestens 48x48px?
- Funktioniert die Swipe-Navigation?
- Ist die Schrift gross genug (min. 16px)?
- Gibt es horizontales Scrolling (sollte es nicht)?

### 2. Trust & Credibility (25% Gewichtung)
- Sind ASTAG/TÜV/Google-Siegel sichtbar?
- Gibt es Social Proof (Reviews, Anzahl Anfragen)?
- Werden Garantien kommuniziert?

### 3. Conversion-Optimierung (20% Gewichtung)
- Ist der CTA prominent und klar?
- Gibt es eine klare Fortschrittsanzeige?
- Werden Preise/Vorteile früh kommuniziert?
- Ist die Formular-Länge angemessen?

### 4. Archetypen-Abdeckung (15% Gewichtung)
`;

  if (metrics?.archetypeCoverage) {
    prompt += `\n**Geplante Abdeckung:**\n`;
    Object.entries(metrics.archetypeCoverage).forEach(([arch, score]) => {
      prompt += `- ${formatArchetype(arch)}: ${score}%\n`;
    });
  }

  prompt += `

## Erwartete Key Features

Prüfe ob diese Features korrekt implementiert sind:

`;

  if (uf.keyFeatures) {
    uf.keyFeatures.forEach((f, i) => {
      prompt += `${i + 1}. **${f.feature}**
   - Erwartet: ${f.implementation}
   - Impact: ${f.impact}
   
`;
    });
  }

  prompt += `## Dein Output

Gib mir:

1. **Overall Score (0-100)** mit kurzer Begründung
2. **Top 3 Stärken** - Was funktioniert besonders gut?
3. **Top 3 Probleme** - Was muss dringend gefixt werden?
4. **Quick Wins** - 3 Verbesserungen die unter 1h dauern
5. **Archetypen-Check** - Wird jeder der 4 Typen gut bedient?

## Format

Antworte strukturiert mit Überschriften. Sei konkret mit Zeilen/Elementen die du meinst.
Nutze die Screenshots und HTML für deine Analyse.

---

**Beigefügte Dateien:**
- Screenshots Mobile (375px)
- Screenshots Desktop (1920px)
- HTML-Snapshots
- Flow-Konfiguration (JSON)
`;

  return prompt;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

// ============================================================================
// SCREENSHOT CAPTURE WITH RETRY
// ============================================================================

async function captureScreenshotWithRetry(
  supabase: any,
  url: string,
  dimension: string,
  maxRetries: number = 3
): Promise<string | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Screenshot attempt ${attempt}/${maxRetries}: ${url} @ ${dimension}`);
      
      const { data, error } = await supabase.functions.invoke('capture-screenshot', {
        body: {
          url,
          dimension,
          format: 'png',
          delay: 12000, // Slightly longer delay
          fullPage: false,
          scroll: false,
          noCache: true,
        },
      });

      if (error) {
        console.error(`Screenshot error (attempt ${attempt}):`, error);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 3000 * attempt)); // Exponential backoff
          continue;
        }
        return null;
      }
      
      if (!data?.image) {
        console.error(`No image data (attempt ${attempt})`);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 3000 * attempt));
          continue;
        }
        return null;
      }

      // Extract base64 from data URL if present (format: "data:image/png;base64,...")
      const imageData = data.image;
      if (imageData.startsWith('data:')) {
        const base64Match = imageData.match(/^data:image\/\w+;base64,(.+)$/);
        if (base64Match) {
          console.log(`Screenshot captured successfully on attempt ${attempt}`);
          return base64Match[1];
        }
      }
      
      // Already pure base64
      console.log(`Screenshot captured successfully on attempt ${attempt}`);
      return imageData;
    } catch (e) {
      console.error(`Screenshot capture failed (attempt ${attempt}):`, e);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 3000 * attempt));
      }
    }
  }
  
  console.error(`Screenshot failed after ${maxRetries} attempts: ${url}`);
  return null;
}

async function captureHtml(supabase: any, url: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('capture-rendered-html', {
      body: { url, onlyMainContent: false }
    });
    
    if (error || !data?.data?.html) {
      console.error('HTML capture error:', error);
      return null;
    }
    
    return data.data.html;
  } catch (e) {
    console.error('HTML capture failed:', e);
    return null;
  }
}

// ============================================================================
// MAIN EXPORT LOGIC
// ============================================================================

async function runExport(
  supabase: any,
  jobId: string,
  flows: UltimateFlowData[],
  baseUrl: string,
  captureDesktop: boolean,
  captureMobile: boolean
): Promise<void> {
  console.log(`Starting background export for ${flows.length} flows`);
  
  try {
    // Update job status
    await supabase
      .from('export_jobs')
      .update({
        status: 'processing',
        started_at: new Date().toISOString(),
        progress: 0,
        progress_message: `Exportiere ${flows.length} Ultimate Flows...`,
      })
      .eq('id', jobId);

    const zip = new JSZip();
    const timestamp = new Date().toISOString().split('T')[0];
    const rootFolder = zip.folder(`ultimate-flows-export-${timestamp}`);
    if (!rootFolder) throw new Error('Could not create ZIP folder');

    let processedFlows = 0;
    const totalFlows = flows.length;

    for (const flow of flows) {
      const flowName = flow.variant_name.toLowerCase().replace(/\s+/g, '-');
      const flowFolder = rootFolder.folder(flowName);
      if (!flowFolder) continue;

      console.log(`Processing flow: ${flow.variant_name}`);

      // Update progress
      await supabase
        .from('export_jobs')
        .update({
          progress: Math.round((processedFlows / totalFlows) * 100),
          progress_message: `Exportiere: ${flow.variant_name}...`,
        })
        .eq('id', jobId);

      // 1. Generate prompts
      const buildPrompt = generateBuildPrompt(flow);
      const analysePrompt = generateAnalysePrompt(flow);
      
      const promptsFolder = flowFolder.folder('prompts');
      promptsFolder?.file('01_BUILD_PROMPT.md', buildPrompt);
      promptsFolder?.file('02_ANALYSE_PROMPT.md', analysePrompt);
      promptsFolder?.file('00_README.md', `# Prompts für ${flow.variant_name}

## Reihenfolge

1. **01_BUILD_PROMPT.md** - Nutze diesen Prompt in Lovable um den Flow zu bauen
2. **02_ANALYSE_PROMPT.md** - Nutze diesen Prompt in ChatGPT um Feedback zum fertigen Flow zu erhalten
`);

      // 2. Save JSON data
      const jsonFolder = flowFolder.folder('data');
      jsonFolder?.file('flow-config.json', JSON.stringify(flow.result_json, null, 2));
      jsonFolder?.file('meta.json', JSON.stringify({
        id: flow.id,
        flowId: flow.flow_id,
        name: flow.variant_name,
        label: flow.variant_label,
        status: flow.status,
        createdAt: flow.created_at,
        exportedAt: new Date().toISOString(),
      }, null, 2));

      // 3. Generate step URLs - use baseUrl correctly
      // baseUrl may already contain the full path (e.g., https://example.com/umzugsofferten-v5)
      // or just the domain (e.g., https://example.com)
      const steps = flow.result_json?.ultimateFlow?.steps || [];
      const flowCode = flow.result_json?.ultimateFlow?.flowCode || 'ultimate-v7';
      
      // Determine the correct base for step URLs
      let stepBaseUrl = baseUrl;
      // If baseUrl doesn't contain '/umzugsofferten', add a default path
      if (!baseUrl.includes('/umzugsofferten')) {
        stepBaseUrl = `${baseUrl}/umzugsofferten?variant=${flowCode}`;
      }
      // Determine separator (? or &) based on whether URL already has query params
      const separator = stepBaseUrl.includes('?') ? '&' : '?';
      
      const stepUrls = steps.map((step, idx) => ({
        name: step.name,
        number: step.number || idx + 1,
        url: `${stepBaseUrl}${separator}uc_capture=1&uc_step=${idx + 1}&uc_cb=${Date.now()}`,
      }));
      jsonFolder?.file('step-urls.json', JSON.stringify(stepUrls, null, 2));

      // 4. Capture screenshots
      const screenshotsFolder = flowFolder.folder('screenshots');
      const mobileFolder = screenshotsFolder?.folder('mobile');
      const desktopFolder = screenshotsFolder?.folder('desktop');

      const maxSteps = Math.min(stepUrls.length, 8);
      for (let i = 0; i < maxSteps; i++) {
        const stepUrl = stepUrls[i];
        console.log(`Capturing screenshots for step ${stepUrl.number}`);

        // Calculate granular progress: flow progress + step progress within flow
        const flowBaseProgress = (processedFlows / totalFlows) * 100;
        const stepProgress = ((i + 1) / maxSteps) * (100 / totalFlows) * 0.8; // 80% for screenshots
        const currentProgress = Math.round(flowBaseProgress + stepProgress);
        
        await supabase
          .from('export_jobs')
          .update({
            progress: currentProgress,
            progress_message: `${flow.variant_name}: Screenshot Step ${stepUrl.number}/${maxSteps}...`,
          })
          .eq('id', jobId);

        if (captureMobile) {
          const mobileImg = await captureScreenshotWithRetry(supabase, stepUrl.url, '375x812');
          if (mobileImg) {
            const mobileBytes = Uint8Array.from(atob(mobileImg), c => c.charCodeAt(0));
            mobileFolder?.file(`step-${stepUrl.number}-${slugify(stepUrl.name)}.png`, mobileBytes);
          }
        }

        if (captureDesktop) {
          const desktopImg = await captureScreenshotWithRetry(supabase, stepUrl.url, '1920x1080');
          if (desktopImg) {
            const desktopBytes = Uint8Array.from(atob(desktopImg), c => c.charCodeAt(0));
            desktopFolder?.file(`step-${stepUrl.number}-${slugify(stepUrl.name)}.png`, desktopBytes);
          }
        }

        // Small delay between captures
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // 5. Capture HTML
      const htmlFolder = flowFolder.folder('html');
      for (let i = 0; i < Math.min(stepUrls.length, 8); i++) {
        const stepUrl = stepUrls[i];
        const html = await captureHtml(supabase, stepUrl.url);
        if (html) {
          htmlFolder?.file(`step-${stepUrl.number}-${slugify(stepUrl.name)}.html`, html);
        }
      }

      // 6. Create flow README
      flowFolder.file('README.md', `# ${flow.variant_name}

## Ultimate Flow Export

**Erstellt:** ${new Date().toLocaleString('de-CH')}
**Flow ID:** ${flow.flow_id}
**Status:** ${flow.status}

---

## Inhalt

- \`prompts/\` - Build & Analyse Prompts
- \`data/\` - JSON Konfiguration
- \`screenshots/\` - Mobile & Desktop Screenshots
- \`html/\` - HTML Snapshots
`);

      processedFlows++;
    }

    // Generate ZIP and upload to storage
    console.log('Generating ZIP file...');
    const zipContent = await zip.generateAsync({ type: 'uint8array' });
    const zipFilename = `ultimate-flows-export-${timestamp}.zip`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('flow-exports')
      .upload(zipFilename, zipContent, {
        contentType: 'application/zip',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('flow-exports')
      .getPublicUrl(zipFilename);

    const downloadUrl = urlData?.publicUrl || '';

    // Mark job as completed
    await supabase
      .from('export_jobs')
      .update({
        status: 'completed',
        progress: 100,
        progress_message: `${flows.length} Ultimate Flows erfolgreich exportiert`,
        completed_at: new Date().toISOString(),
        download_url: downloadUrl,
        file_size_bytes: zipContent.length,
      })
      .eq('id', jobId);

    console.log(`Export completed successfully. Download: ${downloadUrl}`);

  } catch (error) {
    console.error('Export error:', error);
    await supabase
      .from('export_jobs')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unbekannter Fehler',
        completed_at: new Date().toISOString(),
      })
      .eq('id', jobId);
  }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const {
      jobId,
      flowIds,
      baseUrl,
      captureDesktop = true,
      captureMobile = true,
    }: ExportRequest = await req.json();

    console.log(`Starting Ultimate Flow export job: ${jobId}`);

    // Load Ultimate Flows
    let query = supabase
      .from('flow_feedback_variants')
      .select('*')
      .or('variant_label.ilike.%ultimate%,variant_name.ilike.%ultimate%')
      .order('created_at', { ascending: false });

    if (flowIds && flowIds.length > 0) {
      query = query.in('id', flowIds);
    }

    const { data: flows, error: flowsError } = await query;

    if (flowsError) {
      throw new Error(`Failed to load flows: ${flowsError.message}`);
    }

    if (!flows || flows.length === 0) {
      throw new Error('Keine Ultimate Flows gefunden');
    }

    // Start background task
    EdgeRuntime.waitUntil(
      runExport(supabase, jobId, flows as UltimateFlowData[], baseUrl, captureDesktop, captureMobile)
    );

    // Return immediately
    return new Response(
      JSON.stringify({
        success: true,
        message: `Export gestartet für ${flows.length} Ultimate Flows`,
        jobId,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
