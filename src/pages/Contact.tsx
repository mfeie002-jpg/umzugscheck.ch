import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Calculator, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FAQAccordion, type FAQItem } from "@/components/FAQAccordion";
import { Link } from "react-router-dom";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

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

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedCard = ({ children, delay = 0, className }: AnimatedCardProps) => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Nachricht gesendet!",
      description: "Wir melden uns innerhalb von 24 Stunden bei Ihnen.",
    });
    
    setIsSubmitting(false);
  };

  return (
    <>
      <OptimizedSEO
        title="Kontakt - Wir helfen Ihnen gerne weiter"
        description="Haben Sie Fragen zu Ihrem Umzug? Kontaktieren Sie uns – wir sind für Sie da und helfen Ihnen gerne weiter."
        keywords="umzug kontakt, umzugsberatung, umzugshilfe"
        canonicalUrl="https://umzugscheck.ch/kontakt"
      />

      <div className="min-h-screen flex flex-col">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs items={[{ label: "Kontakt" }]} />
        </div>
        
        <main className="flex-1">
          {/* Hero Section */}
          <PageSection variant="primary" spacing="lg" className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Kontaktieren Sie uns
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Haben Sie Fragen zu Ihrem Umzug oder unserem Service? 
                Wir sind für Sie da und helfen Ihnen gerne weiter.
              </p>
            </div>
          </PageSection>

          {/* Contact Form & Info */}
          <PageSection variant="muted">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <AnimatedCard className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-6 h-6 text-primary" aria-hidden="true" />
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
                          <Input id="name" placeholder="Max Mustermann" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-Mail-Adresse *</Label>
                          <Input id="email" type="email" placeholder="max@beispiel.ch" required />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefonnummer</Label>
                          <Input id="phone" type="tel" placeholder="+41 79 123 45 67" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Betreff *</Label>
                          <Input id="subject" placeholder="Ihre Anfrage" required />
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
                        size="lg"
                        className="w-full md:w-auto"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Wird gesendet..." : "Nachricht senden"}
                        <Send className="ml-2 w-4 h-4" aria-hidden="true" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </AnimatedCard>

              {/* Contact Info */}
              <div className="space-y-6">
                <AnimatedCard delay={100}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Kontaktinformationen</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
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
                          <Phone className="w-5 h-5 text-primary" aria-hidden="true" />
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
                          <MapPin className="w-5 h-5 text-primary" aria-hidden="true" />
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
                </AnimatedCard>

                <AnimatedCard delay={200}>
                  <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold">
                        <Clock className="w-5 h-5" aria-hidden="true" />
                        Schnelle Antwort garantiert
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Wir beantworten Ihre Anfrage in der Regel innerhalb von 24 Stunden an Werktagen.
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedCard>

                {/* Quick Links */}
                <AnimatedCard delay={300}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Schnellzugriff</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Link to="/umzugsofferten" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group">
                        <Calculator className="w-5 h-5 text-primary" aria-hidden="true" />
                        <div>
                          <div className="font-medium group-hover:text-primary transition-colors">Kostenrechner</div>
                          <div className="text-xs text-muted-foreground">Preise berechnen</div>
                        </div>
                      </Link>
                      <Link to="/firmen" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group">
                        <MessageSquare className="w-5 h-5 text-primary" aria-hidden="true" />
                        <div>
                          <div className="font-medium group-hover:text-primary transition-colors">Firmen vergleichen</div>
                          <div className="text-xs text-muted-foreground">Alle Anbieter</div>
                        </div>
                      </Link>
                      <Link to="/faq" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group">
                        <HelpCircle className="w-5 h-5 text-primary" aria-hidden="true" />
                        <div>
                          <div className="font-medium group-hover:text-primary transition-colors">FAQ</div>
                          <div className="text-xs text-muted-foreground">Häufige Fragen</div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </div>
            </div>

            {/* Map Placeholder */}
            <AnimatedCard className="max-w-6xl mx-auto mt-12">
              <Card className="overflow-hidden">
                <div className="h-64 md:h-80 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center border-b">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-3" aria-hidden="true" />
                    <p className="text-muted-foreground font-medium">Standort Zürich</p>
                    <p className="text-sm text-muted-foreground">Musterstrasse 123, 8000 Zürich</p>
                  </div>
                </div>
              </Card>
            </AnimatedCard>

            {/* FAQ Section */}
            <div className="max-w-6xl mx-auto mt-16">
              <SectionHeading
                title="Häufig gestellte Fragen"
                subtitle="Vielleicht finden Sie hier bereits die Antwort auf Ihre Frage."
                align="center"
              />
              <div className="mt-8">
                <FAQAccordion items={contactFAQs} variant="compact" />
              </div>
            </div>
          </PageSection>
        </main>
      </div>
    </>
  );
};

export default Contact;
