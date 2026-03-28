import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-12">Datenschutzerklärung</h1>

            <div className="space-y-8">
              <Card className="p-8">
                <h2 className="text-2xl font-semibold mb-4">1. Datenschutz auf einen Blick</h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Allgemeine Hinweise</h3>
                    <p>
                      Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
                      personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene 
                      Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl font-semibold mb-4">2. Datenerfassung auf dieser Website</h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Wer ist verantwortlich für die Datenerfassung?</h3>
                    <p>
                      Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber:
                    </p>
                    <p className="mt-2">
                      Feierabend Umzüge AG<br />
                      Musterstrasse 123<br />
                      8000 Zürich, Schweiz<br />
                      E-Mail: info@feierabend-umzuege.ch
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Wie erfassen wir Ihre Daten?</h3>
                    <p>
                      Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann 
                      es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                    </p>
                    <p className="mt-2">
                      Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. 
                      Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit 
                      des Seitenaufrufs).
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl font-semibold mb-4">3. Allgemeine Hinweise</h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Datenschutz</h3>
                    <p>
                      Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre 
                      personenbezogenen Daten vertraulich und entsprechend der gesetzlichen 
                      Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">SSL- bzw. TLS-Verschlüsselung</h3>
                    <p>
                      Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher 
                      Inhalte eine SSL-bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie 
                      daran, dass die Adresszeile des Browsers von "http://" auf "https://" wechselt.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl font-semibold mb-4">4. Kontaktformular</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem 
                    Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung 
                    der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
                  </p>
                  <p>
                    Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung dieser Daten 
                    erfolgt auf Grundlage Ihrer Einwilligung. Sie können diese Einwilligung jederzeit 
                    widerrufen.
                  </p>
                </div>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl font-semibold mb-4">5. Ihre Rechte</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Sie haben jederzeit das Recht:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Auskunft über Ihre bei uns gespeicherten Daten zu erhalten</li>
                    <li>Berichtigung unrichtiger personenbezogener Daten zu verlangen</li>
                    <li>Löschung Ihrer bei uns gespeicherten Daten zu verlangen</li>
                    <li>Einschränkung der Datenverarbeitung zu verlangen</li>
                    <li>Der Datenverarbeitung zu widersprechen</li>
                    <li>Datenübertragbarkeit zu verlangen</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-8 bg-muted/30">
                <h2 className="text-2xl font-semibold mb-4">Kontakt bei Fragen</h2>
                <p className="text-muted-foreground">
                  Bei Fragen zum Datenschutz kontaktieren Sie uns bitte unter:<br />
                  <strong className="text-foreground">info@feierabend-umzuege.ch</strong>
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  Stand dieser Datenschutzerklärung: {new Date().toLocaleDateString('de-CH')}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacy;
