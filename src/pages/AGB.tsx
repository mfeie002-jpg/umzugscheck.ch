import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";

export default function AGB() {
  const sections = [
    {
      title: "1. Geltungsbereich",
      content: "Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Dienstleistungen von Umzugscheck.ch. Mit der Nutzung unserer Website und Dienstleistungen akzeptieren Sie diese AGB."
    },
    {
      title: "2. Leistungen",
      content: "Umzugscheck.ch ist eine Vergleichsplattform für Umzugsdienstleistungen. Wir vermitteln Kontakte zwischen Endkunden und Umzugsfirmen. Die eigentliche Umzugsdienstleistung wird durch die jeweilige Umzugsfirma erbracht."
    },
    {
      title: "3. Offertanfragen",
      content: "Offertanfragen über unsere Plattform sind für Endkunden kostenlos und unverbindlich. Nach Eingang Ihrer Anfrage leiten wir diese an bis zu 5 passende Umzugsfirmen weiter. Die Umzugsfirmen kontaktieren Sie direkt mit ihren Angeboten."
    },
    {
      title: "4. Vertragsschluss",
      content: "Der Vertragsschluss über die Umzugsdienstleistung erfolgt direkt zwischen Ihnen und der von Ihnen gewählten Umzugsfirma. Umzugscheck.ch ist nicht Vertragspartei dieser Vereinbarung."
    },
    {
      title: "5. Preise und Zahlung",
      content: "Die Preise für Umzugsdienstleistungen werden von den Umzugsfirmen festgelegt und direkt mit Ihnen vereinbart. Zahlungen erfolgen direkt an die beauftragte Umzugsfirma."
    },
    {
      title: "6. Haftung",
      content: "Umzugscheck.ch haftet nicht für die Qualität oder Ausführung der Umzugsdienstleistungen durch die vermittelten Umzugsfirmen. Schadenersatzansprüche sind ausschliesslich gegenüber der beauftragten Umzugsfirma geltend zu machen."
    },
    {
      title: "7. Datenschutz",
      content: "Die Verarbeitung personenbezogener Daten erfolgt gemäss unserer Datenschutzerklärung. Ihre Daten werden nur an von Ihnen ausgewählte Umzugsfirmen weitergegeben."
    },
    {
      title: "8. Gewährleistung",
      content: "Wir bemühen uns, nur geprüfte und zuverlässige Umzugsfirmen auf unserer Plattform zu listen. Eine Garantie für die Qualität der Dienstleistungen können wir jedoch nicht übernehmen."
    },
    {
      title: "9. Änderungen",
      content: "Wir behalten uns vor, diese AGB jederzeit zu ändern. Änderungen werden auf dieser Seite veröffentlicht und gelten ab dem Zeitpunkt der Veröffentlichung."
    },
    {
      title: "10. Anwendbares Recht",
      content: "Für alle Rechtsbeziehungen zwischen Umzugscheck.ch und den Nutzern gilt ausschliesslich Schweizer Recht. Gerichtsstand ist Zürich."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="AGB – Allgemeine Geschäftsbedingungen | Umzugscheck.ch"
        description="Allgemeine Geschäftsbedingungen (AGB) von Umzugscheck.ch. Informationen zu Nutzung, Leistungen, Haftung und rechtlichen Rahmenbedingungen."
        canonicalUrl="https://www.umzugscheck.ch/agb"
      />

      {/* Hero */}
      <section className="relative py-20 md:py-28 gradient-hero text-white">
        <div className="container mx-auto px-4">
          <ScrollReveal className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Allgemeine Geschäftsbedingungen
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Die Nutzungsbedingungen für Umzugscheck.ch
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Hauptinhalt */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {sections.map((section, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <Card variant="elevated">
                  <CardContent className="p-6 md:p-8">
                    <h2 className="text-xl font-bold mb-3">{section.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}

            <ScrollReveal>
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl font-bold mb-4">Kontakt</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Bei Fragen zu unseren AGB kontaktieren Sie uns bitte:
                  </p>
                  <div className="space-y-2">
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
