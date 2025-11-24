import { motion } from "framer-motion";
import { Calculator, Search, FileText, Truck, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const timelineSteps = [
  {
    icon: Calculator,
    title: "1. KI-Preisrechner nutzen",
    description: "Geben Sie Ihre Umzugsdetails ein und erhalten Sie sofort eine präzise Kostenschätzung",
    time: "< 2 Minuten",
  },
  {
    icon: Search,
    title: "2. Angebote vergleichen",
    description: "Erhalten Sie passende Angebote von geprüften Umzugsfirmen in Ihrer Region",
    time: "Innerhalb 24h",
  },
  {
    icon: FileText,
    title: "3. Firma auswählen",
    description: "Wählen Sie das beste Angebot basierend auf Preis, Bewertungen und Verfügbarkeit",
    time: "Nach Ihrem Tempo",
  },
  {
    icon: Truck,
    title: "4. Stressfrei umziehen",
    description: "Unsere Profis kümmern sich um alles – von der Verpackung bis zur Möbelmontage",
    time: "Am Umzugstag",
  },
  {
    icon: CheckCircle,
    title: "5. Geschafft!",
    description: "Entspannen Sie sich in Ihrem neuen Zuhause – wir erledigen den Rest",
    time: "Mission erfüllt",
  },
];

export const ProcessTimeline = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/20 to-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            So einfach geht's
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            In 5 einfachen Schritten zum erfolgreichen Umzug
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {timelineSteps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === timelineSteps.length - 1;
            
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="flex items-start gap-6 mb-8">
                  {/* Icon and line */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    {!isLast && (
                      <div className="w-1 h-24 bg-gradient-to-b from-primary to-primary/30 mt-4" />
                    )}
                  </div>

                  {/* Content */}
                  <Card className="flex-1 hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 bg-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                        <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
