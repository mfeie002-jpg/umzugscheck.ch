import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import JSZip from "https://esm.sh/jszip@3.10.1";

// Declare EdgeRuntime for Supabase Edge Functions
declare const EdgeRuntime: {
  waitUntil: (promise: Promise<unknown>) => void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Flow configurations - must match frontend flowConfigs.ts
const FLOW_CONFIGS: Record<string, { id: string; label: string; path: string; steps: { step: number; name: string; description: string }[] }> = {
  'umzugsofferten': {
    id: 'umzugsofferten',
    label: 'V1 - Control Flow',
    path: '/umzugsofferten',
    steps: [
      { step: 1, name: 'Umzugstyp wählen', description: 'Wohnung, Haus, Büro auswählen' },
      { step: 2, name: 'Details & Services', description: 'Adressen, Grösse, Datum, Services' },
      { step: 3, name: 'Firmenauswahl', description: 'Passende Firmen auswählen' },
      { step: 4, name: 'Kontakt & Absenden', description: 'Name, Email, Absenden' },
    ],
  },
  'umzugsofferten-v2': {
    id: 'umzugsofferten-v2',
    label: 'V2 - Premium Full-Journey',
    path: '/umzugsofferten-v2',
    steps: [
      { step: 1, name: 'Umzugsart', description: 'Art des Umzugs wählen' },
      { step: 2, name: 'Von & Nach', description: 'Start- und Zieladresse' },
      { step: 3, name: 'Wohnungsgrösse', description: 'Zimmerzahl und Etage' },
      { step: 4, name: 'Umzugsdatum', description: 'Wunschtermin festlegen' },
      { step: 5, name: 'Zusatzservices', description: 'Packen, Reinigung, etc.' },
      { step: 6, name: 'Kontaktdaten', description: 'Persönliche Angaben' },
    ],
  },
  'umzugsofferten-v3': {
    id: 'umzugsofferten-v3',
    label: 'V3 - God Mode',
    path: '/umzugsofferten-v3',
    steps: [
      { step: 1, name: 'Slider-Eingabe', description: 'Volumen per Slider schätzen' },
      { step: 2, name: 'Details', description: 'Adressen und Datum' },
      { step: 3, name: 'Bestätigung', description: 'Preis und Übersicht' },
      { step: 4, name: 'Kontakt', description: 'Daten absenden' },
    ],
  },
  'umzugsofferten-v4': {
    id: 'umzugsofferten-v4',
    label: 'V4 - Video-First AI',
    path: '/umzugsofferten-v4',
    steps: [
      { step: 1, name: 'Video Upload', description: 'Video der Wohnung hochladen' },
      { step: 2, name: 'KI-Analyse', description: 'Automatische Inventarerkennung' },
      { step: 3, name: 'Überprüfung', description: 'Inventar kontrollieren/anpassen' },
      { step: 4, name: 'Details', description: 'Adressen und Datum' },
      { step: 5, name: 'Kontakt', description: 'Offerte anfordern' },
    ],
  },
  'umzugsofferten-v5': {
    id: 'umzugsofferten-v5',
    label: 'V5 - Marketplace Wizard',
    path: '/umzugsofferten-v5',
    steps: [
      { step: 1, name: 'Umzugsdetails', description: 'Grundlegende Infos' },
      { step: 2, name: 'Anforderungen', description: 'Spezielle Wünsche' },
      { step: 3, name: 'Marktplatz', description: 'Firmen sehen und vergleichen' },
      { step: 4, name: 'Auswahl', description: 'Firmen auswählen' },
      { step: 5, name: 'Kontakt', description: 'Anfrage absenden' },
    ],
  },
  'umzugsofferten-v6': {
    id: 'umzugsofferten-v6',
    label: 'V6 - Ultimate (6-Tier)',
    path: '/umzugsofferten-v6',
    steps: [
      { step: 1, name: 'Willkommen', description: 'Einführung und Vertrauen' },
      { step: 2, name: 'Umzugsart', description: 'Privat, Firma, Spezial' },
      { step: 3, name: 'Adressen', description: 'Von und Nach' },
      { step: 4, name: 'Inventar', description: 'Detaillierte Auflistung' },
      { step: 5, name: 'Services', description: 'Zusatzleistungen' },
      { step: 6, name: 'Abschluss', description: 'Kontakt und Absenden' },
    ],
  },
  'umzugsofferten-v7': {
    id: 'umzugsofferten-v7',
    label: 'V7 - SwissMove (90s)',
    path: '/umzugsofferten-v7',
    steps: [
      { step: 1, name: 'Quick Start', description: 'PLZ und Grösse' },
      { step: 2, name: 'Datum & Services', description: 'Schnelle Auswahl' },
      { step: 3, name: 'Kontakt', description: 'Absenden' },
    ],
  },
  'umzugsofferten-v8': {
    id: 'umzugsofferten-v8',
    label: 'V8 - Decision-Free',
    path: '/umzugsofferten-v8',
    steps: [
      { step: 1, name: 'Start', description: 'Eine Frage pro Screen' },
      { step: 2, name: 'Woher', description: 'Startadresse' },
      { step: 3, name: 'Wohin', description: 'Zieladresse' },
      { step: 4, name: 'Wann', description: 'Datum' },
      { step: 5, name: 'Kontakt', description: 'Absenden' },
    ],
  },
  'umzugsofferten-v9': {
    id: 'umzugsofferten-v9',
    label: 'V9 - Zero Friction',
    path: '/umzugsofferten-v9',
    steps: [
      { step: 1, name: 'Adressen', description: 'Von-Nach in einem Screen' },
      { step: 2, name: 'Details', description: 'Grösse und Datum' },
      { step: 3, name: 'Services', description: 'Optionale Extras' },
      { step: 4, name: 'Firmen', description: 'Passende Auswahl' },
      { step: 5, name: 'Kontakt', description: 'Absenden' },
    ],
  },
};

// Sub-variant configurations
const SUB_VARIANT_CONFIGS: Record<string, { id: string; label: string; path: string; steps: { step: number; name: string; description: string }[] }> = {
  'v2a': { id: 'v2a', label: 'V2a - Progress Enhanced', path: '/flow-tester?variant=v2a', steps: [{ step: 1, name: 'Typ', description: 'Umzugstyp wählen' }, { step: 2, name: 'Ort', description: 'Adressen' }, { step: 3, name: 'Services', description: 'Zusatzleistungen' }, { step: 4, name: 'Kontakt', description: 'Angaben' }] },
  'v2b': { id: 'v2b', label: 'V2b - Simplified Labels', path: '/flow-tester?variant=v2b', steps: [{ step: 1, name: 'Was', description: 'Typ' }, { step: 2, name: 'Wohin', description: 'Adressen' }, { step: 3, name: 'Extras', description: 'Services' }, { step: 4, name: 'Kontakt', description: 'Daten' }] },
  'v2c': { id: 'v2c', label: 'V2c - Trust Focused', path: '/flow-tester?variant=v2c', steps: [{ step: 1, name: 'Umzugsart', description: 'Mit Trust' }, { step: 2, name: 'Details', description: 'Adressen' }, { step: 3, name: 'Services', description: 'Optionen' }, { step: 4, name: 'Kontakt', description: 'Absenden' }] },
  'v2d': { id: 'v2d', label: 'V2d - Speed Optimized', path: '/flow-tester?variant=v2d', steps: [{ step: 1, name: 'Quick', description: 'Schnellauswahl' }, { step: 2, name: 'Details', description: 'Alles' }, { step: 3, name: 'Kontakt', description: 'Absenden' }] },
  'v2e': { id: 'v2e', label: 'V2e - Experimental', path: '/flow-tester?variant=v2e', steps: [{ step: 1, name: 'Start', description: 'Experimentell' }, { step: 2, name: 'Mitte', description: 'Features' }, { step: 3, name: 'Ende', description: 'Absenden' }] },
  'v3a': { id: 'v3a', label: 'V3a - Mobile First', path: '/flow-tester?variant=v3a', steps: [{ step: 1, name: 'Umzugsart', description: 'Touch' }, { step: 2, name: 'Details', description: 'Adressen' }, { step: 3, name: 'Services', description: 'Extras' }, { step: 4, name: 'Kontakt', description: 'Absenden' }] },
  'v3g': { id: 'v3g', label: 'V3g - Feedback Based', path: '/flow-tester?variant=v3g', steps: [{ step: 1, name: 'Service', description: 'Slider' }, { step: 2, name: 'Details', description: 'Adressen' }, { step: 3, name: 'Ablauf', description: 'Trust' }, { step: 4, name: 'Kontakt', description: 'Offerten' }] },
  'v3b': { id: 'v3b', label: 'V3b - Swipe Navigation', path: '/flow-tester?variant=v3b', steps: [{ step: 1, name: 'Umzugsart', description: 'Swipe' }, { step: 2, name: 'Adressen', description: 'Wischen' }, { step: 3, name: 'Services', description: 'Extras' }, { step: 4, name: 'Kontakt', description: 'Absenden' }] },
  'v3c': { id: 'v3c', label: 'V3c - Bottom Sheet', path: '/flow-tester?variant=v3c', steps: [{ step: 1, name: 'Umzugsart', description: 'Sheet' }, { step: 2, name: 'Adressen', description: 'Sheet' }, { step: 3, name: 'Services', description: 'Extras' }, { step: 4, name: 'Kontakt', description: 'Absenden' }] },
  'v3d': { id: 'v3d', label: 'V3d - Thumb Zone', path: '/flow-tester?variant=v3d', steps: [{ step: 1, name: 'Start', description: 'Thumb' }, { step: 2, name: 'Details', description: 'Erreichbar' }, { step: 3, name: 'Kontakt', description: 'Absenden' }] },
  'v3e': { id: 'v3e', label: 'V3e - Fullscreen', path: '/flow-tester?variant=v3e', steps: [{ step: 1, name: 'Umzugsart', description: 'Fullscreen' }, { step: 2, name: 'Details', description: 'Immersiv' }, { step: 3, name: 'Kontakt', description: 'Absenden' }] },
  'v4a': { id: 'v4a', label: 'V4a - Urgency Based', path: '/flow-tester?variant=v4a', steps: [{ step: 1, name: 'Umzugsart', description: 'Urgency' }, { step: 2, name: 'Details', description: 'Timer' }, { step: 3, name: 'Services', description: 'Rabatt' }, { step: 4, name: 'Kontakt', description: 'Jetzt' }] },
  'v4b': { id: 'v4b', label: 'V4b - Social Proof', path: '/flow-tester?variant=v4b', steps: [{ step: 1, name: 'Start', description: 'Bewertungen' }, { step: 2, name: 'Details', description: 'Testimonials' }, { step: 3, name: 'Kontakt', description: 'Proof' }] },
  'v4c': { id: 'v4c', label: 'V4c - Value First', path: '/flow-tester?variant=v4c', steps: [{ step: 1, name: 'Wert', description: 'Vorteile' }, { step: 2, name: 'Details', description: 'Eingaben' }, { step: 3, name: 'Kontakt', description: 'Absenden' }] },
  'v4d': { id: 'v4d', label: 'V4d - Gamified', path: '/flow-tester?variant=v4d', steps: [{ step: 1, name: 'Level 1', description: 'Start' }, { step: 2, name: 'Level 2', description: 'Details' }, { step: 3, name: 'Level 3', description: 'Services' }, { step: 4, name: 'Boss', description: 'Kontakt' }] },
  'v4e': { id: 'v4e', label: 'V4e - Minimal Friction', path: '/flow-tester?variant=v4e', steps: [{ step: 1, name: 'Quick', description: 'Minimal' }, { step: 2, name: 'Kontakt', description: 'Email' }] },
  'v5a': { id: 'v5a', label: 'V5a - High Contrast', path: '/flow-tester?variant=v5a', steps: [{ step: 1, name: 'Umzugsart', description: 'Kontrast' }, { step: 2, name: 'Adressen', description: 'Lesbar' }, { step: 3, name: 'Services', description: 'Klar' }, { step: 4, name: 'Kontakt', description: 'Absenden' }] },
  'v5b': { id: 'v5b', label: 'V5b - Screen Reader', path: '/flow-tester?variant=v5b', steps: [{ step: 1, name: 'Umzugsart', description: 'ARIA' }, { step: 2, name: 'Details', description: 'Vorlesbar' }, { step: 3, name: 'Kontakt', description: 'Absenden' }] },
  'v5c': { id: 'v5c', label: 'V5c - Keyboard Nav', path: '/flow-tester?variant=v5c', steps: [{ step: 1, name: 'Start', description: 'Tab' }, { step: 2, name: 'Details', description: 'Tastatur' }, { step: 3, name: 'Kontakt', description: 'Enter' }] },
  'v5d': { id: 'v5d', label: 'V5d - Large Text', path: '/flow-tester?variant=v5d', steps: [{ step: 1, name: 'Start', description: 'Gross' }, { step: 2, name: 'Details', description: '24px' }, { step: 3, name: 'Kontakt', description: 'Lesbar' }] },
  'v5e': { id: 'v5e', label: 'V5e - Reduced Motion', path: '/flow-tester?variant=v5e', steps: [{ step: 1, name: 'Umzugsart', description: 'Keine Animation' }, { step: 2, name: 'Details', description: 'Statisch' }, { step: 3, name: 'Kontakt', description: 'Ruhig' }] },
};

async function captureScreenshot(url: string, dimension: string): Promise<string | null> {
  const apiKey = Deno.env.get("SCREENSHOTMACHINE_API_KEY");
  const secretPhrase = Deno.env.get("SCREENSHOTMACHINE_SECRET_PHRASE") || "";
  
  if (!apiKey) {
    console.log("No screenshot API key configured");
    return null;
  }

  try {
    const [width, height] = dimension.split('x');
    const device = parseInt(width) < 500 ? 'phone' : 'desktop';
    
    const params = new URLSearchParams({
      key: apiKey,
      url: url,
      dimension: dimension.includes('full') ? `${width}xfull` : dimension,
      device: device,
      format: 'png',
      cacheLimit: '0',
      delay: '3000',
    });
    
    if (secretPhrase) {
      const encoder = new TextEncoder();
      const data = encoder.encode(url + secretPhrase);
      const hashBuffer = await crypto.subtle.digest('MD5', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      params.set('hash', hash);
    }

    const screenshotUrl = `https://api.screenshotmachine.com?${params.toString()}`;
    const response = await fetch(screenshotUrl);
    
    if (!response.ok) return null;
    
    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("Screenshot capture failed:", error);
    return null;
  }
}

async function captureHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FlowExport/1.0)' }
    });
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    console.error("HTML capture failed:", error);
    return null;
  }
}

function buildCaptureUrl(baseUrl: string, flowPath: string, step: number, ucFlowId?: string): string {
  const u = new URL(flowPath, baseUrl);
  u.searchParams.set("uc_capture", "1");
  u.searchParams.set("uc_step", String(step));
  if (ucFlowId) u.searchParams.set("uc_flow", ucFlowId);
  u.searchParams.set("uc_cb", String(Date.now()));
  return u.toString();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { jobId, baseUrl, includeSubVariants = true } = await req.json();

    if (!jobId) {
      return new Response(JSON.stringify({ error: "jobId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Start background task
    EdgeRuntime.waitUntil((async () => {
      console.log(`Starting background export for job ${jobId}`);
      
      // Update job to running
      await supabase.from('export_jobs').update({
        status: 'running',
        started_at: new Date().toISOString(),
        progress: 0,
        progress_message: 'Export wird gestartet...',
      }).eq('id', jobId);

      try {
        const finalBaseUrl = (baseUrl || 'https://umzugscheck.ch').replace(/\/$/, '');
        const exportDate = new Date().toISOString().split('T')[0];
        const zip = new JSZip();
        const rootFolder = zip.folder(`all-flows-${exportDate}`);
        
        if (!rootFolder) throw new Error("Could not create ZIP folder");

        // Combine flows
        const allFlows = { ...FLOW_CONFIGS };
        if (includeSubVariants) {
          Object.assign(allFlows, SUB_VARIANT_CONFIGS);
        }
        
        const flowKeys = Object.keys(allFlows);
        const totalFlows = flowKeys.length;
        let totalOps = 0;
        flowKeys.forEach(key => {
          totalOps += allFlows[key].steps.length * 3; // desktop + mobile + html
        });
        
        let completedOps = 0;
        const allFlowsData: Record<string, any> = {
          exportDate: new Date().toISOString(),
          baseUrl: finalBaseUrl,
          flowCount: totalFlows,
          includesSubVariants: includeSubVariants,
          flows: {},
        };

        for (const flowKey of flowKeys) {
          const flow = allFlows[flowKey];
          const flowFolderName = flow.id.replace('umzugsofferten', 'v1').replace('-v', 'v');
          const flowFolder = rootFolder.folder(flowFolderName);
          if (!flowFolder) continue;

          const flowStepsData: any[] = [];

          for (const stepConfig of flow.steps) {
            const stepFolder = flowFolder.folder(`step-${stepConfig.step}`);
            if (!stepFolder) continue;

            const fullUrl = buildCaptureUrl(finalBaseUrl, flow.path, stepConfig.step, flow.id);

            // Update progress
            await supabase.from('export_jobs').update({
              progress: Math.round((completedOps / totalOps) * 100),
              progress_message: `${flow.label} Step ${stepConfig.step}/${flow.steps.length}...`,
            }).eq('id', jobId);

            // Desktop screenshot
            const desktopScreenshot = await captureScreenshot(fullUrl, '1920x1080');
            completedOps++;

            // Mobile screenshot
            const mobileScreenshot = await captureScreenshot(fullUrl, '390x844');
            completedOps++;

            // HTML
            const html = await captureHtml(fullUrl);
            completedOps++;

            // Save files
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

            // Meta JSON
            const stepMeta = {
              url: fullUrl,
              flow: flow.id,
              step: stepConfig.step,
              stepName: stepConfig.name,
              hasDesktop: !!desktopScreenshot,
              hasMobile: !!mobileScreenshot,
              hasHtml: !!html,
              capturedAt: new Date().toISOString(),
            };
            stepFolder.file('meta.json', JSON.stringify(stepMeta, null, 2));

            flowStepsData.push(stepMeta);
          }

          // Flow info
          const flowInfo = {
            id: flow.id,
            name: flow.label,
            path: flow.path,
            totalSteps: flow.steps.length,
            steps: flowStepsData,
            capturedAt: new Date().toISOString(),
          };
          flowFolder.file('flow-info.json', JSON.stringify(flowInfo, null, 2));
          allFlowsData.flows[flow.id] = flowInfo;
        }

        // Add master JSON
        rootFolder.file('all-flows.json', JSON.stringify(allFlowsData, null, 2));

        // Add README
        rootFolder.file('README.md', `# Flow Export - ${exportDate}

## Inhalt
- ${totalFlows} Flows exportiert
- Alle Steps mit Desktop + Mobile Screenshots + HTML
${includeSubVariants ? '- Inkl. Sub-Varianten (v2a-e, v3a-g, v4a-e, v5a-e)' : ''}

## Flows
${Object.values(allFlowsData.flows).map((f: any) => `- ${f.name}: ${f.totalSteps} Steps`).join('\n')}

## Generiert
${new Date().toLocaleString('de-CH')}
`);

        // Generate ZIP blob
        await supabase.from('export_jobs').update({
          progress: 95,
          progress_message: 'ZIP wird erstellt...',
        }).eq('id', jobId);

        const zipBlob = await zip.generateAsync({ type: 'uint8array' });
        const fileName = `all-flows-${exportDate}-${jobId.slice(0, 8)}.zip`;

        // Upload to storage
        await supabase.from('export_jobs').update({
          progress: 98,
          progress_message: 'Upload zu Storage...',
        }).eq('id', jobId);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('flow-exports')
          .upload(fileName, zipBlob, {
            contentType: 'application/zip',
            upsert: true,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('flow-exports')
          .getPublicUrl(fileName);

        // Mark as completed
        await supabase.from('export_jobs').update({
          status: 'completed',
          progress: 100,
          progress_message: 'Export abgeschlossen',
          download_url: urlData.publicUrl,
          file_size_bytes: zipBlob.length,
          completed_at: new Date().toISOString(),
        }).eq('id', jobId);

        console.log(`Export job ${jobId} completed successfully`);

      } catch (error) {
        console.error(`Export job ${jobId} failed:`, error);
        await supabase.from('export_jobs').update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          completed_at: new Date().toISOString(),
        }).eq('id', jobId);
      }
    })());

    // Return immediately
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Export started in background',
      jobId,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Background export error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
