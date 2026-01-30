/**
 * City Requirements Database
 * 
 * Parking permit rules for major Swiss cities (MVP: 8 cities)
 */

import { ParkingPermitRule, ParkingInstructions } from './types';

/**
 * Default parking permit rules for Swiss cities
 * This is used as fallback when database fetch fails
 */
export const CITY_PARKING_RULES: Record<string, ParkingPermitRule> = {
  'zuerich': {
    id: 'zuerich',
    citySlug: 'zuerich',
    cityName: 'Zürich',
    cantonCode: 'ZH',
    requiresPermit: true,
    leadTimeDays: 10,
    costChf: 50,
    maxDurationHours: 10,
    contactUrl: 'https://www.stadt-zuerich.ch/pd/de/index/stadtpolizei/bewilligungen/halteverbot.html',
    applicationUrl: 'https://www.stadt-zuerich.ch/pd/de/index/stadtpolizei/bewilligungen/halteverbot/antrag.html',
    phone: '+41 44 411 71 17',
    email: 'halteverbote@zuerich.ch',
    instructions: {
      howToApply: 'Online-Formular ausfüllen oder per Post einsenden',
      whereToApply: 'Stadtpolizei Zürich, Abteilung Verkehr',
      whatToBring: [
        'Situationsplan mit eingezeichnetem Halteverbot',
        'Angaben zum Fahrzeug (Typ, Kontrollschild)',
        'Gewünschtes Datum und Zeitraum'
      ],
      paymentMethods: ['Rechnung', 'TWINT', 'Kreditkarte'],
      specialNotes: 'In der Altstadt gelten besondere Einschränkungen'
    },
    requirements: [
      'Antrag mindestens 10 Arbeitstage vorher einreichen',
      'Schilder werden von der Stadt geliefert',
      'Schilder müssen 72h vorher aufgestellt werden'
    ],
    tips: [
      'Frühzeitig beantragen, besonders Ende Monat',
      'Quartierparkkarten können günstiger sein für kurze Strecken'
    ]
  },
  'basel': {
    id: 'basel',
    citySlug: 'basel',
    cityName: 'Basel',
    cantonCode: 'BS',
    requiresPermit: true,
    leadTimeDays: 7,
    costChf: 40,
    maxDurationHours: 8,
    contactUrl: 'https://www.jsd.bs.ch/verkehr/parkieren/halteverbote.html',
    applicationUrl: 'https://www.jsd.bs.ch/verkehr/parkieren/halteverbote/antrag.html',
    phone: '+41 61 267 82 40',
    email: null,
    instructions: {
      howToApply: 'Online über das ePortal oder schriftlich',
      whereToApply: 'Justiz- und Sicherheitsdepartement',
      whatToBring: [
        'Adresse des Halteverbots',
        'Datum und Dauer',
        'Kontaktdaten des Antragstellers'
      ],
      paymentMethods: ['Rechnung'],
      specialNotes: 'Während der Fasnacht (Montag-Mittwoch nach Aschermittwoch) keine Halteverbote möglich'
    },
    requirements: [
      'Antrag 7 Arbeitstage vorher',
      'Schilder selbst beschaffen oder mieten'
    ],
    tips: [
      'Schilder können bei der Verkehrspolizei gemietet werden',
      'Keine Umzüge während der Fasnacht planen'
    ]
  },
  'bern': {
    id: 'bern',
    citySlug: 'bern',
    cityName: 'Bern',
    cantonCode: 'BE',
    requiresPermit: true,
    leadTimeDays: 5,
    costChf: 60,
    maxDurationHours: 8,
    contactUrl: 'https://www.bern.ch/politik-und-verwaltung/stadtverwaltung/sue/verkehrsplanung/halteverbote',
    applicationUrl: 'https://www.bern.ch/themen/mobilitat-und-verkehr/autofahren-und-parkieren/halteverbote-und-sonderbewilligungen',
    phone: '+41 31 321 72 72',
    email: 'verkehrsplanung@bern.ch',
    instructions: {
      howToApply: 'Online-Formular oder telefonisch',
      whereToApply: 'Verkehrsplanung Stadt Bern',
      whatToBring: [
        'Genaue Adresse',
        'Datum und Zeitfenster',
        'Angaben zum Umzugsfahrzeug'
      ],
      paymentMethods: ['Rechnung', 'Bar'],
      specialNotes: 'In der Altstadt (UNESCO) gelten Spezialregelungen'
    },
    requirements: [
      'Antrag 5 Arbeitstage vorher',
      'Altstadt: 10 Arbeitstage vorher'
    ],
    tips: [
      'Blaue Zone Parkplätze können temporär gesperrt werden',
      'Samstagsumzüge frühzeitig planen (hohe Nachfrage)'
    ]
  },
  'winterthur': {
    id: 'winterthur',
    citySlug: 'winterthur',
    cityName: 'Winterthur',
    cantonCode: 'ZH',
    requiresPermit: true,
    leadTimeDays: 7,
    costChf: 45,
    maxDurationHours: 10,
    contactUrl: 'https://stadt.winterthur.ch/themen/leben-in-winterthur/verkehr-mobilitaet/parkieren/halteverbote',
    applicationUrl: null,
    phone: '+41 52 267 58 58',
    email: 'stadtpolizei@win.ch',
    instructions: {
      howToApply: 'Schriftlich per Post oder E-Mail',
      whereToApply: 'Stadtpolizei Winterthur',
      whatToBring: [
        'Adresse und Datum',
        'Skizze der gewünschten Sperrfläche',
        'Kontaktdaten'
      ],
      paymentMethods: ['Rechnung'],
      specialNotes: null
    },
    requirements: [
      'Antrag 7 Arbeitstage vorher',
      'Schilder bei der Stadtpolizei abholen'
    ],
    tips: [
      'Frühe Antragsstellung empfohlen',
      'Telefonische Vorabklärung möglich'
    ]
  },
  'luzern': {
    id: 'luzern',
    citySlug: 'luzern',
    cityName: 'Luzern',
    cantonCode: 'LU',
    requiresPermit: true,
    leadTimeDays: 5,
    costChf: 50,
    maxDurationHours: 8,
    contactUrl: 'https://www.stadtluzern.ch/dienstleistungen/halteverbote',
    applicationUrl: null,
    phone: '+41 41 208 81 11',
    email: 'strasseninspektorat@stadtluzern.ch',
    instructions: {
      howToApply: 'Telefonisch oder per E-Mail',
      whereToApply: 'Strasseninspektorat der Stadt Luzern',
      whatToBring: [
        'Genaue Adresse',
        'Datum und Zeitraum',
        'Fahrzeugtyp'
      ],
      paymentMethods: ['Rechnung'],
      specialNotes: 'Während der Fasnacht eingeschränkte Möglichkeiten'
    },
    requirements: [
      'Antrag 5 Arbeitstage vorher'
    ],
    tips: [
      'Bei Seeanlage-Strassen frühzeitig planen',
      'Fasnachtszeit (Februar/März) meiden'
    ]
  },
  'st-gallen': {
    id: 'st-gallen',
    citySlug: 'st-gallen',
    cityName: 'St. Gallen',
    cantonCode: 'SG',
    requiresPermit: true,
    leadTimeDays: 5,
    costChf: 40,
    maxDurationHours: 8,
    contactUrl: 'https://www.stadt.sg.ch/home/mobilitaet-verkehr/parkieren/halteverbot.html',
    applicationUrl: null,
    phone: '+41 71 224 60 60',
    email: null,
    instructions: {
      howToApply: 'Online oder telefonisch',
      whereToApply: 'Tiefbauamt der Stadt St. Gallen',
      whatToBring: [
        'Adresse',
        'Datum und Dauer',
        'Kontaktdaten'
      ],
      paymentMethods: ['Rechnung'],
      specialNotes: null
    },
    requirements: [
      'Antrag 5 Arbeitstage vorher'
    ],
    tips: [
      'Altstadt: Längere Vorlaufzeit einplanen'
    ]
  },
  'lausanne': {
    id: 'lausanne',
    citySlug: 'lausanne',
    cityName: 'Lausanne',
    cantonCode: 'VD',
    requiresPermit: true,
    leadTimeDays: 10,
    costChf: 55,
    maxDurationHours: 8,
    contactUrl: 'https://www.lausanne.ch/vie-pratique/mobilite/stationnement.html',
    applicationUrl: null,
    phone: '+41 21 315 25 25',
    email: null,
    instructions: {
      howToApply: 'Formulaire en ligne ou par courrier',
      whereToApply: 'Service des routes et de la mobilité',
      whatToBring: [
        'Adresse exacte',
        'Date et durée souhaitées',
        'Type de véhicule'
      ],
      paymentMethods: ['Facture'],
      specialNotes: 'Dans la vieille ville, des restrictions supplémentaires s\'appliquent'
    },
    requirements: [
      'Demande 10 jours ouvrables à l\'avance'
    ],
    tips: [
      'Planifier tôt pour les zones touristiques',
      'Éviter les dates de festivals'
    ]
  },
  'genf': {
    id: 'genf',
    citySlug: 'genf',
    cityName: 'Genève',
    cantonCode: 'GE',
    requiresPermit: true,
    leadTimeDays: 10,
    costChf: 60,
    maxDurationHours: 8,
    contactUrl: 'https://www.ge.ch/stationner-geneve/demander-autorisation-stationnement',
    applicationUrl: 'https://www.ge.ch/demarche/demander-autorisation-stationnement',
    phone: '+41 22 327 47 00',
    email: null,
    instructions: {
      howToApply: 'Demande en ligne via le guichet électronique',
      whereToApply: 'Office cantonal des véhicules',
      whatToBring: [
        'Adresse précise',
        'Date et horaires',
        'Numéro d\'immatriculation du véhicule'
      ],
      paymentMethods: ['Carte de crédit', 'Facture'],
      specialNotes: 'Zones bleues: conditions spéciales'
    },
    requirements: [
      'Demande 10 jours ouvrables à l\'avance',
      'Les panneaux seront livrés'
    ],
    tips: [
      'Zone ONU: autorisations spéciales requises',
      'Vieille ville: très limité'
    ]
  }
};

/**
 * Get parking permit rule by city slug
 */
export const getCityParkingRule = (citySlug: string): ParkingPermitRule | null => {
  return CITY_PARKING_RULES[citySlug.toLowerCase()] || null;
};

/**
 * Get all cities with parking rules
 */
export const getAllCitiesWithRules = (): ParkingPermitRule[] => {
  return Object.values(CITY_PARKING_RULES);
};

/**
 * Check if city requires permit
 */
export const cityRequiresPermit = (citySlug: string): boolean => {
  const rule = getCityParkingRule(citySlug);
  return rule?.requiresPermit ?? true; // Default to true for safety
};

/**
 * Get cities by canton
 */
export const getCitiesByCanton = (cantonCode: string): ParkingPermitRule[] => {
  return Object.values(CITY_PARKING_RULES).filter(
    city => city.cantonCode === cantonCode.toUpperCase()
  );
};
