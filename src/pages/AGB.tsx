import { SEOHead } from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FileText, AlertCircle } from "lucide-react";

const AGB = () => {
  return (
    <>
      <SEOHead
        title="Allgemeine Geschäftsbedingungen (AGB) | Umzugscheck.ch"
        description="Allgemeine Geschäftsbedingungen von Umzugscheck.ch - Nutzungsbedingungen unserer Vergleichsplattform."
        canonical="/agb"
        noindex={true}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Breadcrumbs 
            items={[
              { label: "Startseite", href: "/" },
              { label: "AGB", href: "/agb" }
            ]}
          />

          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="w-10 h-10 text-primary" />
              <h1 className="text-4xl font-bold">Allgemeine Geschäftsbedingungen</h1>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Geltungsbereich</h2>
                <p className="text-muted-foreground mb-4">
                  Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Plattform Umzugscheck.ch, 
                  betrieben durch die Umzugscheck GmbH, Bahnhofstrasse 100, 8001 Zürich, Schweiz.
                </p>
                <p className="text-muted-foreground mb-4">
                  Umzugscheck.ch ist eine unabhängige Vergleichsplattform für Umzugsdienstleistungen in der Schweiz. 
                  Wir vermitteln zwischen Kunden und geprüften Umzugsfirmen, führen selbst jedoch keine Umzüge durch.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Leistungen von Umzugscheck.ch</h2>
                <h3 className="text-xl font-semibold mb-3">2.1 Vermittlungsservice</h3>
                <p className="text-muted-foreground mb-4">
                  Umzugscheck.ch stellt eine Plattform bereit, auf der Nutzer:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                  <li>Umzugskosten berechnen können</li>
                  <li>Umzugsfirmen vergleichen können</li>
                  <li>Offerten von geprüften Umzugsfirmen anfordern können</li>
                  <li>Bewertungen und Erfahrungsberichte einsehen können</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">2.2 Kostenlose Nutzung</h3>
                <p className="text-muted-foreground mb-4">
                  Die Nutzung von Umzugscheck.ch ist für Endkunden kostenlos. Es entstehen keine Kosten durch die 
                  Berechnung von Umzugspreisen oder das Anfordern von Offerten.
                </p>

                <h3 className="text-xl font-semibold mb-3">2.3 Keine Garantie</h3>
                <p className="text-muted-foreground mb-4">
                  Umzugscheck.ch vermittelt lediglich Kontakte zu Umzugsfirmen. Wir übernehmen keine Garantie für:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                  <li>Die Richtigkeit der Preisberechnungen (diese sind Richtwerte)</li>
                  <li>Die Qualität der Dienstleistungen der vermittelten Firmen</li>
                  <li>Das Zustandekommen eines Vertrags mit einer Umzugsfirma</li>
                  <li>Die Verfügbarkeit bestimmter Umzugsfirmen</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Nutzung der Plattform</h2>
                <h3 className="text-xl font-semibold mb-3">3.1 Korrekte Angaben</h3>
                <p className="text-muted-foreground mb-4">
                  Sie verpflichten sich, bei der Nutzung unserer Rechner und beim Anfordern von Offerten korrekte und 
                  vollständige Angaben zu machen. Falsche Angaben können zu ungenauen Preisberechnungen führen.
                </p>

                <h3 className="text-xl font-semibold mb-3">3.2 Kontaktaufnahme</h3>
                <p className="text-muted-foreground mb-4">
                  Wenn Sie eine Offerte anfordern, willigen Sie ein, dass Ihre Kontaktdaten an die von Ihnen 
                  ausgewählten Umzugsfirmen weitergeleitet werden. Diese Firmen können Sie für Offerten und 
                  Rückfragen kontaktieren.
                </p>

                <h3 className="text-xl font-semibold mb-3">3.3 Verbot missbräuchlicher Nutzung</h3>
                <p className="text-muted-foreground mb-4">
                  Die Nutzung der Plattform für folgende Zwecke ist untersagt:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                  <li>Spam oder automatisierte Anfragen</li>
                  <li>Falsche oder betrügerische Anfragen</li>
                  <li>Reverse Engineering oder Scraping der Plattform</li>
                  <li>Jegliche Aktivitäten, die andere Nutzer oder die Plattform schädigen</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Vertragsverhältnis mit Umzugsfirmen</h2>
                <p className="text-muted-foreground mb-4">
                  Der Vertrag über die Umzugsdienstleistung kommt ausschließlich zwischen Ihnen und der von Ihnen 
                  beauftragten Umzugsfirma zustande. Umzugscheck.ch ist nicht Vertragspartei dieses Vertrags.
                </p>
                <p className="text-muted-foreground mb-4">
                  Für die Durchführung des Umzugs, die Preisgestaltung und alle Garantien oder Gewährleistungen ist 
                  ausschließlich die beauftragte Umzugsfirma verantwortlich.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Haftungsausschluss</h2>
                <h3 className="text-xl font-semibold mb-3">5.1 Inhaltliche Richtigkeit</h3>
                <p className="text-muted-foreground mb-4">
                  Umzugscheck.ch bemüht sich um die Richtigkeit aller Informationen auf der Plattform. Dennoch können 
                  wir keine Garantie für die Vollständigkeit, Richtigkeit und Aktualität der Inhalte übernehmen.
                </p>

                <h3 className="text-xl font-semibold mb-3">5.2 Externe Links</h3>
                <p className="text-muted-foreground mb-4">
                  Unsere Plattform enthält Links zu externen Websites Dritter. Auf deren Inhalte haben wir keinen 
                  Einfluss. Für die Inhalte externer Links sind ausschließlich deren Betreiber verantwortlich.
                </p>

                <h3 className="text-xl font-semibold mb-3">5.3 Haftungsbeschränkung</h3>
                <p className="text-muted-foreground mb-4">
                  Umzugscheck.ch haftet nicht für Schäden, die durch die Nutzung der Plattform oder durch die 
                  Inanspruchnahme vermittelter Dienstleistungen entstehen, sofern diese nicht auf grobe Fahrlässigkeit 
                  oder Vorsatz zurückzuführen sind.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Bewertungen und Rezensionen</h2>
                <p className="text-muted-foreground mb-4">
                  Nutzer können Bewertungen zu Umzugsfirmen abgeben. Diese Bewertungen:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                  <li>Müssen auf tatsächlichen Erfahrungen basieren</li>
                  <li>Dürfen keine beleidigenden oder diskriminierenden Inhalte enthalten</li>
                  <li>Werden von Umzugscheck.ch moderiert, aber nicht auf Richtigkeit geprüft</li>
                  <li>Können bei Verstoß gegen diese Richtlinien gelöscht werden</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Datenschutz</h2>
                <p className="text-muted-foreground mb-4">
                  Die Verarbeitung Ihrer personenbezogenen Daten erfolgt gemäß unserer Datenschutzerklärung. 
                  Diese können Sie unter <a href="/datenschutz" className="text-primary hover:underline">/datenschutz</a> einsehen.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Änderungen der AGB</h2>
                <p className="text-muted-foreground mb-4">
                  Umzugscheck.ch behält sich das Recht vor, diese AGB jederzeit zu ändern. Die aktuelle Version ist 
                  stets auf unserer Website verfügbar. Bei wesentlichen Änderungen werden registrierte Nutzer per 
                  E-Mail informiert.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Anwendbares Recht</h2>
                <p className="text-muted-foreground mb-4">
                  Es gilt ausschließlich Schweizer Recht. Gerichtsstand ist Zürich.
                </p>
              </section>

              <section className="bg-muted/30 p-6 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Fragen zu den AGB?</h3>
                    <p className="text-muted-foreground mb-2">
                      Bei Fragen zu diesen Geschäftsbedingungen kontaktieren Sie uns bitte:
                    </p>
                    <p className="text-muted-foreground">
                      E-Mail: <a href="mailto:info@umzugscheck.ch" className="text-primary hover:underline">info@umzugscheck.ch</a><br />
                      Tel: +41 44 567 89 00
                    </p>
                  </div>
                </div>
              </section>

              <p className="text-sm text-muted-foreground italic mt-8">
                Stand: Januar 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AGB;
