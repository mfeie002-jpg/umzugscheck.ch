/**
 * Personalized Hero V4 - IP-based location personalization
 * Addresses gap: "IP-basierte Anpassung des Headlines"
 */
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Shield, CheckCircle2, Users, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGeoLocation } from '@/hooks/useGeoLocationV4';

export const PersonalizedHero = memo(function PersonalizedHero() {
  const { city, isLoading } = useGeoLocation();

  // Dynamic headline based on location
  const getHeadline = () => {
    if (city) {
      return (
        <>
          Der beste Deal
          <br />
          <span className="text-secondary">in {city}.</span>
        </>
      );
    }
    return (
      <>
        Der beste Deal
        <br />
        <span className="text-secondary">der ganzen Schweiz.</span>
      </>
    );
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            {/* Location Badge */}
            {city && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-secondary/10 text-secondary rounded-full px-4 py-2 mb-6"
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Lokale Angebote für {city}
                </span>
              </motion.div>
            )}

            {/* Main Headline - Personalized */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              {getHeadline()}
            </motion.h1>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg"
            >
              Vergleichen Sie 200+ geprüfte Schweizer Umzugsfirmen
              {city && ` in ${city}`} und sparen Sie bis zu 40%.
            </motion.p>

            {/* Trust Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 md:gap-6 mb-8"
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.9/5</span>
                <span className="text-muted-foreground text-sm hidden sm:inline">Bewertung</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">15'000+</span>
                <span className="text-muted-foreground text-sm hidden sm:inline">Kunden</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                <span className="font-semibold">&lt;24h</span>
                <span className="text-muted-foreground text-sm hidden sm:inline">Offerten</span>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/umzugsofferten">
                <Button 
                  size="lg"
                  className="h-16 px-10 text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
                >
                  Jetzt kostenlos Offerten erhalten
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </Link>

              {/* Trust-Reassurance */}
              <p className="mt-4 text-muted-foreground text-sm flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  100% kostenlos
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Unverbindlich
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-green-500" />
                  DSG-konform
                </span>
              </p>
            </motion.div>
          </div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&auto=format&fit=crop"
                alt="Professioneller Umzugsservice"
                className="rounded-2xl shadow-2xl"
              />
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-xl p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">CHF 850</div>
                    <div className="text-sm text-muted-foreground">Ø Ersparnis</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});
