/**
 * GoldenSocialProof - The optimized social proof component
 * 
 * Combines best patterns from all 5 social proof variants:
 * - Trust Hierarchy (Variant C): Authority → Logic → Emotion ordering
 * - Microtrust badges (Variant D): Outcome-focused tags
 * - Live activity ticker (Variant B): Real-time social proof
 * - Video testimonials (Variant A): Emotional connection
 * - Unified strip (Variant E): Consistent rating display
 */

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, Shield, CheckCircle, Users, TrendingUp, Clock,
  MapPin, ChevronLeft, ChevronRight, Quote
} from "lucide-react";
import { cn } from "@/lib/utils";

// Trust hierarchy stats (most compelling first)
const TRUST_STATS = [
  { value: "200+", label: "Geprüfte Partner", icon: Shield, color: "text-primary" },
  { value: "15'000+", label: "Erfolgreiche Umzüge", icon: TrendingUp, color: "text-primary" },
  { value: "4.8/5", label: "Kundenbewertung", icon: Star, color: "text-secondary" },
  { value: "40%", label: "Durchschnittliche Ersparnis", icon: CheckCircle, color: "text-secondary" },
];

// Outcome badges (microtrust from Variant D)
const OUTCOME_BADGES = [
  "Depot zurück garantiert",
  "Keine versteckten Kosten",
  "Schweizer Datenschutz",
  "24h Antwort garantiert",
];

// Live activity feed
const LIVE_ACTIVITIES = [
  { city: "Zürich", action: "hat gerade 5 Offerten erhalten", time: "vor 2 Min." },
  { city: "Bern", action: "hat einen Umzug gebucht", time: "vor 5 Min." },
  { city: "Basel", action: "hat Preise verglichen", time: "vor 8 Min." },
  { city: "Luzern", action: "hat gerade 4 Offerten erhalten", time: "vor 12 Min." },
  { city: "Winterthur", action: "hat einen Umzug gebucht", time: "vor 15 Min." },
];

// Video testimonials
const TESTIMONIALS = [
  { 
    name: "Sarah M.", 
    location: "Zürich → Bern", 
    quote: "Innerhalb von 24 Stunden hatte ich 5 Angebote. Unglaublich einfach!",
    rating: 5,
    savings: "CHF 800"
  },
  { 
    name: "Thomas K.", 
    location: "Basel → Luzern", 
    quote: "Transparente Preise, keine versteckten Kosten. Genau das habe ich gesucht.",
    rating: 5,
    savings: "CHF 650"
  },
  { 
    name: "Lisa R.", 
    location: "Winterthur → Zürich", 
    quote: "Die Firma war super professionell. Kann ich nur empfehlen!",
    rating: 5,
    savings: "CHF 420"
  },
];

// Media logos (trust signals)
const MEDIA_LOGOS = [
  { name: "20 Minuten", src: "/logos/20min.svg" },
  { name: "NZZ", src: "/logos/nzz.svg" },
  { name: "Blick", src: "/logos/blick.svg" },
  { name: "SRF", src: "/logos/srf.svg" },
];

interface GoldenSocialProofProps {
  variant?: "full" | "compact" | "strip";
  className?: string;
}

export const GoldenSocialProof = memo(({ 
  variant = "full",
  className 
}: GoldenSocialProofProps) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [liveActivity, setLiveActivity] = useState(LIVE_ACTIVITIES[0]);

  // Rotate live activity
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivity(prev => {
        const currentIndex = LIVE_ACTIVITIES.indexOf(prev);
        return LIVE_ACTIVITIES[(currentIndex + 1) % LIVE_ACTIVITIES.length];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (variant === "strip") {
    return <SocialProofStrip className={className} />;
  }

  if (variant === "compact") {
    return <SocialProofCompact className={className} liveActivity={liveActivity} />;
  }

  return (
    <section className={cn("py-12 md:py-16 bg-muted/30", className)}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Trust Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          {TRUST_STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("w-10 h-10 rounded-xl bg-muted flex items-center justify-center", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Live Activity Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-10"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            <AnimatePresence mode="wait">
              <motion.p
                key={liveActivity.city}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-foreground"
              >
                <span className="font-semibold">Jemand in {liveActivity.city}</span>
                <span className="text-muted-foreground"> {liveActivity.action}</span>
                <span className="text-xs text-muted-foreground/70 ml-2">{liveActivity.time}</span>
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Outcome Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {OUTCOME_BADGES.map((badge, idx) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/20 rounded-full"
            >
              <CheckCircle className="w-3.5 h-3.5 text-primary dark:text-primary" />
              <span className="text-xs font-medium text-primary dark:text-primary">{badge}</span>
            </motion.div>
          ))}
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-lg">
            <Quote className="w-8 h-8 text-primary/20 mb-4" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-lg md:text-xl text-foreground mb-4 leading-relaxed">
                  "{TESTIMONIALS[activeTestimonial].quote}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{TESTIMONIALS[activeTestimonial].name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{TESTIMONIALS[activeTestimonial].location}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-0.5 justify-end mb-1">
                      {[...Array(TESTIMONIALS[activeTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-secondary fill-secondary" />
                      ))}
                    </div>
                    <p className="text-sm font-semibold text-primary">
                      {TESTIMONIALS[activeTestimonial].savings} gespart
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation dots */}
            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    idx === activeTestimonial 
                      ? "w-6 bg-primary" 
                      : "bg-muted-foreground/20 hover:bg-muted-foreground/40"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

GoldenSocialProof.displayName = "GoldenSocialProof";

// Compact variant for hero sections
const SocialProofCompact = memo(({ 
  className, 
  liveActivity 
}: { 
  className?: string;
  liveActivity: typeof LIVE_ACTIVITIES[0];
}) => (
  <div className={cn("flex flex-wrap items-center justify-center gap-4 py-4", className)}>
    {/* Mini stats */}
    <div className="flex items-center gap-4">
      {TRUST_STATS.slice(0, 3).map((stat) => (
        <div key={stat.label} className="flex items-center gap-1.5">
          <stat.icon className={cn("w-4 h-4", stat.color)} />
          <span className="text-sm font-semibold">{stat.value}</span>
        </div>
      ))}
    </div>
    
    {/* Live activity */}
    <div className="flex items-center gap-2 text-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
      </span>
      <span className="text-muted-foreground">{liveActivity.city} {liveActivity.action}</span>
    </div>
  </div>
));

SocialProofCompact.displayName = "SocialProofCompact";

// Strip variant for thin display
const SocialProofStrip = memo(({ className }: { className?: string }) => (
  <div className={cn("bg-muted/50 border-y border-border/50 py-3", className)}>
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
        {TRUST_STATS.map((stat) => (
          <div key={stat.label} className="flex items-center gap-2">
            <stat.icon className={cn("w-4 h-4", stat.color)} />
            <span className="text-sm font-semibold">{stat.value}</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
));

SocialProofStrip.displayName = "SocialProofStrip";
