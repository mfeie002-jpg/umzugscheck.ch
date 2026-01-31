/**
 * Commute Capital Calculator
 * 
 * Calculates the "true cost" of commuting by converting time to money.
 * This enables users to compare rent savings against commute time costs.
 * 
 * Key insight: A cheaper apartment in the suburbs may actually cost MORE
 * when you factor in commute time at your effective hourly rate.
 */

export interface CommuteCapitalInput {
  /** User's effective hourly rate (CHF/hour) - based on salary or perceived time value */
  hourlyRate: number;
  /** One-way commute time in minutes */
  oneWayCommuteMinutes: number;
  /** Number of work days per year (default: 220 for Swiss standard) */
  workDaysPerYear?: number;
  /** Monthly public transport pass cost (CHF) */
  monthlyPassCHF?: number;
}

export interface CommuteCapitalResult {
  /** Annual time cost of commuting (CHF) */
  annualTimeCost: number;
  /** Monthly time cost of commuting (CHF) */
  monthlyTimeCost: number;
  /** Annual transport pass cost (CHF) */
  annualTransportCost: number;
  /** Total annual commute cost (time + transport) */
  totalAnnualCommuteCost: number;
  /** Total monthly commute cost (time + transport) */
  totalMonthlyCommuteCost: number;
  /** Hours spent commuting per year */
  annualCommuteHours: number;
  /** Equivalent full work days lost to commuting per year */
  workDaysLostToCommute: number;
}

export interface TrueCostOfLivingInput {
  /** Monthly rent savings compared to city center (CHF) */
  monthlyRentSavings: number;
  /** Commute capital calculation result */
  commuteCapital: CommuteCapitalResult;
}

export interface TrueCostOfLivingResult {
  /** Net monthly benefit (positive = worth moving, negative = stay in city) */
  netMonthlyBenefit: number;
  /** Net annual benefit */
  netAnnualBenefit: number;
  /** Whether the move makes financial sense */
  worthMoving: boolean;
  /** Break-even hourly rate (below this, the move makes sense) */
  breakEvenHourlyRate: number;
  /** Payback period in months (how long until rent savings cover commute costs) */
  paybackMonths: number | null;
}

/**
 * Calculate the "Commute Capital" - the economic value of time spent commuting
 */
export function calculateCommuteCapital(input: CommuteCapitalInput): CommuteCapitalResult {
  const {
    hourlyRate,
    oneWayCommuteMinutes,
    workDaysPerYear = 220,
    monthlyPassCHF = 0,
  } = input;

  // Daily commute is round-trip
  const dailyCommuteMinutes = oneWayCommuteMinutes * 2;
  const dailyCommuteHours = dailyCommuteMinutes / 60;

  // Annual calculations
  const annualCommuteHours = dailyCommuteHours * workDaysPerYear;
  const annualTimeCost = annualCommuteHours * hourlyRate;
  const annualTransportCost = monthlyPassCHF * 12;
  const totalAnnualCommuteCost = annualTimeCost + annualTransportCost;

  // Monthly equivalent
  const monthlyTimeCost = annualTimeCost / 12;
  const totalMonthlyCommuteCost = totalAnnualCommuteCost / 12;

  // Work days lost (assuming 8-hour work day)
  const workDaysLostToCommute = annualCommuteHours / 8;

  return {
    annualTimeCost: Math.round(annualTimeCost),
    monthlyTimeCost: Math.round(monthlyTimeCost),
    annualTransportCost: Math.round(annualTransportCost),
    totalAnnualCommuteCost: Math.round(totalAnnualCommuteCost),
    totalMonthlyCommuteCost: Math.round(totalMonthlyCommuteCost),
    annualCommuteHours: Math.round(annualCommuteHours),
    workDaysLostToCommute: Math.round(workDaysLostToCommute * 10) / 10,
  };
}

/**
 * Calculate the "True Cost of Living" by comparing rent savings to commute costs
 */
export function calculateTrueCostOfLiving(input: TrueCostOfLivingInput): TrueCostOfLivingResult {
  const { monthlyRentSavings, commuteCapital } = input;

  const netMonthlyBenefit = monthlyRentSavings - commuteCapital.totalMonthlyCommuteCost;
  const netAnnualBenefit = netMonthlyBenefit * 12;
  const worthMoving = netMonthlyBenefit > 0;

  // Calculate break-even hourly rate
  // At what hourly rate does the commute cost exactly equal the rent savings?
  // monthlyRentSavings = monthlyTimeCost + monthlyTransportCost
  // monthlyRentSavings - monthlyTransportCost = monthlyTimeCost
  // (monthlyRentSavings - monthlyPassCHF) = (annualCommuteHours / 12) * hourlyRate
  // breakEvenRate = (monthlyRentSavings - monthlyPassCHF) * 12 / annualCommuteHours
  const monthlyTransportCost = commuteCapital.annualTransportCost / 12;
  const netSavingsForTime = monthlyRentSavings - monthlyTransportCost;
  const breakEvenHourlyRate = commuteCapital.annualCommuteHours > 0
    ? (netSavingsForTime * 12) / commuteCapital.annualCommuteHours
    : 0;

  // Payback period (only relevant if not worth moving)
  // How many months until accumulated rent savings cover the extra commute costs?
  let paybackMonths: number | null = null;
  if (!worthMoving && monthlyRentSavings > 0) {
    // This scenario doesn't really have a payback since costs > savings
    paybackMonths = null;
  } else if (worthMoving) {
    // Immediate benefit, no payback needed
    paybackMonths = 0;
  }

  return {
    netMonthlyBenefit: Math.round(netMonthlyBenefit),
    netAnnualBenefit: Math.round(netAnnualBenefit),
    worthMoving,
    breakEvenHourlyRate: Math.round(breakEvenHourlyRate),
    paybackMonths,
  };
}

/**
 * Compare two locations and determine which is better financially
 */
export interface LocationComparisonInput {
  location1: {
    name: string;
    monthlyRent: number;
    oneWayCommuteMinutes: number;
    monthlyPassCHF: number;
  };
  location2: {
    name: string;
    monthlyRent: number;
    oneWayCommuteMinutes: number;
    monthlyPassCHF: number;
  };
  hourlyRate: number;
  workDaysPerYear?: number;
}

export interface LocationComparisonResult {
  winner: string;
  monthlyDifference: number;
  annualDifference: number;
  location1TotalMonthlyCost: number;
  location2TotalMonthlyCost: number;
  location1CommuteCapital: CommuteCapitalResult;
  location2CommuteCapital: CommuteCapitalResult;
  recommendation: string;
}

export function compareLocations(input: LocationComparisonInput): LocationComparisonResult {
  const { location1, location2, hourlyRate, workDaysPerYear } = input;

  const commute1 = calculateCommuteCapital({
    hourlyRate,
    oneWayCommuteMinutes: location1.oneWayCommuteMinutes,
    monthlyPassCHF: location1.monthlyPassCHF,
    workDaysPerYear,
  });

  const commute2 = calculateCommuteCapital({
    hourlyRate,
    oneWayCommuteMinutes: location2.oneWayCommuteMinutes,
    monthlyPassCHF: location2.monthlyPassCHF,
    workDaysPerYear,
  });

  const total1 = location1.monthlyRent + commute1.totalMonthlyCommuteCost;
  const total2 = location2.monthlyRent + commute2.totalMonthlyCommuteCost;

  const winner = total1 <= total2 ? location1.name : location2.name;
  const monthlyDifference = Math.abs(total1 - total2);
  const annualDifference = monthlyDifference * 12;

  let recommendation: string;
  if (monthlyDifference < 50) {
    recommendation = `Beide Standorte sind finanziell praktisch gleichwertig (Differenz: ${monthlyDifference} CHF/Mt.). Wählen Sie nach Lebensqualität.`;
  } else if (total1 < total2) {
    recommendation = `${location1.name} ist ${monthlyDifference} CHF/Mt. günstiger. Sie sparen ${annualDifference} CHF pro Jahr.`;
  } else {
    recommendation = `${location2.name} ist ${monthlyDifference} CHF/Mt. günstiger. Sie sparen ${annualDifference} CHF pro Jahr.`;
  }

  return {
    winner,
    monthlyDifference: Math.round(monthlyDifference),
    annualDifference: Math.round(annualDifference),
    location1TotalMonthlyCost: Math.round(total1),
    location2TotalMonthlyCost: Math.round(total2),
    location1CommuteCapital: commute1,
    location2CommuteCapital: commute2,
    recommendation,
  };
}

/**
 * Get suggested hourly rates based on Swiss salary brackets
 */
export function getSuggestedHourlyRates(): { label: string; rate: number; description: string }[] {
  return [
    { label: "Einstiegsgehalt", rate: 25, description: "CHF 52'000/Jahr" },
    { label: "Durchschnitt CH", rate: 40, description: "CHF 83'000/Jahr" },
    { label: "Fachspezialist", rate: 55, description: "CHF 115'000/Jahr" },
    { label: "Kader/Manager", rate: 75, description: "CHF 156'000/Jahr" },
    { label: "Direktion", rate: 100, description: "CHF 208'000/Jahr" },
  ];
}

/**
 * Format time in a human-readable way
 */
export function formatCommuteDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} Min.`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} Std.`;
  }
  return `${hours} Std. ${mins} Min.`;
}

/**
 * Get the "commute quality" rating based on Swiss standards
 */
export function getCommuteQualityRating(oneWayMinutes: number): {
  rating: 'excellent' | 'good' | 'acceptable' | 'long' | 'very_long';
  label: string;
  description: string;
} {
  if (oneWayMinutes <= 15) {
    return {
      rating: 'excellent',
      label: 'Ausgezeichnet',
      description: 'Traumpendelzeit - sehr kurz',
    };
  }
  if (oneWayMinutes <= 30) {
    return {
      rating: 'good',
      label: 'Gut',
      description: 'Angenehme Pendelzeit',
    };
  }
  if (oneWayMinutes <= 45) {
    return {
      rating: 'acceptable',
      label: 'Akzeptabel',
      description: 'Durchschnittlich für Schweiz',
    };
  }
  if (oneWayMinutes <= 60) {
    return {
      rating: 'long',
      label: 'Lang',
      description: 'Über dem Schweizer Durchschnitt',
    };
  }
  return {
    rating: 'very_long',
    label: 'Sehr lang',
    description: 'Belastet die Work-Life-Balance',
  };
}
