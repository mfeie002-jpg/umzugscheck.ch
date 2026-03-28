import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Building2, Calendar as CalendarIcon, ExternalLink, CheckCircle, 
  AlertTriangle, Info, ChevronRight, Clock, FileText, MapPin
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { 
  checkEUmzugSupport, 
  initiateEUmzug, 
  getRegistrationDeadline,
} from '@/lib/relo-os/swiss-integration/eumzug-ch';
import { 
  getCantonRules, 
  CANTON_DISPLAY_NAMES,
  CANTON_REGULATIONS
} from '@/lib/relo-os/swiss-integration/move-readiness/canton-rules';

export default function CommuneRegistrationWizard() {
  const [step, setStep] = useState(1);
  const [moveDate, setMoveDate] = useState<Date>();
  const [addressInfo, setAddressInfo] = useState({
    oldPostalCode: '',
    oldCity: '',
    newPostalCode: '',
    newCity: '',
    canton: '',
  });
  const [eumzugSupported, setEumzugSupported] = useState<boolean | null>(null);
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Derive canton from postal code
  useEffect(() => {
    if (addressInfo.newPostalCode.length === 4) {
      const prefix = addressInfo.newPostalCode.substring(0, 2);
      const cantonMap: Record<string, string> = {
        '80': 'ZH', '81': 'ZH', '84': 'ZH',
        '40': 'BS', '41': 'BL',
        '30': 'BE', '31': 'BE', '32': 'BE',
        '60': 'LU', '61': 'LU',
        '90': 'SG', '91': 'SG',
        '10': 'VD', '11': 'VD',
        '12': 'GE',
        '65': 'TI', '66': 'TI',
        '70': 'GR',
        '50': 'AG',
      };
      setAddressInfo(prev => ({ ...prev, canton: cantonMap[prefix] || '' }));
    }
  }, [addressInfo.newPostalCode]);

  const handleCheckSupport = async () => {
    if (!addressInfo.newPostalCode || !moveDate) return;
    
    setIsLoading(true);
    try {
      const supported = await checkEUmzugSupport(addressInfo.newPostalCode);
      setEumzugSupported(supported);
      
      if (supported) {
        const response = await initiateEUmzug({
          personData: {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            nationality: 'CH',
          },
          oldAddress: {
            street: '',
            houseNumber: '',
            postalCode: addressInfo.oldPostalCode,
            city: addressInfo.oldCity,
            canton: '',
          },
          newAddress: {
            street: '',
            houseNumber: '',
            postalCode: addressInfo.newPostalCode,
            city: addressInfo.newCity,
            canton: addressInfo.canton,
          },
          moveDate: moveDate.toISOString().split('T')[0],
        });
        
        setDeepLink(response.deepLink || null);
      }
      
      setStep(2);
    } catch (error) {
      console.error('Error checking eUmzug support:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const registrationDeadline = moveDate ? getRegistrationDeadline(moveDate) : null;
  const daysUntilDeadline = registrationDeadline 
    ? differenceInDays(registrationDeadline, new Date())
    : null;
  
  const cantonRules = addressInfo.canton ? getCantonRules(addressInfo.canton) : null;

  const requiredDocuments = [
    { name: 'Gültiger Ausweis (ID oder Pass)', required: true },
    { name: 'Wohnungsnachweis (Mietvertrag)', required: true },
    { name: 'Familienausweis (bei Familien)', required: false },
    { name: 'Niederlassungsbewilligung (Ausländer)', required: false },
    { name: 'Heiratsurkunde (bei Namensänderung)', required: false },
  ];

  return (
    <>
      <Helmet>
        <title>Ummeldung Schweiz - Gemeinde Anmeldung bei Umzug | Umzugscheck.ch</title>
        <meta name="description" content="Ummeldung bei der Gemeinde: eUmzug online oder persönlich. Fristen, Dokumente und Schritt-für-Schritt Anleitung für die Anmeldung am neuen Wohnort." />
        <link rel="canonical" href="https://umzugscheck.ch/ummeldung-wizard" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Wie lange habe ich Zeit für die Ummeldung?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sie müssen sich innerhalb von 14 Tagen nach dem Umzug bei der neuen Gemeinde anmelden."
                }
              },
              {
                "@type": "Question",
                "name": "Kann ich mich online ummelden?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Viele Schweizer Gemeinden bieten eUmzug an, eine Online-Ummeldung. Prüfen Sie auf eumzug.swiss, ob Ihre Gemeinde teilnimmt."
                }
              },
              {
                "@type": "Question",
                "name": "Welche Dokumente brauche ich?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sie benötigen einen gültigen Ausweis (ID/Pass) und einen Wohnungsnachweis (Mietvertrag). Bei Familien zusätzlich den Familienausweis."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-20">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
                <Building2 className="h-4 w-4" />
                <span className="text-sm font-medium">Kostenloses Tool</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ummeldung bei der Gemeinde
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Melden Sie sich korrekt an Ihrem neuen Wohnort an. Mit eUmzug-Check, 
                Dokumenten-Checkliste und Fristberechnung.
              </p>
            </div>

            {/* Step 1: Input */}
            {step === 1 && (
              <Card className="max-w-xl mx-auto">
                <CardHeader>
                  <CardTitle>Ihre Umzugsdaten</CardTitle>
                  <CardDescription>
                    Wir prüfen, ob Ihre neue Gemeinde eUmzug unterstützt
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Alter Wohnort
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="PLZ"
                          value={addressInfo.oldPostalCode}
                          onChange={(e) => setAddressInfo(prev => ({ 
                            ...prev, 
                            oldPostalCode: e.target.value.replace(/\D/g, '').slice(0, 4) 
                          }))}
                          maxLength={4}
                        />
                        <Input
                          className="col-span-2"
                          placeholder="Ort"
                          value={addressInfo.oldCity}
                          onChange={(e) => setAddressInfo(prev => ({ ...prev, oldCity: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Neuer Wohnort
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="PLZ"
                          value={addressInfo.newPostalCode}
                          onChange={(e) => setAddressInfo(prev => ({ 
                            ...prev, 
                            newPostalCode: e.target.value.replace(/\D/g, '').slice(0, 4) 
                          }))}
                          maxLength={4}
                        />
                        <Input
                          className="col-span-2"
                          placeholder="Ort"
                          value={addressInfo.newCity}
                          onChange={(e) => setAddressInfo(prev => ({ ...prev, newCity: e.target.value }))}
                        />
                      </div>
                      {addressInfo.canton && (
                        <p className="text-sm text-muted-foreground">
                          Kanton: {CANTON_DISPLAY_NAMES[addressInfo.canton] || addressInfo.canton}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Umzugsdatum</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !moveDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {moveDate ? format(moveDate, "PPP", { locale: de }) : "Datum wählen"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={moveDate}
                          onSelect={setMoveDate}
                          locale={de}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button 
                    onClick={handleCheckSupport}
                    disabled={!addressInfo.newPostalCode || addressInfo.newPostalCode.length !== 4 || !moveDate || isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? 'Wird geprüft...' : 'eUmzug-Verfügbarkeit prüfen'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Results */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Deadline Alert */}
                {registrationDeadline && (
                  <Alert className={cn(
                    daysUntilDeadline !== null && daysUntilDeadline <= 7 
                      ? "border-destructive/50 bg-destructive/5" 
                      : "border-primary/50 bg-primary/5"
                  )}>
                    <Clock className={cn(
                      "h-4 w-4",
                      daysUntilDeadline !== null && daysUntilDeadline <= 7 
                        ? "text-destructive" 
                        : "text-primary"
                    )} />
                    <AlertTitle>Anmeldefrist</AlertTitle>
                    <AlertDescription>
                      Sie müssen sich bis <strong>{format(registrationDeadline, "PPP", { locale: de })}</strong> bei der neuen Gemeinde anmelden (14 Tage nach Umzug).
                      {daysUntilDeadline !== null && daysUntilDeadline <= 14 && daysUntilDeadline > 0 && (
                        <span className="block mt-1 font-medium">
                          Noch {daysUntilDeadline} Tage Zeit!
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {/* eUmzug Status */}
                <Card className={cn(
                  "border-2",
                  eumzugSupported ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/20" : "border-muted"
                )}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {eumzugSupported ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          eUmzug verfügbar!
                        </>
                      ) : (
                        <>
                          <Info className="h-5 w-5 text-muted-foreground" />
                          eUmzug nicht verfügbar
                        </>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {eumzugSupported 
                        ? "Ihre neue Gemeinde unterstützt die Online-Ummeldung"
                        : "Bitte melden Sie sich persönlich bei der Einwohnerkontrolle an"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {eumzugSupported && deepLink ? (
                      <Button asChild className="w-full" size="lg">
                        <a href={deepLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Jetzt online ummelden (eUmzug.ch)
                        </a>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" className="w-full">
                        <a href="https://www.ch.ch/de/umzug-melden/" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Einwohnerkontrolle finden
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Canton-specific info */}
                {cantonRules && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Infos für {CANTON_DISPLAY_NAMES[addressInfo.canton]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm font-medium mb-1">Sprache</p>
                          <p className="text-muted-foreground">{cantonRules.language}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm font-medium mb-1">Anmeldefrist</p>
                          <p className="text-muted-foreground">{cantonRules.registrationDeadlineDays} Tage nach Umzug</p>
                        </div>
                      </div>
                      {cantonRules.specialRules && Object.keys(cantonRules.specialRules).length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Besonderheiten</p>
                          <ul className="space-y-1">
                            {Object.entries(cantonRules.specialRules).map(([key, value], i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                                {key}: {String(value)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Required Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Benötigte Dokumente
                    </CardTitle>
                    <CardDescription>
                      Diese Unterlagen benötigen Sie für die Anmeldung
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {requiredDocuments.map((doc, i) => (
                        <li key={i} className="flex items-center gap-3">
                          {doc.required ? (
                            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                          )}
                          <span className={cn(!doc.required && "text-muted-foreground")}>
                            {doc.name}
                          </span>
                          {doc.required && (
                            <Badge variant="secondary" className="text-xs">Pflicht</Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Abmeldung Reminder */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      Abmeldung nicht vergessen!
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Bei einem Umzug in eine andere Gemeinde müssen Sie sich auch bei der alten Gemeinde abmelden. 
                      Dies geschieht oft automatisch bei der Anmeldung am neuen Ort, aber prüfen Sie dies im Zweifelsfall.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="font-medium">Innerhalb des Kantons</p>
                        <p className="text-muted-foreground">Meist automatische Abmeldung</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="font-medium">Kantonswechsel</p>
                        <p className="text-muted-foreground">Separate Abmeldung prüfen</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Back Button */}
                <div className="flex justify-center">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Zurück zur Eingabe
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section (always visible) */}
        {step === 1 && (
          <section className="py-12 bg-muted/30">
            <div className="container max-w-4xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-center mb-8">
                Häufige Fragen zur Ummeldung
              </h2>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Wie lange habe ich Zeit für die Ummeldung?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Sie müssen sich innerhalb von <strong>14 Tagen</strong> nach dem Umzug bei der neuen Gemeinde anmelden. 
                      Dies ist gesetzlich vorgeschrieben.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Was ist eUmzug?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      eUmzug (auch eMovingCH) ist ein Online-Service, mit dem Sie sich bei vielen Schweizer Gemeinden 
                      digital an- und abmelden können - ohne persönlichen Besuch der Einwohnerkontrolle.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Was passiert bei verspäteter Anmeldung?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Bei verspäteter Anmeldung kann eine Busse verhängt werden. Die Höhe variiert je nach Kanton 
                      und kann zwischen CHF 50 und CHF 500 betragen.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
