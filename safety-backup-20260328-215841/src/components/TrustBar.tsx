import { motion } from "framer-motion";
import { Shield, Star, Clock, Award, Heart, Truck, Users, ThumbsUp } from "lucide-react";

const TrustBar = () => {
  const badges = [
    { icon: Star, text: "5.0", subtext: "Google", color: "text-warm" },
    { icon: Shield, text: "100%", subtext: "Versichert", color: "text-alpine" },
    { icon: Heart, text: "40+", subtext: "Jahre", color: "text-warm" },
    { icon: Users, text: "5000+", subtext: "Umzüge", color: "text-forest" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="py-6 md:py-8 bg-muted/40 border-y border-border"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-center gap-3"
            >
              <div className={`p-2 rounded-lg bg-background shadow-soft ${badge.color}`}>
                <badge.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-lg leading-tight">{badge.text}</p>
                <p className="text-xs text-muted-foreground">{badge.subtext}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default TrustBar;
