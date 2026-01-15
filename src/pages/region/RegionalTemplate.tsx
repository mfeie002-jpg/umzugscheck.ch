import { useParams } from "react-router-dom";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, Star, Shield, TrendingDown, ArrowRight, 
  Building2, Users, Award, Phone, CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { HeroQuickForm } from "@/components/common/HeroQuickForm";

interface RegionData {
  name: string;
  slug: string;
  companies: number;
  avgRating: number;
  priceRange: string;
  description: string;
  cities: string[];
  mainPostalCode: string; // Main postal code for pre-filling
}

const regionsData: Record<string, RegionData> = {
  "zuerich": {
    name: "Zürich",
    slug: "zuerich",
    companies: 45,
    avgRating: 4.7,
    priceRange: "CHF 800–2'500",
    description: "Die grösste Stadt der Schweiz mit einem breiten Angebot an Umzugsfirmen für jeden Bedarf.",
    cities: ["Zürich", "Winterthur", "Uster", "Dübendorf", "Dietikon", "Wädenswil"],
    mainPostalCode: "8001"
  },
  "bern": {
    name: "Bern",
    slug: "bern",
    companies: 32,
    avgRating: 4.6,
    priceRange: "CHF 700–2'200",
    description: "Die Bundesstadt bietet zuverlässige Umzugsfirmen mit fairen Preisen.",
    cities: ["Bern", "Biel", "Thun", "Köniz", "Burgdorf", "Langenthal"],
    mainPostalCode: "3011"
  },
  "basel": {
    name: "Basel",
    slug: "basel",
    companies: 28,
    avgRating: 4.8,
    priceRange: "CHF 750–2'400",
    description: "Grenzstadt mit Erfahrung in nationalen und internationalen Umzügen.",
    cities: ["Basel", "Riehen", "Allschwil", "Binningen", "Muttenz", "Liestal"],
    mainPostalCode: "4001"
  },
  "luzern": {
    name: "Luzern",
    slug: "luzern",
    companies: 22,
    avgRating: 4.7,
    priceRange: "CHF 700–2'100",
    description: "Die Zentralschweizer Perle mit persönlichem Service und lokaler Expertise.",
    cities: ["Luzern", "Emmen", "Kriens", "Ebikon", "Horw", "Sursee"],
    mainPostalCode: "6003"
  },
  "aargau": {
    name: "Aargau",
    slug: "aargau",
    companies: 35,
    avgRating: 4.5,
    priceRange: "CHF 650–2'000",
    description: "Zentrale Lage mit guter Anbindung in alle Richtungen der Schweiz.",
    cities: ["Aarau", "Baden", "Wettingen", "Brugg", "Wohlen", "Zofingen"],
    mainPostalCode: "5000"
  },
  "zug": {
    name: "Zug",
    slug: "zug",
    companies: 18,
    avgRating: 4.8,
    priceRange: "CHF 900–2'800",
    description: "Premium-Standort mit erstklassigen Umzugsservices für anspruchsvolle Kunden.",
    cities: ["Zug", "Baar", "Cham", "Steinhausen", "Risch-Rotkreuz"],
    mainPostalCode: "6300"
  },
  "st-gallen": {
    name: "St. Gallen",
    slug: "st-gallen",
    companies: 25,
    avgRating: 4.6,
    priceRange: "CHF 700–2'200",
    description: "Ostschweizer Zentrum mit erfahrenen Umzugsspezialisten.",
    cities: ["St. Gallen", "Gossau", "Wil", "Rapperswil-Jona", "Buchs"],
    mainPostalCode: "9000"
  },
};

const benefits = [
  { icon: Shield, title: "Geprüfte Firmen", description: "Alle Partner sind verifiziert" },
  { icon: TrendingDown, title: "Bis 40% sparen", description: "Durch Offerten-Vergleich" },
  { icon: Star, title: "Top-Bewertungen", description: "Nur beste Anbieter" },
  { icon: Award, title: "Versicherung", description: "Vollkasko inkludiert" },
];

export default function RegionalTemplate() {
  const { region } = useParams();
  const regionData = regionsData[region || "zuerich"] || regionsData["zuerich"];

  return (
    <>
      <OptimizedSEO
        title={`Umzugsfirmen ${regionData.name} | Vergleichen & Sparen | Umzugscheck.ch`}
        description={`Die besten Umzugsfirmen in ${regionData.name}. ${regionData.companies}+ geprüfte Anbieter, Ø ${regionData.avgRating} Sterne. Jetzt kostenlos vergleichen und bis zu 40% sparen.`}
        canonicalUrl={`https://www.umzugscheck.ch/region/${regionData.slug}/`}
      />
      
      <div className="min-h-screen bg-gradient-elegant">
        {/* Hero */}
        <section className="relative py-12 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-95" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Text Content */}
              <div className="text-white text-center lg:text-left">
                <Badge className="mb-4 bg-white/20 text-white border-white/30">
                  <MapPin className="w-3 h-3 mr-1" />
                  Region {regionData.name}
                </Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                  Umzugsfirmen in {regionData.name}
                </h1>
                <p className="text-lg text-white/90 mb-6 max-w-xl mx-auto lg:mx-0">
                  {regionData.description}
                </p>
                
                {/* Stats */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                  <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2 text-center">
                    <div className="text-xl font-bold">{regionData.companies}+</div>
                    <div className="text-xs text-white/70">Firmen</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2 text-center">
                    <div className="text-xl font-bold flex items-center justify-center gap-1">
                      {regionData.avgRating} <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="text-xs text-white/70">Bewertung</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2 text-center">
                    <div className="text-sm font-bold">{regionData.priceRange}</div>
                    <div className="text-xs text-white/70">Preise</div>
                  </div>
                </div>
              </div>
              
              {/* Right: Quick Form */}
              <div className="lg:max-w-md lg:ml-auto">
                <HeroQuickForm 
                  prefilledFrom={regionData.mainPostalCode}
                  placeName={regionData.name}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {benefits.map((benefit, idx) => (
                  <Card key={idx} className="text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <benefit.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cities */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Städte in {regionData.name}
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                Unsere Partner bedienen alle Städte und Gemeinden in der Region
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {regionData.cities.map((city, idx) => (
                  <Link 
                    key={idx} 
                    to={`/${city.toLowerCase()}/umzugsfirmen`}
                    className="group"
                  >
                    <Card className="hover:border-primary transition-colors">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="font-medium">{city}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Available */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
                Verfügbare Services in {regionData.name}
              </h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Privatumzug", link: "/dienstleistungen/privatumzug" },
                  { name: "Firmenumzug", link: "/dienstleistungen/firmenumzug" },
                  { name: "Umzugsreinigung", link: "/dienstleistungen/reinigung" },
                  { name: "Möbelentsorgung", link: "/dienstleistungen/entsorgung" },
                  { name: "Möbellift", link: "/dienstleistungen/moebellift" },
                  { name: "Einlagerung", link: "/dienstleistungen/einlagerung" },
                ].map((service, idx) => (
                  <Link key={idx} to={service.link}>
                    <Card className="hover:border-primary transition-colors cursor-pointer">
                      <CardContent className="p-4 flex items-center justify-between">
                        <span className="font-medium">{service.name}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Bereit für Ihren Umzug in {regionData.name}?
              </h2>
              <p className="text-muted-foreground mb-6">
                Vergleichen Sie jetzt kostenlos Offerten von {regionData.companies}+ geprüften Umzugsfirmen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/umzugsofferten">
                  <Button size="lg">
                    Offerten vergleichen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to={`/beste-umzugsfirma/${regionData.slug}`}>
                  <Button size="lg" variant="outline">
                    <Star className="w-4 h-4 mr-2" />
                    Top-Firmen ansehen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
