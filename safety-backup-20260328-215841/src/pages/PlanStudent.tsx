import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, Euro, Calendar, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import studentImage from "@/assets/service-student-new.jpg";

const PlanStudent = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-gradient-subtle relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection className="space-y-6">
              <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
                Studenten-Paket
              </span>
              <h1 className="text-balance font-display">
                Studenten-<span className="text-gradient">Umzug</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Spezieller Studententarif – bis zu 20% Rabatt! Für Studierende, 
                Auszubildende und Berufsschüler.
              </p>
              <div className="inline-block px-6 py-3 bg-alpine/20 rounded-lg">
                <p className="text-lg font-semibold text-alpine">
                  🎓 Studentenausweis vorzeigen & sparen!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90 min-h-[52px] hover:scale-[1.02] active:scale-[0.98] transition-transform">
                    Jetzt Studenten-Offerte anfragen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-elegant">
              <img
                src={studentImage}
                alt="Studenten-Umzug"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 right-6">
                <span className="px-4 py-2 bg-gradient-warm text-warm-foreground rounded-full text-sm font-bold shadow-warm">
                  -20% Rabatt
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
                <TrendingDown className="h-12 w-12 text-alpine mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-alpine mb-2">Bis zu 20% Rabatt</h2>
                <p className="text-muted-foreground">
                  Exklusiv für Studierende, Auszubildende und Berufsschüler
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white rounded-lg">
                  <Euro className="h-8 w-8 text-alpine mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Günstiger Preis</h3>
                  <p className="text-sm text-muted-foreground">Studententarif</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <Calendar className="h-8 w-8 text-alpine mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Flexible Termine</h3>
                  <p className="text-sm text-muted-foreground">Auch am Wochenende</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <GraduationCap className="h-8 w-8 text-alpine mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Einfach</h3>
                  <p className="text-sm text-muted-foreground">Ausweis genügt</p>
                </div>
              </div>
            </Card>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Wer kann profitieren?</h2>
              <Card className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-alpine/20 flex items-center justify-center mt-0.5">
                      <span className="text-alpine text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <strong>Studierende</strong> an Universitäten und Fachhochschulen
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-alpine/20 flex items-center justify-center mt-0.5">
                      <span className="text-alpine text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <strong>Auszubildende</strong> in einer beruflichen Ausbildung
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-alpine/20 flex items-center justify-center mt-0.5">
                      <span className="text-alpine text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <strong>Berufsschüler</strong> an Berufsschulen und Berufsfachschulen
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-alpine/20 flex items-center justify-center mt-0.5">
                      <span className="text-alpine text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <strong>Doktoranden</strong> und Postdocs
                    </div>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    <strong>Nachweis:</strong> Gültiger Studenten-/Schülerausweis oder 
                    Immatrikulationsbescheinigung bei Vertragsabschluss vorlegen.
                  </p>
                </div>
              </Card>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Leistungsumfang</h2>
              <p className="text-muted-foreground mb-6">
                Kombinieren Sie den Studententarif mit einem unserer drei Pakete:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 hover-lift">
                  <h3 className="font-semibold mb-3">Basis + Rabatt</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Transport und Montage
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    <li>• Sie packen selbst</li>
                    <li>• Wir transportieren</li>
                    <li>• Maximale Ersparnis</li>
                  </ul>
                  <Link to="/plan/basic">
                    <Button variant="outline" size="sm" className="w-full">
                      Details
                    </Button>
                  </Link>
                </Card>

                <Card className="p-6 hover-lift border-2 border-alpine">
                  <div className="text-xs font-semibold text-alpine mb-2">BELIEBT</div>
                  <h3 className="font-semibold mb-3">Halb + Rabatt</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Basis + Verpackung
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    <li>• Wir packen für Sie</li>
                    <li>• Professioneller Transport</li>
                    <li>• Sie packen aus</li>
                  </ul>
                  <Link to="/plan/half">
                    <Button size="sm" className="w-full bg-alpine hover:bg-alpine/90">
                      Details
                    </Button>
                  </Link>
                </Card>

                <Card className="p-6 hover-lift">
                  <h3 className="font-semibold mb-3">Voll + Rabatt</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Rundum-Sorglos-Service
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    <li>• Komplettservice</li>
                    <li>• Ein- und Auspacken</li>
                    <li>• Maximaler Komfort</li>
                  </ul>
                  <Link to="/plan/full">
                    <Button variant="outline" size="sm" className="w-full">
                      Details
                    </Button>
                  </Link>
                </Card>
              </div>
            </div>

            <Card className="p-8 mb-12 bg-muted/30">
              <h2 className="text-2xl font-semibold mb-6">Zusätzliche Studenten-Vorteile</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-alpine/20 flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-alpine" />
                    </div>
                    Flexible Termine
                  </h3>
                  <ul className="space-y-2 text-muted-foreground ml-11">
                    <li>• Umzüge auch am Wochenende</li>
                    <li>• Anpassung an Semesterferien</li>
                    <li>• Kurzfristige Buchungen möglich</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-alpine/20 flex items-center justify-center mr-3">
                      <Euro className="h-5 w-5 text-alpine" />
                    </div>
                    Kostenlose Extras
                  </h3>
                  <ul className="space-y-2 text-muted-foreground ml-11">
                    <li>• Umzugskartons zum Selbstkosten preis</li>
                    <li>• Ratenzahlung möglich</li>
                    <li>• Keine versteckten Kosten</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-alpine/5">
              <h2 className="text-2xl font-semibold mb-4">So funktioniert's</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-alpine text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <p className="text-muted-foreground pt-1">
                    <strong>Offerte anfragen</strong> und "Studenten-Paket" angeben
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-alpine text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <p className="text-muted-foreground pt-1">
                    <strong>Studiennachweis</strong> bei Vertragsabschluss vorlegen
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-alpine text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <p className="text-muted-foreground pt-1">
                    <strong>Rabatt erhalten</strong> und stressfrei umziehen!
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-6">Das sagen Studierende</h2>
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
                  "Super Service und mit dem Studententarif perfekt für mein Budget! 
                  Kann ich nur weiterempfehlen."
                </p>
                <p className="font-semibold">Marco, ETH Zürich</p>
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
                  "Vom WG-Zimmer ins Studentenwohnheim – unkompliziert und günstig. 
                  Auch kurzfristig hat alles geklappt!"
                </p>
                <p className="font-semibold">Sarah, Uni Bern</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-balance mb-6">Bereit für Ihren Studenten-Umzug?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Profitieren Sie von unserem Studententarif und ziehen Sie stressfrei um!
          </p>
          <Link to="/contact">
            <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
              Jetzt Studenten-Offerte anfragen
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlanStudent;
