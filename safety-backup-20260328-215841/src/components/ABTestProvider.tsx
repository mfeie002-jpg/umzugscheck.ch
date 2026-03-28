import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Experiment {
  id: string;
  variant: string;
  variants: string[];
}

interface ABTestContextType {
  getVariant: (experimentId: string) => string;
  trackConversion: (experimentId: string, conversionType: string) => void;
  experiments: Record<string, Experiment>;
}

const ABTestContext = createContext<ABTestContextType | null>(null);

const EXPERIMENTS_CONFIG: Record<string, { variants: string[]; description: string }> = {
  'hero-cta': { 
    variants: ['original', 'variant-a', 'variant-b'],
    description: 'Hero Call-to-Action Button Text'
  },
  'hero-headline': {
    variants: ['original', 'emotional', 'benefit-focused'],
    description: 'Hero Überschrift Variante'
  },
  'pricing-layout': { 
    variants: ['cards', 'table', 'comparison'],
    description: 'Preisseiten-Layout'
  },
  'contact-form': { 
    variants: ['simple', 'multi-step', 'minimal'],
    description: 'Kontaktformular-Stil'
  },
  'quote-button-color': { 
    variants: ['primary', 'accent', 'gradient'],
    description: 'Offerte-Button Farbe'
  },
  'trust-badges-position': {
    variants: ['above-fold', 'below-hero', 'sidebar'],
    description: 'Trust-Badges Position'
  },
  'social-proof': {
    variants: ['reviews', 'counter', 'logos'],
    description: 'Social Proof Element'
  },
};

export function ABTestProvider({ children }: { children: ReactNode }) {
  const [experiments, setExperiments] = useState<Record<string, Experiment>>({});

  useEffect(() => {
    // Initialize experiments from localStorage or assign new variants
    const storedExperiments = localStorage.getItem('ab-experiments');
    
    if (storedExperiments) {
      // Merge stored with any new experiments
      const parsed = JSON.parse(storedExperiments);
      const merged: Record<string, Experiment> = { ...parsed };
      
      Object.entries(EXPERIMENTS_CONFIG).forEach(([id, config]) => {
        if (!merged[id]) {
          const randomIndex = Math.floor(Math.random() * config.variants.length);
          merged[id] = {
            id,
            variant: config.variants[randomIndex],
            variants: config.variants
          };
        }
      });
      
      setExperiments(merged);
      localStorage.setItem('ab-experiments', JSON.stringify(merged));
      // Record session for impression tracking
      recordABTestSessionInternal(merged);
    } else {
      const newExperiments: Record<string, Experiment> = {};
      
      Object.entries(EXPERIMENTS_CONFIG).forEach(([id, config]) => {
        const randomIndex = Math.floor(Math.random() * config.variants.length);
        newExperiments[id] = {
          id,
          variant: config.variants[randomIndex],
          variants: config.variants
        };
      });
      
      setExperiments(newExperiments);
      localStorage.setItem('ab-experiments', JSON.stringify(newExperiments));
      // Record session for impression tracking
      recordABTestSessionInternal(newExperiments);
    }
  }, []);

  const getVariant = (experimentId: string): string => {
    return experiments[experimentId]?.variant || 'original';
  };

  const trackConversion = (experimentId: string, conversionType: string) => {
    const experiment = experiments[experimentId];
    if (!experiment) return;

    // Track conversion event
    const conversionData = {
      experimentId,
      variant: experiment.variant,
      conversionType,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId()
    };

    // Store conversions locally
    const conversions = JSON.parse(localStorage.getItem('ab-conversions') || '[]');
    conversions.push(conversionData);
    localStorage.setItem('ab-conversions', JSON.stringify(conversions));

    console.log('A/B Test Conversion:', conversionData);
  };

  return (
    <ABTestContext.Provider value={{ getVariant, trackConversion, experiments }}>
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTest(experimentId: string) {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within ABTestProvider');
  }

  return {
    variant: context.getVariant(experimentId),
    trackConversion: (conversionType: string) => 
      context.trackConversion(experimentId, conversionType)
  };
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('session-id');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session-id', sessionId);
  }
  return sessionId;
}

// Internal session recording function
function recordABTestSessionInternal(experiments: Record<string, Experiment>) {
  const sessionId = getSessionId();
  const sessions = JSON.parse(localStorage.getItem('ab-sessions') || '{}');
  
  if (!sessions[sessionId]) {
    sessions[sessionId] = {};
    Object.entries(experiments).forEach(([id, exp]) => {
      sessions[sessionId][id] = exp.variant;
    });
    localStorage.setItem('ab-sessions', JSON.stringify(sessions));
  }
}

// Export experiment config for admin dashboard
export function getExperimentsConfig() {
  return EXPERIMENTS_CONFIG;
}

// Get all conversion data for analytics
export function getABTestConversions(): Array<{
  experimentId: string;
  variant: string;
  conversionType: string;
  timestamp: string;
  sessionId: string;
}> {
  try {
    return JSON.parse(localStorage.getItem('ab-conversions') || '[]');
  } catch {
    return [];
  }
}

// Calculate z-score for statistical significance (two-proportion z-test)
function calculateZScore(
  conversions1: number, 
  impressions1: number, 
  conversions2: number, 
  impressions2: number
): number {
  if (impressions1 === 0 || impressions2 === 0) return 0;
  
  const p1 = conversions1 / impressions1;
  const p2 = conversions2 / impressions2;
  const pooledP = (conversions1 + conversions2) / (impressions1 + impressions2);
  
  if (pooledP === 0 || pooledP === 1) return 0;
  
  const se = Math.sqrt(pooledP * (1 - pooledP) * (1/impressions1 + 1/impressions2));
  if (se === 0) return 0;
  
  return (p1 - p2) / se;
}

// Convert z-score to p-value (two-tailed)
function zScoreToPValue(z: number): number {
  const absZ = Math.abs(z);
  // Approximation of standard normal CDF
  const t = 1 / (1 + 0.2316419 * absZ);
  const d = 0.3989423 * Math.exp(-absZ * absZ / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return 2 * p; // Two-tailed
}

// Get confidence level from p-value
function getConfidenceLevel(pValue: number): number {
  return (1 - pValue) * 100;
}

// Determine statistical significance
export interface SignificanceResult {
  isSignificant: boolean;
  confidence: number;
  pValue: number;
  zScore: number;
  sampleSizeRecommendation: string;
  minSampleSize: number;
}

function calculateSignificance(
  winnerConversions: number,
  winnerImpressions: number,
  controlConversions: number,
  controlImpressions: number
): SignificanceResult {
  const zScore = calculateZScore(winnerConversions, winnerImpressions, controlConversions, controlImpressions);
  const pValue = zScoreToPValue(zScore);
  const confidence = getConfidenceLevel(pValue);
  
  // Calculate minimum sample size needed for 95% confidence
  const baselineRate = controlImpressions > 0 ? controlConversions / controlImpressions : 0.05;
  const minSampleSize = Math.ceil((1.96 * 1.96 * baselineRate * (1 - baselineRate)) / (0.05 * 0.05));
  
  const totalImpressions = winnerImpressions + controlImpressions;
  let sampleSizeRecommendation = '';
  
  if (totalImpressions < 100) {
    sampleSizeRecommendation = 'Mindestens 100 Impressions empfohlen';
  } else if (totalImpressions < minSampleSize) {
    sampleSizeRecommendation = `${minSampleSize - totalImpressions} weitere Impressions empfohlen`;
  } else {
    sampleSizeRecommendation = 'Ausreichende Stichprobengrösse';
  }
  
  return {
    isSignificant: pValue < 0.05 && winnerImpressions >= 30 && controlImpressions >= 30,
    confidence,
    pValue,
    zScore,
    sampleSizeRecommendation,
    minSampleSize
  };
}

// Get aggregated stats for each experiment
export function getABTestStats() {
  const conversions = getABTestConversions();
  const experiments = JSON.parse(localStorage.getItem('ab-experiments') || '{}');
  
  const stats: Record<string, {
    experimentId: string;
    description: string;
    variants: Record<string, {
      impressions: number;
      conversions: Record<string, number>;
      conversionRate: number;
    }>;
    winner: {
      variant: string;
      rate: number;
      lift: number;
      significance: SignificanceResult;
    } | null;
  }> = {};

  // Initialize stats for all experiments
  Object.entries(EXPERIMENTS_CONFIG).forEach(([id, config]) => {
    stats[id] = {
      experimentId: id,
      description: config.description,
      variants: {},
      winner: null
    };
    config.variants.forEach(variant => {
      stats[id].variants[variant] = {
        impressions: 0,
        conversions: {},
        conversionRate: 0
      };
    });
  });

  // Count impressions from stored experiments
  const storedSessions = JSON.parse(localStorage.getItem('ab-sessions') || '{}');
  Object.entries(storedSessions).forEach(([sessionId, sessionExperiments]: [string, any]) => {
    Object.entries(sessionExperiments).forEach(([expId, variant]: [string, any]) => {
      if (stats[expId]?.variants[variant]) {
        stats[expId].variants[variant].impressions++;
      }
    });
  });

  // Count conversions
  conversions.forEach(conv => {
    if (stats[conv.experimentId]?.variants[conv.variant]) {
      const variantStats = stats[conv.experimentId].variants[conv.variant];
      variantStats.conversions[conv.conversionType] = (variantStats.conversions[conv.conversionType] || 0) + 1;
    }
  });

  // Calculate conversion rates and determine winners with statistical significance
  Object.values(stats).forEach(exp => {
    let bestVariant = { variant: '', rate: 0, conversions: 0, impressions: 0 };
    let controlVariant = { rate: 0, conversions: 0, impressions: 0 };
    
    Object.entries(exp.variants).forEach(([variant, data]) => {
      const totalConversions = Object.values(data.conversions).reduce((sum, c) => sum + c, 0);
      data.conversionRate = data.impressions > 0 
        ? (totalConversions / data.impressions) * 100 
        : 0;
      
      // Track original as control
      if (variant === 'original') {
        controlVariant = { 
          rate: data.conversionRate, 
          conversions: totalConversions, 
          impressions: data.impressions 
        };
      }
      
      // Find best performing variant
      if (data.conversionRate > bestVariant.rate) {
        bestVariant = { 
          variant, 
          rate: data.conversionRate, 
          conversions: totalConversions, 
          impressions: data.impressions 
        };
      }
    });
    
    // Calculate statistical significance for the winner
    if (bestVariant.variant && bestVariant.rate > 0) {
      const significance = calculateSignificance(
        bestVariant.conversions,
        bestVariant.impressions,
        controlVariant.conversions || 0,
        controlVariant.impressions || bestVariant.impressions
      );
      
      const lift = controlVariant.rate > 0 
        ? ((bestVariant.rate - controlVariant.rate) / controlVariant.rate) * 100 
        : 0;
      
      exp.winner = {
        variant: bestVariant.variant,
        rate: bestVariant.rate,
        lift,
        significance
      };
    }
  });

  return stats;
}

export default ABTestProvider;
