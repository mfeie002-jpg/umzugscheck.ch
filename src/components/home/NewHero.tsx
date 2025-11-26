import { Button } from "@/components/ui/button";
import { Star, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { InstantCalculator } from "./InstantCalculator";
import { LiveSignals } from "./LiveSignals";

export const NewHero = () => {
  return (
    <section className="relative min-h-[90vh] lg:min-h-[85vh] flex items-center overflow-hidden">
      {/* Emotional Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80&auto=format&fit=crop"
          alt="Glückliche Familie beim Umzug"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white space-y-6"
            >
              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Dein stressfreier Umzug beginnt hier.
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                Vergleiche geprüfte Schweizer Umzugsfirmen und erhalte kostenlose Offerten in 2 Minuten.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 py-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">4.8 / 5</span>
                  <span className="text-white/80 text-sm">basierend auf echten Kundenbewertungen</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span>15'000+ vermittelte Umzüge</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span>100% kostenlos & unverbindlich</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link to="/firmen">
                  <Button 
                    size="lg"
                    className="h-16 px-10 text-lg font-bold bg-accent hover:bg-accent/90 shadow-2xl hover:shadow-accent/50 transition-all hover:scale-105"
                  >
                    JETZT GRATIS OFFERTEN VERGLEICHEN
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right: Instant Calculator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InstantCalculator />
            </motion.div>
          </div>

          {/* Live Signals */}
          <LiveSignals />
        </div>
      </div>
    </section>
  );
};
