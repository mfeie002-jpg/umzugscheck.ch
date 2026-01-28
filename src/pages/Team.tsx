import { Link } from "react-router-dom";
import { Mail, Phone, Award, Heart, Users, ArrowRight, Quote, Briefcase, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FamilyBadge from "@/components/FamilyBadge";
import TeamMember from "@/components/TeamMember";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedCounter from "@/components/AnimatedCounter";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import teamFounderMale from "@/assets/team-founder-male.jpg";
import teamFounderFemale from "@/assets/team-founder-female.jpg";
import teamCoordinator from "@/assets/team-coordinator.jpg";
import teamPlanning from "@/assets/team-planning.jpg";
import teamLeader from "@/assets/team-leader-new.jpg";
import teamService from "@/assets/team-service-new.jpg";

const Team = () => {
  const founders = [
    {
      name: "Peter Feierabend",
      role: "Geschäftsführer",
      image: teamFounderMale,
      bio: "Leitet das Unternehmen in zweiter Generation seit über 20 Jahren. Sein Fokus liegt auf höchster Qualität und persönlicher Kundenbetreuung. Unter seiner Führung wurde Feierabend Umzüge zur führenden Umzugsfirma der Region.",
      email: "peter@feierabend-umzuege.ch",
      phone: "+41 76 568 13 02",
      generation: "2. Generation",
      quote: "Jeder Umzug ist für uns eine Herzensangelegenheit – das haben wir von meinem Vater gelernt.",
    },
    {
      name: "Sarah Feierabend",
      role: "Geschäftsleitung & Logistik",
      image: teamFounderFemale,
      bio: "Verantwortlich für die perfekte Planung und Koordination aller Umzüge. Ihre Präzision und ihr Organisationstalent sind legendär. Sie sorgt dafür, dass jedes Detail stimmt.",
      email: "sarah@feierabend-umzuege.ch",
      phone: "+41 76 568 13 02",
      generation: "3. Generation",
      quote: "Organisation ist alles – und ein Lächeln für unsere Kunden.",
    },
  ];

  const teamMembers = [
    {
      name: "Michael Weber",
      role: "Teamleiter Umzüge",
      image: teamLeader,
      bio: "Experte für anspruchsvolle Umzüge mit 12 Jahren Erfahrung. Ob Klaviere, Antiquitäten oder schwere Möbel – er findet immer eine Lösung und leitet unser Hauptteam.",
      email: "michael@feierabend-umzuege.ch",
      phone: "+41 76 568 13 02",
    },
    {
      name: "Anna Meier",
      role: "Kundenbetreuung",
      image: teamService,
      bio: "Erste Anlaufstelle für alle Kundenanfragen. Mit ihrer freundlichen Art und 8 Jahren Erfahrung sorgt sie für rundum zufriedene Kunden.",
      email: "anna@feierabend-umzuege.ch",
      phone: "+41 76 568 13 02",
    },
    {
      name: "Thomas Keller",
      role: "Projektkoordinator",
      image: teamCoordinator,
      bio: "Koordiniert unsere Flotte und sorgt für optimale Routenplanung. 15 Jahre Erfahrung in der Logistikbranche machen ihn zum unverzichtbaren Experten.",
      email: "thomas@feierabend-umzuege.ch",
      phone: "+41 76 568 13 02",
    },
    {
      name: "Lisa Brunner",
      role: "Disposition & Planung",
      image: teamPlanning,
      bio: "Plant komplexe Grossprojekte und behält auch bei anspruchsvollen Firmenumzügen den Überblick. Ihre Detailgenauigkeit ist legendär.",
      email: "lisa@feierabend-umzuege.ch",
      phone: "+41 76 568 13 02",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Herz",
      description: "Wir behandeln Ihre Sachen, als wären es unsere eigenen."
    },
    {
      icon: Award,
      title: "Qualität",
      description: "Schweizer Präzision in jedem Detail."
    },
    {
      icon: Users,
      title: "Familie",
      description: "Persönlich, verlässlich, generationenübergreifend."
    },
    {
      icon: Truck,
      title: "Zuverlässigkeit",
      description: "Pünktlich, sorgfältig und immer für Sie da."
    },
  ];

  const departments = [
    { icon: Truck, name: "Umzugsteam", count: "18 Mitarbeiter" },
    { icon: Briefcase, name: "Administration", count: "5 Mitarbeiter" },
    { icon: Users, name: "Kundenservice", count: "4 Mitarbeiter" },
    { icon: Award, name: "Spezialisten", count: "6 Mitarbeiter" },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Unser Team - Familie Feierabend und Experten"
        description="Lernen Sie das Team von Feierabend Umzüge kennen. Drei Generationen Erfahrung, über 30 Fachkräfte und echte Schweizer Qualität."
        canonical="/team"
      />
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: 'https://feierabend-umzuege.ch/' },
          { name: 'Team', url: 'https://feierabend-umzuege.ch/team' }
        ]}
      />
      <Header />
      
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-gradient-subtle relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30"></div>
        <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <FamilyBadge variant="compact" className="inline-flex" />
            <h1 className="text-balance font-display">
              Die Menschen hinter <span className="text-gradient">Feierabend Umzüge</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Lernen Sie die Familie und das Team kennen, die Ihren Umzug zu einem Erfolg machen. 
              Drei Generationen Erfahrung, Leidenschaft und Schweizer Präzision.
            </p>
          </div>
        </AnimatedSection>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12 lg:mb-16 space-y-4">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-warm bg-warm/10 rounded-full">
              Die Gründerfamilie
            </span>
            <h2 className="text-balance font-display">Familie Feierabend</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seit 1980 führen wir dieses Unternehmen mit Herzblut und dem Anspruch, jeden Umzug perfekt zu gestalten.
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {founders.map((founder, index) => (
              <AnimatedSection key={index} delay={index * 0.15}>
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                  <Card className="overflow-hidden h-full shadow-elegant">
                    <div className="grid md:grid-cols-5 h-full">
                      <div className="md:col-span-2 relative">
                        <div className="aspect-square md:aspect-auto md:h-full overflow-hidden">
                          <img
                            src={founder.image}
                            alt={founder.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gradient-warm text-warm-foreground rounded-full shadow-warm">
                            {founder.generation}
                          </span>
                        </div>
                      </div>
                      <div className="md:col-span-3 p-6 lg:p-8 flex flex-col">
                        <div className="mb-4">
                          <h3 className="text-2xl font-bold text-foreground font-display">{founder.name}</h3>
                          <p className="text-alpine font-semibold">{founder.role}</p>
                        </div>
                        <p className="text-muted-foreground mb-4 leading-relaxed">{founder.bio}</p>
                        
                        <div className="relative bg-muted/50 rounded-lg p-4 mb-4">
                          <Quote className="absolute top-2 left-2 h-5 w-5 text-warm/30" />
                          <p className="text-sm italic text-foreground pl-5">"{founder.quote}"</p>
                        </div>

                        <div className="mt-auto pt-4 border-t border-border space-y-2">
                          <a href={`mailto:${founder.email}`} className="flex items-center text-sm hover:text-alpine transition-colors group">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-alpine transition-colors" />
                            {founder.email}
                          </a>
                          <a href={`tel:${founder.phone}`} className="flex items-center text-sm hover:text-alpine transition-colors group">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-alpine transition-colors" />
                            {founder.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gradient-premium text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-balance font-display mb-4">Was uns verbindet</h2>
            <p className="text-lg opacity-80 max-w-xl mx-auto">
              Unsere Werte sind das Fundament unserer Arbeit
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-display">{value.title}</h3>
                  <p className="opacity-80 text-sm">{value.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12 lg:mb-16 space-y-4">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full">
              Unser Team
            </span>
            <h2 className="text-balance font-display">Die Experten an Ihrer Seite</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Über 30 erfahrene Fachkräfte stehen für Sie bereit – jeder ein Spezialist auf seinem Gebiet.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {teamMembers.map((member, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <TeamMember {...member} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.5} className="mt-12">
            <Card className="p-8 flex flex-col lg:flex-row items-center justify-between gap-6 bg-muted/50 border-dashed border-2 border-border hover:border-alpine/50 transition-colors max-w-4xl mx-auto">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="w-16 h-16 rounded-full bg-alpine/10 flex items-center justify-center"
                >
                  <Users className="h-8 w-8 text-alpine" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold font-display">Werden Sie Teil des Teams</h3>
                  <p className="text-muted-foreground">
                    Wir suchen motivierte Mitarbeiter für unser wachsendes Team.
                  </p>
                </div>
              </div>
              <Link to="/contact">
                <Button variant="default" size="lg">
                  Jetzt bewerben
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12 space-y-4">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-warm bg-warm/10 rounded-full">
              Unsere Abteilungen
            </span>
            <h2 className="text-3xl font-bold font-display">Unser Unternehmen</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            {departments.map((dept, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="p-6 text-center hover-lift">
                  <dept.icon className="h-8 w-8 text-alpine mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground">{dept.count}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {[
              { end: 33, suffix: "+", label: "Teammitglieder" },
              { end: 200, suffix: "+", label: "Jahre Erfahrung", sublabel: "Gesamt" },
              { end: 15, suffix: "", label: "Sprachen" },
              { end: 100, suffix: "%", label: "Einsatz" },
            ].map((stat, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="p-6 text-center hover-lift">
                  <AnimatedCounter 
                    end={stat.end} 
                    suffix={stat.suffix} 
                    label={stat.label} 
                    sublabel={stat.sublabel}
                  />
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gradient-hero text-primary-foreground">
        <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-display">Lernen Sie uns persönlich kennen</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Vereinbaren Sie einen unverbindlichen Beratungstermin und lernen Sie 
            Ihr Umzugsteam kennen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" variant="secondary" className="min-h-[52px]">
                  Termin vereinbaren
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <a href="tel:+41765681302">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary min-h-[52px]">
                  <Phone className="mr-2 h-5 w-5" />
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

export default Team;