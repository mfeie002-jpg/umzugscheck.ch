/**
 * Canton Hub Information Component
 * 
 * INFORMATIONAL content for Canton (Hub) pages:
 * - Tax information
 * - Living costs
 * - Demographics
 * - Quality of life
 * - Legal notes
 * 
 * This differentiates Canton pages from City pages (transactional)
 * to prevent SEO keyword cannibalization.
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Landmark, 
  Coins, 
  Users, 
  Star, 
  FileText, 
  Train,
  TrendingDown,
  TrendingUp,
  Minus,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getHubContent, type HubContentData } from '@/lib/seo-hub-spoke';

interface CantonHubInfoProps {
  cantonSlug: string;
  cantonName: string;
}

const ComparisonBadge = ({ level }: { level: 'lower' | 'average' | 'higher' }) => {
  const config = {
    lower: { icon: TrendingDown, label: 'Unter CH-Schnitt', className: 'text-green-600 bg-green-50' },
    average: { icon: Minus, label: 'CH-Durchschnitt', className: 'text-primary bg-primary/10' },
    higher: { icon: TrendingUp, label: 'Über CH-Schnitt', className: 'text-amber-600 bg-amber-50' }
  };
  const { icon: Icon, label, className } = config[level];
  
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', className)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

export const CantonHubInfo = memo(({ cantonSlug, cantonName }: CantonHubInfoProps) => {
  const hubData = getHubContent(cantonSlug);
  
  if (!hubData) return null;

  return (
    <section className="py-12 bg-muted/30" id="region-info">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Info className="w-4 h-4" />
              Regionale Informationen
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Leben & Umziehen im Kanton {cantonName}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Wichtige Informationen zu Steuern, Lebenshaltungskosten und Lebensqualität für Ihren Umzug in den Kanton {cantonName}.
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tax Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border/50 p-6 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Steuersätze</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Steuerlast</span>
                  <span className="font-bold text-lg">{hubData.taxInfo.taxRate}</span>
                </div>
                <ComparisonBadge level={hubData.taxInfo.comparedToSwissAvg} />
                <p className="text-sm text-muted-foreground pt-2 border-t border-border/50">
                  {hubData.taxInfo.explanation}
                </p>
              </div>
            </motion.div>

            {/* Living Costs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border/50 p-6 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Mietpreise</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">3-Zimmer</span>
                  <span className="font-medium">{hubData.livingCosts.avgRent3Room}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">4-Zimmer</span>
                  <span className="font-medium">{hubData.livingCosts.avgRent4Room}</span>
                </div>
                <ComparisonBadge level={hubData.livingCosts.comparedToSwissAvg} />
              </div>
            </motion.div>

            {/* Demographics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border/50 p-6 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Bevölkerung</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Einwohner</span>
                  <span className="font-medium">{hubData.demographics.population}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wachstum</span>
                  <span className="font-medium">{hubData.demographics.populationGrowth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expat-Anteil</span>
                  <span className="font-medium">{hubData.demographics.expatPercent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ø Alter</span>
                  <span className="font-medium">{hubData.demographics.avgAge}</span>
                </div>
              </div>
            </motion.div>

            {/* Quality of Life */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl border border-border/50 p-6 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Lebensqualität</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">{hubData.qualityOfLife.score}</span>
                  <span className="text-muted-foreground text-sm">/10</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {hubData.qualityOfLife.highlights.map((highlight, i) => (
                    <span 
                      key={i} 
                      className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Transport */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl border border-border/50 p-6 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Train className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Verkehrsanbindung</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flughafen</span>
                  <span className="font-medium text-right">{hubData.transportLinks.nearestAirport}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Autobahn</span>
                  <span className="font-medium">{hubData.transportLinks.nearestHighway}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">ÖV-Score</span>
                  <span className="font-bold text-primary">{hubData.transportLinks.publicTransportScore}/10</span>
                </div>
              </div>
            </motion.div>

            {/* Legal Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-2xl border border-border/50 p-6 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Wichtige Hinweise</h3>
              </div>
              <ul className="space-y-2">
                {hubData.legalNotes.map((note, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
});

CantonHubInfo.displayName = 'CantonHubInfo';
