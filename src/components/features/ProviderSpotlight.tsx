import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Award, 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  ChevronRight,
  TrendingUp,
  Users
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SpotlightProvider {
  id: string;
  name: string;
  logo?: string;
  rating: number;
  reviews: number;
  regions: string[];
  highlight: string;
  stats: {
    movesThisMonth: number;
    responseTime: string;
    satisfactionRate: number;
  };
  badge: 'trending' | 'top-rated' | 'new' | 'eco';
}

const spotlightProviders: SpotlightProvider[] = [
  {
    id: '1',
    name: 'SwissMove Excellence',
    rating: 4.9,
    reviews: 428,
    regions: ['Zürich', 'Aargau', 'Zug'],
    highlight: 'Schnellste Antwortzeit im November',
    stats: {
      movesThisMonth: 47,
      responseTime: '23 min',
      satisfactionRate: 98
    },
    badge: 'trending'
  },
  {
    id: '2',
    name: 'Green Moving Co.',
    rating: 4.8,
    reviews: 312,
    regions: ['Bern', 'Solothurn', 'Fribourg'],
    highlight: '100% elektrische Fahrzeugflotte',
    stats: {
      movesThisMonth: 35,
      responseTime: '45 min',
      satisfactionRate: 96
    },
    badge: 'eco'
  },
  {
    id: '3',
    name: 'Premium Relocations',
    rating: 5.0,
    reviews: 156,
    regions: ['Genf', 'Waadt', 'Wallis'],
    highlight: 'Perfekte 5-Sterne Bewertung',
    stats: {
      movesThisMonth: 28,
      responseTime: '15 min',
      satisfactionRate: 100
    },
    badge: 'top-rated'
  }
];

const getBadgeConfig = (badge: string) => {
  switch (badge) {
    case 'trending':
      return { icon: TrendingUp, label: 'Trending', color: 'bg-orange-500' };
    case 'top-rated':
      return { icon: Award, label: 'Top Bewertet', color: 'bg-yellow-500' };
    case 'new':
      return { icon: Star, label: 'Neu', color: 'bg-blue-500' };
    case 'eco':
      return { icon: Shield, label: 'Öko', color: 'bg-green-500' };
    default:
      return { icon: Star, label: '', color: 'bg-muted' };
  }
};

export const ProviderSpotlight = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % spotlightProviders.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const activeProvider = spotlightProviders[activeIndex];
  const badgeConfig = getBadgeConfig(activeProvider.badge);
  const BadgeIcon = badgeConfig.icon;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge className="mb-2">
              <Award className="h-3 w-3 mr-1" />
              Provider Spotlight
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold">
              Empfohlene Umzugsfirmen
            </h2>
          </div>
          <div className="hidden md:flex gap-2">
            {spotlightProviders.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex ? 'bg-primary w-8' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeProvider.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-3">
                  {/* Left Column - Provider Info */}
                  <div className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-primary/10">
                    <Badge className={`${badgeConfig.color} mb-4`}>
                      <BadgeIcon className="h-3 w-3 mr-1" />
                      {badgeConfig.label}
                    </Badge>
                    
                    <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {activeProvider.name.charAt(0)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{activeProvider.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(activeProvider.rating)
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{activeProvider.rating}</span>
                      <span className="text-muted-foreground text-sm">
                        ({activeProvider.reviews} Bewertungen)
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {activeProvider.regions.map((region) => (
                        <Badge key={region} variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {region}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground italic">
                      "{activeProvider.highlight}"
                    </p>
                  </div>

                  {/* Middle Column - Stats */}
                  <div className="p-6 md:p-8 border-x border-border">
                    <h4 className="font-semibold mb-6">Aktuelle Statistiken</h4>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                          <Users className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {activeProvider.stats.movesThisMonth}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Umzüge diesen Monat
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-xl">
                          <Clock className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {activeProvider.stats.responseTime}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Ø Antwortzeit
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/10 rounded-xl">
                          <Star className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {activeProvider.stats.satisfactionRate}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Zufriedenheitsrate
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - CTA */}
                  <div className="p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-background to-muted/30">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Shield className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">
                        Geprüft & Empfohlen
                      </h4>
                      <p className="text-sm text-muted-foreground mb-6">
                        Diese Firma wurde von uns persönlich geprüft und erfüllt höchste Qualitätsstandards.
                      </p>
                      <Button className="w-full group">
                        Offerte anfordern
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <p className="text-xs text-muted-foreground mt-3">
                        Kostenlos & unverbindlich
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Mobile Dots */}
        <div className="flex md:hidden justify-center gap-2 mt-4">
          {spotlightProviders.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex ? 'bg-primary w-6' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
