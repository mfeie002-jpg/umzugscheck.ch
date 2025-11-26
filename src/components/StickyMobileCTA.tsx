import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StickyMobileCTAProps {
  text?: string;
  link?: string;
}

export const StickyMobileCTA = ({ text = "Offerte erhalten", link = "/umzugsofferten" }: StickyMobileCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling down 200px on mobile
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      )}
    >
      {/* Gradient overlay for smooth transition */}
      <div className="absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-background/95 via-background/50 to-transparent pointer-events-none" />
      
      <div className="bg-background/98 backdrop-blur-xl border-t-2 border-primary/20 shadow-2xl">
        <div className="container mx-auto px-4 py-3 safe-bottom">
          <Link to={link} className="block">
            <Button 
              size="lg" 
              className="w-full h-14 text-base font-bold shadow-lg hover:scale-[1.02] transition-transform active:scale-95"
            >
              {text}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
