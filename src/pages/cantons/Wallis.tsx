import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Link } from "react-router-dom";
import { 
  Star, Shield, Clock, TrendingUp, CheckCircle, ArrowRight, 
  MapPin, Users, Truck, Sparkles, Zap, ChevronRight,
  Building2, Home, Package, Mountain, Sun
} from "lucide-react";

const wallisCities = [
  "Sion", "Sitten", "Brig", "Visp", "Martigny", 
  "Monthey", "Zermatt", "Naters", "Crans-Montana", "Verbier"
];

const topCompanies = [
  { name: "Valais Umzüge AG", rating: 4.9, reviews: 178, priceLevel: "fair", sponsored: true, available: true, badge: "Top bewertet" },
  { name: "Rhone Moving GmbH", rating: 4.8, reviews: 156, priceLevel: "günstig", sponsored: true, available: true, badge: "Preis-Leistung" },
  { name: "Sion Transport", rating: 4.8, reviews: 134, priceLevel: "fair", sponsored: false, available: true, badge: "Beliebt" },
  { name: "Matterhorn Logistics", rating: 4.7, reviews: 121, priceLevel: "premium", sponsored: false, available: false, badge: "Berg-Experte" },
  { name: "Oberwallis Umzugsservice", rating: 4.7, reviews: 108, priceLevel: "fair", sponsored: false, available: true, badge: null },
  { name: "Bas-Valais Moving", rating: 4.6, reviews: 95, priceLevel: "günstig", sponsored: false, available: true, badge: null },
  { name: "Zermatt Transporte", rating: 4.6, reviews: 82, priceLevel: "premium", sponsored: false, available: true, badge: "Express" },
  { name: "Brig Zügel-Express", rating: 4.5, reviews: 71, priceLevel: "fair", sponsored: false, available: false, badge: null },
  { name: "Visp Umzüge", rating: 4.5, reviews: 60, priceLevel: "günstig", sponsored: false, available: true, badge: null },
  { name: "Montana Moving", rating: 4.4, reviews: 49, priceLevel: "premium", sponsored: false, available: true, badge: null },
];

const priceExamples = [
  { size: "1-2 Zimmer", range: "CHF 550 - 950", avg: "CHF 750" },
  { size: "3-4 Zimmer", range: "CHF 1'100 - 1'850", avg: "CHF 1'390" },
  { size: "5+ Zimmer", range: "CHF 2'050 - 3'550", avg: "CHF 2'690" },
];

const services = [
  { name: "Umzug + Reinigung", icon: Home, link: "/umzug-mit-reinigung" },
  { name: "Firmenumzug", icon: Building2, link: "/firmenumzug-schweiz" },
  { name: "Möbellift", icon: Truck, link: "/moebellift" },
  { name: "Entsorgung", icon: Package, link: "/entsorgung-raeumung" },
  { name: "Einlagerung", icon: Package, link: "/einlagerung" },
  { name: "Bergtransporte", icon: Mountain, link: "/kleintransporte" },
];

const usps = [
  { title: "Zweisprachig", desc: "Deutsch & Französisch sprechende Umzugsteams", icon: Users },
  { title: "Bis zu 40% sparen", desc: "Durch direkten Preisvergleich der Walliser Anbieter", icon: TrendingUp },
  { title: "Berg-Expertise", desc: "Spezialisten für alpine Umzüge in Tourismusorten", icon: Mountain },
  { title: "Lokale Kenntnis", desc: "Von Sion bis Zermatt – wir kennen das Wallis", icon: MapPin },
];

const faqs = [
  { question: "Was kostet ein Umzug im Wallis?", answer: "Ein Umzug im Wallis kostet je nach Lage und Wohnungsgrösse zwischen CHF 550 und CHF 3'550. Bergdestinationen wie Zermatt oder Verbier sind aufgrund der Zufahrt oft teurer." },
  { question: "Gibt es zweisprachige Umzugsfirmen im Wallis?", answer: "Ja, die meisten unserer Walliser Partner sind zweisprachig (Deutsch/Französisch) und können Sie in Ihrer bevorzugten Sprache betreuen." },
  { question: "Wie funktioniert ein Umzug nach Zermatt?", answer: "Da Zermatt autofrei ist, erfolgen Umzüge meist per Zug oder Elektrofahrzeug. Spezialisierte Firmen koordinieren den Transport vom Täsch-Parkplatz in den Ort." },
  { question: "Wann ist die beste Zeit für einen Umzug im Wallis?", answer: "Frühling und Herbst sind ideal. Im Winter können Passstrassen gesperrt sein, im Sommer ist in Tourismusorten Hochsaison mit eingeschränkter Verfügbarkeit." },
  { question: "Sind Umzugsfirmen im Wallis versichert?", answer: "Alle Umzugsfirmen auf unserer Plattform sind vollständig versichert. Die Transportversicherung deckt Schäden während des gesamten Umzugs ab." },
];

export const Wallis = () => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [rooms, setRooms] = useState("3");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState(6);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => Math.max(3, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowNotification(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Umzugsfirmen Wallis vergleichen | Bis zu 40% sparen"
        description="Vergleichen Sie jetzt Umzugsfirmen im Wallis. Kostenlose Offerten von geprüften Umzugsunternehmen. ✓ Zweisprachig ✓ Berg-Spezialisten"
        canonicalUrl="https://umzugscheck.ch/wallis"
        keywords="Umzug Wallis, Umzugsfirma Sion, Umzug Zermatt, Déménagement Valais, Zügelunternehmen Wallis"
      />

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium">Neue Buchung in Sion</p>
                <p className="text-xs text-muted-foreground">vor 4 Minuten</p>
              </div>
              <button onClick={() => setShowNotification(false)} className="text-muted-foreground hover:text-foreground">×</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/30">
                <Sun className="h-3 w-3 mr-1" />
                Sonnenkanton Wallis
              </Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
                Umzugsfirmen im <span className="text-primary">Wallis</span> vergleichen
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                Von Sion bis Zermatt – finden Sie zweisprachige Umzugsunternehmen 
                für Tal- und Bergumzüge. Kostenlos vergleichen.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                {[
                  { icon: Star, text: "4.8/5 Bewertung", color: "text-yellow-500" },
                  { icon: Users, text: `${activeUsers} aktive Nutzer`, color: "text-primary" },
                  { icon: Shield, text: "100% kostenlos", color: "text-success" },
                ].map((badge, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50"
                  >
                    <badge.icon className={`h-4 w-4 ${badge.color}`} />
                    <span className="text-sm font-medium">{badge.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>{activeUsers} Personen vergleichen gerade im Wallis</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Card className="border-2 border-primary/20 shadow-2xl bg-card/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Schnell-Offerte</h3>
                      <p className="text-xs text-muted-foreground">Zweisprachige Anbieter</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Von / De</Label>
                        <select value={fromCity} onChange={(e) => setFromCity(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm">
                          <option value="">Ort wählen</option>
                          {wallisCities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm">Nach / À</Label>
                        <select value={toCity} onChange={(e) => setToCity(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm">
                          <option value="">Ort wählen</option>
                          {wallisCities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">Wohnungsgrösse / Taille</Label>
                      <select value={rooms} onChange={(e) => setRooms(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm">
                        <option value="1">1 Zimmer</option>
                        <option value="2">2 Zimmer</option>
                        <option value="3">3 Zimmer</option>
                        <option value="4">4 Zimmer</option>
                        <option value="5">5+ Zimmer</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Zusatzservices</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Reinigung", "Entsorgung", "Einpacken", "Montage"].map((service) => (
                          <label key={service} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox checked={selectedServices.includes(service)} onCheckedChange={() => handleServiceToggle(service)} />
                            {service}
                          </label>
                        ))}
                      </div>
                    </div>

                    <Link to={`/umzug-offerte?from=${fromCity}&to=${toCity}&rooms=${rooms}`}>
                      <Button className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90">
                        Kostenlos Offerten erhalten
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground">✓ DE & FR ✓ Unverbindlich ✓ In 24h Angebote</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Top 10 Umzugsfirmen im Wallis</h2>
            <p className="text-muted-foreground">Zweisprachige Experten für Tal- und Bergumzüge</p>
          </motion.div>

          <div className="space-y-3">
            {topCompanies.map((company, idx) => (
              <motion.div key={company.name} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}>
                <Card className={`hover:shadow-lg transition-all duration-300 ${company.sponsored ? 'border-primary/30 bg-primary/5' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{idx + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold truncate">{company.name}</h3>
                          {company.sponsored && <Badge variant="outline" className="text-xs bg-primary/10">Gesponsert</Badge>}
                          {company.badge && <Badge variant="secondary" className="text-xs">{company.badge}</Badge>}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{company.rating}</span>
                          <span>({company.reviews} Bewertungen)</span>
                          <Badge variant="outline" className="text-xs">{company.priceLevel}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {company.available ? <Badge className="bg-success/10 text-success border-success/30">Verfügbar</Badge> : <Badge variant="outline" className="text-muted-foreground">Ausgebucht</Badge>}
                        <Button size="sm" className="bg-primary hover:bg-primary/90">Offerte</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/firmen?region=wallis"><Button variant="outline" size="lg">Alle Firmen im Wallis anzeigen<ChevronRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* Price Examples */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Umzugskosten im Wallis</h2>
            <p className="text-muted-foreground">Durchschnittliche Preise für Walliser Umzüge</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {priceExamples.map((price, idx) => (
              <motion.div key={price.size} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"><Home className="h-6 w-6 text-primary" /></div>
                    <h3 className="font-semibold mb-2">{price.size}</h3>
                    <p className="text-2xl font-bold text-primary mb-1">{price.avg}</p>
                    <p className="text-sm text-muted-foreground">{price.range}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Umzugsservices im Wallis</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {services.map((service, idx) => (
              <motion.div key={service.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}>
                <Link to={service.link}>
                  <Card className="hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer h-full">
                    <CardContent className="p-4 text-center">
                      <service.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">{service.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {usps.map((usp, idx) => (
              <motion.div key={usp.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><usp.icon className="h-6 w-6 text-primary" /></div>
                    <h3 className="font-semibold mb-2">{usp.title}</h3>
                    <p className="text-sm text-muted-foreground">{usp.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Info */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Umzug im Wallis – Wichtige Informationen</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  Das Wallis ist der drittgrösste Kanton der Schweiz und erstreckt sich vom Rhonegletscher bis zum Genfersee. 
                  Der zweisprachige Kanton (Deutsch im Oberwallis, Französisch im Unterwallis) bietet einzigartige Umzugsherausforderungen.
                </p>
                <h3 className="text-lg font-semibold mt-6 mb-3">Autofreie Destinationen</h3>
                <p className="text-muted-foreground mb-4">
                  Zermatt ist autofrei – Umzüge erfolgen per Zug oder Elektrofahrzeug ab Täsch. Ähnliche Einschränkungen 
                  gelten teilweise für Saas-Fee. Professionelle Walliser Umzugsfirmen kennen die Logistik dieser besonderen Orte.
                </p>
                <h3 className="text-lg font-semibold mt-6 mb-3">Sprachregionen</h3>
                <p className="text-muted-foreground mb-4">
                  Die Sprachgrenze verläuft bei Leuk/Sierre. Die meisten Walliser Umzugsfirmen sind zweisprachig und können 
                  Sie in Deutsch oder Französisch betreuen. Geben Sie bei der Anfrage Ihre bevorzugte Sprache an.
                </p>
                <h3 className="text-lg font-semibold mt-6 mb-3">Saisonale Faktoren</h3>
                <p className="text-muted-foreground">
                  In Wintersportorten wie Verbier, Crans-Montana oder Zermatt sind Umzüge während der Hochsaison schwieriger. 
                  Planen Sie wenn möglich ausserhalb der Ski- und Wandersaison.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Häufige Fragen zu Umzügen im Wallis</h2>
            </motion.div>
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Bereit für Ihren Umzug im Wallis?</h2>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">Vergleichen Sie jetzt kostenlos die besten Umzugsfirmen im Wallis</p>
            <Link to="/umzug-offerte"><Button size="lg" variant="secondary" className="h-12 px-8">Jetzt Offerten vergleichen<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Wallis;
