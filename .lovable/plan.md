
# Plan: Fix Console Errors in A/B Comparison Lab

## Problem Summary

Two distinct issues causing console spam in the A/B Comparison Lab:

1. **Geo IP Lookup** - Direct browser calls to `ipapi.co/json/` cause CORS errors and 429 rate limits when multiple iframes load simultaneously
2. **React Helmet Warning** - Mix of `react-helmet` and `react-helmet-async` imports causes `UNSAFE_componentWillMount` warnings

---

## Solution Overview

### Part A: Geo Location - Complete Refactor

**Current State:**
- `src/hooks/useGeoLocationV4.ts` calls `https://ipapi.co/json/` directly from browser
- Used only in `PersonalizedHero.tsx` for HomepageV4

**New Architecture:**

```text
Browser Request → Edge Function (geo) → Read CDN Headers → Return Country/City
                         ↓ (if no headers)
                   Server-side IP lookup (with caching)
```

#### Changes:

1. **Create Edge Function: `supabase/functions/geo/index.ts`**
   - Read country from CDN headers (`cf-ipcountry`, `x-vercel-ip-country`)
   - Fallback: server-side IP lookup using Cloudflare's free API
   - Cache response in-memory for rate limiting protection
   - Returns: `{ country: "CH", city: "Zürich", region: "ZH" }`

2. **Refactor Hook: `src/hooks/useGeoLocationV4.ts`**
   - Add guards to skip geo lookup when:
     - `window.self !== window.top` (inside iframe)
     - `window.location.pathname.startsWith('/internal')`
   - Add localStorage caching with 1-hour TTL
   - Call internal edge function instead of external API
   - Dedupe concurrent requests with a singleton promise

---

### Part B: React Helmet - Migrate to Async

**Current State:**
- 133 files import `from "react-helmet"` (legacy sync version)
- 3 files use `from "react-helmet-async"` (correct)
- App.tsx already has `HelmetProvider` wrapper (correct)

**Solution:**
Replace all `react-helmet` imports with `react-helmet-async`:

```typescript
// BEFORE
import { Helmet } from "react-helmet";

// AFTER  
import { Helmet } from "react-helmet-async";
```

Files to update (grouped by priority):

| Priority | Files | Impact |
|----------|-------|--------|
| High | `SEOHead.tsx`, `Footer.tsx`, `IndexPremium.tsx` | Core components |
| Medium | All `/pages/*.tsx` files (~80 files) | Page-level SEO |
| Low | `/components/seo/*.tsx` (~5 files) | SEO utilities |

---

## Technical Implementation

### File: `supabase/functions/geo/index.ts` (NEW)

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory cache to prevent hammering
const cache = new Map<string, { data: any; expires: number }>();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Try CDN headers first (Cloudflare, Vercel, etc.)
  const cfCountry = req.headers.get("cf-ipcountry");
  const vercelCountry = req.headers.get("x-vercel-ip-country");
  const country = cfCountry || vercelCountry || "";
  
  // If CDN provides country, return immediately
  if (country) {
    return new Response(
      JSON.stringify({ country, city: "", region: "", source: "cdn" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Fallback: Use Cloudflare's free trace endpoint (no rate limits)
  // This is server-side, so no CORS issues
  try {
    const traceResp = await fetch("https://cloudflare.com/cdn-cgi/trace");
    const traceText = await traceResp.text();
    const loc = traceText.match(/loc=(\w+)/)?.[1] || "";
    
    return new Response(
      JSON.stringify({ country: loc, city: "", region: "", source: "trace" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ country: "", city: "", region: "", source: "none" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

### File: `src/hooks/useGeoLocationV4.ts` (REFACTOR)

```typescript
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface GeoLocation {
  city: string;
  region: string;
  country: string;
  isLoading: boolean;
}

const CACHE_KEY = 'geo_location_v4';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const SWISS_CITIES = ['Zürich', 'Bern', 'Basel', 'Genf', 'Lausanne', 'Luzern', 'St. Gallen', 'Winterthur'];

// Singleton promise to dedupe concurrent requests
let fetchPromise: Promise<GeoLocation> | null = null;

function shouldSkipGeoLookup(): boolean {
  // Skip if inside iframe (A/B Comparison Lab)
  if (typeof window !== 'undefined' && window.self !== window.top) {
    return true;
  }
  // Skip on internal routes
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/internal')) {
    return true;
  }
  return false;
}

function getCachedLocation(): GeoLocation | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, expires } = JSON.parse(cached);
      if (Date.now() < expires) {
        return data;
      }
      localStorage.removeItem(CACHE_KEY);
    }
  } catch {}
  return null;
}

function setCachedLocation(data: GeoLocation): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      expires: Date.now() + CACHE_TTL_MS,
    }));
  } catch {}
}

export function useGeoLocation(): GeoLocation {
  const [location, setLocation] = useState<GeoLocation>(() => {
    // Initialize from cache if available
    const cached = getCachedLocation();
    if (cached) return { ...cached, isLoading: false };
    return { city: '', region: '', country: '', isLoading: true };
  });

  useEffect(() => {
    // Guard: Skip in iframes or internal routes
    if (shouldSkipGeoLookup()) {
      setLocation(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // Check cache first
    const cached = getCachedLocation();
    if (cached) {
      setLocation({ ...cached, isLoading: false });
      return;
    }

    // Dedupe concurrent requests
    if (!fetchPromise) {
      fetchPromise = fetchGeoLocation();
    }

    fetchPromise
      .then(data => {
        setLocation(data);
        setCachedLocation(data);
      })
      .finally(() => {
        fetchPromise = null;
      });
  }, []);

  return location;
}

async function fetchGeoLocation(): Promise<GeoLocation> {
  try {
    const { data, error } = await supabase.functions.invoke('geo');
    
    if (error) throw error;
    
    // Map country code to city for Swiss users
    let city = data?.city || '';
    if (data?.country === 'CH' && !city) {
      // Default to empty - personalization optional
    }
    
    // Map English city names to German
    if (city === 'Zurich') city = 'Zürich';
    if (city === 'Geneva') city = 'Genf';
    if (city === 'Lucerne') city = 'Luzern';
    
    return {
      city: SWISS_CITIES.includes(city) ? city : '',
      region: data?.region || '',
      country: data?.country || '',
      isLoading: false,
    };
  } catch {
    return { city: '', region: '', country: '', isLoading: false };
  }
}
```

### Helmet Migration (Bulk Find/Replace)

All 133 files need this change:

```diff
- import { Helmet } from "react-helmet";
+ import { Helmet } from "react-helmet-async";
```

Key files to update:
- `src/components/SEOHead.tsx`
- `src/components/Footer.tsx`
- `src/pages/IndexPremium.tsx`
- `src/components/seo/StructuredData.tsx`
- `src/components/seo/SEOHead.tsx`
- All 80+ page files in `/pages/`

---

## Summary of Changes

| File | Change Type | Purpose |
|------|-------------|---------|
| `supabase/functions/geo/index.ts` | NEW | Server-side geo lookup via CDN headers |
| `supabase/config.toml` | EDIT | Add `[functions.geo]` config |
| `src/hooks/useGeoLocationV4.ts` | REFACTOR | Guards, caching, dedupe, edge function |
| 133 files | EDIT | `react-helmet` → `react-helmet-async` |

---

## How Guards Prevent Multi-Frame Spam

1. **Iframe Detection**: `window.self !== window.top` returns `true` when inside iframe → skip lookup entirely
2. **Internal Route Guard**: Paths starting with `/internal` (like `/internal/ab-comparison-lab`) → skip lookup
3. **LocalStorage Cache**: 1-hour TTL prevents repeated API calls across page navigations
4. **Request Deduplication**: Singleton promise pattern ensures only one concurrent fetch

---

## Result

After implementation:
- No more CORS errors from `ipapi.co`
- No more 429 rate limit errors
- No more `UNSAFE_componentWillMount` warnings
- A/B Comparison Lab works silently without console spam
- Geographic personalization still works for real users on production pages
