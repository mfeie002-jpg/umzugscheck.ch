import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Security headers including CSP
const securityHeaders = {
  ...corsHeaders,
  "Content-Type": "application/json",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
  "Permissions-Policy": "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  "Cache-Control": "no-store, max-age=0",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

// Input validation constants
const MAX_FIELD_LENGTHS = {
  firstName: 100,
  lastName: 100,
  email: 255,
  phone: 30,
  moveFrom: 200,
  moveTo: 200,
  moveType: 50,
  message: 1000,
};

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  moveFrom?: string;
  moveTo?: string;
  moveType?: string;
  message?: string;
  honeypot?: string; // Honeypot field for bot detection
}

function getClientIP(req: Request): string {
  // Try to get real IP from common headers
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  return "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = ipRequestCounts.get(ip);

  if (!record || now > record.resetTime) {
    // First request or window expired
    ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

function sanitizeString(input: string | undefined, maxLength: number): string {
  if (!input) return "";
  // Trim, remove control characters, and limit length
  return input
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, "") // Remove control characters
    .substring(0, maxLength);
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= MAX_FIELD_LENGTHS.email;
}

function validatePhone(phone: string): boolean {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[\d\s+()-]{8,30}$/;
  return phoneRegex.test(phone);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: securityHeaders }
    );
  }

  // Validate Origin header
  const origin = req.headers.get("origin");
  const validOrigins = [
    "localhost",
    "lovable.app",
    "lovableproject.com",
    "feierabend-umzuege.ch",
  ];
  
  if (origin) {
    const originHost = new URL(origin).hostname;
    const isValidOrigin = validOrigins.some(
      (valid) => originHost === valid || originHost.endsWith(`.${valid}`)
    );
    
    if (!isValidOrigin) {
      console.warn(`Invalid origin: ${origin}`);
      return new Response(
        JSON.stringify({ error: "Ungültige Anfrage" }),
        { status: 403, headers: securityHeaders }
      );
    }
  }

  const clientIP = getClientIP(req);
  console.log(`Contact form request from IP: ${clientIP}`);

  // Check rate limit
  const rateLimitResult = checkRateLimit(clientIP);
  if (!rateLimitResult.allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ 
        error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut.",
        retryAfter: rateLimitResult.retryAfter 
      }),
      { 
        status: 429, 
        headers: { 
          ...securityHeaders, 
          "Retry-After": String(rateLimitResult.retryAfter)
        } 
      }
    );
  }

  try {
    let formData: ContactFormData;
    try {
      formData = await req.json();
    } catch {
      console.error("Invalid JSON in request body");
      return new Response(
        JSON.stringify({ error: "Ungültige Anfrage" }),
        { status: 400, headers: securityHeaders }
      );
    }

    // Check honeypot - if filled, likely a bot
    if (formData.honeypot && formData.honeypot.length > 0) {
      console.warn(`Bot detected via honeypot from IP: ${clientIP}`);
      // Return success to not alert the bot, but don't save
      return new Response(
        JSON.stringify({ success: true, message: "Anfrage erfolgreich gesendet" }),
        { status: 200, headers: securityHeaders }
      );
    }

    // Sanitize all inputs
    const sanitizedData = {
      firstName: sanitizeString(formData.firstName, MAX_FIELD_LENGTHS.firstName),
      lastName: sanitizeString(formData.lastName, MAX_FIELD_LENGTHS.lastName),
      email: sanitizeString(formData.email, MAX_FIELD_LENGTHS.email).toLowerCase(),
      phone: sanitizeString(formData.phone, MAX_FIELD_LENGTHS.phone),
      moveFrom: sanitizeString(formData.moveFrom, MAX_FIELD_LENGTHS.moveFrom),
      moveTo: sanitizeString(formData.moveTo, MAX_FIELD_LENGTHS.moveTo),
      moveType: sanitizeString(formData.moveType, MAX_FIELD_LENGTHS.moveType),
      message: sanitizeString(formData.message, MAX_FIELD_LENGTHS.message),
    };

    // Validate required fields
    if (!sanitizedData.firstName || sanitizedData.firstName.length < 2) {
      return new Response(
        JSON.stringify({ error: "Vorname ist erforderlich (mind. 2 Zeichen)" }),
        { status: 400, headers: securityHeaders }
      );
    }

    if (!sanitizedData.lastName || sanitizedData.lastName.length < 2) {
      return new Response(
        JSON.stringify({ error: "Nachname ist erforderlich (mind. 2 Zeichen)" }),
        { status: 400, headers: securityHeaders }
      );
    }

    if (!sanitizedData.email) {
      return new Response(
        JSON.stringify({ error: "E-Mail ist erforderlich" }),
        { status: 400, headers: securityHeaders }
      );
    }

    // Validate email format
    if (!validateEmail(sanitizedData.email)) {
      return new Response(
        JSON.stringify({ error: "Ungültige E-Mail-Adresse" }),
        { status: 400, headers: securityHeaders }
      );
    }

    // Validate phone if provided
    if (sanitizedData.phone && !validatePhone(sanitizedData.phone)) {
      return new Response(
        JSON.stringify({ error: "Ungültige Telefonnummer" }),
        { status: 400, headers: securityHeaders }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert into database
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert({
        first_name: sanitizedData.firstName,
        last_name: sanitizedData.lastName,
        email: sanitizedData.email,
        phone: sanitizedData.phone || null,
        move_from: sanitizedData.moveFrom || null,
        move_to: sanitizedData.moveTo || null,
        move_type: sanitizedData.moveType || null,
        message: sanitizedData.message || null,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Fehler beim Speichern der Anfrage" }),
        { status: 500, headers: securityHeaders }
      );
    }

    // Log submission (without PII)
    console.log("New contact form submission:", {
      id: data.id,
      moveType: sanitizedData.moveType,
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Anfrage erfolgreich gesendet",
        id: data.id 
      }),
      { status: 200, headers: securityHeaders }
    );

  } catch (error) {
    console.error("Error processing contact form:", error);
    return new Response(
      JSON.stringify({ error: "Ein Fehler ist aufgetreten" }),
      { status: 500, headers: securityHeaders }
    );
  }
});
