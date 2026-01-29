# Umzugscheck.ch – Flow & Navigation Variants

> **17 Navigation-Varianten für A/B Testing und Conversion-Optimierung**

---

## 🎯 GOLDEN FLOW KONZEPT

Das "Golden Flow" Konzept kombiniert:
- **V10 Smart Router** (Flow) - Der beste Conversion-Funnel
- **V10 Navigation** (Navigation) - Die optimierte Navigation

Diese Kombination dient als Benchmark für alle A/B-Tests.

---

## 📋 VARIANTEN-ÜBERSICHT

| ID | Name | Beschreibung | Fokus |
|----|------|--------------|-------|
| ultimate | 1. Original (Status Quo) | Aktuelle Navigation wie sie ist | Baseline |
| variant-b | 2. Ultimate (Lovable) | Action-First mit Verben | Conversion |
| variant-c | 3. ChatGPT Concierge | Offerten zuerst, Planung danach | Lead-First |
| variant-d | 4. Strategic Report | Premium-UX: Kosten → Offerten | Planning-First |
| variant-e | 5. Mobile-First Archetyp | Kürzere Nomen, SEO-kompatibel | Mobile |
| variant-f | 6. Conversion-Killer | Aggressiv auf Conversion | Aggressive |
| variant-g | 7. User Journey Split | Planen vs. Finden | Journey |
| variant-h | 8. Zielgruppen-Split | Privatumzug vs. Firmenumzug | Audience |
| variant-i | 9. Allgemeines Menu-Konzept | Sticky Top Nav + Mega Menu | UX |
| variant-j | 10. Conversion-Killer Final | Schärfste Wortwahl | Maximum |
| variant-k | 11. Simpel & Clean | 6 Punkte, minimale Submenüs | Simplicity |
| variant-l | 12. Optimiert (Best-of-Breed) | Kombiniert beste Elemente | Hybrid |
| variant-m | 13. Mobile-First Optimiert | 4 Punkte, Du-Form | Mobile-4P |
| variant-n | 14. 2026 Design | Zukunftsorientiert | Future |
| variant-o | 15. ChatGPT Feedback v15 | 4 Punkte, Du-Form | Feedback |
| variant-p | 16. SEO-Optimiert 2026 | Mit Emoji-Prefixes | SEO |
| variant-17 | 17. NavigationV17 | Standalone "Conversion-Killer" | Architecture |

---

## 🔧 TECHNISCHE IMPLEMENTATION

### URL-Parameter
```
?nav=ultimate        → Variante 1
?nav=variant-b       → Variante 2
?nav=variant-c       → Variante 3
...
?nav=variant-17      → Variante 17
```

### localStorage Key
```javascript
localStorage.setItem('nav-variant', 'variant-j');
```

### Event Handling
```javascript
// Variante ändern
window.dispatchEvent(new CustomEvent('nav-variant-changed', { 
  detail: 'variant-j' 
}));

// Auf Änderungen lauschen
window.addEventListener('nav-variant-changed', (e) => {
  console.log('Neue Variante:', e.detail);
});
```

### Context Provider
```typescript
import { NavigationABProvider, useNavigationAB } from '@/contexts/NavigationABContext';

// In App.tsx
<NavigationABProvider>
  <App />
</NavigationABProvider>

// In Komponenten
const { variant, setVariant } = useNavigationAB();
```

---

## 📊 DETAILLIERTE VARIANTEN

### VARIANTE 1: Original (Status Quo)

**ID:** `ultimate`

```typescript
labels: {
  preisrechner: 'Preisrechner',
  firmen: 'Umzugsfirmen',
  services: 'Services',
  ratgeber: 'Ratgeber',
  fuerFirmen: 'Für Firmen',
  cta: 'Offerten erhalten',
}
```

**Microcopy:**
- Preisrechner: "Umzugskosten berechnen in 60 Sekunden"
- Firmen: "Geprüfte Firmen in deiner Region"
- Services: "Reinigung, Lagerung, Entsorgung & mehr"
- Ratgeber: "Checklisten, Tipps & Anleitungen"

---

### VARIANTE 2: Ultimate (Lovable)

**ID:** `variant-b`

```typescript
labels: {
  preisrechner: 'Kosten berechnen',
  firmen: 'Firmen vergleichen',
  services: 'Alle Services',
  ratgeber: 'Tipps & Hilfe',
  fuerFirmen: 'Für Anbieter',
  cta: 'Gratis Offerten',
}
```

**Besonderheit:** Action-First mit Verben, conversion-fokussiert

---

### VARIANTE 3: ChatGPT Concierge

**ID:** `variant-c`

```typescript
labels: {
  preisrechner: 'Offerten vergleichen',  // GETAUSCHT!
  firmen: 'Kosten & Planung',            // GETAUSCHT!
  services: 'Services',
  ratgeber: 'Ratgeber',
  fuerFirmen: 'Für Firmen',
  cta: 'Offerten erhalten',
}
```

**Besonderheit:** Offerten-First - Vergleichen VOR Planen

---

### VARIANTE 4: Strategic Report

**ID:** `variant-d`

```typescript
labels: {
  preisrechner: 'Kosten & Planung',
  firmen: 'Offerten vergleichen',
  services: 'Services',
  ratgeber: 'Ratgeber',
  fuerFirmen: 'Für Firmen',
  cta: 'Offerten erhalten',
}
```

**Besonderheit:** Premium-UX: Planung VOR Offerten

---

### VARIANTE 5: Mobile-First Archetyp

**ID:** `variant-e`

```typescript
labels: {
  preisrechner: 'Kosten & Planung',
  firmen: 'Umzugsfirmen',
  services: 'Services',
  ratgeber: 'Tipps & Vorlagen',
  fuerFirmen: 'Für Firmen',
  cta: 'Offerten erhalten',
}
```

**Besonderheit:** Kürzere Labels für Mobile-Screens

---

### VARIANTE 6: Conversion-Killer

**ID:** `variant-f`

```typescript
labels: {
  preisrechner: 'Kosten & Planung',
  firmen: 'Offerten vergleichen',
  services: 'Services',
  ratgeber: 'Ratgeber',
  fuerFirmen: 'Für Firmen',
  cta: 'Offerten erhalten',
}
```

**Microcopy:** Aggressiver Ton mit Schweizer Sicherheit

---

### VARIANTE 7: User Journey Split

**ID:** `variant-g`

```typescript
labels: {
  preisrechner: 'Umzug planen',
  firmen: 'Umzugsfirma finden',
  services: 'Services',
  ratgeber: 'Ratgeber',
  fuerFirmen: 'Für Firmen',
  cta: 'Offerten erhalten',
}
```

**Besonderheit:** Klassische Trennung: Planen vs. Finden

---

### VARIANTE 8: Zielgruppen-Split

**ID:** `variant-h`

```typescript
labels: {
  preisrechner: 'Privatumzug',     // RADIKAL ANDERS!
  firmen: 'Firmenumzug',           // RADIKAL ANDERS!
  services: 'Umzugsfirmen',
  ratgeber: 'Planung & Checkliste',
  fuerFirmen: 'Zusatzservices',
  cta: 'Offerten erhalten',
}
```

**Besonderheit:** Trennung nach Kundentyp, nicht nach Funktion

---

### VARIANTE 10: Conversion-Killer Final

**ID:** `variant-j`

```typescript
labels: {
  preisrechner: 'Kosten berechnen',
  firmen: 'Offerten vergleichen',
  services: 'Services',
  ratgeber: 'Ratgeber',
  fuerFirmen: 'Für Anbieter',
  cta: 'Gratis Offerten',
}
```

**Microcopy:** "3–5 Offerten in 24–48h" - Maximale Conversion

---

### VARIANTE 11: Simpel & Clean

**ID:** `variant-k`

```typescript
labels: {
  preisrechner: 'Umzug',
  firmen: 'Umzugsreinigung',
  services: 'Weitere Services',
  ratgeber: 'Ratgeber',
  fuerFirmen: 'So funktioniert\'s',  // 6. PUNKT!
  cta: 'Jetzt Offerten vergleichen',
}
```

**Besonderheit:** 6 Hauptpunkte statt 5

---

### VARIANTE 13: Mobile-First Optimiert

**ID:** `variant-m`

```typescript
labels: {
  preisrechner: 'Umzug planen',
  firmen: 'Firmen vergleichen',
  services: 'Tipps & Checklisten',
  ratgeber: '',  // FEHLT - nur 4 Punkte!
  fuerFirmen: '',
  cta: 'Jetzt Offerten vergleichen',
}
```

**Besonderheit:** Nur 4 Punkte, Du-Form

---

### VARIANTE 15: ChatGPT Feedback v15

**ID:** `variant-o`

```typescript
labels: {
  preisrechner: 'Umzug planen',
  firmen: 'Firmen vergleichen',
  services: 'Tipps & Checklisten',
  ratgeber: '',  // Nur 4 Punkte
  fuerFirmen: '',
  cta: 'Jetzt Offerten vergleichen',
}
```

**Besonderheit:** Du-Form Tonalität

---

### VARIANTE 16: SEO-Optimiert 2026

**ID:** `variant-p`

```typescript
labels: {
  preisrechner: '📦 Umzug planen',    // EMOJIS!
  firmen: '🏢 Firmen vergleichen',    // EMOJIS!
  services: '💡 Tipps & Checklisten',
  ratgeber: '',
  fuerFirmen: '',
  cta: 'Jetzt Offerten vergleichen',
}
```

**Besonderheit:** Emoji-Prefixes für visuellen Kontrast

---

### VARIANTE 17: NavigationV17

**ID:** `variant-17`

```typescript
// Komplett separate Komponente!
<NavigationV17 />
```

**Struktur:**
- Kosten & Planung → Awareness Stage
- Offerten vergleichen → Action Stage
- Services → Upsell Opportunities
- Ratgeber → Authority & SEO
- Für Firmen → B2B & Partner

**Besonderheit:** Standalone-Architektur, psychologisch optimiert

---

## 🔬 A/B TESTING PROTOKOLL

### 1. Variante aktivieren
```typescript
// Via URL
window.location.href = '/?nav=variant-j';

// Via Code
const { setVariant } = useNavigationAB();
setVariant('variant-j');
```

### 2. Metriken tracken
- Conversion Rate (Lead → Submit)
- Time on Page
- Bounce Rate
- Click-Through Rate (CTAs)
- Mobile vs. Desktop Performance

### 3. Statistische Signifikanz
- Mindestens 1000 Sessions pro Variante
- 95% Confidence Interval
- 2 Wochen Laufzeit empfohlen

---

## 📱 MOBILE PARITY

Alle 17 Desktop-Varianten haben entsprechende Mobile-Varianten:

```typescript
// useDynamicMobileMenu Hook
const MobileMenu = useDynamicMobileMenu(variant.id);
```

| Desktop Variant | Mobile Component |
|-----------------|------------------|
| V1-V10, V14, V15, V17 | MobileMenuNew (dynamic) |
| V11 | MobileMenuV11 |
| V12 | MobileMenuV12 |
| V13 | MobileMenuV13 |
| V16 | MobileMenuV16 |

---

## 📁 KEY FILES

| Pfad | Beschreibung |
|------|--------------|
| `src/lib/navigation-variants.ts` | Alle 17 Varianten-Definitionen |
| `src/contexts/NavigationABContext.tsx` | A/B Testing Context |
| `src/hooks/useNavigationVariant.ts` | Variant Hook |
| `src/lib/unified-ab-config.ts` | Config Management |
| `src/components/navigation-v17/` | V17 Komponenten |

---

## 🎛️ NavConfig Interface

```typescript
export interface NavConfig {
  id: NavVariant;
  name: string;
  description: string;
  labels: {
    preisrechner: string;
    firmen: string;
    services: string;
    ratgeber: string;
    fuerFirmen: string;
    cta: string;
  };
  microcopy: {
    preisrechner: string;
    firmen: string;
    services: string;
    ratgeber: string;
    fuerFirmen: string;
  };
  dropdownTitles: {
    preisrechner: string;
    firmen: string;
    services: string;
    ratgeber: string;
    fuerFirmen: string;
  };
  ctaCard: {
    preisrechner: { title: string; buttonText: string };
    firmen: { title: string; buttonText: string };
    services: { title: string; buttonText: string };
    ratgeber: { title: string; buttonText: string };
    fuerFirmen: { title: string; buttonText: string };
  };
}
```

---

## 🏆 STRATEGISCHE UNTERSCHIEDE

### Psychologische Positionierung

| Variante | Strategie |
|----------|-----------|
| V1 (Original) | Neutral, Status Quo |
| V2 (Ultimate) | Action-First |
| V3 (Concierge) | Offer-First |
| V4 (Strategic) | Planning-First |
| V6, V10 | Aggressive Conversion |
| V8 | Audience Segmentation |
| V11 | Simplicity-First |
| V17 | Full Architecture Overhaul |

### Tonalität

| Variante | Form |
|----------|------|
| V1-V12 | Sie-Form (formal) |
| V13, V15 | Du-Form (casual) |
| V16 | Du-Form + Emojis |

### Struktur

| Punkte | Varianten |
|--------|-----------|
| 4 Punkte | V13, V15, V16 |
| 5 Punkte | V1-V10, V12, V14, V17 |
| 6 Punkte | V11 |

---

*Letzte Aktualisierung: Januar 2025*
