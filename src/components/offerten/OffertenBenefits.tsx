import { Percent, CalendarClock, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { SmartCTAButton } from "@/components/conversion/SmartCTAButton";

const benefits = [
  {
    icon: Percent,
    title: "Preisvorteil",
    description: "Sie erhalten mehrere Offerten und sehen sofort, welche Firma das beste Preis-Leistungs-Verhältnis bietet.",
  },
  {
    icon: CalendarClock,
    title: "Schnelle Terminfindung",
    description: "Sie geben Wunschdatum und Flexibilität an, wir zeigen Ihnen passende Firmen mit freien Kapazitäten.",
  },
  {
    icon: ShieldCheck,
    title: "Seriöse Anbieter",
    description: "Nur geprüfte und bewertete Umzugsfirmen, damit Sie keine bösen Überraschungen erleben.",
  },
  {
    icon: Sparkles,
    title: "Bessere Qualität",
    description: "Erfahrungen anderer Kunden helfen Ihnen, die Firma mit der besten Servicequalität zu wählen.",
  },
];

const OffertenBenefits = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-manrope text-3xl md:text-4xl font-bold text-foreground mb-4">
            Warum Umzugsofferten über umzugscheck.ch vergleichen?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Profitieren Sie von unserer Erfahrung und unserem Netzwerk geprüfter Umzugsfirmen.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-manrope text-xl font-semibold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 max-w-md mx-auto"
        >
          <SmartCTAButton 
            to="/umzugsofferten" 
            location="offerten-benefits" 
            size="xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default OffertenBenefits;
