import { Card, CardContent } from "@/components/ui/card";
import { Star, DollarSign, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Star,
    title: "Geprüfte Qualität",
    description: "Nur verifizierte & bewertete Schweizer Umzugsfirmen",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: DollarSign,
    title: "100% Kostenlos",
    description: "Du zahlst nichts. Die Firmen bewerben sich bei dir",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Schnell & unkompliziert",
    description: "Offerten in Minuten statt Tagen",
    gradient: "from-blue-500 to-purple-500",
  },
];

export const WhyUsCards = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Warum Umzugscheck.ch?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-strong transition-all duration-300 hover:-translate-y-2 border-border/50">
                  <CardContent className="p-8 space-y-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-medium mb-2`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
