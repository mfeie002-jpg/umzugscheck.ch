import { Card } from "@/components/ui/card";
import { Home, TrendingUp, DollarSign } from "lucide-react";

interface PriceExample {
  size: string;
  distance: string;
  priceRange: string;
  icon?: "home" | "trending" | "dollar";
}

interface PriceExampleBlockProps {
  title: string;
  subtitle?: string;
  examples: PriceExample[];
  cityName?: string;
}

const icons = {
  home: Home,
  trending: TrendingUp,
  dollar: DollarSign
};

/**
 * Standardized Price Example Block
 * Shows typical moving costs for different scenarios
 */
export const PriceExampleBlock = ({ 
  title, 
  subtitle,
  examples,
  cityName 
}: PriceExampleBlockProps) => {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {examples.map((example, index) => {
            const IconComponent = icons[example.icon || 'home'];
            
            return (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 text-foreground">
                      {example.size}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {example.distance}
                      {cityName && ` in ${cityName}`}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-muted-foreground">ab</span>
                      <span className="text-2xl font-bold text-primary">
                        {example.priceRange}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            * Alle Preise sind Richtwerte und können je nach Umfang variieren
          </p>
        </div>
      </div>
    </section>
  );
};
