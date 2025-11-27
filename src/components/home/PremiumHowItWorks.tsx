import { motion } from "framer-motion";
import { FileText, Sparkles, Check } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Ihre Anfrage – in 2 Minuten",
    description: "Geben Sie Ihre Umzugsdetails ein. Unser AI-System analysiert Ihren Bedarf präzise.",
  },
  {
    icon: Sparkles,
    title: "AI-Analyse & Matching – maßgeschneidert",
    description: "Intelligente Algorithmen finden die perfekten Umzugsfirmen für Ihre Anforderungen.",
  },
  {
    icon: Check,
    title: "Vergleichen & buchen – stressfrei",
    description: "Erhalten Sie transparente Angebote, vergleichen Sie Preise und wählen Sie die beste Firma.",
  },
];

export const PremiumHowItWorks = () => {
  return (
    <section className="section-spacing bg-white">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-premium-h2 lg:text-premium-h2-lg text-swiss-noir mb-4">
            So funktioniert es
          </h2>
          <p className="text-premium-body text-platinum max-w-2xl mx-auto">
            Drei einfache Schritte zu Ihrem perfekten Umzug
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="group"
              >
                <div className="bg-white rounded-3xl p-10 shadow-premium border border-border hover-lift">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-cream-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-copper" />
                  </div>

                  {/* Step Number */}
                  <div className="text-sm font-bold text-copper mb-3">
                    Schritt {index + 1}
                  </div>

                  {/* Title */}
                  <h3 className="text-premium-h3 text-swiss-noir mb-4">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-premium-small text-platinum leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};