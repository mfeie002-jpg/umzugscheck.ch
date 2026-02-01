/**
 * Trust-Strip V1 - Fixierte Leiste unter dem Hero
 * P0 Improvement #1 from Analysis
 * 
 * Inhalt: Trustpilot-Stars | Google-Stars | SMA-Badge | 🔒 SSL | 🇨🇭 Schweiz-basiert
 */
import { memo } from 'react';
import { Star, Shield, Lock, CheckCircle } from 'lucide-react';

const trustItems = [
  {
    icon: <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />,
    label: '4.9/5 Trustpilot',
    subtext: '234 Bewertungen',
  },
  {
    icon: <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />,
    label: '4.8/5 Google',
    subtext: '189 Rezensionen',
  },
  {
    icon: <Shield className="w-4 h-4 text-blue-600" />,
    label: 'SMA zertifiziert',
    subtext: 'Swiss Movers Association',
  },
  {
    icon: <Lock className="w-4 h-4 text-green-600" />,
    label: 'SSL verschlüsselt',
    subtext: 'DSG-konform',
  },
  {
    icon: <CheckCircle className="w-4 h-4 text-red-600" />,
    label: '100% Schweizer',
    subtext: 'Alle Firmen geprüft',
  },
];

export const TrustStripV1 = memo(function TrustStripV1() {
  return (
    <div className="bg-white border-b border-border/50 py-3 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Desktop: Alle Items in einer Zeile */}
        <div className="hidden md:flex items-center justify-center gap-8 lg:gap-12">
          {trustItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.icon}
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.subtext}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Horizontaler Scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex items-center gap-6 min-w-max">
            {trustItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {item.icon}
                <div className="text-left">
                  <div className="text-xs font-semibold text-foreground whitespace-nowrap">{item.label}</div>
                  <div className="text-[10px] text-muted-foreground whitespace-nowrap">{item.subtext}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
