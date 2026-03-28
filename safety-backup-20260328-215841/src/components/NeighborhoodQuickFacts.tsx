import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Train, 
  Wallet, 
  Home, 
  TreePine, 
  Baby, 
  Briefcase,
  Clock,
  TrendingUp,
  MapPin
} from "lucide-react";
import { useNeighborhoodByCity } from "@/hooks/useNeighborhoods";
import { Skeleton } from "@/components/ui/skeleton";

interface NeighborhoodQuickFactsProps {
  cityName: string;
  cantonCode?: string;
}

export const NeighborhoodQuickFacts = memo(function NeighborhoodQuickFacts({
  cityName,
  cantonCode = "ZG"
}: NeighborhoodQuickFactsProps) {
  const { data: neighborhood, isLoading, error } = useNeighborhoodByCity(cityName, cantonCode);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !neighborhood) {
    return null;
  }

  const formatCurrency = (value: number | null) => {
    if (!value) return "–";
    return `CHF ${value.toLocaleString("de-CH")}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {neighborhood.city_name}
          </CardTitle>
          <Badge variant="secondary">{cantonCode}</Badge>
        </div>
        {neighborhood.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {neighborhood.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {/* Highlights */}
        {neighborhood.highlights && neighborhood.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {neighborhood.highlights.map((highlight, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {highlight}
              </Badge>
            ))}
          </div>
        )}

        {/* Lifestyle Scores */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Lifestyle Scores
          </h4>
          
          <div className="grid gap-3">
            <ScoreBar 
              icon={<Baby className="h-4 w-4" />}
              label="Familienfreundlich"
              score={neighborhood.family_score}
            />
            <ScoreBar 
              icon={<Briefcase className="h-4 w-4" />}
              label="Expat-freundlich"
              score={neighborhood.expat_score}
            />
            <ScoreBar 
              icon={<Train className="h-4 w-4" />}
              label="Pendler-Eignung"
              score={neighborhood.commuter_score}
            />
            <ScoreBar 
              icon={<TreePine className="h-4 w-4" />}
              label="Natur & Ruhe"
              score={neighborhood.nature_score}
            />
          </div>
        </div>

        {/* Financial Data */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Kosten & Steuern
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <DataCard 
              icon={<Wallet className="h-4 w-4 text-emerald-600" />}
              label="Steuersatz Familie"
              value={neighborhood.tax_rate_family ? `${neighborhood.tax_rate_family}%` : "–"}
              highlight
            />
            <DataCard 
              icon={<Home className="h-4 w-4 text-primary" />}
              label="Miete 3-Zi."
              value={formatCurrency(neighborhood.avg_rent_3room)}
            />
            <DataCard 
              icon={<Home className="h-4 w-4 text-primary" />}
              label="Miete 4-Zi."
              value={formatCurrency(neighborhood.avg_rent_4room)}
            />
            <DataCard 
              icon={<TrendingUp className="h-4 w-4 text-amber-600" />}
              label="Preis/m²"
              value={formatCurrency(neighborhood.property_price_sqm)}
            />
          </div>
        </div>

        {/* Demographics & Infrastructure */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Anbindung & Demografie
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <DataCard 
              icon={<Clock className="h-4 w-4 text-primary" />}
              label="Zürich HB"
              value={neighborhood.zurich_commute_minutes ? `${neighborhood.zurich_commute_minutes} Min.` : "–"}
            />
            <DataCard 
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              label="Einwohner"
              value={neighborhood.population?.toLocaleString("de-CH") || "–"}
            />
            <DataCard 
              icon={<Train className="h-4 w-4 text-muted-foreground" />}
              label="Bahnhof"
              value={neighborhood.train_station_distance_km ? `${neighborhood.train_station_distance_km} km` : "–"}
            />
            <DataCard 
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              label="Ø Alter"
              value={neighborhood.avg_age ? `${neighborhood.avg_age} Jahre` : "–"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Score bar component
function ScoreBar({ 
  icon, 
  label, 
  score 
}: { 
  icon: React.ReactNode; 
  label: string; 
  score: number | null;
}) {
  const value = score || 50;
  
  return (
    <div className="flex items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span className="font-medium">{value}/100</span>
        </div>
        <Progress value={value} className="h-2" />
      </div>
    </div>
  );
}

// Data card component
function DataCard({
  icon,
  label,
  value,
  highlight = false
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-3 rounded-lg ${highlight ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-muted/50'}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`font-semibold ${highlight ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>
        {value}
      </p>
    </div>
  );
}
