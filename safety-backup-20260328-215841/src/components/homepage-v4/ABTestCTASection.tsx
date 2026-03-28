/**
 * A/B Test CTA Section V4 - Multiple CTA variants for testing
 * Addresses gap: "Keine A/B-getestete Varianten für CTAs"
 */
import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Shield, Users, Zap, Gift, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

type CTAVariant = 'urgency' | 'savings' | 'social' | 'simplicity';

interface CTAConfig {
  headline: string;
  subline: string;
  buttonText: string;
  icon: React.ElementType;
  badge?: string;
}

const CTA_VARIANTS: Record<CTAVariant, CTAConfig> = {
  urgency: {
    headline: 'Jetzt ist der beste Zeitpunkt',
    subline: '12 andere Personen vergleichen gerade Offerten in Ihrer Region',
    buttonText: 'Jetzt starten',
    icon: Clock,
    badge: 'Hohe Nachfrage',
  },
  savings: {
    headline: 'Sparen Sie bis zu CHF 1\'200',
    subline: 'Unsere Kunden sparen durchschnittlich 40% bei Ihrem Umzug',
    buttonText: 'Gratis vergleichen',
    icon: TrendingDown,
    badge: 'Ø CHF 850 Ersparnis',
  },
  social: {
    headline: '15\'000+ zufriedene Kunden',
    subline: 'Schliessen Sie sich Tausenden an, die bereits clever umgezogen sind',
    buttonText: 'Wie andere sparen',
    icon: Users,
    badge: '98% Weiterempfehlung',
  },
  simplicity: {
    headline: 'In 30 Sekunden zur Offerte',
    subline: 'Kein Papierkram, keine Telefonate – einfach online vergleichen',
    buttonText: 'Einfach starten',
    icon: Zap,
    badge: 'Nur 3 Schritte',
  },
};

export const ABTestCTASection = memo(function ABTestCTASection() {
  // Simple A/B assignment (in production: use proper A/B tool)
  const [variant, setVariant] = useState<CTAVariant>('savings');

  useEffect(() => {
    // Assign variant based on user ID or random
    const variants: CTAVariant[] = ['urgency', 'savings', 'social', 'simplicity'];
    const storedVariant = localStorage.getItem('cta_variant') as CTAVariant;
    
    if (storedVariant && variants.includes(storedVariant)) {
      setVariant(storedVariant);
    } else {
      const newVariant = variants[Math.floor(Math.random() * variants.length)];
      localStorage.setItem('cta_variant', newVariant);
      setVariant(newVariant);
    }
  }, []);

  const config = CTA_VARIANTS[variant];
  const Icon = config.icon;

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center text-white"
        >
          {/* Badge */}
          {config.badge && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{config.badge}</span>
            </div>
          )}

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {config.headline}
          </h2>

          {/* Subline */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl mx-auto">
            {config.subline}
          </p>

          {/* CTA Button */}
          <Link to="/umzugsofferten">
            <Button 
              size="lg"
              variant="secondary"
              className="h-16 px-10 text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              {config.buttonText}
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>

          {/* Trust Line */}
          <p className="mt-6 text-white/70 text-sm flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              100% kostenlos
            </span>
            <span>•</span>
            <span>Keine versteckten Kosten</span>
            <span>•</span>
            <span>Schweizer Service</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
});
