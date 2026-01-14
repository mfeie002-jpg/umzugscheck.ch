import { memo } from "react";
import { motion } from "framer-motion";
import { MapPin, FileText, CheckCircle, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const STEPS = [
  {
    step: 1,
    icon: MapPin,
    title: "Umzugsdaten eingeben",
    description: "Geben Sie Start und Ziel ein – in weniger als 60 Sekunden.",
    color: "bg-primary",
  },
  {
    step: 2,
    icon: Video,
    title: "Video oder Details",
    description: "Optional: Zeigen Sie per Video Ihr Inventar für präzisere Offerten.",
    color: "bg-secondary",
  },
  {
    step: 3,
    icon: CheckCircle,
    title: "Vergleichen & Buchen",
    description: "Erhalten Sie bis zu 5 Offerten und wählen Sie die beste.",
    color: "bg-green-600",
  },
];

export const RegionHowItWorks = memo(() => {
  return (
    <section className="py-10 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            So funktioniert's
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            In 3 einfachen Schritten zu Ihrem perfekten Umzug
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-border" />

          {STEPS.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Step Number Circle */}
              <div className={`w-14 h-14 md:w-16 md:h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 relative z-10`}>
                <step.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>

              {/* Step Number Badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-6 h-6 bg-card border-2 border-border rounded-full flex items-center justify-center text-xs font-bold">
                {step.step}
              </div>

              {/* Content */}
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <Button size="lg" className="bg-secondary hover:bg-secondary/90" asChild>
            <Link to="/umzugsofferten">
              Jetzt starten
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

RegionHowItWorks.displayName = 'RegionHowItWorks';
