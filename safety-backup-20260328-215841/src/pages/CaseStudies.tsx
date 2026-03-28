import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Star, Clock, Users, Building, Heart, Award, Truck, Play } from "lucide-react";

const caseStudies = [
  {
    id: "privatumzug-familie-mueller",
    title: "Familienumzug mit 5 Zimmern",
    category: "Privatumzug",
    client: "Familie Müller",
    location: "Von Zürich nach Winterthur",
    duration: "1 Tag",
    team: "4 Umzugshelfer",
    icon: Users,
    image: "/api/placeholder/600/400",
    challenge: "Die Familie Müller zog mit zwei kleinen Kindern und einem grossen Haushalt von einer 5-Zimmer-Wohnung in Zürich-Oerlikon in ein Einfamilienhaus in Winterthur.",
    solution: "Wir planten den Umzug sorgfältig mit einem Vorbesuch, packten alle Kartons professionell ein und koordinierten den Transport so, dass die Familie am selben Tag einziehen konnte.",
    results: [
      "Umzug in nur 8 Stunden komplett abgeschlossen",
      "Null Schäden an Möbeln und Gegenständen",
      "Kinder konnten am Abend in ihrem neuen Zimmer schlafen",
      "Alle Möbel exakt nach Plan aufgestellt"
    ],
    testimonial: "Der beste Umzug, den wir je hatten! Die Crew war so professionell und freundlich, unsere Kinder waren begeistert.",
    rating: 5
  },
  {
    id: "bueroumzug-tech-startup",
    title: "Tech-Startup Büroumzug",
    category: "Büroumzug",
    client: "TechVenture AG",
    location: "Zürich Technopark",
    duration: "Wochenende",
    team: "8 Umzugshelfer",
    icon: Building,
    image: "/api/placeholder/600/400",
    challenge: "Ein schnell wachsendes Startup mit 50 Mitarbeitern musste in grössere Räumlichkeiten umziehen, ohne den Geschäftsbetrieb zu unterbrechen.",
    solution: "Wir führten den kompletten Umzug am Wochenende durch, inklusive IT-Equipment, Server und empfindlicher Elektronik mit spezialisierten Verpackungsmaterialien.",
    results: [
      "Null Ausfallzeit für das Unternehmen",
      "IT-Systeme am Montag voll funktionsfähig",
      "Alle 50 Arbeitsplätze eingerichtet",
      "Empfindliche Serverausrüstung sicher transportiert"
    ],
    testimonial: "Wir waren skeptisch, ob ein Umzug am Wochenende möglich ist, aber das Team hat es geschafft. Am Montag konnten wir normal arbeiten!",
    rating: 5
  },
  {
    id: "seniorenumzug-herr-weber",
    title: "Einfühlsamer Seniorenumzug",
    category: "Seniorenumzug",
    client: "Herr Weber, 82",
    location: "Von Bern in Altersresidenz",
    duration: "2 Tage",
    team: "3 Umzugshelfer",
    icon: Heart,
    image: "/api/placeholder/600/400",
    challenge: "Herr Weber musste nach 45 Jahren aus seinem Familienhaus in eine Altersresidenz umziehen. Der emotionale Aspekt war besonders wichtig.",
    solution: "Unser spezialisiertes Seniorenumzugs-Team nahm sich Zeit, half bei der Auswahl der mitzunehmenden Gegenstände und organisierte die Entsorgung des Rests.",
    results: [
      "Respektvoller Umgang mit Erinnerungsstücken",
      "Koordinierte Haushaltsauflösung",
      "Neue Wohnung komplett eingerichtet",
      "Familienfotoalbum sicher aufbewahrt"
    ],
    testimonial: "Die jungen Leute haben mich behandelt wie ihren eigenen Grossvater. Ich bin sehr dankbar für ihre Geduld und Fürsorge.",
    rating: 5
  },
  {
    id: "vip-umzug-villa",
    title: "VIP Villenumzug",
    category: "VIP Service",
    client: "Vertraulich",
    location: "Zürichsee-Region",
    duration: "3 Tage",
    team: "6 Spezialisten",
    icon: Award,
    image: "/api/placeholder/600/400",
    challenge: "Ein diskreter Umzug einer Premium-Villa mit wertvollen Kunstwerken, Antiquitäten und einem Weinkeller mit 500 Flaschen.",
    solution: "Unser White-Glove-Service mit klimatisiertem Transport, Kunstspediteur-Expertise und 24/7 Überwachung während des gesamten Umzugs.",
    results: [
      "Alle Kunstwerke unbeschädigt transportiert",
      "Weinkeller temperaturkontrolliert verlegt",
      "Absolute Diskretion gewährleistet",
      "Concierge-Service für alle Nacharbeiten"
    ],
    testimonial: "Professionell, diskret und absolut zuverlässig. Genau der Service, den man für solch wertvolle Besitztümer braucht.",
    rating: 5
  }
];

const videoTestimonials = [
  {
    id: 1,
    title: "Familie Schneider erzählt",
    thumbnail: "/api/placeholder/400/225",
    duration: "2:45",
    category: "Privatumzug"
  },
  {
    id: 2,
    title: "TechVenture CEO Interview",
    thumbnail: "/api/placeholder/400/225",
    duration: "3:12",
    category: "Büroumzug"
  },
  {
    id: 3,
    title: "Seniorenresidenz Bewohner",
    thumbnail: "/api/placeholder/400/225",
    duration: "2:30",
    category: "Seniorenumzug"
  }
];

const CaseStudies = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Referenzen & Fallstudien | Feierabend Umzüge</title>
        <meta name="description" content="Entdecken Sie unsere erfolgreichen Umzugsprojekte. Privatumzüge, Büroumzüge, Seniorenumzüge und VIP-Services mit echten Kundengeschichten." />
        <link rel="canonical" href="https://feierabend-umzuege.ch/case-studies" />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern-dots.svg')] opacity-5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection animation="slide-up">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-alpine/20 text-alpine-foreground rounded-full text-sm font-medium mb-6">
                <Star className="h-4 w-4" />
                Über 5'000 erfolgreiche Umzüge
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-6">
                Unsere Erfolgsgeschichten
              </h1>
              <p className="text-lg text-primary-foreground/90 mb-8">
                Erfahren Sie, wie wir für unsere Kunden stressfreie Umzüge realisiert haben. 
                Von Familien bis zu Unternehmen – jeder Umzug ist einzigartig.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-in">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-8 text-center">
              Video-Testimonials
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {videoTestimonials.map((video, index) => (
              <AnimatedSection key={video.id} animation="slide-up" delay={index * 100}>
                <Card className="group cursor-pointer overflow-hidden hover:shadow-strong transition-all">
                  <div className="relative aspect-video bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="h-8 w-8 text-primary-foreground ml-1" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                      {video.duration}
                    </span>
                  </div>
                  <CardContent className="p-4">
                    <span className="text-xs text-alpine font-medium">{video.category}</span>
                    <h3 className="font-semibold mt-1">{video.title}</h3>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-in">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 text-center">
              Detaillierte Fallstudien
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Erfahren Sie mehr über unsere Arbeitsweise anhand konkreter Beispiele aus verschiedenen Umzugskategorien.
            </p>
          </AnimatedSection>

          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <AnimatedSection key={study.id} animation="slide-up" delay={index * 100}>
                <Card className="overflow-hidden">
                  <div className={`grid lg:grid-cols-2 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                    {/* Image */}
                    <div className={`aspect-video lg:aspect-auto bg-muted ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                      <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-alpine/20 to-primary/20 flex items-center justify-center">
                        <study.icon className="h-24 w-24 text-alpine/50" />
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-6 lg:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-alpine/10 text-alpine text-sm font-medium rounded-full">
                          {study.category}
                        </span>
                        <div className="flex">
                          {[...Array(study.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-warm fill-warm" />
                          ))}
                        </div>
                      </div>

                      <h3 className="text-xl lg:text-2xl font-display font-bold text-foreground mb-2">
                        {study.title}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {study.client}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {study.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="h-4 w-4" />
                          {study.team}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Herausforderung</h4>
                          <p className="text-sm text-muted-foreground">{study.challenge}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Unsere Lösung</h4>
                          <p className="text-sm text-muted-foreground">{study.solution}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Ergebnisse</h4>
                          <ul className="space-y-1">
                            {study.results.map((result, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-forest flex-shrink-0 mt-0.5" />
                                {result}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <blockquote className="mt-6 p-4 bg-muted rounded-lg italic text-muted-foreground">
                        "{study.testimonial}"
                        <footer className="mt-2 text-sm font-semibold text-foreground not-italic">
                          — {study.client}
                        </footer>
                      </blockquote>
                    </CardContent>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fade-in">
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">
              Werden Sie unsere nächste Erfolgsgeschichte
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Lassen Sie sich von unserem professionellen Team begleiten und erleben Sie einen stressfreien Umzug.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" variant="secondary" className="min-h-[52px]">
                  Kostenlose Offerte anfragen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="min-h-[52px] bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Unsere Services entdecken
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CaseStudies;
