/**
 * Recommended Companies Component
 * 
 * Prompt 2: Vereinfachte Firmenauswahl
 * - 3 empfohlene Firmen statt 5 manuelle Auswahl
 * - Automatisch alle vorausgewählt
 * - Mindestens 1 muss aktiv sein
 */

import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, CheckCircle2, Award, Clock, Users } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Company {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  priceLevel: 'günstig' | 'fair' | 'premium';
  responseTime: string;
  verified: boolean;
  sponsored?: boolean;
}

// Demo companies (based on ZeroFrictionWizard data)
const RECOMMENDED_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'SwissMove AG',
    logo: '🚚',
    rating: 4.9,
    reviewCount: 234,
    priceLevel: 'fair',
    responseTime: '< 2h',
    verified: true,
    sponsored: true,
  },
  {
    id: '2',
    name: 'Züri-Transport GmbH',
    logo: '📦',
    rating: 4.7,
    reviewCount: 189,
    priceLevel: 'günstig',
    responseTime: '< 4h',
    verified: true,
  },
  {
    id: '3',
    name: 'Premium Umzüge',
    logo: '✨',
    rating: 4.8,
    reviewCount: 156,
    priceLevel: 'premium',
    responseTime: '< 1h',
    verified: true,
  },
];

interface RecommendedCompaniesProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  className?: string;
}

export const RecommendedCompanies = memo(function RecommendedCompanies({
  selectedIds,
  onSelectionChange,
  className
}: RecommendedCompaniesProps) {
  // Initialize with all selected
  useEffect(() => {
    if (selectedIds.length === 0) {
      onSelectionChange(RECOMMENDED_COMPANIES.map(c => c.id));
    }
  }, []);

  const toggleCompany = (id: string) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter(i => i !== id)
      : [...selectedIds, id];
    
    // Ensure at least one is selected
    if (newSelection.length === 0) return;
    
    onSelectionChange(newSelection);
  };

  const getPriceLevelColor = (level: Company['priceLevel']) => {
    switch (level) {
      case 'günstig': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'fair': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'premium': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Empfohlene Firmen</h3>
          <p className="text-sm text-muted-foreground">
            Basierend auf Ihrem Umzug ausgewählt
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Users className="w-3 h-3" />
          {selectedIds.length} ausgewählt
        </Badge>
      </div>

      {/* Company Cards */}
      <div className="space-y-3">
        {RECOMMENDED_COMPANIES.map((company, index) => {
          const isSelected = selectedIds.includes(company.id);
          
          return (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => toggleCompany(company.id)}
              className={cn(
                "relative p-4 rounded-xl border-2 cursor-pointer transition-all",
                isSelected 
                  ? "bg-primary/5 border-primary shadow-sm" 
                  : "bg-card border-border hover:border-primary/50"
              )}
            >
              {/* Sponsored Badge */}
              {company.sponsored && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 right-3 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                >
                  Empfohlen
                </Badge>
              )}

              <div className="flex items-center gap-4">
                {/* Checkbox */}
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleCompany(company.id)}
                  className="h-5 w-5"
                  aria-label={`${company.name} auswählen`}
                />

                {/* Logo */}
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                  {company.logo}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground truncate">
                      {company.name}
                    </span>
                    {company.verified && (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {/* Rating */}
                    <span className="flex items-center gap-1 text-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{company.rating}</span>
                      <span className="text-muted-foreground">({company.reviewCount})</span>
                    </span>
                    
                    {/* Price Level */}
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs", getPriceLevelColor(company.priceLevel))}
                    >
                      {company.priceLevel}
                    </Badge>
                    
                    {/* Response Time */}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {company.responseTime}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Minimum Selection Warning */}
      {selectedIds.length === 1 && (
        <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
          Mindestens eine Firma muss ausgewählt sein
        </p>
      )}

      {/* Trust Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg py-2 px-3">
        <Award className="w-3.5 h-3.5 text-green-600" />
        Alle Firmen sind geprüft und versichert
      </div>
    </div>
  );
});
