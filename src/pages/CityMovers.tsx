import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AirbnbCompanyCard } from '@/components/home/AirbnbCompanyCard';
import { MiniCalculator } from '@/components/home/MiniCalculator';
import { USPCard } from '@/components/home/USPCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { CheckCircle, MapPin, Clock, Shield, Star, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet';

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
    heroTitle: 'Die besten Umzugsfirmen in Zürich im Vergleich',
    heroSubtitle: 'Kostenlose Offerten von geprüften lokalen Umzugsprofis.',
    liveSignal: '15 Personen aus Zürich vergleichen gerade Umzüge',
    liveCount: 15,
    backgroundImage: 'https://images.unsplash.com/photo-1559564484-e48bf5f64a75?w=1920&q=80',
    advantages: [
      { title: 'Regionale Preise im Grossraum Zürich', description: 'Transparente Preisgestaltung für Stadt und Agglomeration', icon: MapPin },
      { title: 'Schnelle Verfügbarkeit', description: 'Express-Service in Stadt und Agglo verfügbar', icon: Clock },
      { title: 'Erfahrene Zürcher Teams', description: 'Lokale Expertise für alle Stadtteile und Kreise', icon: Shield }
    ],
    districts: ['Oerlikon', 'Altstetten', 'Wiedikon', 'Seefeld'],
    priceExamples: [
      { route: '2 Zimmer Zürich → Schlieren', price: 'CHF 690–1080' },
      { route: '3 Zimmer Zürich Kreis 3 → Kreis 6', price: 'CHF 950–1550' }
    ],
    faq: [
      { question: 'Was kostet ein Umzug in Zürich?', answer: 'Die Kosten variieren je nach Grösse und Distanz. Ein 2-Zimmer-Umzug kostet durchschnittlich CHF 690–1080.' },
      { question: 'Wie lange dauert ein Umzug in Zürich?', answer: 'Ein typischer 3-Zimmer-Umzug dauert 4-6 Stunden, abhängig von Stockwerken und Distanz.' },
      { question: 'Benötige ich eine Parkbewilligung?', answer: 'Ja, in den meisten Zürcher Quartieren wird eine Halteverbotszone empfohlen. Ihr Umzugspartner kann dies organisieren.' }
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
    heroTitle: 'Die besten Umzugsfirmen in Zug im Vergleich',
    heroSubtitle: 'Kostenlose Offerten von Premium-Umzugsfirmen im Kanton Zug.',
    liveSignal: '4 Personen aus Zug vergleichen gerade Umzüge',
    liveCount: 4,
    backgroundImage: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=1920&q=80',
    advantages: [
      { title: 'Erfahrung Altstadt Zug', description: 'Expertise für historisches Zentrum', icon: Shield },
      { title: 'Hochwertige Haushalte', description: 'Spezialisiert auf gehobene Ansprüche', icon: Star },
      { title: 'Diskrete Umzugsservices', description: 'Professionell und vertraulich', icon: Clock }
    ],
    districts: ['Baar', 'Cham', 'Neuheim'],
    priceExamples: [
      { route: '3 Zimmer Zug → Cham', price: 'CHF 1100–1700' }
    ],
    faq: [
      { question: 'Was kostet ein Umzug in Zug?', answer: 'Ein 3-Zimmer-Umzug kostet in Zug durchschnittlich CHF 1100–1700.' },
      { question: 'Bieten Umzugsfirmen in Zug Premium-Service?', answer: 'Ja, viele Anbieter sind auf hochwertige Haushalte und diskrete Umzüge spezialisiert.' }
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
      { title: 'Teams für enge Altstadt', description: 'Expertise für historisches Zentrum', icon: Shield }
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

export default function CityMovers() {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveCount, setLiveCount] = useState(0);

  const cityData = city ? cityDatabase[city.toLowerCase()] : null;

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

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{cityData.heroTitle} | Umzugscheck.ch</title>
        <meta name="description" content={cityData.heroSubtitle} />
      </Helmet>

      {/* Hero Section */}
      <section 
        className="relative overflow-hidden py-20 md:py-32 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, hsla(var(--primary-hsl) / 0.95), hsla(var(--primary-dark-hsl) / 0.95)), url('${cityData.backgroundImage}')`
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              {cityData.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              {cityData.heroSubtitle}
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 justify-center mb-8 text-white">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span className="font-semibold">4.8 / 5</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                <span className="font-semibold">15'000+ Umzüge</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                <span className="font-semibold">100% kostenlos</span>
              </div>
            </div>

            <Button 
              size="lg" 
              onClick={() => navigate('/umzugsofferten')}
              className="bg-white text-primary hover:bg-white/90 shadow-strong text-lg h-14 px-8"
            >
              Offerten in {cityData.displayName} vergleichen
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Local Calculator */}
      <section className="py-16 bg-muted/30">
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
      <section className="py-16">
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

      {/* Local Advantages */}
      <section className="py-16 bg-muted/30">
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
      <section className="py-16 bg-muted/30">
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

      {/* FAQ */}
      <section className="py-16">
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
