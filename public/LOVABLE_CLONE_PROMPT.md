# Ultimate Admin Portal - Complete Lovable Implementation Prompt

> **COPY THIS ENTIRE FILE INTO A NEW LOVABLE PROJECT**
> Lovable will automatically create all components, database tables, edge functions, and styling.

---

## 📋 PROJECT OVERVIEW

Create a premium Swiss moving comparison platform admin portal with the following features:

1. **Ultimate Feedback Suite** - One-click website analysis tool for AI feedback
2. **Screenshot Capture** - Full-page screenshots of 37+ pages (desktop + mobile)
3. **HTML Extraction** - Source code capture for SEO analysis
4. **Analytics Dashboard** - Comprehensive metrics with demo data fallback
5. **Lighthouse Audits** - Performance, SEO, accessibility scores
6. **Competitor Analysis** - Side-by-side comparison screenshots
7. **AI-Ready Export** - ZIP packages optimized for ChatGPT/Claude analysis

---

## 🔧 REQUIRED SETUP

### 1. Enable Lovable Cloud
Go to Settings → Cloud → Enable Cloud

### 2. Add Secret
Add this secret in Settings → Secrets:
- **SCREENSHOTMACHINE_API_KEY**: `892618`

---

## 📊 DATABASE SCHEMA

Create these tables with the migration tool:

```sql
-- Platform Analytics
CREATE TABLE IF NOT EXISTS platform_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_leads INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_revenue NUMERIC(10,2) DEFAULT 0,
  avg_lead_value NUMERIC(10,2) DEFAULT 0,
  active_providers INTEGER DEFAULT 0,
  new_providers INTEGER DEFAULT 0,
  avg_response_time_hours NUMERIC(5,2) DEFAULT 0,
  customer_satisfaction_avg NUMERIC(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Conversion Analytics
CREATE TABLE IF NOT EXISTS conversion_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversion_type VARCHAR(50) NOT NULL,
  service VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  source_page VARCHAR(255),
  company_id UUID,
  lead_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- A/B Tests
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  variant_a_config JSONB NOT NULL,
  variant_b_config JSONB NOT NULL,
  variant_a_impressions INTEGER DEFAULT 0,
  variant_a_conversions INTEGER DEFAULT 0,
  variant_b_impressions INTEGER DEFAULT 0,
  variant_b_conversions INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_by UUID
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  calculator_type VARCHAR(50) NOT NULL,
  calculator_input JSONB NOT NULL,
  calculator_output JSONB NOT NULL,
  from_city VARCHAR(100) NOT NULL,
  from_postal VARCHAR(10) NOT NULL,
  to_city VARCHAR(100) NOT NULL,
  to_postal VARCHAR(10) NOT NULL,
  move_date DATE,
  status VARCHAR(20) DEFAULT 'new',
  comments TEXT,
  lead_source VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Service Providers
CREATE TABLE IF NOT EXISTS service_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  contact_person_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  street VARCHAR(255) NOT NULL,
  zip VARCHAR(10) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(50) DEFAULT 'Schweiz',
  services_offered TEXT[] DEFAULT '{}',
  cantons_served TEXT[] DEFAULT '{}',
  price_level VARCHAR(20),
  verification_status VARCHAR(20) DEFAULT 'pending',
  account_status VARCHAR(20) DEFAULT 'active',
  quality_score INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  logo_url TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES service_providers(id),
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Roles
CREATE TYPE app_role AS ENUM ('admin', 'user');

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email VARCHAR(255),
  full_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin access
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Admin can read all
CREATE POLICY "Admins can read platform_analytics" ON platform_analytics
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read conversion_analytics" ON conversion_analytics
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage ab_tests" ON ab_tests
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage leads" ON leads
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can read providers" ON service_providers
FOR SELECT USING (verification_status = 'approved' AND account_status = 'active');

CREATE POLICY "Admins can manage providers" ON service_providers
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for screenshots
INSERT INTO storage.buckets (id, name, public) 
VALUES ('screenshots-archive', 'screenshots-archive', true)
ON CONFLICT (id) DO NOTHING;
```

---

## 🌐 EDGE FUNCTIONS

### 1. fetch-html (supabase/functions/fetch-html/index.ts)

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching HTML from:', url);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'de-CH,de;q=0.9,en;q=0.8',
      },
    });

    const html = await response.text();
    console.log('HTML fetched, length:', html.length);

    return new Response(
      JSON.stringify({ html, url, status: response.status }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Fetch error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### 2. lighthouse (supabase/functions/lighthouse/index.ts)

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, strategy = 'desktop' } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Lighthouse error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### Config (add to supabase/config.toml)

```toml
[functions.fetch-html]
verify_jwt = false

[functions.lighthouse]
verify_jwt = false
```

---

## 🎨 COMPONENT STRUCTURE

Create these main components:

### 1. Admin Dashboard (/admin)
- Protected route requiring admin role
- Tabs: Overview, Leads, Providers, Analytics, Ultimate Package

### 2. UltimateFeedbackSuite Component
Main features:
- **Config Panel**: Project name, URL, description, goals, target audience
- **Page List**: 37 predefined pages for umzugscheck.ch
- **Capture Options**: Desktop, Mobile, Competitors, Lighthouse, HTML, Heatmaps
- **Progress Tracking**: Real-time progress bar during generation
- **ZIP Generation**: Using JSZip library
- **Cloud Upload**: Optional Supabase storage upload

### 3. Screenshot Capture
Using ScreenshotMachine API:
```typescript
const getScreenshotUrl = (url: string, dimension: string) => {
  const apiKey = '892618';
  const params = new URLSearchParams({
    key: apiKey,
    url: url,
    dimension: dimension,
    format: 'png',
    delay: '8000',
    cacheLimit: '0',
    device: dimension.includes('375') ? 'phone' : 'desktop',
    full_page: 'true'
  });
  return `https://api.screenshotmachine.com?${params.toString()}`;
};
```

### 4. Demo Data Fallback
When database is empty, generate realistic Swiss market demo data:
- Platform metrics with seasonal variations
- Provider performance across cantons
- Conversion funnels for different services
- User segments by calculator type and city

---

## 📦 DEPENDENCIES

```bash
npm install jszip file-saver jspdf lucide-react @supabase/supabase-js
npm install @types/file-saver
```

---

## 🎯 KEY FEATURES TO IMPLEMENT

1. **One-Click Ultimate Package**
   - Generate ZIP with all screenshots, HTML, and analytics
   - Demo data fallback when database is empty
   - Progress tracking during generation

2. **37 Page Coverage**
   - Homepage, calculators, rankings, regions, services
   - Both desktop (1920xfull) and mobile (375xfull)

3. **Analytics Integration**
   - Platform metrics (leads, revenue, conversions)
   - Provider performance
   - A/B test results
   - User segments

4. **AI-Ready Output**
   - Structured JSON files
   - README with analysis instructions
   - Project brief for context

5. **Clone Package Generator**
   - Export this entire implementation as a prompt
   - Include all edge functions and SQL
   - One-click replication to new Lovable project

---

## 🚀 QUICK START FOR NEW PROJECT

1. Create new Lovable project
2. Enable Lovable Cloud
3. Paste this entire prompt
4. Add SCREENSHOTMACHINE_API_KEY secret
5. Navigate to /admin and login
6. Click "Ultimate Package" tab
7. Generate your first package!

---

## 📝 NOTES

- All analytics use demo data fallback when database is empty
- Screenshots use ScreenshotMachine API (free tier: 100/month)
- HTML extraction works via edge function to bypass CORS
- Lighthouse uses free Google PageSpeed Insights API
- ZIP files are generated client-side with JSZip

---

**Generated**: ${new Date().toISOString()}
**Version**: 5.0 Vorzeigemodell
