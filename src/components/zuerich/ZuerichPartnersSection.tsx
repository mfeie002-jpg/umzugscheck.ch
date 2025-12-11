import { motion } from "framer-motion";

const partners = ["SRF", "20 Minuten", "Blick", "NZZ", "Watson", "Tages-Anzeiger"];

export const ZuerichPartnersSection = () => {
  return (
    <section className="py-10 border-y bg-muted/20">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-6">Bekannt aus & Partner von</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="opacity-60 hover:opacity-100 transition-all"
            >
              <span className="text-lg font-semibold text-muted-foreground">{name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
