/**
 * ProgressHeader - Consistent sticky header for all flows
 * 
 * Features:
 * - Sticky positioning with backdrop blur
 * - Step counter (Schritt X/Y)
 * - Visual progress bar
 * - Consistent styling across all flows
 */

import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressHeaderProps {
  step: number;
  total: number;
  title: string;
}

export function ProgressHeader({ step, total, title }: ProgressHeaderProps) {
  const pct = Math.round((step / total) * 100);
  
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b pb-4 pt-4 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="text-sm text-muted-foreground">
            Schritt {step}/{total}
          </span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>
    </div>
  );
}
