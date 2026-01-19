import { motion } from "framer-motion";

export const TrustRow = () => {
  const items = [
    {
      emoji: "⭐",
      label: "4.8 / 5",
      sublabel: "aus echten Kundenbewertungen"
    },
    {
      emoji: "🏆",
      label: "15'000+",
      sublabel: "vermittelte Umzüge"
    },
    {
      emoji: "✅",
      label: "100%",
      sublabel: "kostenlos & unverbindlich"
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
            {item.emoji}
          </div>
          <div>
            <div className="font-bold text-white text-lg">{item.label}</div>
            <div className="text-sm text-white/90">{item.sublabel}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
