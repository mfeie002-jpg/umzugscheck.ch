import { SEOHead } from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Shield, Lock, Eye, Database, Mail, FileText } from "lucide-react";

const Datenschutz = () => {
  return (
    <>
      <SEOHead
        title="Datenschutzerklärung | Umzugscheck.ch"
        description="Datenschutzerklärung von Umzugscheck.ch - Informationen zum Schutz Ihrer persönlichen Daten."
        canonical="/datenschutz"
        noindex={true}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Breadcrumbs 
            items={[
              { label: "Startseite", href: "/" },
              { label: "Datenschutz", href: "/datenschutz" }
            ]}
          />

          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-10 h-10 text-primary" />
              <h1 className="text-4xl font-bold">Datenschutzerklärung</h1>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  Allgemeine Hinweise
                </h2>
                <p className="text-muted-foreground">
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, 
                  wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert 
                  werden können.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Database className="w-6 h-6 text-primary" />
                  Datenerfassung auf dieser Website
                </h2>
                
                <h3 className="text-xl font-semibold mb-3">Wer ist verantwortlich für die Datenerfassung?</h3>
                <p className="text-muted-foreground mb-4">
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie 
                  dem Impressum dieser Website entnehmen.
                </p>

                <h3 className="text-xl font-semibold mb-3">Wie erfassen wir Ihre Daten?</h3>
                <p className="text-muted-foreground mb-4">
                  Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, 
                  die Sie in ein Kontaktformular oder den Preisrechner eingeben.
                </p>
                <p className="text-muted-foreground mb-4">
                  Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. 
                  Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
                </p>

                <h3 className="text-xl font-semibold mb-3">Wofür nutzen wir Ihre Daten?</h3>
                <p className="text-muted-foreground mb-4">
                  Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. 
                  Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden, um unseren Service zu verbessern.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-primary" />
                  Ihre Rechte
                </h2>
                <p className="text-muted-foreground mb-4">
                  Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten 
                  personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten 
                  zu verlangen.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                  <li>Recht auf Auskunft</li>
                  <li>Recht auf Berichtigung</li>
                  <li>Recht auf Löschung</li>
                  <li>Recht auf Einschränkung der Verarbeitung</li>
                  <li>Recht auf Datenübertragbarkeit</li>
                  <li>Widerspruchsrecht</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-primary" />
                  Analyse-Tools und Tools von Drittanbietern
                </h2>
                <p className="text-muted-foreground mb-4">
                  Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor allem mit 
                  sogenannten Analyseprogrammen. Die Analyse Ihres Surf-Verhaltens erfolgt in der Regel anonym.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Hosting</h2>
                <p className="text-muted-foreground mb-4">
                  Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
                </p>
                <h3 className="text-xl font-semibold mb-3">Externes Hosting</h3>
                <p className="text-muted-foreground mb-4">
                  Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden, 
                  werden auf den Servern des Hosters / der Hoster gespeichert. Hierbei kann es sich v.a. um IP-Adressen, 
                  Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und 
                  sonstige Daten, die über eine Website generiert werden, handeln.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Datenerfassung im Preisrechner</h2>
                <p className="text-muted-foreground mb-4">
                  Wenn Sie unseren Umzugsrechner nutzen, erfassen wir folgende Daten:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                  <li>Umzugsdaten (Wohnungsgröße, Distanz, gewünschte Services)</li>
                  <li>Kontaktdaten (Name, E-Mail, Telefon) - nur wenn Sie eine Offerte anfordern</li>
                  <li>Ausgewählte Umzugsfirmen</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  Diese Daten werden ausschließlich zur Vermittlung von Umzugsofferten verwendet und an die von Ihnen 
                  ausgewählten Umzugsfirmen weitergeleitet.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">SSL- bzw. TLS-Verschlüsselung</h2>
                <p className="text-muted-foreground mb-4">
                  Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine 
                  SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile 
                  des Browsers von "http://" auf "https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
                </p>
              </section>

              <section className="bg-muted/30 p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Mail className="w-6 h-6 text-primary" />
                  Kontakt bei Datenschutzfragen
                </h2>
                <p className="text-muted-foreground mb-4">
                  Wenn Sie Fragen zum Datenschutz haben, schreiben Sie uns bitte eine E-Mail oder wenden Sie sich direkt 
                  an die für den Datenschutz verantwortliche Person in unserer Organisation:
                </p>
                <div className="bg-background p-4 rounded-lg">
                  <p className="font-semibold">Umzugscheck GmbH</p>
                  <p className="text-muted-foreground">Bahnhofstrasse 100</p>
                  <p className="text-muted-foreground">8001 Zürich, Schweiz</p>
                  <p className="text-muted-foreground mt-2">E-Mail: datenschutz@umzugscheck.ch</p>
                  <p className="text-muted-foreground">Tel: +41 44 567 89 00</p>
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

export default Datenschutz;
