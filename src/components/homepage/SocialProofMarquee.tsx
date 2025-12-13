import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Users, Award, TrendingUp, ShieldCheck } from "lucide-react";

const testimonials = [
  { name: "M. Keller", city: "Zürich", text: "Super schnell und unkompliziert!", rating: 5 },
  { name: "A. Müller", city: "Basel", text: "40% günstiger als erwartet.", rating: 5 },
  { name: "S. Weber", city: "Bern", text: "Sehr professionelle Abwicklung.", rating: 5 },
  { name: "L. Fischer", city: "Luzern", text: "Kann ich nur empfehlen!", rating: 5 },
  { name: "R. Schmid", city: "Winterthur", text: "Toller Service, faire Preise.", rating: 5 },
  { name: "E. Brunner", city: "St. Gallen", text: "Alles perfekt organisiert.", rating: 5 },
];

const stats = [
  { icon: Users, value: "15'000+", label: "Umzüge" },
  { icon: Award, value: "200+", label: "Partner" },
  { icon: Star, value: "4.8", label: "Bewertung" },
  { icon: TrendingUp, value: "40%", label: "Ersparnis" },
];

export const SocialProofMarquee = memo(function SocialProofMarquee() {
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="py-6 md:py-8 bg-muted/30 overflow-hidden border-y border-border/30">
      {/* Consolidated stats row (#6, #7) */}
      <div className="container mb-6">
        <div className="flex items-center justify-center gap-1 mb-4">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Geprüft & Verifiziert</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 bg-card/50 px-3 py-2 rounded-lg border border-border/50">
              <stat.icon className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Testimonials marquee */}
      <div className="container mb-3">
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
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
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
