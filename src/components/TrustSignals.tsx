import { Shield, Users, Star, Award, CheckCircle2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    icon: Users,
    number: "12'000+",
    label: "Zufriedene Kunden",
    color: "text-primary",
    bgColor: "bg-primary-light"
  },
  {
    icon: Award,
    number: "200+",
    label: "Geprüfte Unternehmen",
    color: "text-accent",
    bgColor: "bg-accent-light"
  },
  {
    icon: Star,
    number: "4.8/5",
    label: "Ø Kundenbewertung",
    color: "text-success",
    bgColor: "bg-success-light"
  },
  {
    icon: Shield,
    number: "100%",
    label: "Kostenlos & sicher",
    color: "text-primary",
    bgColor: "bg-primary-light"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export const TrustSignals = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-subtle border-y border-border/50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="text-center group"
              variants={itemVariants}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl ${stat.bgColor} mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-medium`}>
                <stat.icon className={`w-8 h-8 md:w-10 md:h-10 ${stat.color} transition-transform duration-300 group-hover:scale-110`} />
              </div>
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
