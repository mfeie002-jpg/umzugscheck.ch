/**
 * SuccessState - Consistent success confirmation for all flows
 * 
 * Displayed after form submission
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface SuccessStateProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function SuccessState({
  title = 'Anfrage gesendet!',
  description = 'Du erhältst in Kürze unverbindliche Offerten von geprüften Umzugsfirmen.',
  children,
}: SuccessStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
