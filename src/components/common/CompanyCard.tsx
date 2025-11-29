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
    <Card variant="elevated" className={`group overflow-hidden hover:shadow-strong transition-all duration-300 hover:-translate-y-1 ${className}`}>
      {/* Image/Logo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {image ? (
          <img 
            src={image}
            alt={`${name} Umzugsfirma`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/5 to-accent/5">
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
            <div className="px-3 py-1.5 bg-orange-500/95 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-medium">
              Gesponsert
            </div>
          )}
          {verified && (
            <div className="px-3 py-1.5 bg-green-600/95 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-medium">
              <Shield className="h-3 w-3" />
              Geprüft
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        {/* Rating & Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-foreground">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviewCount})</span>
          </div>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${
            priceLevel === "günstig" ? "bg-green-100 text-green-700" :
            priceLevel === "fair" ? "bg-blue-100 text-blue-700" :
            "bg-orange-100 text-orange-700"
          }`}>
            {priceLevel === "günstig" && "€"}
            {priceLevel === "fair" && "€€"}
            {priceLevel === "premium" && "€€€"}
          </span>
        </div>

        {/* Company Name */}
        <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Tagline */}
        {tagline && (
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {tagline}
          </p>
        )}

        {/* Services */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {services.slice(0, 2).map((service, index) => (
              <span 
                key={index}
                className="text-xs px-2.5 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-secondary-foreground font-medium"
              >
                {service}
              </span>
            ))}
            {services.length > 2 && (
              <span className="text-xs px-2.5 py-1 bg-muted border border-border rounded-full text-muted-foreground font-medium">
                +{services.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Regions */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{regions.slice(0, 2).join(", ")}</span>
          {regions.length > 2 && <span className="font-semibold">+{regions.length - 2}</span>}
        </div>

        {/* CTA */}
        <Link to={`/firma/${id}`}>
          <Button className="w-full hover:shadow-medium" variant="default" size="default">
            Offerte anfragen
          </Button>
        </Link>
      </div>
    </Card>
  );
};
