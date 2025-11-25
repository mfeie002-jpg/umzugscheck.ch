import { SEOHead } from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Building2, Mail, Phone, MapPin, Globe } from "lucide-react";

const Impressum = () => {
  return (
    <>
      <SEOHead
        title="Impressum | Umzugscheck.ch"
        description="Impressum von Umzugscheck.ch - Angaben gemäss schweizerischem Recht."
        canonical="/impressum"
        noindex={true}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Breadcrumbs 
            items={[
              { label: "Startseite", href: "/" },
              { label: "Impressum", href: "/impressum" }
            ]}
          />

          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Building2 className="w-10 h-10 text-primary" />
              <h1 className="text-4xl font-bold">Impressum</h1>
            </div>

            <div className="space-y-8">
              {/* Firmeninformationen */}
              <section className="bg-muted/30 p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6">Angaben gemäss schweizerischem Recht</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Building2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Firmenname</h3>
                      <p className="text-muted-foreground">Umzugscheck GmbH</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Adresse</h3>
                      <p className="text-muted-foreground">
                        Bahnhofstrasse 100<br />
                        8001 Zürich<br />
                        Schweiz
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">E-Mail</h3>
                      <a 
                        href="mailto:info@umzugscheck.ch" 
                        className="text-primary hover:underline"
                      >
                        info@umzugscheck.ch
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Telefon</h3>
                      <a 
                        href="tel:+41445678900" 
                        className="text-primary hover:underline"
                      >
                        +41 44 567 89 00
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Globe className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Website</h3>
                      <a 
                        href="https://umzugscheck.ch" 
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        www.umzugscheck.ch
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Handelsregister */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Handelsregister</h2>
                <div className="bg-background border border-border p-6 rounded-xl space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">UID</p>
                      <p className="font-mono">CHE-123.456.789</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">Handelsregisternummer</p>
                      <p className="font-mono">CH-020.1.234.567-8</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">Rechtsform</p>
                      <p>Gesellschaft mit beschränkter Haftung (GmbH)</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">Gründungsjahr</p>
                      <p>2024</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Vertretungsberechtigte */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Vertretungsberechtigte Personen</h2>
                <div className="bg-background border border-border p-6 rounded-xl">
                  <p className="text-muted-foreground">
                    Geschäftsführer: Max Muster
                  </p>
                </div>
              </section>

              {/* Zweck */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Zweck</h2>
                <p className="text-muted-foreground">
                  Betrieb einer Online-Vergleichsplattform für Umzugsdienstleistungen in der Schweiz. 
                  Vermittlung zwischen Endkunden und geprüften Umzugsfirmen.
                </p>
              </section>

              {/* Haftungsausschluss */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Haftungsausschluss</h2>
                <h3 className="text-xl font-semibold mb-3">Inhalte</h3>
                <p className="text-muted-foreground mb-4">
                  Die Inhalte unserer Seiten wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit, 
                  Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
                </p>

                <h3 className="text-xl font-semibold mb-3">Links</h3>
                <p className="text-muted-foreground mb-4">
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
                  Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter 
                  oder Betreiber der Seiten verantwortlich.
                </p>

                <h3 className="text-xl font-semibold mb-3">Urheberrecht</h3>
                <p className="text-muted-foreground">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                  dem schweizerischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede 
                  Art der Verwertung ausserhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                  Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
              </section>

              {/* Streitbeilegung */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Streitbeilegung</h2>
                <p className="text-muted-foreground">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit. 
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </section>

              {/* Kontakt */}
              <section className="bg-primary text-primary-foreground rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-4">Fragen?</h2>
                <p className="mb-4 text-primary-foreground/90">
                  Bei Fragen oder Anliegen können Sie uns jederzeit kontaktieren:
                </p>
                <div className="space-y-2">
                  <p>
                    <a href="mailto:info@umzugscheck.ch" className="hover:underline">
                      info@umzugscheck.ch
                    </a>
                  </p>
                  <p>
                    <a href="tel:+41445678900" className="hover:underline">
                      +41 44 567 89 00
                    </a>
                  </p>
                </div>
              </section>

              <p className="text-sm text-muted-foreground italic">
                Stand: Januar 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Impressum;
