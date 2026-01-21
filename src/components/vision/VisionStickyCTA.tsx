import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Always-visible conversion CTA for stakeholder pages.
 * Mobile-first: fixed bottom bar, min-h-44 touch target, safe-area padding.
 * Uses secondary (red) color per brand guidelines.
 */
export const VisionStickyCTA = memo(function VisionStickyCTA() {
  const location = useLocation();
  
  // Only show on stakeholder pages
  const stakeholderRoutes = ['/vision', '/family', '/investoren'];
  if (!stakeholderRoutes.includes(location.pathname)) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      role="complementary"
      aria-label="Offerten CTA"
    >
      <div className="bg-background/95 backdrop-blur-md border-t border-border">
        <div 
          className="container mx-auto px-4 py-3" 
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
        >
          <Link to="/umzugsofferten" className="block">
            <Button
              className="w-full min-h-[44px] touch-manipulation font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              size="lg"
            >
              Offerten erhalten
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
});
