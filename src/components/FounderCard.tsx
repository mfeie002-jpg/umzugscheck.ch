import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FounderCardProps {
  name: string;
  role: string;
  image: string;
  quote: string;
  generation: string;
  className?: string;
}

const FounderCard = ({ name, role, image, quote, generation, className = "" }: FounderCardProps) => {
  return (
    <Card className={`overflow-hidden hover-lift ${className}`}>
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gradient-warm text-warm-foreground rounded-full shadow-warm">
            {generation}
          </span>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground font-display">{name}</h3>
          <p className="text-sm font-medium text-alpine">{role}</p>
        </div>
        <div className="relative">
          <Quote className="absolute -top-1 -left-1 h-6 w-6 text-warm/30" />
          <p className="text-sm text-muted-foreground italic pl-5 leading-relaxed">
            {quote}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default FounderCard;