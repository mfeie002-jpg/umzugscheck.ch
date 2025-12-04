import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Users, TrendingUp, Home, Building, Car } from "lucide-react";

interface NeighborhoodData {
  name: string;
  movingActivity: number;
  avgPrice: number;
  popularServices: string[];
  demographics: {
    families: number;
    singles: number;
    seniors: number;
  };
}

interface NeighborhoodInsightsProps {
  canton: string;
  data?: NeighborhoodData;
}

const DEFAULT_DATA: NeighborhoodData = {
  name: "Zürich",
  movingActivity: 78,
  avgPrice: 1250,
  popularServices: ["Privatumzug", "Reinigung", "Entsorgung"],
  demographics: {
    families: 35,
    singles: 45,
    seniors: 20,
  },
};

export const NeighborhoodInsights = ({ 
  canton, 
  data = DEFAULT_DATA 
}: NeighborhoodInsightsProps) => {
  const getActivityColor = (activity: number) => {
    if (activity >= 70) return "text-red-500";
    if (activity >= 40) return "text-amber-500";
    return "text-green-500";
  };

  const getActivityLabel = (activity: number) => {
    if (activity >= 70) return "Hohe Nachfrage";
    if (activity >= 40) return "Mittlere Nachfrage";
    return "Geringe Nachfrage";
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Regionale Einblicke: {canton || data.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Moving Activity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Umzugsaktivität</span>
            <Badge variant="outline" className={getActivityColor(data.movingActivity)}>
              {getActivityLabel(data.movingActivity)}
            </Badge>
          </div>
          <Progress value={data.movingActivity} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {data.movingActivity}% höher als der Schweizer Durchschnitt
          </p>
        </div>

        {/* Average Price */}
        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Durchschnittspreis</span>
          </div>
          <p className="text-2xl font-bold text-primary">
            CHF {data.avgPrice.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">für einen 3-Zimmer-Umzug</p>
        </div>

        {/* Popular Services */}
        <div>
          <p className="text-sm font-medium mb-2">Beliebte Services</p>
          <div className="flex flex-wrap gap-2">
            {data.popularServices.map((service) => (
              <Badge key={service} variant="secondary">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        {/* Demographics */}
        <div>
          <p className="text-sm font-medium mb-3">Wer zieht um?</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Home className="h-4 w-4 text-blue-500" />
              <span className="text-sm flex-1">Familien</span>
              <Progress value={data.demographics.families} className="w-24 h-2" />
              <span className="text-sm text-muted-foreground w-10">
                {data.demographics.families}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm flex-1">Singles</span>
              <Progress value={data.demographics.singles} className="w-24 h-2" />
              <span className="text-sm text-muted-foreground w-10">
                {data.demographics.singles}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-green-500" />
              <span className="text-sm flex-1">Senioren</span>
              <Progress value={data.demographics.seniors} className="w-24 h-2" />
              <span className="text-sm text-muted-foreground w-10">
                {data.demographics.seniors}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NeighborhoodInsights;
