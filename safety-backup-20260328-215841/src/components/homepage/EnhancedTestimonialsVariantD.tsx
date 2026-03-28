/**
 * EnhancedTestimonials VARIANT D - Trust Stack Testimonials
 * 
 * VERSION 4: Outcome-tagged cards, Swiss tone
 * - 3 compact cards with outcome badges (Zeit/Preis/Stress)
 * - Verifiziert tooltip with explanation
 * - Short, professional quotes
 */

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Clock, Wallet, Heart, Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

// Outcome types
type OutcomeType = 'Preis gespart' | 'Zeit gespart' | 'Stressfrei';

const outcomeConfig: Record<OutcomeType, { icon: typeof Wallet; color: string; bgColor: string }> = {
  'Preis gespart': { icon: Wallet, color: 'text-emerald-600', bgColor: 'bg-emerald-500/10 border-emerald-500/20' },
  'Zeit gespart': { icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-500/10 border-blue-500/20' },
  'Stressfrei': { icon: Heart, color: 'text-rose-600', bgColor: 'bg-rose-500/10 border-rose-500/20' },
};

// Testimonials with Swiss tone
const testimonials = [
  {
    id: 1,
    outcome: 'Preis gespart' as OutcomeType,
    quote: "Offerten waren klar vergleichbar. Kein Telefonmarathon, kein Druck.",
    name: "Andreas M.",
    meta: "Zürich • Privatumzug • 3.5 Zi",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 5,
    verified: true,
  },
  {
    id: 2,
    outcome: 'Zeit gespart' as OutcomeType,
    quote: "Innerhalb von 24 Stunden hatten wir passende Offerten. Sehr sauberer Ablauf.",
    name: "Martina K.",
    meta: "Bern • Umzug + Reinigung",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5,
    verified: true,
  },
  {
    id: 3,
    outcome: 'Stressfrei' as OutcomeType,
    quote: "Von der Anfrage bis zur Buchung: strukturiert, freundlich, zuverlässig.",
    name: "Thomas B.",
    meta: "Basel • Express-Umzug",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    rating: 5,
    verified: true,
  },
];

const VerifiedTooltip = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full hover:bg-emerald-500/20 transition-colors">
          <CheckCircle2 className="w-3 h-3" />
          Verifiziert
          <Info className="w-3 h-3 ml-0.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs p-4">
        <p className="font-semibold mb-1">Was bedeutet „Verifiziert"?</p>
        <p className="text-sm text-muted-foreground">
          Die Bewertung stammt von einer Anfrage oder Buchung über Umzugscheck.ch. 
          Wir prüfen die Zuordnung, anonymisieren persönliche Daten und veröffentlichen erst danach.
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const EnhancedTestimonialsVariantD = memo(function EnhancedTestimonialsVariantD() {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      <div className="container relative max-w-5xl">
        
        {/* TESTIMONIAL CARDS - 3 in a row */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {testimonials.map((t, index) => {
            const outcome = outcomeConfig[t.outcome];
            const OutcomeIcon = outcome.icon;
            
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                {/* Header: Stars + Outcome Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Badge variant="outline" className={`${outcome.bgColor} ${outcome.color} border`}>
                    <OutcomeIcon className="w-3 h-3 mr-1" />
                    {t.outcome}
                  </Badge>
                </div>
                
                {/* Quote */}
                <p className="text-foreground font-medium mb-4 leading-relaxed">
                  „{t.quote}"
                </p>
                
                {/* Footer: Author + Verified */}
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={t.avatar} alt={t.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {t.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground text-sm">{t.name}</span>
                      {t.verified && <VerifiedTooltip />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{t.meta}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FOOTER LINKS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-3 text-sm"
        >
          <Button variant="link" className="text-primary">
            Mehr Bewertungen ansehen
          </Button>
          <span className="text-muted-foreground">•</span>
          <Button variant="link" className="text-muted-foreground hover:text-primary">
            So prüfen wir Umzugsfirmen
          </Button>
        </motion.div>
      </div>
    </section>
  );
});
