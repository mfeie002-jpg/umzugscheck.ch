/**
 * Permit Generator
 * 
 * Generates parking permit instructions and guides for Swiss cities
 */

import { 
  ParkingPermitRequest, 
  ParkingPermitResult, 
  ParkingPermitStep,
  PermitDownloadable 
} from './types';
import { getCityParkingRule } from './city-requirements';
import { calculatePermitDeadline, getDaysUntilDeadline, isPermitUrgent } from './deadline-calculator';

/**
 * Generate step-by-step permit application guide
 */
const generatePermitSteps = (
  request: ParkingPermitRequest,
  city: NonNullable<ReturnType<typeof getCityParkingRule>>
): ParkingPermitStep[] => {
  const steps: ParkingPermitStep[] = [];
  let stepNumber = 1;
  
  // Step 1: Check requirements
  steps.push({
    stepNumber: stepNumber++,
    title: 'Voraussetzungen prüfen',
    description: `Für ${city.cityName} benötigen Sie ein offizielles Halteverbot. Vorlaufzeit: mindestens ${city.leadTimeDays} Arbeitstage.`,
    estimatedTime: '5 Minuten'
  });
  
  // Step 2: Prepare information
  steps.push({
    stepNumber: stepNumber++,
    title: 'Informationen vorbereiten',
    description: `Bereiten Sie folgende Angaben vor: ${city.instructions.whatToBring.join(', ')}.`,
    estimatedTime: '10 Minuten'
  });
  
  // Step 3: Application
  steps.push({
    stepNumber: stepNumber++,
    title: 'Antrag einreichen',
    description: city.instructions.howToApply,
    actionUrl: city.applicationUrl || city.contactUrl || undefined,
    actionLabel: city.applicationUrl ? 'Zum Antragsformular' : 'Kontaktseite öffnen',
    estimatedTime: '15-30 Minuten'
  });
  
  // Step 4: Payment
  if (city.costChf) {
    steps.push({
      stepNumber: stepNumber++,
      title: `Gebühr bezahlen (ca. CHF ${city.costChf})`,
      description: `Zahlungsmethoden: ${city.instructions.paymentMethods.join(', ')}.`,
      estimatedTime: '5 Minuten'
    });
  }
  
  // Step 5: Receive signs (if applicable)
  steps.push({
    stepNumber: stepNumber++,
    title: 'Schilder erhalten',
    description: 'Sie erhalten die offiziellen Halteverbot-Schilder per Post oder können diese abholen.',
    estimatedTime: '2-5 Arbeitstage'
  });
  
  // Step 6: Place signs
  steps.push({
    stepNumber: stepNumber++,
    title: 'Schilder aufstellen',
    description: 'Stellen Sie die Schilder mindestens 72 Stunden (3 Tage) vor dem Umzug auf. Fotografieren Sie die Schilder als Beweis.',
    estimatedTime: '15 Minuten'
  });
  
  // Step 7: Move day
  steps.push({
    stepNumber: stepNumber++,
    title: 'Umzugstag',
    description: 'Nutzen Sie den reservierten Platz. Bei Fremdparkern: Polizei informieren.',
    estimatedTime: `Bis zu ${city.maxDurationHours} Stunden`
  });
  
  // Step 8: Return signs
  steps.push({
    stepNumber: stepNumber++,
    title: 'Schilder zurückgeben',
    description: 'Entfernen Sie die Schilder nach dem Umzug und geben Sie diese gemäss Anweisung zurück.',
    estimatedTime: '15 Minuten'
  });
  
  return steps;
};

/**
 * Generate downloadable resources
 */
const generateDownloadables = (
  city: NonNullable<ReturnType<typeof getCityParkingRule>>
): PermitDownloadable[] => {
  const downloads: PermitDownloadable[] = [];
  
  // Note: In production, these would link to actual files
  // For now, we provide placeholder structure
  
  if (city.applicationUrl) {
    downloads.push({
      type: 'form',
      title: `Antragsformular ${city.cityName}`,
      url: city.applicationUrl,
      format: 'pdf'
    });
  }
  
  downloads.push({
    type: 'guide',
    title: 'Umzugs-Checkliste',
    url: '/downloads/umzugs-checkliste.pdf',
    format: 'pdf'
  });
  
  downloads.push({
    type: 'sign_template',
    title: 'Halteverbot-Hinweisschild Vorlage',
    url: '/downloads/halteverbot-vorlage.pdf',
    format: 'pdf'
  });
  
  return downloads;
};

/**
 * Main function: Generate complete parking permit result
 */
export const generateParkingPermitResult = (
  request: ParkingPermitRequest
): ParkingPermitResult | null => {
  const city = getCityParkingRule(request.citySlug);
  
  if (!city) {
    return null;
  }
  
  const deadline = calculatePermitDeadline(
    new Date(request.moveDate), 
    city.leadTimeDays
  );
  
  const daysUntilDeadline = getDaysUntilDeadline(deadline);
  const isUrgent = isPermitUrgent(deadline);
  
  // Calculate estimated cost based on vehicle type
  let estimatedCost = city.costChf;
  if (estimatedCost && request.vehicleType === 'truck_large') {
    estimatedCost = Math.round(estimatedCost * 1.5); // Larger vehicles may cost more
  }
  
  const steps = generatePermitSteps(request, city);
  const downloadables = generateDownloadables(city);
  
  return {
    city,
    isRequired: city.requiresPermit,
    deadline,
    isUrgent,
    daysUntilDeadline,
    estimatedCost,
    steps,
    downloadables
  };
};

/**
 * Check if user has enough time to apply for permit
 */
export const hasEnoughTimeForPermit = (
  moveDate: Date, 
  citySlug: string
): { hasTime: boolean; daysNeeded: number; daysAvailable: number } => {
  const city = getCityParkingRule(citySlug);
  
  if (!city) {
    return { hasTime: false, daysNeeded: 10, daysAvailable: 0 };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const moveDateClean = new Date(moveDate);
  moveDateClean.setHours(0, 0, 0, 0);
  
  const daysAvailable = Math.ceil(
    (moveDateClean.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Need lead time + 3 days for sign placement
  const daysNeeded = city.leadTimeDays + 3;
  
  return {
    hasTime: daysAvailable >= daysNeeded,
    daysNeeded,
    daysAvailable
  };
};

/**
 * Generate quick summary for a city
 */
export const getCityPermitSummary = (citySlug: string): string | null => {
  const city = getCityParkingRule(citySlug);
  
  if (!city) return null;
  
  const parts: string[] = [];
  
  if (city.requiresPermit) {
    parts.push(`Halteverbot erforderlich`);
    parts.push(`${city.leadTimeDays} Arbeitstage Vorlauf`);
    if (city.costChf) {
      parts.push(`ca. CHF ${city.costChf}`);
    }
  } else {
    parts.push('Kein offizielles Halteverbot erforderlich');
  }
  
  return parts.join(' • ');
};
