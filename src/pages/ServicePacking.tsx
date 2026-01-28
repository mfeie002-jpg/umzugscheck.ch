import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Package, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicePageWrapper from "@/components/ServicePageWrapper";
import packingImage from "@/assets/service-packing-navy-alpine.jpg";

const ServicePacking = () => {
  const materials = [
    "Hochwertige Umzugskartons in verschiedenen Grössen",
    "Spezialkartons für Kleider, Bücher, Geschirr",
    "Luftpolsterfolie und Packpapier",
    "Möbeldecken und Kantenschutz",
    "Klebeband und Etiketten",
    "Spezialverpackung für Kunstwerke",
    "TV- und Bildschirm-Schutzkartons",
    "Matratzenüberzüge",
  ];

  const specialItems = [
    {
      title: "Kunstwerke & Antiquitäten",
      description: "Massgeschneiderte Holzkisten und Klimaschutz für wertvolle Gegenstände",
    },
    {
      title: "Glaswaren & Porzellan",
      description: "Einzelverpackung mit speziellen Polstermaterialien",
    },
    {
      title: "Elektronik",
      description: "ESD-sichere Verpackung für empfindliche Geräte",
    },
    {
      title: "Klaviere & Instrumente",
      description: "Spezial-Transportkisten mit Klimaschutz",
    },
  ];

  return (
    <ServicePageWrapper currentLabel="Verpackung">
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-4">
                <Package className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-balance">Verpackungsservice</h1>
              <p className="text-xl text-muted-foreground">
                Professionelle Verpackung mit hochwertigen Materialien. Ihre Wertsachen sind 
                optimal geschützt – vom Geschirr bis zum Gemälde.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                    Offerte anfragen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-strong">
              <img
                src={packingImage}
                alt="Verpackungsservice"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-balance">Unsere Verpackungsmaterialien</h2>
            <p className="text-xl text-muted-foreground">
              Nur das Beste für Ihre wertvollen Besitztümer
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {materials.map((item, index) => (
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

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-balance">Spezialverpackungen</h2>
            <p className="text-xl text-muted-foreground">
              Individueller Schutz für besondere Gegenstände
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {specialItems.map((item, index) => (
              <Card key={index} className="p-8 hover-lift">
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="p-8 text-center">
                <Shield className="h-12 w-12 text-alpine mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Versicherungsschutz</h3>
                <p className="text-sm text-muted-foreground">
                  Vollständige Absicherung aller verpackten Güter
                </p>
              </Card>
              <Card className="p-8 text-center">
                <Clock className="h-12 w-12 text-alpine mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Zeitersparnis</h3>
                <p className="text-sm text-muted-foreground">
                  Profis packen schneller und sicherer als in Eigenregie
                </p>
              </Card>
              <Card className="p-8 text-center">
                <Package className="h-12 w-12 text-alpine mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Materiallieferung</h3>
                <p className="text-sm text-muted-foreground">
                  Alle Materialien werden angeliefert und nach Gebrauch entsorgt
                </p>
              </Card>
            </div>

            <Card className="p-8 bg-muted/50">
              <h3 className="text-xl font-semibold mb-4">Teilservice möglich</h3>
              <p className="text-muted-foreground mb-4">
                Sie möchten nur bestimmte Dinge von uns verpacken lassen? Kein Problem! 
                Wir bieten auch Teilverpackungen an:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-alpine mt-1">•</span>
                  <span>Nur Küche und Geschirr</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-alpine mt-1">•</span>
                  <span>Nur fragile Gegenstände</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-alpine mt-1">•</span>
                  <span>Nur Kunstwerke und Antiquitäten</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-alpine mt-1">•</span>
                  <span>Individuelle Kombination nach Ihren Wünschen</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-3xl mx-auto p-12 text-center">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-warm fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-xl text-muted-foreground mb-6 italic">
              "Die professionelle Verpackung war jeden Franken wert. Alles kam unversehrt an, 
              selbst unsere antiken Gläser. Absolute Empfehlung!"
            </p>
            <p className="font-semibold">Maria K.</p>
            <p className="text-sm text-muted-foreground">Privatumzug mit Komplettverpackung</p>
          </Card>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 bg-gradient-hero text-primary-foreground text-center">
            <h2 className="text-balance mb-6">Interesse am Verpackungsservice?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Lassen Sie sich beraten – wir finden die optimale Lösung für Ihren Bedarf.
            </p>
            <Link to="/contact">
              <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
                Jetzt Offerte anfragen
              </button>
            </Link>
          </Card>
        </div>
      </section>

      <Footer />
    </ServicePageWrapper>
  );
};

export default ServicePacking;
