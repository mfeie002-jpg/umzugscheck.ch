import { motion } from "framer-motion";
import { ThumbsUp, Star, Award } from "lucide-react";

const SatisfactionBadge = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="fixed bottom-24 right-4 z-30 md:bottom-8"
    >
      <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 rounded-full p-1 shadow-lg">
        <div className="bg-gradient-to-br from-amber-300 to-amber-400 rounded-full p-3 flex flex-col items-center">
          <Award className="w-6 h-6 mb-1" />
          <span className="text-xs font-bold">TOP</span>
          <span className="text-[10px]">2024</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SatisfactionBadge;
