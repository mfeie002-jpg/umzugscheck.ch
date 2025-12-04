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
import { Star, Shield, Clock, TrendingUp, CheckCircle, ArrowRight, MapPin, Users, Truck, Zap, ChevronRight, Building2, Home, Package, Watch } from "lucide-react";

const neuchatelCities = ["Neuchâtel", "La Chaux-de-Fonds", "Le Locle", "Boudry", "Val-de-Travers", "Peseux", "Cortaillod", "Colombier", "Hauterive", "Marin-Epagnier"];

const topCompanies = [
  { name: "Neuchâtel Déménagement SA", rating: 4.9, reviews: 142, priceLevel: "fair", sponsored: true, available: true, badge: "Top noté" },
  { name: "Express Chaux-de-Fonds", rating: 4.8, reviews: 118, priceLevel: "günstig", sponsored: true, available: true, badge: "Bon prix" },
  { name: "Le Locle Moving", rating: 4.8, reviews: 94, priceLevel: "fair", sponsored: false, available: true, badge: "Local" },
  { name: "Val-de-Travers Transport", rating: 4.7, reviews: 76, priceLevel: "günstig", sponsored: false, available: true, badge: null },
  { name: "Littoral Déménagement", rating: 4.7, reviews: 68, priceLevel: "fair", sponsored: false, available: false, badge: null },
  { name: "Montagnes Neuchâteloises", rating: 4.6, reviews: 54, priceLevel: "premium", sponsored: false, available: true, badge: "Premium" },
  { name: "Boudry Express", rating: 4.6, reviews: 46, priceLevel: "günstig", sponsored: false, available: true, badge: null },
  { name: "Colombier Transport", rating: 4.5, reviews: 38, priceLevel: "fair", sponsored: false, available: true, badge: null },
  { name: "Hauterive Déménagement", rating: 4.5, reviews: 32, priceLevel: "günstig", sponsored: false, available: false, badge: null },
  { name: "Marin Moving", rating: 4.4, reviews: 26, priceLevel: "fair", sponsored: false, available: true, badge: null },
];

const priceExamples = [
  { size: "1-2 pièces", range: "CHF 450 - 850", avg: "CHF 620" },
  { size: "3-4 pièces", range: "CHF 950 - 1'600", avg: "CHF 1'180" },
  { size: "5+ pièces", range: "CHF 1'850 - 3'100", avg: "CHF 2'350" },
];

const services = [
  { name: "Déménagement + Nettoyage", icon: Home, link: "/umzug-mit-reinigung" },
  { name: "Déménagement entreprise", icon: Building2, link: "/firmenumzug-schweiz" },
  { name: "Monte-meuble", icon: Truck, link: "/moebellift" },
  { name: "Débarras", icon: Package, link: "/entsorgung-raeumung" },
  { name: "Garde-meuble", icon: Package, link: "/einlagerung" },
  { name: "Petits transports", icon: Truck, link: "/kleintransporte" },
];

const usps = [
  { title: "Experts horlogers", desc: "Spécialistes pour la région horlogère", icon: Watch },
  { title: "Jusqu'à 40% d'économie", desc: "Comparez les prix des entreprises locales", icon: TrendingUp },
  { title: "Devis rapides", desc: "Recevez jusqu'à 5 offres en 24h", icon: Clock },
  { title: "Partenaires vérifiés", desc: "Toutes les entreprises sont assurées", icon: Shield },
];

const faqs = [
  { question: "Combien coûte un déménagement à Neuchâtel?", answer: "Un déménagement à Neuchâtel coûte entre CHF 450 et CHF 3'100 selon la taille du logement." },
  { question: "Y a-t-il des spécialistes pour les Montagnes?", answer: "Oui, plusieurs entreprises sont spécialisées pour La Chaux-de-Fonds et Le Locle." },
  { question: "Comment réserver un déménagement?", answer: "Remplissez notre formulaire en 2 minutes et recevez jusqu'à 5 devis gratuits." },
  { question: "Les entreprises sont-elles assurées?", answer: "Toutes les entreprises sur notre plateforme sont entièrement assurées et vérifiées." },
  { question: "Proposez-vous du garde-meuble?", answer: "Oui, beaucoup de nos partenaires proposent des solutions de stockage." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Entreprises de déménagement Neuchâtel - Umzugscheck.ch",
  "description": "Comparez les entreprises de déménagement à Neuchâtel. Devis gratuits d'entreprises locales vérifiées.",
  "url": "https://umzugscheck.ch/neuchatel",
  "areaServed": { "@type": "State", "name": "Neuchâtel", "containedInPlace": { "@type": "Country", "name": "Suisse" } },
  "serviceType": "Service de déménagement"
};

export const Neuchatel = () => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [rooms, setRooms] = useState("3");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState(5);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => { const i = setInterval(() => setActiveUsers(p => Math.max(3, p + Math.floor(Math.random() * 3) - 1)), 5000); return () => clearInterval(i); }, []);
  useEffect(() => { const t = setTimeout(() => setShowNotification(true), 3000); return () => clearTimeout(t); }, []);

  const handleServiceToggle = (s: string) => setSelectedServices(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO title="Déménagement Neuchâtel – Comparez & économisez jusqu'à 40%" description="Comparez les entreprises de déménagement à Neuchâtel. Devis gratuits d'entreprises vérifiées. ✓ Experts locaux ✓ 100% gratuit" canonicalUrl="https://umzugscheck.ch/neuchatel" keywords="Déménagement Neuchâtel, entreprise déménagement La Chaux-de-Fonds, déménageur Neuchâtel" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <AnimatePresence>
        {showNotification && (
          <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-success" /></div>
              <div><p className="text-sm font-medium">Nouvelle réservation à Neuchâtel</p><p className="text-xs text-muted-foreground">il y a 8 minutes</p></div>
              <button onClick={() => setShowNotification(false)} className="text-muted-foreground hover:text-foreground">×</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/30"><Watch className="h-3 w-3 mr-1" />Région horlogère</Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Comparez les déménageurs à <span className="text-primary">Neuchâtel</span></h1>
              <p className="text-lg text-muted-foreground mb-6">Trouvez les meilleures entreprises de déménagement à Neuchâtel et dans la région horlogère.</p>
              <div className="flex flex-wrap gap-3 mb-6">
                {[{ icon: Star, text: "4.8/5", color: "text-yellow-500" }, { icon: Users, text: `${activeUsers} actifs`, color: "text-primary" }, { icon: Shield, text: "Gratuit", color: "text-success" }].map((b, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center gap-2 bg-card/80 px-3 py-1.5 rounded-full border border-border/50">
                    <b.icon className={`h-4 w-4 ${b.color}`} /><span className="text-sm font-medium">{b.text}</span>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><span className="w-2 h-2 bg-success rounded-full animate-pulse" /><span>{activeUsers} personnes comparent à Neuchâtel</span></div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-2 border-primary/20 shadow-2xl bg-card/95">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Zap className="h-4 w-4 text-primary" /></div><div><h3 className="font-semibold">Devis rapide</h3><p className="text-xs text-muted-foreground">En 2 minutes</p></div></div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="text-sm">De</Label><select value={fromCity} onChange={e => setFromCity(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"><option value="">Choisir</option>{neuchatelCities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                      <div><Label className="text-sm">À</Label><select value={toCity} onChange={e => setToCity(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"><option value="">Choisir</option>{neuchatelCities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    </div>
                    <div><Label className="text-sm">Taille</Label><select value={rooms} onChange={e => setRooms(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"><option value="1">1 pièce</option><option value="2">2 pièces</option><option value="3">3 pièces</option><option value="4">4 pièces</option><option value="5">5+ pièces</option></select></div>
                    <div><Label className="text-sm mb-2 block">Services</Label><div className="grid grid-cols-2 gap-2">{["Nettoyage", "Débarras", "Emballage", "Montage"].map(s => <label key={s} className="flex items-center gap-2 text-sm cursor-pointer"><Checkbox checked={selectedServices.includes(s)} onCheckedChange={() => handleServiceToggle(s)} />{s}</label>)}</div></div>
                    <Link to={`/umzug-offerte?from=${fromCity}&to=${toCity}&rooms=${rooms}`}><Button className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90">Obtenir des devis<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                    <p className="text-xs text-center text-muted-foreground">✓ Gratuit ✓ Sans engagement</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Top 10 déménageurs à Neuchâtel</h2>
          <div className="space-y-3">
            {topCompanies.map((c, i) => (
              <Card key={c.name} className={`hover:shadow-lg transition-all ${c.sponsored ? 'border-primary/30 bg-primary/5' : ''}`}>
                <CardContent className="p-4"><div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{i + 1}</div>
                  <div className="flex-1"><div className="flex items-center gap-2 flex-wrap"><h3 className="font-semibold">{c.name}</h3>{c.sponsored && <Badge variant="outline" className="text-xs bg-primary/10">Sponsorisé</Badge>}{c.badge && <Badge variant="secondary" className="text-xs">{c.badge}</Badge>}</div><div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{c.rating} ({c.reviews} avis)<Badge variant="outline" className="text-xs">{c.priceLevel}</Badge></div></div>
                  <div className="flex items-center gap-2">{c.available ? <Badge className="bg-success/10 text-success">Disponible</Badge> : <Badge variant="outline">Complet</Badge>}<Button size="sm" className="bg-primary">Devis</Button></div>
                </div></CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6"><Link to="/firmen?region=neuchatel"><Button variant="outline" size="lg">Tous les déménageurs<ChevronRight className="ml-2 h-4 w-4" /></Button></Link></div>
        </div>
      </section>

      <section className="py-12"><div className="container mx-auto px-4"><h2 className="text-2xl font-bold text-center mb-8">Prix de déménagement à Neuchâtel</h2><div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">{priceExamples.map(p => <Card key={p.size} className="text-center"><CardContent className="p-6"><Home className="h-8 w-8 mx-auto mb-3 text-primary" /><h3 className="font-semibold mb-2">{p.size}</h3><p className="text-2xl font-bold text-primary">{p.avg}</p><p className="text-sm text-muted-foreground">{p.range}</p></CardContent></Card>)}</div></div></section>

      <section className="py-12 bg-muted/30"><div className="container mx-auto px-4"><div className="grid grid-cols-2 md:grid-cols-6 gap-4">{services.map(s => <Link key={s.name} to={s.link}><Card className="hover:shadow-lg hover:border-primary/30 transition-all h-full"><CardContent className="p-4 text-center"><s.icon className="h-8 w-8 mx-auto mb-2 text-primary" /><p className="text-sm font-medium">{s.name}</p></CardContent></Card></Link>)}</div></div></section>

      <section className="py-12"><div className="container mx-auto px-4"><div className="grid md:grid-cols-4 gap-6">{usps.map(u => <Card key={u.title} className="h-full"><CardContent className="p-6"><div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><u.icon className="h-6 w-6 text-primary" /></div><h3 className="font-semibold mb-2">{u.title}</h3><p className="text-sm text-muted-foreground">{u.desc}</p></CardContent></Card>)}</div></div></section>

      <section className="py-12 bg-muted/30"><div className="container mx-auto px-4 max-w-4xl"><h2 className="text-2xl font-bold mb-6">Déménagement à Neuchâtel – Informations</h2><div className="prose prose-gray max-w-none text-muted-foreground"><p className="mb-4">Le canton de Neuchâtel est connu pour son industrie horlogère et ses paysages jurassiens. La Chaux-de-Fonds et Le Locle sont classés au patrimoine mondial de l'UNESCO.</p><h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">Les Montagnes neuchâteloises</h3><p className="mb-4">Les déménagements vers les Montagnes neuchâteloises nécessitent des entreprises expérimentées en raison de l'altitude et du climat hivernal.</p></div></div></section>

      <section className="py-12"><div className="container mx-auto px-4 max-w-3xl"><h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2><FAQAccordion items={faqs} /></div></section>

      <section className="py-12 bg-primary text-primary-foreground"><div className="container mx-auto px-4 text-center"><h2 className="text-2xl font-bold mb-4">Prêt pour votre déménagement à Neuchâtel?</h2><p className="mb-6 opacity-90">Comparez gratuitement les meilleures entreprises</p><Link to="/umzug-offerte"><Button size="lg" variant="secondary" className="h-12 px-8">Comparer maintenant<ArrowRight className="ml-2 h-4 w-4" /></Button></Link></div></section>
    </div>
  );
};

export default Neuchatel;
