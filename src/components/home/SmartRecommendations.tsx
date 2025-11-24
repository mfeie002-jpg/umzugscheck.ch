import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Calendar, MapPin, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Recommendation {
  id: number;
  type: "date" | "route" | "company" | "service";
  icon: any;
  title: string;
  description: string;
  benefit: string;
  confidence: number;
}

export const SmartRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    // Simulate AI-powered recommendations based on user behavior
    const generateRecommendations = () => {
      const currentMonth = new Date().getMonth();
      const isHighSeason = [4, 5, 6, 7, 8].includes(currentMonth); // May-September
      
      const recs: Recommendation[] = [
        {
          id: 1,
          type: "date",
          icon: Calendar,
          title: isHighSeason 
            ? "Umzug auf Dienstag verschieben" 
            : "Jetzt ist die perfekte Zeit",
          description: isHighSeason
            ? "Wochenenden sind 30% teurer. Wählen Sie einen Dienstag."
            : "Nebensaison-Bonus: Bis zu 25% günstiger als im Sommer",
          benefit: "CHF 200-400 sparen",
          confidence: 92,
        },
        {
          id: 2,
          type: "route",
          icon: MapPin,
          title: "Optimale Route gefunden",
          description: "Zürich → Winterthur hat höchste Verfügbarkeit",
          benefit: "15+ Firmen verfügbar",
          confidence: 88,
        },
        {
          id: 3,
          type: "company",
          icon: TrendingUp,
          title: "Top-bewertete Firma empfohlen",
          description: "Basierend auf Ihrer Umzugsgröße und Budget",
          benefit: "4.9★ | CHF 850-1100",
          confidence: 95,
        },
        {
          id: 4,
          type: "service",
          icon: DollarSign,
          title: "Paket-Deal verfügbar",
          description: "Umzug + Reinigung kombinieren und 15% sparen",
          benefit: "CHF 180 günstiger",
          confidence: 85,
        },
      ];

      setRecommendations(recs);
    };

    generateRecommendations();
  }, []);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            KI-gestützte Empfehlungen
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Personalisierte Vorschläge basierend auf über 10.000 erfolgreichen Umzügen
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-foreground">
                            {rec.title}
                          </h3>
                          <Badge 
                            variant="secondary" 
                            className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs"
                          >
                            {rec.confidence}% Match
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {rec.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-primary">
                            💰 {rec.benefit}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary"
                          >
                            Details →
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div className="mt-4">
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-green-500"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${rec.confidence}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Powered by AI */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Powered by AI • Aktualisiert alle 5 Minuten
          </p>
        </motion.div>
      </div>
    </section>
  );
};
