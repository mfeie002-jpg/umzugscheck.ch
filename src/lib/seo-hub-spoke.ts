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
  'basel-stadt': {
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
      population: '200\'000',
      populationGrowth: '+0.5%/Jahr',
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
  },
  aargau: {
    taxInfo: {
      taxRate: '18-21%',
      comparedToSwissAvg: 'lower',
      explanation: 'Der Aargau bietet attraktive Steuersätze und eine zentrale Lage zwischen den Wirtschaftszentren.'
    },
    livingCosts: {
      avgRent3Room: '1\'400–1\'800 CHF',
      avgRent4Room: '1\'800–2\'300 CHF',
      comparedToSwissAvg: 'average'
    },
    demographics: {
      population: '700\'000',
      populationGrowth: '+1.2%/Jahr',
      expatPercent: '25%',
      avgAge: '41 Jahre'
    },
    qualityOfLife: { score: 8, highlights: ['Zentrale Lage', 'Schlösserkanton', 'Industriestark', 'Naherholungsgebiete'] },
    transportLinks: { nearestAirport: 'Flughafen Zürich (30 Min.)', nearestHighway: 'A1, A3', publicTransportScore: 8 },
    legalNotes: ['Anmeldung bei der Gemeinde innerhalb von 14 Tagen', 'Militärische Meldepflicht beachten']
  },
  luzern: {
    taxInfo: { taxRate: '20-22%', comparedToSwissAvg: 'average', explanation: 'Luzern liegt im gesunden Mittelfeld der Zentralschweizer Steuersätze.' },
    livingCosts: { avgRent3Room: '1\'600–2\'100 CHF', avgRent4Room: '2\'100–2\'700 CHF', comparedToSwissAvg: 'average' },
    demographics: { population: '420\'000', populationGrowth: '+0.9%/Jahr', expatPercent: '18%', avgAge: '42 Jahre' },
    qualityOfLife: { score: 9, highlights: ['Vierwaldstättersee', 'Tourismus-Hotspot', 'Zentralschweizer Zentrum', 'Hoher Freizeitwert'] },
    transportLinks: { nearestAirport: 'Flughafen Zürich (50 Min.)', nearestHighway: 'A2, A14', publicTransportScore: 9 },
    legalNotes: ['Parkbewilligung für Seebecken-Umzüge frühzeitig beantragen', 'Hundesteuer variiert']
  },
  'st-gallen': {
    taxInfo: { taxRate: '22-25%', comparedToSwissAvg: 'average', explanation: 'St. Gallen hat eine moderate Steuerbelastung mit Fokus auf Familienförderung.' },
    livingCosts: { avgRent3Room: '1\'300–1\'700 CHF', avgRent4Room: '1\'700–2\'200 CHF', comparedToSwissAvg: 'lower' },
    demographics: { population: '515\'000', populationGrowth: '+0.8%/Jahr', expatPercent: '24%', avgAge: '42 Jahre' },
    qualityOfLife: { score: 8, highlights: ['UNESCO Stiftsbezirk', 'Bildungszentrum (HSG)', 'Nähe zum Bodensee', 'Textiltradition'] },
    transportLinks: { nearestAirport: 'Flughafen Altenrhein (15 Min.)', nearestHighway: 'A1, A13', publicTransportScore: 8 },
    legalNotes: ['Abfallentsorgung über städtische Gebührensäcke', 'Meldepflicht bei Zuzug']
  },
  tessin: {
    taxInfo: { taxRate: '19-23%', comparedToSwissAvg: 'average', explanation: 'Das Tessin bietet eine eigene steuerliche Dynamik mit südländischem Flair.' },
    livingCosts: { avgRent3Room: '1\'400–1\'900 CHF', avgRent4Room: '1\'900–2\'500 CHF', comparedToSwissAvg: 'average' },
    demographics: { population: '350\'000', populationGrowth: '+0.3%/Jahr', expatPercent: '28%', avgAge: '45 Jahre' },
    qualityOfLife: { score: 9, highlights: ['Sonniges Klima', 'Seenlandschaft', 'Kulinarik', 'Mischung aus CH/IT Kultur'] },
    transportLinks: { nearestAirport: 'Flughafen Malpensa (60 Min.)', nearestHighway: 'A2 (Gotthard)', publicTransportScore: 8 },
    legalNotes: ['Amtssprache ist Italienisch', 'Spezielle Parkregeln in engen Dorfkernen']
  },
  waadt: {
    taxInfo: { taxRate: '23-25%', comparedToSwissAvg: 'higher', explanation: 'Die Waadt hat tendenziell höhere Steuern, bietet aber erstklassige Infrastruktur am Genfersee.' },
    livingCosts: { avgRent3Room: '1\'900–2\'500 CHF', avgRent4Room: '2\'500–3\'200 CHF', comparedToSwissAvg: 'higher' },
    demographics: { population: '820\'000', populationGrowth: '+1.3%/Jahr', expatPercent: '33%', avgAge: '40 Jahre' },
    qualityOfLife: { score: 9, highlights: ['Lavaux Weinberge', 'Bildungshub (EPFL)', 'Riviera-Gefühl', 'Internationales Umfeld'] },
    transportLinks: { nearestAirport: 'Flughafen Genf (45 Min.)', nearestHighway: 'A1, A9', publicTransportScore: 9 },
    legalNotes: ['Anmeldung bei der Contrôle des habitants', 'Französisch als Amtssprache']
  },
  wallis: {
    taxInfo: { taxRate: '19-22%', comparedToSwissAvg: 'lower', explanation: 'Das Wallis ist steuerlich attraktiv, besonders für Grenzgänger und Rentner.' },
    livingCosts: { avgRent3Room: '1\'200–1\'600 CHF', avgRent4Room: '1\'600–2\'100 CHF', comparedToSwissAvg: 'lower' },
    demographics: { population: '350\'000', populationGrowth: '+0.9%/Jahr', expatPercent: '23%', avgAge: '43 Jahre' },
    qualityOfLife: { score: 8, highlights: ['Alpenpanorama', 'Outdoor-Paradies', 'Weinbau', 'Zweisprachigkeit (DE/FR)'] },
    transportLinks: { nearestAirport: 'Flughafen Sion', nearestHighway: 'A9', publicTransportScore: 7 },
    legalNotes: ['Kurtaxen in Tourismusgemeinden beachten', 'Parkregeln bei Hanglage']
  },
  freiburg: {
    taxInfo: { taxRate: '22-25%', comparedToSwissAvg: 'average', explanation: 'Freiburg bietet eine solide Steuerbasis mit starker Berücksichtigung der Zweisprachigkeit.' },
    livingCosts: { avgRent3Room: '1\'300–1\'700 CHF', avgRent4Room: '1\'700–2\'200 CHF', comparedToSwissAvg: 'lower' },
    demographics: { population: '330\'000', populationGrowth: '+1.4%/Jahr', expatPercent: '22%', avgAge: '39 Jahre' },
    qualityOfLife: { score: 8, highlights: ['Zweisprachigkeit', 'Historische Altstadt', 'Günstige Mieten', 'Bildungsstandort'] },
    transportLinks: { nearestAirport: 'Flughafen Bern (40 Min.)', nearestHighway: 'A12', publicTransportScore: 8 },
    legalNotes: ['Zweisprachige Kommunikation mit Behörden möglich', 'Meldepflicht']
  },
  solothurn: {
    taxInfo: { taxRate: '22-25%', comparedToSwissAvg: 'average', explanation: 'Solothurn hat eine moderate Steuerbelastung im schweizerischen Mittelfeld.' },
    livingCosts: { avgRent3Room: '1\'300–1\'650 CHF', avgRent4Room: '1\'650–2\'100 CHF', comparedToSwissAvg: 'lower' },
    demographics: { population: '280\'000', populationGrowth: '+0.8%/Jahr', expatPercent: '23%', avgAge: '43 Jahre' },
    qualityOfLife: { score: 8, highlights: ['Barockstadt', 'Zentrale Lage', 'Jura-Nähe', 'Industriestark'] },
    transportLinks: { nearestAirport: 'Flughafen Bern (45 Min.)', nearestHighway: 'A1, A5', publicTransportScore: 8 },
    legalNotes: ['Gebührensäcke für Kehricht obligatorisch', 'Meldung bei Zuzug']
  },
  thurgau: {
    taxInfo: { taxRate: '17-20%', comparedToSwissAvg: 'lower', explanation: 'Der Thurgau ist bekannt für seine tiefe Steuerbelastung, besonders für Wohneigentümer.' },
    livingCosts: { avgRent3Room: '1\'400–1\'750 CHF', avgRent4Room: '1\'750–2\'300 CHF', comparedToSwissAvg: 'average' },
    demographics: { population: '285\'000', populationGrowth: '+1.1%/Jahr', expatPercent: '25%', avgAge: '42 Jahre' },
    qualityOfLife: { score: 8, highlights: ['Bodenseenähe', 'Ländliche Idylle', 'Familienfreundlich', 'Gute Anbindung zu ZH'] },
    transportLinks: { nearestAirport: 'Flughafen Zürich (35 Min.)', nearestHighway: 'A1, A7', publicTransportScore: 7 },
    legalNotes: ['Anmeldung Einwohnerkontrolle', 'Hundesteuerpflicht']
  },
  'basel-landschaft': {
    taxInfo: { taxRate: '21-23%', comparedToSwissAvg: 'average', explanation: 'Basel-Land bietet moderate Steuersätze als attraktive Alternative zur Stadt.' },
    livingCosts: { avgRent3Room: '1\'500–2\'000 CHF', avgRent4Room: '2\'000–2\'600 CHF', comparedToSwissAvg: 'average' },
    demographics: { population: '290\'000', populationGrowth: '+0.6%/Jahr', expatPercent: '23%', avgAge: '44 Jahre' },
    qualityOfLife: { score: 8, highlights: ['Grüne Vororte', 'Starke KMU-Struktur', 'Nähe zu Basel-Stadt', 'Guter ÖV'] },
    transportLinks: { nearestAirport: 'EuroAirport Basel (20 Min.)', nearestHighway: 'A2, A3', publicTransportScore: 8 },
    legalNotes: ['Abfallmarken-System in vielen Gemeinden', 'Meldepflicht']
  },
  graubuenden: {
    taxInfo: { taxRate: '18-21%', comparedToSwissAvg: 'lower', explanation: 'Graubünden lockt mit tiefen Steuersätzen, besonders in den Tourismusregionen.' },
    livingCosts: { avgRent3Room: '1\'400–1\'800 CHF', avgRent4Room: '1\'800–2\'400 CHF', comparedToSwissAvg: 'average' },
    demographics: { population: '200\'000', populationGrowth: '+0.4%/Jahr', expatPercent: '19%', avgAge: '44 Jahre' },
    qualityOfLife: { score: 9, highlights: ['Ferienregion Nr. 1', 'Natur pur', 'Dreisprachigkeit', 'Hoher Freizeitwert'] },
    transportLinks: { nearestAirport: 'Flughafen Zürich (90 Min.)', nearestHighway: 'A13', publicTransportScore: 7 },
    legalNotes: ['Dreisprachigkeit beachten (DE/IT/RR)', 'Spezielle Winter-Parkregeln']
  },
  neuenburg: {
    taxInfo: { taxRate: '24-26%', comparedToSwissAvg: 'higher', explanation: 'Neuenburg hat eine höhere Steuerbelastung, investiert aber stark in Innovation.' },
    livingCosts: { avgRent3Room: '1\'200–1\'550 CHF', avgRent4Room: '1\'550–2\'000 CHF', comparedToSwissAvg: 'lower' },
    demographics: { population: '176\'000', populationGrowth: '+0.2%/Jahr', expatPercent: '25%', avgAge: '43 Jahre' },
    qualityOfLife: { score: 8, highlights: ['Uhrenindustrie', 'See-Lage', 'Forschungszentrum', 'Lebensqualität'] },
    transportLinks: { nearestAirport: 'Flughafen Genf (70 Min.)', nearestHighway: 'A5', publicTransportScore: 8 },
    legalNotes: ['Französisch als Amtssprache', 'Anmeldung innerhalb 14 Tage']
  },
  genf: {
    taxInfo: { taxRate: '23-26%', comparedToSwissAvg: 'higher', explanation: 'Genf ist steuerlich anspruchsvoll, bietet aber ein weltweites Diplomatie-Umfeld.' },
    livingCosts: { avgRent3Room: '2\'500–3\'200 CHF', avgRent4Room: '3\'200–4\'500 CHF', comparedToSwissAvg: 'higher' },
    demographics: { population: '510\'000', populationGrowth: '+1.0%/Jahr', expatPercent: '40%', avgAge: '41 Jahre' },
    qualityOfLife: { score: 9, highlights: ['Internationales Flair', 'Jet d’Eau', 'Diplomaten-Hub', 'Global City'] },
    transportLinks: { nearestAirport: 'Flughafen Genf (10 Min.)', nearestHighway: 'A1', publicTransportScore: 10 },
    legalNotes: ['Zuzug aus dem Ausland häufig', 'Parkbewilligung fast immer nötig']
  },
  schaffhausen: {
    taxInfo: { taxRate: '20-22%', comparedToSwissAvg: 'average', explanation: 'Schaffhausen bietet solide Konditionen mit Fokus auf Grenznähe.' },
    livingCosts: { avgRent3Room: '1\'350–1\'700 CHF', avgRent4Room: '1\'700–2\'200 CHF', comparedToSwissAvg: 'lower' },
    demographics: { population: '85\'000', populationGrowth: '+0.7%/Jahr', expatPercent: '26%', avgAge: '43 Jahre' },
    qualityOfLife: { score: 8, highlights: ['Rheinfall', 'Charmanter Stadtkern', 'Nähe zu Deutschland', 'Wirtschaftsstark'] },
    transportLinks: { nearestAirport: 'Flughafen Zürich (35 Min.)', nearestHighway: 'A4', publicTransportScore: 8 },
    legalNotes: ['Parken in der Altstadt eingeschränkt', 'Meldepflicht']
  },
  schwyz: {
    taxInfo: { taxRate: '12-15%', comparedToSwissAvg: 'lower', explanation: 'Schwyz gehört zu den steuergünstigsten Kantonen der Schweiz.' },
    livingCosts: { avgRent3Room: '1\'800–2\'400 CHF', avgRent4Room: '2\'400–3\'200 CHF', comparedToSwissAvg: 'higher' },
    demographics: { population: '165\'000', populationGrowth: '+1.3%/Jahr', expatPercent: '21%', avgAge: '42 Jahre' },
    qualityOfLife: { score: 9, highlights: ['Tiefste Steuern', 'Zürichsee-Nähe', 'Bergpanorama', 'Hohe Privatsphäre'] },
    transportLinks: { nearestAirport: 'Flughafen Zürich (45 Min.)', nearestHighway: 'A3, A4', publicTransportScore: 7 },
    legalNotes: ['Anmeldung bei der Gemeinde', 'Baubewilligungen streng']
  },
  jura: {
    taxInfo: { taxRate: '24-27%', comparedToSwissAvg: 'higher', explanation: 'Der Jura hat eine höhere Steuerbelastung im interkantonalen Vergleich.' },
    livingCosts: { avgRent3Room: '1\'000–1\'400 CHF', avgRent4Room: '1\'400–1\'800 CHF', comparedToSwissAvg: 'lower' },
    demographics: { population: '74\'000', populationGrowth: '+0.1%/Jahr', expatPercent: '15%', avgAge: '43 Jahre' },
    qualityOfLife: { score: 7, highlights: ['Naturerlebnis', 'Pferdezucht', 'Ruhe', 'Günstige Immobilien'] },
    transportLinks: { nearestAirport: 'Flughafen Basel (45 Min.)', nearestHighway: 'A16', publicTransportScore: 6 },
    legalNotes: ['Französisch als Amtssprache', 'Ländliche Abfallentsorgung']
  },
  'appenzell-ausserrhoden': {
    taxInfo: { taxRate: '20-22%', comparedToSwissAvg: 'average', explanation: 'Moderate Steuern mit Fokus auf ländliche Lebensqualität.' },
    livingCosts: { avgRent3Room: '1\'250–1\'600 CHF', avgRent4Room: '1\'600–2\'100 CHF', comparedToSwissAvg: 'lower' },
    demographics: { population: '56\'000', populationGrowth: '+0.3%/Jahr', expatPercent: '16%', avgAge: '44 Jahre' },
    qualityOfLife: { score: 8, highlights: ['Tradition', 'Säntis-Nähe', 'Landschaft', 'Sicherheit'] },
    transportLinks: { nearestAirport: 'Flughafen Altenrhein (20 Min.)', nearestHighway: 'A1', publicTransportScore: 7 },
    legalNotes: ['Meldung bei Einwohnerkontrolle', 'Landsgemeinde-Tradition']
  },
  'appenzell-innerrhoden': {
    taxInfo: { taxRate: '15-18%', comparedToSwissAvg: 'lower', explanation: 'Innerrhoden ist einer der steuergünstigsten Ostschweizer Kantone.' },
    livingCosts: { avgRent3Room: '1\'300–1\'650 CHF', avgRent4Room: '1\'650–2\'150 CHF', comparedToSwissAvg: 'lower' },
    demographics: { population: '16\'000', populationGrowth: '+0.5%/Jahr', expatPercent: '11%', avgAge: '43 Jahre' },
    qualityOfLife: { score: 9, highlights: ['Höchste Sicherheit', 'Tradition', 'Steuerparadies', 'Natur'] },
    transportLinks: { nearestAirport: 'Flughafen Altenrhein (30 Min.)', nearestHighway: 'A1', publicTransportScore: 6 },
    legalNotes: ['Kleinester Kanton (Einwohner)', 'Persönlicher Kontakt zu Behörden']
  },
  nidwalden: {
    taxInfo: { taxRate: '13-16%', comparedToSwissAvg: 'lower', explanation: 'Nidwalden bietet exzellente steuerliche Bedingungen in der Zentralschweiz.' },
    livingCosts: { avgRent3Room: '1\'750–2\'300 CHF', avgRent4Room: '2\'300–3\'000 CHF', comparedToSwissAvg: 'higher' },
    demographics: { population: '44\'000', populationGrowth: '+0.8%/Jahr', expatPercent: '15%', avgAge: '43 Jahre' },
    qualityOfLife: { score: 9, highlights: ['See- und Bergnähe', 'Tiefe Steuern', 'Starke Wirtschaft', 'Sicherheit'] },
    transportLinks: { nearestAirport: 'Flughafen Zürich (60 Min.)', nearestHighway: 'A2', publicTransportScore: 7 },
    legalNotes: ['Meldepflicht', 'Hundesteuerpflicht']
  },
  obwalden: {
    taxInfo: { taxRate: '14-17%', comparedToSwissAvg: 'lower', explanation: 'Obwalden hat eine sehr attraktive Flat-Rate Tax eingeführt.' },
    livingCosts: { avgRent3Room: '1\'500–1\'900 CHF', avgRent4Room: '1\'900–2\'500 CHF', comparedToSwissAvg: 'average' },
    demographics: { population: '38\'000', populationGrowth: '+0.6%/Jahr', expatPercent: '15%', avgAge: '43 Jahre' },
    qualityOfLife: { score: 8, highlights: ['Geografisches Zentrum CH', 'Steuerattraktiv', 'Bergnatur', 'Authentisch'] },
    transportLinks: { nearestAirport: 'Flughafen Zürich (70 Min.)', nearestHighway: 'A8', publicTransportScore: 7 },
    legalNotes: ['Flat-Rate-Tax Besonderheiten', 'Meldung bei Zuzug']
  },
  glarus: {
    taxInfo: { taxRate: '20-23%', comparedToSwissAvg: 'average', explanation: 'Glarus bietet solide Rahmenbedingungen mit industrieller Tradition.' },
    livingCosts: { avgRent3Room: '1\'100–1\'500 CHF', avgRent4Room: '1\'500–2\'000 CHF', comparedToSwissAvg: 'lower' },
    demographics: { population: '41\'000', populationGrowth: '+0.4%/Jahr', expatPercent: '23%', avgAge: '43 Jahre' },
    qualityOfLife: { score: 7, highlights: ['Landsgemeinde', 'Bergsport', 'Günstiges Wohnen', 'Tradition'] },
    transportLinks: { nearestAirport: 'Flughafen Zürich (60 Min.)', nearestHighway: 'A3', publicTransportScore: 6 },
    legalNotes: ['Anmeldung bei der Gemeinde', 'Kehrichtgebühren beachten']
  },
  uri: {
    taxInfo: { taxRate: '17-20%', comparedToSwissAvg: 'lower', explanation: 'Uri ist steuerlich attraktiv und profitiert von seiner Transitlage.' },
    livingCosts: { avgRent3Room: '1\'250–1\'600 CHF', avgRent4Room: '1\'600–2\'100 CHF', comparedToSwissAvg: 'lower' },
    demographics: { population: '37\'000', populationGrowth: '+0.5%/Jahr', expatPercent: '13%', avgAge: '44 Jahre' },
    qualityOfLife: { score: 8, highlights: ['Gotthard-Region', 'Wandern/Ski', 'Zentralschweizer Natur', 'Sicherheit'] },
    transportLinks: { nearestAirport: 'Flughafen Zürich (75 Min.)', nearestHighway: 'A2', publicTransportScore: 7 },
    legalNotes: ['Vignettenpflicht Gotthard beachten', 'Meldepflicht']
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
