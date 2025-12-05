import { motion } from "framer-motion";

const partners = [
  { name: "TCS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/TCS_Logo.svg/200px-TCS_Logo.svg.png" },
  { name: "ASTAG", logo: "https://www.astag.ch/fileadmin/user_upload/astag-logo.svg" },
  { name: "20 Minuten", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/20_Minuten_Logo.svg/200px-20_Minuten_Logo.svg.png" },
  { name: "Blick", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Blick_Logo.svg/200px-Blick_Logo.svg.png" },
  { name: "SRF", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/SRF_Logo.svg/200px-SRF_Logo.svg.png" },
  { name: "Handelszeitung", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Handelszeitung_logo.svg/200px-Handelszeitung_logo.svg.png" },
];

export const PartnerLogos = () => {
  return (
    <section className="py-8 md:py-12 border-b border-border bg-muted/20">
      <div className="container">
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground font-medium">
            Bekannt aus & geprüft von
          </p>
        </div>
        
        {/* Desktop: Static Grid */}
        <div className="hidden md:flex items-center justify-center gap-8 lg:gap-12">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <div className="h-8 flex items-center justify-center">
                <span className="text-lg font-bold text-muted-foreground/80">{partner.name}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Scrolling Carousel */}
        <div className="md:hidden overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={{ x: [0, -600] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 grayscale opacity-60"
              >
                <div className="h-6 flex items-center justify-center min-w-[100px]">
                  <span className="text-sm font-bold text-muted-foreground/80 whitespace-nowrap">{partner.name}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
