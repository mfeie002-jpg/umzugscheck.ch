import { motion } from "framer-motion";
import { Flag, Clock, Shield, Heart } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const values = [
  {
    icon: Flag,
    title: "100% Schweizer",
    description: "Lokales Team, faire Löhne, Schweizer Qualitätsstandards",
  },
  {
    icon: Clock,
    title: "Schweizer Pünktlichkeit",
    description: "Wir kommen, wann wir sagen – auf die Minute genau",
  },
  {
    icon: Shield,
    title: "Schweizer Sorgfalt",
    description: "Präzision und Ordnung in jedem Handgriff",
  },
  {
    icon: Heart,
    title: "Persönlicher Service",
    description: "Keine Callcenter – direkter Kontakt mit Ihrem Team",
  },
];

const WhySwiss = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-red-50 to-background dark:from-red-950/10 dark:to-background">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full mb-4">
              <Flag className="w-4 h-4" />
              <span className="font-medium">Swiss Made</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Warum Schweizer Qualität?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Als Schweizer Familienunternehmen leben wir die Werte, 
              die unser Land weltweit bekannt gemacht haben.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 border border-border hover:border-red-200 dark:hover:border-red-800 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <value.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySwiss;
