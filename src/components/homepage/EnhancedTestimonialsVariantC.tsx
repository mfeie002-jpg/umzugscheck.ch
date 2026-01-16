/**
 * EnhancedTestimonials VARIANT C - Trust Hierarchy
 * 
 * VERSION 3: "Wall of Love" after How it Works
 * - Hero Review (large, featured)
 * - Data Proof (live ticker)
 * - Company-specific mentions
 */

import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, TrendingDown, CheckCircle2, Quote, MapPin, Building2, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Hero testimonial (large, featured)
const heroTestimonial = {
  id: 1,
  name: "Sandra & Michael K.",
  savings: "CHF 840",
  quote: "Der Preisunterschied zwischen den Offerten war enorm – hätte ich nicht verglichen, wäre es fast doppelt so teuer geworden. Die Video-Analyse hat alles vereinfacht.",
  route: "Zürich → Basel",
  rooms: "4.5 Zimmer",
  company: "SwissMove AG",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  rating: 5,
};

// Supporting testimonials
const supportingTestimonials = [
  {
    id: 2,
    name: "Marco R.",
    savings: "CHF 650",
    quote: "In 2 Tagen hatte ich 5 Offerten. Die günstigste war auch die beste!",
    route: "Bern → Luzern",
    company: "ArtMove Schweiz",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Lisa M.",
    savings: "CHF 920",
    quote: "Alles inklusive – Reinigung, Entsorgung, Umzug. Ein Anruf, alles erledigt.",
    route: "Winterthur → St. Gallen",
    company: "FamilyMove GmbH",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
  },
];

// Live activity data
const recentMatches = [
  { city: "Zürich", company: "SwissMove AG", stars: 5, minutes: 3 },
  { city: "Bern", company: "BernExpress", stars: 5, minutes: 7 },
  { city: "Basel", company: "Basel Umzüge", stars: 4, minutes: 12 },
  { city: "Luzern", company: "LuzernMove", stars: 5, minutes: 18 },
];

export const EnhancedTestimonialsVariantC = memo(function EnhancedTestimonialsVariantC() {
  const [tickerIndex, setTickerIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % recentMatches.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-muted/20">
      <div className="container relative max-w-6xl">
        
        {/* HEADER - "Wall of Love" */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Schweizweit die höchste Zufriedenheit
          </h2>
          <p className="text-muted-foreground text-lg">
            Echte Kunden, echte Ersparnisse, echte Empfehlungen
          </p>
        </motion.div>
        
        {/* LIVE TICKER - "Data Proof" */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-card border border-border shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={tickerIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-sm"
              >
                <span className="text-muted-foreground">Gerade gematcht:</span>
                <span className="font-semibold text-foreground">{recentMatches[tickerIndex].city}</span>
                <span className="text-muted-foreground">mit</span>
                <span className="font-semibold text-primary">{recentMatches[tickerIndex].company}</span>
                <div className="flex gap-0.5 ml-1">
                  {[...Array(recentMatches[tickerIndex].stars)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* HERO TESTIMONIAL - Large, featured */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="relative bg-card rounded-2xl border-2 border-primary/30 shadow-xl overflow-hidden">
            {/* Video play hint */}
            <div className="absolute top-4 right-4 z-10">
              <motion.div 
                className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </motion.div>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar & Info */}
                <div className="flex-shrink-0">
                  <Avatar className="h-20 w-20 border-4 border-primary/30 shadow-lg">
                    <AvatarImage src={heroTestimonial.avatar} alt={heroTestimonial.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                      {heroTestimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1">
                  {/* Savings Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 mb-4">
                    <TrendingDown className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-emerald-700 text-lg">{heroTestimonial.savings} gespart</span>
                  </div>
                  
                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl text-foreground font-medium mb-4 leading-relaxed">
                    <Quote className="w-5 h-5 text-primary/30 inline mr-2 -mt-1" />
                    {heroTestimonial.quote}
                  </blockquote>
                  
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{heroTestimonial.name}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {heroTestimonial.route}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {heroTestimonial.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Verifiziert
                    </span>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex gap-1 mt-3">
                    {[...Array(heroTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SUPPORTING TESTIMONIALS */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {supportingTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {testimonial.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground">{testimonial.name}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-600">
                      <TrendingDown className="w-3 h-3" />
                      {testimonial.savings}
                    </span>
                  </div>
                  
                  <p className="text-foreground text-sm mb-2">"{testimonial.quote}"</p>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {testimonial.route}
                    </span>
                    <span className="flex items-center gap-1 text-primary">
                      <Building2 className="w-3 h-3" />
                      {testimonial.company}
                    </span>
                  </div>
                  
                  <div className="flex gap-0.5 mt-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM RATING SUMMARY */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card border-2 border-primary/20 shadow-lg">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-bold text-xl text-foreground">4.8 / 5</span>
            <span className="text-muted-foreground">aus 2'847 Bewertungen</span>
          </div>
          
          <Button variant="outline" size="lg" className="gap-2">
            Alle Bewertungen ansehen
          </Button>
        </motion.div>
      </div>
    </section>
  );
});
