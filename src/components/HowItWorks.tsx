import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, FileSearch, ThumbsUp, CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Calculator,
    number: "01",
    title: "Angaben zum Umzug machen",
    description: "Geben Sie Ihre Umzugsdetails ein – Grösse, Distanz, gewünschte Services. Dauert nur 60 Sekunden."
  },
  {
    icon: FileSearch,
    number: "02",
    title: "Angebote von Umzugsfirmen erhalten",
    description: "Erhalten Sie bis zu 5 kostenlose Offerten von geprüften Umzugsfirmen in Ihrer Region."
  },
  {
    icon: CheckCircle2,
    number: "03",
    title: "Preise & Bewertungen vergleichen",
    description: "Vergleichen Sie Preise, Kundenbewertungen und Services transparent nebeneinander."
  },
  {
    icon: ThumbsUp,
    number: "04",
    title: "Umzugsfirma auswählen und umziehen",
    description: "Buchen Sie direkt die beste Firma für Ihren Umzug und lehnen Sie sich entspannt zurück."
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="mb-4">So einfach geht's</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            In nur 3 Schritten zur perfekten Umzugsfirma – transparent, einfach und kostenlos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line - Desktop Only */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-border">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-accent rounded-full"></div>
                </div>
              )}

              <div className="relative z-10 text-center">
                {/* Number Badge */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light text-primary text-2xl font-bold mb-4">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-hero shadow-medium mb-6">
                  <step.icon className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link to="/rechner">
            <Button size="lg" className="group shadow-accent">
              Jetzt Umzugskosten berechnen
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
