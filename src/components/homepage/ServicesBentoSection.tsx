import { memo } from "react";
import { motion } from "framer-motion";
import { Truck, Sparkles, Trash2, Package, Sofa, Building2, ArrowRight, Star, Clock, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { RevealOnScroll, AnimatedArrow, LiveDot, BadgeWithIcon } from "@/components/common";

const services = [
  {
    icon: Truck,
    title: "Privatumzug",
    description: "Stressfreier Umzug für Ihr Zuhause mit Full-Service Option. Professionelle Teams, faire Preise.",
    href: "/privatumzug",
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-600",
    popular: true,
    stats: { rating: 4.9, reviews: 2340 },
    size: "large" as const
  },
  {
    icon: Building2,
    title: "Firmenumzug",
    description: "Professionelle Büroumzüge mit minimaler Ausfallzeit.",
    href: "/firmenumzug",
    color: "from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-600",
    popular: false,
    stats: { rating: 4.8, reviews: 890 },
    size: "medium" as const
  },
  {
    icon: Sparkles,
    title: "Reinigung",
    description: "Gründliche End- und Umzugsreinigung für die Wohnungsabgabe.",
    href: "/reinigung",
    color: "from-cyan-500/20 to-cyan-600/10",
    iconColor: "text-cyan-600",
    popular: true,
    stats: { rating: 4.9, reviews: 1560 },
    size: "medium" as const
  },
  {
    icon: Trash2,
    title: "Entsorgung",
    description: "Fachgerechte Entsorgung und Räumung von Hausrat.",
    href: "/entsorgung",
    color: "from-orange-500/20 to-orange-600/10",
    iconColor: "text-orange-600",
    popular: false,
    stats: { rating: 4.7, reviews: 720 },
    size: "small" as const
  },
  {
    icon: Sofa,
    title: "Möbelmontage",
    description: "Auf- und Abbau Ihrer Möbel durch erfahrene Monteure.",
    href: "/moebelmontage",
    color: "from-green-500/20 to-green-600/10",
    iconColor: "text-green-600",
    popular: false,
    stats: { rating: 4.8, reviews: 450 },
    size: "small" as const
  },
  {
    icon: Package,
    title: "Einlagerung",
    description: "Sichere Lagerung für kurz- oder langfristige Bedürfnisse.",
    href: "/lagerung",
    color: "from-amber-500/20 to-amber-600/10",
    iconColor: "text-amber-600",
    popular: false,
    stats: { rating: 4.8, reviews: 380 },
    size: "small" as const
  },
];

const getSizeClasses = (size: "small" | "medium" | "large") => {
  switch (size) {
    case "large":
      return "md:col-span-2 md:row-span-2";
    case "medium":
      return "md:col-span-1 md:row-span-1";
    case "small":
      return "md:col-span-1 md:row-span-1";
    default:
      return "";
  }
};

export const ServicesBentoSection = memo(function ServicesBentoSection() {
  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container">
        {/* Header */}
        <RevealOnScroll direction="up" className="text-center mb-12">
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Star className="w-4 h-4" />
            Unsere Services
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Alle Services aus{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              einer Hand
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Von der Planung bis zur Schlüsselübergabe – wir finden die passenden Partner für jeden Bedarf.
          </p>
        </RevealOnScroll>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className={getSizeClasses(service.size)}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <Link to={service.href} className="group block h-full">
                <motion.div 
                  className={`relative h-full rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30`}
                  whileHover={{ y: -5 }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Content */}
                  <div className="relative z-10 p-6 h-full flex flex-col">
                    {/* Popular Badge */}
                    {service.popular && (
                      <motion.div 
                        className="absolute top-4 right-4"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <BadgeWithIcon icon={<Star className="w-3 h-3 fill-current" />} variant="premium">
                          Beliebt
                        </BadgeWithIcon>
                      </motion.div>
                    )}
                    
                    {/* Icon */}
                    <motion.div 
                      className={`w-14 h-14 rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center mb-4 shadow-sm ${service.iconColor}`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <service.icon className="w-7 h-7" />
                    </motion.div>
                    
                    {/* Title & Description */}
                    <h3 className={`font-bold mb-2 group-hover:text-primary transition-colors ${service.size === "large" ? "text-2xl" : "text-lg"}`}>
                      {service.title}
                    </h3>
                    <p className={`text-muted-foreground mb-4 flex-grow ${service.size === "large" ? "text-base" : "text-sm"}`}>
                      {service.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-medium">{service.stats.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{service.stats.reviews} Bewertungen</span>
                      </div>
                    </div>
                    
                    {/* CTA */}
                    <span className="inline-flex items-center text-sm font-medium text-primary group-hover:underline">
                      Mehr erfahren
                      <AnimatedArrow direction="right" size={16} className="ml-1" />
                    </span>
                  </div>
                  
                  {/* Hover Glow */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  />
                </motion.div>
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
            <LiveDot color="green" size="sm" />
            <span>24 Firmen heute aktiv</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>Offerten in 24-48h</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});