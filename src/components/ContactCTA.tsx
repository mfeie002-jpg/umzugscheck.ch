import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ContactCTA = () => {
  const contactMethods = [
    {
      icon: Phone,
      label: "Anrufen",
      value: "+41 76 568 13 02",
      href: "tel:+41765681302",
      color: "bg-primary",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat starten",
      href: "https://wa.me/41765681302",
      color: "bg-forest",
    },
    {
      icon: Mail,
      label: "E-Mail",
      value: "info@feierabend-umzuege.ch",
      href: "mailto:info@feierabend-umzuege.ch",
      color: "bg-alpine",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary/95 to-alpine relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full border border-white/10"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] rounded-full border border-white/10"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Bereit für Ihren Umzug?
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Kontaktieren Sie uns noch heute für eine kostenlose und unverbindliche Beratung.
          </p>
        </motion.div>

        {/* Contact methods */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-10">
          {contactMethods.map((method, index) => (
            <motion.a
              key={index}
              href={method.href}
              target={method.href.startsWith("http") ? "_blank" : undefined}
              rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="flex items-center gap-4 p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className={`p-3 rounded-lg ${method.color}`}>
                <method.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-white/70">{method.label}</p>
                <p className="font-semibold text-white">{method.value}</p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90 shadow-lg group"
          >
            <Link to="/contact">
              <Calendar className="w-5 h-5 mr-2" />
              Kostenlose Offerte anfragen
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <p className="text-sm text-white/70 mt-4">
            Antwort innerhalb von 24 Stunden garantiert
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;

