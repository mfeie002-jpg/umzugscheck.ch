import { Link } from "react-router-dom";
import { ArrowRight, Phone, Clock, Shield, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import AnimatedSection from "./AnimatedSection";

export default function QuoteRequestCTA() {
  const benefits = [
    "Kostenlose Besichtigung",
    "Unverbindliches Angebot",
    "Festpreisgarantie",
    "Vollversichert"
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full mb-4">
              Jetzt starten
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">
              Holen Sie sich Ihre <span className="text-gradient">kostenlose Offerte</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              In nur wenigen Minuten erhalten Sie ein massgeschneidertes Angebot. 
              Kein Risiko, keine versteckten Kosten.
            </p>
            
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-alpine flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button size="lg" className="min-h-[52px]">
                  Offerte anfragen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="tel:+41765681302">
                <Button size="lg" variant="outline" className="min-h-[52px]">
                  <Phone className="mr-2 h-5 w-5" />
                  Anrufen
                </Button>
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <Card className="p-8 bg-gradient-hero text-primary-foreground">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Schnell-Offerte</h3>
                <p className="opacity-90">Antwort innerhalb von 24 Stunden</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg">
                  <Clock className="h-8 w-8" />
                  <div>
                    <p className="font-semibold">Express-Service</p>
                    <p className="text-sm opacity-80">Angebot am selben Tag möglich</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg">
                  <Shield className="h-8 w-8" />
                  <div>
                    <p className="font-semibold">Festpreisgarantie</p>
                    <p className="text-sm opacity-80">Der Preis bleibt garantiert</p>
                  </div>
                </div>
              </div>

              <Link to="/contact" className="block">
                <Button variant="secondary" size="lg" className="w-full">
                  Jetzt Offerte starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <p className="text-center text-xs opacity-70 mt-4">
                Oder rufen Sie uns an: <a href="tel:+41765681302" className="underline">+41 76 568 13 02</a>
              </p>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
