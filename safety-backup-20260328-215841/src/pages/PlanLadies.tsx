import { Link } from "react-router-dom";
import { ArrowRight, Heart, Shield, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import ladiesImage from "@/assets/service-ladies-new.jpg";

const PlanLadies = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-gradient-subtle relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection className="space-y-6">
              <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
                Frauen-Service
              </span>
              <h1 className="text-balance font-display">
                Frauen-<span className="text-gradient">Service</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Umzug mit reinem Frauenteam auf Wunsch. Diskretion, Verständnis und 
                besondere Sorgfalt für Ihre Bedürfnisse.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90 min-h-[52px]">
                      Jetzt anfragen
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-elegant">
              <img
                src={ladiesImage}
                alt="Frauen-Service"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 right-6">
                <span className="px-4 py-2 bg-gradient-hero text-primary-foreground rounded-full text-sm font-bold shadow-medium">
                  <Heart className="inline h-4 w-4 mr-1" /> Frauenteam
                </span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 mb-12 bg-alpine/10 border-2 border-alpine">
              <div className="text-center mb-8">
                <Heart className="h-12 w-12 text-alpine mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Von Frauen. Für Frauen.</h2>
                <p className="text-muted-foreground">
                  Ein Umzugsservice, der Ihre besonderen Bedürfnisse versteht
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white rounded-lg">
                  <Shield className="h-8 w-8 text-alpine mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Sicherheit</h3>
                  <p className="text-sm text-muted-foreground">Vertrauenswürdig</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <Heart className="h-8 w-8 text-alpine mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Verständnis</h3>
                  <p className="text-sm text-muted-foreground">Einfühlsam</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <Sparkles className="h-8 w-8 text-alpine mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Sorgfalt</h3>
                  <p className="text-sm text-muted-foreground">Detailverliebt</p>
                </div>
              </div>
            </Card>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Was macht unseren Frauen-Service besonders?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Users className="h-6 w-6 text-alpine mr-3" />
                    Reines Frauenteam
                  </h3>
                  <p className="text-muted-foreground">
                    Auf Wunsch führen ausschliesslich Frauen Ihren Umzug durch – 
                    von der Beratung bis zum letzten Karton. Für ein Gefühl von 
                    Sicherheit und Vertrauen in Ihrer Privatsphäre.
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Shield className="h-6 w-6 text-alpine mr-3" />
                    Absolute Diskretion
                  </h3>
                  <p className="text-muted-foreground">
                    Besondere Situationen erfordern besonderes Feingefühl. Wir behandeln 
                    Ihre Angelegenheiten mit höchster Vertraulichkeit und Respekt.
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Heart className="h-6 w-6 text-alpine mr-3" />
                    Persönliche Betreuung
                  </h3>
                  <p className="text-muted-foreground">
                    Eine feste Ansprechpartnerin koordiniert Ihren gesamten Umzug. 
                    Von der ersten Beratung bis zur Nachkontrolle.
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Sparkles className="h-6 w-6 text-alpine mr-3" />
                    Besondere Sorgfalt
                  </h3>
                  <p className="text-muted-foreground">
                    Erfahrung im Umgang mit Kleidung, Schmuck, Kosmetik und persönlichen 
                    Gegenständen. Wir wissen, was Ihnen wichtig ist.
                  </p>
                </Card>
              </div>
            </div>

            <Card className="p-8 mb-12 bg-muted/30">
              <h2 className="text-2xl font-semibold mb-6">Ideal in diesen Situationen</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-alpine/20 flex items-center justify-center mt-1">
                    <span className="text-alpine text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <strong>Alleinlebende Frauen:</strong>
                    <span className="text-muted-foreground"> Sicherheit und Vertrauen in den eigenen vier Wänden</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-alpine/20 flex items-center justify-center mt-1">
                    <span className="text-alpine text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <strong>Trennungssituationen:</strong>
                    <span className="text-muted-foreground"> Einfühlsam und diskret in schwierigen Zeiten</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-alpine/20 flex items-center justify-center mt-1">
                    <span className="text-alpine text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <strong>Kulturelle oder religiöse Gründe:</strong>
                    <span className="text-muted-foreground"> Respekt für Ihre Werte und Traditionen</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-alpine/20 flex items-center justify-center mt-1">
                    <span className="text-alpine text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <strong>Persönliche Präferenz:</strong>
                    <span className="text-muted-foreground"> Einfach wohler fühlen mit einem Frauenteam</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-alpine/20 flex items-center justify-center mt-1">
                    <span className="text-alpine text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <strong>Besondere Gegenstände:</strong>
                    <span className="text-muted-foreground"> Kleiderschränke, Schmuck, persönliche Sammlungen</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Kombinierbar mit allen Paketen</h2>
              <p className="text-muted-foreground mb-6">
                Wählen Sie Ihren gewünschten Service-Umfang und fügen Sie den 
                Frauen-Service hinzu:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 hover-lift">
                  <h3 className="font-semibold mb-3">Basis + Frauenteam</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Transport und Montage
                  </p>
                  <Link to="/plan/basic">
                    <Button variant="outline" size="sm" className="w-full">
                      Zum Basis-Paket
                    </Button>
                  </Link>
                </Card>

                <Card className="p-6 hover-lift border-2 border-alpine">
                  <div className="text-xs font-semibold text-alpine mb-2">BELIEBT</div>
                  <h3 className="font-semibold mb-3">Halb + Frauenteam</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Inkl. Verpackung
                  </p>
                  <Link to="/plan/half">
                    <Button size="sm" className="w-full bg-alpine hover:bg-alpine/90">
                      Zum Halb-Paket
                    </Button>
                  </Link>
                </Card>

                <Card className="p-6 hover-lift">
                  <h3 className="font-semibold mb-3">Voll + Frauenteam</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Rundum-Sorglos
                  </p>
                  <Link to="/plan/full">
                    <Button variant="outline" size="sm" className="w-full">
                      Zum Voll-Paket
                    </Button>
                  </Link>
                </Card>
              </div>
            </div>

            <Card className="p-8 bg-alpine/5">
              <h2 className="text-2xl font-semibold mb-4">Unser Team</h2>
              <p className="text-muted-foreground mb-6">
                Unsere Mitarbeiterinnen sind speziell geschult in:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Professioneller Umgang mit Kleidung</li>
                  <li>• Sichere Verpackung von Schmuck & Accessoires</li>
                  <li>• Diskretion und Vertraulichkeit</li>
                  <li>• Einfühlsame Kommunikation</li>
                </ul>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Möbelmontage und -demontage</li>
                  <li>• Organisation und Planung</li>
                  <li>• Zeitmanagement</li>
                  <li>• Qualitätskontrolle</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-6">Kundenstimmen</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 fill-current text-alpine" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4">
                  "Als alleinlebende Frau war mir der Frauen-Service sehr wichtig. 
                  Das Team war unglaublich professionell und ich habe mich durchgehend 
                  sicher gefühlt. Absolut empfehlenswert!"
                </p>
                <p className="font-semibold">Anna M., Zürich</p>
              </Card>

              <Card className="p-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 fill-current text-alpine" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4">
                  "Nach meiner Trennung brauchte ich einen diskreten und verständnisvollen 
                  Service. Das Frauenteam hat meine Erwartungen übertroffen. Vielen Dank!"
                </p>
                <p className="font-semibold">Sandra K., Basel</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-balance mb-6">Umzug in sicheren Händen</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Vertrauen Sie auf unseren Frauen-Service für einen Umzug mit Verständnis 
            und besonderer Sorgfalt.
          </p>
          <Link to="/contact">
            <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
              Jetzt Frauen-Service anfragen
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlanLadies;
