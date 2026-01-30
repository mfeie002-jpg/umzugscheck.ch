/**
 * Move Health Index - Public Dashboard
 * Displays aggregated satisfaction and stress scores by canton
 */

import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Heart, 
  Zap, 
  Users,
  MapPin,
  AlertCircle,
  Trophy,
  BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CantonHealthData {
  canton_code: string;
  canton_name: string;
  overall_health_score: number | null;
  satisfaction_index: number | null;
  stress_index: number | null;
  planning_score: number | null;
  company_score: number | null;
  admin_score: number | null;
  welcome_score: number | null;
  total_responses: number;
  damage_rate_percent: number | null;
  trend_vs_last_quarter: "improving" | "stable" | "declining" | null;
}

function useHealthIndex() {
  return useQuery({
    queryKey: ["move-health-index"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("move_health_index")
        .select("*")
        .order("overall_health_score", { ascending: false, nullsFirst: false });

      if (error) throw error;
      return data as CantonHealthData[];
    },
  });
}

function getScoreColor(score: number | null): string {
  if (score === null) return "bg-muted";
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-emerald-400";
  if (score >= 40) return "bg-yellow-500";
  if (score >= 20) return "bg-orange-500";
  return "bg-red-500";
}

function getScoreGrade(score: number | null): string {
  if (score === null) return "-";
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 40) return "D";
  return "F";
}

function TrendBadge({ trend }: { trend: "improving" | "stable" | "declining" | null }) {
  if (!trend) return null;
  
  const config = {
    improving: { icon: TrendingUp, label: "Aufwärtstrend", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    stable: { icon: Minus, label: "Stabil", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
    declining: { icon: TrendingDown, label: "Abwärtstrend", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  };
  
  const { icon: Icon, label, className } = config[trend];
  
  return (
    <Badge variant="secondary" className={className}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  );
}

function CantonCard({ canton, rank }: { canton: CantonHealthData; rank: number }) {
  const hasData = canton.total_responses >= 3;
  
  return (
    <Card className={`transition-all hover:shadow-md ${rank <= 3 ? "border-primary/30" : ""}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {rank <= 3 && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                rank === 1 ? "bg-yellow-500" : rank === 2 ? "bg-gray-400" : "bg-amber-600"
              }`}>
                {rank}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {canton.canton_name}
              </h3>
              <p className="text-sm text-muted-foreground">{canton.canton_code}</p>
            </div>
          </div>
          
          {hasData ? (
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                (canton.overall_health_score ?? 0) >= 70 ? "text-green-600" : 
                (canton.overall_health_score ?? 0) >= 50 ? "text-yellow-600" : "text-red-600"
              }`}>
                {getScoreGrade(canton.overall_health_score)}
              </div>
              <p className="text-sm text-muted-foreground">
                {canton.overall_health_score?.toFixed(0)}%
              </p>
            </div>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              Noch keine Daten
            </Badge>
          )}
        </div>

        {hasData && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Zufriedenheit:</span>
                <span className="font-medium">{canton.satisfaction_index?.toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Stressfreiheit:</span>
                <span className="font-medium">{canton.stress_index?.toFixed(0)}%</span>
              </div>
            </div>

            <div className="space-y-2">
              {canton.planning_score !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-20">Planung</span>
                  <Progress value={canton.planning_score} className="h-2 flex-1" />
                  <span className="text-xs font-medium w-8">{canton.planning_score.toFixed(0)}%</span>
                </div>
              )}
              {canton.admin_score !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-20">Behörden</span>
                  <Progress value={canton.admin_score} className="h-2 flex-1" />
                  <span className="text-xs font-medium w-8">{canton.admin_score.toFixed(0)}%</span>
                </div>
              )}
              {canton.welcome_score !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-20">Willkommen</span>
                  <Progress value={canton.welcome_score} className="h-2 flex-1" />
                  <span className="text-xs font-medium w-8">{canton.welcome_score.toFixed(0)}%</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                {canton.total_responses} Bewertungen
              </div>
              <TrendBadge trend={canton.trend_vs_last_quarter} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function MoveHealthIndex() {
  const { data: cantons, isLoading, error } = useHealthIndex();

  const topCantons = cantons?.filter(c => c.total_responses >= 3).slice(0, 3) ?? [];
  const totalResponses = cantons?.reduce((sum, c) => sum + c.total_responses, 0) ?? 0;
  const avgScore = cantons?.filter(c => c.overall_health_score !== null)
    .reduce((sum, c, _, arr) => sum + (c.overall_health_score ?? 0) / arr.length, 0) ?? 0;

  return (
    <>
      <Helmet>
        <title>Move Health Index Schweiz | Umzugszufriedenheit nach Kanton | umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Der erste schweizweite Umzugs-Gesundheitsindex. Entdecken Sie Zufriedenheit, Stresslevel und Behördenfreundlichkeit pro Kanton – basierend auf echtem Feedback." 
        />
        <link rel="canonical" href="https://umzugscheck.ch/move-health-index" />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-4">
                <BarChart3 className="w-3 h-3 mr-1" />
                Crowdsourced Data
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Move Health Index Schweiz
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Wie zufrieden sind die Schweizer mit ihren Umzügen? Der erste nationale 
                Index für Umzugsqualität – basierend auf echtem Feedback.
              </p>
            </div>

            {/* Stats Summary */}
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{totalResponses}</p>
                  <p className="text-sm text-muted-foreground">Bewertungen total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{avgScore.toFixed(0)}%</p>
                  <p className="text-sm text-muted-foreground">Durchschnittliche Zufriedenheit</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">26</p>
                  <p className="text-sm text-muted-foreground">Kantone erfasst</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Top Cantons */}
        {topCantons.length > 0 && (
          <section className="py-8 border-b">
            <div className="container max-w-6xl mx-auto px-4">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-semibold">Top 3 Kantone</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {topCantons.map((canton, idx) => (
                  <CantonCard key={canton.canton_code} canton={canton} rank={idx + 1} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Cantons */}
        <section className="py-12">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-xl font-semibold mb-6">Alle Kantone</h2>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : error ? (
              <Card className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                <CardContent className="p-6 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800 dark:text-red-200">
                    Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cantons?.map((canton, idx) => (
                  <CantonCard 
                    key={canton.canton_code} 
                    canton={canton} 
                    rank={idx + 1} 
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-primary/5">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Haben Sie kürzlich gezügelt?</h2>
            <p className="text-muted-foreground mb-6">
              Teilen Sie Ihre Erfahrung und helfen Sie anderen bei der Planung ihres Umzugs.
              Ihre Bewertung ist anonym und dauert nur 2 Minuten.
            </p>
            <a 
              href="/umzugsofferten" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Heart className="w-4 h-4" />
              Jetzt Feedback geben
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
