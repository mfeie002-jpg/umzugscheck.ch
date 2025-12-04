/**
 * TestimonialsSection - Customer reviews and social proof
 * Carousel on mobile, grid on desktop
 * 
 * OPTIMIZATIONS:
 * 17. Enhanced card design with gradient quote
 * 18. Better carousel indicators
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Sandra M.",
    location: "Zürich",
    moveType: "3.5-Zimmer-Umzug, Zürich → Winterthur",
    rating: 5,
    text: "Innerhalb von 24 Stunden hatte ich drei faire Offerten. Die Vergleichsmöglichkeit hat mir viel Zeit gespart und ich konnte über 600 Franken sparen.",
  },
  {
    name: "Marco K.",
    location: "Bern",
    moveType: "4.5-Zimmer, Bern → Thun",
    rating: 5,
    text: "Sehr unkompliziert! Das Formular war in 2 Minuten ausgefüllt und die Preisschätzung war sehr nah an den finalen Offerten dran.",
  },
  {
    name: "Lisa & Thomas",
    location: "Basel",
    moveType: "5.5-Zimmer-Haus, Basel → Liestal",
    rating: 4,
    text: "Als Familie mit viel Hausrat war der Vergleich gold wert. Die Firmen waren alle seriös und haben sich schnell gemeldet.",
  },
  {
    name: "Peter S.",
    location: "Luzern",
    moveType: "Firmenumzug, 15 Arbeitsplätze",
    rating: 5,
    text: "Für unseren Büroumzug brauchten wir zuverlässige Partner. Die Vermittlung lief professionell und wir haben den perfekten Anbieter gefunden.",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-advance carousel on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
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
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </div>
        
        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <div className="relative">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TestimonialCard testimonial={testimonials[currentIndex]} />
            </motion.div>
            
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                aria-label="Vorherige Bewertung"
                className="h-10 w-10 rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? "bg-primary w-6" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
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
                className="h-10 w-10 rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardContent className="p-0">
        {/* Quote Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4">
          <Quote className="w-8 h-8 text-primary/40" />
        </div>
        
        <div className="p-5 pt-0">
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < testimonial.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/20"
                }`}
              />
            ))}
          </div>
          
          <p className="text-sm text-foreground mb-4 leading-relaxed">
            "{testimonial.text}"
          </p>
          
          <div className="pt-4 border-t border-border/50">
            <div className="font-semibold text-foreground">
              {testimonial.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {testimonial.location}
            </div>
            <div className="text-xs text-primary mt-1 font-medium">
              {testimonial.moveType}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
