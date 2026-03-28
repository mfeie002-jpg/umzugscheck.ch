/**
 * MoveHealthDashboard - Public dashboard showing canton health scores
 * Displays aggregated move satisfaction data across Swiss cantons
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, TrendingDown, Minus, MapPin, Users, 
  ThumbsUp, Activity, AlertCircle, BarChart3
} from 'lucide-react';

interface CantonScore {
  canton_code: string;
  canton_name: string;
  overall_health_score: number;
  planning_score: number;
  moving_day_score: number;
  admin_score: number;
  total_responses: number;
  recommend_rate: number;
  avg_stress_level: number;
  grade: string;
  score_trend: number;
}

const gradeColors: Record<string, string> = {
  'A': 'bg-green-500',
  'B': 'bg-green-400',
  'C': 'bg-yellow-500',
  'D': 'bg-orange-500',
  'F': 'bg-red-500',
};

const gradeLabels: Record<string, string> = {
  'A': 'Ausgezeichnet',
  'B': 'Gut',
  'C': 'Befriedigend',
  'D': 'Genügend',
  'F': 'Ungenügend',
};

function TrendIndicator({ value }: { value: number }) {
  if (value > 0) {
    return <TrendingUp className="h-4 w-4 text-green-500" />;
  } else if (value < 0) {
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  }
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function CantonCard({ canton }: { canton: CantonScore }) {
  const minResponses = 20;
  const hasEnoughData = canton.total_responses >= minResponses;
  
  return (
    <Card className={`relative ${!hasEnoughData ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <CardTitle className="text-lg">{canton.canton_name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <TrendIndicator value={canton.score_trend} />
            <Badge className={`${gradeColors[canton.grade]} text-white`}>
              {canton.grade}
            </Badge>
          </div>
        </div>
        <CardDescription className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {canton.total_responses} Bewertungen
          {!hasEnoughData && (
            <span className="text-xs text-amber-600 ml-2">
              (min. {minResponses} für volle Anzeige)
            </span>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="text-center py-2">
          <div className="text-4xl font-bold text-primary">
            {Math.round(canton.overall_health_score)}
          </div>
          <div className="text-sm text-muted-foreground">
            Move Health Score
          </div>
        </div>
        
        {/* Category Scores */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Planung</span>
              <span className="font-medium">{Math.round(canton.planning_score)}</span>
            </div>
            <Progress value={canton.planning_score} className="h-2" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Umzugstag</span>
              <span className="font-medium">{Math.round(canton.moving_day_score)}</span>
            </div>
            <Progress value={canton.moving_day_score} className="h-2" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Administration</span>
              <span className="font-medium">{Math.round(canton.admin_score)}</span>
            </div>
            <Progress value={canton.admin_score} className="h-2" />
          </div>
        </div>
        
        {/* Recommend Rate */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 text-sm">
            <ThumbsUp className="h-4 w-4 text-green-500" />
            <span>Weiterempfehlung</span>
          </div>
          <span className="font-semibold">{Math.round(canton.recommend_rate)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function MoveHealthDashboard() {
  const [cantonScores, setCantonScores] = useState<CantonScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    fetchCantonScores();
  }, []);

  const fetchCantonScores = async () => {
    try {
      const { data, error } = await supabase
        .from('move_health_canton_scores')
        .select('*')
        .order('overall_health_score', { ascending: false });

      if (error) throw error;
      setCantonScores(data || []);
    } catch (error) {
      console.error('Error fetching canton scores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate national averages
  const nationalAvg = cantonScores.length > 0 ? {
    overall: cantonScores.reduce((sum, c) => sum + c.overall_health_score, 0) / cantonScores.length,
    planning: cantonScores.reduce((sum, c) => sum + c.planning_score, 0) / cantonScores.length,
    movingDay: cantonScores.reduce((sum, c) => sum + c.moving_day_score, 0) / cantonScores.length,
    admin: cantonScores.reduce((sum, c) => sum + c.admin_score, 0) / cantonScores.length,
    totalResponses: cantonScores.reduce((sum, c) => sum + c.total_responses, 0),
  } : null;

  const topCantons = cantonScores.filter(c => c.total_responses >= 1).slice(0, 5);
  const needsData = cantonScores.filter(c => c.total_responses < 20);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      {nationalAvg && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">
                {Math.round(nationalAvg.overall)}
              </div>
              <div className="text-sm text-muted-foreground">CH-Durchschnitt</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold">
                {nationalAvg.totalResponses}
              </div>
              <div className="text-sm text-muted-foreground">Bewertungen</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-500">
                {topCantons[0]?.canton_code || '-'}
              </div>
              <div className="text-sm text-muted-foreground">Bester Kanton</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold">26</div>
              <div className="text-sm text-muted-foreground">Kantone erfasst</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="flex items-start gap-4 pt-6">
          <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium mb-1">Move Health Index</h4>
            <p className="text-sm text-muted-foreground">
              Der Move Health Index misst die Zufriedenheit und den Stresslevel bei Umzügen in der Schweiz. 
              Kantone benötigen mindestens 20 Bewertungen für eine vollständige Anzeige.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cantonScores.slice(0, 9).map(canton => (
              <CantonCard key={canton.canton_code} canton={canton} />
            ))}
          </div>
          
          {cantonScores.length > 9 && (
            <div className="text-center mt-6">
              <Button variant="outline" onClick={() => setSelectedTab('ranking')}>
                Alle 26 Kantone anzeigen
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="ranking" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Kantons-Ranking nach Move Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cantonScores.map((canton, index) => (
                  <div 
                    key={canton.canton_code}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{canton.canton_name}</span>
                        <Badge variant="outline" className="text-xs">
                          {canton.canton_code}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {canton.total_responses} Bewertungen
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={canton.overall_health_score} className="w-24 h-2" />
                      <span className="font-bold w-12 text-right">
                        {Math.round(canton.overall_health_score)}
                      </span>
                      <Badge className={`${gradeColors[canton.grade]} text-white w-8 justify-center`}>
                        {canton.grade}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cantonScores.map(canton => (
              <CantonCard key={canton.canton_code} canton={canton} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
          <div>
            <h3 className="text-xl font-semibold mb-1">
              Kürzlich umgezogen?
            </h3>
            <p className="text-muted-foreground">
              Teilen Sie Ihre Erfahrung und helfen Sie anderen!
            </p>
          </div>
          <Button size="lg" onClick={() => window.location.href = '/umzug-bewerten'}>
            Jetzt bewerten →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
