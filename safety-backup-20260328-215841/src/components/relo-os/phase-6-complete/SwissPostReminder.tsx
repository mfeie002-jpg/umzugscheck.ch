/**
 * Swiss Post Reminder Component
 * 
 * Handles mail forwarding (Nachsendung) automation
 * with T-7 countdown and cost estimation.
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ExternalLink, CheckCircle2, Mail, Clock, AlertTriangle, Coins } from 'lucide-react';
import { 
  generateSwissPostLink, 
  scheduleSwissPostReminder,
  type AddressChangeRequest 
} from '@/lib/relo-os/swiss-integration/swiss-post';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export interface SwissPostReminderProps {
  moveDate: Date;
  oldAddress: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
  newAddress: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
  householdType?: 'single' | 'family';
  onComplete?: () => void;
  isCompleted?: boolean;
}

type ForwardingDuration = '6_months' | '12_months' | '24_months';

export const SwissPostReminder = ({
  moveDate,
  oldAddress,
  newAddress,
  householdType = 'single',
  onComplete,
  isCompleted = false,
}: SwissPostReminderProps) => {
  const [completed, setCompleted] = useState(isCompleted);
  const [selectedDuration, setSelectedDuration] = useState<ForwardingDuration>('12_months');

  const { reminderDate, isUrgent, daysUntilMove } = useMemo(
    () => scheduleSwissPostReminder(moveDate),
    [moveDate]
  );

  const swissPostLink = useMemo(() => {
    const request: AddressChangeRequest = {
      oldAddress,
      newAddress,
      moveDate: format(moveDate, 'yyyy-MM-dd'),
      forwardingDuration: selectedDuration,
      householdType,
    };
    return generateSwissPostLink(request);
  }, [oldAddress, newAddress, moveDate, selectedDuration, householdType]);

  const handleOpenSwissPost = () => {
    window.open(swissPostLink.deepLink, '_blank', 'noopener,noreferrer');
  };

  const handleMarkComplete = () => {
    setCompleted(true);
    onComplete?.();
  };

  const durationOptions: { value: ForwardingDuration; label: string; months: number }[] = [
    { value: '6_months', label: '6 Monate', months: 6 },
    { value: '12_months', label: '12 Monate', months: 12 },
    { value: '24_months', label: '24 Monate', months: 24 },
  ];

  // Calculate cost for display
  const pricing = {
    single: { '6_months': 35, '12_months': 55, '24_months': 95 },
    family: { '6_months': 55, '12_months': 85, '24_months': 145 },
  };
  const currentCost = pricing[householdType][selectedDuration];

  return (
    <Card className={completed ? 'border-green-500/50 bg-green-50/30' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Mail className="h-5 w-5 text-yellow-700" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Post Nachsendeauftrag
                {completed && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              </CardTitle>
              <CardDescription>
                Automatische Weiterleitung Ihrer Post
              </CardDescription>
            </div>
          </div>
          <Badge variant={isUrgent ? 'destructive' : 'secondary'}>
            {daysUntilMove <= 0 ? 'Umzug heute' : `Noch ${daysUntilMove} Tage`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Urgency Alert */}
        {!completed && isUrgent && (
          <Alert variant="default" className="border-yellow-500 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Empfohlen:</strong> Bestellen Sie den Nachsendeauftrag spätestens 7 Tage vor dem Umzug.
              {daysUntilMove <= 7 && daysUntilMove > 0 && (
                <span className="block mt-1">
                  Jetzt ist der ideale Zeitpunkt!
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {!completed && (
          <>
            {/* Duration Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Weiterleitungsdauer wählen</Label>
              <RadioGroup
                value={selectedDuration}
                onValueChange={(value) => setSelectedDuration(value as ForwardingDuration)}
                className="grid grid-cols-3 gap-3"
              >
                {durationOptions.map((option) => (
                  <div key={option.value}>
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={option.value}
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer min-h-[60px]"
                    >
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        CHF {pricing[householdType][option.value]}.-
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Cost Display */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {householdType === 'family' ? 'Familienhaushalt' : 'Einzelperson'}
                </span>
              </div>
              <span className="font-semibold text-lg">CHF {currentCost}.-</span>
            </div>

            {/* Timeline Info */}
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg text-sm">
              <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-blue-800">
                <p className="font-medium">Empfohlener Bestellzeitpunkt</p>
                <p>{format(reminderDate, 'dd. MMMM yyyy', { locale: de })} (7 Tage vor Umzug)</p>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        {!completed ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleOpenSwissPost} className="flex-1 min-h-[52px]">
              <ExternalLink className="h-4 w-4 mr-2" />
              Bei Post bestellen (CHF {currentCost}.-)
            </Button>
            <Button 
              variant="outline" 
              onClick={handleMarkComplete}
              className="min-h-[52px]"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Bereits bestellt
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Nachsendeauftrag erledigt</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
