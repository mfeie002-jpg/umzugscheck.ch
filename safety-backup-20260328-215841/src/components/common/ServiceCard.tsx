import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  badge?: string | null;
  badgeColor?: string;
  className?: string;
}

export const ServiceCard = memo(({
  title,
  description,
  image,
  link,
  badge,
  badgeColor = "bg-green-500",
  className
}: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className={cn("group", className)}
    >
      <Link
        to={link}
        className="relative block h-full bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-medium border border-border/50 hover:border-primary/30 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative h-28 sm:h-32 md:h-36 overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Badge */}
          {badge && (
            <span className={cn(
              "absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold text-white",
              badgeColor
            )}>
              {badge}
            </span>
          )}

          {/* Title on Image */}
          <h3 className="absolute bottom-2 left-3 right-3 text-sm sm:text-base font-bold text-white drop-shadow-lg">
            {title}
          </h3>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">
            {description}
          </p>
          <span className="inline-flex items-center text-xs sm:text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
            Mehr erfahren
            <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';
