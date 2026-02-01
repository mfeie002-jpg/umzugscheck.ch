/**
 * How It Works V1 - Genau 3 Schritte
 * P1 Improvement #5 from Analysis
 * 
 * ① Umzug eingeben (30 Sek.) ② Angebote empfangen ③ Vergleichen & Buchen
 */
import { memo } from 'react';
import { FileText, Users, TrendingDown, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: FileText,
    title: 'Umzug beschreiben',
    subtitle: '30 Sekunden',
    description: 'PLZ, Zimmeranzahl, Datum – mehr brauchen wir nicht.',
    color: 'bg-blue-500',
  },
  {
    number: '2',
    icon: Users,
    title: 'Offerten erhalten',
    subtitle: 'Innerhalb 24h',
    description: 'Bis zu 5 SMA-zertifizierte Firmen melden sich bei Ihnen.',
    color: 'bg-green-500',
  },
  {
    number: '3',
    icon: TrendingDown,
    title: 'Vergleichen & sparen',
    subtitle: 'Bis zu 40%',
    description: 'Bewertungen prüfen, Preise vergleichen, beste Firma wählen.',
    color: 'bg-secondary',
  },
];

export const HowItWorksV1 = memo(function HowItWorksV1() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            So funktioniert's
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            In 3 einfachen Schritten zum besten Angebot
          </p>
        </div>

        {/* Steps - Desktop: Horizontal, Mobile: Vertical */}
        <div className="max-w-5xl mx-auto">
          {/* Desktop View */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-500 via-green-500 to-secondary" />
            
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Step Number Circle */}
                <div className={`w-24 h-24 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                
                {/* Number Badge */}
                <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-1 w-8 h-8 bg-white border-2 border-current rounded-full flex items-center justify-center text-sm font-bold shadow-md" style={{ borderColor: step.color.replace('bg-', '') === 'secondary' ? 'var(--secondary)' : step.color.replace('bg-', '').replace('-500', '') }}>
                  {step.number}
                </div>

                <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                <div className="text-sm font-semibold text-secondary mb-2">{step.subtitle}</div>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Mobile View - Vertical Timeline */}
          <div className="md:hidden space-y-0">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4 relative">
                {/* Timeline Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-current to-current/30" style={{ color: step.color.replace('bg-', '').includes('secondary') ? 'var(--secondary)' : step.color.replace('bg-', '').replace('-500', '') }} />
                )}
                
                {/* Icon Circle */}
                <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center flex-shrink-0 shadow-md relative z-10`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="pb-8 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold bg-muted px-2 py-0.5 rounded-full">Schritt {step.number}</span>
                    <span className="text-xs font-semibold text-secondary">{step.subtitle}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
