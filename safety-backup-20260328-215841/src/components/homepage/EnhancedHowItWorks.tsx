import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Search, BadgeCheck, ArrowRight, ChevronLeft, ChevronRight, Users, Star, Shield, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
// Step screenshots
import step1Img from '@/assets/step-1-form.jpg';
import step2Img from '@/assets/step-2-analysis.jpg';
import step3Img from '@/assets/step-3-choose.jpg';

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Umzugsdetails eingeben',
    description: 'Start- und Zielort, Wohnungsgrösse – in unter 2 Minuten ausgefüllt. Kein Video nötig.',
    color: 'text-primary',
    bg: 'bg-primary/10',
    borderColor: 'border-primary/30',
    image: step1Img,
    badge: 'Nur 2 Minuten',
    badgeIcon: Clock,
  },
  {
    number: '02',
    icon: Search,
    title: 'Wir finden passende Firmen',
    description: 'Unser System vergleicht automatisch 200+ geprüfte Umzugsfirmen für Ihre Route und Anforderungen.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    borderColor: 'border-secondary/30',
    image: step2Img,
    badge: '200+ Firmen gecheckt',
    badgeIcon: CheckCircle,
  },
  {
    number: '03',
    icon: BadgeCheck,
    title: 'Offerten erhalten & sparen',
    description: 'Innerhalb von 24–48 Stunden erhalten Sie 3–5 Offerten per E-Mail. Sie vergleichen und wählen.',
    color: 'text-green-600',
    bg: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    image: step3Img,
    badge: 'Bis 40% sparen',
    badgeIcon: CheckCircle,
  },
];

const trustStats = [
  { icon: Users, value: "15'000+", label: "Kunden" },
  { icon: Star, value: "4.9/5", label: "Bewertung" },
  { icon: Shield, value: "200+", label: "Firmen" },
];

export const EnhancedHowItWorks = memo(function EnhancedHowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      setActiveStep(index);
    }
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToStep(activeStep + 1),
    onSwipedRight: () => goToStep(activeStep - 1),
    trackMouse: false,
    trackTouch: true,
  });

  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs sm:text-sm font-medium text-primary bg-primary/10 px-3 sm:px-4 py-1.5 rounded-full mb-3 sm:mb-4"
          >
            So funktioniert's
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4"
          >
            In 3 einfachen Schritten zur besten Offerte
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4"
          >
            Kostenlos, unverbindlich und in wenigen Minuten erledigt
          </motion.p>
        </div>

        {/* Mobile Carousel with Images */}
        <div className="md:hidden">
          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((step, index) => (
              <button
                key={step.number}
                onClick={() => setActiveStep(index)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  activeStep === index
                    ? cn(step.bg, step.color, "ring-2 ring-offset-2", step.borderColor.replace('border', 'ring'))
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.number}
              </button>
            ))}
          </div>

          {/* Swipeable Card WITH IMAGE */}
          <div {...swipeHandlers} className="relative px-4 touch-pan-y">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img 
                    src={steps[activeStep].image} 
                    alt={steps[activeStep].title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Step Number Badge - Top Left */}
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-lg bg-foreground/90 text-background text-lg font-bold flex items-center justify-center shadow-lg">
                    {activeStep + 1}
                  </div>

                  {/* Highlight Badge - Bottom Right */}
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                      {(() => {
                        const BadgeIcon = steps[activeStep].badgeIcon;
                        return <BadgeIcon className="h-3.5 w-3.5 text-green-600" />;
                      })()}
                      <span className="text-foreground text-xs font-semibold">{steps[activeStep].badge}</span>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5 text-center">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Schritt {activeStep + 1}
                  </p>
                  <h3 className="text-lg font-bold mb-2">{steps[activeStep].title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {steps[activeStep].description}
                  </p>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center justify-between px-5 pb-5">
                  <button
                    onClick={() => goToStep(activeStep - 1)}
                    disabled={activeStep === 0}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      activeStep === 0
                        ? "bg-muted text-muted-foreground/50"
                        : "bg-primary/10 text-primary active:scale-95"
                    )}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex gap-1.5">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          activeStep === index
                            ? "w-6 bg-primary"
                            : "w-1.5 bg-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={() => goToStep(activeStep + 1)}
                    disabled={activeStep === steps.length - 1}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      activeStep === steps.length - 1
                        ? "bg-muted text-muted-foreground/50"
                        : "bg-primary/10 text-primary active:scale-95"
                    )}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Swipe Hint */}
            <p className="text-center text-xs text-muted-foreground mt-3">
              ← Wischen zum Navigieren →
            </p>
          </div>

          {/* Trust Stats (Mobile) */}
          <div className="flex items-center justify-center gap-4 mt-6 px-4">
            {trustStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <stat.icon className="w-4 h-4 text-primary" />
                <div className="text-center">
                  <span className="text-sm font-bold block">{stat.value}</span>
                  <span className="text-[10px] text-muted-foreground">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:block relative">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative group"
              >
                {/* Arrow between cards */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/3 -right-4 z-10 w-8 h-8 rounded-full bg-secondary items-center justify-center shadow-lg">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Step Number Badge - Top Left */}
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-lg bg-foreground/90 text-background text-xl font-bold flex items-center justify-center shadow-lg">
                      {index + 1}
                    </div>

                    {/* Highlight Badge - Bottom Right */}
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                        <step.badgeIcon className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-foreground text-xs font-semibold">{step.badge}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Schritt {index + 1}
                    </p>
                    <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Stats (Desktop) */}
          <div className="flex items-center justify-center gap-8 mt-10">
            {trustStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2">
                <stat.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-8 md:mt-10 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Button asChild size="lg" className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 shadow-cta h-12 sm:h-11 text-sm sm:text-base font-bold">
            <Link to="/umzugsofferten">
              Jetzt Offerten erhalten
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
});
