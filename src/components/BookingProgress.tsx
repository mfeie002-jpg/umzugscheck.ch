import { motion } from "framer-motion";
import { Users } from "lucide-react";

const BookingProgress = () => {
  const bookedSlots = 78;
  const totalSlots = 100;
  const percentage = (bookedSlots / totalSlots) * 100;

  return (
    <section className="py-6 bg-amber-50 dark:bg-amber-950/20 border-y border-amber-200 dark:border-amber-900/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Users className="w-5 h-5" />
              <span className="font-medium">Kapazität diesen Monat</span>
            </div>
            <span className="text-sm text-amber-600 dark:text-amber-400">
              Noch {totalSlots - bookedSlots} Termine frei
            </span>
          </div>
          <div className="h-3 bg-amber-200 dark:bg-amber-900/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${percentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            />
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 text-center">
            {bookedSlots}% der Termine bereits gebucht – Jetzt reservieren!
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingProgress;
