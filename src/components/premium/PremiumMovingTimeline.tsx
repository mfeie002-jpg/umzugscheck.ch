import { motion } from "framer-motion";
import { Calendar, FileText, Truck, Key, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const timelineSteps = [
  {
    icon: Calendar,
    title: "8 Wochen vorher",
    tasks: ["Umzugstermin festlegen", "Offerten vergleichen", "Umzugsfirma buchen"],
    color: "bg-blue-500",
  },
  {
    icon: FileText,
    title: "4 Wochen vorher",
    tasks: ["Adressänderungen melden", "Versicherungen informieren", "Verpackungsmaterial besorgen"],
    color: "bg-purple-500",
  },
  {
    icon: Truck,
    title: "1 Woche vorher",
    tasks: ["Möbel abbauen", "Kartons packen", "Wertgegenstände sichern"],
    color: "bg-orange-500",
  },
  {
    icon: Key,
    title: "Umzugstag",
    tasks: ["Zählerstände ablesen", "Wohnung übergeben", "Schlüssel übergeben"],
    color: "bg-green-500",
  },
];

export const PremiumMovingTimeline = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Clock className="w-4 h-4" />
            Umzugs-Timeline
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ihr Umzug Schritt für Schritt
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Mit unserer Timeline behalten Sie den Überblick und vergessen nichts
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-orange-500 to-green-500 rounded-full" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {timelineSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border h-full">
                    {/* Icon */}
                    <div className={`w-10 h-10 md:w-14 md:h-14 ${step.color} rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 shadow-lg`}>
                      <step.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                    </div>

                    {/* Timeline dot for desktop */}
                    <div className={`hidden md:block absolute top-[5.5rem] left-1/2 -translate-x-1/2 w-4 h-4 ${step.color} rounded-full border-4 border-background shadow-lg`} />

                    <h3 className="font-bold text-sm md:text-lg mb-2 md:mb-3">{step.title}</h3>

                    <ul className="space-y-1 md:space-y-2">
                      {step.tasks.map((task) => (
                        <li key={task} className="flex items-start gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
                          <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground mb-6">
              Planen Sie Ihren Umzug noch detaillierter mit unserer interaktiven Checkliste
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/umzug-planen/checkliste">
                  Zur Umzugs-Checkliste
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/umzugsofferten">
                  Jetzt Offerten erhalten
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
