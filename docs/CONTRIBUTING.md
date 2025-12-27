# Contributing Guide – Umzugscheck.ch

> Jede Contribution muss dem Archetyp-Standard entsprechen.

---

## 🎯 Vor dem Coden

### Frage dich:

1. **Ist das die Referenzlösung?** – Warum würden andere genau das kopieren?
2. **Denke ich in Systemen?** – Nicht in Features, nicht in Seiten
3. **Ist es maximal klar?** – Jeder Klick hat Zweck, jede Sekunde spart Energie
4. **Gibt es eine bessere Lösung?** – Wenn ja, finde sie

---

## 📋 Code Standards

### TypeScript

```typescript
// ✅ Gut: Explizite Typen, klare Struktur
interface CompanyCardProps {
  company: Company;
  variant?: 'default' | 'compact' | 'featured';
  onSelect?: (id: string) => void;
}

// ❌ Schlecht: any, implizite Typen
const CompanyCard = (props: any) => { ... }
```

### Komponenten

```typescript
// ✅ Gut: Kleine, fokussierte Komponenten
export const CompanyRating = ({ rating, reviewCount }: Props) => (
  <div className="flex items-center gap-2">
    <Stars rating={rating} />
    <span className="text-muted-foreground">({reviewCount})</span>
  </div>
);

// ❌ Schlecht: Monolithische Komponenten mit 500+ Zeilen
```

### Styling

```typescript
// ✅ Gut: Design System Tokens
<div className="bg-primary text-primary-foreground rounded-lg p-4">

// ❌ Schlecht: Hardcoded Werte
<div className="bg-blue-500 text-white rounded-[8px] p-[16px]">
```

---

## 🔄 Workflow

### 1. Vor der Änderung

- [ ] Verstehe das bestehende System
- [ ] Prüfe ob ähnliche Lösung existiert
- [ ] Plane die minimale Änderung

### 2. Während der Änderung

- [ ] Folge dem Design System
- [ ] Schreibe selbstdokumentierenden Code
- [ ] Teste auf Mobile + Desktop

### 3. Nach der Änderung

- [ ] Prüfe Performance-Impact
- [ ] Entferne Dead Code
- [ ] Dokumentiere wenn nötig

---

## 🎨 Design System Nutzung

### Farben

```typescript
// Verwende IMMER semantic tokens
className="text-foreground"        // Nicht: text-gray-900
className="bg-primary"             // Nicht: bg-blue-600
className="border-border"          // Nicht: border-gray-200
```

### Spacing

```typescript
// Verwende Tailwind Scale
className="p-4 gap-6 mt-8"         // Nicht: p-[15px] gap-[22px]
```

### Typography

```typescript
// Verwende definierte Klassen
className="text-lg font-heading"   // Nicht: text-[18px] font-serif
```

---

## 📁 Datei-Organisation

### Neue Komponente erstellen

```
src/components/
└── companies/
    ├── CompanyCard.tsx           # Hauptkomponente
    ├── CompanyCard.types.ts      # TypeScript Typen
    ├── CompanyCardSkeleton.tsx   # Loading State
    └── index.ts                  # Export
```

### Hook erstellen

```
src/hooks/
└── useCompanyData.ts             # Query + Mutation Logic
```

---

## ⚠️ Verboten

- `any` Types ohne Begründung
- Inline Styles
- Hardcoded Farben/Sizes
- Kopierte Code-Blöcke (→ Komponente erstellen)
- Console.logs in Production
- Unbehandelte Errors
- Fehlende Loading States

---

## ✅ Erwünscht

- Kleine, fokussierte PRs
- Selbsterklärender Code
- TypeScript strict mode
- Accessibility-Attribute
- Performance-Bewusstsein
- Proaktive Optimierungsvorschläge

---

## 🏆 Archetyp-Check

Bevor du fertig bist, frage:

> „Würde ich das als Referenz-Implementation zeigen?"

Wenn nein → weiter optimieren.
