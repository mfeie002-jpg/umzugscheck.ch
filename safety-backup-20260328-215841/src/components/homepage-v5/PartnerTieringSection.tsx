/**
 * Partner Tiering Section V5 - Gold/Silver partner badges
 * Addresses: "Partner-Tiering (Gold/Silber)"
 */
import { memo } from 'react';
import { Star, Shield, Award, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Partner {
  id: string;
  name: string;
  tier: 'gold' | 'silver' | 'verified';
  rating: number;
  reviews: number;
  completedMoves: number;
  responseTime: string;
  badges: string[];
}

const FEATURED_PARTNERS: Partner[] = [
  {
    id: 'fsg',
    name: 'Feierabend Services GmbH',
    tier: 'gold',
    rating: 4.9,
    reviews: 312,
    completedMoves: 980,
    responseTime: '< 1h',
    badges: ['ASTAG', 'Versichert', 'UID'],
  },
  {
    id: '1',
    name: 'Welti-Furrer AG',
    tier: 'gold',
    rating: 4.9,
    reviews: 287,
    completedMoves: 1250,
    responseTime: '< 2h',
    badges: ['ASTAG', 'VSU', 'ISO 9001'],
  },
  {
    id: '2',
    name: 'Umzug Zürich GmbH',
    tier: 'gold',
    rating: 4.8,
    reviews: 156,
    completedMoves: 890,
    responseTime: '< 4h',
    badges: ['ASTAG', 'Versichert'],
  },
  {
    id: '3',
    name: 'Express Umzüge',
    tier: 'silver',
    rating: 4.7,
    reviews: 89,
    completedMoves: 340,
    responseTime: '< 6h',
    badges: ['Versichert'],
  },
];

const TIER_CONFIG = {
  gold: {
    label: 'Gold Partner',
    color: 'text-amber-600',
    bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-50',
    borderColor: 'border-amber-200',
    icon: Award,
    criteria: 'ASTAG + 50+ Umzüge + 4.8★',
  },
  silver: {
    label: 'Silber Partner',
    color: 'text-slate-600',
    bgColor: 'bg-gradient-to-br from-slate-50 to-gray-50',
    borderColor: 'border-slate-200',
    icon: Shield,
    criteria: 'Handelsregister + Versicherung',
  },
  verified: {
    label: 'Verifiziert',
    color: 'text-green-600',
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    icon: CheckCircle2,
    criteria: 'Basis-Verifizierung',
  },
};

export const PartnerTieringSection = memo(function PartnerTieringSection() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 rounded-full px-4 py-2 mb-4">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">Qualitätspartner</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Unsere Top-Partner
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Geprüft, zertifiziert und von über 15'000 Kunden empfohlen
          </p>
        </div>

        {/* Tier Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {Object.entries(TIER_CONFIG).map(([tier, config]) => (
            <div 
              key={tier}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bgColor} border ${config.borderColor}`}
            >
              <config.icon className={`w-4 h-4 ${config.color}`} />
              <span className={`text-sm font-medium ${config.color}`}>
                {config.label}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                ({config.criteria})
              </span>
            </div>
          ))}
        </div>

        {/* Partner Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {FEATURED_PARTNERS.map((partner, index) => {
            const tierConfig = TIER_CONFIG[partner.tier];
            const TierIcon = tierConfig.icon;

            return (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl border-2 ${tierConfig.borderColor} ${tierConfig.bgColor} p-6 hover:shadow-lg transition-shadow`}
              >
                {/* Tier Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm`}>
                    <TierIcon className={`w-4 h-4 ${tierConfig.color}`} />
                    <span className={`text-xs font-bold ${tierConfig.color}`}>
                      {tierConfig.label}
                    </span>
                  </div>
                </div>

                {/* Company Info */}
                <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(partner.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{partner.rating}</span>
                  <span className="text-muted-foreground text-sm">
                    ({partner.reviews} Bewertungen)
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>{partner.completedMoves}+ Umzüge</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{partner.responseTime}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {partner.badges.map((badge) => (
                    <span 
                      key={badge}
                      className="px-2 py-1 bg-white rounded text-xs font-medium text-muted-foreground"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Button className="w-full" variant={partner.tier === 'gold' ? 'default' : 'outline'}>
                  Offerte anfragen
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link to="/firmen">
            <Button variant="outline" size="lg" className="gap-2">
              Alle 200+ Partner ansehen
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
});
