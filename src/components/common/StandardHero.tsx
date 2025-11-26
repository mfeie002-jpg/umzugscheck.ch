import { Button } from "@/components/ui/button";
import { ArrowRight, Star, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StandardHeroProps {
  h1: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  showTrustRow?: boolean;
  backgroundImage?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * Standardized Hero Component
 * Swiss premium design with emotional imagery and conversion focus
 */
export const StandardHero = ({
  h1,
  subtitle,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  showTrustRow = true,
  backgroundImage = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80&auto=format&fit=crop",
  className = "",
  children
}: StandardHeroProps) => {
  return (
    <section className={`relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage}
          alt="Umzug - Professionelle Hilfe beim Umziehen"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white mb-4 md:mb-6"
          >
            {h1}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-white/95 mb-6 md:mb-8 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>

          {/* Trust Row */}
          {showTrustRow && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-8 text-white text-sm md:text-base"
            >
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.8 / 5</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>15'000+ Umzüge</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>100% kostenlos</span>
              </div>
            </motion.div>
          )}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10 md:mb-12"
          >
            <Link to={ctaLink}>
              <Button 
                size="lg"
                className="h-14 md:h-16 px-8 md:px-12 text-base md:text-lg font-bold gradient-cta text-white shadow-strong hover:shadow-accent transition-all hover:scale-105 w-full sm:w-auto"
              >
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </Link>
            {secondaryCtaText && secondaryCtaLink && (
              <Link to={secondaryCtaLink}>
                <Button 
                  variant="outline"
                  size="lg"
                  className="h-14 md:h-16 px-8 md:px-12 text-base md:text-lg font-bold bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 w-full sm:w-auto"
                >
                  {secondaryCtaText}
                </Button>
              </Link>
            )}
          </motion.div>

          {/* Additional Content (calculator, etc.) */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
