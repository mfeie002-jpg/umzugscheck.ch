import { ArrowRight, CheckCircle2, ChevronRight, Star, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import step1Img from "@/assets/step-1-form.jpg";
import step2Img from "@/assets/step-2-analysis.jpg";
import step3Img from "@/assets/step-3-choose.jpg";
import { isScreenshotRenderMode } from "@/lib/screenshot-render-mode";

const steps = [
  {
    number: "1",
    image: step1Img,
    title: "Umzugsdetails eingeben",
    description: "Füllen Sie in nur 2 Minuten unser einfaches Formular aus: Von wo nach wo, Wohnungsgrösse und Ihr Wunschdatum.",
    highlight: "Nur 2 Minuten",
    highlightColor: "text-primary",
  },
  {
    number: "2",
    image: step2Img,
    title: "Wir checken für Sie",
    description: "Unser intelligentes System analysiert 200+ geprüfte Umzugsfirmen und findet die besten Partner für Ihre Anforderungen.",
    highlight: "200+ Firmen gecheckt",
    highlightColor: "text-primary",
  },
  {
    number: "3",
    image: step3Img,
    title: "Vergleichen & sparen",
    description: "Erhalten Sie transparente Offerten, vergleichen Sie Preise und Bewertungen – und sparen Sie bis zu 40%.",
    highlight: "Bis 40% sparen",
    highlightColor: "text-secondary",
  }
];

const socialProof = [
  { icon: Users, value: "15'000+", label: "zufriedene Kunden" },
  { icon: Star, value: "4.9/5", label: "Kundenbewertung" },
  { icon: Shield, value: "200+", label: "geprüfte Firmen" },
];

export const PremiumHowItWorks = () => {
  const isScreenshot = isScreenshotRenderMode();
  
  return (
    <section className="py-12 md:py-16 bg-muted/30 overflow-hidden" aria-labelledby="how-it-works-heading">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={isScreenshot ? false : { opacity: 0, y: 15 }}
          whileInView={isScreenshot ? undefined : { opacity: 1, y: 0 }}
          animate={isScreenshot ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10 md:mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-primary font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3">
            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            So funktioniert's
          </span>
          <h2 id="how-it-works-heading" className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            In 3 Schritten zum perfekten Umzug
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            Wir <span className="font-bold text-primary">checken</span> für Sie – kein Stress, keine endlosen Telefonate.
          </p>
        </motion.div>
        
        {/* Steps Grid with Arrows */}
        <div className="relative grid md:grid-cols-3 gap-6 md:gap-4 lg:gap-6 mb-10">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={isScreenshot ? false : { opacity: 0, y: 30 }}
              whileInView={isScreenshot ? undefined : { opacity: 1, y: 0 }}
              animate={isScreenshot ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="group relative"
            >
              {/* Arrow between steps (desktop only) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-2 lg:-right-3 top-1/3 z-10 transform translate-x-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 + idx * 0.2 }}
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-secondary shadow-lg flex items-center justify-center"
                  >
                    <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </motion.div>
                </div>
              )}
              
              <div className="bg-card rounded-2xl overflow-hidden shadow-medium hover:shadow-premium transition-all duration-400 border border-border/50 h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                    width={400}
                    height={250}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Step Number */}
                  <div className="absolute top-3 left-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-card rounded-xl shadow-lg flex items-center justify-center border-2 border-primary/20">
                      <span className="text-lg sm:text-xl font-bold text-primary">
                        {step.number}
                      </span>
                    </div>
                  </div>
                  {/* Highlight Badge */}
                  <div className="absolute bottom-3 right-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1.5 bg-card/95 backdrop-blur-sm rounded-full text-xs font-bold ${step.highlightColor} shadow-lg`}>
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      {step.highlight}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5 sm:p-6 flex-grow">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Schritt {step.number}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Trust Bar */}
        <motion.div
          initial={isScreenshot ? false : { opacity: 0, y: 20 }}
          whileInView={isScreenshot ? undefined : { opacity: 1, y: 0 }}
          animate={isScreenshot ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-12 mb-10 py-6 px-4 bg-card/50 rounded-2xl border border-border/30"
        >
          {socialProof.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-foreground">{item.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{item.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* CTA */}
        <motion.div
          initial={isScreenshot ? false : { opacity: 0, y: 15 }}
          whileInView={isScreenshot ? undefined : { opacity: 1, y: 0 }}
          animate={isScreenshot ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="text-center"
        >
          <Link to="/umzugsofferten">
            <Button size="lg" className="h-11 sm:h-12 md:h-14 px-5 sm:px-8 md:px-10 text-sm sm:text-base md:text-lg font-semibold shadow-cta hover:shadow-lift transition-all group">
              <CheckCircle2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              Jetzt checken lassen
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
          </Link>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground">
            100% kostenlos & unverbindlich – dauert nur 2 Minuten
          </p>
        </motion.div>
      </div>
    </section>
  );
};
