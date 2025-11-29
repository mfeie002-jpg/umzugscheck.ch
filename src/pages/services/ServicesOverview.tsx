import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Home, Building2, Sparkles, Recycle, Warehouse, Globe } from "lucide-react";
import { motion } from "framer-motion";
import servicePrivatumzug from "@/assets/service-privatumzug.jpg";
import serviceFirmenumzug from "@/assets/service-firmenumzug.jpg";
import serviceReinigung from "@/assets/service-reinigung.jpg";
import serviceEntsorgung from "@/assets/service-entsorgung.jpg";

export default function ServicesOverview() {
  const services = [
    {
      title: "Privatumzug",
      description: "Kompletter Service für Ihren privaten Umzug in der ganzen Schweiz",
      image: servicePrivatumzug,
      link: "/umzug-schweiz",
      icon: Home
    },
    {
      title: "Firmenumzug",
      description: "Professionelle Büro- und Geschäftsumzüge mit minimalen Ausfallzeiten",
      image: serviceFirmenumzug,
      link: "/firmenumzug-schweiz",
      icon: Building2
    },
    {
      title: "Umzugsreinigung",
      description: "End- und Umzugsreinigung mit Abgabegarantie",
      image: serviceReinigung,
      link: "/umzugsreinigung-schweiz",
      icon: Sparkles
    },
    {
      title: "Entsorgung & Räumung",
      description: "Fachgerechte Entsorgung von Möbeln und Hausrat",
      image: serviceEntsorgung,
      link: "/entsorgung-schweiz",
      icon: Recycle
    },
    {
      title: "Möbellift & Spezialtransporte",
      description: "Für schwere Möbel und enge Treppenhäuser",
      link: "/moebellift-schweiz",
      icon: Warehouse
    },
    {
      title: "Internationaler Umzug",
      description: "Weltweite Umzüge ab der Schweiz",
      link: "/internationaler-umzug",
      icon: Globe
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Umzugsservices Schweiz – Alle Dienstleistungen im Überblick | umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Alle Umzugsservices in der Schweiz: Privatumzug, Firmenumzug, Reinigung, Entsorgung, Möbellift. Vergleichen Sie Angebote und sparen Sie bis zu 40%." 
        />
        <meta name="keywords" content="Umzugsservices Schweiz, Umzugsdienstleistungen, Umzug Reinigung Entsorgung" />
        <link rel="canonical" href="https://umzugscheck.ch/services" />
      </Helmet>

      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Unsere <span className="text-primary">Umzugsservices</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Von Privatumzug bis Firmenumzug, von Reinigung bis Entsorgung – alle Services aus einer Hand.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={service.link}>
                  <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer overflow-hidden">
                    {service.image && (
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                          <service.icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    )}
                    {!service.image && (
                      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <service.icon className="h-16 w-16 text-primary" />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Welchen Service benötigen Sie?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Beschreiben Sie Ihren Umzug und erhalten Sie passende Offerten
          </p>
          <Link to="/umzug-offerte">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg">
              Jetzt Offerten vergleichen
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}