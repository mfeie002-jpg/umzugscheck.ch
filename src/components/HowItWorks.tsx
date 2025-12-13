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
    <section id="how-it-works" className="py-20 md:py-28 bg-gradient-to-b from-secondary/20 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-success/10 px-4 py-2 rounded-full text-sm font-semibold text-success mb-6 border border-success/20">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
            <span>Einfacher Prozess</span>
          </div>
          <h2 className="mb-6 text-foreground">So einfach geht's</h2>
          <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            In nur <strong className="text-foreground">4 Schritten</strong> zur perfekten Umzugsfirma – 
            transparent, einfach und 100% kostenlos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 max-w-6xl mx-auto mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line - Desktop Only */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-[55%] w-[90%] h-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full shadow-medium"></div>
                </div>
              )}

              <div className="relative z-10 text-center group">
                {/* Number Badge with gradient */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-premium text-white text-2xl font-bold mb-6 shadow-medium group-hover:scale-110 transition-transform">
                  {step.number}
                </div>

                {/* Icon with enhanced styling */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-card border-2 border-primary/20 shadow-soft mb-6 group-hover:border-primary/40 group-hover:shadow-medium transition-all">
                  <step.icon className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold mb-4 group-hover:text-primary transition-colors text-foreground">{step.title}</h3>
                <p className="text-foreground/70 leading-relaxed text-base">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA with additional trust signals */}
        <div className="text-center">
          <Link to="/umzugsofferten" className="w-full">
            <Button size="lg" className="w-full group shadow-accent h-12 sm:h-14 px-4 sm:px-8 text-sm sm:text-lg hover-shine hover:scale-105 transition-all">
              <span className="hidden sm:inline">Jetzt kostenlos Umzugskosten berechnen</span>
              <span className="sm:hidden">Kostenlos berechnen</span>
              <ArrowRight className="ml-2 w-4 h-4 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-sm text-foreground/70 mt-4 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            Keine Anmeldung erforderlich • Dauert nur 2 Minuten
          </p>
        </div>
      </div>
    </section>
  );
};
