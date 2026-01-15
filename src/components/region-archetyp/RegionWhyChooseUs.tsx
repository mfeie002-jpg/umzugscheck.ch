/**
 * GOLD STANDARD - Why Choose Us Section
 * "Darum umzugscheck.ch" - USPs with icons
 * ChatGPT recommendation: Highlight unique selling points
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Shield, CheckCircle, Clock, Users, 
  TrendingUp, Award, HeadphonesIcon, ThumbsUp 
} from "lucide-react";

interface USP {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const USPS: USP[] = [
  {
    icon: Shield,
    title: "Geprüfte Firmen",
    description: "Alle Partner sind verifiziert & versichert",
    color: "text-green-600"
  },
  {
    icon: TrendingUp,
    title: "Bis 40% sparen",
    description: "Durch Vergleich mehrerer Offerten",
    color: "text-blue-600"
  },
  {
    icon: Clock,
    title: "24h Antwort",
    description: "Schnelle Offerten von lokalen Firmen",
    color: "text-orange-600"
  },
  {
    icon: CheckCircle,
    title: "100% kostenlos",
    description: "Keine versteckten Gebühren",
    color: "text-emerald-600"
  },
  {
    icon: Users,
    title: "30'000+ Umzüge",
    description: "Erfolgreich vermittelt seit 2019",
    color: "text-violet-600"
  },
  {
    icon: Award,
    title: "Qualitätsgarantie",
    description: "Zufriedenheit oder Geld zurück",
    color: "text-yellow-600"
  },
  {
    icon: HeadphonesIcon,
    title: "Schweizer Support",
    description: "Persönliche Beratung auf Deutsch",
    color: "text-primary"
  },
  {
    icon: ThumbsUp,
    title: "4.8/5 Bewertung",
    description: "Kundenzufriedenheit bestätigt",
    color: "text-pink-600"
  },
];

interface RegionWhyChooseUsProps {
  regionName: string;
  variant?: 'canton' | 'city';
}

export const RegionWhyChooseUs = memo(({ regionName, variant = 'canton' }: RegionWhyChooseUsProps) => {
  const locationPrefix = variant === 'canton' ? 'im Kanton' : 'in';
  
  return (
    <section id="warum-wir" className="py-12 md:py-16 scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Warum umzugscheck.ch für Ihren Umzug {locationPrefix} {regionName}?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Seit über 5 Jahren helfen wir Schweizern, den perfekten Umzugspartner zu finden.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {USPS.map((usp, index) => (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-4 md:p-5 text-center hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-muted/50`}>
                <usp.icon className={`w-6 h-6 ${usp.color}`} />
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-1">
                {usp.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {usp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

RegionWhyChooseUs.displayName = 'RegionWhyChooseUs';
