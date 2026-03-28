import { Star, Truck, Percent, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    icon: Star,
    value: "4.8/5",
    label: "Durchschnittliche Bewertung unserer Partnerfirmen",
  },
  {
    icon: Truck,
    value: "15'000+",
    label: "Umzüge bereits über unsere Plattform geprüft",
  },
  {
    icon: Percent,
    value: "Bis zu 40 %",
    label: "Ersparnis durch den Vergleich mehrerer Offerten",
  },
  {
    icon: ShieldCheck,
    value: "100 %",
    label: "Schweizer Qualität – seriöse Anbieter",
  },
];

const OffertenStats = () => {
  return (
    <section className="bg-muted/50 border-y border-border py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-manrope text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffertenStats;
