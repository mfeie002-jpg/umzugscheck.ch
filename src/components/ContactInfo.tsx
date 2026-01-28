import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import AnimatedSection from "./AnimatedSection";

export default function ContactInfo() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full mb-4">
            Kontakt
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">
            Wir sind für Sie <span className="text-gradient">da</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Persönliche Beratung – rufen Sie uns an oder schreiben Sie uns
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <AnimatedSection>
            <Card className="p-6 text-center hover-lift h-full">
              <div className="w-14 h-14 rounded-xl bg-alpine/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-alpine" />
              </div>
              <h3 className="font-semibold mb-1">Telefon</h3>
              <p className="text-sm text-muted-foreground mb-3">Mo-Fr 7-18h, Sa 8-14h</p>
              <a href="tel:+41765681302" className="text-alpine font-semibold hover:underline">
                +41 76 568 13 02
              </a>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <Card className="p-6 text-center hover-lift h-full">
              <div className="w-14 h-14 rounded-xl bg-alpine/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-alpine" />
              </div>
              <h3 className="font-semibold mb-1">E-Mail</h3>
              <p className="text-sm text-muted-foreground mb-3">24h Antwortzeit</p>
              <a href="mailto:info@feierabend-umzuege.ch" className="text-alpine font-semibold hover:underline break-all">
                info@feierabend-umzuege.ch
              </a>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <Card className="p-6 text-center hover-lift h-full">
              <div className="w-14 h-14 rounded-xl bg-[#25D366]/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-[#25D366]" />
              </div>
              <h3 className="font-semibold mb-1">WhatsApp</h3>
              <p className="text-sm text-muted-foreground mb-3">Schnelle Antworten</p>
              <a 
                href="https://wa.me/41765681302" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#25D366] font-semibold hover:underline"
              >
                Chat starten
              </a>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <Card className="p-6 text-center hover-lift h-full">
              <div className="w-14 h-14 rounded-xl bg-alpine/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-alpine" />
              </div>
              <h3 className="font-semibold mb-1">Adresse</h3>
              <p className="text-sm text-muted-foreground mb-3">Hauptsitz Zürich</p>
              <p className="text-alpine font-semibold">
                Musterstrasse 123<br />8000 Zürich
              </p>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

