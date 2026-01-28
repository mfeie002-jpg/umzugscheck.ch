#!/usr/bin/env node

/**
 * Umzugscheck Testing Framework - Setup Verification
 * Run this script to verify all testing infrastructure is in place
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'docs/FUNNEL_TESTING_PLAN.md',
  'docs/FUNNEL_TEST_RESULTS.md',
  'docs/FUNNEL_QUICK_REFERENCE.md',
  'docs/TESTING_INFRASTRUCTURE.md',
  'docs/SETUP_COMPLETE.md',
  'src/lib/funnel-test-helpers.ts',
  'e2e/core-20-funnels.spec.ts',
  'playwright.config.ts',
];

console.log('\n🧪 Umzugscheck Testing Framework - Setup Verification\n');
console.log('=' .repeat(60));

let allGood = true;

// Check required files
console.log('\n📋 Checking required files...\n');

REQUIRED_FILES.forEach((file) => {
  const fullPath = path.join(__dirname, '..', file);
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  const message = exists ? 'Found' : 'MISSING';
  
  console.log(`${status} ${file} (${message})`);
  
  if (!exists) {
    allGood = false;
  }
});

// Summary
console.log('\n' + '=' .repeat(60));

if (allGood) {
  console.log(`
✅ ALL SETUP COMPLETE!

Your testing framework is ready to use. Here's what you can do now:

1. RUN AUTOMATED TESTS
   npm run test:e2e

2. READ THE QUICK REFERENCE
   open docs/FUNNEL_QUICK_REFERENCE.md

3. UNDERSTAND THE FULL PROTOCOL
   open docs/FUNNEL_TESTING_PLAN.md

4. START MANUAL TESTING WITH TEST DATA
   • 5 Test Personas (P1-P5)
   • 20 Core Funnels
   • Pre-defined CSS selectors
   • Realistic fake data

5. USE WITH LOVABLE AGENT
   Copy prompt from docs/FUNNEL_QUICK_REFERENCE.md

6. TRACK WEEKLY RESULTS
   Update docs/FUNNEL_TEST_RESULTS.md

For more details, see: docs/SETUP_COMPLETE.md
  `);
} else {
  console.log(`
❌ SETUP INCOMPLETE

Some required files are missing. Please check:
  `);
  REQUIRED_FILES.forEach((file) => {
    const fullPath = path.join(__dirname, '..', file);
    if (!fs.existsSync(fullPath)) {
      console.log(`  - ${file}`);
    }
  });
}

console.log('\n' + '=' .repeat(60) + '\n');

process.exit(allGood ? 0 : 1);
