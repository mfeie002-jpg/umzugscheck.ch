import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Zürich → Bern",
    company: "MoveSwiss AG",
    rating: 5,
    text: "Innert 24 Stunden hatten wir 4 Offerten. Die ausgewählte Firma war top – pünktlich, freundlich und der Preis stimmte.",
    verified: true,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  },
  {
    name: "Marco B.",
    location: "Basel → Zürich",
    company: "Express Umzüge",
    rating: 5,
    text: "Der Vergleich hat sich gelohnt! Wir haben fast 800 Franken gespart gegenüber der ersten Offerte, die wir direkt eingeholt hatten.",
    verified: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
  {
    name: "Anna K.",
    location: "Luzern → Genf",
    company: "Family Move",
    rating: 5,
    text: "Super einfacher Prozess. Formular ausgefüllt, am nächsten Tag Offerten verglichen und gebucht. So muss Umziehen sein!",
    verified: true,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
  },
  {
    name: "Thomas R.",
    location: "St. Gallen → Zug",
    company: "Zürich Umzug Pro",
    rating: 5,
    text: "Der Service ist wirklich kostenlos und die Firmen sind alle geprüft. Hatte keine Schäden und alles lief reibungslos.",
    verified: true,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
  },
];

export const TestimonialsSlider = memo(function TestimonialsSlider() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-swiss-gold/10 text-swiss-gold text-sm font-medium mb-4"
          >
            <Star className="w-4 h-4 fill-current" />
            Kundenstimmen
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Was unsere Kunden{" "}
            <span className="text-secondary">sagen</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Über 15'000 zufriedene Kunden haben mit Umzugscheck.ch verglichen und gespart.
          </p>
        </motion.div>

        {/* Testimonial Cards - Desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border shadow-soft p-6"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-secondary/20 mb-4" />
              
              {/* Rating */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-swiss-gold fill-swiss-gold" />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm">{testimonial.name}</span>
                    {testimonial.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial Slider - Mobile */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-card rounded-2xl border border-border shadow-soft p-6"
              >
                <Quote className="w-8 h-8 text-secondary/20 mb-4" />
                
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-swiss-gold fill-swiss-gold" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-4">
                  "{testimonials[current].text}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <img 
                    src={testimonials[current].image} 
                    alt={testimonials[current].name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm">{testimonials[current].name}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonials[current].location}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-2 mt-4">
            <Button size="icon" variant="outline" onClick={prev} className="h-10 w-10">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    current === index ? "bg-secondary w-6" : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <Button size="icon" variant="outline" onClick={next} className="h-10 w-10">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Trust Note */}
        <motion.p 
          className="text-center text-xs text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <CheckCircle className="w-3 h-3 inline mr-1 text-green-500" />
          Verifizierte Kundenbewertungen über alle Partnerfirmen und Kanäle konsolidiert
        </motion.p>
      </div>
    </section>
  );
});
