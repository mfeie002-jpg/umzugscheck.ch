import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "Privatumzug",
    description: "Komplettservice für Ihren privaten Umzug",
    link: "/dienstleistungen/privatumzug",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
  },
  {
    title: "Firmenumzug",
    description: "Professionelle Büro- und Geschäftsumzüge",
    link: "/dienstleistungen/firmenumzug",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop",
  },
  {
    title: "Premium-Reinigung",
    description: "End- und Umzugsreinigung nach höchstem Standard",
    link: "/dienstleistungen/reinigung",
    image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&h=400&fit=crop",
  },
  {
    title: "Lagerung",
    description: "Sichere Möbellagerung, kurz- oder langfristig",
    link: "/dienstleistungen/lagerung",
    image: "https://images.unsplash.com/photo-1565514158740-64d5a9d97091?w=600&h=400&fit=crop",
  },
  {
    title: "Spezialtransporte",
    description: "Klavier, Safe, Kunst – mit höchster Sorgfalt",
    link: "/dienstleistungen/spezialtransport",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=400&fit=crop",
  },
  {
    title: "Räumung / Entsorgung",
    description: "Entrümpelung und fachgerechte Entsorgung",
    link: "/dienstleistungen/entsorgung",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop",
  },
];

export const PremiumServices = () => {
  return (
    <section className="section-spacing bg-muted">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-premium-h2 lg:text-premium-h2-lg text-swiss-noir mb-4">
            Premium Services
          </h2>
          <p className="text-premium-body text-platinum max-w-2xl mx-auto">
            Alles aus einer Hand – mit Schweizer Qualität
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Link to={service.link} className="group block">
                <div className="bg-white rounded-3xl overflow-hidden shadow-premium hover-lift border border-border">
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-premium-h3 text-swiss-noir mb-3">
                      {service.title}
                    </h3>
                    <p className="text-premium-small text-platinum mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center text-copper font-semibold group-hover:gap-3 transition-all">
                      Mehr erfahren
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden overflow-x-auto pb-6 -mx-6">
          <div className="flex gap-6 px-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="min-w-[320px]"
              >
                <Link to={service.link}>
                  <div className="bg-white rounded-3xl overflow-hidden shadow-premium border border-border">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-swiss-noir mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-platinum">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};