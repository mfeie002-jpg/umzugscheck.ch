import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Phone, Star, Truck, Mountain, Shield, Users, CheckCircle, Building, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CitySchema from "@/components/CitySchema";
import OptimizedImage from "@/components/OptimizedImage";
import AnimatedSection from "@/components/AnimatedSection";
import cityImage from "@/assets/city-lausanne-navy-alpine.jpg";
import lausanneBranded from "@/assets/city-lausanne-navy-alpine.jpg";

const CityLausanne = () => {
  const districts = [
    { name: "Centre", highlight: true },
    { name: "Sous-Gare", highlight: false },
    { name: "Montbenon", highlight: false },
    { name: "Ouchy", highlight: true },
    { name: "Flon", highlight: false },
    { name: "Montriond", highlight: false },
    { name: "Chailly", highlight: false },
    { name: "Sauvabelin", highlight: false },
    { name: "Vennes", highlight: false },
    { name: "Malley", highlight: false },
    { name: "Pully", highlight: false },
    { name: "Prilly", highlight: false },
  ];

  const expertise = [
    { icon: Mountain, title: "Topographie", text: "Expérience avec les rues en pente et terrains difficiles" },
    { icon: Users, title: "Bilingue", text: "Service en français et allemand" },
    { icon: Globe, title: "Région lémanique", text: "Expertise pour toute la région du Léman" },
    { icon: Shield, title: "Capitale Olympique", text: "Service premium pour la ville du CIO" },
  ];

  const testimonials = [
    {
      name: "Sophie Dubois",
      district: "Centre",
      text: "Service impeccable! L'équipe était très professionnelle et soigneuse. Malgré la pente, tout s'est très bien passé.",
      rating: 5
    },
    {
      name: "Marc Renaud",
      district: "Ouchy",
      text: "Excellent service bilingue. Communication parfaite du début à la fin. Je recommande vivement!",
      rating: 5
    },
    {
      name: "Catherine Leroux",
      district: "Sauvabelin",
      text: "Malgré la pente abrupte, tout s'est déroulé sans problème. Recommandation absolue pour Lausanne!",
      rating: 5
    }
  ];

  const services = [
    { icon: Building, title: "Déménagements privés", text: "Pour appartements et maisons à Lausanne", link: "/plan/private" },
    { icon: Shield, title: "Déménagements de bureaux", text: "Entreprises et administrations", link: "/plan/office" },
    { icon: Globe, title: "International", text: "Connexions vers la France voisine", link: "/plan/international" },
  ];

  return (
    <div className="min-h-screen">
      <CitySchema
        cityName="Lausanne"
        description="Service de déménagement à Lausanne. Umzüge am Genfersee und in der Westschweiz. Service bilingue."
        url="https://feierabend-umzuege.ch/area/lausanne"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 z-0">
          <img src={cityImage} alt="Lausanne" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-subtle"></div>
        </div>
        
        <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 text-alpine mb-4">
              <MapPin className="h-6 w-6" />
              <span className="text-lg font-medium">Lausanne</span>
            </div>
            <h1 className="text-balance font-display">Entreprise de déménagement Lausanne</h1>
            <p className="text-xl text-muted-foreground">
              Votre partenaire de confiance pour les déménagements à Lausanne et région. 
              Qualité suisse, service bilingue, expertise de la capitale olympique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                  Demander une offre
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="tel:+41765681302">
                <Button size="lg" variant="outline">
                  <Phone className="mr-2 h-5 w-5" />
                  Appeler
                </Button>
              </a>
            </div>
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Mountain className="h-5 w-5 text-alpine" />
                <span>Topographie-Experten</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-5 w-5 text-warm fill-warm" />
                <span>5.0 Évaluation</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Districts Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-balance font-display">Nos zones d'intervention à Lausanne</h2>
            <p className="text-xl text-muted-foreground">
              Présents dans tous les quartiers de la capitale olympique
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
            <h2 className="text-balance font-display">Expertise lausannoise</h2>
            <p className="text-lg text-muted-foreground">Ce qui nous distingue à Lausanne</p>
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
                  src={lausanneBranded}
                  alt="Équipe Feierabend Umzüge à Lausanne"
                  className="w-full h-full object-cover"
                  containerClassName="h-full"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-alpine" />
                    <span className="font-semibold text-sm">Service local à Lausanne</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="space-y-6">
                <h2 className="text-3xl font-display font-semibold">Votre partenaire à Lausanne</h2>
                <p className="text-muted-foreground text-lg">
                  Service bilingue pour vos déménagements dans la capitale olympique. 
                  Expertise avec les rues en pente et les quartiers historiques de la ville.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Expérience avec la topographie lausannoise</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Équipe bilingue français-allemand</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Service premium pour toute la région lémanique</span>
                  </li>
                </ul>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-warm fill-warm" />
                    <span className="font-medium">5.0 Évaluation</span>
                  </div>
                  <div className="text-sm text-muted-foreground">|</div>
                  <div className="text-sm text-muted-foreground">Région lémanique</div>
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
            <h2 className="text-balance font-display">Nos services à Lausanne</h2>
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
                    En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
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
            <h2 className="text-balance font-display">Témoignages de Lausanne</h2>
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
                    <p className="text-sm text-muted-foreground">{testimonial.district}, Lausanne</p>
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
          <h2 className="text-balance mb-6 font-display">Prêt pour votre déménagement à Lausanne?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Contactez-nous pour une consultation gratuite et une offre sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="secondary">
                Demander une offre
              </Button>
            </Link>
            <a href="tel:+41765681302">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary">
                Appeler
              </Button>
            </a>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
};

export default CityLausanne;