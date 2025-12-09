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
    <section ref={sectionRef} className="py-10 md:py-12 bg-muted/20 border-y border-border/30 overflow-hidden">
      <motion.div 
        className="container"
        style={{ opacity, y }}
      >
        <motion.p 
          className="text-xs text-muted-foreground uppercase tracking-widest mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Bekannt aus & geprüft von
        </motion.p>
        
        {/* Media Logos with stagger animation */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-8">
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
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
              className="opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer grayscale hover:grayscale-0"
              title={logo.name}
            >
              <logo.Logo />
            </motion.div>
          ))}
        </div>

        {/* Trust Badges with spring animation */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6"
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
                scale: 1.05,
                y: -2
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-base">{badge.icon}</span>
              <span className="text-xs font-semibold text-primary">{badge.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
});
