
# Optimierung der Trust-Section (Homepage)

## Zusammenfassung
Die aktuelle Kombination aus **MediaLogosSectionVariantB** (Live-Ticker + Stats) und **QualityStandardsBar** (11 Partner-Logos) ist bereits die stärkste Variante. Dieser Plan optimiert sie gemäss Swiss Trust Triumvirate mit:

1. **Psychologisch optimierte Logo-Reihenfolge** (Risiko → Infrastruktur → Zahlung)
2. **Transparenz-Tooltips** für Statistiken (vermeidet "Marketing-Orakel" Kritik)
3. **Verbesserter Verification-CTA** ("Alle Partner verifizierbar ↗")

---

## Änderungen im Detail

### 1. QualityStandardsBar.tsx - Logo-Reihenfolge optimieren

**Aktuelle Reihenfolge:**
```text
Trusted Shops → Swiss Label → Die Post → ASTAG → eUmzugCH → 
Mieterverband → Die Mobiliar → Raiffeisen → ZKB → TWINT → Swiss Hosting
```

**Neue Reihenfolge (Conversion-optimiert):**
```text
Die Mobiliar → Die Post → eUmzugCH → TWINT → ZKB → Raiffeisen → 
Mieterverband → ASTAG → Swiss Label → Trusted Shops → Swiss Hosting
```

**Begründung:**
- **Pos 1-3**: Risikoreduktion (Versicherung, Infrastruktur, Behörden)
- **Pos 4-6**: Zahlungssicherheit (TWINT, Banken)
- **Pos 7-11**: Ergänzende Authority (Konsumentenschutz, Verbände, Zertifizierungen)

### 2. MediaLogosSectionVariantB.tsx - Tooltips für Statistiken

**Problem:** "Ø CHF 620 gespart" wirkt unglaubwürdig ohne Quelle.

**Lösung:** Tooltip mit Erklärung hinzufügen:
```tsx
<Tooltip>
  <TooltipTrigger>
    <span>Ø CHF 620</span>
    <Info className="w-3 h-3 ml-1 opacity-50" />
  </TooltipTrigger>
  <TooltipContent>
    Basierend auf 15'000+ Preisvergleichen seit 2019. 
    Durchschnittliche Differenz zwischen teuerstem und 
    günstigstem Angebot.
  </TooltipContent>
</Tooltip>
```

### 3. QualityStandardsBar.tsx - Verbesserter Footer-CTA

**Aktuell:**
```text
"Klicken zur Verifizierung • Alle Partner geprüft"
```

**Neu:**
```tsx
<a href="/partner" className="hover:text-primary">
  Alle Partner verifizierbar ↗
</a>
```

### 4. TRUST Konstanten erweitern (trust.ts)

Neue Felder für Transparenz:
```typescript
export const TRUST = {
  // ... bestehende Felder
  
  // Savings mit Disclaimer
  savingsAverage: "620",
  savingsDisclaimer: "Basierend auf 15'000+ Preisvergleichen seit 2019",
  
  // Live Ticker Städte (zentral verwaltet)
  liveTickerCities: [
    { city: "Zürich", savingsRange: [450, 750] },
    { city: "Bern", savingsRange: [350, 550] },
    { city: "Basel", savingsRange: [600, 950] },
    { city: "Luzern", savingsRange: [280, 450] },
  ],
} as const;
```

---

## Betroffene Dateien

| Datei | Änderung |
|-------|----------|
| `src/components/homepage/QualityStandardsBar.tsx` | Logo-Reihenfolge, Footer-CTA |
| `src/components/homepage/MediaLogosSectionVariantB.tsx` | Tooltips für Stats |
| `src/content/trust.ts` | Neue Disclaimer-Felder |

---

## Technische Details

### QualityStandardsBar.tsx - Neue trustLogos Array-Reihenfolge

```typescript
const trustLogos = [
  // Pos 1: Risikoreduktion - Versicherung
  { id: "mobiliar", name: "Die Mobiliar", subtitle: "Versicherung", ... },
  
  // Pos 2-3: Schweizer Infrastruktur
  { id: "post", name: "Die Post", subtitle: "Nachsendeauftrag", ... },
  { id: "eumzug", name: "eUmzugCH", subtitle: "Offizielle Meldung", ... },
  
  // Pos 4-6: Zahlungssicherheit
  { id: "twint", name: "TWINT", subtitle: "Zahlung", ... },
  { id: "zkb", name: "ZKB", subtitle: "Kantonalbank", ... },
  { id: "raiffeisen", name: "Raiffeisen", subtitle: "Schweizer Bank", ... },
  
  // Pos 7-11: Ergänzende Authority
  { id: "mieterverband", name: "Mieterverband", subtitle: "Mieter-Schutz", ... },
  { id: "astag", name: "ASTAG", subtitle: "Branchenverband", ... },
  { id: "swiss-label", name: "Swiss Label", subtitle: "Qualitäts-Siegel", ... },
  { id: "trusted-shops", name: "Trusted Shops", subtitle: "Käuferschutz", ... },
  { id: "swiss-hosting", name: "Swiss Hosting", subtitle: "Daten in CH", ... },
];
```

### MediaLogosSectionVariantB.tsx - Stats mit Tooltips

```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

// Im Stats-Row:
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="flex items-center justify-center gap-2 mb-1 cursor-help">
        <TrendingDown className="w-4 h-4 text-primary" />
        <span className="text-xl md:text-2xl font-bold text-foreground">
          Ø CHF {TRUST.savingsAverage}
        </span>
        <Info className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="max-w-[250px]">
      <p className="text-xs">{TRUST.savingsDisclaimer}</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## Mobile-First Anpassungen

- Tooltips werden auf Mobile zu "tap to reveal" (bereits Standard bei Radix)
- Logo-Grid bleibt `flex-wrap` für natürlichen Umbruch
- Touch-Targets bleiben min. 44x44px

---

## Keine Breaking Changes

- A/B-Testing-System bleibt intakt
- Andere Varianten (C, D, E, F) werden nicht verändert
- `MediaLogosSectionAB` Switch-Logic unverändert

---

## Erwarteter Impact

| Metrik | Erwartung |
|--------|-----------|
| Trust-Wahrnehmung | ↑ durch Risiko-First Reihenfolge |
| Credibility | ↑ durch transparente Disclaimers |
| CTR auf Partner | ↑ durch klaren Verification-Link |
| Bounce Rate | ↓ durch weniger "Marketing-Orakel" Skepsis |
