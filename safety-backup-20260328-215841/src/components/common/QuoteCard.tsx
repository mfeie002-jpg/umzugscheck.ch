import { memo } from "react";
import { Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuoteCardProps {
  quote: string;
  author: string;
  role?: string;
  rating?: number;
  className?: string;
}

export const QuoteCard = memo(function QuoteCard({ 
  quote, 
  author, 
  role,
  rating = 5,
  className 
}: QuoteCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-xl p-6 shadow-card border border-border/50 relative",
      className
    )}>
      <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
      
      {rating > 0 && (
        <div className="flex gap-0.5 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={cn(
                "h-4 w-4",
                i < rating ? "fill-swiss-gold text-swiss-gold" : "text-muted-foreground/30"
              )} 
            />
          ))}
        </div>
      )}
      
      <p className="text-foreground leading-relaxed mb-4">"{quote}"</p>
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold">{author[0]}</span>
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">{author}</p>
          {role && <p className="text-xs text-muted-foreground">{role}</p>}
        </div>
      </div>
    </div>
  );
});
