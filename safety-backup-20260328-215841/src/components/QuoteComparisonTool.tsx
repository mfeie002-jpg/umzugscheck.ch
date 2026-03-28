import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Scale, Star, Check, X, TrendingDown, Award, Building2, Clock, Shield, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuoteComparisonProps {
  userEstimate?: number;
  rooms?: number;
  distance?: number;
}

interface CompanyQuote {
  id: string;
  name: string;
  logo: string;
  price: number;
  rating: number;
  reviews: number;
  features: string[];
  missingFeatures: string[];
  deliveryTime: string;
  insurance: string;
  recommended?: boolean;
}

const QuoteComparisonTool = ({ userEstimate = 2500, rooms = 3, distance = 30 }: QuoteComparisonProps) => {
  const { language } = useLanguage();
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);

  const translations = {
    de: {
      title: 'Angebots-Vergleich',
      subtitle: 'Vergleichen Sie Angebote verschiedener Umzugsfirmen',
      yourEstimate: 'Ihre Schätzung',
      recommended: 'Empfohlen',
      bestPrice: 'Bester Preis',
      bestRated: 'Best bewertet',
      select: 'Auswählen',
      selected: 'Ausgewählt',
      reviews: 'Bewertungen',
      deliveryTime: 'Lieferzeit',
      insurance: 'Versicherung',
      savings: 'Ersparnis',
      features: {
        packing: 'Einpackservice',
        assembly: 'Möbelmontage',
        storage: 'Lagerung',
        cleaning: 'Endreinigung',
        insurance: 'Vollversicherung',
        weekend: 'Wochenende verfügbar',
        express: 'Express möglich',
        piano: 'Klaviertransport'
      },
      companies: {
        feierabend: 'Feierabend Umzüge',
        quickmove: 'QuickMove AG',
        swissmove: 'SwissMove GmbH',
        budget: 'Budget Umzüge'
      }
    },
    en: {
      title: 'Quote Comparison',
      subtitle: 'Compare quotes from different moving companies',
      yourEstimate: 'Your Estimate',
      recommended: 'Recommended',
      bestPrice: 'Best Price',
      bestRated: 'Best Rated',
      select: 'Select',
      selected: 'Selected',
      reviews: 'Reviews',
      deliveryTime: 'Delivery Time',
      insurance: 'Insurance',
      savings: 'Savings',
      features: {
        packing: 'Packing Service',
        assembly: 'Furniture Assembly',
        storage: 'Storage',
        cleaning: 'Final Cleaning',
        insurance: 'Full Insurance',
        weekend: 'Weekend Available',
        express: 'Express Available',
        piano: 'Piano Transport'
      },
      companies: {
        feierabend: 'Feierabend Moving',
        quickmove: 'QuickMove AG',
        swissmove: 'SwissMove Ltd',
        budget: 'Budget Movers'
      }
    },
    fr: {
      title: 'Comparaison de devis',
      subtitle: 'Comparez les devis de différentes entreprises',
      yourEstimate: 'Votre estimation',
      recommended: 'Recommandé',
      bestPrice: 'Meilleur prix',
      bestRated: 'Mieux noté',
      select: 'Sélectionner',
      selected: 'Sélectionné',
      reviews: 'Avis',
      deliveryTime: 'Délai',
      insurance: 'Assurance',
      savings: 'Économies',
      features: {
        packing: 'Service d\'emballage',
        assembly: 'Montage de meubles',
        storage: 'Stockage',
        cleaning: 'Nettoyage final',
        insurance: 'Assurance complète',
        weekend: 'Week-end disponible',
        express: 'Express disponible',
        piano: 'Transport de piano'
      },
      companies: {
        feierabend: 'Feierabend Déménagement',
        quickmove: 'QuickMove SA',
        swissmove: 'SwissMove Sàrl',
        budget: 'Budget Déménagement'
      }
    },
    it: {
      title: 'Confronto preventivi',
      subtitle: 'Confronta i preventivi di diverse aziende',
      yourEstimate: 'La tua stima',
      recommended: 'Consigliato',
      bestPrice: 'Miglior prezzo',
      bestRated: 'Più votato',
      select: 'Seleziona',
      selected: 'Selezionato',
      reviews: 'Recensioni',
      deliveryTime: 'Tempo di consegna',
      insurance: 'Assicurazione',
      savings: 'Risparmio',
      features: {
        packing: 'Servizio imballaggio',
        assembly: 'Montaggio mobili',
        storage: 'Deposito',
        cleaning: 'Pulizia finale',
        insurance: 'Assicurazione completa',
        weekend: 'Weekend disponibile',
        express: 'Express disponibile',
        piano: 'Trasporto pianoforte'
      },
      companies: {
        feierabend: 'Feierabend Traslochi',
        quickmove: 'QuickMove SA',
        swissmove: 'SwissMove Srl',
        budget: 'Budget Traslochi'
      }
    }
  };

  const t = translations[language] || translations.de;

  const quotes: CompanyQuote[] = useMemo(() => {
    const basePrice = userEstimate;
    
    return [
      {
        id: 'feierabend',
        name: t.companies.feierabend,
        logo: '🏠',
        price: basePrice,
        rating: 4.9,
        reviews: 847,
        features: ['packing', 'assembly', 'storage', 'cleaning', 'insurance', 'weekend', 'express', 'piano'],
        missingFeatures: [],
        deliveryTime: '2-3 Tage',
        insurance: 'CHF 100\'000',
        recommended: true
      },
      {
        id: 'quickmove',
        name: t.companies.quickmove,
        logo: '🚚',
        price: Math.round(basePrice * 0.85),
        rating: 4.2,
        reviews: 312,
        features: ['packing', 'assembly', 'weekend'],
        missingFeatures: ['storage', 'cleaning', 'insurance', 'express', 'piano'],
        deliveryTime: '3-5 Tage',
        insurance: 'CHF 50\'000'
      },
      {
        id: 'swissmove',
        name: t.companies.swissmove,
        logo: '🇨🇭',
        price: Math.round(basePrice * 1.1),
        rating: 4.7,
        reviews: 523,
        features: ['packing', 'assembly', 'storage', 'insurance', 'weekend', 'piano'],
        missingFeatures: ['cleaning', 'express'],
        deliveryTime: '2-4 Tage',
        insurance: 'CHF 80\'000'
      },
      {
        id: 'budget',
        name: t.companies.budget,
        logo: '💰',
        price: Math.round(basePrice * 0.7),
        rating: 3.8,
        reviews: 189,
        features: ['weekend'],
        missingFeatures: ['packing', 'assembly', 'storage', 'cleaning', 'insurance', 'express', 'piano'],
        deliveryTime: '5-7 Tage',
        insurance: 'CHF 20\'000'
      }
    ];
  }, [userEstimate, t]);

  const lowestPrice = Math.min(...quotes.map(q => q.price));
  const highestRating = Math.max(...quotes.map(q => q.rating));

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Scale className="h-5 w-5 text-primary" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Your Estimate Reference */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
          <span className="text-sm font-medium">{t.yourEstimate}</span>
          <span className="font-bold text-primary">CHF {userEstimate.toLocaleString('de-CH')}</span>
        </div>

        {/* Quotes List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {quotes.map((quote, index) => {
            const isSelected = selectedQuote === quote.id;
            const isBestPrice = quote.price === lowestPrice;
            const isBestRated = quote.rating === highestRating;
            const savings = userEstimate - quote.price;

            return (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-xl border-2 p-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : quote.recommended
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border hover:border-primary/30'
                }`}
                onClick={() => setSelectedQuote(quote.id)}
              >
                {/* Badges */}
                <div className="absolute -top-2 right-2 flex gap-1">
                  {quote.recommended && (
                    <Badge className="bg-primary text-primary-foreground text-[10px]">
                      <Award className="h-3 w-3 mr-0.5" />
                      {t.recommended}
                    </Badge>
                  )}
                  {isBestPrice && !quote.recommended && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-[10px]">
                      {t.bestPrice}
                    </Badge>
                  )}
                  {isBestRated && !quote.recommended && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-[10px]">
                      {t.bestRated}
                    </Badge>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  {/* Logo */}
                  <div className="text-2xl">{quote.logo}</div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{quote.name}</h4>
                      <span className="text-lg font-bold">CHF {quote.price.toLocaleString('de-CH')}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{quote.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({quote.reviews} {t.reviews})</span>
                      {savings > 0 && (
                        <Badge variant="outline" className="text-[10px] text-green-600 border-green-300">
                          <TrendingDown className="h-2.5 w-2.5 mr-0.5" />
                          -{savings.toLocaleString('de-CH')}
                        </Badge>
                      )}
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {quote.features.slice(0, 4).map(feature => (
                        <span key={feature} className="inline-flex items-center text-[10px] text-green-600 dark:text-green-400">
                          <Check className="h-2.5 w-2.5 mr-0.5" />
                          {t.features[feature as keyof typeof t.features]}
                        </span>
                      ))}
                      {quote.missingFeatures.slice(0, 2).map(feature => (
                        <span key={feature} className="inline-flex items-center text-[10px] text-muted-foreground line-through">
                          {t.features[feature as keyof typeof t.features]}
                        </span>
                      ))}
                    </div>

                    {/* Extra Info */}
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {quote.deliveryTime}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Shield className="h-2.5 w-2.5" />
                        {quote.insurance}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Select Button */}
                <Button
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  className="w-full mt-3 h-8 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedQuote(quote.id);
                  }}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      {t.selected}
                    </>
                  ) : (
                    t.select
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteComparisonTool;
