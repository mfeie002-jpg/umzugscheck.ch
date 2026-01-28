import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Users, Building2, Globe, Heart, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedCounter from "@/components/AnimatedCounter";
import galleryVip from "@/assets/gallery-vip-penthouse.jpg";
import galleryOffice from "@/assets/gallery-office-move.jpg";
import referenceInternational from "@/assets/reference-international.jpg";
import gallerySenior from "@/assets/gallery-senior-service.jpg";
import referenceFamily from "@/assets/reference-family.jpg";
import galleryStorage from "@/assets/gallery-storage.jpg";
import referenceCorporate from "@/assets/reference-corporate.jpg";
import referenceArt from "@/assets/reference-art.jpg";

const References = () => {
  const caseStudies = [
    {
      title: "Luxus-Penthouse Zürich",
      category: "VIP-Umzug",
      icon: Star,
      image: galleryVip,
      client: "Privatkunde",
      location: "Zürich Seefeld",
      challenge: "Umzug eines 300m² Penthouses mit wertvollen Antiquitäten und Kunstwerken in die 8. Etage ohne Warenlift.",
      solution: "Einsatz unseres VIP-Teams mit Spezialausrüstung, Kletterausrüstung für Fenstertransport, klimatisierter Transport für Kunstwerke.",
      results: [
        "100% schadensfreier Transport aller Gegenstände",
        "Umzug in einer Nacht durchgeführt",
        "Diskrete Abwicklung ohne Nachbarbelästigung",
        "Kunde wurde Stammkunde für weitere Immobilien"
      ],
      testimonial: "Das professionellste Team, mit dem ich je gearbeitet habe. Absolut diskret und perfekt organisiert.",
      duration: "1 Nacht",
      teamSize: "8 Personen"
    },
    {
      title: "Firmenzentrale Relocation",
      category: "Büroumzug",
      icon: Building2,
      image: galleryOffice,
      client: "Tech-Unternehmen",
      location: "Basel Innenstadt",
      challenge: "Umzug von 150 Arbeitsplätzen inkl. Serverraum über ein Wochenende ohne Arbeitsausfall.",
      solution: "Detaillierte Vorabplanung, IT-Spezialistenteam, gestaffelter Umzug mit Nachtschichten, Parallel-Setup am neuen Standort.",
      results: [
        "Null Ausfallzeit - Montag normale Arbeit",
        "Alle IT-Systeme funktionsfähig",
        "150 Arbeitsplätze einsatzbereit",
        "Budget eingehalten und unterschritten"
      ],
      testimonial: "Unglaublich, wie reibungslos das gelaufen ist. Am Montag konnte unser gesamtes Team wie gewohnt arbeiten.",
      duration: "48 Stunden",
      teamSize: "15 Personen"
    },
    {
      title: "Internationale Verlagerung",
      category: "International",
      icon: Globe,
      image: referenceInternational,
      client: "Diplomatenfamilie",
      location: "Genf → New York",
      challenge: "Kompletter Haushaltsumzug mit Zollabwicklung, besonderen Anforderungen für diplomatisches Gut und enger Zeitplan.",
      solution: "Koordination mit internationalen Partnern, Zollspezialist, klimatisierter Seetransport, vollständige Versicherung.",
      results: [
        "Pünktliche Lieferung in NYC",
        "Reibungslose Zollabwicklung",
        "Alle Gegenstände unbeschädigt",
        "Aufbau und Einrichtung vor Ort"
      ],
      testimonial: "Von Genf nach New York - alles perfekt koordiniert. Wir konnten uns vollständig auf Feierabend verlassen.",
      duration: "6 Wochen",
      teamSize: "12 Personen"
    },
    {
      title: "Seniorenresidenz-Umzug",
      category: "Seniorenumzug",
      icon: Heart,
      image: gallerySenior,
      client: "Ehepaar (85 & 87 Jahre)",
      location: "Bern",
      challenge: "Einfühlsamer Umzug aus dem 40-jährigen Familienheim ins Altersheim mit emotionaler Unterstützung.",
      solution: "Persönliche Betreuung über 3 Wochen, schrittweise Sortierung, Spenden-Koordination, geduldiges Vorgehen.",
      results: [
        "Stressfreier Übergang für Senioren",
        "Wertvolle Erinnerungen bewahrt",
        "Neue Wohnung liebevoll eingerichtet",
        "Entsorgung und Spenden organisiert"
      ],
      testimonial: "Das Team war wie eine Familie. Sie haben uns durch diese schwierige Zeit begleitet mit so viel Geduld und Herz.",
      duration: "3 Wochen",
      teamSize: "3 Personen"
    },
    {
      title: "Familienumzug Luzern",
      category: "Privatumzug",
      icon: Users,
      image: referenceFamily,
      client: "Familie mit 3 Kindern",
      location: "Luzern → Zug",
      challenge: "Umzug einer 5-köpfigen Familie mit Schulbeginn-Deadline und zwei Haustieren.",
      solution: "Kinderfreundliche Planung, Haustier-sichere Transportlösungen, schnelle Einrichtung der Kinderzimmer als Priorität.",
      results: [
        "Pünktlich vor Schulbeginn fertig",
        "Kinderzimmer am gleichen Tag bezugsbereit",
        "Haustiere stressfrei transportiert",
        "Familie empfiehlt uns aktiv weiter"
      ],
      testimonial: "Trotz des Chaos mit drei Kindern lief alles reibungslos. Die Kleinen fanden es sogar spannend!",
      duration: "2 Tage",
      teamSize: "6 Personen"
    },
    {
      title: "Langzeit-Einlagerung",
      category: "Lagerung",
      icon: TrendingUp,
      image: galleryStorage,
      client: "Expat-Familie",
      location: "Zürich",
      challenge: "Komplette Haushaltseinlagerung für 2-jährigen Auslandsaufenthalt mit wertvollen Möbeln und Kunstwerken.",
      solution: "Klimatisierte Lagerräume, professionelle Inventarisierung, Versicherung, regelmässige Kontrollen.",
      results: [
        "Perfekter Zustand nach 2 Jahren",
        "Digitales Inventar mit Fotos",
        "Flexible Teilentnahmen möglich",
        "Nahtlose Rücklieferung"
      ],
      testimonial: "Zwei Jahre später war alles in perfektem Zustand. Als wäre die Zeit stehen geblieben.",
      duration: "2 Jahre",
      teamSize: "4 Personen"
    },
    {
      title: "Kunst-Museum Relocation",
      category: "Spezialumzug",
      icon: Star,
      image: referenceArt,
      client: "Privatsammlung",
      location: "Zürich → Basel",
      challenge: "Transport einer wertvollen Kunstsammlung mit 50+ Gemälden und Skulpturen unter höchsten Sicherheitsanforderungen.",
      solution: "Klimatisierter Spezialtransport, Kunstversicherung, weisse Handschuhe, GPS-Tracking, bewachter Konvoi.",
      results: [
        "100% schadenfreier Transport",
        "Klimakontrolle durchgehend gewährleistet",
        "Professionelle Hängung am Zielort",
        "Vollständige Dokumentation jedes Werks"
      ],
      testimonial: "Unsere wertvollsten Stücke wurden mit höchster Sorgfalt behandelt. Absolut professionell.",
      duration: "3 Tage",
      teamSize: "6 Spezialisten"
    },
    {
      title: "Konzernhauptsitz Verlagerung",
      category: "Grossprojekt",
      icon: Building2,
      image: referenceCorporate,
      client: "Schweizer Konzern",
      location: "Zürich",
      challenge: "Umzug von 500 Arbeitsplätzen über 8 Etagen innerhalb von 2 Wochen bei laufendem Betrieb.",
      solution: "Phasenweise Umsetzung, Nacht- und Wochenendschichten, dediziertes Projektmanagement, IT-Koordination.",
      results: [
        "Null Produktivitätsverlust",
        "500 Arbeitsplätze termingerecht",
        "Alle IT-Systeme nahtlos migriert",
        "Budget um 5% unterschritten"
      ],
      testimonial: "Ein Projekt dieser Grösse so reibungslos umzusetzen ist beeindruckend. Feierabend hat alle Erwartungen übertroffen.",
      duration: "2 Wochen",
      teamSize: "25 Personen"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-gradient-subtle relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30"></div>
        <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
              Unsere Erfolge
            </span>
            <h1 className="text-balance font-display">
              Referenzen & <span className="text-gradient">Erfolgsgeschichten</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Echte Projekte, echte Herausforderungen, echte Lösungen. 
              Sehen Sie, wie wir für unsere Kunden das Unmögliche möglich machen.
            </p>
          </div>
        </AnimatedSection>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 lg:space-y-24">
            {caseStudies.map((study, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="max-w-6xl mx-auto">
                  <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                    <Card className="overflow-hidden shadow-elegant">
                      <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                        <div className={`relative h-[300px] lg:h-auto min-h-[400px] ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                          <img
                            src={study.image}
                            alt={study.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:hidden" />
                          <div className="absolute top-6 left-6">
                            <span className="px-4 py-2 bg-gradient-hero text-primary-foreground rounded-full text-sm font-semibold shadow-medium">
                              {study.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6 lg:p-10 space-y-6">
                          <div>
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-medium">
                                <study.icon className="h-6 w-6 text-primary-foreground" />
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold font-display">{study.title}</h2>
                                <p className="text-sm text-muted-foreground">{study.location}</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-muted/50 rounded-xl">
                              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Dauer</p>
                              <p className="font-bold text-foreground">{study.duration}</p>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-xl">
                              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Team</p>
                              <p className="font-bold text-foreground">{study.teamSize}</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2 text-alpine">Herausforderung</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{study.challenge}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2 text-alpine">Unsere Lösung</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{study.solution}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-3 text-alpine">Ergebnisse</h3>
                            <ul className="space-y-2">
                              {study.results.map((result, idx) => (
                                <li key={idx} className="flex items-start space-x-2 text-sm">
                                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span className="text-foreground">{result}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-4 border-t border-border bg-muted/30 -mx-6 lg:-mx-10 px-6 lg:px-10 -mb-6 lg:-mb-10 pb-6 lg:pb-10">
                            <p className="text-sm italic text-foreground leading-relaxed">
                              "{study.testimonial}"
                            </p>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">— {study.client}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12 lg:mb-16 space-y-4">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-warm bg-warm/10 rounded-full">
              Unsere Bilanz
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold font-display">Zahlen, die überzeugen</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[
              { end: 5000, suffix: "+", label: "Erfolgreiche Umzüge" },
              { end: 98, suffix: "%", label: "Weiterempfehlungsrate" },
              { end: 40, suffix: "+", label: "Jahre Erfahrung" },
              { end: 99.9, suffix: "%", label: "Schadenfreie Umzüge" },
            ].map((stat, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="p-6 text-center hover-lift">
                  <AnimatedCounter 
                    end={stat.end} 
                    suffix={stat.suffix} 
                    label={stat.label} 
                  />
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gradient-hero text-primary-foreground">
        <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-display">Ihre Erfolgsgeschichte beginnt hier</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Lassen Sie uns gemeinsam Ihren Umzug zu einem Erfolg machen. 
            Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" variant="secondary" className="min-h-[52px]">
                  Offerte anfragen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <a href="tel:+41765681302">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary min-h-[52px]">
                  Anrufen
                </Button>
              </motion.div>
            </a>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
};

export default References;