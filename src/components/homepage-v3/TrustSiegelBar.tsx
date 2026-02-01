/**
 * Trust Siegel Bar V3 - Official-looking trust badges
 * Addresses gap: "Siegel/Zertifikate gar nicht eingebunden"
 */
import { memo } from 'react';
import { Shield, Award, Lock, Leaf, CheckCircle } from 'lucide-react';

const badges = [
  {
    icon: Award,
    title: 'Swiss Quality',
    subtitle: 'Zertifiziert 2026',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  {
    icon: Shield,
    title: 'Versichert',
    subtitle: 'Alle Partner',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Lock,
    title: 'DSGVO',
    subtitle: 'Datenschutz CH',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    icon: CheckCircle,
    title: 'Geprüft',
    subtitle: '200+ Firmen',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Leaf,
    title: 'Klimaneutral',
    subtitle: 'Option verfügbar',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
  },
];

export const TrustSiegelBar = memo(function TrustSiegelBar() {
  return (
    <section className="py-8 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {badges.map((badge, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 group"
            >
              <div className={`w-12 h-12 ${badge.bgColor} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <badge.icon className={`w-6 h-6 ${badge.color}`} />
              </div>
              <div className="hidden sm:block">
                <div className="font-semibold text-sm">{badge.title}</div>
                <div className="text-xs text-muted-foreground">{badge.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
