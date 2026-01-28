import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Truck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

const AvailabilityChecker = () => {
  const currentMonth = new Date().toLocaleString('de-CH', { month: 'long', year: 'numeric' });
  
  const availability = [
    { week: "Diese Woche", slots: 2, status: "limited" },
    { week: "Nächste Woche", slots: 5, status: "available" },
    { week: "In 2 Wochen", slots: 8, status: "available" },
    { week: "In 3 Wochen", slots: 10, status: "available" },
  ];

  return (
    <section className="py-12 lg:py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest/10 text-forest text-sm font-semibold mb-3">
                <Calendar className="h-4 w-4" />
                Verfügbarkeit {currentMonth}
              </div>
              <h3 className="text-xl lg:text-2xl font-display font-bold mb-2">
                Freie Termine prüfen
              </h3>
              <p className="text-muted-foreground text-sm">
                Sichern Sie sich jetzt Ihren Wunschtermin
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {availability.map((item, index) => (
                <motion.div
                  key={index}
                  className={`px-4 py-3 rounded-xl border ${
                    item.status === 'limited' 
                      ? 'border-warm/30 bg-warm/5' 
                      : 'border-forest/30 bg-forest/5'
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <p className="font-medium text-sm">{item.week}</p>
                  <p className={`text-xs ${
                    item.status === 'limited' ? 'text-warm' : 'text-forest'
                  }`}>
                    {item.slots} {item.status === 'limited' ? 'wenige' : 'freie'} Termine
                  </p>
                </motion.div>
              ))}
            </div>

            <Link to="/contact">
              <Button className="bg-gradient-hero">
                Termin reservieren
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default AvailabilityChecker;
