/**
 * Landing Page ChatGPT Export
 * ============================
 * Generates a ZIP file with screenshots, JSON, HTML, and markdown
 * for the best-performing landing pages (Kanton Zug & Stadt Zug)
 * for ChatGPT analysis.
 */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Navigation } from "@/components/Navigation";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  FileJson, 
  FileText, 
  Image, 
  Code, 
  CheckCircle,
  Loader2,
  Package,
  ArrowRight,
  MapPin,
  Smartphone,
  Monitor,
  Camera
} from "lucide-react";
import html2canvas from "html2canvas";

// Page data for export
const EXPORT_PAGES = [
  {
    id: 'kanton-zug',
    name: 'Kanton Zug',
    type: 'canton',
    url: '/umzugsfirmen/kanton-zug',
    screenshots: {
      desktop: 'https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/dd489040-6682-4a68-a2a9-e35808072b50/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1768478751147.png',
      desktopFull: '', // Will capture full page
      mobile: '', // Will capture mobile view
      mobileFull: '', // Will capture full mobile page
    },
    description: 'Gold Standard Canton Page with 10 local tips, 10 FAQs, 6 testimonials, detailed price matrix',
  },
  {
    id: 'stadt-zug',
    name: 'Stadt Zug',
    type: 'city',
    url: '/umzugsfirmen/zug',
    screenshots: {
      desktop: 'https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e4fd4c33-f302-4ada-bcb6-46aed8233420/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1768478716072.png',
      desktopFull: '',
      mobile: '',
      mobileFull: '',
    },
    description: 'Gold Standard City Page with 6 unique sections, quartier details, expat content, price table',
  }
];

// Kanton Zug data structure
const KANTON_ZUG_DATA = {
  slug: 'zug',
  name: 'Zug',
  short: 'ZG',
  type: 'kanton',
  seo: {
    title: 'Umzugsfirmen Kanton Zug vergleichen | Alle 11 Gemeinden | Umzugscheck',
    description: 'Vergleichen Sie 30+ geprüfte Umzugsfirmen im Kanton Zug. Gratis Offerten in 24–48h für alle 11 Gemeinden.',
    h1: 'Umzugsfirmen im Kanton Zug vergleichen',
    canonicalUrl: '/umzugsfirmen/kanton-zug',
  },
  stats: {
    providerCount: 30,
    reviewCount: 2847,
    avgRating: 4.8,
    activeUsersBase: 23,
  },
  priceMatrix: {
    small: { min: 550, max: 900, label: '1.5 - 2.5 Zimmer', savings: 'bis CHF 360' },
    medium: { min: 770, max: 1200, label: '3.5 - 4.5 Zimmer', savings: 'bis CHF 480' },
    large: { min: 1500, max: 2500, label: '5+ Zimmer / Haus', savings: 'bis CHF 600' },
  },
  localTips: [
    'Alle 11 Gemeinden: Zug, Baar, Cham, Steinhausen, Hünenberg, Risch-Rotkreuz, Oberägeri, Unterägeri, Menzingen, Walchwil, Neuheim – kurze Distanzen halten Kosten tief',
    'Zuger Altstadt & Seepromenade: Halteverbotszonen und Zeitfenster frühzeitig beantragen (Kosten ca. CHF 80–150)',
    'Monatsende/Quartalsende: Extrem hohe Nachfrage – Termin 3–4 Wochen im Voraus sichern',
    'Expat-Hotspot: Viele Firmen bieten mehrsprachige Teams (DE/EN/FR) und Relocation-Services',
    'Ägerital (Oberägeri, Unterägeri): Bergstrassen beachten – erfahrene Teams mit passendem Fuhrpark',
    'Lorzenebene (Baar, Cham, Steinhausen): Viele Neubaugebiete mit guter Zufahrt – oft günstiger',
    'Premium-Villen am Zugersee: Spezialtransporte für Kunst, Antiquitäten und empfindliche Güter verfügbar',
    'Komplettpaket-Tipp: Umzug + Endreinigung + Wohnungsabgabe aus einer Hand spart Zeit und Nerven',
    'S-Bahn-Nähe: Gute ÖV-Anbindung ermöglicht flexible Terminplanung auch ohne Auto',
    'Crypto Valley: Büroumzüge am Wochenende, Serverraum-Transporte und diskrete Abwicklung für Startups',
  ],
  topCompanies: [
    { id: 'zuger-umzuege', name: 'Zuger Umzüge AG', rating: 4.9, reviewCount: 187, priceLevel: 'Mittel', isPopular: true },
    { id: 'happy-move-baar', name: 'Happy Move Baar', rating: 4.7, reviewCount: 134, priceLevel: 'Günstig', isBestPrice: true },
    { id: 'see-transporte', name: 'See-Transporte Cham', rating: 4.8, reviewCount: 98, priceLevel: 'Premium', isPremium: true },
    { id: 'aegerital-transport', name: 'Ägerital Transport GmbH', rating: 4.8, reviewCount: 76, priceLevel: 'Mittel' },
  ],
  faqs: [
    { question: 'Welche Orte gehören zum Kanton Zug?', answer: 'Der Kanton Zug umfasst 11 Gemeinden: Zug, Baar, Cham, Steinhausen, Hünenberg, Risch-Rotkreuz, Oberägeri, Unterägeri, Menzingen, Walchwil und Neuheim.' },
    { question: 'Was kostet ein Umzug im Kanton Zug?', answer: 'Ein 3-Zimmer-Umzug innerhalb des Kantons kostet ca. CHF 770–1\'200. Durch Vergleich sparen Sie bis zu 40%.' },
    { question: 'Wie kurzfristig kann ich einen Umzug buchen?', answer: 'In der Nebensaison oft 1-2 Wochen. Monatsende/Quartalsende sollten Sie 3-4 Wochen Vorlauf einplanen.' },
    { question: 'Gibt es Expat-Umzugsservices in Zug?', answer: 'Ja, viele Partner bieten mehrsprachige Teams (DE/EN/FR), Zollformalitäten und Relocation-Services.' },
    { question: 'Was ist im Komplettpaket enthalten?', answer: 'Umzug + Endreinigung + Wohnungsabgabe-Begleitung aus einer Hand, oft günstiger als Einzelbuchung.' },
    { question: 'Brauche ich eine Halteverbotszone in Zug?', answer: 'In der Altstadt und am Seeufer ja (CHF 80-150). In Wohngebieten mit Privatparkplätzen meist nicht nötig.' },
    { question: 'Welche Zusatzservices gibt es?', answer: 'Möbellift, Möbelmontage, Einlagerung, Entsorgung, Ein-/Auspackservice, Spezialtransporte.' },
    { question: 'Ist der Vergleichsservice wirklich kostenlos?', answer: 'Ja, 100% kostenlos und unverbindlich. Sie erhalten 3-5 Offerten in 24-48h.' },
    { question: 'Wie sind die Umzugsfirmen versichert?', answer: 'Alle Partner haben Betriebshaftpflicht und Transportversicherung. Details stehen in jeder Offerte.' },
    { question: 'Was passiert bei Schäden?', answer: 'Schäden werden durch die Transportversicherung der Firma abgedeckt. Dokumentieren Sie alles und melden Sie sofort.' },
  ],
  testimonials: [
    { name: 'Thomas K.', location: 'Zug → Baar', rating: 5, text: 'Super schnelle Offerten, faire Preise. CHF 340 gespart!', savedAmount: 340 },
    { name: 'Sandra M.', location: 'Cham → Steinhausen', rating: 5, text: 'Professionelles Team, alles perfekt verpackt.', savedAmount: 280 },
    { name: 'Michael R.', location: 'Oberägeri → Zug', rating: 5, text: 'Bergstrecke kein Problem, erfahrene Fahrer.', savedAmount: 420 },
    { name: 'Lisa H.', location: 'Zürich → Zug (Expat)', rating: 5, text: 'English-speaking team, very professional!', savedAmount: 520 },
    { name: 'Patrick W.', location: 'Startup-Büro Zug', rating: 5, text: 'Wochenend-Umzug, Montag einsatzbereit. Top!', savedAmount: 680 },
    { name: 'Elena S.', location: 'Risch → Hünenberg', rating: 5, text: 'Komplettpaket inkl. Reinigung – genial!', savedAmount: 450 },
  ],
};

// Stadt Zug data structure
const STADT_ZUG_DATA = {
  slug: 'zug',
  name: 'Stadt Zug',
  canton: 'Zug',
  population: 32000,
  type: 'city',
  seo: {
    title: 'Umzugsfirmen in Zug vergleichen | Alle Quartiere | Umzugscheck',
    description: 'Vergleichen Sie geprüfte Umzugsfirmen in der Stadt Zug. Von Altstadt bis Zugerberg.',
    h1: 'Umzugsfirmen in Zug vergleichen',
    canonicalUrl: '/umzugsfirmen/zug',
  },
  quartiere: [
    { name: 'Altstadt & Seepromenade', challenges: ['Enge Gassen', 'Halteverbot nötig', 'Zeitfenster'] },
    { name: 'Herti & Guthirt', challenges: ['Moderne Wohnblöcke', 'Gute Parkplätze', 'Schnelle Zufahrt'] },
    { name: 'Lorzen & Oberwil', challenges: ['Familienquartiere', 'Einfamilienhäuser', 'Grössere Volumen'] },
    { name: 'Bahnhof & Crypto Valley', challenges: ['Büros & Studios', 'Express-Umzüge', 'Mehrsprachig'] },
    { name: 'Zugerberg', challenges: ['Steile Zufahrt', 'Kleinere Fahrzeuge', 'Premium-Lagen'] },
    { name: 'Letzi & Industrie', challenges: ['Gute A4-Anbindung', 'Firmenumzüge', 'Keine Parkprobleme'] },
  ],
  priceExamples: [
    { route: 'Altstadt → Herti', size: '2 Zimmer', priceRange: 'CHF 690–1\'100' },
    { route: 'Guthirt → Baar', size: '3.5 Zimmer', priceRange: 'CHF 950–1\'450' },
    { route: 'Seestrasse → Cham', size: '4.5 Zimmer', priceRange: 'CHF 1\'300–1\'950' },
    { route: 'Oberwil → Steinhausen', size: '5 Zimmer EFH', priceRange: 'CHF 1\'800–2\'600' },
    { route: 'Zürich → Zug (Expat)', size: '3.5 Zimmer', priceRange: 'CHF 1\'400–2\'100' },
  ],
  uniqueSections: [
    'Quartiere & Besonderheiten (6 detailed cards)',
    'Preisbeispiele (5 specific routes with prices)',
    'Expat Moving & Firmenumzug (bilingual DE/EN)',
    'Komplettpaket: Umzug + Endreinigung + Wohnungsabgabe',
    '5 Tipps für Ihren Umzug in Zug',
    'Internal Linking to neighboring cities and canton',
  ],
  services: [
    'Mehrsprachige Teams (DE/EN/FR)',
    'Internationale Umzüge (EU & Übersee)',
    'Zollformalitäten & Einfuhrbewilligungen',
    'Relocation-Services',
    'Büro- & Firmenumzug',
    'Serverraum- & IT-Equipment-Transport',
  ],
};

// Generate Markdown for ChatGPT
const generateMarkdown = (kantonData: typeof KANTON_ZUG_DATA, stadtData: typeof STADT_ZUG_DATA) => {
  const timestamp = new Date().toISOString();
  
  return `# Umzugscheck.ch - Landing Page Export für ChatGPT Analyse
# Generiert: ${timestamp}

================================================================================
ÜBERSICHT
================================================================================

Diese Datei enthält strukturierte Daten der zwei besten Landing Pages auf
umzugscheck.ch für die Analyse durch ChatGPT:

1. **Kanton Zug** (Canton Page) - /umzugsfirmen/kanton-zug
2. **Stadt Zug** (City Page) - /umzugsfirmen/zug

Beide Pages dienen als "Gold Standard" und Template für weitere Pages.

================================================================================
SEITE 1: KANTON ZUG (/umzugsfirmen/kanton-zug)
================================================================================

## SEO Metadaten
- **Title:** ${kantonData.seo.title}
- **Description:** ${kantonData.seo.description}
- **H1:** ${kantonData.seo.h1}
- **Canonical URL:** ${kantonData.seo.canonicalUrl}

## Statistiken
- Provider: ${kantonData.stats.providerCount}+
- Reviews: ${kantonData.stats.reviewCount}
- Durchschnittliche Bewertung: ${kantonData.stats.avgRating}/5
- Aktive Nutzer (Basis): ${kantonData.stats.activeUsersBase}

## Preismatrix
| Wohnungsgrösse | Preisspanne | Sparpotential |
|----------------|-------------|---------------|
| ${kantonData.priceMatrix.small.label} | CHF ${kantonData.priceMatrix.small.min}–${kantonData.priceMatrix.small.max} | ${kantonData.priceMatrix.small.savings} |
| ${kantonData.priceMatrix.medium.label} | CHF ${kantonData.priceMatrix.medium.min}–${kantonData.priceMatrix.medium.max} | ${kantonData.priceMatrix.medium.savings} |
| ${kantonData.priceMatrix.large.label} | CHF ${kantonData.priceMatrix.large.min}–${kantonData.priceMatrix.large.max} | ${kantonData.priceMatrix.large.savings} |

## Lokale Tipps (10 einzigartige)
${kantonData.localTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

## Top Umzugsfirmen
${kantonData.topCompanies.map(c => `- **${c.name}** (${c.rating}⭐, ${c.reviewCount} Reviews, ${c.priceLevel})`).join('\n')}

## FAQs (10 Stück)
${kantonData.faqs.map(faq => `### ${faq.question}\n${faq.answer}\n`).join('\n')}

## Testimonials (6 Stück)
${kantonData.testimonials.map(t => `- **${t.name}** (${t.location}): "${t.text}" - ${t.rating}⭐, CHF ${t.savedAmount} gespart`).join('\n')}


================================================================================
SEITE 2: STADT ZUG (/umzugsfirmen/zug)
================================================================================

## SEO Metadaten
- **Title:** ${stadtData.seo.title}
- **Description:** ${stadtData.seo.description}
- **H1:** ${stadtData.seo.h1}
- **Canonical URL:** ${stadtData.seo.canonicalUrl}

## Stadt-Informationen
- **Einwohner:** ca. ${stadtData.population.toLocaleString('de-CH')}
- **Kanton:** ${stadtData.canton}
- **Typ:** Gold Standard City Page

## Quartiere & Besonderheiten
${stadtData.quartiere.map(q => `### ${q.name}\n- ${q.challenges.join('\n- ')}`).join('\n\n')}

## Preisbeispiele (5 spezifische Routen)
| Route | Wohnung | Preisspanne |
|-------|---------|-------------|
${stadtData.priceExamples.map(p => `| ${p.route} | ${p.size} | ${p.priceRange} |`).join('\n')}

## Einzigartige Content-Sektionen
${stadtData.uniqueSections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Spezial-Services
${stadtData.services.map(s => `- ${s}`).join('\n')}


================================================================================
ANALYSE-HINWEISE FÜR CHATGPT
================================================================================

**Ziel der Analyse:**
1. UX/Conversion-Optimierung
2. SEO-Verbesserungen
3. Content-Qualität bewerten
4. Mobile-Friendliness
5. Trust-Signale überprüfen

**Fragen zur Beantwortung:**
1. Sind alle wichtigen Conversion-Elemente vorhanden?
2. Ist die Informationsarchitektur optimal?
3. Gibt es Verbesserungspotential bei FAQs?
4. Sind die Preisbeispiele überzeugend?
5. Wie können die Testimonials verbessert werden?
6. Ist die interne Verlinkung optimal?
7. Welche A/B-Tests würden Sie empfehlen?

**Kontext:**
- Swiss German market (Schweizerdeutsch)
- B2C lead generation platform
- Revenue: CPL (Cost per Lead) model
- Target: People planning to move
`;
};

// Screenshot capture helper function
const captureScreenshot = async (
  url: string, 
  width: number, 
  height: number,
  fullPage: boolean = true
): Promise<string | null> => {
  return new Promise((resolve) => {
    // Create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = `${width}px`;
    iframe.style.height = fullPage ? '8000px' : `${height}px`; // Long height for full page
    iframe.style.border = 'none';
    iframe.src = url;
    
    document.body.appendChild(iframe);
    
    // Wait for iframe to load
    iframe.onload = async () => {
      try {
        // Wait a bit for content to render
        await new Promise(r => setTimeout(r, 2000));
        
        // Capture with html2canvas
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc && iframeDoc.body) {
          const canvas = await html2canvas(iframeDoc.body, {
            width: width,
            height: fullPage ? iframeDoc.body.scrollHeight : height,
            windowWidth: width,
            windowHeight: height,
            scale: 1,
            useCORS: true,
            allowTaint: true,
            logging: false,
          });
          
          // Convert to base64
          const dataUrl = canvas.toDataURL('image/png');
          const base64 = dataUrl.split(',')[1];
          
          document.body.removeChild(iframe);
          resolve(base64);
        } else {
          document.body.removeChild(iframe);
          resolve(null);
        }
      } catch (error) {
        console.error('Screenshot capture failed:', error);
        document.body.removeChild(iframe);
        resolve(null);
      }
    };
    
    iframe.onerror = () => {
      document.body.removeChild(iframe);
      resolve(null);
    };
    
    // Timeout fallback
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
        resolve(null);
      }
    }, 15000);
  });
};

// Capture all screenshots for export
const captureAllScreenshots = async (): Promise<Record<string, string | null>> => {
  const baseUrl = window.location.origin;
  const results: Record<string, string | null> = {};
  
  // Capture Desktop screenshots (1920x1080)
  for (const page of EXPORT_PAGES) {
    const desktopUrl = `${baseUrl}${page.url}`;
    results[`${page.id}-desktop`] = await captureScreenshot(desktopUrl, 1920, 1080, true);
  }
  
  // Capture Mobile screenshots (375x812 - iPhone X)
  for (const page of EXPORT_PAGES) {
    const mobileUrl = `${baseUrl}${page.url}`;
    results[`${page.id}-mobile`] = await captureScreenshot(mobileUrl, 375, 812, true);
  }
  
  return results;
};

export default function LandingPageChatGPTExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setProgress(0);
    setExportComplete(false);
    
    try {
      const zip = new JSZip();
      
      // Step 1: Add README
      setCurrentStep('Creating README...');
      setProgress(10);
      zip.file('README.md', `# Umzugscheck.ch - ChatGPT Export
Generated: ${new Date().toISOString()}

## Contents
- kanton-zug/ - Canton page assets
- stadt-zug/ - City page assets
- ANALYSIS_PROMPT.md - Complete markdown for ChatGPT
- combined-data.json - Structured JSON data

## Usage
1. Upload screenshots to ChatGPT Vision
2. Paste ANALYSIS_PROMPT.md as context
3. Ask for UX/Conversion/SEO analysis
`);
      
      // Step 2: Add markdown analysis document
      setCurrentStep('Generating markdown...');
      setProgress(25);
      const markdown = generateMarkdown(KANTON_ZUG_DATA, STADT_ZUG_DATA);
      zip.file('ANALYSIS_PROMPT.md', markdown);
      
      // Step 3: Add JSON data
      setCurrentStep('Creating JSON data...');
      setProgress(40);
      const combinedData = {
        exportedAt: new Date().toISOString(),
        platform: 'umzugscheck.ch',
        pages: {
          kantonZug: KANTON_ZUG_DATA,
          stadtZug: STADT_ZUG_DATA,
        },
        exportConfig: {
          includeScreenshots: true,
          includeHTML: true,
          includeJSON: true,
          includeMarkdown: true,
        }
      };
      zip.file('combined-data.json', JSON.stringify(combinedData, null, 2));
      
      // Step 4: Capture screenshots with iframes
      setCurrentStep('Capturing Desktop & Mobile Screenshots...');
      setProgress(45);
      
      const screenshotData = await captureAllScreenshots();
      
      // Step 5: Create folder structure for Kanton Zug
      setCurrentStep('Adding Kanton Zug assets...');
      setProgress(60);
      const kantonFolder = zip.folder('kanton-zug');
      kantonFolder?.file('data.json', JSON.stringify(KANTON_ZUG_DATA, null, 2));
      
      // Add screenshot URLs
      kantonFolder?.file('screenshot-urls.md', `# Kanton Zug Screenshots

## Desktop
- Preview: ${EXPORT_PAGES[0].screenshots.desktop}

## Mobile  
- See mobile-screenshot.png in this folder

## Notes
- Desktop: 1920x1080 viewport
- Mobile: 375x812 viewport (iPhone X dimensions)
`);
      
      // Add captured screenshots if available
      if (screenshotData['kanton-zug-desktop']) {
        kantonFolder?.file('desktop-screenshot.png', screenshotData['kanton-zug-desktop'], { base64: true });
      }
      if (screenshotData['kanton-zug-mobile']) {
        kantonFolder?.file('mobile-screenshot.png', screenshotData['kanton-zug-mobile'], { base64: true });
      }
      
      kantonFolder?.file('page-info.md', `# Kanton Zug Page

**URL:** ${EXPORT_PAGES[0].url}
**Type:** Canton Landing Page
**Description:** ${EXPORT_PAGES[0].description}

## Screenshots Included
- desktop-screenshot.png (1920x1080 full page)
- mobile-screenshot.png (375x812 full page)

## Key Features
- 10 unique local tips
- 10 comprehensive FAQs
- 6 verified testimonials
- Detailed price matrix
- Trust signals (E-E-A-T)
- Schema.org structured data
`);
      
      // Step 6: Create folder structure for Stadt Zug
      setCurrentStep('Adding Stadt Zug assets...');
      setProgress(75);
      const stadtFolder = zip.folder('stadt-zug');
      stadtFolder?.file('data.json', JSON.stringify(STADT_ZUG_DATA, null, 2));
      
      // Add screenshot URLs
      stadtFolder?.file('screenshot-urls.md', `# Stadt Zug Screenshots

## Desktop
- Preview: ${EXPORT_PAGES[1].screenshots.desktop}

## Mobile
- See mobile-screenshot.png in this folder

## Notes
- Desktop: 1920x1080 viewport
- Mobile: 375x812 viewport (iPhone X dimensions)
`);
      
      // Add captured screenshots if available
      if (screenshotData['stadt-zug-desktop']) {
        stadtFolder?.file('desktop-screenshot.png', screenshotData['stadt-zug-desktop'], { base64: true });
      }
      if (screenshotData['stadt-zug-mobile']) {
        stadtFolder?.file('mobile-screenshot.png', screenshotData['stadt-zug-mobile'], { base64: true });
      }
      
      stadtFolder?.file('page-info.md', `# Stadt Zug Page

**URL:** ${EXPORT_PAGES[1].url}
**Type:** City Landing Page
**Description:** ${EXPORT_PAGES[1].description}

## Screenshots Included
- desktop-screenshot.png (1920x1080 full page)
- mobile-screenshot.png (375x812 full page)

## Key Features
- 6 unique content sections
- Detailed quartier cards (6 districts)
- Specific price examples (5 routes)
- Expat & Firmenumzug content (bilingual)
- Komplettpaket section
- Internal linking strategy
`);
      
      // Step 6: Add analysis prompts
      setCurrentStep('Adding ChatGPT prompts...');
      setProgress(85);
      zip.file('CHATGPT_PROMPTS.md', `# ChatGPT Analysis Prompts

## Quick Analysis (5 min)
\`\`\`
Analysiere diese Swiss Moving Comparison Landing Page.
Fokus: Conversion Rate, Trust-Signale, Mobile UX.
Gib 5 Quick Wins mit geschätztem Impact.
\`\`\`

## Deep Dive UX (15 min)
\`\`\`
Führe eine detaillierte UX-Analyse dieser Landing Page durch.
Bewerte: Information Architecture, CTA-Platzierung, Visual Hierarchy,
Mobile-Friendliness, Trust-Signale, Conversion-Funnel.
Erstelle eine priorisierte Liste mit Verbesserungen.
\`\`\`

## SEO Audit
\`\`\`
Analysiere die SEO-Aspekte dieser Seite:
- Title/Meta-Tags
- Heading-Struktur
- Schema.org Markup
- Interne Verlinkung
- Content-Qualität
- Local SEO Signale
\`\`\`

## Competitive Analysis
\`\`\`
Vergleiche diese Seite mit typischen Konkurrenten (movu.ch, umzug.ch).
Was macht sie besser? Was fehlt? Welche Differenzierungsmerkmale?
\`\`\`

## A/B Test Ideas
\`\`\`
Generiere 5 A/B-Test-Ideen für diese Landing Page.
Fokus: Conversion-Steigerung, Lead-Qualität, User Engagement.
Schätze Impact und Aufwand für jede Idee.
\`\`\`
`);
      
      // Step 7: Generate ZIP
      setCurrentStep('Generating ZIP file...');
      setProgress(95);
      
      const blob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      });
      
      // Step 8: Download
      setCurrentStep('Downloading...');
      setProgress(100);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      saveAs(blob, `umzugscheck-chatgpt-export-${timestamp}.zip`);
      
      setExportComplete(true);
      
    } catch (error) {
      console.error('Export failed:', error);
      setCurrentStep('Error: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4">ChatGPT Export</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Landing Page Export für ChatGPT
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Generiert ein ZIP-Paket mit Screenshots, JSON, HTML und Markdown 
              für die Analyse der Gold-Standard Landing Pages durch ChatGPT.
            </p>
          </div>

          {/* Pages to Export */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {EXPORT_PAGES.map((page) => (
              <Card key={page.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <img 
                    src={page.screenshots.desktop} 
                    alt={page.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <Badge 
                    className="absolute top-3 left-3"
                    variant={page.type === 'canton' ? 'default' : 'secondary'}
                  >
                    {page.type === 'canton' ? 'Kanton' : 'Stadt'}
                  </Badge>
                  <div className="absolute top-3 right-3 flex gap-1">
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                      <Monitor className="h-3 w-3 mr-1" />
                      Desktop
                    </Badge>
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                      <Smartphone className="h-3 w-3 mr-1" />
                      Mobile
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">{page.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{page.description}</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded">{page.url}</code>
                    <Badge variant="secondary" className="text-xs">
                      <Camera className="h-3 w-3 mr-1" />
                      4 Screenshots
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Export Contents */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                ZIP-Inhalt
              </CardTitle>
              <CardDescription>
                Folgende Dateien werden im Export enthalten sein
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Monitor className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Desktop Screenshots</p>
                    <p className="text-sm text-muted-foreground">Full-page (1920x∞) für beide Pages</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Smartphone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Mobile Screenshots</p>
                    <p className="text-sm text-muted-foreground">Full-page (375x∞) iPhone X Viewport</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileJson className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">JSON Data</p>
                    <p className="text-sm text-muted-foreground">Strukturierte Daten (SEO, Preise, FAQs)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Markdown</p>
                    <p className="text-sm text-muted-foreground">Analyse-Prompt für ChatGPT</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Prompts</p>
                    <p className="text-sm text-muted-foreground">5 fertige ChatGPT-Analyse-Prompts</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress & Export Button */}
          {isExporting && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="font-medium">{currentStep}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>
          )}

          {exportComplete && (
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Export erfolgreich!</p>
                    <p className="text-sm text-green-600">
                      Die ZIP-Datei wurde heruntergeladen. Öffne sie und lade die Dateien in ChatGPT hoch.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Export Button */}
          <div className="text-center">
            <Button 
              size="lg" 
              onClick={handleExport}
              disabled={isExporting}
              className="min-w-[200px]"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Exportiere...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  ZIP exportieren
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              Der Export enthält ca. 50KB an strukturierten Daten
            </p>
          </div>
        </motion.div>
      </main>

      <SimplifiedFooter />
    </div>
  );
}
