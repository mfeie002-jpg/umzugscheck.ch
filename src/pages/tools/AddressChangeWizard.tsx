import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Mail, Calendar as CalendarIcon, ExternalLink, Copy, Check,
  Building2, Wallet, Heart, Zap, Train, Briefcase, ChevronRight,
  Shield, ShieldCheck, Car, FileText, PiggyBank, Wifi, Tv,
  Smartphone, Newspaper, Play, ShoppingBag, GraduationCap, Stethoscope, Users
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { 
  generateSwissPostLink, 
  scheduleSwissPostReminder,
  type AddressChangeRequest 
} from '@/lib/relo-os/swiss-integration/swiss-post';
import { 
  SWISS_INSTITUTIONS,
  getInstitutionsByCategory,
  CATEGORY_NAMES,
  createAddressChangeTasks,
  calculateProgress,
  estimateCompletionTime,
  generateAddressChangeEmail
} from '@/lib/relo-os/swiss-integration/address-change';
import type { AddressChangeTask, Institution } from '@/lib/relo-os/swiss-integration/address-change/types';

const ICON_MAP: Record<string, React.ElementType> = {
  'Building2': Building2, 'Wallet': Wallet, 'Heart': Heart, 'Shield': Shield,
  'ShieldCheck': ShieldCheck, 'Car': Car, 'FileText': FileText, 'PiggyBank': PiggyBank,
  'Zap': Zap, 'Wifi': Wifi, 'Tv': Tv, 'Train': Train, 'Smartphone': Smartphone,
  'Newspaper': Newspaper, 'Play': Play, 'ShoppingBag': ShoppingBag, 'Briefcase': Briefcase,
  'GraduationCap': GraduationCap, 'Stethoscope': Stethoscope, 'Users': Users, 'Mail': Mail,
};

export default function AddressChangeWizard() {
  const [step, setStep] = useState(1);
  const [moveDate, setMoveDate] = useState<Date>();
  const [addressInfo, setAddressInfo] = useState({
    fullName: '',
    oldStreet: '',
    oldPostalCode: '',
    oldCity: '',
    newStreet: '',
    newPostalCode: '',
    newCity: '',
  });
  const [tasks, setTasks] = useState<AddressChangeTask[]>([]);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [householdType, setHouseholdType] = useState<'single' | 'family'>('single');

  const institutionsByCategory = useMemo(() => getInstitutionsByCategory(), []);
  const progress = useMemo(() => calculateProgress(tasks), [tasks]);

  const handleStartPlanning = () => {
    const newTasks = createAddressChangeTasks(true);
    setTasks(newTasks);
    setStep(2);
  };

  const toggleTask = (institutionId: string) => {
    setTasks(prev => prev.map(task => 
      task.institution.id === institutionId
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed', completedAt: task.status === 'pending' ? new Date() : undefined }
        : task
    ));
  };

  const skipTask = (institutionId: string) => {
    setTasks(prev => prev.map(task => 
      task.institution.id === institutionId
        ? { ...task, status: 'skipped' }
        : task
    ));
  };

  const copyEmailTemplate = (institution: Institution) => {
    if (!moveDate) return;
    
    const email = generateAddressChangeEmail(institution.name, {
      ...addressInfo,
      moveDate: format(moveDate, 'dd.MM.yyyy'),
    });
    
    const fullText = `Betreff: ${email.subject}\n\n${email.body}`;
    navigator.clipboard.writeText(fullText);
    setCopiedEmail(institution.id);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Swiss Post deep link
  const swissPostLink = moveDate && addressInfo.oldPostalCode && addressInfo.newPostalCode
    ? generateSwissPostLink({
        oldAddress: { 
          street: addressInfo.oldStreet, 
          houseNumber: '', 
          postalCode: addressInfo.oldPostalCode, 
          city: addressInfo.oldCity 
        },
        newAddress: { 
          street: addressInfo.newStreet, 
          houseNumber: '', 
          postalCode: addressInfo.newPostalCode, 
          city: addressInfo.newCity 
        },
        moveDate: moveDate.toISOString().split('T')[0],
        forwardingDuration: '12_months',
        householdType,
      })
    : null;

  const swissPostReminder = moveDate 
    ? scheduleSwissPostReminder(moveDate)
    : null;

  return (
    <>
      <Helmet>
        <title>Adressänderung Schweiz - Alle Stellen informieren | Umzugscheck.ch</title>
        <meta name="description" content="Adressänderung bei Umzug in der Schweiz: Checkliste für Post, Bank, Versicherungen, Behörden. Mit Email-Vorlagen und Swiss Post Nachsendung." />
        <link rel="canonical" href="https://umzugscheck.ch/adressaenderung" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "Adressänderung bei Umzug in der Schweiz",
            "description": "Alle Institutionen über Ihre neue Adresse informieren",
            "step": [
              { "@type": "HowToStep", "name": "Daten eingeben", "text": "Alte und neue Adresse sowie Umzugsdatum eingeben" },
              { "@type": "HowToStep", "name": "Swiss Post", "text": "Nachsendung bei der Post einrichten" },
              { "@type": "HowToStep", "name": "Institutionen informieren", "text": "Alle relevanten Stellen benachrichtigen" }
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
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Kostenloses Tool</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Adressänderung Schweiz
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Informieren Sie alle wichtigen Stellen über Ihre neue Adresse. 
                Mit Checkliste, Email-Vorlagen und direktem Link zur Swiss Post Nachsendung.
              </p>
            </div>

            {/* Step 1: Input Form */}
            {step === 1 && (
              <Card className="max-w-xl mx-auto">
                <CardHeader>
                  <CardTitle>Ihre Umzugsdaten</CardTitle>
                  <CardDescription>
                    Diese Daten werden für die Email-Vorlagen verwendet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ihr Name</label>
                    <Input
                      placeholder="Max Muster"
                      value={addressInfo.fullName}
                      onChange={(e) => setAddressInfo(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">Alte Adresse</h4>
                      <Input
                        placeholder="Strasse & Nr."
                        value={addressInfo.oldStreet}
                        onChange={(e) => setAddressInfo(prev => ({ ...prev, oldStreet: e.target.value }))}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="PLZ"
                          value={addressInfo.oldPostalCode}
                          onChange={(e) => setAddressInfo(prev => ({ ...prev, oldPostalCode: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
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
                      <h4 className="font-medium text-sm">Neue Adresse</h4>
                      <Input
                        placeholder="Strasse & Nr."
                        value={addressInfo.newStreet}
                        onChange={(e) => setAddressInfo(prev => ({ ...prev, newStreet: e.target.value }))}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="PLZ"
                          value={addressInfo.newPostalCode}
                          onChange={(e) => setAddressInfo(prev => ({ ...prev, newPostalCode: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                          maxLength={4}
                        />
                        <Input
                          className="col-span-2"
                          placeholder="Ort"
                          value={addressInfo.newCity}
                          onChange={(e) => setAddressInfo(prev => ({ ...prev, newCity: e.target.value }))}
                        />
                      </div>
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

                  <div>
                    <label className="block text-sm font-medium mb-2">Haushalt</label>
                    <div className="flex gap-4">
                      <Button
                        variant={householdType === 'single' ? 'default' : 'outline'}
                        onClick={() => setHouseholdType('single')}
                        className="flex-1"
                      >
                        Einzelperson
                      </Button>
                      <Button
                        variant={householdType === 'family' ? 'default' : 'outline'}
                        onClick={() => setHouseholdType('family')}
                        className="flex-1"
                      >
                        Familie/WG
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={handleStartPlanning}
                    disabled={!addressInfo.fullName || !addressInfo.newPostalCode || !moveDate}
                    className="w-full"
                    size="lg"
                  >
                    Checkliste starten
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Checklist */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Progress */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">Ihr Fortschritt</h3>
                        <p className="text-sm text-muted-foreground">
                          {progress.completedCount} von {progress.totalCount} erledigt
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary">{progress.percentComplete}%</span>
                        <p className="text-xs text-muted-foreground">
                          Noch {estimateCompletionTime(tasks)}
                        </p>
                      </div>
                    </div>
                    <Progress value={progress.percentComplete} className="h-2" />
                  </CardContent>
                </Card>

                {/* Swiss Post Card */}
                {swissPostLink && (
                  <Card className="border-primary/50 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        Swiss Post Nachsendung
                      </CardTitle>
                      <CardDescription>
                        Empfohlen: 7 Tage vor Umzug bestellen
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Kosten: CHF {swissPostLink.estimatedCost}.-</p>
                          <p className="text-sm text-muted-foreground">12 Monate Nachsendung</p>
                        </div>
                        {swissPostReminder?.isUrgent && (
                          <Badge variant="destructive">Dringend!</Badge>
                        )}
                      </div>
                      <Button asChild className="w-full">
                        <a href={swissPostLink.deepLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Jetzt bei Swiss Post bestellen
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Institution Categories */}
                <Accordion type="multiple" defaultValue={['government', 'finance', 'insurance']} className="space-y-2">
                  {Object.entries(institutionsByCategory).map(([category, institutions]) => {
                    const categoryTasks = tasks.filter(t => t.institution.category === category);
                    const completedInCategory = categoryTasks.filter(t => t.status === 'completed' || t.status === 'skipped').length;
                    
                    return (
                      <AccordionItem key={category} value={category} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <span className="font-semibold">{CATEGORY_NAMES[category]}</span>
                            <Badge variant="outline">
                              {completedInCategory}/{categoryTasks.length}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-2">
                            {institutions.map(institution => {
                              const task = tasks.find(t => t.institution.id === institution.id);
                              const IconComponent = ICON_MAP[institution.icon] || Mail;
                              const isCompleted = task?.status === 'completed';
                              const isSkipped = task?.status === 'skipped';
                              
                              return (
                                <div 
                                  key={institution.id}
                                  className={cn(
                                    "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                                    isCompleted && "bg-primary/5 border-primary/30",
                                    isSkipped && "bg-muted/50 opacity-60"
                                  )}
                                >
                                  <Checkbox
                                    checked={isCompleted}
                                    onCheckedChange={() => toggleTask(institution.id)}
                                    disabled={isSkipped}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <IconComponent className="h-4 w-4 text-muted-foreground shrink-0" />
                                      <span className={cn("font-medium", isCompleted && "line-through")}>
                                        {institution.name}
                                      </span>
                                      {institution.priority === 'critical' && (
                                        <Badge variant="destructive" className="text-xs">Wichtig</Badge>
                                      )}
                                    </div>
                                    {institution.notes && (
                                      <p className="text-xs text-muted-foreground mt-1">{institution.notes}</p>
                                    )}
                                  </div>
                                  <div className="flex gap-1 shrink-0">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyEmailTemplate(institution)}
                                      disabled={isSkipped}
                                      title="Email-Vorlage kopieren"
                                    >
                                      {copiedEmail === institution.id ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                    {institution.website && (
                                      <Button variant="ghost" size="sm" asChild>
                                        <a href={institution.website} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="h-4 w-4" />
                                        </a>
                                      </Button>
                                    )}
                                    {!isSkipped && !isCompleted && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => skipTask(institution.id)}
                                        className="text-muted-foreground"
                                      >
                                        Skip
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>

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
      </div>
    </>
  );
}
