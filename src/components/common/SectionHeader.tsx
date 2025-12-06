import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  badge?: {
    text: string;
    icon?: LucideIcon;
  };
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

export const SectionHeader = ({
  badge,
  title,
  subtitle,
  align = "center",
  className,
  titleClassName,
}: SectionHeaderProps) => {
  const alignStyles = {
    left: "text-left",
    center: "text-center mx-auto",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-10 md:mb-16 max-w-3xl",
        alignStyles[align],
        className
      )}
    >
      {badge && (
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm uppercase tracking-wider mb-4">
          {badge.icon && <badge.icon className="h-4 w-4" />}
          {badge.text}
        </span>
      )}
      
      <h2 className={cn(
        "text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4",
        titleClassName
      )}>
        {title}
      </h2>
      
      {subtitle && (
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
