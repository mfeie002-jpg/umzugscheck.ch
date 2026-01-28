import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Building2, Globe, Package, Warehouse, Trash2, Wrench, HeartHandshake, Crown, ArrowRight, User, Users, CheckCircle, Truck, Music, Sparkles } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import WhyChooseUs from "@/components/WhyChooseUs";
import FAQSection from "@/components/FAQSection";
import CTABanner from "@/components/CTABanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SectionBadge from "@/components/SectionBadge";
import FeatureIcon from "@/components/FeatureIcon";
import OptimizedImage from "@/components/OptimizedImage";
import ScrollProgress from "@/components/ScrollProgress";
// Branded images
import singleImage from "@/assets/service-single-branded.jpg";
import familyImage from "@/assets/service-family-branded.jpg";
import officeImage from "@/assets/service-office-new.jpg";
import internationalImage from "@/assets/service-international-branded.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Services = () => {
  const services = [
    { icon: Home, title: "Privatumzüge", description: "Ob Wohnung, Haus oder Villa – Ihr Zuhause ist in sicheren Händen.", image: familyImage, link: "/plan/private", features: ["Komplettservice", "Möbelmontage", "Reinigung", "Entsorgung"] },
    { icon: Building2, title: "Büroumzüge", description: "Minimale Ausfallzeit, maximale Effizienz für Geschäftsumzüge.", image: officeImage, link: "/plan/office", features: ["Wochenendumzüge", "IT-Equipment", "Archivierung", "Planung"] },
    { icon: Globe, title: "Internationale Umzüge", description: "Grenzenlos zuverlässig. Weltweite Expertise für Ihren Neustart.", image: internationalImage, link: "/plan/international", features: ["Zollabwicklung", "Versicherung", "Lagerung", "Beratung"] },
    { icon: Package, title: "Verpackungsservice", description: "Professionelle Verpackung mit hochwertigen Materialien.", link: "/plan/packing", features: ["Verpackungsmaterial", "Kunstwerke", "Fragile Güter", "Beschriftung"] },
    { icon: Warehouse, title: "Lagerung", description: "Sichere, klimatisierte Lagerräume für kurz- und langfristige Aufbewahrung.", link: "/plan/storage", features: ["Klimatisiert", "24/7 Überwachung", "Flexibel", "Versichert"] },
    { icon: Trash2, title: "Entsorgung", description: "Umweltgerechte Entsorgung und Recycling von Möbeln und Hausrat.", link: "/plan/disposal", features: ["Recycling", "Spenden", "Abholdienst", "Umweltfreundlich"] },
    { icon: Wrench, title: "Möbelmontage", description: "Fachgerechter Auf- und Abbau Ihrer Möbel durch erfahrene Handwerker.", link: "/plan/assembly", features: ["Küchen", "Schränke", "Betten", "Spezialanfertigungen"] },
    { icon: HeartHandshake, title: "Seniorenumzüge", description: "Einfühlsamer Service für den Umzug ins Altersheim.", link: "/plan/senior", features: ["Persönliche Betreuung", "Koordination", "Geduld", "Verständnis"] },
    { icon: Crown, title: "VIP-Service", description: "Premium-Service für höchste Ansprüche. Diskret, luxuriös und exklusiv.", link: "/plan/vip", features: ["24/7 Service", "Persönlicher Manager", "White-glove", "Absolute Diskretion"] },
    { icon: Music, title: "Klaviertransport", description: "Spezialtransport für Klaviere und Flügel mit Fachexpertise.", link: "/plan/piano", features: ["Spezialausrüstung", "Versichert", "Fachpersonal", "Klimatisiert"] },
    { icon: Sparkles, title: "Reinigung", description: "Professionelle Reinigung der alten und neuen Wohnung.", link: "/plan/cleaning", features: ["Grundreinigung", "Fenster", "Küche", "Bad"] },
  ];

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Umzugsleistungen",
    "itemListElement": services.map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": service.title,
        "description": service.description,
        "provider": { "@type": "MovingCompany", "name": "Feierabend Umzüge" }
      }
    }))
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Umzugsleistungen & Services - Privatumzüge, Büroumzüge & mehr"
        description="Entdecken Sie unsere Umzugsleistungen: Privatumzüge, Büroumzüge, internationale Umzüge, Verpackung, Lagerung, VIP-Service und mehr. Massgeschneiderte Lösungen."
        canonical="/services"
        structuredData={servicesSchema}
      />
      <ScrollProgress />
      <Header />
      
      {/* Hero */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 bg-gradient-subtle relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <SectionBadge>Umzugsleistungen</SectionBadge>
            <h1 className="text-balance mt-4">Unsere Leistungen</h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground px-4">
              Massgeschneiderte Umzugslösungen für jeden Bedarf. Von der Planung bis zur Ausführung – 
              wir sind Ihr Partner für einen stressfreien Umzug.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Quote Navigation - With Images */}
      <section className="py-8 sm:py-12 -mt-6 sm:-mt-10 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { type: "single", image: singleImage, title: "Offerte für Einzelperson", desc: "Perfekt für Single-Haushalte und kleine Wohnungen" },
              { type: "family", image: familyImage, title: "Familien-Offerte buchen", desc: "Ideal für Familien und grössere Haushalte", popular: true },
              { type: "office", image: officeImage, title: "Büroumzug anfragen", desc: "Professionelle Lösungen für Geschäftskunden" },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link to={`/contact?type=${item.type}`} className="group block h-full">
                  <Card className={`overflow-hidden cursor-pointer h-full transition-all duration-300 ${
                    item.popular 
                      ? 'border-2 border-alpine shadow-md hover:shadow-glow' 
                      : 'border-2 border-border hover:border-alpine hover:shadow-medium'
                  }`}>
                    {item.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-warm text-warm-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg z-10">
                        BELIEBT
                      </div>
                    )}
                    {/* Image Section */}
                    <div className="relative h-32 sm:h-40 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      {/* Feierabend Logo Overlay */}
                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                          <Truck className="w-3 h-3 text-alpine" />
                        </div>
                        <span className="text-white text-xs font-semibold drop-shadow-lg">Feierabend Umzüge</span>
                      </div>
                    </div>
                    {/* Content Section */}
                    <div className="p-4 sm:p-5">
                      <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-foreground group-hover:text-alpine transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{item.desc}</p>
                      <div className="flex items-center text-alpine text-xs sm:text-sm font-medium">
                        Jetzt anfragen <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-display mb-3 sm:mb-4">Unsere Umzugspakete</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Wählen Sie das passende Paket für Ihre Bedürfnisse</p>
          </AnimatedSection>
          
          <motion.div 
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { name: "Basis-Paket", desc: "Kostengünstig, Sie packen selbst", link: "/plan/basic" },
              { name: "Halb-Paket", desc: "Basis + professionelle Verpackung", link: "/plan/half", popular: true },
              { name: "Voll-Paket", desc: "Rundum-Sorglos: Alles inklusive", link: "/plan/full" },
            ].map((pkg, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link to={pkg.link}>
                  <Card className={`p-8 cursor-pointer h-full transition-all duration-300 group ${
                    pkg.popular ? 'border-2 border-alpine shadow-glow' : 'hover:shadow-medium hover:border-alpine'
                  }`}>
                    {pkg.popular && <div className="text-xs font-semibold text-alpine mb-2">BELIEBT</div>}
                    <h3 className="text-2xl font-semibold font-display mb-3 group-hover:text-alpine transition-colors">{pkg.name}</h3>
                    <p className="text-muted-foreground mb-4">{pkg.desc}</p>
                    <div className="flex items-center text-primary font-medium">
                      Mehr erfahren <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <AnimatedSection className="text-center mb-12">
            <h3 className="text-2xl font-bold font-display mb-4">Spezial-Pakete</h3>
          </AnimatedSection>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { name: "Studenten-Paket", desc: "Bis zu 20% Rabatt für Studierende", link: "/plan/student" },
              { name: "Frauen-Service", desc: "Reines Frauenteam auf Wunsch", link: "/plan/ladies" },
            ].map((pkg, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link to={pkg.link}>
                  <Card className="p-6 cursor-pointer hover:shadow-medium hover:border-alpine transition-all duration-300 group">
                    <h3 className="text-xl font-semibold font-display mb-2 group-hover:text-alpine transition-colors">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground">{pkg.desc}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl font-bold font-display mb-3 sm:mb-4">Zusatzleistungen</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">Erweitern Sie Ihr Paket nach Bedarf</p>
            <Link to="/plan/compare" className="inline-block mb-6 sm:mb-8">
              <Button variant="outline" size="lg" className="group h-12 sm:h-11 min-h-[44px] touch-manipulation">
                Alle Pakete vergleichen
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </AnimatedSection>
          
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link to={service.link}>
                  <Card className="p-4 sm:p-6 lg:p-8 cursor-pointer h-full group hover:shadow-medium hover:border-alpine active:scale-[0.98] transition-all duration-300 touch-manipulation">
                    <FeatureIcon icon={service.icon} size="lg" className="mb-4 sm:mb-6" />
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold font-display mb-2 sm:mb-3 group-hover:text-alpine transition-colors">{service.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 line-clamp-2">{service.description}</p>
                    <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-xs sm:text-sm text-muted-foreground">
                          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-alpine mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                      {service.features.length > 3 && (
                        <div className="text-xs text-muted-foreground/70 pl-5 sm:pl-6">
                          +{service.features.length - 3} weitere
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-primary text-sm sm:text-base font-medium">
                      Mehr erfahren
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center space-y-6 mb-12">
            <h2 className="text-balance font-display">Warum Feierabend Umzüge?</h2>
            <p className="text-xl text-muted-foreground">
              Wir bieten mehr als nur Transport – wir bieten Sicherheit, Professionalität und Herzlichkeit.
            </p>
          </AnimatedSection>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { value: "100%", label: "Kundenzufriedenheit" },
              { value: "40+", label: "Jahre Erfahrung" },
              { value: "5000+", label: "Erfolgreiche Umzüge" },
              { value: "30+", label: "Erfahrene Mitarbeiter" },
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-6 text-center hover:shadow-medium transition-shadow">
                  <div className="text-4xl font-bold text-alpine mb-2 font-display">{stat.value}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection showViewAll={true} />

      {/* CTA Banner */}
      <CTABanner
        title="Bereit für Ihr Umzugsprojekt?"
        subtitle="Kontaktieren Sie uns für eine kostenlose Beratung und ein massgeschneidertes Angebot."
        primaryCta={{ text: "Jetzt Offerte anfragen", href: "/contact" }}
      />

      <Footer />
    </div>
  );
};

export default Services;
