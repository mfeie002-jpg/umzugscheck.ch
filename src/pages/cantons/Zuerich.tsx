import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Link } from "react-router-dom";
import { Star, Shield, Users, Zap, ArrowRight, Landmark, Home } from "lucide-react";

import { ZuerichBreadcrumb } from "@/components/zuerich/ZuerichBreadcrumb";
import { ZuerichUrgencyBanner } from "@/components/zuerich/ZuerichUrgencyBanner";
import { ZuerichTrustSignals } from "@/components/zuerich/ZuerichTrustSignals";
import { ZuerichStatsCounter } from "@/components/zuerich/ZuerichStatsCounter";
import { ZuerichCompanyFilters } from "@/components/zuerich/ZuerichCompanyFilters";
import { ZuerichTestimonials } from "@/components/zuerich/ZuerichTestimonials";
import { ZuerichMovingTips } from "@/components/zuerich/ZuerichMovingTips";
import { ZuerichInteractiveMap } from "@/components/zuerich/ZuerichInteractiveMap";
import { ZuerichServiceComparison } from "@/components/zuerich/ZuerichServiceComparison";
import { ZuerichPriceCalculatorMini } from "@/components/zuerich/ZuerichPriceCalculatorMini";
import { ZuerichReviewsShowcase } from "@/components/zuerich/ZuerichReviewsShowcase";
import { ZuerichChecklist } from "@/components/zuerich/ZuerichChecklist";
import { ZuerichRelatedServices } from "@/components/zuerich/ZuerichRelatedServices";
import { ZuerichContactSection } from "@/components/zuerich/ZuerichContactSection";
import { ZuerichNewsletter } from "@/components/zuerich/ZuerichNewsletter";
import { ZuerichPartnersSection } from "@/components/zuerich/ZuerichPartnersSection";
import { ZuerichQuickActions } from "@/components/zuerich/ZuerichQuickActions";
import { ZuerichSocialProof } from "@/components/zuerich/ZuerichSocialProof";

const zuerichCities = ["Zürich", "Winterthur", "Uster", "Dübendorf", "Dietikon", "Wetzikon", "Kloten", "Bülach", "Horgen", "Wädenswil"];

const topCompanies = [
  { name: "Zürich Umzüge AG", rating: 4.9, reviews: 456, priceLevel: "fair", sponsored: true, available: true, badge: "Top bewertet" },
  { name: "Limmattal Moving", rating: 4.9, reviews: 387, priceLevel: "günstig", sponsored: true, available: true, badge: "Preistipp" },
  { name: "Premium Relocation Zürich", rating: 4.8, reviews: 312, priceLevel: "premium", sponsored: false, available: true, badge: "Premium" },
  { name: "Winterthur Express", rating: 4.8, reviews: 276, priceLevel: "fair", sponsored: false, available: true, badge: "Express" },
  { name: "Zürisee Transporte", rating: 4.7, reviews: 234, priceLevel: "günstig", sponsored: false, available: true, badge: "Beliebt" },
  { name: "Unterland Umzüge", rating: 4.7, reviews: 198, priceLevel: "fair", sponsored: false, available: false, badge: null },
  { name: "Oberland Moving GmbH", rating: 4.6, reviews: 167, priceLevel: "günstig", sponsored: false, available: true, badge: "Lokal" },
  { name: "City Zürich Transporte", rating: 4.6, reviews: 143, priceLevel: "premium", sponsored: false, available: true, badge: null },
  { name: "Glatttal Umzüge", rating: 4.5, reviews: 121, priceLevel: "fair", sponsored: false, available: true, badge: "Schnell" },
  { name: "Sihltal Express", rating: 4.5, reviews: 98, priceLevel: "günstig", sponsored: false, available: false, badge: null },
];

const priceExamples = [
  { size: "1-2 Zimmer", range: "CHF 590 - 990", avg: "CHF 790" },
  { size: "3-4 Zimmer", range: "CHF 1'190 - 1'990", avg: "CHF 1'490" },
  { size: "5+ Zimmer", range: "CHF 2'190 - 3'790", avg: "CHF 2'890" },
];

const faqs = [
  { question: "Was kostet ein Umzug in Zürich?", answer: "Ein Umzug in Zürich kostet zwischen CHF 590 und CHF 3'790 je nach Wohnungsgrösse." },
  { question: "Welche Umzugsfirma ist die beste in Zürich?", answer: "Die besten Umzugsfirmen in Zürich haben Bewertungen von 4.8 oder höher." },
  { question: "Wie buche ich einen Umzug in Zürich?", answer: "Füllen Sie unser Formular in 2 Minuten aus und erhalten Sie bis zu 5 kostenlose Offerten." },
  { question: "Brauche ich eine Parkbewilligung?", answer: "Ja, in Zürich ist eine Parkbewilligung für Umzugsfahrzeuge erforderlich." },
  { question: "Sind die Umzugsfirmen versichert?", answer: "Alle Unternehmen auf unserer Plattform sind vollständig versichert." },
];

export const Zuerich = () => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [rooms, setRooms] = useState("3");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState(18);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  useEffect(() => { const i = setInterval(() => setActiveUsers(p => Math.max(12, p + Math.floor(Math.random() * 3) - 1)), 5000); return () => clearInterval(i); }, []);

  const handleServiceToggle = (s: string) => setSelectedServices(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleCompanySelection = (name: string) => setSelectedCompanies(p => p.includes(name) ? p.filter(n => n !== name) : [...p, name]);

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO title="Umzugsfirmen Zürich – Vergleichen & bis zu 40% sparen" description="Vergleichen Sie Umzugsfirmen in Zürich. Kostenlose Offerten von geprüften Unternehmen." canonicalUrl="https://umzugscheck.ch/zuerich" keywords="Umzug Zürich, Umzugsfirma Zürich" />

      <ZuerichUrgencyBanner />
      <ZuerichBreadcrumb />
      <ZuerichQuickActions />
      <ZuerichSocialProof />

      <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/30"><Landmark className="h-3 w-3 mr-1" />Wirtschaftsmetropole</Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Umzugsfirmen in <span className="text-primary">Zürich</span> vergleichen</h1>
              <p className="text-lg text-muted-foreground mb-6">Finden Sie die besten Umzugsfirmen in Zürich. Die grösste Auswahl an geprüften Partnern.</p>
              <div className="flex flex-wrap gap-3 mb-6">
                {[{ icon: Star, text: "4.8/5", color: "text-yellow-500" }, { icon: Users, text: `${activeUsers} aktiv`, color: "text-primary" }, { icon: Shield, text: "Gratis", color: "text-success" }].map((b, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center gap-2 bg-card/80 px-3 py-1.5 rounded-full border border-border/50">
                    <b.icon className={`h-4 w-4 ${b.color}`} /><span className="text-sm font-medium">{b.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-2 border-primary/20 shadow-2xl bg-card/95">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Zap className="h-4 w-4 text-primary" /></div><div><h3 className="font-semibold">Schnelle Offerte</h3><p className="text-xs text-muted-foreground">In 2 Minuten</p></div></div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="text-sm">Von</Label><select value={fromCity} onChange={e => setFromCity(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"><option value="">Wählen</option>{zuerichCities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                      <div><Label className="text-sm">Nach</Label><select value={toCity} onChange={e => setToCity(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"><option value="">Wählen</option>{zuerichCities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
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

      <ZuerichTrustSignals />
      <ZuerichStatsCounter />

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Top 10 Umzugsfirmen in Zürich</h2>
          <ZuerichCompanyFilters />
          <div className="space-y-3">
            {topCompanies.map((c, i) => (
              <Card key={c.name} className={`hover:shadow-lg transition-all ${c.sponsored ? 'border-primary/30 bg-primary/5' : ''} ${selectedCompanies.includes(c.name) ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-4"><div className="flex items-center gap-4">
                  <Checkbox checked={selectedCompanies.includes(c.name)} onCheckedChange={() => toggleCompanySelection(c.name)} />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{i + 1}</div>
                  <div className="flex-1"><div className="flex items-center gap-2 flex-wrap"><h3 className="font-semibold">{c.name}</h3>{c.sponsored && <Badge variant="outline" className="text-xs bg-primary/10">Gesponsert</Badge>}{c.badge && <Badge variant="secondary" className="text-xs">{c.badge}</Badge>}</div><div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{c.rating} ({c.reviews})<Badge variant="outline" className="text-xs">{c.priceLevel}</Badge></div></div>
                  <div className="flex items-center gap-2">{c.available ? <Badge className="bg-success/10 text-success">Verfügbar</Badge> : <Badge variant="outline">Ausgebucht</Badge>}<Button size="sm" className="bg-primary">Offerte</Button></div>
                </div></CardContent>
              </Card>
            ))}
          </div>
          {selectedCompanies.length > 0 && (
            <div className="sticky bottom-4 mt-6 bg-card border-2 border-primary rounded-xl p-4 shadow-xl flex items-center justify-between">
              <span className="font-medium">{selectedCompanies.length} Firma(en) ausgewählt</span>
              <Link to={`/zuerich/vergleich?companies=${selectedCompanies.join(',')}`}><Button>Vergleichen<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            </div>
          )}
        </div>
      </section>

      <ZuerichTestimonials />
      <ZuerichServiceComparison />
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold mb-6">Umzugspreise in Zürich</h2>
              <div className="space-y-4">
                {priceExamples.map(p => (
                  <Card key={p.size}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <Home className="h-8 w-8 text-primary" />
                      <div className="flex-1"><h3 className="font-semibold">{p.size}</h3><p className="text-sm text-muted-foreground">{p.range}</p></div>
                      <p className="text-xl font-bold text-primary">{p.avg}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <ZuerichPriceCalculatorMini />
          </div>
        </div>
      </section>

      <ZuerichMovingTips />
      <ZuerichInteractiveMap />
      <ZuerichReviewsShowcase />
      <ZuerichChecklist />
      <ZuerichRelatedServices />
      <ZuerichContactSection />
      <ZuerichNewsletter />
      <ZuerichPartnersSection />

      <section className="py-12"><div className="container mx-auto px-4 max-w-3xl"><h2 className="text-2xl font-bold text-center mb-8">Häufige Fragen</h2><FAQAccordion items={faqs} /></div></section>

      <section className="py-12 bg-primary text-primary-foreground"><div className="container mx-auto px-4 text-center"><h2 className="text-2xl font-bold mb-4">Bereit für Ihren Umzug in Zürich?</h2><p className="mb-6 opacity-90">Vergleichen Sie jetzt kostenlos die besten Umzugsfirmen</p><Link to="/umzug-offerte"><Button size="lg" variant="secondary" className="h-12 px-8">Jetzt vergleichen<ArrowRight className="ml-2 h-4 w-4" /></Button></Link></div></section>
    </div>
  );
};

export default Zuerich;
