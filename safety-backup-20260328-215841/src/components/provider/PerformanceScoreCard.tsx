import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Award, TrendingUp, TrendingDown, Info, Star, Clock, CheckCircle2, MessageSquare, Target } from 'lucide-react';

interface Props {
  providerId: string;
}

interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  icon: React.ReactNode;
  description: string;
  trend: number;
}

export const PerformanceScoreCard = ({ providerId }: Props) => {
  const [totalScore, setTotalScore] = useState(78);
  const [categories, setCategories] = useState<ScoreCategory[]>([
    {
      name: 'Antwortzeit',
      score: 85,
      maxScore: 100,
      icon: <Clock className="h-4 w-4" />,
      description: 'Wie schnell Sie auf neue Leads reagieren',
      trend: 5,
    },
    {
      name: 'Konversionsrate',
      score: 72,
      maxScore: 100,
      icon: <Target className="h-4 w-4" />,
      description: 'Anteil der konvertierten Leads',
      trend: -2,
    },
    {
      name: 'Kundenzufriedenheit',
      score: 92,
      maxScore: 100,
      icon: <Star className="h-4 w-4" />,
      description: 'Basierend auf Bewertungen',
      trend: 3,
    },
    {
      name: 'Profilvollständigkeit',
      score: 65,
      maxScore: 100,
      icon: <CheckCircle2 className="h-4 w-4" />,
      description: 'Wie komplett Ihr Profil ist',
      trend: 10,
    },
    {
      name: 'Kommunikation',
      score: 78,
      maxScore: 100,
      icon: <MessageSquare className="h-4 w-4" />,
      description: 'Qualität Ihrer Kundeninteraktionen',
      trend: 0,
    },
  ]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-blue-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    return 'D';
  };

  const getRankDescription = (score: number) => {
    if (score >= 90) return 'Exzellent';
    if (score >= 80) return 'Sehr gut';
    if (score >= 70) return 'Gut';
    if (score >= 60) return 'Durchschnitt';
    if (score >= 50) return 'Verbesserungsbedarf';
    return 'Kritisch';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Performance Score
        </CardTitle>
        <CardDescription>Ihre Gesamtleistung im Überblick</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Score */}
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32">
              <circle
                className="text-muted stroke-current"
                strokeWidth="8"
                fill="transparent"
                r="56"
                cx="64"
                cy="64"
              />
              <circle
                className={`${getScoreColor(totalScore)} stroke-current transition-all duration-500`}
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                r="56"
                cx="64"
                cy="64"
                strokeDasharray={`${totalScore * 3.52} 352`}
                transform="rotate(-90 64 64)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getScoreColor(totalScore)}`}>
                {totalScore}
              </span>
              <span className="text-sm text-muted-foreground">von 100</span>
            </div>
          </div>
          <div className="mt-4">
            <Badge className={`${getScoreBgColor(totalScore)} ${getScoreColor(totalScore)} text-lg px-4 py-1`}>
              {getGrade(totalScore)} - {getRankDescription(totalScore)}
            </Badge>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h4 className="font-medium">Detailbewertung</h4>
          <TooltipProvider>
            {categories.map(category => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span className="text-sm font-medium">{category.name}</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{category.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getScoreColor(category.score)}`}>
                      {category.score}
                    </span>
                    {category.trend !== 0 && (
                      <span className={`text-xs flex items-center ${category.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {category.trend > 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(category.trend)}%
                      </span>
                    )}
                  </div>
                </div>
                <Progress value={category.score} className="h-2" />
              </div>
            ))}
          </TooltipProvider>
        </div>

        {/* Recommendations */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-3">Empfehlungen</h4>
          <ul className="space-y-2 text-sm">
            {categories
              .filter(c => c.score < 80)
              .sort((a, b) => a.score - b.score)
              .slice(0, 3)
              .map(category => (
                <li key={category.name} className="flex items-start gap-2">
                  <span className="text-yellow-500">→</span>
                  <span>
                    <strong>{category.name}</strong>: {category.description.toLowerCase()}
                    {category.score < 70 && ' - Priorität hoch'}
                  </span>
                </li>
              ))}
          </ul>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 border rounded-lg">
            <p className="text-sm text-muted-foreground">Ihr Ranking</p>
            <p className="text-xl font-bold">#12</p>
            <p className="text-xs text-muted-foreground">von 156 Anbietern</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-sm text-muted-foreground">Branchenschnitt</p>
            <p className="text-xl font-bold">65</p>
            <p className="text-xs text-green-600">+{totalScore - 65} Punkte besser</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
