import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AirbnbCompanyCard } from '@/components/home/AirbnbCompanyCard';
import { MiniCalculator } from '@/components/home/MiniCalculator';
import { USPCard } from '@/components/home/USPCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { CheckCircle, MapPin, Clock, Shield, Star, Zap, ArrowRight, Building2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet';
import { CITIES_MAP, getCity } from '@/data/locations';
import { getRegionImage } from '@/data/region-images';

// SEO helpers
import { generateFAQSchema, generateHowToSchema } from '@/lib/seo-enhanced';

// NEW: SEO Components (same as RegionArchetypPage)
import { RegionBreadcrumb } from '@/components/region-archetyp/RegionBreadcrumb';
import { RegionAnchorNav } from '@/components/region-archetyp/RegionAnchorNav';
import { RegionTrustBox } from '@/components/region-archetyp/RegionTrustBox';
import { RegionWhySave } from '@/components/region-archetyp/RegionWhySave';
import { RegionGlossar } from '@/components/region-archetyp/RegionGlossar';
import { RegionContentCluster } from '@/components/region-archetyp/RegionContentCluster';
import { RegionMidCTA } from '@/components/region-archetyp/RegionMidCTA';

// City-specific unique content
import { ZugCityContent } from '@/components/city/ZugCityContent';
import { ZurichCityContent } from '@/components/city/ZurichCityContent';

// Unified Hero Component (matches homepage style)
import { UnifiedHero } from '@/components/shared/UnifiedHero';

interface CityData {
  name: string;
  displayName: string;
  heroTitle: string;
  heroSubtitle: string;
  liveSignal: string;
  liveCount: number;
  backgroundImage: string;
  advantages: Array<{ title: string; description: string; icon: any }>;
  districts: string[];
  priceExamples: Array<{ route: string; price: string }>;
  faq: Array<{ question: string; answer: string }>;
}

const cityDatabase: Record<string, CityData> = {
  zuerich: {
    name: 'zuerich',
    displayName: 'Zürich',
    heroTitle: 'Umzugsfirmen in Zürich vergleichen',
    heroSubtitle: 'Gratis Offerten von geprüften lokalen Umzugsprofis – für alle 12 Stadtkreise.',
    liveSignal: '18 Personen aus Zürich vergleichen gerade Umzüge',
    liveCount: 18,
    backgroundImage: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1920&q=80',
    advantages: [
      { title: 'Alle 12 Stadtkreise abgedeckt', description: 'Von Altstadt bis Seefeld, Oerlikon bis Altstetten', icon: MapPin },
      { title: 'Halteverbot inklusive', description: 'Partnerfirmen organisieren Parkbewilligungen', icon: Clock },
      { title: 'Möbellift für Altbauten', description: 'Für enge Treppenhäuser in Zürich unerlässlich', icon: Shield }
    ],
    districts: ['Kreis 1 Altstadt', 'Kreis 4 Langstrasse', 'Kreis 6 Oerlikon', 'Kreis 8 Seefeld', 'Kreis 9 Altstetten', 'Kreis 11 Affoltern'],
    priceExamples: [
      { route: '2 Zimmer Kreis 4 → Kreis 6', price: 'CHF 690-1100' },
      { route: '3.5 Zimmer Seefeld → Oerlikon', price: 'CHF 950-1500' },
      { route: '4.5 Zimmer Wiedikon → Altstetten', price: 'CHF 1200-1800' }
    ],
    faq: [
      { question: 'Was kostet ein Umzug in der Stadt Zürich?', answer: 'Die Kosten hängen von Wohnungsgrösse, Etage und Stadtkreis ab. Ein 2-Zimmer-Umzug innerhalb Zürich kostet durchschnittlich CHF 690-1100, ein 4-Zimmer-Umzug CHF 1200-1800. Mit dem Vergleich sparen Sie bis zu 40%.' },
      { question: 'Brauche ich in Zürich eine Halteverbotszone?', answer: 'Ja, in fast allen Zürcher Quartieren ist eine Parkbewilligung nötig – besonders in den Kreisen 1-6. Die Kosten liegen bei CHF 80-150. Unsere Partnerfirmen übernehmen die Organisation.' },
      { question: 'Wie funktioniert ein Umzug in der Zürcher Altstadt (Kreis 1)?', answer: 'Die Altstadt hat enge Gassen und Fussgängerzonen ohne Einfahrt. Unsere Partner nutzen Spezialfahrzeuge, Möbellifte und organisieren Zeitfenster mit der Stadt für das Be- und Entladen.' },
      { question: 'Wann sollte ich in Zürich einen Umzug buchen?', answer: 'Mindestens 4-8 Wochen im Voraus. Zürich ist sehr gefragt – bei Monatsende-Terminen oder in der Hauptsaison (April-September) empfehlen wir 8-12 Wochen Vorlauf.' },
      { question: 'Bieten Zürcher Umzugsfirmen auch Komplettpaket mit Reinigung?', answer: 'Ja, viele unserer Partner bieten Umzug + Endreinigung + Wohnungsabgabe aus einer Hand. Gerade in Zürich sind Vermieter anspruchsvoll – ein Komplettpaket spart Zeit und Nerven.' },
      { question: 'Führt Umzugscheck.ch selbst Umzüge durch?', answer: 'Nein, Umzugscheck.ch ist ein reiner Vergleichs- und Vermittlungsservice. Der Umzug wird durch unsere geprüften, versicherten Partnerfirmen durchgeführt.' }
    ]
  },
  bern: {
    name: 'bern',
    displayName: 'Bern',
    heroTitle: 'Die besten Umzugsfirmen in Bern im Vergleich',
    heroSubtitle: 'Kostenlose Offerten von geprüften Berner Umzugsprofis.',
    liveSignal: '11 Personen aus Bern vergleichen gerade Umzüge',
    liveCount: 11,
    backgroundImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80',
    advantages: [
      { title: 'Regionale Preise', description: 'Faire Konditionen für Stadt und Umgebung', icon: MapPin },
      { title: 'Altstadt-Erfahrung', description: 'Expertise für enge Gassen und historische Gebäude', icon: Shield },
      { title: 'Teams für Höhenlagen', description: 'Erfahrung mit Engestrassen und steilen Zufahrten', icon: Zap }
    ],
    districts: ['Breitenrain', 'Länggasse', 'Bümpliz'],
    priceExamples: [
      { route: '3 Zimmer Bern → Ostermundigen', price: 'CHF 890–1490' }
    ],
    faq: [
      { question: 'Was kostet ein Umzug in Bern?', answer: 'Ein 3-Zimmer-Umzug in Bern kostet durchschnittlich CHF 890–1490.' },
      { question: 'Wie funktioniert ein Umzug in der Berner Altstadt?', answer: 'Unsere Partner haben Erfahrung mit engen Gassen und organisieren bei Bedarf Parkbewilligungen.' },
      { question: 'Wie weit im Voraus sollte ich buchen?', answer: 'Mindestens 2–3 Wochen vor dem Umzugstermin. In der Hauptsaison besser 4–6 Wochen.' }
    ]
  },
  basel: {
    name: 'basel',
    displayName: 'Basel',
    heroTitle: 'Die besten Umzugsfirmen in Basel im Vergleich',
    heroSubtitle: 'Kostenlose Offerten von geprüften Basler Profis.',
    liveSignal: '9 Personen aus Basel vergleichen gerade Umzüge',
    liveCount: 9,
    backgroundImage: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=1920&q=80',
    advantages: [
      { title: 'Innenstadt-Expertise', description: 'Erfahrung mit Grossbasel und Kleinbasel', icon: MapPin },
      { title: 'Grenzregion-Kompetenz', description: 'Umzüge ins deutsche und französische Umland', icon: Zap },
      { title: 'Verkehrsberuhigte Zonen', description: 'Professionelles Handling in Fussgängerzonen', icon: Shield }
    ],
    districts: ['Gundeli', 'Kleinbasel', 'Riehen'],
    priceExamples: [
      { route: '2 Zimmer Basel → Binningen', price: 'CHF 650–1050' }
    ],
    faq: [
      { question: 'Was kostet ein Umzug in Basel?', answer: 'Ein 2-Zimmer-Umzug kostet in Basel durchschnittlich CHF 650–1050.' },
      { question: 'Können Umzugsfirmen auch ins deutsche Umland umziehen?', answer: 'Ja, viele Basler Umzugsfirmen haben Erfahrung mit grenzüberschreitenden Umzügen.' }
    ]
  },
  genf: {
    name: 'genf',
    displayName: 'Genf',
    heroTitle: 'Die besten Umzugsfirmen in Genf im Vergleich',
    heroSubtitle: 'Kostenlose Offerten von geprüften Genfer Umzugsfirmen.',
    liveSignal: '12 Personen aus Genf vergleichen gerade Umzüge',
    liveCount: 12,
    backgroundImage: 'https://images.unsplash.com/photo-1559564484-e48bf5f64a75?w=1920&q=80',
    advantages: [
      { title: 'Altstadt-Erfahrung', description: 'Expertise für historische Genfer Quartiere', icon: Shield },
      { title: 'Parkierungsbewilligungen', description: 'Organisation von Halteverbotszonen', icon: Clock },
      { title: 'Regionale Preisstrukturen', description: 'Transparente Kalkulation für Genf und Umgebung', icon: MapPin }
    ],
    districts: ['Eaux-Vives', 'Carouge', 'Pâquis'],
    priceExamples: [
      { route: '3 Zimmer Genf → Meyrin', price: 'CHF 950–1600' }
    ],
    faq: [
      { question: 'Was kostet ein Umzug in Genf?', answer: 'Ein 3-Zimmer-Umzug kostet in Genf durchschnittlich CHF 950–1600.' },
      { question: 'Brauche ich eine Parkbewilligung in Genf?', answer: 'Ja, für die meisten Quartiere wird eine Halteverbotszone empfohlen. Unsere Partner organisieren dies für Sie.' }
    ]
  },
  lausanne: {
    name: 'lausanne',
    displayName: 'Lausanne',
    heroTitle: 'Die besten Umzugsfirmen in Lausanne im Vergleich',
    heroSubtitle: 'Erhalte kostenlose Offerten von geprüften Umzugsteams aus Lausanne.',
    liveSignal: '8 Personen aus Lausanne vergleichen gerade Umzüge',
    liveCount: 8,
    backgroundImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80',
    advantages: [
      { title: 'Erfahrung in steilen Quartieren', description: 'Spezialisiert auf Hanglage und steile Zufahrten', icon: Zap },
      { title: 'Regionale Preise Vaud', description: 'Faire Konditionen für Waadt', icon: MapPin },
      { title: 'Schnelle Termine', description: 'Flexible Verfügbarkeit dank lokalem Team', icon: Clock }
    ],
    districts: ['Ouchy', 'Chailly', 'Centre-Ville'],
    priceExamples: [
      { route: '3 Zimmer Lausanne → Renens', price: 'CHF 900–1550' }
    ],
    faq: [
      { question: 'Was kostet ein Umzug in Lausanne?', answer: 'Ein 3-Zimmer-Umzug kostet in Lausanne durchschnittlich CHF 900–1550.' },
      { question: 'Sind Umzugsfirmen in Lausanne auf steile Quartiere spezialisiert?', answer: 'Ja, lokale Teams kennen die Hanglage und verfügen über entsprechende Erfahrung und Ausrüstung.' }
    ]
  },
  luzern: {
    name: 'luzern',
    displayName: 'Luzern',
    heroTitle: 'Die besten Umzugsfirmen in Luzern im Vergleich',
    heroSubtitle: 'Kostenlose Offerten von geprüften Luzerner Profis.',
    liveSignal: '7 Personen aus Luzern vergleichen gerade Umzüge',
    liveCount: 7,
    backgroundImage: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=1920&q=80',
    advantages: [
      { title: 'Erfahrung Altstadt / Seenähe', description: 'Lokale Expertise für historische Quartiere', icon: Shield },
      { title: 'Regionale Preise', description: 'Transparente Preisgestaltung Zentralschweiz', icon: MapPin },
      { title: 'Enge Gassen Handling', description: 'Professionelle Lösungen für schmale Zufahrten', icon: Zap }
    ],
    districts: ['Littau', 'Reussbühl', 'Tribschen'],
    priceExamples: [
      { route: '2 Zimmer Luzern → Kriens', price: 'CHF 690–1100' }
    ],
    faq: [
      { question: 'Was kostet ein Umzug in Luzern?', answer: 'Ein 2-Zimmer-Umzug kostet in Luzern durchschnittlich CHF 690–1100.' },
      { question: 'Können Umzugsfirmen in der Luzerner Altstadt arbeiten?', answer: 'Ja, lokale Teams kennen die engen Gassen und organisieren Parkbewilligungen.' }
    ]
  },
  winterthur: {
    name: 'winterthur',
    displayName: 'Winterthur',
    heroTitle: 'Die besten Umzugsfirmen in Winterthur im Vergleich',
    heroSubtitle: 'Kostenlose Offerten von lokalen Winti-Profis.',
    liveSignal: '9 Personen aus Winterthur vergleichen gerade Umzüge',
    liveCount: 9,
    backgroundImage: 'https://images.unsplash.com/photo-1559564484-e48bf5f64a75?w=1920&q=80',
    advantages: [
      { title: 'Regionale Preise Winterthur', description: 'Faire Konditionen für Stadt und Agglo', icon: MapPin },
      { title: 'Teams für Winterthurer Altstadt', description: 'Expertise für historische Quartiere', icon: Shield },
      { title: 'Gute Express-Verfügbarkeit', description: 'Kurzfristige Termine möglich', icon: Clock }
    ],
    districts: ['Oberwinterthur', 'Seen', 'Mattenbach'],
    priceExamples: [
      { route: '2 Zimmer Winterthur → Töss', price: 'CHF 650–1150' }
    ],
    faq: [
      { question: 'Was kostet ein Umzug in Winterthur?', answer: 'Ein 2-Zimmer-Umzug kostet in Winterthur durchschnittlich CHF 650–1150.' },
      { question: 'Wie schnell kann ich einen Umzugstermin bekommen?', answer: 'Lokale Teams bieten oft kurzfristige Verfügbarkeit, idealerweise 2-3 Wochen im Voraus buchen.' }
    ]
  },
  stgallen: {
    name: 'stgallen',
    displayName: 'St. Gallen',
    heroTitle: 'Die besten Umzugsfirmen in St. Gallen im Vergleich',
    heroSubtitle: 'Kostenlose Offerten von geprüften Teams.',
    liveSignal: '6 Personen aus St. Gallen vergleichen gerade Umzüge',
    liveCount: 6,
    backgroundImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80',
    advantages: [
      { title: 'Regionale Preise Ostschweiz', description: 'Transparente Preisgestaltung', icon: MapPin },
      { title: 'Erfahrung mit Hanglagen', description: 'Spezialisiert auf steile Zufahrten', icon: Zap },
      { title: 'Schnelle Verfügbarkeit', description: 'Lokale Teams mit flexiblen Terminen', icon: Clock }
    ],
    districts: ['Bruggen', 'Rotmonten', 'St. Fiden'],
    priceExamples: [
      { route: '3 Zimmer St. Gallen → Gossau', price: 'CHF 880–1480' }
    ],
    faq: [
      { question: 'Was kostet ein Umzug in St. Gallen?', answer: 'Ein 3-Zimmer-Umzug kostet in St. Gallen durchschnittlich CHF 880–1480.' },
      { question: 'Können Umzugsfirmen mit Hanglagen umgehen?', answer: 'Ja, lokale Teams haben Erfahrung mit steilen Quartieren und entsprechende Ausrüstung.' }
    ]
  },
  zug: {
    name: 'zug',
    displayName: 'Zug',
    heroTitle: 'Umzugsfirmen in Zug vergleichen',
    heroSubtitle: 'Vergleichen Sie jetzt geprüfte Umzugsfirmen in der Stadt Zug. Gratis Offerten in 24–48h, transparente Preise und auf Wunsch Komplettpaket inkl. Endreinigung & Wohnungsabgabe.',
    liveSignal: '5 Personen aus Zug vergleichen gerade Umzüge',
    liveCount: 5,
    backgroundImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80',
    advantages: [
      { title: 'Altstadt & Seepromenade', description: 'Ortskenntnis für enge Gassen, Zugersee-Zufahrten & Tragewege', icon: MapPin },
      { title: 'Halteverbotszone inkl.', description: 'Partner organisieren Parkfläche / Zeitfenster für Sie', icon: Clock },
      { title: 'Möbellift bei Altbauten', description: 'Enge Treppenhäuser? Möbellift schont Mobiliar & Gebäude', icon: Shield }
    ],
    districts: ['Altstadt', 'Seestrasse', 'Herti', 'Guthirt'],
    priceExamples: [
      { route: '2 Zimmer Zug Altstadt → Zug Herti', price: 'CHF 690–1050' },
      { route: '3.5 Zimmer Zug → Baar', price: 'CHF 1100–1700' },
      { route: '4.5 Zimmer Zug → Cham', price: 'CHF 1400–2200' }
    ],
    faq: [
      { question: 'Was kostet ein Umzug in der Stadt Zug?', answer: 'Die Kosten variieren je nach Wohnungsgrösse, Stockwerk und Zufahrt. Ein 2-Zimmer-Umzug innerhalb Zug liegt bei ca. CHF 690–1050, ein 3.5-Zimmer-Umzug bei CHF 1100–1700. Umzugscheck.ch vermittelt geprüfte Partnerfirmen – der Umzug wird durch diese durchgeführt.' },
      { question: 'Brauche ich in Zug eine Halteverbotszone?', answer: 'In der Altstadt und am Seeufer fast immer nötig. Viele Partnerfirmen übernehmen die Beantragung für Sie. Kosten: ca. CHF 80–150 je nach Zone.' },
      { question: 'Was ist beim Umzug in der Zuger Altstadt zu beachten?', answer: 'Enge Gassen, Fussgängerzonen und zeitliche Einschränkungen erfordern Planung. Ein Möbellift oder Tragen über längere Wege kann nötig sein. Unsere Partner kennen die lokalen Gegebenheiten.' },
      { question: 'Gibt es ein Komplettpaket mit Endreinigung?', answer: 'Ja. Viele Partner bieten Umzug + Endreinigung + Wohnungsabgabe-Vorbereitung als Paket an. Das spart Koordination und gibt Sicherheit bei der Abnahme.' },
      { question: 'Wie schnell erhalte ich Offerten?', answer: 'In der Regel erhalten Sie innerhalb von 24–48 Stunden 3–5 unverbindliche Offerten von geprüften Firmen per E-Mail.' },
      { question: 'Wer führt den Umzug durch?', answer: 'Umzugscheck.ch ist ein Vergleichs- und Vermittlungsservice. Die Durchführung des Umzugs erfolgt durch geprüfte Partnerfirmen, die Sie aus den Offerten auswählen.' }
    ]
  },
  lugano: {
    name: 'lugano',
    displayName: 'Lugano',
    heroTitle: 'Le migliori ditte di trasloco a Lugano – confronto immediato',
    heroSubtitle: 'Preventivi gratuiti da professionisti verificati.',
    liveSignal: '5 persone di Lugano stanno confrontando traslochi',
    liveCount: 5,
    backgroundImage: 'https://images.unsplash.com/photo-1559564484-e48bf5f64a75?w=1920&q=80',
    advantages: [
      { title: 'Esperti locali in Ticino', description: 'Conoscenza regionale approfondita', icon: Shield },
      { title: 'Prezzi regionali', description: 'Tariffe trasparenti per il Ticino', icon: MapPin },
      { title: 'Disponibilità veloce', description: 'Team locali con appuntamenti flessibili', icon: Clock }
    ],
    districts: ['Paradiso', 'Cassarate', 'Pregassona'],
    priceExamples: [
      { route: '2.5 Locali Lugano → Paradiso', price: 'CHF 700–1150' }
    ],
    faq: [
      { question: 'Quanto costa un trasloco a Lugano?', answer: 'Un trasloco di 2.5 locali a Lugano costa in media CHF 700–1150.' },
      { question: 'Le ditte di trasloco parlano italiano?', answer: 'Sì, tutti i team in Ticino sono madrelingua italiana.' }
    ]
  },
  biel: {
    name: 'biel',
    displayName: 'Biel/Bienne',
    heroTitle: 'Die besten Umzugsfirmen in Biel im Vergleich',
    heroSubtitle: 'Kostenlose Offerten von zweisprachigen Teams.',
    liveSignal: '5 Personen aus Biel vergleichen gerade Umzüge',
    liveCount: 5,
    backgroundImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80',
    advantages: [
      { title: 'Zweisprachige Anbieter', description: 'Deutsch und Französisch fliessend', icon: Shield },
      { title: 'Regionale Preise', description: 'Faire Konditionen für Biel und Umgebung', icon: MapPin },
      { title: 'Express-Teams', description: 'Schnelle Verfügbarkeit', icon: Clock }
    ],
    districts: ['Mett', 'Bözingen', 'Vingelz'],
    priceExamples: [
      { route: '3 Zimmer Biel → Nidau', price: 'CHF 780–1300' }
    ],
    faq: [
      { question: 'Was kostet ein Umzug in Biel?', answer: 'Ein 3-Zimmer-Umzug kostet in Biel durchschnittlich CHF 780–1300.' },
      { question: 'Sind die Umzugsfirmen zweisprachig?', answer: 'Ja, alle Teams in Biel sprechen Deutsch und Französisch.' }
    ]
  },
  aarau: {
    name: 'aarau',
    displayName: 'Aarau',
    heroTitle: 'Die besten Umzugsfirmen in Aarau im Vergleich',
    heroSubtitle: 'Kostenlose Offerten von regionalen Aargauer Teams.',
    liveSignal: '3 Personen aus Aarau vergleichen gerade Umzüge',
    liveCount: 3,
    backgroundImage: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=1920&q=80',
    advantages: [
      { title: 'Regionale Preise Aargau', description: 'Transparente Preisgestaltung', icon: MapPin },
      { title: 'Einfache Terminfindung', description: 'Flexible Verfügbarkeit', icon: Clock },
      { title: 'Erfahrung Landquartiere', description: 'Expertise für Zuzüge in ländliche Gebiete', icon: Zap }
    ],
    districts: ['Rohr', 'Telli', 'Gönhard'],
    priceExamples: [
      { route: '2 Zimmer Aarau → Suhr', price: 'CHF 620–990' }
    ],
    faq: [
      { question: 'Was kostet ein Umzug in Aarau?', answer: 'Ein 2-Zimmer-Umzug kostet in Aarau durchschnittlich CHF 620–990.' },
      { question: 'Können Umzugsfirmen auch in ländliche Gebiete umziehen?', answer: 'Ja, lokale Teams haben Erfahrung mit Umzügen in Landquartiere und kleinere Gemeinden.' }
    ]
  },
  schaffhausen: {
    name: 'schaffhausen',
    displayName: 'Schaffhausen',
    heroTitle: 'Die besten Umzugsfirmen in Schaffhausen im Vergleich',
    heroSubtitle: 'Kostenlose Offerten von lokalen Profis.',
    liveSignal: '2 Personen aus Schaffhausen vergleichen gerade Umzüge',
    liveCount: 2,
    backgroundImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80',
    advantages: [
      { title: 'Regionale Anbieter', description: 'Teams aus der Region', icon: MapPin },
      { title: 'Erfahrung mit engen Gassen', description: 'Altstadt-Expertise', icon: Shield },
      { title: 'Gute Expressverfügbarkeit', description: 'Kurzfristige Termine möglich', icon: Clock }
    ],
    districts: ['Herblingen', 'Buchthalen', 'Breite'],
    priceExamples: [
      { route: '3 Zimmer Schaffhausen → Neuhausen', price: 'CHF 750–1250' }
    ],
    faq: [
      { question: 'Was kostet ein Umzug in Schaffhausen?', answer: 'Ein 3-Zimmer-Umzug kostet in Schaffhausen durchschnittlich CHF 750–1250.' },
      { question: 'Haben Umzugsfirmen Erfahrung mit der Altstadt?', answer: 'Ja, lokale Teams kennen die engen Gassen und organisieren Parkbewilligungen.' }
    ]
  },
  chur: {
    name: 'chur',
    displayName: 'Chur',
    heroTitle: 'Die besten Umzugsfirmen in Chur im Vergleich',
    heroSubtitle: 'Kostenlose Offerten von Bündner Umzugsprofis.',
    liveSignal: '3 Personen aus Chur vergleichen gerade Umzüge',
    liveCount: 3,
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    advantages: [
      { title: 'Erfahrung Bergregion', description: 'Spezialisiert auf alpine Zufahrten', icon: Zap },
      { title: 'Regionale Preise Graubünden', description: 'Faire Konditionen für GR', icon: MapPin },
      { title: 'Teams für enge Altstadt', description: 'Ortskenntnis für Altstadt & Seepromenade', icon: Shield }
    ],
    districts: ['Masans', 'Sand', 'Lürlibad'],
    priceExamples: [
      { route: '2.5 Zimmer Chur → Domat/Ems', price: 'CHF 690–1150' }
    ],
    faq: [
      { question: 'Was kostet ein Umzug in Chur?', answer: 'Ein 2.5-Zimmer-Umzug kostet in Chur durchschnittlich CHF 690–1150.' },
      { question: 'Haben Umzugsfirmen Erfahrung mit Bergregionen?', answer: 'Ja, Teams in Graubünden sind auf alpine Zufahrten und Berggebiete spezialisiert.' }
    ]
  }
};

type CityInfo = NonNullable<ReturnType<typeof getCity>>;

const formatCHFRange = (min: number, max: number) => {
  const fmt = (n: number) => n.toLocaleString('de-CH');
  return `CHF ${fmt(min)}–${fmt(max)}`;
};

const buildGenericCityData = (info: CityInfo): CityData => {
  const liveCount = Math.max(3, Math.min(18, (info.name.length * 2) % 19));

  return {
    name: info.slug,
    displayName: info.name,
    heroTitle: `Umzugsfirmen in ${info.name} vergleichen`,
    heroSubtitle: `Vergleichen Sie geprüfte Umzugsfirmen in ${info.name} (${info.cantonShort}) und erhalten Sie kostenlose, unverbindliche Offerten.`,
    liveSignal: `${liveCount} Personen aus ${info.name} vergleichen gerade Umzüge`,
    liveCount,
    // Für neue City-Pages nutzen wir immer das Kanton-Bild: konsistent, hochwertig, relevant.
    backgroundImage: getRegionImage(info.cantonSlug),
    advantages: [
      { title: 'Lokale Partner', description: `Geprüfte Umzugsfirmen mit Ortskenntnis in ${info.name} und Umgebung`, icon: MapPin },
      { title: 'Wohnungsabgabe möglich', description: 'Auf Wunsch: Umzug + Endreinigung mit Abnahmegarantie als Paket', icon: Shield },
      { title: 'Schnelle Offerten', description: 'Mehrere Angebote vergleichen und das beste Preis-Leistungs-Paket wählen', icon: Zap }
    ],
    districts: ['Zentrum', 'Altstadt', 'Agglomeration', 'Umland'],
    priceExamples: [
      { route: `1.5–2.5 Zimmer ${info.name} (innerhalb Stadt)`, price: formatCHFRange(550, 1050) },
      { route: `3.5–4.5 Zimmer ${info.name} → Region ${info.cantonName}`, price: formatCHFRange(1100, 2300) }
    ],
    faq: [
      {
        question: `Was kostet ein Umzug in ${info.name}?`,
        answer: `Die Kosten hängen von Wohnungsgrösse, Stockwerken, Distanz und Zusatzservices ab. Als Richtwert liegen 2.5-Zimmer-Umzüge häufig bei ${formatCHFRange(650, 1250)}.`
      },
      {
        question: 'Wie schnell erhalte ich Offerten?',
        answer: 'In der Regel erhalten Sie mehrere Offerten innerhalb von 24–48 Stunden. Bei kurzfristigen Terminen helfen wir, verfügbare Teams schneller zu finden.'
      },
      {
        question: 'Gibt es ein Komplettpaket mit Wohnungsabgabe?',
        answer: 'Ja. Viele Partner bieten Umzug, Endreinigung und Abnahmevorbereitung als Paket an. Das reduziert Koordination und spart Zeit am Umzugstag.'
      }
    ]
  };
};

export default function CityMovers() {
  const params = useParams<{ city?: string; slug?: string }>();
  const citySlug = decodeURIComponent((params.city || params.slug || '').trim()).toLowerCase();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveCount, setLiveCount] = useState(0);

  const cityInfo = citySlug ? getCity(citySlug) : null;
  const cityData = cityInfo ? (cityDatabase[citySlug] ?? buildGenericCityData(cityInfo)) : null;

  const relatedCities = cityInfo
    ? Object.values(CITIES_MAP)
        .filter((c) => c.cantonSlug === cityInfo.cantonSlug && c.slug !== cityInfo.slug)
        .slice(0, 8)
    : [];

  const cantonUrl = cityInfo ? `/umzugsfirmen/kanton-${cityInfo.cantonSlug}` : '/regionen';

  useEffect(() => {
    if (!cityData) return;
    
    setLiveCount(cityData.liveCount);
    const interval = setInterval(() => {
      setLiveCount(prev => Math.max(3, prev + Math.floor(Math.random() * 5) - 2));
    }, 8000);
    return () => clearInterval(interval);
  }, [cityData]);

  useEffect(() => {
    if (!cityData) return;
    
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        // Use public view that excludes sensitive data
        const { data, error } = await supabase
          .from('service_providers_public')
          .select('*')
          .contains('cities_served', [cityData.displayName])
          .order('quality_score', { ascending: false })
          .limit(5);

        if (error) throw error;
        setCompanies(data || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [cityData]);

  if (!cityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Stadt nicht gefunden</h1>
          <Link to="/">
            <Button>Zurück zur Startseite</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isZug = citySlug === 'zug';
  const isZurich = citySlug === 'zuerich';
  const canonicalUrl = `https://umzugscheck.ch/umzugsfirmen/${citySlug}`;
  
  // City-specific OG images
  const ogImage = isZug 
    ? getRegionImage('zug') 
    : isZurich 
      ? 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1200&q=80'
      : cityData.backgroundImage;
  
  // City-specific SEO Titles
  const seoTitle = isZug
    ? 'Umzugsfirmen Zug (Stadt) vergleichen | Offerten gratis | Umzugscheck'
    : isZurich
      ? 'Umzugsfirmen Zürich (Stadt) vergleichen | Alle 12 Kreise | Umzugscheck'
      : `${cityData.heroTitle} | Umzugscheck.ch`;
  
  // City-specific SEO Descriptions
  const seoDescription = isZug
    ? 'Vergleichen Sie geprüfte Umzugsfirmen in der Stadt Zug. Gratis Offerten in 24–48h, transparente Preise und auf Wunsch Komplettpaket inkl. Endreinigung & Wohnungsabgabe. Bis zu 40% sparen.'
    : isZurich
      ? 'Vergleichen Sie 80+ geprüfte Umzugsfirmen in der Stadt Zürich. Alle 12 Stadtkreise abgedeckt – von Altstadt bis Oerlikon. Gratis Offerten in 24h, bis zu 40% sparen.'
      : cityData.heroSubtitle;
  
  // City-specific Keywords
  const seoKeywords = isZug
    ? [
        'Umzugsfirma Zug',
        'Umzugsfirmen Zug',
        'Umzug Zug',
        'Umzugskosten Zug',
        'Umzugsunternehmen Zug',
        'Umzug Zug Altstadt',
        'Umzug Zug Seestrasse',
        'Umzug Zug Expat',
        'Firmenumzug Zug',
        'Umzug + Endreinigung Zug',
        'Wohnungsabgabe Zug',
        'Halteverbotszone Zug',
      ]
    : isZurich
      ? [
          'Umzugsfirma Zürich',
          'Umzugsfirmen Zürich',
          'Umzug Zürich',
          'Umzugskosten Zürich Stadt',
          'Umzugsunternehmen Zürich',
          'Umzug Kreis 1',
          'Umzug Oerlikon',
          'Umzug Seefeld',
          'Umzug Altstetten',
          'Firmenumzug Zürich',
          'Expat Umzug Zürich',
          'Halteverbotszone Zürich',
          'Möbellift Zürich',
        ]
      : [
          `Umzugsfirma ${cityData.displayName}`,
          `Umzugsfirmen ${cityData.displayName}`,
          `Umzug ${cityData.displayName}`,
          `Umzugskosten ${cityData.displayName}`,
          `Umzugsunternehmen ${cityData.displayName}`,
        ];

  const howToSteps = [
    { name: 'Umzugsdetails erfassen', text: `Start- und Zieladresse, Datum und Wohnungsgrösse für ${cityData.displayName} angeben.` },
    { name: 'Offerten erhalten', text: 'Mehrere geprüfte Umzugsfirmen vergleichen (Preis, Bewertungen, Leistungen).' },
    { name: 'Komplettpaket wählen', text: 'Optional: Endreinigung, Möbellift, Montage, Entsorgung oder Einlagerung hinzufügen.' },
    { name: 'Buchen & entspannt umziehen', text: 'Anbieter auswählen und direkt bei der Partnerfirma buchen. Umzugscheck.ch vermittelt den Kontakt, die Durchführung erfolgt durch den Anbieter.' },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Umzugsfirmen Schweiz', item: 'https://umzugscheck.ch/umzugsfirmen-schweiz' },
      ...(cityInfo
        ? [{ '@type': 'ListItem', position: 2, name: `Kanton ${cityInfo.cantonName}`, item: `https://umzugscheck.ch/umzugsfirmen/kanton-${cityInfo.cantonSlug}` }]
        : []),
      { '@type': 'ListItem', position: cityInfo ? 3 : 2, name: cityData.displayName, item: canonicalUrl },
    ],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Umzugsfirmen vergleichen in ${cityData.displayName}`,
    serviceType: 'Umzugsfirmen-Vergleich',
    areaServed: {
      '@type': 'City',
      name: cityData.displayName,
      ...(cityInfo ? { containedInPlace: { '@type': 'AdministrativeArea', name: cityInfo.cantonName } } : {}),
    },
    provider: {
      '@type': 'Organization',
      name: 'Umzugscheck.ch',
      url: 'https://umzugscheck.ch',
    },
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: canonicalUrl,
    name: seoTitle,
    description: seoDescription,
    inLanguage: 'de-CH',
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: ogImage,
      caption: `Umzug in ${cityData.displayName}`,
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Umzugscheck.ch',
      url: 'https://umzugscheck.ch',
    },
  };

  const structuredData = [
    webPageSchema,
    breadcrumbSchema,
    serviceSchema,
    generateHowToSchema(howToSteps),
    generateFAQSchema(cityData.faq),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>{seoTitle}</title>
        <meta name="title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords.join(', ')} />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Social */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="de_CH" />
        <meta property="og:site_name" content="Umzugscheck.ch" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* Geo */}
        <meta name="geo.region" content={cityInfo ? `CH-${cityInfo.cantonShort}` : 'CH'} />
        <meta name="geo.placename" content={cityData.displayName} />

        {/* Performance hint for hero */}
        <link rel="preload" as="image" href={ogImage} />

        {/* Structured Data */}
        {structuredData.map((schema, index) => (
          <script key={index} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>

      {/* NEW: Breadcrumb UI */}
      <RegionBreadcrumb 
        regionName={cityData.displayName} 
        regionType="city"
        cantonName={cityInfo?.cantonName}
        cantonSlug={cityInfo?.cantonSlug}
      />

      {/* Unified Hero - Homepage Style */}
      <UnifiedHero
        title={cityData.heroTitle}
        titleAccent="Jetzt gratis vergleichen"
        subtitle={cityData.heroSubtitle}
        locationName={cityData.displayName}
        locationShort={cityInfo?.cantonShort}
        stats={{
          rating: 4.8,
          reviewCount: 2847,
          providerCount: 200,
          activeUsers: cityData.liveCount
        }}
        backgroundImage={ogImage}
        prefillFrom={cityData.displayName}
        variant="city"
      />

      {/* NEW: Anchor Navigation for Sitelinks */}
      <RegionAnchorNav />

      {/* City-specific unique content sections */}
      {isZug && <ZugCityContent onCTAClick={() => navigate('/umzugsofferten')} />}
      {isZurich && <ZurichCityContent onCTAClick={() => navigate('/umzugsofferten')} />}

      {/* Local Calculator */}
      <section id="offerten" className="py-16 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-full mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">
                  {liveCount} Personen aus {cityData.displayName} vergleichen gerade Umzüge
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Jetzt Preise vergleichen
              </h2>
            </div>
            <MiniCalculator />
          </motion.div>
        </div>
      </section>

      {/* Top Companies */}
      <section id="firmen" className="py-16 scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
              Top Umzugsfirmen in {cityData.displayName}
            </h2>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : companies.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <AirbnbCompanyCard
                    key={company.id}
                    id={company.id}
                    name={company.company_name}
                    image={company.logo_url || '/placeholder.svg'}
                    rating={4.8}
                    reviewCount={127}
                    priceFrom={`CHF ${Math.floor(Math.random() * 200) + 500}`}
                    badges={['Lokal', 'Top bewertet']}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-6">
                  Momentan keine Firmen verfügbar für {cityData.displayName}.
                </p>
                <Button onClick={() => navigate('/umzugsofferten')}>
                  Offerte anfragen
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Local Advantages (= Tipps) */}
      <section id="tipps" className="py-16 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
              Vorteile in {cityData.displayName}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {cityData.advantages.map((advantage, index) => (
                <USPCard
                  key={index}
                  icon={advantage.icon}
                  title={advantage.title}
                  description={advantage.description}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Komplettpaket / mehr Content */}
      <section id="komplettpaket" className="py-16 scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Komplettpaket in {cityData.displayName}
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Wenn Sie möchten, koordinieren wir Umzug, Endreinigung und Wohnungsabgabe als sauberes Gesamtpaket. Weniger Organisation,
                weniger Risiken bei der Abnahme.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-soft">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Umzug</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Tragen, Transport, Schutzmaterial</li>
                  <li>• Möbelmontage / Demontage</li>
                  <li>• Optional: Einlagerung & Entsorgung</li>
                </ul>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-soft">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Endreinigung</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Abnahmevorbereitung & Protokoll</li>
                  <li>• Auf Wunsch mit Abnahmegarantie</li>
                  <li>• Fenster, Küche, Bad, Böden</li>
                </ul>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-soft">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Wohnungsabgabe</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Timing & Koordination (Schlüssel, Termine)</li>
                  <li>• Halteverbotszone / Parkfläche (falls nötig)</li>
                  <li>• Ein Ansprechpartner für alles</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center gap-3">
              <Button size="lg" onClick={() => navigate('/umzugsofferten')} className="h-14 px-8 text-lg">
                Komplettpaket anfragen
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground">100% kostenlos & unverbindlich</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
              Bewertungen aus {cityData.displayName}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {cityData.districts.map((district, index) => (
                <div key={index} className="bg-card p-6 rounded-2xl border border-border/50 shadow-soft hover:shadow-medium transition-shadow">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Umzug in {district}</p>
                  <p className="text-sm">„Professionell, pünktlich und sorgfältig. Sehr empfehlenswert!"</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Price Examples */}
      <section id="preise" className="py-16 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
              Preisbeispiele für {cityData.displayName}
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {cityData.priceExamples.map((example, index) => (
                <div key={index} className="bg-card p-6 rounded-2xl border border-border/50 shadow-soft hover:shadow-medium transition-shadow">
                  <h3 className="font-semibold text-lg mb-2">{example.route}</h3>
                  <p className="text-2xl font-bold text-primary">{example.price}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW: Why Save Block */}
      <RegionWhySave regionName={cityData.displayName} />

      {/* NEW: Mid-Page CTA */}
      <RegionMidCTA regionName={cityData.displayName} />

      {/* NEW: E-E-A-T Trust Box */}
      <RegionTrustBox regionName={cityData.displayName} />

      {/* Interne Verlinkungen / Nearby */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-10">
              Beliebte Seiten rund um {cityData.displayName}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-soft">
                <h3 className="font-semibold text-lg mb-3">Direkt zu den wichtigsten Seiten</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Link to={cantonUrl} className="group flex items-center justify-between rounded-xl border border-border/60 p-4 hover:bg-muted/50 transition-colors">
                    <span className="font-medium">Kanton {cityInfo?.cantonName}</span>
                    <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                  </Link>
                  <Link to="/umzugsfirmen-schweiz" className="group flex items-center justify-between rounded-xl border border-border/60 p-4 hover:bg-muted/50 transition-colors">
                    <span className="font-medium">Alle Kantone</span>
                    <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                  </Link>
                  <Link to="/umzugsfirmen-schweiz" className="group flex items-center justify-between rounded-xl border border-border/60 p-4 hover:bg-muted/50 transition-colors">
                    <span className="font-medium">Umzugsfirmen Schweiz</span>
                    <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                  </Link>
                  <Link to="/umzugsofferten" className="group flex items-center justify-between rounded-xl border border-border/60 p-4 hover:bg-muted/50 transition-colors">
                    <span className="font-medium">Offerten erhalten</span>
                    <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                  </Link>
                </div>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-soft">
                <h3 className="font-semibold text-lg mb-3">Weitere Städte in {cityInfo?.cantonShort}</h3>
                {relatedCities.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {relatedCities.map((c) => (
                      <Link
                        key={c.slug}
                        to={`/umzugsfirmen/${c.slug}`}
                        className="group flex items-center justify-between rounded-xl border border-border/60 p-4 hover:bg-muted/50 transition-colors"
                      >
                        <span className="font-medium">{c.name}</span>
                        <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Mehr City-Pages werden laufend ergänzt.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW: Glossar */}
      <RegionGlossar />

      {/* NEW: Content Cluster Links */}
      <RegionContentCluster regionName={cityData.displayName} regionSlug={citySlug || ''} />

      {/* FAQ */}
      <section id="faq" className="py-16 scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
              Häufige Fragen
            </h2>
            <FAQAccordion items={cityData.faq} />
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Jetzt Offerten für {cityData.displayName} sichern
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Kostenlos, unverbindlich und in nur 2 Minuten
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/umzugsofferten')}
              className="bg-white text-primary hover:bg-white/90 shadow-strong text-lg h-14 px-8"
            >
              Kostenlose Offerten erhalten
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
