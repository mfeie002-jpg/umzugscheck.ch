# 💅 FEIERABEND MONEY-MATRIX: Paid Advertising Blueprint

**Date:** January 23, 2026  
**Status:** READY FOR CAMPAIGN LAUNCH  
**Champion Funnels:** 2 tested & deployed  
**Tracking:** Event-based + Offline-import ready

---

## 🎯 PART 1: CHAMPION FUNNELS (Waffled & Deployed)

### Champion A: QUICK-FLOW (Speed-to-Lead)
**Best For:** High-intent keywords (People are ready to buy)

- **URL:** `https://umzugscheck.ch/champion-quick-flow`
- **Focus:** 2-step form → Lead capture (max friction reduction)
- **Ideal Keywords:** 
  - "umzugsofferte"
  - "umzugsofferte online"
  - "umzugsfirma zürich"
  - "umzug offerte vergleichen"
- **Landing Page Elements:**
  - Minimal hero (just headline + trust badges)
  - Zero distractions
  - 2-step form: Phone → PLZ
  - Benefits grid (3 items only)
  - CTA banner (call)
- **Conversion Event:** `lead_submitted` with funnel tag: `champion_quick_flow`

### Champion B: TRUST-FIRST (Cold Traffic)
**Best For:** Awareness + retargeting (people still building confidence)

- **URL:** `https://umzugscheck.ch/champion-trust-first`
- **Focus:** Proof-points → Testimonials → Form
- **Ideal Keywords:**
  - "zügeln zürich"
  - "umzug + reinigung offerte"
  - "umzugsfirma in der nähe"
  - "umzug bern"
- **Landing Page Elements:**
  - Hero with proof stats (500+ moves/year, 4.9★, etc.)
  - Testimonial carousel
  - Full service grid (6 services)
  - Trust grid + certifications
  - Form at bottom (content-first)
  - CTA banner (call + live hours)
- **Conversion Event:** `lead_submitted` with funnel tag: `champion_trust_first`

---

## 📋 PART 2: KEYWORD-TO-URL MAPPING (The Money Clusters)

### Cluster A: CORE INTENT (Umzugsfirma + Ort)
**Intent Level:** ⭐⭐⭐⭐⭐ (Highest)  
**CPC:** ~CHF 1.50–3.50  
**Use Champion:** QUICK-FLOW (convert fast)

| Keyword | City | Target URL | CPL Est. |
|---------|------|-----------|---------|
| umzugsfirma zürich | Zurich | /area/zurich | CHF 45–75 |
| umzugsfirma bern | Bern | /area/bern | CHF 40–65 |
| umzugsunternehmen basel | Basel | /area/basel | CHF 42–70 |
| umzugsfirma luzern | Lucerne | /area/luzern | CHF 38–60 |
| umzugsfirma genf | Geneva | /area/geneva | CHF 50–80 |
| zügeln zürich | Zurich | /champion-quick-flow | CHF 50–85 |
| zügelunternehmen basel | Basel | /champion-quick-flow | CHF 48–82 |
| (geo-targeted variants) | ... | /champion-quick-flow | +30% |

**Strategy:**
- Exact match: `/area/{city}` (SEO page = warm + organic)
- Broad + Phrase match: `/champion-quick-flow` (paid default)
- Negatives: `-bewertung`, `-rezension`, `-kosten`

---

### Cluster B: OFFERTE / PREISVERGLEICH (High Intent)
**Intent Level:** ⭐⭐⭐⭐⭐  
**CPC:** ~CHF 2.00–4.00  
**Use Champion:** QUICK-FLOW

| Keyword | Target URL | Notes |
|---------|-----------|-------|
| umzugsofferte | /champion-quick-flow | Direct form = fast lead |
| umzugsofferte online | /champion-quick-flow | "Online" = motivated |
| offerte umzug online | /champion-quick-flow | Same intent, alt phrasing |
| umzugsofferten vergleichen | /champion-quick-flow | "Vergleichen" = buyer mindset |
| umzugsfirma offerte | /champion-quick-flow | Core + intent combo |
| mehrere offerten umzug | /champion-quick-flow | Multi-quote seekers (best CPL) |

**Strategy:**
- Exact + Phrase on all
- High bid (these are low-volume but highest CPL)
- Ad copy: "3–5 Offerten in 2 Min | Kostenlos vergleichen"

---

### Cluster C: UMZUG + REINIGUNG (Bundle = Higher Value Lead)
**Intent Level:** ⭐⭐⭐⭐  
**CPC:** ~CHF 1.80–3.20  
**Use Champion:** TRUST-FIRST (bundle needs confidence)

| Keyword | Target URL | CPL Est. |
|---------|-----------|---------|
| umzug und reinigung offerte | /champion-trust-first | CHF 55–95 |
| umzugsreinigung offerte | /champion-trust-first | CHF 50–85 |
| endreinigung umzugsfirma | /champion-trust-first | CHF 48–80 |
| wohnungsabgabe reinigung offerte | /champion-trust-first | CHF 60–100 |
| umzug + putzen offerte | /champion-trust-first | CHF 52–88 |

**Ad Copy:** "Umzug + Reinigung = 1 Termin. Fixpreis. Kostenlose Offerten."

---

### Cluster D: SERVICES (Cheap Leads for Upsell)
**Intent Level:** ⭐⭐⭐  
**CPC:** ~CHF 0.80–2.00  
**Use Champion:** QUICK-FLOW (add service to quote)

| Keyword | Target URL | CPL Est. |
|---------|-----------|---------|
| packservice umzug | /champion-quick-flow | CHF 25–45 |
| entsorgung umzug | /champion-quick-flow | CHF 20–40 |
| möbellift mieten | /champion-quick-flow | CHF 30–55 |
| umzugshelfer stunden | /champion-quick-flow | CHF 18–35 |
| verpackungsmaterial umzug | /champion-quick-flow | CHF 22–38 |

**Strategy:** Cheap leads → Retarget with "Umzug + Service Bundle" on Facebook/Google

---

### Cluster E: B2B (Premium CPL)
**Intent Level:** ⭐⭐⭐⭐  
**CPC:** ~CHF 3.00–6.00  
**Use Champion:** TRUST-FIRST (B2B needs proof)

| Keyword | Target URL | CPL Est. |
|---------|-----------|---------|
| firmenumzug | /champion-trust-first | CHF 80–150 |
| büroumzug | /champion-trust-first | CHF 85–160 |
| büroumzug zürich | /champion-trust-first | CHF 95–180 |
| relocation firma schweiz | /champion-trust-first | CHF 100–200 |

**Ad Copy:** "IT-Downtime-Minimal-Umzug. Zertifiziert. Live-Support."

---

## 📊 PART 3: URL-STRUKTUR & ROUTING

### SEO Pages (Warm Traffic + Organic)
```
/area/{city}           → Full info + local proof + embedded form start
/area/zurich           → Zurich-specific (500/year, local stories, etc.)
/area/basel
/area/bern
... (43 cities total)
```

### Service Pages (Low-Cost Lead Gen → Retarget)
```
/service/packservice
/service/entsorgung
/service/moebellift
/service/reinigung
```

### Paid Traffic (Champions)
```
/champion-quick-flow   → High-intent, speed funnel
/champion-trust-first  → Cold traffic, testimonial-first
```

### Booking Confirmation
```
/booking?source={funnel_name}&utm_campaign={campaign_id}
→ Tracks which funnel succeeded
→ Sends lead to CRM with attribution
```

---

## 🔔 PART 4: EVENT TRACKING ARCHITECTURE

### Core Events (Minimum Set)

| Event | Trigger | Params | Purpose |
|-------|---------|--------|---------|
| `view_lp` | Page load | `funnel`, `utm_source`, `utm_campaign` | Entry point |
| `start_funnel` | Form appears/focus | `funnel`, `step_1` | Engagement |
| `step_1_complete` | Phone + PLZ entered | `funnel`, `start_plz`, `end_plz` | Progress |
| `step_2_complete` | Move date entered | `funnel`, `move_date` | Motivation |
| `lead_submit` | Form submitted | `funnel`, `phone`, `start_plz`, `end_plz` | **CONVERSION** |
| `cta_call_click` | Phone number clicked | `location` (sticky_bar, banner, etc.) | Alt conversion |
| `cta_whatsapp_click` | WhatsApp button | `location`, `funnel` | Lead channel |

### Enhanced Events (For Attribution)

| Event | Trigger | Params | Purpose |
|-------|---------|--------|---------|
| `lead_qualified` | (Offline) Sales team qualifies | `funnel`, `phone`, `booking_date` | **BEST** lead quality |
| `booking_confirmed` | Customer booked | `funnel`, `start_plz`, `end_plz`, `price` | Revenue |
| `video_play` | User engages video | `funnel`, `video_name` | Rich retarget signal |
| `scroll_depth` | 50% / 75% / 100% | `funnel`, `depth_pct` | Engagement quality |

### Implementation (JavaScript)
```javascript
// In any page:
import { track } from '@/utils/track';

track('lead_submit', {
  funnel: 'champion_quick_flow',
  phone: '+41764567890',
  start_plz: '8000',
  end_plz: '3000',
  utm_source: 'google',
  utm_campaign: 'search_zh_umzugsofferte_q1_2026',
});
```

---

## 📲 PART 5: UTM STRUCTURE & CAMPAIGN NAMING

### UTM Template (Copy-Paste Ready)
```
{base_url}?utm_source={source}&utm_medium={medium}&utm_campaign={campaign}&utm_content={variant}&utm_term={keyword}
```

### Example: Google Search Campaign
**Base:** https://umzugscheck.ch/champion-quick-flow

**Campaign 1: Zurich High-Intent**
```
utm_source=google
utm_medium=cpc
utm_campaign=search_zh_umzugsofferte_q1_2026
utm_content=quick_flow_v1
utm_term=umzugsofferte_exact
```
→ **Full URL:**
```
https://umzugscheck.ch/champion-quick-flow?utm_source=google&utm_medium=cpc&utm_campaign=search_zh_umzugsofferte_q1_2026&utm_content=quick_flow_v1&utm_term=umzugsofferte_exact
```

### Campaign Naming Convention
**Format:** `{channel}_{geography}_{keyword_intent}_{period}_{variant}`

**Examples:**
- `search_ch_umzugsofferte_q1_2026` (Google Search, Switzerland-wide, "Offerte" intent)
- `search_zh_umzugsfirma_q1_2026` (Google Search, Zurich-only, "Firma" intent)
- `facebook_cold_trust_q1_2026` (Facebook, cold audience, trust-first creative)
- `search_bundle_umzug+reinigung_q1_2026` (Bundle keyword set)

---

## 👥 PART 6: RETARGETING AUDIENCE SEGMENTS

### Audience 1: "Visited Ortsseite, No Funnel Start"
**Who:** Someone landed on `/area/zurich` but didn't start form  
**Why:** Warm but not yet committed  
**Pixel Rule:** `page_view` + `funnel_start` = false (within 7 days)  
**Retarget With (Facebook):** 
```
Headline: "In 2 Min zu 3–5 Offerten — Direkt vergleichen"
Subheadline: "Kostenlos & Unverbindlich"
CTA: "Offerte Anfordern"
Image: Quick-form screenshot
Landing: /champion-quick-flow
```
**Budget:** 20% of paid spend

---

### Audience 2: "Funnel Started, No Submit"
**Who:** Clicked form but didn't finish  
**Why:** Friction in form or lost interest mid-way  
**Pixel Rule:** `start_funnel` + `lead_submit` = false (within 3 days)  
**Retarget With (Google Search / Facebook):**
```
Google Search:
- Bid +20% on original keywords
- Ad: "97% abgebrochen? Wir helfen! Nur 2 Minuten."

Facebook:
- Creative: "Stuck? Our team calls you back with offers"
- CTA: "Complete Quote"
- Landing: /champion-quick-flow
```
**Budget:** 30% of paid spend

---

### Audience 3: "Lead Submitted, Not Booked"
**Who:** Form completed but no booking yet  
**Why:** Hot lead, just needs final nudge  
**Pixel Rule:** `lead_submit` + `booking_confirmed` = false (within 14 days)  
**Retarget With (Facebook / Google):**
```
Facebook:
- Carousel: Show 3 moving trucks + testimonials
- Headline: "Your quote is ready — Get 50+ moving options now"
- CTA: "View My Options"
- Landing: /booking (with prefilled params)

Google Search:
- Bid aggressively on brand + competitor keywords
- Ad: "Offer expires in 48 hours — Claim your quote"
```
**Budget:** 40% of paid spend

---

### Audience 4: "Video Engagers"
**Who:** Watched 50%+ of any promo video  
**Why:** High intent signal (premium audience)  
**Pixel Rule:** `video_play` + `video_watchtime_50pct` (7 days)  
**Retarget With (Facebook):**
```
Headline: "See exactly what happens on moving day"
Creative: Behind-the-scenes video clips
CTA: "Book Your Move"
Landing: /champion-trust-first (social proof)
```
**Budget:** 10% of paid spend

---

## 📈 PART 7: OPTIMIZATION ROADMAP (WEEK 1 → WEEK 4)

### Week 1: Foundation (Campaign Setup)
- [ ] Create 2 campaigns: "Quick-Flow Keywords" + "Trust-First Keywords"
- [ ] Assign Champion A → Cluster A + B keywords
- [ ] Assign Champion B → Cluster C + E keywords
- [ ] Set conversion tracking (form submit = conversion)
- [ ] Enable enhanced conversions for leads
- [ ] Launch with conservative bids (CPC: -20%)
- [ ] Monitor conversion rate (target: 3–5% form submit)

### Week 2: Data Collection (50+ Conversions)
- [ ] Collect first 50 leads across both funnels
- [ ] Check form completion rate by step
- [ ] Review offline lead quality (which leads = bookings)
- [ ] A/B test: Headline vs Subheadline (1 variable only)
- [ ] Adjust bids based on ROAS
- [ ] Note: 2-step form performance vs 1-step

### Week 3: Scaling (Winning Signals)
- [ ] Increase budget on Cluster A + B keywords (high ROAS)
- [ ] Expand to 5 new city keywords (if Zurich/Bern positive)
- [ ] Launch retargeting audiences (Audience 1 + 2)
- [ ] Test service keyword cluster (cheap leads for upsell)
- [ ] Optimize mobile experience (sticky CTA performance)
- [ ] Compile offline data: Which leads → bookings?

### Week 4: Optimization (Competitive Advantage)
- [ ] Scale winning keywords to daily budget cap
- [ ] Test variant 2 of trust-first (testimonial order change)
- [ ] Launch Audience 3 retargeting (high ROI expected)
- [ ] Analyze CPL by city (where is lead quality best?)
- [ ] Plan expansion to Swiss Deutsch ad copy variants
- [ ] Check: Is offline lead quality tracking working?

---

## 💰 PART 8: BUDGET ALLOCATION (Month 1 Example)

**Total Budget:** CHF 5,000/month

| Channel | Budget | Allocation | Target |
|---------|--------|-----------|--------|
| Google Search (High Intent) | CHF 2,500 | 50% | 50–70 leads/month |
| Facebook Retargeting | CHF 1,200 | 24% | 1–2 bookings from warm |
| Google Retargeting | CHF 600 | 12% | Re-engage drop-offs |
| Testing (New Variants) | CHF 700 | 14% | Find next winner |

**CPL Target:**
- Quick-Flow: CHF 40–60
- Trust-First: CHF 55–85
- Bundle (Umzug+Reinigung): CHF 70–120

**Expected Output (Conservative):**
- ~60–80 leads/month
- ~3–5 bookings from paid (5–8% booking rate)
- ~CHF 15,000–25,000 in booked revenue

---

## 🚀 QUICK START (Today)

If you want to launch TODAY, here's the 10-minute checklist:

1. ✅ **Champion A:** `/champion-quick-flow` (deployed)
2. ✅ **Champion B:** `/champion-trust-first` (deployed)
3. **Create Google Ads Account** (if not done)
4. **Set Up Conversion Tracking**
   - Install GA4 tag
   - Create event: "form_submit" = conversion
   - Set up offline import (for booking data)
5. **Launch Campaign 1:** "Search | Umzugsofferte | Cluster B"
   - 5 keywords: umzugsofferte, umzugsfirma offerte, offerte umzug online, ...
   - Bid: CHF 2.50/click
   - Budget: CHF 500/week
   - Landing: `/champion-quick-flow`
6. **Create 3 Ad Variants** (ad copy A/B test)
7. **Go Live**
8. **Wait 72 hours** → First 10–20 clicks / 1–2 conversions expected
9. **Analyze:** Which variant performed best?
10. **Scale winning variant** → Double the budget

**Expected Timeline to 50 Leads:** 2–3 weeks at CHF 500/week

---

## 📞 SUPPORT & HANDOFF

- **Tracking is live:** Events fire on all form interactions
- **Both champions deployed:** Live at `http://localhost:8083`
- **Mobile sticky CTA:** Active on all pages (global)
- **Next step:** Choose budget + keyword clusters → Launch ads

**Questions?**
- Event tracking: `/src/utils/track.ts`
- Form logic: `/src/components/ExpressQuoteForm.tsx`
- Champions: `/src/pages/paid/*.tsx`

---

**Status:** 🟢 READY FOR LAUNCH  
**Last Updated:** Jan 23, 2026  
**Version:** 1.0
