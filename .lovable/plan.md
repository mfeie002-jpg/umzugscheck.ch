
# Analyse: Fehlender Hintergrund bei Device 4 & 5 im Comparison Lab

## Status der Untersuchung

Nach Durchsicht des Screenshots und des Codes konnte ich **keinen sichtbaren Unterschied** zwischen den ersten 3 und letzten 2 Devices identifizieren:

### Was ich im Screenshot sehe:
- **Alle 5 Devices** zeigen den gleichen blauen "Winter-Aktion" Banner
- **Alle 5 Devices** haben den weissen Hero-Bereich mit "Der beste Deal der ganzen Schweiz"
- Die Hintergründe erscheinen konsistent

### Mögliche Interpretationen:

1. **Screenshot zeigt anderes Problem** - Vielleicht bezieht sich "kein Background" auf einen anderen Teil der Page der nicht im Screenshot sichtbar ist

2. **Timing-Problem** - Die letzten Devices könnten kurzzeitig ohne Background erscheinen während des staggered Loading (erste 400-800ms)

3. **Dark Mode Edge Case** - Falls du zwischen Light/Dark Mode wechselst

---

## Falls es doch ein Problem gibt - Mögliche Fixes:

### Fix A: Expliziter weisser Background für alle iframes
```tsx
// In LazyDeviceIframe - Line 160
className="relative overflow-hidden rounded-lg bg-white"
// Ändern zu:
className="relative overflow-hidden rounded-lg bg-white dark:bg-background"
```

### Fix B: Background im Device Frame Container
```tsx
// Line 675-681 - Device Frame hat bg-black (fürs Phone-Frame)
// Das innere iframe sollte bereits bg-white haben
```

### Fix C: Loading Placeholder mit solidem Hintergrund
```tsx
// Line 167-174 - Loading State
className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 z-10"
// Ändern zu:
className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-background z-10"
```

---

## Nächster Schritt

Bitte beschreibe genauer:
1. **Was genau** bei Device 4 und 5 anders aussieht
2. **Wann** das passiert (sofort, nach Scroll, bei Refresh?)
3. Ob es nur bei bestimmten **Pages** (HP5/HP6) passiert oder auch bei anderen

Mit dieser Info kann ich einen präzisen Fix implementieren.
