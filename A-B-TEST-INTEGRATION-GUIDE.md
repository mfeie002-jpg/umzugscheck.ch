# A/B Test Navigation System - Integration Guide

## 📋 Übersicht

Dieses Paket enthält **17 vollständige Navigation-Varianten** mit unterschiedlichen Strukturen, Wording, Tonalität und Fokus-Strategien für A/B Testing.

---

## 🚀 Schnellstart (5 Minuten)

### 1. Dateien kopieren

```bash
# A/B Test Dateien
cp A-B-TEST-EXPORT.json YOUR_PROJECT/src/data/
cp src/lib/navigation-variants.ts YOUR_PROJECT/src/lib/

# Wenn du React verwendest:
cp src/contexts/NavigationABContext.tsx YOUR_PROJECT/src/contexts/
cp src/hooks/useNavigationVariant.ts YOUR_PROJECT/src/hooks/
```

### 2. Navigation Context Setup (React)

```tsx
// src/App.tsx oder src/main.tsx
import { NavigationABProvider } from './contexts/NavigationABContext';

function App() {
  return (
    <NavigationABProvider>
      {/* Deine App */}
    </NavigationABProvider>
  );
}
```

### 3. Navigation Hook verwenden

```tsx
// src/components/Navigation.tsx
import { useNavigationVariant } from '@/hooks/useNavigationVariant';

export function Navigation() {
  const { variant, labels, microcopy, dropdownTitles, ctaCard } = useNavigationVariant();
  
  return (
    <nav>
      <ul>
        <li>
          <a href="/calculator">
            {labels.preisrechner}
            <span className="microcopy">{microcopy.preisrechner}</span>
          </a>
        </li>
        <li>
          <a href="/companies">
            {labels.firmen}
            <span className="microcopy">{microcopy.firmen}</span>
          </a>
        </li>
        {/* ... weitere Punkte */}
      </ul>
      
      <button className="cta">
        {labels.cta}
      </button>
    </nav>
  );
}
```

### 4. Variante wechseln via URL

```bash
# Standard (Variante 1)
http://localhost:3000/

# Mobile-First (Variante 13)
http://localhost:3000/?nav=variant-m

# Zielgruppen-Split (Variante 8)
http://localhost:3000/?nav=variant-h

# Premium Design (Variante 17)
http://localhost:3000/?nav=variant-17
```

---

## 🎯 Vollständige Integration

### **Schritt 1: Context erstellen**

```tsx
// src/contexts/NavigationABContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { NavConfig, NavVariant, getActiveVariant, setActiveVariant } from '@/lib/navigation-variants';

interface NavigationABContextType {
  variant: NavConfig;
  setVariant: (variantId: NavVariant) => void;
}

export const NavigationABContext = createContext<NavigationABContextType | undefined>(undefined);

export const NavigationABProvider = ({ children }: { children: ReactNode }) => {
  const [variant, setVariantState] = useState<NavConfig>(getActiveVariant());

  useEffect(() => {
    // Listen for variant changes
    const handleVariantChange = (e: CustomEvent<NavVariant>) => {
      const newVariant = getActiveVariant();
      setVariantState(newVariant);
    };

    window.addEventListener('nav-variant-changed', handleVariantChange as EventListener);

    return () => {
      window.removeEventListener('nav-variant-changed', handleVariantChange as EventListener);
    };
  }, []);

  const setVariant = (variantId: NavVariant) => {
    setActiveVariant(variantId);
    setVariantState(getActiveVariant());
  };

  return (
    <NavigationABContext.Provider value={{ variant, setVariant }}>
      {children}
    </NavigationABContext.Provider>
  );
};
```

### **Schritt 2: Hook erstellen**

```tsx
// src/hooks/useNavigationVariant.ts
import { useContext } from 'react';
import { NavigationABContext } from '@/contexts/NavigationABContext';

export const useNavigationVariant = () => {
  const context = useContext(NavigationABContext);
  
  if (!context) {
    throw new Error('useNavigationVariant must be used within NavigationABProvider');
  }
  
  return {
    variant: context.variant,
    setVariant: context.setVariant,
    labels: context.variant.labels,
    microcopy: context.variant.microcopy,
    dropdownTitles: context.variant.dropdownTitles,
    ctaCard: context.variant.ctaCard,
    id: context.variant.id,
    name: context.variant.name,
    description: context.variant.description,
  };
};
```

### **Schritt 3: Navigation-Komponente**

```tsx
// src/components/Navigation.tsx
import { useNavigationVariant } from '@/hooks/useNavigationVariant';
import { useState } from 'react';

export function Navigation() {
  const { variant, labels, microcopy, dropdownTitles, ctaCard } = useNavigationVariant();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <ul className="flex items-center gap-6 py-4">
          {/* 1. Preisrechner / Kosten & Planung */}
          <li className="relative group">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'preisrechner' ? null : 'preisrechner')}
              className="flex items-center gap-2 hover:text-primary"
            >
              {labels.preisrechner}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openDropdown === 'preisrechner' && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white shadow-xl rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">{dropdownTitles.preisrechner}</h3>
                <p className="text-sm text-gray-600 mb-4">{microcopy.preisrechner}</p>
                
                <div className="space-y-2">
                  <a href="/vergleich" className="block p-3 hover:bg-gray-50 rounded-lg">
                    <div className="font-medium">Preisrechner</div>
                    <div className="text-sm text-gray-500">In 2 Minuten Klarheit</div>
                  </a>
                  <a href="/checkliste" className="block p-3 hover:bg-gray-50 rounded-lg">
                    <div className="font-medium">Checkliste</div>
                    <div className="text-sm text-gray-500">Nichts vergessen</div>
                  </a>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2">{ctaCard.preisrechner.title}</div>
                    <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90">
                      {ctaCard.preisrechner.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>

          {/* 2. Umzugsfirmen */}
          <li className="relative group">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'firmen' ? null : 'firmen')}
              className="flex items-center gap-2 hover:text-primary"
            >
              {labels.firmen}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown ähnlich wie oben */}
          </li>

          {/* 3. Services */}
          <li className="relative group">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'services' ? null : 'services')}
              className="flex items-center gap-2 hover:text-primary"
            >
              {labels.services}
            </button>
          </li>

          {/* 4. Ratgeber */}
          <li className="relative group">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'ratgeber' ? null : 'ratgeber')}
              className="flex items-center gap-2 hover:text-primary"
            >
              {labels.ratgeber}
            </button>
          </li>

          {/* 5. Für Firmen */}
          <li className="relative group">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'fuerFirmen' ? null : 'fuerFirmen')}
              className="flex items-center gap-2 hover:text-primary"
            >
              {labels.fuerFirmen}
            </button>
          </li>

          {/* CTA Button */}
          <li className="ml-auto">
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">
              {labels.cta}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
```

---

## 🎨 Varianten-Wechsel UI

```tsx
// src/components/VariantSwitcher.tsx (für Testing)
import { useNavigationVariant } from '@/hooks/useNavigationVariant';
import { NAV_VARIANTS, NavVariant } from '@/lib/navigation-variants';

export function VariantSwitcher() {
  const { variant, setVariant } = useNavigationVariant();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white shadow-xl rounded-lg p-4 max-w-sm">
      <h3 className="font-semibold mb-2">A/B Test Variante</h3>
      <p className="text-sm text-gray-600 mb-3">Aktuell: {variant.name}</p>
      
      <select
        value={variant.id}
        onChange={(e) => setVariant(e.target.value as NavVariant)}
        className="w-full p-2 border rounded-lg"
      >
        {NAV_VARIANTS.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

---

## 📊 Analytics Integration

### Google Analytics 4

```tsx
// src/lib/analytics.ts
import { NavVariant } from './navigation-variants';

export const trackNavVariantView = (variant: NavVariant) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'navigation_variant_view', {
      variant_id: variant,
      variant_name: NAV_VARIANTS.find(v => v.id === variant)?.name,
    });
  }
};

export const trackNavClick = (label: string, variant: NavVariant) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'navigation_click', {
      label,
      variant_id: variant,
    });
  }
};
```

### In deiner Navigation

```tsx
import { trackNavVariantView, trackNavClick } from '@/lib/analytics';

// In useEffect
useEffect(() => {
  trackNavVariantView(variant.id);
}, [variant.id]);

// Bei Klicks
<a 
  href="/vergleich" 
  onClick={() => trackNavClick('preisrechner', variant.id)}
>
  {labels.preisrechner}
</a>
```

---

## 🧪 A/B Test Setup

### 1. **Google Optimize / VWO**

```html
<!-- In deinem <head> -->
<script>
  // Weise Variante basierend auf Experiment zu
  const experimentVariants = {
    'experiment-001': 'variant-m', // Mobile-First
    'experiment-002': 'variant-h', // Zielgruppen-Split
    'experiment-003': 'variant-17', // Premium
  };
  
  const assignedVariant = experimentVariants[window.experimentId];
  if (assignedVariant) {
    localStorage.setItem('nav-variant', assignedVariant);
  }
</script>
```

### 2. **Server-Side A/B Testing**

```typescript
// Next.js Middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const variantCookie = request.cookies.get('nav-variant');
  
  if (!variantCookie) {
    // Weise zufällige Variante zu
    const variants = ['ultimate', 'variant-m', 'variant-h', 'variant-17'];
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    
    const response = NextResponse.next();
    response.cookies.set('nav-variant', randomVariant, { maxAge: 60 * 60 * 24 * 30 }); // 30 Tage
    return response;
  }
  
  return NextResponse.next();
}
```

---

## 🎯 URL Parameter

Alle Varianten können via URL-Parameter getestet werden:

```bash
# Variante 1: Original
/?nav=ultimate

# Variante 2: Lovable
/?nav=variant-b

# Variante 3: Concierge
/?nav=variant-c

# Variante 4: Strategic Report
/?nav=variant-d

# Variante 5: Mobile-First
/?nav=variant-e

# Variante 6: Conversion-Killer
/?nav=variant-f

# Variante 7: Journey Split
/?nav=variant-g

# Variante 8: Zielgruppen-Split
/?nav=variant-h

# Variante 9: Mega Menu
/?nav=variant-i

# Variante 10: Final
/?nav=variant-j

# Variante 11: Simpel & Clean (6 Punkte!)
/?nav=variant-k

# Variante 12: Best-of-Breed
/?nav=variant-l

# Variante 13: Mobile-First Optimiert (Du-Form, 4 Punkte)
/?nav=variant-m

# Variante 14: 2026 Design
/?nav=variant-n

# Variante 15: ChatGPT v15 (Du-Form, 4 Punkte)
/?nav=variant-o

# Variante 16: SEO-Optimiert
/?nav=variant-p

# Variante 17: Premium Design
/?nav=variant-17
```

---

## 📱 Framework-spezifische Integration

### **Next.js**

```tsx
// app/layout.tsx
import { NavigationABProvider } from '@/contexts/NavigationABContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NavigationABProvider>
          <Navigation />
          {children}
        </NavigationABProvider>
      </body>
    </html>
  );
}
```

### **Vue.js / Nuxt**

```typescript
// plugins/navigation-ab.ts
import { ref, computed } from 'vue';
import { getActiveVariant, setActiveVariant, NavVariant } from '@/lib/navigation-variants';

export const useNavigationVariant = () => {
  const variant = ref(getActiveVariant());

  const setVariant = (variantId: NavVariant) => {
    setActiveVariant(variantId);
    variant.value = getActiveVariant();
  };

  return {
    variant,
    setVariant,
    labels: computed(() => variant.value.labels),
    microcopy: computed(() => variant.value.microcopy),
  };
};
```

### **Svelte / SvelteKit**

```typescript
// stores/navigation-ab.ts
import { writable } from 'svelte/store';
import { getActiveVariant, setActiveVariant, type NavVariant } from '$lib/navigation-variants';

export const navigationVariant = writable(getActiveVariant());

export const setVariant = (variantId: NavVariant) => {
  setActiveVariant(variantId);
  navigationVariant.set(getActiveVariant());
};
```

---

## 🔥 Best Practices

### 1. **localStorage Persistenz**
- Variante wird automatisch in `localStorage` gespeichert
- Überlebbar über Page-Reloads
- URL-Parameter überschreiben localStorage

### 2. **SSR-Safe**
- `typeof window === 'undefined'` Checks eingebaut
- Fallback auf `VARIANT_ULTIMATE` bei SSR

### 3. **Event-basierte Updates**
- `window.dispatchEvent(new CustomEvent('nav-variant-changed'))`
- Alle Komponenten können auf Änderungen lauschen

### 4. **TypeScript Support**
- Vollständige Type Definitions
- Autocomplete für alle Varianten

---

## 🎨 Dropdown & Submenu Struktur

Jede Variante hat **5 Hauptpunkte** (außer Variante 11 mit 6 und 13/15 mit 4):

```
1. Preisrechner/Kosten & Planung
   ├── Dropdown: Preisrechner, Checkliste, Zeitplan
   └── CTA Card: "Kostenlose Offerten"

2. Umzugsfirmen/Offerten vergleichen
   ├── Dropdown: Nach Region, Nach Kanton, Nach Stadt
   └── CTA Card: "Offerten in deiner Region"

3. Services
   ├── Dropdown: Privatumzug, Firmenumzug, Reinigung, Lagerung, Entsorgung
   └── CTA Card: "Service auswählen"

4. Ratgeber
   ├── Dropdown: Checklisten, Tipps, Vorlagen, FAQ
   └── CTA Card: "Umzug jetzt starten"

5. Für Firmen/So funktioniert's
   ├── Dropdown: Partner werden, Dashboard, Pricing
   └── CTA Card: "Jetzt Partner werden"
```

**Vollständige Dropdown-Implementierung:** Siehe `src/components/Navigation.tsx`

---

## 🚨 Troubleshooting

### Problem: Variante ändert sich nicht
```typescript
// Lösung: localStorage löschen
localStorage.removeItem('nav-variant');
window.location.reload();
```

### Problem: URL-Parameter funktioniert nicht
```typescript
// Lösung: Sicherstellen, dass getActiveVariant() aufgerufen wird
useEffect(() => {
  const variant = getActiveVariant();
  setVariantState(variant);
}, []);
```

### Problem: SSR Hydration Mismatch
```typescript
// Lösung: isClient Check
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

if (!isClient) return null;
```

---

## 📚 Weitere Ressourcen

- **A-B-TEST-QUICK-REFERENCE.md** - Cheat Sheet für schnelle Varianten-Auswahl
- **A-B-TEST-EXPORT.json** - Komplette JSON-Daten für andere Frameworks
- **navigation-variants.ts** - TypeScript Implementierung

---

**Fertig!** 🎉 Jetzt kannst du alle 17 Navigationen testen.
