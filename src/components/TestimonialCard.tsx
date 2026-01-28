import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TestimonialCardProps {
  name: string;
  location: string;
  text: string;
  rating: number;
  date?: string;
  serviceType?: string;
  image?: string;
  className?: string;
}

const TestimonialCard = ({ 
  name, 
  location, 
  text, 
  rating, 
  date,
  serviceType,
  image,
  className = "" 
}: TestimonialCardProps) => {
  return (
    <Card className={`p-6 md:p-8 hover-lift h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < rating ? 'text-warm fill-warm' : 'text-muted stroke-muted-foreground/30'}`}
            />
          ))}
        </div>
        {date && (
          <span className="text-xs text-muted-foreground">{date}</span>
        )}
      </div>

      <div className="relative flex-1">
        <Quote className="absolute -top-1 -left-1 h-8 w-8 text-alpine/10" />
        <p className="text-muted-foreground leading-relaxed pl-4 italic">
          "{text}"
        </p>
      </div>

      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{location}</span>
            {serviceType && (
              <>
                <span>•</span>
                <span className="text-alpine">{serviceType}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TestimonialCard;