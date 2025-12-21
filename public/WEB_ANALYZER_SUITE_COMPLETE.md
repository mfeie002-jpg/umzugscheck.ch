# 🚀 Full-Stack Web Analyzer Suite - COMPLETE EXPORT

> **Version:** 3.0 | **Datum:** 2025-01-21
> **Für:** Lovable / Softgen Projekte

---

## 📋 Was ist enthalten?

Diese Datei enthält ALLES, was du brauchst, um die komplette Web Analyzer Suite in einem neuen Projekt aufzubauen:

1. ✅ **Admin Authentication** - Login-System mit Rollen
2. ✅ **Datenbank-Schema** - Alle Tabellen + RLS Policies
3. ✅ **Edge Functions** - 6 Backend-Funktionen
4. ✅ **Frontend Tools** - Screenshot, AI-Analyse, Package Generator
5. ✅ **Standalone Component** - Drop-in für jedes Projekt

---

## 🔧 SCHNELLSTART

### Option A: Mega-Prompt (Empfohlen)
Kopiere den gesamten Abschnitt "DER MEGA-PROMPT" unten in ein neues Lovable Projekt.

### Option B: Manuell
1. Erstelle die Datenbank-Tabellen (SQL)
2. Füge die Edge Functions hinzu
3. Kopiere die React-Komponenten

---

# DER MEGA-PROMPT

Kopiere alles ab hier in dein neues Lovable Projekt:

---

Erstelle eine vollständige Web Analyzer Suite mit Admin-Bereich, Datenbank und allen Tools. Das System soll folgende Features haben:

## 1. ADMIN AUTHENTICATION

Implementiere ein sicheres Admin-Login-System:
- Login-Seite unter `/admin/login`
- Email/Passwort Login mit Supabase Auth
- Geschützter Admin-Bereich (alle `/admin/*` Routen)
- AdminLayout Wrapper mit Auth-Check
- Logout-Button im Header
- Automatische Weiterleitung bei nicht-authentifiziert
- User Roles System mit 'admin' und 'user' Rollen
- RLS Policies: Nur Admins können Admin-Bereiche sehen
- Auto-Confirm für Emails aktivieren (für Entwicklung)

## 2. DATENBANK-SCHEMA

Erstelle folgende Tabellen mit RLS:

```sql
-- ENUMS
CREATE TYPE app_role AS ENUM ('admin', 'user');

-- PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- USER ROLES
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- SCREENSHOT HISTORY (für manuell erfasste Screenshots)
CREATE TABLE screenshot_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  dimension TEXT NOT NULL,
  image_base64 TEXT NOT NULL,
  is_full_page BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SCREENSHOT BASELINES (für Regression Testing)
CREATE TABLE screenshot_baselines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  dimension TEXT DEFAULT '1920x1080',
  image_base64 TEXT NOT NULL,
  threshold_percent NUMERIC DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SCREENSHOT REGRESSION RESULTS
CREATE TABLE screenshot_regression_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baseline_id UUID REFERENCES screenshot_baselines(id) ON DELETE CASCADE,
  new_image_base64 TEXT NOT NULL,
  diff_image_base64 TEXT,
  diff_percent NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SCREENSHOT ALERT SETTINGS
CREATE TABLE screenshot_alert_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  threshold_percent NUMERIC DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ANALYSIS REPORTS
CREATE TABLE analysis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'draft',
  overall_score INTEGER DEFAULT 0,
  categories JSONB DEFAULT '[]',
  consequences JSONB DEFAULT '[]',
  total_issues INTEGER DEFAULT 0,
  critical_issues INTEGER DEFAULT 0,
  warning_issues INTEGER DEFAULT 0,
  info_issues INTEGER DEFAULT 0,
  total_hours NUMERIC DEFAULT 0,
  hourly_rate NUMERIC DEFAULT 150,
  current_revenue NUMERIC DEFAULT 0,
  projected_revenue NUMERIC DEFAULT 0,
  monthly_loss NUMERIC DEFAULT 0,
  viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ENABLE RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_regression_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_alert_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;

-- ADMIN CHECK FUNCTION
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS POLICIES FOR PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- RLS POLICIES FOR ADMIN TABLES (nur Admins)
CREATE POLICY "Admins can do everything on screenshot_history" ON screenshot_history FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can do everything on screenshot_baselines" ON screenshot_baselines FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can do everything on screenshot_regression_results" ON screenshot_regression_results FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can do everything on screenshot_alert_settings" ON screenshot_alert_settings FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can do everything on analysis_reports" ON analysis_reports FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can view reports by token" ON analysis_reports FOR SELECT USING (true);

-- AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots-archive', 'screenshots-archive', true)
ON CONFLICT (id) DO NOTHING;
```

## 3. EDGE FUNCTIONS

Erstelle folgende Edge Functions:

### 3.1 fetch-html
Holt den HTML-Source einer URL (ohne JavaScript-Rendering).

### 3.2 capture-rendered-html  
Verwendet Firecrawl API um gerenderten HTML zu holen (nach JS-Ausführung). Benötigt FIRECRAWL_API_KEY Secret.

### 3.3 ai-website-analyze
Analysiert eine Website mit AI (Lovable AI Gateway). Features:
- Multi-Page Analyse (5, 10 oder 25 Seiten)
- Screenshot + HTML Analyse
- Executive Summary, Quick Wins, SEO Check
- Priorisierte Issue-Liste mit Aufwand-Schätzung
- Rate Limit Handling (429) und Credit Exhaustion (402)

### 3.4 ai-extract-project-info
Extrahiert automatisch Projekt-Informationen aus einer URL:
- Projektname, Beschreibung, Ziele
- Zielgruppe, Konkurrenten
- Für Auto-Fill Feature

### 3.5 lighthouse
Ruft Google PageSpeed API auf für Performance-Scores.

### 3.6 scheduled-screenshots
Automatische Screenshot-Erfassung von 20 wichtigen URLs. Speichert in Storage Bucket.

## 4. ADMIN TOOLS PAGE

Erstelle eine Admin Tools Seite unter `/admin/tools` mit folgenden Tabs:

### Tab 1: Screenshots
- URL-Eingabe für einzelne Screenshots
- Dimension Presets (Desktop: 1920x1080, 1440x900 | Mobile: 393x852, 375x667)
- Full-Page Option
- Bulk Screenshot (mehrere URLs auf einmal)
- Download als PNG oder ZIP

### Tab 2: AI Analyse (1-Click)
- URL eingeben
- Page Count wählen (5, 10 oder 25 Seiten)
- Ein-Klick-Analyse mit AI
- Ergebnis als Markdown anzeigen und kopieren/downloaden

### Tab 3: Feedback Package (Manuell)
- Projekt-Konfiguration (Name, URL, Beschreibung, Ziele, Zielgruppe, Konkurrenten)
- Auto-Fill Button (nutzt ai-extract-project-info)
- Zusätzliche Seiten hinzufügen
- Wählbare Package-Optionen:
  - [ ] Desktop Screenshots
  - [ ] Mobile Screenshots
  - [ ] Raw HTML
  - [ ] Rendered HTML
  - [ ] 7 KI-Prompts
  - [ ] PDF Brief
- "Alle auswählen" / "Keine" Buttons
- Generiert ZIP mit allem ausgewählten Content

### Tab 4: ChatGPT Prompts
- 7 verschiedene Copy-Paste Prompts:
  1. Quick Analysis - Schnelle UX/Conversion-Checks
  2. Deep Audit - Vollständige Analyse
  3. Code Review - Technische Qualität
  4. Screenshot Analysis - Visuelles Review
  5. Regression Report - Änderungs-Analyse
  6. SEO Deep Dive - Suchmaschinen-Optimierung
  7. Accessibility Audit - WCAG-Konformität

### Tab 5: SEO Analyzer
- URL eingeben
- HTML fetchen und analysieren
- Zeigt: Meta Tags, Headings, Links, Schema.org

### Tab 6: Regression Testing
- Baselines verwalten (erstellen, aktualisieren, löschen)
- Neue Screenshots mit Baseline vergleichen
- Diff-Prozent anzeigen
- Schwellwert-Einstellung
- Ergebnisse-Historie

### Tab 7: Scheduled Monitoring
- Liste aller überwachten URLs
- Letzte Erfassung anzeigen
- Manuell Erfassung triggern
- Screenshots im Storage Browser anzeigen

### Tab 8: Export
- Mega-Export: ZIP mit allem Code + Prompts
- Standalone Component Download

## 5. DESIGN REQUIREMENTS

- Modernes, sauberes Design mit Tailwind CSS
- shadcn/ui Komponenten verwenden
- Responsive (Mobile-first)
- Dark Mode Support
- Toast Notifications für Feedback
- Progress Bars für lange Operationen
- Tabs mit Lucide Icons

## 6. SECRETS BENÖTIGT

- FIRECRAWL_API_KEY (für capture-rendered-html)
- SCREENSHOTMACHINE_API_KEY (für Screenshots, kann hardcoded sein: "892618")
- LOVABLE_API_KEY (automatisch vorhanden)

## 7. DEPENDENCIES

```
jszip
file-saver  
jspdf
lucide-react
```

---

# STANDALONE COMPONENT

Falls du nur den Package Generator als Drop-in Component brauchst, erstelle diese Datei:

`src/components/AIFeedbackPackageStandalone.tsx`

Features:
- Komplett eigenständig, keine externen Dependencies außer Supabase
- Projekt-Konfiguration mit allen Feldern
- Auto-Fill mit AI
- Page Count Selector (5, 10, 25)
- Wählbare Package-Optionen
- Konkurrenten-Erfassung
- PDF Report Generator
- ZIP Download mit allem

---

# SECRETS EINRICHTEN

Nach dem Erstellen, füge folgende Secrets hinzu:

1. **FIRECRAWL_API_KEY** - Für rendered HTML (https://firecrawl.dev)
2. **SCREENSHOTMACHINE_API_KEY** - Für Screenshots (optional, default: 892618)

---

# VERWENDUNG

1. **Admin erstellen:**
   - Registriere dich über `/admin/login`
   - Füge dich manuell als Admin hinzu:
   ```sql
   INSERT INTO user_roles (user_id, role) 
   VALUES ('deine-user-id', 'admin');
   ```

2. **Tools nutzen:**
   - Gehe zu `/admin/tools`
   - Wähle einen Tab
   - Starte mit der AI Analyse oder Screenshots

3. **Package für externe Review:**
   - Nutze Tab 3 (Feedback Package)
   - Konfiguriere dein Projekt
   - Wähle die gewünschten Optionen
   - Generiere und downloade das ZIP
   - Lade es bei ChatGPT/Claude/Gemini hoch

---

*Generiert von Web Analyzer Suite v3.0*
