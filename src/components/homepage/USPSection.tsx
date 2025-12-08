import { motion } from "framer-motion";
import { Shield, Percent, Brain, MapPin } from "lucide-react";
import { SpotlightCard, RevealOnScroll, AnimatedIcon } from "@/components/common";

const usps = [
  {
    icon: Shield,
    title: "Geprüfte Schweizer Umzugsfirmen",
    description: "Alle Partner durchlaufen unseren strengen Qualitätsprozess mit Versicherungsnachweis und Bewilligungsprüfung.",
    color: "text-green-500",
    animation: "pulse" as const,
  },
  {
    icon: Percent,
    title: "Bis zu 40% sparen",
    description: "Durch den direkten Vergleich finden Sie das beste Preis-Leistungs-Verhältnis für Ihren Umzug.",
    color: "text-secondary",
    animation: "bounce" as const,
  },
  {
    icon: Brain,
    title: "AI-gestützte Preisanalyse",
    description: "Unsere künstliche Intelligenz analysiert Ihren Umzug und findet die optimal passenden Anbieter.",
    color: "text-purple-500",
    animation: "float" as const,
  },
  {
    icon: MapPin,
    title: "Schweizweit in allen 26 Kantonen",
    description: "Ob Zürich, Genf oder Graubünden – wir haben geprüfte Partner in der ganzen Schweiz.",
    color: "text-blue-500",
    animation: "shake" as const,
  },
];

export const USPSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent pointer-events-none" />
      
      <div className="container relative">
        {/* Header */}
        <RevealOnScroll direction="up" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Warum Umzugscheck.ch?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Die führende Schweizer Plattform für Umzugsvergleiche.
          </p>
        </RevealOnScroll>

        {/* USP Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {usps.map((usp, index) => (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <SpotlightCard 
                className="h-full p-6 group" 
                spotlightColor="rgba(198, 124, 62, 0.08)"
              >
                {/* Animated Icon */}
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                  <AnimatedIcon 
                    icon={usp.icon} 
                    size={28} 
                    animation={usp.animation}
                    className={usp.color}
                  />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold mb-2 group-hover:text-secondary transition-colors">
                  {usp.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {usp.description}
                </p>
                
                {/* Decorative Line */}
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary/0 via-secondary to-secondary/0"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                />
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
