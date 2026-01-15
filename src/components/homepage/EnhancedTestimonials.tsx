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
    name: "Sarah Müller-Bachmann",
    location: "Zürich-Oerlikon → Winterthur",
    rating: 5,
    text: "Innerhalb von 2 Tagen hatte ich 4 Offerten von Zürcher Firmen. Die günstigste war CHF 480 unter meiner ersten Anfrage direkt bei einer Firma. Der Umzug mit der Firma Blitz-Umzüge lief perfekt.",
    date: "November 2024"
  },
  {
    id: 2,
    name: "Thomas & Petra Keller",
    location: "Basel-Stadt → Riehen",
    rating: 5,
    text: "Wir hatten ein Klavier und viele Antiquitäten – die Firma Basler Möbeltransport AG hat alles ohne einen Kratzer geliefert. Preis: CHF 1'850 statt der CHF 2'400, die ein anderer Anbieter wollte.",
    date: "Oktober 2024"
  },
  {
    id: 3,
    name: "Anna Brunner",
    location: "3.5-Zimmer-Wohnung, Bern-Bümpliz",
    rating: 5,
    text: "Als Alleinerziehende mit zwei Kindern war ich skeptisch. Aber der Service war wirklich kostenlos, keine nervigen Anrufe. Ich habe CHF 650 gespart und die Firma war super flexibel mit dem Termin.",
    date: "September 2024"
  },
  {
    id: 4,
    name: "Marco Lombardi",
    location: "Firmenumzug, Luzern",
    rating: 5,
    text: "Wir haben unser Büro mit 12 Arbeitsplätzen über ein Wochenende gezügelt. Die Offerten kamen innerhalb von 24 Stunden – am Montag war alles aufgebaut. Absolut professionell.",
    date: "Oktober 2024"
  },
  {
    id: 5,
    name: "Nina & Daniel Weber",
    location: "St. Gallen → Frauenfeld",
    rating: 5,
    text: "Wir hatten nur 3 Wochen Zeit für den Umzug. Über Umzugscheck haben wir sofort eine Firma gefunden, die kurzfristig verfügbar war. CHF 1'350 für 4 Zimmer inkl. Einpackservice – top!",
    date: "August 2024"
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
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary/10 via-muted/30 to-secondary/10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-20 right-[15%] text-5xl opacity-20">⭐</div>
      <div className="absolute bottom-32 left-[10%] text-4xl opacity-15">⭐</div>
      
      <div className="container relative">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 bg-yellow-100 dark:bg-yellow-900/40 rounded-full px-6 py-3 mb-5 shadow-md border-2 border-yellow-300/50"
          >
            <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
            <span className="text-base font-bold text-yellow-700 dark:text-yellow-400">4.8 / 5 Bewertung</span>
            <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Was unsere Kunden sagen
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
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
              className="bg-gradient-to-br from-card to-primary/5 rounded-2xl border-2 border-primary/20 shadow-xl p-8 md:p-10"
            >
              <Quote className="w-12 h-12 text-primary/30 mb-4" />
              <p className="text-lg md:text-xl mb-6 leading-relaxed font-medium text-foreground">
                "{testimonials[current].text}"
              </p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-xl shadow-md">
                    {testimonials[current].name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{testimonials[current].name}</div>
                    <div className="text-sm text-muted-foreground">{testimonials[current].location}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-6 h-6 drop-shadow-sm",
                          i < testimonials[current].rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">{testimonials[current].date}</span>
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
