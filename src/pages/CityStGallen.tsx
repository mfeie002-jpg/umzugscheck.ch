import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Phone, Star, Truck, Landmark, Mountain, Shield, CheckCircle, Building, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CitySchema from "@/components/CitySchema";
import OptimizedImage from "@/components/OptimizedImage";
import AnimatedSection from "@/components/AnimatedSection";
import cityImage from "@/assets/city-stgallen-navy-alpine.jpg";
import stgallenBranded from "@/assets/city-stgallen-navy-alpine.jpg";

const CityStGallen = () => {
  const districts = [
    { name: "Centrum", highlight: true },
    { name: "Bruggen", highlight: false },
    { name: "Haggen", highlight: false },
    { name: "Neudorf", highlight: false },
    { name: "Rotmonten", highlight: true },
    { name: "Stephanshorn", highlight: false },
    { name: "Tablat", highlight: false },
    { name: "Winkeln", highlight: false },
    { name: "Lachen", highlight: false },
    { name: "St. Georgen", highlight: false },
    { name: "Riethüsli", highlight: false },
    { name: "Heiligkreuz", highlight: false },
  ];

  const expertise = [
    { icon: Landmark, title: "UNESCO-Stiftsbezirk", text: "Spezialwissen für historische Gebäude und Denkmalpflege" },
    { icon: Mountain, title: "Hügelstadt", text: "Erfahrung mit steilen Strassen und speziellen Anforderungen" },
    { icon: Shield, title: "Textilstadt", text: "Expertise für Geschäfts- und Industrieumzüge" },
    { icon: Building, title: "Ostschweiz-Hub", text: "Verbindungen in die ganze Ostschweiz" },
  ];

  const testimonials = [
    {
      name: "Michael Weber",
      district: "Centrum",
      text: "Perfekte Organisation trotz der engen Altstadtgassen. Das Team kannte jeden Winkel und hat alles reibungslos abgewickelt.",
      rating: 5
    },
    {
      name: "Anna Huber",
      district: "Rotmonten",
      text: "Die steile Lage war kein Problem. Professionelles Team mit viel Erfahrung! Absolute Empfehlung für St. Gallen.",
      rating: 5
    },
    {
      name: "Patrick Sutter",
      district: "Bruggen",
      text: "Schnell, sorgfältig und freundlich. Genau wie man es sich wünscht. Der Umzug war in Rekordzeit erledigt.",
      rating: 5
    }
  ];

  const services = [
    { icon: Home, title: "Privatumzüge", text: "Für Wohnungen und Häuser in St. Gallen", link: "/plan/private" },
    { icon: Building, title: "Geschäftsumzüge", text: "Büros und Gewerbe im Stadtgebiet", link: "/plan/office" },
    { icon: Shield, title: "Spezialumzüge", text: "Für historische Bauten und steile Lagen", link: "/plan/vip" },
  ];

  return (
    <div className="min-h-screen">
      <CitySchema
        cityName="St. Gallen"
        description="Professionelle Umzugsfirma in St. Gallen. Experten für die Gallusstadt mit UNESCO-Stiftsbezirk."
        url="https://feierabend-umzuege.ch/area/stgallen"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 z-0">
          <img src={cityImage} alt="St. Gallen" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-subtle"></div>
        </div>
        
        <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 text-alpine mb-4">
              <MapPin className="h-6 w-6" />
              <span className="text-lg font-medium">St. Gallen</span>
            </div>
            <h1 className="text-balance font-display">Umzugsfirma St. Gallen</h1>
            <p className="text-xl text-muted-foreground">
              Ihr Experte für Umzüge in St. Gallen. Mit lokaler Expertise für die 
              Besonderheiten der Gallusstadt und der gesamten Ostschweiz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                  Offerte anfragen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="tel:+41765681302">
                <Button size="lg" variant="outline">
                  <Phone className="mr-2 h-5 w-5" />
                  Anrufen
                </Button>
              </a>
            </div>
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Landmark className="h-5 w-5 text-alpine" />
                <span>UNESCO-Experten</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-5 w-5 text-warm fill-warm" />
                <span>5.0 Bewertung</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Districts Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-balance font-display">Umzüge in der Gallusstadt</h2>
            <p className="text-xl text-muted-foreground">
              In allen Quartieren für Sie im Einsatz
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {districts.map((district, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <Card className={`p-4 text-center hover-lift ${district.highlight ? 'border-alpine bg-alpine/5' : ''}`}>
                  <p className="font-medium text-sm">{district.name}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12 space-y-4">
            <h2 className="text-balance font-display">St. Galler Expertise</h2>
            <p className="text-lg text-muted-foreground">Unsere Spezialkompetenzen vor Ort</p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {expertise.map((item, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="p-6 text-center hover-lift h-full">
                  <div className="w-12 h-12 rounded-xl bg-alpine/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-alpine" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Branded Section */}
      <section className="py-20 bg-alpine/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <AnimatedSection>
              <div className="relative h-[400px] rounded-xl overflow-hidden shadow-elegant">
                <OptimizedImage
                  src={stgallenBranded}
                  alt="Feierabend Umzüge Fahrzeug in St. Gallen"
                  className="w-full h-full object-cover"
                  containerClassName="h-full"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-alpine" />
                    <span className="font-semibold text-sm">Lokaler Service in St. Gallen</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="space-y-6">
                <h2 className="text-3xl font-display font-semibold">Ihr St. Galler Umzugspartner</h2>
                <p className="text-muted-foreground text-lg">
                  Expertise für die Gallusstadt – von steilen Strassen bis zum UNESCO-Stiftsbezirk. 
                  Wir meistern jede Herausforderung mit Schweizer Präzision.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Erfahrung mit UNESCO-Weltkulturerbe Stiftsbezirk</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Expertise für steile Hanglagen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Verbindungen in die ganze Ostschweiz</span>
                  </li>
                </ul>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-warm fill-warm" />
                    <span className="font-medium">5.0 Bewertung</span>
                  </div>
                  <div className="text-sm text-muted-foreground">|</div>
                  <div className="text-sm text-muted-foreground">Ostschweiz-Spezialisten</div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-balance font-display">Unsere Leistungen in St. Gallen</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="p-6 hover-lift h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-alpine/10 flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-alpine" />
                  </div>
                  <h3 className="font-semibold mb-3">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{service.text}</p>
                  <Link to={service.link} className="text-primary text-sm font-medium flex items-center">
                    Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-balance font-display">Kundenstimmen aus St. Gallen</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="p-8 h-full flex flex-col">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-warm fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic flex-grow">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.district}, St. Gallen</p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-balance mb-6 font-display">Bereit für Ihren Umzug in St. Gallen?</h2>
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
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary">
                Anrufen
              </Button>
            </a>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
};

export default CityStGallen;