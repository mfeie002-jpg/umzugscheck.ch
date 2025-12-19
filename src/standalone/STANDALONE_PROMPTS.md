# Standalone Component Prompts

Ready-to-use prompts for setting up the standalone tools in any Lovable or Softgen project.

---

## 1. AI Feedback Package - Setup Prompt

Copy and paste this into a new Lovable/Softgen chat:

```
Create an AI Feedback Package Generator with the following specifications:

## Overview
A tool that analyzes any website and generates a complete package for AI review (ChatGPT, Claude, Gemini).

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
   - Capture desktop screenshots (1920px full page)
   - Capture mobile screenshots (375px full page)
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
   - ScreenshotMachine API for screenshots (API key: 892618)

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

Generate the complete component and edge function. Make it self-contained so it can work in any project with minimal setup.
```

---

## 2. Screenshot Machine - Setup Prompt

Copy and paste this into a new Lovable/Softgen chat:

```
Create a Screenshot Machine tool with the following specifications:

## Overview
A versatile screenshot capture tool with single and bulk modes.

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
- ScreenshotMachine API (API key: 892618)

## API Integration
Use ScreenshotMachine API:
```
https://api.screenshotmachine.com?key=API_KEY&url=URL&dimension=1920xfull&format=png&delay=3000
```

## UI Requirements
- Tabbed interface (Single/Bulk)
- Clean card layout
- Loading states with spinner
- Progress indicator for bulk
- Responsive grid for results
- Feature badges at bottom

Generate the complete component. Make it self-contained so it can work in any project with just the API key.
```

---

## 3. Project Analyzer Complete - Setup Prompt

Copy and paste this into a new Lovable/Softgen chat:

```
Create a Project Analyzer Complete tool with the following specifications:

## Overview
A comprehensive website analyzer that generates implementation-ready packages for recreating websites in Lovable/Softgen.

## Features Required

### Input
1. Project name (required)
2. Project URL (required)

### Analysis Process
1. Fetch homepage HTML
2. Auto-discover pages from links (up to 20 pages)
3. For each page:
   - Fetch HTML source
   - Capture screenshot (1920x1080)
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
  - capture-screenshot (screenshot API wrapper)
  - lighthouse (PageSpeed API wrapper)

## Edge Functions Needed

### fetch-html
Fetches HTML from any URL. Make public.

### capture-screenshot
Wraps ScreenshotMachine API. Needs SCREENSHOTMACHINE_API_KEY secret.

### lighthouse
Wraps Google PageSpeed API. No key needed for basic usage.

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

## Quick Reference

| Tool | File | API Key Needed | Edge Functions |
|------|------|----------------|----------------|
| AI Feedback Package | `AIFeedbackPackageStandalone.tsx` | ScreenshotMachine (892618) | fetch-html |
| Screenshot Machine | `ScreenshotMachineStandalone.tsx` | ScreenshotMachine (892618) | None |
| Project Analyzer | `ProjectAnalyzerComplete.tsx` | ScreenshotMachine (892618) | fetch-html, capture-screenshot, lighthouse |

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
