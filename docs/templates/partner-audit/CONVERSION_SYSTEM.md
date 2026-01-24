# Conversion System Blueprint

> UX-Architektur & KPI-Targets für Partner-Websites und Umzugscheck-Profile

---

## Above-the-Fold Architektur

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER: Logo | Navigation | ☎ 044 XXX XX XX | [Offerte] CTA    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────┐  ┌────────────────┐  │
│  │ HERO HEADLINE                         │  │ QUICK QUOTE    │  │
│  │ "Ihr stressfreier Umzug in Zürich"   │  │ FORM           │  │
│  │                                       │  │                │  │
│  │ [Trust Badges: ★4.8 | 200+ Umzüge]   │  │ 📍 Von:        │  │
│  │                                       │  │ 📍 Nach:       │  │
│  │ ✓ Abgabegarantie                     │  │ 🏠 Zimmer:     │  │
│  │ ✓ Versichert bis CHF 2 Mio.          │  │                │  │
│  │ ✓ Festpreis-Garantie                 │  │ [OFFERTE →]    │  │
│  └───────────────────────────────────────┘  └────────────────┘  │
│                                                                 │
│  [TRUST ROW: ASTAG ✓ | Versichert ✓ | 10+ Jahre ✓ | 4.8★]     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Quick Quote Form Spezifikation

### Minimal Version (3 Felder)

```typescript
interface QuickQuoteForm {
  fromLocation: string;    // PLZ oder Ort
  toLocation: string;      // PLZ oder Ort  
  apartmentSize: string;   // "1-2 Zimmer" | "3-4 Zimmer" | "5+ Zimmer"
}
```

### Erweiterte Version (Lead-Qualifizierung)

```typescript
interface ExtendedQuoteForm extends QuickQuoteForm {
  moveDate?: string;       // Kalender-Picker
  name?: string;
  phone?: string;
  email: string;           // Pflicht für Nachverfolgung
}
```

### Conversion-Optimierung

| Element | Best Practice | Begründung |
|---------|---------------|------------|
| Feldanzahl | Max. 3-4 | Jedes Extra-Feld = -5% Conversion |
| CTA Text | "Kostenlose Offerte →" | Action + Benefit + Urgency |
| CTA Farbe | Primärfarbe (Kontrast) | Muss sofort auffallen |
| Trust unter CTA | "Unverbindlich • In 60 Sek. erledigt" | Friction reduzieren |

---

## Trust Block Placement

### Regel: Trust Elemente an 4 kritischen Stellen

```
1. HEADER → Badge/Siegel (klein, aber sichtbar)
2. HERO → Unter Headline (Sterne, Anzahl Umzüge)
3. NACH FORM → Trust-Row (Versicherung, Garantien)
4. FOOTER → Vollständige Credentials
```

### Trust Element Hierarchie

| Priorität | Element | Beispiel | Wo platzieren |
|-----------|---------|----------|---------------|
| 1 | Rating + Count | ★4.8 (127 Bewertungen) | Hero, Header |
| 2 | Versicherung | "Versichert bis CHF 2 Mio." | Trust Row |
| 3 | Garantien | "Abgabegarantie inklusive" | Hero Bullets |
| 4 | Verbände | ASTAG Logo | Trust Row, Footer |
| 5 | Erfahrung | "Seit 2012 • 2'500+ Umzüge" | Trust Row |

---

## KPI Targets

### 7-Tage Ziele (Quick Wins)

| Metrik | Baseline | Ziel | Messung |
|--------|----------|------|---------|
| Form Completion Rate | - | +20% | Analytics |
| Phone Click-Through | - | +15% | Call Tracking |
| Bounce Rate (Mobile) | - | -10% | Analytics |

### 30-Tage Ziele (Optimierung)

| Metrik | Baseline | Ziel | Messung |
|--------|----------|------|---------|
| Lead-to-Quote Rate | X% | +25% | CRM |
| Cost per Lead (CPL) | CHF X | -20% | Ad Platform |
| Trust Score | X/100 | 60+ | Platform |
| Google Reviews | X | +10 | Google My Business |

### 90-Tage Ziele (Transformation)

| Metrik | Baseline | Ziel | Messung |
|--------|----------|------|---------|
| Conversion Rate | X% | 2x | End-to-End |
| Revenue per Lead | CHF X | +50% | CRM |
| Badge Level | [Basis] | [Premium] | Platform |
| Market Position | #X in Region | Top 3 | Platform Ranking |

---

## Mobile-First Checkliste

### Critical (Muss erfüllt sein)

- [ ] Touch Targets ≥ 44px Höhe
- [ ] Form vollständig sichtbar ohne Scrollen
- [ ] Telefonnummer klickbar (tel: Link)
- [ ] Ladezeit < 3 Sekunden
- [ ] Keine horizontale Scroll-Notwendigkeit

### Wichtig

- [ ] Sticky CTA Button am unteren Bildschirmrand
- [ ] Accordion für FAQs (nicht alles offen)
- [ ] Optimierte Bilder (WebP, lazy loading)
- [ ] Font Size ≥ 16px (kein Zoomen nötig)

### Nice-to-Have

- [ ] Bottom Sheet für Formular
- [ ] Haptic Feedback bei CTA
- [ ] Progressive Form (ein Feld nach dem anderen)

---

## A/B Test Ideen

### High-Impact Tests

| Test | Hypothese | Erwarteter Lift |
|------|-----------|-----------------|
| CTA "Kostenlos" vs. "Jetzt" | "Kostenlos" reduziert Friction | +10-15% |
| 3-Feld vs. 5-Feld Form | Weniger Felder = mehr Completions | +15-25% |
| Rating prominent vs. dezent | Prominentes Rating erhöht Trust | +5-10% |
| Hero Image vs. Video | Video erhöht Engagement | +/- variabel |

### Micro-Tests

| Test | Was ändern | Messung |
|------|------------|---------|
| Button Farbe | Rot vs. Grün vs. Blau | CTR |
| Button Text | "Senden" vs. "Offerte erhalten" | CTR |
| Form Position | Rechts vs. Zentriert | Completion |
| Trust Badges | Mit vs. Ohne Logos | Conversion |

---

## Technische Integration

### Tracking Setup

```html
<!-- Google Tag Manager Container -->
<script>
  // CTA Click Event
  dataLayer.push({
    'event': 'cta_click',
    'cta_location': 'hero',
    'cta_text': 'Kostenlose Offerte'
  });
  
  // Form Submit Event
  dataLayer.push({
    'event': 'form_submit',
    'form_type': 'quick_quote',
    'lead_value': 'estimated_X'
  });
</script>
```

### Umzugscheck Integration

```typescript
// Lead an Umzugscheck API senden
const submitLead = async (formData: QuickQuoteForm) => {
  const response = await fetch('/api/leads', {
    method: 'POST',
    body: JSON.stringify({
      ...formData,
      source: 'partner_website',
      partnerId: 'PARTNER_UUID'
    })
  });
  return response.json();
};
```

---

## Checkliste vor Go-Live

### Must-Have

- [ ] Above-the-fold optimiert (Hero + Form + Trust)
- [ ] Mobile responsive und getestet
- [ ] Analytics/Tracking eingerichtet
- [ ] Telefonnummer klickbar
- [ ] SSL/HTTPS aktiv

### Should-Have

- [ ] Ladezeit < 3s (PageSpeed Insights)
- [ ] Strukturierte Daten (JSON-LD)
- [ ] Google My Business verknüpft
- [ ] Remarketing Pixel installiert

### Nice-to-Have

- [ ] Live Chat / WhatsApp Widget
- [ ] Exit-Intent Popup
- [ ] Social Proof Notifications ("Max hat gerade angefragt...")
