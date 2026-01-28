# ChatGPT Agent / Codex Implementation Prompt (Multi-Step)

This document contains **structured prompts** you can paste into ChatGPT Agent, GitHub Copilot Agent, or Codex to implement the complete Feierabend Umzüge redesign + performance marketing system.

**Important**: These prompts are designed to be run **sequentially**. Each step builds on the previous one.

---

## 🎯 STEP 0: Context Setup (Paste this FIRST)

```
You are a Senior Full-Stack Engineer specializing in React + Vite + Tailwind CSS + TypeScript.

PROJECT CONTEXT:
- Repository: "Feierabend Umzüge" (Swiss moving company website)
- Stack: React 18.3.1, Vite 5.4.19, Tailwind CSS, TypeScript strict mode
- Goal: Transform into a high-converting paid acquisition landing page system
- Inspiration: 0123.com (Japan/USA moving company) - multi-channel estimate, phone-first, segmentation
- Target: Mobile-first design, maximum call/WhatsApp conversions

I will provide implementation tasks in SEQUENTIAL STEPS.

RULES:
1. Keep all existing routes and pages working (non-breaking changes)
2. Use Tailwind utility classes (no CSS-in-JS unless necessary)
3. All new components must be TypeScript with proper types
4. Follow accessibility best practices (WCAG 2.1 AA)
5. Optimize for performance (lazy load, code split where appropriate)
6. Use Lucide React for icons (already in dependencies)
7. Track all CTA interactions with GA4 events (use existing `src/utils/track.ts`)

EXISTING KEY FILES (reference these):
- src/App.tsx - Main app layout
- src/pages/Index.tsx - Homepage
- src/pages/area/Zurich.tsx - Example city landing page
- src/components/DynamicHero.tsx - Current hero component
- src/hooks/usePaidMode.ts - Paid traffic detection hook
- src/utils/track.ts - Analytics tracking utility

Do NOT create duplicate files. Edit existing files where appropriate.

Acknowledge this context and wait for STEP 1.
```

---

## 🎯 STEP 1: Design System Foundation

**Paste this after Step 0 is acknowledged:**

```
TASK: Implement the Feierabend design system foundation.

REFERENCE DOCUMENT: DESIGN_SYSTEM.md (I will provide or you have it in repo)

SUBTASKS:

1.1) Update tailwind.config.ts with extended theme:

Add these color extensions:
- feierabend.blue: 50, 100, 300, 500, 700, 900 (see DESIGN_SYSTEM.md for hex values)
- feierabend.orange: 100, 500, 600
- Keep existing gray scale

Add font family extensions:
- sans: ['Inter', 'system-ui', 'sans-serif']
- accent: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
- mono: ['JetBrains Mono', 'monospace']

Add custom box shadows:
- soft: '0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03)'
- hover: '0 4px 20px rgba(0, 0, 0, 0.08)'
- premium: '0 8px 24px rgba(46, 90, 143, 0.12)'

1.2) Update index.html:

Add Google Fonts preconnect + stylesheet for:
- Inter: weights 400, 500, 600, 700
- Plus Jakarta Sans: weights 500, 600, 700

Example:
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet">

1.3) Create src/components/ui/DesignSystem.tsx:

A visual component library/storybook for testing (optional, but helpful):
- Button variants: Primary, Secondary, Text
- Card variants: Default, Premium, Hover
- Trust Badge component
- Typography samples

Export all button variants as reusable components.

1.4) Update src/index.css:

Add CSS custom properties at :root for the design system tokens (colors, spacing, fonts).
Set body font to Inter with fallback stack.
Add base focus-visible styles for accessibility.

OUTPUT:
- Show me the updated tailwind.config.ts
- Show me the updated index.html <head> section
- Show me the new DesignSystem.tsx component
- Show me the updated index.css

VALIDATION:
Run `npm run dev` and confirm no build errors.
Visit homepage and inspect element to confirm Inter font is loaded.
```

---

## 🎯 STEP 2: Core UI Components (Button, Card, Badge)

```
TASK: Build core reusable UI components using the new design system.

SUBTASKS:

2.1) Create src/components/ui/Button.tsx:

TypeScript interface:
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

Variants:
- primary: Orange background (feierabend-orange-600), white text, rounded-xl, shadow
- secondary: White background, blue border (feierabend-blue-300), blue text
- text: Transparent, blue text, underline on hover

Sizes:
- sm: px-4 py-2, text-sm
- md: px-8 py-3.5, text-base (default)
- lg: px-10 py-4, text-lg

Add hover states (lift + shadow) and active state (scale-95).
If loading prop is true, show spinner icon (from lucide-react).

2.2) Create src/components/ui/Card.tsx:

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'premium' | 'flat';
  hoverable?: boolean;
}

Variants:
- default: White background, shadow-soft, border, rounded-2xl
- premium: Gradient background, shadow-premium, thicker border (blue-300)
- flat: White background, no shadow, no border

If hoverable=true, add hover lift effect.

2.3) Create src/components/ui/TrustBadge.tsx:

interface TrustBadgeProps {
  icon: React.ReactNode;
  text: string;
  variant?: 'default' | 'success';
}

Pill-shaped component with icon + text.
Use gray-50 background for default, green-100 for success.

2.4) Update src/components/ui/button.tsx (existing shadcn button):

Either replace it with the new Button component OR extend it to support our variants.
Ensure consistency across the app.

OUTPUT:
- Show me Button.tsx
- Show me Card.tsx
- Show me TrustBadge.tsx
- Example usage code

VALIDATION:
Import Button in a test page and render all 3 variants.
Confirm hover/active states work correctly.
```

---

## 🎯 STEP 3: Mobile Sticky Bottom Bar (Conversion Machine)

```
TASK: Create mobile sticky bottom contact bar (HIGHEST PRIORITY for conversions).

REFERENCE: MobileStickyCTA.tsx already exists, but we need to REDESIGN it with the new design system.

SUBTASKS:

3.1) Update src/components/MobileStickyCTA.tsx:

Requirements:
- Fixed position at bottom, z-index 9999
- Only visible on screens < 768px (md breakpoint)
- 3-column grid: WhatsApp | Phone (primary) | Quote
- Phone button (center) is largest and orange (primary CTA)
- WhatsApp and Quote are secondary style (smaller)
- Include micro-copy under phone: "Live 08–19 Uhr"
- Safe area inset for iOS notches: pb-[env(safe-area-inset-bottom)]
- White background, subtle shadow-top
- Border-top: 1px gray-200

Layout:
<div className="grid grid-cols-3 gap-2">
  <WhatsAppButton />
  <PhoneButton />  {/* Larger, orange, center */}
  <QuoteButton />
</div>

Tracking:
- Fire track('cta_whatsapp_click', { location: 'sticky_bar' })
- Fire track('cta_call_click', { location: 'sticky_bar' })
- Fire track('cta_quote_click', { location: 'sticky_bar' })

3.2) Update src/App.tsx:

Ensure MobileStickyCTA is rendered inside the main layout (after content, before closing body).
Check that it doesn't conflict with existing MobileBottomNav (might need to conditionally render based on route).

3.3) Add padding-bottom to main content on mobile:

When sticky bar is present, add pb-24 (96px) to main content wrapper to prevent content from being hidden behind bar.

OUTPUT:
- Show me updated MobileStickyCTA.tsx
- Show me the App.tsx integration code
- Screenshot/description of the layout

VALIDATION:
Open site on mobile (or Chrome DevTools mobile view).
Confirm sticky bar appears at bottom.
Confirm clicking phone button fires tracking event.
Confirm bar doesn't cover content (scroll to bottom and check).
```

---

## 🎯 STEP 4: New Hero Section (Dynamic, Modern, High-Converting)

```
TASK: Redesign the hero section using new design system + 0123-inspired layout.

REFERENCE: src/components/DynamicHero.tsx exists, but needs visual overhaul.

SUBTASKS:

4.1) Update src/components/DynamicHero.tsx:

NEW LAYOUT (Desktop):
+---------------------------------------------------------------+
| H1: "Zürich: Umzug in 5–10 Minuten am Telefon fix gebucht"   |
|     (font-black, text-5xl, feierabend-blue-900)               |
| Subheadline: "Live Umzugs-Concierge. Du redest, wir erledigen" |
|     (text-xl, gray-700, max-w-2xl)                             |
|                                                                |
| Trust Badges Row:                                              |
| [⭐ Google 5.0] [🏢 Seit 1980] [💰 CHF 2 Mio versichert]      |
|                                                                |
| CTA Row:                                                       |
| [📞 Jetzt anrufen]  [💬 WhatsApp]  [Offerte in 60 Sek ↗]     |
|                                                                |
+---------------------------------------------------------------+

Background:
- Gradient: from feierabend-blue-50 via white to transparent
- OR: Hero image (moving truck, Swiss cityscape) with overlay
- Keep it light, don't overpower text

Dynamic Text Replacement:
- If usePaidMode().isPremiumMode: add extra badge "✨ Diskret • Full-Service"
- If usePaidMode().wording === 'empathetic': adjust subheadline to "Geduldig auch für Senioren"

Responsive:
- Mobile: Stack vertically, H1 text-4xl, single-column CTAs
- Trust badges: horizontal scroll on mobile if needed

4.2) Create 3 CTA Button Components:

PhoneButton: 
- Primary variant, orange
- Icon: Phone (lucide-react)
- href="tel:+41791234567"
- Fires track('cta_call_click', { location: 'hero' })

WhatsAppButton:
- Secondary variant
- Icon: MessageCircle
- href="https://wa.me/41791234567?text=..."
- Fires track('cta_whatsapp_click', { location: 'hero' })

QuoteButton:
- Secondary variant
- Icon: ArrowRight
- Scrolls to ExpressQuoteForm (smooth scroll)
- Fires track('cta_quote_click', { location: 'hero' })

4.3) Update Hero Trust Badges:

Use the new TrustBadge component.
Icons: Star, Building2, Shield (from lucide-react)

OUTPUT:
- Show me updated DynamicHero.tsx
- Show me example rendering for Zürich and Zug (premium mode)

VALIDATION:
Visit /?city=zürich - see standard hero
Visit /?city=zug - see premium badge
Confirm all CTAs track correctly
```

---

## 🎯 STEP 5: Express Quote Form (Speed-to-Lead)

```
TASK: Redesign ExpressQuoteForm to be visually aligned with new design system.

REFERENCE: src/components/ExpressQuoteForm.tsx exists, needs UI update.

SUBTASKS:

5.1) Update src/components/ExpressQuoteForm.tsx:

Visual Updates:
- Use new Card component (premium variant for paid traffic)
- Use new Button component (primary for submit)
- Progress bar: feierabend-orange-600 fill, gray-200 background
- Input fields: rounded-xl, border-gray-300, focus:border-feierabend-blue-500
- Labels: text-sm font-medium text-gray-700

Layout:
- Step 1 (minimal):
  * Telefon (required)
  * PLZ Start (required)
  * PLZ Ende (required)
  * [Weiter] button
- Step 2 (optional):
  * Umzugsdatum (date picker)
  * Zimmer (select)
  * Kommentar (textarea)
  * [Offerte anfordern] button

Progress Indicator:
<div className="flex gap-2 mb-6">
  <div className="h-1 flex-1 bg-feierabend-orange-600 rounded-full" />
  <div className="h-1 flex-1 bg-gray-200 rounded-full" />
</div>
<p className="text-sm text-gray-600 mb-4">Schritt {step} von 2</p>

Tracking:
- form_started: when user focuses first input
- form_step1_complete: when step 1 submitted
- form_completed: when step 2 submitted

5.2) Add Success State:

After submission, show:
- Checkmark icon (green)
- "Danke! Wir rufen dich in 5–10 Minuten zurück."
- Secondary button: "Noch eine Frage? WhatsApp öffnen"

OUTPUT:
- Show me updated ExpressQuoteForm.tsx
- Show me success state component

VALIDATION:
Fill out form and submit.
Confirm tracking fires correctly.
Confirm success message appears.
```

---

## 🎯 STEP 6: Package Cards (Bestseller Psychology)

```
TASK: Update PackageCards component with new design + bestseller highlighting.

REFERENCE: src/components/PackageCards.tsx exists.

SUBTASKS:

6.1) Update src/components/PackageCards.tsx:

Card Design:
- Use new Card component
- Add "BESTSELLER" badge on Komfort package:
  * Position: absolute top-right
  * Pill shape, orange background
  * Pulse animation: animate-pulse
- Pricing: Large, bold, font-mono
- Feature list: Checkmark icons (green)

Preselection:
- If usePackagePreselection() returns "komfort", add visual highlight:
  * Border: 2px solid feierabend-orange-600
  * Shadow: shadow-premium
- Scroll into view on mount if preselected

Hover:
- Lift effect (translate-y)
- Shadow increase

3 Packages:
1. Basis (CHF 590):
   - Transport
   - Grundversicherung
   - 2 Umzugshelfer

2. Komfort (CHF 990) [BESTSELLER]:
   - Alles aus Basis
   - Möbelmontage
   - Halteverbots-Antrag
   - Versicherung CHF 100'000

3. Premium (CHF 1'890):
   - Alles aus Komfort
   - Full-Packing
   - Reinigung
   - Concierge-Begleitung
   - Versicherung CHF 2 Mio

CTA: "Paket wählen" button fires track('package_selected', { package: 'komfort' })

OUTPUT:
- Show me updated PackageCards.tsx

VALIDATION:
Visit page with preselection (?intent=pricing)
Confirm Komfort is highlighted and scrolled into view
Confirm bestseller badge pulses
```

---

## 🎯 STEP 7: City Landing Page Template (Zurich Example)

```
TASK: Update Zurich landing page as reference implementation for all city pages.

REFERENCE: src/pages/area/Zurich.tsx

SUBTASKS:

7.1) Update Structure:

1. DynamicHero (with city="zürich")
2. Local Proof Section:
   - H2: "Wir kennen jeden Winkel von Zürich"
   - Grid of 4 cards with local insights:
     * "Niederdorf: enge Treppen, Altbauten"
     * "Halteverbot: wir organisieren"
     * "500+ Umzüge/Jahr in ZH"
     * "Express: morgens gebucht, nachmittags gezügelt"
   - Use new Card component, icons from lucide-react
3. ExpressQuoteForm (centered, premium card)
4. PackageCards (with bestseller)
5. Trust Section:
   - Google Reviews widget
   - Insurance badges
   - "Seit 1980" timeline
6. FAQ Accordion (keep existing)

Visual Polish:
- Section spacing: py-20 desktop, py-12 mobile
- Max width: max-w-7xl mx-auto
- Background: alternating white / gray-50

7.2) Add Dynamic Meta Tags:

Use react-helmet-async:
- Title: "Umzugsfirma Zürich – In 5–10 Min fix gebucht | Feierabend"
- Description: "Zürich zügeln ohne Stress. Live Umzugs-Concierge..."
- If UTM params present, inject keyword into title

OUTPUT:
- Show me updated Zurich.tsx
- Show me at least 3 sections fully coded

VALIDATION:
Visit /area/zurich
Confirm new design loads
Confirm all CTAs work
Confirm page is responsive (mobile + desktop)
```

---

## 🎯 STEP 8: Homepage Redesign (Index.tsx)

```
TASK: Redesign homepage to be high-converting landing page for brand + broad terms.

REFERENCE: src/pages/Index.tsx

SUBTASKS:

8.1) New Homepage Structure:

1. DynamicHero (generic, adapts based on UTM)
2. "How It Works" Section:
   - 3 steps with icons:
     1. Anruf (Phone icon) - "Du rufst uns an"
     2. Offerte (FileText icon) - "Wir besprechen alles in 5–10 Min"
     3. Umzug (Truck icon) - "Wir erledigen deinen Umzug"
   - Timeline connector between steps
3. Popular Cities Grid:
   - 6-8 cards linking to /area/{city}
   - Card shows: City name, icon, "Ab CHF 590"
   - Hover effect
4. ExpressQuoteForm
5. PackageCards (with bestseller)
6. "Why Feierabend?" Section:
   - 4 USPs in grid:
     * Seit 1980 (trust)
     * CHF 2 Mio versichert
     * 500+ Umzüge/Jahr
     * Live Concierge
7. Testimonials Carousel (keep existing, restyle)
8. CTA Banner:
   - "Bereit? Ruf jetzt an."
   - Large phone button
   - Background: gradient blue-to-orange

Visual Consistency:
- Use new Card, Button, TrustBadge components throughout
- Consistent spacing (section-spacing pattern)

8.2) Add Structured Data (JSON-LD):

- LocalBusiness schema
- Service schema
- AggregateRating schema (if reviews exist)

OUTPUT:
- Show me updated Index.tsx
- Show me structured data JSON-LD

VALIDATION:
Visit /
Confirm design is cohesive
Confirm all sections render
Confirm mobile responsive
```

---

## 🎯 STEP 9: Performance Optimization

```
TASK: Optimize for Core Web Vitals and mobile performance.

SUBTASKS:

9.1) Hero Image Optimization:

If using hero background image:
- Convert to WebP format
- Add preload link in index.html:
  <link rel="preload" as="image" href="/hero-zurich.webp">
- Use srcset for responsive images
- Add loading="eager" for above-fold images
- Add loading="lazy" for below-fold images

9.2) Font Optimization:

In index.html, add font-display=swap to Google Fonts URL:
&display=swap

Add preload for critical fonts:
<link rel="preload" href="..." as="font" type="font/woff2" crossorigin>

9.3) Code Splitting:

Lazy load heavy components:
- ExpressQuoteForm (only load when scrolled near or CTA clicked)
- PackageCards
- Testimonial carousel

Example:
const ExpressQuoteForm = lazy(() => import('./components/ExpressQuoteForm'));

Wrap in Suspense with loading skeleton.

9.4) Reduce Bundle Size:

- Check for duplicate dependencies (npm ls)
- Remove unused imports
- Tree-shake Lucide icons (only import used icons)

9.5) Add Performance Monitoring:

Update src/utils/track.ts to send Core Web Vitals to GA4:
- LCP
- FID
- CLS

Use web-vitals package (already in dependencies?).

OUTPUT:
- Show me preload links for index.html
- Show me lazy loading implementation
- Show me Core Web Vitals tracking code

VALIDATION:
Run Lighthouse audit (mobile):
- Target: Performance > 90
- LCP < 2.5s
- CLS < 0.1
```

---

## 🎯 STEP 10: Tracking & Analytics Verification

```
TASK: Ensure all conversion points are tracked correctly.

SUBTASKS:

10.1) Audit All CTA Tracking:

Verify these events fire with correct parameters:
- cta_call_click (location: 'hero' | 'sticky_bar' | 'section')
- cta_whatsapp_click (location: ...)
- cta_quote_click (location: ...)
- form_started
- form_step1_complete
- form_completed
- package_selected (package: 'basis' | 'komfort' | 'premium')

10.2) Add Enhanced Ecommerce (optional):

For package selection, send GA4 ecommerce event:
track('select_item', {
  items: [{
    item_id: 'package-komfort',
    item_name: 'Komfort Paket',
    price: 990,
  }]
})

10.3) Test in GA4 DebugView:

Add instructions for testing:
1. Add ?debug_mode=true to URL
2. Open GA4 DebugView
3. Click all CTAs
4. Submit form
5. Verify all events appear with correct parameters

10.4) Add Conversion Goals to Documentation:

List recommended GA4 conversions to mark:
- cta_call_click
- form_completed
- package_selected

OUTPUT:
- Show me tracking audit checklist
- Show me testing instructions document
- Show me example GA4 event with all parameters

VALIDATION:
Test all CTAs with debug mode
Confirm events appear in GA4 DebugView
```

---

## 🎯 STEP 11: Visual Assets Integration (Placeholder)

```
TASK: Prepare for branded visual asset integration.

NOTE: Actual photos/graphics will be commissioned separately. This step creates placeholders.

SUBTASKS:

11.1) Create Image Placeholder System:

Create src/components/ui/ImagePlaceholder.tsx:
- Takes width/height/label props
- Renders a styled div with:
  * Background: gradient or pattern
  * Label text: "Hero Image" / "Truck Photo" / "Team Photo"
  * Icon representing content type
- Use Tailwind classes for styling

11.2) Add Placeholders to Key Locations:

Hero background: <ImagePlaceholder label="Hero: Zürich Skyline + Truck" />
Service cards: <ImagePlaceholder label="Service: Packing" />
Team section: <ImagePlaceholder label="Team: 5 People" />
Truck fleet: <ImagePlaceholder label="Fleet: 3 Trucks" />

11.3) Document Image Requirements:

Create public/assets/IMAGE_REQUIREMENTS.md:
- List all needed images with dimensions
- Specify content (e.g., "Moving truck with Feierabend logo on Zürich street")
- Specify format (WebP, 2x for retina)
- Reference DESIGN_SYSTEM.md for style guidelines

OUTPUT:
- Show me ImagePlaceholder.tsx
- Show me IMAGE_REQUIREMENTS.md

VALIDATION:
Visit site and confirm placeholders render correctly
Confirm layout doesn't break with placeholders
```

---

## 🎯 STEP 12: Cross-Browser & Device Testing Checklist

```
TASK: Create comprehensive testing checklist.

SUBTASKS:

12.1) Create TESTING_CHECKLIST.md:

DEVICE MATRIX:
- iPhone 13 Pro (iOS Safari)
- Samsung Galaxy S22 (Chrome Android)
- iPad Air (Safari)
- MacBook Pro (Chrome, Safari, Firefox)
- Windows Laptop (Chrome, Edge)

TEST SCENARIOS:
For each device:
1. Homepage loads correctly
2. Hero section visible above fold
3. Trust badges render
4. CTAs clickable (phone, WhatsApp)
5. Mobile sticky bar appears (mobile only)
6. Sticky bar doesn't cover content
7. Express form submits successfully
8. Package cards selectable
9. City landing page loads
10. Analytics events fire

ACCESSIBILITY:
- Tab through all interactive elements
- Test with screen reader (VoiceOver/NVDA)
- Check color contrast (use WAVE tool)
- Verify focus indicators visible

PERFORMANCE:
- Run Lighthouse audit on 3 key pages
- Check mobile network throttling (3G)
- Verify images lazy load

12.2) Create Regression Test Script:

For future updates, ensure:
- All CTAs still work
- Tracking still fires
- Forms still submit
- No console errors

OUTPUT:
- Show me TESTING_CHECKLIST.md

VALIDATION:
Perform spot checks on 2-3 devices
Log any issues found
```

---

## 🎯 STEP 13: Documentation & Handoff

```
TASK: Create final documentation for maintenance and future development.

SUBTASKS:

13.1) Create COMPONENT_LIBRARY.md:

Document all new/updated components:
- Button (with all variants + props)
- Card (with variants)
- TrustBadge
- MobileStickyCTA
- DynamicHero
- ExpressQuoteForm
- PackageCards

For each:
- Props interface
- Usage example
- Screenshot/description
- When to use

13.2) Create MAINTENANCE_GUIDE.md:

How to:
- Update phone number (global constant)
- Update package pricing
- Add new city landing page
- Update hero copy
- Add new tracking events
- Deploy to production

13.3) Create PERFORMANCE_MONITORING.md:

How to:
- Check Core Web Vitals in GA4
- Run Lighthouse audits monthly
- Monitor conversion rates by page
- Set up alerts for page load issues

13.4) Update README.md:

Add sections:
- Design System Overview (link to DESIGN_SYSTEM.md)
- Component Library (link to COMPONENT_LIBRARY.md)
- Testing (link to TESTING_CHECKLIST.md)
- Deployment
- Performance Monitoring

OUTPUT:
- Show me COMPONENT_LIBRARY.md structure
- Show me updated README.md
```

---

## 🎯 FINAL STEP: Pre-Launch QA & Deployment Prep

```
TASK: Final checks before going live.

CHECKLIST:

1. BUILD:
   - Run `npm run build` successfully
   - Check bundle size (< 500KB gzipped)
   - Verify no console warnings

2. FUNCTIONALITY:
   - All phone links work with real number
   - WhatsApp links work with real number
   - Forms submit to real endpoint (not mock)
   - Analytics tracking fires to real GA4 property

3. CONTENT:
   - Replace all placeholder text
   - Replace all placeholder images
   - Spell check (Swiss German)
   - Legal: Impressum, AGB, Privacy links work

4. SEO:
   - Sitemap.xml up to date
   - Robots.txt allows crawling
   - Meta tags on all pages
   - Structured data valid (test with Google Rich Results)

5. PERFORMANCE:
   - Lighthouse scores: Performance > 90, Accessibility > 95
   - Core Web Vitals pass
   - Mobile load time < 3s

6. SECURITY:
   - HTTPS enabled
   - No API keys exposed in client
   - Forms have CSRF protection (if applicable)

7. MONITORING:
   - GA4 connected and receiving data
   - Error tracking set up (Sentry/similar)
   - Uptime monitoring configured

OUTPUT:
- Show me completed checklist with status (✅/❌)
- List any blockers for launch

DEPLOYMENT:
Once all checks pass, provide deployment command/instructions.
```

---

## 📝 BONUS: Copilot Agent "Quick Start" Prompt

**If you want to run ALL steps automatically** (risky but fast):

```
You are GitHub Copilot Agent implementing the complete Feierabend Umzüge redesign.

I have provided you with:
- DESIGN_SYSTEM.md (design specifications)
- CHATGPT_AGENT_IMPLEMENTATION_PROMPT.md (this document)
- Current repository code

TASK: Execute STEPS 1-10 sequentially without stopping. For each step:
1. Read requirements
2. Implement changes
3. Verify no build errors
4. Move to next step

PRIORITIES:
- P0 (must ship): Steps 1-3, 7
- P1 (high value): Steps 4-6, 8
- P2 (nice-to-have): Steps 9-13

RULES:
- Keep existing routes working
- Use TypeScript strict mode
- Track all CTAs
- Mobile-first design
- Commit after each major step

Start with STEP 1 and report progress after each step completion.
If you encounter any blocking issue, stop and report it before proceeding.

BEGIN.
```

---

## Summary

These prompts are designed to be:
1. **Sequential**: Each builds on previous steps
2. **Modular**: Can be run individually or combined
3. **Validated**: Each includes testing/verification steps
4. **Production-ready**: Includes performance, accessibility, tracking

**Estimated Timeline**:
- Steps 1-3: 2-4 hours (foundation)
- Steps 4-6: 3-5 hours (core conversions)
- Steps 7-8: 2-3 hours (pages)
- Steps 9-13: 2-3 hours (optimization + docs)

**Total**: 10-15 hours of implementation for a skilled developer (or 20-30 for AI agent with iterations).
