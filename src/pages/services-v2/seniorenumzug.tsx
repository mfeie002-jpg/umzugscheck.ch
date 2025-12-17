import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/homepage/Header";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star, MapPin, Check, ArrowRight, Lock, FileText, CheckCircle, ClipboardList, ShieldCheck, Heart, Users } from "lucide-react";

const SERVICE_NAME = "Seniorenumzug";
const SERVICE_SLUG = "seniorenumzug";

const faqs = [
  { question: "Was kostet ein Seniorenumzug?", answer: "Ab CHF 1'500 für kleine Wohnungen. Inklusive Betreuung, Einpacken, Transport und Einrichten am neuen Ort." },
  { question: "Welche Zusatzleistungen gibt es?", answer: "Entrümpelung, Behördengänge-Hilfe, Möbelentsorgung, Einrichten der neuen Wohnung, Bilder aufhängen." },
  { question: "Wie einfühlsam sind die Teams?", answer: "Unsere Partner sind auf Seniorenumzüge spezialisiert. Geduld, Verständnis und respektvoller Umgang sind selbstverständlich." },
];

export default function SeniorenumzugPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [apartmentSize, setApartmentSize] = useState("");
  const [moveDate, setMoveDate] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("uc_prefill", JSON.stringify({ location, size: apartmentSize, date: moveDate, service: SERVICE_SLUG, source: `${SERVICE_SLUG}-landing`, timestamp: Date.now() }));
    navigate("/umzugsofferten");
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{SERVICE_NAME} Schweiz | Einfühlsam & Professionell | Bis 40% sparen</title>
        <meta name="description" content={`${SERVICE_NAME} in der Schweiz ✓ Einfühlsame Teams ✓ Alles aus einer Hand ✓ Kostenlose Offerten!`} />
        <link rel="canonical" href={`https://umzugscheck.ch/services/${SERVICE_SLUG}`} />
      </Helmet>

      <Header />

      <main>
        <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-slate-900 to-primary/40">
          <div className="container px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
                <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30"><Heart className="w-3 h-3 mr-1" />Spezialisiert auf Senioren</Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">{SERVICE_NAME} – <span className="text-secondary">mit Herz & Verstand</span></h1>
                <p className="text-lg text-white/85 mb-6">Einfühlsame Teams für einen stressfreien Umzug. <span className="text-green-400 font-semibold">Alles aus einer Hand.</span></p>
                <div className="flex items-center gap-4 mb-8 justify-center lg:justify-start">
                  <div className="flex items-center gap-1"><Star className="w-5 h-5 fill-amber-400 text-amber-400" /><span className="text-white font-bold">4.9</span></div>
                  <span className="text-white/60">|</span>
                  <span className="text-white/80">500+ Seniorenumzüge</span>
                </div>
                <div className="lg:hidden">
                  <Button asChild size="lg" className="w-full bg-secondary hover:bg-secondary/90 font-bold py-6">
                    <Link to="/umzugsofferten">Jetzt Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" /></Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
                <Card className="bg-white/[0.98] shadow-2xl rounded-2xl">
                  <CardContent className="p-8">
                    <h2 className="text-xl font-bold text-center mb-6">Kostenlose Beratung</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div><Label>Ort</Label><div className="relative mt-1"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={location} onChange={e => setLocation(e.target.value)} placeholder="PLZ oder Ort" className="pl-10" required /></div></div>
                      <div><Label>Wohnungsgrösse</Label><Select value={apartmentSize} onValueChange={setApartmentSize}><SelectTrigger className="mt-1"><SelectValue placeholder="Wählen..." /></SelectTrigger><SelectContent><SelectItem value="1-2">1-2 Zimmer</SelectItem><SelectItem value="2.5-3">2.5-3 Zimmer</SelectItem><SelectItem value="3.5-4">3.5-4 Zimmer</SelectItem><SelectItem value="4.5+">4.5+ Zimmer</SelectItem></SelectContent></Select></div>
                      <div><Label>Wunschtermin</Label><Input type="date" value={moveDate} onChange={e => setMoveDate(e.target.value)} className="mt-1" /></div>
                      <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-secondary/90 font-bold py-6">Kostenlos Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" /></Button>
                      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5"><Lock className="w-3.5 h-3.5" />Ihre Daten sind sicher</p>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Häufige Fragen</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (<AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-lg border px-6"><AccordionTrigger className="text-left font-medium py-4">{faq.question}</AccordionTrigger><AccordionContent className="text-muted-foreground pb-4">{faq.answer}</AccordionContent></AccordionItem>))}
            </Accordion>
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Einfühlsamer Umzugsservice für Senioren</h2>
            <p className="text-lg mb-8 opacity-90">Alles aus einer Hand – stressfrei und mit Herz</p>
            <Button asChild size="lg" variant="secondary" className="font-bold px-8 py-6"><Link to="/umzugsofferten">Jetzt Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" /></Link></Button>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
    </div>
  );
}
