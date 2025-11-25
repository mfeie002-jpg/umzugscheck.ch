import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, TrendingDown, Award } from "lucide-react";
import { Link } from "react-router-dom";

interface OrganicCompanyCardProps {
  id: string;
  rank: number;
  name: string;
  logo?: string;
  rating: number;
  reviewCount: number;
  regions: string[];
  description: string;
  priceLevel?: string;
  savingsPercentage?: number;
  verified?: boolean;
}

export const OrganicCompanyCard = ({
  id,
  rank,
  name,
  logo,
  rating,
  reviewCount,
  regions,
  description,
  priceLevel,
  savingsPercentage,
  verified,
}: OrganicCompanyCardProps) => {
  return (
    <Card className="p-4 sm:p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-base sm:text-lg">
          {rank}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
              {logo ? (
                <img src={logo} alt={name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-lg flex items-center gap-2 flex-wrap">
                  <span className="truncate">{name}</span>
                  {verified && (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      Verifiziert
                    </Badge>
                  )}
                </h3>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-semibold text-sm">{rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({reviewCount})</span>
                  {priceLevel && (
                    <Badge variant="outline" className="text-xs">
                      {priceLevel}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs">{regions.slice(0, 3).join(", ")}</span>
          </div>

          {savingsPercentage && savingsPercentage > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                <TrendingDown className="w-3 h-3 mr-1" />
                {savingsPercentage}% günstiger als Durchschnitt
              </Badge>
            </div>
          )}

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>

          <div className="flex gap-2">
            <Link to={`/umzugsfirmen/${id}`}>
              <Button variant="outline" size="sm">
                Profil ansehen
              </Button>
            </Link>
            <Link to="/rechner">
              <Button size="sm">
                Offerte
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
