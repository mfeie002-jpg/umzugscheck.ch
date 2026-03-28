import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, MapPin, Calendar, Clock } from 'lucide-react';

interface PriceTrend {
  city: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  demandLevel: 'high' | 'medium' | 'low';
}

const trendData: PriceTrend[] = [
  { city: 'Zürich', currentPrice: 1850, previousPrice: 1750, change: 5.7, trend: 'up', demandLevel: 'high' },
  { city: 'Basel', currentPrice: 1620, previousPrice: 1650, change: -1.8, trend: 'down', demandLevel: 'medium' },
  { city: 'Bern', currentPrice: 1480, previousPrice: 1480, change: 0, trend: 'stable', demandLevel: 'medium' },
  { city: 'Genf', currentPrice: 2100, previousPrice: 1950, change: 7.7, trend: 'up', demandLevel: 'high' },
  { city: 'Luzern', currentPrice: 1550, previousPrice: 1520, change: 2.0, trend: 'up', demandLevel: 'medium' },
];

const LivePriceTrends = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-destructive" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getDemandBadge = (level: string) => {
    const colors = {
      high: 'bg-destructive/10 text-destructive',
      medium: 'bg-warning/10 text-warning',
      low: 'bg-green-500/10 text-green-500'
    };
    const labels = { high: 'Hoch', medium: 'Mittel', low: 'Niedrig' };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${colors[level as keyof typeof colors]}`}>
        {labels[level as keyof typeof labels]}
      </span>
    );
  };

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Live Preistrends
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {currentTime.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div className="space-y-3">
          {trendData.map((item, index) => (
            <motion.div
              key={item.city}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <div>
                  <p className="font-medium text-sm">{item.city}</p>
                  <p className="text-xs text-muted-foreground">3-Zimmer Wohnung</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {getDemandBadge(item.demandLevel)}
                
                <div className="text-right">
                  <p className="font-semibold">CHF {item.currentPrice.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-xs">
                    {getTrendIcon(item.trend)}
                    <span className={
                      item.trend === 'up' ? 'text-destructive' : 
                      item.trend === 'down' ? 'text-green-500' : 
                      'text-muted-foreground'
                    }>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Bester Zeitpunkt:</span>
            <span className="font-medium">Mitte des Monats buchen</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePriceTrends;
