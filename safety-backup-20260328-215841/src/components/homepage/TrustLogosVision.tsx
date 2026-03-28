/**
 * Trust Logos Section - Vision Page (Relo-OS / Authority-First)
 * 
 * Ecosystem-Story Reihenfolge:
 * Behörden → Infrastruktur → Daten → Risiko → Zahlung → Finanzen → Consumer → Industry → Quality → E-Commerce
 * 
 * Headline: "Integriert in die Schweizer Infrastruktur"
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle2 } from "lucide-react";

// Vision-Page Order: Ecosystem/Authority First
const visionTrustLogos = [
  {
    id: "eumzugch",
    name: "eUmzugCH",
    layer: "Behörden-Integration",
    file: "/logos/trust/trust-eumzugch.svg",
    fallbackColor: "#DC0018",
    verifyUrl: "https://www.eumzug.swiss/",
  },
  {
    id: "die-post",
    name: "Die Post",
    layer: "Infrastruktur",
    file: "/logos/trust/trust-die-schweizerische-post.svg",
    fallbackColor: "#FFCC00",
    verifyUrl: "https://www.post.ch/",
  },
  {
    id: "swiss-hosting",
    name: "Swiss Hosting",
    layer: "Daten-Souveränität",
    file: "/logos/trust/trust-swiss-hosting.svg",
    fallbackColor: "#10B981",
    verifyUrl: "https://www.swissmadesoftware.org/",
  },
  {
    id: "die-mobiliar",
    name: "Die Mobiliar",
    layer: "Risk & Insurance",
    file: "/logos/trust/trust-die-mobiliar.svg",
    fallbackColor: "#E2001A",
    verifyUrl: "https://www.mobiliar.ch/",
  },
  {
    id: "twint",
    name: "TWINT",
    layer: "Payment Layer",
    file: "/logos/trust/trust-twint.svg",
    fallbackColor: "#000000",
    verifyUrl: "https://www.twint.ch/",
  },
  {
    id: "zkb",
    name: "ZKB",
    layer: "Finance Layer",
    file: "/logos/trust/trust-zkb.svg",
    fallbackColor: "#0033A0",
    verifyUrl: "https://www.zkb.ch/",
  },
  {
    id: "raiffeisen",
    name: "Raiffeisen",
    layer: "Finance Layer",
    file: "/logos/trust/trust-raiffeisen.svg",
    fallbackColor: "#FFD500",
    verifyUrl: "https://www.raiffeisen.ch/",
  },
  {
    id: "mieterverband",
    name: "Mieterverband",
    layer: "Consumer Advocacy",
    file: "/logos/trust/trust-mieterverband-schweiz.svg",
    fallbackColor: "#0066B3",
    verifyUrl: "https://www.mieterverband.ch/",
  },
  {
    id: "astag",
    name: "ASTAG",
    layer: "Industry Layer",
    file: "/logos/trust/trust-astag-schweiz.svg",
    fallbackColor: "#003366",
    verifyUrl: "https://www.astag.ch/",
  },
  {
    id: "swiss-label",
    name: "Swiss Label",
    layer: "Quality",
    file: "/logos/trust/trust-swiss-label.svg",
    fallbackColor: "#E2001A",
    verifyUrl: "https://www.swisslabel.ch/",
  },
  {
    id: "trusted-shops",
    name: "Trusted Shops",
    layer: "E-Commerce",
    file: "/logos/trust/trust-trusted-shops.svg",
    fallbackColor: "#FFDC0F",
    verifyUrl: "https://www.trustedshops.ch/",
  },
];

export const TrustLogosVision = memo(function TrustLogosVision() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-6xl px-4">
        {/* Header - Authority/Ecosystem Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <CheckCircle2 className="w-4 h-4" />
            Swiss Infrastructure
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Integriert in die Schweizer Infrastruktur
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Behörden • Versicherung • Zahlung • Daten • Qualität
          </p>
        </motion.div>
        
        {/* Logo Grid - Ecosystem Layers */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {visionTrustLogos.map((logo, index) => (
            <motion.a
              key={logo.id}
              href={logo.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="group relative flex flex-col items-center justify-center p-4
                         bg-card border border-border/50 rounded-xl
                         grayscale opacity-80
                         hover:grayscale-0 hover:opacity-100 hover:border-primary/30 hover:shadow-lg
                         transition-all duration-300"
            >
              {/* Logo */}
              <div className="h-10 flex items-center justify-center mb-2">
                <img 
                  src={logo.file}
                  alt={logo.name}
                  className="h-8 max-w-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div 
                  className="hidden w-10 h-10 rounded-lg items-center justify-center text-lg font-bold text-white"
                  style={{ backgroundColor: logo.fallbackColor }}
                >
                  {logo.name.charAt(0)}
                </div>
              </div>
              
              {/* Label */}
              <span className="text-xs font-semibold text-foreground text-center">
                {logo.name}
              </span>
              <span className="text-[10px] text-muted-foreground text-center">
                {logo.layer}
              </span>
              
              {/* External link indicator */}
              <ExternalLink className="absolute right-2 top-2 w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          ))}
        </motion.div>
        
        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground mt-8 opacity-70">
          Klicken zur Verifizierung • End-to-End integriert
        </p>
      </div>
    </section>
  );
});

export default TrustLogosVision;
