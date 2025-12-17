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
import { Star, MapPin, ArrowRight, Lock, GraduationCap } from "lucide-react";

const SERVICE_NAME = "Studentenumzug";
const SERVICE_SLUG = "studenten";

const faqs = [
  { question: "Was kostet ein Studentenumzug?", answer: "Ab CHF 300 für WG-Zimmer, ab CHF 500 für Studio. Günstige Tarife speziell für Studenten." },
  { question: "Gibt es Studenten-Rabatte?", answer: "Ja, viele Partner bieten 10-20% Rabatt für Studierende mit gültigem Ausweis." },
  { question: "Kann ich auch am Wochenende umziehen?", answer: "Ja, Wochenend-Termine sind möglich und bei Studenten sehr beliebt." },
];

export default function StudentenumzugPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [roomType, setRoomType] = useState("");
  const [moveDate, setMoveDate] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("uc_prefill", JSON.stringify({ location, roomType, date: moveDate, service: SERVICE_SLUG, source: `${SERVICE_SLUG}-landing`, timestamp: Date.now() }));
    navigate("/umzugsofferten");
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{SERVICE_NAME} Schweiz | Günstig & Flexibel | Ab CHF 300</title>
        <meta name="description" content={`${SERVICE_NAME} in der Schweiz ✓ Studenten-Rabatte ✓ Günstige Tarife ✓ Flexibel ✓ Ab CHF 300!`} />
        <link rel="canonical" href={`https://umzugscheck.ch/services/${SERVICE_SLUG}`} />
      </Helmet>

      <Header />

      <main>
        <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-slate-900 to-primary/40">
          <div className="container px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
                <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30"><GraduationCap className="w-3 h-3 mr-1" />Studenten-Special</Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">{SERVICE_NAME} – <span className="text-secondary">günstig & flexibel</span></h1>
                <p className="text-lg text-white/85 mb-6">Spezielle Tarife für Studierende. <span className="text-green-400 font-semibold">Ab CHF 300.</span></p>
                <div className="flex items-center gap-4 mb-8 justify-center lg:justify-start">
                  <div className="flex items-center gap-1"><Star className="w-5 h-5 fill-amber-400 text-amber-400" /><span className="text-white font-bold">4.8</span></div>
                  <span className="text-white/60">|</span>
                  <span className="text-white/80">2'000+ Studentenumzüge</span>
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
                    <h2 className="text-xl font-bold text-center mb-6">Studenten-Offerte</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div><Label>Ort</Label><div className="relative mt-1"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={location} onChange={e => setLocation(e.target.value)} placeholder="PLZ oder Ort" className="pl-10" required /></div></div>
                      <div><Label>Wohnungstyp</Label><Select value={roomType} onValueChange={setRoomType}><SelectTrigger className="mt-1"><SelectValue placeholder="Wählen..." /></SelectTrigger><SelectContent><SelectItem value="wg">WG-Zimmer</SelectItem><SelectItem value="studio">Studio</SelectItem><SelectItem value="1-2">1-2 Zimmer</SelectItem></SelectContent></Select></div>
                      <div><Label>Wunschtermin</Label><Input type="date" value={moveDate} onChange={e => setMoveDate(e.target.value)} className="mt-1" /></div>
                      <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-secondary/90 font-bold py-6">Studenten-Offerte erhalten<ArrowRight className="ml-2 w-5 h-5" /></Button>
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
            <h2 className="text-3xl font-bold mb-4">Günstig umziehen als Student</h2>
            <p className="text-lg mb-8 opacity-90">Spezielle Studenten-Tarife ab CHF 300</p>
            <Button asChild size="lg" variant="secondary" className="font-bold px-8 py-6"><Link to="/umzugsofferten">Jetzt Offerten erhalten<ArrowRight className="ml-2 w-5 h-5" /></Link></Button>
          </div>
        </section>
      </main>

      <SimplifiedFooter />
    </div>
  );
}
