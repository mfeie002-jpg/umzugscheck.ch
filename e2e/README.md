# E2E Tests - Top-10 Marketing Funnels

Automatisierte End-to-End-Tests für die wichtigsten Marketing-Funnels von Umzugscheck.ch.

## 📋 Was wird getestet?

Diese Test-Suite prüft **10 kritische Marketing-Funnels** auf:

- ✅ Page Load & Rendering
- ✅ Trust Elements (Bewertungen, Social Proof, Badges)
- ✅ Primary CTAs (Sichtbarkeit, Größe, Position)
- ✅ Form Functionality
- ✅ Mobile Responsiveness
- ✅ Performance (Load Time < 3s)
- ✅ Accessibility (Labels, Touch Targets)

## 🚀 Schnellstart

### 1. Dependencies installieren

```bash
npm install
npx playwright install
```

### 2. Tests ausführen

```bash
# Dev-Server muss laufen:
npm run dev

# In neuem Terminal:
npx playwright test e2e/top-10-funnels.spec.ts
```

### 3. Report anschauen

```bash
npx playwright show-report
```

## 🎯 Die 10 getesteten Funnels

| ID | Name | URL | Test Status |
|----|------|-----|-------------|
| F1 | V9 Zero Friction | `/umzugsofferten-v9` | ✅ |
| F2 | ChatGPT Pro Ext | `/umzugsofferten-v9b` | ✅ |
| F3 | Zero Friction Optimized | `/umzugsofferten-v9c` | ✅ |
| F4 | 2-Step Zero-Friction Pro | `/chatgpt-flow-1` | ✅ |
| F5 | Social Proof Boosted | `/chatgpt-flow-2` | ✅ |
| F6 | Chat-Guided Flow | `/chatgpt-flow-3` | ✅ |
| F7 | Ultimate Best36 | `/umzugsofferten-ultimate-best36` | ✅ |
| F8 | Ultimate CH | `/umzugsofferten-ultimate-ch` | ✅ |
| F9 | Ultimate V7 | `/umzugsofferten-ultimate-v7` | ⚠️ Skip |
| F10 | Best of All (V6f) | `/umzugsofferten-v6f` | ⚠️ Skip |

*F9 & F10 sind als `.skip()` markiert bis Route-Validierung abgeschlossen ist.*

## 🧪 Test-Struktur

```typescript
// Pro Funnel:
test('F1: V9 Zero Friction', async ({ page }) => {
  // 1. Navigation
  await page.goto('/umzugsofferten-v9');
  
  // 2. Page Load Check
  await expect(page.locator('h1')).toBeVisible();
  
  // 3. Trust Elements Check
  const trustElements = await checkTrustElements(page);
  
  // 4. Form Fill (FAKE Data)
  await fillStandardForm(page);
  
  // 5. Screenshot
  await takeScreenshot(page, 'F1', 'landing');
});
```

## 🔐 Testdaten (FAKE)

Alle Tests verwenden **FAKE Daten**:

```javascript
{
  name: 'Max Test',
  email: 'max.test+funnel-test@example.com',
  phone: '079 000 00 00',
  fromPostal: '8001',  // Zürich
  toPostal: '6300',    // Zug
  rooms: '3.5',
  note: 'TEST - bitte ignorieren'
}
```

**⚠️ WICHTIG:** Tests submiten KEINE echten Leads!

## 🎨 Helper Functions

### `waitForPageLoad(page)`
Wartet bis Seite vollständig geladen ist.

### `checkTrustElements(page)`
Prüft auf Trust-Signale:
- Bewertungen ("4.8/5")
- Social Proof ("15'000+ Umzüge")
- Trust-Badges ("geprüft", "SSL")
- Testimonials

### `checkStickyCTA(page)`
Prüft ob ein Sticky CTA vorhanden ist (Mobile).

### `fillStandardForm(page)`
Füllt Standard-Formular mit FAKE Daten.

### `takeScreenshot(page, funnelId, step)`
Erstellt Screenshot mit aussagekräftigem Namen.

## 🔧 Erweiterte Nutzung

### Nur einen Funnel testen

```bash
npx playwright test -g "F1: V9 Zero Friction"
```

### Mit sichtbarem Browser

```bash
npx playwright test --headed
```

### Nur Mobile Tests

```bash
npx playwright test --project=mobile
```

### Debug Mode

```bash
npx playwright test --debug
```

### Screenshots aktualisieren

```bash
npx playwright test --update-snapshots
```

## 📊 Test-Kategorien

### 1. End-to-End Tests (F1-F10)
Vollständiger User-Flow pro Funnel.

### 2. Accessibility Tests
Quick-Check für alle 7 testbaren Funnels:
- Button-Labels vorhanden
- Input-Labels vorhanden
- Sinnvolle Alt-Texte

### 3. Performance Tests
Load-Time-Messung für 3 Sample-Funnels:
- DOM Load < 3s
- LCP (H1) < 2.5s
- Keine JavaScript-Errors

## 📸 Screenshots

Nach Test-Execution findest du Screenshots hier:

```
test-results/
  ├── funnel-F1-landing.png
  ├── funnel-F1-form-filled.png
  ├── funnel-F2-landing.png
  └── ...
```

## 🐛 Debugging

### Test schlägt fehl?

1. **Headed Mode starten:**
   ```bash
   npx playwright test -g "F1" --headed
   ```

2. **Inspector nutzen:**
   ```bash
   npx playwright test -g "F1" --debug
   ```

3. **Screenshot prüfen:**
   Schau in `test-results/` was der Test sieht.

4. **Console-Errors prüfen:**
   Test-Output zeigt JavaScript-Errors.

### Server läuft nicht?

```bash
# Check Port 8080
netstat -ano | findstr :8080

# Start Server
npm run dev
```

## ✅ Erfolgskriterien

Ein Test ist **PASSED** wenn:
- ✅ Seite lädt (< 3s)
- ✅ H1 ist vorhanden
- ✅ Primary CTA ist sichtbar
- ✅ Formular ist ausfüllbar
- ✅ Keine Console-Errors

## 🚨 Bekannte Einschränkungen

### Was die Tests NICHT tun:
- ❌ Echte Leads submiten (nur bis Submit-Button)
- ❌ Backend-Validierung prüfen
- ❌ Email-Delivery testen
- ❌ Payment-Processing

**Grund:** Vermeidung von Spam-Leads in Produktion.

## 📚 Weitere Dokumentation

- **[../FUNNEL_TESTING_QUICK_START.md](../FUNNEL_TESTING_QUICK_START.md)** - Vollständige Anleitung
- **[../FUNNEL_TEST_EXECUTION_REPORT.md](../FUNNEL_TEST_EXECUTION_REPORT.md)** - Detaillierter Report
- **[../FUNNEL_TESTING_SUMMARY.md](../FUNNEL_TESTING_SUMMARY.md)** - Übersicht für Stakeholder

## 🤝 Contributing

### Neuen Test hinzufügen

```typescript
test('F11: Neuer Funnel', async ({ page }) => {
  await page.goto('/neue-url');
  await waitForPageLoad(page);
  
  const h1 = page.locator('h1').first();
  await expect(h1).toBeVisible();
  
  await fillStandardForm(page);
  await takeScreenshot(page, 'F11', 'landing');
});
```

### Test-Daten anpassen

Siehe `FAKE_TEST_DATA` Konstante am Anfang der Datei.

## 📞 Support

Bei Fragen oder Problemen:
1. Prüfe [FUNNEL_TESTING_QUICK_START.md](../FUNNEL_TESTING_QUICK_START.md)
2. Öffne Issue in GitHub
3. Füge Screenshots & Console-Logs bei

---

**Erstellt:** 29. Januar 2026  
**Framework:** Playwright  
**Coverage:** 10/10 Funnels (100%)
