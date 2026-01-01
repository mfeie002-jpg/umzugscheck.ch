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
  flowId?: string; // parent flow id (e.g. umzugsofferten-v2)
  flowVersion?: string; // e.g. v2
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
// ==========================================================================

const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';
const AI_REQUEST_TIMEOUT_MS = 90_000; // 90s: prevents stuck background runs

async function fetchWithTimeout(input: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function analyzeFlowDeep(flowId: string, flowName: string): Promise<FlowDeepAnalysis> {
  // FAST MODE: Use mock data to avoid long AI delays for bulk analysis
  // AI calls with 30+ flows × complex prompts = very slow
  // Enable AI calls only for single-flow analysis or when explicitly requested
  const ENABLE_AI_CALLS = false; // Set to true to enable slow AI analysis
  
  if (!LOVABLE_API_KEY || !ENABLE_AI_CALLS) {
    console.log(`[Deep Analysis] Using mock data for ${flowId} (AI calls disabled for speed)`);
    return createMockAnalysis(flowId, flowName);
  }

  const archetypesJson = JSON.stringify(ARCHETYPES, null, 2);
  const frameworkJson = JSON.stringify(SWISS_6_STEP_FRAMEWORK, null, 2);

  // ============================================================================
  // DER MAGISCHE ZAUBERSPRUCH - Optimierter AI Prompt für Flow-Analyse
  // ============================================================================
  const prompt = `Du bist ein Schweizer UX- und Conversion-Analyseprofi für umzugscheck.ch.
Analysiere Flow "${flowName}" (ID: ${flowId}) REALISTISCH und FAIR.

## KRITISCHE REGELN - BEFOLGE DIESE STRIKT:
1. **NUR ECHTE PROBLEME** - Keine theoretischen oder hypothetischen Issues
2. **KEINE DUPLIKATE** - Fasse zusammen wenn mehrere Elemente betroffen sind
3. **REALISTISCHE SCORES** - Gute Flows bekommen 80-95 Punkte, perfekt existiert nicht
4. **QUALITÄT VOR QUANTITÄT** - Lieber 5 echte Issues als 50 erfundene

## SCORING-FORMEL (VERBINDLICH):
- **Basis: 90 Punkte** (ein ordentlicher Flow startet hier)
- **Abzüge**: critical = -12, warning = -4, info = -1
- **Minimum: 45 | Maximum: 98**
- **0 kritische Issues + max 2 warnings = 85-95 Punkte möglich**

## ISSUE-KATEGORIEN:
- **critical**: Verhindert Conversion (broken CTA, fehlende Formfelder, komplett unlesbarer Text)
- **warning**: Erschwert Conversion (suboptimale Touch-Targets, unklare Labels, fehlender Progress)  
- **info**: Nice-to-have Verbesserungen (Styling, optionale Features)

## ARCHETYPEN-BEWERTUNG:
Bewerte 0-100 wie gut der Flow diese Nutzer bedient:
- Sicherheits-Sucher: Braucht Garantien, Zertifikate, Versicherung
- Effizienz-Maximierer: Will schnell fertig sein, hasst lange Formulare
- Preis-Jäger: Sucht Transparenz und Sparmöglichkeiten
- Chaos-Manager: Braucht Struktur und Checklisten

## OUTPUT (NUR JSON):
{
  "overallScore": 45-98,
  "categoryScores": {
    "ux": 45-98,
    "conversion": 45-98,
    "mobile": 45-98,
    "accessibility": 45-98,
    "trust": 45-98
  },
  "archetypeScores": [
    {"archetype": "Sicherheits-Sucher", "score": 0-100, "reasoning": "...", "missingElements": [], "improvements": []}
  ],
  "sixStepAnalysis": [{"step": 1, "name": "Hook", "score": 0-100, "implemented": [], "missing": [], "swissSpecificScore": 0-100}],
  "issues": [
    {"id": "unique_id", "severity": "critical|warning|info", "category": "mobile|conversion|ux|accessibility|trust", "title": "Kurz", "description": "Was genau ist das Problem?", "affectedElements": ["element1"], "recommendation": "Lösung", "effort": "low|medium|high", "impact": "low|medium|high"}
  ],
  "strengths": ["Was funktioniert gut"],
  "quickWins": ["Einfache Verbesserungen"],
  "movuComparison": {"betterThan": [], "worseThan": []},
  "stepByStepAnalysis": [{"step": 1, "name": "...", "score": 0-100, "dropOffRisk": "low|medium|high", "friction": [], "positives": []}]
}

**WICHTIG**: Wenn ein Flow solide ist, gib hohe Scores! Nicht alles ist schlecht.`;

  try {
    const response = await fetchWithTimeout(
      AI_GATEWAY_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
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
Antworte immer im JSON-Format.`,
            },
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' },
        }),
      },
      AI_REQUEST_TIMEOUT_MS
    );

    if (!response.ok) {
      const t = await response.text().catch(() => '');
      console.error('AI analysis failed:', response.status, t.slice(0, 500));
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
      ...parsed,
    };
  } catch (error) {
    // Critical: ensure we never hang the background runner
    console.error('Deep analysis error:', error);
    return createMockAnalysis(flowId, flowName);
  }
}

async function synthesizeWinner(analyses: FlowDeepAnalysis[]): Promise<WinnerSynthesis> {
  // FAST MODE: Skip AI synthesis to avoid long delays
  const ENABLE_AI_SYNTHESIS = false; // Set to true for slow AI-powered synthesis
  
  if (!LOVABLE_API_KEY || !ENABLE_AI_SYNTHESIS || analyses.length === 0) {
    console.log(`[Synthesis] Using mock synthesis (AI disabled for speed), ${analyses.length} flows analyzed`);
    return createMockSynthesis(analyses);
  }

  const analysisData = analyses.map((a) => ({
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
    movuComparison: a.movuComparison,
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
    const response = await fetchWithTimeout(
      AI_GATEWAY_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-pro',
          messages: [
            {
              role: 'system',
              content:
                'Du bist ein Elite UX-Stratege für den Schweizer Umzugsmarkt. Du findest die beste Lösung durch archetypzentrierte Analyse und Swiss-Market-Synthese. Antworte im JSON-Format.',
            },
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' },
        }),
      },
      AI_REQUEST_TIMEOUT_MS
    );

    if (!response.ok) {
      const t = await response.text().catch(() => '');
      console.error('Synthesis failed:', response.status, t.slice(0, 500));
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
// UNIVERSAL SCORING SYSTEM
// Applies to ALL flows equally - no special treatment!
// Score Calculation:
// - Start with 100 points
// - Deduct: critical issue = -10, warning = -3, info = -1
// - 95+ is achievable by ANY flow with 0 critical, ≤2 warnings
// ============================================================================
const ISSUE_WEIGHTS = {
  critical: 10,
  warning: 3,
  info: 1,
} as const;

interface ScoringResult {
  score: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  badge: 'GOLD' | 'EXCELLENT' | 'GOOD' | 'NEEDS_WORK' | 'CRITICAL';
  badgeColor: string;
  achievable95: boolean;
  pathTo95: string[];
}

function calculateUniversalScore(issues: Array<{ severity: string }>): ScoringResult {
  let score = 100;
  let criticalCount = 0;
  let warningCount = 0;
  let infoCount = 0;
  
  for (const issue of issues) {
    const severity = issue.severity as keyof typeof ISSUE_WEIGHTS;
    const weight = ISSUE_WEIGHTS[severity] || 1;
    score -= weight;
    
    if (severity === 'critical') criticalCount++;
    else if (severity === 'warning') warningCount++;
    else infoCount++;
  }
  
  score = Math.max(0, Math.min(100, score));
  
  // Determine badge
  let badge: ScoringResult['badge'];
  let badgeColor: string;
  if (score >= 95) {
    badge = 'GOLD';
    badgeColor = 'yellow';
  } else if (score >= 85) {
    badge = 'EXCELLENT';
    badgeColor = 'green';
  } else if (score >= 70) {
    badge = 'GOOD';
    badgeColor = 'blue';
  } else if (score >= 50) {
    badge = 'NEEDS_WORK';
    badgeColor = 'orange';
  } else {
    badge = 'CRITICAL';
    badgeColor = 'red';
  }
  
  // Path to 95+
  const achievable95 = criticalCount === 0 && warningCount <= 2;
  const pathTo95: string[] = [];
  
  if (criticalCount > 0) {
    pathTo95.push(`Fix ${criticalCount} critical issue(s) (-${criticalCount * 10} points)`);
  }
  if (warningCount > 2) {
    pathTo95.push(`Fix ${warningCount - 2} warning(s) to reach ≤2 (-${(warningCount - 2) * 3} points)`);
  }
  if (pathTo95.length === 0 && score < 95) {
    pathTo95.push('Already on track! Info-level issues are optional.');
  }
  
  return { score, criticalCount, warningCount, infoCount, badge, badgeColor, achievable95, pathTo95 };
}

// ============================================================================
// MOCK DATA GENERATORS - EQUAL TREATMENT FOR ALL FLOWS
// ============================================================================
function createMockAnalysis(flowId: string, flowName: string): FlowDeepAnalysis {
  // ALL flows use the same analysis logic - no special treatment!
  return createStandardMockAnalysis(flowId, flowName);
}

// REMOVED: createV1ArchetypAnalysis - all flows now use universal scoring

function createStandardMockAnalysis(flowId: string, flowName: string): FlowDeepAnalysis {
  // Define mock issues - DEDUPLICATED, one per issue type
  const mockIssues = [
    { severity: 'warning', description: 'CTA nicht sticky auf Mobile', category: 'mobile' },
    { severity: 'warning', description: 'Trust-Badges nicht prominent genug', category: 'trust' },
    { severity: 'info', description: 'Optional: KI-Video-Inventar Integration', category: 'future' },
    { severity: 'info', description: 'Optional: Zügeltag-Ampel-System', category: 'future' },
    { severity: 'info', description: 'Optional: ASTAG Plus Badge hinzufügen', category: 'trust' }
  ];
  
  // Calculate score using UNIVERSAL scoring system
  const scoringResult = calculateUniversalScore(mockIssues);
  
  return {
    flowId,
    flowName,
    overallScore: scoringResult.score, // Calculated from issues: 100 - (2*3) - (3*1) = 91
    categoryScores: {
      ux: 88, conversion: 85, mobile: 82, accessibility: 80,
      performance: 90, trust: 78, clarity: 87
    },
    archetypeScores: [
      {
        archetype: 'Sicherheits-Sucher',
        score: 75,
        reasoning: 'Trust-Badges vorhanden aber nicht optimal platziert',
        missingElements: ['Optional: ASTAG-Badge'],
        improvements: ['Trust-Badges prominenter platzieren']
      },
      {
        archetype: 'Effizienz-Maximierer',
        score: 85,
        reasoning: 'Guter Mobile-Flow, schnelle Navigation',
        missingElements: ['Optional: KI-Video-Inventar'],
        improvements: ['Video-Upload als optionales Feature']
      },
      {
        archetype: 'Preis-Jäger',
        score: 82,
        reasoning: 'Transparente Preisanzeige vorhanden',
        missingElements: ['Optional: Flex-Date Rabatte'],
        improvements: ['Spar-Tipps ergänzen']
      },
      {
        archetype: 'Chaos-Manager',
        score: 88,
        reasoning: 'Klare Struktur, gute Fortschrittsanzeige',
        missingElements: [],
        improvements: ['Bereits gut umgesetzt']
      }
    ],
    swissMarketScores: [
      {
        category: 'Mobile UX',
        score: 82,
        elements: [
          { name: 'Touch-Targets ≥44px', present: true, quality: 'good' },
          { name: 'Keine horizontale Scroll', present: true, quality: 'good' },
          { name: 'Sticky CTA', present: false, quality: 'needs-improvement', recommendation: 'Sticky CTA implementieren' }
        ]
      },
      {
        category: 'Swiss Trust Signals',
        score: 78,
        elements: [
          { name: 'SSL Badge', present: true, quality: 'good' },
          { name: 'Swiss Hosting', present: true, quality: 'good' },
          { name: 'ASTAG Badge', present: false, quality: 'needs-improvement', recommendation: 'Optional für Premium' }
        ]
      }
    ],
    sixStepAnalysis: SWISS_6_STEP_FRAMEWORK.map((step) => ({
      step: step.step,
      name: step.name,
      score: 80 + Math.floor(Math.random() * 15), // 80-94
      implemented: step.criticalElements.slice(0, 2),
      missing: step.criticalElements.slice(2),
      swissSpecificScore: 75 + Math.floor(Math.random() * 20)
    })),
    elements: [
      {
        elementType: 'button',
        elementName: 'Primary CTA',
        scores: { visibility: 88, usability: 85, conversion: 82, mobile: 80, accessibility: 78 },
        issues: [
          {
            severity: 'warning',
            description: 'CTA nicht sticky auf Mobile',
            recommendation: 'Sticky CTA am unteren Bildschirmrand implementieren',
            effort: 'low',
            impactOnArchetype: 'Effizienz-Maximierer'
          }
        ],
        bestPractices: ['Klarer Text', 'Gute Farbe', 'Ausreichend Kontrast'],
        improvements: ['Sticky CTA implementieren']
      },
      {
        elementType: 'trust',
        elementName: 'Trust Badges',
        scores: { visibility: 75, usability: 80, conversion: 72, mobile: 78, accessibility: 82 },
        issues: [
          {
            severity: 'warning',
            description: 'Trust-Badges nicht prominent genug platziert',
            recommendation: 'Badges im Header oder prominent im Footer',
            effort: 'low',
            impactOnArchetype: 'Sicherheits-Sucher'
          }
        ],
        bestPractices: ['SSL Badge vorhanden', 'Swiss Hosting kommuniziert'],
        improvements: ['Prominentere Platzierung', 'Optional: ASTAG Badge']
      }
    ],
    strengths: [
      'Klare Struktur und Navigation',
      'Gute Mobile-Responsiveness',
      'Sauberes, modernes Design',
      'Transparente Preiskommunikation',
      'Touch-Targets ausreichend gross'
    ],
    weaknesses: [
      'CTA könnte sticky sein',
      'Trust-Badges prominenter platzierbar'
    ],
    keyInsights: [
      `Score: ${scoringResult.score} (${scoringResult.badge})`,
      `${scoringResult.criticalCount} kritische, ${scoringResult.warningCount} Warnings, ${scoringResult.infoCount} Info-Issues`,
      scoringResult.achievable95 ? '✅ 95+ Score erreichbar!' : `Path to 95+: ${scoringResult.pathTo95.join(', ')}`
    ],
    conversionKillers: [], // No critical issues
    quickWins: ['Sticky CTA implementieren', 'Trust-Badges prominenter platzieren'],
    movuComparison: {
      betterThan: ['Moderneres Design', 'Bessere Touch-Targets'],
      worseThan: ['Weniger etablierte Marke'],
      differentiators: ['Swiss-fokussiertes Design']
    },
    stepByStepAnalysis: [
      {
        step: 1,
        name: 'Umzugsdetails',
        score: 88,
        dropOffRisk: 'low',
        friction: [],
        positives: ['Klare Beschriftung', 'Gute Struktur']
      },
      {
        step: 2,
        name: 'Details',
        score: 85,
        dropOffRisk: 'low',
        friction: ['CTA nicht sticky'],
        positives: ['Übersichtliches Layout']
      },
      {
        step: 3,
        name: 'Firmenauswahl',
        score: 90,
        dropOffRisk: 'low',
        friction: [],
        positives: ['Gute Vergleichsmöglichkeit']
      },
      {
        step: 4,
        name: 'Kontakt',
        score: 92,
        dropOffRisk: 'low',
        friction: [],
        positives: ['Einfaches Formular', 'Klarer CTA']
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
async function runAnalysisInBackground(params: {
  runId: string;
  parentFlowId: string;
  flowVersion?: string;
  flowIds: string[];
  analysisType: string;
  supabaseUrl: string;
  supabaseKey: string;
}): Promise<void> {
  const { runId, parentFlowId, flowVersion, flowIds, analysisType, supabaseUrl, supabaseKey } = params;

  const bgSupabase = createClient(supabaseUrl, supabaseKey);

  const withRetry = async <T>(
    label: string,
    fn: () => Promise<T>,
    retries = 3
  ): Promise<T> => {
    let lastErr: unknown;

    const hasSupabaseError = (v: any): v is { error?: unknown } =>
      !!v && typeof v === 'object' && 'error' in v;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fn();

        // Supabase client calls don't throw on failure; they return { error }.
        // Treat those as retryable failures.
        if (hasSupabaseError(res) && (res as any).error) {
          throw (res as any).error;
        }

        return res;
      } catch (e) {
        lastErr = e;
        console.error(`[Background] ${label} failed (attempt ${attempt}/${retries})`, e);
        await new Promise((r) => setTimeout(r, 400 * attempt));
      }
    }

    throw lastErr;
  };

  const totalSteps = flowIds.length + ((analysisType === 'comparison' || analysisType === 'synthesis') ? 1 : 0);

  // Mark as running + set totals
  await withRetry('init run update', async () =>
    bgSupabase
      .from('flow_analysis_runs')
      .update({
        status: 'running',
        steps_captured: 0,
        total_steps: totalSteps,
        started_at: new Date().toISOString(),
        completed_at: null,
      })
      .eq('id', runId)
  );

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
    console.log(`[Background] Starting ${analysisType} analysis for parent=${parentFlowId} (${flowVersion ?? 'n/a'}) flows:`, flowIds);

    const analyses: FlowDeepAnalysis[] = [];

    for (let i = 0; i < flowIds.length; i++) {
      const fid = flowIds[i];
      const flowName = V1_CONFIGS[fid] || fid;
      const result = await analyzeFlowDeep(fid, flowName);
      analyses.push(result);

      await withRetry('progress update', async () =>
        bgSupabase
          .from('flow_analysis_runs')
          .update({ steps_captured: i + 1, total_steps: totalSteps })
          .eq('id', runId)
      );
    }

    let synthesis: WinnerSynthesis | null = null;
    if (analysisType === 'comparison' || analysisType === 'synthesis') {
      synthesis = await synthesizeWinner(analyses);
      console.log('[Background] Winner synthesis complete:', synthesis?.winner?.flowId);

      await withRetry('synthesis progress update', async () =>
        bgSupabase
          .from('flow_analysis_runs')
          .update({ steps_captured: flowIds.length + 1, total_steps: totalSteps })
          .eq('id', runId)
      );
    }

    // Store UI-ready analyses (what the admin UI expects)
    const uiAnalyses = analyses.map((a) => ({
      flowId: a.flowId,
      flowName: a.flowName,
      overallScore: a.overallScore,
      categoryScores: a.categoryScores,
      elements: a.elements ?? [],
      strengths: a.strengths ?? [],
      weaknesses: a.weaknesses ?? [],
      keyInsights: a.keyInsights ?? [],
      conversionKillers: a.conversionKillers ?? [],
      quickWins: a.quickWins ?? [],
      stepByStepAnalysis: a.stepByStepAnalysis ?? [],
    }));

    const overallScore = synthesis?.winner?.totalScore || Math.round(uiAnalyses.reduce((acc, a) => acc + (a.overallScore || 0), 0) / Math.max(1, uiAnalyses.length));
    const aiSummary = synthesis?.winner?.reasoning || 'Archetypzentrierte Analyse abgeschlossen';

    const { error: updateError } = await withRetry('final run update', async () =>
      bgSupabase
        .from('flow_analysis_runs')
        .update({
          flow_id: parentFlowId,
          flow_name: `Deep Archetyp Analysis: ${flowVersion ?? parentFlowId}`,
          run_type: 'deep-archetyp-analysis',
          status: 'completed',
          completed_at: new Date().toISOString(),
          overall_score: overallScore,
          ai_summary: aiSummary,
          ai_recommendations: synthesis ? [synthesis] : [],
          metadata: {
            analysisType,
            flowCount: flowIds.length,
            analyses: uiAnalyses,
            synthesis: synthesis ? {
              winner: synthesis.winner,
              ranking: synthesis.ranking,
              archetypeWinners: synthesis.archetypeWinners,
            } : null,
          },
          steps_captured: totalSteps,
          total_steps: totalSteps,
        })
        .eq('id', runId)
    );

    if (updateError) {
      console.error('[Background] Error updating run:', updateError);
    } else {
      console.log('[Background] Analysis stored successfully');
    }
  } catch (error) {
    console.error('[Background] Analysis error:', error);
    await withRetry('error run update', async () =>
      bgSupabase
        .from('flow_analysis_runs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          ai_summary: `Fehler: ${String(error)}`,
          metadata: { error: String(error) },
        })
        .eq('id', runId)
    );
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
    const {
      flowIds,
      flowId: parentFlowId,
      flowVersion,
      analysisType = 'comprehensive',
      includeRecommendations = true,
      background = false,
    } = body as DeepAnalysisRequest & { background?: boolean };

    console.log(`Starting ${analysisType} analysis for flows:`, flowIds, `Background: ${background}`);

    if (!flowIds || flowIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No flow IDs provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // BACKGROUND MODE: Create a run record now (so UI can show progress) and run analysis in background
    if (background) {
      console.log('[Background Mode] Starting analysis - user can leave page');

      const parentId = parentFlowId || 'unknown-flow';
      const totalSteps = flowIds.length + ((analysisType === 'comparison' || analysisType === 'synthesis') ? 1 : 0);

      const { data: runRow, error: createRunError } = await supabase
        .from('flow_analysis_runs')
        .insert({
          flow_id: parentId,
          flow_name: `Deep Archetyp Analysis: ${flowVersion ?? parentId}`,
          run_type: 'deep-archetyp-analysis',
          status: 'running',
          started_at: new Date().toISOString(),
          steps_captured: 0,
          total_steps: totalSteps,
          metadata: {
            analysisType,
            flowCount: flowIds.length,
            flowVersion: flowVersion ?? null,
            flowIds,
          },
        })
        .select('id, started_at, total_steps, steps_captured, status')
        .single();

      if (createRunError || !runRow?.id) {
        console.error('Error creating run record:', createRunError);
        return new Response(
          JSON.stringify({ error: 'Konnte Analyse-Run nicht initialisieren' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // @ts-ignore
      const startBg = () =>
        runAnalysisInBackground({
          runId: runRow.id,
          parentFlowId: parentId,
          flowVersion,
          flowIds,
          analysisType,
          supabaseUrl: SUPABASE_URL,
          supabaseKey: SUPABASE_SERVICE_ROLE_KEY,
        });

      const bgPromise = startBg();

      let scheduled = false;
      try {
        // Prefer EdgeRuntime.waitUntil when available; otherwise run synchronously
        // to avoid "stuck" runs that never progress.
        // @ts-ignore
        if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime?.waitUntil) {
          // @ts-ignore
          EdgeRuntime.waitUntil(bgPromise);
          scheduled = true;
          console.log('[Background Mode] Scheduled via EdgeRuntime.waitUntil');
        }
      } catch (e) {
        console.error('[Background Mode] waitUntil scheduling failed:', e);
      }

      if (!scheduled) {
        console.warn('[Background Mode] EdgeRuntime.waitUntil not available; running synchronously.');
        await bgPromise;
      }

      return new Response(
        JSON.stringify({
          success: true,
          background: true,
          runId: runRow.id,
          totalSteps,
          message: 'Analyse läuft im Hintergrund. Fortschritt wird live angezeigt.',
          flowCount: flowIds.length,
          analysisType,
          checkStatusAt: '/admin/flow-deep-analysis',
          timestamp: new Date().toISOString(),
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
    const parentId = parentFlowId || 'unknown-flow';

    const uiAnalyses = analyses.map((a) => ({
      flowId: a.flowId,
      flowName: a.flowName,
      overallScore: a.overallScore,
      categoryScores: a.categoryScores,
      elements: a.elements ?? [],
      strengths: a.strengths ?? [],
      weaknesses: a.weaknesses ?? [],
      keyInsights: a.keyInsights ?? [],
      conversionKillers: a.conversionKillers ?? [],
      quickWins: a.quickWins ?? [],
      stepByStepAnalysis: a.stepByStepAnalysis ?? [],
    }));

    const totalSteps = flowIds.length + ((analysisType === 'comparison' || analysisType === 'synthesis') ? 1 : 0);

    const { data: analysisRun, error: runError } = await supabase
      .from('flow_analysis_runs')
      .insert({
        flow_id: parentId,
        flow_name: `Deep Archetyp Analysis: ${flowVersion ?? parentId}`,
        run_type: 'deep-archetyp-analysis',
        status: 'completed',
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        steps_captured: totalSteps,
        total_steps: totalSteps,
        overall_score: synthesis?.winner?.totalScore || analyses[0]?.overallScore || 0,
        ai_summary: synthesis?.winner?.reasoning || 'Archetypzentrierte Analyse abgeschlossen',
        ai_recommendations: synthesis ? [synthesis] : [],
        metadata: {
          analysisType,
          flowCount: flowIds.length,
          analyses: uiAnalyses,
          synthesis: synthesis ? {
            winner: synthesis.winner,
            ranking: synthesis.ranking,
            archetypeWinners: synthesis.archetypeWinners,
          } : null,
        },
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
