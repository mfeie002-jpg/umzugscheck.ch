import { motion } from "framer-motion";
import { Truck, Sparkles, Trash2, Package, Sofa, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { InteractiveCard, RevealOnScroll, AnimatedArrow } from "@/components/common";

const services = [
  {
    icon: Truck,
    title: "Privatumzug",
    description: "Stressfreier Umzug für Ihr Zuhause mit Full-Service Option.",
    href: "/privatumzug",
    color: "bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20",
    popular: true,
  },
  {
    icon: Building2,
    title: "Firmenumzug",
    description: "Professionelle Büroumzüge mit minimaler Ausfallzeit.",
    href: "/firmenumzug",
    color: "bg-purple-500/10 text-purple-600 group-hover:bg-purple-500/20",
    popular: false,
  },
  {
    icon: Sparkles,
    title: "Reinigung",
    description: "Gründliche End- und Umzugsreinigung für die Wohnungsabgabe.",
    href: "/reinigung",
    color: "bg-cyan-500/10 text-cyan-600 group-hover:bg-cyan-500/20",
    popular: true,
  },
  {
    icon: Trash2,
    title: "Entsorgung",
    description: "Fachgerechte Entsorgung und Räumung von Hausrat.",
    href: "/entsorgung",
    color: "bg-orange-500/10 text-orange-600 group-hover:bg-orange-500/20",
    popular: false,
  },
  {
    icon: Sofa,
    title: "Möbelmontage",
    description: "Auf- und Abbau Ihrer Möbel durch erfahrene Monteure.",
    href: "/moebelmontage",
    color: "bg-green-500/10 text-green-600 group-hover:bg-green-500/20",
    popular: false,
  },
  {
    icon: Package,
    title: "Einlagerung",
    description: "Sichere Lagerung für kurz- oder langfristige Bedürfnisse.",
    href: "/lagerung",
    color: "bg-amber-500/10 text-amber-600 group-hover:bg-amber-500/20",
    popular: false,
  },
];

export const ServicesSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <RevealOnScroll direction="up" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Alle Services aus einer Hand
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Von der Planung bis zur Schlüsselübergabe – wir finden die passenden Partner für jeden Bedarf.
          </p>
        </RevealOnScroll>

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
              <Link to={service.href} className="group block h-full">
                <InteractiveCard className="h-full p-6 relative overflow-hidden">
                  {/* Popular Badge */}
                  {service.popular && (
                    <motion.span 
                      className="absolute top-4 right-4 text-xs font-medium bg-secondary/10 text-secondary px-2 py-1 rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      Beliebt
                    </motion.span>
                  )}
                  
                  {/* Icon with Hover Effect */}
                  <motion.div 
                    className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-4 transition-colors`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <service.icon className="w-7 h-7" />
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-secondary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>
                  
                  {/* Link with Animated Arrow */}
                  <span className="inline-flex items-center text-sm font-medium text-secondary">
                    Mehr erfahren
                    <AnimatedArrow direction="right" size={16} className="ml-1" />
                  </span>
                  
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </InteractiveCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
