import { memo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, hsl(var(--primary)) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, hsl(var(--secondary)) 0%, transparent 50%)`
        }} />
      </motion.div>
      
      <div className="container relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
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
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <Link 
                to={service.href} 
                className="group block h-full bg-card rounded-2xl border border-border shadow-soft overflow-hidden hover:shadow-premium hover:border-primary/30 transition-all duration-300"
              >
                <motion.div 
                  className={cn("h-2", `bg-gradient-to-r ${service.color}`)}
                  whileHover={{ scaleX: 1.02 }}
                />
                <div className="p-6">
                  {/* Icon */}
                  <motion.div 
                    className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", `bg-gradient-to-br ${service.color}`)}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <service.icon className={cn("w-6 h-6", service.iconColor)} />
                  </motion.div>

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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
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
