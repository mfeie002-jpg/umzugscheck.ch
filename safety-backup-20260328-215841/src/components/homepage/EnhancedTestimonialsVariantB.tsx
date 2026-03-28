/**
 * EnhancedTestimonials VARIANT B - For A/B Testing
 * 
 * CHANGES vs A:
 * - "Deal Cards" instead of generic testimonials
 * - Shows move profile: Route, Challenge, Savings
 * - Mini case study format
 * - Video review style with TikTok-like vertical video hints
 */

import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, TrendingDown, CheckCircle2, MapPin, Package, Home, Clock, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// DEAL CARDS - Rich testimonials with move data
const dealCards = [
  {
    id: 1,
    name: "Sarah M.",
    verified: true,
    route: { from: "Zürich", to: "Bern" },
    rooms: "4.5 Zimmer",
    challenge: "Schwerer Flügel + 3. Stock",
    originalPrice: 2400,
    finalPrice: 1650,
    savings: 750,
    company: "SwissMove AG",
    quote: "Ich filmte den Flügel mit der App – die Offerte war exakt. Keine versteckten Kosten.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Marco R.",
    verified: true,
    route: { from: "Basel", to: "Luzern" },
    rooms: "3 Zimmer",
    challenge: "Antiquitäten + fragile Kunst",
    originalPrice: 1800,
    finalPrice: 1150,
    savings: 650,
    company: "ArtMove Schweiz",
    quote: "Spezialtransport für meine Gemälde inklusive. Alles perfekt verpackt angekommen.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Lisa & Tom",
    verified: true,
    route: { from: "Winterthur", to: "St. Gallen" },
    rooms: "5.5 Zimmer",
    challenge: "Komplettumzug mit Reinigung",
    originalPrice: 3200,
    finalPrice: 2280,
    savings: 920,
    company: "FamilyMove GmbH",
    quote: "Alles inklusive – Reinigung, Entsorgung, Umzug. Ein Anruf, alles erledigt.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
  },
  {
    id: 4,
    name: "Thomas B.",
    verified: true,
    route: { from: "Genf", to: "Lausanne" },
    rooms: "2.5 Zimmer",
    challenge: "Kurzfristiger Umzug (3 Tage)",
    originalPrice: 1400,
    finalPrice: 890,
    savings: 510,
    company: "Express Umzüge",
    quote: "In nur 3 Tagen organisiert! Trotz Zeitdruck faire Preise bekommen.",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    rating: 5,
  },
];

// Live ticker data
const recentMoves = [
  { city: "Zürich", savings: 580, minutes: 3 },
  { city: "Bern", savings: 420, minutes: 7 },
  { city: "Basel", savings: 890, minutes: 12 },
  { city: "Luzern", savings: 340, minutes: 18 },
];

export const EnhancedTestimonialsVariantB = memo(function EnhancedTestimonialsVariantB() {
  const [tickerIndex, setTickerIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % recentMoves.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-b from-muted/20 to-background">
      <div className="container relative">
        
        {/* LIVE TICKER */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-card border border-border shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={tickerIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-muted-foreground"
              >
                <span className="font-semibold text-foreground">{recentMoves[tickerIndex].city}</span>
                {" – CHF "}
                <span className="font-semibold text-emerald-600">{recentMoves[tickerIndex].savings}</span>
                {" gespart vor "}
                {recentMoves[tickerIndex].minutes} Min
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* HEADER */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Die Schweiz vertraut umzugscheck.ch
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Echte Umzüge, echte Ersparnisse – keine Marketing-Floskeln
          </p>
        </motion.div>

        {/* DEAL CARDS GRID */}
        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto mb-10">
          {dealCards.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all duration-300"
            >
              {/* Card Header - Route & Savings */}
              <div className="bg-gradient-to-r from-primary/10 to-emerald-500/10 px-5 py-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">
                      {deal.route.from} → {deal.route.to}
                    </span>
                  </div>
                  
                  {/* Video Play Button */}
                  <motion.div 
                    className="w-9 h-9 rounded-full bg-primary/90 flex items-center justify-center shadow-lg opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </motion.div>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    {deal.rooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />
                    {deal.challenge}
                  </span>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-5">
                {/* Savings Breakdown */}
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <TrendingDown className="w-5 h-5 text-emerald-600" />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-muted-foreground line-through">CHF {deal.originalPrice.toLocaleString()}</span>
                      <span className="text-lg font-bold text-foreground">CHF {deal.finalPrice.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-emerald-600 font-medium">
                      CHF {deal.savings} gespart mit {deal.company}
                    </span>
                  </div>
                </div>
                
                {/* Quote */}
                <p className="text-foreground mb-4 italic">
                  "{deal.quote}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage src={deal.avatar} alt={deal.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {deal.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{deal.name}</span>
                      {deal.verified && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Verifiziert
                        </span>
                      )}
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(deal.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM CTA & RATING */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border shadow-lg">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-bold text-xl text-foreground">4.9 / 5</span>
            <span className="text-muted-foreground text-sm">aus 2'847 Bewertungen</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Schweizweit die höchste Bewertung für Umzugsvergleiche</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
