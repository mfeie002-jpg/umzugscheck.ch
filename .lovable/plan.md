

# Umzugscheck.ch -- Komplette Bestandesaufnahme & Project Map (PDF)

## Ziel

Erstelle ein umfassendes Project-Management-PDF (~20-25 Seiten) analog zum Feierabend-Template, mit vollstaendigem Status aller Module, Flows, Bugs, TODOs und priorisierter Roadmap. Farbcodierung: Gruen (Erledigt), Gelb (Angefangen), Rot (Nicht angefangen), Grau (Nicht auf dem Schirm).

**Output:** `/mnt/documents/Umzugscheck_Project_Map.pdf`

---

## Dokumentstruktur

### 1. Plattform-Ueberblick (1 Seite)
- Tech Stack (React 18, Vite, Tailwind, shadcn/ui, TanStack Query, Lovable Cloud)
- Kennzahlen: **200+ Seiten/Routes**, **90+ Edge Functions**, **112 DB-Tabellen**, **577+ Komponenten**, **1051 Zeilen App.tsx**
- Architektur-Diagramm (Frontend → Lovable Cloud → AI Agents)

### 2. Modul-Inventar mit Status (6-7 Seiten)

#### A. Public Website
| Modul | Status | Details |
|-------|--------|---------|
| Homepage A/B System (IndexPremium) | Erledigt | 7+ Homepage-Varianten, UnifiedABToggle, NavigationV16 |
| Navigation/Header (DynamicNavigation) | Erledigt | NavigationV16/V17, MobileBottomNav, ScrollProgressBar |
| Footer | Erledigt | |
| 18 Services V2 Seiten | Erledigt | /services/reinigung bis /services/umzugshelfer |
| 10 Dienstleistungen Seiten | Erledigt | /dienstleistungen/privatumzug etc. |
| City/Region Pages (26 Kantone + Staedte) | Erledigt | RegionArchetypPage, SlugResolverPage, CantonArchetypePage, CityArchetypePage |
| SEO Pillar Pages | Erledigt | /umzugsfirmen-schweiz, /beste-umzugsfirma, /guenstige-umzugsfirma |
| Blog/Ratgeber | Erledigt | 8 Ratgeber-Seiten + Blog-System |
| 7 Rechner | Erledigt | Reinigung, Entsorgung, Lager, Pack, Montage, Konfigurator, Video |
| Firmenverzeichnis | Erledigt | /umzugsfirmen, /firma/:slug, CompanyProfile |
| Swiss Admin Tools | Erledigt | eUmzug, Adressaenderung, Ummeldung, Lebensdauer-Rechner, Pendel-Rechner, Halteverbot-Planer, Entsorgungsplaner |
| Legal/Info Pages | Erledigt | AGB, Datenschutz, Impressum, FAQ, Kontakt, Ueber Uns, So Funktionierts |
| Vision/Investor Pages | Erledigt | /vision, /investoren, /invisible-1 bis /invisible-4 |
| Trust Test Pages | Erledigt | 4 Trust Landing Variants + Comparison Hub |
| Shop (Umzugskartons) | Angefangen | /shop, /umzugskartons - Prototyp |
| Customer Portal (MyMoves) | Angefangen | /mein-bereich - Shell ohne echte Funktionalitaet |
| Multi-Language (FR/IT) | Angefangen | Translations-Files vorhanden, nicht integriert |

#### B. Offerten-Funnels (30+ Varianten)
| Modul | Status | Details |
|-------|--------|---------|
| Umzugsofferten V1-V1g (7 Varianten) | Erledigt | Dedizierte Seiten |
| Umzugsofferten V2-V9 (Dynamic) | Erledigt | 40+ Sub-Varianten via UmzugsoffertenDynamic |
| ChatGPT Flows (1-3) | Erledigt | /chatgpt-flow-1, -2, -3 |
| Chatbot V2e | Erledigt | /umzugsofferten-v2e - Chat-Interface |
| Swiss Premium Flows | Erledigt | Lightning, Premium Choice, Concierge Hybrid |
| Gemini Top-Flows | Erledigt | V9 Zero Friction, Ultimate Best36, Golden V10, V10 Smart Router |
| Champion Flows (Paid) | Erledigt | QuickFlow, TrustFirst |
| Canonical Flow | Erledigt | /umzugsofferten-canonical |
| Flow Tester/Command Center | Erledigt | /flow-tester, /flow-command-center |
| Localized Funnels | Erledigt | /umzugsofferten/:city |

#### C. Provider/B2B System
| Modul | Status | Details |
|-------|--------|---------|
| Provider Signup/Login | Erledigt | /anbieter/registrieren, /anbieter/login |
| Provider Dashboard | Angefangen | /anbieter/dashboard - Grundstruktur |
| Provider Profile | Angefangen | /anbieter/profil |
| Provider Pricing | Erledigt | /anbieter/preise, /provider/pricing |
| Lead Marketplace | Angefangen | /anbieter/marktplatz - UI vorhanden |
| Provider Portal | Angefangen | /anbieter/portal |
| Mobile Provider App | Angefangen | /anbieter/mobile - Shell |
| Fuer Firmen Landing | Erledigt | /fuer-firmen |
| Provider FAQ | Erledigt | /provider/faq |

#### D. Admin Dashboard (55+ Seiten)
| Modul | Status | Details |
|-------|--------|---------|
| Dashboard | Erledigt | |
| Lead Center | Erledigt | |
| Companies Management | Erledigt | |
| Rankings Manager | Erledigt | |
| Analytics (Multiple) | Erledigt | Funnel, Conversion, Pricing, ML Analytics |
| A/B Testing Complete | Erledigt | |
| Hero A/B Dashboard | Erledigt | |
| Paid Media | Erledigt | |
| Operations Center | Erledigt | |
| Email Automation | Angefangen | Manager UI + Edge Function |
| Email Templates | Angefangen | |
| Task Queue / AI Command | Erledigt | OpenClaw integration |
| Video Analyses | Erledigt | |
| Code Export / AI Export | Erledigt | |
| Billing | Angefangen | UI vorhanden, kein Stripe |
| Settings | Bug | Leere Seite |
| Mock Data Dashboard | Erledigt | |
| Documentation Browser | Erledigt | |
| Admin Handbook | Erledigt | |

#### E. Internal Dashboards (9 Seiten)
| Alle 9 | Erledigt | PaidMediaControl, LaunchRoadmap, LeadRouting, PartnerNetwork, LeadDistribution, FinanceDashboard, CommandCenter, ABComparisonLab, TestReport |

#### F. Backend / Edge Functions (90+)
| Kategorie | Status | Details |
|-----------|--------|---------|
| AI Functions (15+) | Erledigt | ai-task-webhook, ai-assistant, ai-flow-generator, analyze-video, etc. |
| Lead Functions (8+) | Erledigt | create-funnel-lead, send-lead-notification, lead-auto-reply, etc. |
| Provider Functions (5+) | Erledigt | provider-signup, provider-login, provider-profile, etc. |
| Email Functions (10+) | Angefangen | send-email, process-email-queue, etc. - RESEND_API_KEY vorhanden |
| Analytics/Screenshot (8+) | Erledigt | lighthouse, capture-screenshot, etc. |
| Stripe Functions (3) | Angefangen | create-checkout, stripe-webhook, purchase-lead - **STRIPE_SECRET_KEY FEHLT** |
| Ranking Functions (3) | Erledigt | process-scheduled-rankings, calculate-ranking-optimization |
| Geo/Validation (3) | Erledigt | geo, validate-postal-code, sbb-journey |

#### G. AI Agent System (OpenClaw/Codex/Copilot)
| Modul | Status | Details |
|-------|--------|---------|
| ai-task-webhook (create/next/complete/pending/stats) | Erledigt | openclaw als Agent freigeschaltet |
| Task Queue Dashboard | Erledigt | Admin UI |
| generate-ai-tasks | Erledigt | |
| 5/2110 Gemeinde-JSONs | Angefangen | Zuerich, Bern, Basel, Genf, Lausanne erstellt |

### 3. Bekannte Bugs & Issues (2 Seiten)

| # | Bug/Issue | Severity | Ort |
|---|-----------|----------|-----|
| 1 | STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET fehlen | Critical | Edge Functions non-functional |
| 2 | /admin/settings zeigt leere Seite | Medium | Admin Settings Route |
| 3 | Gemeinde-Seiten: Kein Frontend-Renderer fuer JSON-Files | High | 5 JSONs ohne Route |
| 4 | Console Warning: UNSAFE_componentWillMount | Low | react-helmet SideEffect |
| 5 | Provider Subscription = Placeholder (`stripe_sub_${Date.now()}`) | High | provider-subscription EF |
| 6 | purchase-lead = Placeholder (`pi_${Date.now()}`) | High | purchase-lead EF |
| 7 | notify-price-drop: "Would send email" (TODO) | Medium | Edge Function |
| 8 | notify-expiring-leads: TODO Send email | Medium | Edge Function |
| 9 | sync-paid-media: TODO Google Ads API | Medium | Edge Function |
| 10 | escrow-webhook: TODO Send notification emails | Medium | Edge Function |
| 11 | 30+ Funnel-Varianten nie E2E getestet | Medium | Unklar ob alle funktional |
| 12 | App.tsx = 1051 Zeilen (technische Schuld) | Low | Sollte aufgeteilt werden |
| 13 | 577+ Komponenten - viele ungenutzt | Low | Dead Code |

### 4. Offene TODOs aus Code (1 Seite)
- `purchase-lead`: "TODO: Process payment with Stripe here"
- `provider-subscription`: "TODO: Create Stripe subscription here"
- `notify-price-drop`: "TODO: Integrate with email service"
- `notify-expiring-leads`: "TODO: Send email notifications to assigned providers"
- `escrow-webhook`: "TODO: Send notification emails to both parties and admin"
- `sync-paid-media`: "TODO: Implement actual Google Ads API call"

### 5. Flow-Pruefung: Funktionieren die Funnels? (3 Seiten)
20 Core Funnels + 30+ Varianten-Status basierend auf Code-Analyse

### 6. Priorisierte Roadmap (3 Seiten)
**P0**: Stripe, Gemeinde-Renderer, Settings Fix
**P1**: Provider Portal produktiv, Email Integration, E2E Tests
**P2**: Scraping Pipeline, Relo-OS Core, Customer Portal
**P3**: AI Video Analyse → Guaranteed Quote, Multi-Language, Mobile App

### 7. KI-Delegierbar vs. Manuell (2 Seiten)
Matrix aller Aufgaben

### 8. Technische Schulden (1 Seite)
- 1051 Zeilen App.tsx
- 577+ Komponenten (viele ungenutzt)
- 40+ Flow-Varianten (Konsolidierung noetig)
- Keine automatisierten Tests

---

## Technische Umsetzung

1. Python-Script mit `reportlab` erstellen
2. Alle Sektionen als strukturierte Tabellen + Text
3. Farbcodierung per Zellen-Hintergrund
4. QA via `pdftoppm` Konvertierung und Inspektion jeder Seite
5. Output: `/mnt/documents/Umzugscheck_Project_Map.pdf`

### Fakten (aus Codebase-Analyse)
- **Routes**: 200+ (gezaehlt aus App.tsx)
- **Edge Functions**: 90+ Verzeichnisse in `supabase/functions/`
- **DB-Tabellen**: 112 (aus `information_schema`)
- **Komponenten**: 577+ Dateien in `src/components/`
- **Admin-Seiten**: 55 Dateien in `src/pages/admin/`
- **Services V2**: 18 Seiten
- **Secrets vorhanden**: FIRECRAWL_API_KEY, GITHUB_TOKEN, JWT_SECRET, LOVABLE_API_KEY, OPENAI_API_KEY, RESEND_API_KEY, SCREENSHOTMACHINE keys, SWISS_POST_API_KEY
- **Secrets FEHLEND**: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
- **Gemeinde-JSONs**: 5 von 2110

