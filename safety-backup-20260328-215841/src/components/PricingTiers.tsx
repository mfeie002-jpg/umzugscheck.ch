import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles, Crown, Zap, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';

const tiers = [
  {
    name: 'Basic',
    icon: Zap,
    description: 'Perfekt für kleine Umzüge und Studenten',
    monthlyPrice: 490,
    yearlyPrice: 440,
    popular: false,
    features: [
      { name: 'Transport & Fahrer', included: true },
      { name: 'Umzugshelfer (2 Personen)', included: true },
      { name: 'Schutzdecken', included: true },
      { name: 'Vollversicherung', included: true },
      { name: 'Verpackungsservice', included: false },
      { name: 'Möbelmontage', included: false },
      { name: 'Endreinigung', included: false },
      { name: 'Persönlicher Betreuer', included: false },
    ],
    cta: 'Basic wählen',
    link: '/plan/basic',
  },
  {
    name: 'Comfort',
    icon: Star,
    description: 'Der Bestseller für Familien und Haushalte',
    monthlyPrice: 890,
    yearlyPrice: 790,
    popular: true,
    features: [
      { name: 'Transport & Fahrer', included: true },
      { name: 'Umzugshelfer (3-4 Personen)', included: true },
      { name: 'Schutzdecken', included: true },
      { name: 'Vollversicherung', included: true },
      { name: 'Verpackungsservice', included: true },
      { name: 'Möbelmontage', included: true },
      { name: 'Endreinigung', included: false },
      { name: 'Persönlicher Betreuer', included: false },
    ],
    cta: 'Comfort wählen',
    link: '/plan/half',
  },
  {
    name: 'Premium',
    icon: Crown,
    description: 'Rundum-Sorglos für anspruchsvolle Kunden',
    monthlyPrice: 1490,
    yearlyPrice: 1290,
    popular: false,
    features: [
      { name: 'Transport & Fahrer', included: true },
      { name: 'Umzugshelfer (4-6 Personen)', included: true },
      { name: 'Premium Schutzdecken', included: true },
      { name: 'Premium Versicherung', included: true },
      { name: 'Full-Service Verpackung', included: true },
      { name: 'Komplette Möbelmontage', included: true },
      { name: 'Endreinigung inklusive', included: true },
      { name: 'Persönlicher Betreuer', included: true },
    ],
    cta: 'Premium wählen',
    link: '/plan/full',
  },
];

const PricingTiers = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="space-y-8">
      {/* Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
          Standard
        </span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
          Frühbucher (-10%)
        </span>
        {isYearly && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs bg-forest text-forest-foreground px-2 py-1 rounded-full"
          >
            Sparen
          </motion.span>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {tiers.map((tier, index) => {
          const Icon = tier.icon;
          const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;

          return (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={tier.popular ? 'relative' : ''}
            >
              {tier.popular && (
                <motion.div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  <span className="bg-gradient-to-r from-alpine to-alpine/80 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Beliebteste Wahl
                  </span>
                </motion.div>
              )}

              <Card
                className={`h-full p-6 lg:p-8 flex flex-col ${
                  tier.popular
                    ? 'border-2 border-alpine shadow-lg shadow-alpine/10 bg-gradient-to-b from-alpine/5 to-transparent'
                    : 'hover:border-alpine/30 transition-colors'
                }`}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${tier.popular ? 'bg-alpine text-white' : 'bg-muted'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-display font-semibold">{tier.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">ab CHF</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={price}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="text-4xl font-bold font-display"
                      >
                        {price}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Preis für 2-Zimmer-Wohnung, lokal
                  </p>
                </div>

                <div className="flex-1 space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-2"
                    >
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-forest/10 flex items-center justify-center">
                          <Check className="h-3 w-3 text-forest" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                          <X className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                      <span className={`text-sm ${feature.included ? '' : 'text-muted-foreground'}`}>
                        {feature.name}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <Link to={tier.link}>
                  <Button
                    className={`w-full min-h-[48px] ${
                      tier.popular
                        ? 'bg-gradient-hero text-primary-foreground hover:opacity-90'
                        : ''
                    }`}
                    variant={tier.popular ? 'default' : 'outline'}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingTiers;
