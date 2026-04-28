# Umzugscheck.ch — Repo Context

Vergleichs- und Lead-Qualifizierungs-Portal für 200+ geprüfte Schweizer Umzugsfirmen. Flagship-Brand im Relocation-Ökosystem von Morris Feierabend (Schweizer Builder-Operator, AI-first Solo-Founder).

## Was ist dieses Projekt
Vergleichsplattform mit KI-Preisrechner. USP: Nutzer erhalten transparente Preise und sparen bis zu 40%. Funktionen: Preisrechner, Bewertungs-System, Offerten-Generierung. Funktion im Gesamtbild: SEO-Marktanteil + Lead-Qualifizierung im Schweizer Umzugsmarkt.

## Position im Ökosystem
Top-of-Funnel im vertikal integrierten Relocation-Ökosystem. Qualifiziert breit, leitet Premium-Jobs an Feierabend Services (Execution Arm), Express-Aufträge an Umzug Express, Helden-Branding-affine Kunden an Zügelhelden. Strategische Spannung "Portal-Neutralität vs. Cherry-Picking" ist bekannt und Teil der laufenden Diskussion — bei strategischen Vorschlägen mitdenken, nicht so tun, als wäre es seamless.

## Tech-Stack
- Frontend: React / Vite
- Code-Host: GitHub
- Backend: Supabase (Leads, Pipeline-Status)
- Lead-Agent: OpenClaw (WhatsApp-Lead-Qualifizierung, 24/7-Laptop-Instanz)
- Webhook-API: interne Spezifikation in WEBHOOK.md (`create_lead`, `save_message`, `check_completeness`)
- Workflow-Zustandsmaschine: WORKFLOW.md

## Lead-Pipeline
Lead-Input (WhatsApp / Webformular) → Qualifizierung (Service-Typ, Ort, Termin, Bilder) → Datenanalyse → Draft-Antwort → Admin-Freigabe (Human-in-the-Loop) → Versand. Trigger für Human Takeover bei Spezialfällen.

## Inhaltliche Caveats
- KI-Preisrechner muss kalibriert bleiben — falsch hohe Schätzungen verbrennen Vertrauen, falsch niedrige verbrennen Marge bei den 200+ Umzugsfirmen
- Schweizer Marktspezifika immer mitdenken: CHF, SUVA, Kanton-spezifische Regulierung, deutsch/französisch/italienisch je nach Region
- Multi-Brand-Strategie: dieses Portal soll neutral wirken, gleichzeitig den Lead-Flow zu Feierabend Services optimieren — diese Spannung darf in Vorschlägen nicht weggeblendet werden

## Stil & Sprache
- Direkt, konkret, keine Anfänger-Erklärungen zu SEO/Marketing/Conversion
- Terminologie ohne Erklärung: CAC, CPL, AOV, DB-Marge, GSC, SERP, Lead-to-Cash
- Bei UX/Copy-Vorschlägen: Schweizer Tonalität (kein deutsches Hochsprech-Pathos)

## Für vollen Kontext
Claude Project: "Morris — Master Context" (volle Master-Datei v2.0)
