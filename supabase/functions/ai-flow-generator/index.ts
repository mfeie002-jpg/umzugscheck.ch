import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive system prompt for actual implementation generation
const IMPLEMENTATION_SYSTEM_PROMPT = `Du bist ein Elite-Fullstack-Entwickler und UX-Architekt für umzugscheck.ch.
Deine Aufgabe: Generiere KONKRETE, UMSETZBARE Implementierungen basierend auf Feedback.

WICHTIG: Du generierst nicht nur Beschreibungen, sondern ECHTEN Code und detaillierte Spezifikationen.

Antwortformat (MUSS valides JSON sein):
{
  "flowName": "umzugsofferten-v1a",
  "flowLabel": "V1.a - Mobile Optimiert",
  "description": "Kurze Beschreibung der Variante",
  "baseFlow": "umzugsofferten",
  "variantType": "a",
  
  "implementation": {
    "summary": "Zusammenfassung der Änderungen",
    "priority": "high|medium|low",
    "estimatedImpact": "+15% Conversion",
    "implementationTime": "2-4 Stunden"
  },
  
  "steps": [
    {
      "step": 1,
      "name": "Hero & Umzugstyp",
      "originalIssues": ["CTA zu klein", "Trust fehlt"],
      "changes": [
        {
          "element": "CTA Button",
          "before": "Button mit 40px Höhe",
          "after": "Button mit 56px Höhe, volle Breite mobile",
          "cssChanges": "min-h-14 w-full md:w-auto",
          "reason": "Touch-Ziel-Optimierung für Mobile"
        }
      ],
      "newElements": [
        {
          "element": "Trust Badges",
          "position": "Unter CTA",
          "code": "<div className=\"flex gap-2 justify-center mt-4\"><Badge>✓ Kostenlos</Badge><Badge>✓ Unverbindlich</Badge></div>",
          "reason": "Vertrauen aufbauen vor Klick"
        }
      ],
      "removedElements": [],
      "layoutChanges": "Sticky Header auf Mobile"
    }
  ],
  
  "globalChanges": {
    "typography": ["Headlines von 2xl auf 3xl", "Body von sm auf base"],
    "spacing": ["Mehr Whitespace zwischen Sektionen"],
    "colors": ["CTA von primary auf gradient"],
    "animations": ["Smooth scroll zwischen Steps"],
    "mobile": ["Bottom-Sticky CTA", "Swipe-Navigation"]
  },
  
  "codeSnippets": [
    {
      "file": "components/steps/Step1Hero.tsx",
      "type": "modification",
      "description": "CTA-Optimierung",
      "code": "// Vorher: <Button size=\"default\">\\n// Nachher:\\n<Button \\n  size=\"lg\" \\n  className=\"w-full md:w-auto min-h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all\"\\n>\\n  Jetzt Offerten vergleichen\\n  <ArrowRight className=\"ml-2 h-5 w-5\" />\\n</Button>"
    }
  ],
  
  "testingNotes": {
    "abTestHypothesis": "Größere CTAs + Trust-Badges erhöhen Klickrate um 20%",
    "successMetrics": ["CTA Click-Rate", "Step 1→2 Completion", "Bounce Rate"],
    "riskFactors": ["Evtl. zu aggressive CTAs"]
  },
  
  "improvements": [
    "48px+ Touch-Targets für alle CTAs",
    "Trust-Badges auf jedem Step sichtbar",
    "Progressive Disclosure für Formularfelder"
  ],
  
  "expectedImpact": {
    "conversionIncrease": "+15-25%",
    "dropOffReduction": "-10-20%",
    "userSatisfaction": "Erhöht",
    "mobileConversion": "+30%"
  }
}

Regeln:
1. IMMER valides JSON zurückgeben
2. Code-Snippets müssen syntaktisch korrekt sein
3. Alle Änderungen müssen begründet sein
4. Konkret und spezifisch sein, keine Platzhaltererklärungen
5. Tailwind CSS verwenden
6. React/TypeScript Best Practices folgen`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { systemPrompt, userPrompt, baseFlow, newFlowName, feedbackText, variantName } = await req.json();
    
    console.log('AI Flow Generator called for:', { baseFlow, newFlowName, variantName });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build enhanced user prompt with context
    const enhancedUserPrompt = `
Basis-Flow: ${baseFlow}
Neue Variante: ${newFlowName}
Varianten-Buchstabe: ${variantName || 'A'}

FEEDBACK/ANALYSE ZUM UMSETZEN:
${feedbackText || userPrompt}

KONTEXT ZU UMZUGSCHECK.CH:
- Schweizer Umzugsvergleich-Plattform
- Multi-Step Wizard für Offerten-Anfragen
- Mobile-First wichtig (60%+ Mobile Traffic)
- Conversion ist Hauptziel
- Bestehende Tech: React, TypeScript, Tailwind, Shadcn

Generiere eine vollständige, UMSETZBARE Implementierung als JSON.
`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt || IMPLEMENTATION_SYSTEM_PROMPT },
          { role: 'user', content: enhancedUserPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit erreicht. Bitte warte kurz.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Credits aufgebraucht. Bitte lade Credits nach.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    console.log('Raw AI response length:', content.length);

    // Try to parse JSON from the response
    let result;
    try {
      // Find JSON in the response - handle markdown code blocks
      let jsonStr = content;
      
      // Remove markdown code blocks if present
      const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1].trim();
      }
      
      // Find the JSON object
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
        
        // Ensure required fields exist
        result.flowName = result.flowName || newFlowName;
        result.flowLabel = result.flowLabel || `Flow ${newFlowName}`;
        result.baseFlow = result.baseFlow || baseFlow;
        result.variantType = result.variantType || variantName?.toLowerCase() || 'a';
        
        // Add metadata
        result.generatedAt = new Date().toISOString();
        result.aiModel = 'google/gemini-2.5-flash';
        result.inputPromptLength = (feedbackText || userPrompt || '').length;
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      
      // Fallback: Extract structured content from text
      const lines = content.split('\n').filter((line: string) => line.trim());
      const improvements = lines
        .filter((line: string) => line.trim().startsWith('-') || line.trim().startsWith('•'))
        .map((line: string) => line.trim().replace(/^[-•]\s*/, ''));
      
      result = {
        flowName: newFlowName,
        flowLabel: `Flow ${newFlowName}`,
        baseFlow: baseFlow,
        variantType: variantName?.toLowerCase() || 'a',
        description: "AI-generierte Implementierung",
        implementation: {
          summary: "Aus Text-Analyse extrahiert",
          priority: "medium",
          estimatedImpact: "Zu evaluieren",
          implementationTime: "TBD"
        },
        steps: [],
        globalChanges: {},
        codeSnippets: [],
        improvements: improvements.length > 0 ? improvements : lines.slice(0, 15),
        expectedImpact: {
          conversionIncrease: "Zu messen",
          dropOffReduction: "Zu messen",
          userSatisfaction: "Zu evaluieren"
        },
        rawResponse: content,
        generatedAt: new Date().toISOString(),
        aiModel: 'google/gemini-2.5-flash',
        parseStatus: 'fallback'
      };
    }

    console.log('Returning structured implementation result');
    
    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-flow-generator:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
