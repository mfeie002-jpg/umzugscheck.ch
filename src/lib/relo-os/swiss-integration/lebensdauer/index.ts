/**
 * Lebensdauertabelle - Swiss Fixture Lifespan Depreciation Engine
 * 
 * Implements the paritätische Lebensdauertabelle (Swiss Tenants' & Homeowners' Assoc.)
 * for calculating residual value of apartment fixtures during handover.
 * 
 * Formula: Residual Value = 1 - (age / lifespan)
 * If age >= lifespan → 0% liability (fully amortized)
 * 
 * @see https://www.mieterverband.ch/mv/mietrecht-beratung/ratgeber-mietrecht/top-faelle/lebensdauer.html
 */

export type FixtureCategory = 
  | 'walls'
  | 'floors'
  | 'kitchen'
  | 'bathroom'
  | 'doors_windows'
  | 'electrical'
  | 'heating'
  | 'exterior'
  | 'miscellaneous';

export interface FixtureLifespan {
  id: string;
  category: FixtureCategory;
  item_de: string;
  item_fr: string | null;
  item_it: string | null;
  lifespan_years: number;
  source: string;
  notes_de: string | null;
  notes_fr: string | null;
  is_active: boolean;
}

export interface DepreciationResult {
  /** Original lifespan in years */
  lifespanYears: number;
  /** Age of the item in years */
  ageYears: number;
  /** Residual value as decimal (0.0 - 1.0) */
  residualValue: number;
  /** Residual value as percentage (0 - 100) */
  residualPercent: number;
  /** Whether the item is fully amortized (no tenant liability) */
  isFullyAmortized: boolean;
  /** Whether this counts as normal wear (>= 80% amortized) */
  isNormalWear: boolean;
  /** Tenant liability for replacement cost (0.0 - 1.0) */
  tenantLiability: number;
  /** Human-readable status in German */
  statusDe: string;
}

export interface DamageAssessment {
  fixtureId: string;
  fixtureName: string;
  category: FixtureCategory;
  installationYear: number;
  currentYear: number;
  replacementCostCHF: number;
  depreciation: DepreciationResult;
  tenantPaysCHF: number;
  landlordPaysCHF: number;
}

// Category display names for UI
export const CATEGORY_LABELS: Record<FixtureCategory, { de: string; fr: string }> = {
  walls: { de: 'Wände', fr: 'Murs' },
  floors: { de: 'Böden', fr: 'Sols' },
  kitchen: { de: 'Küche', fr: 'Cuisine' },
  bathroom: { de: 'Bad/WC', fr: 'Salle de bains/WC' },
  doors_windows: { de: 'Türen/Fenster', fr: 'Portes/Fenêtres' },
  electrical: { de: 'Elektro', fr: 'Électricité' },
  heating: { de: 'Heizung', fr: 'Chauffage' },
  exterior: { de: 'Aussen/Balkon', fr: 'Extérieur/Balcon' },
  miscellaneous: { de: 'Diverses', fr: 'Divers' },
};

/**
 * Calculate the depreciation/residual value of a fixture
 * 
 * @param lifespanYears - Expected lifespan from Lebensdauertabelle
 * @param installationYear - Year the item was installed/renewed
 * @param currentYear - Current year (defaults to now)
 * @returns Depreciation calculation result
 */
export function calculateDepreciation(
  lifespanYears: number,
  installationYear: number,
  currentYear: number = new Date().getFullYear()
): DepreciationResult {
  // Validate inputs
  if (lifespanYears <= 0) {
    throw new Error('Lifespan must be positive');
  }
  if (installationYear > currentYear) {
    throw new Error('Installation year cannot be in the future');
  }

  const ageYears = currentYear - installationYear;
  
  // Calculate residual value (can't go below 0)
  const residualValue = Math.max(0, 1 - (ageYears / lifespanYears));
  const residualPercent = Math.round(residualValue * 100);
  
  // Item is fully amortized if age >= lifespan
  const isFullyAmortized = ageYears >= lifespanYears;
  
  // Normal wear threshold: >= 80% amortized
  const isNormalWear = residualValue <= 0.2;
  
  // Tenant liability is the residual value
  const tenantLiability = residualValue;
  
  // Generate status message
  let statusDe: string;
  if (isFullyAmortized) {
    statusDe = 'Vollständig amortisiert - Kein Abzug';
  } else if (isNormalWear) {
    statusDe = 'Normale Abnützung - Geringer Abzug';
  } else if (residualPercent > 50) {
    statusDe = 'Erheblicher Restwert';
  } else {
    statusDe = 'Teilweise amortisiert';
  }

  return {
    lifespanYears,
    ageYears,
    residualValue,
    residualPercent,
    isFullyAmortized,
    isNormalWear,
    tenantLiability,
    statusDe,
  };
}

/**
 * Calculate tenant liability for a damaged item
 * 
 * @param fixture - The fixture item from database
 * @param installationYear - When it was installed
 * @param replacementCostCHF - Full replacement cost
 * @param currentYear - Current year
 * @returns Complete damage assessment
 */
export function assessDamage(
  fixture: Pick<FixtureLifespan, 'id' | 'item_de' | 'category' | 'lifespan_years'>,
  installationYear: number,
  replacementCostCHF: number,
  currentYear: number = new Date().getFullYear()
): DamageAssessment {
  const depreciation = calculateDepreciation(
    fixture.lifespan_years,
    installationYear,
    currentYear
  );

  const tenantPaysCHF = Math.round(replacementCostCHF * depreciation.tenantLiability);
  const landlordPaysCHF = replacementCostCHF - tenantPaysCHF;

  return {
    fixtureId: fixture.id,
    fixtureName: fixture.item_de,
    category: fixture.category,
    installationYear,
    currentYear,
    replacementCostCHF,
    depreciation,
    tenantPaysCHF,
    landlordPaysCHF,
  };
}

/**
 * Generate a summary report for multiple damage assessments
 */
export function generateDamageReport(assessments: DamageAssessment[]): {
  totalReplacementCHF: number;
  totalTenantPaysCHF: number;
  totalLandlordPaysCHF: number;
  itemCount: number;
  fullyAmortizedCount: number;
  assessments: DamageAssessment[];
} {
  const totalReplacementCHF = assessments.reduce((sum, a) => sum + a.replacementCostCHF, 0);
  const totalTenantPaysCHF = assessments.reduce((sum, a) => sum + a.tenantPaysCHF, 0);
  const totalLandlordPaysCHF = assessments.reduce((sum, a) => sum + a.landlordPaysCHF, 0);
  const fullyAmortizedCount = assessments.filter(a => a.depreciation.isFullyAmortized).length;

  return {
    totalReplacementCHF,
    totalTenantPaysCHF,
    totalLandlordPaysCHF,
    itemCount: assessments.length,
    fullyAmortizedCount,
    assessments,
  };
}

/**
 * Check if a damage is likely "normal wear and tear"
 * Based on Swiss tenancy law principles
 */
export function isLikelyNormalWear(
  depreciation: DepreciationResult,
  damageDescription?: string
): { isNormalWear: boolean; reasoning: string } {
  // If 80%+ amortized, almost always normal wear
  if (depreciation.isFullyAmortized) {
    return {
      isNormalWear: true,
      reasoning: 'Gegenstand ist vollständig amortisiert (Lebensdauer überschritten).',
    };
  }

  if (depreciation.residualPercent <= 20) {
    return {
      isNormalWear: true,
      reasoning: 'Restwert unter 20% - gilt in der Regel als normale Abnützung.',
    };
  }

  // Check for keywords that suggest excessive damage
  const excessiveDamageKeywords = [
    'loch', 'hole', 'riss', 'crack', 'bruch', 'broken',
    'brand', 'burn', 'schimmel', 'mold', 'wasserschaden', 'water damage',
  ];

  if (damageDescription) {
    const lowerDesc = damageDescription.toLowerCase();
    const hasExcessiveMarkers = excessiveDamageKeywords.some(kw => lowerDesc.includes(kw));
    
    if (hasExcessiveMarkers) {
      return {
        isNormalWear: false,
        reasoning: 'Beschreibung deutet auf übermässige Beschädigung hin.',
      };
    }
  }

  return {
    isNormalWear: depreciation.residualPercent <= 40,
    reasoning: depreciation.residualPercent <= 40
      ? 'Bei diesem Alter ist moderate Abnützung normal.'
      : 'Signifikanter Restwert - Beschädigung muss beurteilt werden.',
  };
}

// Re-export types for convenience
export type { FixtureCategory as LebensdauerCategory };
