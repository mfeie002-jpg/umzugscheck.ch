import { Link } from "react-router-dom";
import { Phone, Star, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CitySchema from "@/components/CitySchema";
import OptimizedImage from "@/components/OptimizedImage";
import cityImage from "@/assets/city-winterthur-navy-alpine.jpg";
import brandedTruck from "@/assets/city-winterthur-navy-alpine.jpg";

const CityWinterthur = () => {
  const districts = [
    "Altstadt", "Neuwiesen", "Töss", "Veltheim", "Wülflingen",
    "Seen", "Mattenbach", "Hegi", "Oberwinterthur", "Stadt"
  ];

  const expertise = [
    {
      title: "Altstadt-Expertise",
      description: "Erfahrung mit historischen Bauten und engen Gassen"
    },
    {
      title: "Industrie & Gewerbe",
      description: "Spezialwissen für Geschäfts- und Industrieumzüge"
    },
    {
      title: "Pendler-freundlich",
      description: "Flexible Zeiten für berufstätige Kunden"
    }
  ];

  const services = [
    {
      title: "Privatumzüge",
      description: "Für Wohnungen und Häuser in Winterthur"
    },
    {
      title: "Geschäftsumzüge",
      description: "Büros und Industriebetriebe"
    },
    {
      title: "Express-Service",
      description: "Schnelle Umzüge für Pendler"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Widmer",
      district: "Altstadt",
      text: "Trotz der engen Altstadt-Gassen lief alles reibungslos. Top Service!",
      rating: 5
    },
    {
      name: "Markus Frei",
      district: "Töss",
      text: "Sehr flexibel bei der Terminplanung. Perfekt für Berufstätige!",
      rating: 5
    },
    {
      name: "Jennifer Steiner",
      district: "Seen",
      text: "Freundliches Team, faire Preise. Würde ich jederzeit wieder buchen.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={cityImage}
            alt="Winterthur"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-balance">Umzugsfirma Winterthur</h1>
            <p className="text-xl text-muted-foreground">
              Ihr verlässlicher Partner für Umzüge in Winterthur. Lokal verwurzelt, 
              schweizweit vernetzt.
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
            <h2 className="text-3xl font-bold">Umzüge in Winterthur</h2>
            <p className="text-lg text-muted-foreground">
              Als sechstgrößte Stadt der Schweiz bietet Winterthur eine einzigartige Mischung 
              aus Kultur, Industrie und Wohnen. Wir kennen die Stadt in all ihren Facetten und 
              sorgen für einen reibungslosen Umzug.
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
                alt="Feierabend Umzüge Fahrzeug in Winterthur"
                className="w-full h-full object-cover"
                containerClassName="h-full"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-alpine" />
                  <span className="font-semibold text-sm">Lokaler Service in Winterthur</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-semibold">Ihr Winterthurer Umzugspartner</h3>
              <p className="text-muted-foreground">
                Von der Altstadt bis in die Industrie-Quartiere – wir kennen Winterthur und Umgebung. 
                Flexible Termine für Pendler und schneller Express-Service sind unsere Stärke.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-warm fill-warm" />
                  <span className="font-medium">5.0 Bewertung</span>
                </div>
                <div className="text-sm text-muted-foreground">|</div>
                <div className="text-sm text-muted-foreground">Pendler-freundlich</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Districts */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Unsere Einsatzgebiete in Winterthur</h2>
            <p className="text-muted-foreground">In allen Stadtkreisen für Sie da</p>
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
            <h2 className="text-3xl font-bold mb-4">Winterthurer Expertise</h2>
            <p className="text-muted-foreground">Was uns in Winterthur auszeichnet</p>
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
            <h2 className="text-3xl font-bold mb-4">Unsere Leistungen in Winterthur</h2>
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
            <h2 className="text-3xl font-bold mb-4">Kundenstimmen aus Winterthur</h2>
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
          <h2 className="text-3xl font-bold mb-6">Bereit für Ihren Umzug in Winterthur?</h2>
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

export default CityWinterthur;
