import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

export const ZuerichContactSection = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Kontakt für Zürcher Umzüge</h2>
            <p className="text-muted-foreground mb-8">
              Haben Sie Fragen zu Ihrem Umzug in Zürich? Unser Team hilft Ihnen gerne weiter.
            </p>

            <div className="space-y-4">
              {[
                { icon: Phone, label: "Telefon", value: "0800 123 456", sublabel: "Kostenlos" },
                { icon: Mail, label: "E-Mail", value: "zuerich@umzugscheck.ch", sublabel: "24h Antwort" },
                { icon: MapPin, label: "Beratung", value: "Zürich & Umgebung", sublabel: "Persönlich vor Ort" },
                { icon: Clock, label: "Erreichbar", value: "Mo-Fr 8-18 Uhr", sublabel: "Sa 9-14 Uhr" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Schnelle Anfrage</h3>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-success" />
                  </div>
                  <p className="font-medium">Nachricht gesendet!</p>
                  <p className="text-sm text-muted-foreground">Wir melden uns in Kürze bei Ihnen.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Ihr Name" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon</Label>
                      <Input id="phone" type="tel" placeholder="+41 79..." required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">E-Mail</Label>
                    <Input id="email" type="email" placeholder="ihre@email.ch" required />
                  </div>
                  <div>
                    <Label htmlFor="message">Nachricht</Label>
                    <Textarea id="message" placeholder="Wie können wir Ihnen helfen?" rows={3} />
                  </div>
                  <Button type="submit" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Nachricht senden
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
