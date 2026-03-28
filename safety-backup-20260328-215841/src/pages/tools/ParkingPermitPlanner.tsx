/**
 * Parking Permit Planner Page
 * 
 * Public tool page for Swiss parking permit/Halteverbot requirements.
 * SEO-optimized, linkable by landlords and building management.
 * 
 * Route: /halteverbot-planer
 */

import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Car,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Download,
  Phone,
  Mail,
  ChevronRight,
  Truck,
  Info,
  FileText,
  Shield
} from 'lucide-react';
import { DynamicNavigation } from '@/components/DynamicNavigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ParkingPermitRequest,
  ParkingPermitResult,
  ParkingPermitStep
} from '@/lib/relo-os/swiss-integration/parking-permit/types';
import { getAllCitiesWithRules, getCityParkingRule } from '@/lib/relo-os/swiss-integration/parking-permit/city-requirements';
import { generateParkingPermitResult, hasEnoughTimeForPermit, getCityPermitSummary } from '@/lib/relo-os/swiss-integration/parking-permit/permit-generator';
import { formatDeadline } from '@/lib/relo-os/swiss-integration/parking-permit/deadline-calculator';

const ParkingPermitPlanner = () => {
  // Form state
  const [step, setStep] = useState(1);
  const [citySlug, setCitySlug] = useState('');
  const [moveDate, setMoveDate] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [duration, setDuration] = useState(6);
  const [vehicleType, setVehicleType] = useState<'van' | 'truck_small' | 'truck_large'>('truck_small');
  const [result, setResult] = useState<ParkingPermitResult | null>(null);

  const cities = useMemo(() => getAllCitiesWithRules(), []);

  const selectedCity = useMemo(() => {
    if (!citySlug) return null;
    return getCityParkingRule(citySlug);
  }, [citySlug]);

  const citySummary = useMemo(() => {
    if (!citySlug) return null;
    return getCityPermitSummary(citySlug);
  }, [citySlug]);

  const timeCheck = useMemo(() => {
    if (!citySlug || !moveDate) return null;
    return hasEnoughTimeForPermit(new Date(moveDate), citySlug);
  }, [citySlug, moveDate]);

  const handleSubmit = () => {
    if (!citySlug || !moveDate) return;

    const request: ParkingPermitRequest = {
      citySlug,
      moveDate,
      streetAddress,
      duration,
      vehicleType
    };

    const permitResult = generateParkingPermitResult(request);
    setResult(permitResult);
    setStep(2);
  };

  const getVehicleLabel = (type: string) => {
    const labels: Record<string, string> = {
      van: 'Lieferwagen (bis 3.5t)',
      truck_small: 'Kleiner LKW (bis 7.5t)',
      truck_large: 'Grosser LKW (über 7.5t)'
    };
    return labels[type] || type;
  };

  // Schema.org structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Brauche ich ein Halteverbot für meinen Umzug in der Schweiz?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In den meisten Schweizer Städten ist für den Umzug ein offizielles Halteverbot erforderlich. Die Anforderungen variieren je nach Stadt."
        }
      },
      {
        "@type": "Question",
        "name": "Wie lange im Voraus muss ich ein Halteverbot beantragen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die Vorlaufzeit variiert zwischen 5 und 10 Arbeitstagen je nach Stadt. Zusätzlich müssen die Schilder 72 Stunden vor dem Umzug aufgestellt werden."
        }
      },
      {
        "@type": "Question",
        "name": "Was kostet ein Halteverbot in der Schweiz?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die Kosten variieren zwischen CHF 40 und CHF 60 je nach Stadt. Für grössere Fahrzeuge oder längere Zeiträume können die Kosten höher sein."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Halteverbot-Planer Schweiz | Umzugs-Parkbewilligung | Umzugscheck.ch</title>
        <meta name="description" content="Planen Sie Ihr Halteverbot für den Umzug. Alle Infos zu Fristen, Kosten und Anträgen für Zürich, Basel, Bern und weitere Schweizer Städte." />
        <meta name="keywords" content="halteverbot umzug schweiz, parkverbot umzug, umzug parkbewilligung, halteverbot beantragen zürich, umzug parkplatz reservieren" />
        <link rel="canonical" href="https://umzugscheck.ch/halteverbot-planer" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <DynamicNavigation />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-orange-500/5 via-background to-primary/5">
          <div className="container max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <Badge variant="outline" className="mb-4">
                <Car className="h-3 w-3 mr-1" />
                8 Schweizer Städte
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                <span className="text-primary">Halteverbot</span> für Ihren Umzug
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Finden Sie heraus, ob Sie ein Halteverbot brauchen und wie Sie es beantragen. 
                Mit Fristen, Kosten und direkten Links zu den Behörden.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container max-w-4xl mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {/* Step 1: Input Form */}
            {step === 1 && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Umzugsort und Datum
                    </CardTitle>
                    <CardDescription>
                      Wählen Sie Ihre Stadt und das Umzugsdatum
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* City Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="city">Stadt auswählen</Label>
                      <Select value={citySlug} onValueChange={setCitySlug}>
                        <SelectTrigger>
                          <SelectValue placeholder="Stadt wählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map(city => (
                            <SelectItem key={city.citySlug} value={city.citySlug}>
                              {city.cityName} ({city.cantonCode})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {citySummary && (
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                          <Info className="h-3 w-3" />
                          {citySummary}
                        </p>
                      )}
                    </div>

                    {/* Move Date */}
                    <div className="space-y-2">
                      <Label htmlFor="moveDate">Umzugsdatum</Label>
                      <Input
                        id="moveDate"
                        type="date"
                        value={moveDate}
                        onChange={(e) => setMoveDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {timeCheck && !timeCheck.hasTime && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Zu kurzfristig!</AlertTitle>
                          <AlertDescription>
                            Sie benötigen mindestens {timeCheck.daysNeeded} Tage Vorlauf, 
                            haben aber nur noch {timeCheck.daysAvailable} Tage. 
                            Kontaktieren Sie die Behörde für eine Express-Bearbeitung.
                          </AlertDescription>
                        </Alert>
                      )}
                      {timeCheck && timeCheck.hasTime && timeCheck.daysAvailable < timeCheck.daysNeeded + 5 && (
                        <Alert className="mt-2">
                          <Clock className="h-4 w-4" />
                          <AlertTitle>Zeitnah handeln</AlertTitle>
                          <AlertDescription>
                            Sie haben noch {timeCheck.daysAvailable} Tage Zeit. 
                            Wir empfehlen, den Antrag sofort einzureichen.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Street Address */}
                    <div className="space-y-2">
                      <Label htmlFor="street">Strasse und Hausnummer (optional)</Label>
                      <Input
                        id="street"
                        placeholder="z.B. Bahnhofstrasse 10"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                      />
                    </div>

                    <Separator />

                    {/* Vehicle Type */}
                    <div className="space-y-3">
                      <Label>Fahrzeugtyp</Label>
                      <RadioGroup 
                        value={vehicleType} 
                        onValueChange={(v) => setVehicleType(v as typeof vehicleType)}
                        className="grid grid-cols-1 md:grid-cols-3 gap-3"
                      >
                        {[
                          { value: 'van', label: 'Lieferwagen', desc: 'bis 3.5t', icon: Car },
                          { value: 'truck_small', label: 'Kleiner LKW', desc: 'bis 7.5t', icon: Truck },
                          { value: 'truck_large', label: 'Grosser LKW', desc: 'über 7.5t', icon: Truck },
                        ].map(opt => (
                          <Label
                            key={opt.value}
                            htmlFor={`vehicle-${opt.value}`}
                            className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                              vehicleType === opt.value 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <RadioGroupItem value={opt.value} id={`vehicle-${opt.value}`} className="sr-only" />
                            <opt.icon className="h-8 w-8 mb-2" />
                            <span className="font-medium">{opt.label}</span>
                            <span className="text-xs text-muted-foreground">{opt.desc}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                      <Label htmlFor="duration">Benötigte Dauer (Stunden)</Label>
                      <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[4, 6, 8, 10, 12].map(h => (
                            <SelectItem key={h} value={h.toString()}>
                              {h} Stunden
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full" 
                      onClick={handleSubmit}
                      disabled={!citySlug || !moveDate}
                    >
                      Anforderungen prüfen
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                {/* City Quick Info Cards */}
                <div className="mt-12">
                  <h2 className="text-xl font-semibold mb-6 text-center">Halteverbot nach Stadt</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cities.slice(0, 8).map(city => (
                      <Card 
                        key={city.citySlug} 
                        className={`cursor-pointer transition-colors hover:border-primary ${
                          citySlug === city.citySlug ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setCitySlug(city.citySlug)}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="font-medium">{city.cityName}</span>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {city.leadTimeDays} Arbeitstage Vorlauf
                            </p>
                            {city.costChf && (
                              <p className="flex items-center gap-1">
                                <span className="font-medium text-primary">CHF {city.costChf}</span>
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Results */}
            {step === 2 && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Status Card */}
                <Card className={result.isUrgent ? 'border-orange-500' : 'border-green-500'}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className={`p-4 rounded-full ${result.isUrgent ? 'bg-orange-100' : 'bg-green-100'}`}>
                        {result.isUrgent ? (
                          <AlertTriangle className="h-8 w-8 text-orange-600" />
                        ) : (
                          <CheckCircle2 className="h-8 w-8 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h2 className="text-xl font-bold mb-1">
                          {result.isRequired 
                            ? `Halteverbot in ${result.city.cityName} erforderlich`
                            : `Kein Halteverbot in ${result.city.cityName} nötig`
                          }
                        </h2>
                        <p className="text-muted-foreground">
                          {result.isUrgent 
                            ? `Achtung: Deadline in ${result.daysUntilDeadline} Tagen!`
                            : `Sie haben noch ${result.daysUntilDeadline} Tage Zeit für den Antrag.`
                          }
                        </p>
                      </div>
                      {result.estimatedCost && (
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Geschätzte Kosten</p>
                          <p className="text-2xl font-bold text-primary">CHF {result.estimatedCost}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Deadline Alert */}
                {result.isUrgent && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Dringend handeln!</AlertTitle>
                    <AlertDescription>
                      Die Deadline für Ihren Antrag ist am <strong>{formatDeadline(result.deadline)}</strong>. 
                      Reichen Sie den Antrag heute noch ein.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Key Info */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Deadline</p>
                          <p className="font-medium">{formatDeadline(result.deadline)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Maximale Dauer</p>
                          <p className="font-medium">{result.city.maxDurationHours} Stunden</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Ihr Fahrzeug</p>
                          <p className="font-medium">{getVehicleLabel(vehicleType)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Schritt-für-Schritt Anleitung
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.steps.map((permitStep: ParkingPermitStep) => (
                        <div 
                          key={permitStep.stepNumber}
                          className="flex gap-4 items-start p-4 rounded-lg bg-muted/30"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                            {permitStep.stepNumber}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{permitStep.title}</h4>
                            <p className="text-sm text-muted-foreground">{permitStep.description}</p>
                            {permitStep.estimatedTime && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {permitStep.estimatedTime}
                              </p>
                            )}
                            {permitStep.actionUrl && (
                              <Button 
                                variant="link" 
                                className="p-0 h-auto mt-2"
                                asChild
                              >
                                <a href={permitStep.actionUrl} target="_blank" rel="noopener noreferrer">
                                  {permitStep.actionLabel}
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Kontakt {result.city.cityName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {result.city.phone && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <Phone className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Telefon</p>
                            <a href={`tel:${result.city.phone}`} className="font-medium hover:text-primary">
                              {result.city.phone}
                            </a>
                          </div>
                        </div>
                      )}
                      {result.city.email && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <Mail className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">E-Mail</p>
                            <a href={`mailto:${result.city.email}`} className="font-medium hover:text-primary">
                              {result.city.email}
                            </a>
                          </div>
                        </div>
                      )}
                      {result.city.contactUrl && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <ExternalLink className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Website</p>
                            <a 
                              href={result.city.contactUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium hover:text-primary"
                            >
                              Zur offiziellen Seite
                            </a>
                          </div>
                        </div>
                      )}
                      {result.city.applicationUrl && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Online-Antrag</p>
                            <a 
                              href={result.city.applicationUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium hover:text-primary"
                            >
                              Antrag stellen
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements & Tips */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Anforderungen
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.city.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                            <span className="text-sm">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        Tipps
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.city.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Downloads */}
                {result.downloadables.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Download className="h-5 w-5 text-primary" />
                        Downloads
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-3">
                        {result.downloadables.map((dl, i) => (
                          <Button 
                            key={i} 
                            variant="outline" 
                            className="justify-start"
                            asChild
                          >
                            <a href={dl.url} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 mr-2" />
                              {dl.title}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* CTA */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">Umzugsfirma gesucht?</h3>
                        <p className="text-muted-foreground text-sm">
                          Professionelle Umzugsfirmen kümmern sich oft auch um das Halteverbot.
                        </p>
                      </div>
                      <Button size="lg" asChild>
                        <a href="/umzugsofferten">
                          Offerten vergleichen
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  variant="outline" 
                  onClick={() => { setStep(1); setResult(null); }}
                  className="w-full"
                >
                  Andere Stadt prüfen
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ParkingPermitPlanner;
