/**
 * NeighborhoodGuideSection - Sprint 3 Component
 * Tabbed section with Families, Professionals, Expats, Essentials content
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Briefcase, 
  Globe, 
  Info, 
  School, 
  Baby, 
  TreePine, 
  Train, 
  Building2, 
  Wifi, 
  Coffee, 
  MapPin,
  Heart,
  Stethoscope,
  ShoppingCart,
  Utensils
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NeighborhoodGuide {
  families: {
    highlights: string[];
    schools: string[];
    parks: string[];
    familyFriendly: string[];
  };
  professionals: {
    highlights: string[];
    coworking: string[];
    networking: string[];
    commute: string[];
  };
  expats: {
    highlights: string[];
    internationalSchools: string[];
    expatsGroups: string[];
    englishFriendly: string[];
  };
  essentials: {
    healthcare: string[];
    shopping: string[];
    dining: string[];
    transport: string[];
  };
}

interface NeighborhoodGuideSectionProps {
  cityName: string;
  guide: NeighborhoodGuide;
  className?: string;
}

// Default guide data for cities without specific data
export const getDefaultGuide = (cityName: string): NeighborhoodGuide => ({
  families: {
    highlights: [
      `${cityName} bietet familienfreundliche Quartiere`,
      'Gute öffentliche Schulen in der Region',
      'Sichere Wohngebiete mit Spielplätzen'
    ],
    schools: ['Öffentliche Primarschulen', 'Sekundarschulen', 'Kindergärten'],
    parks: ['Lokale Grünanlagen', 'Spielplätze', 'Sportanlagen'],
    familyFriendly: ['Kinderarztpraxen', 'Familienzentren', 'Bibliotheken']
  },
  professionals: {
    highlights: [
      'Gute ÖV-Anbindung für Pendler',
      'Wachsendes Geschäftsumfeld',
      'Work-Life-Balance möglich'
    ],
    coworking: ['Lokale Coworking-Spaces', 'Home-Office-freundlich'],
    networking: ['Business-Netzwerke', 'Branchenevents'],
    commute: ['ÖV-Verbindungen', 'Autobahnanschluss']
  },
  expats: {
    highlights: [
      'Internationale Community vorhanden',
      'Englischsprachige Services',
      'Integrationsprogramme'
    ],
    internationalSchools: ['Internationale Schuloptionen in der Region'],
    expatsGroups: ['Expat-Netzwerke', 'Internationale Clubs'],
    englishFriendly: ['Englischsprachige Ärzte', 'Internationale Supermärkte']
  },
  essentials: {
    healthcare: ['Spitäler in der Region', 'Hausarztpraxen', 'Apotheken'],
    shopping: ['Einkaufszentren', 'Supermärkte', 'Wochenmärkte'],
    dining: ['Restaurants', 'Cafés', 'Take-away'],
    transport: ['Bahnhof', 'Buslinien', 'Velorouten']
  }
});

const tabConfig = [
  { 
    id: 'families', 
    label: 'Familien', 
    icon: Users,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/30'
  },
  { 
    id: 'professionals', 
    label: 'Professionals', 
    icon: Briefcase,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30'
  },
  { 
    id: 'expats', 
    label: 'Expats', 
    icon: Globe,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30'
  },
  { 
    id: 'essentials', 
    label: 'Essentials', 
    icon: Info,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30'
  },
];

const CategoryCard = ({ 
  icon: Icon, 
  title, 
  items, 
  color 
}: { 
  icon: any; 
  title: string; 
  items: string[]; 
  color: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Icon className={cn("w-4 h-4", color)} />
      <span className="font-medium text-sm">{title}</span>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <Badge key={i} variant="secondary" className="text-xs font-normal">
          {item}
        </Badge>
      ))}
    </div>
  </div>
);

export const NeighborhoodGuideSection = ({ 
  cityName, 
  guide, 
  className 
}: NeighborhoodGuideSectionProps) => {
  const [activeTab, setActiveTab] = useState('families');

  return (
    <section className={cn("py-12", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-3">
            <MapPin className="w-3 h-3 mr-1" />
            Newcomer-Guide
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Leben in {cityName}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Wichtige Infos für Ihren Neustart – speziell für Familien, Berufstätige und Expats aufbereitet.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-4 w-full mb-6">
            {tabConfig.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-1.5 text-xs sm:text-sm"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            {/* Families Tab */}
            <TabsContent value="families" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={tabConfig[0].bgColor}>
                  <CardContent className="pt-6 space-y-6">
                    {/* Highlights */}
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Heart className={cn("w-5 h-5", tabConfig[0].color)} />
                        Warum {cityName} für Familien?
                      </h3>
                      <ul className="space-y-1.5">
                        {guide.families.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className={cn("mt-1", tabConfig[0].color)}>•</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <CategoryCard 
                        icon={School} 
                        title="Schulen" 
                        items={guide.families.schools} 
                        color={tabConfig[0].color}
                      />
                      <CategoryCard 
                        icon={TreePine} 
                        title="Parks & Freizeit" 
                        items={guide.families.parks} 
                        color={tabConfig[0].color}
                      />
                      <CategoryCard 
                        icon={Baby} 
                        title="Familienfreundlich" 
                        items={guide.families.familyFriendly} 
                        color={tabConfig[0].color}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Professionals Tab */}
            <TabsContent value="professionals" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={tabConfig[1].bgColor}>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Briefcase className={cn("w-5 h-5", tabConfig[1].color)} />
                        Arbeiten in {cityName}
                      </h3>
                      <ul className="space-y-1.5">
                        {guide.professionals.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className={cn("mt-1", tabConfig[1].color)}>•</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <CategoryCard 
                        icon={Wifi} 
                        title="Coworking" 
                        items={guide.professionals.coworking} 
                        color={tabConfig[1].color}
                      />
                      <CategoryCard 
                        icon={Building2} 
                        title="Networking" 
                        items={guide.professionals.networking} 
                        color={tabConfig[1].color}
                      />
                      <CategoryCard 
                        icon={Train} 
                        title="Pendeln" 
                        items={guide.professionals.commute} 
                        color={tabConfig[1].color}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Expats Tab */}
            <TabsContent value="expats" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={tabConfig[2].bgColor}>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Globe className={cn("w-5 h-5", tabConfig[2].color)} />
                        International in {cityName}
                      </h3>
                      <ul className="space-y-1.5">
                        {guide.expats.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className={cn("mt-1", tabConfig[2].color)}>•</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <CategoryCard 
                        icon={School} 
                        title="Int. Schulen" 
                        items={guide.expats.internationalSchools} 
                        color={tabConfig[2].color}
                      />
                      <CategoryCard 
                        icon={Users} 
                        title="Expat-Gruppen" 
                        items={guide.expats.expatsGroups} 
                        color={tabConfig[2].color}
                      />
                      <CategoryCard 
                        icon={Coffee} 
                        title="Englisch-freundlich" 
                        items={guide.expats.englishFriendly} 
                        color={tabConfig[2].color}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Essentials Tab */}
            <TabsContent value="essentials" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={tabConfig[3].bgColor}>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <CategoryCard 
                        icon={Stethoscope} 
                        title="Gesundheit" 
                        items={guide.essentials.healthcare} 
                        color={tabConfig[3].color}
                      />
                      <CategoryCard 
                        icon={ShoppingCart} 
                        title="Einkaufen" 
                        items={guide.essentials.shopping} 
                        color={tabConfig[3].color}
                      />
                      <CategoryCard 
                        icon={Utensils} 
                        title="Gastronomie" 
                        items={guide.essentials.dining} 
                        color={tabConfig[3].color}
                      />
                      <CategoryCard 
                        icon={Train} 
                        title="Mobilität" 
                        items={guide.essentials.transport} 
                        color={tabConfig[3].color}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  );
};

export default NeighborhoodGuideSection;
