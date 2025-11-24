import { motion } from "framer-motion";
import { Sparkles, Clock, TrendingDown, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "1",
    icon: Sparkles,
    title: "Daten eingeben",
    description: "Zimmeranzahl, Distanz und Sonderwünsche – unsere KI braucht nur wenige Angaben.",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    number: "2",
    icon: Clock,
    title: "Preis sofort erhalten",
    description: "In Sekunden analysiert die KI Tausende Umzugsdaten und berechnet Ihren fairen Preis.",
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    number: "3",
    icon: CheckCircle2,
    title: "Umzug planen & durchführen",
    description: "Wählen Sie aus geprüften Anbietern oder fordern Sie direkt eine Offerte an.",
    color: "text-success",
    bgColor: "bg-success/10"
  }
];

export const AICalculatorExplainer = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-semibold text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span>KI-Technologie</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            So funktioniert der KI-Preisrechner
          </h2>
          <p className="text-lg text-muted-foreground">
            Transparent, präzise und in weniger als 60 Sekunden – modernste Künstliche Intelligenz für Ihren Umzug.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              <Card className="border-2 border-border hover:border-primary/30 hover-lift transition-all h-full group">
                <CardContent className="p-8 text-center relative">
                  {/* Step number badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-10 h-10 rounded-full bg-gradient-premium text-white font-bold flex items-center justify-center shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${step.bgColor} flex items-center justify-center mb-6 mt-4 group-hover:scale-110 transition-transform`}>
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {/* Arrow connector (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-primary/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Benefits Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <TrendingDown className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="font-bold text-foreground mb-1">Bis 40% günstiger</div>
                  <div className="text-sm text-muted-foreground">als der Marktdurchschnitt</div>
                </div>
                <div className="text-center">
                  <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                  <div className="font-bold text-foreground mb-1">100% transparent</div>
                  <div className="text-sm text-muted-foreground">Keine versteckten Kosten</div>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="font-bold text-foreground mb-1">Unter 60 Sekunden</div>
                  <div className="text-sm text-muted-foreground">Sofort-Ergebnis garantiert</div>
                </div>
              </div>

              <div className="text-center">
                <Button size="lg" className="shadow-lg hover:shadow-xl transition-all" asChild>
                  <Link to="/rechner">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Jetzt kostenlos berechnen
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
