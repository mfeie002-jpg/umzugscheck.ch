/**
 * Seasonal Banner V4 - Dynamic seasonal promotions
 * Addresses gap: "Saisonale Content-Anpassung"
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, ArrowRight, Calendar, Sun, Snowflake, Leaf, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface SeasonConfig {
  title: string;
  subtitle: string;
  discount: string;
  icon: React.ElementType;
  gradient: string;
  urgency: string;
}

const getSeasonConfig = (): SeasonConfig => {
  const month = new Date().getMonth();
  
  // Spring (March-May) - Peak season
  if (month >= 2 && month <= 4) {
    return {
      title: 'Frühjahrs-Umzug',
      subtitle: 'Die beliebteste Umzugszeit in der Schweiz',
      discount: 'Bis zu 30% sparen',
      icon: Leaf,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      urgency: 'Hohe Nachfrage – jetzt buchen!',
    };
  }
  
  // Summer (June-August)
  if (month >= 5 && month <= 7) {
    return {
      title: 'Sommer-Special',
      subtitle: 'Perfektes Wetter für Ihren Umzug',
      discount: 'Bis zu 25% sparen',
      icon: Sun,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      urgency: 'Sommerpreise nur noch 6 Wochen!',
    };
  }
  
  // Winter (December-February) - Low season
  if (month >= 11 || month <= 1) {
    return {
      title: 'Winter-Aktion',
      subtitle: 'Günstigste Preise des Jahres',
      discount: 'Bis zu 40% sparen',
      icon: Snowflake,
      gradient: 'from-blue-500 via-cyan-500 to-sky-500',
      urgency: 'Nebensaison = Top-Preise!',
    };
  }
  
  // Fall (September-November)
  return {
    title: 'Herbst-Deal',
    subtitle: 'Vor dem Jahreswechsel umziehen',
    discount: 'Bis zu 35% sparen',
    icon: Leaf,
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    urgency: 'Freie Termine im Herbst!',
  };
};

export const SeasonalBannerV4 = memo(function SeasonalBannerV4() {
  const config = getSeasonConfig();
  const Icon = config.icon;

  return (
    <section className={`py-6 bg-gradient-to-r ${config.gradient} text-white overflow-hidden`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Icon + Text */}
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"
            >
              <Icon className="w-6 h-6" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium text-white/90">{config.title}</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold">
                {config.discount} – {config.subtitle}
              </h3>
            </div>
          </div>

          {/* Right: Urgency + CTA */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-white/80">
              <Clock className="w-4 h-4" />
              {config.urgency}
            </div>
            <Button
              asChild
              className="bg-white text-gray-900 hover:bg-white/90 font-semibold shadow-lg"
            >
              <Link to="/umzugsofferten">
                Jetzt profitieren
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});
