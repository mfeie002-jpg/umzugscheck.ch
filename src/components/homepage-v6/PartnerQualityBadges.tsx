/**
 * Partner Quality Badges V6 - SMA and quality indicators for firms
 * Addresses: "Hervorheben der Partner-Qualität" + SMA integration
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Star, CheckCircle2, TrendingUp, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Partner {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  badges: {
    sma?: boolean;
    iso?: boolean;
    trustedShops?: boolean;
    verified?: boolean;
  };
  completedMoves: number;
  responseTime: string;
}

const SAMPLE_PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'Welti-Furrer AG',
    rating: 4.9,
    reviews: 324,
    badges: { sma: true, iso: true, verified: true },
    completedMoves: 1500,
    responseTime: '< 2h',
  },
  {
    id: '2',
    name: 'Züri Umzüge GmbH',
    rating: 4.8,
    reviews: 189,
    badges: { sma: true, trustedShops: true, verified: true },
    completedMoves: 890,
    responseTime: '< 4h',
  },
  {
    id: '3',
    name: 'Express Moving',
    rating: 4.7,
    reviews: 102,
    badges: { verified: true },
    completedMoves: 340,
    responseTime: '< 6h',
  },
];

const BadgeIcon = ({ type }: { type: string }) => {
  const badges: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    sma: { label: 'SMA', color: 'bg-blue-100 text-blue-700', icon: Award },
    iso: { label: 'ISO', color: 'bg-slate-100 text-slate-700', icon: Shield },
    trustedShops: { label: 'TS', color: 'bg-amber-100 text-amber-700', icon: CheckCircle2 },
    verified: { label: '✓', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  };

  const badge = badges[type];
  if (!badge) return null;

  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${badge.color}`}>
      {badge.label}
    </span>
  );
};

export const PartnerQualityBadges = memo(function PartnerQualityBadges() {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-2 mb-4">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">Swiss Movers Association</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nur <span className="text-secondary">geprüfte</span> Partner
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Alle unsere Umzugsfirmen werden streng geprüft. 
            SMA-Mitglieder garantieren Schweizer Qualitätsstandards.
          </p>
        </div>

        {/* Partner Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {SAMPLE_PARTNERS.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl border p-5 hover:shadow-lg transition-all"
            >
              {/* Header with badges */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{partner.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {Object.entries(partner.badges).map(([key, value]) => 
                      value && <BadgeIcon key={key} type={key} />
                    )}
                  </div>
                </div>
                {partner.badges.sma && (
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(partner.rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-sm">{partner.rating}</span>
                <span className="text-muted-foreground text-xs">
                  ({partner.reviews} Bewertungen)
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  <span>{partner.completedMoves}+ Umzüge</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{partner.responseTime}</span>
                </div>
              </div>

              {/* CTA */}
              <Button className="w-full" variant={index === 0 ? 'default' : 'outline'}>
                Offerte anfragen
              </Button>
            </motion.div>
          ))}
        </div>

        {/* SMA Explanation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            <Award className="w-4 h-4 inline-block mr-1 text-blue-600" />
            <strong>Swiss Movers Association (SMA)</strong> – Der Qualitätsverband der Schweizer 
            Umzugsspediteure garantiert geprüfte Firmen mit versicherten Transporten und 
            fairen Preisen.
          </p>
        </motion.div>
      </div>
    </section>
  );
});
