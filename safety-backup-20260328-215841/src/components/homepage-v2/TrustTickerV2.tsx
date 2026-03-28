/**
 * Trust Ticker V2 - Auto-scrolling trust logos under CTA
 * New entities: Digital Trust Label, HEV, SFTA, MyClimate
 */
import { memo } from 'react';
import { Shield, Leaf, Home, Banknote, Award, Lock } from 'lucide-react';

const trustLogos = [
  {
    name: 'SMA',
    label: 'Swiss Movers Association',
    icon: Award,
    color: 'text-blue-600',
  },
  {
    name: 'Digital Trust',
    label: 'Swiss Digital Initiative',
    icon: Lock,
    color: 'text-green-600',
  },
  {
    name: 'HEV',
    label: 'Hauseigentümerverband',
    icon: Home,
    color: 'text-orange-600',
  },
  {
    name: 'SFTA',
    label: 'Swiss Fintech Assoc.',
    icon: Banknote,
    color: 'text-purple-600',
  },
  {
    name: 'MyClimate',
    label: 'Klimaneutral',
    icon: Leaf,
    color: 'text-emerald-600',
  },
  {
    name: 'Mobiliar',
    label: 'Versicherungspartner',
    icon: Shield,
    color: 'text-red-600',
  },
];

export const TrustTickerV2 = memo(function TrustTickerV2() {
  return (
    <div className="overflow-hidden py-3 bg-white/10 backdrop-blur-sm border-y border-white/10">
      <div className="animate-marquee flex gap-8 items-center whitespace-nowrap">
        {[...trustLogos, ...trustLogos].map((logo, index) => (
          <div 
            key={`${logo.name}-${index}`}
            className="flex items-center gap-2 text-white/90"
          >
            <logo.icon className={`w-4 h-4 ${logo.color}`} />
            <span className="text-sm font-medium">{logo.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
