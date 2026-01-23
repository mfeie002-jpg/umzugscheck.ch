# 🤖 AI Agent Context - Umzugscheck.ch

**WICHTIG:** Lese dieses File bei JEDER neuen Session, bevor du irgendwas machst!

## 🎯 Business Core

### Was ist das Projekt?
**Umzugscheck.ch** = "Stripe für Umzüge" - AI-first Umzugs-Plattform (Schweiz)
- **95% AI-automatisiert** (Video-Analyse, Matching, Behörden-Bot)
- **10 Revenue Streams** statt nur Lead-Gen
- **Escrow/Fintech-Layer** = Geldfluss-Kontrolle
- **Target**: Exit an Baloise/AXA für 30-50 Mio CHF (2027-28)

### Einzigartig weil:
1. ✅ 10 Revenue Streams kombiniert (Lead + Commission + Escrow + Insurance + SaaS...)
2. ✅ KI-Video-Inventar (niemand sonst hat das)
3. ✅ Fintech-Layer mit Treuhand (höchstes Trust in CH)
4. ✅ 90%+ Contribution Margin (vs. 20-30% bei Konkurrenz)

### Competitor Benchmark:
- **MOVU** (verkauft 2017 für ~20 Mio CHF) - nur 3 Revenue Streams
- **Movinga** (Deutschland, bankrott) - zu schnell skaliert
- **Wir**: MOVU 2.0 mit 10x Features, profitabel first

## 🎨 Design System

### Brand Identity
**"Swiss Premium Quality meets AI Innovation"**

#### Farben:
- **Primary**: #0050A8 (Blau) - Trust, Authority, Swiss
- **Accent**: #E32026 (Rot) - Action, CTA, Urgency
- **Neutral**: #F5F7FA (Light Gray) - Clean, Professional

#### Tonalität:
- 🇨🇭 **Swissness**: Präzision, Qualität, Vertrauen
- 🤖 **Tech-Forward**: Modern, AI-powered, Innovation
- 💼 **Professional**: B2C Premium, nicht zu verspielt
- ⚡ **Conversion-Fokus**: Jede Section = Funnel-Step

### UI Principles
1. **Mobile-First** (70% Traffic aus Mobile)
2. **Trust > Fancy** (Schweizer wollen Vertrauen, keine Spielereien)
3. **Clear CTAs** (Große Buttons, klare Sprache)
4. **Data-Driven** (A/B Testing auf allem)

## 🚀 Technical Stack

### Frontend:
- React + TypeScript
- Vite (Build)
- Tailwind CSS + shadcn/ui
- Framer Motion (Animations)

### Backend:
- Supabase (PostgreSQL)
- Serverless Functions
- AI: OpenAI GPT-4 Vision (Video-Inventar)

### Hosting:
- **100% Swiss** (DSGVO/nDSG konform)
- Vercel Frontend
- Supabase EU-West

## 📊 Success Metrics (Was zählt)

### Phase 1 (Jetzt bis Q2 2025):
- **1'000+ Leads/Monat**
- **Conversion Rate >8%**
- **CAC <50 CHF**
- **Profitabilität bis August 2025**

### Phase 2 (Q3 2025 - Q4 2026):
- Marktführer Schweiz (>5'000 Umzüge/Monat)
- 3-5 Mio CHF ARR
- DACH-Expansion Start

### Exit (2027-28):
- 30-50 Mio CHF Bewertung
- Strategic Buyer: Baloise, AXA, Homegate

## 🎯 User Psychology (Schweizer Umziehende)

### Pain Points:
1. 😰 **Stress**: "Ich habe keine Ahnung, was fair kostet"
2. ⏰ **Zeitdruck**: "Ich habe keine Zeit für 10 Offerten"
3. 🔒 **Sicherheit**: "Was wenn die Firma verschwindet?"
4. 💰 **Preis-Unsicherheit**: "Versteckte Kosten?"

### Lösung (Wie wir sprechen):
- ✅ **Transparenz**: "Fixpreis nach Video-Scan"
- ✅ **Schnelligkeit**: "Offerte in 60 Sekunden"
- ✅ **Sicherheit**: "Geld erst nach Bestätigung freigegeben"
- ✅ **Sparsamkeit**: "Bis zu 40% günstiger durch Vergleich"

## 🛠️ Development Workflow

### Code Style:
- **TypeScript strict mode**
- **Functional Components** (React Hooks)
- **Composition > Inheritance**
- **Performance > Features** (Lazy Loading, Code Splitting)

### File Structure:
```
src/
  components/     # Reusable UI
    ui/          # shadcn components
    homepage/    # Homepage-specific
    trust/       # Trust elements (Badges, Logos)
  pages/         # Route pages
  hooks/         # Custom React hooks
  lib/           # Utilities
  contexts/      # React Context (State)
```

### Naming Conventions:
- Components: `PascalCase.tsx`
- Functions: `camelCase`
- CSS Classes: Tailwind utility-first
- Files: `kebab-case.ts`

## 🎨 Design Patterns (Was immer funktioniert)

### Homepage Hero:
```
[Headline: Benefit-driven]
[Subheadline: 1 Satz, Pain Point + Solution]
[3-Step-Visual: "So einfach geht's"]
[Big CTA: "Jetzt kostenlos Offerte erhalten"]
[Trust Badges: Logos, Stats, Reviews]
```

### Section Structure:
```
1. Hero (Above Fold)
2. Trust Ribbon (Bekannt aus + Stats)
3. How it Works (3 Steps)
4. Video/AI Demo
5. Services Grid
6. Testimonials
7. Pricing/Comparison
8. FAQ
9. Final CTA
```

### CTA-Optimierung:
- **Primär**: "Jetzt kostenlos Offerte erhalten"
- **Sekundär**: "In 60 Sekunden zum Fixpreis"
- **Tertiär**: "Video-Scan starten"

## 🚨 Critical Constraints

### NIEMALS:
- ❌ Amerikanische .com Domains erwähnen
- ❌ Englische UI (nur DE/FR/IT)
- ❌ Unschweizerische Preise (CHF, nicht EUR!)
- ❌ Generische Stock Photos (Swiss Context!)
- ❌ Spielereien vor Performance

### IMMER:
- ✅ Mobile-First denken
- ✅ Trust-Signale prominent
- ✅ Clear Value Prop
- ✅ DSGVO/nDSG konform
- ✅ Swiss Hosting erwähnen

## 💡 Prompt Templates für dich

### Template 1: UI/UX Optimierung
```
Context: [Siehe oben - Business Core]
Component: [z.B. TrustRibbon]
Current State: [Screenshot oder Beschreibung]
Goal: [z.B. "Logos 2x größer, Slider-Animation"]
Constraints: Mobile-first, Brand Colors, Load Time <2s
Success: [z.B. "Visuell dominanter, aber nicht überladen"]
```

### Template 2: Feature Implementation
```
Context: [Business Core]
Feature: [z.B. "Escrow-Badge auf Hero"]
Why: [z.B. "Trust erhöhen, USP vs. MOVU"]
Acceptance Criteria:
- Badge prominent aber nicht aufdringlich
- Mobile: 48x48px minimum (Touch Target)
- Desktop: Animated hover effect
- Copy: "Geld sicher verwahrt bis Auftragsabschluss"
```

### Template 3: A/B Testing Variante
```
Context: [Business Core]
Test: Homepage Hero CTA Wording
Variant A (Control): "Jetzt Offerte erhalten"
Variant B (Test): "In 60 Sekunden zum Fixpreis"
Hypothesis: Zeitangabe erhöht Conversion
Implement: Beide Varianten, Toggle via Props
Track: Click-Through-Rate auf CTA
```

## 🎯 Optimization Checklist

Bei JEDER Änderung prüfen:
- [ ] Mobile zuerst getestet?
- [ ] Trust-Signale sichtbar?
- [ ] CTA klar erkennbar?
- [ ] Load Time ok? (<2s)
- [ ] A/B testbar?
- [ ] Swiss Context stimmt?
- [ ] Brand Colors korrekt?

## 📈 KPIs die du kennen musst

- **CAC** (Customer Acquisition Cost): <50 CHF Ziel
- **LTV** (Lifetime Value): ~553 CHF/Kunde (10 Streams)
- **Conversion Rate**: >8% Ziel
- **Bounce Rate**: <40%
- **Time on Page**: >90 Sekunden (Homepage)

## 🤝 Competitor Intel

### MOVU (Hauptkonkurrent):
- Sold 2017 für ~20 Mio CHF
- Nur Lead-Gen Modell
- Keine KI-Features
- **Unser Vorteil**: 10 Revenue Streams, AI, Escrow

### Movinga (Deutschland):
- Bankrott gegangen
- Zu schnell skaliert
- **Lesson**: Profitabilität first, dann Scale

## 🎓 Learning: Solo-Founder mit AI

**Warum das funktioniert:**
- 95% der Arbeit macht AI (Copilot, ChatGPT, Claude)
- Low-Code/No-Code Tools
- Fokus auf Automatisierung
- Lean Startup: Schnell iterieren

**Deine Rolle als AI:**
Sei nicht nur Code-Generator. Sei:
1. **Product Manager**: Denke an UX, Conversion, Business Logic
2. **Designer**: Swiss Premium Look, nicht Generic SaaS
3. **Engineer**: Clean Code, Performance, Scalability
4. **Growth**: Jede UI-Entscheidung = Conversion-Optimierung

---

**🚀 TL;DR für neue AI Sessions:**

1. **Read this file first!**
2. **Think Swiss Premium, nicht Generic SaaS**
3. **Mobile-First, Trust-First, Conversion-First**
4. **Jede Änderung = Business Impact**
5. **Exit-Ziel: 30-50 Mio CHF (wie MOVU × 3)**

**Bei Unsicherheit fragen:** 
"Passt das zum Exit-Ziel und Swiss Premium Positioning?"
