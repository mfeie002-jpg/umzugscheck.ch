import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Calculator, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FAQAccordion, type FAQItem } from "@/components/FAQAccordion";
import { Link } from "react-router-dom";

const contactFAQs: FAQItem[] = [
  {
    question: "Ist der Service wirklich kostenlos?",
    answer: "Ja, unser Vergleichsservice ist 100% kostenlos und unverbindlich. Sie zahlen nur für den Umzug selbst, wenn Sie sich für eine Firma entscheiden.",
  },
  {
    question: "Wie viele Offerten erhalte ich?",
    answer: "Sie erhalten bis zu 5 kostenlose Offerten von geprüften Umzugsfirmen in Ihrer Region. So können Sie Preise und Leistungen optimal vergleichen.",
  },
  {
    question: "Sind alle Firmen geprüft?",
    answer: "Ja, wir arbeiten nur mit geprüften und zertifizierten Umzugsfirmen zusammen. Alle Partner haben eine gültige Betriebshaftpflichtversicherung.",
  },
  {
    question: "Wie schnell erhalte ich Angebote?",
    answer: "Nach Ihrer Anfrage erhalten Sie in der Regel innerhalb von 24-48 Stunden die ersten Offerten von interessierten Umzugsfirmen.",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Nachricht gesendet!",
      description: "Wir melden uns innerhalb von 24 Stunden bei Ihnen.",
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="mb-6">Kontaktieren Sie uns</h1>
              <p className="text-lg md:text-xl text-white/90">
                Haben Sie Fragen zu Ihrem Umzug oder unserem Service? 
                Wir sind für Sie da und helfen Ihnen gerne weiter.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 md:py-24 bg-gradient-light">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <Card className="lg:col-span-2 shadow-strong">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-6 h-6 text-primary" />
                    Nachricht senden
                  </CardTitle>
                  <CardDescription>
                    Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Vor- und Nachname *</Label>
                        <Input 
                          id="name" 
                          placeholder="Max Mustermann" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-Mail-Adresse *</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="max@beispiel.ch" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefonnummer</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="+41 79 123 45 67" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Betreff *</Label>
                        <Input 
                          id="subject" 
                          placeholder="Ihre Anfrage" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Nachricht *</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Beschreiben Sie Ihr Anliegen..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full md:w-auto bg-accent hover:bg-accent/90 shadow-accent"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Wird gesendet..." : "Nachricht senden"}
                      <Send className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="text-xl">Kontaktinformationen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">E-Mail</div>
                        <a href="mailto:info@umzugscheck.ch" className="text-muted-foreground hover:text-primary transition-colors">
                          info@umzugscheck.ch
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Telefon</div>
                        <a href="tel:+41445555555" className="text-muted-foreground hover:text-primary transition-colors">
                          +41 44 555 55 55
                        </a>
                        <div className="text-sm text-muted-foreground mt-1">
                          Mo-Fr: 08:00 - 18:00 Uhr
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Adresse</div>
                        <div className="text-muted-foreground">
                          Umzugscheck GmbH<br />
                          Musterstrasse 123<br />
                          8000 Zürich<br />
                          Schweiz
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-medium bg-success/5 border-success/20">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-success font-semibold">
                      <Clock className="w-5 h-5" />
                      Schnelle Antwort garantiert
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Wir beantworten Ihre Anfrage in der Regel innerhalb von 24 Stunden an Werktagen.
                    </p>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="text-lg">Schnellzugriff</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to="/rechner" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors group">
                      <Calculator className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium group-hover:text-primary transition-colors">Kostenrechner</div>
                        <div className="text-xs text-muted-foreground">Preise berechnen</div>
                      </div>
                    </Link>
                    <Link to="/firmen" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors group">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium group-hover:text-primary transition-colors">Firmen vergleichen</div>
                        <div className="text-xs text-muted-foreground">Alle Anbieter</div>
                      </div>
                    </Link>
                    <Link to="#faq" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors group">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium group-hover:text-primary transition-colors">FAQ</div>
                        <div className="text-xs text-muted-foreground">Häufige Fragen</div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="max-w-6xl mx-auto mt-12">
              <Card className="shadow-strong overflow-hidden">
                <div className="h-64 md:h-80 bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center border-b">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">Standort Zürich</p>
                    <p className="text-sm text-muted-foreground">Musterstrasse 123, 8000 Zürich</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* FAQ Section */}
            <div id="faq" className="max-w-6xl mx-auto mt-16">
              <FAQAccordion
                items={contactFAQs}
                title="Häufig gestellte Fragen"
                subtitle="Vielleicht finden Sie hier bereits die Antwort auf Ihre Frage."
                variant="compact"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
