import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Droplets, AlertTriangle, CheckCircle, Info, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, addDays, isSameDay } from 'date-fns';
import { de, enUS, fr, it } from 'date-fns/locale';

interface WeatherForecastProps {
  movingDate?: Date;
  city?: string;
}

interface WeatherDay {
  date: Date;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  tempHigh: number;
  tempLow: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
  recommendation: 'excellent' | 'good' | 'caution' | 'poor';
}

const WeatherForecast = ({ 
  movingDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  city = 'Zürich'
}: WeatherForecastProps) => {
  const { language } = useLanguage();
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const locales = { de, en: enUS, fr, it };
  const dateLocale = locales[language as keyof typeof locales] || de;

  const translations = {
    de: {
      title: 'Wetter-Vorhersage',
      subtitle: 'Planen Sie Ihren Umzug wettergerecht',
      movingDay: 'Umzugstag',
      temperature: 'Temperatur',
      precipitation: 'Niederschlag',
      wind: 'Wind',
      humidity: 'Luftfeuchtigkeit',
      conditions: {
        sunny: 'Sonnig',
        cloudy: 'Bewölkt',
        rainy: 'Regnerisch',
        snowy: 'Schnee',
        windy: 'Windig'
      },
      recommendations: {
        excellent: 'Ideales Umzugswetter',
        good: 'Gute Bedingungen',
        caution: 'Vorsicht geboten',
        poor: 'Ungünstige Bedingungen'
      },
      tips: {
        sunny: 'Perfekt! Denken Sie an Sonnenschutz und genügend Wasser.',
        cloudy: 'Gute Bedingungen für körperliche Arbeit.',
        rainy: 'Schützen Sie Möbel mit Folien. Rutschgefahr beachten!',
        snowy: 'Vorsicht bei Glatteis. Mehr Zeit einplanen.',
        windy: 'Leichte Gegenstände sichern. Türen festhalten!'
      },
      kmh: 'km/h',
      loading: 'Wetter wird geladen...'
    },
    en: {
      title: 'Weather Forecast',
      subtitle: 'Plan your move according to weather',
      movingDay: 'Moving Day',
      temperature: 'Temperature',
      precipitation: 'Precipitation',
      wind: 'Wind',
      humidity: 'Humidity',
      conditions: {
        sunny: 'Sunny',
        cloudy: 'Cloudy',
        rainy: 'Rainy',
        snowy: 'Snowy',
        windy: 'Windy'
      },
      recommendations: {
        excellent: 'Ideal moving weather',
        good: 'Good conditions',
        caution: 'Caution advised',
        poor: 'Unfavorable conditions'
      },
      tips: {
        sunny: 'Perfect! Remember sun protection and plenty of water.',
        cloudy: 'Good conditions for physical work.',
        rainy: 'Protect furniture with covers. Watch for slippery surfaces!',
        snowy: 'Watch for ice. Plan extra time.',
        windy: 'Secure light items. Hold doors!'
      },
      kmh: 'km/h',
      loading: 'Loading weather...'
    },
    fr: {
      title: 'Prévisions météo',
      subtitle: 'Planifiez votre déménagement selon la météo',
      movingDay: 'Jour du déménagement',
      temperature: 'Température',
      precipitation: 'Précipitations',
      wind: 'Vent',
      humidity: 'Humidité',
      conditions: {
        sunny: 'Ensoleillé',
        cloudy: 'Nuageux',
        rainy: 'Pluvieux',
        snowy: 'Neige',
        windy: 'Venteux'
      },
      recommendations: {
        excellent: 'Météo idéale',
        good: 'Bonnes conditions',
        caution: 'Prudence conseillée',
        poor: 'Conditions défavorables'
      },
      tips: {
        sunny: 'Parfait! Pensez à la protection solaire.',
        cloudy: 'Bonnes conditions pour le travail physique.',
        rainy: 'Protégez les meubles. Attention aux surfaces glissantes!',
        snowy: 'Attention au verglas. Prévoyez plus de temps.',
        windy: 'Sécurisez les objets légers!'
      },
      kmh: 'km/h',
      loading: 'Chargement de la météo...'
    },
    it: {
      title: 'Previsioni meteo',
      subtitle: 'Pianifica il trasloco in base al tempo',
      movingDay: 'Giorno del trasloco',
      temperature: 'Temperatura',
      precipitation: 'Precipitazioni',
      wind: 'Vento',
      humidity: 'Umidità',
      conditions: {
        sunny: 'Soleggiato',
        cloudy: 'Nuvoloso',
        rainy: 'Piovoso',
        snowy: 'Neve',
        windy: 'Ventoso'
      },
      recommendations: {
        excellent: 'Meteo ideale',
        good: 'Buone condizioni',
        caution: 'Prudenza consigliata',
        poor: 'Condizioni sfavorevoli'
      },
      tips: {
        sunny: 'Perfetto! Ricorda la protezione solare.',
        cloudy: 'Buone condizioni per il lavoro fisico.',
        rainy: 'Proteggi i mobili. Attenzione alle superfici scivolose!',
        snowy: 'Attenzione al ghiaccio. Prevedi più tempo.',
        windy: 'Fissa gli oggetti leggeri!'
      },
      kmh: 'km/h',
      loading: 'Caricamento meteo...'
    }
  };

  const t = translations[language] || translations.de;

  // Simulate weather data
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      const conditions: WeatherDay['condition'][] = ['sunny', 'cloudy', 'rainy', 'sunny', 'cloudy', 'windy', 'sunny'];
      const mockForecast: WeatherDay[] = [];
      
      for (let i = 0; i < 7; i++) {
        const date = addDays(new Date(), i);
        const condition = conditions[i];
        
        let recommendation: WeatherDay['recommendation'] = 'good';
        if (condition === 'sunny') recommendation = 'excellent';
        else if (condition === 'rainy' || condition === 'snowy') recommendation = 'caution';
        else if (condition === 'windy') recommendation = 'caution';
        
        mockForecast.push({
          date,
          condition,
          tempHigh: Math.round(15 + Math.random() * 10),
          tempLow: Math.round(8 + Math.random() * 5),
          precipitation: condition === 'rainy' ? Math.round(40 + Math.random() * 40) : condition === 'snowy' ? Math.round(20 + Math.random() * 30) : Math.round(Math.random() * 15),
          windSpeed: condition === 'windy' ? Math.round(30 + Math.random() * 20) : Math.round(5 + Math.random() * 15),
          humidity: Math.round(50 + Math.random() * 30),
          recommendation
        });
      }
      
      setForecast(mockForecast);
      setIsLoading(false);
    }, 1000);
  }, [movingDate]);

  const getWeatherIcon = (condition: WeatherDay['condition']) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'snowy': return <CloudSnow className="h-6 w-6 text-blue-300" />;
      case 'windy': return <Wind className="h-6 w-6 text-teal-500" />;
      default: return <Sun className="h-6 w-6" />;
    }
  };

  const getRecommendationColor = (rec: WeatherDay['recommendation']) => {
    switch (rec) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'caution': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'poor': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    }
  };

  const getRecommendationIcon = (rec: WeatherDay['recommendation']) => {
    switch (rec) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'caution': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'poor': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const movingDayForecast = forecast.find(day => isSameDay(day.date, movingDate));

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cloud className="h-5 w-5 text-primary" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle} • {city}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-sm text-muted-foreground">{t.loading}</div>
          </div>
        ) : (
          <>
            {/* Moving Day Highlight */}
            {movingDayForecast && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">{t.movingDay}</span>
                  <Badge variant="secondary" className={getRecommendationColor(movingDayForecast.recommendation)}>
                    {getRecommendationIcon(movingDayForecast.recommendation)}
                    <span className="ml-1">{t.recommendations[movingDayForecast.recommendation]}</span>
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getWeatherIcon(movingDayForecast.condition)}
                    <div>
                      <p className="font-semibold">{t.conditions[movingDayForecast.condition]}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(movingDayForecast.date, 'EEEE, d. MMMM', { locale: dateLocale })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-4 w-4 text-red-400" />
                      <span>{movingDayForecast.tempLow}° - {movingDayForecast.tempHigh}°</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-blue-400" />
                      <span>{movingDayForecast.precipitation}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="h-4 w-4 text-teal-400" />
                      <span>{movingDayForecast.windSpeed} {t.kmh}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Cloud className="h-4 w-4 text-gray-400" />
                      <span>{movingDayForecast.humidity}%</span>
                    </div>
                  </div>
                </div>

                <Alert className="mt-3 bg-background/50">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {t.tips[movingDayForecast.condition]}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* 7-Day Forecast */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">7-Tage Übersicht</h4>
              <div className="grid grid-cols-7 gap-1">
                {forecast.map((day, index) => {
                  const isMovingDay = isSameDay(day.date, movingDate);
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`text-center p-2 rounded-lg ${
                        isMovingDay 
                          ? 'bg-primary/20 ring-2 ring-primary' 
                          : 'bg-muted/30 hover:bg-muted/50'
                      }`}
                    >
                      <p className="text-[10px] font-medium text-muted-foreground">
                        {format(day.date, 'EEE', { locale: dateLocale })}
                      </p>
                      <div className="my-1">
                        {getWeatherIcon(day.condition)}
                      </div>
                      <p className="text-xs font-semibold">{day.tempHigh}°</p>
                      <p className="text-[10px] text-muted-foreground">{day.tempLow}°</p>
                      {isMovingDay && (
                        <Badge variant="default" className="mt-1 text-[8px] px-1 py-0">
                          📦
                        </Badge>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
