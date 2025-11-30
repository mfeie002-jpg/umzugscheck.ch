import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function Datenschutz() {
  const sections = [
    {
      icon: Shield,
      title: "Erhebung personenbezogener Daten",
      content: "Wir erheben personenbezogene Daten nur, wenn Sie uns diese im Rahmen einer Offertanfrage, Kontaktaufnahme oder Registrierung freiwillig mitteilen. Zu den erhobenen Daten gehören: Name, E-Mail-Adresse, Telefonnummer, Adresse und Umzugsdetails."
    },
    {
      icon: Lock,
      title: "Verwendung Ihrer Daten",
      content: "Ihre Daten werden ausschliesslich zur Bearbeitung Ihrer Anfrage, zur Vermittlung an geeignete Umzugsfirmen und zur Verbesserung unserer Dienstleistungen verwendet. Eine Weitergabe an Dritte erfolgt nur an von Ihnen ausgewählte Umzugsfirmen."
    },
    {
      icon: Eye,
      title: "Datensicherheit",
      content: "Wir setzen technische und organisatorische Sicherheitsmassnahmen ein, um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, Verlust, Zerstörung oder den Zugriff unberechtigter Personen zu schützen. Alle Datenübertragungen erfolgen verschlüsselt über SSL/TLS."
    },
    {
      icon: FileText,
      title: "Ihre Rechte",
      content: "Sie haben jederzeit das Recht auf Auskunft über Ihre gespeicherten Daten, deren Berichtigung, Löschung oder Einschränkung der Verarbeitung. Zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte unter info@umzugscheck.ch."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Datenschutz – Umzugscheck.ch"
        description="Datenschutzerklärung von Umzugscheck.ch. Informationen zur Erhebung, Verarbeitung und Verwendung Ihrer personenbezogenen Daten."
        canonicalUrl="https://www.umzugscheck.ch/datenschutz"
      />

      {/* Hero */}
      <section className="relative py-20 md:py-28 gradient-hero text-white">
        <div className="container mx-auto px-4">
          <ScrollReveal className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Datenschutzerklärung
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Ihre Privatsphäre ist uns wichtig. Hier erfahren Sie, wie wir mit Ihren Daten umgehen.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Hauptinhalt */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <ScrollReveal>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Die Betreiber dieser Website nehmen den Schutz Ihrer persönlichen Daten sehr ernst. 
                  Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der 
                  gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                </p>
              </div>
            </ScrollReveal>

            {sections.map((section, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <Card variant="elevated">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <section.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-3">{section.title}</h2>
                        <p className="text-muted-foreground leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}

            <ScrollReveal>
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-4">Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Diese Website verwendet Cookies, um die Nutzererfahrung zu verbessern und 
                    statistische Auswertungen zu ermöglichen. Durch die weitere Nutzung der Website 
                    stimmen Sie der Verwendung von Cookies zu.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies 
                    informiert werden und Cookies nur im Einzelfall erlauben oder die Annahme von 
                    Cookies generell ausschliessen.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal>
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-4">Kontakt</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Bei Fragen zum Datenschutz kontaktieren Sie uns bitte unter:
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="font-medium">Umzugscheck GmbH</p>
                    <p className="text-muted-foreground">Bahnhofstrasse 100</p>
                    <p className="text-muted-foreground">8001 Zürich</p>
                    <p className="text-muted-foreground">E-Mail: info@umzugscheck.ch</p>
                    <p className="text-muted-foreground">Tel: +41 44 567 89 00</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal>
              <div className="text-center text-sm text-muted-foreground">
                <p>Stand: {new Date().toLocaleDateString('de-CH')}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
