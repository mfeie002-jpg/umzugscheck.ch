# Marketing Masterplan (Feierabend-Effekt)

This document captures the key feedback and priorities for paid acquisition,
conversion optimization, and message-match across the site.

## Goal
- Maximize qualified traffic from Google Ads and convert to phone calls or
  quote requests fast.
- Use the brand hook "Feierabend-Effekt": "You relax, we do the work."
- Speed-to-lead: calls answered quickly (goal: < 60s) with a 5-10 minute
  booking promise.

## Core Message (Ad + On-Site)
- "Feierabend ab dem ersten Anruf."
- "In 5-10 Minuten fix gebucht."
- "Live Concierge am Telefon/WhatsApp."
- "Swiss Quality, seit 1980."
- Main CTA should show a Swiss number (+41 or 0800) for trust.

## Campaign Structure (Keyword -> Ad -> Landingpage)
### Paid Tiers (budget + intent)
- Zurich: volume market (reliable, city know-how)
- Zug/Baar: premium market (discreet, full-service, packing)
- Luzern: expansion market
- LSA (Local Services Ads): run in parallel as a trust anchor, but only if
  calls are answered fast.

### Call-Only Layer (optional)
- Call-only ads for "concierge" intent can outperform for high-intent traffic
  if phone coverage is strong (08-19 live + night callback).

### Local (Geo)
- "Umzug Zuerich" -> /area/zurich
- "Umzug Basel" -> /area/basel
- "Umzug Zug" -> /area/zug
- "Umzug Baar" -> /area/baar
Why: message match improves CTR, Quality Score, and lowers CPC.

### Service / Intent
- "Seniorenumzug" -> /plan/senior (empathy + care)
- "Umzugsfirma Kosten" -> /option/pricing (or packages section)

### Brand / Retargeting
- Visitors who did not convert: "Immer noch am Vergleichen? 5 Minuten Call und
  Feierabend."

## CRO Priorities (On-Site)
1. "5-minute hook" everywhere (hero, sticky bar, footer):
   - "In 5-10 Minuten fix gebucht."
   - "Live Concierge am Telefon/WhatsApp."
2. Mobile sticky bottom bar (thumb zone):
   - Left: WhatsApp icon
   - Center: "Jetzt anrufen" (primary, large)
   - Right: "Offerte" (scroll to form)
3. Dynamic headline injection (DTR):
   - Query params like `?city=zug` or `?kw=senioren`
   - Update H1/subheadline and local proof copy
4. Trust badges above the fold on mobile:
   - Google 5.0 and "Seit 1980" visible without scrolling
5. Express quote form for paid traffic:
   - Step 1: phone + start PLZ + end PLZ (+ optional date)
   - Visible progress: "Schritt 1 von 2 - fast fertig"
6. Pricing psychology:
   - "Komfort" marked as Bestseller with subtle pulse
   - Preselect "Komfort" when pricing intent is detected
7. Performance:
   - Preload hero image for LCP
   - Keep above-the-fold light for fast ad clicks
8. Local proof blocks on city pages:
   - Zurich: "Halteverbotszone, enge Altstadt, lokale Erfahrung."
   - Zug/Baar: "Diskret, Full-Service, gehobene Liegenschaften."
9. Multi-channel "Offerte" matrix (inspired by 0123):
   - Phone (live 08-19), WhatsApp (24/7), Express form (30s), optional
     video estimate for premium.
10. Persona segmentation:
   - Single, family, office, senior -> route to matching flow and copy.

## Dynamic Text Replacement (Paid Mode Rules)
- Read URL params: utm_campaign, utm_term, city/loc, kw
- If city in [zug, baar] -> premium wording (diskret, full-service, packing)
- If kw=senioren -> empathetic subheadline
- Default -> high-speed booking messaging

## Tracking Events (CTA)
- cta_call_click
- cta_whatsapp_click
- cta_quote_click
- cta_form_start / cta_form_complete
- cta_callback_request

## Implementation Pointers (React/Vite/Tailwind)
- Hero: `src/components/HeroSection.tsx`
- City pages: `src/pages/area/*`
- Packages: `src/components/PackagesPreview.tsx`
- Quote form: `src/components/ContactForm.tsx`
- Mobile sticky bar: add a dedicated component (avoid framer-motion)
- Use `react-helmet-async` for dynamic title/description per campaign.
- Create a light "segmentation" entry point component for persona flows.

## Appendix A - Mega Prompt (for Dev/AI)
```
# TASK: Transform feierabend-umzuege.ch into a High-Performance Paid Machine
# Stack: React + Vite + Tailwind

# Goal
# - Maximize calls and fast quote requests from paid traffic.
# - USP: "Live Umzugs-Concierge - in 5-10 minutes booked via call."

# 1) Paid Mode + DTR
# - Read utm_campaign, utm_term, city/loc, kw.
# - If city in [zug, baar]: premium wording (diskret, full-service).
# - If kw=senioren: empathetic subheadline.
# - Default: high-speed booking messaging.
# - Update H1, subheadline, CTA labels, local proof, meta title/description.
# - Trust badges must be visible above the fold on mobile.

# 2) Mobile sticky CTA bar (<768px)
# - Left: WhatsApp icon
# - Center: primary "Jetzt anrufen"
# - Right: "Offerte" (scroll to form)
# - Track CTA events (call/whatsapp/quote)

# 3) Express Quote Form
# - Step 1: phone + start PLZ + end PLZ (+ optional date)
# - Progress text: "Schritt 1 von 2 - fast fertig"

# 4) Pricing Psychology
# - Komfort = Bestseller with subtle pulse
# - Preselect Komfort for pricing intent

# 5) Performance
# - Preload hero image for LCP
# - Keep above-the-fold light
```

## Appendix B - Context Injection Block (for new AI sessions)
```
PROJECT CONTEXT: Feierabend Umzuege - High-Performance Paid Machine
Business: Swiss family-run moving company (since 1980, 3 generations).
USP: Live Umzugs-Concierge, book in 5-10 minutes by phone.
Goal: scale Google Ads + LSA with high-intent traffic in CH.
Structure: city pages (/area/zurich, /area/basel, /area/zug) and service pages.
Key CRO: mobile sticky call bar, DTR by URL params, express form, bestseller
highlight, LCP hero preload.
Stack: React, Vite, Tailwind CSS.
```

## Appendix C - Sharing for AI review
- Private Google Drive links are not accessible to AI tools.
- Best: share a ZIP or paste relevant files/snippets in chat.
- If needed, share a repo tree or a screenshot of the folder structure.
- ChatGPT (Code Interpreter) can read ZIPs directly; Gemini cannot open Drive.

## Appendix D - 0123 Inspiration (Transfer to Feierabend)
- Brand handle: 0123 uses a phone number as a memory hook. Feierabend should
  use the emotional hook + Swiss phone number as the memory handle.
- "Estimate" is multi-channel: phone, online, messenger, video. Adapt to:
  Phone + WhatsApp + Express form + optional video for premium clients.
- Persona splitting: segment by life stage or use-case (single, family, office,
  senior) with matching landing flows.
- Offer engine with deadlines: use capacity/season windows rather than heavy
  discounts for Swiss trust.
- Proof + entertainment: use real crew, real trucks, real local scenes to
  build brand trust and lower ad costs.

## Appendix E - Deep Research Prompt (condensed)
Use this prompt to generate research + PR-ready tickets from repo + sitemap:
```
ROLE: Swiss performance marketer + CRO lead + React/Vite/Tailwind PM.
INPUTS: repo ZIP, sitemap.xml, screenshots, live links (site + 0123 refs).
TASKS:
1) Top conversion killers + quick wins.
2) CH benchmarks + LSA requirements (with citations).
3) Ads structure + message match matrix (city + service intents).
4) CRO specs: sticky CTA, DTR, trust badges, express form, pricing psychology,
   LCP improvements.
5) Tracking plan (GA4 + Ads + optional offline conversions).
OUTPUT: exec summary, benchmark table, LSA checklist, matrix, CRO plan (P0/P1),
engineering tickets with file map, CH copy blocks.
```
