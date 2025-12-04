/**
 * TestimonialsSection - Customer reviews and social proof
 * Carousel on mobile, grid on desktop
 * 
 * OPTIMIZATIONS:
 * 45. Avatar with initials and gradient backgrounds
 * 46. Verified badge with animation
 * 47. Enhanced card hover with 3D tilt
 * 48. Quote icon with gradient
 * 49. Trust indicator row below testimonials
 * 50. Better rating display with glow
 * 51. Enhanced carousel with progress bar
 * 52. Staggered card animations
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2, Shield, Award, TrendingUp, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    name: "Sandra M.",
    location: "Zürich",
    moveType: "3.5-Zimmer-Umzug, Zürich → Winterthur",
    rating: 5,
    text: "Innerhalb von 24 Stunden hatte ich drei faire Offerten. Die Vergleichsmöglichkeit hat mir viel Zeit gespart und ich konnte über 600 Franken sparen.",
    verified: true,
    savings: "CHF 600",
    avatar: "SM",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    name: "Marco K.",
    location: "Bern",
    moveType: "4.5-Zimmer, Bern → Thun",
    rating: 5,
    text: "Sehr unkompliziert! Das Formular war in 2 Minuten ausgefüllt und die Preisschätzung war sehr nah an den finalen Offerten dran.",
    verified: true,
    savings: "CHF 450",
    avatar: "MK",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    name: "Lisa & Thomas",
    location: "Basel",
    moveType: "5.5-Zimmer-Haus, Basel → Liestal",
    rating: 4,
    text: "Als Familie mit viel Hausrat war der Vergleich gold wert. Die Firmen waren alle seriös und haben sich schnell gemeldet.",
    verified: true,
    savings: "CHF 800",
    avatar: "LT",
    gradient: "from-amber-500 to-amber-600",
  },
  {
    name: "Peter S.",
    location: "Luzern",
    moveType: "Firmenumzug, 15 Arbeitsplätze",
    rating: 5,
    text: "Für unseren Büroumzug brauchten wir zuverlässige Partner. Die Vermittlung lief professionell und wir haben den perfekten Anbieter gefunden.",
    verified: true,
    savings: "CHF 1'200",
    avatar: "PS",
    gradient: "from-green-500 to-green-600",
  },
];

const trustStats = [
  { icon: Award, label: "Kundenzufriedenheit", value: "4.8/5" },
  { icon: TrendingUp, label: "Durchschn. Ersparnis", value: "CHF 520" },
  { icon: Shield, label: "Verifizierte Bewertungen", value: "100%" },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Auto-advance carousel on mobile with progress
  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    let elapsed = 0;
    
    const timer = setInterval(() => {
      elapsed += interval;
      setProgress((elapsed / duration) * 100);
      
      if (elapsed >= duration) {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        elapsed = 0;
        setProgress(0);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [currentIndex]);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setProgress(0);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setProgress(0);
  };
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4"
          >
            <Star className="w-4 h-4 fill-primary" />
            Echte Erfahrungen
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Erfahrungen von Kundinnen und Kunden
          </h2>
          <p className="text-muted-foreground text-lg">
            Basierend auf echten Umzugserfahrungen über umzugscheck.ch
          </p>
        </motion.div>
        
        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group"
            >
              <TestimonialCard testimonial={testimonial} index={index} />
            </motion.div>
          ))}
        </div>
        
        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <div className="relative">
            {/* Progress bar */}
            <div className="absolute -top-4 left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TestimonialCard testimonial={testimonials[currentIndex]} index={currentIndex} />
            </motion.div>
            
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                aria-label="Vorherige Bewertung"
                className="h-10 w-10 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setProgress(0);
                    }}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? "bg-primary w-8" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2.5"
                    }`}
                    aria-label={`Gehe zu Bewertung ${index + 1}`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                aria-label="Nächste Bewertung"
                className="h-10 w-10 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Trust Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10"
        >
          {trustStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-5 py-3 rounded-xl border border-border/50 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:border-primary/20">
      <CardContent className="p-0">
        {/* Quote Header with gradient */}
        <div className={`bg-gradient-to-br ${testimonial.gradient} p-4 relative`}>
          <Quote className="w-8 h-8 text-white/40" />
          {testimonial.verified && (
            <motion.div 
              className="absolute top-3 right-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <Badge className="bg-white/20 text-white border-white/30 text-xs backdrop-blur-sm">
                <BadgeCheck className="w-3 h-3 mr-1" />
                Verifiziert
              </Badge>
            </motion.div>
          )}
        </div>
        
        <div className="p-5">
          {/* Rating with glow effect */}
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Star
                  className={`w-4 h-4 ${
                    i < testimonial.rating
                      ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.5)]"
                      : "text-muted-foreground/20"
                  }`}
                />
              </motion.div>
            ))}
          </div>
          
          <p className="text-sm text-foreground mb-4 leading-relaxed line-clamp-4">
            "{testimonial.text}"
          </p>
          
          {/* Savings badge */}
          {testimonial.savings && (
            <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold mb-4">
              <TrendingUp className="w-3.5 h-3.5" />
              {testimonial.savings} gespart
            </div>
          )}
          
          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center gap-3">
              {/* Avatar with gradient */}
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                {testimonial.avatar}
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm">
                  {testimonial.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {testimonial.location}
                </div>
              </div>
            </div>
            <div className="text-xs text-primary mt-2 font-medium">
              {testimonial.moveType}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}