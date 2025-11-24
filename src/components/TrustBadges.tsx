import { Shield, Lock, Award, MapPin, Clock, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  {
    icon: Shield,
    title: "Geprüfte Firmen",
    description: "Alle Partner sind versichert und zertifiziert"
  },
  {
    icon: Lock,
    title: "Sichere Daten",
    description: "SSL-verschlüsselt & DSGVO-konform"
  },
  {
    icon: BadgeCheck,
    title: "Verifizierte Bewertungen",
    description: "Nur echte Kundenmeinungen"
  },
  {
    icon: MapPin,
    title: "Schweizweite Abdeckung",
    description: "Service in allen 26 Kantonen"
  },
  {
    icon: Clock,
    title: "Schnelle Offerten",
    description: "Angebote innerhalb 24 Stunden"
  },
  {
    icon: Award,
    title: "Beste Preise",
    description: "Sparen Sie bis zu 40%"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};

export const TrustBadges = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-subtle border-y border-border/50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Warum Umzugscheck.ch?
          </h2>
          <p className="text-lg text-muted-foreground">
            Transparent, sicher und kostenlos – Ihr vertrauensvoller Partner
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {badges.map((badge, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-card shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1 group"
              variants={itemVariants}
            >
              <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <badge.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h4 className="font-semibold text-sm mb-2">{badge.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{badge.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
