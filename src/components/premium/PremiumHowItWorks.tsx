import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import step1Img from "@/assets/step-1-form.jpg";
import step2Img from "@/assets/step-2-analysis.jpg";
import step3Img from "@/assets/step-3-choose.jpg";

const steps = [
  {
    number: "1",
    image: step1Img,
    title: "Umzugsdetails eingeben",
    description: "Füllen Sie in nur 2 Minuten unser einfaches Formular aus: Von wo nach wo, Wohnungsgrösse und Ihr Wunschdatum.",
    highlight: "Nur 2 Minuten",
  },
  {
    number: "2",
    image: step2Img,
    title: "Wir checken für Sie",
    description: "Unser intelligentes System analysiert 200+ geprüfte Umzugsfirmen und findet die besten Partner für Ihre Anforderungen.",
    highlight: "200+ Firmen gecheckt",
  },
  {
    number: "3",
    image: step3Img,
    title: "Vergleichen & sparen",
    description: "Erhalten Sie transparente Offerten, vergleichen Sie Preise und Bewertungen – und sparen Sie bis zu 40%.",
    highlight: "Bis 40% sparen",
  }
];

export const PremiumHowItWorks = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 rounded-full text-primary font-semibold text-sm uppercase tracking-wider mb-6"
          >
            <CheckCircle2 className="h-5 w-5" />
            So funktioniert's
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-swiss-noir mb-6">
            In 3 einfachen Schritten zum perfekten Umzug
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Wir <span className="font-bold text-primary">checken</span> für Sie – kein Stress, keine endlosen Telefonate.
          </p>
        </motion.div>
        
        {/* Steps - Large Image Cards */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-10 mb-16">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="group"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-premium hover:shadow-deep transition-all duration-500 border border-border">
                {/* Large Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Step Number Overlay */}
                  <div className="absolute top-4 left-4">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {step.number}
                      </span>
                    </div>
                  </div>
                  {/* Highlight Badge */}
                  <div className="absolute bottom-4 right-4">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-sm font-bold text-secondary shadow-lg">
                      <CheckCircle2 className="h-4 w-4" />
                      {step.highlight}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                      Schritt {step.number}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-swiss-noir mb-4 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <Link to="/umzugsofferten">
            <Button size="lg" className="h-14 sm:h-16 px-8 sm:px-12 text-lg sm:text-xl font-semibold shadow-cta hover:shadow-lift transition-all group">
              <CheckCircle2 className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              Jetzt checken lassen
              <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="mt-5 text-base text-muted-foreground">
            ✓ 100% kostenlos & unverbindlich – dauert nur 2 Minuten
          </p>
        </motion.div>
      </div>
    </section>
  );
};
