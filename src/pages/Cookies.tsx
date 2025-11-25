import { SEOHead } from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Cookie, Settings, Eye, BarChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Cookies = () => {
  return (
    <>
      <SEOHead
        title="Cookie-Richtlinie | Umzugscheck.ch"
        description="Cookie-Richtlinie von Umzugscheck.ch - Informationen über die Verwendung von Cookies auf unserer Website."
        canonical="/cookies"
        noindex={true}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Breadcrumbs 
            items={[
              { label: "Startseite", href: "/" },
              { label: "Cookie-Richtlinie", href: "/cookies" }
            ]}
          />

          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Cookie className="w-10 h-10 text-primary" />
              <h1 className="text-4xl font-bold">Cookie-Richtlinie</h1>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">Was sind Cookies?</h2>
                <p className="text-muted-foreground mb-4">
                  Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden, wenn Sie eine Website besuchen. 
                  Sie ermöglichen es der Website, Ihr Gerät wiederzuerkennen und bestimmte Informationen über Sie zu speichern.
                </p>
                <p className="text-muted-foreground">
                  Umzugscheck.ch verwendet Cookies, um die Funktionalität der Website zu gewährleisten, die Benutzererfahrung 
                  zu verbessern und die Nutzung unserer Website zu analysieren.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6">Welche Cookies verwenden wir?</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                        <Settings className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>Notwendige Cookies</CardTitle>
                      <CardDescription>Erforderlich für grundlegende Funktionen</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Diese Cookies sind für den Betrieb der Website unerlässlich und können nicht deaktiviert werden.
                      </p>
                      <ul className="text-sm space-y-1">
                        <li>• Session-Cookies</li>
                        <li>• Sicherheits-Cookies</li>
                        <li>• Login-Status</li>
                        <li>• Cookie-Einstellungen</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                        <Eye className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>Funktionale Cookies</CardTitle>
                      <CardDescription>Verbessern die Benutzererfahrung</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.
                      </p>
                      <ul className="text-sm space-y-1">
                        <li>• Spracheinstellungen</li>
                        <li>• Design-Präferenzen (Dark Mode)</li>
                        <li>• Gespeicherte Suchfilter</li>
                        <li>• Rechner-Zwischenstände</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                        <BarChart className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>Analyse-Cookies</CardTitle>
                      <CardDescription>Helfen uns, die Website zu verbessern</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Diese Cookies sammeln anonymisierte Informationen über die Nutzung unserer Website.
                      </p>
                      <ul className="text-sm space-y-1">
                        <li>• Besucherzahlen</li>
                        <li>• Klickverhalten</li>
                        <li>• Verweildauer</li>
                        <li>• Beliebte Seiten</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                        <Cookie className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>Marketing-Cookies</CardTitle>
                      <CardDescription>Für personalisierte Werbung</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Diese Cookies werden verwendet, um Ihnen relevante Werbung zu zeigen.
                      </p>
                      <ul className="text-sm space-y-1">
                        <li>• Werbe-Tracking</li>
                        <li>• Personalisierte Anzeigen</li>
                        <li>• Conversion-Tracking</li>
                        <li>• Retargeting</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section className="bg-muted/30 p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">Cookie-Details</h2>
                <div className="space-y-4">
                  <div className="bg-background p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">_umzugscheck_session</h3>
                    <div className="grid md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div><span className="font-medium">Typ:</span> Notwendig</div>
                      <div><span className="font-medium">Laufzeit:</span> Session</div>
                      <div><span className="font-medium">Zweck:</span> Sitzungsverwaltung</div>
                    </div>
                  </div>

                  <div className="bg-background p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">cookie_consent</h3>
                    <div className="grid md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div><span className="font-medium">Typ:</span> Notwendig</div>
                      <div><span className="font-medium">Laufzeit:</span> 1 Jahr</div>
                      <div><span className="font-medium">Zweck:</span> Speichert Cookie-Einstellungen</div>
                    </div>
                  </div>

                  <div className="bg-background p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">dark_mode</h3>
                    <div className="grid md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div><span className="font-medium">Typ:</span> Funktional</div>
                      <div><span className="font-medium">Laufzeit:</span> 1 Jahr</div>
                      <div><span className="font-medium">Zweck:</span> Design-Präferenz</div>
                    </div>
                  </div>

                  <div className="bg-background p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">_ga, _gid</h3>
                    <div className="grid md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div><span className="font-medium">Typ:</span> Analyse</div>
                      <div><span className="font-medium">Laufzeit:</span> 2 Jahre / 24 Stunden</div>
                      <div><span className="font-medium">Zweck:</span> Google Analytics</div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Ihre Cookie-Einstellungen</h2>
                <p className="text-muted-foreground mb-4">
                  Sie haben jederzeit die Möglichkeit, Ihre Cookie-Einstellungen anzupassen:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                  <li>Über das Cookie-Banner beim ersten Besuch der Website</li>
                  <li>Über die Cookie-Einstellungen in der Fußzeile</li>
                  <li>Über die Einstellungen Ihres Browsers</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  <strong>Wichtig:</strong> Wenn Sie Cookies deaktivieren, können einige Funktionen der Website 
                  möglicherweise nicht mehr richtig funktionieren.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Browser-Einstellungen</h2>
                <p className="text-muted-foreground mb-4">
                  Die meisten Browser akzeptieren Cookies automatisch. Sie können Ihren Browser so einstellen, 
                  dass er Sie über die Platzierung von Cookies informiert oder diese automatisch ablehnt.
                </p>
                <p className="text-muted-foreground">
                  Anleitungen zum Verwalten von Cookies finden Sie in der Hilfe Ihres Browsers:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/de/kb/cookies-erlauben-und-ablehnen" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
                  <li><a href="https://support.apple.com/de-de/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
                  <li><a href="https://support.microsoft.com/de-de/microsoft-edge" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Drittanbieter-Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  Auf unserer Website werden auch Cookies von Drittanbietern gesetzt:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Google Analytics:</strong> Zur Analyse des Nutzerverhaltens</li>
                  <li><strong>Google Maps:</strong> Zur Anzeige von Karten und Standorten</li>
                  <li><strong>Social Media:</strong> Für Social-Media-Funktionen</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Diese Drittanbieter können eigene Cookies setzen. Details finden Sie in den jeweiligen 
                  Datenschutzerklärungen der Anbieter.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Kontakt</h2>
                <p className="text-muted-foreground mb-4">
                  Bei Fragen zu unserer Cookie-Richtlinie kontaktieren Sie uns bitte:
                </p>
                <div className="bg-background border border-border p-6 rounded-xl">
                  <p className="font-semibold">Umzugscheck GmbH</p>
                  <p className="text-muted-foreground">E-Mail: <a href="mailto:datenschutz@umzugscheck.ch" className="text-primary hover:underline">datenschutz@umzugscheck.ch</a></p>
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

export default Cookies;
