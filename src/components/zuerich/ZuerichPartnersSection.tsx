import { motion } from "framer-motion";

const partners = [
  { name: "SRF", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/SRF_Logo.svg/200px-SRF_Logo.svg.png" },
  { name: "20 Minuten", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/20_Minuten_Logo.svg/200px-20_Minuten_Logo.svg.png" },
  { name: "Blick", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Blick_Logo_2020.svg/200px-Blick_Logo_2020.svg.png" },
  { name: "NZZ", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/NZZ_logo.svg/200px-NZZ_logo.svg.png" },
  { name: "Watson", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Watson_Logo.svg/200px-Watson_Logo.svg.png" },
  { name: "Tages-Anzeiger", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Tages-Anzeiger_Logo.svg/200px-Tages-Anzeiger_Logo.svg.png" },
];

export const ZuerichPartnersSection = () => {
  return (
    <section className="py-10 border-y bg-muted/20">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-6">Bekannt aus & Partner von</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
            >
              <div className="h-8 flex items-center">
                <span className="text-lg font-semibold text-muted-foreground">{partner.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
