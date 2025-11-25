import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Clock, Send, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEOHead } from "@/components/SEOHead";

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
      <SEOHead
        title="Kontakt - Umzugscheck.ch"
        description="Kontaktieren Sie uns bei Fragen zu Ihrem Umzug oder unserem Vergleichsservice. Schnelle Antwort garantiert."
        canonical="https://umzugscheck.ch/kontakt"
      />
      
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1">
          {/* Hero */}
          <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Kontakt</h1>
                <p className="text-xl text-muted-foreground">
                  Haben Sie Fragen zu Ihrem Umzug oder unserem Service? Wir sind für Sie da.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Form & Info */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
                {/* Contact Form */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-primary" />
                      Nachricht senden
                    </CardTitle>
                    <CardDescription>
                      Wir beantworten Ihre Anfrage innerhalb von 24 Stunden.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name *</Label>
                          <Input id="name" placeholder="Ihr Name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-Mail *</Label>
                          <Input id="email" type="email" placeholder="ihre@email.ch" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Betreff *</Label>
                        <Input id="subject" placeholder="Worum geht es?" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Nachricht *</Label>
                        <Textarea 
                          id="message" 
                          placeholder="Ihre Nachricht..."
                          rows={6}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Wird gesendet..." : "Nachricht senden"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Kontaktinformationen</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium mb-1">E-Mail</div>
                          <a href="mailto:info@umzugscheck.ch" className="text-muted-foreground hover:text-primary transition-colors">
                            info@umzugscheck.ch
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium mb-1">Telefon</div>
                          <a href="tel:+41445555555" className="text-muted-foreground hover:text-primary transition-colors">
                            +41 44 555 55 55
                          </a>
                          <div className="text-sm text-muted-foreground mt-1">
                            Mo-Fr: 08:00 - 18:00 Uhr
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium mb-1">Schnelle Antwort</div>
                          <div className="text-sm text-muted-foreground">
                            Wir antworten innerhalb von 24 Stunden an Werktagen
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium mb-2">Wichtiger Hinweis</div>
                          <p className="text-sm text-muted-foreground">
                            Wir vermitteln Umzugsfirmen und führen keine eigenen Umzüge durch. 
                            Für konkrete Offerten nutzen Sie bitte unser Anfrageformular.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* FAQ */}
              <div className="max-w-5xl mx-auto mt-16">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Häufig gestellte Fragen</h2>
                  <p className="text-muted-foreground">
                    Vielleicht finden Sie hier bereits die Antwort auf Ihre Frage.
                  </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Ist der Service wirklich kostenlos?</AccordionTrigger>
                    <AccordionContent>
                      Ja, unser Vergleichsservice ist 100% kostenlos und unverbindlich. 
                      Sie zahlen nur für den Umzug selbst, wenn Sie sich für eine Firma entscheiden.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Wie viele Offerten erhalte ich?</AccordionTrigger>
                    <AccordionContent>
                      Sie erhalten bis zu 5 kostenlose Offerten von geprüften Umzugsfirmen 
                      in Ihrer Region. So können Sie Preise und Leistungen optimal vergleichen.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Sind alle Firmen geprüft?</AccordionTrigger>
                    <AccordionContent>
                      Ja, wir arbeiten nur mit geprüften und zertifizierten Umzugsfirmen zusammen. 
                      Alle Partner haben eine gültige Betriebshaftpflichtversicherung.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Wie schnell erhalte ich Angebote?</AccordionTrigger>
                    <AccordionContent>
                      Nach Ihrer Anfrage erhalten Sie in der Regel innerhalb von 24-48 Stunden 
                      die ersten Offerten von interessierten Umzugsfirmen.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
