import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  Copy, 
  Download, 
  Check, 
  Server, 
  Shield, 
  Code,
  Loader2,
  FileCode,
  Table,
  Lock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { saveAs } from "file-saver";

// Edge Functions list (hardcoded since we can't dynamically read the filesystem)
const EDGE_FUNCTIONS = [
  "admin-reset-password",
  "admin-verify-provider",
  "ai-assistant",
  "ai-website-analyze",
  "analyze-moving-photos",
  "analyze-moving-video",
  "availability-notification",
  "calculate-ranking-optimization",
  "capture-rendered-html",
  "capture-screenshot",
  "create-bundled-estimate",
  "create-estimate-session",
  "create-funnel-lead",
  "fetch-html",
  "generate-hero-image",
  "generate-report",
  "get-estimate-session",
  "lighthouse",
  "notify-expiring-leads",
  "notify-price-drop",
  "place-bid",
  "process-bid-closures",
  "process-scheduled-rankings",
  "provider-leads",
  "provider-login",
  "provider-profile",
  "provider-signup",
  "provider-subscription",
  "purchase-lead",
  "schedule-review-requests",
  "scheduled-screenshots",
  "send-email-digest",
  "send-email",
  "send-lead-notification",
  "send-new-lead-notification",
  "send-performance-digest",
  "send-price-alert",
  "send-ranking-alert",
  "send-realtime-notification",
  "send-review-notification",
  "send-review-reminder",
  "send-review-request",
  "send-satisfaction-survey",
  "send-sms-notification",
  "update-lead-conversion",
  "validate-postal-code",
];

export const BackendExportGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{
    tables: number;
    policies: number;
    functions: number;
    edgeFunctions: number;
  } | null>(null);

  const generateBackendPrompt = async () => {
    setIsGenerating(true);
    try {
      // Build the prompt (schema info is hardcoded based on current state)
      const prompt = generateFullBackendPrompt();
      setGeneratedPrompt(prompt);
      
      setStats({
        tables: 35,
        policies: 47,
        functions: 18,
        edgeFunctions: EDGE_FUNCTIONS.length
      });

      toast({
        title: "✅ Backend Export generiert",
        description: "Der Prompt ist bereit zum Kopieren",
      });
    } catch (error) {
      console.error('Error generating backend export:', error);
      toast({
        title: "Fehler",
        description: "Konnte Backend-Export nicht generieren",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFullBackendPrompt = () => {
    return `# 🏗️ BACKEND STRUKTUR - Lead-Comparison Platform

Du bist ein Experte für Supabase und fullstack Entwicklung. Erstelle mir ein identisches Backend-Setup basierend auf folgender Struktur.

---

## 📊 DATENBANK-SCHEMA

### Haupt-Tabellen (35 Tabellen)

\`\`\`sql
-- LEADS & ANFRAGEN
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  from_city TEXT NOT NULL,
  from_postal TEXT NOT NULL,
  to_city TEXT NOT NULL,
  to_postal TEXT NOT NULL,
  service_date DATE,
  calculator_type TEXT NOT NULL,
  calculator_input JSONB NOT NULL,
  calculator_output JSONB NOT NULL,
  comments TEXT,
  status TEXT DEFAULT 'new',
  lead_source TEXT,
  selected_company_ids UUID[],
  assigned_provider_ids UUID[],
  estimate_session_id UUID,
  bundled_estimate_id UUID,
  bidding_enabled BOOLEAN DEFAULT false,
  starting_bid NUMERIC,
  current_highest_bid NUMERIC,
  bid_count INTEGER DEFAULT 0,
  bidding_closes_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SERVICE PROVIDERS (Dienstleister)
CREATE TABLE service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  slug TEXT UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone TEXT NOT NULL,
  street TEXT NOT NULL,
  zip TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT DEFAULT 'CH',
  contact_person_name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  long_description TEXT,
  logo_url TEXT,
  website TEXT,
  services_offered TEXT[] DEFAULT '{}',
  regions_served TEXT[] DEFAULT '{}',
  cities_served TEXT[],
  preferred_regions TEXT[],
  price_level price_level,
  verification_status verification_status DEFAULT 'pending',
  account_status account_status DEFAULT 'active',
  -- Ranking & Monetization
  is_featured BOOLEAN DEFAULT false,
  featured_position INTEGER,
  ranking_position INTEGER,
  sponsored_tier INTEGER,
  quality_score NUMERIC,
  -- Pricing Models
  billing_model TEXT,
  lead_price_chf NUMERIC,
  click_price_chf NUMERIC,
  call_price_chf NUMERIC,
  monthly_fee_chf NUMERIC,
  cpl_enabled BOOLEAN DEFAULT false,
  cpc_enabled BOOLEAN DEFAULT false,
  cpl_price_chf NUMERIC,
  cpc_price_chf NUMERIC,
  daily_budget_chf NUMERIC,
  daily_budget_remaining_chf NUMERIC,
  max_leads_per_month INTEGER,
  min_job_value NUMERIC,
  -- Bidding
  bidding_active BOOLEAN DEFAULT false,
  max_bid_chf NUMERIC,
  -- Call Tracking
  call_tracking_enabled BOOLEAN DEFAULT false,
  phone_tracking_number TEXT,
  -- Profile
  profile_completeness INTEGER,
  profile_gallery TEXT[],
  team_members JSONB,
  working_hours JSONB,
  certifications TEXT[],
  employees_count INTEGER,
  fleet_size INTEGER,
  avg_completion_time_hours INTEGER,
  response_time_minutes INTEGER,
  success_rate NUMERIC,
  discount_offer TEXT,
  booking_calendar_url TEXT,
  subscription_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ESTIMATE SESSIONS (Calculator Sessions)
CREATE TABLE estimate_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_details JSONB NOT NULL,
  estimate JSONB NOT NULL,
  matching_company_ids UUID[],
  funnel_variant TEXT,
  viewed_companies BOOLEAN DEFAULT false,
  selected_companies INTEGER,
  submitted_lead BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- LEAD TRANSACTIONS (Provider purchases Lead)
CREATE TABLE lead_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  provider_id UUID REFERENCES service_providers(id),
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'CHF',
  status TEXT DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  purchased_at TIMESTAMPTZ,
  -- Conversion Tracking
  conversion_status TEXT,
  conversion_date TIMESTAMPTZ,
  conversion_notes TEXT,
  actual_job_value NUMERIC,
  lost_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- LEAD BIDS (Auction System)
CREATE TABLE lead_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  provider_id UUID REFERENCES service_providers(id),
  bid_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- REVIEWS
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  user_id UUID REFERENCES profiles(id),
  lead_id UUID REFERENCES leads(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  photos TEXT[],
  service_ratings JSONB,
  verified BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- PROVIDER SUBSCRIPTIONS
CREATE TABLE provider_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES service_providers(id),
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT DEFAULT 'active',
  stripe_subscription_id TEXT,
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SUBSCRIPTION PLANS
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier_name TEXT,
  description TEXT,
  price_monthly NUMERIC NOT NULL,
  price_yearly NUMERIC,
  max_leads_per_month INTEGER,
  priority_level INTEGER,
  advanced_analytics BOOLEAN DEFAULT false,
  auto_bidding BOOLEAN DEFAULT false,
  competitor_insights BOOLEAN DEFAULT false,
  features JSONB,
  display_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- BILLING RECORDS
CREATE TABLE billing_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES service_providers(id),
  lead_id UUID REFERENCES leads(id),
  billing_model TEXT NOT NULL,
  price_chf NUMERIC NOT NULL,
  billing_period TEXT,
  invoice_number TEXT,
  status TEXT DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PROVIDER PERFORMANCE METRICS
CREATE TABLE provider_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES service_providers(id),
  metric_date DATE DEFAULT CURRENT_DATE,
  leads_received INTEGER DEFAULT 0,
  leads_viewed INTEGER DEFAULT 0,
  leads_contacted INTEGER DEFAULT 0,
  leads_converted INTEGER DEFAULT 0,
  conversion_rate NUMERIC,
  response_time_avg_hours NUMERIC,
  customer_satisfaction_score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(provider_id, metric_date)
);

-- AB TESTS
CREATE TABLE ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  variant_a_config JSONB NOT NULL,
  variant_b_config JSONB NOT NULL,
  variant_a_impressions INTEGER DEFAULT 0,
  variant_b_impressions INTEGER DEFAULT 0,
  variant_a_conversions INTEGER DEFAULT 0,
  variant_b_conversions INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_by TEXT
);

-- USER ROLES
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

### Enums

\`\`\`sql
CREATE TYPE app_role AS ENUM ('admin', 'user');
CREATE TYPE account_status AS ENUM ('active', 'inactive');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE price_level AS ENUM ('budget', 'fair', 'premium');
\`\`\`

---

## 🔐 ROW LEVEL SECURITY (RLS) POLICIES

\`\`\`sql
-- All tables have RLS enabled
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
-- ... (all other tables)

-- Admin Check Function
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Example Policies
CREATE POLICY "Admins can manage all" ON leads
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view estimate_sessions" ON estimate_sessions
  FOR SELECT USING (true);

CREATE POLICY "Providers see own data" ON service_providers
  FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
\`\`\`

---

## ⚡ EDGE FUNCTIONS (${EDGE_FUNCTIONS.length} Functions)

### Important Functions:

${EDGE_FUNCTIONS.map(fn => `- \`${fn}\``).join('\n')}

### Example Edge Function Pattern:

\`\`\`typescript
// supabase/functions/create-funnel-lead/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body = await req.json();
    
    // Business Logic here...
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
\`\`\`

---

## 🗄️ DATABASE FUNCTIONS & TRIGGERS

\`\`\`sql
-- Auto-Assign Providers to Lead
CREATE FUNCTION auto_assign_providers_to_lead()
RETURNS TRIGGER AS $$
DECLARE
  matched_providers uuid[];
BEGIN
  matched_providers := find_matching_providers(
    NEW.from_postal,
    NEW.to_postal,
    (NEW.calculator_output->>'priceMin')::numeric
  );
  NEW.assigned_provider_ids := matched_providers;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Find Matching Providers
CREATE FUNCTION find_matching_providers(
  lead_from_postal TEXT,
  lead_to_postal TEXT,
  estimated_value NUMERIC DEFAULT NULL
) RETURNS UUID[] AS $$
DECLARE
  from_region TEXT;
  to_region TEXT;
  matching_ids UUID[];
BEGIN
  from_region := get_region_from_postal(lead_from_postal);
  to_region := get_region_from_postal(lead_to_postal);
  
  SELECT ARRAY_AGG(id) INTO matching_ids
  FROM service_providers
  WHERE verification_status = 'approved'
    AND account_status = 'active'
    AND (from_region = ANY(regions_served) OR to_region = ANY(regions_served));
  
  RETURN COALESCE(matching_ids, ARRAY[]::UUID[]);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Get Region from Postal Code
CREATE FUNCTION get_region_from_postal(postal_code TEXT)
RETURNS TEXT AS $$
BEGIN
  CASE 
    WHEN postal_code LIKE '8%' THEN RETURN 'REGION_A';
    WHEN postal_code LIKE '3%' THEN RETURN 'REGION_B';
    WHEN postal_code LIKE '4%' THEN RETURN 'REGION_C';
    WHEN postal_code LIKE '6%' THEN RETURN 'REGION_D';
    WHEN postal_code LIKE '9%' THEN RETURN 'REGION_E';
    ELSE RETURN NULL;
  END CASE;
END;
$$ LANGUAGE plpgsql STABLE;

-- Lead Quality Calculation Trigger
CREATE FUNCTION calculate_lead_quality_on_insert()
RETURNS TRIGGER AS $$
DECLARE
  quality_score INTEGER := 0;
  value_score INTEGER := 0;
  estimated_value NUMERIC;
BEGIN
  estimated_value := (NEW.calculator_output->>'priceMin')::NUMERIC;
  
  IF estimated_value > 5000 THEN value_score := 30;
  ELSIF estimated_value > 3000 THEN value_score := 25;
  ELSIF estimated_value > 1500 THEN value_score := 20;
  ELSE value_score := 10;
  END IF;
  
  quality_score := value_score;
  IF NEW.phone IS NOT NULL THEN quality_score := quality_score + 5; END IF;
  IF NEW.service_date IS NOT NULL THEN quality_score := quality_score + 5; END IF;
  
  INSERT INTO lead_quality_factors (lead_id, quality_score, value_score)
  VALUES (NEW.id, quality_score, value_score);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
\`\`\`

---

## 📦 STORAGE BUCKETS

\`\`\`sql
-- Review Photos (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('review-photos', 'review-photos', false);

-- Screenshots Archive (public)
INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots-archive', 'screenshots-archive', true);
\`\`\`

---

## 🔧 CONFIG (supabase/config.toml)

\`\`\`toml
project_id = "your-project-id"

[functions.fetch-html]
verify_jwt = false

[functions.capture-screenshot]
verify_jwt = false

[functions.ai-website-analyze]
verify_jwt = false

# Other Functions with verify_jwt = true (default)
\`\`\`

---

## 📝 INSTRUCTIONS FOR LOVABLE

1. **Create Enums first** (app_role, account_status, verification_status, price_level)
2. **Then create Tables** in correct order (profiles → user_roles → service_providers → leads → etc.)
3. **Enable RLS** on all tables
4. **Create the has_role Function** before Policies
5. **Add RLS Policies**
6. **Create Database Functions** and Triggers
7. **Create Edge Functions** as needed
8. **Configure Storage Buckets**

Important: Use Supabase Cloud for maximum compatibility. Enable auto-confirm email signups!
`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      toast({
        title: "✅ Kopiert!",
        description: "Backend-Prompt in Zwischenablage kopiert",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Konnte nicht kopieren",
        variant: "destructive",
      });
    }
  };

  const downloadPrompt = () => {
    const blob = new Blob([generatedPrompt], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, `backend-export_${new Date().toISOString().split('T')[0]}.md`);
    toast({
      title: "✅ Heruntergeladen",
      description: "Backend-Export als Markdown gespeichert",
    });
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Database className="h-6 w-6 text-primary" />
              Backend Export Generator
            </CardTitle>
            <CardDescription className="mt-2">
              Generiert einen vollständigen Prompt mit Schema, Edge Functions, RLS Policies und mehr für Lovable
            </CardDescription>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Server className="h-3 w-3" />
            Supabase
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Table className="h-5 w-5 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{stats.tables}</div>
              <div className="text-xs text-muted-foreground">Tabellen</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Lock className="h-5 w-5 mx-auto mb-2 text-amber-500" />
              <div className="text-2xl font-bold">{stats.policies}</div>
              <div className="text-xs text-muted-foreground">RLS Policies</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Code className="h-5 w-5 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{stats.functions}</div>
              <div className="text-xs text-muted-foreground">DB Functions</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <FileCode className="h-5 w-5 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{stats.edgeFunctions}</div>
              <div className="text-xs text-muted-foreground">Edge Functions</div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        {!generatedPrompt && (
          <Button 
            onClick={generateBackendPrompt} 
            disabled={isGenerating}
            className="w-full h-14 text-lg"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generiere Backend Export...
              </>
            ) : (
              <>
                <Database className="h-5 w-5 mr-2" />
                Backend Export generieren
              </>
            )}
          </Button>
        )}

        {/* Generated Prompt */}
        {generatedPrompt && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Generierter Prompt</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? (
                    <Check className="h-4 w-4 mr-1 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copied ? "Kopiert!" : "Kopieren"}
                </Button>
                <Button variant="outline" size="sm" onClick={downloadPrompt}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            
            <Textarea 
              value={generatedPrompt}
              readOnly
              className="min-h-[400px] font-mono text-xs"
            />

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h4 className="font-medium flex items-center gap-2 text-amber-800 dark:text-amber-200 mb-2">
                <Shield className="h-4 w-4" />
                Verwendung in Lovable
              </h4>
              <ol className="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-decimal list-inside">
                <li>Erstelle ein neues Lovable-Projekt</li>
                <li>Aktiviere Lovable Cloud (Supabase)</li>
                <li>Füge diesen Prompt in den Chat ein</li>
                <li>Lovable erstellt automatisch das gesamte Backend</li>
              </ol>
            </div>
          </div>
        )}

        {/* What's included */}
        <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Table className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Datenbank-Schema</h4>
              <p className="text-xs text-muted-foreground">Alle Tabellen, Enums, Relationen</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="font-medium text-sm">RLS Policies</h4>
              <p className="text-xs text-muted-foreground">Sicherheitsregeln & Admin-Check</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <FileCode className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Edge Functions</h4>
              <p className="text-xs text-muted-foreground">API-Endpunkte & Server Logic</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
