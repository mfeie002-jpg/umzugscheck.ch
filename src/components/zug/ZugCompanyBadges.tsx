/**
 * Zug Company Badges Component
 * #93-100: Enhanced badge system for company cards
 */

import { motion } from "framer-motion";
import { 
  Sparkles, Award, TrendingDown, Shield, Star, 
  Clock, Zap, Heart, Crown, Leaf, CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BadgeConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  tooltip: string;
  priority: number;
}

const badgeConfigs: BadgeConfig[] = [
  {
    id: "ai-recommended",
    label: "KI-Empfehlung",
    icon: Sparkles,
    color: "text-purple-700",
    bgColor: "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200",
    tooltip: "Von unserer KI als beste Wahl für deine Anforderungen empfohlen",
    priority: 1,
  },
  {
    id: "premium",
    label: "Premium Partner",
    icon: Crown,
    color: "text-amber-700",
    bgColor: "bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-200",
    tooltip: "Höchste Qualitätsstandards und exzellenter Service",
    priority: 2,
  },
  {
    id: "best-price",
    label: "Bester Preis",
    icon: TrendingDown,
    color: "text-green-700",
    bgColor: "bg-gradient-to-r from-green-100 to-emerald-100 border-green-200",
    tooltip: "Bestes Preis-Leistungs-Verhältnis in dieser Kategorie",
    priority: 3,
  },
  {
    id: "popular",
    label: "Beliebt",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-gradient-to-r from-red-50 to-pink-50 border-red-200",
    tooltip: "Von vielen Kunden in Zug gebucht und empfohlen",
    priority: 4,
  },
  {
    id: "verified",
    label: "Verifiziert",
    icon: Shield,
    color: "text-blue-700",
    bgColor: "bg-blue-100 border-blue-200",
    tooltip: "Vollständig geprüft: Versicherung, Bewilligungen, Referenzen",
    priority: 5,
  },
  {
    id: "fast-response",
    label: "Schnelle Antwort",
    icon: Zap,
    color: "text-orange-600",
    bgColor: "bg-orange-100 border-orange-200",
    tooltip: "Antwortet durchschnittlich innerhalb von 2 Stunden",
    priority: 6,
  },
  {
    id: "eco-friendly",
    label: "Umweltfreundlich",
    icon: Leaf,
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
    tooltip: "Setzt auf nachhaltige Praktiken und umweltfreundliche Fahrzeuge",
    priority: 7,
  },
  {
    id: "top-rated",
    label: "Top bewertet",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 border-yellow-200",
    tooltip: "Gehört zu den am besten bewerteten Firmen im Kanton Zug",
    priority: 8,
  },
];

interface CompanyBadgesProps {
  isAIRecommended?: boolean;
  isPremium?: boolean;
  isBestPrice?: boolean;
  isPopular?: boolean;
  isVerified?: boolean;
  rating?: number;
  maxBadges?: number;
  size?: "sm" | "md" | "lg";
  showTooltips?: boolean;
}

export const CompanyBadges = ({
  isAIRecommended = false,
  isPremium = false,
  isBestPrice = false,
  isPopular = false,
  isVerified = true,
  rating = 0,
  maxBadges = 3,
  size = "sm",
  showTooltips = true,
}: CompanyBadgesProps) => {
  // Determine which badges to show
  const activeBadges: BadgeConfig[] = [];
  
  if (isAIRecommended) activeBadges.push(badgeConfigs.find(b => b.id === "ai-recommended")!);
  if (isPremium) activeBadges.push(badgeConfigs.find(b => b.id === "premium")!);
  if (isBestPrice) activeBadges.push(badgeConfigs.find(b => b.id === "best-price")!);
  if (isPopular) activeBadges.push(badgeConfigs.find(b => b.id === "popular")!);
  if (isVerified) activeBadges.push(badgeConfigs.find(b => b.id === "verified")!);
  if (rating >= 4.7) activeBadges.push(badgeConfigs.find(b => b.id === "top-rated")!);
  
  // Sort by priority and limit
  const displayBadges = activeBadges
    .sort((a, b) => a.priority - b.priority)
    .slice(0, maxBadges);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (displayBadges.length === 0) return null;

  const BadgeContent = ({ badge, index }: { badge: BadgeConfig; index: number }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Badge
        variant="outline"
        className={`${badge.bgColor} ${badge.color} ${sizeClasses[size]} border font-medium`}
      >
        <badge.icon className={`${iconSizes[size]} mr-1`} />
        {badge.label}
      </Badge>
    </motion.div>
  );

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayBadges.map((badge, index) => (
        showTooltips ? (
          <TooltipProvider key={badge.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <BadgeContent badge={badge} index={index} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{badge.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <BadgeContent key={badge.id} badge={badge} index={index} />
        )
      ))}
      
      {activeBadges.length > maxBadges && (
        <Badge variant="secondary" className={`${sizeClasses[size]} cursor-pointer`}>
          +{activeBadges.length - maxBadges}
        </Badge>
      )}
    </div>
  );
};

// Sponsored badge with special styling
export const SponsoredBadge = ({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`bg-muted/50 text-muted-foreground border-muted-foreground/30 ${sizeClasses[size]}`}
          >
            Gesponsert
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">
            Diese Firma zahlt für eine bevorzugte Platzierung. 
            Die Qualitätsprüfung bleibt dieselbe.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Savings badge
export const SavingsBadge = ({ percent }: { percent: number }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <Badge className="bg-green-500 text-white border-none">
        <TrendingDown className="w-3 h-3 mr-1" />
        bis zu {percent}% sparen
      </Badge>
    </motion.div>
  );
};

// Availability badge
export const AvailabilityBadge = ({ availability }: { availability: string }) => {
  const isImmediate = availability.toLowerCase().includes("sofort");
  
  return (
    <Badge
      variant="outline"
      className={`${
        isImmediate 
          ? "bg-green-100 text-green-700 border-green-200" 
          : "bg-blue-100 text-blue-700 border-blue-200"
      }`}
    >
      {isImmediate ? (
        <Zap className="w-3 h-3 mr-1" />
      ) : (
        <Clock className="w-3 h-3 mr-1" />
      )}
      {availability}
    </Badge>
  );
};
