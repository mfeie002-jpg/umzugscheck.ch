import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { RefreshCw, TrendingUp, Users, Target, Beaker, Trophy, CheckCircle, AlertCircle, Clock, Percent } from "lucide-react";
import { getABTestStats, getExperimentsConfig, getABTestConversions, SignificanceResult } from "@/components/ABTestProvider";

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

// Significance badge component
const SignificanceBadge = ({ significance, variant }: { significance: SignificanceResult; variant: string }) => {
  if (significance.isSignificant) {
    return (
      <Badge className="bg-green-600 text-white animate-pulse">
        <CheckCircle className="h-3 w-3 mr-1" />
        Statistisch Signifikant ({significance.confidence.toFixed(0)}%)
      </Badge>
    );
  }
  
  if (significance.confidence >= 80) {
    return (
      <Badge variant="outline" className="border-yellow-500 text-yellow-600">
        <Clock className="h-3 w-3 mr-1" />
        Trend erkennbar ({significance.confidence.toFixed(0)}%)
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="text-muted-foreground">
      <AlertCircle className="h-3 w-3 mr-1" />
      Mehr Daten benötigt
    </Badge>
  );
};

const AdminABTesting = () => {
  const [stats, setStats] = useState<ReturnType<typeof getABTestStats>>({});
  const [conversions, setConversions] = useState<ReturnType<typeof getABTestConversions>>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadData = () => {
    setStats(getABTestStats());
    setConversions(getABTestConversions());
    setLastRefresh(new Date());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const experimentsConfig = getExperimentsConfig();
  const totalConversions = conversions.length;
  const activeExperiments = Object.keys(stats).length;
  
  // Count significant winners
  const significantWinners = Object.values(stats).filter(
    exp => exp.winner?.significance?.isSignificant
  ).length;

  // Prepare chart data for an experiment
  const getChartData = (experimentId: string) => {
    const exp = stats[experimentId];
    if (!exp) return [];
    
    return Object.entries(exp.variants).map(([variant, data], index) => ({
      name: variant === 'original' ? 'Original' : variant.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      impressions: data.impressions,
      conversions: Object.values(data.conversions).reduce((sum, c) => sum + c, 0),
      rate: data.conversionRate.toFixed(1),
      color: COLORS[index % COLORS.length]
    }));
  };

  // Recent conversions
  const recentConversions = conversions
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Beaker className="h-5 w-5" />
            A/B Testing Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Letzte Aktualisierung: {lastRefresh.toLocaleTimeString('de-CH')}
          </p>
        </div>
        <Button onClick={loadData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Aktualisieren
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Beaker className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{activeExperiments}</p>
                <p className="text-sm text-muted-foreground">Aktive Experimente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{totalConversions}</p>
                <p className="text-sm text-muted-foreground">Conversions Gesamt</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {Object.values(stats).reduce((sum, exp) => 
                    sum + Object.values(exp.variants).reduce((s, v) => s + v.impressions, 0), 0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Impressions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={significantWinners > 0 ? "border-green-500 bg-green-50 dark:bg-green-950/20" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className={`h-8 w-8 ${significantWinners > 0 ? "text-green-600" : "text-muted-foreground"}`} />
              <div>
                <p className="text-2xl font-bold">{significantWinners}</p>
                <p className="text-sm text-muted-foreground">Signifikante Winner</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Experiments */}
      <div className="grid gap-6">
        {Object.entries(stats).map(([expId, experiment]) => {
          const winner = experiment.winner;
          const chartData = getChartData(expId);
          const isSignificant = winner?.significance?.isSignificant;
          
          return (
            <Card key={expId} className={isSignificant ? "border-green-500 ring-2 ring-green-200 dark:ring-green-900" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2 flex-wrap">
                      {experiment.description}
                      {winner && winner.rate > 0 && (
                        <Badge className={isSignificant ? "bg-green-600 text-white" : "bg-yellow-500 text-white"}>
                          <Trophy className="h-3 w-3 mr-1" />
                          {winner.variant}
                          {winner.lift !== 0 && (
                            <span className="ml-1">
                              ({winner.lift > 0 ? "+" : ""}{winner.lift.toFixed(1)}%)
                            </span>
                          )}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Experiment: {expId} • {Object.keys(experiment.variants).length} Varianten
                    </CardDescription>
                    {winner?.significance && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <SignificanceBadge significance={winner.significance} variant={winner.variant} />
                        <span className="text-xs text-muted-foreground">
                          {winner.significance.sampleSizeRecommendation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Statistical Details */}
                {winner?.significance && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase">Konfidenz</p>
                      <p className="text-lg font-bold">{winner.significance.confidence.toFixed(1)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase">P-Wert</p>
                      <p className="text-lg font-bold">{winner.significance.pValue.toFixed(4)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase">Z-Score</p>
                      <p className="text-lg font-bold">{winner.significance.zScore.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase">Lift</p>
                      <p className={`text-lg font-bold ${winner.lift > 0 ? "text-green-600" : winner.lift < 0 ? "text-red-600" : ""}`}>
                        {winner.lift > 0 ? "+" : ""}{winner.lift.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Variants Performance */}
                <div className="grid gap-4">
                  {Object.entries(experiment.variants).map(([variant, data], index) => {
                    const totalConv = Object.values(data.conversions).reduce((sum, c) => sum + c, 0);
                    const isWinner = winner?.variant === variant && winner.rate > 0;
                    
                    return (
                      <div 
                        key={variant} 
                        className={`p-4 rounded-lg border ${isWinner ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'bg-muted/30'}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium capitalize">
                              {variant === 'original' ? 'Original' : variant.replace('-', ' ')}
                            </span>
                            {isWinner && (
                              <Trophy className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <Badge variant="outline">
                            {data.conversionRate.toFixed(1)}% CR
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-muted-foreground">Impressions</p>
                            <p className="font-semibold">{data.impressions}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Conversions</p>
                            <p className="font-semibold">{totalConv}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Conv. Rate</p>
                            <p className="font-semibold">{data.conversionRate.toFixed(2)}%</p>
                          </div>
                        </div>
                        
                        <Progress 
                          value={data.conversionRate} 
                          className="h-2"
                        />
                        
                        {Object.keys(data.conversions).length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {Object.entries(data.conversions).map(([type, count]) => (
                              <Badge key={type} variant="secondary" className="text-xs">
                                {type}: {count}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Chart */}
                {chartData.some(d => d.impressions > 0) && (
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="impressions" name="Impressions" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Conversions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Letzte Conversions
          </CardTitle>
          <CardDescription>Die letzten 10 Conversion-Events</CardDescription>
        </CardHeader>
        <CardContent>
          {recentConversions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Noch keine Conversions erfasst
            </p>
          ) : (
            <div className="space-y-2">
              {recentConversions.map((conv, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{experimentsConfig[conv.experimentId]?.description || conv.experimentId}</p>
                    <p className="text-sm text-muted-foreground">
                      Variante: <span className="font-medium">{conv.variant}</span> • {conv.conversionType}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(conv.timestamp).toLocaleString('de-CH')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Verwendung</CardTitle>
          <CardDescription>So verwenden Sie A/B Testing in Ihren Komponenten</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { useABTest } from "@/components/ABTestProvider";

function MyComponent() {
  const { variant, trackConversion } = useABTest("hero-cta");
  
  return (
    <Button 
      onClick={() => trackConversion("click")}
      variant={variant === "gradient" ? "default" : "outline"}
    >
      {variant === "variant-a" ? "Jetzt starten" : "Offerte anfragen"}
    </Button>
  );
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminABTesting;
