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
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image - Emotional Moving Scene */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80&auto=format&fit=crop"
          alt="Professionelles Umzugsteam bei der Arbeit"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 to-black/40" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content - Full width on dark background */}
          <div className="max-w-3xl">
            {/* Location Badge */}
            {city && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white rounded-full px-4 py-2 mb-6 border border-white/20"
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
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white"
            >
              {getHeadline()}
            </motion.h1>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-xl"
            >
              Vergleichen Sie 200+ geprüfte Schweizer Umzugsfirmen
              {city && ` in ${city}`} und sparen Sie bis zu 40%.
            </motion.p>

            {/* Trust Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.9/5 Sterne</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                <Users className="w-4 h-4 text-blue-400" />
                <span>15'000+ Kunden</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                <Clock className="w-4 h-4 text-green-400" />
                <span>Antwort in &lt;24h</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>DSG-konform</span>
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
                  className="h-14 px-8 text-lg font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Jetzt kostenlos Offerten erhalten
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </Link>

              {/* Trust-Reassurance */}
              <p className="mt-4 text-white/80 text-sm flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  100% kostenlos
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Unverbindlich
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-green-400" />
                  Schweizer Firmen
                </span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
});
