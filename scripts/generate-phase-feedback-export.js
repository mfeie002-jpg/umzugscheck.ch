/**
 * Phase-Based AI Feedback Export Generator
 * 
 * Generates focused export bundles optimized for AI feedback (Gemini/ChatGPT)
 * Each phase stays within token limits (~50-100k tokens) for effective analysis
 * 
 * Usage:
 *   node scripts/generate-phase-feedback-export.js [phase-number]
 *   node scripts/generate-phase-feedback-export.js all
 *   node scripts/generate-phase-feedback-export.js 1
 * 
 * Output: public/feedback-exports/phase-{n}.txt
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ============================================================================
// PHASE DEFINITIONS - Customize these for your project
// ============================================================================

const PHASES = [
  {
    id: 1,
    name: 'Core Funnel & Calculator',
    description: 'Main quote request funnel with multi-step calculator, address inputs, and service selection',
    goal: 'Lead generation through intuitive moving quote wizard',
    routes: ['/umzugsofferten', '/preisrechner'],
    files: [
      'src/pages/Umzugsofferten.tsx',
      'src/components/funnel/index.ts',
      'src/components/calculator/MovingCalculator.tsx',
      'src/components/calculator/StepIndicator.tsx',
      'src/components/forms/AddressAutocomplete.tsx',
    ],
    componentDirs: [
      'src/components/funnel',
      'src/components/calculator',
    ],
    questions: [
      'Is the multi-step flow intuitive for mobile users?',
      'Are there any friction points that could cause drop-offs?',
      'Is the progress indication clear enough?',
      'Are form validation and error messages user-friendly?',
      'What trust signals are missing?',
    ],
  },
  {
    id: 2,
    name: 'Funnel Variants (V1-V5)',
    description: 'A/B test variants of the core funnel with different UX approaches',
    goal: 'Test different conversion optimization strategies',
    routes: ['/umzugsofferten-v1d', '/umzugsofferten-v1e', '/umzugsofferten-v2e', '/umzugsofferten-v3d', '/umzugsofferten-v4c', '/umzugsofferten-v5b', '/umzugsofferten-v5c'],
    files: [
      'src/pages/UmzugsoffertenV1d.tsx',
      'src/pages/UmzugsoffertenV1e.tsx',
      'src/pages/UmzugsoffertenV2e.tsx',
      'src/pages/UmzugsoffertenV5b.tsx',
      'src/pages/UmzugsoffertenV5c.tsx',
    ],
    componentDirs: [
      'src/components/funnel-v1d',
      'src/components/funnel-v1e',
      'src/components/funnel-v2e',
      'src/components/marketplace-v5',
    ],
    questions: [
      'Which variant has the clearest user journey?',
      'Are the UX differences between variants significant enough for testing?',
      'Which approach is most mobile-optimized?',
      'What are the conversion pros/cons of each variant?',
      'Which trust elements are most effective?',
    ],
  },
  {
    id: 3,
    name: 'Calculator Variants (V3-V9)',
    description: 'Experimental calculator UIs: thumb-zone, fullscreen, gamified, value-first, zero-friction',
    goal: 'Find optimal calculator UX for mobile conversion',
    routes: ['/umzugsofferten-v3d', '/umzugsofferten-v3e', '/umzugsofferten-v4c', '/umzugsofferten-v4d', '/umzugsofferten-v5d', '/v9-zero-friction'],
    files: [
      'src/pages/UmzugsoffertenV3d.tsx',
      'src/pages/UmzugsoffertenV3e.tsx',
      'src/pages/UmzugsoffertenV4c.tsx',
      'src/pages/UmzugsoffertenV4d.tsx',
      'src/pages/UmzugsoffertenV5d.tsx',
      'src/pages/V9ZeroFriction.tsx',
    ],
    componentDirs: [
      'src/components/calculator-variants',
      'src/components/zerofriction-v9',
    ],
    questions: [
      'Which calculator variant is most intuitive?',
      'Is the thumb-zone optimization effective for mobile?',
      'Does gamification add value or distract?',
      'Is the zero-friction approach too minimal?',
      'Which has the best perceived speed?',
    ],
  },
  {
    id: 4,
    name: 'Company Ranking & Matching',
    description: 'Company directory, ranking pages, filtering, and matching algorithm display',
    goal: 'Help users find and compare moving companies effectively',
    routes: ['/firmen', '/beste-umzugsfirma', '/guenstige-umzugsfirma', '/firma/:slug'],
    files: [
      'src/pages/Firmen.tsx',
      'src/pages/BesteUmzugsfirma.tsx',
      'src/pages/GuenstigeUmzugsfirma.tsx',
    ],
    componentDirs: [
      'src/components/company',
      'src/components/rankings',
      'src/components/comparison',
    ],
    questions: [
      'Are company cards scannable and informative?',
      'Is the ranking logic transparent to users?',
      'Are filter/sort options intuitive?',
      'Do sponsored listings look trustworthy?',
      'Is the comparison feature easy to use?',
    ],
  },
  {
    id: 5,
    name: 'Regional & SEO Pages',
    description: 'Canton and city-specific landing pages for local SEO',
    goal: 'Rank for location-based moving search queries',
    routes: ['/umzug-zuerich', '/umzug-bern', '/kanton/:canton', '/stadt/:city'],
    files: [
      'src/pages/UmzugZuerich.tsx',
      'src/pages/UmzugBern.tsx',
      'src/pages/KantonPage.tsx',
      'src/pages/StadtPage.tsx',
    ],
    componentDirs: [
      'src/components/zuerich',
      'src/components/bern',
      'src/components/city',
      'src/components/region-archetyp',
    ],
    questions: [
      'Is local content unique enough for SEO?',
      'Are location-specific trust signals present?',
      'Is the CTA flow clear on regional pages?',
      'Are there enough internal links for SEO?',
      'Is mobile layout optimized for local search intent?',
    ],
  },
  {
    id: 6,
    name: 'Homepage & Navigation',
    description: 'Main homepage, navigation system, and core layout components',
    goal: 'Clear entry point with strong value proposition and easy navigation',
    routes: ['/', '/homepage'],
    files: [
      'src/pages/Index.tsx',
      'src/components/Navigation.tsx',
      'src/components/Footer.tsx',
      'src/components/Hero.tsx',
    ],
    componentDirs: [
      'src/components/homepage',
      'src/components/navigation',
      'src/components/layout',
    ],
    questions: [
      'Is the value proposition immediately clear?',
      'Is navigation intuitive on mobile?',
      'Are main CTAs visible above the fold?',
      'Is the trust/social proof placement effective?',
      'Does the page load feel fast?',
    ],
  },
  {
    id: 7,
    name: 'Trust & Social Proof',
    description: 'Trust badges, testimonials, reviews, and credibility elements',
    goal: 'Build user confidence through visible trust signals',
    routes: ['/bewertungen', '/ueber-uns'],
    files: [
      'src/components/TrustBadges.tsx',
      'src/components/TrustSignals.tsx',
      'src/components/Testimonials.tsx',
      'src/components/TestimonialsCarousel.tsx',
      'src/components/SocialProofTicker.tsx',
    ],
    componentDirs: [
      'src/components/trust',
      'src/components/reviews',
    ],
    questions: [
      'Are trust elements visible at decision points?',
      'Do testimonials feel authentic?',
      'Is the review display credible?',
      'Are certifications/badges recognizable?',
      'Is social proof placement strategic?',
    ],
  },
  {
    id: 8,
    name: 'Services & Content Pages',
    description: 'Service descriptions, guides, checklists, and informational content',
    goal: 'Educate users and capture long-tail SEO traffic',
    routes: ['/reinigung', '/entsorgung', '/lagerung', '/ratgeber', '/checkliste'],
    files: [
      'src/pages/Reinigung.tsx',
      'src/pages/Entsorgung.tsx',
      'src/pages/Lagerung.tsx',
      'src/pages/Ratgeber.tsx',
    ],
    componentDirs: [
      'src/components/checklist',
      'src/components/blog',
      'src/components/faq',
    ],
    questions: [
      'Is content structured for scannability?',
      'Are CTAs placed at natural conversion points?',
      'Is the FAQ comprehensive yet concise?',
      'Do service pages address user concerns?',
      'Is internal linking strategy visible?',
    ],
  },
  {
    id: 9,
    name: 'Mobile & Accessibility',
    description: 'Mobile-specific components, touch optimizations, and accessibility features',
    goal: 'Excellent mobile UX and WCAG compliance',
    routes: ['(all routes - mobile view)'],
    files: [
      'src/components/MobileBottomNav.tsx',
      'src/components/MobileMenu.tsx',
      'src/components/StickyMobileCTA.tsx',
      'src/components/SkipToContent.tsx',
    ],
    componentDirs: [
      'src/components/mobile',
      'src/components/mobile-menu',
      'src/components/accessibility',
    ],
    questions: [
      'Are touch targets large enough (48px)?',
      'Is thumb-zone navigation considered?',
      'Are forms easy to fill on mobile?',
      'Is contrast ratio WCAG compliant?',
      'Are focus states visible for keyboard users?',
    ],
  },
  {
    id: 10,
    name: 'Design System & Styling',
    description: 'CSS variables, Tailwind config, color tokens, and component styling',
    goal: 'Consistent, maintainable, and accessible visual design',
    routes: ['(global styles)'],
    files: [
      'src/index.css',
      'tailwind.config.ts',
      'src/components/ui/button.tsx',
      'src/components/ui/card.tsx',
      'src/components/ui/input.tsx',
    ],
    componentDirs: [
      'src/components/ui',
    ],
    questions: [
      'Is the color system consistent and accessible?',
      'Are spacing scales harmonious?',
      'Is dark mode properly supported?',
      'Are component variants well-organized?',
      'Is the typography hierarchy clear?',
    ],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function readFileContent(filePath) {
  try {
    const fullPath = path.join(rootDir, filePath);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    return fs.readFileSync(fullPath, 'utf-8');
  } catch (e) {
    return null;
  }
}

function getFilesFromDir(dir, extensions = ['.tsx', '.ts', '.css'], maxFiles = 10) {
  const fullPath = path.join(rootDir, dir);
  if (!fs.existsSync(fullPath)) return [];
  
  try {
    const files = fs.readdirSync(fullPath, { withFileTypes: true });
    const result = [];
    
    for (const file of files) {
      if (result.length >= maxFiles) break;
      
      if (file.isFile() && extensions.some(ext => file.name.endsWith(ext))) {
        result.push(path.join(dir, file.name));
      }
    }
    
    return result;
  } catch (e) {
    return [];
  }
}

function countTokens(text) {
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4);
}

function generatePhaseExport(phase) {
  const timestamp = new Date().toISOString();
  
  let output = `# AI Feedback Request - Phase ${phase.id}: ${phase.name}
# Project: Umzugscheck.ch (Swiss Moving Comparison Platform)
# Generated: ${timestamp}
# Token Estimate: Will be calculated below

================================================================================
CONTEXT
================================================================================

## Platform Overview
- Swiss moving comparison and lead generation platform
- Target: Homeowners planning a move in Switzerland
- Primary goal: Convert visitors to qualified moving quote requests
- Secondary: SEO ranking for moving-related searches

## This Phase: ${phase.name}
${phase.description}

### Goal
${phase.goal}

### Related Routes
${phase.routes.map(r => `- ${r}`).join('\n')}

### Key Questions for Analysis
${phase.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

================================================================================
FILES
================================================================================

`;

  let filesIncluded = 0;
  let totalTokens = countTokens(output);
  const MAX_TOKENS = 80000; // Leave room for AI response

  // Add explicit files first
  for (const file of phase.files) {
    const content = readFileContent(file);
    if (content) {
      const fileBlock = `
${'='.repeat(80)}
FILE: ${file}
${'='.repeat(80)}

${content}

`;
      const fileTokens = countTokens(fileBlock);
      if (totalTokens + fileTokens < MAX_TOKENS) {
        output += fileBlock;
        totalTokens += fileTokens;
        filesIncluded++;
      }
    }
  }

  // Add files from component directories
  for (const dir of phase.componentDirs) {
    const dirFiles = getFilesFromDir(dir, ['.tsx', '.ts'], 5);
    for (const file of dirFiles) {
      if (phase.files.includes(file)) continue; // Skip duplicates
      
      const content = readFileContent(file);
      if (content) {
        const fileBlock = `
${'-'.repeat(80)}
FILE: ${file}
${'-'.repeat(80)}

${content}

`;
        const fileTokens = countTokens(fileBlock);
        if (totalTokens + fileTokens < MAX_TOKENS) {
          output += fileBlock;
          totalTokens += fileTokens;
          filesIncluded++;
        }
      }
    }
  }

  // Add analysis prompt section
  output += `

================================================================================
ANALYSIS REQUEST
================================================================================

Please analyze the code above for Phase ${phase.id}: ${phase.name}

## Focus Areas
${phase.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

## Output Format
Please provide:

### 1. Quick Wins (Easy fixes with high impact)
- List 3-5 immediate improvements

### 2. Critical Issues (Must fix)
- Any UX problems that could hurt conversion
- Any accessibility violations
- Any mobile usability issues

### 3. Strengths
- What's working well
- Good patterns to keep

### 4. Recommendations
- Prioritized list of improvements
- Estimated effort for each (Low/Medium/High)

### 5. Comparison Notes
- How does this compare to competitors (Movu, Moveria)?
- Best practices from industry leaders

================================================================================
METADATA
================================================================================

Files included: ${filesIncluded}
Estimated tokens: ~${totalTokens.toLocaleString()}
`;

  return output;
}

function generateAllPhasesIndex() {
  const timestamp = new Date().toISOString();
  
  let output = `# Umzugscheck.ch - AI Feedback Phases Index
# Generated: ${timestamp}

## How to Use

1. Copy the content of a phase file to Gemini/ChatGPT
2. Include screenshots of key pages (mobile + desktop)
3. Ask follow-up questions based on the analysis

## Available Phases

`;

  for (const phase of PHASES) {
    output += `
### Phase ${phase.id}: ${phase.name}
File: \`public/feedback-exports/phase-${phase.id}.txt\`
${phase.description}
Routes: ${phase.routes.slice(0, 3).join(', ')}${phase.routes.length > 3 ? '...' : ''}

`;
  }

  output += `
## Tips for Effective Feedback

1. **One phase at a time** - Don't overwhelm the AI
2. **Add screenshots** - Visual context helps significantly
3. **Ask follow-ups** - Drill into specific issues
4. **Compare variants** - Ask which approach is better
5. **Request specifics** - "Show me the code fix" works well

## Screenshot Suggestions

For each phase, capture:
- Mobile view (375px width)
- Desktop view (1920px width)
- Key interaction states (hover, focus, error)
- Before/after comparisons

`;

  return output;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  const args = process.argv.slice(2);
  const outputDir = path.join(rootDir, 'public/feedback-exports');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const generatePhase = (phaseId) => {
    const phase = PHASES.find(p => p.id === phaseId);
    if (!phase) {
      console.log(`❌ Phase ${phaseId} not found`);
      return;
    }
    
    const content = generatePhaseExport(phase);
    const outputFile = path.join(outputDir, `phase-${phaseId}.txt`);
    fs.writeFileSync(outputFile, content);
    
    const tokens = countTokens(content);
    console.log(`✅ Phase ${phaseId}: ${phase.name}`);
    console.log(`   File: public/feedback-exports/phase-${phaseId}.txt`);
    console.log(`   Tokens: ~${tokens.toLocaleString()}`);
  };

  if (args[0] === 'all' || args.length === 0) {
    // Generate all phases
    console.log('📦 Generating all phase exports...\n');
    
    for (const phase of PHASES) {
      generatePhase(phase.id);
    }
    
    // Generate index
    const indexContent = generateAllPhasesIndex();
    fs.writeFileSync(path.join(outputDir, 'index.txt'), indexContent);
    console.log(`\n📋 Index: public/feedback-exports/index.txt`);
    console.log(`\n✨ Done! ${PHASES.length} phases generated.`);
  } else {
    // Generate specific phase
    const phaseId = parseInt(args[0], 10);
    if (isNaN(phaseId)) {
      console.log('Usage: node scripts/generate-phase-feedback-export.js [phase-number|all]');
      console.log('Available phases:');
      for (const phase of PHASES) {
        console.log(`  ${phase.id}: ${phase.name}`);
      }
      return;
    }
    
    generatePhase(phaseId);
  }
}

main();
