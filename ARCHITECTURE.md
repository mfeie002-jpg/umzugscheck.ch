# Umzugscheck.ch – Architektur & Philosophie

> **Das Vorzeigemodell der Branche. Der Archetyp, an dem sich alle anderen orientieren.**

---

## 🎯 CORE BUILD PHILOSOPHY

### Unser Anspruch: Best-Case-Scenario Only

| Dimension | Standard |
|-----------|----------|
| **Technisch** | Sauberste, stabilste, zukunftssicherste Lösung |
| **Konzeptionell** | Systeme, nicht Features |
| **UX/UI** | Maximal klar, intuitiv, stressfrei |
| **Conversion** | Jeder Klick hat Zweck |
| **Performance** | Core Web Vitals im grünen Bereich |
| **Skalierbarkeit** | Von Prototyp bis Millionen User |
| **Wartbarkeit** | Selbsterklärend, dokumentiert |
| **Automatisierung** | Alles was automatisiert werden kann |

### Qualitätsanspruch

```
✅ Beste technische Lösung – nicht schnellste, nicht bequemste
✅ Shortcuts nur wenn messbar kein Nachteil
✅ Wenn bessere Lösung existiert → finden und implementieren
```

### Optimierungs-Dogma

- Basierend auf echten Usern, echtem Verhalten, Daten, Feedback
- Kontinuierliche Iteration
- „Gut genug" existiert nicht
- Optimierung endet erst bei objektiver Perfektion

---

## 🏗️ TECHNISCHE ARCHITEKTUR

### Tech Stack

```
Frontend:     React 18 + TypeScript + Vite
Styling:      Tailwind CSS + shadcn/ui
State:        TanStack Query + React Context
Routing:      React Router v6 (Lazy Loading)
Backend:      Supabase (Lovable Cloud)
Analytics:    Custom + Platform Analytics
```

### Verzeichnisstruktur

```
src/
├── assets/              # Statische Assets (Bilder, Fonts)
├── components/
│   ├── ui/              # shadcn/ui Basis-Komponenten
│   ├── common/          # Wiederverwendbare Business-Komponenten
│   ├── calculator/      # Preisrechner-Komponenten
│   ├── funnel/          # Lead-Funnel-Komponenten
│   ├── companies/       # Firmen-Listing-Komponenten
│   ├── admin/           # Admin-Dashboard-Komponenten
│   └── layout/          # Header, Footer, Navigation
├── hooks/               # Custom React Hooks
├── lib/                 # Utilities, Helpers
├── pages/               # Route-Komponenten
├── integrations/        # Supabase, externe APIs
└── types/               # TypeScript Definitionen
```

### Komponenten-Hierarchie

```
Page (Route)
└── Layout (Header/Footer)
    └── Section (Semantisch)
        └── Component (Wiederverwendbar)
            └── UI Element (shadcn/ui)
```

---

## 🎨 DESIGN SYSTEM

### Farbpalette (HSL)

```css
/* Primary - Swiss Blue */
--primary: 217 91% 60%;
--primary-foreground: 0 0% 100%;

/* Secondary */
--secondary: 217 33% 17%;

/* Accent */
--accent: 142 76% 36%;

/* Semantic */
--success: 142 76% 36%;
--warning: 38 92% 50%;
--destructive: 0 84% 60%;
```

### Typografie

```css
/* Headings: Playfair Display */
--font-heading: 'Playfair Display', serif;

/* Body: Inter */
--font-sans: 'Inter', sans-serif;
```

### Spacing Scale

```
4px  → space-1
8px  → space-2
16px → space-4
24px → space-6
32px → space-8
48px → space-12
64px → space-16
```

### Component Variants

Alle Komponenten nutzen `class-variance-authority` für konsistente Variants:

```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default, outline, ghost, hero },
    size: { sm, default, lg, xl }
  }
});
```

---

## 🔄 DATENFLUSS

### Lead-Funnel

```
User Input → Calculator → Estimate Session → Company Matching → Lead Submission
     ↓            ↓              ↓                  ↓                ↓
  Validation   Pricing      DB Storage         Ranking           Email/CRM
```

### State Management

```
Server State (TanStack Query)
├── Companies
├── Leads  
├── Estimates
└── Analytics

Client State (React Context)
├── User Session
├── Form State
└── UI State
```

---

## 📊 CORE FUNNELS

### 1. Hauptfunnel: Umzugsofferten

```
Homepage → Preisrechner → Ergebnis → Firmenauswahl → Kontaktdaten → Bestätigung
```

**KPIs:**
- Conversion Rate pro Step
- Drop-off Points
- Time to Completion
- Lead Quality Score

### 2. Rankings

```
Kategorie-Seite → Firmen-Listing → Firmen-Detail → Offerte anfordern
```

**Sortierung:**
1. Gesponserte (klar markiert)
2. Nach rankingScore/qualityScore

### 3. Regionale Seiten

```
/umzugsfirma-{region} → Lokale Rankings → Lead-Funnel
```

---

## ⚡ PERFORMANCE

### Ziele (Core Web Vitals)

| Metrik | Ziel | Aktuell |
|--------|------|---------|
| LCP | < 2.5s | TBD |
| FID | < 100ms | TBD |
| CLS | < 0.1 | TBD |

### Optimierungen

```typescript
// Lazy Loading für Routes
const HomePage = lazy(() => import('./pages/Index'));

// Image Optimization
<img loading="lazy" decoding="async" />

// Preconnect für externe Ressourcen
<link rel="preconnect" href="https://fonts.googleapis.com" />
```

---

## 🔒 SICHERHEIT

### RLS Policies

Alle Tabellen mit Row Level Security:
- User-spezifische Daten nur für Owner
- Public Data explizit markiert
- Admin-Zugriff über Rollen

### Input Validation

```typescript
// Zod Schemas für alle Formulare
const leadSchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9\s]+$/),
  // ...
});
```

---

## 🧪 QUALITÄTSSICHERUNG

### Code Review Checklist

- [ ] Folgt Architektur-Prinzipien
- [ ] Keine Duplikation
- [ ] TypeScript strict mode
- [ ] Semantic HTML
- [ ] Accessibility (WCAG 2.1)
- [ ] Mobile-first responsive
- [ ] Performance-optimiert
- [ ] Error Handling
- [ ] Loading States

### Naming Conventions

```typescript
// Components: PascalCase
CompanyCard.tsx

// Hooks: camelCase mit use-Prefix
useCompanyData.ts

// Utilities: camelCase
formatPrice.ts

// Types: PascalCase mit Suffix
CompanyData.types.ts
```

---

## 📈 METRIKEN & MONITORING

### Business KPIs

- Lead Volume (täglich/wöchentlich/monatlich)
- Conversion Rate (Funnel → Lead)
- Lead Quality Score
- Provider Response Rate
- Customer Satisfaction

### Technical KPIs

- Page Load Time
- Error Rate
- API Response Time
- Uptime

---

## 🚀 DEPLOYMENT

### Environments

```
Development → Preview → Production
     ↓           ↓          ↓
  localhost   *.lovable.app  umzugscheck.ch
```

### CI/CD

- Automatisches Deployment bei Merge
- Preview für jeden Branch
- Rollback bei Fehlern

---

## 📚 WEITERFÜHRENDE DOKUMENTATION

- [Supabase Schema](./supabase/migrations/)
- [Component Storybook](./docs/components.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)

---

## 🎖️ BENCHMARK

> Wir bauen nicht „besser als die Konkurrenz".
> Wir bauen so, dass Konkurrenz irrelevant wirkt.

**Ziel: Digital Marketing Award Winner 2026**
- Strategie ✓
- UX ✓
- Conversion ✓
- Automatisierung ✓
- Innovation ✓

---

*Letzte Aktualisierung: Dezember 2024*
