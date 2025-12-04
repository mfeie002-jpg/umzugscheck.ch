/**
 * WhyUsSection - Key benefits and USPs with green checkmarks
 * Builds trust and highlights platform advantages
 */

import { motion } from "framer-motion";
import { Clock, Scale, Shield, MapPin, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: Clock,
    title: "Zeit sparen",
    description: "Ein Formular statt dutzende Telefonate und E-Mails. Erhalten Sie mehrere Angebote mit nur einer Anfrage.",
    checkmark: "Mehrere Offerten mit nur einer Anfrage",
  },
  {
    icon: Scale,
    title: "Fairer Marktvergleich",
    description: "Vergleichen Sie Preise und Leistungen verschiedener Anbieter transparent nebeneinander.",
    checkmark: "Transparente Angebote ohne versteckte Kosten",
  },
  {
    icon: Shield,
    title: "Geprüfte Anbieter",
    description: "Alle Umzugsfirmen durchlaufen unseren Qualitätscheck. Sie erhalten nur seriöse Angebote.",
    checkmark: "Nur Firmen, die unseren Kriterien entsprechen",
  },
  {
    icon: MapPin,
    title: "Schweizer Fokus",
    description: "Lokale Expertise in allen 26 Kantonen. Anbieter kennen die regionalen Gegebenheiten.",
    checkmark: "Angebote aus Ihrer Region, in Ihrer Sprache",
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Warum Umzugsofferten über umzugscheck.ch vergleichen?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Wir machen den Umzugsvergleich einfach, transparent und effizient.
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {benefit.description}
                  </p>
                  <div className="flex items-start gap-2 pt-3 border-t border-border">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-foreground">
                      {benefit.checkmark}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
