import { memo } from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, Clock, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Alternative conversion paths for users who prefer direct contact
 * Displays phone, WhatsApp, and email options
 */
export const AlternativeContactSection = memo(function AlternativeContactSection() {
  const phoneNumber = "+41 44 123 45 67";
  const whatsappNumber = "41441234567";
  const email = "info@umzugscheck.ch";

  const handlePhoneClick = () => {
    window.location.href = `tel:${phoneNumber.replace(/\s/g, '')}`;
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hallo, ich interessiere mich für eine Umzugsofferte.");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${email}?subject=Umzugsanfrage`;
  };

  return (
    <section className="py-8 md:py-12 bg-muted/30 border-y border-border/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1.5 mb-3">
            <Headphones className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Persönliche Beratung</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            Lieber persönlich?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Unser Team hilft Ihnen gerne direkt weiter – rufen Sie an oder schreiben Sie uns.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Button
              variant="outline"
              className="w-full h-auto py-4 px-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all"
              onClick={handlePhoneClick}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Anrufen</p>
                <p className="text-xs text-muted-foreground">{phoneNumber}</p>
              </div>
            </Button>
          </motion.div>

          {/* WhatsApp */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="outline"
              className="w-full h-auto py-4 px-4 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-500/30 transition-all"
              onClick={handleWhatsAppClick}
            >
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">WhatsApp</p>
                <p className="text-xs text-muted-foreground">Schnelle Antwort</p>
              </div>
            </Button>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              variant="outline"
              className="w-full h-auto py-4 px-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all"
              onClick={handleEmailClick}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">E-Mail</p>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
            </Button>
          </motion.div>
        </div>

        {/* Availability info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground"
        >
          <Clock className="w-4 h-4" />
          <span>Mo–Fr 08:00–18:00 | Sa 09:00–14:00</span>
        </motion.div>
      </div>
    </section>
  );
});
