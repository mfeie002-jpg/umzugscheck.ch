/**
 * Mobile-optimized Company Card
 * Swipeable actions, larger touch targets, optimized for thumb-zone
 */

import { memo, useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Star, Clock, Shield, Phone, ChevronRight, MapPin, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MobileCompanyCardProps {
  company: {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    badges: string[];
    priceLevel: 'Günstig' | 'Mittel' | 'Premium';
    responseTime: string;
  };
  onRequestQuote?: () => void;
  onCall?: () => void;
}

const PRICE_STYLES: Record<string, string> = {
  'Günstig': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Mittel': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Premium': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export const MobileCompanyCard = memo(({ company, onRequestQuote, onCall }: MobileCompanyCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const x = useMotionValue(0);
  const background = useTransform(x, [-100, 0], ["hsl(var(--primary))", "hsl(var(--background))"]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -80) {
      // Swiped left - show action
      onRequestQuote?.();
    }
    x.set(0);
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl border border-border bg-card touch-manipulation"
      style={{ x }}
      drag="x"
      dragConstraints={{ left: -100, right: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
    >
      {/* Swipe Action Background */}
      <motion.div
        className="absolute inset-y-0 right-0 w-24 flex items-center justify-center bg-primary text-primary-foreground"
        style={{ opacity: useTransform(x, [-100, -50, 0], [1, 0.5, 0]) }}
      >
        <span className="text-sm font-medium">Offerte</span>
      </motion.div>

      {/* Main Card Content */}
      <motion.div
        className="bg-card p-4"
        style={{ background }}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base truncate">{company.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-sm">{company.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({company.reviewCount} Bewertungen)
              </span>
            </div>
          </div>
          <Badge className={`${PRICE_STYLES[company.priceLevel]} shrink-0`}>
            {company.priceLevel}
          </Badge>
        </div>

        {/* Info Row */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {company.responseTime}
          </span>
          {company.badges.includes('Geprüft') && (
            <span className="flex items-center gap-1 text-green-600">
              <Shield className="w-4 h-4" />
              Geprüft
            </span>
          )}
        </div>

        {/* Badges (collapsible) */}
        <div className={`flex flex-wrap gap-2 mb-4 ${isExpanded ? '' : 'max-h-8 overflow-hidden'}`}>
          {company.badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full"
            >
              {badge === 'Swiss Made' && <Award className="w-3 h-3 text-red-600" />}
              {badge}
            </span>
          ))}
        </div>

        {/* Action Buttons - Optimized for Thumb Zone */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-14 text-base font-medium touch-manipulation"
            asChild
          >
            <Link to={`/firma/${company.id}`}>
              Details
              <ChevronRight className="ml-1 w-5 h-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            className="flex-1 h-14 text-base font-medium bg-secondary hover:bg-secondary/90 text-secondary-foreground touch-manipulation"
            onClick={onRequestQuote}
          >
            Offerte
          </Button>
          {onCall && (
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 shrink-0 touch-manipulation"
              onClick={onCall}
            >
              <Phone className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Expand Toggle */}
        {company.badges.length > 2 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-center text-xs text-primary mt-2 py-2 touch-manipulation"
          >
            {isExpanded ? "Weniger anzeigen" : `+${company.badges.length - 2} weitere Vorteile`}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
});

MobileCompanyCard.displayName = 'MobileCompanyCard';
