import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Star, MapPin, ArrowRight, Calculator, CheckCircle2, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FAQAccordion } from "@/components/FAQAccordion";
import { LoadingSkeletonCompany } from "@/components/LoadingSkeletonCompany";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";

const CANTON_INFO: Record<string, {
  name: string;
  description: string;
  cities: string[];
  priceRange: { studio: string; twoRooms: string; threeRooms: string; house: string };
}> = {
  zuerich: {
    name: "Zürich",
    description: "Als grösster Kanton und Wirtschaftszentrum der Schweiz bietet Zürich eine breite Auswahl an professionellen Umzugsfirmen. Die Preise variieren je nach Stadtlage, Erreichbarkeit und Wohnungsgrösse. Von Privatumzügen bis zu Firmenumzügen – Zürich bietet für jeden Bedarf die passende Lösung.",
    cities: ["Zürich", "Winterthur", "Uster", "Dietikon", "Wetzikon", "Dübendorf", "Bülach", "Horgen"],
    priceRange: {
      studio: "CHF 800-1'200",
      twoRooms: "CHF 1'200-1'800",
      threeRooms: "CHF 1'800-2'800",
      house: "CHF 3'500-6'000",
    },
  },
  bern: {
    name: "Bern",
    description: "Die Bundesstadt und ihr Umland bieten solide Umzugsdienstleistungen mit fairen Preisen. Viele etablierte Familienbetriebe mit langjähriger Erfahrung sorgen für reibungslose Umzüge in der Region Bern. Besonders stark bei Privatumzügen und Wohnungsräumungen.",
    cities: ["Bern", "Köniz", "Ostermundigen", "Burgdorf", "Steffisburg", "Thun", "Langenthal", "Spiez"],
    priceRange: {
      studio: "CHF 700-1'000",
      twoRooms: "CHF 1'000-1'500",
      threeRooms: "CHF 1'500-2'400",
      house: "CHF 3'000-5'500",
    },
  },
  luzern: {
    name: "Luzern",
    description: "Zentralschweizer Umzugsfirmen überzeugen durch persönlichen Service und Ortskenntnisse. Ideal für Umzüge in die Ferienregion oder innerhalb der Tourismusstadt. Flexible Lösungen für anspruchsvolle Zufahrtsbedingungen in Altstadtlagen.",
    cities: ["Luzern", "Emmen", "Kriens", "Horw", "Ebikon", "Sursee", "Littau"],
    priceRange: {
      studio: "CHF 700-1'100",
      twoRooms: "CHF 1'100-1'600",
      threeRooms: "CHF 1'600-2'500",
      house: "CHF 3'100-5'600",
    },
  },
  uri: {
    name: "Uri",
    description: "Bergkanton mit spezialisierten Umzugsdiensten für alpine Lagen. Erfahrene Teams kennen die Herausforderungen von Umzügen in Bergregionen. Faire Preise trotz anspruchsvoller Zufahrtswege und Höhenlagen.",
    cities: ["Altdorf", "Schattdorf", "Bürglen", "Erstfeld", "Andermatt"],
    priceRange: {
      studio: "CHF 750-1'150",
      twoRooms: "CHF 1'150-1'700",
      threeRooms: "CHF 1'700-2'600",
      house: "CHF 3'200-5'800",
    },
  },
  schwyz: {
    name: "Schwyz",
    description: "Zentral gelegener Kanton mit guter Anbindung und kompetenten Umzugsfirmen. Ideal für Umzüge zwischen Stadt und Land. Spezialisiert auf Umzüge im Raum Zürich-Luzern mit starken lokalen Partnern.",
    cities: ["Schwyz", "Freienbach", "Einsiedeln", "Küssnacht", "Arth", "Lachen"],
    priceRange: {
      studio: "CHF 720-1'100",
      twoRooms: "CHF 1'100-1'650",
      threeRooms: "CHF 1'650-2'550",
      house: "CHF 3'100-5'700",
    },
  },
  obwalden: {
    name: "Obwalden",
    description: "Kleiner Kanton mit persönlichem Service und regionalen Umzugsspezialisten. Perfekt für Umzüge in die Innerschweiz mit Kenntnissen der lokalen Gegebenheiten. Zuverlässige Partner für Privatumzüge.",
    cities: ["Sarnen", "Kerns", "Alpnach", "Giswil", "Engelberg"],
    priceRange: {
      studio: "CHF 730-1'120",
      twoRooms: "CHF 1'120-1'680",
      threeRooms: "CHF 1'680-2'580",
      house: "CHF 3'150-5'750",
    },
  },
  nidwalden: {
    name: "Nidwalden",
    description: "Kompakte Region mit flexiblen Umzugslösungen am Vierwaldstättersee. Spezialisiert auf Umzüge in Seelage mit besonderen Zugangsanforderungen. Erfahrene Teams für Altstadtumzüge in Stans.",
    cities: ["Stans", "Hergiswil", "Stansstad", "Buochs", "Ennetbürgen"],
    priceRange: {
      studio: "CHF 720-1'110",
      twoRooms: "CHF 1'110-1'670",
      threeRooms: "CHF 1'670-2'570",
      house: "CHF 3'120-5'720",
    },
  },
  glarus: {
    name: "Glarus",
    description: "Überschaubarer Kanton mit zuverlässigen lokalen Umzugsanbietern. Gute Preise und persönliche Betreuung. Besondere Expertise bei Umzügen in Hanglagen und engen Dorfkernen.",
    cities: ["Glarus", "Näfels", "Schwanden", "Ennenda", "Linthal"],
    priceRange: {
      studio: "CHF 710-1'090",
      twoRooms: "CHF 1'090-1'640",
      threeRooms: "CHF 1'640-2'540",
      house: "CHF 3'050-5'650",
    },
  },
  zug: {
    name: "Zug",
    description: "Steuergünstiger Kanton mit hoher Nachfrage und erstklassigen Umzugsfirmen. Premium-Services für internationale Kunden und Expatriates. Mehrsprachige Teams und White-Glove-Service verfügbar.",
    cities: ["Zug", "Baar", "Cham", "Steinhausen", "Rotkreuz", "Hünenberg"],
    priceRange: {
      studio: "CHF 820-1'250",
      twoRooms: "CHF 1'250-1'850",
      threeRooms: "CHF 1'850-2'850",
      house: "CHF 3'600-6'200",
    },
  },
  freiburg: {
    name: "Freiburg",
    description: "Zweisprachiger Kanton mit breitem Angebot an Umzugsdienstleistern. Services in Deutsch und Französisch verfügbar. Starke Verbindungen zwischen Stadt und Land, ideal für regionale Umzüge.",
    cities: ["Freiburg", "Bulle", "Villars-sur-Glâne", "Marly", "Düdingen", "Murten"],
    priceRange: {
      studio: "CHF 690-1'050",
      twoRooms: "CHF 1'050-1'580",
      threeRooms: "CHF 1'580-2'480",
      house: "CHF 3'000-5'600",
    },
  },
  solothurn: {
    name: "Solothurn",
    description: "Zentral gelegener Kanton mit gutem Preis-Leistungs-Verhältnis. Viele kleinere und mittlere Umzugsfirmen mit persönlichem Service. Ideal für Umzüge im Mittelland mit guter Verkehrsanbindung.",
    cities: ["Solothurn", "Olten", "Grenchen", "Biberist", "Zuchwil", "Trimbach"],
    priceRange: {
      studio: "CHF 700-1'080",
      twoRooms: "CHF 1'080-1'620",
      threeRooms: "CHF 1'620-2'520",
      house: "CHF 3'080-5'680",
    },
  },
  "basel-stadt": {
    name: "Basel-Stadt",
    description: "Internationaler Kanton mit erstklassigen Umzugsfirmen und grenzüberschreitender Expertise. Perfekt für Umzüge nach Deutschland und Frankreich. Premium-Services und mehrsprachige Teams für Expatriates.",
    cities: ["Basel", "Riehen", "Bettingen"],
    priceRange: {
      studio: "CHF 780-1'180",
      twoRooms: "CHF 1'180-1'750",
      threeRooms: "CHF 1'750-2'700",
      house: "CHF 3'300-5'900",
    },
  },
  "basel-landschaft": {
    name: "Basel-Landschaft",
    description: "Umzugsregion mit starker Verbindung zur Stadt Basel und guten regionalen Anbietern. Ausgewogene Preise zwischen Stadt und Land. Spezialisiert auf Vorstadt- und Familienwohnungen.",
    cities: ["Liestal", "Allschwil", "Reinach", "Muttenz", "Pratteln", "Binningen"],
    priceRange: {
      studio: "CHF 730-1'130",
      twoRooms: "CHF 1'130-1'700",
      threeRooms: "CHF 1'700-2'650",
      house: "CHF 3'200-5'850",
    },
  },
  schaffhausen: {
    name: "Schaffhausen",
    description: "Nördlichster Kanton mit kompetenten Umzugsfirmen und grenznah zu Deutschland. Gute Preise und zuverlässiger Service. Expertise bei grenzüberschreitenden Umzügen und Rheinfallregion.",
    cities: ["Schaffhausen", "Neuhausen am Rheinfall", "Stein am Rhein", "Thayngen"],
    priceRange: {
      studio: "CHF 710-1'100",
      twoRooms: "CHF 1'100-1'650",
      threeRooms: "CHF 1'650-2'550",
      house: "CHF 3'100-5'700",
    },
  },
  "appenzell-ausserrhoden": {
    name: "Appenzell Ausserrhoden",
    description: "Traditioneller Kanton mit lokalen Umzugsanbietern und Bergexpertise. Persönlicher Service mit Kenntnis der regionalen Besonderheiten. Spezialisiert auf Umzüge in hügeligem Gelände.",
    cities: ["Herisau", "Speicher", "Teufen", "Heiden", "Trogen"],
    priceRange: {
      studio: "CHF 720-1'110",
      twoRooms: "CHF 1'110-1'670",
      threeRooms: "CHF 1'670-2'580",
      house: "CHF 3'150-5'750",
    },
  },
  "appenzell-innerrhoden": {
    name: "Appenzell Innerrhoden",
    description: "Kleinster Kanton mit familiären Umzugsdienstleistern. Persönlicher Service und faire Preise für lokale und regionale Umzüge. Kenntnis der alpinen Besonderheiten und engen Dorfstrukturen.",
    cities: ["Appenzell", "Gonten", "Oberegg", "Schlatt"],
    priceRange: {
      studio: "CHF 730-1'120",
      twoRooms: "CHF 1'120-1'680",
      threeRooms: "CHF 1'680-2'590",
      house: "CHF 3'180-5'780",
    },
  },
  "st-gallen": {
    name: "St. Gallen",
    description: "Ostschweizer Zentrum mit breitem Angebot an Umzugsfirmen. Von Privatumzügen bis Firmenumzügen – kompetente Partner in der ganzen Region. Gute Anbindung nach Zürich und ins Rheintal.",
    cities: ["St. Gallen", "Rapperswil-Jona", "Wil", "Gossau", "Buchs", "Uzwil"],
    priceRange: {
      studio: "CHF 720-1'110",
      twoRooms: "CHF 1'110-1'670",
      threeRooms: "CHF 1'670-2'580",
      house: "CHF 3'150-5'750",
    },
  },
  graubuenden: {
    name: "Graubünden",
    description: "Grösster Kanton mit spezialisiertem Service für Bergregionen und Tourismusorte. Erfahrene Teams für Davos, St. Moritz und Chur. Flexible Lösungen für anspruchsvolle alpine Umzüge und Saisonwohnungen.",
    cities: ["Chur", "Davos", "St. Moritz", "Arosa", "Thusis", "Landquart"],
    priceRange: {
      studio: "CHF 750-1'180",
      twoRooms: "CHF 1'180-1'750",
      threeRooms: "CHF 1'750-2'700",
      house: "CHF 3'300-6'000",
    },
  },
  aargau: {
    name: "Aargau",
    description: "Stark wachsender Kanton mit vielfältigem Umzugsangebot. Attraktive Preise und gute Anbindung an Zürich, Basel und Bern. Viele junge Familien nutzen die günstigen Wohnlagen – entsprechend hohe Nachfrage.",
    cities: ["Aarau", "Baden", "Wettingen", "Wohlen", "Rheinfelden", "Spreitenbach"],
    priceRange: {
      studio: "CHF 710-1'100",
      twoRooms: "CHF 1'100-1'650",
      threeRooms: "CHF 1'650-2'550",
      house: "CHF 3'100-5'700",
    },
  },
  thurgau: {
    name: "Thurgau",
    description: "Obstgarten der Schweiz mit soliden regionalen Umzugsfirmen. Gutes Preis-Leistungs-Verhältnis und persönlicher Service. Starke Verbindungen nach St. Gallen und Zürich.",
    cities: ["Frauenfeld", "Kreuzlingen", "Arbon", "Weinfelden", "Amriswil"],
    priceRange: {
      studio: "CHF 700-1'090",
      twoRooms: "CHF 1'090-1'640",
      threeRooms: "CHF 1'640-2'540",
      house: "CHF 3'080-5'680",
    },
  },
  tessin: {
    name: "Tessin",
    description: "Sonnenkanton mit italienischsprachigem Service und mediterranem Flair. Spezialisiert auf Umzüge in Hanglage und enge Altstadtgassen. Services auch in Deutsch verfügbar für Zuzüger aus der Deutschschweiz.",
    cities: ["Lugano", "Bellinzona", "Locarno", "Mendrisio", "Chiasso"],
    priceRange: {
      studio: "CHF 740-1'150",
      twoRooms: "CHF 1'150-1'720",
      threeRooms: "CHF 1'720-2'650",
      house: "CHF 3'250-5'900",
    },
  },
  waadt: {
    name: "Waadt",
    description: "Zweitgrösster Kanton mit erstklassigen Umzugsfirmen am Genfersee. Französischsprachiger Service mit internationaler Ausrichtung. Von Lausanne bis Montreux – Premium-Umzüge für anspruchsvolle Lagen.",
    cities: ["Lausanne", "Montreux", "Yverdon-les-Bains", "Vevey", "Nyon", "Morges"],
    priceRange: {
      studio: "CHF 760-1'170",
      twoRooms: "CHF 1'170-1'740",
      threeRooms: "CHF 1'740-2'680",
      house: "CHF 3'280-5'950",
    },
  },
  wallis: {
    name: "Wallis",
    description: "Alpenkanton mit Expertise für Bergumzüge und Feriendomizile. Zweisprachiger Service (Deutsch/Französisch) und Kenntnis der lokalen Gegebenheiten. Spezialisiert auf Zermatt, Verbier und Sion.",
    cities: ["Sion", "Sierre", "Monthey", "Brig", "Martigny", "Visp"],
    priceRange: {
      studio: "CHF 740-1'160",
      twoRooms: "CHF 1'160-1'730",
      threeRooms: "CHF 1'730-2'670",
      house: "CHF 3'270-5'950",
    },
  },
  neuenburg: {
    name: "Neuenburg",
    description: "Uhrmacher-Kanton mit zuverlässigen französischsprachigen Umzugsdiensten. Gutes Preis-Leistungs-Verhältnis und regionale Verbundenheit. Starke lokale Betriebe mit Familientradition.",
    cities: ["Neuenburg", "La Chaux-de-Fonds", "Le Locle", "Boudry", "Val-de-Travers"],
    priceRange: {
      studio: "CHF 700-1'080",
      twoRooms: "CHF 1'080-1'620",
      threeRooms: "CHF 1'620-2'520",
      house: "CHF 3'050-5'650",
    },
  },
  genf: {
    name: "Genf",
    description: "Internationales Zentrum mit erstklassigen mehrsprachigen Umzugsfirmen. Spezialisiert auf Expatriates und internationale Organisationen. Premium-Services und White-Glove-Umzüge für anspruchsvolle Kunden.",
    cities: ["Genf", "Vernier", "Lancy", "Meyrin", "Carouge", "Onex"],
    priceRange: {
      studio: "CHF 820-1'280",
      twoRooms: "CHF 1'280-1'900",
      threeRooms: "CHF 1'900-2'950",
      house: "CHF 3'700-6'500",
    },
  },
  jura: {
    name: "Jura",
    description: "Jüngster Kanton mit lokalen Umzugsanbietern und persönlichem Service. Faire Preise und französischsprachige Betreuung. Gute Anbindung an Basel und Bern für überregionale Umzüge.",
    cities: ["Delsberg", "Pruntrut", "Freibergen", "Courrendlin"],
    priceRange: {
      studio: "CHF 690-1'070",
      twoRooms: "CHF 1'070-1'610",
      threeRooms: "CHF 1'610-2'510",
      house: "CHF 3'030-5'630",
    },
  },
};

const Canton = () => {
  const { canton } = useParams<{ canton: string }>();
  const cantonKey = canton?.toLowerCase() || "";
  const info = CANTON_INFO[cantonKey];
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (info) {
      fetchCompanies();
    }
  }, [info]);

  const fetchCompanies = async () => {
    if (!info) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .contains("service_areas", [info.name])
        .order("rating", { ascending: false })
        .limit(6);

      if (!error && data) {
        setCompanies(data);
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!info) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Umzug {info.name} – Offerten vergleichen | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content={`Umzugsfirmen in ${info.name} vergleichen. ${info.description} Kostenlose Offerten von geprüften Umzugsunternehmen.`} 
        />
        <meta name="keywords" content={`Umzug ${info.name}, Umzugsfirma ${info.name}, Umzugskosten ${info.name}, ${info.cities.join(', ')}`} />
        <link rel="canonical" href={`https://umzugscheck.ch/umzug/${cantonKey}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Umzug ${info.name} – Die besten Umzugsfirmen vergleichen`} />
        <meta property="og:description" content={info.description} />
        <meta property="og:url" content={`https://umzugscheck.ch/umzug/${cantonKey}`} />
        
        {/* Structured Data - LocalBusiness */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `Umzugscheck.ch - ${info.name}`,
            "description": info.description,
            "areaServed": {
              "@type": "State",
              "name": info.name
            },
            "priceRange": info.priceRange.studio,
            "url": `https://umzugscheck.ch/umzug/${cantonKey}`
          })}
        </script>
        
        {/* Structured Data - BreadcrumbList */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Startseite",
                "item": "https://umzugscheck.ch"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Regionen",
                "item": "https://umzugscheck.ch/regionen"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": `Kanton ${info.name}`,
                "item": `https://umzugscheck.ch/umzug/${cantonKey}`
              }
            ]
          })}
        </script>
      </Helmet>

      <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Kanton nicht gefunden</h2>
            <p className="text-muted-foreground mb-6">Diese Seite ist noch nicht verfügbar.</p>
            <Link to="/">
              <Button>Zurück zur Startseite</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs
            items={[
              { label: "Startseite", href: "/" },
              { label: "Regionen", href: "/regionen" },
              { label: `Kanton ${info.name}` },
            ]}
          />
        </div>

        {/* Hero */}
        <section className="py-16 md:py-24 gradient-hero text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
                <MapPin className="w-3 h-3 mr-1" />
                Kanton {info.name}
              </Badge>
              <h1 className="mb-6">Umzug im Kanton {info.name}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">{info.description}</p>
              <Link to="/rechner">
                <Button size="lg" className="bg-accent hover:bg-accent/90 shadow-accent group">
                  Jetzt Offerten vergleichen
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Price Guide */}
        <section className="py-12 md:py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">Typische Umzugskosten in {info.name}</h2>
                <p className="text-muted-foreground">
                  Durchschnittliche Preise für lokale Umzüge (ca. 20-30 km)
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingDown className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold mb-2">Studio / 1 Zimmer</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{info.priceRange.studio}</div>
                    <p className="text-sm text-muted-foreground">≈ 20 m³</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingDown className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold mb-2">2 Zimmer</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{info.priceRange.twoRooms}</div>
                    <p className="text-sm text-muted-foreground">≈ 35 m³</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingDown className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold mb-2">3-4 Zimmer</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{info.priceRange.threeRooms}</div>
                    <p className="text-sm text-muted-foreground">≈ 50-65 m³</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingDown className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold mb-2">Haus / 5+ Zimmer</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{info.priceRange.house}</div>
                    <p className="text-sm text-muted-foreground">≈ 80-120 m³</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  *Preise sind Richtwerte und können je nach Umzugsdetails variieren.
                </p>
                <Link to="/rechner">
                  <Button variant="outline" size="lg">
                    Genaue Berechnung starten
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Teaser */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Card className="shadow-strong bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                        <Calculator className="w-4 h-4" />
                        <span>Kostenloses Tool</span>
                      </div>
                      <h2 className="text-3xl font-bold mb-4">Umzugskosten in {info.name} berechnen</h2>
                      <p className="text-muted-foreground mb-6">
                        Erhalten Sie in nur 60 Sekunden eine präzise Kostenschätzung für Ihren Umzug in {info.name}. 
                        Vergleichen Sie anschliessend bis zu 5 Offerten von geprüften Umzugsfirmen.
                      </p>
                      <Link to="/rechner">
                        <Button size="lg" className="w-full md:w-auto">
                          Jetzt kostenlos berechnen
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-medium">
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        Was Sie erhalten:
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Sofortige Kostenschätzung basierend auf Ihren Angaben</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Detaillierte Aufschlüsselung aller Kostenpunkte</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Bis zu 5 kostenlose Offerten von lokalen Firmen</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">100% unverbindlich und kostenlos</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Companies */}
        <section className="py-12 md:py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">Empfohlene Umzugsfirmen in {info.name}</h2>
                <p className="text-lg text-muted-foreground">
                  Geprüfte und bewertete Umzugsfirmen für Ihren Umzug in {info.name}
                </p>
              </div>
              
              {loading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, index) => (
                    <LoadingSkeletonCompany key={index} />
                  ))}
                </div>
              ) : companies.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {companies.map((company) => (
                      <Card key={company.id} className="hover-lift border-2 hover:border-primary/20 transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-light to-primary/5 flex items-center justify-center text-3xl shadow-soft flex-shrink-0">
                              {company.logo}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-bold text-lg">{company.name}</h3>
                                {company.verified && (
                                  <Badge className="bg-success text-white border-0 flex-shrink-0">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Geprüft
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(company.rating)
                                          ? "fill-accent text-accent"
                                          : "fill-muted text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="font-bold">{company.rating}</span>
                                <span className="text-sm text-muted-foreground">
                                  ({company.review_count})
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {company.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-4 text-sm">
                            {company.phone && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {company.email && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {company.price_level && (
                              <Badge variant="secondary" className="ml-auto">
                                {company.price_level}
                              </Badge>
                            )}
                          </div>
                          
                          <Link to={`/firmen/${company.id}`}>
                            <Button className="w-full bg-primary hover:bg-primary-dark">
                              Profil ansehen
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="text-center">
                    <Link to={`/firmen?canton=${info.name}`}>
                      <Button size="lg" variant="outline">
                        Alle {companies.length}+ Firmen in {info.name} anzeigen
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Aktuell sind keine Firmen für {info.name} verfügbar.
                    </p>
                    <Link to="/firmen">
                      <Button variant="outline">Alle Firmen durchsuchen</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Häufige Fragen zu Umzügen in {info.name}</h2>
              <FAQAccordion 
                items={[
                  {
                    question: `Wie viel kostet ein Umzug im Kanton ${info.name}?`,
                    answer: `Die Kosten für einen Umzug im Kanton ${info.name} variieren je nach Wohnungsgrösse, Distanz und zusätzlichen Services. Ein 3-Zimmer-Umzug kostet durchschnittlich ${info.priceRange.threeRooms}, ein Studio ${info.priceRange.studio}. Nutzen Sie unseren kostenlosen Umzugsrechner für eine genaue Schätzung basierend auf Ihren individuellen Anforderungen.`
                  },
                  {
                    question: "Wie lange im Voraus sollte ich eine Umzugsfirma buchen?",
                    answer: `Wir empfehlen, 4-6 Wochen vor dem geplanten Umzugstermin Offerten einzuholen. In ${info.name} sind besonders die Sommermonate und Monatsenden stark nachgefragt. Bei grösseren Umzügen oder speziellen Anforderungen sollten Sie 8-12 Wochen Vorlauf einplanen.`
                  },
                  {
                    question: `Welche Umzugsfirmen sind im Kanton ${info.name} aktiv?`,
                    answer: `Im Kanton ${info.name} sind über 20 geprüfte Umzugsfirmen aktiv, die wir auf Umzugscheck.ch listen. Die Anbieter decken alle Hauptorte ab: ${info.cities.slice(0, 3).join(', ')} und weitere Gemeinden. Nutzen Sie unseren Vergleich, um die passende Firma für Ihren Standort zu finden.`
                  },
                  {
                    question: "Was ist im Umzugspreis inbegriffen?",
                    answer: `Die meisten Umzugsfirmen in ${info.name} bieten Pauschal- oder Stundenansätze. Typischerweise inbegriffen sind: Transport mit LKW, mindestens 2 Umzugshelfer, Grundversicherung und Treibstoff. Zusatzleistungen wie Verpackungsmaterial, Möbelmontage oder Endreinigung werden separat verrechnet. Fordern Sie detaillierte Offerten an, um Überraschungen zu vermeiden.`
                  },
                  {
                    question: "Benötige ich eine Halteverbotszone?",
                    answer: `In vielen Gemeinden im Kanton ${info.name} ist eine Halteverbotszone sinnvoll oder sogar erforderlich, insbesondere in dicht besiedelten Gebieten wie ${info.cities[0]}. Die Umzugsfirma kann diese für Sie organisieren. Kosten: ca. CHF 100-200. Erkundigen Sie sich rechtzeitig bei Ihrer Gemeinde über die Anforderungen.`
                  },
                  {
                    question: "Wie kann ich beim Umzug sparen?",
                    answer: `So sparen Sie bei Ihrem Umzug in ${info.name}: 1) Mehrere Offerten vergleichen (durchschnittlich 30-40% Preisunterschied), 2) Umzug unter der Woche statt am Wochenende, 3) Selbst packen und Material besorgen, 4) Kleinteile selbst transportieren, 5) Umzugstermin ausserhalb der Hochsaison wählen (Sommer, Monatsende). Nutzen Sie unseren Rechner für einen ersten Kostenvoranschlag.`
                  },
                  {
                    question: "Sind die Umzugsfirmen versichert?",
                    answer: `Alle auf Umzugscheck.ch gelisteten Firmen in ${info.name} verfügen über eine Haftpflichtversicherung. Diese deckt jedoch nur grobe Fahrlässigkeit ab. Für wertvollen Hausrat empfehlen wir eine separate Transportversicherung. Klären Sie den Versicherungsumfang vor Vertragsabschluss und dokumentieren Sie wertvolle Gegenstände mit Fotos.`
                  },
                  {
                    question: `Gibt es spezielle Herausforderungen bei Umzügen in ${info.name}?`,
                    answer: `${info.name === 'Zürich' ? 'In Zürich sind enge Altstadtgassen, hohe Gebäude ohne Lift und Parkplatzmangel typische Herausforderungen.' : 
                             info.name === 'Bern' ? 'In Bern stellen die Altstadtlage mit engen Gassen und die vielen historischen Gebäude besondere Anforderungen.' :
                             info.name === 'Genf' ? 'In Genf sind internationale Kunden, mehrsprachige Kommunikation und grenzüberschreitende Umzüge häufig.' :
                             info.name === 'Tessin' ? 'Im Tessin sind Hanglagen, enge Dorfkerne und begrenzte Zufahrtsmöglichkeiten zu beachten.' :
                             info.name === 'Graubünden' ? 'In Graubünden stellen alpine Lagen, Saisonwohnungen und lange Anfahrtswege besondere Herausforderungen dar.' :
                             info.name === 'Wallis' ? 'Im Wallis sind Bergumzüge, Feriendomizile und zweisprachige Kommunikation (Deutsch/Französisch) zu berücksichtigen.' :
                             `In ${info.name} kennen lokale Umzugsfirmen die regionalen Besonderheiten und können flexibel auf besondere Anforderungen reagieren.`
                           } Professionelle Firmen sind auf diese Gegebenheiten spezialisiert.`
                  }
                ]}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default Canton;
