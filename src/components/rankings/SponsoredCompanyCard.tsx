import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Award } from "lucide-react";
import { Link } from "react-router-dom";

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
    <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-primary/20 bg-primary/5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {logo ? (
            <img src={logo} alt={name} className="w-16 h-16 object-contain rounded-lg" />
          ) : (
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <Award className="w-8 h-8 text-primary" />
            </div>
          )}
          <div>
            <Badge variant="secondary" className="mb-2 bg-primary text-primary-foreground">
              Gesponsert
            </Badge>
            <h3 className="font-bold text-xl">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-semibold">{rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">({reviewCount} Bewertungen)</span>
            </div>
          </div>
        </div>
        {priceLevel && (
          <Badge variant="outline" className="text-sm">
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

      <Link to={`/firmen/${id}`}>
        <Button className="w-full" size="lg">
          Firma ansehen
        </Button>
      </Link>
    </Card>
  );
};
