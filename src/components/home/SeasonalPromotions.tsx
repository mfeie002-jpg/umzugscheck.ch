import { motion } from "framer-motion";
import { Percent, Clock, TrendingDown, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const promotions = [
  {
    icon: Percent,
    badge: "Winteraktion",
    title: "15% Rabatt auf Umzüge",
    description: "Nutzen Sie die ruhige Wintersaison für günstige Umzugspreise",
    validUntil: "Gültig bis 31. März 2025",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Clock,
    badge: "Wochentags-Special",
    title: "10% günstiger Mo-Do",
    description: "Sparen Sie mit Umzügen unter der Woche",
    validUntil: "Dauerhafte Aktion",
    color: "from-green-500 to-green-600",
  },
  {
    icon: TrendingDown,
    badge: "Frühbucher",
    title: "Bis zu 20% sparen",
    description: "Buchen Sie 4+ Wochen im Voraus",
    validUntil: "Für alle Termine verfügbar",
    color: "from-purple-500 to-purple-600",
  },
];

export const SeasonalPromotions = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Aktuelle Angebote</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sparen Sie bei Ihrem Umzug
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nutzen Sie unsere saisonalen Angebote und Spezialaktionen
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {promotions.map((promo, index) => {
            const Icon = promo.icon;
            return (
              <motion.div
                key={promo.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 border-primary/20 hover:border-primary/40 overflow-hidden group">
                  <div className={`h-2 bg-gradient-to-r ${promo.color}`} />
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${promo.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {promo.badge}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {promo.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {promo.description}
                    </p>
                    
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-3">
                        {promo.validUntil}
                      </p>
                      
                      <Link to="/rechner">
                        <Button 
                          variant="outline" 
                          className="w-full border-primary/30 hover:bg-primary/5"
                        >
                          Jetzt profitieren
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                💡 Spartipp: Kombinieren Sie mehrere Angebote!
              </h3>
              <p className="text-muted-foreground mb-6">
                Buchen Sie einen Winterumzug unter der Woche als Frühbucher und sparen Sie bis zu 35%
              </p>
              <Link to="/rechner">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                  Jetzt Ersparnis berechnen
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
