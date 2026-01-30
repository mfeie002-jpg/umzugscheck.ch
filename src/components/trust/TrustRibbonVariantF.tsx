/**
 * TrustRibbon VARIANT F - Verifiable Trust
 * 
 * VERSION 6: State-backed trust signals (Swiss Trust Triumvirate)
 * - NO fake logos or hardcoded brand colors
 * - Prüfbarkeit statt Logo-Show
 * - UID & Handelsregister verifizierbar
 * - Versicherung geprüft (Haftpflicht/Transport)
 * - Fixpreis-Garantie
 * - Verifizierte Bewertungen
 * 
 * Variants:
 * - compact: Mini strip after hero (mobile-first)
 * - trust: Only trust cards (Institutional/Process Trust)
 * - media: Only "Bekannt aus" (only with real assets)
 * - full: Everything combined
 */

import { memo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  Star,
  Users,
  Building2,
  TrendingUp,
  FileCheck,
  ExternalLink,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TRUST, VERIFIED_PRESS } from "@/content/trust";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ==================== TYPES ====================

type LogoAsset = {
  name: string;
  src: string;
  alt?: string;
  href?: string;
};

type TrustCard = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  verifyUrl?: string;
  verifyLabel?: string;
};

// ==================== TRUST CARDS (Verifiable) ====================

const TRUST_CARDS: TrustCard[] = [
  {
    title: "Versicherung",
    subtitle: "Haftpflicht & Transportversicherung bei allen Partnern geprüft.",
    icon: ShieldCheck,
    verifyLabel: "Versicherungsnachweis bei Offerte",
  },
  {
    title: "UID-Register",
    subtitle: "Alle Partner im Handelsregister mit UID verifiziert.",
    icon: FileCheck,
    verifyUrl: "https://www.uid.admin.ch/",
    verifyLabel: "UID prüfen",
  },
  {
    title: "Fixpreis",
    subtitle: "Transparente Offerten ohne versteckte Kosten.",
    icon: BadgeCheck,
    verifyLabel: "Preisgarantie in Offerte",
  },
  {
    title: "Bewertungen",
    subtitle: "Nur buchungsbasierte, verifizierte Kundenbewertungen.",
    icon: Star,
    verifyLabel: "Verifiziertes Feedback",
  },
];

// ==================== MEDIA LOGOS (only if assets exist) ====================
// These should be real SVG assets in /public/logos/trust/

const MEDIA_LOGOS: LogoAsset[] = VERIFIED_PRESS.map(p => ({
  name: p.name,
  src: `/logos/trust/${p.name.toLowerCase().replace(/\s/g, '')}.svg`,
  alt: p.name,
}));

// ==================== COMPONENTS ====================

const TrustCardItem = memo(({ card }: { card: TrustCard }) => {
  const Icon = card.icon;
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="flex flex-col p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="font-semibold text-sm">{card.title}</span>
      </div>
      
      <p className="text-xs text-muted-foreground leading-relaxed flex-1">
        {card.subtitle}
      </p>
      
      {card.verifyUrl ? (
        <a
          href={card.verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          {card.verifyLabel}
        </a>
      ) : card.verifyLabel ? (
        <span className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          {card.verifyLabel}
        </span>
      ) : null}
    </motion.div>
  );
});

TrustCardItem.displayName = 'TrustCardItem';

const MediaLogo = memo(({ asset, className }: { asset: LogoAsset; className?: string }) => {
  const [hasError, setHasError] = useState(false);
  
  // If image fails, show text fallback
  if (hasError) {
    const content = (
      <span className="font-semibold text-sm text-muted-foreground hover:text-foreground transition-colors">
        {asset.name}
      </span>
    );
    
    if (asset.href) {
      return (
        <a href={asset.href} target="_blank" rel="noopener noreferrer" className={className}>
          {content}
        </a>
      );
    }
    return <div className={className}>{content}</div>;
  }
  
  const img = (
    <img
      src={asset.src}
      alt={asset.alt || asset.name}
      loading="lazy"
      className={cn("h-6 max-w-[80px] object-contain grayscale hover:grayscale-0 transition-all", className)}
      onError={() => setHasError(true)}
    />
  );

  if (asset.href) {
    return (
      <a href={asset.href} target="_blank" rel="noopener noreferrer">
        {img}
      </a>
    );
  }
  return img;
});

MediaLogo.displayName = 'MediaLogo';

// ==================== MAIN COMPONENT ====================

export interface TrustRibbonVariantFProps {
  /**
   * compact: mini strip (ideal direkt nach Hero)
   * trust: nur Trust Cards (Institutional/Process Trust)
   * media: nur "Bekannt aus"
   * full: media + metrics + trust
   */
  variant?: "full" | "compact" | "trust" | "media";
  className?: string;
}

export const TrustRibbonVariantF = memo(function TrustRibbonVariantF({
  variant = "compact",
  className,
}: TrustRibbonVariantFProps) {
  
  // ==================== COMPACT VARIANT ====================
  if (variant === "compact") {
    return (
      <div className={cn("py-3 bg-muted/30 border-b border-border", className)}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 md:gap-6 flex-wrap text-sm">
            
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{TRUST.ratingDisplay}</span>
              <span className="text-muted-foreground hidden sm:inline">Bewertung</span>
            </div>
            
            <span className="text-border">|</span>
            
            {/* Umzüge */}
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-bold">{TRUST.movesCount}</span>
              <span className="text-muted-foreground hidden sm:inline">Umzüge</span>
            </div>
            
            <span className="text-border hidden sm:inline">|</span>
            
            {/* UID Verified */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="hidden sm:flex items-center gap-1.5 cursor-help">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-muted-foreground">UID-geprüft</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Alle Partner im Handelsregister verifiziert</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Media logos (compact - max 3) */}
            {MEDIA_LOGOS.length > 0 && (
              <>
                <span className="text-border hidden md:inline">|</span>
                <div className="hidden md:flex items-center gap-3">
                  {MEDIA_LOGOS.slice(0, 3).map((m) => (
                    <MediaLogo key={m.name} asset={m} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==================== FULL / TRUST / MEDIA VARIANTS ====================
  return (
    <section className={cn("py-10 md:py-14 bg-gradient-to-b from-muted/30 to-background", className)}>
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* ==================== BEKANNT AUS (media/full) ==================== */}
        {(variant === "full" || variant === "media") && MEDIA_LOGOS.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="text-center">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Bekannt aus
              </span>
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-4">
                {MEDIA_LOGOS.map((m) => (
                  <MediaLogo key={m.name} asset={m} />
                ))}
              </div>
            </div>
            
            <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
              <Info className="w-3 h-3" />
              Medien-Logos nur bei belegbaren Erwähnungen
            </p>
          </motion.div>
        )}

        {/* ==================== KEY METRICS (full only) ==================== */}
        {variant === "full" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              {/* Big Number */}
              <div className="text-center mb-6">
                <div className="text-4xl md:text-5xl font-bold text-primary">
                  {TRUST.movesCount}
                </div>
                <div className="text-muted-foreground mt-1">
                  {TRUST.movesLabel}
                </div>
              </div>
              
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{TRUST.ratingDisplay}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Bewertung</div>
                </div>
                
                <div className="p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="font-bold text-lg">{TRUST.companiesCount}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Partner</div>
                </div>
                
                <div className="p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-lg">bis {TRUST.savingsPercent}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{TRUST.savingsLabel}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================== TRUST CARDS (trust/full) ==================== */}
        {(variant === "full" || variant === "trust") && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-1">
                Prüfbarkeit statt Logo-Show
              </h3>
              <p className="text-sm text-muted-foreground">
                Verifizierbare Trust-Signale nach Schweizer Standard
              </p>
            </div>
            
            {/* Trust Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {TRUST_CARDS.map((card, idx) => (
                <TrustCardItem key={idx} card={card} />
              ))}
            </div>
            
            {/* Payment Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 p-4 rounded-xl bg-muted/30 border border-border"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Zahlung</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-card border border-border text-xs font-medium">
                      TWINT
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-card border border-border text-xs font-medium">
                      Kreditkarte
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-card border border-border text-xs font-medium">
                      Rechnung
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Bequem & sicher bezahlen. Bei Treuhand/Escrow: zusätzlicher Schutz.
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Swiss Trust Note */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Nach dem Swiss Trust Triumvirate: Institutional • Social • Process Trust
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
});
