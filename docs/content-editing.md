# Content Editing Guide - umzugscheck.ch

## Einleitung

Willkommen zum Content Management System von umzugscheck.ch! Mit diesem System können Sie alle sichtbaren Inhalte Ihrer Website bearbeiten, ohne Code zu schreiben oder einen Entwickler zu benötigen.

## Login

1. Öffnen Sie die Admin-Oberfläche unter: **https://yourdomain.ch/admin**
2. Geben Sie das Admin-Passwort ein
3. Klicken Sie auf "Anmelden"

**Standard-Passwort:** Das Passwort wird in der Umgebungsvariable `VITE_ADMIN_PASSWORD` gespeichert. Ändern Sie dieses aus Sicherheitsgründen!

---

## Bereiche im Admin-Panel

### 1. Homepage

Hier bearbeiten Sie alle Inhalte der Startseite:

- **Hero-Bereich:** Hauptüberschrift, Unterüberschrift, CTA-Buttons
- **Vertrauensindikatoren:** Bewertung, Anzahl Umzüge, etc.
- **KI-Rechner:** Beschriftungen und Texte
- **Testimonials:** Kundenbewertungen
- **Statistiken:** Erfolgreiche Umzüge, Bewertungen, etc.

#### Beispiel-Änderungen:
- Hauptüberschrift ändern
- CTA-Button-Text anpassen
- Trust-Badges aktualisieren
- Kundenreferenzen hinzufügen/entfernen

### 2. Services / Dienstleistungen

Verwalten Sie alle angebotenen Services:

- **Privatumzug**
- **Firmenumzug**
- **Reinigung**
- **Entsorgung**
- **Möbellift**
- **Verpackungsservice**

Für jeden Service können Sie bearbeiten:
- Name
- Beschreibung
- Icon (Emoji)
- Link
- Kategorie
- Reihenfolge

### 3. Regionen & Städte

Verwalten Sie alle Schweizer Regionen und Städte:

- **Hauptstädte:** Zürich, Bern, Basel, etc.
- **Kantone:** Aargau, Tessin, Waadt, etc.

Für jede Region können Sie bearbeiten:
- Anzeigename
- URL-Slug
- Kanton-Code
- Haupt-Stadt Ja/Nein
- Reihenfolge

### 4. FAQ

Häufig gestellte Fragen verwalten:

Für jede FAQ können Sie bearbeiten:
- Frage
- Antwort
- Kategorie
- Reihenfolge

**Kategorien:**
- general (Allgemein)
- pricing (Preise)
- process (Ablauf)
- quality (Qualität)

### 5. Preisbeispiele

Kostenbeispiele für verschiedene Wohnungsgrößen:

- 1.5-Zimmer
- 2.5-Zimmer
- 4.5-Zimmer

Für jedes Beispiel:
- Titel
- Beschreibung
- Preis (z.B. "ab CHF 680")
- Icon
- Reihenfolge

### 6. Why Us / USPs

Alleinstellungsmerkmale der Plattform:

- Geprüfte Umzugsfirmen
- Bis zu 40% sparen
- KI-gestützte Kostenschätzung
- Schweizer Support & Qualität

Für jeden USP:
- Icon-Name
- Titel
- Beschreibung
- Reihenfolge

### 7. SEO Einstellungen

Meta-Tags und SEO-Inhalte für jede Seite:

**Global:**
- Website-Name
- Standard-Titel-Suffix
- Standard-Beschreibung
- Standard-OG-Bild

**Pro Seite:**
- Meta-Titel
- Meta-Beschreibung
- Canonical-URL
- Schema-Type

---

## Bilder verwalten

### Methode 1: URL eingeben

Kopieren Sie die URL eines Bildes und fügen Sie sie in das Bild-Feld ein:

```
https://images.unsplash.com/photo-1234567890?w=800
```

### Methode 2: Lokale Bilder

Laden Sie Bilder in den `/public/images/` Ordner hoch und referenzieren Sie sie:

```
/images/mein-bild.jpg
```

---

## Speichern & Veröffentlichen

### Speichern

1. Änderungen in den Formularen vornehmen
2. Auf "Speichern" klicken
3. Warten auf Erfolgsmeldung

### Vorschau

Nach dem Speichern:
1. Klicken Sie auf "Zur Website"
2. Prüfen Sie Ihre Änderungen
3. Bei Bedarf zurück zum Admin und anpassen

---

## Wichtige Hinweise

### ⚠️ Zeichenlimits

- **Meta-Titel:** Max. 60 Zeichen
- **Meta-Beschreibung:** Max. 160 Zeichen
- **Hero-Überschrift:** Max. 80 Zeichen empfohlen

### ✅ Best Practices

1. **Konsistente Sprache:** Verwenden Sie einheitliches Schweizerdeutsch
2. **Klare CTAs:** Call-to-Actions sollten handlungsorientiert sein
3. **Aktuelle Zahlen:** Halten Sie Statistiken aktuell
4. **Kurze Texte:** Mobile-Nutzer bevorzugen prägnante Inhalte

### 🔒 Sicherheit

- **Passwort:** Ändern Sie das Standard-Passwort sofort
- **Backup:** Exportieren Sie regelmäßig Backups
- **Vorsicht:** Ändern Sie IDs nicht, da diese in Links verwendet werden

---

## Technische Details

### Wo werden Inhalte gespeichert?

Alle Inhalte werden in JSON-Dateien im Ordner `/src/content/` gespeichert:

```
/src/content/
  ├── homepage.json          (Startseiten-Inhalte)
  ├── services.json          (Dienstleistungen)
  ├── regions.json           (Regionen & Städte)
  ├── faq.json              (Häufige Fragen)
  ├── costExamples.json     (Preisbeispiele)
  ├── whyUs.json            (USPs)
  └── seo.json              (SEO-Einstellungen)
```

### Limitationen

**Aktuelle Version:**
- Datei-Speicherung funktioniert nur in Development-Umgebung
- Für Production benötigen Sie ein Backend (Supabase, API)
- Bilder müssen manuell hochgeladen werden

**Geplante Features:**
- Direkte Bild-Uploads
- Versionierung & Rollback
- Multi-User Editing
- Automatische Backups

---

## Hilfe & Support

### Probleme beim Login?

1. Cache leeren
2. Browser neu starten
3. Passwort überprüfen
4. Entwickler kontaktieren

### Änderungen werden nicht angezeigt?

1. Hard-Refresh (Ctrl+Shift+R oder Cmd+Shift+R)
2. Cache leeren
3. Prüfen, ob "Speichern" erfolgreich war
4. Browser-Konsole auf Fehler prüfen

### Weitere Fragen?

Kontaktieren Sie Ihren Entwickler oder erstellen Sie ein Support-Ticket.

---

## Beispiel-Workflow

### Neue Dienstleistung hinzufügen

1. Login unter `/admin`
2. Tab "Services" öffnen
3. Auf "Neu hinzufügen" klicken
4. Formular ausfüllen:
   - Name: "Klaviertransport"
   - Beschreibung: "Sicherer Transport Ihres Klaviers"
   - Icon: "🎹"
   - Link: "/dienstleistungen/klaviertransport"
   - Kategorie: "additional"
   - Reihenfolge: 7
5. Auf "Speichern" klicken
6. Website überprüfen

### FAQ aktualisieren

1. Login unter `/admin`
2. Tab "FAQ" öffnen
3. Bestehende Frage auswählen
4. Text anpassen
5. Auf "Speichern" klicken
6. Auf "Zur Website" klicken und FAQ-Sektion überprüfen

---

## Schnell-Referenz

| Was ändern? | Wo finden? | Datei |
|-------------|-----------|-------|
| Hero-Überschrift | Homepage > Hero | homepage.json |
| CTA-Button | Homepage > Hero | homepage.json |
| Testimonials | Homepage > Social Proof | homepage.json |
| Services | Services Tab | services.json |
| Regionen | Regionen Tab | regions.json |
| FAQ | FAQ Tab | faq.json |
| Preise | Preise Tab | costExamples.json |
| USPs | Why Us Tab | whyUs.json |
| SEO | SEO Tab | seo.json |

---

**Version:** 1.0  
**Letztes Update:** 2025-01-19  
**Autor:** Umzugscheck.ch Development Team
