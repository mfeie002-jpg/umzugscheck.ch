import * as React from "react";
import { Calendar as CalendarIcon, Clock, Users, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import DistanceCalculator from "@/components/DistanceCalculator";
import RouteMap from "@/components/RouteMap";
import CostEstimate, { CostEstimateResult, useCostEstimate } from "@/components/CostEstimate";
import BookingPDFExport from "@/components/BookingPDFExport";
import FormStepIndicator from "@/components/FormStepIndicator";
import Confetti from "@/components/Confetti";
import SEOHead from "@/components/SEOHead";
import { z } from "zod";

const bookingSchema = z.object({
  serviceType: z.string().min(1, "Bitte wählen Sie einen Service"),
  rooms: z.string().min(1, "Bitte wählen Sie die Zimmeranzahl"),
  timeSlot: z.string().min(1, "Bitte wählen Sie ein Zeitfenster"),
  from: z.string().trim().min(1, "Auszugsadresse ist erforderlich").max(200),
  to: z.string().trim().min(1, "Einzugsadresse ist erforderlich").max(200),
  name: z.string().trim().min(1, "Name ist erforderlich").max(100),
  email: z.string().email("Ungültige E-Mail-Adresse").max(255),
  phone: z.string().regex(/^[\d\s+()-]{8,20}$/, "Ungültige Telefonnummer"),
  notes: z.string().max(1000, "Notizen dürfen maximal 1000 Zeichen lang sein").optional(),
});

const Booking = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [step, setStep] = React.useState(1);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [formData, setFormData] = React.useState({
    serviceType: "",
    timeSlot: "",
    rooms: "",
    from: "",
    to: "",
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  // Get cost estimate for PDF export
  const costEstimate = useCostEstimate(formData.from, formData.to, formData.rooms, formData.serviceType);

  const timeSlots = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00"
  ];

  const handleSubmit = () => {
    try {
      bookingSchema.parse(formData);
      setErrors({});
      setShowConfetti(true);
      toast.success("Buchungsanfrage gesendet! Wir melden uns innerhalb von 24 Stunden bei Ihnen.");
      // Reset form after delay
      setTimeout(() => {
        setStep(1);
        setDate(undefined);
        setFormData({
          serviceType: "",
          timeSlot: "",
          rooms: "",
          from: "",
          to: "",
          name: "",
          email: "",
          phone: "",
          notes: ""
        });
        setShowConfetti(false);
      }, 3000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error("Bitte überprüfen Sie Ihre Eingaben");
      }
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Online Buchung - Umzugstermin buchen | Feierabend Umzüge"
        description="Buchen Sie Ihren Umzugstermin direkt online bei Feierabend Umzüge. Einfach, schnell und transparent. Kostenlose Terminwahl und sofortige Bestätigung."
        canonical="/booking"
        keywords="umzug buchen, umzugstermin online, umzug reservieren, umzugsservice buchen zürich"
      />
      <Confetti trigger={showConfetti} />
      <Header />
      
      {/* Hero */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <h1 className="text-balance">Online Buchung</h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground px-4">
              Buchen Sie Ihren Umzugstermin direkt online. Einfach, schnell und transparent.
            </p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 sm:py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto pt-8">
            <FormStepIndicator
              steps={['Service', 'Datum', 'Details', 'Kontakt']}
              currentStep={step - 1}
              onStepClick={(s) => {
                if (s < step - 1) setStep(s + 1);
              }}
            />
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-5 sm:p-6 lg:p-8">
              {/* Step 1: Service Type */}
              {step === 1 && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Welchen Service benötigen Sie?</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">Wählen Sie die Art Ihres Umzugs</p>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {['Privatumzug', 'Büroumzug', 'Spezialumzug'].map((type) => (
                      <Card
                        key={type}
                        className={`p-4 sm:p-6 cursor-pointer transition-all hover-lift min-h-[80px] ${
                          formData.serviceType === type ? 'border-2 border-alpine' : ''
                        }`}
                        onClick={() => setFormData({ ...formData, serviceType: type })}
                      >
                        <h3 className="text-sm sm:text-base font-semibold text-center">{type}</h3>
                      </Card>
                    ))}
                  </div>
                  {errors.serviceType && <p className="text-sm text-destructive">{errors.serviceType}</p>}

                  <div className="space-y-3 sm:space-y-4">
                    <Label className="text-sm sm:text-base">Anzahl Zimmer</Label>
                    <Select value={formData.rooms} onValueChange={(value) => setFormData({ ...formData, rooms: value })}>
                      <SelectTrigger className="min-h-[44px]">
                        <SelectValue placeholder="Wählen Sie..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Zimmer</SelectItem>
                        <SelectItem value="2">2 Zimmer</SelectItem>
                        <SelectItem value="3">3 Zimmer</SelectItem>
                        <SelectItem value="4">4 Zimmer</SelectItem>
                        <SelectItem value="5+">5+ Zimmer</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.rooms && <p className="text-sm text-destructive">{errors.rooms}</p>}
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!formData.serviceType || !formData.rooms}
                    className="w-full min-h-[48px]"
                    size="lg"
                  >
                    Weiter
                  </Button>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Wählen Sie Datum und Uhrzeit</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">Verfügbare Termine</p>
                  </div>

                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      disabled={(date) => date < new Date()}
                    />
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <Label className="text-sm sm:text-base">Bevorzugte Uhrzeit</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {timeSlots.map((slot) => (
                        <Card
                          key={slot}
                          className={`p-3 sm:p-4 cursor-pointer transition-all hover-lift text-center min-h-[70px] ${
                            formData.timeSlot === slot ? 'border-2 border-alpine bg-alpine/10' : ''
                          }`}
                          onClick={() => setFormData({ ...formData, timeSlot: slot })}
                        >
                          <Clock className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-2 text-alpine" />
                          <span className="text-xs sm:text-sm font-medium">{slot}</span>
                        </Card>
                      ))}
                    </div>
                    {errors.timeSlot && <p className="text-sm text-destructive">{errors.timeSlot}</p>}
                  </div>

                  <div className="flex gap-3 sm:gap-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1 min-h-[44px]">
                      Zurück
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!date || !formData.timeSlot}
                      className="flex-1 min-h-[44px]"
                      size="lg"
                    >
                      Weiter
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Addresses */}
              {step === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Adressen</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">Woher und wohin? Geben Sie PLZ oder Stadt ein für Vorschläge.</p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <AddressAutocomplete
                      label="Von (Alte Adresse)"
                      value={formData.from}
                      onChange={(value) => setFormData({ ...formData, from: value })}
                      placeholder="PLZ oder Stadt eingeben..."
                      error={errors.from}
                      icon="from"
                    />

                    <AddressAutocomplete
                      label="Nach (Neue Adresse)"
                      value={formData.to}
                      onChange={(value) => setFormData({ ...formData, to: value })}
                      placeholder="PLZ oder Stadt eingeben..."
                      error={errors.to}
                      icon="to"
                    />

                    {/* Distance Calculator */}
                    {formData.from && formData.to && (
                      <DistanceCalculator
                        fromAddress={formData.from}
                        toAddress={formData.to}
                      />
                    )}

                    {/* Route Map - Hidden on small mobile for better UX */}
                    {formData.from && formData.to && (
                      <div className="hidden sm:block">
                        <RouteMap
                          fromAddress={formData.from}
                          toAddress={formData.to}
                        />
                      </div>
                    )}

                    <div>
                      <Label className="text-sm">Zusätzliche Informationen (optional)</Label>
                      <Textarea
                        placeholder="Besondere Anforderungen, schwere Gegenstände, etc."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        maxLength={1000}
                        className="min-h-[88px]"
                      />
                      {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
                    </div>
                  </div>

                  <div className="flex gap-3 sm:gap-4">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1 min-h-[44px]">
                      Zurück
                    </Button>
                    <Button
                      onClick={() => setStep(4)}
                      disabled={!formData.from || !formData.to}
                      className="flex-1 min-h-[44px]"
                      size="lg"
                    >
                      Weiter
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Contact Info */}
              {step === 4 && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Ihre Kontaktdaten</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">Wie können wir Sie erreichen?</p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label className="text-sm">Name *</Label>
                      <Input
                        placeholder="Ihr vollständiger Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        maxLength={100}
                        className="min-h-[44px]"
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div>
                      <Label className="text-sm">E-Mail *</Label>
                      <Input
                        type="email"
                        placeholder="ihre@email.ch"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        maxLength={255}
                        className="min-h-[44px]"
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div>
                      <Label className="text-sm">Telefon *</Label>
                      <Input
                        type="tel"
                        placeholder="+41 76 568 13 02"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        maxLength={20}
                        className="min-h-[44px]"
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Cost Estimate */}
                  <CostEstimate
                    fromAddress={formData.from}
                    toAddress={formData.to}
                    rooms={formData.rooms}
                    serviceType={formData.serviceType}
                  />

                  {/* Summary */}
                  <Card className="p-4 sm:p-6 bg-muted/50">
                    <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Zusammenfassung</h3>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div>
                        <span className="text-muted-foreground">Service</span>
                        <p className="font-medium">{formData.serviceType}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Zimmer</span>
                        <p className="font-medium">{formData.rooms}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Datum</span>
                        <p className="font-medium">{date?.toLocaleDateString('de-CH')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Zeit</span>
                        <p className="font-medium">{formData.timeSlot}</p>
                      </div>
                      <div className="col-span-2 pt-2 border-t">
                        <span className="text-muted-foreground">Von</span>
                        <p className="font-medium truncate">{formData.from}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Nach</span>
                        <p className="font-medium truncate">{formData.to}</p>
                      </div>
                    </div>
                  </Card>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex gap-2 sm:gap-3 flex-1">
                      <Button variant="outline" onClick={() => setStep(3)} className="flex-1 min-h-[44px]">
                        Zurück
                      </Button>
                      <BookingPDFExport
                        formData={{
                          serviceType: formData.serviceType,
                          rooms: formData.rooms,
                          date: date,
                          timeSlot: formData.timeSlot,
                          from: formData.from,
                          to: formData.to,
                          firstName: formData.name.split(' ')[0] || '',
                          lastName: formData.name.split(' ').slice(1).join(' ') || '',
                          email: formData.email,
                          phone: formData.phone,
                          notes: formData.notes,
                        }}
                        estimate={costEstimate}
                      />
                    </div>
                    <Button
                      onClick={handleSubmit}
                      disabled={!formData.name || !formData.email || !formData.phone}
                      className="flex-1 bg-gradient-hero min-h-[44px]"
                      size="lg"
                    >
                      Buchung absenden
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;
