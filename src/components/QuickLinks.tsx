import { motion } from "framer-motion";
import { Calculator, FileText, Phone, Calendar, MapPin, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { trackCtaClick } from "@/hooks/useCtaTracking";

const links = [
  { icon: Calculator, label: "Kostenrechner", href: "/calculator" },
  { icon: FileText, label: "Offerte", href: "/contact" },
  { icon: Phone, label: "Anrufen", href: "tel:+41765681302" },
  { icon: Calendar, label: "Termin", href: "/booking" },
  { icon: MapPin, label: "Regionen", href: "/map" },
  { icon: HelpCircle, label: "FAQ", href: "/faq" },
];

const QuickLinks = () => {
  return (
    <section className="py-6 bg-muted/50 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {links.map((link, index) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={link.href}
                className="inline-flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-sm font-medium text-foreground"
                onClick={() => trackCtaClick(link.label, 'quick_links')}
              >
                <link.icon className="w-4 h-4 text-primary" />
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
