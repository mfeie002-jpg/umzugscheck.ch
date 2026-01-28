import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SwitzerlandMap = () => {
  const cities = [
    { name: "Zürich", path: "/area/zurich", region: "Zürich", color: "bg-alpine" },
    { name: "Genf", path: "/area/geneva", region: "Genf", color: "bg-alpine" },
    { name: "Basel", path: "/area/basel", region: "Basel-Stadt", color: "bg-alpine" },
    { name: "Bern", path: "/area/bern", region: "Bern", color: "bg-alpine" },
    { name: "Luzern", path: "/area/luzern", region: "Luzern", color: "bg-warm" },
    { name: "St. Gallen", path: "/area/stgallen", region: "St. Gallen", color: "bg-warm" },
    { name: "Winterthur", path: "/area/winterthur", region: "Zürich", color: "bg-warm" },
    { name: "Lausanne", path: "/area/lausanne", region: "Waadt", color: "bg-warm" },
    { name: "Lugano", path: "/area/lugano", region: "Tessin", color: "bg-forest" },
    { name: "Aarau", path: "/area/aarau", region: "Aargau", color: "bg-forest" },
    { name: "Chur", path: "/area/chur", region: "Graubünden", color: "bg-forest" },
    { name: "Thun", path: "/area/thun", region: "Bern", color: "bg-alpine" },
    { name: "Fribourg", path: "/area/fribourg", region: "Fribourg", color: "bg-warm" },
    { name: "Schaffhausen", path: "/area/schaffhausen", region: "Schaffhausen", color: "bg-forest" },
    { name: "Zug", path: "/area/zug", region: "Zug", color: "bg-alpine" },
    { name: "Solothurn", path: "/area/solothurn", region: "Solothurn", color: "bg-warm" },
    { name: "Biel", path: "/area/biel", region: "Bern", color: "bg-forest" }
  ];

  const regions = [
    {
      name: "Region Zürich",
      cities: ["Zürich", "Winterthur", "Uster", "Wetzikon", "Dietikon"],
      description: "Grösster Wirtschaftsraum der Schweiz"
    },
    {
      name: "Region Basel",
      cities: ["Basel", "Liestal", "Reinach", "Allschwil", "Muttenz"],
      description: "Dreiländereck Schweiz-Deutschland-Frankreich"
    },
    {
      name: "Bern & Mittelland",
      cities: ["Bern", "Thun", "Biel", "Langenthal", "Burgdorf"],
      description: "Hauptstadtregion und UNESCO-Welterbe"
    },
    {
      name: "Genferseeregion",
      cities: ["Genf", "Lausanne", "Montreux", "Nyon", "Vevey"],
      description: "Frankophone Schweiz mit internationalem Flair"
    },
    {
      name: "Zentralschweiz",
      cities: ["Luzern", "Zug", "Schwyz", "Stans", "Sarnen"],
      description: "Herz der Schweiz am Vierwaldstättersee"
    },
    {
      name: "Ostschweiz",
      cities: ["St. Gallen", "Chur", "Frauenfeld", "Herisau", "Kreuzlingen"],
      description: "Von Bodensee bis Graubünden"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <MapPin className="h-16 w-16 text-alpine mx-auto" />
            <h1 className="text-balance">Unsere Einsatzgebiete</h1>
            <p className="text-xl text-muted-foreground">
              Schweizweit für Sie im Einsatz. Von Stadt zu Stadt, von Region zu Region – 
              Feierabend Umzüge ist Ihr lokaler Partner im ganzen Land.
            </p>
          </div>
        </div>
      </section>

      {/* Main Cities */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Hauptstädte & Zentren</h2>
            <p className="text-muted-foreground">Klicken Sie auf eine Stadt für detaillierte Informationen</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {cities.map((city, index) => (
              <Link key={index} to={city.path}>
                <Card className="p-6 hover-lift cursor-pointer h-full group">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-16 h-16 rounded-full ${city.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{city.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{city.region}</p>
                      <div className="flex items-center text-alpine text-sm font-medium">
                        Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Regionen im Detail</h2>
            <p className="text-muted-foreground">Lokale Expertise in jeder Ecke der Schweiz</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {regions.map((region, index) => (
              <Card key={index} className="p-6 hover-lift">
                <h3 className="text-xl font-semibold mb-3">{region.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{region.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Hauptorte:</p>
                  <div className="flex flex-wrap gap-2">
                    {region.cities.map((city, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-muted rounded-full text-xs"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Info */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12">
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold">Ihre Stadt nicht dabei?</h2>
                <p className="text-lg text-muted-foreground">
                  Kein Problem! Wir bedienen die gesamte Schweiz. Auch wenn Ihre Stadt nicht 
                  aufgelistet ist, sind wir gerne für Sie da. Kontaktieren Sie uns für eine 
                  persönliche Beratung.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-alpine mb-2">26</div>
                    <p className="text-sm text-muted-foreground">Kantone</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-alpine mb-2">100+</div>
                    <p className="text-sm text-muted-foreground">Städte</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-alpine mb-2">1000+</div>
                    <p className="text-sm text-muted-foreground">Gemeinden</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Bereit für Ihren Umzug?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Egal wo in der Schweiz – wir sind für Sie da. Kontaktieren Sie uns für 
            eine kostenlose Beratung und ein unverbindliches Angebot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="secondary">
                Offerte anfragen
                <ArrowRight className="ml-2 h-5 w-5" />
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

export default SwitzerlandMap;
