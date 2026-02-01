/**
 * Company Cards V1 - Mit SMA/ASTAG PLUS Badges
 * P1 Improvement #8 from Analysis
 * 
 * Die SMA (Swiss Movers Association) ist THE Qualitätszertifikat.
 * Firmen die es haben = sofort mehr Trust.
 */
import { memo, useState } from 'react';
import { Star, Phone, ArrowRight, Shield, Award, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CompanyCardV1Props {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  priceFrom: string;
  badges: string[];
  isSMACertified?: boolean;
  isASTAGPlus?: boolean;
  responseTime?: string;
  isSponsored?: boolean;
}

const companies: CompanyCardV1Props[] = [
  {
    id: '1',
    name: 'Swiss Premium Movers',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80',
    rating: 4.9,
    reviewCount: 234,
    priceFrom: 'CHF 850',
    badges: ['Top bewertet'],
    isSMACertified: true,
    isASTAGPlus: true,
    responseTime: '< 2h',
  },
  {
    id: '2',
    name: 'Zürich Umzug Express',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80',
    rating: 4.8,
    reviewCount: 189,
    priceFrom: 'CHF 750',
    badges: ['Express verfügbar'],
    isSMACertified: true,
    responseTime: '< 4h',
  },
  {
    id: '3',
    name: 'Alpen Transport AG',
    image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400&q=80',
    rating: 4.7,
    reviewCount: 156,
    priceFrom: 'CHF 900',
    badges: ['Versichert'],
    isSMACertified: true,
    isASTAGPlus: true,
    responseTime: '< 6h',
  },
];

const CertificationBadge = memo(function CertificationBadge({ 
  type 
}: { 
  type: 'SMA' | 'ASTAG' 
}) {
  const config = {
    SMA: {
      label: 'SMA',
      tooltip: 'Swiss Movers Association – Unabhängig geprüftes Qualitätszertifikat für Schweizer Umzugsfirmen',
      color: 'bg-blue-600 text-white',
      icon: Shield,
    },
    ASTAG: {
      label: 'ASTAG+',
      tooltip: 'ASTAG PLUS Zertifizierung – Regelmässige Qualitätsprüfung seit 2013',
      color: 'bg-green-600 text-white',
      icon: Award,
    },
  };

  const { label, tooltip, color, icon: Icon } = config[type];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${color} cursor-help`}>
            <Icon className="w-3 h-3" />
            {label}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

const CompanyCardV1 = memo(function CompanyCardV1({
  id,
  name,
  image,
  rating,
  reviewCount,
  priceFrom,
  badges,
  isSMACertified,
  isASTAGPlus,
  responseTime,
  isSponsored,
}: CompanyCardV1Props) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all group">
      {/* Sponsored Label */}
      {isSponsored && (
        <div className="bg-muted px-3 py-1 text-xs text-muted-foreground flex items-center justify-between">
          <span>Gesponsert</span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Certification Badges - Top Right */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {isSMACertified && <CertificationBadge type="SMA" />}
          {isASTAGPlus && <CertificationBadge type="ASTAG" />}
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5">
          <div className="text-xs text-muted-foreground">Ab</div>
          <div className="text-lg font-bold text-foreground">{priceFrom}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name & Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg">{name}</h3>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-sm">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        </div>

        {/* Response Time */}
        {responseTime && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Antwortet in {responseTime}</span>
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {badges.map((badge, i) => (
            <span 
              key={i}
              className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link to="/umzugsofferten">
          <Button className="w-full h-11 font-semibold">
            Offerte anfragen
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
});

export const CompanyCardsV1 = memo(function CompanyCardsV1() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top Umzugsfirmen
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            SMA-zertifizierte Partner mit echten Bewertungen
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {companies.map((company) => (
            <CompanyCardV1 key={company.id} {...company} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link to="/firmen">
            <Button variant="outline" size="lg" className="h-12 px-8">
              Alle 200+ Firmen ansehen
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
});
