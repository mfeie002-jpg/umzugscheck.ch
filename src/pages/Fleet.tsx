import { Truck, Shield, Zap, Leaf, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import fleetNew from "@/assets/fleet-new.jpg";
import brandedTruck from "@/assets/branded-truck-main.jpg";
import brandedFleet from "@/assets/branded-fleet.jpg";
import brandedEquipment from "@/assets/branded-equipment-pro.jpg";

const Fleet = () => {
  const vehicles = [
    {
      name: "Kleintransporter",
      capacity: "10-15 m³",
      description: "Perfekt für Single-Haushalte und kleine Wohnungen",
      features: ["Hebebühne", "GPS-Tracking", "Klimatisiert"],
    },
    {
      name: "Mittlerer Transporter",
      capacity: "20-30 m³",
      description: "Ideal für 2-3 Zimmer Wohnungen",
      features: ["Hebebühne", "GPS-Tracking", "Klimatisiert", "Möbelgurte"],
    },
    {
      name: "Grosser LKW",
      capacity: "40-50 m³",
      description: "Für grosse Wohnungen und Häuser",
      features: ["Hebebühne", "GPS-Tracking", "Klimatisiert", "Möbelgurte", "Rollwagen"],
    },
    {
      name: "Spezial-Transporter",
      capacity: "Individuell",
      description: "Maßgeschneiderte Lösungen für besondere Anforderungen",
      features: ["Massanfertigung", "Spezial-Equipment", "VIP-Ausstattung"],
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Vollversichert",
      description: "Alle Fahrzeuge sind vollumfänglich versichert",
    },
    {
      icon: Zap,
      title: "Modern ausgestattet",
      description: "Neueste Technik und Sicherheitssysteme",
    },
    {
      icon: Leaf,
      title: "Umweltfreundlich",
      description: "Euro 6 Motoren für geringere Emissionen",
    },
    {
      icon: Award,
      title: "Top gepflegt",
      description: "Regelmässige Wartung und perfekte Sauberkeit",
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Unsere Flotte - Moderne Umzugsfahrzeuge"
        description="Entdecken Sie unsere moderne Fahrzeugflotte für professionelle Umzüge. Kleintransporter bis Grosse LKWs - für jeden Umzug das richtige Fahrzeug."
        canonical="/fleet"
      />
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: 'https://feierabend-umzuege.ch/' },
          { name: 'Flotte', url: 'https://feierabend-umzuege.ch/fleet' }
        ]}
      />
      <Header />
      
      {/* Hero */}
      <section className="relative pt-28 lg:pt-36 pb-16 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={fleetNew}
            alt="Feierabend Umzüge Flotte"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70"></div>
        </div>
        <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl space-y-6">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
              Unsere Fahrzeuge
            </span>
            <h1 className="text-balance font-display">
              Unsere <span className="text-gradient">Flotte</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Moderne, gepflegte Fahrzeuge mit unverwechselbarem Feierabend Umzüge Branding. 
              Für jeden Umzug das passende Fahrzeug.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 text-center hover-lift">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-6">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Types */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-balance">Unsere Fahrzeugtypen</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Von kleinen Transportern bis zu grossen LKWs – wir haben für jeden Umzug die richtige Lösung
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {vehicles.map((vehicle, index) => (
              <Card key={index} className="p-8 hover-lift">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                    <Truck className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-2">{vehicle.name}</h3>
                    <div className="text-alpine font-semibold mb-2">{vehicle.capacity}</div>
                    <p className="text-muted-foreground mb-4">{vehicle.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {vehicle.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-alpine mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Images */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Unsere Fahrzeuge im Einsatz</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-strong hover-lift">
              <img
                src={brandedTruck}
                alt="Feierabend Umzüge Transporter"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-strong hover-lift">
              <img
                src={brandedFleet}
                alt="Feierabend Umzüge Flotte"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-balance">Professionelle Ausrüstung</h2>
              <p className="text-xl text-muted-foreground">
                Neben unseren erstklassigen Fahrzeugen verfügen wir über umfangreiches, 
                professionelles Equipment – alles mit unserem unverwechselbaren Branding.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-alpine mt-1">✓</span>
                  <span>Möbeldecken und Schutzpolster mit Feierabend Umzüge Logo</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-alpine mt-1">✓</span>
                  <span>Hochwertige Umzugskartons in verschiedenen Grössen</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-alpine mt-1">✓</span>
                  <span>Professionelle Transportwagen und Sackkarren</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-alpine mt-1">✓</span>
                  <span>Spezialausrüstung für schwere und empfindliche Güter</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-alpine mt-1">✓</span>
                  <span>Moderne Sicherungs- und Spannsysteme</span>
                </li>
              </ul>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-strong">
              <img
                src={brandedEquipment}
                alt="Feierabend Umzüge Equipment"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-balance mb-6">Erleben Sie unsere Flotte in Aktion</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Überzeugen Sie sich selbst von der Qualität unserer Fahrzeuge und der Professionalität unseres Teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact">
              <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
                Jetzt Offerte anfragen
              </button>
            </a>
            <a href="tel:+41765681302">
              <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary transition-colors">
                Anrufen
              </button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Fleet;
