import { memo } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  name: string;
  location?: string;
  rating: number;
  text: string;
  date?: string;
  avatar?: string;
  verified?: boolean;
  className?: string;
}

export const TestimonialCard = memo(({
  name,
  location,
  rating,
  text,
  date,
  avatar,
  verified = false,
  className
}: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "bg-card rounded-xl p-5 sm:p-6 border border-border/50 shadow-soft h-full flex flex-col",
        className
      )}
    >
      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < rating ? "fill-swiss-gold text-swiss-gold" : "fill-muted text-muted"
            )}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
        "{text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{name}</span>
            {verified && (
              <span className="px-1.5 py-0.5 bg-green-500/10 text-green-600 text-[10px] font-bold rounded uppercase">
                Verifiziert
              </span>
            )}
          </div>
          {(location || date) && (
            <span className="text-xs text-muted-foreground">
              {location}{location && date && " • "}{date}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

TestimonialCard.displayName = 'TestimonialCard';
