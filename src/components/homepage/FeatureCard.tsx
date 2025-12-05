import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight?: boolean;
}

export const FeatureCard = ({ icon: Icon, title, description, highlight }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={`p-6 rounded-2xl border transition-all ${
        highlight
          ? "bg-primary text-primary-foreground border-primary shadow-lg"
          : "bg-card border-border hover:border-primary/30 hover:shadow-lg"
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
        highlight ? "bg-white/20" : "bg-primary/10"
      }`}>
        <Icon className={`h-6 w-6 ${highlight ? "text-white" : "text-primary"}`} />
      </div>
      <h3 className={`font-bold text-lg mb-2 ${highlight ? "text-white" : "text-foreground"}`}>
        {title}
      </h3>
      <p className={`text-sm ${highlight ? "text-white/80" : "text-muted-foreground"}`}>
        {description}
      </p>
    </motion.div>
  );
};
