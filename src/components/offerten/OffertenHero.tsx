import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Percent, Sparkles, Lock, ArrowRight, CheckCircle2, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-family-moving.jpg";

const OffertenHero = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Read query parameters
  const initialFrom = searchParams.get("from") || "";
  const initialTo = searchParams.get("to") || "";
  const initialRooms = searchParams.get("rooms") || "";
  const hasParams = !!(initialFrom || initialTo || initialRooms);

  const [formData, setFormData] = useState({
    fromLocation: initialFrom,
    toLocation: initialTo,
    rooms: initialRooms,
    moveDate: "",
    flexibleDates: false,
    name: "",
    email: "",
    phone: "",
  });
  
  const [step, setStep] = useState(hasParams ? 2 : 1); // Start at step 2 if params exist
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show notification if params were transferred
  useEffect(() => {
    if (hasParams) {
      toast({
        title: "Angaben übernommen",
        description: "Wir haben Ihre Angaben übernommen. Bitte überprüfen und ergänzen Sie die Daten.",
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate step 1
      if (!formData.fromLocation || !formData.toLocation || !formData.rooms) {
        toast({
          title: "Bitte alle Felder ausfüllen",
          description: "Start, Ziel und Wohnungsgrösse sind erforderlich.",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
      return;
    }
    
    // Step 2: Submit form
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Kontaktdaten erforderlich",
        description: "Bitte geben Sie Name, E-Mail und Telefon an.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Anfrage gesendet!",
      description: "Sie erhalten in Kürze Offerten von passenden Umzugsfirmen.",
    });
    
    setIsSubmitting(false);
    
    // Reset or redirect
    setFormData({
      fromLocation: "",
      toLocation: "",
      rooms: "",
      moveDate: "",
      flexibleDates: false,
      name: "",
      email: "",
      phone: "",
    });
    setStep(1);
  };

  const trustBadges = [
    { icon: Shield, text: "Geprüfte Firmen" },
    { icon: Percent, text: "Bis zu 40 % sparen" },
    { icon: Sparkles, text: "100 % kostenlos" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/30" />
      
      <div className="container relative z-10 mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            {/* Label */}
            <span className="inline-block px-4 py-2 bg-primary/20 text-primary-foreground rounded-full text-sm font-medium mb-6 border border-primary/30">
              Umzug planen? Wir vergleichen für Sie.
            </span>
            
            {/* Headlines */}
            <h1 className="font-manrope text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2">
              Umzugsofferten vergleichen.
            </h1>
            <p className="font-manrope text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Kostenlos & unverbindlich.
            </p>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl">
              Vergleichen Sie Offerten von über 200 geprüften Umzugsfirmen in der ganzen Schweiz. 
              Sie erhalten mehrere Angebote, sparen Zeit und bis zu 40 % der Umzugskosten.
            </p>
            
            {/* Bullet Points */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <span className="text-white/90">Nur geprüfte Schweizer Umzugsfirmen</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Percent className="w-5 h-5 text-primary" />
                </div>
                <span className="text-white/90">Bis zu 40 % sparen dank Offertenvergleich</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <span className="text-white/90">100 % kostenlos & unverbindlich</span>
              </li>
            </ul>

            {/* Trust Badges - Mobile */}
            <div className="flex flex-wrap gap-3 lg:hidden">
              {trustBadges.map((badge, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                >
                  <badge.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            id="offerten-form"
          >
            <form 
              onSubmit={handleSubmit}
              className="bg-card rounded-3xl shadow-2xl p-6 md:p-8 border border-border"
            >
              {/* Progress Indicator */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  1
                </div>
                <div className={`flex-1 h-1 rounded ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  2
                </div>
              </div>

              <h3 className="font-manrope text-xl font-bold text-foreground mb-2">
                {step === 1 ? "Umzugsdetails angeben" : "Kontaktdaten eingeben"}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {step === 1 ? "Schritt 1 von 2: Wohin geht Ihr Umzug?" : "Schritt 2 von 2: Wie können wir Sie erreichen?"}
              </p>

              {/* Transferred Data Info */}
              {hasParams && step === 1 && (
                <div className="flex items-start gap-3 p-4 mb-6 bg-primary/10 rounded-xl border border-primary/20">
                  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Angaben übernommen</p>
                    <p className="text-muted-foreground">Bitte überprüfen Sie die Daten und ergänzen Sie fehlende Angaben.</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-5">
                {step === 1 ? (
                  <>
                    {/* From Location */}
                    <div>
                      <Label htmlFor="fromLocation" className="text-sm font-medium text-foreground mb-2 block">
                        Start-PLZ / Ort *
                      </Label>
                      <Input
                        id="fromLocation"
                        placeholder="z.B. 8001 Zürich"
                        value={formData.fromLocation}
                        onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>

                    {/* To Location */}
                    <div>
                      <Label htmlFor="toLocation" className="text-sm font-medium text-foreground mb-2 block">
                        Ziel-PLZ / Ort *
                      </Label>
                      <Input
                        id="toLocation"
                        placeholder="z.B. 3001 Bern"
                        value={formData.toLocation}
                        onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>

                    {/* Room Size */}
                    <div>
                      <Label htmlFor="rooms" className="text-sm font-medium text-foreground mb-2 block">
                        Wohnungsgrösse *
                      </Label>
                      <Select 
                        value={formData.rooms} 
                        onValueChange={(value) => setFormData({ ...formData, rooms: value })}
                      >
                        <SelectTrigger id="rooms" className="h-12 rounded-xl">
                          <SelectValue placeholder="Bitte wählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-1.5">1–1.5-Zimmer</SelectItem>
                          <SelectItem value="2-2.5">2–2.5-Zimmer</SelectItem>
                          <SelectItem value="3-3.5">3–3.5-Zimmer</SelectItem>
                          <SelectItem value="4-4.5">4–4.5-Zimmer</SelectItem>
                          <SelectItem value="5.5+">5.5-Zimmer & grösser / Haus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Move Date */}
                    <div>
                      <Label htmlFor="moveDate" className="text-sm font-medium text-foreground mb-2 block">
                        Umzugsdatum (optional)
                      </Label>
                      <Input
                        id="moveDate"
                        type="date"
                        value={formData.moveDate}
                        onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
                        className="h-12 rounded-xl"
                      />
                    </div>

                    {/* Flexible Dates */}
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="flexibleDates"
                        checked={formData.flexibleDates}
                        onCheckedChange={(checked) => setFormData({ ...formData, flexibleDates: checked as boolean })}
                      />
                      <Label htmlFor="flexibleDates" className="text-sm text-muted-foreground cursor-pointer">
                        Flexible Termine möglich
                      </Label>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Summary of Step 1 */}
                    <div className="p-4 bg-muted/50 rounded-xl space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Von:</span>
                        <span className="font-medium text-foreground">{formData.fromLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nach:</span>
                        <span className="font-medium text-foreground">{formData.toLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Grösse:</span>
                        <span className="font-medium text-foreground">{formData.rooms} Zimmer</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-primary text-xs underline mt-2"
                      >
                        Angaben ändern
                      </button>
                    </div>

                    {/* Name */}
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Ihr vollständiger Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                        E-Mail *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ihre@email.ch"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-foreground mb-2 block">
                        Telefon *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+41 79 123 45 67"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Wird gesendet..."
                  ) : step === 1 ? (
                    <>
                      Weiter zu Kontaktdaten
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 w-5 h-5" />
                      Jetzt Offerten erhalten
                    </>
                  )}
                </Button>

                {/* Security Note */}
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Ihre Daten werden vertraulich behandelt und nur an passende Anbieter weitergegeben.
                  </span>
                </div>
              </div>
            </form>

            {/* Trust Badges - Desktop */}
            <div className="hidden lg:flex justify-center gap-4 mt-6">
              {trustBadges.map((badge, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border shadow-sm"
                >
                  <badge.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OffertenHero;
