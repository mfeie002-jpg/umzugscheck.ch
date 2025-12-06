import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  headline: string;
  subline?: string;
  primaryCTA: {
    text: string;
    link: string;
    icon?: React.ReactNode;
  };
  secondaryCTA?: {
    text: string;
    link: string;
  };
  variant?: "default" | "dark" | "gradient";
  className?: string;
  showTrustLine?: boolean;
}

export const CTASection = ({
  headline,
  subline,
  primaryCTA,
  secondaryCTA,
  variant = "default",
  className,
  showTrustLine = true,
}: CTASectionProps) => {
  const bgStyles = {
    default: "bg-muted/50",
    dark: "bg-primary text-primary-foreground",
    gradient: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground",
  };

  const buttonStyles = {
    default: "bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta",
    dark: "bg-white text-primary hover:bg-white/90",
    gradient: "bg-white text-primary hover:bg-white/90",
  };

  return (
    <section className={cn(
      "py-16 md:py-20",
      bgStyles[variant],
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            {headline}
          </h2>
          
          {subline && (
            <p className={cn(
              "text-lg",
              variant === "default" ? "text-muted-foreground" : "text-primary-foreground/80"
            )}>
              {subline}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to={primaryCTA.link}>
              <Button 
                size="lg" 
                className={cn(
                  "h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-semibold",
                  buttonStyles[variant]
                )}
              >
                {primaryCTA.icon || <CheckCircle2 className="mr-2 h-5 w-5" />}
                {primaryCTA.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            {secondaryCTA && (
              <Link to={secondaryCTA.link}>
                <Button 
                  size="lg" 
                  variant={variant === "default" ? "outline" : "secondary"}
                  className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-semibold"
                >
                  {secondaryCTA.text}
                </Button>
              </Link>
            )}
          </div>
          
          {showTrustLine && (
            <div className={cn(
              "flex flex-wrap items-center justify-center gap-4 text-sm pt-4",
              variant === "default" ? "text-muted-foreground" : "text-primary-foreground/70"
            )}>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                100% kostenlos
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Unverbindlich
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Schweizer Datenschutz
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
