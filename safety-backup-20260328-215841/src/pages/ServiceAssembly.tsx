import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicePageWrapper from "@/components/ServicePageWrapper";
import assemblyImage from "@/assets/service-assembly-navy-alpine.jpg";

const ServiceAssembly = () => {
  const services = [
    "Küchen (komplett)",
    "Kleiderschränke",
    "Schlafzimmer-Möbel",
    "Büromöbel",
    "Regalsysteme",
    "Einbauschränke",
    "IKEA-Möbel",
    "Designer-Möbel",
  ];

  return (
    <ServicePageWrapper currentLabel="Möbelmontage">
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-4">
                <Wrench className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-balance">Möbelmontage</h1>
              <p className="text-xl text-muted-foreground">
                Fachgerechter Auf- und Abbau Ihrer Möbel durch erfahrene Handwerker. 
                Von der einfachen Kommode bis zur kompletten Küche.
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
                src={assemblyImage}
                alt="Möbelmontage"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-balance">Was wir montieren</h2>
            <p className="text-xl text-muted-foreground">
              Von einfach bis komplex – wir haben die Erfahrung
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="p-6 text-center hover-lift">
                <CheckCircle className="h-8 w-8 text-alpine mx-auto mb-3" />
                <p className="font-medium">{service}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-8 text-center">Unser Service</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8">
                <h3 className="text-xl font-semibold mb-4">Demontage</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-alpine mr-2 mt-0.5 flex-shrink-0" />
                    <span>Fachgerechter Abbau aller Möbel</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-alpine mr-2 mt-0.5 flex-shrink-0" />
                    <span>Beschriftung und Sortierung aller Teile</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-alpine mr-2 mt-0.5 flex-shrink-0" />
                    <span>Sichere Verpackung von Kleinteilen</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-alpine mr-2 mt-0.5 flex-shrink-0" />
                    <span>Schutz empfindlicher Oberflächen</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8">
                <h3 className="text-xl font-semibold mb-4">Montage</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-alpine mr-2 mt-0.5 flex-shrink-0" />
                    <span>Professioneller Wiederaufbau</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-alpine mr-2 mt-0.5 flex-shrink-0" />
                    <span>Präzise Ausrichtung und Nivellierung</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-alpine mr-2 mt-0.5 flex-shrink-0" />
                    <span>Platzierung nach Ihren Wünschen</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-alpine mr-2 mt-0.5 flex-shrink-0" />
                    <span>Funktionskontrolle aller Schubladen/Türen</span>
                  </li>
                </ul>
              </Card>
            </div>

            <Card className="mt-8 p-8 bg-primary text-primary-foreground">
              <h3 className="text-xl font-semibold mb-4">Küchenmontage – Unsere Spezialität</h3>
              <p className="mb-4 opacity-90">
                Die Küche ist das Herzstück Ihres Zuhauses. Deshalb legen wir besonderen Wert 
                auf präzise Montage:
              </p>
              <ul className="space-y-2 opacity-90">
                <li>• Exakte Ausrichtung aller Schränke</li>
                <li>• Fachgerechter Anschluss von Elektrogeräten</li>
                <li>• Montage von Arbeitsplatten und Spülen</li>
                <li>• Koordination mit Handwerkern (Elektriker, Sanitär)</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 bg-gradient-hero text-primary-foreground text-center">
            <h2 className="text-balance mb-6">Brauchen Sie Montage-Service?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Sparen Sie Zeit und Nerven – unsere Profis kümmern sich darum.
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

export default ServiceAssembly;
