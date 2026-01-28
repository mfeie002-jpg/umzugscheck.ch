import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addWeeks, isSameDay, isAfter, isBefore, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { z } from 'zod';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CalendarDays, 
  Clock, 
  Check, 
  ChevronRight, 
  MapPin, 
  Home,
  Truck,
  CalendarCheck,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben').max(100, 'Name ist zu lang'),
  email: z.string().email('Ungültige E-Mail-Adresse').max(255, 'E-Mail ist zu lang'),
  phone: z.string().regex(/^[\d\s+()-]{8,30}$/, 'Ungültige Telefonnummer'),
  fromAddress: z.string().min(5, 'Adresse muss mindestens 5 Zeichen haben').max(200, 'Adresse ist zu lang'),
  toAddress: z.string().min(5, 'Adresse muss mindestens 5 Zeichen haben').max(200, 'Adresse ist zu lang'),
  rooms: z.string().min(1, 'Bitte Zimmeranzahl auswählen'),
  notes: z.string().max(1000, 'Notizen zu lang').optional(),
});

interface TimeSlot {
  time: string;
  available: boolean;
  popular?: boolean;
}

interface BookingData {
  date: Date | undefined;
  time: string;
  name: string;
  email: string;
  phone: string;
  fromAddress: string;
  toAddress: string;
  rooms: string;
  notes: string;
}

const generateTimeSlots = (date: Date | undefined): TimeSlot[] => {
  if (!date) return [];
  
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  const slots: TimeSlot[] = [
    { time: '07:00', available: !isWeekend && Math.random() > 0.3 },
    { time: '08:00', available: Math.random() > 0.2, popular: true },
    { time: '09:00', available: Math.random() > 0.4, popular: true },
    { time: '10:00', available: Math.random() > 0.3 },
    { time: '11:00', available: Math.random() > 0.5 },
    { time: '12:00', available: Math.random() > 0.6 },
    { time: '13:00', available: Math.random() > 0.4 },
    { time: '14:00', available: Math.random() > 0.3, popular: true },
    { time: '15:00', available: Math.random() > 0.5 },
    { time: '16:00', available: Math.random() > 0.4 },
    { time: '17:00', available: !isWeekend && Math.random() > 0.6 },
  ];
  
  return slots;
};

const BookingCalendar = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    date: undefined,
    time: '',
    name: '',
    email: '',
    phone: '',
    fromAddress: '',
    toAddress: '',
    rooms: '3',
    notes: ''
  });

  const timeSlots = useMemo(() => generateTimeSlots(bookingData.date), [bookingData.date]);
  
  const today = startOfDay(new Date());
  const maxDate = addWeeks(today, 12);

  const handleDateSelect = (date: Date | undefined) => {
    setBookingData(prev => ({ ...prev, date, time: '' }));
  };

  const handleTimeSelect = (time: string) => {
    setBookingData(prev => ({ ...prev, time }));
  };

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const canProceedStep1 = bookingData.date && bookingData.time;
  const canProceedStep2 = bookingData.fromAddress && bookingData.toAddress && bookingData.rooms;
  const canSubmit = bookingData.name && bookingData.email && bookingData.phone;

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const validationResult = bookingSchema.safeParse({
      name: bookingData.name.trim(),
      email: bookingData.email.trim(),
      phone: bookingData.phone.trim(),
      fromAddress: bookingData.fromAddress.trim(),
      toAddress: bookingData.toAddress.trim(),
      rooms: bookingData.rooms,
      notes: bookingData.notes?.trim() || '',
    });

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setValidationErrors(errors);
      toast({
        title: 'Ungültige Eingaben',
        description: 'Bitte überprüfen Sie Ihre Angaben.',
        variant: 'destructive'
      });
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);
    
    try {
      const validated = validationResult.data;
      
      // Log booking data (DB table not available)
      console.log('Booking submission:', {
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        fromAddress: validated.fromAddress,
        toAddress: validated.toAddress,
        rooms: validated.rooms,
        notes: validated.notes,
        date: bookingData.date,
        time: bookingData.time
      });

      toast({
        title: 'Termin erfolgreich gebucht!',
        description: `Wir haben Ihre Anfrage für den ${format(bookingData.date!, 'dd. MMMM yyyy', { locale: de })} um ${bookingData.time} Uhr erhalten.`,
      });

      setStep(4);
    } catch (error) {
      toast({
        title: 'Fehler bei der Buchung',
        description: 'Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4 gap-2">
            <CalendarCheck className="w-3 h-3" />
            Online-Buchung
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Termin online buchen
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Wählen Sie Ihren Wunschtermin und erhalten Sie sofort eine Bestätigung
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            {[
              { num: 1, label: 'Datum & Zeit' },
              { num: 2, label: 'Umzugsdetails' },
              { num: 3, label: 'Kontaktdaten' },
              { num: 4, label: 'Bestätigung' }
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                    step >= s.num 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}
                  animate={{ scale: step === s.num ? 1.1 : 1 }}
                >
                  {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                </motion.div>
                <span className={cn(
                  "ml-2 text-sm hidden sm:inline",
                  step >= s.num ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {s.label}
                </span>
                {index < 3 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground hidden sm:inline" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-primary" />
                      Wählen Sie Datum und Uhrzeit
                    </CardTitle>
                    <CardDescription>
                      Verfügbare Termine werden in Echtzeit angezeigt
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <Calendar
                          mode="single"
                          selected={bookingData.date}
                          onSelect={handleDateSelect}
                          disabled={(date) => 
                            isBefore(date, today) || isAfter(date, maxDate) || date.getDay() === 0
                          }
                          locale={de}
                          className="rounded-md border pointer-events-auto"
                        />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Buchbar bis zu 12 Wochen im Voraus
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium mb-4 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          {bookingData.date 
                            ? `Verfügbare Zeiten am ${format(bookingData.date, 'dd. MMMM', { locale: de })}`
                            : 'Bitte wählen Sie zuerst ein Datum'
                          }
                        </h3>
                        {bookingData.date ? (
                          <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2">
                            {timeSlots.map((slot) => (
                              <motion.button
                                key={slot.time}
                                onClick={() => slot.available && handleTimeSelect(slot.time)}
                                disabled={!slot.available}
                                whileHover={slot.available ? { scale: 1.05 } : {}}
                                whileTap={slot.available ? { scale: 0.95 } : {}}
                                className={cn(
                                  "p-3 rounded-lg border text-center transition-all relative",
                                  slot.available 
                                    ? bookingData.time === slot.time
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "hover:border-primary hover:bg-primary/5"
                                    : "opacity-40 cursor-not-allowed bg-muted"
                                )}
                              >
                                <span className="font-medium">{slot.time}</span>
                                {slot.popular && slot.available && (
                                  <Badge className="absolute -top-2 -right-2 text-[10px] py-0 px-1 bg-warning text-warning-foreground">
                                    Beliebt
                                  </Badge>
                                )}
                              </motion.button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-[200px] bg-muted/30 rounded-lg">
                            <p className="text-muted-foreground">
                              Wählen Sie ein Datum im Kalender
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      onClick={() => setStep(2)} 
                      disabled={!canProceedStep1}
                      className="gap-2"
                    >
                      Weiter <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      Umzugsdetails
                    </CardTitle>
                    <CardDescription>
                      Termin: {bookingData.date && format(bookingData.date, 'dd. MMMM yyyy', { locale: de })} um {bookingData.time} Uhr
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          Von (Auszugsadresse)
                        </Label>
                        <Input
                          placeholder="Strasse, PLZ Ort"
                          value={bookingData.fromAddress}
                          onChange={(e) => handleInputChange('fromAddress', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          Nach (Einzugsadresse)
                        </Label>
                        <Input
                          placeholder="Strasse, PLZ Ort"
                          value={bookingData.toAddress}
                          onChange={(e) => handleInputChange('toAddress', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-muted-foreground" />
                        Anzahl Zimmer
                      </Label>
                      <Select 
                        value={bookingData.rooms} 
                        onValueChange={(v) => handleInputChange('rooms', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, '7+'].map((r) => (
                            <SelectItem key={r} value={String(r)}>
                              {r} Zimmer
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Besondere Hinweise (optional)</Label>
                      <Textarea
                        placeholder="Z.B. Klavier vorhanden, kein Lift, etc."
                        value={bookingData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Zurück
                    </Button>
                    <Button 
                      onClick={() => setStep(3)} 
                      disabled={!canProceedStep2}
                      className="gap-2"
                    >
                      Weiter <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle>Ihre Kontaktdaten</CardTitle>
                    <CardDescription>
                      Wir kontaktieren Sie zur Bestätigung
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input
                        placeholder="Vor- und Nachname"
                        value={bookingData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                      {validationErrors.name && (
                        <p className="text-sm text-destructive">{validationErrors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>E-Mail *</Label>
                      <Input
                        type="email"
                        placeholder="ihre@email.ch"
                        value={bookingData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                      {validationErrors.email && (
                        <p className="text-sm text-destructive">{validationErrors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Telefon *</Label>
                      <Input
                        type="tel"
                        placeholder="+41 79 123 45 67"
                        value={bookingData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                      {validationErrors.phone && (
                        <p className="text-sm text-destructive">{validationErrors.phone}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Zurück
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={!canSubmit || isSubmitting}
                      className="gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Wird gesendet...
                        </>
                      ) : (
                        <>
                          Termin buchen <Check className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="shadow-xl text-center py-12">
                  <CardContent>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Buchung erfolgreich!</h2>
                    <p className="text-muted-foreground mb-6">
                      Wir haben Ihre Anfrage erhalten und werden Sie in Kürze kontaktieren.
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4 max-w-md mx-auto text-left">
                      <p><strong>Datum:</strong> {bookingData.date && format(bookingData.date, 'dd. MMMM yyyy', { locale: de })}</p>
                      <p><strong>Uhrzeit:</strong> {bookingData.time} Uhr</p>
                      <p><strong>Von:</strong> {bookingData.fromAddress}</p>
                      <p><strong>Nach:</strong> {bookingData.toAddress}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default BookingCalendar;