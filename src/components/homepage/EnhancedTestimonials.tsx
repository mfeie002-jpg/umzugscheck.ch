import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar?: string;
  date?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah M.",
    location: "Zürich",
    rating: 5,
    text: "Innerhalb von 2 Tagen hatte ich 3 Angebote. Die Ersparnis gegenüber meiner ersten Anfrage war enorm!",
    date: "vor 2 Wochen"
  },
  {
    id: 2,
    name: "Thomas K.",
    location: "Basel",
    rating: 5,
    text: "Super einfach zu bedienen. Die Firma die ich gewählt habe war pünktlich und sehr professionell.",
    date: "vor 3 Wochen"
  },
  {
    id: 3,
    name: "Anna B.",
    location: "Bern",
    rating: 5,
    text: "Hätte nicht gedacht, dass der Preisunterschied so gross ist. Klare Empfehlung!",
    date: "vor 1 Monat"
  },
  {
    id: 4,
    name: "Marco L.",
    location: "Luzern",
    rating: 4,
    text: "Schnelle Antworten und faire Preise. Der Vergleich hat sich definitiv gelohnt.",
    date: "vor 1 Monat"
  },
  {
    id: 5,
    name: "Nina W.",
    location: "St. Gallen",
    rating: 5,
    text: "Von der Anfrage bis zur Buchung alles reibungslos. Sehr zufrieden!",
    date: "vor 2 Monaten"
  },
];

export const EnhancedTestimonials = memo(function EnhancedTestimonials() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-swiss-gold/10 text-swiss-gold rounded-full px-4 py-2 mb-4"
          >
            <Star className="w-4 h-4 fill-swiss-gold" />
            <span className="text-sm font-medium">4.8 / 5 Bewertung</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Was unsere Kunden sagen
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Über 15'000 zufriedene Kunden vertrauen auf unseren Service
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-card border border-border shadow-soft hover:bg-muted transition-colors"
            aria-label="Vorheriges Testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-card border border-border shadow-soft hover:bg-muted transition-colors"
            aria-label="Nächstes Testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Testimonial Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl border border-border shadow-premium p-8 md:p-10"
            >
              <Quote className="w-10 h-10 text-primary/20 mb-4" />
              <p className="text-lg md:text-xl mb-6 leading-relaxed">
                "{testimonials[current].text}"
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {testimonials[current].name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonials[current].name}</div>
                    <div className="text-sm text-muted-foreground">{testimonials[current].location}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < testimonials[current].rating
                            ? "text-swiss-gold fill-swiss-gold"
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{testimonials[current].date}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrent(i);
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === current ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Gehe zu Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
