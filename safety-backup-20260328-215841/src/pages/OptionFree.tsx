import { Link } from "react-router-dom";
import { Sparkles, Shield, Recycle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import brandedEquipment from "@/assets/branded-equipment.jpg";

const OptionFree = () => {
  const freeServices = [
    {
      icon: Sparkles,
      title: "Möbel-Clean-Service",
      description: "Vor dem Transport reinigen wir Ihre Möbel mit einem feuchten Tuch. So kommen sie sauber in Ihrem neuen Zuhause an.",
      details: [
        "Abwischen aller Möbeloberflächen",
        "Entfernung von Staub und leichten Verschmutzungen",
        "Verwendung schonender Reinigungsmittel",
        "Keine zusätzlichen Kosten"
      ]
    },
    {
      icon: Shield,
      title: "Schutz-Socken-Service",
      description: "Unser Team wechselt vor der Arbeit in Ihrer neuen Wohnung in frische, saubere Überziehs ocken oder Hausschuhe.",
      details: [
        "Saubere Böden garantiert",
        "Respekt für Ihr neues Zuhause",
        "Standard bei jedem Umzug",
        "Keine Aufpreis"
      ]
    },
    {
      icon: Package,
      title: "Möbel-Aufbau-Service",
      description: "Grundlegende Möbelmontage ist in allen Paketen inklusive. Wir bauen Ihre Möbel fachgerecht auf und ab.",
      details: [
        "Demontage am alten Standort",
        "Sichere Verpackung der Einzelteile",
        "Montage am neuen Standort",
        "Funktionskontrolle"
      ]
    },
    {
      icon: Recycle,
      title: "Karton-Rücknahme",
      description: "Nach dem Auspacken holen wir Ihre leeren Umzugskartons kostenlos ab (bei Miete unserer Kartons).",
      details: [
        "Abholung nach Vereinbarung",
        "Umweltgerechte Entsorgung",
        "Gilt für gemietete Kartons",
        "Terminvereinbarung flexibel"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 text-alpine mb-4">
              <Sparkles className="h-6 w-6" />
              <span className="text-lg font-medium">Gratis inklusive</span>
            </div>
            <h1 className="text-balance">Kostenlose Zusatz-Services</h1>
            <p className="text-xl text-muted-foreground">
              Diese wertvollen Services sind bei jedem Umzug automatisch dabei – 
              ohne Aufpreis!
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {freeServices.map((service, index) => (
                <Card key={index} className="p-8 hover-lift">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-alpine/20 flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-alpine" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-muted-foreground">
                        <span className="text-alpine mt-1">✓</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>

            <Card className="p-8 mb-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Premium-Materialien inklusive</h2>
                  <p className="text-muted-foreground mb-6">
                    Bei allen unseren Paketen verwenden wir hochwertiges, gebrandetes 
                    Umzugsmaterial ohne Aufpreis:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <span className="text-alpine mt-1">✓</span>
                      <span><strong>Möbeldecken</strong> mit Feierabend Umzüge Logo</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-alpine mt-1">✓</span>
                      <span><strong>Kantenschutz</strong> und Polstermaterial</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-alpine mt-1">✓</span>
                      <span><strong>Spanngurte</strong> für sicheren Transport</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-alpine mt-1">✓</span>
                      <span><strong>Bodenschutz</strong> in beiden Wohnungen</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <img 
                    src={brandedEquipment} 
                    alt="Feierabend Umzüge Premium-Materialien" 
                    className="rounded-lg shadow-strong w-full h-auto"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-alpine/10 border-2 border-alpine">
              <h2 className="text-2xl font-semibold mb-4 text-center">Unser Versprechen</h2>
              <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-6">
                Diese Services sind bei uns Standard – nicht Extra. Wir glauben an 
                transparente Preise ohne versteckte Kosten. Was Sie sehen, ist was Sie bekommen.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-alpine mb-2">0 CHF</div>
                  <p className="text-sm text-muted-foreground">Aufpreis für Basis-Services</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-alpine mb-2">100%</div>
                  <p className="text-sm text-muted-foreground">Transparent</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-alpine mb-2">✓</div>
                  <p className="text-sm text-muted-foreground">Immer inklusive</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-6">Noch mehr Services verfügbar</h2>
            <p className="text-muted-foreground mb-8">
              Zusätzlich zu unseren kostenlosen Services bieten wir auch premium 
              Zusatzleistungen für spezielle Anforderungen.
            </p>
            <Link to="/option">
              <Button size="lg" variant="outline">
                Alle Zusatzleistungen ansehen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-balance mb-6">Bereit für Ihren Umzug?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Profitieren Sie von unseren kostenlosen Services und erhalten Sie 
            jetzt Ihr persönliches Angebot.
          </p>
          <Link to="/contact">
            <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
              Jetzt Offerte anfragen
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OptionFree;
