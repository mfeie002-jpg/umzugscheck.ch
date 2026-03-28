import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Play, CheckCircle2, Quote, TrendingDown } from "lucide-react";

/**
 * SocialProofMarquee - Redesigned for MAXIMUM visual impact
 * 
 * Structure (top to bottom):
 * 1. BEKANNT AUS - Moved UP, real colored logos, prominent banner
 * 2. PROOF POINTS - 15'000+ HUGE, rest as support
 * 3. TESTIMONIALS - Video placeholders + concrete savings (CHF 800 gespart)
 */

// Colored media logos - proper brand colors for visual impact
const MediaLogo = ({ name }: { name: string }) => {
  const logos: Record<string, JSX.Element> = {
    "20 Minuten": (
      <div className="flex items-center gap-1">
        <span className="text-2xl font-black text-[#E3000F]">20</span>
        <span className="text-lg font-bold text-foreground">Minuten</span>
      </div>
    ),
    "SRF": (
      <div className="bg-[#C8102E] text-white text-sm font-bold px-3 py-1.5 rounded">
        SRF
      </div>
    ),
    "Blick": (
      <div className="bg-[#E30613] text-white text-sm font-bold px-3 py-1.5 rounded">
        BLICK
      </div>
    ),
    "NZZ": (
      <span className="font-serif font-bold text-xl text-foreground tracking-tight">NZZ</span>
    ),
    "Watson": (
      <span className="font-bold text-lg text-[#00A4E4]">watson</span>
    ),
    "TCS": (
      <div className="bg-[#FFD700] text-black text-sm font-bold px-3 py-1.5 rounded">
        TCS
      </div>
    ),
  };
  
  return logos[name] || <span className="font-bold text-lg">{name}</span>;
};

// Video testimonial card - placeholder style with play button
const VideoTestimonialCard = ({ 
  name, 
  savings, 
  quote,
  from,
  to 
}: { 
  name: string; 
  savings: string;
  quote: string;
  from: string;
  to: string;
}) => (
  <motion.div 
    className="relative bg-gradient-to-br from-card to-muted/50 rounded-2xl border-2 border-primary/20 p-5 shadow-lg hover:shadow-xl hover:border-primary/40 transition-all w-[320px] flex-shrink-0"
    whileHover={{ scale: 1.02, y: -4 }}
  >
    {/* Play button overlay - indicates video */}
    <div className="absolute top-4 right-4">
      <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
      </div>
    </div>
    
    {/* Savings badge - THE key message */}
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 mb-4">
      <TrendingDown className="w-4 h-4 text-emerald-600" />
      <span className="text-sm font-bold text-emerald-700">{savings} gespart</span>
    </div>
    
    {/* Quote */}
    <p className="text-foreground font-medium mb-4 flex items-start gap-2">
      <Quote className="w-4 h-4 text-primary/40 flex-shrink-0 mt-1" />
      <span className="text-sm leading-relaxed">{quote}</span>
    </p>
    
    {/* Person + route */}
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/30">
        <span className="text-lg font-bold text-primary">{name.charAt(0)}</span>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-foreground">{name}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <span className="text-xs text-muted-foreground">{from} → {to}</span>
      </div>
    </div>
  </motion.div>
);

const videoTestimonials = [
  { name: "Sandra K.", savings: "CHF 840", quote: "Der Preisunterschied zwischen den Offerten war enorm – hätte ich nicht verglichen, wäre es fast doppelt so teuer geworden.", from: "Zürich", to: "Basel" },
  { name: "Marco R.", savings: "CHF 650", quote: "In 2 Tagen hatte ich 5 Offerten. Die günstigste war auch die beste!", from: "Bern", to: "Luzern" },
  { name: "Lisa M.", savings: "CHF 920", quote: "Alles inklusive – Reinigung, Entsorgung, Umzug. Ein Anruf, alles erledigt.", from: "Winterthur", to: "St. Gallen" },
  { name: "Thomas B.", savings: "CHF 780", quote: "Ohne Vergleich hätte ich viel zu viel bezahlt. Absolut empfehlenswert!", from: "Basel", to: "Aarau" },
];

export const SocialProofMarquee = memo(function SocialProofMarquee() {
  const doubledTestimonials = [...videoTestimonials, ...videoTestimonials];

  return (
    <section className="py-8 md:py-12 overflow-hidden">
      
      {/* ============================================ */}
      {/* 1. BEKANNT AUS - MOVED UP, PROMINENT BANNER */}
      {/* ============================================ */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-y-2 border-primary/20 py-6 mb-10">
        <div className="container">
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Label */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30">
              <span className="text-sm font-bold text-primary uppercase tracking-wide">Bekannt aus</span>
            </div>
            
            {/* Logos - real colored logos */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {["20 Minuten", "SRF", "Blick", "NZZ", "Watson", "TCS"].map((name) => (
                <motion.div
                  key={name}
                  whileHover={{ scale: 1.1 }}
                  className="cursor-pointer"
                >
                  <MediaLogo name={name} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 2. PROOF POINTS - 15'000+ DOMINATES */}
      {/* ============================================ */}
      <div className="container mb-10">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* THE BIG NUMBER - 15'000+ */}
          <div className="text-center md:text-left">
            <motion.div 
              className="text-6xl md:text-7xl lg:text-8xl font-black text-primary leading-none"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              15'000+
            </motion.div>
            <p className="text-lg md:text-xl font-semibold text-foreground mt-1">zufriedene Umzüge</p>
          </div>
          
          {/* Supporting stats - smaller */}
          <div className="flex items-center gap-6 md:gap-8">
            <div className="text-center px-4 py-2 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-foreground">4.8</span>
              </div>
              <span className="text-xs text-muted-foreground">Bewertung</span>
            </div>
            
            <div className="text-center px-4 py-2 rounded-xl bg-muted/50 border border-border">
              <div className="text-2xl font-bold text-foreground mb-1">200+</div>
              <span className="text-xs text-muted-foreground">Partner</span>
            </div>
            
            <div className="text-center px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-2xl font-bold text-emerald-600 mb-1">40%</div>
              <span className="text-xs text-emerald-600/80">Ersparnis</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* 3. VIDEO TESTIMONIALS - CONCRETE SAVINGS */}
      {/* ============================================ */}
      <div className="container mb-6">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
            Echte Kunden, echte Ersparnisse
          </h2>
          <p className="text-sm text-muted-foreground">Was unsere Kunden mit dem Vergleich gespart haben</p>
        </motion.div>
      </div>
      
      {/* Marquee with video cards */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />
        
        <motion.div
          className="flex gap-6 py-4"
          animate={{ x: [0, -340 * videoTestimonials.length] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {doubledTestimonials.map((item, idx) => (
            <VideoTestimonialCard key={idx} {...item} />
          ))}
        </motion.div>
      </div>
      
      {/* Summary rating */}
      <div className="container mt-6 text-center">
        <motion.div 
          className="inline-flex items-center gap-3 px-5 py-3 bg-card rounded-full border-2 border-primary/20 shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="font-bold text-foreground">4.8 / 5</span>
          <span className="text-sm text-muted-foreground">aus 2'847 Bewertungen</span>
        </motion.div>
      </div>
    </section>
  );
});