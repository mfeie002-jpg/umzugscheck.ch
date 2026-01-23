# Vision PDF Export Optimization

## Problem
Der PDF-Export von `/vision` hat Content zwischen Seiten abgeschnitten, weil große Sections als einzelne Bilder erfasst und dann mathematisch aufgeteilt wurden - ohne Rücksicht auf wichtige Elemente (Karten, Überschriften, Karten etc.).

## Lösung: Semantische Section-Erfassung

### Ansatz
Anstatt große Sections als ein Bild zu erfassen und zu zerschneiden, erfassen wir jetzt **kleinere, logische Einheiten** (jede Karte einzeln) und positionieren sie intelligent auf A4-Seiten.

### Implementierte Änderungen

#### 1. Neue PDF-Export Logik (`src/lib/vision-pdf-export.ts`)

**Hinzugefügt:**
- `CAPTURABLE_SELECTORS`: Liste aller erfassbaren Elemente (10 USP-Karten, 10 Investor-Pillars, etc.)
- `CapturedElement` Interface für strukturierte Element-Daten
- `captureIndividualElements()`: Erfasst einzelne Karten basierend auf `data-pdf-section` Attributen
- `addElementsIntelligently()`: Intelligente Seitenpositionierung mit automatischen Seitenumbrüchen

**Logik:**
```typescript
// Für jedes Element prüfen:
if (currentY + elementHeight > pageHeight - margin) {
  // Passt nicht mehr auf aktuelle Seite → neue Seite beginnen
  pdf.addPage();
  currentY = margin;
}

// Element hinzufügen mit 5mm Abstand zum nächsten
pdf.addImage(element.imageData, 'JPEG', margin, currentY, width, height);
currentY += height + 5;
```

**Fallback:**
Falls keine einzelnen Elemente gefunden werden, greift die alte Methode (ganze Sections erfassen).

#### 2. data-pdf-section Attribute hinzugefügt

**Geänderte Komponenten:**

- **CustomerUSPVisualCards.tsx**: Jede Karte hat `data-pdf-section="customer-usp-{1-10}"`
- **InvestorPillarVisualCards.tsx**: Jede Karte hat `data-pdf-section="investor-pillar-{1-10}"`
- **FamilySummary.tsx**: Section hat `data-pdf-section="family-summary"`
- **RevenueStreamExamples.tsx**: Section hat `data-pdf-section="revenue-stack"`

**Beispiel:**
```tsx
<motion.div
  className="..."
  data-pdf-section={`customer-usp-${index + 1}`}
>
  {/* Card content */}
</motion.div>
```

### Vorteile

✅ **Kein Content mehr durchgeschnitten** - Jede Karte wird als eigenständige Einheit behandelt  
✅ **Intelligente Seitenumbrüche** - Algorithmus prüft vor jedem Element, ob es auf die Seite passt  
✅ **Professional A4-Layout** - Konsistente Margins (10mm) auf allen Seiten  
✅ **Graceful Fallback** - Falls `data-pdf-section` fehlt, nutzt das System die alte Methode  
✅ **Performance** - Nur relevante Elemente werden erfasst  

### Wie es funktioniert

1. **User klickt auf PDF-Export Button**
2. System sucht nach allen Elementen mit `data-pdf-section` Attributen
3. Jedes Element wird einzeln als Canvas erfasst
4. System berechnet Höhe jedes Elements in mm (für A4)
5. Beim Hinzufügen zum PDF:
   - Prüfen ob Element auf aktuelle Seite passt
   - Falls nein → neue Seite starten
   - Element einfügen mit 5mm Abstand
6. PDF wird generiert und heruntergeladen

### Testing

**Manueller Test:**
1. Gehe zu `/vision`
2. Klicke auf den "PDF herunterladen" Button (Auge-Icon)
3. Wähle "Alle Tabs öffnen" oder nicht
4. Überprüfe das generierte PDF:
   - Keine durchgeschnittenen Karten
   - Saubere Seitenumbrüche
   - Konsistente Margins

### Erweiterbarkeit

Um weitere Sections/Elemente zum PDF hinzuzufügen:

1. **Füge `data-pdf-section` Attribut hinzu:**
   ```tsx
   <div data-pdf-section="meine-neue-section">
     {/* Content */}
   </div>
   ```

2. **Registriere in `CAPTURABLE_SELECTORS`:**
   ```typescript
   const CAPTURABLE_SELECTORS = [
     // ... existing
     { 
       selector: '[data-pdf-section="meine-neue-section"]', 
       title: 'Meine Neue Section',
       group: 'custom'
     },
   ];
   ```

Das wars! Das System erfasst automatisch das neue Element.

## Technische Details

- **Bibliotheken**: `html2canvas` (Erfassung), `jsPDF` (PDF-Generierung)
- **Format**: A4 Portrait (210mm × 297mm)
- **Margins**: 10mm auf allen Seiten
- **Bildqualität**: JPEG 95%, Scale 2x für HiDPI
- **Spacing**: 5mm zwischen Elementen

## Alternative Ansätze (nicht implementiert)

### B) CSS Print Styles
```css
@media print {
  .usp-card {
    page-break-inside: avoid;
  }
}
```
**Vorteile**: Weniger Code  
**Nachteile**: Browser-abhängig, weniger Kontrolle

### C) Text-basiertes PDF
Nur Text/Vektoren ohne Screenshots.  
**Vorteile**: Kleinere Dateigröße, perfekte Qualität  
**Nachteile**: Verliert visuelle Styling (Bilder, Farbverläufe)

## Wartung

- Bei Layout-Änderungen der Karten: `data-pdf-section` Attribute beibehalten
- Bei neuen Vision-Sections: Attribute hinzufügen für PDF-Erfassung
- Bei Problemen: Console checken für Warnungen von `captureIndividualElements()`
