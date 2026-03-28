/**
 * EMBEDDABLE WIDGETS
 * Iframe-ready components for cities, media, and partners to embed
 * 
 * Usage: <iframe src="https://umzugscheck.ch/embed/trends" />
 */

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { 
  YEARLY_STATISTICS, 
  MONTHLY_DISTRIBUTION,
  MOVING_COST_INDEX,
  formatCurrency 
} from '@/lib/data-journalism';

// Detect if running in iframe
const isInIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

interface EmbedProps {
  variant?: 'compact' | 'full';
  showBranding?: boolean;
  canton?: string;
}

/**
 * Trends Widget - Key moving statistics
 */
export function TrendsWidget({ variant = 'compact', showBranding = true }: EmbedProps) {
  const latestYear = YEARLY_STATISTICS[0];
  const previousYear = YEARLY_STATISTICS[1];
  
  const yoyChange = ((latestYear.totalMoves - previousYear.totalMoves) / previousYear.totalMoves * 100).toFixed(1);
  
  return (
    <div className="font-sans bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Umzugstrends Schweiz</h3>
          <p className="text-xs text-gray-500">Stand: {latestYear.year}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Umzüge/Jahr</div>
          <div className="text-xl font-bold text-gray-900">
            {(latestYear.totalMoves / 1000).toFixed(0)}k
          </div>
          <div className={`text-xs flex items-center gap-1 ${parseFloat(yoyChange) > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(yoyChange) > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {yoyChange}% vs. Vorjahr
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Ø Kosten</div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(latestYear.avgCostCH)}
          </div>
          <div className="text-xs text-gray-500">Schweizer Durchschnitt</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-gray-500">
          <Calendar className="w-3 h-3" />
          Peak: {latestYear.mostPopularMonth}
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <Users className="w-3 h-3" />
          {latestYear.professionalMovePercent}% mit Firma
        </div>
      </div>
      
      {showBranding && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Daten: umzugscheck.ch
          </span>
          <a 
            href="https://umzugscheck.ch/daten" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Mehr Statistiken
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Canton Cost Widget - Costs for a specific canton
 */
export function CantonCostWidget({ canton, showBranding = true }: EmbedProps & { canton: string }) {
  const cantonData = MOVING_COST_INDEX.find(c => 
    c.slug === canton || c.cantonCode === canton.toUpperCase()
  );
  
  if (!cantonData) {
    return (
      <div className="font-sans bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center text-gray-500">
        Kanton nicht gefunden
      </div>
    );
  }
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'steigend': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'sinkend': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };
  
  return (
    <div className="font-sans bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <MapPin className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Umzugskosten {cantonData.canton}</h3>
          <p className="text-xs text-gray-500">Index: {cantonData.indexValue} (CH = 100)</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">3-Zimmer</span>
          <span className="font-semibold text-gray-900">{formatCurrency(cantonData.avgCost3Zimmer)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">4-Zimmer</span>
          <span className="font-semibold text-gray-900">{formatCurrency(cantonData.avgCost4Zimmer)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Haus</span>
          <span className="font-semibold text-gray-900">{formatCurrency(cantonData.avgCostHaus)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-1 rounded-full ${
          cantonData.priceLevel === 'günstig' ? 'bg-green-100 text-green-700' :
          cantonData.priceLevel === 'teuer' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {cantonData.priceLevel}
        </span>
        <div className="flex items-center gap-1 text-gray-500">
          {getTrendIcon(cantonData.trend)}
          {cantonData.trendPercent > 0 ? '+' : ''}{cantonData.trendPercent}% Trend
        </div>
      </div>
      
      {showBranding && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Daten: umzugscheck.ch
          </span>
          <a 
            href={`https://umzugscheck.ch/umzugsfirmen/kanton-${cantonData.slug}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Offerten vergleichen
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Seasonal Widget - Best time to move
 */
export function SeasonalWidget({ showBranding = true }: EmbedProps) {
  const cheapestMonths = [...MONTHLY_DISTRIBUTION]
    .sort((a, b) => a.avgCost - b.avgCost)
    .slice(0, 3);
    
  const expensiveMonths = [...MONTHLY_DISTRIBUTION]
    .sort((a, b) => b.avgCost - a.avgCost)
    .slice(0, 3);
  
  return (
    <div className="font-sans bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Beste Zeit zum Umziehen</h3>
          <p className="text-xs text-gray-500">Saisonale Preisunterschiede</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-xs font-medium text-green-700 mb-2">💰 Günstigste Monate</div>
          {cheapestMonths.map(m => (
            <div key={m.month} className="flex justify-between text-sm py-0.5">
              <span className="text-gray-600">{m.month}</span>
              <span className="font-medium text-green-700">{formatCurrency(m.avgCost)}</span>
            </div>
          ))}
        </div>
        
        <div className="bg-red-50 rounded-lg p-3">
          <div className="text-xs font-medium text-red-700 mb-2">📈 Teuerste Monate</div>
          {expensiveMonths.map(m => (
            <div key={m.month} className="flex justify-between text-sm py-0.5">
              <span className="text-gray-600">{m.month}</span>
              <span className="font-medium text-red-700">{formatCurrency(m.avgCost)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        Ersparnis bis zu CHF {formatCurrency(expensiveMonths[0].avgCost - cheapestMonths[0].avgCost).replace("CHF ", "")} möglich
      </div>
      
      {showBranding && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Daten: umzugscheck.ch
          </span>
          <a 
            href="https://umzugscheck.ch/daten" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Vollständige Analyse
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Embed page wrapper for iframe usage
 */
export function EmbedPage() {
  const [params, setParams] = useState<{
    widget: string;
    canton?: string;
    branding?: boolean;
  }>({ widget: 'trends' });
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setParams({
      widget: searchParams.get('widget') || 'trends',
      canton: searchParams.get('canton') || undefined,
      branding: searchParams.get('branding') !== 'false',
    });
  }, []);
  
  // Minimal styling for embed
  const embedStyles = isInIframe() ? 'p-0' : 'p-4 max-w-md mx-auto';
  
  return (
    <div className={embedStyles}>
      {params.widget === 'trends' && <TrendsWidget showBranding={params.branding} />}
      {params.widget === 'canton' && params.canton && (
        <CantonCostWidget canton={params.canton} showBranding={params.branding} />
      )}
      {params.widget === 'seasonal' && <SeasonalWidget showBranding={params.branding} />}
    </div>
  );
}

export default EmbedPage;
