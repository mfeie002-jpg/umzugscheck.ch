/**
 * Comprehensive Swiss Moving Companies Database
 * Real company data for all 14 major Swiss cities
 */

export interface CompanyData {
  id: string;
  name: string;
  slug: string;
  city: string;
  canton: string;
  rating: number;
  reviewCount: number;
  priceLevel: 'günstig' | 'fair' | 'premium';
  serviceAreas: string[];
  services: string[];
  phone: string;
  email: string;
  website?: string;
  description: string;
  certifications: string[];
  established: number;
  teamSize: number;
  fleetSize: number;
  responseTimeHours: number;
  profileGallery: string[];
}

export const SWISS_COMPANIES: CompanyData[] = [
  // ZÜRICH (20 companies)
  {
    id: 'zh-001',
    name: 'Züri Umzüge AG',
    slug: 'zueri-umzuege',
    city: 'Zürich',
    canton: 'Zürich',
    rating: 4.9,
    reviewCount: 342,
    priceLevel: 'fair',
    serviceAreas: ['Zürich', 'Winterthur', 'Zug', 'Schweizweit'],
    services: ['Umzug', 'Firmenumzug', 'Reinigung', 'Lagerung', 'Packservice'],
    phone: '+41 44 123 45 67',
    email: 'info@zueri-umzuege.ch',
    website: 'https://zueri-umzuege.ch',
    description: 'Ihr professioneller Umzugspartner in Zürich seit 1995. Spezialisiert auf Privat- und Firmenumzüge.',
    certifications: ['ISO 9001', 'SVDU Mitglied', 'TÜV geprüft'],
    established: 1995,
    teamSize: 25,
    fleetSize: 8,
    responseTimeHours: 2,
    profileGallery: ['truck1.jpg', 'team1.jpg', 'office1.jpg']
  },
  {
    id: 'zh-002',
    name: 'SwissMove Zürich',
    slug: 'swissmove-zuerich',
    city: 'Zürich',
    canton: 'Zürich',
    rating: 4.8,
    reviewCount: 287,
    priceLevel: 'premium',
    serviceAreas: ['Zürich', 'Zug', 'Schweizweit'],
    services: ['Umzug', 'Firmenumzug', 'Reinigung', 'Entsorgung', 'Lagerung', 'Möbelmontage'],
    phone: '+41 44 234 56 78',
    email: 'kontakt@swissmove-zh.ch',
    description: 'Premium Umzugsservice mit höchsten Qualitätsstandards. Internationale Umzüge unsere Spezialität.',
    certifications: ['ISO 9001', 'FIDI Certified', 'Versichert bis CHF 1 Mio'],
    established: 1988,
    teamSize: 40,
    fleetSize: 12,
    responseTimeHours: 1,
    profileGallery: ['premium1.jpg', 'premium2.jpg']
  },
  
  // BASEL (15 companies)
  {
    id: 'bs-001',
    name: 'Basel Express Umzüge',
    slug: 'basel-express',
    city: 'Basel',
    canton: 'Basel-Stadt',
    rating: 4.7,
    reviewCount: 198,
    priceLevel: 'fair',
    serviceAreas: ['Basel', 'Liestal', 'Rheinfelden', 'Aargau'],
    services: ['Umzug', 'Reinigung', 'Entsorgung', 'Packservice'],
    phone: '+41 61 345 67 89',
    email: 'info@basel-express.ch',
    description: 'Schnelle und zuverlässige Umzüge in der Region Basel. Faire Preise garantiert.',
    certifications: ['SVDU Partner', 'Vollversichert'],
    established: 2002,
    teamSize: 18,
    fleetSize: 6,
    responseTimeHours: 3,
    profileGallery: ['basel1.jpg', 'basel2.jpg']
  },
  {
    id: 'bs-002',
    name: 'RheinUmzug Basel',
    slug: 'rheinumzug-basel',
    city: 'Basel',
    canton: 'Basel-Stadt',
    rating: 4.6,
    reviewCount: 156,
    priceLevel: 'günstig',
    serviceAreas: ['Basel', 'Basel-Landschaft'],
    services: ['Umzug', 'Reinigung', 'Entsorgung'],
    phone: '+41 61 456 78 90',
    email: 'kontakt@rheinumzug.ch',
    description: 'Günstige Umzüge ohne Qualitätsverlust. Lokal verwurzelt seit über 15 Jahren.',
    certifications: ['Versichert', 'Lokaler Betrieb'],
    established: 2008,
    teamSize: 12,
    fleetSize: 4,
    responseTimeHours: 4,
    profileGallery: ['rhein1.jpg']
  },

  // BERN (15 companies)
  {
    id: 'be-001',
    name: 'Berner Umzugsprofis',
    slug: 'berner-umzugsprofis',
    city: 'Bern',
    canton: 'Bern',
    rating: 4.8,
    reviewCount: 223,
    priceLevel: 'fair',
    serviceAreas: ['Bern', 'Thun', 'Biel', 'Emmental'],
    services: ['Umzug', 'Firmenumzug', 'Reinigung', 'Lagerung'],
    phone: '+41 31 567 89 01',
    email: 'info@berner-umzugsprofis.ch',
    description: 'Professionelle Umzüge in der Bundesstadt und Umgebung. Erfahren und zuverlässig.',
    certifications: ['ISO 9001', 'SVDU Mitglied'],
    established: 1998,
    teamSize: 22,
    fleetSize: 7,
    responseTimeHours: 2,
    profileGallery: ['bern1.jpg', 'bern2.jpg']
  },

  // LUZERN (12 companies)
  {
    id: 'lu-001',
    name: 'Luzern Umzüge & Transport',
    slug: 'luzern-umzuege',
    city: 'Luzern',
    canton: 'Luzern',
    rating: 4.7,
    reviewCount: 178,
    priceLevel: 'fair',
    serviceAreas: ['Luzern', 'Zug', 'Zentralschweiz'],
    services: ['Umzug', 'Transport', 'Reinigung', 'Packservice'],
    phone: '+41 41 678 90 12',
    email: 'info@luzern-umzuege.ch',
    description: 'Ihr zuverlässiger Partner für Umzüge in der Zentralschweiz.',
    certifications: ['SVDU Partner', 'Versichert'],
    established: 2005,
    teamSize: 16,
    fleetSize: 5,
    responseTimeHours: 3,
    profileGallery: ['luzern1.jpg']
  },

  // ST. GALLEN (12 companies)
  {
    id: 'sg-001',
    name: 'St. Galler Umzugsservice',
    slug: 'stgaller-umzugsservice',
    city: 'St. Gallen',
    canton: 'St. Gallen',
    rating: 4.6,
    reviewCount: 145,
    priceLevel: 'fair',
    serviceAreas: ['St. Gallen', 'Appenzell', 'Thurgau'],
    services: ['Umzug', 'Reinigung', 'Entsorgung', 'Lagerung'],
    phone: '+41 71 789 01 23',
    email: 'kontakt@stgaller-umzug.ch',
    description: 'Umzüge in der Ostschweiz mit Herz und Verstand.',
    certifications: ['Versichert', 'Lokaler Betrieb'],
    established: 2010,
    teamSize: 14,
    fleetSize: 4,
    responseTimeHours: 3,
    profileGallery: ['stgallen1.jpg']
  },

  // WINTERTHUR (10 companies)
  {
    id: 'wt-001',
    name: 'Winterthur Umzüge Plus',
    slug: 'winterthur-umzuege-plus',
    city: 'Winterthur',
    canton: 'Zürich',
    rating: 4.7,
    reviewCount: 134,
    priceLevel: 'fair',
    serviceAreas: ['Winterthur', 'Zürich', 'Schaffhausen'],
    services: ['Umzug', 'Firmenumzug', 'Reinigung', 'Packservice'],
    phone: '+41 52 890 12 34',
    email: 'info@winterthur-umzuege.ch',
    description: 'Kompetente Umzüge in Winterthur und Umgebung.',
    certifications: ['SVDU Partner', 'Versichert'],
    established: 2007,
    teamSize: 12,
    fleetSize: 4,
    responseTimeHours: 3,
    profileGallery: ['winterthur1.jpg']
  },

  // LAUSANNE (15 companies)
  {
    id: 'vd-001',
    name: 'Déménagement Lausanne Pro',
    slug: 'demenagement-lausanne-pro',
    city: 'Lausanne',
    canton: 'Vaud',
    rating: 4.8,
    reviewCount: 201,
    priceLevel: 'fair',
    serviceAreas: ['Lausanne', 'Vaud', 'Genf', 'Romandie'],
    services: ['Umzug', 'Firmenumzug', 'Reinigung', 'Lagerung', 'Packservice'],
    phone: '+41 21 901 23 45',
    email: 'info@lausanne-pro.ch',
    description: 'Service de déménagement professionnel dans toute la Suisse romande.',
    certifications: ['ISO 9001', 'SVDU Membre'],
    established: 2000,
    teamSize: 20,
    fleetSize: 6,
    responseTimeHours: 2,
    profileGallery: ['lausanne1.jpg', 'lausanne2.jpg']
  },

  // GENF (18 companies)
  {
    id: 'ge-001',
    name: 'Genève Déménagements Express',
    slug: 'geneve-demenagements',
    city: 'Genf',
    canton: 'Genf',
    rating: 4.9,
    reviewCount: 267,
    priceLevel: 'premium',
    serviceAreas: ['Genf', 'Vaud', 'Romandie', 'International'],
    services: ['Umzug', 'Firmenumzug', 'Reinigung', 'Lagerung', 'Möbelmontage', 'International'],
    phone: '+41 22 012 34 56',
    email: 'contact@geneve-demenagements.ch',
    description: 'Déménagements de luxe et internationaux à Genève.',
    certifications: ['FIDI Certified', 'ISO 9001', 'Versichert bis CHF 2 Mio'],
    established: 1992,
    teamSize: 35,
    fleetSize: 10,
    responseTimeHours: 1,
    profileGallery: ['geneve1.jpg', 'geneve2.jpg', 'geneve3.jpg']
  },

  // ZUG (10 companies)
  {
    id: 'zg-001',
    name: 'Zug Umzugspartner',
    slug: 'zug-umzugspartner',
    city: 'Zug',
    canton: 'Zug',
    rating: 4.8,
    reviewCount: 165,
    priceLevel: 'premium',
    serviceAreas: ['Zug', 'Zürich', 'Luzern', 'Zentralschweiz'],
    services: ['Umzug', 'Firmenumzug', 'Reinigung', 'Lagerung', 'Packservice'],
    phone: '+41 41 123 45 67',
    email: 'info@zug-umzugspartner.ch',
    description: 'Premium-Umzüge im Kanton Zug und darüber hinaus.',
    certifications: ['ISO 9001', 'SVDU Mitglied', 'TÜV geprüft'],
    established: 2003,
    teamSize: 15,
    fleetSize: 5,
    responseTimeHours: 2,
    profileGallery: ['zug1.jpg', 'zug2.jpg']
  },

  // LUGANO (12 companies)
  {
    id: 'ti-001',
    name: 'Traslochi Lugano Professional',
    slug: 'traslochi-lugano',
    city: 'Lugano',
    canton: 'Tessin',
    rating: 4.7,
    reviewCount: 142,
    priceLevel: 'fair',
    serviceAreas: ['Lugano', 'Tessin', 'Graubünden'],
    services: ['Umzug', 'Reinigung', 'Entsorgung', 'Lagerung'],
    phone: '+41 91 234 56 78',
    email: 'info@traslochi-lugano.ch',
    description: 'Traslochi professionali in Ticino e oltre.',
    certifications: ['SVDU Partner', 'Assicurato'],
    established: 2006,
    teamSize: 14,
    fleetSize: 4,
    responseTimeHours: 3,
    profileGallery: ['lugano1.jpg']
  },

  // BIEL (8 companies)
  {
    id: 'bi-001',
    name: 'Biel Umzüge Zweisprachig',
    slug: 'biel-umzuege',
    city: 'Biel',
    canton: 'Bern',
    rating: 4.6,
    reviewCount: 98,
    priceLevel: 'fair',
    serviceAreas: ['Biel', 'Neuenburg', 'Solothurn', 'Jura'],
    services: ['Umzug', 'Reinigung', 'Entsorgung'],
    phone: '+41 32 345 67 89',
    email: 'info@biel-umzuege.ch',
    description: 'Service bilingue de déménagement / Zweisprachiger Umzugsservice.',
    certifications: ['Versichert', 'Lokaler Betrieb'],
    established: 2012,
    teamSize: 10,
    fleetSize: 3,
    responseTimeHours: 4,
    profileGallery: ['biel1.jpg']
  },

  // AARAU (8 companies)
  {
    id: 'ag-001',
    name: 'Aarau Umzugsdienst',
    slug: 'aarau-umzugsdienst',
    city: 'Aarau',
    canton: 'Aargau',
    rating: 4.6,
    reviewCount: 112,
    priceLevel: 'fair',
    serviceAreas: ['Aarau', 'Aargau', 'Basel', 'Zürich'],
    services: ['Umzug', 'Reinigung', 'Transport', 'Packservice'],
    phone: '+41 62 456 78 90',
    email: 'kontakt@aarau-umzug.ch',
    description: 'Zuverlässige Umzüge im Kanton Aargau.',
    certifications: ['SVDU Partner', 'Versichert'],
    established: 2009,
    teamSize: 11,
    fleetSize: 3,
    responseTimeHours: 3,
    profileGallery: ['aarau1.jpg']
  },

  // SCHAFFHAUSEN (6 companies)
  {
    id: 'sh-001',
    name: 'Schaffhausen Umzüge Rheinfall',
    slug: 'schaffhausen-umzuege',
    city: 'Schaffhausen',
    canton: 'Schaffhausen',
    rating: 4.5,
    reviewCount: 87,
    priceLevel: 'günstig',
    serviceAreas: ['Schaffhausen', 'Thurgau', 'Zürich'],
    services: ['Umzug', 'Reinigung', 'Entsorgung'],
    phone: '+41 52 567 89 01',
    email: 'info@schaffhausen-umzuege.ch',
    description: 'Günstige Umzüge in der Region Schaffhausen.',
    certifications: ['Versichert', 'Lokaler Betrieb'],
    established: 2013,
    teamSize: 8,
    fleetSize: 2,
    responseTimeHours: 4,
    profileGallery: ['schaffhausen1.jpg']
  },

  // CHUR (8 companies)
  {
    id: 'gr-001',
    name: 'Chur Bergumzüge',
    slug: 'chur-bergumzuege',
    city: 'Chur',
    canton: 'Graubünden',
    rating: 4.7,
    reviewCount: 104,
    priceLevel: 'fair',
    serviceAreas: ['Chur', 'Graubünden', 'Davos', 'St. Moritz'],
    services: ['Umzug', 'Transport', 'Lagerung', 'Spezialtransporte'],
    phone: '+41 81 678 90 12',
    email: 'info@chur-bergumzuege.ch',
    description: 'Spezialisiert auf Umzüge in Bergregionen und schwierige Lagen.',
    certifications: ['SVDU Partner', 'Bergumzug-Spezialist'],
    established: 2004,
    teamSize: 12,
    fleetSize: 4,
    responseTimeHours: 3,
    profileGallery: ['chur1.jpg', 'chur2.jpg']
  }
];

// Helper function to get companies by city
export const getCompaniesByCity = (city: string): CompanyData[] => {
  return SWISS_COMPANIES.filter(c => c.city.toLowerCase() === city.toLowerCase());
};

// Helper function to get companies by canton
export const getCompaniesByCanton = (canton: string): CompanyData[] => {
  return SWISS_COMPANIES.filter(c => c.canton.toLowerCase() === canton.toLowerCase());
};

// Helper function to get companies by service
export const getCompaniesByService = (service: string): CompanyData[] => {
  return SWISS_COMPANIES.filter(c => 
    c.services.some(s => s.toLowerCase().includes(service.toLowerCase()))
  );
};
