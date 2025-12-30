import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// ChatGPT Export Generator Plugin
function chatgptExportPlugin() {
  return {
    name: 'chatgpt-export-generator',
    buildStart() {
      generateChatGPTExport();
    }
  };
}

function generateChatGPTExport() {
  const rootDir = process.cwd();
  const timestamp = new Date().toISOString();
  
  const designSystemFiles = ['src/index.css', 'tailwind.config.ts'];
  
  const getFilesFromDir = (dir: string, extensions = ['.tsx', '.ts', '.css']) => {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) return [];
    return fs.readdirSync(fullPath)
      .filter(file => extensions.some(ext => file.endsWith(ext)))
      .map(file => path.join(dir, file));
  };

  const readFile = (filePath: string) => {
    try {
      return fs.readFileSync(path.join(rootDir, filePath), 'utf-8');
    } catch {
      return `// File not found: ${filePath}`;
    }
  };

  let output = `# Umzugscheck.ch - Design System & Components Export
# Generated: ${timestamp}
# Auto-generated during build

${'='.repeat(80)}
DESIGN SYSTEM
${'='.repeat(80)}
`;

  for (const file of designSystemFiles) {
    output += `\n${'-'.repeat(80)}\nFILE: ${file}\n${'-'.repeat(80)}\n\n${readFile(file)}\n`;
  }

  const sections = [
    { title: 'PAGES', dir: 'src/pages' },
    { title: 'HOMEPAGE COMPONENTS', dir: 'src/components/homepage' },
    { title: 'LAYOUT COMPONENTS', dir: 'src/components/layout' },
    { title: 'UI COMPONENTS', dir: 'src/components/ui' },
    { title: 'COMMON COMPONENTS', dir: 'src/components/common' },
    { title: 'CALCULATOR COMPONENTS', dir: 'src/components/calculator' },
    { title: 'COMPANY COMPONENTS', dir: 'src/components/company' },
    { title: 'ADMIN COMPONENTS', dir: 'src/components/admin' },
  ];

  for (const section of sections) {
    const files = getFilesFromDir(section.dir);
    if (files.length === 0) continue;
    output += `\n${'='.repeat(80)}\n${section.title}\n${'='.repeat(80)}\n`;
    for (const file of files) {
      output += `\n${'-'.repeat(80)}\nFILE: ${file}\n${'-'.repeat(80)}\n\n${readFile(file)}\n`;
    }
  }

  fs.writeFileSync(path.join(rootDir, 'public/chatgpt-export.txt'), output);
  console.log('✅ ChatGPT export generated: public/chatgpt-export.txt');
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server:import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // wichtig: 0.0.0.0
    port: 8081,
    strictPort: true,
    allowedHosts: "all", // wichtig: erlaubt trycloudflare host header
  },
});