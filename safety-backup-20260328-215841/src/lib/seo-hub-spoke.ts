/**
 * SEO Hub-and-Spoke Architecture
 * 
 * STRATEGY:
 * - Canton Pages (HUB) = Informational content about the region
 *   → Focus: Taxes, laws, regional data, living costs, quality of life
 *   → Intent: Research, planning, "what is it like to live in..."
 *   
 * - City Pages (SPOKE) = Transactional, hyper-local utility
 *   → Focus: Parking rules, recycling centers, local services, quick actions
 *   → Intent: "I need a moving company NOW in..."
 * 
 * This semantic differentiation prevents keyword cannibalization
 * and ensures Google correctly indexes both page types.
 */

export interface HubContentData {
  regionName: string;
  regionSlug: string;
  // Informational Hub Content
  taxInfo: {
    taxRate: string;
    comparedToSwissAvg: 'lower' | 'average' | 'higher';
    explanation: string;
  };
  livingCosts: {
    avgRent3Room: string;
    avgRent4Room: string;
    comparedToSwissAvg: 'lower' | 'average' | 'higher';
  };
  demographics: {
    population: string;
    populationGrowth: string;
    expatPercent: string;
    avgAge: string;
  };
  qualityOfLife: {
    score: number; // 1-10
    highlights: string[];
  };
  transportLinks: {
    nearestAirport: string;
    nearestHighway: string;
    publicTransportScore: number; // 1-10
  };
  legalNotes: string[];
}

export interface SpokeContentData {
  cityName: string;
  citySlug: string;
  cantonSlug: string;
  // Transactional Spoke Content
  parkingRules: {
    halteverbotszone: {
      cost: string;
      leadTime: string;
      contactUrl?: string;
    };
    freeParking: boolean;
    zones: string[];
  };
  recyclingInfo: {
    centers: Array<{
      name: string;
      address: string;
      openHours: string;
    }>;
    bulkyWastePickup: {
      available: boolean;
      cost?: string;
      bookingUrl?: string;
    };
  };
  localServices: {
    postOffice: string;
    townHall: string;
    policeStation: string;
  };
  quickActions: Array<{
    title: string;
    description: string;
    ctaLabel: string;
    ctaUrl: string;
  }>;
  emergencyNumbers: {
    local: string;
    police: string;
    fire: string;
  };
}

// Canton Hub Data (informational focus)
export const CANTON_HUB_DATA: Record<string, Partial<HubContentData>> = {
  zuerich: {
    taxInfo: {
      taxRate: '22-24%',
      comparedToSwissAvg: 'average',
      explanation: 'Zürich hat moderate Steuersätze, die im Schweizer Durchschnitt liegen.'
    },
    livingCosts: {
      avgRent3Room: '2\'200–2\'800 CHF',
      avgRent4Room: '2\'800–3\'500 CHF',
      comparedToSwissAvg: 'higher'
    },
    demographics: {
      population: '1.54 Mio.',
      populationGrowth: '+1.1%/Jahr',
      expatPercent: '28%',
      avgAge: '42 Jahre'
    },
    qualityOfLife: {
      score: 9,
      highlights: ['Top-Infrastruktur', 'Internationales Flair', 'Vielfältige Kulturszene', 'Exzellentes ÖV-Netz']
    },
    transportLinks: {
      nearestAirport: 'Flughafen Zürich (10 Min.)',
      nearestHighway: 'A1, A3, A4',
      publicTransportScore: 10
    },
    legalNotes: [
      'Meldepflicht innerhalb von 14 Tagen nach Zuzug',
      'Halteverbotszone online beantragbar (mind. 7 Werktage vorher)',
      'Hundesteuer: 160 CHF/Jahr'
    ]
  },
  bern: {
    taxInfo: {
      taxRate: '21-23%',
      comparedToSwissAvg: 'average',
      explanation: 'Der Kanton Bern hat durchschnittliche Steuersätze mit progressiver Staffelung.'
    },
    livingCosts: {
      avgRent3Room: '1\'400–1\'800 CHF',
      avgRent4Room: '1\'800–2\'400 CHF',
      comparedToSwissAvg: 'lower'
    },
    demographics: {
      population: '1.03 Mio.',
      populationGrowth: '+0.7%/Jahr',
      expatPercent: '16%',
      avgAge: '43 Jahre'
    },
    qualityOfLife: {
      score: 8,
      highlights: ['UNESCO Welterbe Altstadt', 'Politisches Zentrum', 'Hohe Lebensqualität', 'Natur in der Nähe']
    },
    transportLinks: {
      nearestAirport: 'Flughafen Bern-Belp (20 Min.)',
      nearestHighway: 'A1, A6',
      publicTransportScore: 8
    },
    legalNotes: [
      'Anmeldung innerhalb von 14 Tagen bei der Einwohnerkontrolle',
      'Parkplatzbewilligung für Umzug bei der Stadtpolizei beantragen',
      'Hundesteuer variiert nach Gemeinde'
    ]
  },
  zug: {
    taxInfo: {
      taxRate: '12-14%',
      comparedToSwissAvg: 'lower',
      explanation: 'Zug ist einer der steuergünstigsten Kantone der Schweiz – ideal für Unternehmer und Familien.'
    },
    livingCosts: {
      avgRent3Room: '2\'400–3\'000 CHF',
      avgRent4Room: '3\'200–4\'000 CHF',
      comparedToSwissAvg: 'higher'
    },
    demographics: {
      population: '130\'000',
      populationGrowth: '+1.5%/Jahr',
      expatPercent: '32%',
      avgAge: '40 Jahre'
    },
    qualityOfLife: {
      score: 9,
      highlights: ['Tiefste Steuern', 'Internationale Community', 'Seelage', 'Tech-Hub']
    },
    transportLinks: {
      nearestAirport: 'Flughafen Zürich (30 Min.)',
      nearestHighway: 'A4, A14',
      publicTransportScore: 8
    },
    legalNotes: [
      'Meldepflicht innerhalb von 14 Tagen',
      'Crypto-freundliche Regulierung',
      'Schnelle Unternehmensgründung möglich'
    ]
  },
  basel: {
    taxInfo: {
      taxRate: '24-26%',
      comparedToSwissAvg: 'higher',
      explanation: 'Basel-Stadt hat höhere Steuern, bietet aber exzellente Infrastruktur und Kulturangebote.'
    },
    livingCosts: {
      avgRent3Room: '1\'600–2\'200 CHF',
      avgRent4Room: '2\'200–2\'800 CHF',
      comparedToSwissAvg: 'average'
    },
    demographics: {
      population: '500\'000',
      populationGrowth: '+0.8%/Jahr',
      expatPercent: '36%',
      avgAge: '41 Jahre'
    },
    qualityOfLife: {
      score: 9,
      highlights: ['Kulturhauptstadt', 'Pharma-Hub', 'Grenznähe D/F', 'Weltklasse-Museen']
    },
    transportLinks: {
      nearestAirport: 'EuroAirport Basel (15 Min.)',
      nearestHighway: 'A2, A3',
      publicTransportScore: 9
    },
    legalNotes: [
      'Grenzgänger-Regelungen beachten',
      'Spezielle Regeln für Umzüge in der Altstadt',
      'Hundesteuer: 120 CHF/Jahr'
    ]
  }
};

// City Spoke Data (transactional focus)
export const CITY_SPOKE_DATA: Record<string, Partial<SpokeContentData>> = {
  zuerich: {
    parkingRules: {
      halteverbotszone: {
        cost: '80–150 CHF',
        leadTime: '7 Werktage',
        contactUrl: 'https://www.stadt-zuerich.ch/pd/de/index/dav/parkkarten_bewilligungen/halteverbot.html'
      },
      freeParking: false,
      zones: ['Blaue Zone', 'Weisse Zone', 'Bewohnerparking']
    },
    recyclingInfo: {
      centers: [
        { name: 'Recyclinghof Hagenholz', address: 'Hagenholzstrasse 110', openHours: 'Mo-Sa 7-17 Uhr' },
        { name: 'Werkhof Herdern', address: 'Herdernstrasse 60', openHours: 'Mo-Fr 7-17 Uhr' }
      ],
      bulkyWastePickup: {
        available: true,
        cost: 'Ab 60 CHF',
        bookingUrl: 'https://www.stadt-zuerich.ch/entsorgung'
      }
    },
    localServices: {
      postOffice: 'Sihlpost, Kasernenstrasse 95-97',
      townHall: 'Stadthaus, Stadthausquai 17',
      policeStation: 'Stadtpolizei, Bahnhofquai 3'
    },
    quickActions: [
      {
        title: 'Halteverbot beantragen',
        description: 'Online-Formular für Parkplatzsperrung',
        ctaLabel: 'Jetzt beantragen',
        ctaUrl: '/rechner'
      },
      {
        title: 'Sperrgut-Abholung',
        description: 'Grosse Möbel abholen lassen',
        ctaLabel: 'Termin buchen',
        ctaUrl: '/rechner'
      }
    ],
    emergencyNumbers: {
      local: '044 411 71 17',
      police: '117',
      fire: '118'
    }
  },
  winterthur: {
    parkingRules: {
      halteverbotszone: {
        cost: '70–120 CHF',
        leadTime: '5 Werktage',
        contactUrl: 'https://stadt.winterthur.ch'
      },
      freeParking: true,
      zones: ['Blaue Zone', 'Parkhaus Altstadt']
    },
    recyclingInfo: {
      centers: [
        { name: 'Entsorgungshof Rietberg', address: 'Rietbergstrasse 20', openHours: 'Mo-Sa 8-17 Uhr' }
      ],
      bulkyWastePickup: {
        available: true,
        cost: 'Ab 50 CHF'
      }
    },
    localServices: {
      postOffice: 'Post Winterthur, Bahnhofplatz',
      townHall: 'Stadthaus, Marktgasse 20',
      policeStation: 'Stadtpolizei, Obertor 17'
    },
    quickActions: [
      {
        title: 'Umzug planen',
        description: 'Offerten von lokalen Firmen',
        ctaLabel: 'Vergleichen',
        ctaUrl: '/rechner'
      }
    ],
    emergencyNumbers: {
      local: '052 267 51 51',
      police: '117',
      fire: '118'
    }
  }
};

// Get Hub content for a canton
export function getHubContent(cantonSlug: string): HubContentData | null {
  const data = CANTON_HUB_DATA[cantonSlug];
  if (!data) return null;
  
  return {
    regionName: cantonSlug.charAt(0).toUpperCase() + cantonSlug.slice(1),
    regionSlug: cantonSlug,
    taxInfo: data.taxInfo || {
      taxRate: '20-25%',
      comparedToSwissAvg: 'average',
      explanation: 'Durchschnittliche Steuerbelastung im Schweizer Vergleich.'
    },
    livingCosts: data.livingCosts || {
      avgRent3Room: '1\'500–2\'000 CHF',
      avgRent4Room: '2\'000–2\'600 CHF',
      comparedToSwissAvg: 'average'
    },
    demographics: data.demographics || {
      population: '–',
      populationGrowth: '–',
      expatPercent: '–',
      avgAge: '–'
    },
    qualityOfLife: data.qualityOfLife || {
      score: 7,
      highlights: ['Gute Lebensqualität', 'Schweizer Standard']
    },
    transportLinks: data.transportLinks || {
      nearestAirport: '–',
      nearestHighway: '–',
      publicTransportScore: 7
    },
    legalNotes: data.legalNotes || [
      'Meldepflicht innerhalb von 14 Tagen nach Zuzug',
      'Halteverbotszone frühzeitig beantragen'
    ]
  };
}

// Get Spoke content for a city
export function getSpokeContent(citySlug: string): SpokeContentData | null {
  const data = CITY_SPOKE_DATA[citySlug];
  if (!data) return null;
  
  return {
    cityName: citySlug.charAt(0).toUpperCase() + citySlug.slice(1),
    citySlug: citySlug,
    cantonSlug: data.cantonSlug || citySlug,
    parkingRules: data.parkingRules || {
      halteverbotszone: {
        cost: '80–150 CHF',
        leadTime: '5-7 Werktage'
      },
      freeParking: false,
      zones: ['Blaue Zone']
    },
    recyclingInfo: data.recyclingInfo || {
      centers: [],
      bulkyWastePickup: { available: false }
    },
    localServices: data.localServices || {
      postOffice: '–',
      townHall: '–',
      policeStation: '–'
    },
    quickActions: data.quickActions || [],
    emergencyNumbers: data.emergencyNumbers || {
      local: '–',
      police: '117',
      fire: '118'
    }
  };
}

// SEO Keywords: Hub vs Spoke differentiation
export function getHubKeywords(cantonName: string): string[] {
  return [
    `Leben im Kanton ${cantonName}`,
    `Steuern ${cantonName}`,
    `Lebenshaltungskosten ${cantonName}`,
    `Wohnen Kanton ${cantonName}`,
    `${cantonName} Einwohner`,
    `${cantonName} Lebensqualität`,
    `Umziehen nach ${cantonName}`,
    `${cantonName} Expats`,
    `${cantonName} Vorteile`,
    `Kanton ${cantonName} Info`
  ];
}

export function getSpokeKeywords(cityName: string): string[] {
  return [
    `Umzugsfirma ${cityName}`,
    `Umzug ${cityName} heute`,
    `Halteverbot ${cityName}`,
    `Entsorgung ${cityName}`,
    `Sperrmüll ${cityName}`,
    `Umzugshelfer ${cityName}`,
    `Möbeltransport ${cityName}`,
    `Endreinigung ${cityName}`,
    `Umzugskosten ${cityName}`,
    `günstig umziehen ${cityName}`
  ];
}
