# A/B Test Navigation - Quick Reference

## 🎯 Wähle deine Variante in 5 Sekunden

### **Nach Ziel:**

| Ziel | Empfohlene Variante | URL | Warum? |
|------|---------------------|-----|--------|
| **Max Conversions** | **Variante 6 oder 10** | `?nav=variant-f` oder `?nav=variant-j` | Aggressiv auf Conversions getrimmt, klare CTAs |
| **Mobile-First** | **Variante 13 oder 15** | `?nav=variant-m` oder `?nav=variant-o` | 4 Punkte, Du-Form, persönlich |
| **SEO-Optimiert** | **Variante 16** | `?nav=variant-p` | Keywords, strukturierte Daten |
| **B2B / Firmenkunden** | **Variante 8** | `?nav=variant-h` | Trennung Privat/Firma |
| **Planung-fokussiert** | **Variante 4** | `?nav=variant-d` | Kosten & Planung zuerst |
| **Offerten-fokussiert** | **Variante 3** | `?nav=variant-c` | Offerten vergleichen zuerst |
| **Minimalistisch** | **Variante 11** | `?nav=variant-k` | 6 Punkte, simpel & clean |
| **Premium Design** | **Variante 17** | `?nav=variant-17` | Eigenständige Komponente |

---

## 📊 Alle 17 Varianten auf einen Blick

### **Struktur: 4 Punkte (Mobile-First)**

| ID | Name | Du/Sie | Punkt 1 | Punkt 2 | Fokus |
|----|------|--------|---------|---------|-------|
| **variant-m** | **13. Mobile-First** | Du | Plane deinen Umzug | Offerten vergleichen | Persönlich, Mobile |
| **variant-o** | **15. ChatGPT v15** | Du | Plane deinen Umzug | Offerten vergleichen | Emotional |

**URL:**
```bash
/?nav=variant-m  # Mobile-First
/?nav=variant-o  # ChatGPT v15
```

---

### **Struktur: 5 Punkte (Standard)**

| ID | Name | Du/Sie | Punkt 1 | Punkt 2 | Fokus |
|----|------|--------|---------|---------|-------|
| **ultimate** | **1. Original** | Sie | Preisrechner | Umzugsfirmen | Neutral |
| **variant-b** | **2. Lovable** | Sie | Kosten berechnen | Firmen vergleichen | Action-Verben |
| **variant-c** | **3. Concierge** | Sie | Offerten vergleichen | Kosten & Planung | Offerten-first |
| **variant-d** | **4. Strategic** | Sie | Kosten & Planung | Offerten vergleichen | Planung-first |
| **variant-e** | **5. Mobile Archetyp** | Sie | Kosten & Planung | Umzugsfirmen | Mobile, SEO |
| **variant-f** | **6. Conversion-Killer** | Sie | Kosten & Planung | Offerten vergleichen | Max Conversion |
| **variant-g** | **7. Journey Split** | Sie | Umzug planen | Umzugsfirma finden | Journey-Split |
| **variant-h** | **8. Zielgruppen** | Sie | Privatumzug | Firmenumzug | B2B/B2C-Split |
| **variant-i** | **9. Mega Menu** | Sie | Kosten berechnen | Firmen finden | Mega-Menu |
| **variant-j** | **10. Final** | Sie | Kosten berechnen | Offerten vergleichen | Schärfste Wortwahl |
| **variant-l** | **12. Best-of-Breed** | Sie | Preise berechnen | Umzugsfirma finden | Best Practice |
| **variant-n** | **14. 2026 Design** | Du | Umzug planen | Umzugsfirmen | Modern |
| **variant-p** | **16. SEO-Optimiert** | Du | Umzug planen | Umzugsfirmen | SEO |
| **variant-17** | **17. NavigationV17** | Sie | Kosten & Planung | Offerten vergleichen | Premium |

**URL:**
```bash
/?nav=ultimate   # Original
/?nav=variant-b  # Lovable
/?nav=variant-c  # Concierge
/?nav=variant-d  # Strategic
/?nav=variant-e  # Mobile Archetyp
/?nav=variant-f  # Conversion-Killer ⚡
/?nav=variant-g  # Journey Split
/?nav=variant-h  # Zielgruppen-Split
/?nav=variant-i  # Mega Menu
/?nav=variant-j  # Conversion Final ⚡
/?nav=variant-l  # Best-of-Breed
/?nav=variant-n  # 2026 Design
/?nav=variant-p  # SEO-Optimiert
/?nav=variant-17 # Premium Design
```

---

### **Struktur: 6 Punkte (Extended)**

| ID | Name | Du/Sie | Punkt 1 | Punkt 2 | Punkt 3 | Fokus |
|----|------|--------|---------|---------|---------|-------|
| **variant-k** | **11. Simpel & Clean** | Sie | Umzug | Umzugsreinigung | Weitere Services | Minimalistisch |

**URL:**
```bash
/?nav=variant-k  # Simpel & Clean (6 Punkte!)
```

---

## 🔥 Quick Start Code

### React Hook

```tsx
import { useNavigationVariant } from '@/hooks/useNavigationVariant';

export function MyNavigation() {
  const { labels, microcopy, ctaCard } = useNavigationVariant();
  
  return (
    <nav>
      <a href="/calculator">{labels.preisrechner}</a>
      <a href="/companies">{labels.firmen}</a>
      <button>{labels.cta}</button>
    </nav>
  );
}
```

### Variante wechseln

```tsx
import { setActiveVariant } from '@/lib/navigation-variants';

// Programmatisch wechseln
setActiveVariant('variant-m'); // Mobile-First

// Via URL
window.location.href = '/?nav=variant-m';
```

### Aktive Variante lesen

```tsx
import { getActiveVariant } from '@/lib/navigation-variants';

const variant = getActiveVariant();
console.log(variant.name); // "13. Mobile-First Optimiert"
```

---

## 🎨 Dropdown & Submenü

Jede Variante hat **komplette Dropdown-Struktur**:

```tsx
// Beispiel Variante 13 (Mobile-First)
{
  labels: {
    preisrechner: "Plane deinen Umzug",
    firmen: "Offerten vergleichen",
    services: "So funktioniert's",
    ratgeber: "Hilfe & Kontakt",
  },
  microcopy: {
    preisrechner: "Tools, Checklisten & Tipps, damit du stressfrei an alles denkst.",
    firmen: "Hol dir gratis Offerten von geprüften Umzugsfirmen.",
    // ...
  },
  ctaCard: {
    preisrechner: {
      title: "Bereit für den nächsten Schritt?",
      buttonText: "Gratis Offerten holen"
    },
    // ...
  }
}
```

**Vollständige Dropdown-Implementierung:** Siehe `A-B-TEST-INTEGRATION-GUIDE.md`

---

## 🎯 Best Practices nach Use Case

### **1. E-Commerce / Conversions**
✅ **Variante 6** (`variant-f`) oder **Variante 10** (`variant-j`)
- Aggressive CTAs
- "Budget geklärt?" → Direkte Frage
- "Top-Firmen in deiner Region, bis 40% sparen"

```bash
/?nav=variant-f
```

---

### **2. Mobile-First / Gen Z**
✅ **Variante 13** (`variant-m`) oder **Variante 15** (`variant-o`)
- 4 Punkte (weniger Clutter)
- Du-Form (persönlich)
- "Plane deinen Umzug" statt "Preisrechner"

```bash
/?nav=variant-m
```

---

### **3. B2B / Firmenkunden**
✅ **Variante 8** (`variant-h`)
- Klare Trennung: "Privatumzug" vs "Firmenumzug"
- Sie-Form (formal)
- "Effiziente Büroumzüge für Unternehmen"

```bash
/?nav=variant-h
```

---

### **4. SEO / Content Marketing**
✅ **Variante 16** (`variant-p`) oder **Variante 14** (`variant-n`)
- Keywords: "Umzug planen", "Umzugsfirmen"
- "200+ geprüfte Partner" (Trust-Signale)
- Du-Form (nahbar)

```bash
/?nav=variant-p
```

---

### **5. Premium / High-End**
✅ **Variante 17** (`variant-17`)
- Eigenständige NavigationV17-Komponente
- Premium-Design
- Mega-Dropdowns mit Trust-Signalen

```bash
/?nav=variant-17
```

---

### **6. Minimalistisch / Simpel**
✅ **Variante 11** (`variant-k`)
- 6 Punkte (mehr Struktur)
- Nur "Umzug" (nicht "Preisrechner")
- "Endreinigung mit Abgabegarantie" (konkret)

```bash
/?nav=variant-k
```

---

## 📊 A/B Test Setup

### Google Optimize

```javascript
// Experiment ID: experiment-nav-001
const variants = {
  0: 'ultimate',      // Control
  1: 'variant-m',     // Mobile-First
  2: 'variant-h',     // Zielgruppen-Split
  3: 'variant-17',    // Premium
};

const variantId = variants[window.google_optimize.get('experiment-nav-001')];
localStorage.setItem('nav-variant', variantId);
```

### VWO

```javascript
// Variante aus VWO zuweisen
window._vwo_exp['experiment-001'].combination_chosen = 'variant-m';
localStorage.setItem('nav-variant', 'variant-m');
```

---

## 🎯 URL-Parameter Cheat Sheet

| Variante | URL | Punkte | Style | Fokus |
|----------|-----|--------|-------|-------|
| **Original** | `?nav=ultimate` | 5 | Sie | Neutral |
| **Lovable** | `?nav=variant-b` | 5 | Sie | Action-Verben |
| **Concierge** | `?nav=variant-c` | 5 | Sie | Offerten-first |
| **Strategic** | `?nav=variant-d` | 5 | Sie | Planung-first |
| **Mobile Archetyp** | `?nav=variant-e` | 5 | Sie | Mobile, SEO |
| **🔥 Conversion-Killer** | `?nav=variant-f` | 5 | Sie | Max Conversion |
| **Journey Split** | `?nav=variant-g` | 5 | Sie | Journey-Split |
| **Zielgruppen** | `?nav=variant-h` | 5 | Sie | B2B/B2C |
| **Mega Menu** | `?nav=variant-i` | 5 | Sie | Mega-Menu |
| **🔥 Final** | `?nav=variant-j` | 5 | Sie | Schärfste Wortwahl |
| **Simpel & Clean** | `?nav=variant-k` | 6 | Sie | Minimalistisch |
| **Best-of-Breed** | `?nav=variant-l` | 5 | Sie | Best Practice |
| **Mobile-First** | `?nav=variant-m` | 4 | Du | Persönlich, Mobile |
| **2026 Design** | `?nav=variant-n` | 5 | Du | Modern |
| **ChatGPT v15** | `?nav=variant-o` | 4 | Du | Emotional |
| **SEO-Optimiert** | `?nav=variant-p` | 5 | Du | SEO |
| **Premium** | `?nav=variant-17` | 5 | Sie | Premium Design |

---

## 🚀 Quick Test Commands

```bash
# Teste alle Varianten nacheinander
for variant in ultimate variant-{b..p} variant-17; do
  echo "Testing: $variant"
  open "http://localhost:3000/?nav=$variant"
  sleep 5
done

# Oder direkt in Browser DevTools:
['ultimate', 'variant-b', 'variant-c', 'variant-d', 'variant-e', 
 'variant-f', 'variant-g', 'variant-h', 'variant-i', 'variant-j',
 'variant-k', 'variant-l', 'variant-m', 'variant-n', 'variant-o',
 'variant-p', 'variant-17'].forEach(v => {
  console.log(`Testing ${v}`);
  window.location.href = `/?nav=${v}`;
});
```

---

## 🎯 Psychologische Strategien

### **Variante 1-2: Neutral → Status Quo**
- "Preisrechner" → Was ist es?
- Keine aggressive Wortwahl

### **Variante 3: Offerten-first → Schnell-Entscheider**
- Direkt zu Offerten
- "bis zu 40% sparen"

### **Variante 4: Planung-first → Planer**
- Erst Klarheit
- "Checkliste, Zeitplan, Kosten"

### **Variante 6 & 10: Conversion-Killer → Sales**
- "Budget geklärt?"
- "Top-Firmen"
- "3–5 Offerten in 24–48h"

### **Variante 8: Zielgruppen-Split → B2B/B2C**
- Klare Trennung
- "Privatumzug" vs "Firmenumzug"

### **Variante 13 & 15: Du-Form → Gen Z / Mobile**
- Persönlich
- "Plane DEINEN Umzug"
- 4 Punkte (weniger Clutter)

---

**Fertig!** 🎉 Wähle deine Variante und leg los.
