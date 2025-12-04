import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { trackProfileView } from "@/lib/monetization-events";

interface SponsoredCompanyCardProps {
  id: string;
  name: string;
  logo?: string;
  rating: number;
  reviewCount: number;
  regions: string[];
  description: string;
  specialOffer?: string;
  priceLevel?: string;
}

export const SponsoredCompanyCard = ({
  id,
  name,
  logo,
  rating,
  reviewCount,
  regions,
  description,
  specialOffer,
  priceLevel,
}: SponsoredCompanyCardProps) => {
  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow border-2 border-primary/20 bg-primary/5">
      <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {logo ? (
            <img src={logo} alt={name} loading="lazy" className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-lg flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="mb-2 bg-primary text-primary-foreground">
              Gesponsert
            </Badge>
            <h3 className="font-bold text-lg sm:text-xl truncate">{name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-semibold">{rating.toFixed(1)}</span>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">({reviewCount} Bewertungen)</span>
            </div>
          </div>
        </div>
        {priceLevel && (
          <Badge variant="outline" className="text-sm self-start sm:self-auto">
            {priceLevel}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span>{regions.join(", ")}</span>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      {specialOffer && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
          <p className="text-sm font-semibold text-green-700 dark:text-green-300">
            🎉 {specialOffer}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
        <Link to={`/umzugsfirmen/${id}`} className="w-full">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full h-12 sm:h-auto"
            onClick={() => trackProfileView(id)}
          >
            Firma ansehen
          </Button>
        </Link>
        <Link to="/rechner" className="w-full">
          <Button size="lg" className="w-full h-12 sm:h-auto">
            Offerte anfordern
          </Button>
        </Link>
      </div>
    </Card>
  );
};
