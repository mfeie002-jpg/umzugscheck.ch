import { memo } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, CheckCircle2 } from "lucide-react";
import { 
  StaggeredList, 
  AnimatedIcon, 
  RevealOnScroll, 
  AnimatedDivider, 
  NumberTicker, 
  GlowingCard,
  Beam,
  BlurReveal
} from "@/components/common";

const steps = [
  {
    icon: FileText,
    title: "Formular ausfüllen",
    description: "Geben Sie in 2 Minuten Ihre Umzugsdetails ein – von der Wohnungsgrösse bis zum Umzugsdatum.",
    animation: "bounce" as const,
    stat: 2,
    statLabel: "Minuten"
  },
  {
    icon: Sparkles,
    title: "AI-Analyse & Matching",
    description: "Unsere KI analysiert Ihre Anforderungen und findet die passendsten geprüften Umzugsfirmen für Sie.",
    animation: "pulse" as const,
    stat: 200,
    statLabel: "Partner"
  },
  {
    icon: CheckCircle2,
    title: "Offerten vergleichen & wählen",
    description: "Vergleichen Sie die Angebote transparent und wählen Sie die beste Firma für Ihren Umzug.",
    animation: "float" as const,
    stat: 40,
    statLabel: "% Ersparnis"
  },
];

export const HowItWorksSection = memo(function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }}
      />
      
      <div className="container relative">
        {/* Header */}
        <RevealOnScroll direction="up" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Wie funktioniert der Vergleich?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            In nur 3 einfachen Schritten zu Ihren kostenlosen Umzugsofferten.
          </p>
          {/* Animated Divider */}
          <AnimatedDivider variant="dots" className="mt-6" />
        </RevealOnScroll>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Animated Beam Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4">
            <Beam direction="horizontal" />
          </div>
          
          {steps.map((step, index) => (
            <BlurReveal key={step.title} delay={index * 0.15}>
              <motion.div
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step Card with Glow Effect */}
                <GlowingCard className="w-full mb-4">
                  <div className="flex flex-col items-center py-4">
                    {/* Step Number & Icon */}
                    <div className="relative mb-4">
                      <motion.div 
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary/10 to-primary/5 flex items-center justify-center relative z-10"
                        whileHover={{ scale: 1.05, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <AnimatedIcon 
                          icon={step.icon} 
                          size={36} 
                          animation={step.animation}
                          className="text-secondary"
                        />
                      </motion.div>
                      {/* Step Number with Glow */}
                      <motion.div 
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold shadow-cta z-20"
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.3, type: "spring", stiffness: 200 }}
                      >
                        {index + 1}
                      </motion.div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-secondary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-xs mb-4">
                      {step.description}
                    </p>
                    
                    {/* Number Ticker Stat */}
                    <div className="pt-4 border-t border-border w-full">
                      <div className="text-2xl font-bold text-secondary">
                        <NumberTicker value={step.stat} suffix={step.statLabel.includes("%") ? "%" : "+"} />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {step.statLabel.replace("%", "").trim()}
                      </div>
                    </div>
                  </div>
                </GlowingCard>
              </motion.div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
});
