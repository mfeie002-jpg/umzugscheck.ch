import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface CompanyCardProps {
  id: string;
  name: string;
  logo?: string;
  image?: string;
  rating: number;
  reviewCount: number;
  priceLevel: "günstig" | "fair" | "premium";
  services: string[];
  regions: string[];
  verified?: boolean;
  sponsored?: boolean;
  tagline?: string;
  className?: string;
}

/**
 * Standardized Company Card Component
 * Airbnb-style design for moving companies
 */
export const CompanyCard = ({
  id,
  name,
  logo,
  image,
  rating,
  reviewCount,
  priceLevel,
  services,
  regions,
  verified = false,
  sponsored = false,
  tagline,
  className = ""
}: CompanyCardProps) => {
  const priceLevelColors = {
    günstig: "text-success",
    fair: "text-info",
    premium: "text-warning"
  };

  return (
    <Card className={`group overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 ${className}`}>
      {/* Image/Logo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {image ? (
          <img 
            src={image}
            alt={`${name} Umzugsfirma`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {logo ? (
              <img src={logo} alt={name} className="max-w-[60%] max-h-[60%] object-contain" />
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">{name}</span>
            )}
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {sponsored && (
            <div className="px-2 py-1 bg-warning/90 backdrop-blur-sm text-white text-xs font-semibold rounded">
              Gesponsert
            </div>
          )}
          {verified && (
            <div className="px-2 py-1 bg-success/90 backdrop-blur-sm text-white text-xs font-semibold rounded flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Geprüft
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Rating & Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviewCount})</span>
          </div>
          <span className={`text-sm font-semibold ${priceLevelColors[priceLevel]}`}>
            {priceLevel === "günstig" && "€"}
            {priceLevel === "fair" && "€€"}
            {priceLevel === "premium" && "€€€"}
          </span>
        </div>

        {/* Company Name */}
        <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Tagline */}
        {tagline && (
          <p className="text-sm text-muted-foreground mb-4">
            {tagline}
          </p>
        )}

        {/* Services */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {services.slice(0, 3).map((service, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 bg-secondary rounded-full text-secondary-foreground"
              >
                {service}
              </span>
            ))}
            {services.length > 3 && (
              <span className="text-xs px-2 py-1 bg-secondary rounded-full text-secondary-foreground">
                +{services.length - 3} mehr
              </span>
            )}
          </div>
        </div>

        {/* Regions */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4" />
          <span>{regions.slice(0, 2).join(", ")}</span>
          {regions.length > 2 && <span>+{regions.length - 2}</span>}
        </div>

        {/* CTA */}
        <Link to={`/firma/${id}`}>
          <Button className="w-full" variant="default">
            Offerte anfragen
          </Button>
        </Link>
      </div>
    </Card>
  );
};
