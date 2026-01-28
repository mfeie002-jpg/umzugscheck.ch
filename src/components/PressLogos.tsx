import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const pressLogos = [
  { name: "20 Minuten", quote: "Top-Umzugsfirma" },
  { name: "NZZ", quote: "Empfohlen" },
  { name: "Tages-Anzeiger", quote: "Qualitätssieger" },
  { name: "Blick", quote: "Testsieger" },
  { name: "SRF", quote: "Bekannt aus" },
];

const PressLogos = () => {
  return (
    <section className="py-10 bg-background border-y border-border">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Bekannt aus Schweizer Medien
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {pressLogos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <span className="text-lg md:text-xl font-bold text-muted-foreground/60">
                  {logo.name}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{logo.quote}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PressLogos;
