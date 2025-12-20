import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, Copy, CheckCircle2, 
  FileText, Camera, Code, 
  Zap, Shield, BookOpen, 
  Database, Search, Sparkles, Bot, 
  Globe, Package, AlertTriangle, Target, Clock
} from "lucide-react";
import { saveAs } from "file-saver";
import { toast } from "sonner";

const FULL_DOCUMENTATION = `# 📚 Web Analyzer Suite - Vollständige Dokumentation

## Überblick

Die Web Analyzer Suite ist eine umfassende Sammlung von Analyse-Tools für Websites, bestehend aus **7 Szenarien/Tools** mit unterschiedlichen Anwendungsfällen.

---

# 🎯 Die 7 Szenarien im Überblick

| # | Tool | Wann verwenden? | Dauer | Output |
|---|------|-----------------|-------|--------|
| 1 | **Mega Export** | Komplettes Tool auf neues Lovable replizieren | 10 Min | ZIP + Prompt |
| 2 | **1-Klick KI-Analyse** | Schnelle Website-Analyse ohne Aufwand | 1-2 Min | Markdown Report |
| 3 | **Manuelles Package** | Daten für externe KI (ChatGPT/Claude) | 3-5 Min | ZIP mit allem |
| 4 | **Screenshot Machine** | Einzel- oder Bulk-Screenshots | 30 Sek | PNG/ZIP |
| 5 | **SEO HTML Analyzer** | Raw vs. Rendered HTML vergleichen | 1 Min | Diff + Tags |
| 6 | **KI-Prompt Generator** | 7 optimierte Prompts für KI-Analyse | 1 Min | Copy-Paste Prompts |
| 7 | **URL Discovery** | Alle Seiten einer Website finden | 30 Sek | URL-Liste |

---

# 📦 SZENARIO 1: Mega Export (Tool replizieren)

## Zweck
Repliziert das KOMPLETTE Admin-Tools-System auf ein neues Lovable-Projekt.

## Wann verwenden?
- Du willst das Tool für einen Kunden aufsetzen
- Du willst eine eigene Instanz haben
- Du willst das Tool anpassen/erweitern

## Was ist enthalten?
1. **5 Edge Functions** (echter Code)
   - fetch-html
   - capture-rendered-html  
   - ai-website-analyze
   - lighthouse
   - firecrawl-map

2. **SQL Migration** (Datenbank-Schema)
   - profiles Tabelle
   - user_roles Tabelle
   - screenshot_history
   - screenshot_baselines
   - analysis_reports

3. **RLS Policies** (Sicherheit)
   - Admin-only Zugriff
   - has_role() Funktion

4. **config.toml** (Supabase Config)
   - JWT-Verifikation deaktiviert für öffentliche Funktionen

5. **README.md** (Prompt für Lovable)
   - Kopiere diesen Text in ein neues Lovable-Projekt

## Anleitung
1. Klicke "MEGA_EXPORT.zip herunterladen"
2. Öffne lovable.dev → Neues Projekt
3. Kopiere Inhalt von README.md in den Chat
4. Warte bis generiert
5. Registriere dich in der App
6. Gehe ins Backend → user_roles Tabelle
7. Füge deine user_id mit role='admin' hinzu
8. (Optional) Verbinde Firecrawl für Screenshots

## Worauf achten?
⚠️ **Secrets nicht vergessen!**
- FIRECRAWL_API_KEY muss nach dem Setup hinzugefügt werden
- LOVABLE_API_KEY ist automatisch vorhanden bei Lovable Cloud

⚠️ **Admin-Rolle manuell hinzufügen!**
\`\`\`sql
INSERT INTO user_roles (user_id, role) 
VALUES ('deine-user-id', 'admin');
\`\`\`

---

# 🤖 SZENARIO 2: 1-Klick KI-Analyse

## Zweck
Sofortige, automatische Website-Analyse mit Lovable AI.

## Wann verwenden?
- Schnelle Erst-Analyse einer Website
- Keine Zeit für manuelle Prompts
- Interne Reviews

## Was passiert?
1. Screenshot der Startseite wird erstellt
2. HTML-Quellcode wird abgerufen
3. Beides wird an Lovable AI gesendet
4. Strukturierte Analyse wird zurückgegeben

## Output
- Markdown-Report mit:
  - TOP 3 Conversion-Killer
  - Quick Wins
  - SEO-Probleme
  - Mobile UX Issues
  - Priorisierter Aktionsplan

## Anleitung
1. Gib die Website-URL ein (im "Projekt Konfiguration" Bereich)
2. (Optional) Füge Projektname und Beschreibung hinzu
3. Klicke "Website jetzt analysieren"
4. Warte 1-2 Minuten
5. Kopiere/Downloade das Ergebnis

## Worauf achten?
⚠️ **URL muss erreichbar sein** (kein Passwortschutz)
⚠️ **Rate Limits** bei vielen Anfragen möglich
⚠️ **Kein Firecrawl nötig** für Basis-Analyse

---

# 📁 SZENARIO 3: Manuelles Package

## Zweck
Erstellt ein komplettes Analyse-Paket für externe KI-Tools.

## Wann verwenden?
- Du willst ChatGPT/Claude mit Kontext füttern
- Du brauchst Screenshots + HTML für Dokumentation
- Kunde soll Paket für eigene Analyse erhalten

## Was ist enthalten?
\`\`\`
📦 feedback-package.zip
├── 📁 screenshots/
│   ├── homepage-desktop.png
│   ├── homepage-mobile.png
│   ├── page-1-desktop.png
│   └── ...
├── 📁 html/
│   └── homepage-raw.html
├── 📁 rendered-html/
│   └── homepage-rendered.html
├── 📁 prompts/
│   ├── 01_QUICK_ANALYSIS.md
│   ├── 02_DEEP_AUDIT.md
│   ├── 03_CODE_REVIEW.md
│   ├── 04_SCREENSHOT_ANALYSIS.md
│   ├── 05_REGRESSION_REPORT.md
│   ├── 06_SEO_DEEP_DIVE.md
│   └── 07_ACCESSIBILITY_AUDIT.md
├── ANALYSIS_PROMPT.md
├── PROJECT_BRIEF.pdf
└── README.md
\`\`\`

## Anleitung
1. Fülle alle Projektdaten aus (Name, URL, Beschreibung, Ziele)
2. (Optional) Nutze "URL Discovery" um Unterseiten zu finden
3. Füge zusätzliche Seiten hinzu
4. Klicke "Package für ChatGPT/Claude"
5. Warte bis ZIP generiert ist
6. Öffne ChatGPT/Claude
7. Wähle einen Prompt aus /prompts/
8. Lade relevante Screenshots/HTML hoch

## Worauf achten?
⚠️ **Firecrawl benötigt** für Screenshots
⚠️ **Kann 3-5 Minuten dauern** bei vielen Seiten
⚠️ **Grosse Dateien** - nicht zu viele Seiten auf einmal

---

# 📸 SZENARIO 4: Screenshot Machine

## Zweck
Erstellt Screenshots von einer oder mehreren URLs.

## Wann verwenden?
- Dokumentation / Archivierung
- Vorher/Nachher Vergleiche
- Bulk-Screenshots für Berichte

## Modi
1. **Einzel-Screenshot**
   - Eine URL
   - Wählbare Dimension
   - Optional: Volle Seite

2. **Bulk-Screenshots**
   - Mehrere URLs (eine pro Zeile)
   - Automatisches ZIP

## Dimension-Presets
| Gerät | Auflösung |
|-------|-----------|
| Desktop HD | 1920x1080 |
| Desktop Full Page | 1920xfull |
| MacBook | 1440x900 |
| iPhone 14 Pro | 393x852 |
| iPhone SE | 375x667 |
| Android | 360x800 |

## Anleitung
1. Gib URL(s) ein
2. Wähle Dimension
3. Setze Verzögerung (für dynamische Inhalte)
4. Aktiviere "Volle Seite" wenn gewünscht
5. Klicke "Screenshot erfassen" oder "Bulk Download"

## Worauf achten?
⚠️ **Firecrawl benötigt**
⚠️ **Verzögerung nutzen** für Lazy-Load Inhalte
⚠️ **Volle Seite** kann sehr grosse Bilder erzeugen

---

# 🔍 SZENARIO 5: SEO HTML Analyzer

## Zweck
Vergleicht Raw HTML mit Rendered HTML und extrahiert SEO-relevante Tags.

## Wann verwenden?
- JavaScript-SEO Debugging
- Meta-Tag Überprüfung
- Heading-Struktur analysieren
- Interne Links prüfen

## Was wird analysiert?
- **Meta Tags**: Title, Description, Keywords
- **Headings**: H1-H6 Hierarchie
- **Links**: Interne und externe Links
- **Images**: Alt-Tags
- **Structured Data**: JSON-LD

## Anleitung
1. Gehe zum Tab "SEO HTML Analyzer"
2. Gib URL ein oder wähle Preset
3. Klicke "HTML abrufen"
4. Vergleiche Raw vs. Rendered
5. Exportiere für KI-Analyse

## Worauf achten?
⚠️ **Raw ≠ Rendered** bei JavaScript-Seiten
⚠️ **Google sieht Rendered** (wenn JS indexiert wird)
⚠️ **Firecrawl für Rendered** HTML benötigt

---

# ✨ SZENARIO 6: KI-Prompt Generator

## Zweck
Generiert optimierte, Copy-Paste-fertige Prompts für KI-Analyse.

## Wann verwenden?
- Du willst einen spezifischen Analyse-Typ
- Du nutzt ChatGPT/Claude manuell
- Du willst Prompts für das Team bereitstellen

## Die 7 Prompt-Varianten

| # | Prompt | Fokus | Dauer |
|---|--------|-------|-------|
| 1 | Quick Analysis | Schnelle UX/Conversion-Checks | ~2 Min |
| 2 | Deep Audit | Vollständige Analyse | ~10 Min |
| 3 | Code Review | Technische Qualität | ~5 Min |
| 4 | Screenshot Analysis | Visuelles Review | ~3 Min |
| 5 | Regression Report | Änderungs-Analyse | ~3 Min |
| 6 | SEO Deep Dive | Suchmaschinen-Optimierung | ~8 Min |
| 7 | Accessibility Audit | WCAG-Konformität | ~5 Min |

## Anleitung
1. Klicke auf gewünschten Prompt-Typ
2. Der Prompt wird mit deinen Projektdaten gefüllt
3. Kopiere den Prompt
4. Füge in ChatGPT/Claude ein
5. Lade Screenshots/HTML hoch
6. Erhalte strukturierte Analyse

## Worauf achten?
⚠️ **Projektdaten vorher ausfüllen** für personalisierte Prompts
⚠️ **Screenshot + HTML hochladen** für beste Ergebnisse
⚠️ **GPT-4/Claude 3** für komplexe Analysen empfohlen

---

# 🌐 SZENARIO 7: URL Discovery

## Zweck
Findet automatisch alle URLs/Unterseiten einer Website.

## Wann verwenden?
- Du kennst nicht alle Seiten
- Sitemap fehlt oder ist unvollständig
- Du willst Bulk-Analyse machen

## Was passiert?
1. Firecrawl "mappt" die Website
2. Alle erreichbaren URLs werden extrahiert
3. Du wählst welche Seiten du analysieren willst

## Anleitung
1. Gib die Haupt-URL ein
2. Klicke "URLs entdecken"
3. Warte 10-30 Sekunden
4. Wähle die gewünschten Seiten aus
5. Klicke "Ausgewählte hinzufügen"
6. Die Seiten werden zur Analyse-Liste hinzugefügt

## Worauf achten?
⚠️ **Firecrawl benötigt**
⚠️ **Limit: 50 URLs** pro Scan
⚠️ **Nur öffentliche Seiten** werden gefunden

---

# 🔐 Voraussetzungen & Secrets

## Benötigte Secrets

| Secret | Benötigt für | Wo hinzufügen |
|--------|--------------|---------------|
| FIRECRAWL_API_KEY | Screenshots, Rendered HTML, URL Discovery | Connectors → Firecrawl |
| LOVABLE_API_KEY | 1-Klick KI-Analyse | Automatisch bei Lovable Cloud |

## Wie Firecrawl hinzufügen?
1. Gehe zu https://firecrawl.dev
2. Erstelle Account
3. Kopiere API Key
4. In Lovable: Settings → Connectors → Firecrawl → Connect

---

# 🎯 Welches Tool für welches Szenario?

| Ich will... | Verwende... |
|-------------|-------------|
| Das komplette Tool woanders replizieren | Mega Export |
| Schnelle Website-Analyse (1 Klick) | 1-Klick KI-Analyse |
| Daten für ChatGPT/Claude vorbereiten | Manuelles Package |
| Nur Screenshots machen | Screenshot Machine |
| SEO-Tags analysieren | SEO HTML Analyzer |
| Prompt für spezielle Analyse | KI-Prompt Generator |
| Alle Unterseiten finden | URL Discovery |

---

# 📊 Entscheidungsbaum

\`\`\`
Willst du das Tool replizieren?
├── JA → Mega Export
└── NEIN → Willst du eine Website analysieren?
    ├── JA → Brauchst du externe KI (ChatGPT/Claude)?
    │   ├── JA → Manuelles Package
    │   └── NEIN → 1-Klick KI-Analyse
    └── NEIN → Was willst du?
        ├── Screenshots → Screenshot Machine
        ├── HTML/SEO → SEO HTML Analyzer
        ├── Prompts → KI-Prompt Generator
        └── URLs finden → URL Discovery
\`\`\`

---

# ⚡ Quick Reference

## Tastenkürzel
- **Enter** in URL-Feld → Seite hinzufügen
- **Klick auf Badge** → Seite entfernen

## Beste Praktiken
1. **Immer Projektdaten ausfüllen** → Bessere Prompts
2. **Verzögerung 3-5 Sek** → Für JavaScript-Seiten
3. **Desktop + Mobile** → Für vollständige Analyse
4. **Raw + Rendered HTML** → Für SEO-Analyse

## Troubleshooting
| Problem | Lösung |
|---------|--------|
| Screenshot leer | Verzögerung erhöhen |
| "Firecrawl nicht verbunden" | Connector hinzufügen |
| Rate Limit | 1 Minute warten |
| Analyse fehlgeschlagen | URL prüfen (https://) |

---

Erstellt mit ❤️ für umzugscheck.ch
`;

export const ToolsDocumentation = () => {
  const [copied, setCopied] = useState(false);

  const downloadDocumentation = () => {
    const blob = new Blob([FULL_DOCUMENTATION], { type: 'text/markdown' });
    saveAs(blob, 'WEB_ANALYZER_SUITE_DOKUMENTATION.md');
    toast.success('Dokumentation heruntergeladen!');
  };

  const copyDocumentation = async () => {
    try {
      await navigator.clipboard.writeText(FULL_DOCUMENTATION);
      setCopied(true);
      toast.success('Dokumentation kopiert!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Kopieren fehlgeschlagen');
    }
  };

  return (
    <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-xl">📚 Vollständige Tool-Dokumentation</CardTitle>
            <CardDescription>
              7 Szenarien erklärt - Was, Wann, Wie, Worauf achten
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-lg bg-background border">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">Mega Export</span>
            </div>
            <p className="text-xs text-muted-foreground">Tool komplett replizieren</p>
            <Badge variant="secondary" className="mt-2 text-xs">Szenario 1</Badge>
          </div>

          <div className="p-4 rounded-lg bg-background border">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-5 w-5 text-purple-500" />
              <span className="font-semibold text-sm">1-Klick KI</span>
            </div>
            <p className="text-xs text-muted-foreground">Schnelle Auto-Analyse</p>
            <Badge variant="secondary" className="mt-2 text-xs">Szenario 2</Badge>
          </div>

          <div className="p-4 rounded-lg bg-background border">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-sm">Manuelles Package</span>
            </div>
            <p className="text-xs text-muted-foreground">ZIP für ChatGPT/Claude</p>
            <Badge variant="secondary" className="mt-2 text-xs">Szenario 3</Badge>
          </div>

          <div className="p-4 rounded-lg bg-background border">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="h-5 w-5 text-green-500" />
              <span className="font-semibold text-sm">Screenshot Machine</span>
            </div>
            <p className="text-xs text-muted-foreground">Einzel & Bulk Screenshots</p>
            <Badge variant="secondary" className="mt-2 text-xs">Szenario 4</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-lg bg-background border">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-5 w-5 text-orange-500" />
              <span className="font-semibold text-sm">SEO HTML Analyzer</span>
            </div>
            <p className="text-xs text-muted-foreground">Raw vs. Rendered vergleichen</p>
            <Badge variant="secondary" className="mt-2 text-xs">Szenario 5</Badge>
          </div>

          <div className="p-4 rounded-lg bg-background border">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-pink-500" />
              <span className="font-semibold text-sm">KI-Prompt Generator</span>
            </div>
            <p className="text-xs text-muted-foreground">7 optimierte Prompts</p>
            <Badge variant="secondary" className="mt-2 text-xs">Szenario 6</Badge>
          </div>

          <div className="p-4 rounded-lg bg-background border">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-5 w-5 text-cyan-500" />
              <span className="font-semibold text-sm">URL Discovery</span>
            </div>
            <p className="text-xs text-muted-foreground">Alle Unterseiten finden</p>
            <Badge variant="secondary" className="mt-2 text-xs">Szenario 7</Badge>
          </div>
        </div>

        {/* Key Decision */}
        <div className="p-4 rounded-lg bg-muted/50 border">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Entscheidungshilfe
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-2">Ich will das Tool woanders haben:</p>
              <p className="text-muted-foreground">→ <strong>Mega Export</strong> verwenden</p>
            </div>
            <div>
              <p className="font-medium mb-2">Ich will eine Website schnell analysieren:</p>
              <p className="text-muted-foreground">→ <strong>1-Klick KI-Analyse</strong> verwenden</p>
            </div>
            <div>
              <p className="font-medium mb-2">Ich will Daten für ChatGPT/Claude:</p>
              <p className="text-muted-foreground">→ <strong>Manuelles Package</strong> erstellen</p>
            </div>
            <div>
              <p className="font-medium mb-2">Ich will nur Screenshots:</p>
              <p className="text-muted-foreground">→ <strong>Screenshot Machine</strong> nutzen</p>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            Wichtige Voraussetzungen
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <span className="font-medium">FIRECRAWL_API_KEY</span>
                <p className="text-xs text-muted-foreground">Für Screenshots, Rendered HTML, URL Discovery</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <span className="font-medium">Admin-Rolle</span>
                <p className="text-xs text-muted-foreground">Manuell in user_roles Tabelle hinzufügen</p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button 
            onClick={downloadDocumentation}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Dokumentation herunterladen (.md)
          </Button>
          <Button 
            onClick={copyDocumentation}
            variant="outline"
            className="flex-1"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Kopiert!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                In Zwischenablage kopieren
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolsDocumentation;
