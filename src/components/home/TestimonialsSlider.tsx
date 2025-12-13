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
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 text-slate-900">
            Das sagen unsere Kunden
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto">
            Über 15'000 zufriedene Kunden vertrauen auf umzugscheck.ch
          </p>
        </motion.div>

        <div 
          {...handlers}
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex-shrink-0 w-[280px] md:w-[360px] snap-start"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-md hover:shadow-lg transition-all border border-slate-100 h-full">
                <div className="flex items-start justify-between mb-3">
                  <Quote className="h-8 w-8 text-primary/15" />
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 md:h-4 md:w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed mb-4 text-sm md:text-base line-clamp-3">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <div className="font-semibold text-sm text-slate-900">{testimonial.name}</div>
                    <div className="text-xs text-slate-500">{testimonial.location}</div>
                  </div>
                  <div className="text-[10px] text-slate-400">{testimonial.date}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
