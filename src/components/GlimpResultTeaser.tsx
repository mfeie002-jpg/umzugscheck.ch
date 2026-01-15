/**
 * Glimp-Methode Result Teaser Component
 * Shows blurred preview of companies before contact, increases conversion
 */

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Star, MapPin, Shield, Lock, ArrowRight, 
  CheckCircle2, Sparkles, Eye, Users 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlimpCompany {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  matchScore: number;
  priceLevel: string;
  verified: boolean;
}

interface GlimpResultTeaserProps {
  companies: GlimpCompany[];
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  onRevealClick: () => void;
  className?: string;
}

export const GlimpResultTeaser = ({
  companies,
  estimatedPriceMin,
  estimatedPriceMax,
  onRevealClick,
  className,
}: GlimpResultTeaserProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const topCompanies = companies.slice(0, 3);
  const averageRating = companies.reduce((acc, c) => acc + c.rating, 0) / companies.length;
  const totalReviews = companies.reduce((acc, c) => acc + c.reviewCount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("relative", className)}
    >
      <Card className="overflow-hidden border-2 border-primary/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 sm:p-6 border-b border-border">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">
                  {companies.length} Matches gefunden!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Basierend auf Ihren Anforderungen
                </p>
              </div>
            </div>
            
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Alle verifiziert
            </Badge>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-2 bg-background/50 rounded-lg">
              <div className="font-bold text-primary">
                CHF {estimatedPriceMin.toLocaleString('de-CH')} - {estimatedPriceMax.toLocaleString('de-CH')}
              </div>
              <div className="text-xs text-muted-foreground">Preisrahmen</div>
            </div>
            <div className="text-center p-2 bg-background/50 rounded-lg">
              <div className="font-bold text-primary flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {averageRating.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Ø Bewertung</div>
            </div>
            <div className="text-center p-2 bg-background/50 rounded-lg">
              <div className="font-bold text-primary">{totalReviews}+</div>
              <div className="text-xs text-muted-foreground">Bewertungen</div>
            </div>
          </div>
        </div>

        {/* Blurred Companies Preview */}
        <div 
          className="relative p-4 sm:p-6"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Company Cards - Blurred */}
          <div className="space-y-3">
            {topCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border">
                  {/* Rank Badge */}
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary text-sm">
                    {index + 1}
                  </div>
                  
                  {/* Company Info - Partially Blurred */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground blur-[3px] select-none">
                        {company.name.slice(0, 8)}***
                      </span>
                      {company.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Verifiziert
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{company.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({company.reviewCount})</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {company.priceLevel}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Match Score */}
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">
                      {company.matchScore}% Match
                    </div>
                    <Progress value={company.matchScore} className="h-1.5 w-16" />
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* More companies indicator */}
            {companies.length > 3 && (
              <div className="text-center py-2 text-sm text-muted-foreground">
                + {companies.length - 3} weitere passende Firmen
              </div>
            )}
          </div>

          {/* Overlay with CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering ? 1 : 0.95 }}
            className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent flex flex-col items-center justify-end p-6"
          >
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">
                  Firmennamen & Kontaktdaten geschützt
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Geben Sie Ihre Kontaktdaten ein, um alle {companies.length} passenden Firmen zu sehen
                und kostenlose Offerten zu erhalten.
              </p>
            </div>
            
            <Button 
              size="lg" 
              onClick={onRevealClick}
              className="w-full max-w-sm bg-primary hover:bg-primary/90 shadow-lg group"
            >
              <Eye className="h-4 w-4 mr-2" />
              Firmen ansehen & Offerten erhalten
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                100% kostenlos
              </span>
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-blue-500" />
                Datenschutz garantiert
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3 text-purple-500" />
                50'000+ Anfragen
              </span>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default GlimpResultTeaser;
