import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_LANGUAGES = ["de", "fr", "it", "en"];
const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 2000;

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Clean up old rate limit entries periodically
function cleanupRateLimits() {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}

function checkRateLimit(clientIp: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIp);

  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - entry.count, resetIn: entry.resetTime - now };
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function validateMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) {
    throw new Error("Messages must be an array");
  }

  if (messages.length === 0) {
    throw new Error("Messages array cannot be empty");
  }

  if (messages.length > MAX_MESSAGES) {
    throw new Error(`Too many messages. Maximum allowed: ${MAX_MESSAGES}`);
  }

  const validatedMessages: ChatMessage[] = [];

  for (const msg of messages) {
    if (!msg || typeof msg !== "object") {
      throw new Error("Each message must be an object");
    }

    if (!msg.role || !["user", "assistant"].includes(msg.role)) {
      throw new Error("Each message must have a valid role (user or assistant)");
    }

    if (typeof msg.content !== "string") {
      throw new Error("Message content must be a string");
    }

    const trimmedContent = msg.content.trim();
    if (trimmedContent.length === 0) {
      throw new Error("Message content cannot be empty");
    }

    if (trimmedContent.length > MAX_MESSAGE_LENGTH) {
      throw new Error(`Message content too long. Maximum allowed: ${MAX_MESSAGE_LENGTH} characters`);
    }

    validatedMessages.push({
      role: msg.role,
      content: trimmedContent,
    });
  }

  return validatedMessages;
}

serve(async (req) => {
  // Periodic cleanup
  cleanupRateLimits();

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client IP for rate limiting
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
    || req.headers.get("cf-connecting-ip") 
    || req.headers.get("x-real-ip")
    || "unknown";

  // Check rate limit
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    console.log(`Rate limit exceeded for IP: ${clientIp}`);
    return new Response(
      JSON.stringify({ 
        error: "Zu viele Anfragen. Bitte warten Sie einen Moment.",
        retryAfter: Math.ceil(rateLimit.resetIn / 1000)
      }),
      { 
        status: 429, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000))
        } 
      }
    );
  }

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      console.error("Invalid JSON in request body");
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!body || typeof body !== "object") {
      console.error("Request body must be an object");
      return new Response(
        JSON.stringify({ error: "Request body must be an object" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages: rawMessages, language: rawLanguage } = body as Record<string, unknown>;

    // Validate language
    const language = typeof rawLanguage === "string" && ALLOWED_LANGUAGES.includes(rawLanguage)
      ? rawLanguage
      : "de";

    // Validate messages
    let messages: ChatMessage[];
    try {
      messages = validateMessages(rawMessages);
    } catch (validationError) {
      console.error("Message validation error:", (validationError as Error).message);
      return new Response(
        JSON.stringify({ error: (validationError as Error).message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompts: Record<string, string> = {
      de: `Du bist ein freundlicher Umzugsberater von Feierabend-Umzüge, einem Schweizer Familienunternehmen für Premium-Umzüge. 
      
Deine Aufgaben:
- Beantworte Fragen rund um Umzüge, Kosten, Planung und Tipps
- Hilf bei der Schätzung von Umzugskosten basierend auf Zimmerzahl, Distanz und Services
- Gib praktische Tipps zum Packen, Vorbereiten und Organisieren
- Empfehle passende Services (Packservice, Möbelmontage, Lagerung)
- Sei freundlich, kompetent und hilfsbereit

Wichtige Infos:
- Basispreis: CHF 800
- Pro Zimmer: CHF 400
- Pro km: CHF 2
- Packservice: CHF 500
- Möbelmontage: CHF 300
- Lagerung: CHF 200/Monat
- Express (+30%), Premium VIP (+50%)

Antworte kurz und präzise auf Deutsch.`,
      fr: `Tu es un conseiller en déménagement amical de Feierabend-Umzüge, une entreprise familiale suisse spécialisée dans les déménagements premium.

Tes tâches:
- Répondre aux questions sur les déménagements, coûts, planification et conseils
- Aider à estimer les coûts de déménagement
- Donner des conseils pratiques pour l'emballage et l'organisation
- Recommander des services appropriés

Réponds brièvement en français.`,
      it: `Sei un consulente per traslochi amichevole di Feierabend-Umzüge, un'azienda familiare svizzera specializzata in traslochi premium.

I tuoi compiti:
- Rispondere a domande su traslochi, costi, pianificazione e consigli
- Aiutare a stimare i costi di trasloco
- Dare consigli pratici per l'imballaggio e l'organizzazione
- Raccomandare servizi appropriati

Rispondi brevemente in italiano.`,
      en: `You are a friendly moving consultant from Feierabend-Umzüge, a Swiss family business specializing in premium moves.

Your tasks:
- Answer questions about moving, costs, planning, and tips
- Help estimate moving costs based on rooms, distance, and services
- Give practical tips for packing, preparing, and organizing
- Recommend appropriate services

Important info:
- Base price: CHF 800
- Per room: CHF 400
- Per km: CHF 2
- Packing service: CHF 500
- Furniture assembly: CHF 300
- Storage: CHF 200/month
- Express (+30%), Premium VIP (+50%)

Answer briefly and concisely in English.`,
    };

    console.log(`Processing chat request with ${messages.length} messages in ${language}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompts[language] || systemPrompts.de },
          ...messages,
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Moving assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
