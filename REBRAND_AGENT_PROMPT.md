# Feierabend Umzuege Rebrand - Agent Prompt (ASCII)

Use this prompt to instruct ChatGPT/Codex to implement the full rebrand and
conversion-focused design system. It is structured as a one-shot prompt and
also in stepwise chunks if you need to split it.

---

## One-shot Prompt (copy/paste)

```text
ROLE
You are a Senior Frontend Architect + Design Systems Lead + CRO Engineer.
Stack: React + Vite + TypeScript + Tailwind CSS.
You have deep knowledge of Swiss brand conventions and performance marketing.

PROJECT
Brand: Feierabend Umzuege
Domains: www.feierabend-umzug.ch and www.feierabendumzug.ch
Goal: transform the site into a premium, phone-first conversion machine.

STRATEGY CONTEXT
- Brand hook: "Live Umzugs-Concierge" and "In 5-10 Minuten fix gebucht."
- Swiss trust: +41 or 0800 primary phone; avoid non-CH numbers.
- Market focus: Zuerich (volume), Zug/Baar (premium), Luzern (expansion).
- Benchmarks: the0123.com and 0123usa.com (phone-first, multi-channel estimate,
  segmentation, trust-heavy).

DESIGN DIRECTION
- Primary color: Swiss Neo-Teal (#008080) = precision + hygiene.
- Action color: Signal Orange (#FF4500) = high-visibility CTA.
- Avoid generic blue or purple. Feel: modern, sharp, premium, clinical clean.
- Typography: avoid Inter/Roboto. Use a purposeful pair:
  - Display: "Space Grotesk" or "Sora"
  - Body: "Manrope" or "Work Sans"
- Layout: Swiss grid, strong hierarchy, high contrast for CTAs.

DELIVERABLES
1) Design token system:
   - Create feierabend.tokens.json with semantic tokens.
   - Add scripts/build-tokens.js to generate src/styles/tokens.css.
   - Configure tailwind.config.ts to reference CSS vars (no hex in components).
2) New core components (React/TS + Tailwind):
   - GlobalNav (sticky, glassmorphism on scroll, primary CTA in orange).
   - HeroSection (full viewport, H1 + subline + multi-channel "Estimate Engine"
     tiles: Phone, WhatsApp, Express Form, Video Check).
   - TrustGrid (3-4 proof blocks: hygiene, fixed prices, training, insurance).
   - ServiceShowcase (cards with hover lift and orange border).
   - CTA Section (phone-first).
3) CRO features:
   - MobileStickyCTA bar (WhatsApp | Call | Offerte).
   - Paid Mode hook (DTR): read URL params (utm_term, utm_campaign, city, kw).
   - Trust badges above the fold on mobile.
   - Express Quote Form (2-step, minimal fields).
   - Package psychology: "Komfort" = bestseller + preselect on pricing intent.
4) Pages and routing:
   - Apply new hero + trust + estimate engine on homepage.
   - City pages: add "Local Proof" block for Zuerich/Zug/Baar/Luzern.
5) Tracking:
   - GA4 events: cta_call_click, cta_whatsapp_click, cta_quote_click,
     quote_start, quote_step1_submit, quote_submit, package_select.
6) Asset pipeline:
   - Create prompts for Midjourney/DALL-E assets (trucks, boxes, uniforms).
   - All assets must include Feierabend logo on boxes, trucks, uniforms.
7) Output:
   - Provide file list and code changes.
   - Ensure `npm run build` passes.

CONSTRAINTS
- ASCII only in code/text (use ue/ae/oe, no ß).
- No framer-motion.
- Use Tailwind utilities; no inline hex colors.
- Keep existing routes working.

IMPLEMENTATION PLAN (execute in order)
1) Create feierabend.tokens.json and build-tokens.js.
2) Generate tokens.css and import it in main entry.
3) Update tailwind.config.ts to reference CSS variables.
4) Build GlobalNav, HeroSection, TrustGrid, ServiceShowcase, MobileStickyCTA.
5) Wire Paid Mode DTR and Express Quote Form.
6) Update homepage and Zurich/Zug/Baar/Luzern pages.
7) Add tracking helper and wire CTAs.
8) Provide Midjourney/DALL-E prompts for branded visuals.

CODE OUTPUT REQUIREMENTS
- Provide the exact new components and edits with file paths.
- Include any CSS files and tokens.
- Add a short test checklist.
```

---

## Stepwise Prompt (if one-shot is too long)

### Step 1 - Design Tokens + Tailwind
```text
ROLE: Senior Frontend Architect + Design Systems Lead.
TASK: Add a token system for Swiss Neo-Teal (#008080) and Signal Orange (#FF4500).
Create feierabend.tokens.json, scripts/build-tokens.js, and tokens.css.
Update tailwind.config.ts to use CSS variables only (no hex in components).
Fonts: Display (Space Grotesk or Sora), Body (Manrope or Work Sans).
Provide file paths and code.
```

### Step 2 - Core Components
```text
ROLE: Senior Frontend Architect + CRO Engineer.
TASK: Build GlobalNav, HeroSection (with Estimate Engine tiles),
TrustGrid, ServiceShowcase, MobileStickyCTA.
Use Tailwind classes referencing the token vars.
No framer-motion. ASCII-only text.
Provide code + usage examples.
```

### Step 3 - CRO + Paid Mode
```text
ROLE: CRO Engineer.
TASK: Add Paid Mode hook (URL params), Express Quote Form (2-step),
trust badges above fold, and package preselect logic.
Wire GA4 events: cta_call_click, cta_whatsapp_click, cta_quote_click,
quote_start, quote_step1_submit, quote_submit, package_select.
Provide code + file paths.
```

### Step 4 - Page Integration
```text
ROLE: Frontend Engineer.
TASK: Replace homepage hero with new Dynamic Hero + Estimate Engine,
insert Express Quote Form and TrustGrid. Add Local Proof blocks to
Zurich, Zug, Baar, Luzern pages. Ensure routes still work.
Provide diffs and updated component usage.
```

### Step 5 - Visual Asset Prompts
```text
ROLE: Brand Designer + AI Art Director.
TASK: Provide Midjourney/DALL-E prompts for:
1) Truck with Feierabend logo (Swiss Neo-Teal + Signal Orange).
2) Branded boxes with logo and orange tape.
3) Uniformed crew with logo on shirts.
4) Van + boxes on a clean Zurich street.
5) Close-up of "Feierabend" logo on boxes and uniforms.
Use clean, premium, clinical aesthetic and Swiss context.
```

---

## Asset Prompt Examples (ASCII)

1) Truck (Zurich)
```
Photorealistic electric moving truck on a clean Zurich residential street.
Matte white truck with diagonal Swiss Neo-Teal (#008080) livery, Feierabend
logo on the side, Signal Orange (#FF4500) accents on mirrors and bumper.
Soft morning light, premium, minimal, clinical clean look. --ar 16:9
```

2) Boxes (Studio)
```
3D isometric stack of premium cardboard moving boxes, crisp white.
Signal Orange tape, Feierabend logo in Swiss Neo-Teal on all sides.
One box open showing neatly packed items. Studio lighting, white background.
```

3) Crew (Uniforms)
```
Studio portrait of two professional movers in Swiss Neo-Teal polo shirts with
Feierabend logo, dark grey cargo pants, Signal Orange gloves. Clean, premium,
trustworthy. Bright modern apartment background, shallow depth of field.
```

---

## Notes for the agent
- Keep all text in ASCII (use ue/ae/oe). Use Swiss terms: zuegeln, Offerte.
- Primary CTA should show +41 or 0800.
- Avoid purple and generic blue. Focus on Neo-Teal + Signal Orange.
- Use glassmorphism for navigation on scroll.
- Provide a minimal test checklist (build, lint, view hero, CTA clicks).

