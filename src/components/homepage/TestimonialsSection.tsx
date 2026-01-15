import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RevealOnScroll, RatingStars, InteractiveCard } from "@/components/common";

const testimonials = [
  {
    id: 1,
    name: "Sandra K.",
    location: "Zürich",
    type: "Privatumzug 3.5-Zimmer",
    rating: 5,
    text: "Innerhalb von 48 Stunden hatte ich drei faire Offerten. Der Umzug verlief reibungslos und das Team war super professionell. Absolute Empfehlung!",
    verified: true,
  },
  {
    id: 2,
    name: "Marco B.",
    location: "Basel",
    type: "Firmenumzug 15 Arbeitsplätze",
    rating: 5,
    text: "Unser Büroumzug wurde perfekt koordiniert. Die Firma war pünktlich, sorgfältig und der Preis war transparent. Sehr zufrieden!",
    verified: true,
  },
  {
    id: 3,
    name: "Lisa M.",
    location: "Bern",
    type: "Privatumzug 2.5-Zimmer",
    rating: 5,
    text: "Ich war anfangs skeptisch, aber der Service hat mich überzeugt. Schnelle Offerten, gute Beratung und ein stressfreier Umzug.",
    verified: true,
  },
  {
    id: 4,
    name: "Thomas W.",
    location: "Luzern",
    type: "Privatumzug 4.5-Zimmer",
    rating: 5,
    text: "Die AI-Analyse war erstaunlich genau. Die empfohlene Firma hat alle Erwartungen übertroffen. Nächstes Mal wieder über Umzugscheck!",
    verified: true,
  },
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      {/* Floating Stars Decoration */}
      <div className="absolute top-20 right-[20%] text-4xl opacity-20 animate-pulse">⭐</div>
      <div className="absolute top-40 left-[15%] text-3xl opacity-15 animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
      <div className="absolute bottom-32 right-[30%] text-2xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}>⭐</div>
      
      <div className="container relative">
        {/* Header */}
        <RevealOnScroll direction="up" className="text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">4.8/5 Kundenzufriedenheit</span>
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Das sagen unsere Kunden
          </h2>
          <p className="text-muted-foreground text-lg">
            Echte Bewertungen von echten Kunden
          </p>
        </RevealOnScroll>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-2">
                  <TestimonialCard testimonial={testimonial} index={index} />
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={prevSlide}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-secondary" : "bg-border"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={nextSlide}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  testimonial: typeof testimonials[0];
  index: number;
}

const TestimonialCard = ({ testimonial, index }: TestimonialCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
  >
    <InteractiveCard className="p-6 h-full flex flex-col group bg-gradient-to-br from-card to-primary/5 border-primary/10 hover:border-primary/30 transition-all duration-300">
      {/* Large Stars Row */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + i * 0.05, type: "spring", stiffness: 200 }}
          >
            <Star 
              className="w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-sm" 
            />
          </motion.div>
        ))}
      </div>
      
      {/* Quote with larger text */}
      <p className="text-foreground text-base leading-relaxed line-clamp-4 flex-1 mb-4 font-medium">
        "{testimonial.text}"
      </p>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-primary/10">
        <div>
          <p className="font-bold text-sm text-foreground">{testimonial.name}</p>
          {testimonial.verified && (
            <motion.span 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/40 px-2.5 py-1 rounded-full mt-1.5 shadow-sm"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Verifiziert
            </motion.span>
          )}
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p className="font-medium">{testimonial.location}</p>
          <p>{testimonial.type}</p>
        </div>
      </div>
    </InteractiveCard>
  </motion.div>
);
