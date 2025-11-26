import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin, Home, User, Mail, Phone, ArrowRight, Sparkles } from "lucide-react";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const formSchema = z.object({
  fromAddress: z.string().trim().min(3, "Bitte geben Sie eine gültige Adresse ein").max(200),
  toAddress: z.string().trim().min(3, "Bitte geben Sie eine gültige Adresse ein").max(200),
  rooms: z.string().min(1, "Bitte wählen Sie die Zimmeranzahl"),
  name: z.string().trim().min(2, "Name erforderlich").max(100),
  email: z.string().trim().email("Ungültige E-Mail-Adresse").max(255),
  phone: z.string().trim().min(10, "Telefonnummer erforderlich").max(20),
});

const OffertenPage = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fromAddress: "",
    toAddress: "",
    rooms: "",
    services: [] as string[],
    name: "",
    email: "",
    phone: "",
  });
  const [recentActivity, setRecentActivity] = useState("Vanessa aus Luzern");

  useEffect(() => {
    const names = ["Vanessa aus Luzern", "Thomas aus Zürich", "Sarah aus Bern", "Marco aus Basel"];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % names.length;
      setRecentActivity(names[idx]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const progress = (step / 4) * 100;

  const handleNext = () => {
    if (step === 1) {
      const result = z.object({
        fromAddress: formSchema.shape.fromAddress,
        toAddress: formSchema.shape.toAddress,
      }).safeParse(formData);
      
      if (!result.success) {
        toast({
          title: "Fehler",
          description: result.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }
    
    if (step === 2) {
      if (!formData.rooms) {
        toast({
          title: "Fehler",
          description: "Bitte wählen Sie die Zimmeranzahl",
          variant: "destructive",
        });
        return;
      }
    }

    if (step === 4) {
      const result = formSchema.safeParse(formData);
      if (!result.success) {
        toast({
          title: "Fehler",
          description: result.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
      
      // Submit form
      toast({
        title: "Offerte angefordert!",
        description: "Sie erhalten bald kostenlose Offerten von geprüften Firmen.",
      });
      return;
    }

    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge className="mb-4 bg-success/10 text-success border-success/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                100% Kostenlos
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Erhalte jetzt kostenlose Umzugsofferten
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Nur geprüfte Schweizer Profis. Keine versteckten Kosten.
              </p>
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                alt="Happy movers helping family"
                className="rounded-2xl shadow-xl mx-auto"
              />
            </div>

            {/* Main Form */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-card rounded-3xl shadow-2xl p-8 border border-border">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Schritt {step} von 4</span>
                    <span className="text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Step 1: Addresses */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Umzugsdetails</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="from">Startadresse</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="from"
                            placeholder="z.B. Zürich, Bahnhofstrasse 1"
                            value={formData.fromAddress}
                            onChange={(e) => setFormData({ ...formData, fromAddress: e.target.value })}
                            className="pl-11 h-12"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="to">Zieladresse</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="to"
                            placeholder="z.B. Bern, Bundesplatz 3"
                            value={formData.toAddress}
                            onChange={(e) => setFormData({ ...formData, toAddress: e.target.value })}
                            className="pl-11 h-12"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Rooms */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Wohnungsgröße</h2>
                    <div>
                      <Label htmlFor="rooms">Zimmeranzahl</Label>
                      <Select value={formData.rooms} onValueChange={(value) => setFormData({ ...formData, rooms: value })}>
                        <SelectTrigger id="rooms" className="h-12">
                          <SelectValue placeholder="Wählen Sie..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Zimmer</SelectItem>
                          <SelectItem value="2">2 Zimmer</SelectItem>
                          <SelectItem value="3">3 Zimmer</SelectItem>
                          <SelectItem value="4">4 Zimmer</SelectItem>
                          <SelectItem value="5">5+ Zimmer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 3: Services (Optional) */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Zusatzservices (optional)</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {["Reinigung", "Entsorgung", "Verpackung", "Montage"].map((service) => (
                        <button
                          key={service}
                          onClick={() => {
                            const services = formData.services.includes(service)
                              ? formData.services.filter((s) => s !== service)
                              : [...formData.services, service];
                            setFormData({ ...formData, services });
                          }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            formData.services.includes(service)
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <CheckCircle2 className={`h-6 w-6 mb-2 ${formData.services.includes(service) ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="font-medium">{service}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Sie können auch ohne Zusatzservices fortfahren
                    </p>
                  </div>
                )}

                {/* Step 4: Contact */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Kontaktdaten</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="name"
                            placeholder="Ihr Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="pl-11 h-12"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">E-Mail</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="ihre@email.ch"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="pl-11 h-12"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="phone"
                            placeholder="+41 XX XXX XX XX"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="pl-11 h-12"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex gap-4">
                  {step > 1 && (
                    <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                      Zurück
                    </Button>
                  )}
                  <Button onClick={handleNext} className="flex-1 h-12" size="lg">
                    {step === 4 ? "Offerten erhalten" : "Weiter"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Why Fill This Out */}
              <div className="mt-8 grid md:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <CheckCircle2 className="h-10 w-10 text-success mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Gratis & unverbindlich</h3>
                  <p className="text-sm text-muted-foreground">Keine Kosten, keine Verpflichtung</p>
                </div>
                <div className="text-center p-6">
                  <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Schnelle Antwort</h3>
                  <p className="text-sm text-muted-foreground">Offerten innerhalb 24h</p>
                </div>
                <div className="text-center p-6">
                  <CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Bessere Preise</h3>
                  <p className="text-sm text-muted-foreground">Bis zu 40% sparen</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 rounded-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-800">
                    {recentActivity} hat vor 3 Minuten eine Offerte erhalten.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
      <StickyMobileCTA />
    </div>
  );
};

export default OffertenPage;
