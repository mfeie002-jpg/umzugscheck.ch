import { motion } from "framer-motion";
import { CreditCard, Banknote, FileText, Wallet } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const methods = [
  { icon: CreditCard, name: "Kreditkarte", desc: "Visa, Mastercard" },
  { icon: Banknote, name: "Banküberweisung", desc: "IBAN/QR-Rechnung" },
  { icon: FileText, name: "Rechnung", desc: "30 Tage Zahlungsziel" },
  { icon: Wallet, name: "TWINT", desc: "Schweizer Mobile Payment" },
];

const PaymentMethods = () => {
  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Flexible Zahlungsmöglichkeiten
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {methods.map((method, index) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center">
                  <method.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{method.name}</p>
                  <p className="text-xs text-muted-foreground">{method.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PaymentMethods;
