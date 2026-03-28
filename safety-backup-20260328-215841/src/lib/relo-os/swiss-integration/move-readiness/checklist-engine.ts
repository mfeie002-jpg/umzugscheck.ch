/**
 * Checklist Engine
 * 
 * Generates personalized moving checklists based on input
 */

import { 
  MoveReadinessInput, 
  ChecklistItem, 
  ChecklistSubtask,
  TimelineCategory,
  MoveWarning,
  MoveReadinessResult
} from './types';
import { generateMoveTimeline, getTimelineDate } from './timeline-generator';
import { getCantonRegulation, isCrossLanguageMove, getCantonFromPostalCode } from './canton-rules';

/**
 * Generate checklist from timeline items
 */
export const generateChecklist = (input: MoveReadinessInput): ChecklistItem[] => {
  const timeline = generateMoveTimeline(input);
  
  const checklist: ChecklistItem[] = timeline.map(item => ({
    id: `checklist-${item.id}`,
    title: item.title,
    description: item.description,
    category: item.category,
    isRequired: item.priority === 'critical',
    isCompleted: false,
    dueDay: item.day,
    linkedTimelineItemId: item.id,
    subtasks: generateSubtasks(item.id, item.tips)
  }));
  
  return checklist;
};

/**
 * Generate subtasks from tips
 */
const generateSubtasks = (itemId: string, tips?: string[]): ChecklistSubtask[] => {
  if (!tips || tips.length === 0) return [];
  
  return tips.map((tip, index) => ({
    id: `${itemId}-subtask-${index}`,
    title: tip,
    isCompleted: false
  }));
};

/**
 * Generate warnings based on move parameters
 */
export const generateWarnings = (input: MoveReadinessInput): MoveWarning[] => {
  const warnings: MoveWarning[] = [];
  const moveDate = new Date(input.moveDate);
  const today = new Date();
  const daysUntilMove = Math.ceil((moveDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Urgent move warning
  if (daysUntilMove < 14) {
    warnings.push({
      id: 'urgent-move',
      severity: 'critical',
      title: 'Sehr kurzfristiger Umzug',
      message: `Ihr Umzug ist in nur ${daysUntilMove} Tagen. Einige Fristen können möglicherweise nicht eingehalten werden.`,
      actionRequired: 'Priorisieren Sie Umzugsfirma, Reinigung und Behörden.'
    });
  } else if (daysUntilMove < 21) {
    warnings.push({
      id: 'short-notice',
      severity: 'warning',
      title: 'Kurzfristiger Umzug',
      message: 'Mit weniger als 3 Wochen Vorlauf wird es eng. Beginnen Sie sofort mit den Vorbereitungen.',
      actionRequired: 'Buchen Sie Umzugsfirma und Reinigung heute noch.'
    });
  }
  
  // Cross-canton move
  if (input.fromCanton !== input.toCanton) {
    warnings.push({
      id: 'cross-canton',
      severity: 'info',
      title: 'Kantonswechsel',
      message: `Sie ziehen von ${input.fromCanton} nach ${input.toCanton}. Beachten Sie die kantonsspezifischen Regelungen.`,
      actionRequired: 'Fahrzeug ummelden, neue Krankenkasse prüfen.'
    });
    
    if (input.hasVehicles) {
      warnings.push({
        id: 'vehicle-reregistration',
        severity: 'warning',
        title: 'Fahrzeug-Ummeldung erforderlich',
        message: 'Bei Kantonswechsel müssen alle Fahrzeuge innerhalb von 14 Tagen umgemeldet werden.',
        actionRequired: 'Neues Kontrollschild beim Strassenverkehrsamt des neuen Kantons beantragen.',
        deadline: getTimelineDate(moveDate, 14).toISOString()
      });
    }
  }
  
  // Cross-language move
  if (isCrossLanguageMove(input.fromCanton, input.toCanton)) {
    warnings.push({
      id: 'cross-language',
      severity: 'info',
      title: 'Sprachwechsel',
      message: 'Sie ziehen in eine andere Sprachregion. Einige Behördengänge und Dokumente werden in der neuen Sprache sein.',
      actionRequired: 'Ggf. Übersetzungen von wichtigen Dokumenten vorbereiten.'
    });
  }
  
  // Cleaning reminder
  if (input.needsCleaning && input.propertyType === 'rental') {
    warnings.push({
      id: 'cleaning-guarantee',
      severity: 'warning',
      title: 'Abnahmegarantie beachten',
      message: 'Bei Mietwohnungen ist eine professionelle Endreinigung mit Abnahmegarantie empfohlen.',
      actionRequired: 'Reinigungsfirma mit Abnahmegarantie buchen.'
    });
  }
  
  // Children - school timing
  if (input.hasChildren) {
    const moveMonth = moveDate.getMonth();
    // School breaks: July-August, Feb (Sportferien), Apr (Ostern), Oct (Herbstferien)
    const isSchoolBreak = [6, 7, 1, 3, 9].includes(moveMonth);
    
    if (!isSchoolBreak) {
      warnings.push({
        id: 'school-timing',
        severity: 'info',
        title: 'Schulwechsel während Schulzeit',
        message: 'Der Umzug findet während der Schulzeit statt. Koordinieren Sie den Schulwechsel frühzeitig.',
        actionRequired: 'Alte und neue Schule mindestens 4 Wochen vorher informieren.'
      });
    }
  }
  
  // Check if destination canton supports eUmzug
  const destCanton = getCantonRegulation(input.toCanton);
  if (destCanton && !destCanton.eumzugSupported) {
    warnings.push({
      id: 'no-eumzug',
      severity: 'info',
      title: 'Kein eUmzug verfügbar',
      message: `Der Kanton ${destCanton.cantonName} unterstützt noch nicht die elektronische Ummeldung.`,
      actionRequired: 'Anmeldung muss persönlich bei der Gemeindeverwaltung erfolgen.'
    });
  }
  
  return warnings;
};

/**
 * Generate recommendations based on input
 */
export const generateRecommendations = (input: MoveReadinessInput): string[] => {
  const recommendations: string[] = [];
  
  // General recommendations
  recommendations.push('Beginnen Sie 4-6 Wochen vor dem Umzug mit dem Packen nicht-essentieller Gegenstände.');
  recommendations.push('Beschriften Sie alle Kartons mit Zimmer und Inhalt.');
  
  if (input.householdType === 'family') {
    recommendations.push('Packen Sie eine "Überlebens-Box" für die ersten Tage im neuen Zuhause.');
    recommendations.push('Planen Sie für den Umzugstag eine Betreuung für kleinere Kinder ein.');
  }
  
  if (input.needsCleaning) {
    recommendations.push('Buchen Sie eine Reinigungsfirma mit Abnahmegarantie für Ihre Sicherheit.');
    recommendations.push('Planen Sie die Reinigung für den Tag vor der Wohnungsübergabe.');
  }
  
  if (input.propertyType === 'rental') {
    recommendations.push('Dokumentieren Sie den Zustand der alten Wohnung vor dem Auszug mit Fotos.');
    recommendations.push('Notieren Sie alle Zählerstände und fotografieren Sie diese.');
  }
  
  if (input.specialItems && input.specialItems.length > 0) {
    recommendations.push('Klären Sie mit der Umzugsfirma speziellen Transport für Klavier, Kunst oder Antiquitäten.');
  }
  
  return recommendations;
};

/**
 * Calculate readiness score (0-100)
 */
export const calculateReadinessScore = (
  input: MoveReadinessInput, 
  completedItems: string[]
): number => {
  const checklist = generateChecklist(input);
  const totalItems = checklist.length;
  const requiredItems = checklist.filter(item => item.isRequired).length;
  
  const completedCount = completedItems.length;
  const completedRequired = checklist
    .filter(item => item.isRequired && completedItems.includes(item.id))
    .length;
  
  // Weight: 60% required items, 40% all items
  const requiredScore = requiredItems > 0 ? (completedRequired / requiredItems) * 60 : 60;
  const totalScore = totalItems > 0 ? (completedCount / totalItems) * 40 : 40;
  
  return Math.round(requiredScore + totalScore);
};

/**
 * Estimate total admin hours needed
 */
export const estimateAdminHours = (input: MoveReadinessInput): number => {
  let hours = 8; // Base hours
  
  if (input.needsCleaning) hours += 2;
  if (input.hasChildren) hours += 4;
  if (input.hasPets) hours += 2;
  if (input.hasVehicles) hours += 2;
  if (input.fromCanton !== input.toCanton) hours += 3;
  if (input.householdType === 'family') hours += 4;
  
  return hours;
};

/**
 * Main function: Generate complete move readiness result
 */
export const generateMoveReadinessResult = (
  input: MoveReadinessInput,
  completedItems: string[] = []
): MoveReadinessResult => {
  const timeline = generateMoveTimeline(input);
  const checklist = generateChecklist(input);
  const warnings = generateWarnings(input);
  const recommendations = generateRecommendations(input);
  
  // Mark completed items
  checklist.forEach(item => {
    if (completedItems.includes(item.id)) {
      item.isCompleted = true;
    }
  });
  
  // Get canton-specific notes
  const destCanton = getCantonRegulation(input.toCanton);
  const cantonSpecificNotes: string[] = [];
  
  if (destCanton) {
    cantonSpecificNotes.push(`Anmeldung bei der Gemeinde innerhalb von ${destCanton.registrationDeadlineDays} Tagen.`);
    if (destCanton.eumzugSupported) {
      cantonSpecificNotes.push('Elektronische Ummeldung via eUmzug.swiss möglich.');
    }
    if (destCanton.localHolidays.length > 0) {
      cantonSpecificNotes.push(`Lokale Feiertage beachten: ${destCanton.localHolidays.join(', ')}`);
    }
  }
  
  return {
    readinessScore: calculateReadinessScore(input, completedItems),
    timeline,
    checklist,
    warnings,
    recommendations,
    estimatedAdminHours: estimateAdminHours(input),
    cantonSpecificNotes
  };
};
