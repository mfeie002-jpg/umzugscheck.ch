import { ClipboardList, Mail, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SmartCTAButton } from "@/components/conversion/SmartCTAButton";

const steps = [
  {
    number: "1",
    icon: ClipboardList,
    title: "Formular ausfüllen",
    description: "Geben Sie Start, Ziel, Wohnungsgrösse und Wunschtermin an – das dauert nur 2–3 Minuten.",
  },
  {
    number: "2",
    icon: Mail,
    title: "Offerten erhalten",
    description: "Sie erhalten mehrere Offerten von passenden Umzugsfirmen aus Ihrer Region.",
  },
  {
    number: "3",
    icon: CheckCircle,
    title: "Beste Firma wählen",
    description: "Vergleichen Sie Preis, Bewertungen und Leistungen – und wählen Sie die Firma, die am besten zu Ihnen passt.",
  },
];

const OffertenProcess = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-manrope text-3xl md:text-4xl font-bold text-foreground mb-4">
            So funktioniert der Offertenvergleich
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            In nur drei einfachen Schritten zu Ihrem perfekten Umzugspartner.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line - Desktop */}
          <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Number Circle */}
                <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="font-manrope text-3xl font-bold text-primary-foreground">
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-manrope text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>

                {/* Arrow - Mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-6">
                    <ArrowRight className="w-6 h-6 text-primary rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 max-w-md mx-auto"
          >
            <SmartCTAButton 
              to="/umzugsofferten" 
              location="offerten-process" 
              size="xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OffertenProcess;
