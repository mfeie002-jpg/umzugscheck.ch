/**
 * Serafe Notification Component
 * 
 * Swiss radio/TV fee address change notification
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle2, Tv, Info } from 'lucide-react';
import { generateSerafeNotificationLink } from '@/lib/relo-os/swiss-integration';

export interface SerafeNotificationProps {
  moveDate: Date;
  newAddress: {
    postalCode: string;
    city: string;
  };
  onComplete?: () => void;
  isCompleted?: boolean;
}

export const SerafeNotification = ({
  onComplete,
  isCompleted = false,
}: SerafeNotificationProps) => {
  const [completed, setCompleted] = useState(isCompleted);

  const serafeLink = generateSerafeNotificationLink();

  const handleOpenSerafe = () => {
    window.open(serafeLink, '_blank', 'noopener,noreferrer');
  };

  const handleMarkComplete = () => {
    setCompleted(true);
    onComplete?.();
  };

  return (
    <Card className={completed ? 'border-green-500/50 bg-green-50/30' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Tv className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Serafe Adressänderung
                {completed && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              </CardTitle>
              <CardDescription>
                Radio-/TV-Gebühren Adressmeldung
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-muted-foreground">
            Obligatorisch
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Box */}
        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg text-sm">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-muted-foreground">
              Die Serafe erhebt die Radio- und TV-Abgabe für alle Schweizer Haushalte. 
              Bei einem Umzug muss die neue Adresse gemeldet werden.
            </p>
            <p className="mt-2 text-muted-foreground">
              <strong>Jahresgebühr:</strong> CHF 335.- pro Haushalt
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {!completed ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleOpenSerafe} 
              variant="outline"
              className="flex-1 min-h-[52px]"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Serafe Adressänderung öffnen
            </Button>
            <Button 
              variant="outline" 
              onClick={handleMarkComplete}
              className="min-h-[52px]"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Als erledigt markieren
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Serafe Meldung erledigt</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
