# Feierabend Umzüge – Design System & Visual Identity

## 🎨 Design Philosophy

**Core Brand Essence**: "Feierabend" = Peace of mind. The moment when work ends and life begins.

**Visual Strategy**: Modern Swiss minimalism meets warm reliability. Clean, sharp, confident — but never cold. Premium without being pretentious.

**Inspired by**: 0123.com's clarity + Swiss design heritage (clean lines, functional beauty) + modern SaaS UI patterns.

---

## Color Palette

### Primary Colors

```css
/* Feierabend Blue – Trust, Reliability, Swiss Quality */
--feierabend-blue-900: #0A2540;  /* Deep navy - headers, emphasis */
--feierabend-blue-700: #1E3A5F;  /* Primary text */
--feierabend-blue-500: #2E5A8F;  /* Primary buttons, links */
--feierabend-blue-300: #5B8BC4;  /* Hover states */
--feierabend-blue-100: #E8F1F9;  /* Backgrounds, cards */

/* Sunset Orange – Action, Energy, "Feierabend" warmth */
--feierabend-orange-600: #FF6B35;  /* Primary CTA, phone icon */
--feierabend-orange-500: #FF7F50;  /* Hover state */
--feierabend-orange-100: #FFF0EB;  /* Soft backgrounds */

/* Success Green – Confirmation, trust badges */
--feierabend-green-600: #10B981;
--feierabend-green-100: #D1FAE5;

/* Neutral Gray Scale */
--gray-900: #111827;  /* Body text */
--gray-700: #374151;  /* Secondary text */
--gray-500: #6B7280;  /* Muted text */
--gray-300: #D1D5DB;  /* Borders */
--gray-100: #F3F4F6;  /* Subtle backgrounds */
--gray-50: #F9FAFB;   /* Page background */
```

### Usage Guidelines

**Primary Blue** (`--feierabend-blue-500`):
- Navigation links
- Secondary buttons
- Section headers
- Icons (non-CTA)

**Sunset Orange** (`--feierabend-orange-600`):
- Primary CTAs (Call Now, WhatsApp)
- Phone numbers
- Urgency indicators
- Bestseller badges

**White + Gray-50**:
- Main page background
- Card backgrounds
- Hero sections (with subtle gradient)

**Why these colors?**
- Blue = Swiss trust + reliability (think Swiss banks, quality)
- Orange = "Feierabend" warmth (sunset, end of workday, relief)
- High contrast for accessibility
- Works in light mode (no dark mode needed for conversion-focused site)

---

## Typography

### Font Stack

```css
/* Primary Font: Inter (geometric, modern, Swiss-feeling) */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

/* Accent Font: Plus Jakarta Sans (friendlier, rounder for CTAs/highlights) */
--font-accent: 'Plus Jakarta Sans', 'Inter', sans-serif;

/* Mono: For prices, stats, trust indicators */
--font-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
```

### Type Scale

```css
/* Display (Hero headlines) */
--text-display: 3.5rem;    /* 56px */
--text-display-mobile: 2.5rem;  /* 40px */

/* H1 (Page titles) */
--text-h1: 2.5rem;         /* 40px */
--text-h1-mobile: 2rem;    /* 32px */

/* H2 (Section headers) */
--text-h2: 2rem;           /* 32px */
--text-h2-mobile: 1.5rem;  /* 24px */

/* H3 (Card titles) */
--text-h3: 1.5rem;         /* 24px */

/* Body Large (Hero subheadline) */
--text-body-lg: 1.25rem;   /* 20px */

/* Body (Default) */
--text-body: 1rem;         /* 16px */

/* Small (Captions, fine print) */
--text-sm: 0.875rem;       /* 14px */

/* Micro (Trust badges, metadata) */
--text-xs: 0.75rem;        /* 12px */
```

### Font Weights

```css
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;  /* Display headlines only */
```

**Rationale**:
- Inter = Swiss precision, excellent legibility, variable font for performance
- Plus Jakarta Sans = softer for CTAs (makes buttons feel more approachable)
- Mono = anchors trust (numbers feel more "official")

---

## Spacing System

```css
/* 8px base unit (consistent with Tailwind defaults) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

**Mobile vs Desktop**:
- Mobile: sections = `space-12` (48px) between
- Desktop: sections = `space-20` (80px) between

---

## Components

### Buttons

#### Primary CTA (Phone, WhatsApp, Main actions)

```css
.btn-primary {
  background: var(--feierabend-orange-600);
  color: white;
  padding: 14px 32px;
  border-radius: 12px;
  font-family: var(--font-accent);
  font-weight: var(--font-semibold);
  font-size: var(--text-body);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--feierabend-orange-500);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.35);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### Secondary Button (Quote, Learn More)

```css
.btn-secondary {
  background: white;
  color: var(--feierabend-blue-700);
  border: 2px solid var(--feierabend-blue-300);
  padding: 14px 32px;
  border-radius: 12px;
  font-family: var(--font-accent);
  font-weight: var(--font-medium);
  font-size: var(--text-body);
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  border-color: var(--feierabend-blue-500);
  background: var(--feierabend-blue-50);
  transform: translateY(-2px);
}
```

#### Text Link

```css
.link {
  color: var(--feierabend-blue-500);
  text-decoration: none;
  font-weight: var(--font-medium);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.link:hover {
  border-bottom-color: var(--feierabend-blue-500);
}
```

---

### Cards

```css
.card {
  background: white;
  border-radius: 16px;
  padding: var(--space-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05),
              0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid var(--gray-200);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
  border-color: var(--feierabend-blue-200);
}

/* Premium Card (for Zug/Baar) */
.card-premium {
  background: linear-gradient(135deg, #FFF 0%, #F9FAFB 100%);
  border: 2px solid var(--feierabend-blue-300);
  box-shadow: 0 8px 24px rgba(46, 90, 143, 0.12);
}
```

---

### Trust Badges

```css
.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--gray-50);
  border-radius: 9999px;  /* Pill shape */
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--gray-700);
}

.trust-badge-icon {
  width: 16px;
  height: 16px;
  color: var(--feierabend-green-600);
}

/* Examples:
✓ Google 5.0 ★★★★★
✓ Seit 1980
✓ CHF 2 Mio. versichert
*/
```

---

### Mobile Sticky Bottom Bar

```css
.sticky-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: white;
  border-top: 1px solid var(--gray-200);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
  padding: var(--space-3) var(--space-4);
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: var(--space-3);
  
  /* Safe area for iOS notches */
  padding-bottom: max(var(--space-3), env(safe-area-inset-bottom));
}

.sticky-bar-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2);
  border-radius: 8px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.sticky-bar-btn-primary {
  grid-column: 2;  /* Center = Phone */
  background: var(--feierabend-orange-600);
  color: white;
  font-size: var(--text-sm);
  padding: var(--space-3);
}

/* Micro-copy underneath */
.sticky-bar-microcopy {
  margin-top: var(--space-1);
  font-size: 10px;
  color: var(--gray-500);
  text-align: center;
}
```

---

## Layout Patterns

### Hero Section (Above the Fold)

**Desktop**:
```
+--------------------------------------------------+
|  Navigation Bar (transparent/white)               |
+--------------------------------------------------+
|                                                    |
|  H1 (Display size, 56px)                          |
|  Subheadline (20px, max 60 chars)                 |
|                                                    |
|  [Trust Badges: ⭐ 5.0 | 🏢 Seit 1980 | 💰 CHF 2M] |
|                                                    |
|  [📞 Jetzt anrufen]  [💬 WhatsApp]  [Offerte ↗]   |
|                                                    |
|  Background: Gradient blue-to-white OR hero image |
+--------------------------------------------------+
```

**Mobile**:
```
+------------------------+
| Nav (burger menu)       |
+------------------------+
| H1 (40px, tight)        |
| Subheadline (16px)      |
|                         |
| [Trust badges row]      |
|                         |
| [📞 Jetzt anrufen]      |
| [💬 WhatsApp]           |
+------------------------+
| (content flows...)      |
+------------------------+
| STICKY BAR (fixed)      |
| [WA] [📞 CALL] [Quote]  |
+------------------------+
```

---

### Section Layout (Standard)

```
+--------------------------------------------------+
|                    Section Header                  |
|  H2 (32px) + Optional badge/label above           |
|  Optional description (20px, centered)            |
+--------------------------------------------------+
|                                                    |
|  [Card]      [Card]      [Card]                   |
|  [Card]      [Card]      [Card]                   |
|                                                    |
+--------------------------------------------------+
```

**Padding**:
- Desktop: `py-20` (80px top/bottom), `px-8` (32px sides)
- Mobile: `py-12` (48px top/bottom), `px-4` (16px sides)

---

## Animations & Interactions

### Micro-interactions (Tailwind-based)

```jsx
// Fade in on scroll
className="animate-in fade-in slide-in-from-bottom-4 duration-700"

// Hover lift
className="transition-transform hover:-translate-y-1 duration-200"

// Button press
className="active:scale-95"

// Number counter (trust stats)
<AnimatedCounter from={0} to={500} duration={1500} suffix="+" />
```

### Page Transitions

- No heavy animations between routes (kills mobile performance)
- Simple fade-in for new content: `animate-in fade-in duration-300`

---

## Imagery Style

### Photography Guidelines

**What we need** (like 0123):
1. **Hero Images**:
   - Real moving trucks with "Feierabend Umzüge" branding
   - Swiss locations (recognizable: Zürich streets, Zug lakefront, mountain backdrop)
   - Professional crew in branded uniforms
   - Wide angle, bright, aspirational

2. **Service/Process Images**:
   - Hands carefully packing (white gloves for premium)
   - Boxes with "Feierabend" logo printed
   - Furniture being carried (emphasis on care/protection)
   - Customer smiling/relieved (diverse ages, families + singles + seniors)

3. **Trust Visuals**:
   - Insurance documents
   - Google Review screenshots (5.0 stars)
   - Team photo (family business vibe)
   - Fleet overview (clean trucks, organized)

**Style**:
- Natural light, slightly warm tone
- Shallow depth of field (subject sharp, background soft blur)
- No stock photos that look fake
- Diversity: show families, young professionals, seniors, different city types

**Colors in photos should complement**:
- Branded items: Blue + Orange
- Background: Neutral whites, grays, natural wood tones
- Swiss context: mountains, lakes, urban Swiss architecture

---

### Branded Visual Assets

**Logo Applications** (like 0123 does):

1. **Trucks**: 
   - Large logo on sides
   - Phone number underneath: **0800 XXX XXX** (center, huge)
   - "Seit 1980 | Schweizer Qualität" (trust line)

2. **Moving Boxes**:
   - Feierabend logo printed on side
   - Color: White box + Blue/Orange logo
   - "Umzugsboxen" label

3. **Uniforms**:
   - Polo shirts: Navy blue with orange logo
   - Clean, professional (not construction-style)

4. **Packing Materials**:
   - Branded tape (optional premium detail)
   - Furniture blankets with logo patch

5. **Digital Assets**:
   - Social media: square/vertical photo templates with logo overlay
   - WhatsApp profile pic: circular logo badge
   - Email signature images

---

## Iconography

**Style**: Lucide React (consistent, modern, open-source)

**Common icons**:
```jsx
import { 
  Phone,          // Primary CTA
  MessageCircle,  // WhatsApp
  Clock,          // Speed/timing
  Shield,         // Insurance
  CheckCircle,    // Confirmation
  Star,           // Reviews
  TrendingUp,     // Growth/stats
  MapPin,         // Location
  Package,        // Service
  Users           // Team/family
} from 'lucide-react';
```

**Icon sizing**:
- Hero section: 48px
- Section headers: 32px
- Cards: 24px
- Inline text: 16px

**Icon color**:
- Primary actions: `text-feierabend-orange-600`
- Trust/success: `text-feierabend-green-600`
- Neutral: `text-gray-500`

---

## Responsive Breakpoints

```css
/* Mobile first (default) */
@media (min-width: 640px) { /* sm: tablets portrait */ }
@media (min-width: 768px) { /* md: tablets landscape */ }
@media (min-width: 1024px) { /* lg: laptop */ }
@media (min-width: 1280px) { /* xl: desktop */ }
@media (min-width: 1536px) { /* 2xl: large desktop */ }
```

**Key decisions**:
- Mobile sticky bar: < 768px only
- Hero layout: single column < 1024px, two-column >= 1024px
- Card grids: 1 col mobile, 2 col tablet, 3 col desktop

---

## Accessibility

**WCAG 2.1 AA Compliance**:

1. **Color Contrast**:
   - Text on white: minimum 4.5:1 (body), 3:1 (large text)
   - Orange buttons: use `--feierabend-orange-600` (passes contrast)
   - Never orange text on white (fails contrast)

2. **Tap Targets**:
   - Minimum 44x44px on mobile (especially sticky bar)
   - Spacing between taps: minimum 8px

3. **Focus States**:
   ```css
   :focus-visible {
     outline: 2px solid var(--feierabend-blue-500);
     outline-offset: 2px;
   }
   ```

4. **Keyboard Navigation**:
   - All CTAs must be `<button>` or `<a>` (not div with onClick)
   - Sticky bar must not trap focus

5. **Alt Text**:
   - Images: descriptive alt text
   - Decorative images: `alt=""`
   - Logos: `alt="Feierabend Umzüge Logo"`

---

## Performance Targets

**Core Web Vitals** (mobile):
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**How we achieve this**:
1. Preload hero image: `<link rel="preload" as="image" href="hero.webp">`
2. Font optimization: Inter variable font subset (Latin only)
3. Lazy load below-the-fold images
4. Code splitting: per-route chunks
5. Minimal JS: no heavy animation libraries

---

## Design System Implementation (Tailwind Config)

```js
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        feierabend: {
          blue: {
            50: '#F0F6FB',
            100: '#E8F1F9',
            300: '#5B8BC4',
            500: '#2E5A8F',
            700: '#1E3A5F',
            900: '#0A2540',
          },
          orange: {
            100: '#FFF0EB',
            500: '#FF7F50',
            600: '#FF6B35',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        accent: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03)',
        'hover': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'premium': '0 8px 24px rgba(46, 90, 143, 0.12)',
      },
    },
  },
};
```

---

## Summary: Why This Design System Works

1. **Swiss-appropriate**: Clean, trustworthy, professional (blue palette)
2. **Conversion-optimized**: Orange CTAs stand out, sticky bar maximizes mobile conversions
3. **Modern but timeless**: Won't look dated in 2 years
4. **Performance-first**: Tailwind + minimal animations = fast load
5. **Accessible**: WCAG AA compliant out of the box
6. **Scalable**: Design tokens make it easy to adjust globally

**Next Steps**:
1. Install fonts: Inter + Plus Jakarta Sans (Google Fonts)
2. Update Tailwind config with extended colors
3. Build component library (Button, Card, Badge, etc.)
4. Create hero section mockup
5. Generate/commission branded photography

---

**References**:
- 0123.com visual patterns (multi-estimate, segmentation)
- Stripe.com (modern SaaS UI patterns)
- Swiss International Style (clean, functional)
- Home service best practices (LocalServiceAds.com, Thumbtack)
