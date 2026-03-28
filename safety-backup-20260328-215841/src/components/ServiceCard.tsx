import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  image?: string;
  delay?: number;
}

const ServiceCard = ({
  icon: Icon,
  title,
  description,
  link,
  image,
  delay = 0,
}: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-soft hover:shadow-strong transition-all duration-500"
    >
      {/* Image */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative p-6">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-alpine flex items-center justify-center mb-4 shadow-lg"
        >
          <Icon className="w-7 h-7 text-primary-foreground" />
        </motion.div>

        <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>

        <Link
          to={link}
          className="inline-flex items-center text-primary font-medium group/link"
        >
          Mehr erfahren
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>

      {/* Hover gradient border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default ServiceCard;
