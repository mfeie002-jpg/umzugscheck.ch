import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BlurReveal } from "@/components/common/BlurReveal";
import { NumberTicker } from "@/components/ui/animated-counter";
import { GradientBorder } from "@/components/common/GradientBorder";
import { isScreenshotRenderMode } from "@/lib/screenshot-render-mode";

// Service images
import servicePrivatumzug from "@/assets/service-privatumzug.jpg";
import serviceFirmenumzug from "@/assets/service-firmenumzug-new.jpg";
import serviceReinigung from "@/assets/service-reinigung-new.jpg";
import serviceEntsorgung from "@/assets/service-entsorgung-new.jpg";
import serviceLagerung from "@/assets/service-lagerung.jpg";
import serviceUmzug from "@/assets/service-umzug.jpg";
import serviceMontage from "@/assets/service-montage.jpg";
import serviceInternational from "@/assets/service-international.jpg";

const services = [
  {
    title: "Privatumzug",
    description: "Kompletter Umzugsservice für Ihren Wohnungswechsel – vom Einpacken bis zum Aufbau.",
    link: "/privatumzug",
    image: servicePrivatumzug,
    badge: "Beliebt",
    badgeColor: "bg-green-500"
  },
  {
    title: "Firmenumzug",
    description: "Professionelle Büroumzüge mit minimaler Betriebsunterbrechung für KMUs und Grossfirmen.",
    link: "/firmenumzug",
    image: serviceFirmenumzug,
    badge: null,
    badgeColor: ""
  },
  {
    title: "Endreinigung",
    description: "Professionelle Wohnungsreinigung mit Abnahmegarantie für eine reibungslose Übergabe.",
    link: "/reinigung",
    image: serviceReinigung,
    badge: "Top-Service",
    badgeColor: "bg-primary"
  },
  {
    title: "Entsorgung & Räumung",
    description: "Fachgerechte Entsorgung von Möbeln, Elektrogeräten und Hausrat.",
    link: "/entsorgung",
    image: serviceEntsorgung,
    badge: null,
    badgeColor: ""
  },
  {
    title: "Möbellagerung",
    description: "Sichere und flexible Lagerboxen für kurz- oder langfristige Einlagerung.",
    link: "/lagerung",
    image: serviceLagerung,
    badge: null,
    badgeColor: ""
  },
  {
    title: "Spezialtransporte",
    description: "Sicherer Transport von Klavieren, Tresoren, Kunst und sensiblen Gütern.",
    link: "/spezialtransporte",
    image: serviceUmzug,
    badge: null,
    badgeColor: ""
  },
  {
    title: "Möbelmontage",
    description: "Professioneller Auf- und Abbau Ihrer Möbel durch erfahrene Handwerker.",
    link: "/montage",
    image: serviceMontage,
    badge: null,
    badgeColor: ""
  },
  {
    title: "Internationale Umzüge",
    description: "Weltweite Umzugsservices mit Zollabwicklung und internationaler Logistik.",
    link: "/internationale-umzuege",
    image: serviceInternational,
    badge: "Neu",
    badgeColor: "bg-secondary"
  }
];

export const PremiumServicesGrid = () => {
  const screenshotMode = isScreenshotRenderMode();

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-background relative overflow-hidden" aria-labelledby="services-heading">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Section Header with BlurReveal */}
        <BlurReveal className="text-center mb-8 md:mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-full text-secondary font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3">
            <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            Unsere Services
          </span>
          <h2 id="services-heading" className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Alle Services für Ihren Umzug
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            Von Endreinigung bis Spezialtransport – alles aus einer Hand.
          </p>
        </BlurReveal>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {services.map((service, idx) => (
            screenshotMode ? (
              <div key={idx} className="group">
                <Link
                  to={service.link}
                  className="relative block h-full bg-card rounded-xl overflow-hidden shadow-soft border border-border/50 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-24 xs:h-28 sm:h-32 md:h-36 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="eager"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Badge */}
                    {service.badge && (
                      <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold text-white ${service.badgeColor}`}>
                        {service.badge}
                      </span>
                    )}

                    {/* Title on Image */}
                    <h3 className="absolute bottom-2 left-3 right-3 text-sm sm:text-base font-bold text-white drop-shadow-lg">
                      {service.title}
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                      {service.description}
                    </p>

                    {/* Link */}
                    <span className="inline-flex items-center text-xs sm:text-sm font-medium text-primary transition-colors">
                      Mehr erfahren
                      <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <Link
                  to={service.link}
                  className="relative block h-full bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-medium border border-border/50 hover:border-primary/30 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-24 xs:h-28 sm:h-32 md:h-36 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Badge */}
                    {service.badge && (
                      <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold text-white ${service.badgeColor}`}>
                        {service.badge}
                      </span>
                    )}

                    {/* Title on Image */}
                    <h3 className="absolute bottom-2 left-3 right-3 text-sm sm:text-base font-bold text-white drop-shadow-lg">
                      {service.title}
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                      {service.description}
                    </p>

                    {/* Link */}
                    <span className="inline-flex items-center text-xs sm:text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
                      Mehr erfahren
                      <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          ))}
        </div>

        {/* Stats Row with NumberTicker */}
        <BlurReveal className="mt-10 flex flex-wrap justify-center gap-6 md:gap-12" delay={0.2}>
          {[
            { value: 8, label: "Service-Kategorien", suffix: "+" },
            { value: 200, label: "Partner-Firmen", suffix: "+" },
            { value: 26, label: "Kantone abgedeckt", suffix: "" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-xl md:text-2xl font-bold text-primary">
                <NumberTicker value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </BlurReveal>

        {/* CTA */}
        {screenshotMode ? (
          <div className="text-center mt-8">
            <Link to="/dienstleistungen">
              <Button variant="secondary" size="lg" className="h-10 sm:h-11 px-4 sm:px-6 text-sm font-semibold group">
                Alle Services ansehen
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-center mt-8"
          >
            <Link to="/dienstleistungen">
              <Button variant="secondary" size="lg" className="h-10 sm:h-11 px-4 sm:px-6 text-sm font-semibold group">
                Alle Services ansehen
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};
