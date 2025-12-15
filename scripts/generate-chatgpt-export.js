/**
 * Auto-generates a ChatGPT export file with design system and all pages
 * Run: node scripts/generate-chatgpt-export.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DESIGN_SYSTEM_FILES = [
  'src/index.css',
  'tailwind.config.ts',
];

const COMPONENT_DIRS = [
  'src/pages',
  'src/components/homepage',
  'src/components/layout',
  'src/components/ui',
];

const OUTPUT_FILE = 'public/chatgpt-export.txt';

function readFileContent(filePath) {
  try {
    return fs.readFileSync(path.join(rootDir, filePath), 'utf-8');
  } catch (e) {
    return `// File not found: ${filePath}`;
  }
}

function getFilesFromDir(dir, extensions = ['.tsx', '.ts', '.css']) {
  const fullPath = path.join(rootDir, dir);
  if (!fs.existsSync(fullPath)) return [];
  
  return fs.readdirSync(fullPath)
    .filter(file => extensions.some(ext => file.endsWith(ext)))
    .map(file => path.join(dir, file));
}

function generateExport() {
  const timestamp = new Date().toISOString();
  let output = `# Umzugscheck.ch - Design System & Components Export
# Generated: ${timestamp}
# This file is auto-generated during build. Do not edit manually.

================================================================================
DESIGN SYSTEM
================================================================================

`;

  // Add design system files
  for (const file of DESIGN_SYSTEM_FILES) {
    output += `\n${'='.repeat(80)}\n`;
    output += `FILE: ${file}\n`;
    output += `${'='.repeat(80)}\n\n`;
    output += readFileContent(file);
    output += '\n';
  }

  output += `\n${'='.repeat(80)}\n`;
  output += `PAGES\n`;
  output += `${'='.repeat(80)}\n`;

  // Add all pages
  const pageFiles = getFilesFromDir('src/pages');
  for (const file of pageFiles) {
    output += `\n${'-'.repeat(80)}\n`;
    output += `FILE: ${file}\n`;
    output += `${'-'.repeat(80)}\n\n`;
    output += readFileContent(file);
    output += '\n';
  }

  output += `\n${'='.repeat(80)}\n`;
  output += `HOMEPAGE COMPONENTS\n`;
  output += `${'='.repeat(80)}\n`;

  // Add homepage components
  const homepageFiles = getFilesFromDir('src/components/homepage');
  for (const file of homepageFiles) {
    output += `\n${'-'.repeat(80)}\n`;
    output += `FILE: ${file}\n`;
    output += `${'-'.repeat(80)}\n\n`;
    output += readFileContent(file);
    output += '\n';
  }

  output += `\n${'='.repeat(80)}\n`;
  output += `LAYOUT COMPONENTS\n`;
  output += `${'='.repeat(80)}\n`;

  // Add layout components
  const layoutFiles = getFilesFromDir('src/components/layout');
  for (const file of layoutFiles) {
    output += `\n${'-'.repeat(80)}\n`;
    output += `FILE: ${file}\n`;
    output += `${'-'.repeat(80)}\n\n`;
    output += readFileContent(file);
    output += '\n';
  }

  // Write output
  fs.writeFileSync(path.join(rootDir, OUTPUT_FILE), output);
  console.log(`✅ Export generated: ${OUTPUT_FILE}`);
  console.log(`   - ${DESIGN_SYSTEM_FILES.length} design system files`);
  console.log(`   - ${pageFiles.length} page files`);
  console.log(`   - ${homepageFiles.length} homepage components`);
  console.log(`   - ${layoutFiles.length} layout components`);
}

generateExport();
