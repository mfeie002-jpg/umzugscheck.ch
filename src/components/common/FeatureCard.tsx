import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight?: string;
  className?: string;
}

export const FeatureCard = memo(({
  icon: Icon,
  title,
  description,
  highlight,
  className
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative bg-card rounded-xl p-5 sm:p-6 border border-border/50 shadow-soft hover:shadow-medium hover:border-primary/20 transition-all duration-300",
        className
      )}
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>

      {/* Content */}
      <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Highlight Badge */}
      {highlight && (
        <span className="absolute top-3 right-3 px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full uppercase">
          {highlight}
        </span>
      )}
    </motion.div>
  );
});

FeatureCard.displayName = 'FeatureCard';
