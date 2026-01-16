/**
 * Competitor Price Comparison Component
 * Shows value comparison vs searching manually or competitors
 * Builds trust through transparent pricing
 */

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, Search, Shield, TrendingDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonFeature {
  name: string;
  umzugscheck: boolean | string;
  manual: boolean | string;
  otherPlatform?: boolean | string;
}

const comparisonFeatures: ComparisonFeature[] = [
  { 
    name: 'Zeitaufwand', 
    umzugscheck: '5 Minuten', 
    manual: '3-5 Stunden',
    otherPlatform: '15-30 Min'
  },
  { 
    name: 'Anzahl Offerten', 
    umzugscheck: 'Bis zu 5', 
    manual: '1-2',
    otherPlatform: '2-3'
  },
  { 
    name: 'Geprüfte Firmen', 
    umzugscheck: true, 
    manual: false,
    otherPlatform: 'Teilweise'
  },
  { 
    name: 'Preisvergleich', 
    umzugscheck: 'Automatisch', 
    manual: 'Manuell',
    otherPlatform: 'Begrenzt'
  },
  { 
    name: 'Kostenlos', 
    umzugscheck: true, 
    manual: true,
    otherPlatform: true
  },
  { 
    name: 'Kundenbewertungen', 
    umzugscheck: 'Verifiziert', 
    manual: 'Keine',
    otherPlatform: 'Teilweise'
  },
  { 
    name: 'Durchschnittliche Ersparnis', 
    umzugscheck: 'CHF 500-1000', 
    manual: 'CHF 0',
    otherPlatform: 'CHF 200-400'
  },
];

interface CompetitorPriceComparisonProps {
  variant?: 'table' | 'cards' | 'minimal';
  className?: string;
  showSavings?: boolean;
  estimatedSavings?: number;
}

export const CompetitorPriceComparison = memo(function CompetitorPriceComparison({
  variant = 'table',
  className,
  showSavings = true,
  estimatedSavings = 750
}: CompetitorPriceComparisonProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  if (variant === 'minimal') {
    return (
      <div className={cn('flex flex-wrap gap-4 justify-center', className)}>
        <ComparisonPill 
          icon={<Clock className="w-4 h-4" />}
          label="5 Min statt Stunden"
        />
        <ComparisonPill 
          icon={<TrendingDown className="w-4 h-4" />}
          label={`∅ CHF ${estimatedSavings} sparen`}
        />
        <ComparisonPill 
          icon={<Shield className="w-4 h-4" />}
          label="Nur geprüfte Firmen"
        />
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-6', className)}>
        {/* Umzugscheck Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-primary/5 rounded-xl p-6 border-2 border-primary"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            Empfohlen
          </div>
          
          <h3 className="text-xl font-bold text-center mb-4 mt-2">Umzugscheck.ch</h3>
          
          <ul className="space-y-3">
            <FeatureItem positive label="5 Minuten Zeitaufwand" />
            <FeatureItem positive label="Bis zu 5 Offerten" />
            <FeatureItem positive label="100% geprüfte Firmen" />
            <FeatureItem positive label="Automatischer Preisvergleich" />
            <FeatureItem positive label="Verifizierte Bewertungen" />
          </ul>

          {showSavings && (
            <div className="mt-6 pt-4 border-t border-primary/20 text-center">
              <p className="text-sm text-muted-foreground">Durchschnittliche Ersparnis</p>
              <p className="text-2xl font-bold text-primary">CHF {estimatedSavings}</p>
            </div>
          )}
        </motion.div>

        {/* Manual Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-muted/50 rounded-xl p-6 border border-border"
        >
          <h3 className="text-xl font-bold text-center mb-4 text-muted-foreground">Selbst suchen</h3>
          
          <ul className="space-y-3">
            <FeatureItem negative label="3-5 Stunden Aufwand" />
            <FeatureItem negative label="Meist nur 1-2 Offerten" />
            <FeatureItem negative label="Keine Qualitätsprüfung" />
            <FeatureItem negative label="Manueller Vergleich nötig" />
            <FeatureItem negative label="Keine Bewertungen" />
          </ul>

          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">Zeitverlust</p>
            <p className="text-2xl font-bold text-muted-foreground">3-5 Std</p>
          </div>
        </motion.div>

        {/* Other Platform Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-muted/30 rounded-xl p-6 border border-border"
        >
          <h3 className="text-xl font-bold text-center mb-4 text-muted-foreground">Andere Portale</h3>
          
          <ul className="space-y-3">
            <FeatureItem neutral label="15-30 Min Aufwand" />
            <FeatureItem neutral label="2-3 Offerten" />
            <FeatureItem neutral label="Teilweise geprüft" />
            <FeatureItem neutral label="Begrenzter Vergleich" />
            <FeatureItem neutral label="Wenig Bewertungen" />
          </ul>

          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">Ersparnis</p>
            <p className="text-2xl font-bold text-muted-foreground">CHF 200-400</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Table variant (default)
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-4 font-medium text-muted-foreground">Feature</th>
            <th className="p-4 text-center">
              <div className="inline-flex flex-col items-center gap-1">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-bold text-primary">Umzugscheck.ch</span>
              </div>
            </th>
            <th className="p-4 text-center">
              <div className="inline-flex flex-col items-center gap-1">
                <Search className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">Selbst suchen</span>
              </div>
            </th>
            <th className="p-4 text-center">
              <span className="font-medium text-muted-foreground">Andere Portale</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {comparisonFeatures.map((feature, index) => (
            <motion.tr
              key={feature.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredRow(index)}
              onMouseLeave={() => setHoveredRow(null)}
              className={cn(
                'border-b transition-colors',
                hoveredRow === index ? 'bg-muted/50' : ''
              )}
            >
              <td className="p-4 font-medium">{feature.name}</td>
              <td className="p-4 text-center">
                <CellValue value={feature.umzugscheck} highlight />
              </td>
              <td className="p-4 text-center">
                <CellValue value={feature.manual} />
              </td>
              <td className="p-4 text-center">
                <CellValue value={feature.otherPlatform} />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {showSavings && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 p-4 bg-primary/10 rounded-lg flex items-center justify-center gap-3"
        >
          <TrendingDown className="w-6 h-6 text-primary" />
          <span className="text-lg">
            Mit Umzugscheck.ch sparen Sie durchschnittlich{' '}
            <strong className="text-primary">CHF {estimatedSavings}</strong>
          </span>
        </motion.div>
      )}
    </div>
  );
});

// Helper components
const CellValue = memo(function CellValue({ 
  value, 
  highlight = false 
}: { 
  value: boolean | string | undefined;
  highlight?: boolean;
}) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className={cn('w-5 h-5 mx-auto', highlight ? 'text-green-500' : 'text-green-400')} />
    ) : (
      <X className="w-5 h-5 mx-auto text-red-400" />
    );
  }

  if (typeof value === 'string') {
    return (
      <span className={cn(
        'text-sm',
        highlight ? 'font-semibold text-primary' : 'text-muted-foreground'
      )}>
        {value}
      </span>
    );
  }

  return <span className="text-muted-foreground">-</span>;
});

const FeatureItem = memo(function FeatureItem({
  positive,
  negative,
  neutral,
  label
}: {
  positive?: boolean;
  negative?: boolean;
  neutral?: boolean;
  label: string;
}) {
  return (
    <li className="flex items-center gap-2">
      {positive && <Check className="w-5 h-5 text-green-500 flex-shrink-0" />}
      {negative && <X className="w-5 h-5 text-red-400 flex-shrink-0" />}
      {neutral && <span className="w-5 h-5 flex-shrink-0 text-center text-muted-foreground">~</span>}
      <span className={cn(
        'text-sm',
        positive ? 'text-foreground' : 'text-muted-foreground'
      )}>
        {label}
      </span>
    </li>
  );
});

const ComparisonPill = memo(function ComparisonPill({
  icon,
  label
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
      {icon}
      {label}
    </div>
  );
});

export default CompetitorPriceComparison;
