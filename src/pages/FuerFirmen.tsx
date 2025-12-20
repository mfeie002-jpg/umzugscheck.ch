import { useState } from "react";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, TrendingUp, Users, Shield, Award, 
  BarChart3, Clock, BadgeCheck, ArrowRight, Phone, Mail,
  Building2, MapPin, Star, Zap
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ROICalculator } from "@/components/ROICalculator";
import { BusinessAnalysisReport } from "@/components/business/BusinessAnalysisReport";

const FuerFirmen = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    city: "",
    employees: "",
    services: [] as string[],
    message: "",
    agbAccepted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agbAccepted) {
      toast.error("Bitte akzeptieren Sie die AGB");
      return;
    }
    setIsSubmitting(true);
    
    try {
      // In production, this would submit to Supabase
      console.log("Partner application:", formData);
      toast.success("Bewerbung erfolgreich eingereicht!", {
        description: "Wir melden uns innerhalb von 48 Stunden bei Ihnen."
      });
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        city: "",
        employees: "",
        services: [],
        message: "",
        agbAccepted: false,
      });
    } catch (error) {
      toast.error("Fehler beim Senden der Bewerbung");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const benefits = [
    { icon: Users, title: "Qualifizierte Leads", description: "Vollständige Kundendaten und verifizierte Anfragen aus Ihrer Region" },
    { icon: TrendingUp, title: "Mehr Aufträge", description: "Kontinuierlich neue Anfragen für höhere Auslastung" },
    { icon: Shield, title: "Qualitätssiegel", description: "Verifiziert-Badge stärkt Ihr Vertrauen bei Kunden" },
    { icon: BarChart3, title: "Dashboard & Analytics", description: "Lead-Management, Statistiken und transparente Abrechnung" },
    { icon: Clock, title: "Schnelle Auszahlung", description: "Klare Preismodelle und pünktliche Zahlungen" },
    { icon: Award, title: "Top-Ranking", description: "Bessere Sichtbarkeit durch Premium-Platzierungen" },
  ];

  const pricingModels = [
    { 
      name: "Pay-per-Lead",
      price: "ab CHF 25",
      unit: "pro Lead",
      features: ["Nur zahlen bei Interesse", "Keine monatlichen Gebühren", "Flexible Skalierung"],
      recommended: false
    },
    { 
      name: "Premium Partner",
      price: "ab CHF 199",
      unit: "pro Monat",
      features: ["Unbegrenzte Leads", "Top-Ranking Position", "Verifiziert-Badge", "Priority Support"],
      recommended: true
    },
    { 
      name: "Enterprise",
      price: "Individuell",
      unit: "auf Anfrage",
      features: ["Exklusive Regionen", "Dedizierter Account Manager", "API-Zugang", "Custom Reporting"],
      recommended: false
    },
  ];

  const faqs = [
    { q: "Wie werden die Leads generiert?", a: "Leads entstehen durch Kundenanfragen auf unserer Plattform. Kunden nutzen unseren Umzugsrechner, vergleichen Firmen und fordern Offerten an. Diese Anfragen werden an passende Partner in der jeweiligen Region weitergeleitet." },
    { q: "Was kostet die Partnerschaft?", a: "Wir bieten flexible Preismodelle: Pay-per-Lead ab CHF 25 pro qualifiziertem Lead oder monatliche Premium-Pakete mit unbegrenzten Leads und Top-Platzierung." },
    { q: "Wie werde ich Partner?", a: "Füllen Sie das Bewerbungsformular aus. Nach Prüfung Ihrer Unterlagen (Handelsregistereintrag, Versicherungsnachweis) werden Sie freigeschaltet und erhalten Zugang zum Partner-Dashboard." },
    { q: "Kann ich meine Regionen selbst wählen?", a: "Ja, Sie definieren selbst, aus welchen Regionen Sie Anfragen erhalten möchten. Das können einzelne Kantone, Städte oder die ganze Schweiz sein." },
    { q: "Wie schnell erhalte ich Leads?", a: "Nach Freischaltung Ihres Accounts erhalten Sie sofort Anfragen aus Ihren gewählten Regionen. Die Menge hängt von Region und Saison ab." },
    { q: "Was passiert bei unqualifizierten Leads?", a: "Bei nachweislich falschen Kontaktdaten oder Spam-Anfragen erstatten wir die Lead-Kosten. Unser Support prüft jeden gemeldeten Fall innerhalb von 48 Stunden." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Für Umzugsfirmen & Partner – Mehr Aufträge generieren"
        description="Werden Sie Partner von umzugscheck.ch und erhalten Sie qualifizierte Umzugsanfragen. Transparente Preise, geprüfte Leads und einfache Verwaltung."
        canonicalUrl="https://umzugscheck.ch/fuer-firmen"
        keywords="Umzugsfirmen Partner, Umzugsaufträge, Leads für Umzugsfirmen, B2B Umzug"
      />

      <main id="main-content" role="main">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-95" />
          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal>
              <div className="text-center max-w-4xl mx-auto text-white">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Building2 className="w-4 h-4" />
                  Partner-Programm
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Mehr Umzugsaufträge für Ihre Firma
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Werden Sie Partner bei umzugscheck.ch und erhalten Sie qualifizierte Leads 
                  von Kunden, die aktiv nach Umzugsfirmen suchen.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="#bewerbung">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                      Jetzt Partner werden
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </a>
                  <Link to="/anbieter/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                      Zum Partner-Login
                    </Button>
                  </Link>
                </div>

                {/* Trust Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-3xl mx-auto">
                  {[
                    { value: "200+", label: "Partner-Firmen" },
                    { value: "5'000+", label: "Leads/Monat" },
                    { value: "92%", label: "Zufriedenheit" },
                    { value: "< 24h", label: "Lead-Zustellung" },
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                      <div className="text-sm text-white/70">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ihre Vorteile als Partner
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Profitieren Sie von unserer etablierten Plattform und gewinnen Sie neue Kunden
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <ScrollReveal key={benefit.title} delay={0.1 * index}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <benefit.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  So funktioniert die Partnerschaft
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  In 4 einfachen Schritten zum erfolgreichen Partner
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { step: "1", icon: Building2, title: "Bewerbung", description: "Firmendaten eingeben und Bewerbung absenden" },
                { step: "2", icon: BadgeCheck, title: "Prüfung", description: "Wir verifizieren Ihre Dokumente (HR, Versicherung)" },
                { step: "3", icon: MapPin, title: "Einrichtung", description: "Regionen wählen und Profil vervollständigen" },
                { step: "4", icon: Zap, title: "Leads erhalten", description: "Sofort qualifizierte Anfragen bekommen" },
              ].map((item, index) => (
                <ScrollReveal key={item.step} delay={0.1 * index}>
                  <div className="text-center relative">
                    {index < 3 && (
                      <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
                    )}
                    <div className="relative z-10 w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Berechnen Sie Ihren potenziellen Ertrag
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Sehen Sie, wie viele Leads und Aufträge Sie mit Ihrem Budget erwarten können.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>Qualifizierte Leads aus Ihrer Region</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>Durchschnittlich 25% Conversion-Rate</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>Flexibles Budget, keine Mindestlaufzeit</span>
                    </li>
                  </ul>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <ROICalculator onGetStarted={() => document.getElementById('bewerbung')?.scrollIntoView({ behavior: 'smooth' })} />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Business Analysis Report - Full Analysis */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <BusinessAnalysisReport />
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Transparente Preismodelle
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Wählen Sie das Modell, das zu Ihrem Geschäft passt
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pricingModels.map((model, index) => (
                <ScrollReveal key={model.name} delay={0.1 * index}>
                  <Card className={`h-full relative ${model.recommended ? 'border-primary shadow-lg' : ''}`}>
                    {model.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                        Empfohlen
                      </div>
                    )}
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-xl">{model.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">{model.price}</span>
                        <span className="text-muted-foreground text-sm ml-1">{model.unit}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {model.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <a href="#bewerbung" className="block mt-6">
                        <Button className="w-full" variant={model.recommended ? "default" : "outline"}>
                          Auswählen
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="bewerbung" className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Partner werden
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Füllen Sie das Formular aus und wir melden uns innerhalb von 48 Stunden
                  </p>
                </div>
              </ScrollReveal>

              <Card>
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Firmenname *</label>
                        <Input
                          placeholder="Ihre Firma GmbH"
                          value={formData.companyName}
                          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Ansprechpartner *</label>
                        <Input
                          placeholder="Max Muster"
                          value={formData.contactName}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4" /> E-Mail *
                        </label>
                        <Input
                          type="email"
                          placeholder="kontakt@firma.ch"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Phone className="w-4 h-4" /> Telefon *
                        </label>
                        <Input
                          type="tel"
                          placeholder="+41 44 123 45 67"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Standort *
                        </label>
                        <Input
                          placeholder="Zürich"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Anzahl Mitarbeiter</label>
                        <Select value={formData.employees} onValueChange={(v) => setFormData(prev => ({ ...prev, employees: v }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Bitte wählen..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-5">1-5 Mitarbeiter</SelectItem>
                            <SelectItem value="6-15">6-15 Mitarbeiter</SelectItem>
                            <SelectItem value="16-50">16-50 Mitarbeiter</SelectItem>
                            <SelectItem value="50+">50+ Mitarbeiter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Angebotene Services</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {["Privatumzug", "Firmenumzug", "Reinigung", "Entsorgung", "Lagerung", "International"].map((service) => (
                          <button
                            key={service}
                            type="button"
                            onClick={() => toggleService(service)}
                            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                              formData.services.includes(service)
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            {service}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nachricht (optional)</label>
                      <Textarea
                        placeholder="Zusätzliche Informationen über Ihre Firma..."
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        rows={4}
                      />
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="agb"
                        checked={formData.agbAccepted}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agbAccepted: !!checked }))}
                      />
                      <label htmlFor="agb" className="text-sm text-muted-foreground cursor-pointer">
                        Ich akzeptiere die <Link to="/agb" className="text-primary hover:underline">AGB</Link> und 
                        die <Link to="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</Link> *
                      </label>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Wird gesendet..." : "Bewerbung absenden"}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Häufige Fragen
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Antworten auf die wichtigsten Fragen für Partner
                  </p>
                </div>
              </ScrollReveal>

              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border rounded-xl px-6">
                    <AccordionTrigger className="text-left font-medium py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Bereit für mehr Aufträge?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Starten Sie jetzt und erhalten Sie innerhalb weniger Tage Ihre ersten qualifizierten Leads.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="#bewerbung">
                    <Button size="lg" className="w-full sm:w-auto">
                      Jetzt Partner werden
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </a>
                  <a href="tel:+41441234567">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      <Phone className="mr-2 w-4 h-4" />
                      Uns anrufen
                    </Button>
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FuerFirmen;
