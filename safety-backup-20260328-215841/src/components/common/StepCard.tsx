import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  image?: string;
  highlight?: string;
  className?: string;
}

export const StepCard = memo(({
  step,
  title,
  description,
  image,
  highlight,
  className
}: StepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: step * 0.1 }}
      className={cn("group", className)}
    >
      <div className="bg-card rounded-2xl overflow-hidden shadow-medium hover:shadow-premium transition-all duration-400 border border-border/50 h-full">
        {/* Image */}
        {image && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={image}
              alt={title}
              loading={step === 1 ? "eager" : "lazy"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Step Number */}
            <div className="absolute top-3 left-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-card rounded-xl shadow-lg flex items-center justify-center">
                <span className="text-lg sm:text-xl font-bold text-primary">
                  {step}
                </span>
              </div>
            </div>
            {/* Highlight Badge */}
            {highlight && (
              <div className="absolute bottom-3 right-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-card/95 backdrop-blur-sm rounded-full text-xs font-bold text-secondary shadow-lg">
                  {highlight}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6">
          {!image && (
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-lg font-bold text-primary">{step}</span>
            </div>
          )}
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Schritt {step}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

StepCard.displayName = 'StepCard';
