import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/AnimatedSection';

interface ServicePackage {
  name: string;
  price: string;
  priceNote: string;
  popular?: boolean;
  features: {
    name: string;
    basic: boolean | string;
    standard: boolean | string;
    premium: boolean | string;
  }[];
}

const packages: ServicePackage['features'] = [
  { name: 'Transport & Umzug', basic: true, standard: true, premium: true },
  { name: 'Möbelschutz', basic: true, standard: true, premium: true },
  { name: 'Be- und Entladen', basic: true, standard: true, premium: true },
  { name: 'Möbel ab-/aufbauen', basic: false, standard: true, premium: true },
  { name: 'Verpackungsmaterial', basic: 'Optional', standard: true, premium: true },
  { name: 'Ein- und Auspacken', basic: false, standard: 'Teilweise', premium: true },
  { name: 'Endreinigung', basic: false, standard: false, premium: true },
  { name: 'Entsorgung Altmöbel', basic: false, standard: 'Optional', premium: true },
  { name: 'Persönlicher Berater', basic: false, standard: true, premium: true },
  { name: 'Prioritäts-Terminwahl', basic: false, standard: false, premium: true },
  { name: 'Nachbetreuung 30 Tage', basic: false, standard: false, premium: true },
];

const tiers = [
  { key: 'basic', name: 'Basic', price: 'ab CHF 590', note: 'Sie packen, wir transportieren' },
  { key: 'standard', name: 'Standard', price: 'ab CHF 990', note: 'Der beliebte Kompromiss', popular: true },
  { key: 'premium', name: 'Premium', price: 'ab CHF 1\'890', note: 'Rundum-sorglos-Paket' },
];

const ServiceComparisonMatrix = () => {
  const renderValue = (value: boolean | string) => {
    if (value === true) {
      return <Check className="w-5 h-5 text-green-500 mx-auto" />;
    }
    if (value === false) {
      return <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />;
    }
    return <span className="text-sm text-muted-foreground">{value}</span>;
  };

  return (
    <AnimatedSection>
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">
              <Star className="w-3 h-3 mr-1" />
              Paketvergleich
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Wählen Sie Ihr Umzugspaket
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transparent und fair - finden Sie das passende Angebot für Ihre Bedürfnisse
            </p>
          </motion.div>

          {/* Mobile Cards View */}
          <div className="lg:hidden space-y-6">
            {tiers.map((tier, tierIndex) => (
              <motion.div
                key={tier.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: tierIndex * 0.1 }}
              >
                <Card className={`relative overflow-hidden ${tier.popular ? 'border-primary shadow-lg' : ''}`}>
                  {tier.popular && (
                    <div className="absolute top-0 right-0">
                      <Badge className="rounded-none rounded-bl-lg bg-primary">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Beliebt
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{tier.name}</span>
                      <span className="text-primary">{tier.price}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{tier.note}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {packages.map((feature) => (
                        <li key={feature.name} className="flex items-center justify-between text-sm">
                          <span>{feature.name}</span>
                          {renderValue(feature[tier.key as keyof typeof feature] as boolean | string)}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                      <Link to="/contact">
                        Paket wählen
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-4 text-left font-medium text-muted-foreground">
                        Leistungen
                      </th>
                      {tiers.map((tier) => (
                        <th key={tier.key} className="p-4 text-center relative">
                          {tier.popular && (
                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Beliebt
                            </Badge>
                          )}
                          <div className={`py-4 rounded-t-xl ${tier.popular ? 'bg-primary/5' : ''}`}>
                            <div className="text-xl font-bold">{tier.name}</div>
                            <div className="text-2xl font-bold text-primary mt-2">{tier.price}</div>
                            <div className="text-sm text-muted-foreground mt-1">{tier.note}</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((feature, index) => (
                      <motion.tr
                        key={feature.name}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-4 font-medium">{feature.name}</td>
                        {tiers.map((tier) => (
                          <td 
                            key={tier.key} 
                            className={`p-4 text-center ${tier.popular ? 'bg-primary/5' : ''}`}
                          >
                            {renderValue(feature[tier.key as keyof typeof feature] as boolean | string)}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="p-4"></td>
                      {tiers.map((tier) => (
                        <td key={tier.key} className={`p-4 text-center ${tier.popular ? 'bg-primary/5' : ''}`}>
                          <Button 
                            asChild 
                            className="w-full max-w-[200px]"
                            variant={tier.popular ? 'default' : 'outline'}
                          >
                            <Link to="/contact">
                              {tier.name} wählen
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Alle Preise verstehen sich als Richtpreise. Der finale Preis hängt von Wohnungsgröße, Distanz und Zusatzleistungen ab.
          </p>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default ServiceComparisonMatrix;
