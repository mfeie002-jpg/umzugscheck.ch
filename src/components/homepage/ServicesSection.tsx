import { motion } from "framer-motion";
import { Truck, Sparkles, Trash2, Package, Sofa, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Truck,
    title: "Privatumzug",
    description: "Stressfreier Umzug für Ihr Zuhause mit Full-Service Option.",
    href: "/privatumzug",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Building2,
    title: "Firmenumzug",
    description: "Professionelle Büroumzüge mit minimaler Ausfallzeit.",
    href: "/firmenumzug",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: Sparkles,
    title: "Reinigung",
    description: "Gründliche End- und Umzugsreinigung für die Wohnungsabgabe.",
    href: "/reinigung",
    color: "bg-cyan-500/10 text-cyan-600",
  },
  {
    icon: Trash2,
    title: "Entsorgung",
    description: "Fachgerechte Entsorgung und Räumung von Hausrat.",
    href: "/entsorgung",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    icon: Sofa,
    title: "Möbelmontage",
    description: "Auf- und Abbau Ihrer Möbel durch erfahrene Monteure.",
    href: "/moebelmontage",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: Package,
    title: "Einlagerung",
    description: "Sichere Lagerung für kurz- oder langfristige Bedürfnisse.",
    href: "/lagerung",
    color: "bg-amber-500/10 text-amber-600",
  },
];

export const ServicesSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Alle Services aus einer Hand
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Von der Planung bis zur Schlüsselübergabe – wir finden die passenden Partner für jeden Bedarf.
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Link
                to={service.href}
                className="group block bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-4`}>
                  <service.icon className="w-7 h-7" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold mb-2 group-hover:text-secondary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {service.description}
                </p>
                
                {/* Link */}
                <span className="inline-flex items-center text-sm font-medium text-secondary">
                  Mehr erfahren
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
