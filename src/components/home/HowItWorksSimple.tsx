import { Clock, Users, Percent, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "1",
    title: "Umzugsdetails eingeben",
    description: "Füllen Sie in nur 2 Minuten unser einfaches Formular aus: Von wo nach wo, Wohnungsgrösse und Ihr Wunschdatum.",
    imageUrl: "https://images.unsplash.com/photo-1554224311-beee460c201f?w=800&auto=format&fit=crop",
    badge: "Nur 2 Minuten",
    badgeIcon: Clock,
  },
  {
    number: "2",
    title: "Wir checken für Sie",
    description: "Unser intelligentes System analysiert 200+ geprüfte Umzugsfirmen und findet die besten Partner für Ihre Anforderungen.",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop",
    badge: "200+ Firmen geprüft",
    badgeIcon: Users,
  },
  {
    number: "3",
    title: "Vergleichen & sparen",
    description: "Erhalten Sie transparente Offerten, vergleichen Sie Preise und Bewertungen – und sparen Sie bis zu 40%.",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop",
    badge: "Bis 40% sparen",
    badgeIcon: Percent,
  },
];

export const HowItWorksSimple = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/20 via-background to-secondary/10">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Wie funktioniert es?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            In 3 einfachen Schritten zur besten Umzugsfirma – transparent, schnell und bis zu 40% günstiger
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group"
            >
              <div className="bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={step.imageUrl} 
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Number Badge - Top Left */}
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-foreground/90 text-background text-2xl font-bold flex items-center justify-center shadow-lg">
                    {step.number}
                  </div>

                  {/* Highlight Badge - Bottom Right */}
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                      <step.badgeIcon className="h-4 w-4 text-primary" />
                      <span className="text-foreground text-sm font-semibold">{step.badge}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Schritt {step.number}
                  </p>
                  <h3 className="text-xl lg:text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/umzugsofferten">
            <Button size="lg" className="text-lg px-8 py-6">
              Jetzt kostenlos starten
              <CheckCircle className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            ⏱️ Dauert nur 2 Minuten · 🔒 100% kostenlos & unverbindlich · ⭐ Über 15'000 zufriedene Kunden
          </p>
        </motion.div>
      </div>
    </section>
  );
};
