/**
 * SBB Journey API Edge Function
 * 
 * Proxy to OpenTransportData.swiss OJP API for journey planning
 * https://opentransportdata.swiss/en/cookbook/open-journey-planner-ojp/
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// OJP API Configuration
const OJP_API_URL = "https://api.opentransportdata.swiss/ojp2020";

// Swiss cities with their stop references (DiDok numbers)
const CITY_STOP_REFS: Record<string, string> = {
  "zuerich": "8503000", // Zürich HB
  "zurich": "8503000",
  "bern": "8507000", // Bern
  "basel": "8500010", // Basel SBB
  "genf": "8501008", // Genève
  "geneva": "8501008",
  "lausanne": "8501120",
  "luzern": "8505000", // Luzern
  "lucerne": "8505000",
  "winterthur": "8506000",
  "stgallen": "8506302", // St. Gallen
  "st-gallen": "8506302",
  "lugano": "8505300",
  "biel": "8504300", // Biel/Bienne
  "thun": "8507100",
  "chur": "8509000",
  "fribourg": "8504100",
  "schaffhausen": "8503424",
  "aarau": "8502113",
  "olten": "8500218",
  "baden": "8500330",
  "zug": "8502204",
  "solothurn": "8500207",
  "neuchatel": "8504221",
  "sion": "8501600",
  "bellinzona": "8505200",
};

interface JourneyRequest {
  originCity: string;
  destinationCity: string;
  departureTime?: string;
  arrivalTime?: string;
  date?: string;
}

interface JourneyResult {
  durationMinutes: number;
  transfers: number;
  departureTime: string;
  arrivalTime: string;
  connectionsPerHour: number;
  transportModes: string[];
  estimatedMonthlyPassCHF: number;
  journeyLegs: JourneyLeg[];
}

interface JourneyLeg {
  mode: string;
  lineName: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
}

function buildOJPRequest(originRef: string, destRef: string, date: string, time: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<OJP xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.siri.org.uk/siri" version="1.0" xmlns:ojp="http://www.vdv.de/ojp">
  <OJPRequest>
    <ServiceRequest>
      <RequestTimestamp>${new Date().toISOString()}</RequestTimestamp>
      <RequestorRef>umzugscheck_prod</RequestorRef>
      <ojp:OJPTripRequest>
        <RequestTimestamp>${new Date().toISOString()}</RequestTimestamp>
        <ojp:Origin>
          <ojp:PlaceRef>
            <ojp:StopPointRef>${originRef}</ojp:StopPointRef>
          </ojp:PlaceRef>
          <ojp:DepArrTime>${date}T${time}:00</ojp:DepArrTime>
        </ojp:Origin>
        <ojp:Destination>
          <ojp:PlaceRef>
            <ojp:StopPointRef>${destRef}</ojp:StopPointRef>
          </ojp:PlaceRef>
        </ojp:Destination>
        <ojp:Params>
          <ojp:NumberOfResults>5</ojp:NumberOfResults>
          <ojp:IncludeTrackSections>false</ojp:IncludeTrackSections>
          <ojp:IncludeTurnDescription>false</ojp:IncludeTurnDescription>
          <ojp:IncludeIntermediateStops>false</ojp:IncludeIntermediateStops>
        </ojp:Params>
      </ojp:OJPTripRequest>
    </ServiceRequest>
  </OJPRequest>
</OJP>`;
}

function parseOJPResponse(xmlText: string): JourneyResult[] {
  const results: JourneyResult[] = [];
  
  // Parse trips from XML response using regex (Deno-friendly)
  const tripMatches = xmlText.matchAll(/<ojp:Trip>([\s\S]*?)<\/ojp:Trip>/g);
  
  for (const tripMatch of tripMatches) {
    const tripXml = tripMatch[1];
    
    // Extract duration
    const durationMatch = tripXml.match(/<ojp:Duration>PT(\d+)H?(\d*)M?<\/ojp:Duration>/);
    let durationMinutes = 0;
    if (durationMatch) {
      const hours = parseInt(durationMatch[1]) || 0;
      const minutes = parseInt(durationMatch[2]) || 0;
      durationMinutes = hours * 60 + minutes;
    }
    
    // Extract transfers
    const transferMatches = tripXml.match(/<ojp:TransferLeg>/g);
    const transfers = transferMatches ? transferMatches.length : 0;
    
    // Extract departure and arrival times
    const depTimeMatch = tripXml.match(/<ojp:TimetabledTime>([^<]+)<\/ojp:TimetabledTime>/);
    const departureTime = depTimeMatch ? depTimeMatch[1] : '';
    
    // Find all timetabled times and get the last one as arrival
    const allTimes = [...tripXml.matchAll(/<ojp:TimetabledTime>([^<]+)<\/ojp:TimetabledTime>/g)];
    const arrivalTime = allTimes.length > 1 ? allTimes[allTimes.length - 1][1] : departureTime;
    
    // Extract transport modes
    const modeMatches = [...tripXml.matchAll(/<ojp:PtMode>([^<]+)<\/ojp:PtMode>/g)];
    const transportModes = [...new Set(modeMatches.map(m => m[1]))];
    
    // Parse journey legs
    const journeyLegs: JourneyLeg[] = [];
    const legMatches = tripXml.matchAll(/<ojp:TimedLeg>([\s\S]*?)<\/ojp:TimedLeg>/g);
    
    for (const legMatch of legMatches) {
      const legXml = legMatch[1];
      
      const modeMatch = legXml.match(/<ojp:PtMode>([^<]+)<\/ojp:PtMode>/);
      const lineMatch = legXml.match(/<ojp:PublishedLineName>.*?<ojp:Text>([^<]+)<\/ojp:Text>/);
      const fromMatch = legXml.match(/<ojp:LegBoard>[\s\S]*?<ojp:StopPointName>.*?<ojp:Text>([^<]+)<\/ojp:Text>/);
      const toMatch = legXml.match(/<ojp:LegAlight>[\s\S]*?<ojp:StopPointName>.*?<ojp:Text>([^<]+)<\/ojp:Text>/);
      
      const legTimes = [...legXml.matchAll(/<ojp:TimetabledTime>([^<]+)<\/ojp:TimetabledTime>/g)];
      
      if (legTimes.length >= 2) {
        const legDepTime = legTimes[0][1];
        const legArrTime = legTimes[legTimes.length - 1][1];
        const legDep = new Date(legDepTime);
        const legArr = new Date(legArrTime);
        const legDuration = Math.round((legArr.getTime() - legDep.getTime()) / 60000);
        
        journeyLegs.push({
          mode: modeMatch ? modeMatch[1] : 'unknown',
          lineName: lineMatch ? lineMatch[1] : '',
          from: fromMatch ? fromMatch[1] : '',
          to: toMatch ? toMatch[1] : '',
          departureTime: legDepTime,
          arrivalTime: legArrTime,
          durationMinutes: legDuration > 0 ? legDuration : 0,
        });
      }
    }
    
    results.push({
      durationMinutes,
      transfers,
      departureTime,
      arrivalTime,
      connectionsPerHour: 4, // Estimate, would need more API calls for accuracy
      transportModes,
      estimatedMonthlyPassCHF: estimateMonthlyPass(durationMinutes),
      journeyLegs,
    });
  }
  
  return results;
}

function estimateMonthlyPass(durationMinutes: number): number {
  // Swiss public transport pricing tiers based on distance/time
  // These are approximations based on typical GA/regional pass costs
  if (durationMinutes <= 15) return 90;
  if (durationMinutes <= 30) return 140;
  if (durationMinutes <= 45) return 200;
  if (durationMinutes <= 60) return 280;
  if (durationMinutes <= 90) return 380;
  return 440; // GA 2. Klasse monthly equivalent
}

function normalizeCity(city: string): string {
  return city.toLowerCase()
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ä/g, 'a')
    .replace(/\s+/g, '-')
    .replace(/\./g, '');
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API key from secrets
    const apiKey = Deno.env.get("SBB_OJP_API_KEY");
    
    if (!apiKey) {
      // Return mock data if no API key is configured
      console.log("SBB_OJP_API_KEY not configured, returning mock data");
      return new Response(
        JSON.stringify({
          success: true,
          mock: true,
          message: "Using mock data. Configure SBB_OJP_API_KEY for real journey data.",
          journeys: getMockJourneys(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: JourneyRequest = await req.json();
    const { originCity, destinationCity, date, departureTime } = body;

    if (!originCity || !destinationCity) {
      return new Response(
        JSON.stringify({ error: "originCity and destinationCity are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const originRef = CITY_STOP_REFS[normalizeCity(originCity)];
    const destRef = CITY_STOP_REFS[normalizeCity(destinationCity)];

    if (!originRef) {
      return new Response(
        JSON.stringify({ error: `Unknown origin city: ${originCity}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!destRef) {
      return new Response(
        JSON.stringify({ error: `Unknown destination city: ${destinationCity}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use current date/time if not provided
    const queryDate = date || new Date().toISOString().split('T')[0];
    const queryTime = departureTime || "08:00";

    const ojpRequest = buildOJPRequest(originRef, destRef, queryDate, queryTime);

    const response = await fetch(OJP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: ojpRequest,
    });

    if (!response.ok) {
      console.error("OJP API error:", response.status, await response.text());
      return new Response(
        JSON.stringify({ error: "Failed to fetch journey data from SBB" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const xmlResponse = await response.text();
    const journeys = parseOJPResponse(xmlResponse);

    if (journeys.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          journeys: [],
          message: "No journeys found for this route"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return the fastest journey and alternatives
    const fastestJourney = journeys.reduce((min, j) => 
      j.durationMinutes < min.durationMinutes ? j : min
    );

    return new Response(
      JSON.stringify({
        success: true,
        originCity,
        destinationCity,
        queryDate,
        queryTime,
        fastestJourney,
        alternatives: journeys.slice(0, 5),
        summary: {
          averageDurationMinutes: Math.round(
            journeys.reduce((sum, j) => sum + j.durationMinutes, 0) / journeys.length
          ),
          minDurationMinutes: fastestJourney.durationMinutes,
          estimatedMonthlyPassCHF: fastestJourney.estimatedMonthlyPassCHF,
          connectionsPerHour: fastestJourney.connectionsPerHour,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in sbb-journey function:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Mock data for development without API key
function getMockJourneys(): JourneyResult[] {
  return [
    {
      durationMinutes: 56,
      transfers: 0,
      departureTime: "2026-01-31T08:03:00",
      arrivalTime: "2026-01-31T08:59:00",
      connectionsPerHour: 4,
      transportModes: ["rail"],
      estimatedMonthlyPassCHF: 280,
      journeyLegs: [
        {
          mode: "rail",
          lineName: "IC 1",
          from: "Zürich HB",
          to: "Bern",
          departureTime: "2026-01-31T08:03:00",
          arrivalTime: "2026-01-31T08:59:00",
          durationMinutes: 56,
        },
      ],
    },
  ];
}
