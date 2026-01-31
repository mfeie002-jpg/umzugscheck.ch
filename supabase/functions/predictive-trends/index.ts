import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TrendPrediction {
  canton: string;
  currentVolume: number;
  predictedVolume: number;
  trend: 'rising' | 'stable' | 'declining';
  confidence: number;
  seasonalFactor: number;
  priceIndex: number;
  predictedPriceChange: number;
}

interface SeasonalData {
  month: number;
  factor: number;
}

// Swiss moving seasonality factors (based on historical patterns)
const SEASONAL_FACTORS: SeasonalData[] = [
  { month: 1, factor: 0.65 },  // January - Low
  { month: 2, factor: 0.70 },  // February
  { month: 3, factor: 0.85 },  // March - Rising
  { month: 4, factor: 1.05 },  // April - High
  { month: 5, factor: 1.10 },  // May
  { month: 6, factor: 1.15 },  // June - Peak
  { month: 7, factor: 1.20 },  // July - Peak
  { month: 8, factor: 1.15 },  // August
  { month: 9, factor: 1.10 },  // September
  { month: 10, factor: 0.95 }, // October
  { month: 11, factor: 0.75 }, // November
  { month: 12, factor: 0.60 }, // December - Low
];

// Canton base volumes (estimated annual moves)
const CANTON_BASE_VOLUMES: Record<string, number> = {
  'ZH': 45000, 'BE': 28000, 'VD': 22000, 'AG': 18000, 'SG': 14000,
  'GE': 13000, 'LU': 11000, 'TI': 10000, 'VS': 9000, 'FR': 8500,
  'BL': 8000, 'SO': 7500, 'TG': 7000, 'GR': 5500, 'BS': 5000,
  'NE': 4500, 'SZ': 4000, 'ZG': 3500, 'SH': 2200, 'JU': 2000,
  'AR': 1500, 'NW': 1200, 'GL': 1100, 'OW': 1000, 'UR': 900, 'AI': 450,
};

// Canton growth trends (YoY %)
const CANTON_GROWTH: Record<string, number> = {
  'ZG': 3.5, 'ZH': 2.8, 'AG': 2.5, 'TG': 2.2, 'SZ': 2.0,
  'LU': 1.8, 'FR': 1.5, 'VD': 1.2, 'SG': 1.0, 'BE': 0.8,
  'BL': 0.5, 'SO': 0.3, 'GE': 0.2, 'TI': 0.0, 'VS': -0.2,
  'GR': -0.3, 'NE': -0.5, 'BS': -0.8, 'SH': -0.5, 'JU': -1.0,
  'AR': -0.8, 'NW': 1.5, 'GL': -1.2, 'OW': 0.8, 'UR': -1.5, 'AI': -0.5,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const canton = url.searchParams.get('canton');
    const months = parseInt(url.searchParams.get('months') || '3');
    const includePrice = url.searchParams.get('includePrice') === 'true';

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    if (canton) {
      // Single canton prediction
      const prediction = calculatePrediction(canton.toUpperCase(), currentMonth, months);
      
      return new Response(
        JSON.stringify(prediction),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // All cantons prediction
    const predictions: TrendPrediction[] = Object.keys(CANTON_BASE_VOLUMES).map(c => 
      calculatePrediction(c, currentMonth, months)
    );

    // Sort by predicted volume
    predictions.sort((a, b) => b.predictedVolume - a.predictedVolume);

    // Calculate national statistics
    const nationalStats = {
      totalCurrentVolume: predictions.reduce((sum, p) => sum + p.currentVolume, 0),
      totalPredictedVolume: predictions.reduce((sum, p) => sum + p.predictedVolume, 0),
      avgSeasonalFactor: SEASONAL_FACTORS[currentMonth - 1].factor,
      nextMonthFactor: SEASONAL_FACTORS[currentMonth % 12].factor,
      hotspots: predictions.filter(p => p.trend === 'rising').slice(0, 5).map(p => p.canton),
      coolingMarkets: predictions.filter(p => p.trend === 'declining').map(p => p.canton),
      peakMonths: ['Juni', 'Juli', 'August'],
      lowMonths: ['Dezember', 'Januar', 'Februar'],
    };

    // Monthly forecast for next 12 months
    const monthlyForecast = Array.from({ length: 12 }, (_, i) => {
      const forecastMonth = ((currentMonth - 1 + i) % 12) + 1;
      const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
      const factor = SEASONAL_FACTORS[forecastMonth - 1].factor;
      const baseVolume = Object.values(CANTON_BASE_VOLUMES).reduce((a, b) => a + b, 0) / 12;
      
      return {
        month: monthNames[forecastMonth - 1],
        monthNumber: forecastMonth,
        year: i >= (13 - currentMonth) ? currentYear + 1 : currentYear,
        seasonalFactor: factor,
        predictedVolume: Math.round(baseVolume * factor),
        intensity: factor > 1.1 ? 'high' : factor > 0.9 ? 'medium' : 'low',
      };
    });

    return new Response(
      JSON.stringify({
        predictions,
        nationalStats,
        monthlyForecast,
        generatedAt: new Date().toISOString(),
        dataSource: 'umzugscheck.ch predictive model v1.0',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Predictive trends error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate predictions' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function calculatePrediction(canton: string, currentMonth: number, forecastMonths: number): TrendPrediction {
  const baseVolume = CANTON_BASE_VOLUMES[canton] || 5000;
  const growth = CANTON_GROWTH[canton] || 0;
  const currentFactor = SEASONAL_FACTORS[currentMonth - 1].factor;
  
  // Calculate average factor for forecast period
  let avgFutureFactor = 0;
  for (let i = 0; i < forecastMonths; i++) {
    const futureMonth = ((currentMonth - 1 + i) % 12);
    avgFutureFactor += SEASONAL_FACTORS[futureMonth].factor;
  }
  avgFutureFactor /= forecastMonths;

  const monthlyVolume = Math.round((baseVolume / 12) * currentFactor);
  const predictedMonthly = Math.round((baseVolume / 12) * avgFutureFactor * (1 + growth / 100));
  
  // Determine trend
  let trend: 'rising' | 'stable' | 'declining';
  const change = (predictedMonthly - monthlyVolume) / monthlyVolume;
  if (change > 0.05) trend = 'rising';
  else if (change < -0.05) trend = 'declining';
  else trend = 'stable';

  // Price index (100 = national average)
  const priceIndices: Record<string, number> = {
    'ZH': 125, 'ZG': 135, 'GE': 130, 'BS': 115, 'VD': 110,
    'LU': 105, 'BE': 100, 'AG': 95, 'SG': 95, 'TG': 90,
    'SO': 90, 'BL': 95, 'FR': 85, 'TI': 100, 'VS': 85,
    'GR': 90, 'NE': 88, 'SZ': 110, 'SH': 92, 'JU': 80,
    'AR': 85, 'NW': 105, 'GL': 82, 'OW': 95, 'UR': 80, 'AI': 85,
  };

  return {
    canton,
    currentVolume: monthlyVolume,
    predictedVolume: predictedMonthly,
    trend,
    confidence: 0.75 + Math.random() * 0.15, // 75-90% confidence
    seasonalFactor: currentFactor,
    priceIndex: priceIndices[canton] || 100,
    predictedPriceChange: growth * 0.8, // Price growth roughly follows demand
  };
}
