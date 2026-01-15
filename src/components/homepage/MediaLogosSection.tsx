import { memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// SVG Logo Components for Swiss Media
const Logo20Min = () => (
  <svg viewBox="0 0 100 32" className="h-6 md:h-8 w-auto">
    <text x="0" y="24" fontFamily="Arial Black, sans-serif" fontSize="24" fontWeight="900" fill="#E3000F">20</text>
    <text x="38" y="24" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="400" fill="#333">min</text>
  </svg>
);

const LogoBlick = () => (
  <svg viewBox="0 0 80 28" className="h-5 md:h-7 w-auto">
    <rect width="80" height="28" rx="2" fill="#E30613"/>
    <text x="8" y="20" fontFamily="Arial Black, sans-serif" fontSize="16" fontWeight="900" fill="white">BLICK</text>
  </svg>
);

const LogoWatson = () => (
  <svg viewBox="0 0 90 28" className="h-5 md:h-7 w-auto">
    <text x="0" y="22" fontFamily="Georgia, serif" fontSize="22" fontWeight="700" fill="#1a1a1a">watson</text>
  </svg>
);

const LogoTagi = () => (
  <svg viewBox="0 0 140 24" className="h-5 md:h-6 w-auto">
    <text x="0" y="18" fontFamily="Times New Roman, serif" fontSize="16" fontWeight="400" fill="#1a1a1a">Tages-Anzeiger</text>
  </svg>
);

const LogoNZZ = () => (
  <svg viewBox="0 0 70 28" className="h-5 md:h-7 w-auto">
    <text x="0" y="22" fontFamily="Times New Roman, serif" fontSize="24" fontWeight="700" fill="#1a1a1a">NZZ</text>
  </svg>
);

const LogoSRF = () => (
  <svg viewBox="0 0 60 28" className="h-5 md:h-7 w-auto">
    <rect width="60" height="28" rx="3" fill="#C8102E"/>
    <text x="10" y="20" fontFamily="Arial Black, sans-serif" fontSize="16" fontWeight="900" fill="white">SRF</text>
  </svg>
);

const mediaLogos = [
  { name: "20 Minuten", Logo: Logo20Min },
  { name: "Blick", Logo: LogoBlick },
  { name: "Watson", Logo: LogoWatson },
  { name: "Tages-Anzeiger", Logo: LogoTagi },
  { name: "NZZ", Logo: LogoNZZ },
  { name: "SRF", Logo: LogoSRF },
];

const trustBadges = [
  { name: "TCS geprüft", icon: "🛡️" },
  { name: "Swiss Made", icon: "🇨🇭" },
  { name: "ASTAG Partner", icon: "✓" },
];

export const MediaLogosSection = memo(function MediaLogosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3], [30, 0]);

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-y-2 border-primary/20 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      <motion.div 
        className="container relative"
        style={{ opacity, y }}
      >
        {/* Highlighted Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/15 border-2 border-primary/30 shadow-lg mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-xl">🏆</span>
            <span className="text-sm md:text-base font-bold text-primary uppercase tracking-wide">
              Bekannt aus & geprüft von
            </span>
            <span className="text-xl">✓</span>
          </motion.div>
        </motion.div>
        
        {/* Media Logos - More prominent */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-8">
          {mediaLogos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{ 
                scale: 1.15,
                transition: { duration: 0.2 }
              }}
              className="p-3 md:p-4 rounded-xl bg-card/80 shadow-md border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
              title={logo.name}
            >
              <logo.Logo />
            </motion.div>
          ))}
        </div>

        {/* Trust Badges - More colorful */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-3 md:gap-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {trustBadges.map((badge, index) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: 0.6 + index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ 
                scale: 1.08,
                y: -3
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/30 shadow-md hover:shadow-lg transition-all"
            >
              <span className="text-lg">{badge.icon}</span>
              <span className="text-sm font-bold text-primary">{badge.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
});
