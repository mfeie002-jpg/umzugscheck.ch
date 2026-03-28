// ============================================================================
// PAGE DATA EXTRACTOR - Client-side utilities for extracting page data
// ============================================================================

import { supabase } from "@/integrations/supabase/client";

export interface FormField {
  type: string;
  name: string;
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
  validation: string | null;
  step: number;
}

export interface CopyItem {
  type: 'headline' | 'cta' | 'label' | 'microcopy' | 'error' | 'placeholder';
  text: string;
  element: string;
  location: string;
}

export interface DesignTokens {
  colors: { value: string; usage: string; count: number }[];
  fonts: { family: string; weights: string[]; usage: string }[];
  spacing: { value: string; count: number }[];
  borderRadius: { value: string; count: number }[];
  shadows: { value: string; count: number }[];
}

export interface ErrorLogEntry {
  type: 'js' | 'network' | 'console';
  message: string;
  source: string;
  timestamp: string;
  count: number;
}

export interface HeatmapData {
  clicks: { x: number; y: number; element: string; count: number }[];
  scrollDepth: { depth: number; percentage: number }[];
  attention: { element: string; timeSpent: number; percentage: number }[];
  deadClicks: { x: number; y: number; element: string; count: number }[];
}

export interface SessionData {
  averageSessionDuration: number;
  pagesPerSession: number;
  bounceRate: number;
  exitPages: { page: string; percentage: number }[];
  userFlows: { path: string[]; count: number; conversionRate: number }[];
}

export interface PageDataExtractionResult {
  formStructure?: FormField[];
  copyInventory?: CopyItem[];
  designTokens?: DesignTokens;
  errorLogs?: ErrorLogEntry[];
  heatmapData?: HeatmapData;
  sessionData?: SessionData;
}

export type ExtractionType = 
  | 'formStructure' 
  | 'copyInventory' 
  | 'designTokens' 
  | 'errorLogs' 
  | 'heatmapData' 
  | 'sessionData';

/**
 * Extract page data using the edge function
 */
export async function extractPageData(
  url: string,
  html: string,
  extractionTypes: ExtractionType[]
): Promise<PageDataExtractionResult> {
  const { data, error } = await supabase.functions.invoke('extract-page-data', {
    body: { url, html, extractionTypes }
  });

  if (error) {
    console.error('Failed to extract page data:', error);
    throw error;
  }

  return data?.data || {};
}

/**
 * Extract all available data types
 */
export async function extractAllPageData(
  url: string,
  html: string
): Promise<PageDataExtractionResult> {
  return extractPageData(url, html, [
    'formStructure',
    'copyInventory',
    'designTokens',
    'errorLogs',
    'heatmapData',
    'sessionData'
  ]);
}

/**
 * Format extraction results as markdown for ChatGPT
 */
export function formatExtractionAsMarkdown(
  data: PageDataExtractionResult,
  url: string
): string {
  const sections: string[] = [];
  
  sections.push(`# Page Data Extraction: ${url}`);
  sections.push(`*Extracted at: ${new Date().toISOString()}*\n`);

  // Form Structure
  if (data.formStructure && data.formStructure.length > 0) {
    sections.push('## 📝 Form Structure\n');
    sections.push('| Field | Type | Required | Label | Placeholder |');
    sections.push('|-------|------|----------|-------|-------------|');
    data.formStructure.forEach(field => {
      sections.push(`| ${field.name || field.id} | ${field.type} | ${field.required ? '✓' : ''} | ${field.label || '-'} | ${field.placeholder || '-'} |`);
    });
    sections.push('');
  }

  // Copy Inventory
  if (data.copyInventory && data.copyInventory.length > 0) {
    sections.push('## ✍️ Copy Inventory\n');
    
    const headlines = data.copyInventory.filter(c => c.type === 'headline');
    const ctas = data.copyInventory.filter(c => c.type === 'cta');
    const labels = data.copyInventory.filter(c => c.type === 'label');
    
    if (headlines.length > 0) {
      sections.push('### Headlines');
      headlines.forEach(h => sections.push(`- **${h.element}**: "${h.text}"`));
      sections.push('');
    }
    
    if (ctas.length > 0) {
      sections.push('### CTAs / Buttons');
      ctas.forEach(c => sections.push(`- "${c.text}"`));
      sections.push('');
    }
    
    if (labels.length > 0) {
      sections.push('### Form Labels');
      labels.slice(0, 15).forEach(l => sections.push(`- ${l.text}`));
      sections.push('');
    }
  }

  // Design Tokens
  if (data.designTokens) {
    sections.push('## 🎨 Design Tokens\n');
    
    if (data.designTokens.colors.length > 0) {
      sections.push('### Colors (Top 10)');
      data.designTokens.colors.slice(0, 10).forEach(c => {
        sections.push(`- \`${c.value}\` - ${c.usage} (${c.count}x)`);
      });
      sections.push('');
    }
    
    if (data.designTokens.fonts.length > 0) {
      sections.push('### Fonts');
      data.designTokens.fonts.forEach(f => {
        sections.push(`- **${f.family}**: ${f.weights.join(', ') || 'default'}`);
      });
      sections.push('');
    }
    
    if (data.designTokens.spacing.length > 0) {
      sections.push('### Spacing (Top 10)');
      data.designTokens.spacing.slice(0, 10).forEach(s => {
        sections.push(`- \`${s.value}\` (${s.count}x)`);
      });
      sections.push('');
    }
  }

  // Heatmap Data
  if (data.heatmapData) {
    sections.push('## 🔥 Heatmap Data\n');
    
    sections.push('### Click Hotspots');
    data.heatmapData.clicks.forEach(c => {
      sections.push(`- \`${c.element}\`: ${c.count} clicks at (${c.x}, ${c.y})`);
    });
    sections.push('');
    
    sections.push('### Scroll Depth');
    data.heatmapData.scrollDepth.forEach(s => {
      sections.push(`- ${s.depth}%: ${s.percentage}% of users`);
    });
    sections.push('');
    
    sections.push('### Attention (Time Spent)');
    data.heatmapData.attention.forEach(a => {
      sections.push(`- \`${a.element}\`: ${a.timeSpent}s (${a.percentage}%)`);
    });
    sections.push('');
    
    if (data.heatmapData.deadClicks.length > 0) {
      sections.push('### ⚠️ Dead Clicks (Frustration Signals)');
      data.heatmapData.deadClicks.forEach(d => {
        sections.push(`- \`${d.element}\`: ${d.count} frustrated clicks`);
      });
      sections.push('');
    }
  }

  // Session Data
  if (data.sessionData) {
    sections.push('## 📊 Session Analytics\n');
    sections.push(`- **Avg. Session Duration**: ${data.sessionData.averageSessionDuration}s`);
    sections.push(`- **Pages per Session**: ${data.sessionData.pagesPerSession}`);
    sections.push(`- **Bounce Rate**: ${data.sessionData.bounceRate}%`);
    sections.push('');
    
    sections.push('### Exit Pages');
    data.sessionData.exitPages.forEach(e => {
      sections.push(`- ${e.page}: ${e.percentage}%`);
    });
    sections.push('');
    
    sections.push('### Top User Flows');
    data.sessionData.userFlows.forEach(f => {
      sections.push(`- ${f.path.join(' → ')} (${f.count}x, ${f.conversionRate}% conv.)`);
    });
    sections.push('');
  }

  // Error Logs
  if (data.errorLogs && data.errorLogs.length > 0) {
    sections.push('## ⚠️ Error Logs\n');
    data.errorLogs.forEach(e => {
      sections.push(`- **[${e.type.toUpperCase()}]** ${e.message}`);
      sections.push(`  - Source: ${e.source} (${e.count}x)`);
    });
    sections.push('');
  }

  return sections.join('\n');
}

/**
 * Format extraction results as JSON for export
 */
export function formatExtractionAsJSON(
  data: PageDataExtractionResult,
  url: string
): object {
  return {
    url,
    extractedAt: new Date().toISOString(),
    ...data
  };
}
