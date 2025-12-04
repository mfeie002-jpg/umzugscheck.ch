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
  MapPin, Users, Truck, Zap, ChevronRight,
  Building2, Home, Package, Sun, Palmtree
} from "lucide-react";

const tessinCities = [
  "Lugano", "Bellinzona", "Locarno", "Mendrisio", "Chiasso", 
  "Ascona", "Giubiasco", "Minusio", "Massagno", "Biasca"
];

const topCompanies = [
  { name: "Ticino Traslochi SA", rating: 4.9, reviews: 198, priceLevel: "fair", sponsored: true, available: true, badge: "Top bewertet" },
  { name: "Lugano Moving GmbH", rating: 4.8, reviews: 176, priceLevel: "günstig", sponsored: true, available: true, badge: "Preis-Leistung" },
  { name: "Ceresio Transporte", rating: 4.8, reviews: 154, priceLevel: "fair", sponsored: false, available: true, badge: "Beliebt" },
  { name: "Bellinzona Logistics", rating: 4.7, reviews: 132, priceLevel: "fair", sponsored: false, available: false, badge: null },
  { name: "Locarno Traslochi", rating: 4.7, reviews: 118, priceLevel: "günstig", sponsored: false, available: true, badge: "Express" },
  { name: "Mendrisiotto Moving", rating: 4.6, reviews: 98, priceLevel: "premium", sponsored: false, available: true, badge: null },
  { name: "Sottoceneri Transport", rating: 4.6, reviews: 87, priceLevel: "fair", sponsored: false, available: true, badge: null },
  { name: "Sopraceneri Umzüge", rating: 4.5, reviews: 76, priceLevel: "günstig", sponsored: false, available: false, badge: null },
  { name: "Ascona Traslochi", rating: 4.5, reviews: 65, priceLevel: "premium", sponsored: false, available: true, badge: null },
  { name: "Chiasso Moving", rating: 4.4, reviews: 54, priceLevel: "günstig", sponsored: false, available: true, badge: "Grenzüberg." },
];

const priceExamples = [
  { size: "1-2 Zimmer", range: "CHF 490 - 850", avg: "CHF 670" },
  { size: "3-4 Zimmer", range: "CHF 950 - 1'650", avg: "CHF 1'250" },
  { size: "5+ Zimmer", range: "CHF 1'850 - 3'250", avg: "CHF 2'450" },
];

const services = [
  { name: "Trasloco + Pulizia", icon: Home, link: "/umzug-mit-reinigung" },
  { name: "Trasloco Aziendale", icon: Building2, link: "/firmenumzug-schweiz" },
  { name: "Montacarichi", icon: Truck, link: "/moebellift" },
  { name: "Smaltimento", icon: Package, link: "/entsorgung-raeumung" },
  { name: "Deposito", icon: Package, link: "/einlagerung" },
  { name: "Piccoli Trasporti", icon: Truck, link: "/kleintransporte" },
];

const usps = [
  { title: "Italiano & Deutsch", desc: "Mehrsprachige Teams für Ihren Umzug ins Tessin", icon: Users },
  { title: "Bis zu 40% sparen", desc: "Durch direkten Preisvergleich der Tessiner Anbieter", icon: TrendingUp },
  { title: "Grenz-Expertise", desc: "Spezialisten für Umzüge nach/von Italien", icon: MapPin },
  { title: "Schnelle Offerten", desc: "Innerhalb von 24h erhalten Sie bis zu 5 Angebote", icon: Clock },
];

const faqs = [
  { question: "Was kostet ein Umzug im Tessin?", answer: "Ein Umzug im Tessin kostet je nach Wohnungsgrösse zwischen CHF 490 und CHF 3'250. Das Tessin ist generell etwas günstiger als die Deutschschweiz." },
  { question: "Gibt es deutschsprachige Umzugsfirmen im Tessin?", answer: "Ja, viele unserer Tessiner Partner sind mehrsprachig und bieten Service auf Deutsch, Italienisch und oft auch Englisch an." },
  { question: "Was muss ich bei einem Umzug von/nach Italien beachten?", answer: "Für Umzüge über die Grenze empfehlen wir spezialisierte Firmen. Beachten Sie Zollformalitäten, insbesondere bei Antiquitäten oder Kunstwerken." },
  { question: "Wie lange dauert ein Umzug im Tessin?", answer: "Ein durchschnittlicher Umzug einer 3-4 Zimmer Wohnung im Tessin dauert etwa 4-8 Stunden, abhängig von der Distanz und den Gegebenheiten." },
  { question: "Sind Umzugsfirmen im Tessin versichert?", answer: "Alle Umzugsfirmen auf unserer Plattform sind vollständig versichert. Die Transportversicherung deckt Schäden während des gesamten Umzugs ab." },
];

export const Tessin = () => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [rooms, setRooms] = useState("3");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState(7);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => Math.max(4, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowNotification(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]);
  };

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Umzugsfirmen Tessin vergleichen | Bis zu 40% sparen"
        description="Vergleichen Sie jetzt Umzugsfirmen im Tessin/Ticino. Kostenlose Offerten von geprüften Umzugsunternehmen. ✓ Italienisch & Deutsch ✓ Grenz-Experten"
        canonicalUrl="https://umzugscheck.ch/tessin"
        keywords="Umzug Tessin, Trasloco Ticino, Umzugsfirma Lugano, Umzug Locarno, Zügelunternehmen Tessin"
      />

      <AnimatePresence>
        {showNotification && (
          <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-success" /></div>
              <div><p className="text-sm font-medium">Nuova prenotazione a Lugano</p><p className="text-xs text-muted-foreground">3 minuti fa</p></div>
              <button onClick={() => setShowNotification(false)} className="text-muted-foreground hover:text-foreground">×</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <motion.div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/30"><Palmtree className="h-3 w-3 mr-1" />La Svizzera Italiana</Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
                Umzugsfirmen im <span className="text-primary">Tessin</span> vergleichen
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                Finden Sie mehrsprachige Umzugsunternehmen im Tessin. 
                Von Lugano bis Locarno – kostenlos vergleichen und sparen.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                {[
                  { icon: Star, text: "4.8/5 Bewertung", color: "text-yellow-500" },
                  { icon: Users, text: `${activeUsers} aktive Nutzer`, color: "text-primary" },
                  { icon: Shield, text: "100% kostenlos", color: "text-success" },
                ].map((badge, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + idx * 0.1 }} className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50">
                    <badge.icon className={`h-4 w-4 ${badge.color}`} /><span className="text-sm font-medium">{badge.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>{activeUsers} persone confrontano nel Ticino</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Card className="border-2 border-primary/20 shadow-2xl bg-card/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Zap className="h-4 w-4 text-primary" /></div>
                    <div><h3 className="font-semibold">Preventivo Rapido</h3><p className="text-xs text-muted-foreground">In 2 minuti</p></div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Da / Von</Label>
                        <select value={fromCity} onChange={(e) => setFromCity(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm">
                          <option value="">Scegli città</option>
                          {tessinCities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm">A / Nach</Label>
                        <select value={toCity} onChange={(e) => setToCity(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm">
                          <option value="">Scegli città</option>
                          {tessinCities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">Grandezza / Grösse</Label>
                      <select value={rooms} onChange={(e) => setRooms(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm">
                        <option value="1">1 Locale</option>
                        <option value="2">2 Locali</option>
                        <option value="3">3 Locali</option>
                        <option value="4">4 Locali</option>
                        <option value="5">5+ Locali</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Servizi Extra</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Pulizia", "Smaltimento", "Imballaggio", "Montaggio"].map((service) => (
                          <label key={service} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox checked={selectedServices.includes(service)} onCheckedChange={() => handleServiceToggle(service)} />{service}
                          </label>
                        ))}
                      </div>
                    </div>

                    <Link to={`/umzug-offerte?from=${fromCity}&to=${toCity}&rooms=${rooms}`}>
                      <Button className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90">Richiedi preventivi gratuiti<ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground">✓ IT & DE ✓ Senza impegno ✓ Offerte in 24h</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Companies, Prices, Services, USPs, Info, FAQ, CTA sections follow same pattern as other cantons */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Top 10 Ditte di Trasloco in Ticino</h2>
            <p className="text-muted-foreground">I migliori professionisti per il vostro trasloco</p>
          </motion.div>
          <div className="space-y-3">
            {topCompanies.map((company, idx) => (
              <motion.div key={company.name} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}>
                <Card className={`hover:shadow-lg transition-all ${company.sponsored ? 'border-primary/30 bg-primary/5' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{idx + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold truncate">{company.name}</h3>
                          {company.sponsored && <Badge variant="outline" className="text-xs bg-primary/10">Sponsorizzato</Badge>}
                          {company.badge && <Badge variant="secondary" className="text-xs">{company.badge}</Badge>}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{company.rating}</span>
                          <span>({company.reviews} recensioni)</span>
                          <Badge variant="outline" className="text-xs">{company.priceLevel}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {company.available ? <Badge className="bg-success/10 text-success border-success/30">Disponibile</Badge> : <Badge variant="outline" className="text-muted-foreground">Non disp.</Badge>}
                        <Button size="sm" className="bg-primary hover:bg-primary/90">Preventivo</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-6"><Link to="/firmen?region=tessin"><Button variant="outline" size="lg">Tutte le ditte in Ticino<ChevronRight className="ml-2 h-4 w-4" /></Button></Link></div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Costi di Trasloco in Ticino</h2>
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

      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {services.map((service, idx) => (
              <motion.div key={service.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}>
                <Link to={service.link}><Card className="hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer h-full"><CardContent className="p-4 text-center"><service.icon className="h-8 w-8 mx-auto mb-2 text-primary" /><p className="text-sm font-medium">{service.name}</p></CardContent></Card></Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {usps.map((usp, idx) => (
              <motion.div key={usp.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <Card className="h-full hover:shadow-lg transition-shadow"><CardContent className="p-6"><div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><usp.icon className="h-6 w-6 text-primary" /></div><h3 className="font-semibold mb-2">{usp.title}</h3><p className="text-sm text-muted-foreground">{usp.desc}</p></CardContent></Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Trasloco in Ticino – Informazioni Utili</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground mb-4">Il Canton Ticino, la Svizzera italiana, offre un mix unico di cultura alpina e mediterranea. Con Lugano come centro economico e Bellinzona come capitale, il Ticino è una destinazione sempre più popolare.</p>
              <h3 className="text-lg font-semibold mt-6 mb-3">Registrazione e Documenti</h3>
              <p className="text-muted-foreground mb-4">La registrazione presso l'ufficio controllo abitanti deve avvenire entro 14 giorni dal trasloco. Per i cittadini non svizzeri sono necessari documenti aggiuntivi.</p>
              <h3 className="text-lg font-semibold mt-6 mb-3">Parcheggio e Accesso</h3>
              <p className="text-muted-foreground">Nelle città come Lugano e Locarno, è consigliabile richiedere permessi per zone di divieto di sosta temporanee. Le ditte di trasloco possono assistervi con la procedura.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4"><div className="max-w-3xl mx-auto"><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8"><h2 className="text-2xl md:text-3xl font-bold mb-2">Domande Frequenti</h2></motion.div><FAQAccordion items={faqs} /></div></div>
      </section>

      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Pronto per il trasloco in Ticino?</h2>
            <p className="text-lg mb-6 opacity-90">Confronta gratuitamente le migliori ditte di trasloco</p>
            <Link to="/umzug-offerte"><Button size="lg" variant="secondary" className="h-12 px-8">Richiedi preventivi<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Tessin;
