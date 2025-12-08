import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  badges?: string[];
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
}

export const CTASection = ({
  title = "Bereit für Ihren stressfreien Umzug?",
  description = "Vergleichen Sie jetzt kostenlos Umzugsofferten von geprüften Firmen und sparen Sie bis zu 40%.",
  buttonText = "Jetzt kostenlos Preis berechnen",
  buttonLink = "/rechner",
  badges = ["100% kostenlos", "Nur geprüfte Firmen", "In 2 Minuten"],
  variant = 'default',
  className
}: CTASectionProps) => {
  if (variant === 'minimal') {
    return (
      <section className={cn("py-12 md:py-16 bg-muted/50", className)}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
          <Link to={buttonLink}>
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white">
              {buttonText}
              <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  if (variant === 'compact') {
    return (
      <section className={cn(
        "py-10 md:py-14 bg-gradient-to-r from-primary to-primary/90 text-white",
        className
      )}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
              <p className="text-white/80 mt-1">{description}</p>
            </div>
            <Link to={buttonLink} className="flex-shrink-0">
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-white/95"
              >
                {buttonText}
                <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn(
      "py-20 md:py-28 bg-gradient-to-br from-primary via-primary to-primary/90 text-white relative overflow-hidden",
      className
    )}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-primary-foreground/10 to-transparent rounded-full blur-3xl" aria-hidden="true" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" aria-hidden="true" />
            <span>Unverbindlich & kostenlos</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 drop-shadow-lg">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
          
          <Link to={buttonLink}>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/95 shadow-lg group text-base sm:text-lg px-8 sm:px-10 h-14 sm:h-16 hover:scale-[1.02] transition-all active:scale-[0.98]"
            >
              <span className="hidden sm:inline">{buttonText}</span>
              <span className="sm:hidden">Preis berechnen</span>
              <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
          </Link>
          
          {badges.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 text-white/90">
              {badges.map((badge, index) => (
                <span key={index} className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
