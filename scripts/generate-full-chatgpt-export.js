/**
 * COMPREHENSIVE ChatGPT Export for Umzugscheck.ch
 * Exports everything needed for effective AI collaboration:
 * - Design System (CSS + Tailwind config)
 * - Project Structure
 * - Key Components
 * - Documentation
 * - Database Schema (from types.ts)
 * - Custom Knowledge/Context
 * 
 * Run: node scripts/generate-full-chatgpt-export.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const OUTPUT_FILE = 'public/chatgpt-full-export.txt';
const SUMMARY_FILE = 'public/chatgpt-export-summary.md';

// Core design system files
const DESIGN_SYSTEM_FILES = [
  'src/index.css',
  'tailwind.config.ts',
];

// Documentation files
const DOC_FILES = [
  'docs/STRATEGY.md',
  'docs/CLEANUP-ROADMAP.md',
  'docs/CONTRIBUTING.md',
  'docs/content-editing.md',
  'docs/strategic-analysis-v9-archetyp.md',
  'public/CHATGPT_ANALYSE_UEBERSICHT.md',
];

// Key component directories to export
const KEY_COMPONENT_DIRS = [
  'src/pages',
  'src/components/homepage',
  'src/components/layout',
  'src/components/navigation',
  'src/components/ui',
  'src/components/flows',
  'src/components/calculator',
  'src/components/common',
];

// Funnel variants (important for understanding flow structure)
const FUNNEL_DIRS = [
  'src/components/funnel-v1',
  'src/components/funnel-v1b',
  'src/components/funnel-v1d',
  'src/components/funnel-v1e',
  'src/components/funnel-v2e',
  'src/components/offerten-v2',
  'src/components/ultimate-flow',
  'src/components/swissmove-v7',
  'src/components/video-first-v4',
  'src/components/zerofriction-v9',
];

// Config files
const CONFIG_FILES = [
  'vite.config.ts',
  'tsconfig.json',
];

// Edge functions
const EDGE_FUNCTION_DIR = 'supabase/functions';

function readFileContent(filePath) {
  try {
    return fs.readFileSync(path.join(rootDir, filePath), 'utf-8');
  } catch (e) {
    return null;
  }
}

function getFilesFromDir(dir, extensions = ['.tsx', '.ts', '.css', '.md']) {
  const fullPath = path.join(rootDir, dir);
  if (!fs.existsSync(fullPath)) return [];
  
  try {
    return fs.readdirSync(fullPath)
      .filter(file => extensions.some(ext => file.endsWith(ext)))
      .map(file => path.join(dir, file));
  } catch (e) {
    return [];
  }
}

function getSubdirectories(dir) {
  const fullPath = path.join(rootDir, dir);
  if (!fs.existsSync(fullPath)) return [];
  
  try {
    return fs.readdirSync(fullPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(dir, dirent.name));
  } catch (e) {
    return [];
  }
}

function generateProjectStructure() {
  let structure = '';
  
  // Get all component directories
  const componentDirs = getSubdirectories('src/components');
  structure += 'src/components/\n';
  componentDirs.forEach(dir => {
    const files = getFilesFromDir(dir, ['.tsx', '.ts']);
    structure += `  ├── ${path.basename(dir)}/ (${files.length} files)\n`;
  });
  
  // Pages
  const pages = getFilesFromDir('src/pages', ['.tsx']);
  structure += `src/pages/ (${pages.length} pages)\n`;
  pages.forEach(page => {
    structure += `  ├── ${path.basename(page)}\n`;
  });
  
  // Edge functions
  const edgeFunctions = getSubdirectories(EDGE_FUNCTION_DIR);
  structure += `supabase/functions/ (${edgeFunctions.length} functions)\n`;
  edgeFunctions.forEach(fn => {
    structure += `  ├── ${path.basename(fn)}/\n`;
  });
  
  return structure;
}

function generateSummary(stats) {
  return `# Umzugscheck.ch - ChatGPT Export Summary

## Projekt Übersicht
Umzugscheck.ch ist die führende Schweizer Umzugs-Vergleichsplattform.

### Tech Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Lovable Cloud)
- **Animations:** Framer Motion

### Export Statistiken
- **Design System Files:** ${stats.designSystem}
- **Dokumentation:** ${stats.docs}
- **Pages:** ${stats.pages}
- **Homepage Components:** ${stats.homepage}
- **Funnel Variants:** ${stats.funnels}
- **Edge Functions:** ${stats.edgeFunctions}
- **Generiert:** ${new Date().toISOString()}

## Kernfunktionen
1. **Preisrechner** - Umzugs-, Reinigungs-, Entsorgungsrechner
2. **Umzugsfirmen Ranking** - Beste/günstige Firmen nach Region
3. **Offerten-Funnel** - Lead-Generierung mit 9+ Varianten
4. **Regionale Seiten** - Zürich, Bern, Basel, etc.
5. **Ratgeber** - Umzugstipps und Checklisten

## Design System Highlights
- Primärfarbe: Starkes Schweizer Blau
- Mobile-first Approach
- Klare CTAs: "Offerten erhalten"
- Trust-Elemente: Bewertungen, Badges

## Wichtige Konventionen
- Semantic CSS Tokens verwenden (--primary, --background, etc.)
- Komponenten klein und fokussiert halten
- Deutsche Texte für Schweizer Markt
- SEO-optimierte Struktur

## Dateipfade für ChatGPT
\`\`\`
/public/chatgpt-full-export.txt  - Vollständiger Code-Export
/public/chatgpt-export-summary.md - Diese Zusammenfassung
\`\`\`
`;
}

function generateExport() {
  const timestamp = new Date().toISOString();
  let output = `# ================================================================================
# Umzugscheck.ch - COMPLETE ChatGPT Export
# Generated: ${timestamp}
# 
# This file contains everything you need to understand and improve the project:
# - Design System (colors, typography, spacing)
# - Project Structure
# - Key Components
# - Documentation
# - Database Types
# ================================================================================

`;

  const stats = {
    designSystem: 0,
    docs: 0,
    pages: 0,
    homepage: 0,
    funnels: 0,
    edgeFunctions: 0,
  };

  // ============ PROJECT STRUCTURE ============
  output += `\n${'='.repeat(80)}\n`;
  output += `PROJECT STRUCTURE\n`;
  output += `${'='.repeat(80)}\n\n`;
  output += generateProjectStructure();

  // ============ DESIGN SYSTEM ============
  output += `\n${'='.repeat(80)}\n`;
  output += `DESIGN SYSTEM\n`;
  output += `${'='.repeat(80)}\n`;

  for (const file of DESIGN_SYSTEM_FILES) {
    const content = readFileContent(file);
    if (content) {
      output += `\n${'-'.repeat(60)}\n`;
      output += `FILE: ${file}\n`;
      output += `${'-'.repeat(60)}\n\n`;
      output += content;
      output += '\n';
      stats.designSystem++;
    }
  }

  // ============ DOCUMENTATION ============
  output += `\n${'='.repeat(80)}\n`;
  output += `DOCUMENTATION\n`;
  output += `${'='.repeat(80)}\n`;

  for (const file of DOC_FILES) {
    const content = readFileContent(file);
    if (content) {
      output += `\n${'-'.repeat(60)}\n`;
      output += `FILE: ${file}\n`;
      output += `${'-'.repeat(60)}\n\n`;
      output += content;
      output += '\n';
      stats.docs++;
    }
  }

  // ============ PAGES ============
  output += `\n${'='.repeat(80)}\n`;
  output += `PAGES\n`;
  output += `${'='.repeat(80)}\n`;

  const pageFiles = getFilesFromDir('src/pages');
  for (const file of pageFiles) {
    const content = readFileContent(file);
    if (content) {
      output += `\n${'-'.repeat(60)}\n`;
      output += `FILE: ${file}\n`;
      output += `${'-'.repeat(60)}\n\n`;
      output += content;
      output += '\n';
      stats.pages++;
    }
  }

  // ============ HOMEPAGE COMPONENTS ============
  output += `\n${'='.repeat(80)}\n`;
  output += `HOMEPAGE COMPONENTS\n`;
  output += `${'='.repeat(80)}\n`;

  const homepageFiles = getFilesFromDir('src/components/homepage');
  for (const file of homepageFiles) {
    const content = readFileContent(file);
    if (content) {
      output += `\n${'-'.repeat(60)}\n`;
      output += `FILE: ${file}\n`;
      output += `${'-'.repeat(60)}\n\n`;
      output += content;
      output += '\n';
      stats.homepage++;
    }
  }

  // ============ FUNNEL VARIANTS (Summary) ============
  output += `\n${'='.repeat(80)}\n`;
  output += `FUNNEL VARIANTS OVERVIEW\n`;
  output += `${'='.repeat(80)}\n\n`;

  for (const dir of FUNNEL_DIRS) {
    const files = getFilesFromDir(dir);
    if (files.length > 0) {
      output += `\n${path.basename(dir)}/ - ${files.length} components:\n`;
      files.forEach(f => {
        output += `  - ${path.basename(f)}\n`;
      });
      stats.funnels++;
    }
  }

  // ============ DATABASE TYPES (Summary) ============
  output += `\n${'='.repeat(80)}\n`;
  output += `DATABASE SCHEMA (Tables)\n`;
  output += `${'='.repeat(80)}\n\n`;

  const typesContent = readFileContent('src/integrations/supabase/types.ts');
  if (typesContent) {
    // Extract table names
    const tableMatches = typesContent.match(/(\w+): \{\s*Row:/g);
    if (tableMatches) {
      output += `Tables in database:\n`;
      tableMatches.forEach(match => {
        const tableName = match.replace(': { Row:', '').trim();
        output += `  - ${tableName}\n`;
      });
    }
  }

  // ============ EDGE FUNCTIONS ============
  output += `\n${'='.repeat(80)}\n`;
  output += `EDGE FUNCTIONS\n`;
  output += `${'='.repeat(80)}\n\n`;

  const edgeFunctions = getSubdirectories(EDGE_FUNCTION_DIR);
  edgeFunctions.forEach(fn => {
    const indexFile = path.join(fn, 'index.ts');
    const content = readFileContent(indexFile);
    if (content) {
      output += `\n${'-'.repeat(60)}\n`;
      output += `FUNCTION: ${path.basename(fn)}\n`;
      output += `${'-'.repeat(60)}\n\n`;
      // Only include first 100 lines to keep file manageable
      const lines = content.split('\n').slice(0, 100);
      output += lines.join('\n');
      if (content.split('\n').length > 100) {
        output += '\n\n// ... (truncated, full file available in codebase)\n';
      }
      stats.edgeFunctions++;
    }
  });

  // ============ CUSTOM CONTEXT FOR CHATGPT ============
  output += `\n${'='.repeat(80)}\n`;
  output += `CHATGPT COLLABORATION CONTEXT\n`;
  output += `${'='.repeat(80)}\n\n`;

  output += `## Projekt-Richtlinien für ChatGPT

### Do's
- Semantic CSS tokens verwenden (--primary, --background, etc.)
- Komponenten klein und fokussiert halten
- Deutsche Texte für Schweizer Markt
- Mobile-first Design
- Klare CTAs priorisieren

### Don'ts
- Keine hardcoded Farben (text-white, bg-black)
- Navigation Labels nicht ändern
- "Offerten erhalten" CTA nicht verstecken
- Keine experimentellen UX-Änderungen

### Wichtige Patterns
- CompanyCard für Firmenlistings
- HeroSection für Landing Pages
- FilterBar + SortDropdown für Rankings
- FaqAccordion für FAQ-Bereiche

### Funnel-Struktur
Die Plattform hat 9+ Funnel-Varianten:
- v1, v1b, v1d, v1e, v2e (Original-Varianten)
- ultimate-v6, swissmove-v7, video-first-v4, zerofriction-v9 (Neue Konzepte)

### Lead-Generierung
Alle "Offerten erhalten" Buttons führen zum Haupt-Lead-Funnel.
Tracking via conversion_analytics Tabelle.
`;

  // Write main export
  fs.writeFileSync(path.join(rootDir, OUTPUT_FILE), output);
  
  // Write summary
  const summary = generateSummary(stats);
  fs.writeFileSync(path.join(rootDir, SUMMARY_FILE), summary);
  
  console.log(`\n✅ ChatGPT Export erfolgreich generiert!\n`);
  console.log(`📄 Vollständiger Export: ${OUTPUT_FILE}`);
  console.log(`📋 Zusammenfassung: ${SUMMARY_FILE}`);
  console.log(`\n📊 Statistiken:`);
  console.log(`   - Design System: ${stats.designSystem} files`);
  console.log(`   - Dokumentation: ${stats.docs} files`);
  console.log(`   - Pages: ${stats.pages} files`);
  console.log(`   - Homepage Components: ${stats.homepage} files`);
  console.log(`   - Funnel Variants: ${stats.funnels} variants`);
  console.log(`   - Edge Functions: ${stats.edgeFunctions} functions`);
}

generateExport();
