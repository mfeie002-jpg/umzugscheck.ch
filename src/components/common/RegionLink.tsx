import { memo } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RegionLinkProps {
  name: string;
  slug: string;
  companiesCount?: number;
  isPopular?: boolean;
  className?: string;
}

export const RegionLink = memo(({
  name,
  slug,
  companiesCount,
  isPopular = false,
  className
}: RegionLinkProps) => {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/${slug}`}
        className={cn(
          "flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group",
          isPopular && "bg-primary/5",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
            {name}
          </span>
          {isPopular && (
            <span className="px-1.5 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded uppercase">
              Beliebt
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {companiesCount !== undefined && (
            <span className="text-xs text-muted-foreground">
              {companiesCount} Firmen
            </span>
          )}
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
        </div>
      </Link>
    </motion.div>
  );
});

RegionLink.displayName = 'RegionLink';
