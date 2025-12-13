import { Shield, Zap, Award, TrendingDown, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const usps = [
  {
    icon: Shield,
    title: "100% kostenlos",
    description: "Unverbindliche Offerten ohne versteckte Kosten"
  },
  {
    icon: Zap,
    title: "In 2 Minuten",
    description: "Schnell ausfüllen, innerhalb 24h Angebote"
  },
  {
    icon: Award,
    title: "Geprüfte Qualität",
    description: "Nur versicherte und zertifizierte Firmen"
  },
  {
    icon: TrendingDown,
    title: "Bis 40% sparen",
    description: "Durch direkten Preisvergleich"
  }
];

export const USPGrid = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3">
            Warum umzugscheck.ch?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Die clevere Art, Umzugskosten zu vergleichen
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mb-8">
          {usps.map((usp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 shadow-soft hover:shadow-medium transition-all border border-border/50 text-center"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3 md:mb-4 mx-auto">
                <usp.icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
              </div>
              <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2">{usp.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{usp.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/umzugsrechner">
            <Button size="lg" className="h-12 md:h-14 px-6 md:px-10 text-sm md:text-lg font-bold shadow-strong">
              <CheckCircle className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Jetzt vergleichen
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
