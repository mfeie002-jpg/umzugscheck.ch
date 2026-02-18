import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MAX_FRAMES = 10;

type ServiceType = "umzug" | "raeumung" | "entsorgung" | "firmenumzug";

function buildSystemPrompt(serviceType: ServiceType, context: Record<string, string | undefined>): string {
  const contextStr = [
    context.city && `Stadt/PLZ: ${context.city}${context.zip ? ` (${context.zip})` : ""}`,
    context.rooms && `Zimmer: ${context.rooms}`,
    context.floor && `Stockwerk: ${context.floor}`,
    context.elevator === "true" ? "Lift: vorhanden" : context.elevator === "false" ? "Lift: keiner" : null,
    context.urgency && `Dringlichkeit: ${context.urgency}`,
    context.notes && `Hinweise: ${context.notes}`,
  ].filter(Boolean).join("\n");

  const baseContext = contextStr ? `\nZusatzinfos vom Kunden:\n${contextStr}\n` : "";

  const servicePrompts: Record<ServiceType, string> = {
    umzug: `Du bist ein professioneller Umzugsvolumen-Schätzer für Schweizer Umzugsfirmen (Deutschschweiz).
Analysiere diese ${MAX_FRAMES} Frames aus einem Handyvideo-Rundgang einer Wohnung/eines Hauses.
${baseContext}
Deine Aufgabe: Schätze Umzugsvolumen, Inventar, Team-Bedarf und CHF-Preisrange für einen professionellen Umzug in der Schweiz.

Typische Schweizer Preise:
- Klein (bis 20m³, 1-2 Zimmer): CHF 800–1'500
- Mittel (20–40m³, 3-4 Zimmer): CHF 1'500–3'000
- Gross (40–70m³, 5+ Zimmer): CHF 3'000–6'000
- Spezialtransport (Piano, Safe): +CHF 300–800`,

    firmenumzug: `Du bist ein professioneller Firmenumzugs-Schätzer für Schweizer Umzugsfirmen (Deutschschweiz).
Analysiere diese ${MAX_FRAMES} Frames aus einem Video-Rundgang eines Büros/Betriebsgebäudes.
${baseContext}
Deine Aufgabe: Schätze Volumen, Büroausstattung, Team-Bedarf und CHF-Preisrange für einen Firmenumzug in der Schweiz.

Typische Preise Firmenumzug:
- Klein-Büro (bis 5 Arbeitsplätze): CHF 2'000–5'000
- Mittel-Büro (5–20 AP): CHF 5'000–15'000
- Gross-Büro (20+ AP): CHF 15'000–50'000`,

    raeumung: `Du bist ein Fachmann für Haushaltsauflösungen und Räumungen in der Deutschschweiz.
Analysiere diese ${MAX_FRAMES} Frames aus einem Video-Rundgang.
${baseContext}
Deine Aufgabe: Schätze den Räumungsaufwand, kategorisiere das Entsorgungsgut und erstelle eine Preisrange für eine professionelle Räumung/Haushaltsauflösung.

Entsorgungskategorien (Schweiz):
- Sperrgut (Möbel, Matratzen): Kehrichthof oder kostenpflichtige Abfuhr
- Elektroschrott (Kühlschrank, Waschmaschine): Sonderabgabe SENS/SWICO
- Sondermüll (Farben, Chemikalien): Sonderentsorgung Kanton
- Wertgegenstände (Antiquitäten, Kunst): Wiederverkauf möglich
- Normalabfall: Gemeinde-Sackgebühr

Typische Räumungspreise Schweiz:
- 1-2 Zimmer: CHF 1'500–3'500
- 3-4 Zimmer: CHF 3'500–7'000
- 5+ Zimmer / Haus: CHF 7'000–20'000
- Spezialentsorgung (Asbest, Chemie): + CHF 500–5'000`,

    entsorgung: `Du bist ein Entsorgungsfachmann für die Deutschschweiz.
Analysiere diese ${MAX_FRAMES} Frames aus einem Video-Rundgang.
${baseContext}
Deine Aufgabe: Schätze das Entsorgungsvolumen nach Kategorien, Gewicht und Kosten für eine professionelle Entsorgung.

Schweizer Entsorgungskosten:
- Sperrgut pro m³: CHF 80–150
- Elektroschrott: CHF 0 (SENS/SWICO reguliert) bis CHF 200
- Sondermüll pro 10kg: CHF 100–300
- Bauschutt pro m³: CHF 100–200`,
  };

  return servicePrompts[serviceType] || servicePrompts.umzug;
}

function buildOutputSchema(serviceType: ServiceType): string {
  const isDisposal = serviceType === "raeumung" || serviceType === "entsorgung";
  
  return `
Antworte NUR mit diesem JSON-Objekt (kein Markdown, kein Text drumherum):
{
  "serviceType": "${serviceType}",
  "estimated_volume_m3": <Zahl, z.B. 25>,
  "estimated_weight_kg": ${isDisposal ? "<Zahl oder null>" : "null"},
  "bulky_items": [
    {"item": "<Name>", "count": <Zahl>, "notes": "<optional Hinweis oder null>"}
  ],
  "disposal_breakdown": ${isDisposal ? `{
    "sperrgut_m3": <Zahl>,
    "elektroschrott_stueck": <Zahl>,
    "sondermuell_kg": <Zahl>,
    "normalabfall_m3": <Zahl>,
    "wertgegenstaende": ["<Liste oder leer>"]
  }` : "null"},
  "recommended_team": {
    "people": <Zahl 1-6>,
    "hours": <Zahl 1-16>,
    "vehicles": <Zahl 1-3 oder null>,
    "lift_needed": <true/false oder null>
  },
  "price_range_chf": {
    "low": <Zahl>,
    "high": <Zahl>,
    "rationale": "<kurze Begründung auf Deutsch>"
  },
  "confidence": <Zahl 0.0-1.0>,
  "followup_questions": ["<Frage 1>", "<Frage 2>"],
  "red_flags": ["<z.B. Enge Treppe sichtbar>"],
  "assumptions": ["<z.B. Keller nicht im Video>"]
}`;
}

function extractJson(text: string): any {
  // Try direct parse first
  try { return JSON.parse(text); } catch {}

  // Try to extract from ```json ... ``` block
  const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch) {
    try { return JSON.parse(jsonBlockMatch[1]); } catch {}
  }

  // Try to extract from ``` ... ``` block
  const codeBlockMatch = text.match(/```\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    try { return JSON.parse(codeBlockMatch[1]); } catch {}
  }

  // Try to find first { ... } block
  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    try { return JSON.parse(braceMatch[0]); } catch {}
  }

  return null;
}

function buildFallback(serviceType: ServiceType): Record<string, any> {
  const isDisposal = serviceType === "raeumung" || serviceType === "entsorgung";
  return {
    serviceType,
    estimated_volume_m3: serviceType === "firmenumzug" ? 35 : 25,
    estimated_weight_kg: isDisposal ? 2500 : null,
    bulky_items: [
      { item: "Sofa", count: 1, notes: null },
      { item: "Bett", count: 1, notes: null },
      { item: "Kleiderschrank", count: 2, notes: null },
      { item: "Esstisch", count: 1, notes: null },
    ],
    disposal_breakdown: isDisposal ? {
      sperrgut_m3: 8,
      elektroschrott_stueck: 3,
      sondermuell_kg: 20,
      normalabfall_m3: 2,
      wertgegenstaende: [],
    } : null,
    recommended_team: {
      people: 2,
      hours: 6,
      vehicles: 1,
      lift_needed: null,
    },
    price_range_chf: {
      low: serviceType === "entsorgung" ? 800 : serviceType === "raeumung" ? 2500 : 1500,
      high: serviceType === "entsorgung" ? 2000 : serviceType === "raeumung" ? 6000 : 3500,
      rationale: "Schätzung basierend auf Standardwerten (automatische Analyse nicht verfügbar)",
    },
    confidence: 0.3,
    followup_questions: [
      "Gibt es besondere Gegenstände (Piano, Safe, Aquarium)?",
      "Wie ist die Zugänglichkeit (Lift, Treppe, Parkplatz)?",
    ],
    red_flags: ["Analyse konnte nicht vollständig durchgeführt werden"],
    assumptions: ["Standardwerte verwendet da Videoanalyse fehlschlug"],
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Rate limiting: 5 requests per hour per IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                     req.headers.get('x-real-ip') || 
                     'anonymous';
    
    const { data: rateLimitOk, error: rateLimitError } = await supabaseClient.rpc('check_rate_limit', {
      p_identifier: clientIp,
      p_action_type: 'inventory_frame_analysis',
      p_max_attempts: 5,
      p_window_minutes: 60
    });

    if (rateLimitError || !rateLimitOk) {
      return new Response(
        JSON.stringify({ error: 'Zu viele Anfragen. Bitte versuchen Sie es in einer Stunde erneut.', code: 'RATE_LIMIT' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const {
      frames,
      serviceType = "umzug",
      zip, city, rooms, floor, elevator, urgency, notes, gclid,
    } = body;

    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Keine Frames übergeben' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sample down to MAX_FRAMES if needed
    let selectedFrames: string[] = frames;
    if (frames.length > MAX_FRAMES) {
      const step = frames.length / MAX_FRAMES;
      selectedFrames = Array.from({ length: MAX_FRAMES }, (_, i) => frames[Math.floor(i * step)]);
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = buildSystemPrompt(serviceType as ServiceType, { zip, city, rooms, floor, elevator, urgency, notes });
    const outputSchema = buildOutputSchema(serviceType as ServiceType);

    // Build content array with text + all frames as images
    const content: any[] = [
      {
        type: "text",
        text: `${systemPrompt}\n\n${outputSchema}\n\nFolgende ${selectedFrames.length} Frames aus dem Video werden dir gezeigt:`
      },
      ...selectedFrames.map((frame, idx) => ({
        type: "image_url",
        image_url: { url: frame, detail: "auto" },
      })),
    ];

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content }],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'KI-Ratenlimit erreicht. Bitte versuchen Sie es in einem Moment erneut.', code: 'AI_RATE_LIMIT' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'KI-Credits erschöpft. Bitte kontaktieren Sie den Support.', code: 'AI_CREDITS' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const rawText = aiData.choices?.[0]?.message?.content ?? "";

    let analysis = extractJson(rawText);
    
    if (!analysis || typeof analysis !== 'object') {
      console.warn('JSON parse failed, using fallback. Raw:', rawText.slice(0, 500));
      analysis = buildFallback(serviceType as ServiceType);
    } else {
      // Ensure required fields
      analysis.serviceType = analysis.serviceType ?? serviceType;
      analysis.estimated_volume_m3 = analysis.estimated_volume_m3 ?? 25;
      analysis.confidence = analysis.confidence ?? 0.6;
      analysis.bulky_items = analysis.bulky_items ?? [];
      analysis.recommended_team = analysis.recommended_team ?? { people: 2, hours: 6, vehicles: 1, lift_needed: null };
      analysis.price_range_chf = analysis.price_range_chf ?? { low: 1500, high: 3500, rationale: "Schätzung" };
      analysis.followup_questions = analysis.followup_questions ?? [];
      analysis.red_flags = analysis.red_flags ?? [];
      analysis.assumptions = analysis.assumptions ?? [];
    }

    return new Response(
      JSON.stringify({ success: true, data: analysis, frames_analyzed: selectedFrames.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-inventory-frames:', error);
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
