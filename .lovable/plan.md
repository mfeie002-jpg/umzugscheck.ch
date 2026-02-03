
# Flow-Auswahl im A/B Comparison Lab

## Übersicht

Du möchtest im Comparison Lab nicht nur Homepage-Varianten, sondern auch **Offerten-Flows** (V1-V9, Subvarianten, Premium Flows etc.) auswählen können. Damit kannst du verschiedene Flow-Varianten nebeneinander vergleichen.

---

## Was wird hinzugefügt

### 1. Neuer Flow-Selektor pro Device
Jedes Device erhält ein zusätzliches Dropdown-Menü zur Auswahl des Offerten-Flows:
- **Kategorien**: Gruppiert nach Flow-Familie (V1, V2, V3... V9, Premium, Golden)
- **Alle Varianten**: Inkl. Subvarianten (V1a, V1b, V2e, etc.)
- **Premium-Flows**: Swiss Premium Choice, Swiss Lightning, ChatGPT Flows, Ultimate Best36

### 2. Neue Flow-Kategorien im Selector
```
── V1 Familie ──
   V1 Control
   V1a Feedback
   V1b ChatGPT
   V1c Strategic
   ...
── V9 Familie ──
   V9 Zero Friction
   V9a-V9d
── Premium ──
   Swiss Premium Choice
   Swiss Lightning
   Swiss Concierge Hybrid
── Ultimate ──
   Ultimate Best36
   Golden Flow V10
```

### 3. Neue Presets
- **"Top Flows"**: Die 5 besten Flow-Varianten (V9, V10 Golden, Ultimate Best36, Swiss Premium, V2.e Chat)
- **"V1 Familie"**: Alle V1-Subvarianten nebeneinander
- **"Premium Flows"**: Swiss Premium, Lightning, Concierge, ChatGPT

### 4. URL-Routing Logik
Wenn ein Flow ausgewählt ist, wird das Device zum entsprechenden Pfad geroutet:
- Flow V1: `/umzugsofferten-v1`
- Flow V9a: `/umzugsofferten-v9a`
- Golden Flow: `/golden-flow-v10`
- Swiss Premium: `/swiss-premium-choice`

---

## Technische Umsetzung

### Änderungen in `ABComparisonLab.tsx`

1. **Neue Konstante `FLOW_VARIANTS`** mit allen verfügbaren Flows (ca. 40+ Varianten), gruppiert nach Familie

2. **Erweiterung des `DeviceConfig` Interface**:
```typescript
interface DeviceConfig {
  // ... existing fields
  flow: string; // NEW: Flow variant ID ('none' | 'v1' | 'v1a' | 'swiss-premium' | etc.)
}
```

3. **Neuer Flow-Selector** im Device-Header (neben Page/Nav/Social selectors)

4. **Angepasste `buildDeviceUrl` Funktion**:
- Wenn `flow !== 'none'` → Route zum Flow-Pfad statt Homepage
- Behält Navigation & Social Proof params bei

5. **Neue Preset-Buttons**:
- "Top Flows" 
- "V1 Varianten"
- "Premium Flows"

### Datenstruktur für Flow-Varianten

```typescript
const FLOW_VARIANTS = [
  // Homepage (default)
  { id: 'none', label: '— Homepage', path: null, group: 'default' },
  
  // V1 Familie
  { id: 'v1', label: 'V1 Control', path: '/umzugsofferten-v1', group: 'v1' },
  { id: 'v1a', label: 'V1a Feedback', path: '/umzugsofferten-v1a', group: 'v1' },
  { id: 'v1b', label: 'V1b ChatGPT', path: '/umzugsofferten-v1b', group: 'v1' },
  // ... alle V1 Subvarianten
  
  // V2 Familie
  { id: 'v2', label: 'V2 Premium', path: '/umzugsofferten-v2', group: 'v2' },
  { id: 'v2e', label: 'V2.e Chat', path: '/umzugsofferten-v2e', group: 'v2' },
  
  // ... V3-V9
  
  // Premium Flows
  { id: 'swiss-premium', label: 'Swiss Premium Choice', path: '/swiss-premium-choice', group: 'premium' },
  { id: 'swiss-lightning', label: 'Swiss Lightning', path: '/swiss-lightning', group: 'premium' },
  { id: 'swiss-concierge', label: 'Swiss Concierge Hybrid', path: '/swiss-concierge-hybrid', group: 'premium' },
  
  // ChatGPT Flows
  { id: 'chatgpt-1', label: 'ChatGPT Flow 1', path: '/chatgpt-flow-1', group: 'chatgpt' },
  { id: 'chatgpt-2', label: 'ChatGPT Flow 2', path: '/chatgpt-flow-2', group: 'chatgpt' },
  { id: 'chatgpt-3', label: 'ChatGPT Flow 3', path: '/chatgpt-flow-3', group: 'chatgpt' },
  
  // Ultimate / Golden
  { id: 'ultimate-best36', label: 'Ultimate Best36', path: '/umzugsofferten-ultimate-best36', group: 'ultimate' },
  { id: 'golden-v10', label: 'V10 Golden Flow', path: '/golden-flow-v10', group: 'ultimate' },
];
```

---

## UI Design

### Flow-Selector (neues Dropdown)
- Position: Unter dem "Page" Selector
- Gruppiert mit `<SelectGroup>` nach Flow-Familie
- Badge für Premium-Flows (⭐)
- Wenn Flow ausgewählt → Page-Selector wird disabled (greyed out)

### Angepasstes Device Label
```
Aktuell: "HP1-N10-SI"
Neu mit Flow: "V9a-N10-SI" oder "Swiss-N10-SI"
```

---

## Betroffene Dateien

| Datei | Änderung |
|-------|----------|
| `src/pages/internal/ABComparisonLab.tsx` | Haupt-Implementation |

---

## Ergebnis

Nach der Implementation kannst du:
1. Jeden Device auf einen anderen Flow stellen
2. Flows nebeneinander vergleichen (z.B. V1a vs V9a vs Swiss Premium)
3. Quick-Presets nutzen ("Top Flows", "V1 Familie")
4. Homepage UND Flow im selben Lab mischen
