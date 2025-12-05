import { motion } from "framer-motion";

const partners = [
  { name: "Swisscom", logo: "🔵" },
  { name: "SBB", logo: "🔴" },
  { name: "Post", logo: "📬" },
  { name: "Migros", logo: "🟠" },
  { name: "TCS", logo: "🟡" },
  { name: "ASTAG", logo: "⚪" },
];

export const PremiumPartnerBadges = () => {
  return (
    <section className="py-12 bg-muted/30 border-y">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">
            Bekannt aus & Partner von
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-2xl">{partner.logo}</span>
              <span className="font-medium">{partner.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
