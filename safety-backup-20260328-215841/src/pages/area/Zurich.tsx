import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DynamicHero } from "@/components/DynamicHero";
import { ExpressQuoteForm } from "@/components/ExpressQuoteForm";
import { PackageCards } from "@/components/PackageCards";
import { usePackagePreselection } from "@/hooks/usePackagePreselection";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, MapPin, Star, Shield } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { FeierabendButton } from "@/components/ui/FeierabendButton";
import { track } from "@/utils/track";
import { CONTACT_PHONE_E164 } from "@/config/contact";

const ZurichPage = () => {
  const localProofPoints = [
    "Kennen die engen Gassen im Niederdorf",
    "Organisieren Halteverbot bei der Stadt Zuerich",
    "Spezialisten fuer Altbauten und enge Treppenhaeuser",
    "Ueber 500 erfolgreiche Umzuege in Zuerich jaehrlich",
  ];

  const packages = [
    {
      id: "basis",
      name: "Basis",
      price: "CHF 590",
      features: ["Transport", "2 Umzugshelfer", "Basisversicherung"],
    },
    {
      id: "komfort",
      name: "Komfort",
      price: "CHF 990",
      features: ["Transport", "3 Umzugshelfer", "Verpackungsmaterial", "Vollversicherung"],
      isBestseller: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: "CHF 1'890",
      features: ["Full-Service", "4+ Umzugshelfer", "Packing", "Reinigung", "Entsorgung"],
    },
  ];

  const preselectedPackage = usePackagePreselection();

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Umzug Zuerich | Feierabend Umzuege - In 5 Min. Termin sichern</title>
        <meta
          name="description"
          content="Ihr Umzug in Zuerich mit Feierabend Umzuege - Halteverbot inkl. - Stadt-Kenner - Seit 1980 - Jetzt anrufen."
        />
        <link rel="canonical" href="https://feierabend-umzuege.ch/area/zurich" />
      </Helmet>

      <Header />

      <DynamicHero showTrustBadges />

      {/* Mobile-first speed-to-call strip */}
      <section className="md:hidden bg-white border-b border-line-default sticky top-14 z-40">
        <div className="container mx-auto px-4 py-3 space-y-2">
          <p className="text-sm font-semibold text-text-heading text-center">Sofort sprechen? In 5-10 Min gebucht.</p>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              onClick={() => track("cta_call_click", { location: "zurich_mobile_strip" })}
              className="col-span-2"
            >
              <FeierabendButton variant="primary" size="lg" fullWidth>
                Jetzt anrufen
              </FeierabendButton>
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold">
                Warum wir die beste Wahl fuer Ihren Umzug in Zuerich sind
              </h2>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {localProofPoints.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">{point}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Jetzt Verfuegbarkeit pruefen und Rueckruf erhalten
            </h2>
            <p className="text-xl text-muted-foreground">In 5-10 Minuten fix gebucht am Telefon</p>
          </div>
          <ExpressQuoteForm />
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Unsere Pakete fuer Zuerich
            </h2>
            <PackageCards packages={packages} preselectedPackage={preselectedPackage} />
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="flex justify-center mb-4">
                  <Star className="h-12 w-12 text-yellow-500 fill-yellow-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">5.0 Google Bewertung</h3>
                <p className="text-muted-foreground">Ueber 200 zufriedene Kunden</p>
              </div>

              <div>
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">CHF 2 Mio. versichert</h3>
                <p className="text-muted-foreground">Vollkasko fuer Ihre Moebel</p>
              </div>

              <div>
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Seit 1980</h3>
                <p className="text-muted-foreground">Familienunternehmen, 3 Generationen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ZurichPage;
