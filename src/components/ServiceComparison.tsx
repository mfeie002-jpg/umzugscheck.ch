import { motion } from 'framer-motion';
import { Check, X, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const packages = [
  {
    name: 'Basic',
    price: 'ab CHF 800',
    description: 'Für preisbewusste Kunden',
    href: '/plan-basic',
    popular: false,
    features: {
      transport: true,
      loading: true,
      packing: false,
      assembly: false,
      cleaning: false,
      insurance: 'Standard',
      team: '2 Personen',
      guarantee: '30 Tage'
    }
  },
  {
    name: 'Comfort',
    price: 'ab CHF 1\'500',
    description: 'Unser beliebtestes Paket',
    href: '/plan-half',
    popular: true,
    features: {
      transport: true,
      loading: true,
      packing: 'Teilweise',
      assembly: true,
      cleaning: false,
      insurance: 'Erweitert',
      team: '3 Personen',
      guarantee: '60 Tage'
    }
  },
  {
    name: 'Premium',
    price: 'ab CHF 2\'500',
    description: 'Rundum-Sorglos-Paket',
    href: '/plan-full',
    popular: false,
    features: {
      transport: true,
      loading: true,
      packing: true,
      assembly: true,
      cleaning: true,
      insurance: 'Premium',
      team: '4+ Personen',
      guarantee: '90 Tage'
    }
  }
];

const featureLabels = {
  transport: 'Transport',
  loading: 'Be- & Entladung',
  packing: 'Einpackservice',
  assembly: 'Möbelmontage',
  cleaning: 'Endreinigung',
  insurance: 'Versicherung',
  team: 'Team-Grösse',
  guarantee: 'Garantie'
};

const FeatureValue = ({ value }: { value: boolean | string }) => {
  if (value === true) return <Check className="w-5 h-5 text-green-500" />;
  if (value === false) return <X className="w-5 h-5 text-muted-foreground/30" />;
  if (value === 'Teilweise') return <Minus className="w-5 h-5 text-yellow-500" />;
  return <span className="text-sm font-medium">{value}</span>;
};

const ServiceComparison = () => {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-[320px]">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`h-full relative ${pkg.popular ? 'border-primary shadow-lg scale-[1.02]' : ''}`}>
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Beliebteste Wahl
                </Badge>
              )}
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <div className="text-3xl font-bold text-primary">{pkg.price}</div>
                <p className="text-sm text-muted-foreground">{pkg.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(pkg.features).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-sm text-muted-foreground">
                        {featureLabels[key as keyof typeof featureLabels]}
                      </span>
                      <FeatureValue value={value} />
                    </div>
                  ))}
                </div>
                
                <Link to={pkg.href} className="block">
                  <Button className="w-full" variant={pkg.popular ? 'default' : 'outline'}>
                    Paket wählen
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServiceComparison;
