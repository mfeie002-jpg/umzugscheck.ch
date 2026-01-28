import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Phone,
  CheckCircle2,
  Star,
  Clock,
  Truck,
  Shield,
  ArrowRight,
  Home,
  Building2,
  Users,
  Award
} from 'lucide-react';

export interface CantonData {
  name: string;
  slug: string;
  code: string;
  population: string;
  mainCity: string;
  cities: string[];
  zipCodes: string[];
  description: string;
  highlights: string[];
  movesCompleted: number;
  avgRating: number;
  reviewCount: number;
}

interface CantonLandingTemplateProps {
  canton: CantonData;
}

const CantonLandingTemplate = ({ canton }: CantonLandingTemplateProps) => {
  const services = [
    { icon: Home, title: 'Privatumzüge', description: `Stressfreie Haushaltsumzüge in ${canton.name}` },
    { icon: Building2, title: 'Büroumzüge', description: 'Professionelle Firmenumzüge mit minimaler Ausfallzeit' },
    { icon: Users, title: 'Seniorenumzüge', description: 'Einfühlsamer Service für ältere Kunden' },
    { icon: Truck, title: 'Möbeltransport', description: 'Sicherer Transport von Einzelmöbeln' },
  ];

  const features = [
    'Kostenlose Besichtigung vor Ort',
    'Faire Festpreise ohne versteckte Kosten',
    'Vollversicherung bis CHF 100\'000',
    'Montage & Demontage inklusive',
    'Umzugsmaterial gratis',
    'Pünktlichkeitsgarantie',
  ];

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    "name": `Feierabend Umzüge ${canton.name}`,
    "description": canton.description,
    "url": `https://feierabend-umzuege.ch/area/${canton.slug}`,
    "telephone": "+41 76 568 13 02",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": canton.name
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": canton.avgRating.toString(),
      "reviewCount": canton.reviewCount.toString()
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Umzugsfirma {canton.name} - Feierabend Umzüge | Ihr Partner in {canton.mainCity}</title>
        <meta 
          name="description" 
          content={`Umzugsfirma in ${canton.name}: ${canton.movesCompleted}+ erfolgreiche Umzüge, ${canton.avgRating}★ Bewertung. Privatumzüge, Büroumzüge in ${canton.cities.slice(0, 3).join(', ')}. Jetzt kostenlose Offerte!`} 
        />
        <meta name="keywords" content={`umzugsfirma ${canton.name.toLowerCase()}, umzug ${canton.mainCity.toLowerCase()}, ${canton.cities.map(c => `umzug ${c.toLowerCase()}`).join(', ')}`} />
        <link rel="canonical" href={`https://feierabend-umzuege.ch/area/${canton.slug}`} />
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/30" />
        <div className="absolute top-20 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <Badge className="mb-4 bg-primary/10 text-primary">
              <MapPin className="w-3 h-3 mr-1" />
              Kanton {canton.code}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Ihre Umzugsfirma in <span className="text-primary">{canton.name}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              {canton.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
                <Star className="w-5 h-5 fill-warning text-warning" />
                <span className="font-semibold">{canton.avgRating}</span>
                <span className="text-muted-foreground">({canton.reviewCount} Bewertungen)</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
                <Truck className="w-5 h-5 text-primary" />
                <span className="font-semibold">{canton.movesCompleted.toLocaleString()}+</span>
                <span className="text-muted-foreground">Umzüge</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Antwort in 2h</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="gap-2">
                <Link to="/contact">
                  Kostenlose Offerte
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2">
                <a href="tel:+41765681302">
                  <Phone className="w-4 h-4" />
                  Jetzt anrufen
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <AnimatedSection>
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Unsere Leistungen in {canton.name}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-primary/10">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <service.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Features */}
      <AnimatedSection>
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">
                  <Award className="w-3 h-3 mr-1" />
                  Warum Feierabend
                </Badge>
                <h2 className="text-3xl font-bold mb-6">
                  Das zeichnet uns in {canton.name} aus
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Städte in {canton.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {canton.cities.map((city) => (
                      <Badge key={city} variant="secondary" className="text-sm py-1 px-3">
                        {city}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Postleitzahlen:</p>
                    <p className="text-sm">{canton.zipCodes.join(', ')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection>
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Shield className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bereit für Ihren Umzug in {canton.name}?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Erhalten Sie jetzt eine kostenlose und unverbindliche Offerte
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/contact">Offerte anfragen</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                <Link to="/calculator">Kostenrechner</Link>
              </Button>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <Footer />
    </div>
  );
};

export default CantonLandingTemplate;
