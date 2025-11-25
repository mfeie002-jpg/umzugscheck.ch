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
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-lg">
          {rank}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              {logo ? (
                <img src={logo} alt={name} className="w-12 h-12 object-contain rounded" />
              ) : (
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                  <Award className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {name}
                  {verified && (
                    <Badge variant="secondary" className="text-xs">
                      Verifiziert
                    </Badge>
                  )}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-semibold text-sm">{rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({reviewCount})</span>
                  {priceLevel && (
                    <Badge variant="outline" className="text-xs ml-2">
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

          <Link to={`/firmen/${id}`}>
            <Button variant="outline" size="sm">
              Firma ansehen
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
