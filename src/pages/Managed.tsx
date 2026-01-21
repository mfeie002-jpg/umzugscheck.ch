/**
 * Managed Portal Page
 * Full-Service "Wir machen alles" offering
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, CheckCircle, Phone, MessageCircle, Video, ArrowRight, Shield, Clock, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { GoldenNavigation } from "@/components/golden/navigation/GoldenNavigation";

const services = [
  { icon: "📦", title: "Umzugsplanung", desc: "Wir koordinieren alles von A bis Z" },
  { icon: "🔍", title: "Firmen-Selektion", desc: "Geprüfte Partner, faire Preise" },
  { icon: "📝", title: "Bürokratie", desc: "Ummeldung, Strom, Internet – alles erledigt" },
  { icon: "🧹", title: "Reinigung", desc: "Endreinigung mit Abnahme-Garantie" },
  { icon: "🛡️", title: "Versicherung", desc: "Vollschutz für Ihre Möbel" },
  { icon: "📞", title: "Concierge", desc: "Persönlicher Ansprechpartner" },
];

const steps = [
  { num: "1", title: "Kontakt aufnehmen", desc: "Anruf, WhatsApp oder Video-Analyse" },
  { num: "2", title: "Wir planen", desc: "Sie lehnen sich zurück" },
  { num: "3", title: "Umzug läuft", desc: "Wir koordinieren alles" },
  { num: "4", title: "Fertig!", desc: "Schlüssel abgeben, fertig" },
];

const Managed = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Bitte Name und Telefon eingeben");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create managed case - use type assertion for new table
      const { data, error } = await (supabase.from("managed_cases" as any) as any).insert({
        customer_name: name,
        customer_phone: phone,
        service_type: "full_service",
        status: "new",
        timeline: [{ 
          event: "case_created", 
          timestamp: new Date().toISOString(),
          note: "Kunde hat sich für Managed Service angemeldet"
        }]
      }).select().single();

      if (error) throw error;

      // Add timeline event
      await (supabase.from("case_timeline_events" as any) as any).insert({
        case_id: data.id,
        event_type: "created",
        event_title: "Anfrage erstellt",
        event_description: `Kunde ${name} hat Managed Service angefragt`,
        created_by: "system"
      });

      setSubmitted(true);
      toast.success("Anfrage erfolgreich! Wir melden uns in Kürze.");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Fehler beim Absenden");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GoldenNavigation />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="mb-6 bg-secondary text-secondary-foreground">
                <Crown className="w-4 h-4 mr-2" />
                Premium Full-Service
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
                Wir machen <span className="text-primary">alles</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Sie sagen uns wohin – wir kümmern uns um den Rest. 
                Umzug, Reinigung, Bürokratie, Versicherung. Ein Ansprechpartner für alles.
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-6 mb-10">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>100% Festpreis-Garantie</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>0 Minuten Wartezeit</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-5 h-5 text-primary" />
                  <span>Nur geprüfte Partner</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="min-h-[56px] text-lg font-bold">
                  <a href="tel:+41772258672">
                    <Phone className="w-5 h-5 mr-2" />
                    Jetzt anrufen
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="min-h-[56px] text-lg font-bold">
                  <a href="https://wa.me/41772258672?text=Ich%20interessiere%20mich%20für%20den%20Managed%20Service" target="_blank">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </a>
                </Button>
                <Button asChild variant="secondary" size="lg" className="min-h-[56px] text-lg font-bold">
                  <Link to="/ai-movescan">
                    <Video className="w-5 h-5 mr-2" />
                    Video-Analyse
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Was im Managed Service enthalten ist
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {services.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 flex items-start gap-4">
                      <span className="text-3xl">{service.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{service.title}</h3>
                        <p className="text-muted-foreground text-sm">{service.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              So einfach geht's
            </h2>
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-4"
                >
                  <Card className="p-4 text-center min-w-[160px]">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto mb-2">
                      {step.num}
                    </div>
                    <h3 className="font-bold">{step.title}</h3>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </Card>
                  {i < steps.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-center">
                  {submitted ? "Danke!" : "Rückruf anfordern"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Anfrage eingegangen!</p>
                    <p className="text-muted-foreground mb-6">
                      Wir melden uns innerhalb von 30 Minuten bei Ihnen.
                    </p>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="flex-1">
                        <a href="tel:+41772258672">
                          <Phone className="w-4 h-4 mr-2" />
                          Direkt anrufen
                        </a>
                      </Button>
                      <Button asChild className="flex-1">
                        <Link to="/">
                          Zur Startseite
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ihr Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Telefon</label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+41 79 123 45 67"
                        type="tel"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                          Wird gesendet...
                        </>
                      ) : (
                        <>
                          <Phone className="w-5 h-5 mr-2" />
                          Rückruf anfordern
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Kostenlos & unverbindlich • Antwort in 30 Min
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Managed;
