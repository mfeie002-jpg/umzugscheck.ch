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
import { Star, Shield, Clock, TrendingUp, CheckCircle, ArrowRight, MapPin, Users, Truck, Zap, ChevronRight, Building2, Home, Package, Mountain } from "lucide-react";

const uriCities = ["Altdorf", "Bürglen", "Schattdorf", "Erstfeld", "Flüelen", "Silenen", "Andermatt", "Seedorf", "Attinghausen", "Göschenen"];

const topCompanies = [
  { name: "Uri Umzüge AG", rating: 4.9, reviews: 87, priceLevel: "fair", sponsored: true, available: true, badge: "Top bewertet" },
  { name: "Gotthard Moving", rating: 4.8, reviews: 72, priceLevel: "günstig", sponsored: true, available: true, badge: "Preistipp" },
  { name: "Altdorf Express", rating: 4.8, reviews: 65, priceLevel: "fair", sponsored: false, available: true, badge: "Lokal" },
  { name: "Reusstal Transporte", rating: 4.7, reviews: 54, priceLevel: "günstig", sponsored: false, available: true, badge: "Schnell" },
  { name: "Urner Zügeldienst", rating: 4.7, reviews: 48, priceLevel: "fair", sponsored: false, available: false, badge: null },
  { name: "Andermatt Umzüge", rating: 4.6, reviews: 42, priceLevel: "premium", sponsored: false, available: true, badge: "Bergexperte" },
  { name: "Erstfeld Moving", rating: 4.6, reviews: 38, priceLevel: "günstig", sponsored: false, available: true, badge: null },
  { name: "Schächental Transporte", rating: 4.5, reviews: 32, priceLevel: "fair", sponsored: false, available: true, badge: null },
  { name: "Flüelen Umzüge", rating: 4.5, reviews: 28, priceLevel: "günstig", sponsored: false, available: false, badge: null },
  { name: "Uri-Süd Moving", rating: 4.4, reviews: 24, priceLevel: "fair", sponsored: false, available: true, badge: null },
];

const priceExamples = [
  { size: "1-2 Zimmer", range: "CHF 450 - 850", avg: "CHF 620" },
  { size: "3-4 Zimmer", range: "CHF 950 - 1'650", avg: "CHF 1'180" },
  { size: "5+ Zimmer", range: "CHF 1'850 - 3'200", avg: "CHF 2'350" },
];

const services = [
  { name: "Umzug + Reinigung", icon: Home, link: "/umzug-mit-reinigung" },
  { name: "Firmenumzug", icon: Building2, link: "/firmenumzug-schweiz" },
  { name: "Möbellift", icon: Truck, link: "/moebellift" },
  { name: "Entsorgung", icon: Package, link: "/entsorgung-raeumung" },
  { name: "Einlagerung", icon: Package, link: "/einlagerung" },
  { name: "Kleintransporte", icon: Truck, link: "/kleintransporte" },
];

const usps = [
  { title: "Bergspezialisten", desc: "Erfahrene Umzugsfirmen für alpine Lagen", icon: Mountain },
  { title: "Bis 40% sparen", desc: "Vergleichen Sie Preise lokaler Urner Firmen", icon: TrendingUp },
  { title: "Schnelle Offerten", desc: "Erhalten Sie bis zu 5 Angebote in 24h", icon: Clock },
  { title: "Geprüfte Partner", desc: "Alle Firmen sind versichert und verifiziert", icon: Shield },
];

const faqs = [
  { question: "Was kostet ein Umzug in Uri?", answer: "Ein Umzug in Uri kostet zwischen CHF 450 und CHF 3'200 je nach Wohnungsgrösse. Die alpine Lage kann die Preise beeinflussen." },
  { question: "Gibt es Umzugsfirmen für Bergregionen?", answer: "Ja, mehrere Urner Umzugsfirmen sind auf Umzüge in Bergregionen und schwer zugängliche Orte spezialisiert." },
  { question: "Wie buche ich einen Umzug in Uri?", answer: "Füllen Sie unser Formular in 2 Minuten aus und erhalten Sie bis zu 5 kostenlose Offerten von geprüften Urner Umzugsfirmen." },
  { question: "Sind die Umzugsfirmen versichert?", answer: "Alle Unternehmen auf unserer Plattform sind vollständig versichert und verifiziert." },
  { question: "Bieten Sie auch Lagerung an?", answer: "Ja, viele unserer Partner bieten Einlagerungsmöglichkeiten in Uri an." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Umzugsfirmen Uri - Umzugscheck.ch",
  "description": "Vergleichen Sie Umzugsfirmen in Uri. Kostenlose Offerten von geprüften lokalen Unternehmen.",
  "url": "https://umzugscheck.ch/uri",
  "areaServed": {
    "@type": "State",
    "name": "Uri",
    "containedInPlace": { "@type": "Country", "name": "Schweiz" }
  },
  "serviceType": "Umzugsservice"
};

export const Uri = () => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [rooms, setRooms] = useState("3");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState(3);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => { const i = setInterval(() => setActiveUsers(p => Math.max(2, p + Math.floor(Math.random() * 3) - 1)), 5000); return () => clearInterval(i); }, []);
  useEffect(() => { const t = setTimeout(() => setShowNotification(true), 3000); return () => clearTimeout(t); }, []);

  const handleServiceToggle = (s: string) => setSelectedServices(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO title="Umzugsfirmen Uri – Vergleichen & bis zu 40% sparen" description="Vergleichen Sie Umzugsfirmen in Uri. Kostenlose Offerten von geprüften Unternehmen. ✓ Bergspezialisten ✓ 100% gratis" canonicalUrl="https://umzugscheck.ch/uri" keywords="Umzug Uri, Umzugsfirma Altdorf, Zügelfirma Uri, Umzugsunternehmen Uri" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <AnimatePresence>
        {showNotification && (
          <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-success" /></div>
              <div><p className="text-sm font-medium">Neue Buchung in Altdorf</p><p className="text-xs text-muted-foreground">vor 12 Minuten</p></div>
              <button onClick={() => setShowNotification(false)} className="text-muted-foreground hover:text-foreground">×</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/30"><Mountain className="h-3 w-3 mr-1" />Gotthard-Region</Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Umzugsfirmen in <span className="text-primary">Uri</span> vergleichen</h1>
              <p className="text-lg text-muted-foreground mb-6">Finden Sie die besten Umzugsfirmen in Uri. Spezialisten für alpine Umzüge am Gotthard.</p>
              <div className="flex flex-wrap gap-3 mb-6">
                {[{ icon: Star, text: "4.8/5", color: "text-yellow-500" }, { icon: Users, text: `${activeUsers} aktiv`, color: "text-primary" }, { icon: Shield, text: "Gratis", color: "text-success" }].map((b, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center gap-2 bg-card/80 px-3 py-1.5 rounded-full border border-border/50">
                    <b.icon className={`h-4 w-4 ${b.color}`} /><span className="text-sm font-medium">{b.text}</span>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><span className="w-2 h-2 bg-success rounded-full animate-pulse" /><span>{activeUsers} Personen vergleichen gerade in Uri</span></div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-2 border-primary/20 shadow-2xl bg-card/95">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Zap className="h-4 w-4 text-primary" /></div><div><h3 className="font-semibold">Schnelle Offerte</h3><p className="text-xs text-muted-foreground">In 2 Minuten</p></div></div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="text-sm">Von</Label><select value={fromCity} onChange={e => setFromCity(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"><option value="">Wählen</option>{uriCities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                      <div><Label className="text-sm">Nach</Label><select value={toCity} onChange={e => setToCity(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"><option value="">Wählen</option>{uriCities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    </div>
                    <div><Label className="text-sm">Grösse</Label><select value={rooms} onChange={e => setRooms(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"><option value="1">1 Zimmer</option><option value="2">2 Zimmer</option><option value="3">3 Zimmer</option><option value="4">4 Zimmer</option><option value="5">5+ Zimmer</option></select></div>
                    <div><Label className="text-sm mb-2 block">Services</Label><div className="grid grid-cols-2 gap-2">{["Reinigung", "Entsorgung", "Packen", "Montage"].map(s => <label key={s} className="flex items-center gap-2 text-sm cursor-pointer"><Checkbox checked={selectedServices.includes(s)} onCheckedChange={() => handleServiceToggle(s)} />{s}</label>)}</div></div>
                    <Link to={`/umzug-offerte?from=${fromCity}&to=${toCity}&rooms=${rooms}`}><Button className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90">Offerten erhalten<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                    <p className="text-xs text-center text-muted-foreground">✓ Kostenlos ✓ Unverbindlich</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Top 10 Umzugsfirmen in Uri</h2>
          <div className="space-y-3">
            {topCompanies.map((c, i) => (
              <Card key={c.name} className={`hover:shadow-lg transition-all ${c.sponsored ? 'border-primary/30 bg-primary/5' : ''}`}>
                <CardContent className="p-4"><div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{i + 1}</div>
                  <div className="flex-1"><div className="flex items-center gap-2 flex-wrap"><h3 className="font-semibold">{c.name}</h3>{c.sponsored && <Badge variant="outline" className="text-xs bg-primary/10">Gesponsert</Badge>}{c.badge && <Badge variant="secondary" className="text-xs">{c.badge}</Badge>}</div><div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{c.rating} ({c.reviews} Bewertungen)<Badge variant="outline" className="text-xs">{c.priceLevel}</Badge></div></div>
                  <div className="flex items-center gap-2">{c.available ? <Badge className="bg-success/10 text-success">Verfügbar</Badge> : <Badge variant="outline">Ausgebucht</Badge>}<Button size="sm" className="bg-primary">Offerte</Button></div>
                </div></CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6"><Link to="/firmen?region=uri"><Button variant="outline" size="lg">Alle Umzugsfirmen<ChevronRight className="ml-2 h-4 w-4" /></Button></Link></div>
        </div>
      </section>

      <section className="py-12"><div className="container mx-auto px-4"><h2 className="text-2xl font-bold text-center mb-8">Umzugspreise in Uri</h2><div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">{priceExamples.map(p => <Card key={p.size} className="text-center"><CardContent className="p-6"><Home className="h-8 w-8 mx-auto mb-3 text-primary" /><h3 className="font-semibold mb-2">{p.size}</h3><p className="text-2xl font-bold text-primary">{p.avg}</p><p className="text-sm text-muted-foreground">{p.range}</p></CardContent></Card>)}</div></div></section>

      <section className="py-12 bg-muted/30"><div className="container mx-auto px-4"><div className="grid grid-cols-2 md:grid-cols-6 gap-4">{services.map(s => <Link key={s.name} to={s.link}><Card className="hover:shadow-lg hover:border-primary/30 transition-all h-full"><CardContent className="p-4 text-center"><s.icon className="h-8 w-8 mx-auto mb-2 text-primary" /><p className="text-sm font-medium">{s.name}</p></CardContent></Card></Link>)}</div></div></section>

      <section className="py-12"><div className="container mx-auto px-4"><div className="grid md:grid-cols-4 gap-6">{usps.map(u => <Card key={u.title} className="h-full"><CardContent className="p-6"><div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><u.icon className="h-6 w-6 text-primary" /></div><h3 className="font-semibold mb-2">{u.title}</h3><p className="text-sm text-muted-foreground">{u.desc}</p></CardContent></Card>)}</div></div></section>

      <section className="py-12 bg-muted/30"><div className="container mx-auto px-4 max-w-4xl"><h2 className="text-2xl font-bold mb-6">Umzug in Uri – Informationen</h2><div className="prose prose-gray max-w-none text-muted-foreground"><p className="mb-4">Uri ist der kleinste Urkanton der Schweiz und liegt am Gotthard. Die alpine Lage erfordert erfahrene Umzugsfirmen.</p><h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">Alpine Umzüge</h3><p className="mb-4">Viele Orte in Uri befinden sich in Berglagen. Unsere Partner sind auf solche Umzüge spezialisiert und verfügen über die nötige Ausrüstung.</p><h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">Gotthard-Achse</h3><p>Uri liegt an der wichtigen Nord-Süd-Achse. Umzüge ins Tessin oder nach Norden sind daher besonders gut abgedeckt.</p></div></div></section>

      <section className="py-12"><div className="container mx-auto px-4 max-w-3xl"><h2 className="text-2xl font-bold text-center mb-8">Häufige Fragen</h2><FAQAccordion items={faqs} /></div></section>

      <section className="py-12 bg-primary text-primary-foreground"><div className="container mx-auto px-4 text-center"><h2 className="text-2xl font-bold mb-4">Bereit für Ihren Umzug in Uri?</h2><p className="mb-6 opacity-90">Vergleichen Sie jetzt kostenlos die besten Umzugsfirmen</p><Link to="/umzug-offerte"><Button size="lg" variant="secondary" className="h-12 px-8">Jetzt vergleichen<ArrowRight className="ml-2 h-4 w-4" /></Button></Link></div></section>
    </div>
  );
};

export default Uri;
