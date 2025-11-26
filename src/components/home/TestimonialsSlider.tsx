import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useSwipeable } from "react-swipeable";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Zürich",
    rating: 5,
    text: "Dank umzugscheck.ch habe ich CHF 600 gespart! Schnell, einfach und professionell.",
    date: "vor 2 Wochen"
  },
  {
    name: "Thomas K.",
    location: "Bern",
    rating: 5,
    text: "Innerhalb von 24h hatte ich 4 Offerten. Die Firma war super und der Preis fair.",
    date: "vor 1 Monat"
  },
  {
    name: "Maria G.",
    location: "Basel",
    rating: 5,
    text: "Endlich ein Service der hält was er verspricht. Komplett kostenlos und stressfrei!",
    date: "vor 3 Wochen"
  },
  {
    name: "Alex R.",
    location: "Luzern",
    rating: 5,
    text: "Beste Entscheidung für unseren Firmenumzug. Professionell und günstig zugleich.",
    date: "vor 1 Monat"
  }
];

export const TestimonialsSlider = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 350;
      }
    },
    onSwipedRight: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft -= 350;
      }
    },
  });

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Das sagen unsere Kunden
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Über 15'000 zufriedene Kunden vertrauen auf umzugscheck.ch
          </p>
        </motion.div>

        <div 
          {...handlers}
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-full md:w-[400px] snap-start"
            >
              <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all border border-border/50 h-full">
                <div className="flex items-start justify-between mb-4">
                  <Quote className="h-10 w-10 text-primary/20" />
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>

                <p className="text-foreground leading-relaxed mb-6 text-lg">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{testimonial.date}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
