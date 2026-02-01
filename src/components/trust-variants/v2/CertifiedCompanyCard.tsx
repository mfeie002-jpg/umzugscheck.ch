/**
 * CertifiedCompanyCard - Firmen mit Branchen-Badges
 * V2 Branchen-Fokus: Zertifizierungen prominent auf jeder Karte
 */

import { memo } from "react";
import { Award, Star, MapPin, Phone, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertifiedCompanyCardProps {
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  certifications: string[];
  featured?: boolean;
}

const CERT_COLORS: Record<string, string> = {
  SMA: "bg-blue-600 text-white",
  ASTAG: "bg-orange-500 text-white",
  ISO: "bg-teal-600 text-white",
  FIDI: "bg-indigo-600 text-white",
};

export const CertifiedCompanyCard = memo(({
  name,
  rating,
  reviewCount,
  location,
  certifications,
  featured = false,
}: CertifiedCompanyCardProps) => {
  return (
    <div className={`
      relative bg-card rounded-2xl border overflow-hidden
      ${featured ? "border-primary shadow-lg" : "border-border"}
    `}>
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-xs font-semibold py-1 px-3 text-center">
          SMA-Empfehlung
        </div>
      )}

      <div className={`p-5 ${featured ? "pt-8" : ""}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg text-foreground">{name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              {location}
            </div>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-bold text-foreground">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap gap-2 mb-4">
          {certifications.map((cert) => (
            <span
              key={cert}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${CERT_COLORS[cert] || "bg-muted text-muted-foreground"}`}
            >
              <Award className="w-3 h-3" />
              {cert}
            </span>
          ))}
        </div>

        {/* Quality Guarantee */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 bg-muted/50 rounded-lg p-2">
          <Shield className="w-4 h-4 text-primary" />
          <span>Branchenverband-geprüfte Qualität</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Phone className="w-4 h-4 mr-1" />
            Anrufen
          </Button>
          <Button size="sm" className="flex-1">
            Offerte
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
});

CertifiedCompanyCard.displayName = "CertifiedCompanyCard";
