import { Card } from "@/components/ui/card";
import { Home, TrendingUp, DollarSign, Clock, Package, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PriceExample {
  size: string;
  distance: string;
  priceRange: string;
  icon?: "home" | "trending" | "dollar";
  duration?: string;
  volume?: string;
  included?: string[];
  imageUrl?: string;
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
 * Premium Price Example Block with Rich Content
 * Shows detailed moving costs with images, duration, volume and included services
 */
export const PriceExampleBlock = ({ 
  title, 
  subtitle,
  examples,
  cityName 
}: PriceExampleBlockProps) => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background via-secondary/10 to-background">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {examples.map((example, index) => {
            const IconComponent = icons[example.icon || 'home'];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group h-full">
                  {/* Image Section */}
                  {example.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={example.imageUrl} 
                        alt={example.size}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-foreground group-hover:text-primary transition-colors">
                      {example.size}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {example.distance}
                      {cityName && ` in ${cityName}`}
                    </p>
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-border">
                      <span className="text-sm text-muted-foreground">ab</span>
                      <span className="text-3xl font-bold text-primary">
                        {example.priceRange}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-4">
                      {example.duration && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>Dauer: {example.duration}</span>
                        </div>
                      )}
                      {example.volume && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Package className="h-4 w-4 text-primary" />
                          <span>Volumen: {example.volume}</span>
                        </div>
                      )}
                    </div>

                    {/* Included Services */}
                    {example.included && example.included.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <p className="text-sm font-semibold text-foreground">Inkludiert:</p>
                        <ul className="space-y-1">
                          {example.included.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* CTA */}
                    <Link to="/rechner">
                      <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                        Jetzt berechnen
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            * Alle Preise sind Richtwerte und können je nach Umfang, Distanz und Zusatzservices variieren
          </p>
          <Link to="/preise">
            <Button variant="outline" size="lg">
              Detaillierte Preisübersicht ansehen
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
