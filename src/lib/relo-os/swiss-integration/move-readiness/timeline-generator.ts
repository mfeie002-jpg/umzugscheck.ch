/**
 * Timeline Generator
 * 
 * Generates a personalized T-30 to T+14 timeline for Swiss moves
 * 
 * @see https://www.ch.ch/de/umzug-melden/
 */

import { 
  MoveReadinessInput, 
  TimelineItem, 
  TimelineCategory,
  MoveType 
} from './types';

/**
 * Determine the type of move based on postal codes
 */
export const determineMoveType = (fromCanton: string, toCanton: string): MoveType => {
  if (fromCanton === toCanton) {
    return 'within_canton';
  }
  return 'cross_canton';
};

/**
 * Generate the base timeline items that apply to all moves
 */
const generateBaseTimeline = (input: MoveReadinessInput): TimelineItem[] => {
  const items: TimelineItem[] = [
    // T-30: Planning Phase
    {
      id: 't-30-compare',
      day: -30,
      dayLabel: 'T-30',
      title: 'Umzugsofferten vergleichen',
      description: 'Holen Sie mindestens 3 Offerten ein und vergleichen Sie Preise und Leistungen.',
      category: 'logistics',
      priority: 'high',
      estimatedDuration: '2 Stunden',
      tips: [
        'Achten Sie auf versteckte Kosten',
        'Fragen Sie nach Versicherungsschutz',
        'Prüfen Sie Bewertungen der Firmen'
      ]
    },
    {
      id: 't-30-inventory',
      day: -30,
      dayLabel: 'T-30',
      title: 'Inventar erstellen',
      description: 'Dokumentieren Sie alle Möbel und Gegenstände für eine genaue Offerte.',
      category: 'logistics',
      priority: 'medium',
      estimatedDuration: '3 Stunden'
    },
    
    // T-21: Contract Phase
    {
      id: 't-21-book',
      day: -21,
      dayLabel: 'T-21',
      title: 'Umzugsfirma buchen',
      description: 'Bestätigen Sie die Buchung schriftlich und klären Sie alle Details.',
      category: 'logistics',
      priority: 'critical',
      estimatedDuration: '30 Minuten'
    },
    {
      id: 't-21-notify-landlord',
      day: -21,
      dayLabel: 'T-21',
      title: 'Vermieter informieren',
      description: 'Bestätigen Sie den Auszugstermin und vereinbaren Sie die Wohnungsübergabe.',
      category: 'legal',
      priority: 'high',
      estimatedDuration: '30 Minuten'
    },
    
    // T-14: Administration Phase
    {
      id: 't-14-utilities-cancel',
      day: -14,
      dayLabel: 'T-14',
      title: 'Strom/Gas/Internet kündigen',
      description: 'Kündigen Sie alle Verträge an der alten Adresse fristgerecht.',
      category: 'utilities',
      priority: 'high',
      estimatedDuration: '1 Stunde',
      tips: [
        'Kündigungsfristen beachten',
        'Schriftliche Bestätigung anfordern'
      ]
    },
    {
      id: 't-14-utilities-new',
      day: -14,
      dayLabel: 'T-14',
      title: 'Neue Verträge abschliessen',
      description: 'Organisieren Sie Strom, Internet und andere Dienste an der neuen Adresse.',
      category: 'utilities',
      priority: 'high',
      estimatedDuration: '1 Stunde'
    },
    {
      id: 't-14-address-changes',
      day: -14,
      dayLabel: 'T-14',
      title: 'Adressänderungen vorbereiten',
      description: 'Erstellen Sie eine Liste aller zu informierenden Stellen.',
      category: 'administrative',
      priority: 'medium',
      estimatedDuration: '30 Minuten'
    },
    
    // T-7: Swiss Post & Final Prep
    {
      id: 't-7-swiss-post',
      day: -7,
      dayLabel: 'T-7',
      title: 'Nachsendeauftrag Post',
      description: 'Beauftragen Sie die Nachsendung Ihrer Post für 6-24 Monate.',
      category: 'administrative',
      priority: 'critical',
      externalLink: 'https://www.post.ch/de/briefe-versenden/adressaenderung',
      externalLinkLabel: 'Swiss Post Adressänderung',
      estimatedDuration: '15 Minuten',
      tips: [
        'CHF 35-145 je nach Dauer',
        'Gilt für alle Haushaltsmitglieder'
      ]
    },
    {
      id: 't-7-packing',
      day: -7,
      dayLabel: 'T-7',
      title: 'Mit Packen beginnen',
      description: 'Beginnen Sie mit selten genutzten Gegenständen.',
      category: 'logistics',
      priority: 'high',
      estimatedDuration: '8+ Stunden'
    },
    
    // T-3: Final Preparations
    {
      id: 't-3-valuables',
      day: -3,
      dayLabel: 'T-3',
      title: 'Wertsachen sichern',
      description: 'Wichtige Dokumente, Schmuck und Bargeld separat aufbewahren.',
      category: 'personal',
      priority: 'high',
      estimatedDuration: '1 Stunde'
    },
    {
      id: 't-3-defrost',
      day: -3,
      dayLabel: 'T-3',
      title: 'Kühlschrank/Gefrierschrank',
      description: 'Abtauen und reinigen Sie Kühlgeräte rechtzeitig.',
      category: 'logistics',
      priority: 'medium',
      estimatedDuration: '30 Minuten'
    },
    
    // T-1: Day Before
    {
      id: 't-1-essentials',
      day: -1,
      dayLabel: 'T-1',
      title: 'Essentials-Box packen',
      description: 'Packen Sie alles, was Sie am Umzugstag und danach sofort brauchen.',
      category: 'personal',
      priority: 'high',
      estimatedDuration: '1 Stunde',
      tips: [
        'Toilettenartikel',
        'Wechselkleidung',
        'Ladegeräte',
        'Wichtige Dokumente',
        'Snacks und Getränke'
      ]
    },
    {
      id: 't-1-meter-readings',
      day: -1,
      dayLabel: 'T-1',
      title: 'Zählerstände ablesen',
      description: 'Notieren und fotografieren Sie alle Zählerstände.',
      category: 'utilities',
      priority: 'high',
      estimatedDuration: '15 Minuten'
    },
    
    // Move Day (T-0)
    {
      id: 't-0-move',
      day: 0,
      dayLabel: 'Umzugstag',
      title: 'Umzug durchführen',
      description: 'Koordinieren Sie mit der Umzugsfirma und überwachen Sie den Ablauf.',
      category: 'logistics',
      priority: 'critical',
      estimatedDuration: '8+ Stunden'
    },
    {
      id: 't-0-handover-old',
      day: 0,
      dayLabel: 'Umzugstag',
      title: 'Wohnungsübergabe alt',
      description: 'Übergabeprotokoll mit Vermieter erstellen, Schlüssel abgeben.',
      category: 'legal',
      priority: 'critical',
      estimatedDuration: '1 Stunde',
      tips: [
        'Alle Mängel dokumentieren',
        'Fotos machen',
        'Protokoll unterschreiben lassen'
      ]
    },
    {
      id: 't-0-handover-new',
      day: 0,
      dayLabel: 'Umzugstag',
      title: 'Wohnungsübergabe neu',
      description: 'Übergabeprotokoll erstellen, bestehende Mängel dokumentieren.',
      category: 'legal',
      priority: 'critical',
      estimatedDuration: '1 Stunde'
    },
    
    // T+1: Day After
    {
      id: 't-1-unpack',
      day: 1,
      dayLabel: 'T+1',
      title: 'Wichtiges auspacken',
      description: 'Küche, Bad und Schlafzimmer zuerst einrichten.',
      category: 'personal',
      priority: 'medium',
      estimatedDuration: '4+ Stunden'
    },
    {
      id: 't-1-damage-check',
      day: 1,
      dayLabel: 'T+1',
      title: 'Schäden prüfen',
      description: 'Kontrollieren Sie alle Möbel und Gegenstände auf Transportschäden.',
      category: 'logistics',
      priority: 'high',
      estimatedDuration: '2 Stunden',
      tips: [
        'Schäden sofort dokumentieren',
        'Innerhalb 24h bei Umzugsfirma melden'
      ]
    },
    
    // T+14: Registration Deadline
    {
      id: 't-14-register',
      day: 14,
      dayLabel: 'T+14',
      title: 'Anmeldung bei Gemeinde',
      description: 'Melden Sie sich innerhalb von 14 Tagen bei der neuen Gemeinde an.',
      category: 'administrative',
      priority: 'critical',
      externalLink: 'https://www.eumzug.swiss',
      externalLinkLabel: 'eUmzug Schweiz',
      estimatedDuration: '30 Minuten',
      tips: [
        'Ausweis/Pass mitnehmen',
        'Mietvertrag bereithalten',
        'Familienausweis bei Familien'
      ]
    },
    {
      id: 't-14-serafe',
      day: 14,
      dayLabel: 'T+14',
      title: 'Serafe Adresse ändern',
      description: 'Melden Sie Ihre neue Adresse für die TV/Radio-Gebühren.',
      category: 'administrative',
      priority: 'medium',
      externalLink: 'https://www.serafe.ch/de/adressaenderung/',
      externalLinkLabel: 'Serafe Adressänderung',
      estimatedDuration: '5 Minuten'
    }
  ];
  
  return items;
};

/**
 * Add cleaning-specific timeline items
 */
const addCleaningItems = (items: TimelineItem[], needsCleaning: boolean): TimelineItem[] => {
  if (!needsCleaning) return items;
  
  const cleaningItems: TimelineItem[] = [
    {
      id: 't-14-cleaning-book',
      day: -14,
      dayLabel: 'T-14',
      title: 'Endreinigung buchen',
      description: 'Buchen Sie eine professionelle Endreinigung für die alte Wohnung.',
      category: 'cleaning',
      priority: 'high',
      estimatedDuration: '30 Minuten'
    },
    {
      id: 't-1-cleaning',
      day: -1,
      dayLabel: 'T-1',
      title: 'Endreinigung durchführen',
      description: 'Die Reinigungsfirma reinigt die leere Wohnung.',
      category: 'cleaning',
      priority: 'critical',
      estimatedDuration: '4-6 Stunden',
      tips: [
        'Wohnung muss komplett leer sein',
        'Abnahmegarantie vereinbaren'
      ]
    }
  ];
  
  return [...items, ...cleaningItems];
};

/**
 * Add family-specific timeline items
 */
const addFamilyItems = (items: TimelineItem[], hasChildren: boolean): TimelineItem[] => {
  if (!hasChildren) return items;
  
  const familyItems: TimelineItem[] = [
    {
      id: 't-30-school',
      day: -30,
      dayLabel: 'T-30',
      title: 'Schule/Kita informieren',
      description: 'Informieren Sie Schule oder Kita über den Umzug und klären Sie Schulwechsel.',
      category: 'personal',
      priority: 'high',
      estimatedDuration: '1 Stunde'
    },
    {
      id: 't-14-new-school',
      day: -14,
      dayLabel: 'T-14',
      title: 'Neue Schule/Kita anmelden',
      description: 'Melden Sie die Kinder an der neuen Schule oder Kita an.',
      category: 'personal',
      priority: 'high',
      estimatedDuration: '2 Stunden'
    },
    {
      id: 't-7-kids-prep',
      day: -7,
      dayLabel: 'T-7',
      title: 'Kinder vorbereiten',
      description: 'Bereiten Sie die Kinder auf den Umzug vor, besuchen Sie ev. die neue Umgebung.',
      category: 'personal',
      priority: 'medium',
      estimatedDuration: '2 Stunden'
    }
  ];
  
  return [...items, ...familyItems];
};

/**
 * Add pet-specific timeline items
 */
const addPetItems = (items: TimelineItem[], hasPets: boolean): TimelineItem[] => {
  if (!hasPets) return items;
  
  const petItems: TimelineItem[] = [
    {
      id: 't-14-vet',
      day: -14,
      dayLabel: 'T-14',
      title: 'Tierarzt informieren',
      description: 'Holen Sie Unterlagen und finden Sie einen neuen Tierarzt.',
      category: 'personal',
      priority: 'medium',
      estimatedDuration: '1 Stunde'
    },
    {
      id: 't-7-pet-reg',
      day: -7,
      dayLabel: 'T-7',
      title: 'Hunde ummelden',
      description: 'Melden Sie Hunde bei der alten Gemeinde ab und bei der neuen an.',
      category: 'administrative',
      priority: 'high',
      estimatedDuration: '30 Minuten'
    }
  ];
  
  return [...items, ...petItems];
};

/**
 * Add vehicle-specific timeline items
 */
const addVehicleItems = (items: TimelineItem[], hasVehicles: boolean, moveType: MoveType): TimelineItem[] => {
  if (!hasVehicles) return items;
  
  const vehicleItems: TimelineItem[] = [
    {
      id: 't-14-vehicle-reg',
      day: -14,
      dayLabel: 'T-14',
      title: 'Fahrzeug ummelden',
      description: moveType === 'cross_canton' 
        ? 'Bei Kantonswechsel: Neues Kontrollschild beim Strassenverkehrsamt beantragen.'
        : 'Adressänderung beim Strassenverkehrsamt melden.',
      category: 'administrative',
      priority: 'high',
      estimatedDuration: moveType === 'cross_canton' ? '2 Stunden' : '30 Minuten',
      tips: moveType === 'cross_canton' 
        ? ['Neues Kontrollschild notwendig', 'Fahrzeugausweis mitnehmen']
        : ['Nur Adressänderung notwendig']
    }
  ];
  
  return [...items, ...vehicleItems];
};

/**
 * Sort timeline items by day
 */
const sortTimeline = (items: TimelineItem[]): TimelineItem[] => {
  return items.sort((a, b) => a.day - b.day);
};

/**
 * Main function: Generate a complete personalized timeline
 */
export const generateMoveTimeline = (input: MoveReadinessInput): TimelineItem[] => {
  const moveType = determineMoveType(input.fromCanton, input.toCanton);
  
  let timeline = generateBaseTimeline(input);
  timeline = addCleaningItems(timeline, input.needsCleaning);
  timeline = addFamilyItems(timeline, input.hasChildren);
  timeline = addPetItems(timeline, input.hasPets);
  timeline = addVehicleItems(timeline, input.hasVehicles, moveType);
  
  return sortTimeline(timeline);
};

/**
 * Calculate the actual date for a timeline item
 */
export const getTimelineDate = (moveDate: Date, dayOffset: number): Date => {
  const date = new Date(moveDate);
  date.setDate(date.getDate() + dayOffset);
  return date;
};

/**
 * Format day label for display
 */
export const formatDayLabel = (day: number): string => {
  if (day === 0) return 'Umzugstag';
  if (day < 0) return `T${day}`;
  return `T+${day}`;
};
