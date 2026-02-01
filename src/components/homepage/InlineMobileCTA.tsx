/**
 * InlineMobileCTA - Mobile-only CTA that appears between sections
 * Addresses the CTA visibility gap on mobile between Hero and MobileStickyBar
 */

import { memo } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface InlineMobileCTAProps {
  variant?: "primary" | "secondary" | "compact";
  text?: string;
  href?: string;
  className?: string;
}

export const InlineMobileCTA = memo(function InlineMobileCTA({
  variant = "primary",
  text = "Jetzt Offerten erhalten",
  href = "/vergleich",
  className,
}: InlineMobileCTAProps) {
  if (variant === "compact") {
    return (
      <div className={cn("md:hidden py-4 px-4 bg-muted/30", className)}>
        <Button
          asChild
          size="lg"
          className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
        >
          <Link to={href}>
            <CheckCircle className="w-4 h-4 mr-2" />
            {text}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    );
  }

  if (variant === "secondary") {
    return (
      <div className={cn("md:hidden py-6 px-4", className)}>
        <div className="bg-card rounded-2xl border border-border p-4 text-center shadow-sm">
          <p className="text-sm text-muted-foreground mb-3">
            Bereit für Ihren Umzug?
          </p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full h-12 rounded-xl border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link to={href}>
              {text}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Primary variant - most prominent
  return (
    <div className={cn("md:hidden py-6 px-4 bg-gradient-to-b from-muted/50 to-transparent", className)}>
      <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium">Kostenlos vergleichen</p>
            <p className="text-xs text-muted-foreground">200+ geprüfte Firmen</p>
          </div>
        </div>
        <Button
          asChild
          size="lg"
          className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold"
        >
          <Link to={href}>
            {text}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
});

export default InlineMobileCTA;
