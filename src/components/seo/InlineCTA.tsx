import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Shield, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Page-specific CTA configurations
 */
const PAGE_CTA_CONFIG = {
  "umzugsofferten": {
    headline: "Kostenlose Umzugsofferten in 2 Minuten erhalten",
    buttonText: "Jetzt Umzugsofferten vergleichen",
    href: "/umzugsofferten#hero",
  },
  "beste-umzugsfirma": {
    headline: "Finden Sie die beste Umzugsfirma für Ihren Umzug",
    buttonText: "Jetzt beste Umzugsfirma finden",
    href: "/umzugsofferten",
  },
  "guenstige-umzugsfirma": {
    headline: "Günstige Umzugsfirma finden & bis zu 40% sparen",
    buttonText: "Jetzt günstige Umzugsfirma vergleichen",
    href: "/umzugsofferten",
  },
  "umzugsfirmen-schweiz": {
    headline: "200+ Umzugsfirmen in der Schweiz vergleichen",
    buttonText: "Jetzt Offerten erhalten",
    href: "/umzugsofferten",
  },
} as const;

type PageType = keyof typeof PAGE_CTA_CONFIG;

interface InlineCTAProps {
  /** Which page variant to use */
  pageType: PageType;
  /** Override headline */
  headline?: string;
  /** Override button text */
  buttonText?: string;
  /** Override target URL */
  href?: string;
  /** Visual variant */
  variant?: "default" | "compact" | "hero";
  /** Additional CSS classes */
  className?: string;
}

const trustBadges = [
  { icon: CheckCircle, text: "Kostenlos" },
  { icon: Shield, text: "Unverbindlich" },
  { icon: Lock, text: "Datenschutz" },
];

export function InlineCTA({
  pageType,
  headline,
  buttonText,
  href,
  variant = "default",
  className = "",
}: InlineCTAProps) {
  const navigate = useNavigate();
  const config = PAGE_CTA_CONFIG[pageType];
  
  const finalHeadline = headline || config.headline;
  const finalButtonText = buttonText || config.buttonText;
  const finalHref = href || config.href;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If it's an anchor link on the same page
    if (finalHref.includes("#")) {
      const [path, hash] = finalHref.split("#");
      if (window.location.pathname === path || path === "") {
        // Same page, just scroll
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
      // Different page, navigate then scroll
      navigate(path || "/");
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      navigate(finalHref);
    }
  };

  if (variant === "compact") {
    return (
      <Card className={`border-primary/20 bg-primary/5 ${className}`}>
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-lg text-foreground">{finalHeadline}</h3>
          </div>
          <Button size="lg" onClick={handleClick} className="whitespace-nowrap">
            {finalButtonText}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (variant === "hero") {
    return (
      <div className={`text-center ${className}`}>
        <Button 
          size="lg" 
          onClick={handleClick}
          className="text-lg px-8 h-14 bg-white text-primary hover:bg-white/90 shadow-xl"
        >
          {finalButtonText}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    );
  }

  // Default variant - full section CTA
  return (
    <section className={`py-12 sm:py-16 bg-gradient-to-br from-primary/10 via-primary/5 to-background ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {finalHeadline}
          </h2>
          
          <Button 
            size="lg" 
            onClick={handleClick}
            className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 mb-6"
          >
            {finalButtonText}
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                <badge.icon className="w-4 h-4 text-primary" />
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Pre-footer CTA variant with slightly different styling
 */
export function PreFooterCTA({
  pageType,
  headline,
  buttonText,
  className = "",
}: Omit<InlineCTAProps, "variant">) {
  const config = PAGE_CTA_CONFIG[pageType];
  const navigate = useNavigate();
  
  const finalHeadline = headline || config.headline;
  const finalButtonText = buttonText || config.buttonText;
  const finalHref = config.href;

  return (
    <section className={`py-12 sm:py-16 bg-muted/50 border-t border-border ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-foreground">
            {finalHeadline}
          </h2>
          <p className="text-muted-foreground mb-6">
            Vergleichen Sie jetzt kostenlos und unverbindlich.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => navigate(finalHref)}
            className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14"
          >
            {finalButtonText}
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                <badge.icon className="w-4 h-4 text-green-600" />
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InlineCTA;
