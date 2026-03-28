# Standalone Component Prompts

Ready-to-use prompts for setting up the standalone tools in any Lovable or Softgen project.

**ScreenshotMachine API Key: `892618`** - This key is included in all prompts and ready to use.

---

## 1. AI Feedback Package - Setup Prompt

Copy and paste this into a new Lovable chat:

```
Create an AI Feedback Package Generator with ScreenshotMachine API integration.

## Overview
A tool that analyzes any website and generates a complete package for AI review (ChatGPT, Claude, Gemini).

## ScreenshotMachine API
Use this API for all screenshots:
- API Key: 892618
- Endpoint: https://api.screenshotmachine.com
- Parameters:
  - key: 892618
  - url: [target URL]
  - dimension: 1920xfull (desktop) or 375xfull (mobile)
  - format: png
  - cacheLimit: 0
  - delay: 8000 (for JS rendering)
  - js: true
  - scroll: true

Example:
```typescript
const params = new URLSearchParams({
  key: "892618",
  url: targetUrl,
  dimension: "1920xfull",
  format: "png",
  cacheLimit: "0",
  delay: "8000",
  js: "true",
  scroll: "true",
});
const imageUrl = `https://api.screenshotmachine.com?${params}`;
```

## Features Required
1. **Input Form**:
   - Project name (required)
   - Project URL (required)
   - Description (optional)
   - Goals (comma-separated)
   - Target audience
   - Competitor URLs (add/remove dynamically)
   - Key questions for AI

2. **Analysis Process**:
   - Auto-discover pages by crawling homepage links
   - Capture desktop screenshots (1920xfull)
   - Capture mobile screenshots (375xfull)
   - Fetch HTML source for each page
   - Capture competitor homepage screenshots

3. **Output ZIP Contents**:
   - `/screenshots/desktop/` - Full page desktop captures
   - `/screenshots/mobile/` - Full page mobile captures
   - `/competitors/` - Competitor screenshots
   - `/html/` - HTML source files
   - `PROJECT_BRIEF.md` - Project context
   - `REVIEW_REQUEST.md` - Ready-to-use AI prompt
   - `SITEMAP.json` - URL structure

4. **Technical Stack**:
   - React + TypeScript
   - shadcn/ui components (Card, Button, Input, Textarea, Label, Progress, Badge, Tabs)
   - JSZip for ZIP generation
   - file-saver for downloads
   - lucide-react for icons

5. **Edge Function Needed** (fetch-html):
   Create a Supabase edge function that fetches HTML from any URL and returns it.
   Path: supabase/functions/fetch-html/index.ts
   Make it public (verify_jwt = false)

6. **UI Requirements**:
   - Clean card-based layout
   - Progress bar during generation
   - Success state with download confirmation
   - "Copy Prompt" button for quick access to review request
   - Feature badges showing capabilities

Generate the complete component and edge function. Make it self-contained so it can work in any project.
```

---

## 2. Screenshot Machine - Setup Prompt

Copy and paste this into a new Lovable chat:

```
Create a Screenshot Machine tool with full ScreenshotMachine API integration.

## ScreenshotMachine API Configuration
- **API Key**: 892618
- **Endpoint**: https://api.screenshotmachine.com
- **Full-page Desktop**: dimension=1920xfull
- **Full-page Mobile**: dimension=375xfull
- **HD Desktop**: dimension=1920x1080
- **HD Mobile**: dimension=375x812

API Call Example:
```typescript
const SCREENSHOT_API_KEY = "892618";

const captureScreenshot = async (url: string, dimension: string) => {
  const params = new URLSearchParams({
    key: SCREENSHOT_API_KEY,
    url: url,
    dimension: dimension,
    format: "png",
    cacheLimit: "0",
    delay: "8000",
    js: "true",
    scroll: "true",
  });
  
  const imageUrl = `https://api.screenshotmachine.com?${params}`;
  const response = await fetch(imageUrl);
  return await response.blob();
};
```

## Features Required

### Single Capture Mode
1. URL input
2. Device selection (Desktop/Mobile)
3. Dimension presets:
   - Desktop: 1920x1080, 1920xfull, 1440x900, 3840x2160, 2560x1440
   - Mobile: 375x812, 375xfull, 414x896, 360x800, 768x1024
4. Delay selection (1-8 seconds)
5. Full page toggle
6. Capture button

### Bulk Capture Mode
1. Textarea for multiple URLs (one per line)
2. Desktop capture toggle (1920xfull)
3. Mobile capture toggle (375xfull)
4. Progress bar showing current URL
5. Capture all button

### Results Section
- Grid display of captured screenshots
- Thumbnail preview (aspect-video)
- Domain name and dimension badge
- Download individual button
- Copy URL button
- Open in new tab button
- "Download ZIP" for all captures
- "Clear All" button

## Technical Stack
- React + TypeScript
- shadcn/ui components (Card, Button, Input, Textarea, Label, Progress, Badge, Tabs, Select, Switch)
- JSZip for ZIP generation
- file-saver for downloads
- lucide-react for icons

## UI Requirements
- Tabbed interface (Single/Bulk)
- Clean card layout
- Loading states with spinner
- Progress indicator for bulk
- Responsive grid for results
- Feature badges at bottom

Generate the complete component. Make it self-contained with the API key already configured.
```

---

## 3. Project Analyzer Complete - Setup Prompt

Copy and paste this into a new Lovable chat:

```
Create a Project Analyzer Complete tool with full ScreenshotMachine API integration.

## ScreenshotMachine API
All screenshots use this API:
- **API Key**: 892618
- **Endpoint**: https://api.screenshotmachine.com

```typescript
const SCREENSHOT_API_KEY = "892618";

const captureScreenshot = async (url: string, dimension: string): Promise<Blob | null> => {
  try {
    const params = new URLSearchParams({
      key: SCREENSHOT_API_KEY,
      url: url,
      dimension: dimension,
      format: "png",
      cacheLimit: "0",
      delay: "8000",
      js: "true",
      scroll: "true",
    });
    
    const response = await fetch(`https://api.screenshotmachine.com?${params}`);
    if (!response.ok) throw new Error("Screenshot failed");
    return await response.blob();
  } catch (error) {
    console.error("Screenshot error:", error);
    return null;
  }
};
```

## Overview
A comprehensive website analyzer that generates implementation-ready packages for recreating websites in Lovable.

## Features Required

### Input
1. Project name (required)
2. Project URL (required)

### Analysis Process
1. Fetch homepage HTML
2. Auto-discover pages from links (up to 20 pages)
3. For each page:
   - Fetch HTML source
   - Capture screenshot (1920xfull)
   - Run Lighthouse audit (first 5 pages only)
4. Calculate summary metrics

### Output ZIP Contents
- `/screenshots/` - Page screenshots
- `/html/` - HTML source files
- `/lighthouse/` - Performance reports
- `implementation-prompt.md` - Complete implementation guide
- `analysis-summary.json` - Full analysis data
- `README.md` - Package overview

### Implementation Prompt Generation
Generate a detailed prompt including:
- Project overview and stats
- Page-by-page breakdown
- Performance scores
- Key features to implement
- SEO requirements
- Quick start prompt for immediate use

## Technical Stack
- React + TypeScript
- shadcn/ui components
- JSZip for ZIP generation
- file-saver for downloads
- lucide-react for icons
- Supabase edge functions for:
  - fetch-html (HTML fetching)
  - lighthouse (PageSpeed API wrapper)

## Edge Functions Needed

### fetch-html
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
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      },
    });
    const html = await response.text();

    return new Response(
      JSON.stringify({ html, url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### lighthouse
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
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

## config.toml
```toml
[functions.fetch-html]
verify_jwt = false

[functions.lighthouse]
verify_jwt = false
```

## UI Requirements
- Simple two-input form
- Large "Analyze & Generate ZIP" button
- Progress bar with current step
- Summary cards showing stats (pages, screenshots, performance)
- Download ZIP button
- Copy Prompt button
- Collapsible list of analyzed pages
- Prompt preview textarea

Generate all components and edge functions. Make it production-ready.
```

---

## 4. Ultimate Feedback Suite - Complete Clone Prompt

Copy and paste this into a new Lovable chat to recreate the entire admin feedback system:

```
Create an Ultimate Feedback Suite with complete ScreenshotMachine API integration.

## ScreenshotMachine API Configuration
```typescript
const SCREENSHOT_API_KEY = "892618";

const captureScreenshot = async (url: string, dimension: string): Promise<Blob | null> => {
  try {
    const params = new URLSearchParams({
      key: SCREENSHOT_API_KEY,
      url: url,
      dimension: dimension,
      format: "png",
      cacheLimit: "0",
      delay: "8000",
      js: "true",
      scroll: "true",
    });
    
    const response = await fetch(`https://api.screenshotmachine.com?${params}`);
    if (!response.ok) throw new Error("Screenshot failed");
    return await response.blob();
  } catch (error) {
    console.error("Screenshot error:", error);
    return null;
  }
};
```

## Overview
All-in-one tool for:
1. One-click website analysis with auto-detection
2. AI-ready prompts for ChatGPT/Claude/Gemini
3. ZIP package with screenshots, HTML, Lighthouse reports
4. Lovable Clone Package generator

## Features

### Tab 1: Ultimate Package
- Auto-detect project name and URL from current page
- Capture options (toggles): Desktop, Mobile, HTML, Competitors, Lighthouse
- Big red "Generate Ultimate Package" button
- Progress bar with step indicator
- Generated prompt preview with copy button
- Cloud upload with public URL

### Tab 2: Lovable Clone
- Generate complete implementation package
- Includes edge function code
- Includes config.toml template
- Includes storage SQL setup
- Quick start guide

### Tab 3: Quick Screenshot
- URL input
- Buttons: Desktop Full, Mobile Full, Desktop HD, Mobile HD
- Grid of captured screenshots
- Download all as ZIP

## Edge Functions Required

### fetch-html (supabase/functions/fetch-html/index.ts)
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

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        'Accept': 'text/html',
      },
    });

    const html = await response.text();
    return new Response(
      JSON.stringify({ html, url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### lighthouse (supabase/functions/lighthouse/index.ts)
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
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

## config.toml additions
```toml
[functions.fetch-html]
verify_jwt = false

[functions.lighthouse]
verify_jwt = false
```

## Storage Bucket
```sql
INSERT INTO storage.buckets (id, name, public) 
VALUES ('screenshots-archive', 'screenshots-archive', true)
ON CONFLICT (id) DO NOTHING;
```

## Dependencies
```bash
npm install jszip file-saver lucide-react
```

## UI Design
- Card with gradient header (primary color)
- Tabs with icons
- Switch toggles for options
- Progress bar during generation
- Green success box with results
- Badge list with features

Generate the complete component. The ScreenshotMachine API key (892618) should be hardcoded and ready to use.
```

---

## Quick Reference

| Tool | API Key | Features |
|------|---------|----------|
| AI Feedback Package | 892618 | PDF export, auto-discovery |
| Screenshot Machine | 892618 | Single/bulk, ZIP export |
| Project Analyzer | 892618 | Implementation prompts |
| Ultimate Feedback Suite | 892618 | All features combined |

---

## ScreenshotMachine API Quick Reference

**Endpoint**: `https://api.screenshotmachine.com`

**Required Parameters**:
| Parameter | Value | Description |
|-----------|-------|-------------|
| key | 892618 | API key |
| url | (target) | URL to capture |
| dimension | 1920xfull | Size (widthxheight or widthxfull) |

**Optional Parameters**:
| Parameter | Value | Description |
|-----------|-------|-------------|
| format | png | Output format |
| cacheLimit | 0 | Disable cache |
| delay | 8000 | Wait for JS (ms) |
| js | true | Enable JavaScript |
| scroll | true | Scroll for full page |

**Common Dimensions**:
- Desktop Full: `1920xfull`
- Desktop HD: `1920x1080`
- Mobile Full: `375xfull`
- Mobile HD: `375x812`
- Tablet: `768x1024`

---

## Dependencies

All tools require:
```bash
npm install jszip file-saver lucide-react
```

If using with Supabase:
```bash
npm install @supabase/supabase-js
```
