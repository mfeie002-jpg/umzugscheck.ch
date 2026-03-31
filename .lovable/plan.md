
Ziel

Den Mobile-Fehler an der eigentlichen Ursache beheben — nicht nochmals nur Abstände im Hero nachjustieren.

Was ich gefunden habe

- Das Screenshot-Problem ist sehr wahrscheinlich kein reines Hero-Alignment-Problem.
- Der schwebende rechte Hinweis „Rechner“ und die Dots über dem Bottom-Bereich passen exakt zu `src/components/mobile/SwipeNavigationWrapper.tsx`.
- Diese Elemente werden global über das Layout eingeblendet und legen sich auf die Homepage-Hero-Fläche.
- Deshalb wirkt Mobile „immer noch off“, selbst wenn der Hero selbst schon mehrfach angepasst wurde.
- Bereits ausgeschlossen als Hauptursache auf `/`:
  - `UnifiedABToggle` ist auf Mobile aus
  - `MobileSearchButton` ist auf `/` aus
  - `StickyContactBar` ist Mobile-ausgeblendet
  - `AIMovingAssistant` ist Desktop-only

Plan

1. Swipe-Overlay auf Funnel-Routen entfernen
- Die seitlichen Swipe-Hinweise und den Dot-Pager auf der mobilen Homepage und auf Funnel-Routen ausblenden.
- Betroffen zuerst:
  - `/`
  - zentrale Offerten-/Rechner-/Vergleichs-Routen
- Dadurch verschwinden genau die Elemente, die im Screenshot über dem Formular liegen.

2. Gemeinsame Mobile-Overlay-Regel einführen
- Eine zentrale Route-Policy für globale Fixed-Elemente definieren.
- Darüber steuern, was auf hero-/funnel-kritischen Seiten erscheinen darf:
  - `SwipeNavigationWrapper`
  - `MobileBottomNav`
  - `MobileStickyBar`
  - `ScrollToTop`
  - weitere Floating-Elemente

3. Fix auf Layout-Ebene statt nur im Hero
- Die Korrektur bewusst nicht nur in `PremiumHeroSection` machen.
- So greifen die Regeln für alle Homepage-Varianten A/B/C und das Problem kommt nicht bei der nächsten Variant wieder zurück.

4. Mobile QA auf echten Engpässen
- Danach gezielt für schmale Mobile-Breiten prüfen:
  - kein „Rechner“-Pill mehr über dem Hero
  - keine Dot-Navigation über Inputs
  - Bottom Nav / Sticky CTA stapeln sich nicht in den Hero hinein
  - keine horizontale Verschiebung bei 339px+

Technische Details

- Hauptdatei: `src/components/mobile/SwipeNavigationWrapper.tsx`
- Wahrscheinlich mitzubereinigen:
  - `src/App.tsx`
  - `src/components/homepage/MobileStickyBar.tsx`
  - `src/components/MobileBottomNav.tsx`
  - `src/components/ScrollToTop.tsx`
- Bestes Vorgehen: kleine gemeinsame Liste für „critical mobile routes“ einführen und diese für alle globalen Overlays wiederverwenden.

Ergebnis

- Die Mobile-Homepage wird wieder sauber ausgerichtet, weil die störende Wrapper-Ebene entfernt wird.
- Künftige Mobile-Fixes werden stabiler, weil Overlap-Regeln an einer Stelle gepflegt werden statt verteilt per Einzel-Patch.
