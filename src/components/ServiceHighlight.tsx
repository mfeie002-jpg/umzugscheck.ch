import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ServiceHighlightProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  link: string;
  image?: string;
  highlight?: boolean;
  className?: string;
}

const ServiceHighlight = ({ 
  icon: Icon, 
  title, 
  description, 
  features, 
  link, 
  image,
  highlight = false,
  className = "" 
}: ServiceHighlightProps) => {
  return (
    <Link to={link}>
      <Card className={`overflow-hidden hover-lift cursor-pointer h-full group ${highlight ? 'ring-2 ring-alpine shadow-glow' : ''} ${className}`}>
        {image && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-background/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="h-5 w-5 text-background" />
                </div>
                <h3 className="text-lg font-bold text-background font-display">{title}</h3>
              </div>
            </div>
            {highlight && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-alpine text-alpine-foreground rounded-full">
                  Beliebt
                </span>
              </div>
            )}
          </div>
        )}
        <div className="p-5 space-y-4">
          {!image && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground font-display">{title}</h3>
            </div>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          <ul className="space-y-2">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-alpine flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 text-alpine font-medium text-sm group-hover:gap-3 transition-all">
            <span>Mehr erfahren</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ServiceHighlight;