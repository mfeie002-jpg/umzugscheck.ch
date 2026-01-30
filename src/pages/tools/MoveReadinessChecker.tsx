/**
 * Move Readiness Checker Page
 * 
 * Public tool page for generating personalized Swiss move timelines.
 * SEO-optimized, linkable by municipalities, HR, and landlords.
 * 
 * Route: /umzugs-checkliste-generator
 */

import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Download, 
  Share2,
  Home,
  Users,
  Car,
  Dog,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Info,
  Baby
} from 'lucide-react';
import { DynamicNavigation } from '@/components/DynamicNavigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  MoveReadinessInput, 
  HouseholdType, 
  PropertyType,
  TimelineItem,
  MoveWarning
} from '@/lib/relo-os/swiss-integration/move-readiness/types';
import { generateMoveReadinessResult } from '@/lib/relo-os/swiss-integration/move-readiness/checklist-engine';
import { getCantonFromPostalCode } from '@/lib/relo-os/swiss-integration/move-readiness/canton-rules';
import { formatPlz } from '@/lib/swiss-validators';

const MoveReadinessChecker = () => {
  // Form state
  const [step, setStep] = useState(1);
  const [fromPostal, setFromPostal] = useState('');
  const [toPostal, setToPostal] = useState('');
  const [moveDate, setMoveDate] = useState('');
  const [householdType, setHouseholdType] = useState<HouseholdType>('couple');
  const [propertyType, setPropertyType] = useState<PropertyType>('rental');
  const [needsCleaning, setNeedsCleaning] = useState(true);
  const [hasChildren, setHasChildren] = useState(false);
  const [hasPets, setHasPets] = useState(false);
  const [hasVehicles, setHasVehicles] = useState(false);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  // Derive cantons from postal codes
  const fromCanton = useMemo(() => getCantonFromPostalCode(fromPostal) || 'ZH', [fromPostal]);
  const toCanton = useMemo(() => getCantonFromPostalCode(toPostal) || 'ZH', [toPostal]);

  // Build input object
  const input: MoveReadinessInput = useMemo(() => ({
    fromPostalCode: fromPostal,
    fromCanton,
    toPostalCode: toPostal,
    toCanton,
    moveDate: moveDate || new Date().toISOString(),
    householdType,
    propertyType,
    needsCleaning,
    hasChildren,
    hasPets,
    hasVehicles,
    specialItems: []
  }), [fromPostal, fromCanton, toPostal, toCanton, moveDate, householdType, propertyType, needsCleaning, hasChildren, hasPets, hasVehicles]);

  // Generate result
  const result = useMemo(() => {
    if (!showResult) return null;
    return generateMoveReadinessResult(input, completedItems);
  }, [input, completedItems, showResult]);

  const handleToggleItem = (itemId: string) => {
    setCompletedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSubmit = () => {
    setShowResult(true);
    setStep(2);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      administrative: 'bg-blue-500',
      logistics: 'bg-orange-500',
      cleaning: 'bg-green-500',
      utilities: 'bg-purple-500',
      personal: 'bg-pink-500',
      legal: 'bg-red-500',
      financial: 'bg-yellow-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      administrative: 'Behörden',
      logistics: 'Logistik',
      cleaning: 'Reinigung',
      utilities: 'Versorger',
      personal: 'Persönlich',
      legal: 'Rechtliches',
      financial: 'Finanzen'
    };
    return labels[category] || category;
  };

  const getWarningIcon = (severity: 'critical' | 'warning' | 'info') => {
    if (severity === 'critical') return <AlertTriangle className="h-5 w-5 text-destructive" />;
    if (severity === 'warning') return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <Info className="h-5 w-5 text-blue-500" />;
  };

  // Group timeline items by phase
  const timelinePhases = useMemo(() => {
    if (!result) return [];
    
    const phases = [
      { label: 'Planung (T-30 bis T-14)', days: [-30, -14] },
      { label: 'Vorbereitung (T-14 bis T-7)', days: [-14, -7] },
      { label: 'Endspurt (T-7 bis T-1)', days: [-7, -1] },
      { label: 'Umzugstag (T-0)', days: [0, 0] },
      { label: 'Nachbereitung (T+1 bis T+14)', days: [1, 14] },
    ];

    return phases.map(phase => ({
      ...phase,
      items: result.timeline.filter(item => 
        item.day >= phase.days[0] && item.day <= phase.days[1]
      )
    })).filter(phase => phase.items.length > 0);
  }, [result]);

  // Schema.org structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Schweizer Umzugs-Checkliste Generator",
    "description": "Generieren Sie eine personalisierte Umzugs-Timeline und Checkliste für Ihren Schweizer Umzug.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Adressen eingeben",
        "text": "Geben Sie Ihre aktuelle und neue PLZ ein."
      },
      {
        "@type": "HowToStep",
        "name": "Details angeben",
        "text": "Wählen Sie Haushaltsgrösse, Mieterstatus und Zusatzoptionen."
      },
      {
        "@type": "HowToStep",
        "name": "Timeline erhalten",
        "text": "Erhalten Sie Ihre personalisierte Umzugs-Timeline mit allen Fristen."
      }
    ],
    "totalTime": "PT5M"
  };

  return (
    <>
      <Helmet>
        <title>Umzugs-Checkliste Generator | Personalisierte Timeline | Umzugscheck.ch</title>
        <meta name="description" content="Erstellen Sie Ihre kostenlose, personalisierte Umzugs-Checkliste für die Schweiz. Mit Behördenfristen, Reinigungsplanung und kantonsspezifischen Hinweisen." />
        <meta name="keywords" content="umzug checkliste schweiz, umzugsplaner, wohnungswechsel checkliste, umzug timeline, umzug fristen schweiz" />
        <link rel="canonical" href="https://umzugscheck.ch/umzugs-checkliste-generator" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <DynamicNavigation />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <Badge variant="outline" className="mb-4">
                <Calendar className="h-3 w-3 mr-1" />
                Kostenlos & ohne Anmeldung
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                Ihre persönliche <span className="text-primary">Umzugs-Checkliste</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Generieren Sie eine massgeschneiderte Timeline für Ihren Schweizer Umzug. 
                Mit allen Fristen, Behördengängen und kantonsspezifischen Hinweisen.
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
                      <Home className="h-5 w-5 text-primary" />
                      Umzugsdaten eingeben
                    </CardTitle>
                    <CardDescription>
                      Beantworten Sie einige Fragen für Ihre personalisierte Checkliste
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Addresses */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fromPostal">Aktuelle PLZ</Label>
                        <Input
                          id="fromPostal"
                          placeholder="z.B. 8001"
                          value={fromPostal}
                          onChange={(e) => setFromPostal(formatPlz(e.target.value))}
                          maxLength={4}
                        />
                        {fromCanton && fromPostal.length === 4 && (
                          <p className="text-sm text-muted-foreground">Kanton: {fromCanton}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toPostal">Neue PLZ</Label>
                        <Input
                          id="toPostal"
                          placeholder="z.B. 3000"
                          value={toPostal}
                          onChange={(e) => setToPostal(formatPlz(e.target.value))}
                          maxLength={4}
                        />
                        {toCanton && toPostal.length === 4 && (
                          <p className="text-sm text-muted-foreground">Kanton: {toCanton}</p>
                        )}
                      </div>
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
                    </div>

                    <Separator />

                    {/* Household Type */}
                    <div className="space-y-3">
                      <Label>Haushaltsgrösse</Label>
                      <RadioGroup 
                        value={householdType} 
                        onValueChange={(v) => setHouseholdType(v as HouseholdType)}
                        className="grid grid-cols-2 md:grid-cols-4 gap-3"
                      >
                        {[
                          { value: 'single', label: 'Einzelperson', icon: Users },
                          { value: 'couple', label: 'Paar', icon: Users },
                          { value: 'family', label: 'Familie', icon: Users },
                          { value: 'shared', label: 'WG', icon: Users },
                        ].map(opt => (
                          <Label
                            key={opt.value}
                            htmlFor={opt.value}
                            className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                              householdType === opt.value 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <RadioGroupItem value={opt.value} id={opt.value} className="sr-only" />
                            <opt.icon className="h-6 w-6 mb-2" />
                            <span className="text-sm font-medium">{opt.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Property Type */}
                    <div className="space-y-3">
                      <Label>Wohnsituation</Label>
                      <RadioGroup 
                        value={propertyType} 
                        onValueChange={(v) => setPropertyType(v as PropertyType)}
                        className="grid grid-cols-3 gap-3"
                      >
                        {[
                          { value: 'rental', label: 'Miete' },
                          { value: 'owned', label: 'Eigentum' },
                          { value: 'sublet', label: 'Untermiete' },
                        ].map(opt => (
                          <Label
                            key={opt.value}
                            htmlFor={`property-${opt.value}`}
                            className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${
                              propertyType === opt.value 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <RadioGroupItem value={opt.value} id={`property-${opt.value}`} className="sr-only" />
                            <span className="text-sm font-medium">{opt.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>

                    <Separator />

                    {/* Additional Options */}
                    <div className="space-y-4">
                      <Label>Zusätzliche Anforderungen</Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 rounded-lg border">
                          <Checkbox 
                            id="cleaning" 
                            checked={needsCleaning}
                            onCheckedChange={(v) => setNeedsCleaning(!!v)}
                          />
                          <Label htmlFor="cleaning" className="flex items-center gap-2 cursor-pointer">
                            <Sparkles className="h-4 w-4 text-green-500" />
                            Endreinigung benötigt
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border">
                          <Checkbox 
                            id="children" 
                            checked={hasChildren}
                            onCheckedChange={(v) => setHasChildren(!!v)}
                          />
                          <Label htmlFor="children" className="flex items-center gap-2 cursor-pointer">
                            <Baby className="h-4 w-4 text-pink-500" />
                            Kinder im Haushalt
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border">
                          <Checkbox 
                            id="pets" 
                            checked={hasPets}
                            onCheckedChange={(v) => setHasPets(!!v)}
                          />
                          <Label htmlFor="pets" className="flex items-center gap-2 cursor-pointer">
                            <Dog className="h-4 w-4 text-orange-500" />
                            Haustiere
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border">
                          <Checkbox 
                            id="vehicles" 
                            checked={hasVehicles}
                            onCheckedChange={(v) => setHasVehicles(!!v)}
                          />
                          <Label htmlFor="vehicles" className="flex items-center gap-2 cursor-pointer">
                            <Car className="h-4 w-4 text-blue-500" />
                            Fahrzeug vorhanden
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full" 
                      onClick={handleSubmit}
                      disabled={!fromPostal || !toPostal || !moveDate}
                    >
                      Checkliste generieren
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
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
                {/* Score Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left">
                        <p className="text-sm text-muted-foreground mb-1">Umzugs-Readiness</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-primary">{result.readinessScore}%</span>
                          <span className="text-muted-foreground">bereit</span>
                        </div>
                      </div>
                      <div className="flex-1 max-w-sm">
                        <Progress value={result.readinessScore} className="h-3" />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          PDF Export
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Teilen
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Warnings */}
                {result.warnings.length > 0 && (
                  <div className="space-y-3">
                    {result.warnings.map((warning: MoveWarning) => (
                      <Alert 
                        key={warning.id} 
                        variant={warning.severity === 'critical' ? 'destructive' : 'default'}
                      >
                        {getWarningIcon(warning.severity)}
                        <AlertTitle>{warning.title}</AlertTitle>
                        <AlertDescription>
                          {warning.message}
                          {warning.actionRequired && (
                            <p className="mt-1 font-medium">{warning.actionRequired}</p>
                          )}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{result.estimatedAdminHours}h</p>
                      <p className="text-sm text-muted-foreground">Admin-Aufwand</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-500" />
                      <p className="text-2xl font-bold">{result.checklist.length}</p>
                      <p className="text-sm text-muted-foreground">Aufgaben</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                      <p className="text-2xl font-bold">{result.warnings.length}</p>
                      <p className="text-sm text-muted-foreground">Warnungen</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <p className="text-2xl font-bold">{timelinePhases.length}</p>
                      <p className="text-sm text-muted-foreground">Phasen</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Canton-specific notes */}
                {result.cantonSpecificNotes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Kantonsspezifische Hinweise ({toCanton})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.cantonSpecificNotes.map((note, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Info className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                            <span className="text-sm">{note}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Timeline Accordion */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ihre Umzugs-Timeline</CardTitle>
                    <CardDescription>
                      Klicken Sie auf eine Phase, um die Details zu sehen
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" defaultValue={['phase-0']} className="space-y-2">
                      {timelinePhases.map((phase, phaseIndex) => (
                        <AccordionItem key={phaseIndex} value={`phase-${phaseIndex}`} className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold">{phase.label}</span>
                              <Badge variant="secondary">{phase.items.length} Aufgaben</Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 pt-2">
                              {phase.items.map((item: TimelineItem) => {
                                const checklistItem = result.checklist.find(c => c.linkedTimelineItemId === item.id);
                                const isCompleted = completedItems.includes(checklistItem?.id || '');
                                
                                return (
                                  <div 
                                    key={item.id}
                                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                                      isCompleted ? 'bg-green-50 border-green-200' : 'bg-muted/30'
                                    }`}
                                  >
                                    <Checkbox
                                      checked={isCompleted}
                                      onCheckedChange={() => checklistItem && handleToggleItem(checklistItem.id)}
                                      className="mt-0.5"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                                          {item.title}
                                        </span>
                                        <Badge 
                                          variant="outline" 
                                          className={`text-xs ${getCategoryColor(item.category)} text-white`}
                                        >
                                          {getCategoryLabel(item.category)}
                                        </Badge>
                                        {item.priority === 'critical' && (
                                          <Badge variant="destructive" className="text-xs">Kritisch</Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                      {item.estimatedDuration && (
                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {item.estimatedDuration}
                                        </p>
                                      )}
                                      {item.externalLink && (
                                        <a 
                                          href={item.externalLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                                        >
                                          {item.externalLinkLabel || 'Link öffnen'}
                                          <ExternalLink className="h-3 w-3" />
                                        </a>
                                      )}
                                      {item.tips && item.tips.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                          {item.tips.map((tip, i) => (
                                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                                              <span className="text-primary">•</span>
                                              {tip}
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                    <Badge variant="outline" className="shrink-0 text-xs">
                                      {item.dayLabel}
                                    </Badge>
                                  </div>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Empfehlungen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">Umzugsfirma gesucht?</h3>
                        <p className="text-muted-foreground text-sm">
                          Vergleichen Sie jetzt kostenlos Offerten von geprüften Schweizer Umzugsfirmen.
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
                  onClick={() => { setStep(1); setShowResult(false); setCompletedItems([]); }}
                  className="w-full"
                >
                  Neue Checkliste erstellen
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

export default MoveReadinessChecker;
