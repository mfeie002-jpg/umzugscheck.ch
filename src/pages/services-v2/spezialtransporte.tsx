import { useState } from "react";
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
import { Star, MapPin, ArrowRight, Lock, Shield } from "lucide-react";

const SERVICE_NAME = "Spezialtransporte";
const SERVICE_SLUG = "spezialtransporte";

const faqs = [
  { question: "Was sind Spezialtransporte?", answer: "Klaviere, Tresore, Kunstwerke, Antiquitäten, medizinische Geräte – alles was besondere Sorgfalt erfordert." },
  { question: "Wie werden empfindliche Gegenstände geschützt?", answer: "Spezialverpackung, klimatisierte Fahrzeuge, Luftfederung, geschulte Spezialisten mit Erfahrung." },
  { question: "Was kostet ein Spezialtransport?", answer: "Ab CHF 200 für kleine Gegenstände, Klaviere ab CHF 400, Tresore nach Gewicht. Alle Preise inklusive Versicherung." },
];

export default function SpezialtransportePage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [objectType, setObjectType] = useState("");
  const [moveDate, setMoveDate] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("uc_prefill", JSON.stringify({ location, objectType, date: moveDate, service: SERVICE_SLUG, source: `${SERVICE_SLUG}-landing`, timestamp: Date.now() }));
    navigate("/umzugsofferten");
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{SERVICE_NAME} Schweiz | Klavier, Tresor, Kunst | Vollversichert</title>
        <meta name="description" content={`${SERVICE_NAME} in der Schweiz ✓ Klaviere ✓ Tresore ✓ Kunstwerke ✓ Vollversichert ✓ Spezialisten!`} />
        <link rel="canonical" href={`https://umzugscheck.ch/services/${SERVICE_SLUG}`} />
      </Helmet>

      <Header />

      <main>
        <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-slate-900 to-primary/40">
          <div className="container px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
                <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30"><Shield className="w-3 h-3 mr-1" />Vollversichert</Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">{SERVICE_NAME} – <span className="text-secondary">für wertvolle Güter</span></h1>
                <p className="text-lg text-white/85 mb-6">Klaviere, Tresore, Kunstwerke – <span className="text-green-400 font-semibold">sicher transportiert.</span></p>
                <div className="flex items-center gap-4 mb-8 justify-center lg:justify-start">
                  <div className="flex items-center gap-1"><Star className="w-5 h-5 fill-amber-400 text-amber-400" /><span className="text-white font-bold">4.9</span></div>
                  <span className="text-white/60">|</span>
                  <span className="text-white/80">1'500+ Spezialtransporte</span>
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
                    <h2 className="text-xl font-bold text-center mb-6">Spezialtransport anfragen</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div><Label>Ort</Label><div className="relative mt-1"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={location} onChange={e => setLocation(e.target.value)} placeholder="PLZ oder Ort" className="pl-10" required /></div></div>
                      <div><Label>Was soll transportiert werden?</Label><Select value={objectType} onValueChange={setObjectType}><SelectTrigger className="mt-1"><SelectValue placeholder="Wählen..." /></SelectTrigger><SelectContent><SelectItem value="klavier">Klavier / Flügel</SelectItem><SelectItem value="tresor">Tresor</SelectItem><SelectItem value="kunst">Kunstwerk</SelectItem><SelectItem value="antiquitaet">Antiquität</SelectItem><SelectItem value="anderes">Anderes</SelectItem></SelectContent></Select></div>
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
            <h2 className="text-3xl font-bold mb-4">Wertvolle Güter sicher transportieren</h2>
            <p className="text-lg mb-8 opacity-90">Spezialisten für Klaviere, Tresore, Kunstwerke</p>
            <Button asChild size="lg" variant="secondary" className="font-bold px-8 py-6"><Link to="/umzugsofferten">Jetzt Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" /></Link></Button>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
    </div>
  );
}
