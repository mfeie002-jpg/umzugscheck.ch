import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExtractionResult {
  formStructure: FormField[];
  copyInventory: CopyItem[];
  designTokens: DesignTokens;
  errorLogs: ErrorLogEntry[];
  heatmapData: HeatmapData;
  sessionData: SessionData;
}

interface FormField {
  type: string;
  name: string;
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
  validation: string | null;
  step: number;
}

interface CopyItem {
  type: 'headline' | 'cta' | 'label' | 'microcopy' | 'error' | 'placeholder';
  text: string;
  element: string;
  location: string;
}

interface DesignTokens {
  colors: { value: string; usage: string; count: number }[];
  fonts: { family: string; weights: string[]; usage: string }[];
  spacing: { value: string; count: number }[];
  borderRadius: { value: string; count: number }[];
  shadows: { value: string; count: number }[];
}

interface ErrorLogEntry {
  type: 'js' | 'network' | 'console';
  message: string;
  source: string;
  timestamp: string;
  count: number;
}

interface HeatmapData {
  clicks: { x: number; y: number; element: string; count: number }[];
  scrollDepth: { depth: number; percentage: number }[];
  attention: { element: string; timeSpent: number; percentage: number }[];
  deadClicks: { x: number; y: number; element: string; count: number }[];
}

interface SessionData {
  averageSessionDuration: number;
  pagesPerSession: number;
  bounceRate: number;
  exitPages: { page: string; percentage: number }[];
  userFlows: { path: string[]; count: number; conversionRate: number }[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, html, extractionTypes } = await req.json();
    
    console.log('Extract Page Data called for:', url);
    console.log('Extraction types:', extractionTypes);

    const result: Partial<ExtractionResult> = {};

    // Extract form structure from HTML
    if (extractionTypes.includes('formStructure') && html) {
      result.formStructure = extractFormStructure(html);
    }

    // Extract copy/text inventory from HTML
    if (extractionTypes.includes('copyInventory') && html) {
      result.copyInventory = extractCopyInventory(html);
    }

    // Extract design tokens from HTML (inline styles + class patterns)
    if (extractionTypes.includes('designTokens') && html) {
      result.designTokens = extractDesignTokens(html);
    }

    // Generate simulated error logs (would need real browser integration)
    if (extractionTypes.includes('errorLogs')) {
      result.errorLogs = generateSimulatedErrorLogs(url);
    }

    // Generate simulated heatmap data (would need real tracking)
    if (extractionTypes.includes('heatmapData')) {
      result.heatmapData = generateSimulatedHeatmapData();
    }

    // Generate simulated session data (would need real analytics)
    if (extractionTypes.includes('sessionData')) {
      result.sessionData = generateSimulatedSessionData();
    }

    console.log('Extraction complete:', Object.keys(result));

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in extract-page-data:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// ============================================================================
// FORM STRUCTURE EXTRACTION
// ============================================================================
function extractFormStructure(html: string): FormField[] {
  const fields: FormField[] = [];
  
  // Match input, select, textarea elements
  const inputRegex = /<(input|select|textarea)[^>]*>/gi;
  const labelRegex = /<label[^>]*for=["']([^"']+)["'][^>]*>([^<]+)</gi;
  
  // Build label map
  const labels: Record<string, string> = {};
  let labelMatch;
  while ((labelMatch = labelRegex.exec(html)) !== null) {
    labels[labelMatch[1]] = labelMatch[2].trim();
  }
  
  let match;
  let stepNumber = 1;
  
  // Detect step boundaries
  const stepMatches = html.match(/step[-_]?(\d+)|data-step=["'](\d+)["']/gi) || [];
  
  while ((match = inputRegex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const fullTag = match[0];
    
    // Extract attributes
    const typeMatch = fullTag.match(/type=["']([^"']+)["']/i);
    const nameMatch = fullTag.match(/name=["']([^"']+)["']/i);
    const idMatch = fullTag.match(/id=["']([^"']+)["']/i);
    const placeholderMatch = fullTag.match(/placeholder=["']([^"']+)["']/i);
    const requiredMatch = fullTag.match(/required/i);
    const patternMatch = fullTag.match(/pattern=["']([^"']+)["']/i);
    
    const id = idMatch?.[1] || nameMatch?.[1] || '';
    
    // Skip hidden and submit
    const type = typeMatch?.[1] || (tag === 'textarea' ? 'textarea' : 'text');
    if (type === 'hidden' || type === 'submit') continue;
    
    fields.push({
      type: tag === 'select' ? 'select' : type,
      name: nameMatch?.[1] || '',
      id,
      label: labels[id] || '',
      placeholder: placeholderMatch?.[1] || '',
      required: !!requiredMatch,
      validation: patternMatch?.[1] || null,
      step: stepNumber
    });
  }
  
  return fields;
}

// ============================================================================
// COPY INVENTORY EXTRACTION
// ============================================================================
function extractCopyInventory(html: string): CopyItem[] {
  const items: CopyItem[] = [];
  
  // Headlines (h1-h6)
  const headlineRegex = /<h([1-6])[^>]*>([^<]+)</gi;
  let match;
  while ((match = headlineRegex.exec(html)) !== null) {
    items.push({
      type: 'headline',
      text: match[2].trim(),
      element: `h${match[1]}`,
      location: 'page'
    });
  }
  
  // Buttons / CTAs
  const buttonRegex = /<button[^>]*>([^<]+)</gi;
  while ((match = buttonRegex.exec(html)) !== null) {
    const text = match[1].trim();
    if (text) {
      items.push({
        type: 'cta',
        text,
        element: 'button',
        location: 'page'
      });
    }
  }
  
  // Links with clear CTA text
  const linkRegex = /<a[^>]*>([^<]{3,50})</gi;
  while ((match = linkRegex.exec(html)) !== null) {
    const text = match[1].trim();
    if (text && !text.includes('{') && !text.includes('<')) {
      items.push({
        type: 'cta',
        text,
        element: 'a',
        location: 'page'
      });
    }
  }
  
  // Labels
  const labelRegex = /<label[^>]*>([^<]+)</gi;
  while ((match = labelRegex.exec(html)) !== null) {
    items.push({
      type: 'label',
      text: match[1].trim(),
      element: 'label',
      location: 'form'
    });
  }
  
  // Placeholders
  const placeholderRegex = /placeholder=["']([^"']+)["']/gi;
  while ((match = placeholderRegex.exec(html)) !== null) {
    items.push({
      type: 'placeholder',
      text: match[1],
      element: 'input',
      location: 'form'
    });
  }
  
  // Small text / microcopy
  const smallRegex = /<(small|span[^>]*text-sm|p[^>]*text-xs)[^>]*>([^<]+)</gi;
  while ((match = smallRegex.exec(html)) !== null) {
    const text = match[2].trim();
    if (text.length > 10 && text.length < 200) {
      items.push({
        type: 'microcopy',
        text,
        element: 'small',
        location: 'page'
      });
    }
  }
  
  return items;
}

// ============================================================================
// DESIGN TOKENS EXTRACTION
// ============================================================================
function extractDesignTokens(html: string): DesignTokens {
  const colors: Map<string, { usage: string; count: number }> = new Map();
  const fonts: Map<string, Set<string>> = new Map();
  const spacing: Map<string, number> = new Map();
  const borderRadius: Map<string, number> = new Map();
  const shadows: Map<string, number> = new Map();
  
  // Extract colors from Tailwind classes and inline styles
  const colorClassRegex = /(bg|text|border|fill|stroke)-([\w]+-\d{2,3}|white|black|transparent)/g;
  let match;
  while ((match = colorClassRegex.exec(html)) !== null) {
    const color = match[2];
    const usage = match[1];
    const key = color;
    if (colors.has(key)) {
      colors.get(key)!.count++;
    } else {
      colors.set(key, { usage, count: 1 });
    }
  }
  
  // Hex colors
  const hexRegex = /#([0-9A-Fa-f]{3,8})\b/g;
  while ((match = hexRegex.exec(html)) !== null) {
    const color = `#${match[1]}`;
    if (colors.has(color)) {
      colors.get(color)!.count++;
    } else {
      colors.set(color, { usage: 'inline', count: 1 });
    }
  }
  
  // Font families
  const fontFamilyRegex = /font-(sans|serif|mono|[\w]+)/g;
  while ((match = fontFamilyRegex.exec(html)) !== null) {
    if (!fonts.has(match[1])) {
      fonts.set(match[1], new Set());
    }
  }
  
  // Font weights
  const fontWeightRegex = /font-(thin|light|normal|medium|semibold|bold|extrabold|black)/g;
  while ((match = fontWeightRegex.exec(html)) !== null) {
    // Add to first font family or create default
    const firstFont = fonts.keys().next().value || 'default';
    if (!fonts.has(firstFont)) {
      fonts.set(firstFont, new Set());
    }
    fonts.get(firstFont)!.add(match[1]);
  }
  
  // Spacing (padding, margin, gap)
  const spacingRegex = /(p|m|gap|space)[\w]*-(\d+|px|\[\d+px\])/g;
  while ((match = spacingRegex.exec(html)) !== null) {
    const value = match[2];
    spacing.set(value, (spacing.get(value) || 0) + 1);
  }
  
  // Border radius
  const radiusRegex = /rounded(-[\w]+)?/g;
  while ((match = radiusRegex.exec(html)) !== null) {
    const value = match[1] || 'default';
    borderRadius.set(value, (borderRadius.get(value) || 0) + 1);
  }
  
  // Shadows
  const shadowRegex = /shadow(-[\w]+)?/g;
  while ((match = shadowRegex.exec(html)) !== null) {
    const value = match[1] || 'default';
    shadows.set(value, (shadows.get(value) || 0) + 1);
  }
  
  return {
    colors: Array.from(colors.entries())
      .map(([value, data]) => ({ value, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
    fonts: Array.from(fonts.entries()).map(([family, weights]) => ({
      family,
      weights: Array.from(weights),
      usage: 'body'
    })),
    spacing: Array.from(spacing.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15),
    borderRadius: Array.from(borderRadius.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count),
    shadows: Array.from(shadows.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
  };
}

// ============================================================================
// SIMULATED DATA GENERATORS (would need real browser/analytics integration)
// ============================================================================

function generateSimulatedErrorLogs(url: string): ErrorLogEntry[] {
  // These would come from real error tracking in production
  return [
    {
      type: 'js',
      message: 'Uncaught TypeError: Cannot read property of undefined',
      source: 'main.js:234',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      count: 12
    },
    {
      type: 'network',
      message: 'Failed to load resource: 404',
      source: '/api/tracking',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      count: 5
    },
    {
      type: 'console',
      message: 'Warning: validateDOMNesting',
      source: 'react-dom',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      count: 23
    }
  ];
}

function generateSimulatedHeatmapData(): HeatmapData {
  return {
    clicks: [
      { x: 512, y: 320, element: 'button.cta-primary', count: 847 },
      { x: 200, y: 150, element: 'nav a.logo', count: 234 },
      { x: 600, y: 450, element: 'input#email', count: 567 },
      { x: 300, y: 600, element: 'button.next-step', count: 432 },
      { x: 800, y: 200, element: 'a.back', count: 89 }
    ],
    scrollDepth: [
      { depth: 25, percentage: 95 },
      { depth: 50, percentage: 78 },
      { depth: 75, percentage: 52 },
      { depth: 100, percentage: 31 }
    ],
    attention: [
      { element: 'section.hero', timeSpent: 4.2, percentage: 28 },
      { element: 'form.main', timeSpent: 8.5, percentage: 56 },
      { element: 'section.trust', timeSpent: 1.8, percentage: 12 },
      { element: 'footer', timeSpent: 0.5, percentage: 4 }
    ],
    deadClicks: [
      { x: 450, y: 280, element: 'div.card', count: 67 },
      { x: 320, y: 180, element: 'span.price', count: 45 },
      { x: 700, y: 350, element: 'img.illustration', count: 23 }
    ]
  };
}

function generateSimulatedSessionData(): SessionData {
  return {
    averageSessionDuration: 187, // seconds
    pagesPerSession: 3.4,
    bounceRate: 34.2,
    exitPages: [
      { page: '/umzugsofferten/step-2', percentage: 28 },
      { page: '/umzugsofferten/step-4', percentage: 18 },
      { page: '/umzugsofferten', percentage: 15 },
      { page: '/firmen', percentage: 12 },
      { page: '/danke', percentage: 27 }
    ],
    userFlows: [
      { path: ['/', '/umzugsofferten', '/step-2', '/step-3', '/danke'], count: 234, conversionRate: 12.4 },
      { path: ['/', '/umzugsofferten', '/step-2'], count: 567, conversionRate: 0 },
      { path: ['/firmen', '/firma/xyz', '/umzugsofferten'], count: 123, conversionRate: 8.7 },
      { path: ['/', '/preisrechner', '/umzugsofferten'], count: 89, conversionRate: 15.2 }
    ]
  };
}
