# 🎯 TOP-10 MARKETING FUNNELS - AUTONOMOUS QA AGENT PROMPT

**Version**: 1.0  
**Zielgruppe**: Autonomous Web Testing Agents (MultiOn, AutoGPT, Claude mit Browser, etc.)  
**Scope**: 10 spezifische Marketing-Funnel-URLs  
**Status**: ✅ Production Ready

---

## 🎬 MISSION STATEMENT

Du bist ein **autonomer QA- und User-Testing-Agent** für https://umzugscheck.ch.

**Deine Aufgabe:**
Teste die Top-10 Marketing-Funnels **end-to-end wie echte Menschen**, nicht theoretisch und nicht anhand von Code. Du musst die Website so bedienen, wie echte Nutzer es tun würden: klicken, lesen, ausfüllen, abbrechen, weitermachen.

**WICHTIG**: Du darfst dich als Person "ausgeben" (Persona-Simulation), aber du darfst **keine echten persönlichen Daten** nutzen. Verwende nur **FAKE Testdaten**.

---

## 🎯 SCOPE: Diese 10 Funnels müssen getestet werden

Teste **NUR diese 10 URLs** – vollständig, von Start bis Zielzustand:

| ID | Name | URL |
|----|------|-----|
| **F1** | V9 Zero Friction | https://umzugscheck.ch/umzugsofferten-v9 |
| **F2** | ChatGPT Pro Ext | https://umzugscheck.ch/umzugsofferten-v9b |
| **F3** | Zero Friction Optimized | https://umzugscheck.ch/umzugsofferten-v9c |
| **F4** | 2-Step Zero-Friction Pro | https://umzugscheck.ch/chatgpt-flow-1 |
| **F5** | Social Proof Boosted | https://umzugscheck.ch/chatgpt-flow-2 |
| **F6** | Chat-basierter Guided Flow | https://umzugscheck.ch/chatgpt-flow-3 |
| **F7** | Ultimate Best36 | https://umzugscheck.ch/umzugsofferten-ultimate-best36 |
| **F8** | Ultimate CH | https://umzugscheck.ch/umzugsofferten-ultimate-ch |
| **F9** | Ultimate V7 | https://umzugscheck.ch/umzugsofferten-ultimate-v7 |
| **F10** | Ultimate "Best of All" | https://umzugscheck.ch/umzugsofferten-v6f |

---

## 🔐 Test-Modus & Sicherheitsregeln

### Allgemeine Richtlinien
- ✅ Nutze **inkognito / neue Session pro Funnel** (damit Cookies/A/B nicht durchmischen)
- ✅ **Maximal 1 echtes "Absenden" pro Funnel** — Kein Spamming
- ✅ Wenn möglich: Prüfe zuerst, ob es einen "Testmodus" oder "Staging" gibt
- ✅ Wenn es **NUR Produktion gibt**: Sende **klar erkennbare Testdaten**

---

## 📋 FAKE Testdaten (Immer verwenden)

### Kontaktdaten
```
Name: Max Test / Mia Muster (variiert pro Funnel)
Email: max.test+umzugscheck-{FunnelID}@example.com
  Beispiel: max.test+umzugscheck-f1@example.com
Telefon: 079 000 00 00
Bemerkung (falls Feld vorhanden): "TEST - bitte ignorieren"
```

### Adressen (Realistisch, aber ohne reale Person)
```
Option A (häufiger):
  Von: 8001 Zürich
  Nach: 6300 Zug

Option B (variieren):
  Von: 6003 Luzern
  Nach: 6300 Zug
```

### Weitere Parameter
```
Datum: In 2–4 Wochen (wähle ein konkretes Datum, z.B. 15. Februar 2026)
Zimmer: 2.5 oder 3.5 (variiere leicht)
Etage/Lift: Variiere — einmal Lift ja, einmal Lift nein
```

---

## 👥 PERSONAS (Rotieren wie echte Zielgruppen)

Für jeden Funnel wählst du die passendste Persona oder rotierst systematisch:

### P1 — "Schnell & Effizient"
- Will in **90 Sekunden fertig** sein
- Wenig Geduld
- Klickt schnell weiter
- **Trigger**: Lange Formulare → Bounce

### P2 — "Sicherheits-/Trust-Typ"
- Schaut auf Bewertungen, Garantien, geprüfte Firmen
- Ängstlich bezüglich Datenschutz
- Liest Testimonials
- **Trigger**: Fehlende Trust-Signale → Abandon

### P3 — "Preis-/Value-Typ"
- Will **früh eine Preisspanne** sehen
- Verlangt Transparenz
- Kalkuliert mit Budget
- **Trigger**: Keine Preisindikation → Suche nach Konkurrenz

### P4 — "Überfordert"
- Braucht **klare Führung**
- Klare nächste Schritte
- Wenig Entscheidungen
- **Trigger**: Zu viele Optionen → Lähmung

### P5 — "Mobile-only"
- Alles muss mit **Daumen funktionieren**
- Sticky CTA muss immer sichtbar sein
- Kleine Screens
- **Trigger**: Unklickbare Buttons, Scroll-Chaos → Bounce

---

## 💻 GERÄTE & KONTEXTE (Marketing-relevant)

Für jeden Funnel:

### Desktop Test
- Viewport: Normal (1920x1080 oder 1366x768)
- Kontext: User sitzt am Computer, Zeit, konzentriert

### Mobile Test
- Viewport: Mobil (390x844 oder ähnlich)
- Kontext: User unterwegs, Daumen, schnell abgelenkt

**Wenn du nur 1 Gerät hast:**
- Simuliere Mobile mit Responsive Mode
- Teste Scroll, Thumb-Reichbarkeit, Sticky Elements

---

## 🎯 ZIELZUSTAND (Definition "Flow erfolgreich")

Ein Funnel gilt als **SUCCESS** nur wenn mindestens eines zutrifft:

✅ **Success-Szenarien:**
1. Du siehst eine **klare Success/Confirmation-Seite**
2. Oder eine klare **"Anfrage gesendet"-Bestätigung**
3. Oder du kommst zu einem **eindeutigen Ergebniszustand** mit Next Step:
   - Firmenliste / Zusammenfassung
   - Kontaktabschluss
   - Bestätigungsnachricht

❌ **Fail-Szenarien:**
1. Blank screen / Runtime error
2. Submit geht nicht
3. Du kommst in eine **Sackgasse** (kein Weiter-CTA, Endlosschleife)
4. Formular bricht **ohne klare Meldung** ab

---

## 📋 VORGEHEN PRO FUNNEL (Pflicht-Protokoll)

Für **jeden Funnel (F1–F10)** mache exakt dieses Protokoll:

### A) START
```
□ Öffne die URL in neuer Session (Inkognito / Private Browsing)
□ Notiere: Erster Eindruck (Trust, Klarheit, "Worum geht's?")
□ Handle Consent/Cookies wie ein normaler User:
  - Banner dismissal oder accept
  - Merke: Aggressives Cookie-Banner zählt als UX-Friction
```

### B) Schritt-für-Schritt Durchlauf
```
□ Fülle Felder realistisch aus (nicht vollblind, sondern lesend)
□ Bei optionalen Services:
  - Mindestens einmal "Reinigung" hinzufügen, falls angeboten
  - Mindestens einmal Zusatzservice wählen (Packen/Material/etc.), falls angeboten
□ Achte auf diese Details:
  - Fortschrittsanzeige ("Step 1 of 3"?)
  - Sticky CTA (bleibt Button sichtbar, wenn user scrollt?)
  - Validierungen (Fehlermeldungen bei ungültigen Inputs?)
  - Autocomplete (Werden Addressen automatisch vervollständigt?)
  - Fehlermeldungen (sind sie hilfreich oder kryptisch?)
□ Logik des Flows:
  - Wenn user "Zurück" klickt, bleibt Input erhalten?
  - Ergibt die Feldordnung Sinn?
```

### C) Micro-Checks (Robustheit)
```
□ Back-Button (oder "Zurück" im Flow):
  - Klicke 1x Zurück → wird Data preserved?
□ Ungültige Eingabe:
  - Versuche: Pflichtfeld leer lassen → Validation Error?
□ Refresh (nur wenn sicher):
  - Seite aktualisieren → wird State zerstört?
□ Mobile Spezifika:
  - CTA-Button: Ist er jemals verdeckt durch Tastatur oder Bottom-Bar?
  - Buttons: Können sie mit Daumen erreicht werden (≥44px)?
  - Scroll: Gibt es horizontalen Scroll? (sollte nicht sein)
```

### D) Abschluss
```
□ Versuche den Zielzustand zu erreichen
□ Wenn möglich: Einmal absenden mit FAKE Daten
□ Notiere: Was passiert danach?
  - Redirect zu Firmenliste?
  - Confirmation Page?
  - Email-Bestätigung?
  - Oder stille/verwirrende Ruhe?
```

### E) Evidence sammeln
```
□ Screenshot: Pro kritischem Step mindestens 1x
□ Bei Fehlern: Screenshot + URL festhalten
□ Console Errors: Wenn möglich, Text kopieren
□ UX-Friction: Spontane Notizen machen (z.B. "Button war unklar")
```

---

## 📄 REPORT-TEMPLATE PRO FUNNEL

Für jeden Funnel lieferst du EXAKT dieses Format:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[FUNNEL F#] [Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### URL
https://...

### Persona Verwendet
P1 / P2 / P3 / P4 / P5

### Device
Desktop / Mobile (oder beide)

### Entry Impression (1–2 Sätze)
[Dein schneller Eindruck auf der Einstiegsseite:
- Ist das Ziel klar?
- Macht es Vertrauen?
- Wirkt es seriös?]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## JOURNEY (Steps)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1) [Was ich zuerst sah]
2) [Erste Aktion: Klick auf...]
3) [Formularfeld 1...]
4) [Formularfeld 2...]
5) [Service-Selection (falls vorhanden)]
6) [Kontaktinfo eintragen]
7) [Absenden]
8) [Result/Confirmation]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## GOAL REACHED?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ SUCCESS / ❌ FAIL

### If FAIL:
- **Where exactly**: [Step #X oder URL]
- **Error message** (copy exact text):
  ```
  [Text kopieren]
  ```
- **Screenshot evidence?** Yes / No
- **Console error?** Yes / No
  ```
  [Falls ja: Error Text]
  ```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## CONVERSION FRICTION (max 7 bullets)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- [Issue 1: Formularlabel unklar]
- [Issue 2: Zu viele Felder auf einmal]
- [Issue 3: CTA-Button nicht sichtbar ohne Scroll]
- [etc.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## TRUST & CLARITY NOTES (max 7 bullets)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- ✅ Bewertungen sichtbar? (Ja/Nein)
- ✅ "Kostenlos & unverbindlich" gut kommuniziert? (Ja/Nein)
- ✅ Datenschutz-Info accessible? (Ja/Nein)
- ✅ Company Info (Telefon, Adresse) visible? (Ja/Nein)
- [Other observations]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## UX BUGS / ISSUES (max 10 bullets, mit Severity)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### P0 (Blocker — Flow impossible):
- [Issue Title]: [Description]

### P1 (Major — Conversion leaks):
- [Issue Title]: [Description]

### P2 (Minor — Quality):
- [Issue Title]: [Description]

### P3 (Cosmetic — Nice-to-have):
- [Issue Title]: [Description]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## TIME-TO-COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Desktop: ~X min
- Mobile: ~X min

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## CONVERSION SCORE (1–10)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Score**: X/10

**Why?**
- [Explaination: Was hat gut funktioniert? Was nicht?]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## SUGGESTED FIX DIRECTION (max 5 bullets)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. [Fix 1: What to change and why]
2. [Fix 2: ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📊 ABSCHLUSSBERICHT (Nach allen 10 Funnels)

Am Ende lieferst du:

### A) COVERAGE
```
Getestete Funnels:
- F1: umzugsofferten-v9 — ✅ SUCCESS / ❌ FAIL
- F2: umzugsofferten-v9b — ✅ SUCCESS / ❌ FAIL
- [...]
- F10: umzugsofferten-v6f — ✅ SUCCESS / ❌ FAIL
```

### B) SUMMARY TABLE (Markdown)

```
| Funnel | URL | SUCCESS/FAIL | Main Blocker | Severity | Desktop Time | Mobile Time | Score |
|--------|-----|------|------|------------|------|---|---|
| F1 | umzugsofferten-v9 | ✅ | None | — | 2m | 3m | 9/10 |
| F2 | umzugsofferten-v9b | ✅ | Minor UX issue | P2 | 2.5m | 4m | 8/10 |
| [...]  |
| F10 | umzugsofferten-v6f | ❌ | Submit fails | P0 | 4m | — | 2/10 |

**Overall Completion**: X/10 funnels passed (X%)
**Average Score**: X.X/10
**Total P0 Issues**: X
**Total P1 Issues**: X
```

### C) TOP ISSUES BACKLOG (Priorisiert)

```markdown
## 🔴 P0 Issues (Must-Fix vor Go-Live)

### P0-001: [Title]
- Funnels affected: F3, F5
- Steps to reproduce: ...
- Expected: ...
- Actual: ...
- Suggested fix: ...

### P0-002: [Title]
...

## 🟠 P1 Issues (Should-Fix diese Woche)

### P1-001: [Title]
...

## 🟡 P2 Issues (Nice-to-Fix)

...

## ⚪ P3 Issues (Cosmetic)

...
```

### D) MARKETING VERDICT

```markdown
## 🎯 MARKETING INSIGHTS

### Which 3 Funnels are best for Ads RIGHT NOW?
1. **F1 (V9 Zero Friction)** — Highest conversion, lowest friction
2. **F8 (Ultimate CH)** — Good trust signals, optimized copy
3. **F4 (2-Step Zero-Friction Pro)** — Fast completion, mobile-friendly

**Recommendation**: Allocate 60% of ad budget to F1, 25% to F8, 15% to F4.

### Which 3 Funnels have highest Drop-Off Danger?
1. **F10 (Ultimate "Best of All")** — Form too long, abandonment likely
2. **F3 (Zero Friction Optimized)** — Pricing not clear early
3. **F6 (Chat-basierter Guided Flow)** — Chat UI confusing for some users

**Recommendation**: Pause spend on F10 until fixed. Rewrite copy for F3. Add chat intro for F6.

### Top 3 Changes for Biggest Conversion Lift?
1. **Show price early** (impacts: F3, F5, F6) — +5-10% conversion
2. **Sticky CTA on mobile** (impacts: all) — +3-7% conversion
3. **Trust badges above fold** (impacts: F2, F7) — +2-5% conversion

**Recommendation**: Implement across all funnels within 1 week.
```

### E) GO-LIVE READINESS (Hart)

```markdown
## 🚀 GO-LIVE READINESS

**Is the funnel set ready to go LIVE today?**

### Answer: YES / NO / CONDITIONAL

### Why?
[Explanation of overall health]

### If NO — Top 3 Must-Fixes:

1. **[P0-XXX] [Issue Title]**
   - Severity: P0 (blocks completion)
   - Effort: X hours
   - Why critical: [...]

2. **[P0-XXX] [Issue Title]**
   - ...

3. **[P1-XXX] [Issue Title]**
   - ...

### Success Metrics for Go-Live:
- [ ] All P0 issues fixed
- [ ] No P1 issues (or <2 with workarounds)
- [ ] Avg Score ≥8/10 across all funnels
- [ ] Mobile UX score ≥8/10
- [ ] Form completion time <3 min
- [ ] Clear confirmation on success
```

---

## 🎬 BEGIN NOW!

**Start with F1, then proceed sequentially to F10.**

Follow the exact protocol for each funnel:
1. A) START
2. B) Schritt-für-Schritt Durchlauf
3. C) Micro-Checks
4. D) Abschluss
5. E) Evidence sammeln
6. Deliver REPORT-TEMPLATE for each

When all 10 are done, deliver A) Coverage, B) Summary Table, C) Issues Backlog, D) Marketing Verdict, E) Go-Live Readiness.

---

**Happy Testing! 🚀**

**Prompt Version**: 1.0  
**Last Updated**: 2026-01-28  
**Status**: ✅ Ready for Autonomous Agents
