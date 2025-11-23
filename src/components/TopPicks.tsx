import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, DollarSign, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Mover {
  id: string;
  name: string;
  logo: string;
  rating: number;
  review_count: number;
  price_level: string;
  verified: boolean;
  highlight?: string;
}

interface TopPicksProps {
  title?: string;
  limit?: number;
}

export const TopPicks = ({ title = "Top-Empfehlungen für Sie", limit = 5 }: TopPicksProps) => {
  const [movers, setMovers] = useState<Mover[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopMovers = async () => {
      try {
        const { data, error } = await supabase
          .from("companies")
          .select("id, name, logo, rating, review_count, price_level, verified")
          .eq("verified", true)
          .order("rating", { ascending: false })
          .order("review_count", { ascending: false })
          .limit(limit);

        if (error) throw error;

        // Add highlights based on characteristics
        const moversWithHighlights = (data || []).map((mover, index) => {
          let highlight = "";
          if (index === 0) highlight = "Bestbewertet";
          else if (mover.price_level === "$") highlight = "Preissieger";
          else if (mover.price_level === "$$$") highlight = "Premium-Service";
          else if (mover.review_count > 100) highlight = "Beliebt";
          else highlight = "Schnelle Verfügbarkeit";

          return { ...mover, highlight };
        });

        setMovers(moversWithHighlights);
      } catch (error) {
        console.error("Error fetching top movers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMovers();
  }, [limit]);

  if (loading) {
    return (
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-accent" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-secondary/20 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getHighlightIcon = (highlight: string) => {
    if (highlight.includes("Preis")) return <DollarSign className="w-4 h-4" />;
    if (highlight.includes("Schnelle")) return <Clock className="w-4 h-4" />;
    return <TrendingUp className="w-4 h-4" />;
  };

  const getHighlightColor = (highlight: string) => {
    if (highlight.includes("Preis")) return "bg-success/10 text-success border-success/20";
    if (highlight.includes("Premium")) return "bg-accent/10 text-accent border-accent/20";
    if (highlight.includes("Schnelle")) return "bg-info/10 text-info border-info/20";
    return "bg-primary/10 text-primary border-primary/20";
  };

  return (
    <Card className="shadow-medium border-primary/10">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-accent" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Basierend auf Bewertungen, Preisen und Verfügbarkeit
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {movers.map((mover, index) => (
            <div
              key={mover.id}
              className="group flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/40 hover:shadow-soft transition-all cursor-pointer bg-background"
            >
              <div className="flex items-center gap-1 text-muted-foreground font-bold text-lg min-w-[2rem]">
                #{index + 1}
              </div>

              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-light to-primary/5 flex items-center justify-center text-2xl flex-shrink-0">
                {mover.logo}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold truncate">{mover.name}</h4>
                  {mover.verified && (
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-semibold">{mover.rating}</span>
                    <span className="text-muted-foreground">({mover.review_count})</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-semibold text-primary">{mover.price_level}</span>
                </div>

                {mover.highlight && (
                  <Badge
                    className={`mt-2 text-xs ${getHighlightColor(mover.highlight)}`}
                    variant="outline"
                  >
                    {getHighlightIcon(mover.highlight)}
                    <span className="ml-1">{mover.highlight}</span>
                  </Badge>
                )}
              </div>

              <Link to={`/firmen/${mover.id}`} className="flex-shrink-0">
                <Button
                  size="sm"
                  className="group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
                >
                  Ansehen
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <Link to="/firmen" className="block">
            <Button variant="outline" className="w-full group">
              Alle Umzugsfirmen vergleichen
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
