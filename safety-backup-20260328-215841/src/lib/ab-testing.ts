interface ABTest {
  id: string;
  name: string;
  variants: {
    id: string;
    name: string;
    weight: number;
  }[];
}

interface ABTestResult {
  testId: string;
  variantId: string;
  timestamp: number;
}

class ABTestingManager {
  private tests: Map<string, ABTest> = new Map();
  private userAssignments: Map<string, string> = new Map();

  constructor() {
    this.loadAssignments();
  }

  registerTest(test: ABTest) {
    this.tests.set(test.id, test);
  }

  getVariant(testId: string): string | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    // Check if user already has an assignment
    const existingAssignment = this.userAssignments.get(testId);
    if (existingAssignment) {
      return existingAssignment;
    }

    // Assign variant based on weights
    const totalWeight = test.variants.reduce((sum, v) => sum + v.weight, 0);
    let random = Math.random() * totalWeight;

    for (const variant of test.variants) {
      random -= variant.weight;
      if (random <= 0) {
        this.saveAssignment(testId, variant.id);
        return variant.id;
      }
    }

    // Fallback to first variant
    const firstVariant = test.variants[0].id;
    this.saveAssignment(testId, firstVariant);
    return firstVariant;
  }

  trackConversion(testId: string, conversionType: string, value?: number) {
    const variantId = this.userAssignments.get(testId);
    if (!variantId) return;

    const result: ABTestResult = {
      testId,
      variantId,
      timestamp: Date.now()
    };

    // Store conversion data
    const conversions = this.getConversions();
    conversions.push({ ...result, conversionType, value });
    localStorage.setItem('ab_conversions', JSON.stringify(conversions));

    // In production, send to analytics backend
    // this.sendToAnalytics(result, conversionType, value);
  }

  private loadAssignments() {
    try {
      const stored = localStorage.getItem('ab_assignments');
      if (stored) {
        const assignments = JSON.parse(stored);
        this.userAssignments = new Map(Object.entries(assignments));
      }
    } catch (error) {
      console.error('Error loading AB test assignments:', error);
    }
  }

  private saveAssignment(testId: string, variantId: string) {
    this.userAssignments.set(testId, variantId);
    
    try {
      const assignments = Object.fromEntries(this.userAssignments);
      localStorage.setItem('ab_assignments', JSON.stringify(assignments));
    } catch (error) {
      console.error('Error saving AB test assignment:', error);
    }
  }

  private getConversions(): any[] {
    try {
      const stored = localStorage.getItem('ab_conversions');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading conversions:', error);
      return [];
    }
  }

  getTestResults(testId: string) {
    const conversions = this.getConversions();
    const testConversions = conversions.filter(c => c.testId === testId);

    const variantStats = new Map<string, {
      impressions: number;
      conversions: number;
      conversionRate: number;
      totalValue: number;
    }>();

    testConversions.forEach(conversion => {
      const stats = variantStats.get(conversion.variantId) || {
        impressions: 0,
        conversions: 0,
        conversionRate: 0,
        totalValue: 0
      };

      stats.impressions++;
      if (conversion.conversionType) {
        stats.conversions++;
        stats.totalValue += conversion.value || 0;
      }
      stats.conversionRate = (stats.conversions / stats.impressions) * 100;

      variantStats.set(conversion.variantId, stats);
    });

    return Object.fromEntries(variantStats);
  }
}

export const abTesting = new ABTestingManager();

// Register tests
abTesting.registerTest({
  id: 'hero_cta',
  name: 'Hero CTA Button Text',
  variants: [
    { id: 'control', name: 'Jetzt checken lassen', weight: 0.34 },
    { id: 'variant_a', name: 'Kostenlos Offerten erhalten', weight: 0.33 },
    { id: 'variant_b', name: 'Jetzt vergleichen & sparen', weight: 0.33 }
  ]
});

abTesting.registerTest({
  id: 'calculator_submit',
  name: 'Calculator Submit Button Text',
  variants: [
    { id: 'control', name: 'Offerten anfordern', weight: 0.34 },
    { id: 'variant_a', name: 'Jetzt kostenlos Offerten erhalten', weight: 0.33 },
    { id: 'variant_b', name: 'Angebote vergleichen', weight: 0.33 }
  ]
});

abTesting.registerTest({
  id: 'video_cta',
  name: 'Video Calculator CTA Text',
  variants: [
    { id: 'control', name: 'KI Video-Rechner', weight: 0.5 },
    { id: 'variant_a', name: 'Video aufnehmen & sparen', weight: 0.5 }
  ]
});

abTesting.registerTest({
  id: 'company_view_mode',
  name: 'Company List Default View',
  variants: [
    { id: 'control', name: 'Card View', weight: 0.5 },
    { id: 'variant_a', name: 'Table View', weight: 0.5 }
  ]
});

// Umzugsofferten Flow Variants A/B Test - Top 10 from Flow Command Center
abTesting.registerTest({
  id: 'offerten_flow',
  name: 'Umzugsofferten Flow Variants (Top 10)',
  variants: [
    { id: 'v2', name: 'V2 - Premium Full-Journey', weight: 0.10 },
    { id: 'v1a', name: 'V1a Control (Feedback)', weight: 0.10 },
    { id: 'v1b', name: 'V1b ChatGPT Agent', weight: 0.10 },
    { id: 'v1c', name: 'V1c Gemini Pro', weight: 0.10 },
    { id: 'v1d', name: 'V1d ChatGPT Pro Ext', weight: 0.10 },
    { id: 'v1g', name: 'V1g Input UX + Validation', weight: 0.10 },
    { id: 'v2e', name: 'V2.e - Chat Funnel', weight: 0.10 },
    { id: 'v2d', name: 'V2d Feedback Optimized', weight: 0.10 },
    { id: 'v3', name: 'V3 - God Mode', weight: 0.10 },
    { id: 'v5c', name: 'V5c Invisible Interface', weight: 0.10 }
  ]
});

// Social Proof Section A/B Test
abTesting.registerTest({
  id: 'social_proof',
  name: 'Social Proof Section Variants',
  variants: [
    { id: 'v1', name: 'V1: Original (farbige Logos)', weight: 0.20 },
    { id: 'v2', name: 'V2: Live Dashboard + Deal Cards', weight: 0.20 },
    { id: 'v3', name: 'V3: Trust Hierarchy (Logos oben)', weight: 0.20 },
    { id: 'v4', name: 'V4: Trust Stack (kompakt)', weight: 0.20 },
    { id: 'v5', name: 'V5: Trust Strip 2.0 (unified)', weight: 0.20 }
  ]
});
