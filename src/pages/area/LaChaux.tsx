import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { MapPin, Star, Users, Clock, Truck, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedSection from '@/components/AnimatedSection';
import heroImage from '@/assets/city-lachaux-branded.jpg';

const localTestimonials = [
  {
    name: 'François Huguenin',
    location: 'La Chaux-de-Fonds - Centre',
    rating: 5,
    text: 'Déménagement parfait malgré la neige! Équipe très professionnelle et ponctuelle.',
    date: 'Novembre 2024'
  },
  {
    name: 'Christine Jacot',
    location: 'Le Locle',
    rating: 5,
    text: 'Service excellent du Locle vers la Chaux. Très satisfaite du travail accompli.',
    date: 'Octobre 2024'
  },
  {
    name: 'René Berthoud',
    location: 'La Chaux-de-Fonds - Quartier des Forges',
    rating: 5,
    text: 'Équipe efficace qui connaît bien les immeubles historiques de la ville.',
    date: 'Septembre 2024'
  }
];

const localStats = [
  { icon: Truck, value: '156', label: 'Umzüge im Jura' },
  { icon: Star, value: '4.8', label: 'Bewertung' },
  { icon: Users, value: '3', label: 'Lokale Mitarbeiter' },
  { icon: Clock, value: '24h', label: 'Antwortzeit' }
];

const districts = [
  'Centre-ville', 'Quartier des Forges', 'Les Eplatures', 'La Cibourg', 
  'Les Crêtets', 'Le Locle', 'Les Brenets', 'La Brévine', 'Les Ponts-de-Martel', 'Col-des-Roches'
];

export default function LaChaux() {
  return (
    <>
      <Helmet>
        <title>Déménagement La Chaux-de-Fonds | Feierabend Umzüge - Montagnes neuchâteloises</title>
        <meta name="description" content="Professionelle Umzugsfirma in La Chaux-de-Fonds & Le Locle. ✓ UNESCO-Welterbe Expertise ✓ Wintererfahrung ✓ Devis gratuit!" />
        <meta name="keywords" content="déménagement la chaux-de-fonds, déménageur le locle, umzug jura, entreprise déménagement montagnes neuchâteloises" />
        <link rel="canonical" href="https://feierabend-umzuege.ch/area/lachaux" />
      </Helmet>

      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-alpine/10 via-background to-primary/5 overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="Umzug La Chaux-de-Fonds" className="w-full h-full object-cover opacity-20" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
        </div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-alpine rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-alpine" />
              <span className="text-alpine font-medium">La Chaux-de-Fonds & Le Locle</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Déménagement <span className="text-alpine">La Chaux-de-Fonds</span>
              <br />
              <span className="text-2xl md:text-3xl text-muted-foreground font-normal">Patrimoine UNESCO – expertise montagnarde</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              La Chaux-de-Fonds – métropole horlogère classée au patrimoine mondial de l'UNESCO. 
              Notre équipe maîtrise les défis de cette ville unique à 1000m d'altitude.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-alpine hover:bg-alpine/90" asChild>
                <Link to="/contact">
                  Devis gratuit
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+41765681302">
                  <Phone className="mr-2 w-5 h-5" />
                  Appeler maintenant
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-alpine text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {localStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatedSection className="py-16 md:py-24" animation="fade">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Experts des <span className="text-alpine">Montagnes neuchâteloises</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Troisième ville de Romandie, La Chaux-de-Fonds impressionne par son urbanisme 
                en damier et son patrimoine horloger. Nous connaissons chaque rue et bâtiment.
              </p>
              <ul className="space-y-3">
                {[
                  'Expérience hivernale à 1000m',
                  'Immeubles Art nouveau & Jugendstil',
                  'Ateliers horlogers & manufactures',
                  'La Chaux ↔ Le Locle spécialiste',
                  'Toute la vallée de La Brévine'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-alpine flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-alpine/10 to-primary/10 rounded-2xl p-8">
              <h3 className="font-semibold mb-4">Quartiers & communes desservis:</h3>
              <div className="flex flex-wrap gap-2">
                {districts.map((district) => (
                  <span key={district} className="px-3 py-1 bg-background rounded-full text-sm border">
                    {district}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Témoignages de nos <span className="text-alpine">clients</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {localTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-xl p-6 shadow-sm border"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-alpine text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Déménagement prévu à La Chaux-de-Fonds?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour un devis gratuit et sans engagement.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/contact">
              Demander un devis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MovingCompany",
          "name": "Feierabend Umzüge La Chaux-de-Fonds",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "La Chaux-de-Fonds",
            "addressRegion": "NE",
            "addressCountry": "CH"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 47.1035,
            "longitude": 6.8266
          },
          "areaServed": districts.map(d => ({ "@type": "City", "name": d })),
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "42"
          }
        })}
      </script>
    </>
  );
}
