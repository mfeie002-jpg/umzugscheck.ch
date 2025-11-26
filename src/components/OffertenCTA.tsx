import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

interface OffertenCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  variant?: "primary" | "secondary" | "compact";
  className?: string;
  region?: string;
  showBenefits?: boolean;
}

export const OffertenCTA = ({
  title,
  description,
  buttonText = "Jetzt Umzugsofferten vergleichen",
  buttonLink,
  variant = "primary",
  className = "",
  region,
  showBenefits = false
}: OffertenCTAProps) => {
  // Generate defaults based on region if provided
  const defaultTitle = region 
    ? `Umzug in ${region}? Holen Sie mehrere Offerten ein.`
    : title || "Unsicher, welche Umzugsfirma am besten passt?";
  
  const defaultDescription = region
    ? `Vergleichen Sie kostenlose Offerten von geprüften Umzugsfirmen in ${region}.`
    : description || "Mit einer Anfrage erhalten Sie mehrere Offerten von geprüften Firmen.";

  const finalLink = buttonLink || (region 
    ? `/umzugsofferten?region=${region.toLowerCase().replace(/\s+/g, '-')}`
    : "/umzugsofferten");

  // Compact variant for inline CTAs
  if (variant === "compact") {
    return (
      <div className={`bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/10 ${className}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-lg mb-1">{defaultTitle}</h3>
            <p className="text-sm text-muted-foreground">{defaultDescription}</p>
          </div>
          <Link to={finalLink}>
            <Button size="lg" className="bg-destructive hover:bg-destructive/90 whitespace-nowrap">
              {buttonText}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Default full-width variant
  return (
    <Card className={`p-6 sm:p-8 md:p-10 ${variant === "primary" ? "bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20" : "bg-gradient-to-br from-secondary to-secondary/50"} ${className}`}>
      <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">{defaultTitle}</h2>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">{defaultDescription}</p>
        
        {showBenefits && (
          <div className="flex flex-wrap justify-center gap-6 py-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span className="text-sm font-medium">Kostenlos & unverbindlich</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span className="text-sm font-medium">Bis zu 40% sparen</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span className="text-sm font-medium">Geprüfte Firmen</span>
            </div>
          </div>
        )}

        <Link to={finalLink}>
          <Button 
            size="lg" 
            className={`w-full sm:w-auto text-sm sm:text-base ${variant === "primary" ? "bg-destructive hover:bg-destructive/90 shadow-accent" : ""}`}
          >
            {buttonText}
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
