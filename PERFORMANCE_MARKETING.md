# Performance Marketing Upgrade - Dokumentation

## 🎯 Was wurde implementiert

Alle Empfehlungen aus dem Experten-Feedback wurden umgesetzt, um die Website von einer "Informationsseite" zu einer "Lead-Maschine" für Google Ads zu transformieren.

## 📦 Neue Komponenten

### 1. **MobileStickyCTA** (`src/components/MobileStickyCTA.tsx`)
Sticky Bottom Bar für Mobile - das wichtigste Element für Conversion.

**Features:**
- Fixiert am unteren Bildschirmrand (nur Mobile < 768px)
- 3 Buttons: WhatsApp (links), **📞 Jetzt anrufen** (Mitte, Primary), Offerte (rechts)
- Micro-copy: "In 5–10 Min fix gebucht · Live 08–19 Uhr"
- Analytics Tracking für alle Clicks
- Tailwind Animations (pulse, scale)

**Integration:**
```tsx
// In App.tsx bereits integriert
<MobileStickyCTA 
  phoneE164="+41 79 123 45 67"  // ← DEINE ECHTE NUMMER HIER
  whatsappLink="https://wa.me/41791234567"
  quoteAnchorId="quote-form"
  onTrack={track}
/>
```

---

### 2. **DynamicHero** (`src/components/DynamicHero.tsx`)
Hero Section mit Dynamic Text Replacement (DTR) basierend auf Traffic-Quelle.

**Features:**
- Liest `usePaidMode` Hook aus
- Passt Headline + Subheadline automatisch an
- Trust Badges **above the fold** (Google 5.0, Seit 1980, CHF 2 Mio. versichert)
- 3 CTA Buttons: Call, WhatsApp, Quote
- Premium Mode: Extra Box mit "Diskret, Full-Service"
- Empathetic Mode: Extra Box mit "Geduldig für Senioren"

**Beispiel-URLs:**
- `/?city=zug` → "Ihr Premium Umzug in Zug"
- `/?kw=senioren` → "Umzug für Senioren – Geduldig & Einfühlsam"
- `/area/zurich` → "Ihr Umzug in Zürich – Jetzt in 5 Min. Termin sichern"

---

### 3. **usePaidMode Hook** (`src/hooks/usePaidMode.ts`)
Intelligente Traffic-Erkennung und Content-Anpassung.

**Was er macht:**
- Liest URL-Parameter: `utm_source`, `utm_campaign`, `utm_term`, `city`, `loc`, `kw`
- Erkennt Premium-Städte: Zug, Baar, Küsnacht, etc.
- Erkennt Keywords: "senioren", "premium", etc.
- Gibt zurück: `isPaidTraffic`, `isPremiumMode`, `city`, `keyword`, `wording`

**Exported Hooks:**
```tsx
import { usePaidMode, useDynamicContent } from "@/hooks/usePaidMode";

const paidMode = usePaidMode();
// { isPaidTraffic: true, isPremiumMode: true, city: "zug" }

const content = useDynamicContent();
// { headline: "...", subheadline: "...", ctaText: "...", wording: "premium" }
```

---

### 4. **ExpressQuoteForm** (`src/components/ExpressQuoteForm.tsx`)
2-Step Form für maximale Speed-to-Lead.

**Features:**
- **Step 1:** Nur Telefon + PLZ Start/Ziel (minimale Friction)
- **Step 2:** Optional Wunschtermin
- Progress Bar (Schritt 1 von 2)
- Analytics Tracking: `form_started`, `form_completed`
- Micro-copy: "Wir rufen Sie innert 60 Minuten zurück"

**Integration:**
```tsx
import { ExpressQuoteForm } from "@/components/ExpressQuoteForm";

<ExpressQuoteForm onComplete={(data) => {
  console.log("Form submitted:", data);
  // Send to your backend
}} />
```

---

### 5. **PackageCards** (`src/components/PackageCards.tsx`)
Package-Anzeige mit Bestseller Badge und Preselection.

**Features:**
- Bestseller Badge mit Pulse-Animation
- Preselection basierend auf UTM-Parameter
- Analytics Tracking: `package_selected`
- Responsive Grid Layout

**Beispiel:**
```tsx
import { PackageCards, usePackagePreselection } from "@/components/PackageCards";

const preselected = usePackagePreselection(); // "komfort" bei Pricing-Ads

<PackageCards 
  packages={packages}
  preselectedPackage={preselected}
  onSelectPackage={(id) => console.log("Selected:", id)}
/>
```

---

### 6. **Analytics Tracking** (`src/utils/track.ts`)
Zentrales Tracking für alle Conversion Events.

**Events:**
- `cta_call_click` - Anruf-Button geklickt
- `cta_whatsapp_click` - WhatsApp-Button geklickt
- `cta_quote_click` - Offerte-Button geklickt
- `form_started` - Formular begonnen
- `form_completed` - Formular abgeschlossen
- `package_selected` - Paket ausgewählt

**Conversion Tracking:**
```tsx
import { track, trackConversion } from "@/utils/track";

track("cta_call_click", { location: "hero" });
trackConversion("AW-XXXXX/YYYYY", 990); // Google Ads Conversion
```

---

## 🎨 Implementierte Seiten

### **Index.tsx** (Homepage)
- ✅ DynamicHero statt statischer HeroSection
- ✅ ExpressQuoteForm direkt nach Hero
- ✅ Alle Komponenten laden korrekt

### **Zurich.tsx** (City Landing Page Beispiel)
- ✅ DynamicHero mit Paid Mode
- ✅ Local Proof Block ("Kennen die engen Gassen im Niederdorf")
- ✅ ExpressQuoteForm
- ✅ PackageCards mit Bestseller Badge
- ✅ Trust Section (Google 5.0, CHF 2 Mio., Seit 1980)
- ✅ Final CTA mit Telefon + WhatsApp

---

## 🚀 Wie du es nutzt

### **1. Telefonnummer anpassen**
Aktuell überall: `+41 79 123 45 67` (Beispiel)

**Ändern in:**
- `src/App.tsx` (MobileStickyCTA)
- `src/components/DynamicHero.tsx`
- Schema.org in Index.tsx

### **2. Google Analytics einrichten**
In `index.html` oder via Tag Manager:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
</script>
```

### **3. Google Ads Conversion Labels eintragen**
In `src/utils/track.ts`:
```tsx
export function trackConversion(conversionLabel: string, value?: number) {
  if (typeof window !== "undefined" && "gtag" in window) {
    // @ts-ignore
    window.gtag("event", "conversion", {
      send_to: "AW-CONVERSION-ID/LABEL", // ← DEINE CONVERSION-ID
      value: value,
      currency: "CHF",
    });
  }
}
```

### **4. Landing Pages erstellen**
Kopiere das Zürich-Beispiel für andere Städte:
- `/area/basel` → Basel-spezifische Infos
- `/area/zug` → Premium Mode automatisch aktiv
- `/area/luzern` → Standard Mode

### **5. Kampagnen-URLs strukturieren**
```
# Zürich Standard
https://feierabend-umzuege.ch/area/zurich?utm_source=google&utm_campaign=paid_zurich&utm_term=umzug+zurich

# Zug Premium (Premium Mode aktiviert)
https://feierabend-umzuege.ch/area/zug?utm_source=google&utm_campaign=paid_zug_premium

# Senioren (Empathetic Mode aktiviert)
https://feierabend-umzuege.ch/plan/senior?utm_source=google&utm_campaign=paid_senioren&kw=senioren

# Pricing (Komfort preselected)
https://feierabend-umzuege.ch/option/pricing?utm_source=google&utm_campaign=paid_pricing&utm_term=umzug+kosten
```

---

## 📊 Testing Checklist

### **Mobile Testing (WICHTIG!)**
- [ ] MobileStickyCTA erscheint am unteren Rand
- [ ] Alle 3 Buttons funktionieren (Call, WhatsApp, Quote)
- [ ] Scroll zum Formular funktioniert
- [ ] Trust Badges sichtbar ohne Scrollen

### **Dynamic Content Testing**
Test diese URLs:
- [ ] `/?city=zurich` → "Ihr Umzug in Zürich"
- [ ] `/?city=zug` → "Ihr Premium Umzug in Zug" + Premium Box
- [ ] `/?kw=senioren` → "Umzug für Senioren" + Empathetic Box
- [ ] `/area/zug` → Premium Mode aktiv (aus URL-Path)

### **Form Testing**
- [ ] Step 1: Telefon + PLZ eingeben
- [ ] Progress Bar zeigt "Schritt 1 von 2"
- [ ] Step 2: Optional Termin wählen
- [ ] Submit funktioniert (aktuell nur Simulation)

### **Analytics Testing**
Browser Console öffnen, dann klicken:
- [ ] Call Button → `📊 Track Event: cta_call_click`
- [ ] WhatsApp Button → `📊 Track Event: cta_whatsapp_click`
- [ ] Formular Start → `📊 Track Event: form_started`
- [ ] Formular Submit → `📊 Track Event: form_completed`

---

## 🎯 Nächste Schritte

### **Sofort (Quick Wins):**
1. Telefonnummer auf echte Nummer ändern
2. Google Analytics ID einsetzen
3. Server neu starten: `npm run dev`
4. Mobile testen mit Chrome DevTools (F12 → Toggle Device Toolbar)

### **Diese Woche:**
1. Google Ads Conversion Tracking Labels eintragen
2. 3-5 wichtigste City Landing Pages anpassen (Basel, Bern, Luzern)
3. ExpressQuoteForm Backend-Integration (Email/CRM)

### **Nächste 2 Wochen:**
1. Google Ads Kampagnen starten (Zürich, Zug/Baar, Luzern)
2. A/B Testing: DynamicHero vs. alte HeroSection
3. Heatmap Tool installieren (Hotjar/Microsoft Clarity)
4. Conversion Rate messen

---

## 💡 Pro-Tipps aus dem Feedback

### **"Feierabend-Effekt" als USP**
Nutze überall: "Feierabend ab dem ersten Anruf" → Kunde entspannt, ihr arbeitet.

### **Speed-to-Lead < 60 Sekunden**
Anrufe SOFORT annehmen. LSA (Local Services Ads) gewinnt nur durch schnellste Annahme.

### **Premium-Städte fokussieren**
Zug, Baar, Küsnacht = höhere Marge. Separate Kampagne mit "Diskret, Premium" Wording.

### **Message Match**
Keyword → Anzeige → Landing Page müssen identisch sein. "Umzug Zürich" → Anzeige "Umzug Zürich" → /area/zurich mit "Ihr Umzug in Zürich".

---

## 📞 Support

Wenn du Fragen hast oder etwas nicht funktioniert:
1. Check Browser Console (F12) für Fehler
2. Check Network Tab für failed API calls
3. Teste mit `npm run build` ob Production Build funktioniert

**Viel Erfolg mit der Performance-Maschine! 🚀**
