import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Users, Award, TrendingUp, ShieldCheck } from "lucide-react";

// Avatar initials for CLS prevention (no external image loading)
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

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
    <section className="py-10 md:py-12 bg-gradient-to-b from-primary/5 via-muted/30 to-secondary/5 overflow-hidden border-y-2 border-primary/20">
      {/* Consolidated stats row - Enhanced visual impact */}
      <div className="container mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/15 border-2 border-primary/30 shadow-md"
            whileHover={{ scale: 1.02 }}
          >
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary">Geprüft & Verifiziert</span>
          </motion.div>
        </motion.div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className="flex flex-col items-center gap-2 bg-gradient-to-br from-card to-primary/5 px-5 py-5 rounded-2xl border-2 border-primary/20 shadow-lg hover:shadow-xl hover:border-primary/40 transition-all"
            >
              <div className="p-2 rounded-full bg-primary/10">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="font-extrabold text-2xl text-foreground">{stat.value}</span>
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Testimonials marquee - Enhanced header */}
      <div className="container mb-4">
        <motion.div 
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
            ))}
          </div>
          <span className="text-base font-bold text-foreground">Das sagen unsere Kunden</span>
        </motion.div>
      </div>
      
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background/80 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background/80 to-transparent z-10" />
        
        <motion.div
          className="flex gap-5"
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
              className="flex-shrink-0 bg-gradient-to-br from-card to-primary/5 rounded-2xl border-2 border-primary/15 hover:border-primary/30 p-5 w-[300px] shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                ))}
              </div>
              <p className="text-sm font-medium mb-4 flex items-start gap-2">
                <Quote className="w-5 h-5 text-primary/40 flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{item.text}</span>
              </p>
              <div className="flex items-center gap-2 text-sm">
                {/* CSS avatar with initials - no CLS from image loading */}
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10 text-primary font-semibold text-sm border-2 border-primary/20"
                  aria-hidden="true"
                >
                  {getInitials(item.name)}
                </div>
                <span className="text-muted-foreground font-medium">{item.name} • {item.city}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Media logos section integrated */}
      <div className="container mt-10 pt-8 border-t-2 border-primary/10">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/15 to-secondary/15 border-2 border-primary/25 shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-lg">🏆</span>
            <span className="text-sm font-bold text-primary uppercase tracking-wide">
              Bekannt aus & Geprüft von
            </span>
            <span className="text-lg">✓</span>
          </motion.div>
        </motion.div>
        
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {["20min", "Blick", "Watson", "TCS", "SRF", "NZZ"].map((name, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1 }}
              className="px-5 py-3 rounded-xl bg-card shadow-md border-2 border-border/50 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
            >
              <span className="font-bold text-foreground">{name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
