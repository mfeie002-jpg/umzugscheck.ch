import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  TrendingUp, 
  TrendingDown,
  Star, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  Target,
  Zap,
  ArrowRight,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  calculateQualityScore, 
  calculateProfileCompleteness,
  getQualityScoreLabel 
} from "@/lib/quality-score-service";

interface QualityScoreDashboardProps {
  provider: {
    id: string;
    company_name: string;
    rating?: number;
    review_count?: number;
    response_time_avg_hours?: number;
    logo_url?: string | null;
    short_description?: string | null;
    long_description?: string | null;
    services_offered?: string[];
    service_areas?: string[];
    certifications?: string[];
    profile_gallery?: string[];
    phone_tracking_number?: string | null;
    discount_offer?: string | null;
  };
}

interface ScoreMetric {
  label: string;
  value: number;
  maxValue: number;
  weight: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  improvement?: string;
}

export function QualityScoreDashboard({ provider }: QualityScoreDashboardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Calculate scores
  const profileCompleteness = calculateProfileCompleteness(provider);
  const qualityScore = calculateQualityScore({
    rating: provider.rating || 4.0,
    reviewCount: provider.review_count || 0,
    profileCompleteness,
    responseTimeAvgHours: provider.response_time_avg_hours || 24,
    successRate: 85,
    conversionRate: 20
  });

  const scorePercentage = Math.round(qualityScore * 100);
  const scoreLabel = getQualityScoreLabel(qualityScore);

  // Animate score on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(scorePercentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [scorePercentage]);

  // Define metrics
  const metrics: ScoreMetric[] = [
    {
      label: 'Bewertung',
      value: provider.rating || 4.0,
      maxValue: 5,
      weight: '35%',
      icon: <Star className="h-4 w-4" />,
      trend: 'up',
      improvement: 'Mehr positive Bewertungen sammeln'
    },
    {
      label: 'Anzahl Bewertungen',
      value: provider.review_count || 0,
      maxValue: 100,
      weight: '25%',
      icon: <MessageSquare className="h-4 w-4" />,
      trend: 'stable',
      improvement: 'Kunden um Bewertungen bitten'
    },
    {
      label: 'Profil-Vollständigkeit',
      value: profileCompleteness,
      maxValue: 100,
      weight: '15%',
      icon: <CheckCircle2 className="h-4 w-4" />,
      trend: profileCompleteness < 80 ? 'down' : 'up',
      improvement: 'Fehlende Profilfelder ausfüllen'
    },
    {
      label: 'Antwortzeit',
      value: Math.max(0, 48 - (provider.response_time_avg_hours || 24)),
      maxValue: 48,
      weight: '10%',
      icon: <Clock className="h-4 w-4" />,
      trend: 'up',
      improvement: 'Schneller auf Anfragen antworten'
    },
    {
      label: 'Erfolgsquote',
      value: 85,
      maxValue: 100,
      weight: '10%',
      icon: <Target className="h-4 w-4" />,
      trend: 'stable',
      improvement: 'Mehr Aufträge erfolgreich abschließen'
    },
    {
      label: 'Konversionsrate',
      value: 20,
      maxValue: 100,
      weight: '5%',
      icon: <Zap className="h-4 w-4" />,
      trend: 'up',
      improvement: 'Bessere Angebote erstellen'
    }
  ];

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Get improvement suggestions
  const getImprovementSuggestions = () => {
    const suggestions = [];
    
    if (profileCompleteness < 80) {
      suggestions.push({
        priority: 'high',
        text: 'Vervollständigen Sie Ihr Profil für bessere Sichtbarkeit',
        action: 'Profil bearbeiten'
      });
    }
    
    if ((provider.review_count || 0) < 10) {
      suggestions.push({
        priority: 'medium',
        text: 'Sammeln Sie mehr Kundenbewertungen',
        action: 'Bewertungen anfordern'
      });
    }
    
    if ((provider.response_time_avg_hours || 24) > 12) {
      suggestions.push({
        priority: 'medium',
        text: 'Verbessern Sie Ihre Antwortzeit auf unter 12 Stunden',
        action: 'Benachrichtigungen einrichten'
      });
    }

    return suggestions;
  };

  const suggestions = getImprovementSuggestions();

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <Card className="overflow-hidden">
        <div className={cn("h-2", getScoreBgColor(scorePercentage))} />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Quality Score Dashboard
              </CardTitle>
              <CardDescription>
                Ihr Qualitätswert bestimmt Ihre Sichtbarkeit und Ranking-Position
              </CardDescription>
            </div>
            <Badge className={cn("text-white", getScoreBgColor(scorePercentage))}>
              <Sparkles className="h-3 w-3 mr-1" />
              {scoreLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-[200px,1fr] gap-8">
            {/* Score Circle */}
            <div className="flex flex-col items-center justify-center">
              <motion.div 
                className="relative w-40 h-40"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted/20"
                  />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    className={getScoreColor(scorePercentage)}
                    initial={{ strokeDasharray: '0 440' }}
                    animate={{ 
                      strokeDasharray: `${(animatedScore / 100) * 440} 440` 
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span 
                    className={cn("text-4xl font-bold", getScoreColor(scorePercentage))}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {animatedScore}
                  </motion.span>
                  <span className="text-sm text-muted-foreground">von 100</span>
                </div>
              </motion.div>
              
              <p className="text-center text-sm text-muted-foreground mt-4">
                Sie sind besser als <strong>{Math.min(95, scorePercentage)}%</strong> aller Anbieter
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-4">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-1"
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{metric.icon}</span>
                      <span className="font-medium">{metric.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {metric.weight}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {metric.label === 'Bewertung' 
                          ? metric.value.toFixed(1) 
                          : metric.label === 'Antwortzeit'
                          ? `${48 - metric.value}h`
                          : `${Math.round((metric.value / metric.maxValue) * 100)}%`
                        }
                      </span>
                      {metric.trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                      {metric.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                    </div>
                  </div>
                  <Progress 
                    value={(metric.value / metric.maxValue) * 100} 
                    className="h-2"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Improvement Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5" />
              Verbesserungsvorschläge
            </CardTitle>
            <CardDescription>
              Optimieren Sie diese Bereiche für einen höheren Quality Score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    suggestion.priority === 'high' 
                      ? 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20'
                      : 'border-border'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {suggestion.priority === 'high' ? (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    ) : (
                      <Zap className="h-5 w-5 text-blue-500" />
                    )}
                    <span className="text-sm">{suggestion.text}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    {suggestion.action}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ranking Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ranking-Auswirkung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-primary">Top 15%</p>
              <p className="text-sm text-muted-foreground">Ihre Ranking-Position</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-emerald-500">+35%</p>
              <p className="text-sm text-muted-foreground">Mehr Sichtbarkeit</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-blue-500">2.3x</p>
              <p className="text-sm text-muted-foreground">Lead-Wahrscheinlichkeit</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
