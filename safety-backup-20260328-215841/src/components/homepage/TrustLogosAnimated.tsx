import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, Award, CheckCircle, Star } from "lucide-react";

const trustItems = [
  { icon: Shield, text: "SSL verschlüsselt" },
  { icon: Award, text: "Geprüfte Partner" },
  { icon: CheckCircle, text: "100% Kostenlos" },
  { icon: Star, text: "Bestbewertet" },
];

export const TrustLogosAnimated = memo(function TrustLogosAnimated() {
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
      {trustItems.map((item, index) => (
        <motion.div
          key={item.text}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50 shadow-sm"
        >
          <item.icon className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium">{item.text}</span>
        </motion.div>
      ))}
    </div>
  );
});
