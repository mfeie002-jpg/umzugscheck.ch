import { Link } from "react-router-dom";
import { ArrowRight, Zap, Sparkles, Truck, Package, Home, Wrench, Paintbrush, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Options = () => {
  const options = [
    {
      icon: Zap,
      title: "Elektriker-Service",
      description: "Professionelle Elektroarbeiten: Lampen, Herd, Geschirrspüler anschliessen, TV-Wandmontage.",
      price: "Ab CHF 120.-",
      link: "/option/electrical"
    },
    {
      icon: Sparkles,
      title: "Reinigung",
      description: "Endreinigung alte Wohnung oder Grundreinigung neue Wohnung nach Schweizer Standard.",
      price: "Ab CHF 15.- /m²",
      link: "/option/cleaning"
    },
    {
      icon: Package,
      title: "Premium-Verpackung",
      description: "Spezialverpackung für Kunstwerke, Antiquitäten und hochwertige Gegenstände.",
      price: "Auf Anfrage",
      link: "/plan/packing"
    },
    {
      icon: Home,
      title: "Möbel-Zwischenlagerung",
      description: "Klimatisierte, sichere Lagerung für kurz- oder langfristige Aufbewahrung.",
      price: "Ab CHF 80.- /m³/Monat",
      link: "/plan/storage"
    },
    {
      icon: Wrench,
      title: "Küchen-Service",
      description: "Fachgerechter Aus- und Einbau Ihrer Küche inklusive Anschlüsse.",
      price: "Ab CHF 800.-",
      link: "/option/kitchen"
    },
    {
      icon: Paintbrush,
      title: "Malerarbeiten",
      description: "Professionelle Malerarbeiten für alte oder neue Wohnung.",
      price: "Ab CHF 25.- /m²",
      link: "/option/painting"
    },
    {
      icon: Truck,
      title: "Klavier-Transport",
      description: "Spezialisierter Transport von Klavieren und Flügeln mit Fachpersonal.",
      price: "Ab CHF 450.-",
      link: "/option/piano"
    },
    {
      icon: Truck,
      title: "Auto-Transport",
      description: "Professioneller Fahrzeugtransport innerhalb der Schweiz und ins Ausland.",
      price: "Auf Anfrage",
      link: "/option/car"
    },
    {
      icon: Package,
      title: "Entsorgung",
      description: "Umweltgerechte Entsorgung von Möbeln, Hausrat und Sperrmüll.",
      price: "Ab CHF 150.-",
      link: "/option/disposal"
    },
    {
      icon: Wrench,
      title: "Handwerker-Service",
      description: "Kleine Reparaturen, Bohrarbeiten, Regalmontage und mehr.",
      price: "Ab CHF 95.- /Std",
      link: "/option/handyman"
    },
    {
      icon: ClipboardCheck,
      title: "Wohnungsabnahme-Service",
      description: "Professionelle Dokumentation und Begleitung bei der Wohnungsabnahme.",
      price: "Ab CHF 200.-",
      link: "/option/inspection"
    },
    {
      icon: Home,
      title: "Gartenmöbel-Service",
      description: "Demontage, Transport und Montage von Gartenmöbeln und Outdoor-Equipment.",
      price: "Ab CHF 250.-",
      link: "/option/garden"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-balance">Zusatzleistungen</h1>
            <p className="text-xl text-muted-foreground">
              Erweitern Sie Ihr Umzugspaket mit professionellen Zusatzleistungen 
              für einen rundum sorglosen Umzug.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Card className="p-8 mb-16 bg-alpine/10 border-2 border-alpine">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Kostenlose Services inklusive!</h2>
                <p className="text-muted-foreground mb-6">
                  Viele Services wie Möbel-Clean, Schutz-Socken und Basis-Montage sind 
                  bereits in allen Paketen enthalten.
                </p>
                <Link to="/option/free">
                  <Button variant="outline" className="border-alpine text-alpine hover:bg-alpine hover:text-white">
                    Kostenlose Services ansehen
                  </Button>
                </Link>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {options.map((option, index) => (
                <Card key={index} className="p-6 hover-lift cursor-pointer h-full">
                  <div className="flex flex-col h-full">
                    <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center mb-4">
                      <option.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow">{option.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm font-semibold text-alpine">{option.price}</span>
                      <Link to={option.link} className="text-sm text-primary font-medium flex items-center">
                        Details <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-8 bg-muted/30">
              <h2 className="text-2xl font-semibold mb-6 text-center">Wie funktioniert's?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-alpine/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-alpine">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Paket wählen</h3>
                  <p className="text-sm text-muted-foreground">
                    Wählen Sie Ihr Umzugspaket (Basis, Halb oder Voll)
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-alpine/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-alpine">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Optionen hinzufügen</h3>
                  <p className="text-sm text-muted-foreground">
                    Fügen Sie gewünschte Zusatzleistungen hinzu
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-alpine/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-alpine">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Offerte erhalten</h3>
                  <p className="text-sm text-muted-foreground">
                    Wir erstellen Ihr massgeschneidertes Angebot
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8 text-center">Häufig kombiniert</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white">
                <h3 className="font-semibold mb-3">Beliebtes Kombi-Paket 1</h3>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li>✓ Halb-Paket</li>
                  <li>✓ Elektriker-Service</li>
                  <li>✓ Endreinigung alt</li>
                </ul>
                <p className="text-sm font-semibold text-alpine">Spart bis zu 15%</p>
              </Card>

              <Card className="p-6 bg-white">
                <h3 className="font-semibold mb-3">Beliebtes Kombi-Paket 2</h3>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li>✓ Voll-Paket</li>
                  <li>✓ Küchen-Service</li>
                  <li>✓ Endreinigung alt + neu</li>
                </ul>
                <p className="text-sm font-semibold text-alpine">Spart bis zu 20%</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-balance mb-6">Individuelle Bedürfnisse?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Sie benötigen eine spezielle Leistung, die hier nicht aufgeführt ist? 
            Kontaktieren Sie uns – wir finden eine Lösung!
          </p>
          <Link to="/contact">
            <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
              Jetzt persönliches Angebot anfragen
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Options;
