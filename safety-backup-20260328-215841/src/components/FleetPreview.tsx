import { Link } from "react-router-dom";
import { ArrowRight, Truck, CheckCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import AnimatedSection from "./AnimatedSection";
import fleetImage from "@/assets/fleet-new.jpg";

const fleetFeatures = [
  "15+ Fahrzeuge verschiedener Grössen",
  "Moderne Hebebühnen",
  "GPS-Tracking in Echtzeit",
  "Klimatisierte Laderäume",
  "Umweltfreundliche Euro 6 Motoren",
  "Spezialausrüstung für Klaviere"
];

export default function FleetPreview() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={fleetImage}
                alt="Feierabend Umzüge Fahrzeugflotte"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-3 text-white">
                  <Truck className="h-8 w-8" />
                  <div>
                    <p className="font-bold text-xl">Unsere Flotte</p>
                    <p className="text-sm opacity-80">Modernste Ausstattung für jeden Umzug</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full mb-4">
              Ausrüstung
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">
              Moderne Flotte für <span className="text-gradient">jeden Bedarf</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Von der kompakten Lieferwagen bis zum grossen LKW – wir haben das passende 
              Fahrzeug für Ihren Umzug. Alle Fahrzeuge sind bestens ausgestattet und gepflegt.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {fleetFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-alpine flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Link to="/fleet">
              <Button variant="outline" className="border-2">
                Flotte entdecken
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
