import { Phone, FileText, Truck, Home, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import SectionBadge from "@/components/SectionBadge";
import { trackCtaClick } from "@/hooks/useCtaTracking";

const ProcessSection = () => {
  const steps = [
    {
      number: "1",
      icon: Phone,
      title: "Kontakt aufnehmen",
      description: "Rufen Sie uns an oder füllen Sie unser Formular aus. Wir melden uns innerhalb von 24 Stunden.",
    },
    {
      number: "2",
      icon: FileText,
      title: "Kostenlose Besichtigung",
      description: "Wir besichtigen Ihre Wohnung und erstellen ein detailliertes, unverbindliches Angebot.",
    },
    {
      number: "3",
      icon: Truck,
      title: "Umzugstag",
      description: "Unser Team packt, transportiert und stellt alles auf. Sie müssen sich um nichts kümmern.",
    },
    {
      number: "4",
      icon: Home,
      title: "Willkommen Zuhause",
      description: "Sie geniessen Ihr neues Zuhause – wir räumen auf und sind bei Bedarf weiterhin für Sie da.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-8 sm:mb-10 lg:mb-12 space-y-2 sm:space-y-3">
          <SectionBadge variant="alpine">So einfach geht's</SectionBadge>
          <h2 className="text-balance font-display mt-3 sm:mt-4 px-2">
            In 4 Schritten zum <span className="text-gradient">stressfreien Umzug</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Wir machen Ihren Umzug so einfach wie möglich.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {steps.map((step, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="relative text-center">
                {/* Connector line - only desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-alpine/30 to-alpine/10" />
                )}
                
                {/* Step icon */}
                <div className="relative inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-hero mb-3 sm:mb-4 shadow-medium hover:scale-105 transition-transform">
                  <step.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-primary-foreground" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-warm text-warm-foreground text-xs font-bold flex items-center justify-center shadow-md">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold mb-1.5 sm:mb-2 font-display leading-tight">{step.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link to="/contact" className="w-full sm:w-auto touch-manipulation" onClick={() => trackCtaClick('Jetzt Offerte anfragen', 'process')}>
              <Button size="lg" className="w-full sm:w-auto bg-gradient-hero text-primary-foreground hover:opacity-90 shadow-medium min-h-[48px] text-sm sm:text-base group">
                Jetzt Offerte anfragen
                <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="tel:+41765681302" className="w-full sm:w-auto touch-manipulation" onClick={() => trackCtaClick('Anrufen', 'process')}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 min-h-[48px] text-sm sm:text-base">
                <Phone className="mr-1.5 sm:mr-2 h-4 w-4" />
                +41 76 568 13 02
              </Button>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ProcessSection;
