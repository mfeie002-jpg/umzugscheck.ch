import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addDays, isBefore, isWeekend } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Home,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimeSlot {
  time: string;
  available: boolean;
  price: 'normal' | 'reduced' | 'premium';
}

const timeSlots: TimeSlot[] = [
  { time: '07:00', available: true, price: 'reduced' },
  { time: '08:00', available: true, price: 'normal' },
  { time: '09:00', available: false, price: 'normal' },
  { time: '10:00', available: true, price: 'normal' },
  { time: '11:00', available: true, price: 'normal' },
  { time: '12:00', available: true, price: 'reduced' },
  { time: '13:00', available: true, price: 'normal' },
  { time: '14:00', available: false, price: 'normal' },
  { time: '15:00', available: true, price: 'normal' },
  { time: '16:00', available: true, price: 'premium' },
];

const OnlineBookingWidget = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [formData, setFormData] = useState({
    rooms: '',
    fromAddress: '',
    toAddress: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedDate && selectedTime;
      case 2: return formData.rooms && formData.fromAddress && formData.toAddress;
      case 3: return formData.firstName && formData.lastName && formData.email && formData.phone;
      default: return false;
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Buchung eingegangen!",
      description: "Wir bestätigen Ihren Termin innerhalb von 2 Stunden.",
    });
    setStep(4);
  };

  const getPriceLabel = (price: TimeSlot['price']) => {
    switch (price) {
      case 'reduced': return { label: '-10%', className: 'bg-green-500/10 text-green-600' };
      case 'premium': return { label: '+15%', className: 'bg-orange-500/10 text-orange-600' };
      default: return null;
    }
  };

  const disabledDays = (date: Date) => {
    return isBefore(date, addDays(new Date(), 2));
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <CalendarDays className="w-3 h-3 mr-1" />
            Online-Buchung
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Jetzt Termin buchen
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Buchen Sie Ihren Umzugstermin in wenigen Minuten online
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                  step > s ? 'bg-green-500 text-white' :
                  step === s ? 'bg-primary text-primary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div className={`w-12 h-1 mx-1 rounded ${
                    step > s ? 'bg-green-500' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <Card className="border-primary/10">
            <CardContent className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Date & Time */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <CalendarDays className="w-12 h-12 text-primary mx-auto mb-3" />
                      <h3 className="text-xl font-semibold">Wählen Sie Datum & Uhrzeit</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Calendar */}
                      <div>
                        <Label className="mb-2 block">Umzugsdatum</Label>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={disabledDays}
                          locale={de}
                          className="rounded-lg border"
                          modifiers={{
                            weekend: (date) => isWeekend(date)
                          }}
                          modifiersStyles={{
                            weekend: { color: 'var(--primary)' }
                          }}
                        />
                        {isWeekend(selectedDate || new Date()) && selectedDate && (
                          <p className="text-xs text-primary mt-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Wochenend-Zuschlag +15%
                          </p>
                        )}
                      </div>

                      {/* Time Slots */}
                      <div>
                        <Label className="mb-2 block">Startzeit</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map((slot) => {
                            const priceLabel = getPriceLabel(slot.price);
                            return (
                              <Button
                                key={slot.time}
                                variant={selectedTime === slot.time ? 'default' : 'outline'}
                                disabled={!slot.available}
                                onClick={() => setSelectedTime(slot.time)}
                                className="relative"
                              >
                                <Clock className="w-4 h-4 mr-2" />
                                {slot.time}
                                {priceLabel && slot.available && (
                                  <Badge className={`absolute -top-2 -right-2 text-[10px] px-1 ${priceLabel.className}`}>
                                    {priceLabel.label}
                                  </Badge>
                                )}
                              </Button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                          🟢 Frühbucher-Rabatt &nbsp; 🟠 Stosszeit
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Move Details */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <Truck className="w-12 h-12 text-primary mx-auto mb-3" />
                      <h3 className="text-xl font-semibold">Umzugsdetails</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="flex items-center gap-2 mb-2">
                          <Home className="w-4 h-4" />
                          Wohnungsgrösse
                        </Label>
                        <Select value={formData.rooms} onValueChange={(v) => handleInputChange('rooms', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Anzahl Zimmer wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            {['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5+'].map((r) => (
                              <SelectItem key={r} value={r}>{r} Zimmer</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4" />
                          Von (Adresse)
                        </Label>
                        <Input 
                          placeholder="z.B. Bahnhofstrasse 1, 8001 Zürich"
                          value={formData.fromAddress}
                          onChange={(e) => handleInputChange('fromAddress', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4" />
                          Nach (Adresse)
                        </Label>
                        <Input 
                          placeholder="z.B. Marktgasse 10, 3011 Bern"
                          value={formData.toAddress}
                          onChange={(e) => handleInputChange('toAddress', e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Contact Info */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <User className="w-12 h-12 text-primary mx-auto mb-3" />
                      <h3 className="text-xl font-semibold">Ihre Kontaktdaten</h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block">Vorname</Label>
                        <Input 
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Max"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Nachname</Label>
                        <Input 
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Muster"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4" />
                        E-Mail
                      </Label>
                      <Input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="max.muster@example.ch"
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4" />
                        Telefon
                      </Label>
                      <Input 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+41 76 568 13 02"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Confirmation */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Buchung erfolgreich!</h3>
                    <p className="text-muted-foreground mb-6">
                      Wir haben Ihre Anfrage erhalten und melden uns in Kürze.
                    </p>
                    
                    <Card className="bg-muted/50 max-w-md mx-auto">
                      <CardContent className="p-4 text-left space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Datum:</span>
                          <span className="font-medium">{selectedDate && format(selectedDate, 'dd. MMMM yyyy', { locale: de })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Uhrzeit:</span>
                          <span className="font-medium">{selectedTime} Uhr</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Zimmer:</span>
                          <span className="font-medium">{formData.rooms}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Bestätigungsmail wurde versendet
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              {step < 4 && (
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(s => s - 1)}
                    disabled={step === 1}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Zurück
                  </Button>
                  
                  {step < 3 ? (
                    <Button
                      onClick={() => setStep(s => s + 1)}
                      disabled={!canProceed()}
                      className="gap-2"
                    >
                      Weiter
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceed()}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Jetzt buchen
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default OnlineBookingWidget;
