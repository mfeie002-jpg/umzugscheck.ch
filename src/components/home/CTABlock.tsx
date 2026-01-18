import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useFlowPath } from "@/hooks/useUnifiedAB";

interface CTABlockProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export const CTABlock = ({ 
  title = "Bereit für deinen stressfreien Umzug?",
  description = "Erhalte jetzt kostenlose Umzugsofferten von geprüften Profis.",
  buttonText = "GRATIS OFFERTEN STARTEN",
  buttonLink = "/firmen"
}: CTABlockProps) => {
  const flowPath = useFlowPath();
  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-95" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
             backgroundSize: '30px 30px'
           }} 
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white space-y-6">
          <Sparkles className="h-12 w-12 mx-auto mb-4 animate-pulse" />
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            {title}
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-6">
            <Link to={buttonLink} className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="w-full sm:w-auto h-12 sm:h-14 px-5 sm:px-8 text-base sm:text-lg bg-white text-primary hover:bg-white/90 shadow-xl"
              >
                <span className="hidden sm:inline">{buttonText}</span>
                <span className="sm:hidden">Offerten starten</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link to={flowPath} className="w-full sm:w-auto">
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 sm:h-14 px-5 sm:px-8 text-base sm:text-lg bg-transparent text-white border-2 border-white hover:bg-white/10"
              >
                Kosten berechnen
              </Button>
            </Link>
          </div>

          <p className="text-sm text-white/80 pt-4">
            ✓ 100% kostenlos  ✓ Keine Werbeanrufe  ✓ 3–5 Offerten in 24–48h
          </p>
        </div>
      </div>
    </section>
  );
};
