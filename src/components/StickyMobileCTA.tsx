import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calculator, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const StickyMobileCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling down 300px
      const scrolled = window.scrollY > 300;
      setIsVisible(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      {/* Gradient overlay for better visibility */}
      <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      
      <div className="bg-background/95 backdrop-blur-lg border-t border-border shadow-strong">
        <div className="container mx-auto px-4 py-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Calculator Button */}
            <Link to="/rechner" className="block">
              <button className="w-full h-12 rounded-lg bg-primary hover:bg-primary-dark text-primary-foreground font-semibold shadow-medium hover:shadow-strong transition-all duration-300 flex items-center justify-center gap-2 group">
                <Calculator className="w-4 h-4" />
                <span className="text-sm">Kosten berechnen</span>
              </button>
            </Link>

            {/* Quote Request Button */}
            <Link to="/rechner" className="block">
              <button className="w-full h-12 rounded-lg bg-accent hover:bg-accent-dark text-white font-semibold shadow-medium hover:shadow-strong transition-all duration-300 flex items-center justify-center gap-2 group">
                <span className="text-sm">Offerte anfordern</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
