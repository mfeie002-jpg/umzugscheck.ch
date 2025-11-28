import { ClipboardList, Mail, BarChart3, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: ClipboardList,
    number: "1",
    title: "Anfrage stellen",
    description: "Beschreiben Sie Ihren Umzug in 2 Minuten"
  },
  {
    icon: Mail,
    number: "2",
    title: "Offerten erhalten",
    description: "Bis zu 5 geprüfte Schweizer Umzugsfirmen melden sich"
  },
  {
    icon: CheckCircle,
    number: "3",
    title: "Vergleichen & sparen",
    description: "Bewertungen prüfen, Preise vergleichen, bis 40% sparen"
  }
];

export const RedesignHowItWorks = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900">
            So einfach funktioniert's
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            In 3 Schritten zum perfekten Umzug
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              <div className="text-center">
                <div className="relative inline-flex mb-6">
                  {/* Number Circle */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {step.number}
                  </div>
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-blue-600" />
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
              
              {/* Connector Arrow (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5">
                  <div className="w-full h-full bg-gradient-to-r from-blue-400 via-cyan-400 to-transparent" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-cyan-400 border-y-4 border-y-transparent" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mini CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a href="/rechner">
            <button className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-medium">
              Jetzt starten
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
