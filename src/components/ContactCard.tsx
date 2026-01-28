import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  href: string;
  delay?: number;
}

const ContactCard = ({
  icon: Icon,
  title,
  value,
  href,
  delay = 0,
}: ContactCardProps) => {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="block p-6 rounded-xl bg-card border border-border shadow-soft hover:shadow-medium hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </motion.a>
  );
};

export default ContactCard;
