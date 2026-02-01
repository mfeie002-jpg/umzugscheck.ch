import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, ExternalLink } from "lucide-react";

// Swiss media partners with brand colors and styling
const MEDIA_PARTNERS = [
  {
    name: "20 Minuten",
    shortName: "20min",
    website: "20min.ch",
    logo: () => (
      <div className="flex items-baseline gap-0.5">
        <span className="text-xl sm:text-2xl font-black text-[#E3000F]">20</span>
        <span className="text-sm sm:text-base font-medium text-muted-foreground">Minuten</span>
      </div>
    ),
    brandColor: "#E3000F",
  },
  {
    name: "SRF",
    shortName: "SRF",
    website: "srf.ch",
    logo: () => (
      <div className="bg-[#C8102E] text-white font-bold text-sm sm:text-base px-2.5 sm:px-3 py-1 rounded">
        SRF
      </div>
    ),
    brandColor: "#C8102E",
  },
  {
    name: "Blick",
    shortName: "BLICK",
    website: "blick.ch",
    logo: () => (
      <div className="bg-[#E30613] text-white font-black text-sm sm:text-base px-2.5 sm:px-3 py-1 rounded">
        BLICK
      </div>
    ),
    brandColor: "#E30613",
  },
  {
    name: "NZZ",
    shortName: "NZZ",
    website: "nzz.ch",
    logo: () => (
      <span className="font-serif font-bold text-xl sm:text-2xl text-foreground tracking-tight">
        NZZ
      </span>
    ),
    brandColor: "#1A1A1A",
  },
  {
    name: "Watson",
    shortName: "watson",
    website: "watson.ch",
    logo: () => (
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#FF6B35] rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">W</span>
        </div>
        <span className="font-bold text-sm sm:text-base text-foreground lowercase">watson</span>
      </div>
    ),
    brandColor: "#FF6B35",
  },
  {
    name: "newhome.ch",
    shortName: "newhome",
    website: "newhome.ch",
    logo: () => (
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#00A859] rounded flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="currentColor">
            <path d="M12 3L4 9v12h16V9l-8-6zm0 2.25L18 10v9H6v-9l6-4.75z"/>
            <rect x="10" y="14" width="4" height="5"/>
          </svg>
        </div>
        <span className="font-semibold text-sm sm:text-base text-[#00A859]">newhome</span>
        <span className="text-xs text-muted-foreground">.ch</span>
      </div>
    ),
    brandColor: "#00A859",
  },
];

interface MediaTrustSectionProps {
  variant?: "hero" | "standalone" | "compact";
  className?: string;
}

export const MediaTrustSection = memo(function MediaTrustSection({
  variant = "standalone",
  className = ""
}: MediaTrustSectionProps) {
  
  // Compact variant for inline usage
  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 py-3 ${className}`}>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Bekannt aus:
        </span>
        <div className="flex items-center gap-4 sm:gap-6">
          {MEDIA_PARTNERS.slice(0, 4).map((partner) => (
            <div 
              key={partner.shortName} 
              className="opacity-70 hover:opacity-100 transition-opacity"
              title={partner.website}
            >
              <partner.logo />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Hero variant - more prominent
  if (variant === "hero") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 rounded-xl border border-border/50 p-4 sm:p-6 ${className}`}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
            Bekannt aus Schweizer Medien
          </span>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6 items-center justify-items-center">
          {MEDIA_PARTNERS.map((partner, index) => (
            <motion.div
              key={partner.shortName}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.08 }}
              className="flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-all cursor-default"
            >
              <partner.logo />
              <span className="text-[10px] text-muted-foreground hidden sm:block">
                {partner.website}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Standalone variant - full featured section
  return (
    <section className={`py-8 sm:py-12 bg-gradient-to-b from-muted/30 to-background ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full mb-3">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs text-primary font-semibold uppercase tracking-wider">
              Vertrauen Sie dem Marktführer
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Bekannt aus Schweizer Medien
          </h2>
        </motion.div>

        {/* Logo Grid - Mobile optimized: 2 columns, Desktop: 6 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border/60 p-5 sm:p-8 shadow-sm"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 items-center">
            {MEDIA_PARTNERS.map((partner, index) => (
              <motion.a
                key={partner.shortName}
                href={`https://www.${partner.website}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl 
                           bg-muted/30 hover:bg-muted/60 
                           border border-transparent hover:border-border/50
                           transition-all duration-200 cursor-pointer group"
              >
                {/* Logo */}
                <div className="grayscale group-hover:grayscale-0 transition-all duration-200">
                  <partner.logo />
                </div>
                
                {/* Website URL */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-muted-foreground">
                    {partner.website}
                  </span>
                  <ExternalLink className="w-2.5 h-2.5 text-muted-foreground" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Trust Stat */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <p className="text-xs sm:text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">97% der Schweizer</span> vertrauen 
            Empfehlungen aus bekannten Medien mehr
          </p>
        </motion.div>
      </div>
    </section>
  );
});

export default MediaTrustSection;
