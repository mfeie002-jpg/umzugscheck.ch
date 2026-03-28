import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, MapPin, Star, Clock, Shield } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MatchFactor {
  name: string;
  score: number;
  icon: React.ReactNode;
  description: string;
}

interface CompanyMatchScoreProps {
  companyId: string;
  companyName: string;
  userCanton?: string;
  userServices?: string[];
  companyServices?: string[];
  companyAreas?: string[];
  companyRating?: number;
  companyResponseTime?: string;
  isVerified?: boolean;
}

const CompanyMatchScore = ({
  companyId,
  companyName,
  userCanton = "Zürich",
  userServices = ["Umzug"],
  companyServices = ["Umzug", "Reinigung"],
  companyAreas = ["Zürich", "Aargau"],
  companyRating = 4.7,
  companyResponseTime = "< 2 Std.",
  isVerified = true,
}: CompanyMatchScoreProps) => {
  // Calculate match factors
  const calculateFactors = (): MatchFactor[] => {
    const factors: MatchFactor[] = [];

    // Location match
    const locationMatch = companyAreas.includes(userCanton);
    factors.push({
      name: "Standort",
      score: locationMatch ? 100 : 60,
      icon: <MapPin className="w-3 h-3" />,
      description: locationMatch 
        ? `Aktiv in ${userCanton}` 
        : `Nächste Region: ${companyAreas[0]}`,
    });

    // Service match
    const matchingServices = userServices.filter(s => 
      companyServices.some(cs => cs.toLowerCase().includes(s.toLowerCase()))
    );
    const serviceScore = (matchingServices.length / userServices.length) * 100;
    factors.push({
      name: "Services",
      score: serviceScore,
      icon: <CheckCircle2 className="w-3 h-3" />,
      description: `${matchingServices.length}/${userServices.length} Services verfügbar`,
    });

    // Rating
    const ratingScore = (companyRating / 5) * 100;
    factors.push({
      name: "Bewertung",
      score: ratingScore,
      icon: <Star className="w-3 h-3" />,
      description: `${companyRating}/5 Sterne`,
    });

    // Response time
    const responseScore = companyResponseTime.includes("2") ? 95 : 
                         companyResponseTime.includes("24") ? 70 : 85;
    factors.push({
      name: "Reaktionszeit",
      score: responseScore,
      icon: <Clock className="w-3 h-3" />,
      description: companyResponseTime,
    });

    // Verification
    factors.push({
      name: "Verifiziert",
      score: isVerified ? 100 : 50,
      icon: <Shield className="w-3 h-3" />,
      description: isVerified ? "Geprüft & versichert" : "Nicht verifiziert",
    });

    return factors;
  };

  const factors = calculateFactors();
  const overallScore = Math.round(factors.reduce((acc, f) => acc + f.score, 0) / factors.length);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Perfekte Übereinstimmung";
    if (score >= 80) return "Sehr gute Übereinstimmung";
    if (score >= 70) return "Gute Übereinstimmung";
    return "Mäßige Übereinstimmung";
  };

  return (
    <Card className="border bg-gradient-to-br from-white to-primary/5">
      <CardContent className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">KI-Match-Score</span>
          </div>
          <Badge 
            variant="secondary" 
            className={`${getScoreColor(overallScore)} bg-transparent border`}
          >
            {overallScore}%
          </Badge>
        </div>

        {/* Overall Progress */}
        <div className="space-y-1">
          <Progress value={overallScore} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {getScoreLabel(overallScore)}
          </p>
        </div>

        {/* Factors */}
        <TooltipProvider>
          <div className="grid grid-cols-5 gap-1">
            {factors.map(factor => (
              <Tooltip key={factor.name}>
                <TooltipTrigger asChild>
                  <div 
                    className={`flex flex-col items-center p-1.5 rounded cursor-help transition-colors
                      ${factor.score >= 80 ? "bg-green-50" : factor.score >= 60 ? "bg-amber-50" : "bg-red-50"}`}
                  >
                    <div className={`
                      ${factor.score >= 80 ? "text-green-600" : factor.score >= 60 ? "text-amber-600" : "text-red-600"}
                    `}>
                      {factor.icon}
                    </div>
                    <span className="text-[10px] mt-0.5 text-muted-foreground truncate w-full text-center">
                      {factor.name}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{factor.name}: {factor.score}%</p>
                  <p className="text-xs">{factor.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default CompanyMatchScore;
