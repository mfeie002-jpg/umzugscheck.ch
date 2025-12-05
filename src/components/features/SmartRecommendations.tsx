import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  TrendingDown, 
  Clock, 
  Shield, 
  Star,
  ChevronRight,
  Lightbulb
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Recommendation {
  id: string;
  type: 'savings' | 'timing' | 'quality' | 'tip';
  title: string;
  description: string;
  impact: string;
  icon: React.ReactNode;
  actionLabel: string;
}

const recommendations: Recommendation[] = [
  {
    id: '1',
    type: 'savings',
    title: 'Mitte des Monats buchen',
    description: 'Umzüge zwischen dem 10. und 20. sind durchschnittlich 15% günstiger als zum Monatsende.',
    impact: 'Bis zu CHF 300 sparen',
    icon: <TrendingDown className="h-5 w-5 text-green-500" />,
    actionLabel: 'Termin wählen'
  },
  {
    id: '2',
    type: 'timing',
    title: 'Wochentag statt Wochenende',
    description: 'Dienstag bis Donnerstag sind die günstigsten Tage für einen Umzug.',
    impact: '10-20% Ersparnis',
    icon: <Clock className="h-5 w-5 text-blue-500" />,
    actionLabel: 'Verfügbarkeit prüfen'
  },
  {
    id: '3',
    type: 'quality',
    title: 'Top-bewertete Firmen',
    description: '3 Firmen in Ihrer Region haben über 100 positive Bewertungen.',
    impact: 'Geprüfte Qualität',
    icon: <Star className="h-5 w-5 text-yellow-500" />,
    actionLabel: 'Firmen ansehen'
  },
  {
    id: '4',
    type: 'tip',
    title: 'Versicherung inkludiert',
    description: 'Alle unsere Partner bieten eine Transportversicherung bis CHF 50\'000.',
    impact: 'Rundum geschützt',
    icon: <Shield className="h-5 w-5 text-purple-500" />,
    actionLabel: 'Mehr erfahren'
  }
];

export const SmartRecommendations = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % recommendations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="h-3 w-3 mr-1" />
            KI-Empfehlungen
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Personalisierte Tipps für Sie
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Basierend auf aktuellen Marktdaten und Ihrer Region
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`h-full transition-all duration-300 cursor-pointer ${
                  activeIndex === index 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-muted rounded-lg">
                      {rec.icon}
                    </div>
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {rec.impact}
                      </Badge>
                      <h3 className="font-semibold">{rec.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {rec.description}
                  </p>

                  <Button variant="ghost" size="sm" className="w-full group">
                    {rec.actionLabel}
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Insight Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 max-w-2xl mx-auto"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Wussten Sie schon?</h4>
                <p className="text-sm text-muted-foreground">
                  Kunden, die unseren KI-Rechner nutzen, sparen durchschnittlich 
                  <span className="font-bold text-primary"> CHF 420</span> bei ihrem Umzug.
                </p>
              </div>
              <Button>Jetzt berechnen</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
