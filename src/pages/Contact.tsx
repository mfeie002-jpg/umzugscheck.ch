import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Clock, Send, HelpCircle, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEOHead } from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ScrollReveal } from "@/components/ScrollReveal";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Nachricht gesendet!",
      description: "Wir melden uns innerhalb von 24 Stunden bei Ihnen.",
    });
    
    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <>
      <SEOHead
        title="Kontakt - Umzugscheck.ch"
        description="Kontaktieren Sie uns bei Fragen zu Ihrem Umzug oder unserem Vergleichsservice. Schnelle Antwort garantiert."
        canonical="https://umzugscheck.ch/kontakt"
      />
      
      <Navigation />
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
          <Breadcrumbs 
            items={[
              { label: "Startseite", href: "/" },
              { label: "Kontakt", href: "/kontakt" }
            ]}
          />

          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12 mt-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                Kontakt
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground px-4">
                Haben Sie Fragen? Wir helfen Ihnen gerne weiter!
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
              {/* Contact Form */}
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                    <Send className="w-5 h-5 text-primary" />
                    Kontaktformular
                  </CardTitle>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Schreiben Sie uns – wir antworten innerhalb von 24 Stunden
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm sm:text-base">Name *</Label>
                    <Input 
                      id="name" 
                      placeholder="Ihr Name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="h-11 sm:h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm sm:text-base">E-Mail *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="ihre@email.ch"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="h-11 sm:h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm sm:text-base">Telefon</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+41 79 123 45 67"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="h-11 sm:h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm sm:text-base">Nachricht *</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Ihre Nachricht..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="resize-none"
                      required
                    />
                  </div>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="w-full h-11 sm:h-12"
                    size="lg"
                  >
                    {isSubmitting ? "Wird gesendet..." : "Nachricht senden"}
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl sm:text-2xl">Kontaktinformationen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base sm:text-lg mb-1">Telefon</h3>
                      <a href="tel:+41445678900" className="text-sm sm:text-base text-primary hover:underline">
                        +41 44 567 89 00
                      </a>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">Mo-Fr: 8-18 Uhr, Sa: 9-16 Uhr</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base sm:text-lg mb-1">E-Mail</h3>
                      <a href="mailto:info@umzugscheck.ch" className="text-sm sm:text-base text-primary hover:underline break-all">
                        info@umzugscheck.ch
                      </a>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">Antwort innert 24h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base sm:text-lg mb-1">WhatsApp</h3>
                      <a href="https://wa.me/41445678900" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-primary hover:underline">
                        +41 44 567 89 00
                      </a>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">Schnellste Antwort</p>
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium mb-2 text-sm sm:text-base">Wichtiger Hinweis</div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Wir vermitteln Umzugsfirmen und führen keine eigenen Umzüge durch. 
                          Für konkrete Offerten nutzen Sie bitte unser Anfrageformular.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>

          {/* FAQ Section */}
          <ScrollReveal delay={0.2}>
            <section className="max-w-3xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
                Häufige Fragen
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    question: "Wie schnell erhalte ich eine Antwort?",
                    answer: "Wir beantworten E-Mails innerhalb von 24 Stunden (Werktage). Über WhatsApp erhalten Sie meist innerhalb weniger Stunden eine Antwort."
                  },
                  {
                    question: "Ist die Nutzung von Umzugscheck.ch kostenlos?",
                    answer: "Ja, absolut! Die Nutzung unserer Plattform, aller Rechner und die Anforderung von Offerten ist komplett kostenlos und unverbindlich für Sie."
                  },
                  {
                    question: "Kann ich auch am Wochenende Kontakt aufnehmen?",
                    answer: "Sie können uns jederzeit eine E-Mail oder WhatsApp-Nachricht schicken. Wir antworten am nächsten Werktag. Telefonisch sind wir Samstags 9-16 Uhr erreichbar."
                  }
                ].map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-background border rounded-xl px-4 sm:px-6">
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <span className="font-bold text-sm sm:text-base pr-4">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm sm:text-base text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Contact;
