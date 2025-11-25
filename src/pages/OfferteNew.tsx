import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEOHead } from "@/components/SEOHead";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle2, Clock, Phone, Mail, MapPin, Home, Calendar, Wrench, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import { z } from "zod";

const offerSchema = z.object({
  name: z.string().trim().min(2, "Name muss mindestens 2 Zeichen lang sein").max(100),
  email: z.string().trim().email("Ungültige E-Mail-Adresse").max(255),
  phone: z.string().trim().min(10, "Telefonnummer ungültig").max(20),
  fromPostal: z.string().trim().min(4).max(10),
  fromCity: z.string().trim().min(2).max(100),
  fromFloor: z.string().trim(),
  fromElevator: z.boolean(),
  toPostal: z.string().trim().min(4).max(10),
  toCity: z.string().trim().min(2).max(100),
  toFloor: z.string().trim(),
  toElevator: z.boolean(),
  moveDate: z.string(),
  flexible: z.boolean(),
  rooms: z.string().trim(),
  comments: z.string().max(1000).optional()
});

const Offerte = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fromPostal: "",
    fromCity: "",
    fromFloor: "",
    fromElevator: false,
    toPostal: "",
    toCity: "",
    toFloor: "",
    toElevator: false,
    moveDate: "",
    flexible: false,
    rooms: "",
    montage: false,
    packing: false,
    cleaning: false,
    disposal: false,
    storage: false,
    comments: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      offerSchema.parse(formData);
      
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Anfrage gesendet!",
        description: "Sie erhalten innerhalb von 24 Stunden passende Offerten.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        fromPostal: "",
        fromCity: "",
        fromFloor: "",
        fromElevator: false,
        toPostal: "",
        toCity: "",
        toFloor: "",
        toElevator: false,
        moveDate: "",
        flexible: false,
        rooms: "",
        montage: false,
        packing: false,
        cleaning: false,
        disposal: false,
        storage: false,
        comments: ""
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Eingabefehler",
          description: error.errors[0].message,
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbItems = [{ label: "Offerte" }];

  return (
    <>
      <SEOHead
        title="Kostenlose Umzugsofferte anfragen - Bis zu 5 Angebote | Umzugscheck.ch"
        description="Fordern Sie kostenlos und unverbindlich Umzugsofferten von bis zu 5 geprüften Schweizer Umzugsfirmen an. Schnell, einfach und transparent."
        keywords="umzugsofferte, offerte umzug, umzug anfragen, kostenlose offerte"
        canonical="https://umzugscheck.ch/offerte"
      />

      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={breadcrumbItems} showHome />
        </div>

        {/* Hero */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-primary/5 to-background border-b border-border">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <Badge variant="secondary" className="mb-4">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  100% kostenlos & unverbindlich
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Eine Anfrage – mehrere Umzugsofferten
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Erhalten Sie kostenlose und unverbindliche Angebote von bis zu 5 geprüften Umzugsfirmen. 
                  Vergleichen Sie transparent und wählen Sie die beste Option.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Form & Trust Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <Card className="shadow-strong">
                  <CardHeader>
                    <CardTitle className="text-2xl">Ihre Umzugsdetails</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Personendaten */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Mail className="w-5 h-5 text-primary" />
                          Kontaktdaten
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Vor- und Nachname *</Label>
                            <Input
                              id="name"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              placeholder="Max Mustermann"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">E-Mail-Adresse *</Label>
                            <Input
                              id="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              placeholder="max@beispiel.ch"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefonnummer *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="+41 79 123 45 67"
                          />
                        </div>
                      </div>

                      {/* Ausgangsadresse */}
                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          Ausgangsadresse
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fromPostal">PLZ *</Label>
                            <Input
                              id="fromPostal"
                              required
                              value={formData.fromPostal}
                              onChange={(e) => setFormData({...formData, fromPostal: e.target.value})}
                              placeholder="8000"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fromCity">Ort *</Label>
                            <Input
                              id="fromCity"
                              required
                              value={formData.fromCity}
                              onChange={(e) => setFormData({...formData, fromCity: e.target.value})}
                              placeholder="Zürich"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fromFloor">Etage</Label>
                            <Input
                              id="fromFloor"
                              value={formData.fromFloor}
                              onChange={(e) => setFormData({...formData, fromFloor: e.target.value})}
                              placeholder="z.B. 3"
                            />
                          </div>
                          <div className="flex items-center space-x-2 pt-8">
                            <Checkbox
                              id="fromElevator"
                              checked={formData.fromElevator}
                              onCheckedChange={(checked) => setFormData({...formData, fromElevator: checked === true})}
                            />
                            <Label htmlFor="fromElevator" className="cursor-pointer">
                              Lift vorhanden
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Zieladresse */}
                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Home className="w-5 h-5 text-primary" />
                          Zieladresse
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="toPostal">PLZ *</Label>
                            <Input
                              id="toPostal"
                              required
                              value={formData.toPostal}
                              onChange={(e) => setFormData({...formData, toPostal: e.target.value})}
                              placeholder="3000"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="toCity">Ort *</Label>
                            <Input
                              id="toCity"
                              required
                              value={formData.toCity}
                              onChange={(e) => setFormData({...formData, toCity: e.target.value})}
                              placeholder="Bern"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="toFloor">Etage</Label>
                            <Input
                              id="toFloor"
                              value={formData.toFloor}
                              onChange={(e) => setFormData({...formData, toFloor: e.target.value})}
                              placeholder="z.B. 2"
                            />
                          </div>
                          <div className="flex items-center space-x-2 pt-8">
                            <Checkbox
                              id="toElevator"
                              checked={formData.toElevator}
                              onCheckedChange={(checked) => setFormData({...formData, toElevator: checked === true})}
                            />
                            <Label htmlFor="toElevator" className="cursor-pointer">
                              Lift vorhanden
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Umzugsdatum & Grösse */}
                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          Umzugsdatum & Wohnungsgrösse
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="moveDate">Gewünschtes Umzugsdatum</Label>
                            <Input
                              id="moveDate"
                              type="date"
                              value={formData.moveDate}
                              onChange={(e) => setFormData({...formData, moveDate: e.target.value})}
                            />
                          </div>
                          <div className="flex items-center space-x-2 pt-8">
                            <Checkbox
                              id="flexible"
                              checked={formData.flexible}
                              onCheckedChange={(checked) => setFormData({...formData, flexible: checked === true})}
                            />
                            <Label htmlFor="flexible" className="cursor-pointer">
                              Datum ist flexibel
                            </Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rooms">Anzahl Zimmer *</Label>
                          <Input
                            id="rooms"
                            required
                            value={formData.rooms}
                            onChange={(e) => setFormData({...formData, rooms: e.target.value})}
                            placeholder="z.B. 3.5"
                          />
                        </div>
                      </div>

                      {/* Zusatzleistungen */}
                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Wrench className="w-5 h-5 text-primary" />
                          Gewünschte Zusatzleistungen
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="montage"
                              checked={formData.montage}
                              onCheckedChange={(checked) => setFormData({...formData, montage: checked === true})}
                            />
                            <Label htmlFor="montage" className="cursor-pointer">
                              Möbelmontage / Demontage
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="packing"
                              checked={formData.packing}
                              onCheckedChange={(checked) => setFormData({...formData, packing: checked === true})}
                            />
                            <Label htmlFor="packing" className="cursor-pointer">
                              Einpackservice
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="cleaning"
                              checked={formData.cleaning}
                              onCheckedChange={(checked) => setFormData({...formData, cleaning: checked === true})}
                            />
                            <Label htmlFor="cleaning" className="cursor-pointer">
                              Endreinigung mit Abnahmegarantie
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="disposal"
                              checked={formData.disposal}
                              onCheckedChange={(checked) => setFormData({...formData, disposal: checked === true})}
                            />
                            <Label htmlFor="disposal" className="cursor-pointer">
                              Entsorgung / Räumung
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="storage"
                              checked={formData.storage}
                              onCheckedChange={(checked) => setFormData({...formData, storage: checked === true})}
                            />
                            <Label htmlFor="storage" className="cursor-pointer">
                              Zwischenlagerung
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Besonderheiten */}
                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-lg font-semibold">Besonderheiten / Anmerkungen</h3>
                        <Textarea
                          id="comments"
                          value={formData.comments}
                          onChange={(e) => setFormData({...formData, comments: e.target.value})}
                          placeholder="z.B. Klaviertransport, Aquarium, schwere Möbel, enge Treppe..."
                          rows={4}
                          maxLength={1000}
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.comments.length}/1000 Zeichen
                        </p>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-6">
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full shadow-accent"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Wird gesendet..." : "Offerte jetzt anfordern"}
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <p className="text-center text-sm text-muted-foreground mt-4">
                          Kostenlos • Unverbindlich • Keine versteckten Kosten
                        </p>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Trust Sidebar */}
              <div className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="text-xl">So läuft es ab</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className="font-medium mb-1">Formular absenden</p>
                        <p className="text-sm text-muted-foreground">
                          Ihre Anfrage wird verschlüsselt übertragen
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-medium mb-1">Offerten erhalten</p>
                        <p className="text-sm text-muted-foreground">
                          Innerhalb von 24h erhalten Sie Angebote per E-Mail
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <p className="font-medium mb-1">Vergleichen & wählen</p>
                        <p className="text-sm text-muted-foreground">
                          Sie entscheiden, welche Firma Sie beauftragen
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-medium bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Ihre Vorteile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span className="text-sm">100% kostenlos & unverbindlich</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span className="text-sm">Nur geprüfte Firmen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span className="text-sm">Bis zu 5 Offerten</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span className="text-sm">Antwort in 24h</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-medium">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">Schweizer Plattform</p>
                        <p className="text-xs text-muted-foreground">
                          Unabhängig und neutral
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">Datenschutz garantiert</p>
                        <p className="text-xs text-muted-foreground">
                          Ihre Daten werden vertraulich behandelt
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Offerte;
