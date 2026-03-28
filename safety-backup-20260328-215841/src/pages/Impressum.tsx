import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Mail, Phone, Globe } from "lucide-react";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Impressum – Umzugscheck.ch"
        description="Impressum und Kontaktinformationen von Umzugscheck.ch, der führenden Schweizer Vergleichsplattform für Umzugsdienstleistungen."
        canonicalUrl="https://www.umzugscheck.ch/impressum"
      />

      {/* Hero */}
      <section className="relative py-20 md:py-28 gradient-hero text-white">
        <div className="container mx-auto px-4">
          <ScrollReveal className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Impressum
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Angaben gemäss Schweizer Recht
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Hauptinhalt */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <ScrollReveal>
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Firmeninformationen</h2>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-lg">Umzugscheck GmbH</p>
                      <p className="text-muted-foreground">Bahnhofstrasse 100</p>
                      <p className="text-muted-foreground">8001 Zürich</p>
                      <p className="text-muted-foreground">Schweiz</p>
                    </div>
                    <div className="pt-4 space-y-2">
                    <p className="text-muted-foreground">
                      <span className="font-medium">UID:</span> CHE-XXX.XXX.XXX (bitte ergänzen)
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Handelsregisternummer:</span> (bitte ergänzen)
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">MWST-Nr.:</span> (bitte ergänzen, falls vorhanden)
                    </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Kontakt</h2>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium">Telefon</p>
                        <a href="tel:+41445678900" className="text-muted-foreground hover:text-primary transition-colors">
                          +41 44 567 89 00
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium">E-Mail</p>
                        <a href="mailto:info@umzugscheck.ch" className="text-muted-foreground hover:text-primary transition-colors">
                          info@umzugscheck.ch
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium">Website</p>
                        <a href="https://www.umzugscheck.ch" className="text-muted-foreground hover:text-primary transition-colors">
                          www.umzugscheck.ch
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-4">Geschäftsführung</h2>
                  <p className="text-muted-foreground">Max Muster, CEO</p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-4">Haftungsausschluss</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      <strong>Inhalt der Website:</strong> Die Inhalte dieser Website wurden mit grösstmöglicher Sorgfalt erstellt. 
                      Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
                    </p>
                    <p>
                      <strong>Links:</strong> Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
                      Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.
                    </p>
                    <p>
                      <strong>Urheberrecht:</strong> Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten 
                      unterliegen dem Schweizer Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der 
                      Verwertung ausserhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
