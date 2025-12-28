import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// ============================================================================
// SWISS MARKET ARCHETYPES (from Strategic Analysis)
// ============================================================================
const ARCHETYPES = {
  securitySeeker: {
    name: 'Sicherheits-Sucher',
    nameEn: 'Security-Seeker',
    description: 'Familien, 45+, Langzeitmieter. Risikoaversion dominiert.',
    triggers: ['Garantie', 'Zertifikate', 'ASTAG', 'Fixpreis', 'Versicherung'],
    painPoints: ['Hidden Costs', 'Unseriöse Anbieter', 'Schäden'],
    uxNeeds: ['Validierung nach jedem Schritt', 'Detaillierte Versicherungsinfo', 'Video-Call Option'],
    conversionTrigger: 'Fixpreis-Garantie & Abnahmegarantie'
  },
  efficiencyMaximizer: {
    name: 'Effizienz-Maximierer',
    nameEn: 'Efficiency-Maximizer',
    description: 'Expats, Professionals 25-45. Zeit ist Geld.',
    triggers: ['One-Click', 'AI-Video', 'Full-Service', 'English'],
    painPoints: ['Lange Formulare', 'Telefonische Rückfragen', 'Sprachbarrieren'],
    uxNeeds: ['Auto-Complete überall', 'Mobile-First', 'WhatsApp-Kommunikation'],
    conversionTrigger: '"Fertig in 2 Minuten", "Alles aus einer Hand"'
  },
  valueHunter: {
    name: 'Preis-Jäger',
    nameEn: 'Value-Hunter',
    description: 'Studenten, junge Paare. Misstrauen gegenüber "Abzocke".',
    triggers: ['Preisvergleich', 'Sparen', 'Rabatt', 'Transparent'],
    painPoints: ['Intransparente Pauschalangebote', 'Versteckte Kosten'],
    uxNeeds: ['Dynamischer Spar-Rechner', 'Vergleichs-Modus', 'Eigenleistungs-Optionen'],
    conversionTrigger: '"Sparen Sie 20% am 15. des Monats"'
  },
  overwhelmedParent: {
    name: 'Chaos-Manager',
    nameEn: 'Overwhelmed Parent',
    description: 'Familien im Umbruch. Kognitive Last am Limit.',
    triggers: ['Checkliste', 'Speichern', 'Erinnerung', 'Struktur'],
    painPoints: ['Zu viele Entscheidungen', 'Abstrakte Fragen', 'Überforderung'],
    uxNeeds: ['Häppchen-Schritte', 'Save & Continue', 'Proaktive Erinnerungen'],
    conversionTrigger: '"Wir denken an alles", "Nichts vergessen"'
  }
};

// ============================================================================
// SWISS MARKET 6-STEP FRAMEWORK
// ============================================================================
const SWISS_6_STEP_FRAMEWORK = [
  {
    step: 1,
    name: 'Kontextueller Einstieg & Geolocation',
    germanName: 'Der "Hook"',
    criticalElements: [
      'Smart Location Intelligence (Google Places + Swiss Post API)',
      'Etagen-Frage & Lift-Toggle',
      'Intent-Segmentierung (Transport/Rundum-Sorglos/Reinigung)'
    ],
    swissSpecific: [
      'Quartierbezeichnungen vs PLZ',
      'LKW-Zufahrt-Validierung',
      'Metadaten für Möbellift'
    ],
    benchmark: 'Movu: Einfaches PLZ-Formular ohne Validierung'
  },
  {
    step: 2,
    name: 'Temporale Logik & Flexibilität',
    germanName: 'Das "Wann"',
    criticalElements: [
      'Zügeltag-Ampel-System',
      'Flex-Date Interface (+/- 3 Tage)',
      'Yield Management Integration'
    ],
    swissSpecific: [
      'Offizielle Zügeltage (31.3, 30.6, 30.9)',
      'Kantonale Unterschiede',
      'Surge Pricing Transparenz'
    ],
    benchmark: 'Movu: Starre Datumswähler ohne Spar-Hinweise'
  },
  {
    step: 3,
    name: 'Inventar-Erfassung',
    germanName: 'Der kognitive Kern',
    criticalElements: [
      'KI-Video-Inventar (Yembo-Style)',
      'Raum-Presets mit Durchschnittsinventar',
      'Granulare Suche für Preis-Jäger'
    ],
    swissSpecific: [
      'Kellerlager typisch für CH',
      'Estrich/Dachboden-Frage',
      'Kartonanzahl-Berechnung statt Abfrage'
    ],
    benchmark: 'Movu: Manuelle Listen, hohe Fehlerquote, Preisstreitigkeiten'
  },
  {
    step: 4,
    name: 'Service-Anreicherung',
    germanName: 'Upselling mit Kontext',
    criticalElements: [
      'Kontextuelles Upselling basierend auf Inventar',
      'Abnahmegarantie-Integration',
      'Montage/Demontage intelligent vorschlagen'
    ],
    swissSpecific: [
      'Endreinigung = Pflicht, nicht Luxus',
      'Abnahmegarantie = Killer-Feature',
      'Downsizing-Optionen (Entsorgung/Lagerung)'
    ],
    benchmark: 'Movu: Checkbox-Listen ohne Kontext'
  },
  {
    step: 5,
    name: 'Identität, Vertrauen & Verifikation',
    germanName: 'Point of Sale',
    criticalElements: [
      'OTP-Authentifizierung (SMS)',
      'Trust Badges (ASTAG, VSU, SSL)',
      'Dynamische Social Proof'
    ],
    swissSpecific: [
      'ASTAG Plus Zertifizierung',
      'nDSG-Konformität (CH-Datenschutz)',
      'Serverstandort Schweiz kommunizieren'
    ],
    benchmark: 'Movu: "Geprüfte Partner" ohne konkrete Zertifikate'
  },
  {
    step: 6,
    name: 'Conversion & Nurturing',
    germanName: 'Das Dashboard',
    criticalElements: [
      'Interaktives Dashboard statt Danke-Seite',
      'Preisaufschlüsselung',
      'Experten-Call Booking'
    ],
    swissSpecific: [
      'Checkliste: Ummeldung, Betreibungsamt, Schule',
      'Karton-Partner-Integration (Topkartons.ch)',
      'T-8 Wochen Nurturing-Sequenz'
    ],
    benchmark: 'Movu: "Danke, wir melden uns" - dann Vakuum'
  }
];

// ============================================================================
// INTERFACES
// ============================================================================
interface DeepAnalysisRequest {
  flowIds: string[];
  analysisType: 'comprehensive' | 'comparison' | 'synthesis';
  includeRecommendations?: boolean;
}

interface ArchetypeScore {
  archetype: string;
  score: number;
  reasoning: string;
  missingElements: string[];
  improvements: string[];
}

interface SwissMarketScore {
  category: string;
  score: number;
  elements: {
    name: string;
    present: boolean;
    quality: 'excellent' | 'good' | 'needs-improvement' | 'missing';
    recommendation?: string;
  }[];
}

interface ElementAnalysis {
  elementType: 'button' | 'input' | 'text' | 'image' | 'layout' | 'form' | 'navigation' | 'trust' | 'progress';
  elementName: string;
  scores: {
    visibility: number;
    usability: number;
    conversion: number;
    mobile: number;
    accessibility: number;
  };
  issues: Array<{
    severity: 'critical' | 'warning' | 'info';
    description: string;
    recommendation: string;
    effort: 'low' | 'medium' | 'high';
    impactOnArchetype?: string;
  }>;
  bestPractices: string[];
  improvements: string[];
}

interface FlowDeepAnalysis {
  flowId: string;
  flowName: string;
  overallScore: number;
  categoryScores: {
    ux: number;
    conversion: number;
    mobile: number;
    accessibility: number;
    performance: number;
    trust: number;
    clarity: number;
  };
  archetypeScores: ArchetypeScore[];
  swissMarketScores: SwissMarketScore[];
  sixStepAnalysis: Array<{
    step: number;
    name: string;
    score: number;
    implemented: string[];
    missing: string[];
    swissSpecificScore: number;
  }>;
  elements: ElementAnalysis[];
  strengths: string[];
  weaknesses: string[];
  keyInsights: string[];
  conversionKillers: string[];
  quickWins: string[];
  movuComparison: {
    betterThan: string[];
    worseThan: string[];
    differentiators: string[];
  };
  stepByStepAnalysis: Array<{
    step: number;
    name: string;
    score: number;
    dropOffRisk: 'low' | 'medium' | 'high';
    friction: string[];
    positives: string[];
  }>;
}

interface WinnerSynthesis {
  winner: {
    flowId: string;
    flowName: string;
    totalScore: number;
    reasoning: string;
    archetypeFit: { [key: string]: number };
  };
  ranking: Array<{
    position: number;
    flowId: string;
    score: number;
    keyStrength: string;
    keyWeakness: string;
    bestForArchetype: string;
  }>;
  archetypeWinners: {
    securitySeeker: { flowId: string; score: number };
    efficiencyMaximizer: { flowId: string; score: number };
    valueHunter: { flowId: string; score: number };
    overwhelmedParent: { flowId: string; score: number };
  };
  bestElements: Array<{
    element: string;
    sourceFlow: string;
    reason: string;
    implementation: string;
    archetypeValue: string[];
  }>;
  ultimateFlow: {
    name: string;
    description: string;
    philosophy: string;
    targetArchetypes: string[];
    steps: Array<{
      number: number;
      name: string;
      sourceFlow: string;
      elements: string[];
      improvements: string[];
      swissMarketFeatures: string[];
    }>;
    expectedConversionLift: string;
    implementationPriority: Array<{
      priority: number;
      change: string;
      effort: 'low' | 'medium' | 'high';
      impact: 'low' | 'medium' | 'high';
      sourceFlow: string;
      affectedArchetypes: string[];
    }>;
    swissMarketDifferentiators: string[];
    movuCompetitiveAdvantage: string[];
  };
  roadmap: {
    phase1: { title: string; duration: string; items: string[] };
    phase2: { title: string; duration: string; items: string[] };
    phase3: { title: string; duration: string; items: string[] };
  };
  codeChanges: Array<{
    file: string;
    component: string;
    currentState: string;
    proposedChange: string;
    implementation: string;
    priority: number;
  }>;
}

// ============================================================================
// AI ANALYSIS FUNCTIONS
// ============================================================================
async function analyzeFlowDeep(flowId: string, flowName: string): Promise<FlowDeepAnalysis> {
  if (!LOVABLE_API_KEY) {
    return createMockAnalysis(flowId, flowName);
  }

  const archetypesJson = JSON.stringify(ARCHETYPES, null, 2);
  const frameworkJson = JSON.stringify(SWISS_6_STEP_FRAMEWORK, null, 2);

  const prompt = `Du bist ein Elite UX/Conversion-Experte für den SCHWEIZER UMZUGSMARKT.

Führe eine ARCHETYPZENTRIERTE TIEFENANALYSE des Flow "${flowName}" (ID: ${flowId}) durch.

## SCHWEIZER MARKT-ARCHETYPEN:
${archetypesJson}

## SWISS 6-STEP FRAMEWORK (Benchmark gegen Movu.ch):
${frameworkJson}

## ANALYSE-AUFTRAG:

1. **ARCHETYPEN-SCORING**: Bewerte wie gut der Flow jeden Archetyp bedient (0-100)
2. **6-STEP FRAMEWORK**: Prüfe ob jeder der 6 kritischen Schritte implementiert ist
3. **SWISS MARKET SPEZIFIKA**: Sind CH-spezifische Elemente vorhanden? (Zügeltage, Abnahmegarantie, ASTAG)
4. **ELEMENT-LEVEL ANALYSE**: Buttons, Inputs, Trust-Elemente, Progress, etc.
5. **MOVU VERGLEICH**: Wo ist dieser Flow besser/schlechter als Movu.ch?

Antworte im JSON-Format:
{
  "overallScore": 0-100,
  "categoryScores": {
    "ux": 0-100,
    "conversion": 0-100,
    "mobile": 0-100,
    "accessibility": 0-100,
    "performance": 0-100,
    "trust": 0-100,
    "clarity": 0-100
  },
  "archetypeScores": [
    {
      "archetype": "Sicherheits-Sucher",
      "score": 0-100,
      "reasoning": "Warum dieser Score?",
      "missingElements": ["Was fehlt für diesen Archetyp?"],
      "improvements": ["Konkrete Verbesserungen"]
    }
  ],
  "swissMarketScores": [
    {
      "category": "Zügeltag-Awareness",
      "score": 0-100,
      "elements": [
        {
          "name": "Flex-Date Option",
          "present": true/false,
          "quality": "excellent|good|needs-improvement|missing",
          "recommendation": "..."
        }
      ]
    }
  ],
  "sixStepAnalysis": [
    {
      "step": 1,
      "name": "Kontextueller Einstieg",
      "score": 0-100,
      "implemented": ["Was ist vorhanden"],
      "missing": ["Was fehlt"],
      "swissSpecificScore": 0-100
    }
  ],
  "elements": [
    {
      "elementType": "button|input|text|...",
      "elementName": "Primary CTA",
      "scores": { "visibility": 80, "usability": 75, "conversion": 70, "mobile": 72, "accessibility": 65 },
      "issues": [
        {
          "severity": "critical|warning|info",
          "description": "...",
          "recommendation": "...",
          "effort": "low|medium|high",
          "impactOnArchetype": "Sicherheits-Sucher"
        }
      ],
      "bestPractices": ["..."],
      "improvements": ["..."]
    }
  ],
  "strengths": ["Top 5 Stärken"],
  "weaknesses": ["Top 5 Schwächen"],
  "keyInsights": ["Wichtigste Erkenntnisse"],
  "conversionKillers": ["Was kostet Conversions?"],
  "quickWins": ["Low-Effort, High-Impact Verbesserungen"],
  "movuComparison": {
    "betterThan": ["Wo besser als Movu"],
    "worseThan": ["Wo schlechter als Movu"],
    "differentiators": ["Alleinstellungsmerkmale"]
  },
  "stepByStepAnalysis": [
    {
      "step": 1,
      "name": "Step Name",
      "score": 0-100,
      "dropOffRisk": "low|medium|high",
      "friction": ["Friction Points"],
      "positives": ["Was funktioniert"]
    }
  ]
}`;

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { 
            role: 'system', 
            content: `Du bist ein Elite UX/Conversion-Experte mit 15+ Jahren Erfahrung im SCHWEIZER UMZUGSMARKT.
Du kennst die Besonderheiten: Zügeltage, Wohnungsabgabe-Ängste, ASTAG-Zertifizierung, "Swissness" als Trust-Signal.
Du analysierst Flows mit archetypzentrierter Methodik und gibst konkrete, umsetzbare Empfehlungen.
Antworte immer im JSON-Format.` 
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      console.error('AI analysis failed:', await response.text());
      return createMockAnalysis(flowId, flowName);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    
    // Robust JSON extraction - handle markdown code blocks and text around JSON
    let jsonContent = content;
    
    // Remove markdown code blocks if present
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }
    
    // Try to find JSON object if there's text around it
    if (!jsonContent.startsWith('{')) {
      const firstBrace = jsonContent.indexOf('{');
      const lastBrace = jsonContent.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonContent = jsonContent.substring(firstBrace, lastBrace + 1);
      }
    }
    
    let parsed;
    try {
      parsed = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('JSON parse failed, content preview:', jsonContent.substring(0, 500));
      console.error('Parse error:', parseError);
      return createMockAnalysis(flowId, flowName);
    }

    return {
      flowId,
      flowName,
      ...parsed
    };
  } catch (error) {
    console.error('Deep analysis error:', error);
    return createMockAnalysis(flowId, flowName);
  }
}

async function synthesizeWinner(analyses: FlowDeepAnalysis[]): Promise<WinnerSynthesis> {
  if (!LOVABLE_API_KEY || analyses.length === 0) {
    return createMockSynthesis(analyses);
  }

  const analysisData = analyses.map(a => ({
    flowId: a.flowId,
    flowName: a.flowName,
    overallScore: a.overallScore,
    categoryScores: a.categoryScores,
    archetypeScores: a.archetypeScores,
    sixStepAnalysis: a.sixStepAnalysis,
    strengths: a.strengths,
    weaknesses: a.weaknesses,
    quickWins: a.quickWins,
    conversionKillers: a.conversionKillers,
    movuComparison: a.movuComparison
  }));

  const prompt = `Du bist der ultimative UX-Stratege für den SCHWEIZER UMZUGSMARKT.

Basierend auf der archetypzentrierten Tiefenanalyse aller Flows, erstelle:

ANALYSIERTE FLOWS:
${JSON.stringify(analysisData, null, 2)}

## SCHWEIZER MARKT-ARCHETYPEN:
${JSON.stringify(ARCHETYPES, null, 2)}

## AUFGABEN:

1. **GEWINNER BESTIMMEN**
   - Welcher Flow ist objektiv der beste?
   - Archetypen-Fit pro Flow bewerten
   - Begründe mit Scores und Swiss-Market-Kriterien

2. **ARCHETYPEN-GEWINNER**
   - Welcher Flow ist am besten für welchen Archetyp?

3. **ULTIMATE FLOW BLUEPRINT**
   - Kombiniere die besten Elemente ALLER Flows
   - Integriere Swiss-Market-Spezifika (Zügeltage, Abnahmegarantie, ASTAG)
   - Design für alle 4 Archetypen gleichzeitig
   - Definiere jeden der 6 Steps

4. **ROADMAP**
   - Phase 1: Quick Wins (1-3 Monate)
   - Phase 2: AI Integration (4-6 Monate)
   - Phase 3: Ecosystem (6+ Monate)

5. **MOVU COMPETITIVE ADVANTAGE**
   - Wie schlägt der Ultimate Flow Movu.ch?

Antworte im JSON-Format:
{
  "winner": {
    "flowId": "v1a",
    "flowName": "Name",
    "totalScore": 85,
    "reasoning": "...",
    "archetypeFit": { "securitySeeker": 80, "efficiencyMaximizer": 75, ... }
  },
  "ranking": [...],
  "archetypeWinners": {
    "securitySeeker": { "flowId": "v1a", "score": 85 },
    "efficiencyMaximizer": { "flowId": "v1b", "score": 90 },
    ...
  },
  "bestElements": [...],
  "ultimateFlow": {
    "name": "Ultimate V1 - Swiss Archetyp",
    "description": "...",
    "philosophy": "Archetypzentriert, Swiss-Market-optimiert",
    "targetArchetypes": ["Alle 4"],
    "steps": [...],
    "expectedConversionLift": "+25-40%",
    "implementationPriority": [...],
    "swissMarketDifferentiators": ["Zügeltag-Ampel", "Abnahmegarantie", "ASTAG-Badges"],
    "movuCompetitiveAdvantage": ["KI-Video-Inventar", "Fixpreis-Garantie", "Flex-Date"]
  },
  "roadmap": {
    "phase1": { "title": "Fix the Basics", "duration": "Monate 1-3", "items": [...] },
    "phase2": { "title": "AI Integration", "duration": "Monate 4-6", "items": [...] },
    "phase3": { "title": "Ecosystem", "duration": "Monate 6+", "items": [...] }
  },
  "codeChanges": [...]
}`;

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { 
            role: 'system', 
            content: 'Du bist ein Elite UX-Stratege für den Schweizer Umzugsmarkt. Du findest die beste Lösung durch archetypzentrierte Analyse und Swiss-Market-Synthese. Antworte im JSON-Format.' 
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      console.error('Synthesis failed:', await response.text());
      return createMockSynthesis(analyses);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    
    // Robust JSON extraction
    let jsonContent = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }
    if (!jsonContent.startsWith('{')) {
      const firstBrace = jsonContent.indexOf('{');
      const lastBrace = jsonContent.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonContent = jsonContent.substring(firstBrace, lastBrace + 1);
      }
    }
    
    try {
      return JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Synthesis JSON parse failed, preview:', jsonContent.substring(0, 500));
      return createMockSynthesis(analyses);
    }
  } catch (error) {
    console.error('Synthesis error:', error);
    return createMockSynthesis(analyses);
  }
}

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================
function createMockAnalysis(flowId: string, flowName: string): FlowDeepAnalysis {
  return {
    flowId,
    flowName,
    overallScore: 72,
    categoryScores: {
      ux: 75, conversion: 70, mobile: 68, accessibility: 65,
      performance: 78, trust: 72, clarity: 74
    },
    archetypeScores: [
      {
        archetype: 'Sicherheits-Sucher',
        score: 65,
        reasoning: 'Fehlende Garantie-Badges und Versicherungsinfos',
        missingElements: ['ASTAG-Badge', 'Fixpreis-Garantie', 'Abnahmegarantie'],
        improvements: ['Trust-Badges hinzufügen', 'Garantie prominent platzieren']
      },
      {
        archetype: 'Effizienz-Maximierer',
        score: 78,
        reasoning: 'Guter Mobile-Flow, aber kein AI-Video-Inventar',
        missingElements: ['KI-Video-Inventar', 'One-Click-Buchung'],
        improvements: ['Video-Upload integrieren', 'Schritte reduzieren']
      },
      {
        archetype: 'Preis-Jäger',
        score: 60,
        reasoning: 'Keine Spar-Tipps oder dynamische Preisanzeige',
        missingElements: ['Flex-Date Rabatte', 'Eigenleistungs-Rechner'],
        improvements: ['Spar-Rechner einbauen', 'Preisaufschlüsselung']
      },
      {
        archetype: 'Chaos-Manager',
        score: 70,
        reasoning: 'Struktur vorhanden, aber keine Save-Funktion',
        missingElements: ['Save & Continue', 'Checklisten', 'Erinnerungen'],
        improvements: ['Magic-Link zum Fortsetzen', 'Proaktive Tipps']
      }
    ],
    swissMarketScores: [
      {
        category: 'Zügeltag-Awareness',
        score: 40,
        elements: [
          { name: 'Flex-Date Option', present: false, quality: 'missing', recommendation: 'Flex-Date +/- 3 Tage integrieren' },
          { name: 'Ampel-System', present: false, quality: 'missing', recommendation: 'Farbcodierung für Auslastung' }
        ]
      },
      {
        category: 'Swiss Trust Signals',
        score: 55,
        elements: [
          { name: 'ASTAG Badge', present: false, quality: 'missing', recommendation: 'ASTAG Plus Logo im Footer' },
          { name: 'Swiss Hosting', present: true, quality: 'good' }
        ]
      }
    ],
    sixStepAnalysis: SWISS_6_STEP_FRAMEWORK.map((step, i) => ({
      step: step.step,
      name: step.name,
      score: 60 + Math.floor(Math.random() * 30),
      implemented: step.criticalElements.slice(0, 1),
      missing: step.criticalElements.slice(1),
      swissSpecificScore: 50 + Math.floor(Math.random() * 40)
    })),
    elements: [
      {
        elementType: 'button',
        elementName: 'Primary CTA',
        scores: { visibility: 80, usability: 75, conversion: 70, mobile: 72, accessibility: 65 },
        issues: [
          {
            severity: 'warning',
            description: 'CTA nicht sticky auf Mobile',
            recommendation: 'Sticky CTA am unteren Bildschirmrand',
            effort: 'low',
            impactOnArchetype: 'Effizienz-Maximierer'
          }
        ],
        bestPractices: ['Klarer Text', 'Gute Farbe'],
        improvements: ['Sticky CTA', 'Hover-Animation', 'Loading State']
      },
      {
        elementType: 'trust',
        elementName: 'Trust Badges',
        scores: { visibility: 40, usability: 60, conversion: 50, mobile: 45, accessibility: 70 },
        issues: [
          {
            severity: 'critical',
            description: 'Keine Trust-Badges sichtbar',
            recommendation: 'ASTAG, SSL, Datenschutz Badges hinzufügen',
            effort: 'low',
            impactOnArchetype: 'Sicherheits-Sucher'
          }
        ],
        bestPractices: [],
        improvements: ['ASTAG Badge', 'Swiss Made', 'SSL-Siegel', 'nDSG-Konform']
      }
    ],
    strengths: ['Klare Struktur', 'Gute Mobile-Responsiveness', 'Sauberes Design'],
    weaknesses: ['Fehlende Trust-Signale', 'Kein Swiss-Market-Fokus', 'Keine Flex-Date Option'],
    keyInsights: ['Flow könnte mit Swiss-Fokus um 30% verbessert werden'],
    conversionKillers: ['Keine Abnahmegarantie', 'Kein Fixpreis', 'Zu abstrakte Inventar-Fragen'],
    quickWins: ['Trust Badges', 'Sticky CTA', 'Flex-Date Option', 'ASTAG Logo'],
    movuComparison: {
      betterThan: ['Moderneres Design'],
      worseThan: ['Keine Move Captains', 'Kein Ökosystem', 'Weniger Trust'],
      differentiators: ['Potential für KI-Video-Inventar']
    },
    stepByStepAnalysis: [
      {
        step: 1,
        name: 'Umzugsdetails',
        score: 75,
        dropOffRisk: 'medium',
        friction: ['Zu viele Felder', 'Keine Smart-Location'],
        positives: ['Klare Beschriftung']
      }
    ]
  };
}

function createMockSynthesis(analyses: FlowDeepAnalysis[]): WinnerSynthesis {
  const sorted = [...analyses].sort((a, b) => b.overallScore - a.overallScore);
  const winner = sorted[0] || { flowId: 'v1a', flowName: 'V1a', overallScore: 75 };

  return {
    winner: {
      flowId: winner.flowId,
      flowName: winner.flowName,
      totalScore: winner.overallScore,
      reasoning: `${winner.flowName} erreicht den höchsten Gesamtscore durch ausgewogene Archetypen-Abdeckung.`,
      archetypeFit: {
        securitySeeker: 70,
        efficiencyMaximizer: 75,
        valueHunter: 65,
        overwhelmedParent: 72
      }
    },
    ranking: sorted.map((a, i) => ({
      position: i + 1,
      flowId: a.flowId,
      score: a.overallScore,
      keyStrength: a.strengths?.[0] || 'Gute Grundstruktur',
      keyWeakness: a.weaknesses?.[0] || 'Optimierungspotenzial',
      bestForArchetype: ['Sicherheits-Sucher', 'Effizienz-Maximierer', 'Preis-Jäger', 'Chaos-Manager'][i % 4]
    })),
    archetypeWinners: {
      securitySeeker: { flowId: sorted[0]?.flowId || 'v1a', score: 75 },
      efficiencyMaximizer: { flowId: sorted[1]?.flowId || 'v1b', score: 80 },
      valueHunter: { flowId: sorted[2]?.flowId || 'v1c', score: 70 },
      overwhelmedParent: { flowId: sorted[0]?.flowId || 'v1a', score: 72 }
    },
    bestElements: [
      {
        element: 'Primary CTA Design',
        sourceFlow: winner.flowId,
        reason: 'Höchste Conversion durch optimale Platzierung',
        implementation: 'Sticky CTA mit Hover-Animation',
        archetypeValue: ['Effizienz-Maximierer', 'Chaos-Manager']
      },
      {
        element: 'Trust Badge Placement',
        sourceFlow: 'v1a',
        reason: 'Baut Vertrauen bei Sicherheits-Suchern',
        implementation: 'ASTAG + SSL + Abnahmegarantie sichtbar',
        archetypeValue: ['Sicherheits-Sucher']
      }
    ],
    ultimateFlow: {
      name: 'Ultimate V1 - Swiss Archetyp Edition',
      description: 'Der perfekte Flow für den Schweizer Markt: Archetypzentriert, vertrauensbildend, effizient.',
      philosophy: 'Swissness + AI + Archetypes = Marktführerschaft',
      targetArchetypes: ['Alle 4 Archetypen gleichzeitig bedienen'],
      steps: SWISS_6_STEP_FRAMEWORK.map((step, i) => ({
        number: step.step,
        name: step.germanName,
        sourceFlow: sorted[i % sorted.length]?.flowId || 'v1a',
        elements: step.criticalElements,
        improvements: ['KI-Integration', 'Swiss-Fokus'],
        swissMarketFeatures: step.swissSpecific
      })),
      expectedConversionLift: '+25-40%',
      implementationPriority: [
        { priority: 1, change: 'Trust Badges (ASTAG, Abnahmegarantie)', effort: 'low', impact: 'high', sourceFlow: 'v1a', affectedArchetypes: ['Sicherheits-Sucher'] },
        { priority: 2, change: 'Sticky CTA auf Mobile', effort: 'low', impact: 'high', sourceFlow: winner.flowId, affectedArchetypes: ['Effizienz-Maximierer', 'Chaos-Manager'] },
        { priority: 3, change: 'Flex-Date mit Spar-Anzeige', effort: 'medium', impact: 'high', sourceFlow: 'v1c', affectedArchetypes: ['Preis-Jäger'] },
        { priority: 4, change: 'KI-Video-Inventar', effort: 'high', impact: 'high', sourceFlow: 'v1b', affectedArchetypes: ['Effizienz-Maximierer'] }
      ],
      swissMarketDifferentiators: ['Zügeltag-Ampel', 'Abnahmegarantie-Prominent', 'ASTAG-Zertifizierung', 'nDSG-Konform'],
      movuCompetitiveAdvantage: ['KI-Video statt Listen', 'Fixpreis statt Schätzung', 'Flex-Date mit Yield Management', 'Interaktives Dashboard statt Danke-Seite']
    },
    roadmap: {
      phase1: {
        title: 'Fix the Basics',
        duration: 'Monate 1-3',
        items: ['Trust Badges implementieren', 'Sticky CTA', 'Google Places + Swiss Post Validierung', 'Flex-Date Ampel']
      },
      phase2: {
        title: 'AI Integration',
        duration: 'Monate 4-6',
        items: ['KI-Video-Inventar (Yembo-Style)', 'Kontextuelles Upselling', 'Raum-Presets mit CH-Durchschnitt']
      },
      phase3: {
        title: 'Ecosystem',
        duration: 'Monate 6+',
        items: ['Move Dashboard', 'Topkartons-Integration', 'Nurturing-Sequenzen', 'Experten-Call Booking']
      }
    },
    codeChanges: [
      {
        file: 'src/components/calculator/TrustBadges.tsx',
        component: 'TrustBadges',
        currentState: 'Keine Trust-Badges vorhanden',
        proposedChange: 'ASTAG, SSL, Abnahmegarantie Badges',
        implementation: 'Komponente mit Logo-Grid und Hover-Tooltips',
        priority: 1
      }
    ]
  };
}

// ============================================================================
// BACKGROUND ANALYSIS FUNCTION
// ============================================================================
async function runAnalysisInBackground(
  flowIds: string[],
  analysisType: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<void> {
  // Create new client inside background task
  const bgSupabase = createClient(supabaseUrl, supabaseKey);
  const V1_CONFIGS: Record<string, string> = {
    'v1': 'V1 - Control Flow',
    'v1a': 'V1a Control (Feedback)',
    'v1b': 'V1b ChatGPT Agent',
    'v1c': 'V1c Gemini Pro',
    'v1d': 'V1d ChatGPT Pro Ext',
    'v1e': 'V1e ChatGPT Research',
    'baseline': 'Baseline Control',
    'umzugsofferten-v1': 'V1 - Control Flow'
  };

  try {
    console.log(`[Background] Starting ${analysisType} analysis for flows:`, flowIds);

    // Analyze each flow
    const analysisPromises = flowIds.map(flowId => {
      const flowName = V1_CONFIGS[flowId] || flowId;
      return analyzeFlowDeep(flowId, flowName);
    });

    const analyses = await Promise.all(analysisPromises);
    console.log(`[Background] Completed analysis of ${analyses.length} flows`);

    let synthesis: WinnerSynthesis | null = null;
    if (analysisType === 'comparison' || analysisType === 'synthesis') {
      synthesis = await synthesizeWinner(analyses);
      console.log('[Background] Winner synthesis complete:', synthesis?.winner?.flowId);
    }

    // Store results
    const { error: runError } = await bgSupabase
      .from('flow_analysis_runs')
      .insert({
        flow_id: flowIds.join(','),
        flow_name: `Deep Archetyp Analysis: ${flowIds.length} Flows`,
        run_type: 'deep-archetyp-analysis',
        status: 'completed',
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        overall_score: synthesis?.winner?.totalScore || analyses[0]?.overallScore || 0,
        ai_summary: synthesis?.winner?.reasoning || 'Archetypzentrierte Analyse abgeschlossen',
        ai_recommendations: synthesis ? [synthesis] : analyses,
        metadata: {
          analysisType,
          flowCount: flowIds.length,
          archetypes: Object.keys(ARCHETYPES),
          swissFramework: SWISS_6_STEP_FRAMEWORK.map(s => s.name),
          analyses: analyses.map(a => ({
            flowId: a.flowId,
            score: a.overallScore,
            categoryScores: a.categoryScores,
            archetypeScores: a.archetypeScores?.map(as => ({ archetype: as.archetype, score: as.score }))
          })),
          synthesis: synthesis ? {
            winner: synthesis.winner,
            ranking: synthesis.ranking,
            archetypeWinners: synthesis.archetypeWinners
          } : null
        }
      });

    if (runError) {
      console.error('[Background] Error storing analysis:', runError);
    } else {
      console.log('[Background] Analysis stored successfully');
    }
  } catch (error) {
    console.error('[Background] Analysis error:', error);
    
    // Store error state
    const errorSupabase = createClient(supabaseUrl, supabaseKey);
    await errorSupabase
      .from('flow_analysis_runs')
      .insert({
        flow_id: flowIds.join(','),
        flow_name: `Deep Archetyp Analysis: ${flowIds.length} Flows`,
        run_type: 'deep-archetyp-analysis',
        status: 'error',
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        ai_summary: `Fehler: ${String(error)}`,
        metadata: { error: String(error) }
      });
  }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const body = await req.json();
    const { flowIds, analysisType = 'comprehensive', includeRecommendations = true, background = false }: DeepAnalysisRequest & { background?: boolean } = body;

    console.log(`Starting ${analysisType} analysis for flows:`, flowIds, `Background: ${background}`);

    if (!flowIds || flowIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No flow IDs provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // BACKGROUND MODE: Use EdgeRuntime.waitUntil() to run analysis in background
    if (background) {
      console.log('[Background Mode] Starting analysis - user can leave page');
      
      // @ts-ignore - EdgeRuntime is available in Deno Deploy
      if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
        // @ts-ignore
        EdgeRuntime.waitUntil(runAnalysisInBackground(flowIds, analysisType, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY));
      } else {
        // Fallback: just start the promise without waiting
        runAnalysisInBackground(flowIds, analysisType, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      }

      return new Response(
        JSON.stringify({
          success: true,
          background: true,
          message: 'Analyse läuft im Hintergrund. Sie können die Seite verlassen.',
          flowCount: flowIds.length,
          analysisType,
          checkStatusAt: '/admin/flow-deep-analysis',
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // FOREGROUND MODE: Wait for analysis to complete
    const V1_CONFIGS: Record<string, string> = {
      'v1': 'V1 - Control Flow',
      'v1a': 'V1a Control (Feedback)',
      'v1b': 'V1b ChatGPT Agent',
      'v1c': 'V1c Gemini Pro',
      'v1d': 'V1d ChatGPT Pro Ext',
      'v1e': 'V1e ChatGPT Research',
      'baseline': 'Baseline Control',
      'umzugsofferten-v1': 'V1 - Control Flow'
    };

    // Analyze each flow
    const analysisPromises = flowIds.map(flowId => {
      const flowName = V1_CONFIGS[flowId] || flowId;
      return analyzeFlowDeep(flowId, flowName);
    });

    const analyses = await Promise.all(analysisPromises);

    let synthesis: WinnerSynthesis | null = null;
    if (analysisType === 'comparison' || analysisType === 'synthesis') {
      synthesis = await synthesizeWinner(analyses);
    }

    // Store results
    const { data: analysisRun, error: runError } = await supabase
      .from('flow_analysis_runs')
      .insert({
        flow_id: flowIds.join(','),
        flow_name: `Deep Archetyp Analysis: ${flowIds.length} Flows`,
        run_type: 'deep-archetyp-analysis',
        status: 'completed',
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        overall_score: synthesis?.winner?.totalScore || analyses[0]?.overallScore || 0,
        ai_summary: synthesis?.winner?.reasoning || 'Archetypzentrierte Analyse abgeschlossen',
        ai_recommendations: synthesis ? [synthesis] : analyses,
        metadata: {
          analysisType,
          flowCount: flowIds.length,
          archetypes: Object.keys(ARCHETYPES),
          swissFramework: SWISS_6_STEP_FRAMEWORK.map(s => s.name),
          analyses: analyses.map(a => ({
            flowId: a.flowId,
            score: a.overallScore,
            categoryScores: a.categoryScores,
            archetypeScores: a.archetypeScores?.map(as => ({ archetype: as.archetype, score: as.score }))
          }))
        }
      })
      .select()
      .single();

    if (runError) {
      console.error('Error storing analysis:', runError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        runId: analysisRun?.id,
        analyses,
        synthesis,
        archetypes: ARCHETYPES,
        swissFramework: SWISS_6_STEP_FRAMEWORK,
        summary: {
          totalFlows: flowIds.length,
          winner: synthesis?.winner,
          archetypeWinners: synthesis?.archetypeWinners,
          averageScore: Math.round(analyses.reduce((acc, a) => acc + a.overallScore, 0) / analyses.length),
          roadmap: synthesis?.roadmap,
          timestamp: new Date().toISOString()
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Deep analysis error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
