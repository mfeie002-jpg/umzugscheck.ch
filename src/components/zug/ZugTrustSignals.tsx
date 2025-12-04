/**
 * Zug Trust Signals Component
 * #26-35: Enhanced trust indicators and certifications
 */

import { motion } from "framer-motion";
import { 
  Shield, Award, BadgeCheck, Lock, Star, 
  Users, Clock, Headphones, CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const trustBadges = [
  {
    icon: Shield,
    title: "Geprüfte Partner",
    description: "Alle Firmen durchlaufen unsere Qualitätsprüfung",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    icon: Lock,
    title: "Datenschutz",
    description: "Schweizer Hosting, DSGVO-konform",
    color: "text-green-500",
    bgColor: "bg-green-100",
  },
  {
    icon: Award,
    title: "Qualitätsgarantie",
    description: "Nur Firmen mit 4+ Sternen",
    color: "text-amber-500",
    bgColor: "bg-amber-100",
  },
  {
    icon: Headphones,
    title: "Support",
    description: "Persönliche Beratung Mo-Fr",
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
];

const certifications = [
  { name: "Swiss Made", icon: BadgeCheck },
  { name: "SSL Secured", icon: Lock },
  { name: "Verified Reviews", icon: CheckCircle2 },
];

const stats = [
  { value: "15'847+", label: "Umzüge begleitet", icon: Users },
  { value: "4.8/5", label: "Kundenzufriedenheit", icon: Star },
  { value: "<2h", label: "Ø Antwortzeit", icon: Clock },
];

export const ZugTrustSignals = () => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Main Trust Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {trustBadges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-xl p-4 sm:p-6 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl ${badge.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <badge.icon className={`w-6 h-6 ${badge.color}`} />
              </div>
              <h3 className="font-bold text-foreground mb-1">{badge.title}</h3>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-primary/5 rounded-2xl p-6 sm:p-8 mb-12"
        >
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certification Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          {certifications.map((cert, index) => (
            <Badge
              key={cert.name}
              variant="outline"
              className="px-4 py-2 text-sm bg-background"
            >
              <cert.icon className="w-4 h-4 mr-2 text-primary" />
              {cert.name}
            </Badge>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
