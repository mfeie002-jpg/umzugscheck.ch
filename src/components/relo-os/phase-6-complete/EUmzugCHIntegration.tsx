/**
 * eUmzugCH Integration Component
 * 
 * Swiss electronic move registration (eCH-0221 standard)
 * Enables digital registration/deregistration with participating communes.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, CheckCircle2, AlertCircle, Building2, Calendar, ArrowRight } from 'lucide-react';
import { 
  checkEUmzugSupport, 
  initiateEUmzug, 
  getRegistrationDeadline,
  type EUmzugRequest,
  type EUmzugResponse 
} from '@/lib/relo-os/swiss-integration/eumzug-ch';
import { format, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';

export interface EUmzugCHIntegrationProps {
  moveDate: Date;
  oldAddress: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    canton: string;
  };
  newAddress: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    canton: string;
  };
  personData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
  };
  onComplete?: () => void;
  isCompleted?: boolean;
}

export const EUmzugCHIntegration = ({
  moveDate,
  oldAddress,
  newAddress,
  personData,
  onComplete,
  isCompleted = false,
}: EUmzugCHIntegrationProps) => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [eumzugResponse, setEumzugResponse] = useState<EUmzugResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completed, setCompleted] = useState(isCompleted);

  const deadline = getRegistrationDeadline(moveDate);
  const daysUntilDeadline = differenceInDays(deadline, new Date());
  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  const isPastDeadline = daysUntilDeadline < 0;

  useEffect(() => {
    const checkSupport = async () => {
      setIsLoading(true);
      try {
        const supported = await checkEUmzugSupport(newAddress.postalCode);
        setIsSupported(supported);

        if (supported) {
          const request: EUmzugRequest = {
            personData: {
              firstName: personData.firstName,
              lastName: personData.lastName,
              dateOfBirth: personData.dateOfBirth,
              nationality: personData.nationality,
            },
            oldAddress,
            newAddress,
            moveDate: format(moveDate, 'yyyy-MM-dd'),
          };
          const response = await initiateEUmzug(request);
          setEumzugResponse(response);
        }
      } catch (error) {
        console.error('Error checking eUmzug support:', error);
        setIsSupported(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSupport();
  }, [newAddress.postalCode, moveDate, personData, oldAddress, newAddress]);

  const handleOpenEUmzug = () => {
    if (eumzugResponse?.deepLink) {
      window.open(eumzugResponse.deepLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleMarkComplete = () => {
    setCompleted(true);
    onComplete?.();
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={completed ? 'border-green-500/50 bg-green-50/30' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Ummeldung (eUmzugCH)
                {completed && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              </CardTitle>
              <CardDescription>
                Digitale An- und Abmeldung bei der Gemeinde
              </CardDescription>
            </div>
          </div>
          {isSupported && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Digital verfügbar
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Deadline Alert */}
        {!completed && (
          <Alert variant={isPastDeadline ? 'destructive' : isUrgent ? 'default' : undefined}>
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              {isPastDeadline ? (
                <>
                  <strong>Frist überschritten!</strong> Die 14-tägige Meldefrist ist abgelaufen. 
                  Bitte melden Sie sich umgehend bei der Einwohnerkontrolle.
                </>
              ) : (
                <>
                  <strong>Anmeldefrist:</strong> {format(deadline, 'dd. MMMM yyyy', { locale: de })}
                  {isUrgent && ' (nur noch wenige Tage!)'}
                  <br />
                  <span className="text-sm text-muted-foreground">
                    Schweizer Gesetz: Anmeldung innerhalb 14 Tage nach Einzug
                  </span>
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Move Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Abmeldung von</p>
            <p className="font-medium">{oldAddress.postalCode} {oldAddress.city}</p>
            <p className="text-sm text-muted-foreground">{oldAddress.street} {oldAddress.houseNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Anmeldung bei</p>
            <p className="font-medium">{newAddress.postalCode} {newAddress.city}</p>
            <p className="text-sm text-muted-foreground">{newAddress.street} {newAddress.houseNumber}</p>
          </div>
        </div>

        {/* Action Buttons */}
        {!completed ? (
          <div className="flex flex-col sm:flex-row gap-3">
            {isSupported && eumzugResponse?.deepLink ? (
              <>
                <Button onClick={handleOpenEUmzug} className="flex-1 min-h-[52px]">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  eUmzug starten
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleMarkComplete}
                  className="min-h-[52px]"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Als erledigt markieren
                </Button>
              </>
            ) : (
              <div className="space-y-3 w-full">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {eumzugResponse?.message || 
                      'Diese Gemeinde unterstützt eUmzug noch nicht. Bitte melden Sie sich direkt bei der Einwohnerkontrolle.'}
                  </AlertDescription>
                </Alert>
                {eumzugResponse?.fallbackUrl && (
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(eumzugResponse.fallbackUrl, '_blank')}
                    className="w-full min-h-[52px]"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Informationen zur Ummeldung
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={handleMarkComplete}
                  className="w-full min-h-[52px]"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Manuell erledigt
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Ummeldung erledigt</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
