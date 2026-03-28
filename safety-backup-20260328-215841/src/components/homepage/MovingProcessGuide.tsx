/**
 * Moving Process Guide - Homepage Section
 * 
 * Comprehensive guide for:
 * 1. Moving within Switzerland (Umzug innerhalb der Schweiz)
 * 2. Moving to Switzerland from abroad (Umzug in die Schweiz)
 * 
 * A/B testable via HomepageSectionManager
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Plane, Calendar, FileText, Phone, Car, 
  School, Dog, Package, ClipboardCheck, Home, 
  CreditCard, Shield, Building2, ArrowRight, ChevronDown,
  Clock, CheckCircle2, AlertCircle, Lightbulb
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";

// Timeline step data
const swissInternalSteps = {
  before: {
    title: "Vor dem Umzug",
    timeframe: "2–4 Wochen vorher",
    icon: Calendar,
    items: [
      { icon: Clock, text: "Freien Umzugstag beim Arbeitgeber beantragen" },
      { icon: Building2, text: "Ab- und Anmeldung bei Gemeinden (eUmzugCH)" },
      { icon: Phone, text: "Strom, Gas, Wasser – Zählerstände melden" },
      { icon: FileText, text: "Telekommunikation: Internet & TV ummelden" },
      { icon: CreditCard, text: "Adressänderung: Bank, Versicherungen, Ärzte" },
      { icon: Package, text: "Nachsendeauftrag bei der Post einrichten" },
      { icon: Car, text: "Parkbewilligung für Umzugswagen beantragen" },
      { icon: School, text: "Schule/Kita bei Kindern informieren" },
      { icon: Dog, text: "Hund bei alter Gemeinde abmelden" },
    ]
  },
  during: {
    title: "Am Umzugstag",
    timeframe: "Der grosse Tag",
    icon: Package,
    items: [
      { icon: CheckCircle2, text: "Zählerstände (Strom, Wasser, Heizung) ablesen" },
      { icon: Package, text: "Kartons systematisch packen und beschriften" },
      { icon: Shield, text: "Möbel schützen und sichern" },
    ]
  },
  after: {
    title: "Nach dem Umzug",
    timeframe: "Erste 14 Tage",
    icon: Home,
    items: [
      { icon: FileText, text: "Antrittsprotokoll mit Vermieter erstellen" },
      { icon: ClipboardCheck, text: "Rückgabeprotokoll alte Wohnung (Kaution)" },
      { icon: Shield, text: "Versicherungen auf neue Adresse anpassen" },
      { icon: Building2, text: "Bei neuer Gemeinde anmelden (14 Tage Frist)" },
    ]
  }
};

const internationalSteps = {
  before: {
    title: "Vorbereitung",
    timeframe: "Vor der Einreise",
    icon: FileText,
    items: [
      { icon: FileText, text: "Aufenthaltserlaubnis beantragen (B-/L-Bewilligung)" },
      { icon: Home, text: "Wohnsitzverlegung nachweisen (Mietvertrag)" },
      { icon: Package, text: "Umzugsgut inventarisieren (min. 6 Monate genutzt)" },
      { icon: ClipboardCheck, text: "Zollformular 18.44 vorbereiten" },
      { icon: FileText, text: "Abmeldebescheinigung aus Herkunftsland" },
    ]
  },
  during: {
    title: "Bei der Einreise",
    timeframe: "Am Grenzübergang",
    icon: MapPin,
    items: [
      { icon: Building2, text: "Zollabfertigung während Öffnungszeiten" },
      { icon: CheckCircle2, text: "Umzugsgut ist zollfrei (Bedingungen erfüllt)" },
      { icon: AlertCircle, text: "Fahrzeuge & Tiere: Abgaben/MWST beachten" },
    ]
  },
  after: {
    title: "Nach der Einreise",
    timeframe: "Innerhalb 14 Tagen",
    icon: Home,
    items: [
      { icon: Building2, text: "Anmeldung bei Wohngemeinde" },
      { icon: Shield, text: "Schweizer Krankenversicherung abschliessen" },
      { icon: CreditCard, text: "Bankkonto eröffnen" },
      { icon: Car, text: "Führerschein umtauschen (1 Jahr Frist)" },
      { icon: School, text: "Kinder in Schule anmelden" },
    ]
  }
};

interface TimelinePhaseProps {
  phase: {
    title: string;
    timeframe: string;
    icon: React.ElementType;
    items: { icon: React.ElementType; text: string }[];
  };
  index: number;
  isLast: boolean;
}

const TimelinePhase = memo(function TimelinePhase({ phase, index, isLast }: TimelinePhaseProps) {
  const Icon = phase.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {/* Connector line */}
      {!isLast && (
        <div className="hidden md:block absolute top-12 left-6 w-0.5 h-full bg-gradient-to-b from-primary/30 to-transparent" />
      )}
      
      <div className="flex gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        
        {/* Content */}
        <div className="flex-1 pb-8">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-bold text-foreground">{phase.title}</h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {phase.timeframe}
            </span>
          </div>
          
          <ul className="space-y-2">
            {phase.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <item.icon className="w-4 h-4 mt-0.5 text-primary/60 flex-shrink-0" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
});

export const MovingProcessGuide = memo(function MovingProcessGuide() {
  const [activeTab, setActiveTab] = useState("internal");

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-6xl px-4">
        <AnimatedSection className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-4">
            Umzugsprozess Schweiz
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">
            So funktioniert das <span className="text-gradient">Zügeln in der Schweiz</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ob innerhalb der Schweiz oder aus dem Ausland – mit unserer Checkliste 
            vergessen Sie nichts. Inklusive eUmzugCH und Zollformalitäten.
          </p>
        </AnimatedSection>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="internal" className="gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Innerhalb</span> Schweiz
            </TabsTrigger>
            <TabsTrigger value="international" className="gap-2">
              <Plane className="w-4 h-4" />
              Aus dem Ausland
            </TabsTrigger>
          </TabsList>

          {/* Internal Move */}
          <TabsContent value="internal">
            <div className="grid lg:grid-cols-3 gap-8">
              {Object.entries(swissInternalSteps).map(([key, phase], index) => (
                <Card key={key} className="p-6 bg-card/50">
                  <TimelinePhase 
                    phase={phase} 
                    index={index} 
                    isLast={index === Object.keys(swissInternalSteps).length - 1} 
                  />
                </Card>
              ))}
            </div>
            
            {/* Tip Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Pro-Tipp: eUmzugCH</h4>
                    <p className="text-sm text-muted-foreground">
                      Nutze <a href="https://www.eumzug.swiss" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">eUmzugCH</a> für 
                      digitale Ab- und Anmeldungen – das spart Zeit und ist in den meisten Kantonen verfügbar. 
                      In der Schweiz hast du Anspruch auf <strong>einen freien Umzugstag</strong> bei deinem Arbeitgeber.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* International Move */}
          <TabsContent value="international">
            <div className="grid lg:grid-cols-3 gap-8">
              {Object.entries(internationalSteps).map(([key, phase], index) => (
                <Card key={key} className="p-6 bg-card/50">
                  <TimelinePhase 
                    phase={phase} 
                    index={index} 
                    isLast={index === Object.keys(internationalSteps).length - 1} 
                  />
                </Card>
              ))}
            </div>
            
            {/* Cost & Tip Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 grid md:grid-cols-2 gap-4"
            >
              <Card className="p-6 bg-accent/50 border-accent">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Kosten internationaler Umzug</h4>
                    <p className="text-sm text-muted-foreground">
                      Rechne mit <strong>CHF 1'000 – 5'000</strong> je nach Distanz und Volumen. 
                      Für EU-Bürger ist der Prozess durch Freizügigkeit vereinfacht.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Zollformular 18.44</h4>
                    <p className="text-sm text-muted-foreground">
                      Lade das <a href="https://www.ezv.admin.ch" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Formular 18.44</a> bei 
                      der Eidgenössischen Zollverwaltung herunter. Umzugsgut ist zollfrei, wenn es min. 6 Monate genutzt wurde.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <AnimatedSection delay={0.3} className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/umzugsofferten">
              <Button size="lg" className="min-h-[52px] w-full sm:w-auto">
                Jetzt Offerten vergleichen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/guide/umzugscheckliste-schweiz">
              <Button size="lg" variant="outline" className="min-h-[52px] w-full sm:w-auto">
                Vollständige Checkliste
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});

export default MovingProcessGuide;
