# 🇨🇭 Umzugscheck.ch – Komplett-Analyse Prompt für Claude

## Projekt-Kontext

**URL:** https://umzugscheck.ch  
**Branche:** Lead-Gen Marketplace für Umzugsdienstleistungen (Schweiz)  
**Zielgruppe:** Privatpersonen & KMUs die umziehen (450'000 Umzüge/Jahr in CH)  
**Sprache:** Deutsch (de-CH), teilweise IT/BG für interne Tests  
**Wettbewerber:** MOVU.ch, Movinga.ch, MoveAgain.de, lokale Umzugsfirmen  

**Business Model (Unit Economics):**
- 10 Revenue Streams pro Kunde (Move Commission, Escrow, Insurance, Cleaning, Disposal, Telco, Address Change, Furniture Leasing, SaaS, B2B)
- Target: 553 CHF Contribution Margin pro Kunde
- 95% AI-Automatisierung, 5% Human Touch

**Kern-KPIs:**
- Lead-Conversion Rate (Ziel: 9%)
- Cost per Lead (CPL)
- Offerten-Anfragen pro Monat
- Escrow-Nutzungsrate
- Trust Score (Bewertungen, Verifikation)

---

## 📋 Analyse-Auftrag

Führe eine umfassende Analyse von umzugscheck.ch durch. Die Analyse soll folgende Module enthalten:

---

### Modul 1: Quick UX/Conversion Review (15 Min)

**Ziel:** Schnelle Identifikation der Top-Probleme

Analysiere:
1. **Top 3 Conversion-Killer** – Was hindert User am meisten daran, eine Offerte anzufordern?
2. **Quick Wins** – Was kann in <2h gefixt werden für sofortigen Impact?
3. **Mobile-First-Check** – Funktioniert der Flow auf Mobile einwandfrei?
4. **CTA-Klarheit** – Ist "Offerten erhalten" überall prominent und eindeutig?

**Output-Format:**
```
| Problem | Schwere (1-5) | Aufwand | Quick Fix möglich? |
|---------|---------------|---------|-------------------|
| ...     | ...           | ...     | Ja/Nein           |
```

---

### Modul 2: Deep Funnel Audit

**Kern-Funnels zu analysieren:**
1. Homepage → Offerten-Flow → Lead-Submission
2. Preisrechner → Ergebnis → Offerten-Anfrage
3. Firmenverzeichnis → Firmenprofil → Direktkontakt
4. SEO-Landingpages (Stadt/Service) → Conversion

**Pro Funnel bewerten:**
- Drop-off-Risiken pro Step
- Cognitive Load (zu viele Felder? Unklare Labels?)
- Trust Signals (Badges, Reviews, Garantien)
- Progress Indication
- Mobile UX (Touch Targets, Keyboard Modes)

**Schweiz-spezifisch prüfen:**
- [ ] ASTAG-Zertifizierung erwähnt?
- [ ] "Swissness" kommuniziert? (Schweizer Server, lokale Firmen)
- [ ] Preise in CHF mit MwSt-Hinweis?
- [ ] Regionale Unterschiede berücksichtigt? (Kanton-spezifische Inhalte)

---

### Modul 3: SEO Deep Dive (Schweizer Markt)

**On-Page SEO Scorecard:**
| Kriterium | Score (1-10) | Notizen |
|-----------|--------------|---------|
| Title Tags (<60 chars, Keyword vorne) | | |
| Meta Descriptions (<160 chars, CTA) | | |
| H1-Struktur (1x pro Seite, Keyword) | | |
| Content-Qualität (E-E-A-T) | | |
| Interne Verlinkung (Hub-Spoke) | | |
| Schema.org Markup | | |

**Technical SEO:**
- Core Web Vitals (LCP, FID, CLS)
- Mobile Usability
- Crawlability (robots.txt, sitemap.xml)
- Canonical Tags
- Hreflang (falls mehrsprachig)

**Local SEO (kritisch für CH):**
- Google Business Profile Integration
- NAP-Konsistenz (Name, Address, Phone)
- Lokale Keywords (Stadt + Service)
- Bewertungs-Integration

**Keyword-Strategie prüfen:**
- Hauptkeywords: "Umzugsfirma [Stadt]", "Umzugsofferte", "Umzug Kosten Schweiz"
- Long-Tail: "günstige Umzugsfirma Zürich Bewertungen"
- Transactional vs. Informational Balance

---

### Modul 4: Trust & Credibility Audit

**Trust Signals Checklist:**
- [ ] SSL/HTTPS aktiv
- [ ] Impressum vollständig (Schweizer Recht)
- [ ] Datenschutzerklärung (DSG-konform, nicht nur DSGVO!)
- [ ] AGB klar und auffindbar
- [ ] Kontaktmöglichkeiten sichtbar (Telefon, E-Mail, Chat)
- [ ] Firmenadresse in CH

**Social Proof:**
- [ ] Kundenbewertungen sichtbar (Anzahl, Durchschnitt)
- [ ] Verifizierte Firmen gekennzeichnet
- [ ] Medien-Logos/PR-Erwähnungen
- [ ] Anzahl erfolgreicher Umzüge/Leads

**Schweiz-Trust-Faktoren:**
- [ ] "Schweizer Unternehmen" kommuniziert
- [ ] Schweizer Zahlungsmethoden (TWINT, PostFinance)
- [ ] Lokale Telefonnummer (+41)
- [ ] ASTAG oder andere Branchenzertifizierungen

---

### Modul 5: Archetype-Fit-Analyse

**4 Kundentypen und ihre Bedürfnisse:**

| Archetyp | Kernbedürfnis | Must-Have Elements |
|----------|---------------|-------------------|
| 🛡️ Security Seeker | Sicherheit, Garantien | Escrow, Versicherung, verifizierte Firmen |
| ⚡ Efficiency Expert | Schnell & einfach | 2-Step-Flow, Preisvorschau, sofortige Offerten |
| 💰 Value Hunter | Bester Preis | Preisvergleich, "günstigste" Filter, Rabatte |
| 😰 Overwhelmed Mover | Komplette Entlastung | Full-Service, Rundum-Sorglos, persönliche Beratung |

**Pro Archetyp bewerten (1-10):**
- Wird der Archetyp auf der Homepage angesprochen?
- Gibt es einen passenden Einstiegspunkt/Flow?
- Werden die Kernbedürfnisse erfüllt?

---

### Modul 6: Performance & Technical Review

**Core Web Vitals Targets:**
- LCP: <2.5s
- FID: <100ms
- CLS: <0.1

**Checks:**
- [ ] Lazy Loading für Bilder
- [ ] Code Splitting aktiv
- [ ] Service Worker/PWA
- [ ] Caching-Strategie
- [ ] Bundle-Größe optimiert
- [ ] Keine Render-Blocking Resources

**Mobile Performance:**
- First Contentful Paint
- Time to Interactive
- Touch Target Sizes (min 48x48px)

---

### Modul 7: Accessibility (A11y) Audit

**WCAG 2.1 AA Compliance:**
- [ ] Alle Bilder haben Alt-Text
- [ ] Farbkontrast ausreichend (4.5:1)
- [ ] Keyboard-Navigation funktioniert
- [ ] ARIA-Labels korrekt
- [ ] Focus States sichtbar
- [ ] Formulare barrierefrei (Labels, Errors)

**Screen Reader Test:**
- Logische Lesereihenfolge?
- Wichtige Informationen nicht nur visuell?

---

### Modul 8: Wettbewerbsvergleich

**Vergleich mit:**
1. MOVU.ch (Schweizer Marktführer)
2. Movinga.ch (Internationaler Player)
3. Lokale Anbieter (z.B. Umzug24.ch)

**Vergleichsmatrix:**
| Feature | umzugscheck.ch | MOVU | Movinga |
|---------|----------------|------|---------|
| Preisrechner | | | |
| Video-Inventar | | | |
| Escrow/Treuhand | | | |
| Firmenvergleich | | | |
| Mobile App | | | |
| Trust Signals | | | |

---

## 📊 Output-Format

### Executive Summary (max. 500 Wörter)
- 3 kritischste Issues
- 3 größte Stärken
- ROI-Potenzial bei Fixes

### Prioritätenmatrix
```
| Issue | Impact (1-5) | Effort (1-5) | Priorität | Timeline |
|-------|--------------|--------------|-----------|----------|
```

### 90-Tage-Roadmap
**Woche 1-2 (Quick Wins):**
- ...

**Woche 3-6 (Medium Effort):**
- ...

**Woche 7-12 (Strategic):**
- ...

### Detaillierte Findings (pro Modul)
- Screenshots/Beispiele wo möglich
- Konkrete Code-/Design-Empfehlungen
- Benchmarks/Best Practices als Referenz

---

## 🎯 Zusätzliche Anweisungen

1. **Sprache:** Deutsch (de-CH), technische Begriffe auf Englisch OK
2. **Ton:** Direkt, actionable, keine Floskeln
3. **Priorisierung:** Immer nach Impact vs. Effort sortieren
4. **Schweiz-Fokus:** Alle Empfehlungen müssen für den CH-Markt relevant sein
5. **Evidence-Based:** Keine Vermutungen, nur belegbare Findings
6. **Benchmarks:** Vergleiche mit Schweizer/DACH-Standards, nicht US

---

## 📎 Anhang: Bekannte Projekt-Patterns

**Bereits implementiert (nicht nochmal empfehlen):**
- React + Vite + TypeScript + Tailwind
- Supabase Backend (Lovable Cloud)
- PWA mit Service Worker
- SEO-Komponenten (Helmet, Schema.org)
- A/B-Testing Framework
- Flow-Varianten-System (50+ Funnel-Varianten)
- Escrow/Treuhand-System

**Design System:**
- Semantic Color Tokens (--primary, --secondary, etc.)
- Mobile-First Approach
- Sticky CTAs auf Mobile
- Trust Badges oberhalb des Folds

---

*Generiert von Lovable AI für umzugscheck.ch Analyse*
