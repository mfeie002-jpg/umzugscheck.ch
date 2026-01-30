/**
 * Trust Logos Section - Production-Ready
 * 
 * Psychologisch optimierte Reihenfolge (Conversion-First):
 * Row 1: Risiko → Infrastruktur → Behörden → Zahlung → Finanzen
 * Row 2: Konsumentenschutz → Qualität → Branchen → Tech → E-Commerce
 * 
 * Assets: /public/logos/trust/trust-[name].svg
 * Spec: 240×80px, transparent, centered, <40KB
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

// Psychologisch optimierte Reihenfolge für Homepage/Funnel
const trustLogosRow1 = [
  {
    id: "die-mobiliar",
    name: "Die Mobiliar",
    subtitle: "Versicherung",
    file: "/logos/trust/trust-die-mobiliar.svg",
    fallbackColor: "#E2001A",
    verifyUrl: "https://www.mobiliar.ch/",
    priority: "high", // Risiko/Versicherung first
  },
  {
    id: "die-post",
    name: "Die Post",
    subtitle: "Infrastruktur",
    file: "/logos/trust/trust-die-schweizerische-post.svg",
    fallbackColor: "#FFCC00",
    verifyUrl: "https://www.post.ch/",
    priority: "high",
  },
  {
    id: "eumzugch",
    name: "eUmzugCH",
    subtitle: "Behörden",
    file: "/logos/trust/trust-eumzugch.svg",
    fallbackColor: "#DC0018",
    verifyUrl: "https://www.eumzug.swiss/",
    priority: "high",
  },
  {
    id: "twint",
    name: "TWINT",
    subtitle: "Zahlung",
    file: "/logos/trust/trust-twint.svg",
    fallbackColor: "#000000",
    verifyUrl: "https://www.twint.ch/",
    priority: "high",
  },
  {
    id: "zkb",
    name: "ZKB",
    subtitle: "Kantonalbank",
    file: "/logos/trust/trust-zkb.svg",
    fallbackColor: "#0033A0",
    verifyUrl: "https://www.zkb.ch/",
    priority: "high",
  },
  {
    id: "raiffeisen",
    name: "Raiffeisen",
    subtitle: "Bank",
    file: "/logos/trust/trust-raiffeisen.svg",
    fallbackColor: "#FFD500",
    verifyUrl: "https://www.raiffeisen.ch/",
    priority: "high",
  },
];

const trustLogosRow2 = [
  {
    id: "mieterverband",
    name: "Mieterverband",
    subtitle: "Konsumentenschutz",
    file: "/logos/trust/trust-mieterverband-schweiz.svg",
    fallbackColor: "#0066B3",
    verifyUrl: "https://www.mieterverband.ch/",
    priority: "medium",
  },
  {
    id: "swiss-label",
    name: "Swiss Label",
    subtitle: "Qualität",
    file: "/logos/trust/trust-swiss-label.svg",
    fallbackColor: "#E2001A",
    verifyUrl: "https://www.swisslabel.ch/",
    priority: "medium",
  },
  {
    id: "astag",
    name: "ASTAG",
    subtitle: "Branchenverband",
    file: "/logos/trust/trust-astag-schweiz.svg",
    fallbackColor: "#003366",
    verifyUrl: "https://www.astag.ch/",
    priority: "medium",
  },
  {
    id: "swiss-hosting",
    name: "Swiss Hosting",
    subtitle: "Daten in CH",
    file: "/logos/trust/trust-swiss-hosting.svg",
    fallbackColor: "#10B981",
    verifyUrl: "https://www.swissmadesoftware.org/",
    priority: "medium",
  },
  {
    id: "trusted-shops",
    name: "Trusted Shops",
    subtitle: "E-Commerce",
    file: "/logos/trust/trust-trusted-shops.svg",
    fallbackColor: "#FFDC0F",
    verifyUrl: "https://www.trustedshops.ch/",
    priority: "low",
  },
];

interface TrustLogoItemProps {
  logo: typeof trustLogosRow1[0];
  index: number;
  rowOffset?: number;
}

const TrustLogoItem = memo(function TrustLogoItem({ logo, index, rowOffset = 0 }: TrustLogoItemProps) {
  return (
    <motion.a
      href={logo.verifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index + rowOffset) * 0.03 }}
      className="group relative flex items-center justify-center h-12 px-4
                 bg-card border border-border/50 rounded-lg
                 grayscale opacity-70
                 hover:grayscale-0 hover:opacity-100 hover:border-primary/30 hover:shadow-md
                 transition-all duration-300"
      title={`${logo.name} verifizieren`}
    >
      {/* Logo Image - will show when official asset exists */}
      <img 
        src={logo.file}
        alt={logo.name}
        className="h-6 max-w-[100px] object-contain"
        onError={(e) => {
          // Fallback to text if image fails
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      
      {/* Text Fallback (hidden by default) */}
      <div 
        className="hidden items-center gap-1.5"
        style={{ display: 'none' }}
      >
        <div 
          className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: logo.fallbackColor }}
        >
          {logo.name.charAt(0)}
        </div>
        <span className="text-xs font-semibold whitespace-nowrap">{logo.name}</span>
      </div>
      
      {/* Hover: External link indicator */}
      <ExternalLink className="absolute right-1.5 top-1.5 w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.a>
  );
});

export const TrustLogosOptimized = memo(function TrustLogosOptimized() {
  return (
    <section className="py-6 md:py-8 bg-muted/30 border-b border-border/30">
      <div className="container max-w-5xl px-4">
        {/* Header - Conversion-optimized headline */}
        <div className="text-center mb-5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
            Verifiziert & abgesichert in der Schweiz
          </p>
          <p className="text-[9px] text-muted-foreground/70">
            Versicherung • Zahlung • Schweizer Daten • geprüfte Partner
          </p>
        </div>
        
        {/* Row 1 - Primary Trust (6 logos) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-3"
        >
          {trustLogosRow1.map((logo, index) => (
            <TrustLogoItem key={logo.id} logo={logo} index={index} />
          ))}
        </motion.div>
        
        {/* Row 2 - Secondary Trust (5 logos) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2 md:gap-3"
        >
          {trustLogosRow2.map((logo, index) => (
            <TrustLogoItem key={logo.id} logo={logo} index={index} rowOffset={6} />
          ))}
        </motion.div>
        
        {/* Footer */}
        <p className="text-center text-[9px] text-muted-foreground mt-4 opacity-60">
          Klicken zur Verifizierung • Alle Partner geprüft
        </p>
      </div>
    </section>
  );
});

export default TrustLogosOptimized;
