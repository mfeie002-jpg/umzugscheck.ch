import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, Clock, ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";
import SectionBadge from "@/components/SectionBadge";

const ContactOptions = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Anrufen",
      description: "Direkter Kontakt mit unserem Team",
      action: "+41 76 568 13 02",
      href: "tel:+41765681302",
      color: "alpine",
      badge: "Am schnellsten",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Schreiben Sie uns bequem per Chat",
      action: "Chat starten",
      href: "https://wa.me/41765681302",
      color: "forest",
      badge: "24/7 erreichbar",
    },
    {
      icon: Mail,
      title: "E-Mail",
      description: "Für ausführliche Anfragen",
      action: "info@feierabend-umzuege.ch",
      href: "mailto:info@feierabend-umzuege.ch",
      color: "warm",
      badge: "Antwort in 24h",
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12 space-y-4">
          <SectionBadge variant="warm">Kontakt</SectionBadge>
          <h2 className="text-balance font-display mt-4">
            So erreichen Sie <span className="text-gradient-warm">uns</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Wählen Sie Ihren bevorzugten Kontaktweg – wir sind für Sie da.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto mb-12">
          {contactMethods.map((method, index) => (
            <AnimatedSection key={index} delay={index * 0.15}>
              <a href={method.href} target={method.icon === MessageCircle ? "_blank" : undefined} rel="noopener noreferrer">
                <Card className="p-6 h-full hover-lift text-center cursor-pointer group">
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      method.color === 'alpine' ? 'bg-alpine/10 text-alpine' :
                      method.color === 'forest' ? 'bg-forest/10 text-forest' :
                      'bg-warm/10 text-warm'
                    }`}>
                      {method.badge}
                    </span>
                  </div>
                  <div className={`w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                    method.color === 'alpine' ? 'bg-alpine/10' :
                    method.color === 'forest' ? 'bg-forest/10' :
                    'bg-warm/10'
                  } group-hover:scale-110 transition-transform`}>
                    <method.icon className={`h-7 w-7 ${
                      method.color === 'alpine' ? 'text-alpine' :
                      method.color === 'forest' ? 'text-forest' :
                      'text-warm'
                    }`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                  <p className={`font-semibold text-sm ${
                    method.color === 'alpine' ? 'text-alpine' :
                    method.color === 'forest' ? 'text-forest' :
                    'text-warm'
                  }`}>
                    {method.action}
                  </p>
                </Card>
              </a>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="max-w-2xl mx-auto">
          <Card className="p-6 lg:p-8 bg-muted/30">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-alpine/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-alpine" />
                </div>
                <div>
                  <p className="font-bold">Öffnungszeiten</p>
                  <p className="text-sm text-muted-foreground">Mo-Fr 7-18 Uhr, Sa 8-14 Uhr</p>
                </div>
              </div>
              <div className="flex-1 hidden sm:block" />
              <Link to="/contact">
                <Button className="bg-gradient-hero">
                  Offerte anfragen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ContactOptions;

