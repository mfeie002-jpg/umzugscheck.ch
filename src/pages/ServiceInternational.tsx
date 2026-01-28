import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Globe, Plane, Package, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicePageWrapper from "@/components/ServicePageWrapper";
import ServiceSchema from "@/components/ServiceSchema";
import internationalImage from "@/assets/service-international-navy-alpine.jpg";

const ServiceInternational = () => {
  const benefits = [
    {
      icon: Globe,
      title: "Weltweites Netzwerk",
      description: "Partner in über 150 Ländern für nahtlose Abwicklung",
    },
    {
      icon: FileText,
      title: "Zollabwicklung",
      description: "Komplette Unterstützung bei allen Zollformalitäten",
    },
    {
      icon: Package,
      title: "Rundum-Service",
      description: "Von Verpackung bis Auspacken am Zielort",
    },
  ];

  const included = [
    "Persönliche Beratung für internationalen Umzug",
    "Detaillierte Checkliste und Zeitplan",
    "Professionelle Exportverpackung",
    "Zolldokumentation und Abwicklung",
    "Seetransport oder Luftfracht",
    "Lagerung bei Bedarf",
    "Versicherung für internationalen Transport",
    "Lieferung und Auspacken am Zielort",
    "Unterstützung bei Behördengängen",
    "Mehrsprachiger Kundenservice",
  ];

  const destinations = [
    "Europa (alle Länder)",
    "Nordamerika (USA, Kanada)",
    "Asien (alle Hauptstädte)",
    "Australien & Neuseeland",
    "Naher Osten",
    "Südamerika",
    "Afrika",
    "UK & Irland",
  ];

  return (
    <ServicePageWrapper currentLabel="International">
      <ServiceSchema
        name="Internationale Umzüge"
        description="Weltweite Umzüge aus der Schweiz. Zollabwicklung, Transport und Lagerung mit unserem globalen Partnernetzwerk."
        url="https://feierabend-umzuege.ch/plan/international"
        priceRange="CHF 3000 - CHF 25000"
        areaServed={["Weltweit", "Europa", "USA", "Asien"]}
      />
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-4">
                <Globe className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-balance">Internationale Umzüge</h1>
              <p className="text-xl text-muted-foreground">
                Grenzenlos zuverlässig. Mit unserem weltweiten Netzwerk und jahrzehntelanger 
                Erfahrung bringen wir Ihr Leben sicher an jeden Ort der Welt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                    Offerte anfragen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="tel:+41765681302">
                  <Button size="lg" variant="outline">
                    Anrufen
                  </Button>
                </a>
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-strong">
              <img
                src={internationalImage}
                alt="Internationaler Umzug"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-balance">Warum Feierabend für Ihren Auslandsumzug?</h2>
            <p className="text-xl text-muted-foreground">
              Expertise und Zuverlässigkeit für Ihren internationalen Neustart
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-8 text-center hover-lift">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-6">
                  <benefit.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-balance">Komplettservice International</h2>
            <p className="text-xl text-muted-foreground">
              Von der Schweiz in die Welt – alles aus einer Hand
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {included.map((item, index) => (
              <Card key={index} className="p-6 hover-lift">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-alpine flex-shrink-0 mt-0.5" />
                  <p>{item}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-balance">Unsere Zielgebiete</h2>
            <p className="text-xl text-muted-foreground">
              Wir bringen Sie überall hin – sicher und zuverlässig
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {destinations.map((dest, index) => (
              <Card key={index} className="p-6 text-center hover-lift">
                <Plane className="h-8 w-8 text-alpine mx-auto mb-3" />
                <p className="font-medium">{dest}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-8 text-center">Häufige Fragen</h2>
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Wie lange dauert ein internationaler Umzug?</h3>
                <p className="text-muted-foreground">
                  Das hängt vom Zielland ab. Nach Europa 1-2 Wochen, Übersee 4-8 Wochen. 
                  Wir informieren Sie transparent über alle Zeitpläne.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Wie funktioniert die Zollabwicklung?</h3>
                <p className="text-muted-foreground">
                  Wir kümmern uns um alle Zollformalitäten und Dokumentationen. Sie erhalten 
                  von uns eine Checkliste mit allen notwendigen Unterlagen.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Ist mein Umzugsgut versichert?</h3>
                <p className="text-muted-foreground">
                  Ja, wir bieten Vollversicherung für den gesamten internationalen Transport. 
                  Die Versicherungssumme wird individuell nach Ihrem Bedarf angepasst.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 bg-gradient-hero text-primary-foreground text-center">
            <h2 className="text-balance mb-6">Ihr Auslandsumzug steht bevor?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Kontaktieren Sie uns für eine persönliche Beratung und ein detailliertes Angebot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
                  Jetzt Offerte anfragen
                </button>
              </Link>
              <a href="tel:+41765681302">
                <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary transition-colors">
                  Anrufen
                </button>
              </a>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </ServicePageWrapper>
  );
};

export default ServiceInternational;
