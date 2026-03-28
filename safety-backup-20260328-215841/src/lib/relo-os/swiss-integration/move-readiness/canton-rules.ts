/**
 * Canton Rules Database
 * 
 * Swiss canton-specific regulations for moving and registration
 */

import { CantonRegulation, UtilityProvider } from './types';

/**
 * Default canton regulations
 * This is used as fallback when database fetch fails
 */
export const CANTON_REGULATIONS: Record<string, CantonRegulation> = {
  ZH: {
    cantonCode: 'ZH',
    cantonName: 'Zürich',
    eumzugSupported: true,
    eumzugUrl: 'https://www.eumzug.swiss/eumzug/?kanton=ZH',
    registrationDeadlineDays: 14,
    deregistrationRequired: true,
    specialRules: {
      hundesteuer: true,
      parkingPermitViaCity: true
    },
    utilityProviders: [
      { type: 'electricity', name: 'EWZ', website: 'https://www.ewz.ch' },
      { type: 'internet', name: 'Swisscom', website: 'https://www.swisscom.ch' }
    ],
    localHolidays: ['Sechseläuten', 'Knabenschiessen'],
    language: 'de'
  },
  BE: {
    cantonCode: 'BE',
    cantonName: 'Bern',
    eumzugSupported: true,
    eumzugUrl: 'https://www.eumzug.swiss/eumzug/?kanton=BE',
    registrationDeadlineDays: 14,
    deregistrationRequired: true,
    specialRules: {
      bilingual: true
    },
    utilityProviders: [
      { type: 'electricity', name: 'BKW', website: 'https://www.bkw.ch' },
      { type: 'electricity', name: 'Energie Wasser Bern', website: 'https://www.ewb.ch' }
    ],
    localHolidays: ['Berchtoldstag'],
    language: 'de'
  },
  BS: {
    cantonCode: 'BS',
    cantonName: 'Basel-Stadt',
    eumzugSupported: true,
    eumzugUrl: 'https://www.eumzug.swiss/eumzug/?kanton=BS',
    registrationDeadlineDays: 14,
    deregistrationRequired: true,
    specialRules: {
      fasnacht: true
    },
    utilityProviders: [
      { type: 'electricity', name: 'IWB', website: 'https://www.iwb.ch' }
    ],
    localHolidays: ['Basler Fasnacht'],
    language: 'de'
  },
  LU: {
    cantonCode: 'LU',
    cantonName: 'Luzern',
    eumzugSupported: true,
    eumzugUrl: 'https://www.eumzug.swiss/eumzug/?kanton=LU',
    registrationDeadlineDays: 14,
    deregistrationRequired: true,
    specialRules: {},
    utilityProviders: [
      { type: 'electricity', name: 'EWL', website: 'https://www.ewl-luzern.ch' }
    ],
    localHolidays: [],
    language: 'de'
  },
  SG: {
    cantonCode: 'SG',
    cantonName: 'St. Gallen',
    eumzugSupported: true,
    eumzugUrl: 'https://www.eumzug.swiss/eumzug/?kanton=SG',
    registrationDeadlineDays: 14,
    deregistrationRequired: true,
    specialRules: {},
    utilityProviders: [
      { type: 'electricity', name: 'SAK', website: 'https://www.sak.ch' }
    ],
    localHolidays: [],
    language: 'de'
  },
  AG: {
    cantonCode: 'AG',
    cantonName: 'Aargau',
    eumzugSupported: true,
    eumzugUrl: 'https://www.eumzug.swiss/eumzug/?kanton=AG',
    registrationDeadlineDays: 14,
    deregistrationRequired: true,
    specialRules: {},
    utilityProviders: [
      { type: 'electricity', name: 'AEW', website: 'https://www.aew.ch' }
    ],
    localHolidays: [],
    language: 'de'
  },
  VD: {
    cantonCode: 'VD',
    cantonName: 'Vaud',
    eumzugSupported: true,
    eumzugUrl: 'https://www.eumzug.swiss/eumzug/?kanton=VD',
    registrationDeadlineDays: 14,
    deregistrationRequired: true,
    specialRules: {},
    utilityProviders: [
      { type: 'electricity', name: 'Romande Energie', website: 'https://www.romande-energie.ch' }
    ],
    localHolidays: [],
    language: 'fr'
  },
  GE: {
    cantonCode: 'GE',
    cantonName: 'Genève',
    eumzugSupported: true,
    eumzugUrl: 'https://www.eumzug.swiss/eumzug/?kanton=GE',
    registrationDeadlineDays: 14,
    deregistrationRequired: true,
    specialRules: {},
    utilityProviders: [
      { type: 'electricity', name: 'SIG', website: 'https://www.sig-ge.ch' }
    ],
    localHolidays: ['Jeûne genevois'],
    language: 'fr'
  },
  TI: {
    cantonCode: 'TI',
    cantonName: 'Ticino',
    eumzugSupported: true,
    eumzugUrl: 'https://www.eumzug.swiss/eumzug/?kanton=TI',
    registrationDeadlineDays: 14,
    deregistrationRequired: true,
    specialRules: {},
    utilityProviders: [
      { type: 'electricity', name: 'AET', website: 'https://www.aet.ch' }
    ],
    localHolidays: [],
    language: 'it'
  },
  ZG: {
    cantonCode: 'ZG',
    cantonName: 'Zug',
    eumzugSupported: true,
    eumzugUrl: 'https://www.eumzug.swiss/eumzug/?kanton=ZG',
    registrationDeadlineDays: 14,
    deregistrationRequired: true,
    specialRules: {},
    utilityProviders: [
      { type: 'electricity', name: 'WWZ', website: 'https://www.wwz.ch' }
    ],
    localHolidays: [],
    language: 'de'
  }
};

/**
 * Get canton regulation by code
 */
export const getCantonRegulation = (cantonCode: string): CantonRegulation | null => {
  return CANTON_REGULATIONS[cantonCode.toUpperCase()] || null;
};

/**
 * Get all cantons with eUmzug support
 */
export const getEumzugSupportedCantons = (): CantonRegulation[] => {
  return Object.values(CANTON_REGULATIONS).filter(c => c.eumzugSupported);
};

/**
 * Get canton language
 */
export const getCantonLanguage = (cantonCode: string): 'de' | 'fr' | 'it' | 'rm' => {
  const canton = CANTON_REGULATIONS[cantonCode.toUpperCase()];
  return canton?.language || 'de';
};

/**
 * Check if move is cross-language
 */
export const isCrossLanguageMove = (fromCanton: string, toCanton: string): boolean => {
  const fromLang = getCantonLanguage(fromCanton);
  const toLang = getCantonLanguage(toCanton);
  return fromLang !== toLang;
};

/**
 * Get utility providers for a canton
 */
export const getCantonUtilityProviders = (cantonCode: string): UtilityProvider[] => {
  const canton = CANTON_REGULATIONS[cantonCode.toUpperCase()];
  return canton?.utilityProviders || [];
};

/**
 * Map postal code prefix to canton
 * Simplified version - should be extended with full PLZ database
 */
export const getCantonFromPostalCode = (postalCode: string): string | null => {
  const prefix = postalCode.substring(0, 2);
  const first = postalCode.charAt(0);
  
  // Simplified mapping based on first digits
  const mapping: Record<string, string> = {
    '80': 'ZH', '81': 'ZH', '82': 'ZH', '83': 'ZH', '84': 'ZH', '85': 'ZH', '86': 'ZH', '87': 'ZH', '88': 'ZH', '89': 'ZH',
    '30': 'BE', '31': 'BE', '32': 'BE', '33': 'BE', '34': 'BE', '35': 'BE', '36': 'BE', '37': 'BE', '38': 'BE',
    '40': 'BS', '41': 'BL', '42': 'BL', '43': 'BL', '44': 'BL', '45': 'SO', '46': 'SO', '47': 'SO',
    '60': 'LU', '61': 'LU', '62': 'LU', '63': 'NW', '64': 'OW', '65': 'TI', '66': 'TI', '67': 'TI', '68': 'TI', '69': 'TI',
    '90': 'SG', '91': 'SG', '92': 'SG', '93': 'SG', '94': 'AR', '95': 'AR', '96': 'GR', '97': 'GR',
    '50': 'AG', '51': 'AG', '52': 'AG', '53': 'AG', '54': 'AG', '55': 'AG', '56': 'AG', '57': 'AG', '58': 'AG',
    '10': 'VD', '11': 'VD', '12': 'GE', '13': 'VD', '14': 'VD', '15': 'FR', '16': 'FR', '17': 'FR', '18': 'VS', '19': 'VS',
    '20': 'NE', '21': 'NE', '22': 'NE', '23': 'JU', '24': 'JU', '25': 'BE', '26': 'BE', '27': 'BE', '28': 'JU', '29': 'BE',
    '70': 'GR', '71': 'GR', '72': 'GR', '73': 'GR', '74': 'GR', '75': 'GR', '76': 'GR', '77': 'GR', '78': 'GR', '79': 'GR',
  };
  
  // Try 2-digit prefix first
  if (mapping[prefix]) return mapping[prefix];
  
  // Fallback to first digit
  const firstDigitMapping: Record<string, string> = {
    '1': 'VD', '2': 'NE', '3': 'BE', '4': 'BS', '5': 'AG', '6': 'LU', '7': 'GR', '8': 'ZH', '9': 'SG'
  };
  
  return firstDigitMapping[first] || null;
};

/**
 * Canton display names for UI
 */
export const CANTON_DISPLAY_NAMES: Record<string, string> = {
  'ZH': 'Zürich', 'BE': 'Bern', 'LU': 'Luzern', 'UR': 'Uri', 'SZ': 'Schwyz',
  'OW': 'Obwalden', 'NW': 'Nidwalden', 'GL': 'Glarus', 'ZG': 'Zug', 'FR': 'Fribourg',
  'SO': 'Solothurn', 'BS': 'Basel-Stadt', 'BL': 'Basel-Landschaft', 'SH': 'Schaffhausen',
  'AR': 'Appenzell Ausserrhoden', 'AI': 'Appenzell Innerrhoden', 'SG': 'St. Gallen',
  'GR': 'Graubünden', 'AG': 'Aargau', 'TG': 'Thurgau', 'TI': 'Tessin', 'VD': 'Waadt',
  'VS': 'Wallis', 'NE': 'Neuenburg', 'GE': 'Genf', 'JU': 'Jura',
};

/**
 * Get canton rules by code (alias for getCantonRegulation)
 */
export const getCantonRules = (cantonCode: string): CantonRegulation | null => {
  return getCantonRegulation(cantonCode);
};
