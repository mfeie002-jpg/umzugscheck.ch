import { memo } from "react";
import { Link } from "react-router-dom";
import { Star, CheckCircle, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CompanyCardCompactProps {
  name: string;
  slug: string;
  rating: number;
  reviewCount: number;
  priceLevel?: "günstig" | "fair" | "premium";
  location?: string;
  verified?: boolean;
  sponsored?: boolean;
  logo?: string;
  className?: string;
}

const priceLevelLabels = {
  "günstig": { text: "Günstig", color: "bg-green-500/10 text-green-600" },
  "fair": { text: "Fair", color: "bg-primary/10 text-primary" },
  "premium": { text: "Premium", color: "bg-amber-500/10 text-amber-600" }
};

export const CompanyCardCompact = memo(({
  name,
  slug,
  rating,
  reviewCount,
  priceLevel,
  location,
  verified = false,
  sponsored = false,
  logo,
  className
}: CompanyCardCompactProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className={cn("group", className)}
    >
      <Link
        to={`/umzugsfirmen/${slug}`}
        className="block bg-card rounded-xl p-4 border border-border/50 shadow-soft hover:shadow-medium hover:border-primary/20 transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Logo */}
          {logo ? (
            <img
              src={logo}
              alt={name}
              className="w-12 h-12 rounded-lg object-contain bg-muted p-1"
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {name.charAt(0)}
              </span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                {name}
              </h3>
              {verified && (
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" aria-label="Verifiziert" />
              )}
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="h-3.5 w-3.5 fill-swiss-gold text-swiss-gold" aria-hidden="true" />
              <span className="text-xs font-semibold text-foreground">{rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({reviewCount})</span>
            </div>
          </div>
          
          {/* Sponsored badge */}
          {sponsored && (
            <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] font-medium rounded">
              Gesponsert
            </span>
          )}
        </div>
        
        {/* Meta */}
        <div className="flex items-center flex-wrap gap-2 mb-3">
          {location && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {location}
            </span>
          )}
          {priceLevel && (
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-semibold",
              priceLevelLabels[priceLevel].color
            )}>
              {priceLevelLabels[priceLevel].text}
            </span>
          )}
        </div>
        
        {/* CTA */}
        <Button
          size="sm"
          variant="outline"
          className="w-full h-8 text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
        >
          Offerte anfragen
          <ArrowRight className="ml-1.5 h-3 w-3" aria-hidden="true" />
        </Button>
      </Link>
    </motion.div>
  );
});

CompanyCardCompact.displayName = 'CompanyCardCompact';
