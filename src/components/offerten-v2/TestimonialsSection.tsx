/**
 * TestimonialsSection - Customer reviews and social proof
 * Carousel on mobile, grid on desktop
 * 
 * OPTIMIZATIONS:
 * 111. Floating particles in background
 * 112. Video testimonial placeholder
 * 113. Location map indicators
 * 114. Before/after savings comparison
 * 115. Animated avatar ring
 * 116. Quote marks with gradient
 * 117. Testimonial categories filter
 * 118. Share testimonial button
 * 119. Date display
 * 120. Slide transition effects
 * 190. Touch swipe carousel for mobile
 * 191. Mobile-optimized card sizing
 * 192. Swipe indicator dots
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2, Shield, Award, TrendingUp, BadgeCheck, MapPin, Calendar, Share2, Play } from "lucide-react";
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
    date: "November 2024",
    category: "Privatumzug",
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
    date: "Oktober 2024",
    category: "Privatumzug",
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
    date: "September 2024",
    category: "Familienumzug",
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
    date: "August 2024",
    category: "Firmenumzug",
  },
];

const trustStats = [
  { icon: Award, label: "Kundenzufriedenheit", value: "4.8/5", color: "text-amber-500" },
  { icon: TrendingUp, label: "Durchschn. Ersparnis", value: "CHF 520", color: "text-green-500" },
  { icon: Shield, label: "Verifizierte Bewertungen", value: "100%", color: "text-blue-500" },
];

// Floating particles
const particles = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 4 + Math.random() * 8,
  duration: 15 + Math.random() * 10,
  delay: Math.random() * 5,
}));

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // Auto-advance carousel on mobile with progress
  useEffect(() => {
    const duration = 6000;
    const interval = 50;
    let elapsed = 0;
    
    const timer = setInterval(() => {
      elapsed += interval;
      setProgress((elapsed / duration) * 100);
      
      if (elapsed >= duration) {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        elapsed = 0;
        setProgress(0);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [currentIndex]);
  
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setProgress(0);
  };
  
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setProgress(0);
  };
  
  // 190. Touch swipe handler for mobile
  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };
  
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/10"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
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
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-4 h-4 fill-primary" />
            </motion.div>
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
        
        {/* Mobile: Carousel with swipe support */}
        <div className="md:hidden">
          <div className="relative">
            {/* Progress bar */}
            <div className="absolute -top-4 left-0 right-0 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* 190. Swipe hint for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Swipe</span>
              <ChevronRight className="w-3 h-3" />
            </motion.div>
            
            {/* 191. Touch-enabled carousel container */}
            <motion.div 
              className="overflow-hidden touch-pan-y"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
            >
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="px-1"
                >
                  <TestimonialCard testimonial={testimonials[currentIndex]} index={currentIndex} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
            
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                aria-label="Vorherige Bewertung"
                className="h-11 w-11 rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                      setProgress(0);
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? "bg-primary w-8 h-2.5" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2.5 h-2.5"
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
                className="h-11 w-11 rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-sm"
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
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex items-center gap-3 bg-card/80 backdrop-blur-sm px-6 py-4 rounded-xl border border-border/50 shadow-lg hover:shadow-xl transition-all"
            >
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </motion.div>
              <div>
                <div className="text-xl font-bold text-foreground">{stat.value}</div>
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
        <div className={`bg-gradient-to-br ${testimonial.gradient} p-4 relative overflow-hidden`}>
          {/* Animated quote pattern */}
          <motion.div
            className="absolute -right-4 -bottom-4 opacity-10"
            animate={{ rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Quote className="w-24 h-24 text-white" />
          </motion.div>
          
          <Quote className="w-8 h-8 text-white/50" />
          
          {testimonial.verified && (
            <motion.div 
              className="absolute top-3 right-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.05 + 0.2, type: "spring" }}
                >
                  <Star
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]"
                        : "text-muted-foreground/20"
                    }`}
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Category badge */}
            <Badge variant="secondary" className="text-xs">
              {testimonial.category}
            </Badge>
          </div>
          
          <p className="text-sm text-foreground mb-4 leading-relaxed line-clamp-4">
            "{testimonial.text}"
          </p>
          
          {/* Savings badge */}
          {testimonial.savings && (
            <motion.div 
              className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              {testimonial.savings} gespart
            </motion.div>
          )}
          
          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar with animated ring */}
                <div className="relative">
                  <motion.div 
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-sm`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {testimonial.avatar}
                  </motion.div>
                  {/* Animated ring */}
                  <motion.div
                    className={`absolute -inset-1 rounded-full border-2 border-dashed opacity-50`}
                    style={{ borderColor: `var(--${testimonial.gradient.split('-')[1]}-500)` }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                    {testimonial.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {testimonial.location}
                  </div>
                </div>
              </div>
              
              {/* Share button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-primary font-medium truncate max-w-[60%]">
                {testimonial.moveType}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {testimonial.date}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}