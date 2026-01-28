import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Building2, Sofa, Clock, Shield, Phone, Star } from 'lucide-react';
import heroImage from '@/assets/service-moebellift-navy-alpine.jpg';

const ServiceFurnitureLift = () => {
  const benefits = [
    { icon: Building2, title: 'Bis 30m Höhe', description: 'Möbellift für Gebäude bis zu 10 Stockwerken' },
    { icon: Sofa, title: 'Schwere Möbel', description: 'Transport von Klavieren, Sofas und grossen Schränken' },
    { icon: Clock, title: 'Zeitsparend', description: 'Bis zu 70% schneller als über das Treppenhaus' },
    { icon: Shield, title: 'Schonend', description: 'Kein Risiko für Beschädigungen an Treppenhäusern' },
  ];

  const situations = [
    'Enge oder verwinkelte Treppenhäuser',
    'Schwere Möbel wie Klaviere oder Tresore',
    'Übergrosse Gegenstände wie Sofas',
    'Empfindliche Antiquitäten',
    'Schneller Umzug in obere Stockwerke',
    'Büroumzüge mit schwerem Equipment',
  ];

  const process = [
    { step: '1', title: 'Beratung', description: 'Kostenlose Besichtigung und Bedarfsanalyse vor Ort' },
    { step: '2', title: 'Planung', description: 'Optimale Positionierung und Sicherheitskonzept' },
    { step: '3', title: 'Aufbau', description: 'Professioneller Aufbau des Möbellifts' },
    { step: '4', title: 'Transport', description: 'Sicherer Transport Ihrer Möbel' },
    { step: '5', title: 'Abbau', description: 'Sauberer Abbau ohne Rückstände' },
  ];

  return (
    <>
      <Helmet>
        <title>Möbellift & Aussenlift Service | Feierabend Umzüge</title>
        <meta name="description" content="Professioneller Möbellift-Service für schwere Möbel, Klaviere und übergrosse Gegenstände. Bis 30m Höhe, schnell und schonend. Jetzt anfragen!" />
        <meta name="keywords" content="möbellift, aussenlift, möbel transport, klavier transport, schwere möbel, umzug obere stockwerke" />
        <link rel="canonical" href="https://feierabend-umzuege.ch/plan/moebellift" />
      </Helmet>

      <Header />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
          </div>
          
          <div className="container relative z-10 py-20 md:py-32">
            <div className="max-w-2xl text-white">
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                Premium Möbellift-Service
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Möbellift & Aussenlift Service
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Schwere Möbel, enge Treppenhäuser, hohe Stockwerke? Mit unserem professionellen 
                Möbellift-Service transportieren wir Ihre Gegenstände sicher und schnell – 
                direkt durch das Fenster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="secondary" className="group">
                  <Link to="/contact">
                    Kostenlose Beratung
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <a href="tel:+41765681302">
                    <Phone className="mr-2 h-5 w-5" />
                    Jetzt anrufen
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Vorteile unseres Möbellift-Service
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Der sichere und effiziente Weg für schwere und grosse Möbelstücke
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* When to Use Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                  Wann brauchen Sie einen Möbellift?
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Ein Möbellift ist die ideale Lösung, wenn der Transport über das Treppenhaus 
                  nicht möglich oder zu riskant ist.
                </p>
                <div className="space-y-4">
                  {situations.map((situation, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-foreground">{situation}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8">
                <h3 className="font-display text-2xl font-bold mb-6">Unser Leistungsumfang</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-primary mt-0.5" />
                    <span>Möbellifte bis 30 Meter Höhe</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-primary mt-0.5" />
                    <span>Tragkraft bis 400 kg pro Ladung</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-primary mt-0.5" />
                    <span>Professionelle Bediener</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-primary mt-0.5" />
                    <span>Vollversicherung inklusive</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-primary mt-0.5" />
                    <span>Genehmigungen & Absperrungen</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                So funktioniert's
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                In 5 einfachen Schritten zu Ihrem erfolgreichen Möbellift-Einsatz
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-4">
              {process.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Möbellift benötigt?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Kontaktieren Sie uns für eine kostenlose Beratung und ein unverbindliches Angebot 
              für Ihren Möbellift-Einsatz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">Jetzt anfragen</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="tel:+41765681302">
                  <Phone className="mr-2 h-5 w-5" />
                  +41 76 568 13 02
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ServiceFurnitureLift;
