# Umzugscheck.ch – Technische Architektur

> **Das Vorzeigemodell der Branche. Der Archetyp, an dem sich alle anderen orientieren.**

---

## 🏗️ TECH STACK

```
Frontend:     React 18 + TypeScript + Vite
Styling:      Tailwind CSS + shadcn/ui
State:        TanStack Query + React Context
Routing:      React Router v6 (Lazy Loading)
Backend:      Supabase (Lovable Cloud)
Edge Functions: 80+ Serverless Functions
Analytics:    Custom + Platform Analytics
```

---

## 📁 VERZEICHNISSTRUKTUR

```
src/
├── assets/              # Statische Assets (Bilder, Fonts)
├── components/
│   ├── ui/              # shadcn/ui Basis-Komponenten
│   ├── common/          # Wiederverwendbare Business-Komponenten
│   ├── calculator/      # Preisrechner-Komponenten
│   ├── funnel/          # Lead-Funnel-Komponenten
│   ├── companies/       # Firmen-Listing-Komponenten
│   ├── navigation-v17/  # NavigationV17 Komponenten
│   ├── admin/           # Admin-Dashboard-Komponenten
│   └── layout/          # Header, Footer, Navigation
├── contexts/            # React Context Provider
├── hooks/               # Custom React Hooks
├── lib/                 # Utilities, Helpers
│   ├── cherries-chaff/  # Lead-Routing Engine
│   └── navigation-variants.ts  # 17 Nav-Varianten
├── pages/               # Route-Komponenten
├── data/                # Statische Daten (Regionen, etc.)
├── integrations/        # Supabase, externe APIs
└── types/               # TypeScript Definitionen

supabase/
├── functions/           # 80+ Edge Functions
├── migrations/          # Database Migrations
└── config.toml          # Supabase Konfiguration

docs/
├── AI_BRIEFING.md       # Vollständiges Projekt-Briefing
├── ARCHITECTURE.md      # Diese Datei
├── REGIONS_DATABASE.md  # 26 Kantone mit Preisen
├── PROMPT_LIBRARY.md    # 10 Premium ChatGPT Prompts
└── FLOW_VARIANTS.md     # 17 A/B-Test Varianten
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

### Komponenten-Hierarchie

```
Page (Route)
└── Layout (Header/Footer)
    └── Section (Semantisch)
        └── Component (Wiederverwendbar)
            └── UI Element (shadcn/ui)
```

---

## ⚡ EDGE FUNCTIONS (80+)

### AI & Analyse
```
ai-assistant              - AI-Chat-Assistent
ai-batch-fix              - Batch-Korrekturen
ai-extract-project-info   - Projekt-Info extrahieren
ai-fix-flow               - Flow automatisch fixen
ai-flow-generator         - Flow generieren
ai-generate-context       - Kontext generieren
ai-site-analysis          - Website analysieren
ai-task-webhook           - Task-Webhook
ai-website-analyze        - Website Deep-Analyse
analyze-feedback          - Feedback analysieren
analyze-landing-page      - Landing Page analysieren
analyze-moving-photos     - Umzugsfotos analysieren
analyze-moving-video      - Video analysieren
analyze-video             - Video-Analyse
deep-flow-analysis        - Tiefenanalyse Flows
```

### Lead & Funnel
```
create-bundled-estimate   - Gebündelte Schätzung
create-estimate-session   - Schätzungssession erstellen
create-funnel-lead        - Lead im Funnel erstellen
get-estimate-session      - Session abrufen
purchase-lead             - Lead kaufen
provider-leads            - Leads für Anbieter
update-lead-conversion    - Conversion aktualisieren
```

### Provider & Auth
```
admin-login               - Admin Login
admin-reset-password      - Passwort zurücksetzen
admin-verify-provider     - Anbieter verifizieren
provider-login            - Anbieter Login
provider-profile          - Profil verwalten
provider-signup           - Registrierung
provider-subscription     - Abo verwalten
```

### Notifications
```
availability-notification - Verfügbarkeits-Benachrichtigung
notify-expiring-leads     - Ablaufende Leads
notify-price-drop         - Preissenkung
send-email                - E-Mail senden
send-email-digest         - E-Mail Digest
send-lead-notification    - Lead-Benachrichtigung
send-new-lead-notification- Neue Lead Benachrichtigung
send-performance-digest   - Performance Report
send-price-alert          - Preisalarm
send-ranking-alert        - Ranking-Alert
send-realtime-notification- Echtzeit-Benachrichtigung
send-review-notification  - Review-Benachrichtigung
send-review-reminder      - Review-Erinnerung
send-review-request       - Review anfordern
send-satisfaction-survey  - Zufriedenheitsumfrage
send-sms-notification     - SMS senden
```

### Screenshots & Capture
```
bulk-screenshot-capture         - Bulk Screenshots
capture-flow-screenshots-background - Flow Screenshots
capture-landing-page            - Landing Page erfassen
capture-rendered-html           - HTML rendern
capture-screenshot              - Screenshot
scheduled-screenshots           - Geplante Screenshots
```

### Analyse & Reports
```
auto-analyze-flow         - Auto-Analyse
auto-fix-issue            - Auto-Fix
calculate-ranking-optimization - Ranking optimieren
generate-report           - Report generieren
generate-ultimate-flow    - Ultimate Flow generieren
lighthouse                - Lighthouse Audit
process-analysis-queue    - Analyse-Queue
trigger-flow-analysis     - Flow-Analyse triggern
```

### Payments & Billing
```
create-checkout           - Checkout erstellen
escrow-webhook            - Escrow Webhook
place-bid                 - Gebot platzieren
process-bid-closures      - Gebote abschliessen
stripe-webhook            - Stripe Webhook
```

### Utilities
```
behoerden-api             - Behörden-API
contact-form              - Kontaktformular
export-ultimate-flows-background - Export Flows
extract-page-data         - Seiten-Daten extrahieren
fetch-html                - HTML abrufen
firecrawl-map             - Sitemap crawlen
generate-ai-tasks         - AI Tasks generieren
generate-hero-image       - Hero-Bild generieren
get-source-files          - Source Files holen
health                    - Health Check
moving-assistant          - Umzugs-Assistent
process-scheduled-rankings- Rankings verarbeiten
schedule-review-requests  - Reviews planen
sync-paid-media           - Paid Media sync
validate-postal-code      - PLZ validieren
background-export         - Background Export
```

---

## 🔄 STATE MANAGEMENT

```typescript
// Server State (TanStack Query)
const { data: companies } = useQuery({
  queryKey: ['companies', region],
  queryFn: () => fetchCompanies(region)
});

// Client State (React Context)
const { variant, setVariant } = useNavigationAB();
```

### State-Hierarchie

```
Server State (TanStack Query)
├── Companies
├── Leads  
├── Estimates
├── Flow Analytics
└── Provider Data

Client State (React Context)
├── NavigationABContext    → A/B Testing
├── User Session           → Auth State
├── Form State             → Funnel Data
└── UI State               → Modals, Toasts
```

---

## 🛣️ ROUTING

### Hauptrouten

```typescript
// Hauptfunnels
/                         → Homepage
/umzugsofferten           → Lead-Funnel (Golden Flow)
/preisrechner             → Preisrechner

// Rankings
/umzugsfirmen             → Firmenverzeichnis
/umzugsfirmen/:kanton     → Regionale Rankings
/beste-umzugsfirma        → Top Rankings
/guenstige-umzugsfirma    → Budget Rankings

// Services
/services/reinigung       → Endreinigung
/services/entsorgung      → Entsorgung/Räumung
/services/lagerung        → Einlagerung
/services/firmenumzug     → B2B Umzüge

// Ratgeber
/ratgeber                 → Übersicht
/umzugskosten-schweiz     → Kosten Guide
/checkliste               → Umzugs-Checkliste

// Admin
/admin                    → Dashboard
/admin/ai-command-center  → AI Prompt Center
/admin/task-queue         → AI Autopilot Hub
/admin/flow-analysis      → Conversion Analyse
```

### Lazy Loading

```typescript
// Route-basiertes Code-Splitting
const HomePage = lazy(() => import('./pages/Index'));
const OffertenPage = lazy(() => import('./pages/Umzugsofferten'));
const AdminDashboard = lazy(() => import('./pages/Admin'));
```

---

## 🔐 SICHERHEIT

### RLS Policies

```sql
-- Beispiel: Leads nur für Owner sichtbar
CREATE POLICY "Users can view own leads"
ON leads FOR SELECT
USING (auth.uid() = user_id);

-- Öffentliche Daten explizit markiert
CREATE POLICY "Public company profiles"
ON service_providers FOR SELECT
USING (is_public = true);
```

### Input Validation

```typescript
// Zod Schemas für alle Formulare
const leadSchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9\s]+$/),
  fromCity: z.string().min(2),
  toCity: z.string().min(2),
  rooms: z.number().min(1).max(10),
});
```

---

## 📊 PERFORMANCE

### Ziele (Core Web Vitals)

| Metrik | Ziel | Bedeutung |
|--------|------|-----------|
| LCP | < 2.5s | Largest Contentful Paint |
| FID | < 100ms | First Input Delay |
| CLS | < 0.1 | Cumulative Layout Shift |

### Optimierungen

```typescript
// Lazy Loading für Routes
const HomePage = lazy(() => import('./pages/Index'));

// Image Optimization
<img loading="lazy" decoding="async" />

// Preconnect für externe Ressourcen
<link rel="preconnect" href="https://fonts.googleapis.com" />

// Code Splitting per Route
const AdminPage = lazy(() => import('./pages/Admin'));
```

---

## 📁 KEY FILES

| Pfad | Beschreibung |
|------|--------------|
| `src/data/regions-database.ts` | 26 Kantone mit Preisen & SEO |
| `src/lib/cherries-chaff/` | Lead Routing Engine |
| `src/lib/navigation-variants.ts` | 17 Navigation-Varianten |
| `src/lib/chatgpt-prompt-enhancements.ts` | 10 Premium Prompts |
| `src/contexts/NavigationABContext.tsx` | A/B Testing Context |
| `src/lib/unified-ab-config.ts` | A/B Config Management |
| `src/hooks/useNavigationVariant.ts` | Navigation Hook |
| `ARCHITECTURE.md` | Diese Datei |

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
- Edge Functions automatisch deployed

---

*Letzte Aktualisierung: Januar 2025*
