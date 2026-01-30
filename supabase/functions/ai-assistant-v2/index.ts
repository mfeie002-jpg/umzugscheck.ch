import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Tool definitions for Relo-OS actions
const TOOLS = [
  {
    type: "function",
    function: {
      name: "calculate_moving_cost",
      description: "Berechnet geschätzte Umzugskosten basierend auf PLZ und Wohnungsgrösse",
      parameters: {
        type: "object",
        properties: {
          from_postal: { type: "string", description: "Ausgangs-PLZ (4 Ziffern)" },
          to_postal: { type: "string", description: "Ziel-PLZ (4 Ziffern)" },
          room_count: { type: "number", description: "Anzahl Zimmer" },
          move_date: { type: "string", description: "Gewünschtes Umzugsdatum (YYYY-MM-DD)" }
        },
        required: ["from_postal", "to_postal", "room_count"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "check_eumzug_support",
      description: "Prüft ob eine Gemeinde eUmzugCH (elektronische Ummeldung) unterstützt",
      parameters: {
        type: "object",
        properties: {
          postal_code: { type: "string", description: "PLZ der Gemeinde" }
        },
        required: ["postal_code"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_canton_info",
      description: "Gibt Informationen über einen Kanton (Umzugskosten, Steuern, Lebenskosten)",
      parameters: {
        type: "object",
        properties: {
          canton: { type: "string", description: "Kantonskürzel (z.B. ZH, BE, BS) oder Name" }
        },
        required: ["canton"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_disposal_info",
      description: "Gibt Entsorgungsinformationen für eine Stadt/PLZ",
      parameters: {
        type: "object",
        properties: {
          postal_code: { type: "string", description: "PLZ für Entsorgungsinfos" }
        },
        required: ["postal_code"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "calculate_eco_score",
      description: "Berechnet den CO2-Fussabdruck eines Umzugs",
      parameters: {
        type: "object",
        properties: {
          distance_km: { type: "number", description: "Entfernung in km" },
          room_count: { type: "number", description: "Anzahl Zimmer" }
        },
        required: ["distance_km", "room_count"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_parking_permit_info",
      description: "Gibt Informationen zu Halteverbot/Parkbewilligung für eine Stadt",
      parameters: {
        type: "object",
        properties: {
          city: { type: "string", description: "Stadt (z.B. Zürich, Basel, Bern)" },
          move_date: { type: "string", description: "Umzugsdatum (YYYY-MM-DD)" }
        },
        required: ["city"]
      }
    }
  }
];

// Tool implementations
const toolImplementations: Record<string, (args: any) => any> = {
  calculate_moving_cost: (args) => {
    const { from_postal, to_postal, room_count, move_date } = args;
    
    // Simplified calculation (in production, use actual pricing engine)
    const basePrice = room_count <= 2 ? 800 : room_count <= 3 ? 1100 : room_count <= 4 ? 1450 : 2200;
    const distanceFactor = from_postal.charAt(0) === to_postal.charAt(0) ? 1.0 : 1.3;
    
    // Seasonal adjustment
    let seasonFactor = 1.0;
    if (move_date) {
      const month = new Date(move_date).getMonth();
      if (month >= 5 && month <= 8) seasonFactor = 1.15; // Jun-Sep peak
      if (month === 10 || month === 11 || month === 0) seasonFactor = 0.85; // Nov-Jan low
    }
    
    const minPrice = Math.round(basePrice * distanceFactor * seasonFactor * 0.85);
    const maxPrice = Math.round(basePrice * distanceFactor * seasonFactor * 1.25);
    
    return {
      estimate: {
        min: minPrice,
        max: maxPrice,
        average: Math.round((minPrice + maxPrice) / 2)
      },
      factors: {
        rooms: room_count,
        distance: distanceFactor > 1 ? "Kantonsübergreifend" : "Innerhalb Kanton",
        season: seasonFactor > 1 ? "Hochsaison" : seasonFactor < 1 ? "Nebensaison" : "Normal"
      },
      recommendation: "Für genaue Preise empfehlen wir, kostenlose Offerten von geprüften Umzugsfirmen einzuholen."
    };
  },
  
  check_eumzug_support: (args) => {
    const { postal_code } = args;
    // Major cities with eUmzug support
    const eumzugCities = ['8001', '8002', '8003', '8004', '8005', '3000', '3001', '4000', '4001', '6000', '9000'];
    const supported = eumzugCities.some(p => postal_code.startsWith(p.slice(0, 2)));
    
    return {
      supported,
      message: supported 
        ? "Diese Gemeinde unterstützt eUmzugCH. Sie können sich online an- und abmelden."
        : "Diese Gemeinde unterstützt eUmzugCH möglicherweise nicht. Bitte prüfen Sie die Website Ihrer Gemeinde.",
      link: "https://www.eumzug.swiss",
      deadline: "14 Tage nach Umzug"
    };
  },
  
  get_canton_info: (args) => {
    const { canton } = args;
    const cantonData: Record<string, any> = {
      'ZH': { name: 'Zürich', avgCost: 1450, taxRate: 22.5, costIndex: 128 },
      'BE': { name: 'Bern', avgCost: 1120, taxRate: 23.1, costIndex: 99 },
      'BS': { name: 'Basel-Stadt', avgCost: 1280, taxRate: 26.8, costIndex: 113 },
      'GE': { name: 'Genf', avgCost: 1650, taxRate: 28.5, costIndex: 145 },
      'ZG': { name: 'Zug', avgCost: 1580, taxRate: 12.8, costIndex: 139 },
      'LU': { name: 'Luzern', avgCost: 1180, taxRate: 23.8, costIndex: 104 },
    };
    
    const code = canton.toUpperCase().slice(0, 2);
    const data = cantonData[code];
    
    if (!data) {
      return { error: "Kanton nicht gefunden. Verfügbar: ZH, BE, BS, GE, ZG, LU" };
    }
    
    return {
      canton: data.name,
      movingCosts: {
        average3Room: data.avgCost,
        index: data.costIndex,
        comparison: data.costIndex > 100 ? `${data.costIndex - 100}% über CH-Durchschnitt` : `${100 - data.costIndex}% unter CH-Durchschnitt`
      },
      taxes: {
        effectiveRate: data.taxRate,
        comparison: data.taxRate < 20 ? "Niedrig" : data.taxRate < 25 ? "Mittel" : "Hoch"
      }
    };
  },
  
  get_disposal_info: (args) => {
    const { postal_code } = args;
    const cityPrefix = postal_code.slice(0, 2);
    
    const cityInfo: Record<string, any> = {
      '80': { city: 'Zürich', sperrgut: 'ERZ Online-Anmeldung', bulkyWaste: 'Gratis bei Sammelstelle' },
      '30': { city: 'Bern', sperrgut: 'Entsorgung + Recycling Bern', bulkyWaste: 'Online anmelden' },
      '40': { city: 'Basel', sperrgut: 'Stadtreinigung Basel', bulkyWaste: 'Sperrgutmarken kaufen' },
    };
    
    const info = cityInfo[cityPrefix] || { city: 'Ihre Gemeinde', sperrgut: 'Gemeinde kontaktieren' };
    
    return {
      city: info.city,
      categories: [
        { type: 'Sperrgut', info: info.sperrgut },
        { type: 'Elektroschrott', info: 'Kostenlos bei jedem Elektrohändler' },
        { type: 'Altöl/Chemie', info: 'Sammelstelle oder Recyclinghof' },
        { type: 'Karton', info: 'Gebündelt beim regulären Papier' }
      ],
      tip: "Elektrogeräte können kostenlos bei jedem Händler abgegeben werden, der solche Geräte verkauft."
    };
  },
  
  calculate_eco_score: (args) => {
    const { distance_km, room_count } = args;
    
    // CO2 calculation
    const transportCO2 = distance_km * 0.35 * 1.6; // truck + return
    const wasteCO2 = room_count * 25 * 0.3; // estimated waste
    const packagingCO2 = room_count * 10 * 0.8;
    const totalCO2 = transportCO2 + wasteCO2 + packagingCO2;
    
    let score: string;
    if (totalCO2 < 100) score = 'A';
    else if (totalCO2 < 180) score = 'B';
    else if (totalCO2 < 280) score = 'C';
    else if (totalCO2 < 400) score = 'D';
    else score = 'E';
    
    return {
      score,
      totalCO2kg: Math.round(totalCO2),
      breakdown: {
        transport: Math.round(transportCO2),
        waste: Math.round(wasteCO2),
        packaging: Math.round(packagingCO2)
      },
      tips: [
        "Beiladung nutzen spart bis zu 40% CO2",
        "Recyceln Sie alle Materialien korrekt",
        "Wiederverwendbare Umzugskisten statt Karton"
      ]
    };
  },
  
  get_parking_permit_info: (args) => {
    const { city, move_date } = args;
    
    const cityRules: Record<string, any> = {
      'zürich': { leadTime: 14, cost: '50-100 CHF', authority: 'DAV Zürich' },
      'basel': { leadTime: 10, cost: '40-80 CHF', authority: 'Stadtreinigung' },
      'bern': { leadTime: 14, cost: '30-60 CHF', authority: 'Tiefbauamt' },
    };
    
    const rules = cityRules[city.toLowerCase()] || { leadTime: 14, cost: '30-100 CHF', authority: 'Gemeindeverwaltung' };
    
    let deadline = null;
    if (move_date) {
      const moveDay = new Date(move_date);
      moveDay.setDate(moveDay.getDate() - rules.leadTime);
      deadline = moveDay.toISOString().split('T')[0];
    }
    
    return {
      city: city,
      leadTimeDays: rules.leadTime,
      estimatedCost: rules.cost,
      authority: rules.authority,
      deadline,
      tip: deadline ? `Spätestens bis ${deadline} beantragen!` : `Mindestens ${rules.leadTime} Tage im Voraus beantragen.`
    };
  }
};

// System prompt for the AI assistant
const systemPrompt = `Sie sind ein hilfreicher KI-Assistent für Umzugscheck.ch, die führende Schweizer Umzugsvergleichsplattform.

IHRE FÄHIGKEITEN:
- Umzugskosten berechnen (calculate_moving_cost)
- eUmzugCH-Unterstützung prüfen (check_eumzug_support)
- Kantonsinformationen abrufen (get_canton_info)
- Entsorgungsinformationen geben (get_disposal_info)
- CO2-Fussabdruck berechnen (calculate_eco_score)
- Halteverbot-Infos liefern (get_parking_permit_info)

WICHTIGE RICHTLINIEN:
- Nutzen Sie die Tools aktiv, um präzise Antworten zu geben
- Antworten Sie immer auf Deutsch (Schweizer Hochdeutsch)
- Seien Sie freundlich, konkret und hilfsbereit
- Bei Preisfragen: Geben Sie Schätzungen und empfehlen Sie Offerten-Vergleich
- Erwähnen Sie relevante Tools wie unseren Entsorgungs-Planer oder Halteverbot-Planer

KONTEXT:
- Durchschnittliche Umzugskosten CH: CHF 1'000-2'000 für 3-Zimmer
- Über 200 geprüfte Umzugsfirmen in allen 26 Kantonen
- Kostenlose Tools: Umzugsrechner, Reinigungsrechner, Entsorgungsplaner
- Die Plattform ist kostenlos und unabhängig`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Build messages with history
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-10).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    // First API call with tools
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        tools: TOOLS,
        tool_choice: "auto",
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          response: "Der Dienst ist momentan überlastet. Bitte versuchen Sie es in einigen Sekunden erneut." 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const choice = data.choices[0];

    // Check if tool calls are requested
    if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
      const toolResults = [];
      
      for (const toolCall of choice.message.tool_calls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        
        if (toolImplementations[functionName]) {
          const result = toolImplementations[functionName](args);
          toolResults.push({
            tool_call_id: toolCall.id,
            role: "tool",
            content: JSON.stringify(result)
          });
        }
      }

      // Second API call with tool results
      const finalResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            ...messages,
            choice.message,
            ...toolResults
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!finalResponse.ok) {
        throw new Error(`AI API error: ${finalResponse.status}`);
      }

      const finalData = await finalResponse.json();
      return new Response(JSON.stringify({ 
        response: finalData.choices[0].message.content,
        toolsUsed: choice.message.tool_calls.map((tc: any) => tc.function.name)
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // No tool calls, return direct response
    return new Response(JSON.stringify({ 
      response: choice.message.content 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI Assistant V2 error:", error);
    return new Response(
      JSON.stringify({
        response: "Entschuldigung, ich konnte Ihre Anfrage nicht verarbeiten. Bitte versuchen Sie es erneut oder nutzen Sie unsere Rechner direkt.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
