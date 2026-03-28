import { ClipboardList, Mail, BarChart3, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: ClipboardList,
    number: "1",
    title: "Anfrage ausfüllen",
    description: "Beschreiben Sie Ihren Umzug in 2 Minuten"
  },
  {
    icon: Mail,
    number: "2",
    title: "Offerten erhalten & vergleichen",
    description: "Sie erhalten mehrere Angebote von geprüften Umzugsfirmen"
  },
  {
    icon: CheckCircle,
    number: "3",
    title: "Beste Umzugsfirma wählen",
    description: "Vergleichen Sie Preise und Bewertungen und treffen Sie Ihre Wahl"
  }
];

export const RedesignHowItWorks = () => {
  return (
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 text-slate-900">
            So einfach funktioniert's
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto">
            In 3 Schritten zum perfekten Umzug
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 md:gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative text-center"
            >
              {/* Step Number */}
              <div className="relative inline-flex mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-primary text-white flex items-center justify-center text-lg md:text-2xl font-bold shadow-lg">
                  {step.number}
                </div>
              </div>
              
              {/* Icon */}
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2 md:mb-3">
                <step.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              
              {/* Content */}
              <h3 className="text-xs md:text-lg font-bold mb-1 text-slate-900 leading-tight">{step.title}</h3>
              <p className="text-[10px] md:text-sm text-slate-500 leading-relaxed hidden md:block">{step.description}</p>
              
              {/* Connection Line - Desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/40 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-10"
        >
          <Link to="/umzugsrechner">
            <button className="px-6 md:px-8 py-2.5 md:py-3 bg-primary text-white rounded-xl font-bold text-sm md:text-base hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl">
              Jetzt starten
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
