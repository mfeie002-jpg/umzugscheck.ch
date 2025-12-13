import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Users, TrendingUp, Shield, Heart, Zap, Star, Award, Clock, CheckCircle, ArrowRight, Phone, MessageCircle, MapPin, Building2, Handshake, Lightbulb, Globe, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTASection } from "@/components/CTASection";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function UeberUns() {
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollAnimation();
  const { ref: teamRef, isVisible: teamVisible } = useScrollAnimation();

  const values = [
    {
      icon: Shield,
      title: "Transparenz",
      description: "Faire Preise, echte Bewertungen, keine versteckten Kosten – wir stehen für Offenheit"
    },
    {
      icon: Users,
      title: "Kundenorientierung",
      description: "Ihre Zufriedenheit ist unser oberstes Ziel – bei jedem Umzug, den wir vermitteln"
    },
    {
      icon: TrendingUp,
      title: "Qualität",
      description: "Nur geprüfte und zuverlässige Umzugsfirmen mit nachweisbarer Expertise"
    },
    {
      icon: Heart,
      title: "Engagement",
      description: "Persönliche Betreuung und schnelle Hilfe, wenn Sie uns brauchen"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Modernste Technologie für bessere Preisvergleiche und KI-gestützte Empfehlungen"
    },
    {
      icon: Leaf,
      title: "Nachhaltigkeit",
      description: "Förderung umweltfreundlicher Umzugslösungen und CO₂-bewusster Partner"
    }
  ];

  const stats = [
    { value: "15'000+", label: "Zufriedene Kunden", icon: Users },
    { value: "200+", label: "Partnerfirmen", icon: Building2 },
    { value: "4.8/5", label: "Durchschnittsbewertung", icon: Star },
    { value: "26", label: "Kantone abgedeckt", icon: MapPin }
  ];

  const timeline = [
    { year: "2020", title: "Gründung", description: "Umzugscheck.ch wird mit der Vision gegründet, den Schweizer Umzugsmarkt zu revolutionieren" },
    { year: "2021", title: "100 Partner", description: "Wir erreichen 100 geprüfte Umzugspartner und 5'000 vermittelte Umzüge" },
    { year: "2022", title: "Schweizweite Abdeckung", description: "Expansion in alle 26 Kantone mit lokalen Partnern in jeder Region" },
    { year: "2023", title: "KI-Integration", description: "Launch des ersten KI-gestützten Umzugsrechners der Schweiz" },
    { year: "2024", title: "15'000+ Kunden", description: "Meilenstein: Über 15'000 erfolgreiche Umzüge und 200+ Partner" }
  ];

  const teamMembers = [
    { name: "Thomas Müller", role: "Gründer & CEO", description: "15 Jahre Erfahrung in der Umzugsbranche" },
    { name: "Sandra Keller", role: "Head of Operations", description: "Qualitätsmanagement und Partnerbetreuung" },
    { name: "Marco Brunner", role: "Head of Technology", description: "Entwicklung unserer KI-Lösungen" }
  ];

  const features = [
    { icon: Zap, title: "Schnell & einfach", description: "Angebote in 2 Minuten erhalten – ohne Papierkram" },
    { icon: Shield, title: "100% kostenlos", description: "Keine versteckten Gebühren, komplett gratis" },
    { icon: Users, title: "Nur geprüfte Firmen", description: "Alle Partner sind verifiziert und versichert" },
    { icon: TrendingUp, title: "Bis zu 40% sparen", description: "Durch Vergleich die besten Preise finden" }
  ];

  const testimonials = [
    { name: "Martin S.", location: "Zürich", text: "Endlich eine Plattform, der man vertrauen kann. Top Service!", rating: 5 },
    { name: "Claudia R.", location: "Basel", text: "Transparenz und Qualität auf höchstem Niveau. Sehr empfehlenswert.", rating: 5 },
    { name: "Andreas B.", location: "Bern", text: "Das Team war super hilfsbereit bei all meinen Fragen.", rating: 5 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Über uns – Die Nr. 1 Umzugsplattform der Schweiz | Umzugscheck.ch"
        description="Erfahren Sie mehr über Umzugscheck.ch, die führende Vergleichsplattform für Umzüge in der Schweiz. Unsere Mission, Werte und was uns auszeichnet."
        canonicalUrl="https://www.umzugscheck.ch/ueber-uns"
        keywords="umzugscheck über uns, umzugsplattform schweiz, umzugsfirmen vergleich, wer steckt hinter umzugscheck"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://umzugscheck.ch" },
        { name: "Über uns", url: "https://umzugscheck.ch/ueber-uns" }
      ]} />

      {/* Hero */}
      <section className="relative py-20 md:py-28 gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <ScrollReveal className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">Nr. 1 Umzugsplattform der Schweiz</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Über Umzugscheck.ch
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Die führende Vergleichsplattform für Umzüge in der Schweiz – seit 2020 machen wir Umzüge einfacher, transparenter und günstiger
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Bar */}
      <motion.section 
        ref={statsRef}
        initial={{ opacity: 0, y: 20 }}
        animate={statsVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="py-12 bg-white border-b"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission */}
      <PageSection variant="default">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Unsere Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Wir machen Umzüge einfacher, transparenter und günstiger. Mit unserer Plattform 
                helfen wir Privatpersonen und Unternehmen, die beste Umzugsfirma für ihre 
                Bedürfnisse zu finden – kostenlos, unverbindlich und in nur wenigen Minuten.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
              <Card variant="elevated" className="h-full">
                <CardContent className="p-6">
                  <Globe className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">Vision</h3>
                  <p className="text-muted-foreground">
                    Wir wollen die erste Anlaufstelle für jeden Umzug in der Schweiz sein – 
                    eine Plattform, der Menschen vertrauen und die echten Mehrwert bietet.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <Card variant="elevated" className="h-full">
                <CardContent className="p-6">
                  <Handshake className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">Versprechen</h3>
                  <p className="text-muted-foreground">
                    Wir versprechen Ihnen Transparenz, Qualität und einen Service, 
                    der Ihren Umzug so stressfrei wie möglich macht.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </PageSection>

      {/* Timeline */}
      <PageSection variant="muted">
        <motion.div
          ref={timelineRef}
          initial={{ opacity: 0, y: 20 }}
          animate={timelineVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Unsere Geschichte"
            subtitle="Von der Idee zur Nr. 1 Plattform"
            className="mb-12"
          />
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 transform md:-translate-x-1/2" />
              {timeline.map((item, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <div className={`relative flex flex-col md:flex-row gap-4 mb-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="md:w-1/2 pl-12 md:pl-0">
                      <Card variant="elevated" className={`${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                        <CardContent className="p-6">
                          <div className="text-2xl font-bold text-primary mb-2">{item.year}</div>
                          <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="absolute left-0 md:left-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center transform md:-translate-x-1/2 text-white text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </motion.div>
      </PageSection>

      {/* Werte */}
      <PageSection variant="default">
        <SectionHeading
          title="Unsere Werte"
          subtitle="Wofür wir stehen"
          className="mb-12"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <Card variant="elevated" className="h-full hover-lift">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </PageSection>

      {/* Team */}
      <PageSection variant="muted">
        <motion.div
          ref={teamRef}
          initial={{ opacity: 0, y: 20 }}
          animate={teamVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Unser Team"
            subtitle="Die Menschen hinter Umzugscheck.ch"
            className="mb-12"
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index} variant="elevated" className="h-full text-center hover-lift">
                <CardContent className="p-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </PageSection>

      {/* Was uns auszeichnet */}
      <PageSection variant="default">
        <SectionHeading
          title="Was uns auszeichnet"
          subtitle="Darum sollten Sie uns wählen"
          className="mb-12"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <Card variant="elevated" className="h-full hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </PageSection>

      {/* Testimonials */}
      <PageSection variant="muted">
        <SectionHeading
          title="Das sagen unsere Kunden"
          subtitle="Echte Stimmen zu Umzugscheck.ch"
          className="mb-12"
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <Card variant="elevated" className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </PageSection>

      {/* Quick Contact */}
      <PageSection variant="default">
        <div className="max-w-2xl mx-auto">
          <Card variant="elevated" className="overflow-hidden">
            <div className="h-2 gradient-hero" />
            <CardContent className="p-8 text-center">
              <Phone className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Kontaktieren Sie uns</h3>
              <p className="text-muted-foreground mb-6">
                Haben Sie Fragen? Wir sind gerne für Sie da.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button variant="outline" className="h-12 px-6">
                    <Phone className="mr-2 h-4 w-4" />
                    Kontakt aufnehmen
                  </Button>
                </Link>
                <Link to="/faq">
                  <Button variant="outline" className="h-12 px-6">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    FAQ lesen
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* CTA */}
      <CTASection
        title="Bereit für Ihren Umzug?"
        description="Erhalten Sie jetzt kostenlose Offerten von geprüften Umzugsfirmen"
        buttonText="Jetzt Offerten erhalten"
        buttonLink="/umzugsofferten"
      />
    </div>
  );
}
