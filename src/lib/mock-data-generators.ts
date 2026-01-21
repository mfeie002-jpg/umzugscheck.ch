/**
 * Mock Data Generators
 * Generate realistic test data for all system components
 * No external dependencies - pure TypeScript
 */

// ============ RANDOM UTILITIES ============

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// ============ SWISS DATA ============

const SWISS_CITIES = [
  { name: 'Zürich', postal: '8001', canton: 'ZH' },
  { name: 'Genf', postal: '1201', canton: 'GE' },
  { name: 'Basel', postal: '4001', canton: 'BS' },
  { name: 'Bern', postal: '3001', canton: 'BE' },
  { name: 'Lausanne', postal: '1003', canton: 'VD' },
  { name: 'Winterthur', postal: '8400', canton: 'ZH' },
  { name: 'Luzern', postal: '6003', canton: 'LU' },
  { name: 'St. Gallen', postal: '9000', canton: 'SG' },
  { name: 'Lugano', postal: '6900', canton: 'TI' },
  { name: 'Biel', postal: '2502', canton: 'BE' },
  { name: 'Thun', postal: '3600', canton: 'BE' },
  { name: 'Köniz', postal: '3098', canton: 'BE' },
  { name: 'Freiburg', postal: '1700', canton: 'FR' },
  { name: 'Schaffhausen', postal: '8200', canton: 'SH' },
  { name: 'Chur', postal: '7000', canton: 'GR' },
  { name: 'Neuenburg', postal: '2000', canton: 'NE' },
  { name: 'Zug', postal: '6300', canton: 'ZG' },
  { name: 'Aarau', postal: '5000', canton: 'AG' },
  { name: 'Bellinzona', postal: '6500', canton: 'TI' },
  { name: 'Sitten', postal: '1950', canton: 'VS' }
];

const FIRST_NAMES = [
  'Thomas', 'Michael', 'Daniel', 'Andreas', 'Peter', 'Martin', 'Christian', 'Stefan',
  'Anna', 'Maria', 'Sandra', 'Nicole', 'Sarah', 'Laura', 'Julia', 'Lisa',
  'Marc', 'Patrick', 'Simon', 'David', 'Lukas', 'Jonas', 'Fabio', 'Luca',
  'Emma', 'Mia', 'Elena', 'Lena', 'Sophie', 'Lea', 'Nina', 'Jana'
];

const LAST_NAMES = [
  'Müller', 'Meier', 'Schmid', 'Keller', 'Weber', 'Huber', 'Schneider', 'Meyer',
  'Steiner', 'Fischer', 'Gerber', 'Brunner', 'Baumann', 'Frei', 'Zimmermann', 'Moser',
  'Graf', 'Wyss', 'Roth', 'Bühler', 'Studer', 'Koch', 'Berger', 'Sutter'
];

const COMPANY_PREFIXES = ['Blitz', 'Swiss', 'Pro', 'Express', 'Quick', 'First', 'Top', 'Premium', 'City', 'Central'];
const COMPANY_SUFFIXES = ['Umzüge', 'Transport', 'Moving', 'Zügelservice', 'Logistik', 'Transporte'];
const COMPANY_TYPES = ['AG', 'GmbH', 'Sarl'];

const SERVICES = ['Privatumzug', 'Firmenumzug', 'Seniorenumzug', 'Auslandsumzug', 'Möbelmontage', 'Verpackungsservice', 'Endreinigung', 'Entsorgung', 'Lagerung', 'Klaviertransport'];

// ============ GENERATORS ============

export interface MockLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  fromCity: string;
  fromPostal: string;
  toCity: string;
  toPostal: string;
  moveDate: string;
  volume: number;
  rooms: number;
  floor: number;
  hasLift: boolean;
  services: string[];
  estimatedPrice: { min: number; max: number };
  status: 'new' | 'contacted' | 'quoted' | 'booked' | 'completed' | 'cancelled';
  createdAt: string;
  source: string;
  notes?: string;
}

export function generateMockLead(overrides?: Partial<MockLead>): MockLead {
  const fromCity = randomElement(SWISS_CITIES);
  const toCity = randomElement(SWISS_CITIES.filter(c => c.name !== fromCity.name));
  const firstName = randomElement(FIRST_NAMES);
  const lastName = randomElement(LAST_NAMES);
  const volume = randomInt(10, 80);
  const rooms = Math.ceil(volume / 15);
  const basePrice = volume * 45;
  
  const moveDate = randomDate(new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
  const createdAt = randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
  
  return {
    id: `lead-${Date.now()}-${randomInt(1000, 9999)}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomElement(['gmail.com', 'bluewin.ch', 'outlook.com', 'gmx.ch'])}`,
    phone: `+41 ${randomInt(76, 79)} ${randomInt(100, 999)} ${randomInt(10, 99)} ${randomInt(10, 99)}`,
    fromCity: fromCity.name,
    fromPostal: fromCity.postal,
    toCity: toCity.name,
    toPostal: toCity.postal,
    moveDate: formatDate(moveDate),
    volume,
    rooms,
    floor: randomInt(0, 5),
    hasLift: Math.random() > 0.4,
    services: randomElements(SERVICES, randomInt(1, 4)),
    estimatedPrice: {
      min: Math.round(basePrice * 0.85),
      max: Math.round(basePrice * 1.25)
    },
    status: randomElement(['new', 'contacted', 'quoted', 'booked', 'completed', 'cancelled']),
    createdAt: createdAt.toISOString(),
    source: randomElement(['google', 'direct', 'referral', 'facebook', 'instagram', 'partner']),
    ...overrides
  };
}

export function generateMockLeads(count: number): MockLead[] {
  return Array.from({ length: count }, () => generateMockLead());
}

export interface MockProvider {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  canton: string;
  services: string[];
  rating: number;
  reviewCount: number;
  priceLevel: 'budget' | 'standard' | 'premium';
  verified: boolean;
  featured: boolean;
  responseTimeHours: number;
  acceptanceRate: number;
  completionRate: number;
  yearsInBusiness: number;
  employees: number;
  vehicles: number;
  certifications: string[];
  createdAt: string;
}

export function generateMockProvider(overrides?: Partial<MockProvider>): MockProvider {
  const city = randomElement(SWISS_CITIES);
  const companyName = `${randomElement(COMPANY_PREFIXES)} ${randomElement(COMPANY_SUFFIXES)} ${randomElement(COMPANY_TYPES)}`;
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  
  return {
    id: `provider-${Date.now()}-${randomInt(1000, 9999)}`,
    name: companyName,
    slug,
    email: `info@${slug.replace(/-/g, '')}.ch`,
    phone: `+41 ${randomInt(41, 62)} ${randomInt(100, 999)} ${randomInt(10, 99)} ${randomInt(10, 99)}`,
    address: `${randomElement(['Bahnhofstrasse', 'Hauptstrasse', 'Industriestrasse', 'Gewerbestrasse'])} ${randomInt(1, 200)}`,
    city: city.name,
    canton: city.canton,
    services: randomElements(SERVICES, randomInt(3, 8)),
    rating: randomFloat(3.5, 5.0, 1),
    reviewCount: randomInt(5, 500),
    priceLevel: randomElement(['budget', 'standard', 'premium']),
    verified: Math.random() > 0.2,
    featured: Math.random() > 0.8,
    responseTimeHours: randomFloat(0.5, 24, 1),
    acceptanceRate: randomFloat(50, 95, 0),
    completionRate: randomFloat(85, 100, 0),
    yearsInBusiness: randomInt(1, 30),
    employees: randomInt(2, 50),
    vehicles: randomInt(1, 15),
    certifications: randomElements(['ISO 9001', 'FIDI', 'IAM', 'Umzugsverband Schweiz', 'TÜV'], randomInt(0, 3)),
    createdAt: formatDate(randomDate(new Date(2020, 0, 1), new Date())),
    ...overrides
  };
}

export function generateMockProviders(count: number): MockProvider[] {
  return Array.from({ length: count }, () => generateMockProvider());
}

export interface MockReview {
  id: string;
  providerId: string;
  authorName: string;
  rating: number;
  title: string;
  content: string;
  fromCity: string;
  toCity: string;
  moveDate: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
}

const REVIEW_TITLES_POSITIVE = [
  'Perfekter Umzug!',
  'Sehr zufrieden',
  'Top Service',
  'Empfehlenswert!',
  'Professionell und pünktlich',
  'Alles bestens',
  'Super Team',
  'Preis-Leistung stimmt'
];

const REVIEW_TITLES_NEGATIVE = [
  'Leider enttäuscht',
  'Verbesserungspotenzial',
  'Nicht wie erwartet',
  'Gemischte Gefühle'
];

const REVIEW_CONTENT_POSITIVE = [
  'Das Team war pünktlich, freundlich und hat sehr sorgfältig gearbeitet. Alle Möbel sind unbeschadet angekommen. Sehr empfehlenswert!',
  'Von der Offerte bis zum Umzugstag alles reibungslos. Die Kommunikation war exzellent und der Preis fair.',
  'Trotz enger Platzverhältnisse haben die Mitarbeiter alles professionell gemeistert. Würde ich jederzeit wieder buchen.',
  'Schneller als erwartet und trotzdem sorgfältig. Das Team hat sogar beim Auspacken geholfen. Top!',
  'Super nettes und kompetentes Team. Der Umzug war in wenigen Stunden erledigt. Preis-Leistung stimmt absolut.'
];

const REVIEW_CONTENT_NEGATIVE = [
  'Leider kam das Team 2 Stunden zu spät. Die Arbeit selbst war aber okay.',
  'Ein paar kleine Kratzer an den Möbeln, aber sonst in Ordnung.',
  'Die Kommunikation hätte besser sein können. Sonst war der Umzug aber okay.'
];

export function generateMockReview(providerId: string, overrides?: Partial<MockReview>): MockReview {
  const rating = randomFloat(1, 5, 0);
  const isPositive = rating >= 4;
  const fromCity = randomElement(SWISS_CITIES);
  const toCity = randomElement(SWISS_CITIES);
  const firstName = randomElement(FIRST_NAMES);
  const lastName = randomElement(LAST_NAMES);
  
  return {
    id: `review-${Date.now()}-${randomInt(1000, 9999)}`,
    providerId,
    authorName: `${firstName} ${lastName.charAt(0)}.`,
    rating,
    title: isPositive ? randomElement(REVIEW_TITLES_POSITIVE) : randomElement(REVIEW_TITLES_NEGATIVE),
    content: isPositive ? randomElement(REVIEW_CONTENT_POSITIVE) : randomElement(REVIEW_CONTENT_NEGATIVE),
    fromCity: fromCity.name,
    toCity: toCity.name,
    moveDate: formatDate(randomDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), new Date())),
    verified: Math.random() > 0.3,
    helpful: randomInt(0, 50),
    createdAt: randomDate(new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), new Date()).toISOString(),
    ...overrides
  };
}

export interface MockAnalytics {
  date: string;
  visitors: number;
  pageViews: number;
  leads: number;
  conversions: number;
  conversionRate: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: { path: string; views: number }[];
  topSources: { source: string; visitors: number }[];
  topCities: { city: string; leads: number }[];
  revenue: number;
}

export function generateMockAnalytics(date: Date): MockAnalytics {
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const seasonalFactor = [0.7, 0.8, 1.1, 1.3, 1.2, 1.0, 0.8, 0.9, 1.2, 1.1, 0.9, 0.8][date.getMonth()];
  const baseVisitors = isWeekend ? randomInt(200, 400) : randomInt(400, 800);
  const visitors = Math.round(baseVisitors * seasonalFactor);
  const leads = Math.round(visitors * randomFloat(0.03, 0.07));
  const conversions = Math.round(leads * randomFloat(0.10, 0.25));
  
  return {
    date: formatDate(date),
    visitors,
    pageViews: Math.round(visitors * randomFloat(2.5, 4.5)),
    leads,
    conversions,
    conversionRate: parseFloat(((conversions / leads) * 100).toFixed(1)) || 0,
    avgSessionDuration: randomInt(90, 300),
    bounceRate: randomFloat(35, 55),
    topPages: [
      { path: '/', views: Math.round(visitors * 0.4) },
      { path: '/umzugsrechner', views: Math.round(visitors * 0.25) },
      { path: '/umzugsfirmen', views: Math.round(visitors * 0.15) },
      { path: '/preise', views: Math.round(visitors * 0.1) },
      { path: '/ratgeber', views: Math.round(visitors * 0.05) }
    ],
    topSources: [
      { source: 'google', visitors: Math.round(visitors * 0.55) },
      { source: 'direct', visitors: Math.round(visitors * 0.20) },
      { source: 'referral', visitors: Math.round(visitors * 0.10) },
      { source: 'social', visitors: Math.round(visitors * 0.08) },
      { source: 'email', visitors: Math.round(visitors * 0.07) }
    ],
    topCities: SWISS_CITIES.slice(0, 5).map(city => ({
      city: city.name,
      leads: randomInt(1, Math.max(2, Math.round(leads * 0.3)))
    })),
    revenue: conversions * randomInt(35, 65)
  };
}

export function generateMockAnalyticsRange(startDate: Date, endDate: Date): MockAnalytics[] {
  const analytics: MockAnalytics[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    analytics.push(generateMockAnalytics(current));
    current.setDate(current.getDate() + 1);
  }
  
  return analytics;
}

export interface MockFunnelStep {
  step: number;
  name: string;
  visitors: number;
  dropOff: number;
  dropOffRate: number;
  avgTimeSpent: number;
}

export function generateMockFunnelData(totalVisitors: number): MockFunnelStep[] {
  const steps = [
    'Landing Page',
    'Rechner Start',
    'Von-Adresse',
    'Nach-Adresse',
    'Datum & Details',
    'Inventar',
    'Services',
    'Kontaktdaten',
    'Zusammenfassung',
    'Absenden'
  ];
  
  let remaining = totalVisitors;
  const funnel: MockFunnelStep[] = [];
  
  steps.forEach((name, index) => {
    const dropOffRate = index === 0 ? randomFloat(40, 55) : randomFloat(5, 25);
    const dropOff = Math.round(remaining * (dropOffRate / 100));
    
    funnel.push({
      step: index + 1,
      name,
      visitors: remaining,
      dropOff,
      dropOffRate,
      avgTimeSpent: randomInt(10, index < 5 ? 30 : 60)
    });
    
    remaining = remaining - dropOff;
  });
  
  return funnel;
}

// ============ SUMMARY GENERATORS ============

export function generateDashboardSummary() {
  const today = new Date();
  const leads = generateMockLeads(50);
  const providers = generateMockProviders(20);
  const analytics = generateMockAnalyticsRange(
    new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
    today
  );
  
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const bookedLeads = leads.filter(l => l.status === 'booked').length;
  const totalRevenue = analytics.reduce((sum, a) => sum + a.revenue, 0);
  const totalVisitors = analytics.reduce((sum, a) => sum + a.visitors, 0);
  const avgConversionRate = analytics.reduce((sum, a) => sum + a.conversionRate, 0) / analytics.length;
  
  return {
    summary: {
      totalLeads,
      newLeads,
      bookedLeads,
      conversionRate: avgConversionRate.toFixed(1),
      totalRevenue,
      totalVisitors,
      activeProviders: providers.filter(p => p.verified).length,
      avgRating: (providers.reduce((sum, p) => sum + p.rating, 0) / providers.length).toFixed(1)
    },
    leads: leads.slice(0, 10),
    providers: providers.slice(0, 10),
    analytics: analytics.slice(-7),
    funnel: generateMockFunnelData(totalVisitors)
  };
}

export { SWISS_CITIES, FIRST_NAMES, LAST_NAMES, SERVICES };
