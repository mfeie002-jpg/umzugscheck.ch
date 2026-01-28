import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Phone, Star, Truck, Landmark, Shield, Users, CheckCircle, Building, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CitySchema from "@/components/CitySchema";
import OptimizedImage from "@/components/OptimizedImage";
import AnimatedSection from "@/components/AnimatedSection";
import bernImage from "@/assets/city-bern-navy-alpine.jpg";
import bernBranded from "@/assets/city-bern-navy-alpine.jpg";

const CityBern = () => {
  const districts = [
    { name: "Bern City", highlight: true },
    { name: "Bümpliz", highlight: false },
    { name: "Länggasse", highlight: true },
    { name: "Breitenrain", highlight: false },
    { name: "Lorraine", highlight: false },
    { name: "Kirchenfeld", highlight: false },
    { name: "Mattenhof", highlight: false },
    { name: "Bethlehem", highlight: false },
    { name: "Weissenbühl", highlight: false },
    { name: "Ostermundigen", highlight: false },
    { name: "Köniz", highlight: false },
    { name: "Muri", highlight: false },
  ];

  const expertise = [
    { icon: Landmark, title: "UNESCO-Altstadt", text: "Erfahrung mit historischen Lauben und Kopfsteinpflaster" },
    { icon: Shield, title: "Bundesviertel", text: "Diskretion bei Umzügen im Regierungsviertel" },
    { icon: Building, title: "Aare-Quartiere", text: "Zugang zu schwierigen Lagen am Fluss" },
    { icon: Users, title: "Behörden-Erfahrung", text: "Spezialisiert auf Amts- und Büroumzüge" },
  ];

  const testimonials = [
    {
      name: "Familie Gerber",
      district: "Kirchenfeld",
      text: "Professionell, pünktlich und sehr sorgfältig. Unser Umzug in Bern war perfekt organisiert! Das Team kannte sogar alle Parkplätze in der Altstadt.",
      rating: 5
    },
    {
      name: "Thomas H.",
      district: "Länggasse",
      text: "Absolut empfehlenswert! Das Team war freundlich und kannte sich in Bern bestens aus. Der Umzug in den 4. Stock ohne Lift war kein Problem.",
      rating: 5
    },
    {
      name: "Bundesamt XY",
      district: "Bundesviertel",
      text: "Unser Behördenumzug wurde diskret und effizient durchgeführt. Absolute Empfehlung für Büroumzüge in Bern!",
      rating: 5
    }
  ];

  const services = [
    { icon: Building, title: "Privatumzüge", text: "Zuverlässige Umzüge in Bern und Region", link: "/plan/private" },
    { icon: Landmark, title: "Büroumzüge", text: "Firmen- und Behördenumzüge in der Hauptstadt", link: "/plan/office" },
    { icon: Heart, title: "Seniorenumzüge", text: "Besondere Sorgfalt und Geduld für ältere Menschen", link: "/plan/senior" },
  ];

  return (
    <div className="min-h-screen">
      <CitySchema
        cityName="Bern"
        description="Professionelle Umzugsfirma in der Bundesstadt Bern. Von der Altstadt bis zum Umland."
        url="https://feierabend-umzuege.ch/area/bern"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 z-0">
          <img src={bernImage} alt="Bern" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-subtle"></div>
        </div>
        
        <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 text-alpine mb-4">
              <MapPin className="h-6 w-6" />
              <span className="text-lg font-medium">Bern</span>
            </div>
            <h1 className="text-balance font-display">Umzugsfirma Bern</h1>
            <p className="text-xl text-muted-foreground">
              Ihr verlässlicher Umzugspartner in der Bundesstadt. Professionelle Umzüge 
              in Bern und der gesamten Region mit Schweizer Präzision.
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
                <span>Altstadt-Spezialisten</span>
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
            <h2 className="text-balance font-display">Umzüge in ganz Bern</h2>
            <p className="text-xl text-muted-foreground">
              Vom historischen Zentrum bis zur Agglomeration
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
            <h2 className="text-balance font-display">Bern-Spezialwissen</h2>
            <p className="text-lg text-muted-foreground">Was uns in Bern besonders macht</p>
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
                  src={bernBranded}
                  alt="Feierabend Umzüge Fahrzeug in Bern"
                  className="w-full h-full object-cover"
                  containerClassName="h-full"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-alpine" />
                    <span className="font-semibold text-sm">Lokaler Service in Bern</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="space-y-6">
                <h2 className="text-3xl font-display font-semibold">Ihr Berner Umzugspartner</h2>
                <p className="text-muted-foreground text-lg">
                  Von der historischen Altstadt bis zu den modernen Quartieren – wir kennen die Bundesstadt. 
                  Erfahrung mit engen Gassen und historischen Gebäuden zeichnet uns aus.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Erfahrung mit UNESCO-Weltkulturerbe Altstadt</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Diskrete Behörden- und Diplomatenumzüge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Alle Bewilligungen für autofreie Zonen</span>
                  </li>
                </ul>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-warm fill-warm" />
                    <span className="font-medium">5.0 Bewertung</span>
                  </div>
                  <div className="text-sm text-muted-foreground">|</div>
                  <div className="text-sm text-muted-foreground">Altstadt-Spezialisten</div>
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
            <h2 className="text-balance font-display">Unsere Leistungen in Bern</h2>
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
            <h2 className="text-balance font-display">Kundenstimmen aus Bern</h2>
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
                    <p className="text-sm text-muted-foreground">{testimonial.district}, Bern</p>
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
          <h2 className="text-balance mb-6 font-display">Bereit für Ihren Umzug in Bern?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Kontaktieren Sie uns für eine kostenlose Beratung und ein unverbindliches Angebot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="secondary">
                Jetzt Offerte anfragen
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

export default CityBern;