# ChatGPT Deep Research Prompt - ULTRA Version

## Your Role
You are ChatGPT Deep Research acting as:
1. Swiss Performance Marketing Director (Google Ads + LSA + Meta)
2. CRO Lead (mobile-first conversion)
3. Technical Product Manager + Solution Architect (React/Vite/Tailwind)
4. Analytics/Tracking Architect (GA4 + Google Ads + Offline conversions)
5. QA Lead (release safety, cross-device testing)
6. Competitive Intelligence Analyst (ad + landing pattern reconnaissance)

## Project Context

**Brand:** "Feierabend Umzüge" (Family business since 1980, Swiss quality)

**Core USP/Hook:** "Live Umzugs-Concierge" — book in 5–10 minutes via phone/WhatsApp

**Primary Conversions:** PHONE calls + WhatsApp clicks + Express quote form

**Markets:** Zürich (volume), Zug/Baar (premium margin), Luzern (expansion)

**Strategy:** Strict message match: keyword → ad → dedicated landing page from sitemap

## Inputs I Will Provide

A) **Repo ZIP** (React + Vite + Tailwind) — analyze structure/routes/components

B) **sitemap.xml** — map all `/area/{city}` and `/plan/{service}` pages

C) **Live website link(s)** — compare UX + performance + message match

D) **Screenshots** — interpret mobile above-the-fold and CTA visibility

## Important Robustness Rule

If any provided files/links/screenshots are not accessible, explicitly list what is missing and continue with best-practice assumptions (do NOT stop to ask questions). Provide both:
- (a) assumptions-based plan
- (b) exact follow-ups needed only at the end

## Goals

1. Maximize CTR and Quality Score via message match and intent-specific landing pages
2. Maximize conversion rate to calls/WhatsApp/express quote (mobile-first)
3. Make the ad platforms learn profit, not just leads (value-based + offline conversion optional)
4. Produce output that an engineer + GitHub Copilot Agent can implement without ambiguity

---

## TASKS (ULTRA-ULTRA)

### PART 1 — Repo + UX Audit

1. Identify the top **15 conversion killers** (mobile/desktop). Be specific: where, why, impact.

2. Identify the top **20 quick wins** ranked by Impact vs Effort (P0/P1/P2)

3. Decide: which pages are "Paid Landers" vs which remain SEO/informational. Justify with funnel logic.

4. Produce a **"Message Match Gap Report"**: for each major keyword intent, what the current page misses.

### PART 2 — Switzerland-Specific Paid Benchmarks + Citations

5. Research Swiss benchmark ranges with **citations** for:
   - CPC ranges for: "umzugsfirma zürich", "zügeln zürich", "umzug zug", "umzug baar", "umzugsreinigung", "seniorenumzug", "umzug kosten"
   - Typical click→lead CVR and lead→job close rate in CH home services
   - Typical CPL/CPA ranges and what profitability looks like for one-time services

6. Research **Google Local Services Ads (LSA)** for Movers in Switzerland:
   - Verification steps (insurance, background checks, business docs)
   - Ranking factors (reviews, response time, dispute rate)
   - Operational implications of 24/7 vs 08:00–19:00

**Cite sources for all claims.**

### PART 3 — Full Funnel Strategy & Account Architecture

7. Build the optimal **Google Ads structure** using our sitemap:
   - City campaigns: Zürich, Zug/Baar premium, Luzern expansion (+ optional Basel if relevant)
   - Service campaigns: Senior, Office, Cleaning, Disposal, Packing (if exists)
   - Pricing intent campaigns: "umzug kosten / preise / offerte"

8. Build **Meta retargeting plan** (audiences + creatives + frequency + exclusions):
   - Visitors who didn't convert
   - Quote starters who didn't submit
   - Premium intent (Zug/Baar) segment

9. Provide **negative keyword framework** tailored to Swiss pitfalls:
   - DIY/mieten/selber zügeln/transporter
   - jobs/praktikum/lohn
   - Low-value "1 sofa" type requests
   - "zug" as train confusion

Include a recommended "negative keyword conflict check" approach.

### PART 4 — CRO Transformation Plan

10. Specify implementable **CRO changes**:
    - Mobile sticky bottom bar (WhatsApp | 📞 Jetzt anrufen | Offerte)
    - Dynamic Text Replacement (DTR) / "Paid Mode" using URL params: utm_term, utm_campaign, city/loc, kw
    - Trust badges above-the-fold on mobile (Google stars, since 1980, insured)
    - Express 2-step form (Step 1 minimal fields + progress indicator)
    - Pricing psychology: "Komfort" as Bestseller + auto-preselect on pricing intent
    - Performance: LCP improvements (hero preload, reduce render blocking, image optimization)

11. Create a **"Message Match Matrix"** (20+ rows):

For each intent cluster provide:
- Keyword theme
- Ad headline + description (Swiss-friendly High German, avoid ß; use "zügeln", "Offerte")
- Landing page route
- Hero H1 + subline
- Primary CTA label
- Trust elements to emphasize above fold
- Recommended proof module ("Local Box" copy)

### PART 5 — Tracking + Value Feedback Loop

12. **Tracking architecture**:
    - GA4 event list and parameters:
      - `cta_call_click`, `cta_whatsapp_click`, `quote_start`, `quote_step1_submit`, `quote_submit`, `package_select`, `scroll_to_form`, `callback_request`
    - Google Ads conversions mapping (calls + form)
    - Optional: Offline Conversion Tracking workflow (GCLID capture → CRM → upload) with steps + payload fields

13. Provide a **"Measurement Plan"**:
    - What dashboards to use
    - Daily checks (search terms, spend anomalies, call quality)
    - Weekly experiment review template

### PART 6 — 6-Week Execution Plan

14. Create:
    - **Week 1 day-by-day checklist** (setup, QA, launch, monitoring)
    - **Weeks 2–6 weekly objectives** and experiments
    - **"5-cycle optimization loop"** aligned to ads + landing page iterations

---

## 10 EXTRA POWER ADD-ONS (Mandatory)

### EXTRA 1 — Competitor Intelligence (Swiss Market)

15. Find 8–15 competing movers in Zürich and Zug/Baar and analyze:
    - Their ad angles (if visible), landing page patterns, trust signals, offers, phone prominence
    - What we can copy ethically and what we must differentiate

Cite sources where applicable.

### EXTRA 2 — Seasonality & Budget Timing

16. Research Swiss moving seasonality patterns (when demand peaks) and propose:
    - Budget ramp strategy
    - Bid adjustments and ad scheduling recommendations

Cite sources.

### EXTRA 3 — Call Operations as Conversion Weapon

17. Build a **phone-first conversion operating system**:
    - 5–10 minute call script (short version + premium version for Zug/Baar)
    - Qualification checklist (avoid low-value jobs)
    - Callback policy (night vs day)
    - SLA targets and staffing model for 5 people

### EXTRA 4 — 24/7 vs 08–19: ROI Verdict

18. Provide a clear recommendation for:
    - 24/7 live phone vs 08–19 live + night automation (WhatsApp/callback)

Include reasoning, expected lift, and operational risk.

### EXTRA 5 — Fraud & Waste Defense

19. Provide **anti-waste plan**:
    - Click fraud considerations
    - Spam leads handling
    - LSA dispute process hygiene
    - Placement exclusions guidance (if PMax used)

### EXTRA 6 — Premium Positioning for Zug/Baar

20. Create a **premium messaging kit**:
    - 10 premium ad headlines
    - 10 premium proof points
    - "White glove" landing hero copy

No "cheap" language.

### EXTRA 7 — Offer Architecture & AOV Maximization

21. Create an **upsell system**:
    - When to present cleaning/disposal/packing
    - Bundle names and pricing psychology
    - Post-booking upsell flows (email/WhatsApp sequence)

### EXTRA 8 — Performance & Accessibility QA Matrix

22. Provide **QA plan**:
    - Mobile devices checklist
    - Page speed targets
    - Accessibility basics (tap targets, contrast, sticky bar safe area)
    - Tracking verification steps (GA4 debug, tag assistant)

### EXTRA 9 — PR-Ready Engineering Diffs

23. Based on repo analysis, produce:
    - Recommended file/component map (where to implement sticky bar, paid mode hook, express form)
    - Pseudo-code or actual code snippets where safe
    - If feasible, output "patch-style" guidance (what to add/change)

Do NOT break builds. Keep dependencies minimal; if adding a dependency, justify it.

### EXTRA 10 — "Copilot Agent Handoff Pack"

24. Produce a final pack that can be pasted into GitHub Copilot Agent:
    - 30–60 tickets with Title, Priority (P0/P1/P2), Acceptance Criteria, and "Files touched"
    - A "Definition of Done" checklist
    - A "Branch/PR strategy" (P0 first, then P1)

---

## OUTPUT FORMAT (Strict)

A) **Executive Summary** (max 1 page)

B) **Benchmark table** (with citations)

C) **LSA checklist + ranking factors** (with citations)

D) **Competitor intel snapshot** (bullets + citations)

E) **Message Match Matrix** (table)

F) **CRO plan** (P0/P1/P2) with effort estimates

G) **Engineering plan**:
   - Component/file map
   - Ticket list (Copilot Agent format)

H) **Tracking plan** (events + conversions + optional offline)

I) **Phone scripts** (short + premium)

J) **6-week roadmap** (week-by-week) + week 1 daily checklist

K) **Risks & mitigations**

---

## Style Rules

- Swiss-friendly High German (avoid ß), use terms like "zügeln", "Offerte"
- Be specific, not generic. Provide concrete examples
- Cite sources for benchmark/LSA/seasonality claims
- If uncertain, state assumptions clearly and keep going

---

## Start By:

1. Summarizing what you see in the repo + sitemap + screenshots + live link
2. Then deliver the full output exactly in the structure above

---

## Bonus: Copilot Agent "DO IT NOW" Prompt

After you get the plan from ChatGPT Deep Research, paste this into GitHub Copilot Agent:

```
You are GitHub Copilot Agent. Implement ONLY P0 tickets from the provided plan.

Rules:
- Do not refactor unrelated code.
- Keep changes minimal and compile-safe.
- Add MobileStickyCTA component + PaidMode hook + GA4 event firing.
- Add express quote step 1 (minimal fields) and keep existing flow intact.
- Provide a PR with clear commit messages and a short test checklist.

Here is the plan:
[PASTE THE TICKET LIST + FILE MAP]
```
