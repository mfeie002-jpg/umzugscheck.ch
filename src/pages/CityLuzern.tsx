import { Link } from "react-router-dom";
import { Phone, Star, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CitySchema from "@/components/CitySchema";
import OptimizedImage from "@/components/OptimizedImage";
import cityImage from "@/assets/city-luzern-navy-alpine.jpg";
import brandedTruck from "@/assets/city-luzern-navy-alpine.jpg";

const CityLuzern = () => {
  const districts = [
    "Altstadt", "Neustadt", "Hirschmatt", "Tribschen", "Littau",
    "Emmen", "Horw", "Kriens", "Ebikon", "Meggen"
  ];

  const expertise = [
    {
      title: "Historische Altstadt",
      description: "Erfahrung mit engen Gassen und denkmalgeschützten Gebäuden"
    },
    {
      title: "Seenähe",
      description: "Spezialwissen für Umzüge in Ufernähe und Feuchtgebieten"
    },
    {
      title: "Tourismuszone",
      description: "Flexible Zeitplanung während der Hauptsaison"
    }
  ];

  const services = [
    {
      title: "Privatumzüge",
      description: "Für Wohnungen und Häuser in der Region Luzern"
    },
    {
      title: "Geschäftsumzüge",
      description: "Büros und Geschäftslokale im Zentrum"
    },
    {
      title: "Lagerung",
      description: "Sichere Lagerräume in der Region"
    }
  ];

  const testimonials = [
    {
      name: "Familie Bachmann",
      district: "Altstadt",
      text: "Trotz der engen Gassen lief alles perfekt. Das Team war sehr professionell!",
      rating: 5
    },
    {
      name: "Thomas Keller",
      district: "Tribschen",
      text: "Pünktlich, freundlich und sorgfältig. Genau so stellt man sich einen guten Umzug vor.",
      rating: 5
    },
    {
      name: "Daniela Meier",
      district: "Kriens",
      text: "Von der Planung bis zur Durchführung war alles top organisiert. Sehr empfehlenswert!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      <CitySchema
        cityName="Luzern"
        description="Umzugsfirma Luzern und Zentralschweiz. Vom Vierwaldstättersee bis in die Berge - Ihr lokaler Umzugspartner."
        url="https://feierabend-umzuege.ch/area/luzern"
      />
      <Header />
      
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={cityImage}
            alt="Luzern"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-balance">Umzugsfirma Luzern</h1>
            <p className="text-xl text-muted-foreground">
              Ihr zuverlässiger Partner für Umzüge in Luzern und Umgebung. 
              Mit lokaler Expertise und Schweizer Qualität.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact">
                <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                  Offerte anfragen
                </Button>
              </Link>
              <a href="tel:+41765681302">
                <Button size="lg" variant="outline">
                  <Phone className="mr-2 h-5 w-5" />
                  Jetzt anrufen
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Ihre Umzugsfirma in Luzern</h2>
            <p className="text-lg text-muted-foreground">
              Als erfahrene Umzugsfirma kennen wir Luzern wie unsere Westentasche. 
              Von der historischen Altstadt bis zu den modernen Quartieren – wir sind Ihr 
              lokaler Experte für stressfreie Umzüge.
            </p>
          </div>
        </div>
      </section>

      {/* Branded Section */}
      <section className="py-16 bg-alpine/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            <div className="relative h-[300px] rounded-xl overflow-hidden shadow-lg">
              <OptimizedImage
                src={brandedTruck}
                alt="Feierabend Umzüge Fahrzeug in Luzern"
                className="w-full h-full object-cover"
                containerClassName="h-full"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-alpine" />
                  <span className="font-semibold text-sm">Lokaler Service in Luzern</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-semibold">Ihr Luzerner Umzugspartner</h3>
              <p className="text-muted-foreground">
                Von der Kapellbrücke bis zum Pilatus – wir kennen Luzern und Umgebung bestens. 
                Erfahrung mit historischen Altstadt-Gebäuden und touristische Flexibilität zeichnen uns aus.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-warm fill-warm" />
                  <span className="font-medium">5.0 Bewertung</span>
                </div>
                <div className="text-sm text-muted-foreground">|</div>
                <div className="text-sm text-muted-foreground">Zentralschweiz-Experten</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Districts */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Unsere Einsatzgebiete in Luzern</h2>
            <p className="text-muted-foreground">Wir sind in allen Stadtteilen für Sie da</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {districts.map((district, index) => (
              <Card key={index} className="p-4 text-center hover-lift">
                <MapPin className="h-6 w-6 text-alpine mx-auto mb-2" />
                <p className="font-medium">{district}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Local Expertise */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Luzerner Expertise</h2>
            <p className="text-muted-foreground">Was uns in Luzern auszeichnet</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {expertise.map((item, index) => (
              <Card key={index} className="p-6 hover-lift">
                <h3 className="font-semibold mb-2 text-lg">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Unsere Leistungen in Luzern</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="p-8 hover-lift">
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <Link to="/plan" className="text-alpine font-medium hover:underline">
                  Mehr erfahren →
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Kundenstimmen aus Luzern</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-warm fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.district}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Bereit für Ihren Umzug in Luzern?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Kontaktieren Sie uns für eine kostenlose Beratung und ein unverbindliches Angebot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="secondary">
                Offerte anfragen
              </Button>
            </Link>
            <a href="tel:+41765681302">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Anrufen
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CityLuzern;
