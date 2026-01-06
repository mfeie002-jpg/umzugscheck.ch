/**
 * ReviewReceipt Component - UX Compliance Checklist:
 * ✅ Clear summary of all user inputs
 * ✅ Edit links for each section
 * ✅ Visual hierarchy with proper spacing
 * ✅ Price display if available
 * ✅ Mobile-friendly layout
 */

import React, { memo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Check, MapPin, Calendar, Home, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReviewItem {
  /** Label for the item */
  label: string;
  /** Value to display */
  value: string | ReactNode;
  /** Icon for the item */
  icon?: ReactNode;
  /** Step to edit when clicking edit */
  editStep?: number;
}

export interface ReviewReceiptProps {
  /** Title of the receipt */
  title?: string;
  /** Items to display */
  items: ReviewItem[];
  /** Edit handler - receives the step number to edit */
  onEdit?: (step: number) => void;
  /** Price range to display */
  priceRange?: { min: number; max: number };
  /** Additional content below items */
  footer?: ReactNode;
  /** Custom className */
  className?: string;
  /** Variant style */
  variant?: 'default' | 'highlighted';
}

export const ReviewReceipt = memo(function ReviewReceipt({
  title = 'Ihre Angaben',
  items,
  onEdit,
  priceRange,
  footer,
  className,
  variant = 'default',
}: ReviewReceiptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className={cn(
        "overflow-hidden",
        variant === 'highlighted' && "border-primary/30 bg-primary/5"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Check className="h-5 w-5 text-success" />
              {title}
            </CardTitle>
            {onEdit && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(1)}
                className="gap-1.5 text-primary hover:text-primary/80"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Bearbeiten
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((item, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg bg-muted/50",
                  item.editStep && onEdit && "cursor-pointer hover:bg-muted transition-colors"
                )}
                onClick={() => item.editStep && onEdit?.(item.editStep)}
              >
                {item.icon && (
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary">{item.icon}</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium truncate">{item.value}</p>
                </div>
                {item.editStep && onEdit && (
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Price Display */}
          {priceRange && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Geschätzte Kosten</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    CHF {priceRange.min.toLocaleString('de-CH')} – {priceRange.max.toLocaleString('de-CH')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Endpreis nach</p>
                  <p className="text-xs text-muted-foreground">Besichtigung</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          {footer && (
            <div className="mt-4 pt-4 border-t border-border">
              {footer}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Helper function to create common review items
export const createReviewItems = {
  address: (from: string, to: string): ReviewItem[] => [
    { label: 'Von', value: from, icon: <MapPin className="h-4 w-4" />, editStep: 1 },
    { label: 'Nach', value: to, icon: <MapPin className="h-4 w-4" />, editStep: 1 },
  ],
  date: (date: string): ReviewItem => ({
    label: 'Umzugsdatum',
    value: date,
    icon: <Calendar className="h-4 w-4" />,
    editStep: 1,
  }),
  rooms: (rooms: string): ReviewItem => ({
    label: 'Zimmer',
    value: `${rooms} Zimmer`,
    icon: <Home className="h-4 w-4" />,
    editStep: 1,
  }),
  services: (services: string[]): ReviewItem => ({
    label: 'Zusatzleistungen',
    value: services.length > 0 ? services.join(', ') : 'Keine',
    icon: <Package className="h-4 w-4" />,
    editStep: 2,
  }),
};

export default ReviewReceipt;
