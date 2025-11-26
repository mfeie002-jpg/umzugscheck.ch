import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const StickyMobileCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling down 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 transform",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      {/* Gradient overlay for better visibility */}
      <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none"></div>
      
      <div className="bg-background/95 backdrop-blur-lg border-t shadow-2xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-center text-muted-foreground">Jetzt Offerten für Ihren Umzug erhalten</p>
            <Link to="/umzugsofferten" className="w-full">
              <Button size="lg" className="w-full h-12 text-base font-bold shadow-lg">
                Offerte erhalten
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
