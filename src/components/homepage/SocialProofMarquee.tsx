import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "M. Keller", city: "Zürich", text: "Super schnell und unkompliziert!", rating: 5 },
  { name: "A. Müller", city: "Basel", text: "40% günstiger als erwartet.", rating: 5 },
  { name: "S. Weber", city: "Bern", text: "Sehr professionelle Abwicklung.", rating: 5 },
  { name: "L. Fischer", city: "Luzern", text: "Kann ich nur empfehlen!", rating: 5 },
  { name: "R. Schmid", city: "Winterthur", text: "Toller Service, faire Preise.", rating: 5 },
  { name: "E. Brunner", city: "St. Gallen", text: "Alles perfekt organisiert.", rating: 5 },
];

export const SocialProofMarquee = memo(function SocialProofMarquee() {
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="py-8 bg-muted/30 overflow-hidden">
      <div className="container mb-4">
        <p className="text-center text-sm text-muted-foreground">
          Das sagen unsere Kunden
        </p>
      </div>
      
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted/30 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted/30 to-transparent z-10" />
        
        <motion.div
          className="flex gap-4"
          animate={{ x: [0, -50 * testimonials.length] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {doubled.map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 bg-card rounded-xl border border-border p-4 w-[280px]"
            >
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-swiss-gold text-swiss-gold" />
                ))}
              </div>
              <p className="text-sm mb-3 flex items-start gap-2">
                <Quote className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                {item.text}
              </p>
              <div className="text-xs text-muted-foreground">
                {item.name} • {item.city}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});
