/**
 * City Disposal Calendars
 * 
 * Swiss city-specific waste collection schedules and calendar URLs
 */

import { DisposalSchedule } from './types';

interface CityDisposalInfo {
  citySlug: string;
  calendarUrl?: string;
  apiUrl?: string; // For cities with open APIs like ERZ Zürich
  collectionDays: Partial<Record<string, string[]>>; // category -> weekdays
  specialNotes?: string;
}

// City-specific disposal information
export const CITY_DISPOSAL_INFO: Record<string, CityDisposalInfo> = {
  'zuerich': {
    citySlug: 'zuerich',
    calendarUrl: 'https://www.stadt-zuerich.ch/ted/de/index/entsorgung_recycling/entsorgungskalender.html',
    apiUrl: 'https://openerz.metaodi.ch/api/', // Open ERZ API
    collectionDays: {
      'hauskehricht': ['mo', 'di', 'mi', 'do', 'fr'], // depends on district
      'papier': ['mo', 'mi'], // depends on district
    },
    specialNotes: 'Züri-Sack obligatorisch. Sperrgut-Abholung über ERZ anmelden.'
  },
  'basel': {
    citySlug: 'basel',
    calendarUrl: 'https://www.bs.ch/Portrait/abfall-und-recycling.html',
    collectionDays: {
      'hauskehricht': ['mo', 'di', 'mi', 'do', 'fr'],
      'papier': ['di', 'do'],
    },
    specialNotes: 'Bebbi-Sagg verwenden. Sperrgut kostenpflichtig.'
  },
  'bern': {
    citySlug: 'bern',
    calendarUrl: 'https://www.bern.ch/themen/umwelt-natur-und-energie/abfall',
    collectionDays: {
      'hauskehricht': ['mo', 'mi', 'fr'],
      'papier': ['mi'],
    },
    specialNotes: 'Offizielle Bern-Säcke erforderlich.'
  },
  'luzern': {
    citySlug: 'luzern',
    calendarUrl: 'https://www.real-luzern.ch/abfall/',
    collectionDays: {
      'hauskehricht': ['mo', 'mi', 'fr'],
      'papier': ['di'],
    },
    specialNotes: 'REAL-Säcke verwenden.'
  },
  'winterthur': {
    citySlug: 'winterthur',
    calendarUrl: 'https://stadtwerk.winterthur.ch/entsorgung-recycling',
    collectionDays: {
      'hauskehricht': ['mo', 'di', 'mi', 'do', 'fr'],
      'papier': ['mo', 'mi'],
      'gruengut': ['di', 'fr'],
    },
  },
  'stgallen': {
    citySlug: 'stgallen',
    calendarUrl: 'https://www.stadt.sg.ch/home/raum-umwelt/entsorgung.html',
    collectionDays: {
      'hauskehricht': ['mo', 'mi', 'fr'],
      'papier': ['di'],
    },
  },
  'lausanne': {
    citySlug: 'lausanne',
    calendarUrl: 'https://www.lausanne.ch/vie-pratique/dechets.html',
    collectionDays: {
      'hauskehricht': ['mo', 'mi', 'fr'],
      'papier': ['di', 'do'],
    },
    specialNotes: 'Sacs taxés obligatoires.'
  },
  'geneve': {
    citySlug: 'geneve',
    calendarUrl: 'https://www.geneve.ch/dechets',
    collectionDays: {
      'hauskehricht': ['mo', 'di', 'mi', 'do', 'fr'],
      'papier': ['mi'],
    },
    specialNotes: 'Sacs officiels obligatoires.'
  },
};

/**
 * Get city disposal info by postal code
 */
export const getCityFromPostalCode = (postalCode: string): string | null => {
  const prefix = postalCode.substring(0, 2);
  
  // Simplified mapping (in production, use full postal code database)
  const postalToCityMap: Record<string, string> = {
    '80': 'zuerich',
    '81': 'zuerich',
    '40': 'basel',
    '41': 'basel',
    '30': 'bern',
    '31': 'bern',
    '60': 'luzern',
    '84': 'winterthur',
    '90': 'stgallen',
    '10': 'lausanne',
    '12': 'geneve',
  };
  
  return postalToCityMap[prefix] || null;
};

/**
 * Get disposal calendar URL for a city
 */
export const getDisposalCalendarUrl = (citySlug: string): string | null => {
  return CITY_DISPOSAL_INFO[citySlug]?.calendarUrl || null;
};

/**
 * Generate ICS calendar content for disposal reminders
 */
export const generateDisposalCalendarICS = (
  schedules: DisposalSchedule[],
  moveDate: Date
): string => {
  const events: string[] = [];
  
  schedules.forEach((schedule, index) => {
    if (schedule.next_collection) {
      const startDate = new Date(schedule.next_collection);
      const dateStr = startDate.toISOString().split('T')[0].replace(/-/g, '');
      
      events.push(`BEGIN:VEVENT\nUID:disposal-${schedule.category_id}-${index}@umzugscheck.ch\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\nDTSTART;VALUE=DATE:${dateStr}\nSUMMARY:Entsorgung: ${schedule.category_id}\nDESCRIPTION:Sammlung für ${schedule.category_id}\nEND:VEVENT`);
    }
  });
  
  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Umzugscheck.ch//Entsorgungskalender//DE\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nX-WR-CALNAME:Umzug Entsorgungskalender\n${events.join('\n')}\nEND:VCALENDAR`;
};

/**
 * Calculate optimal disposal schedule before move
 */
export const calculateDisposalSchedule = (
  moveDate: Date,
  categories: string[]
): DisposalSchedule[] => {
  const schedules: DisposalSchedule[] = [];
  
  categories.forEach(categoryId => {
    // Calculate recommended disposal date based on category
    const recommendedDate = new Date(moveDate);
    
    switch (categoryId) {
      case 'sperrgut':
        // Sperrgut should be disposed 2-3 weeks before move
        recommendedDate.setDate(recommendedDate.getDate() - 14);
        break;
      case 'elektro':
        // Electronics 1-2 weeks before
        recommendedDate.setDate(recommendedDate.getDate() - 10);
        break;
      case 'chemie':
        // Chemicals early due to special handling
        recommendedDate.setDate(recommendedDate.getDate() - 21);
        break;
      case 'textilien':
        // Textiles 1 week before
        recommendedDate.setDate(recommendedDate.getDate() - 7);
        break;
      default:
        // Other categories 3-5 days before
        recommendedDate.setDate(recommendedDate.getDate() - 5);
    }
    
    schedules.push({
      category_id: categoryId,
      next_collection: recommendedDate,
    });
  });
  
  return schedules.sort((a, b) => 
    (a.next_collection?.getTime() || 0) - (b.next_collection?.getTime() || 0)
  );
};
