import { motion } from 'framer-motion';
import { Shield, Award, ThumbsUp, Clock, Users, Star, BadgeCheck, Leaf } from 'lucide-react';

const badges = [
  { icon: Shield, label: 'Vollversichert', sublabel: 'CHF 2 Mio.', color: 'text-blue-500' },
  { icon: BadgeCheck, label: 'Swiss Made', sublabel: 'Qualität', color: 'text-red-500' },
  { icon: Award, label: 'Top Rated', sublabel: '2024', color: 'text-yellow-500' },
  { icon: Users, label: 'Familiengeführt', sublabel: 'Seit 2015', color: 'text-green-500' },
  { icon: Star, label: '4.9/5 Sterne', sublabel: '500+ Bewertungen', color: 'text-orange-500' },
  { icon: Clock, label: 'Pünktlichkeit', sublabel: '99.2%', color: 'text-purple-500' },
  { icon: ThumbsUp, label: 'Empfehlungsrate', sublabel: '98%', color: 'text-pink-500' },
  { icon: Leaf, label: 'Eco-Friendly', sublabel: 'CO2-kompensiert', color: 'text-emerald-500' },
];

interface TrustBadgesEnhancedProps {
  variant?: 'horizontal' | 'grid' | 'compact';
  limit?: number;
}

const TrustBadgesEnhanced = ({ variant = 'horizontal', limit }: TrustBadgesEnhancedProps) => {
  const displayBadges = limit ? badges.slice(0, limit) : badges;

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        {displayBadges.map((badge, index) => (
          <motion.div
            key={badge.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 text-sm"
          >
            <badge.icon className={`w-4 h-4 ${badge.color}`} />
            <span className="text-muted-foreground">{badge.label}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayBadges.map((badge, index) => (
          <motion.div
            key={badge.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="flex flex-col items-center p-4 rounded-xl bg-card border hover:border-primary/30 hover:shadow-lg transition-all text-center"
          >
            <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2`}>
              <badge.icon className={`w-6 h-6 ${badge.color}`} />
            </div>
            <span className="font-medium text-sm">{badge.label}</span>
            <span className="text-xs text-muted-foreground">{badge.sublabel}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  // Horizontal scrolling variant
  return (
    <div className="relative overflow-hidden py-4">
      <motion.div
        className="flex gap-6"
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {[...displayBadges, ...displayBadges].map((badge, index) => (
          <div
            key={`${badge.label}-${index}`}
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-card border whitespace-nowrap"
          >
            <badge.icon className={`w-5 h-5 ${badge.color}`} />
            <div className="flex flex-col">
              <span className="font-medium text-sm">{badge.label}</span>
              <span className="text-xs text-muted-foreground">{badge.sublabel}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default TrustBadgesEnhanced;
