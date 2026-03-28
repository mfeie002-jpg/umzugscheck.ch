import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingDown } from "lucide-react";

interface RegionCardProps {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  averageCost: string;
  savings: string;
}

export const RegionCard = ({ name, slug, description, imageUrl, averageCost, savings }: RegionCardProps) => {
  return (
    <Link to={slug} className="no-underline group">
      <Card className="overflow-hidden hover:shadow-strong transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={`Umzug in ${name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold">
            {name}
          </h3>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-muted-foreground text-sm mb-4 flex-1">
            {description}
          </p>

          {/* Pricing Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Durchschnitt:</span>
              <span className="font-semibold text-foreground">{averageCost}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Sparpotenzial:</span>
              <span className="font-semibold text-green-600 flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                {savings}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-primary font-medium group-hover:underline">
              Firmen ansehen
            </span>
            <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Card>
    </Link>
  );
};
