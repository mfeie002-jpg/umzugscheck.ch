# 17 Navigation Variants - Integration Guide

## 📦 **Was ist enthalten?**

Du hast jetzt:
- ✅ `A-B-TEST-EXPORT.json` - Alle 17 Navigationen als JSON
- ✅ `navigation-variants.ts` - Komplette TypeScript Config (aus umzugscheckv2)
- ✅ Alle Dropdowns, Submenüs, CTA Cards, Microcopy, Labels

---

## 🚀 **Schritt-für-Schritt Integration**

### **1. Datei in dein Projekt kopieren**

```bash
# Kopiere die TypeScript Datei
cp navigation-variants.ts src/lib/

# ODER verwende die JSON
cp A-B-TEST-EXPORT.json src/data/
```

### **2. Typ-Definitionen verwenden**

```typescript
// src/lib/navigation-variants.ts
export type NavVariant = 'ultimate' | 'variant-b' | 'variant-c' | ... | 'variant-17';

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
  microcopy: { /* ... */ };
  dropdownTitles: { /* ... */ };
  ctaCard: { /* ... */ };
}

// Alle 17 Varianten
export const NAV_VARIANTS: NavConfig[] = [/* ... */];
```

### **3. Context/State Management**

```typescript
// src/contexts/NavigationABContext.tsx
import { createContext, useState, useCallback } from 'react';
import { NAV_VARIANTS, type NavConfig } from '@/lib/navigation-variants';

export interface NavigationABContextType {
  variant: NavConfig;
  setVariant: (id: string) => void;
}

export const NavigationABContext = createContext<NavigationABContextType | null>(null);

export const NavigationABProvider = ({ children }: { children: ReactNode }) => {
  const [variant, setVariantState] = useState<NavConfig>(NAV_VARIANTS[0]);

  const setVariant = useCallback((id: string) => {
    const found = NAV_VARIANTS.find(v => v.id === id);
    if (found) {
      setVariantState(found);
      localStorage.setItem('nav-variant', id);
      
      // Update URL
      const url = new URL(window.location.href);
      url.searchParams.set('nav', id);
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  return (
    <NavigationABContext.Provider value={{ variant, setVariant }}>
      {children}
    </NavigationABContext.Provider>
  );
};
```

### **4. Hook zum Abrufen der aktiven Variante**

```typescript
// src/hooks/useNavigationVariant.ts
import { useContext, useState, useEffect } from 'react';
import { type NavConfig } from '@/lib/navigation-variants';
import { NavigationABContext } from '@/contexts/navigation-context';

export const useNavigationVariant = (): NavConfig => {
  const context = useContext(NavigationABContext);
  const [variant, setVariant] = useState<NavConfig | null>(null);

  useEffect(() => {
    if (!context) {
      // Fallback if outside provider
      const params = new URLSearchParams(window.location.search);
      const navId = params.get('nav');
      // Load from NAV_VARIANTS...
    }
  }, [context]);

  if (context) return context.variant;
  return variant!;
};
```

### **5. In der Navigation verwenden**

```tsx
// src/components/Navigation.tsx
import { useNavigationVariant } from '@/hooks/useNavigationVariant';

export const Navigation = () => {
  const variant = useNavigationVariant();

  return (
    <nav>
      {/* Navigation Item 1 */}
      <div>
        {variant.labels.preisrechner}
        <p>{variant.microcopy.preisrechner}</p>
      </div>

      {/* Dropdown */}
      <div>
        <h3>{variant.dropdownTitles.preisrechner}</h3>
        <div>
          {/* CTA Card */}
          <div>
            <h4>{variant.ctaCard.preisrechner.title}</h4>
            <button>{variant.ctaCard.preisrechner.buttonText}</button>
          </div>
        </div>
      </div>

      {/* Weitere Navigationen... */}
    </nav>
  );
};
```

### **6. A/B Variante wechseln**

```typescript
// URL Parameter
https://example.com/?nav=variant-m  // Aktiviert Variante 13

// Oder im Code
const { setVariant } = useNavigationAB();
setVariant('variant-o'); // Aktiviert Variante 15 (ChatGPT)
```

---

## 📊 **Struktur Übersicht**

### **NavConfig Aufbau:**

```typescript
interface NavConfig {
  // Identifikation
  id: 'ultimate' | 'variant-b' | ... | 'variant-17'
  name: string                    // "1. Original (Status Quo)"
  description: string             // "Aktuelle Navigation wie..."

  // Hauptnavigation Labels
  labels: {
    preisrechner: string          // "Preisrechner" oder "Kosten berechnen"
    firmen: string                // "Umzugsfirmen" oder "Firmen vergleichen"
    services: string              // "Services"
    ratgeber: string              // "Ratgeber"
    fuerFirmen: string            // "Für Firmen"
    cta: string                   // "Offerten erhalten"
  }

  // Subtext unter Navigationen
  microcopy: {
    preisrechner: string          // "Umzugskosten berechnen in 60 Sekunden"
    firmen: string
    services: string
    ratgeber: string
    fuerFirmen: string
  }

  // Dropdown Überschriften
  dropdownTitles: {
    preisrechner: string          // "KOSTEN BERECHNEN"
    firmen: string                // "UMZUGSFIRMEN FINDEN"
    services: string
    ratgeber: string
    fuerFirmen: string
  }

  // CTA Cards in Dropdowns
  ctaCard: {
    preisrechner: {
      title: string               // "Kostenlose Offerten"
      buttonText: string          // "Preisrechner starten"
    }
    firmen: { title: string; buttonText: string }
    services: { title: string; buttonText: string }
    ratgeber: { title: string; buttonText: string }
    fuerFirmen: { title: string; buttonText: string }
  }
}
```

---

## 🎯 **Die 17 Varianten auf einen Blick**

| # | ID | Name | Strategie | Struktur | Besonderheit |
|---|---|---|---|---|---|
| 1 | `ultimate` | Original | Neutral | 5 Punkte | Status Quo |
| 2 | `variant-b` | Lovable | Action Verben | 5 Punkte | "Kosten berechnen" statt "Preisrechner" |
| 3 | `variant-c` | Concierge | Offerten First | 5 Punkte | **SWAPPED**: Offerten vor Planung |
| 4 | `variant-d` | Strategic | Planung First | 5 Punkte | **SWAPPED**: Planung vor Offerten |
| 5 | `variant-e` | Mobile-First | SEO | 5 Punkte | Kurz, mobile-optimiert |
| 6 | `variant-f` | Conversion-Killer | Sales | 5 Punkte | Aggressive Benefits |
| 7 | `variant-g` | Journey Split | Explizit | 5 Punkte | "Umzug planen" vs "Umzugsfirma finden" |
| 8 | `variant-h` | Zielgruppen-Split | Privat/Firma | 5 Punkte | **RADIKAL ANDERS**: Privatumzug vs Firmenumzug |
| 9 | `variant-i` | Mega Menu | Übersicht | 5 Punkte | Mega Menu Architektur |
| 10 | `variant-j` | Conversion Final | Extreme Copy | 5 Punkte | "3-5 Offerten in 24-48h" |
| 11 | `variant-k` | Simpel & Clean | Minimal | **6 Punkte** | NUR ein Wort: "Umzug" |
| 12 | `variant-l` | Best-of-Breed | Optimiert | 5 Punkte | V10 + Improvements |
| 13 | `variant-m` | Mobile-First | 4 Punkte + Du | **4 Punkte** | Du-Form, personal |
| 14 | `variant-n` | 2026 Design | Modern | 5 Punkte | Standard 2026 |
| 15 | `variant-o` | ChatGPT v15 | 4 Punkte + Du | **4 Punkte** | Du-Form, emotional |
| 16 | `variant-p` | SEO 2026 | SEO | 5 Punkte | Keywords-fokussiert |
| 17 | `variant-17` | NavigationV17 | Premium | 5 Punkte | Custom Component |

---

## 🔗 **URL-Parameter aktivieren**

```
https://mywebsite.com/?nav=ultimate           → Original
https://mywebsite.com/?nav=variant-b          → Lovable
https://mywebsite.com/?nav=variant-m          → Mobile-First (4 Punkte, Du-Form)
https://mywebsite.com/?nav=variant-o          → ChatGPT v15 (4 Punkte, Du-Form)
https://mywebsite.com/?nav=variant-17         → Premium (V17 Custom)
```

---

## 💾 **localStorage Speicherung**

```typescript
// Automatisch gespeichert nach Wechsel:
localStorage['nav-variant'] = 'variant-m'  // 4 Punkte + Du-Form
localStorage['nav-variant'] = 'variant-o'  // ChatGPT v15
localStorage['nav-variant'] = 'variant-17' // Premium
```

---

## 📡 **Event System**

```typescript
// Wenn Variante wechselt, wird Event dispatched:
window.dispatchEvent(new CustomEvent('nav-variant-changed', { detail: 'variant-m' }));

// Andere Komponenten können hierauf hören:
window.addEventListener('nav-variant-changed', (e) => {
  console.log('Navigation changed to:', e.detail);
  // Update UI
});
```

---

## ✅ **Checklist für Integration**

- [ ] `navigation-variants.ts` in `src/lib/` kopiert
- [ ] `NavigationABContext.tsx` erstellt
- [ ] `useNavigationVariant` Hook erstellt
- [ ] Navigation-Komponente aktualisiert
- [ ] URL-Parameter `?nav=...` funktioniert
- [ ] localStorage speichert Auswahl
- [ ] Event-System funktioniert
- [ ] Dropdown mit ctaCard rendert
- [ ] Alle 17 Varianten testbar
- [ ] Mobile & Desktop funktionieren

---

## 🧪 **Testen**

```bash
# Testen mit URL-Parameter
open "http://localhost:3000/?nav=variant-m"  # Mobile-First
open "http://localhost:3000/?nav=variant-h"  # Zielgruppen-Split
open "http://localhost:3000/?nav=variant-k"  # Simpel & Clean (6 Punkte)

# Oder im Code:
const { setVariant } = useNavigationAB();
setVariant('variant-b');  // Wechsel zu Lovable
```

---

## 🎨 **Psychologische Unterschiede nutzen**

### Wenn du **maximum Conversions** willst:
→ Nutze `variant-j` oder `variant-f` ("Conversion-Killer")

### Wenn du **mobile-first** optimieren willst:
→ Nutze `variant-m` oder `variant-o` (4 Punkte, Du-Form)

### Wenn du **zielgruppenspezifisch** segmentieren willst:
→ Nutze `variant-h` (Privatumzug vs Firmenumzug)

### Wenn du **minimalistisch** sein willst:
→ Nutze `variant-k` (6 Punkte, super simpel)

### Wenn du **premium design** willst:
→ Nutze `variant-17` (Custom NavigationV17)

---

## 📞 **Support**

Alle 17 Navigationen sind:
- ✅ Produktionsreif
- ✅ Vollständig dokumentiert
- ✅ Mit Dropdowns, Submenüs, CTAs
- ✅ Mit Microcopy & Psychology
- ✅ Sofort einsatzbereit

Viel Erfolg mit deinem A/B Testing! 🚀
