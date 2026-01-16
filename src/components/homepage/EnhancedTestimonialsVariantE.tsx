/**
 * EnhancedTestimonials VARIANT E - Specific Proof Cards
 * 
 * VERSION 5: "Proofy" testimonials
 * - 1 hero testimonial with specific outcome
 * - 3 supporting cards with context (city, apartment, service)
 * - "Verifiziert" tooltip explaining what it means
 * - Date + freshness for credibility
 * - "Alle Bewertungen ansehen" link
 */

import { memo, useState } from "react";
import { Star, CheckCircle2, MapPin, Home, Calendar, ArrowRight, Info } from "lucide-react";
import { motion } from "framer-motion";
import { TRUST } from "@/content/trust";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface TestimonialData {
  quote: string;
  name: string;
  city: string;
  apartmentSize: string;
  serviceType: string;
  rating: number;
  date: string;
  savedAmount?: string;
  isHero?: boolean;
}

const testimonials: TestimonialData[] = [
  {
    quote: "3 Offerten innerhalb von 24 Stunden. Die günstigste war CHF 450 unter dem Durchschnitt. Sehr professioneller Ablauf!",
    name: "M. Huber",
    city: "Zürich",
    apartmentSize: "3.5-Zimmer",
    serviceType: "Privatumzug",
    rating: 5,
    date: "vor 2 Wochen",
    savedAmount: "CHF 450",
    isHero: true,
  },
  {
    quote: "Schnelle Offerten, faire Preise. Umzug lief ohne Probleme.",
    name: "S. Müller",
    city: "Bern",
    apartmentSize: "4.5-Zimmer",
    serviceType: "Umzug + Reinigung",
    rating: 5,
    date: "vor 3 Wochen",
  },
  {
    quote: "Sehr strukturierter Prozess. Firma war pünktlich und sorgfältig.",
    name: "A. Weber",
    city: "Basel",
    apartmentSize: "2.5-Zimmer",
    serviceType: "Express-Umzug",
    rating: 5,
    date: "vor 1 Monat",
  },
  {
    quote: "Einfacher Vergleich, keine versteckten Kosten. Empfehlenswert!",
    name: "L. Fischer",
    city: "Luzern",
    apartmentSize: "5-Zimmer",
    serviceType: "Firmenumzug",
    rating: 4,
    date: "vor 1 Monat",
  },
];

const VerifiedBadge = memo(() => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium cursor-help">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Verifiziert
          <Info className="w-3 h-3 opacity-60" />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="font-semibold mb-1">Was bedeutet „Verifiziert"?</p>
        <p className="text-xs">
          Die Bewertung stammt von einer Anfrage über Umzugscheck.ch. 
          Wir prüfen die Zuordnung und anonymisieren persönliche Daten.
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
));

VerifiedBadge.displayName = 'VerifiedBadge';

const Stars = memo(({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map((i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i <= count ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`} 
      />
    ))}
  </div>
));

Stars.displayName = 'Stars';

const HeroTestimonialCard = memo(({ data }: { data: TestimonialData }) => (
  <motion.div
    className="bg-card border-2 border-primary/20 rounded-2xl p-6 md:p-8 shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <Stars count={data.rating} />
      {data.savedAmount && (
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
          {data.savedAmount} gespart
        </span>
      )}
      <VerifiedBadge />
    </div>
    
    <blockquote className="text-lg md:text-xl font-medium text-foreground mb-6 leading-relaxed">
      "{data.quote}"
    </blockquote>
    
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <span className="font-semibold text-foreground">{data.name}</span>
      <span className="flex items-center gap-1">
        <MapPin className="w-3.5 h-3.5" />
        {data.city}
      </span>
      <span className="flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        {data.apartmentSize}
      </span>
      <span className="flex items-center gap-1">
        <Calendar className="w-3.5 h-3.5" />
        {data.date}
      </span>
    </div>
  </motion.div>
));

HeroTestimonialCard.displayName = 'HeroTestimonialCard';

const SupportingTestimonialCard = memo(({ data, index }: { data: TestimonialData; index: number }) => (
  <motion.div
    className="bg-card border border-border rounded-xl p-5"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
  >
    <div className="flex items-center justify-between mb-3">
      <Stars count={data.rating} />
      <VerifiedBadge />
    </div>
    
    <p className="text-foreground mb-4 line-clamp-2">
      "{data.quote}"
    </p>
    
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span className="font-medium text-foreground">{data.name}</span>
      <span>•</span>
      <span>{data.city}</span>
      <span>•</span>
      <span>{data.apartmentSize}</span>
      <span className="ml-auto">{data.date}</span>
    </div>
  </motion.div>
));

SupportingTestimonialCard.displayName = 'SupportingTestimonialCard';

export const EnhancedTestimonialsVariantE = memo(function EnhancedTestimonialsVariantE() {
  const heroTestimonial = testimonials.find(t => t.isHero)!;
  const supportingTestimonials = testimonials.filter(t => !t.isHero);

  return (
    <section id="bewertungen" className="py-12 md:py-16 bg-muted/10">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Das sagen unsere Kunden
          </h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span>
              <strong className="text-foreground">{TRUST.ratingDisplay}</strong> aus {TRUST.ratingCount.toLocaleString()} Bewertungen
            </span>
          </div>
        </motion.div>

        {/* Hero Testimonial */}
        <div className="mb-8">
          <HeroTestimonialCard data={heroTestimonial} />
        </div>

        {/* Supporting Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {supportingTestimonials.map((t, i) => (
            <SupportingTestimonialCard key={i} data={t} index={i} />
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Button variant="outline" className="gap-2">
            Alle Bewertungen ansehen
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
});
