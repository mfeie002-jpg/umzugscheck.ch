/**
 * ============================================================================
 * SWISS TRUST BADGES - ARCHETYP COMPONENT
 * ============================================================================
 * 
 * Premium Trust-Signale für den Schweizer Umzugsmarkt.
 * Optimiert für alle 4 Archetypen:
 * - Sicherheits-Sucher: ASTAG, Abnahmegarantie, Versicherung
 * - Effizienz-Maximierer: Swiss Made, Schnelle Offerten
 * - Preis-Jäger: Kostenlos, Transparent
 * - Chaos-Manager: Geprüfte Partner, Erfolge
 * 
 * @version 2.0.0 - Archetyp Edition
 */

import { memo } from "react";
import { 
  Shield, 
  CheckCircle, 
  Award, 
  Star, 
  Clock, 
  Users,
  Lock,
  BadgeCheck,
  FileCheck,
  Building2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================
interface TrustBadge {
  id: string;
  icon: React.ElementType;
  label: string;
  value?: string;
  description?: string;
  archetype: ('security' | 'efficiency' | 'value' | 'overwhelmed')[];
  priority: number; // 1-5, 1 = highest
}

interface SwissTrustBadgesProps {
  variant?: "light" | "dark" | "hero" | "minimal" | "card";
  size?: "sm" | "md" | "lg";
  layout?: "row" | "grid" | "compact";
  maxBadges?: number;
  archetype?: 'security' | 'efficiency' | 'value' | 'overwhelmed' | 'all';
  showLabels?: boolean;
  animated?: boolean;
  className?: string;
}

// ============================================================================
// BADGE DATA - Swiss Market Optimized
// ============================================================================
const SWISS_TRUST_BADGES: TrustBadge[] = [
  {
    id: "astag",
    icon: Award,
    label: "ASTAG Zertifiziert",
    description: "Schweizerischer Nutzfahrzeugverband",
    archetype: ['security'],
    priority: 1
  },
  {
    id: "guarantee",
    icon: Shield,
    label: "Abnahmegarantie",
    value: "100%",
    description: "Geld-zurück bei Nichtabnahme",
    archetype: ['security', 'overwhelmed'],
    priority: 1
  },
  {
    id: "fixprice",
    icon: FileCheck,
    label: "Fixpreis-Garantie",
    description: "Keine versteckten Kosten",
    archetype: ['security', 'value'],
    priority: 2
  },
  {
    id: "rating",
    icon: Star,
    label: "Kundenbewertung",
    value: "4.8/5",
    description: "Basierend auf 2'400+ Bewertungen",
    archetype: ['security', 'efficiency'],
    priority: 2
  },
  {
    id: "partners",
    icon: BadgeCheck,
    label: "Geprüfte Partner",
    value: "200+",
    description: "Verifizierte Umzugsfirmen",
    archetype: ['security', 'overwhelmed'],
    priority: 2
  },
  {
    id: "free",
    icon: CheckCircle,
    label: "100% Kostenlos",
    description: "Keine Gebühren für Nutzer",
    archetype: ['value'],
    priority: 3
  },
  {
    id: "fast",
    icon: Clock,
    label: "Schnelle Offerten",
    value: "24-48h",
    description: "Angebote innert 1-2 Tagen",
    archetype: ['efficiency'],
    priority: 3
  },
  {
    id: "moves",
    icon: Users,
    label: "Erfolgreiche Umzüge",
    value: "15'000+",
    description: "Zufriedene Kunden seit 2018",
    archetype: ['security', 'overwhelmed'],
    priority: 3
  },
  {
    id: "swiss",
    icon: Building2,
    label: "Swiss Made",
    description: "100% Schweizer Unternehmen",
    archetype: ['security'],
    priority: 4
  },
  {
    id: "ssl",
    icon: Lock,
    label: "SSL Verschlüsselt",
    description: "Sichere Datenübertragung",
    archetype: ['security'],
    priority: 5
  },
  {
    id: "ndsg",
    icon: Shield,
    label: "nDSG Konform",
    description: "Schweizer Datenschutzgesetz",
    archetype: ['security'],
    priority: 5
  }
];

// ============================================================================
// BADGE COMPONENT
// ============================================================================
const Badge = memo(({ 
  badge, 
  variant, 
  size, 
  showLabel,
  animated 
}: { 
  badge: TrustBadge; 
  variant: string; 
  size: string;
  showLabel: boolean;
  animated: boolean;
}) => {
  const Icon = badge.icon;
  
  const sizeStyles = {
    sm: "gap-1 text-xs",
    md: "gap-1.5 text-sm",
    lg: "gap-2 text-base"
  };
  
  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  const variantStyles = {
    light: "text-muted-foreground hover:text-foreground",
    dark: "text-primary-foreground/80 hover:text-primary-foreground",
    hero: "text-white/90 hover:text-white",
    minimal: "text-foreground/70 hover:text-foreground",
    card: "text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full hover:bg-muted"
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center font-medium transition-colors cursor-default",
        sizeStyles[size as keyof typeof sizeStyles],
        variantStyles[variant as keyof typeof variantStyles],
        animated && "hover:scale-105 transition-transform"
      )}
      title={badge.description}
    >
      <Icon 
        className={cn(
          iconSizes[size as keyof typeof iconSizes],
          "flex-shrink-0",
          badge.id === "astag" && "text-primary",
          badge.id === "guarantee" && "text-success",
          badge.id === "rating" && "text-swiss-gold"
        )} 
        aria-hidden="true"
      />
      {badge.value && (
        <span className="font-bold">{badge.value}</span>
      )}
      {showLabel && (
        <span className={size === "sm" ? "hidden sm:inline" : ""}>
          {badge.label}
        </span>
      )}
    </span>
  );
});

Badge.displayName = 'Badge';

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const SwissTrustBadges = memo(({
  variant = "light",
  size = "md",
  layout = "row",
  maxBadges = 5,
  archetype = 'all',
  showLabels = true,
  animated = true,
  className
}: SwissTrustBadgesProps) => {
  // Filter badges by archetype
  let filteredBadges = SWISS_TRUST_BADGES;
  
  if (archetype !== 'all') {
    filteredBadges = SWISS_TRUST_BADGES.filter(
      badge => badge.archetype.includes(archetype)
    );
  }
  
  // Sort by priority and limit
  const displayBadges = filteredBadges
    .sort((a, b) => a.priority - b.priority)
    .slice(0, maxBadges);

  const layoutStyles = {
    row: "flex flex-wrap items-center justify-center gap-3 md:gap-5",
    grid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3",
    compact: "flex flex-wrap items-center gap-2"
  };

  return (
    <div 
      className={cn(layoutStyles[layout], className)}
      role="list"
      aria-label="Vertrauenssignale"
    >
      {displayBadges.map((badge) => (
        <Badge 
          key={badge.id}
          badge={badge}
          variant={variant}
          size={size}
          showLabel={showLabels}
          animated={animated}
        />
      ))}
    </div>
  );
});

SwissTrustBadges.displayName = 'SwissTrustBadges';

// ============================================================================
// HERO TRUST STRIP
// ============================================================================
export const HeroTrustStrip = memo(({ className }: { className?: string }) => (
  <div className={cn(
    "flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm",
    className
  )}>
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <Shield className="h-4 w-4 text-success" />
      <span className="font-semibold">Abnahmegarantie</span>
    </span>
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <Star className="h-4 w-4 text-swiss-gold" />
      <span><strong>4.8</strong>/5 Bewertung</span>
    </span>
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <BadgeCheck className="h-4 w-4 text-primary" />
      <span><strong>200+</strong> geprüfte Partner</span>
    </span>
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <Clock className="h-4 w-4 text-info" />
      <span>Offerten in <strong>24-48h</strong></span>
    </span>
  </div>
));

HeroTrustStrip.displayName = 'HeroTrustStrip';

// ============================================================================
// ASTAG BADGE (Premium)
// ============================================================================
export const ASTAGBadge = memo(({ 
  size = "md",
  showLabel = true,
  className 
}: { 
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}) => {
  const sizeStyles = {
    sm: "h-6 gap-1 text-xs px-2",
    md: "h-8 gap-1.5 text-sm px-3",
    lg: "h-10 gap-2 text-base px-4"
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center font-semibold",
        "bg-primary/10 text-primary rounded-full",
        "border border-primary/20",
        sizeStyles[size],
        className
      )}
      title="ASTAG Plus Zertifizierung - Schweizerischer Nutzfahrzeugverband"
    >
      <Award className="h-4 w-4" aria-hidden="true" />
      {showLabel && <span>ASTAG Zertifiziert</span>}
    </span>
  );
});

ASTAGBadge.displayName = 'ASTAGBadge';

// ============================================================================
// GUARANTEE BADGE (Security Archetype)
// ============================================================================
export const GuaranteeBadge = memo(({ 
  type = "abnahme",
  className 
}: { 
  type?: "abnahme" | "fixpreis";
  className?: string;
}) => {
  const config = {
    abnahme: {
      icon: Shield,
      label: "Abnahmegarantie",
      color: "text-success bg-success/10 border-success/20"
    },
    fixpreis: {
      icon: FileCheck,
      label: "Fixpreis-Garantie",
      color: "text-primary bg-primary/10 border-primary/20"
    }
  };

  const { icon: Icon, label, color } = config[type];

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
        "text-sm font-semibold border",
        color,
        className
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </span>
  );
});

GuaranteeBadge.displayName = 'GuaranteeBadge';

// ============================================================================
// MINI TRUST INDICATOR (Inline use)
// ============================================================================
export const MiniTrustIndicator = memo(({ 
  type,
  className 
}: { 
  type: "secure" | "fast" | "free" | "verified";
  className?: string;
}) => {
  const config = {
    secure: { icon: Lock, text: "SSL gesichert", color: "text-success" },
    fast: { icon: Sparkles, text: "Schnell & einfach", color: "text-primary" },
    free: { icon: CheckCircle, text: "100% kostenlos", color: "text-success" },
    verified: { icon: BadgeCheck, text: "Geprüft", color: "text-primary" }
  };

  const { icon: Icon, text, color } = config[type];

  return (
    <span className={cn("inline-flex items-center gap-1 text-xs text-muted-foreground", className)}>
      <Icon className={cn("h-3 w-3", color)} aria-hidden="true" />
      {text}
    </span>
  );
});

MiniTrustIndicator.displayName = 'MiniTrustIndicator';

export default SwissTrustBadges;
