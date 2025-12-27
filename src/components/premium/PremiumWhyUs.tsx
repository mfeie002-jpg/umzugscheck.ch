import { Shield, Clock, Eye, Users, Headphones, Award, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { memo } from "react";
import { GlowingCard } from "@/components/common/GlowingCard";
import { BlurReveal } from "@/components/common/BlurReveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { isScreenshotRenderMode } from "@/lib/screenshot-render-mode";

const usps = [
  {
    icon: Shield,
    title: "Geprüfte Partner",
    description: "Jede Firma wird auf Versicherung und Qualität geprüft.",
    stat: "200+"
  },
  {
    icon: Eye,
    title: "Transparente Preise",
    description: "Klare, vergleichbare Offerten ohne versteckte Kosten.",
    stat: "100%"
  },
  {
    icon: Clock,
    title: "Zeit sparen",
    description: "Eine Anfrage, mehrere Angebote in 24-48h.",
    stat: "3 Std."
  },
  {
    icon: Award,
    title: "AI-Analyse",
    description: "Intelligente Matching für die besten Firmen.",
    stat: "98%"
  },
  {
    icon: Users,
    title: "Lokale Experten",
    description: "Schweizer Firmen mit regionalem Know-how.",
    stat: "26 Kantone"
  },
  {
    icon: Headphones,
    title: "Support",
    description: "Persönliche Hilfe per Telefon, E-Mail oder Chat.",
    stat: "< 2h"
  }
];

const trustBadges = [
  { text: "100% kostenlos" },
  { text: "Unverbindlich" },
  { text: "Swiss Datenschutz" },
  { text: "Kein Spam" },
];

export const PremiumWhyUs = memo(() => {
  const isScreenshot = isScreenshotRenderMode();
  
  return (
    <section className="py-10 sm:py-12 md:py-16 bg-muted/30 relative overflow-hidden" aria-labelledby="why-us-heading">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.05) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header with BlurReveal */}
        <BlurReveal className="text-center mb-10">
          <span className="inline-block text-primary font-semibold text-xs uppercase tracking-wider mb-2">
            Ihre Vorteile
          </span>
          <h2 id="why-us-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Warum Umzugscheck.ch?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            Umzüge einfacher, transparenter und stressfreier.
          </p>
        </BlurReveal>
        
        {/* USPs Grid - Mobile optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {usps.map((usp, idx) => {
            const Icon = usp.icon;
            return (
              <BlurReveal key={idx} delay={idx * 0.05}>
                <GlowingCard className="h-full">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left p-1">
                    <div className="w-12 h-12 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 mb-1">
                        <h3 className="font-bold text-foreground text-base sm:text-sm">{usp.title}</h3>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {usp.stat}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm sm:text-xs leading-relaxed">{usp.description}</p>
                    </div>
                  </div>
                </GlowingCard>
              </BlurReveal>
            );
          })}
        </div>
        
        {/* Trust Footer */}
        {isScreenshot ? (
          <div className="mt-8 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 md:gap-5 text-xs text-muted-foreground">
              {trustBadges.map((badge, i) => (
                <span key={i} className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  {badge.text}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-3 md:gap-5 text-xs text-muted-foreground">
              {trustBadges.map((badge, i) => (
                <span key={i} className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  {badge.text}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
});

PremiumWhyUs.displayName = 'PremiumWhyUs';
