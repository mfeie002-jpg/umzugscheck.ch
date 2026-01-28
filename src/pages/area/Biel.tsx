import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MapPin, Star, Phone, ArrowRight, CheckCircle, Users, Truck, Languages, Watch } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";
import SectionBadge from "@/components/SectionBadge";
import MobileBottomNav from "@/components/MobileBottomNav";
import heroImage from "@/assets/city-biel-navy-alpine.jpg";
const districts = [
  "Altstadt", "Mett", "Bözingen", "Madretsch", "Vingelz",
  "Champagne", "Nidau", "Port", "Brügg", "Ipsach"
];

const testimonials = [
  {
    name: "Jean-Marc Gerber",
    location: "Biel Altstadt → Nidau",
    text: "Service parfait et équipe très professionnelle. Un déménagement sans stress!",
    rating: 5
  },
  {
    name: "Familie Moser",
    location: "Bern → Biel Mett",
    text: "Die zweisprachige Betreuung war super. Das Team spricht fliessend Deutsch und Französisch.",
    rating: 5
  },
  {
    name: "Sophie Béguin",
    location: "Biel → La Neuveville",
    text: "Même pour les régions viticoles du lac, le service était impeccable.",
    rating: 5
  }
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  "name": "Feierabend Umzüge Biel",
  "description": "Umzugsfirma Biel/Bienne - Service bilingue dans la métropole horlogère. Deutsch und Französisch.",
  "areaServed": { "@type": "City", "name": "Biel/Bienne", "containedInPlace": { "@type": "Country", "name": "Schweiz" } },
  "address": { "@type": "PostalAddress", "addressLocality": "Biel/Bienne", "postalCode": "2500", "addressCountry": "CH" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "72" }
};

const BielPage = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Umzugsfirma Biel/Bienne - Feierabend Umzüge | Service bilingue</title>
        <meta name="description" content="Umzugsfirma Biel/Bienne: Service bilingue in der Uhrenmetropole. ✓ Deutsch & Französisch ✓ Festpreise ✓ Vollversichert. Demandez une offre!" />
        <meta name="keywords" content="umzugsfirma biel, déménagement bienne, umzug biel, zügeln biel, entreprise de déménagement bienne, uhrenstadt" />
        <link rel="canonical" href="https://feierabend-umzuege.ch/area/biel" />
        <meta property="og:title" content="Umzugsfirma Biel/Bienne - Service bilingue | Feierabend Umzüge" />
        <meta property="og:description" content="Service bilingue dans la métropole horlogère. Deutsch und Französisch." />
        <script type="application/ld+json">{JSON.stringify(localSchema)}</script>
      </Helmet>

      <Header />

      <section className="relative py-20 md:py-32 bg-gradient-to-br from-forest/10 via-alpine/5 to-background overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="Umzug Biel/Bienne" className="w-full h-full object-cover opacity-20" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
        </div>
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Languages className="h-5 w-5 text-forest" />
              <span className="text-forest font-medium">Biel/Bienne – Bilingue</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient-hero">Umzugsfirma Biel</span> – Service bilingue
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Die grösste zweisprachige Stadt der Schweiz – wir sprechen Ihre Sprache. Deutsch und Französisch, kein Problem!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact">
                <Button size="lg" className="bg-gradient-hero w-full sm:w-auto">
                  Offre gratuite / Kostenlose Offerte
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" onClick={() => window.location.href = "tel:+41765681302"}>
                <Phone className="mr-2 h-5 w-5" />
                +41 76 568 13 02
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-forest text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <AnimatedSection>
              <p className="text-3xl md:text-4xl font-bold">160+</p>
              <p className="text-sm opacity-80">Déménagements/Jahr</p>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <p className="text-3xl md:text-4xl font-bold">2</p>
              <p className="text-sm opacity-80">Langues / Sprachen</p>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-3xl md:text-4xl font-bold">4.8★</p>
              <p className="text-sm opacity-80">Google Bewertung</p>
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <p className="text-3xl md:text-4xl font-bold">24h</p>
              <p className="text-sm opacity-80">Réponse / Antwort</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <SectionBadge variant="forest">Notre force / Unsere Stärke</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              <span className="text-gradient-hero">Bilingue</span> an der Sprachgrenze
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Languages, title: "Service bilingue", desc: "Kommunikation auf Deutsch und Französisch" },
              { icon: Watch, title: "Uhrenindustrie", desc: "Präzise Umzüge für Swatch, Rolex & Co." },
              { icon: Users, title: "Bielersee-Region", desc: "Von Biel bis La Neuveville und Erlach" }
            ].map((service, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="p-6 h-full hover-lift">
                  <service.icon className="h-10 w-10 text-forest mb-4" />
                  <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.desc}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Districts */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              Actifs dans <span className="text-gradient-warm">tout Biel/Bienne</span>
            </h2>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {districts.map((district, index) => (
              <AnimatedSection key={index} delay={index * 0.03}>
                <span className="px-4 py-2 bg-background rounded-full text-sm border border-border hover:border-forest transition-colors">
                  {district}
                </span>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <SectionBadge variant="warm">Témoignages / Kundenstimmen</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Ce que les Biennois <span className="text-gradient-warm">disent de nous</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="p-6 h-full">
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warm text-warm" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-forest" />
                    <span className="font-medium">{testimonial.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{testimonial.location}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">Vos avantages à Biel/Bienne</h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              "Équipe bilingue",
              "Bielersee-Region",
              "Uhrenindustrie-Expertise",
              "Seeland-Kenntnis",
              "Zone interdiction incluse",
              "Horaires flexibles",
              "Monte-meubles disponible",
              "Stockage à Biel/Bienne"
            ].map((advantage, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                  <CheckCircle className="h-5 w-5 text-forest flex-shrink-0" />
                  <span className="text-sm">{advantage}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-forest to-alpine text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Déménagement à Biel/Bienne prévu?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Contactez-nous pour une offre gratuite – service en allemand et français.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" variant="secondary">
                  Demander une offre
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => window.location.href = "tel:+41765681302"}>
                <Phone className="mr-2 h-5 w-5" />
                Appeler maintenant
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default BielPage;
