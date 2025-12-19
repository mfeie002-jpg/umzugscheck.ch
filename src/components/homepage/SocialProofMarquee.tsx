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
    <section className="py-8 md:py-10 bg-gradient-to-b from-muted/40 to-muted/20 overflow-hidden border-y border-border/30">
      {/* Consolidated stats row - Enhanced visual impact */}
      <div className="container mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-5"
        >
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">Geprüft & Verifiziert</span>
        </motion.div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center gap-1 bg-card px-4 py-4 rounded-xl border border-border shadow-soft hover:shadow-medium transition-shadow"
            >
              <stat.icon className="w-5 h-5 text-primary mb-1" />
              <span className="font-bold text-xl text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </motion.div>
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
