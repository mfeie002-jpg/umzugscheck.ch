import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Clock, Shield, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

const QuoteSteps = () => {
  const steps = [
    { step: "1", text: "Formular ausfüllen", time: "2 Min." },
    { step: "2", text: "Wir melden uns", time: "24h" },
    { step: "3", text: "Kostenlose Besichtigung", time: "Optional" },
    { step: "4", text: "Verbindliche Offerte", time: "Festpreis" },
  ];

  return (
    <section className="py-12 lg:py-16 bg-alpine/5 border-y border-alpine/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-xl lg:text-2xl font-display font-bold mb-2">
                So einfach geht's zur Offerte
              </h3>
              <p className="text-muted-foreground text-sm">
                Kostenlos, unverbindlich und innerhalb von 24 Stunden
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {steps.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-8 rounded-full bg-alpine text-alpine-foreground flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block mx-2" />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3">
              <Link to="/contact">
                <Button className="bg-gradient-hero">
                  Jetzt starten
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="tel:+41765681302">
                <Button variant="outline" className="border-2">
                  <Phone className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default QuoteSteps;
