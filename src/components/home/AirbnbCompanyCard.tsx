import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useFlowPath } from "@/hooks/useUnifiedAB";

interface AirbnbCompanyCardProps {
  id: string;
  name: string;
  logo?: string;
  image?: string;
  rating: number;
  reviewCount: number;
  priceFrom: string;
  badges: string[];
  delay?: number;
}

export const AirbnbCompanyCard = ({
  id,
  name,
  logo,
  image,
  rating,
  reviewCount,
  priceFrom,
  badges,
  delay = 0,
}: AirbnbCompanyCardProps) => {
  const flowPath = useFlowPath();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Card className="overflow-hidden hover:shadow-strong transition-all duration-300 h-full group">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
          {image ? (
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">
              {logo || "🏢"}
            </div>
          )}
          
          {/* Badges overlay */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {badges.slice(0, 2).map((badge, idx) => (
              <Badge 
                key={idx}
                className="bg-white/95 text-foreground shadow-md text-xs font-semibold backdrop-blur-sm"
              >
                {badge}
              </Badge>
            ))}
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Company name */}
          <h3 className="text-xl font-bold text-foreground line-clamp-1">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold text-foreground">{rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviewCount} Bewertungen)
            </span>
          </div>

          {/* Price */}
          <div className="py-3 border-t border-border">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground">Ab</span>
              <span className="text-2xl font-bold text-accent">{priceFrom}</span>
            </div>
          </div>

          {/* CTA */}
          <Link to={flowPath}>
            <Button className="w-full h-12 text-base font-bold group-hover:shadow-accent transition-shadow">
              Offerte anfragen
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};
