/**
 * Golden Flow Constants
 */

import { GoldenFlowService } from './types';

export const GOLDEN_FLOW_STORAGE_KEY = 'umzugscheck_golden_flow_data';

export const GOLDEN_FLOW_SERVICES: GoldenFlowService[] = [
  {
    id: 'video-analyse',
    label: '🎥 KI-Video-Analyse',
    description: 'Bis zu 40% sparen durch präzise Volumenerfassung',
    details: 'Unser USP: Statt mühsamer Inventarliste nehmen Sie ein 30-60 Sekunden Video auf. Unsere KI erkennt Möbel, berechnet das exakte Volumen und Sie erhalten präzisere Offerten ohne versteckte "Sicherheitspuffer".',
    benefits: [
      '🎯 Bis zu 40% günstiger durch Präzision',
      '⏱️ Nur 30-60 Sekunden statt Inventarliste',
      '🤖 KI erkennt Möbel & Volumen automatisch',
      '📊 Exakte Offerten ohne Sicherheitszuschläge'
    ],
    priceRange: 'GRATIS',
    priceAdd: 0,
    icon: 'Video',
    popular: true,
    highlight: true,
    bookingPercent: 67,
  },
  {
    id: 'umzug',
    label: 'Umzug (Basis)',
    description: 'Transport aller Möbel & Gegenstände von A nach B',
    details: 'Der Basis-Umzugsservice umfasst den kompletten Transport Ihrer Einrichtung. Unsere erfahrenen Teams schützen Ihre Möbel mit Decken und Gurten.',
    benefits: [
      'Erfahrene 2-3 Mann Teams',
      'Schutzverpackung für empfindliche Möbel',
      'Versicherter Transport bis CHF 50\'000'
    ],
    priceRange: 'Inkl.',
    priceAdd: 0,
    icon: 'Package',
    included: true,
    bookingPercent: 100,
  },
  {
    id: 'einpacken',
    label: 'Einpack-Service',
    description: 'Wir übernehmen das Packen – alles bruchsicher verpackt',
    details: 'Professionelles Einpacken aller Gegenstände. Geschirr, Gläser, Bücher – alles wird fachgerecht verpackt. Sie sparen 1-2 Tage Arbeit!',
    benefits: [
      'Spart 1–2 Tage Arbeit',
      'Bruchsicheres Verpacken durch Profis',
      'Kartonmaterial inklusive'
    ],
    priceRange: '+CHF 300–500',
    priceAdd: 400,
    icon: 'Package',
    popular: true,
    highlight: true,
    bookingPercent: 73,
  },
  {
    id: 'auspacken',
    label: 'Auspack-Service',
    description: 'Sofort einzugsbereit am neuen Ort',
    details: 'Wir packen alle Kartons aus, stellen Dinge an den gewünschten Platz und entsorgen das Verpackungsmaterial.',
    benefits: [
      'Sofort einzugsbereit',
      'Kartonentsorgung inklusive',
      'Stressfreier Start'
    ],
    priceRange: '+CHF 200–400',
    priceAdd: 300,
    icon: 'Sparkles',
    popular: true,
    highlight: true,
    bookingPercent: 52,
  },
  {
    id: 'reinigung',
    label: 'Endreinigung',
    description: 'Professionelle Abgabereinigung mit Garantie',
    details: 'Professionelle Endreinigung nach Schweizer Standard. Inklusive Abnahmegarantie – bei Nichtakzeptanz reinigen wir kostenlos nach!',
    benefits: [
      'Abnahmegarantie inklusive',
      'Alle Räume inkl. Küche & Bad',
      'Fenster innen & aussen'
    ],
    priceRange: '+CHF 250–450',
    priceAdd: 350,
    icon: 'Brush',
    popular: true,
    bookingPercent: 45,
  },
  {
    id: 'entsorgung',
    label: 'Entsorgung',
    description: 'Alte Möbel fachgerecht entsorgen',
    details: 'Fachgerechte Entsorgung von Sperrmüll, alten Möbeln und Elektrogeräten. Umweltfreundlich und gesetzeskonform.',
    benefits: [
      'Umweltgerechte Entsorgung',
      'Keine Selbstfahrt zur Deponie',
      'Elektrogeräte inklusive'
    ],
    priceRange: '+CHF 150–300',
    priceAdd: 200,
    icon: 'Trash2',
    bookingPercent: 28,
  },
  {
    id: 'lagerung',
    label: 'Zwischenlagerung',
    description: 'Sichere, klimatisierte Lagerung',
    details: 'Sichere, klimatisierte Lagerung Ihrer Möbel und Gegenstände. Ideal bei Übergangszeiten oder Renovierungen.',
    benefits: [
      'Klimatisierte Räume',
      '24/7 Videoüberwachung',
      'Flexible Laufzeit'
    ],
    priceRange: '+CHF 100–200/Mt',
    priceAdd: 150,
    icon: 'Warehouse',
    bookingPercent: 12,
  },
];

export const ROOM_OPTIONS = [
  { value: 'studio', label: 'Studio', rooms: 1 },
  { value: '1-1.5', label: '1-1.5 Zimmer', rooms: 1.5 },
  { value: '2-2.5', label: '2-2.5 Zimmer', rooms: 2.5 },
  { value: '3-3.5', label: '3-3.5 Zimmer', rooms: 3.5 },
  { value: '4-4.5', label: '4-4.5 Zimmer', rooms: 4.5 },
  { value: '5+', label: '5+ Zimmer', rooms: 5 },
];

export const FLOOR_OPTIONS = [
  { value: -1, label: 'Untergeschoss' },
  { value: 0, label: 'Erdgeschoss' },
  { value: 1, label: '1. Stock' },
  { value: 2, label: '2. Stock' },
  { value: 3, label: '3. Stock' },
  { value: 4, label: '4. Stock' },
  { value: 5, label: '5+ Stock' },
];

// Base prices by room size
export const BASE_PRICES: Record<string, { min: number; max: number }> = {
  'studio': { min: 480, max: 680 },
  '1-1.5': { min: 580, max: 850 },
  '2-2.5': { min: 780, max: 1200 },
  '3-3.5': { min: 980, max: 1600 },
  '4-4.5': { min: 1400, max: 2200 },
  '5+': { min: 1800, max: 3200 },
};

// Swiss postal codes for autocomplete
export const SWISS_POSTAL_CODES = [
  { code: '8001', city: 'Zürich' },
  { code: '8002', city: 'Zürich' },
  { code: '8003', city: 'Zürich' },
  { code: '8004', city: 'Zürich' },
  { code: '8005', city: 'Zürich' },
  { code: '8006', city: 'Zürich' },
  { code: '8008', city: 'Zürich' },
  { code: '8032', city: 'Zürich' },
  { code: '8037', city: 'Zürich' },
  { code: '8045', city: 'Zürich' },
  { code: '8048', city: 'Zürich' },
  { code: '3000', city: 'Bern' },
  { code: '3011', city: 'Bern' },
  { code: '3012', city: 'Bern' },
  { code: '3013', city: 'Bern' },
  { code: '4000', city: 'Basel' },
  { code: '4001', city: 'Basel' },
  { code: '4051', city: 'Basel' },
  { code: '4052', city: 'Basel' },
  { code: '6000', city: 'Luzern' },
  { code: '6003', city: 'Luzern' },
  { code: '6004', city: 'Luzern' },
  { code: '9000', city: 'St. Gallen' },
  { code: '9001', city: 'St. Gallen' },
  { code: '8400', city: 'Winterthur' },
  { code: '8401', city: 'Winterthur' },
  { code: '5000', city: 'Aarau' },
  { code: '1200', city: 'Genève' },
  { code: '1000', city: 'Lausanne' },
  { code: '6900', city: 'Lugano' },
  { code: '7000', city: 'Chur' },
];
