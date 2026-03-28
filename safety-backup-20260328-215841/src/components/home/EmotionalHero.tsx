import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface EmotionalHeroProps {
  title: string;
  subtitle: string;
  primaryCTA: { text: string; link: string };
  secondaryCTA?: { text: string; link: string };
  badgeText?: string;
  trustBadges?: boolean;
  backgroundImage?: string;
  cityName?: string;
}

export const EmotionalHero = ({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  badgeText,
  trustBadges = true,
  backgroundImage = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80",
  cityName,
}: EmotionalHeroProps) => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage}
          alt="Happy people moving"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/80" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {badgeText && (
            <Badge className="mb-6 bg-accent/10 text-accent border-accent/30 text-sm py-1.5 px-4">
              {badgeText}
            </Badge>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
            {title}
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-foreground/80 mb-8 leading-relaxed max-w-2xl">
            {subtitle}
          </p>

          {/* Trust Badges */}
          {trustBadges && (
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-10">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-foreground">4.8 / 5</span>
                <span className="text-sm text-muted-foreground hidden sm:inline">basierend auf echten Bewertungen</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm md:text-base font-semibold text-foreground">15'000+ vermittelte Umzüge</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-sm md:text-base font-semibold text-foreground">100% kostenlos</span>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={primaryCTA.link} className="flex-1 sm:flex-initial">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-14 px-8 text-base md:text-lg font-bold bg-gradient-accent hover:opacity-90 transition-opacity shadow-accent text-white"
              >
                {primaryCTA.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            {secondaryCTA && (
              <Link to={secondaryCTA.link} className="flex-1 sm:flex-initial">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto h-14 px-8 text-base md:text-lg font-bold border-2 bg-white/90 backdrop-blur-sm hover:bg-white"
                >
                  {secondaryCTA.text}
                </Button>
              </Link>
            )}
          </div>

          {/* Live Activity Signal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8 text-sm text-foreground/70"
          >
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>{cityName ? `12 Personen aus ${cityName} vergleichen gerade Umzüge` : "12 Personen vergleichen gerade Umzüge in der Schweiz"}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
