/**
 * TrustRibbon – Local trust bar for Feierabend Umzüge
 * Focused on Versicherungen, Verbände, Register, Payment & Rating.
 * Mobile-first: 2-column grid, static (kein Slider).
 */

import { memo } from "react";
import { ShieldCheck, BadgeCheck, CheckCircle, Star, Banknote, Shield, Building2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type TrustItem = {
  title: string;
  subtitle: string;
  logo: string;
};

const ITEMS: TrustItem[] = [
  { title: "Versicherung", subtitle: "Bis CHF 5 Mio. versichert", logo: "Die Mobiliar" },
  { title: "Verband", subtitle: "Offizielles Mitglied", logo: "ASTAG" },
  { title: "Register", subtitle: "Zürich · CHE-123...", logo: "Handelsregister" },
  { title: "Bewertung", subtitle: "4.9 ★ (150+ Kunden)", logo: "Google" },
];


// --- TRUST LOGO WRAPPER MIT FAILSAFE ---
type TrustLogoProps = { src: string; alt: string; className?: string; style?: React.CSSProperties };
const TrustLogo = ({ src, alt, className = "", style }: TrustLogoProps) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className={className}
    style={style}
    onError={e => { e.currentTarget.style.display = "none"; }}
    width={120}
    height={40}
    decoding="async"
    draggable={false}
  />
);

// --- OPTIMALE REIHENFOLGE & ASSET-MAPPING ---
const TRUST_LOGOS: { key: string; label: string; src: string }[] = [
  { key: "mobiliar", label: "Die Mobiliar", src: "/logos/trust/die-mobiliar.svg" },
  { key: "post", label: "Die Schweizerische Post", src: "/logos/trust/die-post.svg" },
  { key: "eumzugch", label: "eUmzugCH", src: "/logos/trust/eumzugch.svg" },
  { key: "twint", label: "TWINT", src: "/logos/trust/twint.svg" },
  { key: "zkb", label: "Zürcher Kantonalbank", src: "/logos/trust/zkb.svg" },
  { key: "raiffeisen", label: "Raiffeisen", src: "/logos/trust/raiffeisen.svg" },
  { key: "mieterverband", label: "Mieterverband Schweiz", src: "/logos/trust/mieterverband-schweiz.svg" },
  { key: "swisslabel", label: "Swiss Label", src: "/logos/trust/swiss-label.svg" },
  { key: "astag", label: "ASTAG Schweiz", src: "/logos/trust/astag.svg" },
  { key: "swisshosting", label: "Swiss Hosting", src: "/logos/trust/swiss-hosting.svg" },
  { key: "trustedshops", label: "Trusted Shops", src: "/logos/trust/trusted-shops.svg" }
];

interface TrustRibbonProps {
  className?: string;
}

export const TrustRibbon = memo(({ className }: TrustRibbonProps) => {
  // 3) Media + Trust-Logos (default)
  return (
    <section className={cn("py-10 md:py-14", className)}>
      <div className="container mx-auto px-4">
        {/* TRUST-LOGOS: Conversion-First, Swiss-Optimiert */}
        <motion.div
          className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-2 border-primary/20 rounded-2xl py-6 px-4 mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wide">Verifiziert & abgesichert in der Schweiz</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 md:gap-6">
              {TRUST_LOGOS.map((logo) => (
                <TrustLogo key={logo.key} src={logo.src} alt={logo.label} className="h-10 w-auto max-w-[120px] object-contain" />
              ))}
            </div>
          </div>
          <p className="text-center text-xs sm:text-sm text-muted-foreground mt-5 sm:mt-6">
            <span className="text-foreground font-semibold">Versicherung • Zahlung • Schweizer Daten • geprüfte Partner</span>
          </p>
        </motion.div>

        {/* KEY METRICS */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <motion.div
              className="text-7xl md:text-8xl lg:text-9xl font-black text-primary leading-none"
              initial={{ scale: 0.92, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
            >
              15&apos;000+
            </motion.div>
            <p className="text-xl md:text-2xl font-semibold text-foreground mt-2">zufriedene Umzüge</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <div className="text-center px-5 py-3 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-foreground">4.8</span>
              </div>
              <span className="text-sm text-muted-foreground">Bewertung</span>
            </div>

            <div className="text-center px-5 py-3 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">200+</span>
              </div>
              <span className="text-sm text-muted-foreground">Partner</span>
            </div>

            <div className="text-center px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-2xl font-bold text-emerald-600">40%</span>
              </div>
              <span className="text-sm text-emerald-600/80">Ersparnis</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
