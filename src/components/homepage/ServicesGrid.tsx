import { memo } from "react";
import { motion } from "framer-motion";
import { Truck, Building2, Sparkles, Trash2, Package, Sofa, ArrowRight, Star, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Truck,
    title: "Privatumzug",
    description: "Stressfreier Umzug für Ihr Zuhause mit Full-Service Option.",
    href: "/privatumzug",
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-600",
    bullets: ["Professionelle Verpackung", "Transport & Möbelschutz", "Auf-/Abbau Service"],
  },
  {
    icon: Building2,
    title: "Firmenumzug",
    description: "Professionelle Büroumzüge mit minimaler Ausfallzeit.",
    href: "/firmenumzug",
    color: "from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-600",
    bullets: ["Wochenend-Umzüge", "IT-Equipment Transport", "Projektplanung"],
  },
  {
    icon: Sparkles,
    title: "Reinigung",
    description: "Gründliche End- und Umzugsreinigung mit Abnahmegarantie.",
    href: "/reinigung",
    color: "from-cyan-500/20 to-cyan-600/10",
    iconColor: "text-cyan-600",
    bullets: ["Abnahmegarantie", "Küche & Bad inkl.", "Fenster & Böden"],
  },
  {
    icon: Trash2,
    title: "Entsorgung & Räumung",
    description: "Fachgerechte Entsorgung und Räumung von Hausrat.",
    href: "/entsorgung",
    color: "from-orange-500/20 to-orange-600/10",
    iconColor: "text-orange-600",
    bullets: ["Haushaltsauflösung", "Sperrmüll", "Recycling"],
  },
  {
    icon: Package,
    title: "Einlagerung",
    description: "Sichere Lagerung für kurz- oder langfristige Bedürfnisse.",
    href: "/lagerung",
    color: "from-amber-500/20 to-amber-600/10",
    iconColor: "text-amber-600",
    bullets: ["Klimatisiert", "Versichert", "Flexible Laufzeit"],
  },
  {
    icon: Sofa,
    title: "Möbelmontage",
    description: "Professioneller Auf- und Abbau Ihrer Möbel.",
    href: "/moebelmontage",
    color: "from-green-500/20 to-green-600/10",
    iconColor: "text-green-600",
    bullets: ["Küchenmontage", "Schränke & Betten", "Demontage"],
  },
];

export const ServicesGrid = memo(function ServicesGrid() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <Star className="w-4 h-4" />
            Unsere Services
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Alle Services aus{" "}
            <span className="text-secondary">einer Hand</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Von der Planung bis zur Schlüsselübergabe – wir finden die passenden Partner für jeden Bedarf.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link 
                to={service.href} 
                className="group block h-full bg-card rounded-2xl border border-border shadow-soft overflow-hidden hover:shadow-premium hover:border-primary/30 transition-all duration-300"
              >
                <div className={cn("h-2", `bg-gradient-to-r ${service.color}`)} />
                <div className="p-6">
                  {/* Icon */}
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", `bg-gradient-to-br ${service.color}`)}>
                    <service.icon className={cn("w-6 h-6", service.iconColor)} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>

                  {/* Bullets */}
                  <ul className="space-y-1.5 mb-4">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <span className="inline-flex items-center text-sm font-medium text-primary group-hover:underline">
                    Mehr erfahren
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust Bar */}
        <motion.div 
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Alle Partner geprüft & versichert</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-swiss-gold fill-swiss-gold" />
            <span>Durchschnittlich 4.8/5 Sterne</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
